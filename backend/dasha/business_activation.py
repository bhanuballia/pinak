# dasha/wealth_activation.py
"""
Wealth Lord Activation & Vimshottari Timing Engine.

Identifies the Wealth Lords (Lords of 1st, 2nd, 5th, 9th, and 11th houses)
and evaluates Vimshottari Mahadasha + Antardasha timelines to pinpoint precise
years when financial wealth and prosperity lords become active.
"""

from __future__ import annotations
from typing import Dict, Any, List
import datetime
from astronomy.julian import julian_to_datetime
from dasha.vimshottari import compute_vimshottari_full

# House definitions and astrological weights
WEALTH_HOUSES = {
    1: {"name": "Lagna (Self & Capacity)", "weight": 1.5},
    2: {"name": "Dhana Bhava (Accumulated Assets)", "weight": 2.5},
    5: {"name": "Purva Punya (Speculative & Creative Gains)", "weight": 2.0},
    9: {"name": "Bhagya Bhava (Fortune & Divine Luck)", "weight": 2.5},
    11: {"name": "Labha Bhava (Profits & Major Income)", "weight": 3.0}
}

NATURAL_WEALTH_KARAKAS = {
    "Jupiter": 1.5,  # Primary Karaka for expansion & wealth
    "Venus": 1.2     # Karaka for luxury, vehicle, & prosperity
}

ZODIAC_LORDS = {
    "Aries": "Mars",
    "Taurus": "Venus",
    "Gemini": "Mercury",
    "Cancer": "Moon",
    "Leo": "Sun",
    "Virgo": "Mercury",
    "Libra": "Venus",
    "Scorpio": "Mars",
    "Sagittarius": "Jupiter",
    "Capricorn": "Saturn",
    "Aquarius": "Saturn",
    "Pisces": "Jupiter"
}

ZODIAC_NAMES = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

def jd_to_formatted_date(jd: float) -> str:
    """Converts a Julian Date to DD-MM-YYYY string."""
    try:
        dt = julian_to_datetime(jd)
        return dt.strftime("%d-%m-%Y")
    except Exception:
        return str(round(jd, 2))

def derive_house_lords(ascendant_deg: float) -> Dict[int, str]:
    """
    Derives house lords from Ascendant sidereal degree (0-360).
    Returns mapping {house_number: planet_name}.
    """
    asc_sign_idx = int(ascendant_deg // 30) % 12
    house_lords = {}
    for h in range(1, 13):
        sign_idx = (asc_sign_idx + h - 1) % 12
        sign_name = ZODIAC_NAMES[sign_idx]
        house_lords[h] = ZODIAC_LORDS[sign_name]
    return house_lords

def calculate_wealth_lords(house_lords: Dict[int, str]) -> Dict[str, Dict[str, Any]]:
    """
    Calculates composite wealth score for each planet based on house lordship.
    """
    scores: Dict[str, Dict[str, Any]] = {}
    
    for h_num, info in WEALTH_HOUSES.items():
        lord = house_lords.get(h_num)
        if not lord:
            continue
        
        if lord not in scores:
            scores[lord] = {"score": 0.0, "houses": [], "is_karaka": False}
        
        scores[lord]["score"] += info["weight"]
        scores[lord]["houses"].append(h_num)
        
    for karaka, weight in NATURAL_WEALTH_KARAKAS.items():
        if karaka not in scores:
            scores[karaka] = {"score": 0.0, "houses": [], "is_karaka": True}
        scores[karaka]["score"] += weight
        scores[karaka]["is_karaka"] = True

    return scores

def compute_business_activation_timeline(jd_ut: float, moon_sidereal_long: float, house_lords: dict, years_ahead: float = 80.0):
    """
    Computes a timeline of Vimshottari Dasha periods optimized for Business/Entrepreneurship activation.
    Evaluates Mahadasha and Antardasha lords against key business houses (7th, 10th, 11th, 3rd)
    and natural karakas (Mercury, Rahu).
    """
    from dasha.vimshottari import compute_vimshottari_full
    full_vim = compute_vimshottari_full(jd_ut, moon_sidereal_long, years_ahead)

    business_lord_data = {}
    
    # 7th house (Partnerships, Trade, Markets) - Primary
    lord_7 = house_lords.get("7")
    if lord_7: business_lord_data[lord_7] = {"score": 3.0, "houses": ["7th (Trade/Markets)"]}

    # 10th house (Career, Status, Authority) - Primary
    lord_10 = house_lords.get("10")
    if lord_10:
        if lord_10 in business_lord_data:
            business_lord_data[lord_10]["score"] += 2.5
            business_lord_data[lord_10]["houses"].append("10th (Career/Status)")
        else:
            business_lord_data[lord_10] = {"score": 2.5, "houses": ["10th (Career/Status)"]}

    # 11th house (Profits, Scaling, Networks) - Primary
    lord_11 = house_lords.get("11")
    if lord_11:
        if lord_11 in business_lord_data:
            business_lord_data[lord_11]["score"] += 2.0
            business_lord_data[lord_11]["houses"].append("11th (Profits)")
        else:
            business_lord_data[lord_11] = {"score": 2.0, "houses": ["11th (Profits)"]}

    # 3rd house (Courage, Initiative, Sales) - Secondary
    lord_3 = house_lords.get("3")
    if lord_3:
        if lord_3 in business_lord_data:
            business_lord_data[lord_3]["score"] += 1.0
            business_lord_data[lord_3]["houses"].append("3rd (Initiative/Sales)")
        else:
            business_lord_data[lord_3] = {"score": 1.0, "houses": ["3rd (Initiative/Sales)"]}

    # Natural Karakas for Business
    # Mercury (Commerce, Intellect, Trade)
    if "Mercury" in business_lord_data:
        business_lord_data["Mercury"]["score"] += 1.5
        business_lord_data["Mercury"]["houses"].append("Karaka (Commerce)")
    else:
        business_lord_data["Mercury"] = {"score": 1.5, "houses": ["Karaka (Commerce)"]}

    # Rahu (Out of box thinking, scaling, startups)
    if "Rahu" in business_lord_data:
        business_lord_data["Rahu"]["score"] += 1.0
        business_lord_data["Rahu"]["houses"].append("Karaka (Innovation)")
    else:
        business_lord_data["Rahu"] = {"score": 1.0, "houses": ["Karaka (Innovation)"]}


    activation_periods = []
    birth_dt = jd_to_formatted_date(jd_ut)

    for md in full_vim:
        md_lord = md["lord"]
        md_info = business_lord_data.get(md_lord, {"score": 0.5, "houses": []})
        md_score = md_info["score"]

        for ad in md.get("antardashas", []):
            ad_lord = ad["lord"]
            ad_info = business_lord_data.get(ad_lord, {"score": 0.5, "houses": []})
            ad_score = ad_info["score"]

            if ad["end_jd"] < jd_ut:
                continue

            combined_score = (md_score * 1.6) + ad_score

            if combined_score >= 6.0:
                intensity = "Golden Business Era (Pinnacle)"
                badge_color = "#10b981" # Emerald Green
                status_type = "Good"
                reason = f"Synergy between Mahadasha Lord ({md_lord}) and Antardasha Lord ({ad_lord}) directly activating high-weight commercial houses ({md_info.get('houses', []) + ad_info.get('houses', [])})."
            elif combined_score >= 4.0:
                intensity = "High Market Growth & Expansion"
                badge_color = "#3b82f6" # Sapphire Blue
                status_type = "Good"
                reason = f"Operating Dasha Lords ({md_lord}-{ad_lord}) possess strong business scores and support enterprise scaling."
            elif combined_score >= 2.5:
                intensity = "Steady Operations & Consolidation"
                badge_color = "#f59e0b" # Amber Gold
                status_type = "Good"
                reason = f"Moderate activation by {md_lord} and {ad_lord} providing stable business operations."
            else:
                intensity = "Operational Challenge & Pivot Needed"
                badge_color = "#ef4444" # Red
                status_type = "Challenging"
                reason = f"Neither {md_lord} nor {ad_lord} holds strong business lord status for your Lagna chart, calling for caution and strategic pivoting."

            start_str = jd_to_formatted_date(ad["start_jd"])
            end_str = jd_to_formatted_date(ad["end_jd"])

            houses_activated = sorted(list(set(md_info.get("houses", []) + ad_info.get("houses", []))))

            activation_periods.append({
                "mahadasha": md_lord,
                "antardasha": ad_lord,
                "start_date": start_str,
                "end_date": end_str,
                "score": round(combined_score, 2),
                "intensity": intensity,
                "badge_color": badge_color,
                "status_type": status_type,
                "reason": reason,
                "houses_activated": houses_activated,
                "description": f"Activation of {md_lord} (MD) & {ad_lord} (AD) activating wealth houses: {houses_activated if houses_activated else 'Karaka alignment'}"
            })

    # Sort descending by score for quick top insights
    activation_periods.sort(key=lambda x: x["start_date"])

    # Prepare top business lords breakdown
    formatted_business_lords = []
    for planet, pdata in sorted(business_lord_data.items(), key=lambda x: x[1]["score"], reverse=True):
        formatted_business_lords.append({
            "planet": planet,
            "score": round(pdata["score"], 1),
            "houses": pdata["houses"],
            "is_karaka": pdata.get("is_karaka", False)
        })

    # Compute Current Gochar (Transits) relative to Lagna
    current_gochar = []
    try:
        now_dt = datetime.datetime.now(datetime.timezone.utc)
        from astronomy.julian import datetime_to_julian
        from astronomy.positions import get_all_planetary_positions
        now_jd = datetime_to_julian(now_dt)
        transit_positions = get_all_planetary_positions(now_jd)

        from panchang.nakshatra import compute_nakshatra_from_lon

        asc_sign_idx = int(0.0 // 30) % 12

        for p_name, p_info in transit_positions.items():
            t_lon = p_info.get("sidereal", {}).get("lon", p_info.get("longitude", 0.0))
            t_sign_idx = int(t_lon // 30) % 12
            # House relative to Lagna (1-indexed)
            house_from_lagna = ((t_sign_idx - asc_sign_idx) % 12) + 1
            sign_name = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"][t_sign_idx]
            deg_in_sign = round(t_lon % 30, 2)
            is_retro = p_info.get("is_retrograde", False)

            # Nakshatra calculation
            nak_info = compute_nakshatra_from_lon(t_lon)
            nak_name = nak_info.get("nakshatra_name", "")
            nak_pada = nak_info.get("pada", 1)

            # Highlight business house transits (1st, 7th, 10th, 11th, 3rd)
            is_business_house = house_from_lagna in [1, 7, 10, 11, 3]

            current_gochar.append({
                "planet": p_name,
                "sign": sign_name,
                "house_from_lagna": house_from_lagna,
                "degree_in_sign": deg_in_sign,
                "nakshatra": nak_name,
                "pada": nak_pada,
                "is_retrograde": is_retro,
                "is_business_house": is_business_house
            })
    except Exception as ge:
        print("Gochar transit calculation error:", ge)

    return {
        "birth_date": birth_dt,
        "business_lords": formatted_business_lords,
        "timeline": activation_periods,
        "current_gochar": current_gochar
    }

