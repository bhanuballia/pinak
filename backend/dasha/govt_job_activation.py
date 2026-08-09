# dasha/govt_job_activation.py
"""
Government Job Activation & Vimshottari Dasha Timing Engine.

Evaluates planetary positions, house lords (1st, 6th, 10th, 11th), and natural
government significators (Sun, Mars, Jupiter, Saturn, Mercury) to calculate
government job suitability, precise activation timelines, and specific government career domains.
"""

from __future__ import annotations
from typing import Dict, Any, List
import datetime
from astronomy.julian import julian_to_datetime
from dasha.vimshottari import compute_vimshottari_full
from dasha.wealth_activation import derive_house_lords, jd_to_iso_date

# Goverment Domain mapping per planet
GOVT_PLANET_DOMAINS = {
    "Sun": {
        "title": "Sun (Surya)",
        "domains": "State/Central Executive, IAS/IPS Leadership, Royal Government Offices, Administration & High Public Service",
        "description": "Sun represents royal authority, executive power, and top-tier state administrative services.",
        "weight": 3.5,
        "is_karaka": True
    },
    "Mars": {
        "title": "Mars (Mangal)",
        "domains": "Police, Military, Defense, Security Forces, Engineering Services, Revenue Enforcement & Competitive Exams",
        "description": "Mars brings physical valor, engineering aptitude, military discipline, and competitive exam dominance.",
        "weight": 3.0,
        "is_karaka": True
    },
    "Jupiter": {
        "title": "Jupiter (Guru)",
        "domains": "Judiciary, Law & Courts, Educational Administration, University Professorship, Treasury & High Advisory",
        "description": "Jupiter governs law, higher wisdom, public policy, judiciary, and academic leadership.",
        "weight": 2.5,
        "is_karaka": True
    },
    "Saturn": {
        "title": "Saturn (Shani)",
        "domains": "Public Administration, Public Works Department (PWD), Civil Services, Mining, Labor Ministry & Railways",
        "description": "Saturn signifies perseverance, long-term public service, infrastructure development, and bureaucracy.",
        "weight": 2.5,
        "is_karaka": True
    },
    "Mercury": {
        "title": "Mercury (Budh)",
        "domains": "Indian Revenue Service (IRS), Audit & Accounts (CAG), Banking & Finance Ministry, Telecommunications & Postal",
        "description": "Mercury gives high intellectual capacity for revenue services, auditing, statistics, and commerce.",
        "weight": 2.0,
        "is_karaka": True
    },
    "Venus": {
        "title": "Venus (Shukra)",
        "domains": "Foreign Affairs (IFS), Tourism Board, Civil Aviation, Cultural Ministries & Arts Administration",
        "description": "Venus grants diplomatic talent, foreign relations alignment, and hospitality/cultural governance.",
        "weight": 1.5,
        "is_karaka": False
    },
    "Moon": {
        "title": "Moon (Chandra)",
        "domains": "Public Health Ministry, Municipal Governance, Maritime & Navy, Water Resources & Nursing Administration",
        "description": "Moon governs public care, municipal bodies, water management, and social welfare departments.",
        "weight": 1.5,
        "is_karaka": False
    },
    "Rahu": {
        "title": "Rahu",
        "domains": "Intelligence Bureau (IB), RAW, Research & Development, IT & Cyber Security Departments, Aviation",
        "description": "Rahu handles secret intelligence, diplomatic strategy, technology, and unorthodox government roles.",
        "weight": 1.0,
        "is_karaka": False
    },
    "Ketu": {
        "title": "Ketu",
        "domains": "Government Research Labs, Space Organizations (ISRO/DRDO), Medical Research & Archeology",
        "description": "Ketu brings deep analytical precision for research institutions, defense technology, and specialized sciences.",
        "weight": 1.0,
        "is_karaka": False
    }
}

# Houses key for Government Job Activation
GOVT_HOUSES = {
    10: {"name": "10th House (Karma/Profession/Authority)", "weight": 3.5},
    6:  {"name": "6th House (Competitive Exams & Service)", "weight": 3.0},
    11: {"name": "11th House (Income & Appointment)", "weight": 2.5},
    1:  {"name": "1st House (Lagna/Self & Status)", "weight": 2.0},
    5:  {"name": "5th House (Competitive Intelligence)", "weight": 1.5}
}

def calculate_govt_job_scores(house_lords: Dict[int, str]) -> Dict[str, Dict[str, Any]]:
    """
    Computes government job suitability score for each planet based on house lordship and natural karaka status.
    """
    scores: Dict[str, Dict[str, Any]] = {}

    for h_num, info in GOVT_HOUSES.items():
        lord = house_lords.get(h_num)
        if not lord:
            continue

        if lord not in scores:
            p_data = GOVT_PLANET_DOMAINS.get(lord, {})
            scores[lord] = {
                "score": 0.0,
                "houses": [],
                "domains": p_data.get("domains", ""),
                "description": p_data.get("description", ""),
                "title": p_data.get("title", lord)
            }

        scores[lord]["score"] += info["weight"]
        scores[lord]["houses"].append(h_num)

    # Add natural Karaka weights
    for planet, info in GOVT_PLANET_DOMAINS.items():
        if planet not in scores:
            scores[planet] = {
                "score": 0.0,
                "houses": [],
                "domains": info["domains"],
                "description": info["description"],
                "title": info["title"]
            }
    return scores

def jd_to_iso_date(jd: float) -> str:
    """Converts a Julian Date to ISO YYYY-MM-DD string."""
    try:
        dt = julian_to_datetime(jd)
        return dt.strftime("%Y-%m-%d")
    except Exception:
        return str(round(jd, 2))

def jd_to_dmY_date(jd: float) -> str:
    """Converts a Julian Date to dd-mm-yyyy string format."""
    try:
        dt = julian_to_datetime(jd)
        return dt.strftime("%d-%m-%Y")
    except Exception:
        return str(round(jd, 2))

def compute_govt_job_activation_timeline(
    jd_ut: float,
    moon_sidereal_long: float,
    house_lords: Dict[int, str],
    years_ahead: float = 80.0
) -> Dict[str, Any]:
    """
    Computes precise timeline of Vimshottari Mahadasha + Antardasha government job activations.
    """
    govt_lord_data = calculate_govt_job_scores(house_lords)
    full_vim = compute_vimshottari_full(jd_ut, moon_sidereal_long, years_ahead=years_ahead)

    activation_periods = []
    birth_dt = jd_to_iso_date(jd_ut)
    min_age_jd = jd_ut + (16.5 * 365.2425)  # Government job eligibility starts after 16.5 years of age

    for md in full_vim:
        md_lord = md["lord"]
        md_info = govt_lord_data.get(md_lord, {"score": 0.5, "houses": [], "domains": ""})
        md_score = md_info["score"]

        for ad in md.get("antardashas", []):
            ad_lord = ad["lord"]
            ad_info = govt_lord_data.get(ad_lord, {"score": 0.5, "houses": [], "domains": ""})
            ad_score = ad_info["score"]

            # Filter out periods that end before birth or before reaching 16.5 years of age
            if ad["end_jd"] < min_age_jd:
                continue

            combined_score = (md_score * 1.6) + ad_score

            if combined_score >= 7.5:
                intensity = "High"
                badge_color = "#10b981" # Emerald Green
            elif combined_score >= 5.0:
                intensity = "Average"
                badge_color = "#3b82f6" # Sapphire Blue
            elif combined_score >= 3.0:
                intensity = "Low"
                badge_color = "#f59e0b" # Amber Gold
            else:
                continue

            start_str = jd_to_dmY_date(ad["start_jd"])
            end_str = jd_to_dmY_date(ad["end_jd"])

            houses_activated = sorted(list(set(md_info.get("houses", []) + ad_info.get("houses", []))))

            # Determine primary recommended government career domains for this period
            md_domain = GOVT_PLANET_DOMAINS.get(md_lord, {})
            ad_domain = GOVT_PLANET_DOMAINS.get(ad_lord, {})

            suggested_careers = f"{md_lord}: {md_domain.get('domains', '')}"
            if ad_lord != md_lord:
                suggested_careers += f" | {ad_lord}: {ad_domain.get('domains', '')}"

            activation_periods.append({
                "mahadasha": md_lord,
                "antardasha": ad_lord,
                "start_date": start_str,
                "end_date": end_str,
                "score": round(combined_score, 2),
                "intensity": intensity,
                "badge_color": badge_color,
                "houses_activated": houses_activated,
                "suggested_careers": suggested_careers,
                "description": f"Activation of {md_lord} (MD) & {ad_lord} (AD) activating key service houses: {houses_activated if houses_activated else 'Government Karaka Alignment'}"
            })

    activation_periods.sort(key=lambda x: x["start_date"])

    formatted_govt_lords = []
    for planet, pdata in sorted(govt_lord_data.items(), key=lambda x: x[1]["score"], reverse=True):
        formatted_govt_lords.append({
            "planet": planet,
            "title": pdata.get("title", planet),
            "score": round(pdata["score"], 1),
            "houses": pdata["houses"],
            "domains": pdata["domains"],
            "description": pdata["description"]
        })

    return {
        "birth_date": birth_dt,
        "govt_lords": formatted_govt_lords,
        "timeline": activation_periods
    }
