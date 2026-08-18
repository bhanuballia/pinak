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
from astronomy.julian import datetime_to_julian, julian_to_datetime
from dasha.vimshottari import compute_vimshottari_full
from dasha.wealth_activation import derive_house_lords

# Universal Job & Career Domain mapping per planet (Corporate, Tech, Banking, Business & Govt)
GOVT_PLANET_DOMAINS = {
    "Sun": {
        "title": "Sun (Surya)",
        "domains": "Corporate Executive (CEO/Director), Government IAS/IPS Leadership, State Administration & High Public Service",
        "description": "Sun represents executive authority, corporate leadership, top management, and state administrative services.",
        "weight": 3.5,
        "is_karaka": True
    },
    "Mars": {
        "title": "Mars (Mangal)",
        "domains": "Software Engineering, Tech Project Management, Defense, Police, Security Operations & Competitive Recruitment",
        "description": "Mars brings engineering aptitude, IT product execution, military discipline, and competitive exam/interview dominance.",
        "weight": 3.0,
        "is_karaka": True
    },
    "Jupiter": {
        "title": "Jupiter (Guru)",
        "domains": "Corporate Law, Management Consulting, Educational Administration, University Professorship & High Financial Advisory",
        "description": "Jupiter governs corporate legal affairs, strategic consulting, higher education, judiciary, and financial governance.",
        "weight": 2.5,
        "is_karaka": True
    },
    "Saturn": {
        "title": "Saturn (Shani)",
        "domains": "IT Infrastructure & Operations, Supply Chain Management, Civil Engineering, Public Works (PWD) & Corporate Administration",
        "description": "Saturn signifies perseverance, IT infrastructure, supply chain operations, long-term corporate stability, and civil service.",
        "weight": 2.5,
        "is_karaka": True
    },
    "Mercury": {
        "title": "Mercury (Budh)",
        "domains": "IT Software Development, Data Analytics, Investment Banking, Chartered Accountancy (CA), Auditing & IRS Revenue",
        "description": "Mercury gives high intellectual capacity for software coding, data analysis, commercial banking, auditing, and revenue services.",
        "weight": 2.0,
        "is_karaka": True
    },
    "Venus": {
        "title": "Venus (Shukra)",
        "domains": "FinTech, UI/UX Design, Luxury Brand Management, Corporate Relations, Foreign Affairs & Hospitality Management",
        "description": "Venus grants corporate aesthetic design skills, financial technology expertise, public relations, and diplomatic services.",
        "weight": 1.5,
        "is_karaka": False
    },
    "Moon": {
        "title": "Moon (Chandra)",
        "domains": "Human Resources (HR), Healthcare Administration, Public Relations, Customer Operations & Social Welfare",
        "description": "Moon governs human resource management, public health, customer relations, and organizational welfare.",
        "weight": 1.5,
        "is_karaka": False
    },
    "Rahu": {
        "title": "Rahu",
        "domains": "Cyber Security, Artificial Intelligence (AI) Engineering, Data Science, Cyber Gaming, Tech Innovation & Strategy",
        "description": "Rahu handles high-tech software engineering, cyber security, AI systems, strategic innovation, and technical leadership.",
        "weight": 1.0,
        "is_karaka": False
    },
    "Ketu": {
        "title": "Ketu",
        "domains": "Cloud Architecture, Deep Data Research, Backend Systems Engineering & Specialized Research Institutes",
        "description": "Ketu gives deep analytical precision for backend software architecture, cloud computing, and scientific research.",
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

LORD_PRIMARY_SIGNS = {
    "Sun": "Leo",
    "Moon": "Cancer",
    "Mars": "Aries / Scorpio",
    "Mercury": "Gemini / Virgo",
    "Jupiter": "Sagittarius / Pisces",
    "Venus": "Taurus / Libra",
    "Saturn": "Capricorn / Aquarius",
    "Rahu": "Aquarius",
    "Ketu": "Scorpio"
}

def compute_govt_job_activation_timeline(
    jd_ut: float,
    moon_sidereal_long: float,
    house_lords: Dict[int, str],
    house_details: Dict[int, Dict[str, Any]] | None = None,
    years_ahead: float = 80.0,
    target_max_age: float = 55.0
) -> Dict[str, Any]:
    """
    Computes precise timeline of Vimshottari Mahadasha + Antardasha government job activations
    from current age up to age 55.
    """
    govt_lord_data = calculate_govt_job_scores(house_lords)
    full_vim = compute_vimshottari_full(jd_ut, moon_sidereal_long, years_ahead=years_ahead)

    activation_periods = []
    birth_dt = jd_to_iso_date(jd_ut)

    # Calculate Julian date for current time (now)
    now_jd = datetime_to_julian(datetime.datetime.utcnow())
    
    # Calculate user's current age
    user_age = (now_jd - jd_ut) / 365.2425 if jd_ut > 0 else 25.0
    if user_age < 0 or user_age > 120:
        user_age = 25.0

    min_eligibility_jd = jd_ut + (16.5 * 365.2425)
    max_age_jd = jd_ut + (target_max_age * 365.2425)

    if user_age < 16.5:
        start_filter_jd = min_eligibility_jd
        end_filter_jd = max_age_jd
        filter_summary = f"Age 16.5 to Age {int(target_max_age)} (Minimum Eligible Selection Age 16.5+)"
    elif user_age >= target_max_age:
        start_filter_jd = min_eligibility_jd
        end_filter_jd = max_age_jd
        filter_summary = f"Age 16.5 to Age {int(target_max_age)} (Peak Career Selection Years)"
    else:
        start_filter_jd = now_jd
        end_filter_jd = max_age_jd
        filter_summary = f"Current Age ({round(user_age, 1)} yrs) to Age {int(target_max_age)}"

    house_labels = {
        1: "1st House (Personal Status & Rank)",
        2: "2nd House (Income Flow & First Paycheck)",
        3: "3rd House (Efforts & Exam Execution)",
        4: "4th House (Workplace Stability)",
        5: "5th House (Exam Merit & Intelligence)",
        6: "6th House (Recruitment & Selection)",
        7: "7th House (Public Status & Posting)",
        8: "8th House (Research & Hidden Gains)",
        9: "9th House (Fortune & Higher Rank)",
        10: "10th House (Career Rank & Power)",
        11: "11th House (Offer Letter & Joining)",
        12: "12th House (Foreign/Remote Posting)"
    }

    for md in full_vim:
        md_lord = md["lord"]
        md_info = govt_lord_data.get(md_lord, {"score": 0.5, "houses": [], "domains": ""})
        md_score = md_info["score"]

        for ad in md.get("antardashas", []):
            ad_lord = ad["lord"]
            ad_info = govt_lord_data.get(ad_lord, {"score": 0.5, "houses": [], "domains": ""})
            ad_score = ad_info["score"]

            # Filter out periods that end before start_filter_jd or start after end_filter_jd
            if ad["end_jd"] < start_filter_jd or ad["start_jd"] > end_filter_jd:
                continue

            combined_score = (md_score * 1.6) + ad_score

            if combined_score >= 6.5:
                intensity = "High (Peak Selection)"
                badge_color = "#10b981" # Emerald Green
            elif combined_score >= 4.0:
                intensity = "Average"
                badge_color = "#3b82f6" # Sapphire Blue
            elif combined_score >= 2.0:
                intensity = "Favorable"
                badge_color = "#8b5cf6" # Purple
            else:
                intensity = "Moderate"
                badge_color = "#f59e0b" # Amber Gold

            houses_activated = sorted(list(set(md_info.get("houses", []) + ad_info.get("houses", []))))

            detailed_houses = []
            for h in houses_activated:
                base_lbl = house_labels.get(h, f"{h}th House")
                h_info = house_details.get(h, {}) if house_details else {}
                h_lord = h_info.get("lord") or house_lords.get(h, "")
                h_sign = h_info.get("sign") or LORD_PRIMARY_SIGNS.get(h_lord, "")
                h_occ = h_info.get("occupants", [])

                fmt = f"{base_lbl} — Lord: {h_lord}" if h_lord else base_lbl
                if h_sign:
                    fmt += f" ({h_sign})"
                if h_occ:
                    fmt += f" [Occupied by {', '.join(h_occ)}]"
                detailed_houses.append(fmt)

            formatted_houses = ", ".join(detailed_houses)
            house_summary = f"triggers {formatted_houses} (as per Lagna Chart D1 Lordship & Gochar Transit confirmation)" if formatted_houses else "aligns with Government Karaka planetary powers (as per Lagna Chart D1 & Gochar Transits)"
            
            md_domain = GOVT_PLANET_DOMAINS.get(md_lord, {})
            ad_domain = GOVT_PLANET_DOMAINS.get(ad_lord, {})

            suggested_careers = f"{md_lord}: {md_domain.get('domains', '')}"
            if ad_lord != md_lord:
                suggested_careers += f" | {ad_lord}: {ad_domain.get('domains', '')}"

            age_at_start = round((ad["start_jd"] - jd_ut) / 365.2425, 1)
            start_str = jd_to_dmY_date(ad["start_jd"])
            end_str = jd_to_dmY_date(ad["end_jd"])

            activation_periods.append({
                "mahadasha": md_lord,
                "antardasha": ad_lord,
                "start_date": start_str,
                "end_date": end_str,
                "start_jd": ad["start_jd"],
                "age_at_start": age_at_start,
                "score": round(combined_score, 2),
                "intensity": intensity,
                "badge_color": badge_color,
                "houses_activated": houses_activated,
                "houses_activated_detailed": detailed_houses,
                "suggested_careers": suggested_careers,
                "description": f"Key period of {md_lord} (Mahadasha) & {ad_lord} (Antardasha) at Age ~{age_at_start} yrs — {house_summary}."
            })

    if not activation_periods:
        for md in full_vim:
            md_lord = md["lord"]
            md_info = govt_lord_data.get(md_lord, {"score": 0.5, "houses": [], "domains": ""})
            md_score = md_info["score"]
            for ad in md.get("antardashas", []):
                ad_lord = ad["lord"]
                ad_info = govt_lord_data.get(ad_lord, {"score": 0.5, "houses": [], "domains": ""})
                ad_score = ad_info["score"]
                if ad["end_jd"] < min_eligibility_jd or ad["start_jd"] > max_age_jd:
                    continue
                combined_score = (md_score * 1.6) + ad_score
                start_str = jd_to_dmY_date(ad["start_jd"])
                end_str = jd_to_dmY_date(ad["end_jd"])
                age_at_start = round((ad["start_jd"] - jd_ut) / 365.2425, 1)
                md_domain = GOVT_PLANET_DOMAINS.get(md_lord, {})
                ad_domain = GOVT_PLANET_DOMAINS.get(ad_lord, {})
                suggested_careers = f"{md_lord}: {md_domain.get('domains', '')}"
                if ad_lord != md_lord:
                    suggested_careers += f" | {ad_lord}: {ad_domain.get('domains', '')}"
                
                houses_act = sorted(list(set(md_info.get("houses", []) + ad_info.get("houses", []))))
                f_houses = ", ".join([house_labels.get(h, f"House {h}") for h in houses_act])
                h_sum = f"triggers {f_houses}" if f_houses else "aligns with Government Karaka planetary powers"

                activation_periods.append({
                    "mahadasha": md_lord,
                    "antardasha": ad_lord,
                    "start_date": start_str,
                    "end_date": end_str,
                    "start_jd": ad["start_jd"],
                    "age_at_start": age_at_start,
                    "score": round(combined_score, 2),
                    "intensity": "Favorable",
                    "badge_color": "#3b82f6",
                    "houses_activated": houses_act,
                    "suggested_careers": suggested_careers,
                    "description": f"Key period of {md_lord} (Mahadasha) & {ad_lord} (Antardasha) at Age ~{age_at_start} yrs — {h_sum}."
                })

    activation_periods.sort(key=lambda x: x["start_jd"])

    formatted_govt_lords = []
    for planet, pdata in sorted(govt_lord_data.items(), key=lambda x: x[1].get("score", 0.0), reverse=True):
        formatted_govt_lords.append({
            "planet": planet,
            "title": pdata.get("title", planet),
            "score": round(pdata.get("score", 0.0), 1),
            "houses": pdata.get("houses", []),
            "domains": pdata.get("domains", ""),
            "description": pdata.get("description", "")
        })

    return {
        "birth_date": birth_dt,
        "user_current_age": round(user_age, 1),
        "target_max_age": target_max_age,
        "age_filter_summary": filter_summary,
        "govt_lords": formatted_govt_lords,
        "timeline": activation_periods
    }
