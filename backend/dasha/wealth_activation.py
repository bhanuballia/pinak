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

def jd_to_iso_date(jd: float) -> str:
    """Converts a Julian Date to ISO YYYY-MM-DD string."""
    try:
        dt = julian_to_datetime(jd)
        return dt.strftime("%Y-%m-%d")
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

def compute_wealth_activation_timeline(
    jd_ut: float,
    moon_sidereal_long: float,
    house_lords: Dict[int, str],
    years_ahead: float = 80.0
) -> Dict[str, Any]:
    """
    Computes precise timeline of Vimshottari Mahadasha + Antardasha wealth activations.
    """
    wealth_lord_data = calculate_wealth_lords(house_lords)
    full_vim = compute_vimshottari_full(jd_ut, moon_sidereal_long, years_ahead=years_ahead)

    activation_periods = []
    birth_dt = jd_to_iso_date(jd_ut)

    for md in full_vim:
        md_lord = md["lord"]
        md_info = wealth_lord_data.get(md_lord, {"score": 0.5, "houses": []})
        md_score = md_info["score"]

        for ad in md.get("antardashas", []):
            ad_lord = ad["lord"]
            ad_info = wealth_lord_data.get(ad_lord, {"score": 0.5, "houses": []})
            ad_score = ad_info["score"]

            # Filter out periods that end before birth
            if ad["end_jd"] < jd_ut:
                continue

            combined_score = (md_score * 1.6) + ad_score

            if combined_score >= 6.5:
                intensity = "Golden Wealth Era (Pinnacle)"
                badge_color = "#10b981" # Emerald Green
            elif combined_score >= 4.5:
                intensity = "High Prosperity & Asset Growth"
                badge_color = "#3b82f6" # Sapphire Blue
            elif combined_score >= 3.0:
                intensity = "Steady Financial Gains"
                badge_color = "#f59e0b" # Amber Gold
            else:
                continue # Omit low relevance periods

            start_str = jd_to_iso_date(ad["start_jd"])
            end_str = jd_to_iso_date(ad["end_jd"])

            houses_activated = sorted(list(set(md_info.get("houses", []) + ad_info.get("houses", []))))

            activation_periods.append({
                "mahadasha": md_lord,
                "antardasha": ad_lord,
                "start_date": start_str,
                "end_date": end_str,
                "score": round(combined_score, 2),
                "intensity": intensity,
                "badge_color": badge_color,
                "houses_activated": houses_activated,
                "description": f"Activation of {md_lord} (MD) & {ad_lord} (AD) activating wealth houses: {houses_activated if houses_activated else 'Karaka alignment'}"
            })

    # Sort descending by score for quick top insights
    activation_periods.sort(key=lambda x: x["start_date"])

    # Prepare top wealth lords breakdown
    formatted_wealth_lords = []
    for planet, pdata in sorted(wealth_lord_data.items(), key=lambda x: x[1]["score"], reverse=True):
        formatted_wealth_lords.append({
            "planet": planet,
            "score": round(pdata["score"], 1),
            "houses": pdata["houses"],
            "is_karaka": pdata.get("is_karaka", False)
        })

    return {
        "birth_date": birth_dt,
        "wealth_lords": formatted_wealth_lords,
        "timeline": activation_periods
    }
