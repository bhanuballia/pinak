from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, List
import datetime
import math

from astronomy.julian import datetime_to_julian
from astronomy.ascendant import get_house_cusps
from charts.rashi_chart import build_rashi_chart
from core.utils import ZODIAC_SIGNS, get_sign_index
from panchang.nakshatra import compute_nakshatra_from_lon, NAKSHATRAS

router = APIRouter()

# ---------------------------------------------------------
# KP ASTROLOGY CONSTANTS & MATHEMATICS
# ---------------------------------------------------------

KP_LORD_SEQUENCE = [
    "Ketu",
    "Venus",
    "Sun",
    "Moon",
    "Mars",
    "Rahu",
    "Jupiter",
    "Saturn",
    "Mercury"
]

DASHA_YEARS = {
    "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7,
    "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17
}

SIGN_LORDS = [
    "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", 
    "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
]

TOTAL_YEARS = 120
NAKSHATRA_DEG = 13.333333333333

def get_kp_lords(longitude: float) -> Dict[str, str]:
    """Calculates Sign Lord, Star (Nakshatra) Lord, Sub Lord, Sub-Sub Lord, Sookshma, Praana, and Deha Lords for a given degree."""
    
    # 1. Sign Lord
    sign_idx = get_sign_index(longitude)
    sign_lord = SIGN_LORDS[sign_idx]
    
    # 2. Star Lord (Nakshatra Lord)
    nak_info = compute_nakshatra_from_lon(longitude)
    nak_idx = nak_info["nakshatra_index"]
    star_lord = KP_LORD_SEQUENCE[nak_idx % 9]
    
    degrees_inside_nak = nak_info["degrees_completed"]
    current_idx = nak_idx % 9
    current_span = NAKSHATRA_DEG
    deg_rem = degrees_inside_nak
    
    sub_lords = []
    # We need 5 levels: Sub, Sub-Sub, Sookshma, Praana, Deha
    for _ in range(5):
        found_lord = ""
        cumulative = 0.0
        for i in range(9):
            lord_idx = (current_idx + i) % 9
            lord = KP_LORD_SEQUENCE[lord_idx]
            portion = (DASHA_YEARS[lord] / TOTAL_YEARS) * current_span
            
            # Use small epsilon for float precision issues
            if cumulative + portion >= deg_rem - 1e-9:
                found_lord = lord
                current_idx = lord_idx
                deg_rem -= cumulative
                current_span = portion
                break
            cumulative += portion
            
        sub_lords.append(found_lord or KP_LORD_SEQUENCE[-1])

    return {
        "sign_lord": sign_lord,
        "star_lord": star_lord,
        "sub_lord": sub_lords[0],
        "sub_sub_lord": sub_lords[1],
        "sookshma_lord": sub_lords[2],
        "praana_lord": sub_lords[3],
        "deha_lord": sub_lords[4],
        "nak_name": nak_info["nakshatra_name"]
    }

# ---------------------------------------------------------
# API ROUTE
# ---------------------------------------------------------

@router.post("/calculate")
def calculate_kp_chart(payload: Dict[str, Any] = Body(...)):
    try:
        date = payload.get("date") or payload.get("birth_date")
        time = payload.get("time") or payload.get("birth_time")
        lat = float(payload["lat"])
        lon = float(payload["lon"])
        tz_offset = float(payload.get("tz_offset", 0.0))
        horary_number = payload.get("horary_number")
        
        y, m, d = [int(x) for x in date.split("-")]
        tp = [int(x) for x in time.split(":")]
        dt_local = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
        dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
        jd_ut = datetime_to_julian(dt_utc)
        
        target_asc = None
        if horary_number:
            try:
                h_num = int(horary_number)
                if 1 <= h_num <= 249:
                    from core.astrology.generate_249 import get_249
                    # Generate or import 249 table. Since it's fast, we can just call it or import it.
                    # We wrote it to generate_249.py in the previous step.
                    import sys, os
                    sys.path.append(os.path.join(os.path.dirname(__file__), '../../core/astrology'))
                    try:
                        from generate_249 import KP_249_TABLE
                    except ImportError:
                        from core.astrology.generate_249 import KP_249_TABLE
                    
                    target_asc = next((item['start_deg'] for item in KP_249_TABLE if item['num'] == h_num), None)
            except Exception as e:
                print(f"[API WARN] Failed to process horary number: {e}")

        # 1. Get Placidus House Cusps
        if target_asc is not None:
            jd_ut_cusps = jd_ut
            for _ in range(15):
                curr_asc = get_house_cusps(jd_ut_cusps, lat, lon, house_system="P")["ascendant_deg"]
                diff = (target_asc - curr_asc + 180) % 360 - 180
                if abs(diff) < 0.00001:
                    break
                jd_ut_cusps += (diff / 360.0) * 0.99726958
            house_data = get_house_cusps(jd_ut_cusps, lat, lon, house_system="P")
        else:
            house_data = get_house_cusps(jd_ut, lat, lon, house_system="P")
            
        cusps = house_data["cusps"]
        
        # 2. Get Standard Rashi Chart for Planet positions (uses original jd_ut)
        chart = build_rashi_chart(jd_ut, lat, lon)
        planets_data = chart.get("planet_positions", {})
        
        # Build Planets Array
        kp_planets = []
        for p_name, p_data in planets_data.items():
            if p_name == "Ascendant": continue
            p_lon = p_data["sidereal"]["lon"]
            
            lords = get_kp_lords(p_lon)
            
            short_name = p_name[:2]
            if p_name in ["Sun", "Moon", "Mars"]:
                short_name = p_name[:2]
                
            kp_planets.append({
                "planet": p_name,
                "short_name": short_name,
                "longitude": p_lon,
                "sign_name": ZODIAC_SIGNS[get_sign_index(p_lon)],
                "nak_name": lords["nak_name"],
                "sign_lord": lords["sign_lord"],
                "star_lord": lords["star_lord"],
                "sub_lord": lords["sub_lord"],
                "sub_sub_lord": lords["sub_sub_lord"],
                "sookshma_lord": lords["sookshma_lord"],
                "praana_lord": lords["praana_lord"],
                "deha_lord": lords["deha_lord"]
            })
            
        # Add Ascendant to planets list (often used in KP as a node)
        asc_lon = house_data["ascendant_deg"]
        asc_lords = get_kp_lords(asc_lon)
        kp_planets.append({
            "planet": "Ascendant",
            "short_name": "As",
            "longitude": asc_lon,
            "sign_name": ZODIAC_SIGNS[get_sign_index(asc_lon)],
            "nak_name": asc_lords["nak_name"],
            "sign_lord": asc_lords["sign_lord"],
            "star_lord": asc_lords["star_lord"],
            "sub_lord": asc_lords["sub_lord"],
            "sub_sub_lord": asc_lords["sub_sub_lord"],
            "sookshma_lord": asc_lords["sookshma_lord"],
            "praana_lord": asc_lords["praana_lord"],
            "deha_lord": asc_lords["deha_lord"]
        })

        # Add Uranus, Neptune, Pluto
        import swisseph as swe
        from astronomy.positions import get_sidereal_position
        for p_name, pid in [("Uranus", swe.URANUS), ("Neptune", swe.NEPTUNE), ("Pluto", swe.PLUTO)]:
            try:
                p_data = get_sidereal_position(jd_ut, pid)
                p_lon = p_data["lon"]
                lords = get_kp_lords(p_lon)
                kp_planets.append({
                    "planet": p_name,
                    "short_name": p_name[:2],
                    "longitude": p_lon,
                    "sign_name": ZODIAC_SIGNS[get_sign_index(p_lon)],
                    "nak_name": lords["nak_name"],
                    "sign_lord": lords["sign_lord"],
                    "star_lord": lords["star_lord"],
                    "sub_lord": lords["sub_lord"],
                    "sub_sub_lord": lords["sub_sub_lord"],
                    "sookshma_lord": lords["sookshma_lord"],
                    "praana_lord": lords["praana_lord"],
                    "deha_lord": lords["deha_lord"]
                })
            except Exception as e:
                print(f"[API WARN] Failed to add outer planet {p_name} to KP chart: {e}")

        # Build Cusps Array
        kp_cusps = []
        for i in range(1, 13):
            c_lon = cusps[i]
            lords = get_kp_lords(c_lon)
            kp_cusps.append({
                "house": i,
                "longitude": c_lon,
                "sign_name": ZODIAC_SIGNS[get_sign_index(c_lon)],
                "nak_name": lords["nak_name"],
                "sign_lord": lords["sign_lord"],
                "star_lord": lords["star_lord"],
                "sub_lord": lords["sub_lord"],
                "sub_sub_lord": lords["sub_sub_lord"],
                "sookshma_lord": lords["sookshma_lord"],
                "praana_lord": lords["praana_lord"],
                "deha_lord": lords["deha_lord"]
            })
            
        # Determine KP Significators (Simplified Occupants and Owners logic)
        # In KP, a planet occupies a house if its longitude falls between the cusp and the next cusp
        def get_house_of_planet(plon):
            for i in range(1, 13):
                curr = cusps[i]
                nxt = cusps[1] if i == 12 else cusps[i+1]
                if curr < nxt:
                    if curr <= plon < nxt: return i
                else:
                    if plon >= curr or plon < nxt: return i
            return 1
            
        occupants_map = {i: [] for i in range(1, 13)}
        owners_map = {i: kp_cusps[i-1]["sign_lord"] for i in range(1, 13)}
        
        for p in kp_planets:
            if p["planet"] == "Ascendant": continue
            h = get_house_of_planet(p["longitude"])
            occupants_map[h].append(p["short_name"])
            
        # 3. Calculate Significators
        # A (Very Strong): Planets in star of occupants
        # B (Strong): Occupants
        # C (Normal): Planets in star of cusp sign lord
        # D (Weak): Cusp sign lord
        significators = {}
        for h in range(1, 13):
            D = owners_map[h]
            B_names = [p for p in occupants_map[h]]
            B_full = [p["planet"] for p in kp_planets if p["short_name"] in B_names]
            
            A = []
            for occ in B_full:
                for p in kp_planets:
                    if p["star_lord"] == occ and p["planet"] not in A:
                        A.append(p["planet"])
                        
            C = []
            for p in kp_planets:
                if p["star_lord"] == D and p["planet"] not in C:
                    C.append(p["planet"])
                    
            significators[h] = {
                "A": A,
                "B": B_full,
                "C": C,
                "D": [D]
            }
            
        planet_significators = {}
        for p in kp_planets:
            p_name = p["planet"]
            if p_name == "Ascendant": continue
            p_A = [h for h in range(1, 13) if p_name in significators[h]["A"]]
            p_B = [h for h in range(1, 13) if p_name in significators[h]["B"]]
            p_C = [h for h in range(1, 13) if p_name in significators[h]["C"]]
            p_D = [h for h in range(1, 13) if p_name in significators[h]["D"]]
            planet_significators[p_name] = {
                "A": p_A,
                "B": p_B,
                "C": p_C,
                "D": p_D
            }
            
        # 4. Ruling Planets
        day_of_week = dt_local.weekday() # 0 = Monday, 6 = Sunday
        day_lords = ["Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Sun"]
        day_lord = day_lords[day_of_week]
        
        asc = next((p for p in kp_planets if p["planet"] == "Ascendant"), None)
        moon = next((p for p in kp_planets if p["planet"] == "Moon"), None)
        sun = next((p for p in kp_planets if p["planet"] == "Sun"), None)
        saturn = next((p for p in kp_planets if p["planet"] == "Saturn"), None)
        
        ruling_planets = {
            "day_lord": day_lord,
            "lagna_lord": asc["sign_lord"] if asc else "",
            "lagna_nak_lord": asc["star_lord"] if asc else "",
            "lagna_sub_lord": asc["sub_lord"] if asc else "",
            "moon_rashi_lord": moon["sign_lord"] if moon else "",
            "moon_nak_lord": moon["star_lord"] if moon else "",
            "moon_sub_lord": moon["sub_lord"] if moon else ""
        }
        
        # Punarphoo Dosha Indicator (Saturn-Moon connection)
        punarphoo_present = False
        punarphoo_reason = ""
        if moon and saturn:
            moon_sign = get_sign_index(moon["longitude"])
            sat_sign = get_sign_index(saturn["longitude"])
            sign_diff = (moon_sign - sat_sign) % 12
            
            if moon["star_lord"] == "Saturn":
                punarphoo_present = True
                punarphoo_reason = "Moon is in Saturn's Star."
            elif saturn["star_lord"] == "Moon":
                punarphoo_present = True
                punarphoo_reason = "Saturn is in Moon's Star."
            elif sign_diff == 0:
                punarphoo_present = True
                punarphoo_reason = "Moon and Saturn are in the same Sign (Conjunction)."
            elif sign_diff == 6:
                punarphoo_present = True
                punarphoo_reason = "Moon and Saturn are aspecting each other (7th aspect)."
            elif sign_diff == 2:
                punarphoo_present = True
                punarphoo_reason = "Saturn aspects Moon (3rd aspect)."
            elif sign_diff == 9:
                punarphoo_present = True
                punarphoo_reason = "Saturn aspects Moon (10th aspect)."

        punarphoo_effects = None
        if punarphoo_present:
            punarphoo_effects = {
                "title": "Punarphoo Dosha (Saturn-Moon Karmic Connection)",
                "summary": "In KP Astrology, Punarphoo occurs when Saturn and Moon form an intimate connection. The word 'Punar' means repetition. It signifies that significant events in life rarely materialize on the first attempt; initial negotiations or talks may stall, undergo postponement, or break at the eleventh hour, but materialize upon a subsequent attempt.",
                "marriage_impact": "Noticeable delays in marriage, cancellation or hesitation in initial marriage proposals, or uncertainty before final settlement. Marriages finalize after patience and renegotiation.",
                "career_impact": "Delays in expected promotions, job offers, payments, or contract approvals. Key milestones usually require a second attempt or follow-up before culmination.",
                "emotional_impact": "Tendency toward overthinking, anxiety, mood swings, self-doubt, or feeling unsupported when events slow down, due to Saturn's cold gaze upon the sensitive Moon.",
                "positive_side": "Delay is never denial. Punarphoo bestows profound emotional resilience, practical maturity, meticulous planning, and enduring long-term stability once commitments are finalized.",
                "remedies": [
                    "Worship Lord Shiva regularly; perform water or milk abhishek on Mondays to soothe the Moon.",
                    "Recite the Hanuman Chalisa on Tuesdays and Saturdays to alleviate Saturn's restrictive pressure.",
                    "Do not abandon endeavors when an initial attempt pauses—the subsequent effort is destined to succeed.",
                    "Practice mindfulness, meditation, and avoid making hasty emotional decisions during periods of stress."
                ]
            }
                
        # Fortuna (Ascendant + Moon - Sun)
        fortuna = 0
        if asc and moon and sun:
            fortuna = (asc["longitude"] + moon["longitude"] - sun["longitude"]) % 360
            
        # KP Ayanamsha
        import swisseph as swe
        swe.set_sid_mode(swe.SIDM_KRISHNAMURTI)
        ayanamsha = swe.get_ayanamsa_ut(jd_ut)
        swe.set_sid_mode(swe.SIDM_LAHIRI) # reset
        
        # Aspect Calculations (KP Major Aspects: 0, 30, 60, 90, 120, 150, 180)
        ASPECT_TYPES = [
            (0, "Conjunction", 6.0, "neutral"),
            (30, "Semi-Sextile", 2.0, "benefic"),
            (60, "Sextile", 4.0, "benefic"),
            (90, "Square", 4.0, "malefic"),
            (120, "Trine", 6.0, "benefic"),
            (150, "Quincunx", 2.0, "malefic"),
            (180, "Opposition", 6.0, "malefic")
        ]

        aspects_list = []
        # Planet to Planet aspects
        for i, p1 in enumerate(kp_planets):
            for p2 in kp_planets[i+1:]:
                if p1["planet"] == "Ascendant" or p2["planet"] == "Ascendant":
                    continue
                diff = abs(p1["longitude"] - p2["longitude"])
                if diff > 180:
                    diff = 360 - diff
                
                for angle, name, orb, nature in ASPECT_TYPES:
                    if abs(diff - angle) <= orb:
                        aspects_list.append({
                            "body1": p1["planet"],
                            "body2": p2["planet"],
                            "type": name,
                            "angle": round(diff, 2),
                            "exact_angle": angle,
                            "orb": round(abs(diff - angle), 2),
                            "nature": nature
                        })

        # Planet to Cusp aspects
        for p in kp_planets:
            if p["planet"] == "Ascendant":
                continue
            for c in kp_cusps:
                diff = abs(p["longitude"] - c["longitude"])
                if diff > 180:
                    diff = 360 - diff
                for angle, name, orb, nature in ASPECT_TYPES:
                    if abs(diff - angle) <= (orb * 0.75):
                        aspects_list.append({
                            "body1": p["planet"],
                            "body2": f"House {c['house']} Cusp",
                            "type": name,
                            "angle": round(diff, 2),
                            "exact_angle": angle,
                            "orb": round(abs(diff - angle), 2),
                            "nature": nature
                        })

        # 5. KP Rule Analyzer (House Sub-Lord Promises)
        rule_analyzer = {}
        kp_topics = {
            1: {"title": "Health & Personality", "pos": [1, 5, 11], "neg": [6, 8, 12]},
            2: {"title": "Wealth & Family", "pos": [2, 6, 11], "neg": [5, 8, 12]},
            4: {"title": "Property & Education", "pos": [4, 9, 11], "neg": [3, 8, 12]},
            5: {"title": "Children & Romance", "pos": [2, 5, 11], "neg": [1, 4, 10]},
            6: {"title": "Disease & Service/Job", "pos": [6, 10, 11], "neg": [1, 5, 12]},
            7: {"title": "Marriage & Partnership", "pos": [2, 7, 11], "neg": [1, 6, 10]},
            9: {"title": "Higher Learning & Travel", "pos": [3, 9, 12], "neg": [4, 11]},
            10: {"title": "Career & Status", "pos": [2, 6, 10, 11], "neg": [1, 5, 9]},
            11: {"title": "Gains & Desires", "pos": [2, 6, 11], "neg": [1, 5, 12]},
            12: {"title": "Foreign Settlement & Losses", "pos": [3, 9, 12], "neg": [2, 11]}
        }

        for house_num, topic_info in kp_topics.items():
            sub_lord = kp_cusps[house_num - 1]["sub_lord"]
            # Find sub_lord planet object
            sl_planet = next((p for p in kp_planets if p["planet"] == sub_lord), None)
            sl_star_lord = sl_planet["star_lord"] if sl_planet else ""
            
            # Houses signified by Sub-Lord's Star Lord
            star_lord_sigs = planet_significators.get(sl_star_lord, {"A": [], "B": [], "C": [], "D": []})
            all_signified_houses = sorted(list(set(star_lord_sigs["A"] + star_lord_sigs["B"] + star_lord_sigs["C"] + star_lord_sigs["D"])))

            matched_pos = [h for h in all_signified_houses if h in topic_info["pos"]]
            matched_neg = [h for h in all_signified_houses if h in topic_info["neg"]]

            if len(matched_pos) > len(matched_neg):
                status = "Highly Favorable"
            elif len(matched_pos) == len(matched_neg) and len(matched_pos) > 0:
                status = "Mixed / Neutral"
            elif len(matched_neg) > len(matched_pos):
                status = "Unfavorable / Obstacles"
            else:
                status = "Moderate / Conditional"

            rule_analyzer[house_num] = {
                "topic": topic_info["title"],
                "sub_lord": sub_lord,
                "star_lord": sl_star_lord,
                "signified_houses": all_signified_houses,
                "positive_houses": topic_info["pos"],
                "negating_houses": topic_info["neg"],
                "matched_positive": matched_pos,
                "matched_negating": matched_neg,
                "status": status
            }

        # Compile response
        return {
            "planets": kp_planets,
            "cusps": kp_cusps,
            "occupants": occupants_map,
            "owners": owners_map,
            "significators": significators,
            "planet_significators": planet_significators,
            "ruling_planets": ruling_planets,
            "fortuna": fortuna,
            "ayanamsha": ayanamsha,
            "punarphoo_present": punarphoo_present,
            "punarphoo_reason": punarphoo_reason,
            "punarphoo_effects": punarphoo_effects,
            "aspects": aspects_list,
            "rule_analyzer": rule_analyzer
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
