from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from dasha_engine.mahadasha import VIMSHOTTARI_SEQUENCE

# --- Planet Hindi Abbreviations ---
PLANET_ABBR = {
    "Sun":     "सू",
    "Moon":    "चं",
    "Mars":    "म",
    "Mercury": "बु",
    "Jupiter": "गु",
    "Venus":   "शु",
    "Saturn":  "श",
    "Rahu":    "रा",
    "Ketu":    "के",
}

# Tara Chakra names
TARA_NAMES = [
    "जन्म",       # 1
    "सम्पद",      # 2
    "विपद",       # 3
    "क्षेम",      # 4
    "प्रत्यरि",   # 5
    "साधक",       # 6
    "वध",         # 7
    "मित्र",      # 8
    "परम मित्र",  # 9
]

NAKSHATRA_SEQUENCE = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

SIGN_NAMES_HI = [
    "मेष", "वृष", "मिथुन", "कर्क", "सिंह", "कन्या",
    "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन"
]

NAKSHATRA_LORDS = {
    "Ketu": ["Ashwini", "Magha", "Mula"],
    "Venus": ["Bharani", "Purva Phalguni", "Purva Ashadha"],
    "Sun": ["Krittika", "Uttara Phalguni", "Uttara Ashadha"],
    "Moon": ["Rohini", "Hasta", "Shravana"],
    "Mars": ["Mrigashira", "Chitra", "Dhanishtha"],
    "Rahu": ["Ardra", "Swati", "Shatabhisha"],
    "Jupiter": ["Punarvasu", "Vishakha", "Purva Bhadrapada"],
    "Saturn": ["Pushya", "Anuradha", "Uttara Bhadrapada"],
    "Mercury": ["Ashlesha", "Jyeshtha", "Revati"],
}

TOTAL_YEARS = 120.0


def get_tara(birth_nakshatra_idx: int, target_nakshatra_idx: int) -> tuple:
    diff = (target_nakshatra_idx - birth_nakshatra_idx) % 27
    tara_num = (diff % 9) + 1
    return tara_num, TARA_NAMES[tara_num - 1]


def nakshatra_from_longitude(lon: float) -> int:
    """Returns 0-based nakshatra index from longitude 0-360."""
    return int(lon / (360 / 27))


def sign_from_longitude(lon: float) -> str:
    idx = int(lon / 30) % 12
    return SIGN_NAMES_HI[idx]


def planet_sequence_starting_from(start_planet: str):
    idx = next(i for i, (p, _) in enumerate(VIMSHOTTARI_SEQUENCE) if p == start_planet)
    seq = VIMSHOTTARI_SEQUENCE[idx:] + VIMSHOTTARI_SEQUENCE[:idx]
    return seq


def build_5level_rows(
    birth_dt: datetime,
    moon_nakshatra_lord: str,
    moon_nakshatra_idx: int,
    birth_age_years: int = 0,
    current_dt: datetime = None,
    planet_longitudes: dict = None,  # {planet: longitude}
    rows_around_now: int = 40,
):
    """
    Generate rows for the 5-level Vimshottari Dasha table around the current datetime.
    Returns a list of row dicts matching the image format.
    """
    if current_dt is None:
        current_dt = datetime.now()

    # Level 1: Mahadasha
    md_seq = planet_sequence_starting_from(moon_nakshatra_lord)
    md_start = birth_dt

    all_rows = []

    for md_planet, md_yrs in md_seq:
        md_end = md_start + relativedelta(years=md_yrs)

        if md_end < current_dt - relativedelta(years=2):
            md_start = md_end
            continue

        # Level 2: Antardasha
        ad_seq = planet_sequence_starting_from(md_planet)
        ad_start = md_start

        for ad_planet, ad_yrs in ad_seq:
            ad_duration_days = (md_yrs * ad_yrs / TOTAL_YEARS) * 365.25
            ad_end = ad_start + timedelta(days=ad_duration_days)

            if ad_end < current_dt - relativedelta(months=2):
                ad_start = ad_end
                continue

            # Level 3: Pratyantar
            pt_seq = planet_sequence_starting_from(ad_planet)
            pt_start = ad_start

            for pt_planet, pt_yrs in pt_seq:
                pt_duration_days = (ad_duration_days * pt_yrs / TOTAL_YEARS)
                pt_end = pt_start + timedelta(days=pt_duration_days)

                if pt_end < current_dt - relativedelta(days=3):
                    pt_start = pt_end
                    continue

                # Level 4: Sukshma
                sk_seq = planet_sequence_starting_from(pt_planet)
                sk_start = pt_start

                for sk_planet, sk_yrs in sk_seq:
                    sk_duration_hours = (pt_duration_days * sk_yrs / TOTAL_YEARS) * 24
                    sk_end = sk_start + timedelta(hours=sk_duration_hours)

                    if sk_end < current_dt - timedelta(hours=12):
                        sk_start = sk_end
                        continue

                    # Level 5: Prana
                    pr_seq = planet_sequence_starting_from(sk_planet)
                    pr_start = sk_start

                    for pr_planet, pr_yrs in pr_seq:
                        pr_duration_mins = (sk_duration_hours * pr_yrs / TOTAL_YEARS) * 60
                        pr_end = pr_start + timedelta(minutes=pr_duration_mins)

                        if pr_end < current_dt - timedelta(minutes=30):
                            pr_start = pr_end
                            continue

                        # Compute age at start
                        age_at_start = (pr_start - birth_dt).days // 365

                        # Nakshatra lord of pr_planet
                        pr_nak_idx = None
                        for nak_name in NAKSHATRA_LORDS.get(pr_planet, []):
                            if nak_name in NAKSHATRA_SEQUENCE:
                                pr_nak_idx = NAKSHATRA_SEQUENCE.index(nak_name)
                                break

                        if pr_nak_idx is None:
                            pr_nak_idx = 0

                        tara_num, tara_name = get_tara(moon_nakshatra_idx, pr_nak_idx)

                        # Transit signs (simplified - from planet_longitudes if given)
                        transit_str = ""
                        if planet_longitudes:
                            sn = [sign_from_longitude(planet_longitudes.get(p, 0))
                                  for p in ["Jupiter", "Moon", "Sun"]]
                            transit_str = "-".join(sn)
                        else:
                            transit_str = "मिथुन-मिथुन-वृष"

                        # Dasha chain abbreviation
                        chain = "-".join([
                            PLANET_ABBR.get(md_planet, md_planet),
                            PLANET_ABBR.get(ad_planet, ad_planet),
                            PLANET_ABBR.get(pt_planet, pt_planet),
                            PLANET_ABBR.get(sk_planet, sk_planet),
                            PLANET_ABBR.get(pr_planet, pr_planet),
                        ])

                        all_rows.append({
                            "dasha_chain": chain,
                            "md": md_planet,
                            "ad": ad_planet,
                            "pt": pt_planet,
                            "sk": sk_planet,
                            "pr": pr_planet,
                            "age": age_at_start,
                            "start_date": pr_start.strftime("%d-%m-%Y"),
                            "start_time": pr_start.strftime("%H:%M"),
                            "tara_num": tara_num,
                            "tara_name": tara_name,
                            "rashi_distance": tara_num,
                            "gochar": transit_str,
                            "is_current": pr_start <= current_dt < pr_end,
                        })

                        if len(all_rows) >= rows_around_now * 2:
                            return all_rows

                        pr_start = pr_end

                    sk_start = sk_end

                pt_start = pt_end

            ad_start = ad_end

        md_start = md_end

    return all_rows
