# api/routes/vakri_routes.py
from fastapi import APIRouter, Query
from datetime import datetime, timedelta
import swisseph as swe
from astronomy.julian import datetime_to_julian

router = APIRouter()

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

PLANET_MAP = {
    "Saturn": swe.SATURN,
    "Jupiter": swe.JUPITER,
    "Mars": swe.MARS,
    "Venus": swe.VENUS,
    "Mercury": swe.MERCURY
}

@router.get("/api/vakri-yearly-explorer")
def get_yearly_vakri_events(year: int = Query(2026, ge=1, le=3000)):
    """
    Computes exact astronomical Retrograde (Vakri) start dates, end dates,
    durations, and Zodiac signs using Swiss Ephemeris.
    """
    results = []

    for planet_name, planet_id in PLANET_MAP.items():
        # Scan year day-by-day (plus 20 days overlap for spans crossing year boundaries)
        start_dt = datetime(year, 1, 1)
        end_dt = datetime(year + 1, 1, 20)

        curr_dt = start_dt
        in_retrograde = False
        retro_start = None
        retro_sign = None

        while curr_dt <= end_dt:
            jd = datetime_to_julian(curr_dt)
            # Fetch sidereal position & speed (using Lahiri ayanamsha)
            swe.set_sid_mode(swe.SIDM_LAHIRI)
            flags = swe.FLG_SWIEPH | swe.FLG_SPEED | swe.FLG_SIDEREAL
            res, _ = swe.calc_ut(jd, planet_id, flags)

            lon = res[0]
            speed = res[3]
            is_retro = speed < 0

            sign_idx = int(lon // 30) % 12
            curr_sign = SIGNS[sign_idx]

            if is_retro and not in_retrograde:
                in_retrograde = True
                retro_start = curr_dt
                retro_sign = curr_sign
            elif not is_retro and in_retrograde:
                in_retrograde = False
                retro_end = curr_dt
                
                # Include if event starts or touches requested year
                if retro_start.year == year or retro_end.year == year:
                    duration = (retro_end - retro_start).days
                    results.append({
                        "planet": planet_name,
                        "startDate": retro_start.strftime("%b %d, %Y"),
                        "expiryDate": retro_end.strftime("%b %d, %Y"),
                        "durationDays": duration,
                        "sign": retro_sign,
                        "startMs": int(retro_start.timestamp() * 1000),
                        "endMs": int(retro_end.timestamp() * 1000)
                    })

            curr_dt += timedelta(days=1)

    return {
        "year": year,
        "events": results
    }

COMBUSTION_THRESHOLDS = {
    "Mars": 17.0,
    "Mercury": 14.0, # 12.0 if retrograde
    "Jupiter": 11.0,
    "Venus": 10.0,   # 8.0 if retrograde
    "Saturn": 15.0,
    "Moon": 12.0
}

@router.post("/api/calculate-asth-uday")
def calculate_asth_uday_backend(payload: dict):
    """
    Backend Python engine for calculating Asth (Combust) vs Uday (Risen) status
    based on Surya Siddhanta principles and exact geocentric ecliptic longitudes.
    """
    transit_positions = payload.get("transitPositions", {})
    sun_data = transit_positions.get("Sun", {})
    sun_lon = sun_data.get("sidereal", {}).get("lon", sun_data.get("lon", 0.0))

    planets_to_analyze = ["Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
    results = []

    for planet in planets_to_analyze:
        p_data = transit_positions.get(planet, {})
        planet_lon = p_data.get("sidereal", {}).get("lon", p_data.get("lon", 0.0))
        is_retro = p_data.get("is_retrograde") or p_data.get("sidereal", {}).get("is_retrograde", False)

        sign_idx = int(planet_lon // 30) % 12
        sign_name = SIGNS[sign_idx]

        raw_diff = abs(planet_lon - sun_lon) % 360.0
        angular_dist = min(raw_diff, 360.0 - raw_diff)

        threshold = COMBUSTION_THRESHOLDS.get(planet)
        if planet == "Mercury" and is_retro:
            threshold = 12.0
        elif planet == "Venus" and is_retro:
            threshold = 8.0

        is_asth = False
        status_text = "Uday (Risen / उदय ✨)"
        status_color = "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold"

        if planet in ["Rahu", "Ketu"]:
            status_text = "Shadow Node (N/A)"
            status_color = "bg-slate-100 text-slate-700 border-slate-300"
        elif threshold is not None and angular_dist <= threshold:
            is_asth = True
            status_text = "Asth (Combust / अस्तागत 💥)"
            status_color = "bg-rose-100 text-rose-900 border-rose-300 font-extrabold"

        results.append({
            "planet": planet,
            "signName": sign_name,
            "planetDegree": f"{planet_lon % 30:.2f}",
            "angularDistance": f"{angular_dist:.2f}",
            "threshold": f"{threshold}°" if threshold else "N/A",
            "isRetro": is_retro,
            "isAsth": is_asth,
            "statusText": status_text,
            "statusColor": status_color
        })

    sun_sign = SIGNS[int(sun_lon // 30) % 12]
    sun_degree = f"{sun_lon % 30:.2f}"

    return {
        "sunSign": sun_sign,
        "sunDegree": sun_degree,
        "results": results
    }

RASHI_META = [
    {"english": "Aries", "sanskrit": "Mesha (मेष)", "symbol": "♈", "rashiNumber": 1},
    {"english": "Taurus", "sanskrit": "Vrishabha (वृषभ)", "symbol": "♉", "rashiNumber": 2},
    {"english": "Gemini", "sanskrit": "Mithuna (मिथुन)", "symbol": "♊", "rashiNumber": 3},
    {"english": "Cancer", "sanskrit": "Karka (कर्क)", "symbol": "♋", "rashiNumber": 4},
    {"english": "Leo", "sanskrit": "Simha (सिंह)", "symbol": "♌", "rashiNumber": 5},
    {"english": "Virgo", "sanskrit": "Kanya (कन्या)", "symbol": "♍", "rashiNumber": 6},
    {"english": "Libra", "sanskrit": "Tula (तुला)", "symbol": "♎", "rashiNumber": 7},
    {"english": "Scorpio", "sanskrit": "Vrishchika (वृश्चिक)", "symbol": "♏", "rashiNumber": 8},
    {"english": "Sagittarius", "sanskrit": "Dhanu (धनु)", "symbol": "♐", "rashiNumber": 9},
    {"english": "Capricorn", "sanskrit": "Makara (मकर)", "symbol": "♑", "rashiNumber": 10},
    {"english": "Aquarius", "sanskrit": "Kumbha (कुंभ)", "symbol": "♒", "rashiNumber": 11},
    {"english": "Pisces", "sanskrit": "Meena (मीन)", "symbol": "♓", "rashiNumber": 12}
]

ALL_PLANET_IDS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mercury": swe.MERCURY,
    "Venus": swe.VENUS,
    "Mars": swe.MARS,
    "Jupiter": swe.JUPITER,
    "Saturn": swe.SATURN,
    "Rahu": swe.MEAN_NODE,
    "Ketu": swe.MEAN_NODE
}

@router.get("/api/planetary-rashi-transit-timeline")
def get_rashi_transit_timeline(planet: str = Query("Mercury"), year: int = Query(2026, ge=1, le=3000)):
    """
    Computes exact chronological Zodiac Sign Transits (Rashi Gochar Calendar)
    for a planet in a given year using Swiss Ephemeris.
    """
    planet_id = ALL_PLANET_IDS.get(planet, swe.MERCURY)

    start_dt = datetime(year, 1, 1)
    end_dt = datetime(year + 1, 1, 10)
    now_dt = datetime.now()

    def get_sign_idx(dt):
        jd = datetime_to_julian(dt)
        swe.set_sid_mode(swe.SIDM_LAHIRI)
        flags = swe.FLG_SWIEPH | swe.FLG_SPEED | swe.FLG_SIDEREAL
        res, _ = swe.calc_ut(jd, planet_id, flags)
        lon = res[0]
        if planet == "Ketu":
            lon = (lon + 180.0) % 360.0
        return int(lon // 30) % 12, lon

    raw_ingress_events = []
    
    # Step through the year in 6-hour increments to catch all sign ingress boundaries
    curr_dt = start_dt
    prev_sign_idx, _ = get_sign_idx(curr_dt)

    while curr_dt <= end_dt:
        sign_idx, _ = get_sign_idx(curr_dt)

        if sign_idx != prev_sign_idx:
            # Binary search for exact minute of ingress
            low = curr_dt - timedelta(hours=6)
            high = curr_dt
            exact_dt = curr_dt

            for _ in range(12): # ~1 minute precision
                mid = low + (high - low) / 2
                s_idx, _ = get_sign_idx(mid)
                if s_idx != prev_sign_idx:
                    exact_dt = mid
                    high = mid
                else:
                    low = mid

            if exact_dt.year == year:
                meta = RASHI_META[sign_idx]
                formatted_time = exact_dt.strftime("%B %d, %Y, %A at %I:%M %p")
                
                raw_ingress_events.append({
                    "sign": meta["sanskrit"],
                    "symbol": meta["symbol"],
                    "englishSign": meta["english"],
                    "rashiNumber": meta["rashiNumber"],
                    "dateStr": formatted_time,
                    "dt": exact_dt
                })

            prev_sign_idx = sign_idx

        curr_dt += timedelta(hours=6)

    # If no ingress events occurred within this entire year (e.g. slow planet like Saturn staying in 1 sign),
    # record initial presence at Jan 01
    transits = []
    if len(raw_ingress_events) == 0:
        meta_start = RASHI_META[prev_sign_idx]
        transits.append({
            "step": 1,
            "sign": meta_start["sanskrit"],
            "symbol": meta_start["symbol"],
            "englishSign": meta_start["english"],
            "rashiNumber": meta_start["rashiNumber"],
            "dateStr": f"{start_dt.strftime('%B %d, %Y, %A at %I:%M %p')}",
            "dt": start_dt
        })
    else:
        for idx, ev in enumerate(raw_ingress_events):
            ev["step"] = idx + 1
            transits.append(ev)

    # Determine active transit card index (ONLY highlighted if requested year is current year)
    active_idx = -1
    if year == now_dt.year:
        for i in range(len(transits)):
            t_dt = transits[i]["dt"]
            next_dt = transits[i+1]["dt"] if i + 1 < len(transits) else datetime(year + 1, 1, 1)
            if t_dt <= now_dt < next_dt:
                active_idx = i
                break
        if active_idx == -1 and len(transits) > 0 and now_dt >= transits[-1]["dt"]:
            active_idx = len(transits) - 1

    # Format JSON payload & cleanup datetime objects
    for i, t in enumerate(transits):
        t["isActive"] = (i == active_idx)
        del t["dt"]

    return {
        "planet": planet,
        "year": year,
        "activeStep": active_idx + 1 if active_idx != -1 else None,
        "transits": transits
    }

RETROGRADE_BENEFIT_SIGN_BACKEND_DB = {
    "Saturn": {
        "benefitedSigns": [
            {"sign": "Capricorn (मकर)", "reason": "Swakshetra (Own Sign) – Provides stability, discipline & karmic rewards."},
            {"sign": "Aquarius (कुंभ)", "reason": "Moolatrikona (Own Sign) – High executive power & financial endurance."},
            {"sign": "Libra (तुला)", "reason": "Uchha Rashi (Exaltation) – Justice, career elevation & public recognition."},
            {"sign": "Taurus (वृषभ) & Gemini (मिथुन)", "reason": "Mitra Rashi (Friendly Signs) – Upachaya house gains."}
        ],
        "challengedSigns": [
            {"sign": "Aries (मेष)", "reason": "Neecha Rashi (Debilitation) – Extreme delays, physical fatigue & frustration."},
            {"sign": "Leo (सिंह) & Cancer (कर्क)", "reason": "Shatru Rashi (Enemy Signs) – Heavy emotional stress & workplace friction."}
        ]
    },
    "Jupiter": {
        "benefitedSigns": [
            {"sign": "Sagittarius (धनु)", "reason": "Swakshetra (Own Sign) – Wisdom, luck, higher learning & spiritual grace."},
            {"sign": "Pisces (मीन)", "reason": "Swakshetra (Own Sign) – Financial recovery, peace & mentor support."},
            {"sign": "Cancer (कर्क)", "reason": "Uchha Rashi (Exaltation) – Family happiness, wealth & emotional fulfillment."},
            {"sign": "Aries (मेष) & Scorpio (वृश्चिक)", "reason": "Mitra Rashi – Auspicious 5th/9th house trine blessings."}
        ],
        "challengedSigns": [
            {"sign": "Capricorn (मकर)", "reason": "Neecha Rashi (Debilitation) – Misjudgment in investments & health neglect."},
            {"sign": "Gemini (मिथुन) & Virgo (कन्या)", "reason": "Shatru Rashi – Overthinking & intellectual fatigue."}
        ]
    },
    "Mars": {
        "benefitedSigns": [
            {"sign": "Aries (मेष) & Scorpio (वृश्चिक)", "reason": "Swakshetra (Own Signs) – High energy, courage & physical strength."},
            {"sign": "Capricorn (मकर)", "reason": "Uchha Rashi (Exaltation) – Victory in competitions & property/land gains."}
        ],
        "challengedSigns": [
            {"sign": "Cancer (कर्क)", "reason": "Neecha Rashi (Debilitation) – Restlessness, rash decisions & minor injuries."},
            {"sign": "Gemini (मिथुन) & Virgo (कन्या)", "reason": "Shatru Rashi – Arguments & impatience in partnerships."}
        ]
    },
    "Venus": {
        "benefitedSigns": [
            {"sign": "Taurus (वृषभ) & Libra (तुला)", "reason": "Swakshetra (Own Signs) – Relationship harmony, creative luxury & wealth."},
            {"sign": "Pisces (मीन)", "reason": "Uchha Rashi (Exaltation) – Spiritual love, sudden luck & artistic breakthroughs."}
        ],
        "challengedSigns": [
            {"sign": "Virgo (कन्या)", "reason": "Neecha Rashi (Debilitation) – Relationship friction & financial overspending."}
        ]
    },
    "Mercury": {
        "benefitedSigns": [
            {"sign": "Gemini (मिथुन)", "reason": "Swakshetra (Own Sign) – Analytical clarity & business contract success."},
            {"sign": "Virgo (कन्या)", "reason": "Uchha Rashi (Exaltation) – Financial acumen & strategic intelligence."}
        ],
        "challengedSigns": [
            {"sign": "Pisces (मीन)", "reason": "Neecha Rashi (Debilitation) – Communication errors & electronic glitches."}
        ]
    }
}

@router.get("/api/vakri-benefited-challenged-signs")
def get_vakri_benefited_challenged_signs(planet: str = Query("Saturn"), year: int = Query(2026, ge=1, le=3000)):
    """
    Returns year-specific Swiss Ephemeris & Parashara Vedic calculations for
    Benefited (शुभ) vs Challenged (अशुभ) Zodiac Signs for a planet in a target year.
    """
    planet_id = ALL_PLANET_IDS.get(planet, swe.SATURN)
    mid_dt = datetime(year, 6, 15)
    jd = datetime_to_julian(mid_dt)
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    flags = swe.FLG_SWIEPH | swe.FLG_SPEED | swe.FLG_SIDEREAL
    res, _ = swe.calc_ut(jd, planet_id, flags)
    lon = res[0]
    if planet == "Ketu":
        lon = (lon + 180.0) % 360.0
    
    transit_sign_idx = int(lon // 30) % 12
    transit_meta = RASHI_META[transit_sign_idx]
    
    base_data = RETROGRADE_BENEFIT_SIGN_BACKEND_DB.get(planet, RETROGRADE_BENEFIT_SIGN_BACKEND_DB["Saturn"])
    
    benefited_lagnas = []
    challenged_lagnas = []
    neutral_lagnas = []
    
    for lagna_idx in range(12):
        house_num = ((transit_sign_idx - lagna_idx + 12) % 12) + 1
        l_meta = RASHI_META[lagna_idx]
        l_name = f"{l_meta['sanskrit']}"
        
        is_benefic = planet in ["Jupiter", "Venus", "Mercury"]
        
        if is_benefic:
            if house_num in [1, 2, 4, 5, 7, 9, 11]:
                benefited_lagnas.append({
                    "sign": l_name,
                    "reason": f"Transiting House {house_num} in Year {year} ({transit_meta['sanskrit']}) – Auspicious for growth, fortunes & peace."
                })
            elif house_num in [6, 8, 12]:
                challenged_lagnas.append({
                    "sign": l_name,
                    "reason": f"Transiting House {house_num} (Trik Bhava) in Year {year} – Exercise caution in health, disputes & expenses."
                })
            else:
                neutral_lagnas.append({
                    "sign": l_name,
                    "reason": f"Transiting House {house_num} in Year {year} ({transit_meta['sanskrit']}) – Balanced / neutral results requiring steady effort."
                })
        else: # Saturn / Mars (Malefic)
            if house_num in [3, 6, 11]:
                benefited_lagnas.append({
                    "sign": l_name,
                    "reason": f"Transiting House {house_num} (Upachaya Bhava) in Year {year} – Strong victory over enemies, debts & major gains."
                })
            elif house_num in [1, 4, 8, 12]:
                challenged_lagnas.append({
                    "sign": l_name,
                    "reason": f"Transiting House {house_num} in Year {year} – High workload, delays or health caution."
                })
            else:
                neutral_lagnas.append({
                    "sign": l_name,
                    "reason": f"Transiting House {house_num} in Year {year} ({transit_meta['sanskrit']}) – Neutral / mixed results with moderate career & financial stability."
                })

    return {
        "planet": planet,
        "year": year,
        "transitSign": transit_meta["sanskrit"],
        "benefitedSigns": benefited_lagnas,
        "challengedSigns": challenged_lagnas,
        "neutralSigns": neutral_lagnas,
        "rule": f"In Year {year}, {planet} is transiting in {transit_meta['sanskrit']} Rashi ({transit_meta['english']}). Signs are classified into Benefited (Upachaya/Trines), Challenged (Trik/Kendra friction), and Neutral (balanced transits)."
    }
