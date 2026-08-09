# core/analysis/life_oracle.py
"""
Life Oracle Engine: Provides detailed interpretations for various life areas
based on Vedic Astrology principles (Chart positions, Dasha, Shadbala).
"""

from typing import Dict, Any, List
import datetime as _dt

def analyze_life_oracle(report_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main entry point to analyze life areas for the Interactive Worksheet.
    """
    oracle_data = {}
    
    # Extract necessary components
    d1 = report_data.get("chart", {})
    houses = d1.get("houses", {})
    
    # Normalize planet_positions: report_data stores it as a LIST of dicts.
    # All analysis functions expect a DICT keyed by planet name.
    _raw_planets = report_data.get("planet_positions", {})
    if isinstance(_raw_planets, list):
        planets = {p["planet"]: p for p in _raw_planets if isinstance(p, dict) and "planet" in p}
    else:
        planets = _raw_planets  # already a dict
    
    strength = report_data.get("strength", {}).get("planets", {})
    dasha = report_data.get("dasha", {}).get("current", {})
    numerology = report_data.get("favourable", {}).get("numerology", {})
    
    # Helper: Get House Info
    def get_house(h_num):
        h = houses.get(h_num) or houses.get(str(h_num)) or {}
        return h
    
    def get_planet_house(p_name):
        for h_num, h_data in houses.items():
            names = [p["name"] if isinstance(p, dict) else p for p in h_data.get("planets", [])]
            if p_name in names:
                return int(h_num)
        return None

    # 1. STUDY (Education)
    try:
        oracle_data["study"] = _analyze_study(houses, planets, strength)
    except:
        oracle_data["study"] = None
    
    # 2. CAREER (Professional Life)
    try:
        oracle_data["career"] = _analyze_career(houses, planets, strength, dasha=dasha)
    except:
        oracle_data["career"] = None
    
    # 3. FINANCE (Wealth)
    try:
        oracle_data["finance"] = _analyze_finance(houses, planets, strength, dasha=dasha)
    except:
        oracle_data["finance"] = None
    
    # 4. MARRIAGE
    try:
        oracle_data["marriage"] = _analyze_marriage(
            houses, planets, strength,
            report_data.get("vargas", {}).get("d9", {}),
            dasha=report_data.get("dasha", {}).get("current", {})
        )
    except:
        oracle_data["marriage"] = None
    
    # 5. BUSINESS
    try:
        oracle_data["business"] = _analyze_business(
            houses, planets, strength,
            d9=report_data.get("vargas", {}).get("d9", {}),
            d10=report_data.get("vargas", {}).get("d10", {}),
            dasha=report_data.get("dasha", {}).get("current", {})
        )
    except:
        oracle_data["business"] = None
    
    # 6. HEALTH (Overall)
    try:
        oracle_data["health"] = _analyze_health(houses, planets, strength, dasha=dasha)
    except:
        oracle_data["health"] = None
    
    # 7. FAMILY HEALTH (Parents, Spouse, Children)
    try:
        oracle_data["parents_health"] = _analyze_family_health(houses, planets, strength, "parents", dasha=dasha)
        oracle_data["spouse_health"] = _analyze_family_health(houses, planets, strength, "spouse", dasha=dasha)
        oracle_data["children_health"] = _analyze_family_health(houses, planets, strength, "children", dasha=dasha)
    except:
        oracle_data["parents_health"] = None
        oracle_data["spouse_health"] = None
        oracle_data["children_health"] = None
    
    # 8. MENTAL PEACE
    try:
        oracle_data["mental_peace"] = _analyze_mental_peace(houses, planets, strength, dasha=dasha)
    except:
        oracle_data["mental_peace"] = None
    
    # 9. GHAR KI SUKH SHANTI
    try:
        oracle_data["home_peace"] = _analyze_home_peace(houses, planets, strength, dasha=dasha)
    except:
        oracle_data["home_peace"] = None

    # 10. DOSHAS
    try:
        oracle_data.update(_analyze_doshas(report_data))
    except:
        pass
    
    return oracle_data


def _analyze_doshas(report_data) -> Dict[str, Any]:
    res = {}
    dosha_data = report_data.get("dosha", {})
    strength = report_data.get("strength", {}).get("planets", {})
    dasha = report_data.get("dasha", {}).get("current", {})
    
    # Normalize planet_positions to dict keyed by planet name
    _raw_planets = report_data.get("planet_positions", {})
    if isinstance(_raw_planets, list):
        planet_dict = {p["planet"]: p for p in _raw_planets if isinstance(p, dict) and "planet" in p}
    else:
        planet_dict = _raw_planets
    
    # Extract Moon longitude for Sade Sati
    moon_lon = 0
    moon_data = planet_dict.get("Moon", {})
    if moon_data:
        moon_lon = moon_data.get("sidereal", {}).get("lon", moon_data.get("longitude", 0))
    elif "chart" in report_data and "planet_positions" in report_data["chart"]:
        moon_lon = report_data["chart"]["planet_positions"].get("Moon", {}).get("sidereal", {}).get("lon", 0)


    D_INFO = {
        "manglik": {"label": "Manglik Dosha", "label_hi": "मंगल दोष", "color": "rose"},
        "kalsarp": {"label": "Kalsarp Dosha", "label_hi": "कालसर्प दोष", "color": "slate"},
        "pitra": {"label": "Pitra Dosha", "label_hi": "पितृ दोष", "color": "amber"},
        "sadesati": {"label": "Sade Sati", "label_hi": "साढ़े साती", "color": "indigo"},
        "rahu": {"label": "Rahu Dosha", "label_hi": "राहु दोष", "color": "teal"},
        "ketu": {"label": "Ketu Dosha", "label_hi": "केतु दोष", "color": "orange"}
    }
    
    for key, meta in D_INFO.items():
        data = dosha_data.get(key, {})
        present = data.get("present", False)
        
        # Severity calculation (Simulated for UI)
        severity = 0
        if present:
            severity = 70 if key in ["manglik", "kalsarp"] else 60
        
        res[key] = {
            "present": present,
            "label": meta["label"],
            "label_hi": meta["label_hi"],
            "severity": severity,
            "summary": data.get("summary", "Analysis unavailable."),
            "details": data.get("details", []),
            "remedies": data.get("remedies", ["Consult an expert", "Perform designated puja", "Chant relevant mantras"]),
            "color": meta["color"],
            "note": "Doshas are planetary alignments that require awareness and specific remedies for balance."
        }

        # Specialized logic for Sade Sati
        if key == "sadesati":
            moon_strength = strength.get("Moon", {}).get("total", 60.0)
            saturn_strength = strength.get("Saturn", {}).get("total", 60.0)
            rich_ss = _analyze_sade_sati_rich(moon_lon, moon_strength, saturn_strength, dasha=dasha)
            res[key].update(rich_ss)
            # Override summary/severity with rich data if present
            if present:
                res[key]["severity"] = rich_ss["intensity"]["score"]

        # Specialized logic for Rahu
        if key == "rahu":
            houses = report_data.get("chart", {}).get("houses", {})
            rich_rahu = _analyze_rahu_dosha_rich(houses, planet_dict, strength, dasha=dasha)
            res[key].update(rich_rahu)
            if present:
                res[key]["severity"] = rich_rahu["score"]
                res[key]["summary"] = f"Rahu Dosha active in House {rich_rahu['house']} ({rich_rahu['dasha_status']})"

        # Specialized logic for Ketu
        if key == "ketu":
            houses = report_data.get("chart", {}).get("houses", {})
            rich_ketu = _analyze_ketu_dosha_rich(houses, planet_dict, strength, dasha=dasha)
            res[key].update(rich_ketu)
            if present:
                res[key]["severity"] = rich_ketu["score"]
                res[key]["summary"] = f"Ketu Dosha active in House {rich_ketu['house']} ({rich_ketu['dasha_status']})"

        # Specialized logic for Kalsarp
        if key == "kalsarp":
            houses = report_data.get("chart", {}).get("houses", {})
            rich_k = _analyze_kalsarp_dosha_rich(houses, planet_dict, strength, dasha=dasha)
            res[key].update(rich_k)
            if present:
                res[key]["severity"] = rich_k["score"]
                res[key]["summary"] = f"{rich_k['type']} Alignment detected."

        # Specialized logic for Pitra
        if key == "pitra":
            houses = report_data.get("chart", {}).get("houses", {})
            rich_p = _analyze_pitra_dosha_rich(houses, planet_dict, strength, dasha=dasha)
            res[key].update(rich_p)
            if present:
                res[key]["severity"] = rich_p["score"]
                res[key]["summary"] = f"{rich_p['type']} detected (Score: {rich_p['score']})"

        # Specialized logic for Manglik
        if key == "manglik":
            houses = report_data.get("chart", {}).get("houses", {})
            rich_m = _analyze_manglik_dosha_rich(houses, planet_dict, strength, dasha=dasha)
            res[key].update(rich_m)
            if present:
                res[key]["severity"] = rich_m["score"]
                res[key]["summary"] = f"{rich_m['severity']} Manglik in House {rich_m['house']}"
                if rich_m["is_cancelled"]:
                    res[key]["summary"] += " (Cancelled/Reduced)"
        
    return res
def _analyze_study(houses, planets, strength) -> Any:
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    h2 = houses.get("2", {})
    h4 = houses.get("4", {})
    h5 = houses.get("5", {})
    h9 = houses.get("9", {})
    
    mercury_strength = strength.get("Mercury", {}).get("total", 60.0)
    jupiter_strength = strength.get("Jupiter", {}).get("total", 60.0)
    
    s_score, s_notes = 0, []
    
    # 1. Intelligence (5th House) (30)
    s5, p5 = 15, pnames(h5)
    if any(p in {"Mercury", "Jupiter", "Venus"} for p in p5): s5 += 15; s_notes.append("Benefics in 5th -> Sharp intellect and creative learning")
    if any(p in {"Rahu"} for p in p5): s_notes.append("Rahu in 5th -> Unconventional or technical knowledge focus")
    s_score += max(0, min(30, s5))
    
    # 2. Foundation & Higher Ed (2nd, 4th, 9th) (40)
    s_houses = 20
    if any(p in {"Jupiter"} for p in pnames(h9)): s_houses += 10; s_notes.append("Jupiter influence on 9th -> Strong success in Higher Education")
    if any(p in {"Saturn"} for p in pnames(h4)): s_houses -= 5; s_notes.append("Saturn in 4th -> Hurdles or breaks in early education")
    s_score += max(0, min(40, s_houses))
    
    # 3. Karakas (Mercury/Jupiter) (30)
    s_karaka = round(((mercury_strength + jupiter_strength) / 2 - 40) / 2.5)
    s_score += max(0, min(30, s_karaka))
    if mercury_strength > 75: s_notes.append("Mercury very strong -> Exceptional logical and analytical skills")
    
    final_score = max(0, min(100, s_score))
    label, color = ("Scholar/High Success", "excellent") if final_score >= 80 else ("Stable Learner", "good") if final_score >= 60 else ("Needs Focus", "average") if final_score >= 40 else ("Hurdles", "risk")
    
    remedies = ["Worship Goddess Saraswati", "Recite Gayatri Mantra daily", "Feed green grass to cows (Mercury)", "Respect teachers/Guru (Jupiter)", "Keep your study area clutter-free (North-East)"]
    
    return {
        "score": final_score, "label": label, "color": color, "notes": s_notes,
        "remedies": remedies,
        "fields": ["Science/Tech" if mercury_strength > 70 else "Arts/Commerce", "Research", "Traditional Knowledge"],
        "planets": [
            {"name": "Mercury", "role": "Intelligence/Logic", "strength": f"{mercury_strength:.0f}/150"},
            {"name": "Jupiter", "role": "Wisdom/Specialization", "strength": f"{jupiter_strength:.0f}/150"}
        ],
        "note": "Success in study requires both intelligence (5th) and dedication (Saturn). Balance them for best results."
    }

def _analyze_career(houses, planets, strength, dasha=None) -> Any:
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    h10 = houses.get("10", {})
    h1 = houses.get("1", {})
    h6 = houses.get("6", {})
    
    sun_strength = strength.get("Sun", {}).get("total", 60.0)
    saturn_strength = strength.get("Saturn", {}).get("total", 60.0)
    jupiter_strength = strength.get("Jupiter", {}).get("total", 60.0)
    mercury_strength = strength.get("Mercury", {}).get("total", 60.0)
    
    c_score, c_notes = 0, []
    
    # 1. 10th House (30)
    s10, p10 = 15, pnames(h10)
    if any(p in {"Sun", "Jupiter", "Mars", "Mercury"} for p in p10): s10 += 15; c_notes.append("Strong planets in 10th -> High career visibility and status")
    if any(p in {"Saturn", "Rahu"} for p in p10): c_notes.append("Saturn/Rahu in 10th -> Success through hard work and unconventional methods")
    c_score += max(0, min(30, s10))
    
    # 2. Sun & Saturn (Authority vs Service) (25)
    s_karaka = round(((sun_strength + saturn_strength) / 2 - 40) / 2.5)
    c_score += max(0, min(25, s_karaka))
    if sun_strength > 75: c_notes.append("Sun strong -> Excellent potential for Government or Leadership roles")
    if saturn_strength > 75: c_notes.append("Saturn strong -> Stability and growth in Service or technical fields")
    
    # 3. Success Potential (Dasha/Transit) (25)
    s_timing = 15
    if dasha:
        cm = dasha.get("mahadasha", {}).get("planet", "")
        if cm in {"Sun", "Jupiter", "Mars"}: s_timing += 10; c_notes.append(f"{cm} Dasha active -> Period of career elevation")
    c_score += max(0, min(25, s_timing))
    
    # 4. Professional Skill (Mercury/Jupiter) (20)
    s_skill = round(((mercury_strength + jupiter_strength) / 2 - 40) / 4)
    c_score += max(0, min(20, s_skill))
    
    final_score = max(0, min(100, c_score))
    label, color = ("High Authority", "excellent") if final_score >= 80 else ("Stable Success", "good") if final_score >= 60 else ("Moderate Growth", "average") if final_score >= 40 else ("Struggle/Shift", "risk")
    
    remedies = ["Offer water to Sun daily", "Wear professional attire to boost Sun/Mercury", "Help the needy on Saturdays (Saturn)", "Keep your workspace clutter-free", "Consult mentors regularly"]
    
    return {
        "score": final_score, "label": label, "color": color, "notes": c_notes,
        "remedies": remedies,
        "recommendations": ["Govt/Mgt" if sun_strength > 70 else "Service/Tech" if saturn_strength > 70 else "Business/Trade"],
        "planets": [
            {"name": "Sun", "role": "Authority/Status", "strength": f"{sun_strength:.0f}/150"},
            {"name": "Saturn", "role": "Work/Stability", "strength": f"{saturn_strength:.0f}/150"}
        ],
        "note": "10th house is your Karma-sthana. Your actions today define your position tomorrow."
    }
def _analyze_finance(houses, planets, strength, dasha=None) -> Any:
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    h2 = houses.get("2", {})
    h11 = houses.get("11", {})
    h9 = houses.get("9", {})
    h8 = houses.get("8", {})
    
    jupiter_strength = strength.get("Jupiter", {}).get("total", 60.0)
    venus_strength = strength.get("Venus", {}).get("total", 60.0)
    mercury_strength = strength.get("Mercury", {}).get("total", 60.0)
    
    f_score, f_notes = 0, []
    
    # 1. 2nd House (Savings) (25)
    s2, p2 = 10, pnames(h2)
    if any(p in {"Jupiter", "Venus", "Moon"} for p in p2): s2 += 15; f_notes.append("Benefics in 2nd -> Strong savings and family wealth potential")
    if any(p in {"Saturn", "Mars", "Rahu"} for p in p2): s2 -= 5; f_notes.append("Malefics in 2nd -> Struggle to accumulate savings or high expenses")
    f_score += max(0, min(25, s2))
    
    # 2. 11th House (Income) (25)
    s11, p11 = 10, pnames(h11)
    if any(p in {"Jupiter", "Venus", "Mercury"} for p in p11): s11 += 15; f_notes.append("Income from multiple sources or high profit potential")
    if any(p in {"Saturn", "Mars", "Rahu"} for p in p11): 
        # Actually malefics in 11th are often good for gains in modern world
        s11 += 5; f_notes.append("Hard work or unconventional methods bring steady gains")
    f_score += max(0, min(25, s11))
    
    # 3. Jupiter Strength (Karaka for Wealth) (20)
    s_jup = round((jupiter_strength - 40) / 3)
    f_score += max(0, min(20, s_jup))
    if jupiter_strength < 50: f_notes.append("Jupiter weak -> Wisdom in financial planning needed")
    
    # 4. Venus Strength (Luxury) (15)
    s_ven = round((venus_strength - 40) / 4)
    f_score += max(0, min(15, s_ven))
    if venus_strength > 75: f_notes.append("Venus strong -> Prosperity through arts, media, or luxury sectors")
    
    # 5. 9th House (Fortune) (15)
    s9, p9 = 8, pnames(h9)
    if any(p in {"Jupiter", "Venus", "Sun"} for p in p9): s9 += 7; f_notes.append("Bhagya (Fortune) supports financial growth")
    f_score += max(0, min(15, s9))
    
    # Sudden Gains Check (8th House)
    if any(p in {"Jupiter", "Rahu"} for p in pnames(h8)):
        f_notes.append("8th house influence -> Potential for inheritance or sudden windfalls")
    
    final_score = max(0, min(100, f_score))
    label, color = ("Wealthy/Prosperous", "excellent") if final_score >= 80 else ("Stable/Growth", "good") if final_score >= 60 else ("Moderate/Balanced", "average") if final_score >= 40 else ("Financial Stress", "risk")
    
    remedies = ["Worship Lord Kubera and Lakshmi", "Donate Yellow items on Thursday", "Invest in Gold or stable assets", "Maintain a 'Gullak' or savings box in North", "Help those in need to increase flow"]
    
    return {
        "score": final_score, "label": label, "color": color, "notes": f_notes,
        "remedies": remedies,
        "wealth_sources": ["Professional Service" if mercury_strength > 65 else "Business/Trade", "Investments", "Traditional Assets"],
        "planets": [
            {"name": "Jupiter", "role": "Karaka for Wealth", "strength": f"{jupiter_strength:.0f}/150"},
            {"name": "Venus", "role": "Prosperity & Luxury", "strength": f"{venus_strength:.0f}/150"}
        ],
        "note": "Wealth is the result of Karma and Planning. 11th house gains are activated by your social circle."
    }

def _analyze_marriage(houses, planets, strength, d9, dasha=None) -> Dict[str, Any]:
    SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
             "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    SIGN_LORDS = {
        0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
        4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
        8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"
    }

    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    def get_house(h_num):
        return houses.get(str(h_num)) or houses.get(int(h_num)) or {}

    def get_house_for_planet(p_name):
        for h_num, h_data in houses.items():
            if p_name in pnames(h_data):
                return int(h_num)
        return None

    delay_factors = 0
    early_factors = 0

    # ── STEP 1: 7th House ──────────────────────────────────────────────────────
    h7 = get_house(7)
    h7_planets = pnames(h7)
    h7_sign_idx = h7.get("sign_index")
    if h7_sign_idx is None and h7.get("cusp_deg") is not None:
        h7_sign_idx = int(h7["cusp_deg"] / 30)
    h7_sign = SIGNS[h7_sign_idx] if h7_sign_idx is not None else "Unknown"

    seventh_house_notes = []
    if "Saturn" in h7_planets or "Rahu" in h7_planets:
        delay_factors += 2
        seventh_house_notes.append("Saturn/Rahu in 7th → Delayed or unconventional marriage")
    if "Mars" in h7_planets:
        delay_factors += 1
        seventh_house_notes.append("Mars in 7th (Manglik) → Needs Manglik matching")
    if "Jupiter" in h7_planets or "Venus" in h7_planets:
        early_factors += 2
        seventh_house_notes.append("Jupiter/Venus in 7th → Smooth and timely marriage")
    if "Moon" in h7_planets:
        early_factors += 1
        seventh_house_notes.append("Moon in 7th → Emotional and popular match")
    if not seventh_house_notes:
        seventh_house_notes.append("Empty 7th house — judge by 7th lord strength")

    # ── STEP 2: 7th Lord ───────────────────────────────────────────────────────
    seventh_lord = SIGN_LORDS.get(h7_sign_idx, "Unknown") if h7_sign_idx is not None else "Unknown"
    seventh_lord_house = get_house_for_planet(seventh_lord)

    if seventh_lord_house in [1, 5, 7, 11]:
        early_factors += 2
        lord_placement = f"{seventh_lord} (7th lord) in House {seventh_lord_house} → Early/timely marriage"
    elif seventh_lord_house in [6, 8, 12]:
        delay_factors += 2
        lord_placement = f"{seventh_lord} (7th lord) in House {seventh_lord_house} → Delay in marriage"
    elif seventh_lord_house:
        lord_placement = f"{seventh_lord} (7th lord) in House {seventh_lord_house} → Normal timing (25–32)"
    else:
        lord_placement = f"{seventh_lord} (7th lord) — house placement not determined"

    if seventh_lord_house:
        h_of_lord = get_house(seventh_lord_house)
        if "Saturn" in pnames(h_of_lord):
            delay_factors += 2
            lord_placement += " + Saturn conjunction → Strong delay (30+)"

    # ── STEP 3: Karakas (Venus & Jupiter) ─────────────────────────────────────
    venus_strength = strength.get("Venus", {}).get("total", 60.0)
    jupiter_strength = strength.get("Jupiter", {}).get("total", 60.0)
    karaka_notes = []

    if venus_strength > 70:
        early_factors += 1
        karaka_notes.append(f"Venus strong ({venus_strength:.0f}/150) → Timely marriage (male natives)")
    elif venus_strength < 50:
        delay_factors += 1
        karaka_notes.append(f"Venus weak ({venus_strength:.0f}/150) → Relationship challenges")
    else:
        karaka_notes.append(f"Venus moderate ({venus_strength:.0f}/150) → Normal timing")

    if jupiter_strength > 70:
        early_factors += 1
        karaka_notes.append(f"Jupiter strong ({jupiter_strength:.0f}/150) → Auspicious for female natives")
    elif jupiter_strength < 50:
        delay_factors += 1
        karaka_notes.append(f"Jupiter weak ({jupiter_strength:.0f}/150) → Delay or challenge for female natives")
    else:
        karaka_notes.append(f"Jupiter moderate ({jupiter_strength:.0f}/150) → Balanced timing")

    # ── STEP 4: Dasha Activation ───────────────────────────────────────────────
    marriage_planets = {seventh_lord, "Venus", "Jupiter"}
    dasha_note = "Dasha data unavailable — regenerate worksheet for Dasha analysis"
    current_maha = ""
    current_antar = ""

    if dasha:
        current_maha = dasha.get("mahadasha", {}).get("planet", "") or ""
        current_antar = dasha.get("antardasha", {}).get("planet", "") or ""
        maha_ok = current_maha in marriage_planets
        antar_ok = current_antar in marriage_planets

        if maha_ok and antar_ok:
            dasha_note = f"✅ PRIME WINDOW: {current_maha} Mahadasha + {current_antar} Antardasha → Marriage highly likely NOW"
            early_factors += 3
        elif maha_ok or antar_ok:
            active = current_maha if maha_ok else current_antar
            dasha_note = f"🟡 MODERATE: {active} period active → Marriage possible in this phase"
            early_factors += 1
        else:
            dasha_note = f"⚠️ {current_maha}/{current_antar} not a primary marriage Dasha — wait for {seventh_lord}/Venus/Jupiter period"
            delay_factors += 1

    # ── STEP 5: Navamsa (D9) Confirmation ─────────────────────────────────────
    navamsa_note = "Navamsa (D9) data unavailable — chart may need recalculation"
    if d9:
        d9_houses = d9.get("houses", {})
        d9_h7 = d9_houses.get("7", {})
        d9_7th_planets = pnames(d9_h7) if d9_h7 else []
        if "Jupiter" in d9_7th_planets or "Venus" in d9_7th_planets:
            navamsa_note = "✅ Strong D9: Jupiter/Venus in D9 7th → Marriage confirmed with excellent quality"
            early_factors += 1
        elif "Saturn" in d9_7th_planets or "Rahu" in d9_7th_planets:
            navamsa_note = "⚠️ Weak D9: Saturn/Rahu in D9 7th → Delays or complications even if D1 is good"
            delay_factors += 1
        else:
            navamsa_note = "🟡 Neutral D9: No strong confirmation or negation from Navamsa"

    # ── STEP 6: Age Classification ─────────────────────────────────────────────
    if delay_factors >= 4:
        age_range = "32+ वर्ष"
        age_en = "32+ years (Late)"
        classification = "late"
        classification_note = "🔴 Saturn influence dominant — marriage will be stable but significantly delayed"
    elif early_factors >= 4 and delay_factors <= 1:
        age_range = "22–27 वर्ष"
        age_en = "22–27 years (Early)"
        classification = "early"
        classification_note = "🟢 Strong Venus/Jupiter & Dasha support — timely and auspicious union"
    else:
        age_range = "27–32 वर्ष"
        age_en = "27–32 years (Normal)"
        classification = "normal"
        classification_note = "🟡 Balanced chart — marriage at right time with proper effort"

    # Matching signs based on 7th lord
    matching_map = {
        "Venus": "Taurus, Libra, Pisces",
        "Jupiter": "Sagittarius, Pisces, Cancer",
        "Mars": "Aries, Scorpio, Capricorn",
        "Moon": "Cancer, Taurus",
        "Mercury": "Gemini, Virgo",
        "Sun": "Leo, Aries",
        "Saturn": "Capricorn, Aquarius, Libra",
    }
    matching = matching_map.get(seventh_lord, "Taurus, Libra, or Pisces")


    # -- OUTCOME SCORE ENGINE --
    BENEFICS = {"Jupiter", "Venus", "Mercury", "Moon"}
    MALEFICS = {"Mars", "Saturn", "Rahu", "Ketu", "Sun"}
    EXALTED = {"Sun": 0, "Moon": 1, "Mars": 9, "Mercury": 5, "Jupiter": 3, "Venus": 11, "Saturn": 6}
    DEBILITATED = {"Sun": 6, "Moon": 7, "Mars": 3, "Mercury": 11, "Jupiter": 9, "Venus": 5, "Saturn": 0}

    def get_planet_sign_idx(p_name):
        for h_num, h_data in houses.items():
            if p_name in pnames(h_data):
                si = h_data.get("sign_index")
                if si is None and h_data.get("cusp_deg") is not None:
                    si = int(h_data["cusp_deg"] / 30)
                return si
        return None

    # Component 1: 7th House Score (0-20)
    s_7th = 10
    for p in h7_planets:
        if p in BENEFICS:
            s_7th += 5
        elif p in MALEFICS:
            s_7th -= 5
        p_sign = get_planet_sign_idx(p)
        if p_sign is not None:
            if EXALTED.get(p) == p_sign:
                s_7th += 3
            elif DEBILITATED.get(p) == p_sign:
                s_7th -= 3
    s_7th = max(0, min(20, s_7th))

    # Component 2: 7th Lord Score (0-25)
    s_lord = 10
    lord_sign_idx = get_planet_sign_idx(seventh_lord)
    own_signs = {
        "Mars": [0, 7], "Venus": [1, 6], "Mercury": [2, 5], "Moon": [3],
        "Sun": [4], "Jupiter": [8, 11], "Saturn": [9, 10]
    }
    if lord_sign_idx is not None and lord_sign_idx == EXALTED.get(seventh_lord):
        s_lord += 10
    elif lord_sign_idx is not None and lord_sign_idx in own_signs.get(seventh_lord, []):
        s_lord += 10
    elif lord_sign_idx is not None and lord_sign_idx == DEBILITATED.get(seventh_lord):
        s_lord -= 10
    if seventh_lord_house in [1, 4, 5, 7, 9, 10]:
        s_lord += 8
    elif seventh_lord_house in [6, 8, 12]:
        s_lord -= 8
    if seventh_lord_house:
        h_conj = get_house(seventh_lord_house)
        if "Saturn" in pnames(h_conj) or "Rahu" in pnames(h_conj):
            s_lord -= 5
    s_lord = max(0, min(25, s_lord))

    # Component 3: Karaka Score (0-15)
    v_score = min(10, max(0, round((venus_strength - 40) / 11)))
    j_score = min(10, max(0, round((jupiter_strength - 40) / 11)))
    s_karaka = round((v_score + j_score) / 2 * 1.5)
    s_karaka = max(0, min(15, s_karaka))

    # Component 4: Affliction Score (-20 to 0)
    s_affliction = 0
    if "Mars" in h7_planets:
        s_affliction -= 6
    if "Saturn" in h7_planets:
        s_affliction -= 5
    if "Rahu" in h7_planets or "Ketu" in h7_planets:
        s_affliction -= 6
    if len([p for p in h7_planets if p in MALEFICS]) >= 2:
        s_affliction -= 5
    s_affliction = max(-20, s_affliction)

    # Component 5: Navamsa Score (0-15)
    s_navamsa = 7
    if d9:
        d9_h = d9.get("houses", {})
        d9_7 = pnames(d9_h.get("7", {}))
        if "Jupiter" in d9_7 or "Venus" in d9_7:
            s_navamsa = 13
        elif "Saturn" in d9_7 or "Rahu" in d9_7:
            s_navamsa = 3
        else:
            s_navamsa = 8
    s_navamsa = max(0, min(15, s_navamsa))

    # Component 6: Dasha Score (0-15)
    s_dasha = 0
    if dasha_note.startswith("\u2705"):
        s_dasha = 15
    elif dasha_note.startswith("\U0001f7e1"):
        s_dasha = 8

    outcome_score = s_7th + s_lord + s_karaka + s_affliction + s_navamsa + s_dasha
    outcome_score = max(0, min(100, outcome_score))

    if outcome_score >= 80:
        outcome_label = "Excellent - Happy & Harmonious Marriage"
        outcome_color = "excellent"
    elif outcome_score >= 60:
        outcome_label = "Good - Stable & Supportive Marriage"
        outcome_color = "good"
    elif outcome_score >= 40:
        outcome_label = "Average - Effort & Patience Needed"
        outcome_color = "average"
    elif outcome_score >= 20:
        outcome_label = "Challenging - Significant Hurdles Expected"
        outcome_color = "challenging"
    else:
        outcome_label = "High Risk - Delay / Conflict Risk"
        outcome_color = "risk"

    score_breakdown = {
        "seventh_house": {"score": s_7th, "max": 20, "label": "7th House Planets"},
        "seventh_lord": {"score": s_lord, "max": 25, "label": "7th Lord Strength"},
        "karaka": {"score": s_karaka, "max": 15, "label": "Karaka (Venus/Jupiter)"},
        "affliction": {"score": s_affliction, "max": 0, "label": "Affliction Deductions"},
        "navamsa": {"score": s_navamsa, "max": 15, "label": "Navamsa (D9) Confirm"},
        "dasha": {"score": s_dasha, "max": 15, "label": "Dasha Activation"},
    }

    summary = (
        f"7th House ({h7_sign}): "
        f"{'None' if not h7_planets else ', '.join(h7_planets)}. "
        f"{lord_placement}. "
        f"Venus {venus_strength:.0f}/150 | Jupiter {jupiter_strength:.0f}/150."
    )

    # --- ADVANCED MARRIAGE ANALYSIS INTEGRATION ---
    def get_house_for_planet(p_name):
        for h_num, h_data in houses.items():
            if p_name in pnames(h_data):
                return int(h_num)
        return None

    def get_house_sign_idx(h_num):
        h = houses.get(str(h_num)) or houses.get(int(h_num)) or {}
        si = h.get("sign_index")
        if si is None and h.get("cusp_deg") is not None:
            si = int(h["cusp_deg"] / 30)
        return si

    def get_planet_sign_idx(p_name):
        # Check direct planet dictionary first
        p_obj = planets.get(p_name)
        if isinstance(p_obj, dict):
            if "sign_index" in p_obj and p_obj["sign_index"] is not None:
                return int(p_obj["sign_index"])
            if "longitude" in p_obj and p_obj["longitude"] is not None:
                return int(p_obj["longitude"] / 30)
        h_num = get_house_for_planet(p_name)
        if h_num is not None:
            return get_house_sign_idx(h_num)
        return None

    lagna_sign_idx = get_house_sign_idx(1)
    lagna_lord = SIGN_LORDS.get(lagna_sign_idx, "Unknown") if lagna_sign_idx is not None else "Unknown"
    second_sign_idx = get_house_sign_idx(2)
    second_lord = SIGN_LORDS.get(second_sign_idx, "Unknown") if second_sign_idx is not None else "Unknown"
    seventh_sign_idx = get_house_sign_idx(7)
    eleventh_sign_idx = get_house_sign_idx(11)
    eleventh_lord = SIGN_LORDS.get(eleventh_sign_idx, "Unknown") if eleventh_sign_idx is not None else "Unknown"

    # Jataka Rules
    # Fruitful signs: Taurus (1), Cancer (3), Scorpio (7), Pisces (11) (0-indexed: Aries=0, Taurus=1, etc.)
    fruitful_signs = {1, 3, 7, 11}
    moon_house = get_house_for_planet("Moon")
    benefics = {"Jupiter", "Venus", "Mercury", "Moon"}
    malefics = {"Mars", "Saturn", "Rahu", "Ketu", "Sun"}

    # Load marriage rules JSON
    import os
    import json
    rules_path = os.path.join(os.path.dirname(__file__), "marriage_rules.json")
    try:
        with open(rules_path, "r", encoding="utf-8") as f:
            m_rules_data = json.load(f)
    except Exception:
        m_rules_data = {}

    j_data = m_rules_data.get("jataka_rules", {})
    w_data = m_rules_data.get("western_rules", {})
    d_data = m_rules_data.get("delay_rules", {})
    h_data = m_rules_data.get("happy_rules", {})
    u_data = m_rules_data.get("unhappy_rules", {})
    t_data = m_rules_data.get("partner_traits", {})
    p_data = m_rules_data.get("plurality_rules", {})

    j_rules = []
    # 1. Moon & Venus occupy fruitful signs (Taurus=1, Cancer=3, Scorpio=7, Pisces=11)
    d1_r1 = get_planet_sign_idx("Moon") in fruitful_signs or get_planet_sign_idx("Venus") in fruitful_signs or seventh_sign_idx in fruitful_signs
    d9_r1 = False
    if d9 and d9.get("houses"):
        d9_h7 = d9.get("houses", {}).get("7", {})
        d9_7_sign = d9_h7.get("sign_index")
        if d9_7_sign in fruitful_signs:
            d9_r1 = True
    r1 = d1_r1 or d9_r1
    chart_src1 = "Lagna & D9 Charts" if (d1_r1 and d9_r1) else ("Navamsha (D9) Chart" if d9_r1 else "Lagna (D1) Chart")
    j_rules.append({"id": "j1", "text": j_data.get("j1", ""), "satisfied": bool(r1), "chart": chart_src1})
    
    # 2. Jupiter or Venus in 2, 7, 11
    d1_r2 = get_house_for_planet("Jupiter") in {2, 7, 11} or get_house_for_planet("Venus") in {2, 7, 11}
    d9_r2 = False
    if d9 and d9.get("houses"):
        d9_houses = d9.get("houses", {})
        for h in ["2", "7", "11"]:
            h_p = [p["name"] if isinstance(p, dict) else p for p in d9_houses.get(h, {}).get("planets", [])]
            if "Jupiter" in h_p or "Venus" in h_p:
                d9_r2 = True
                break
    r2 = d1_r2 or d9_r2
    chart_src2 = "Lagna & D9 Charts" if (d1_r2 and d9_r2) else ("Navamsha (D9) Chart" if d9_r2 else "Lagna (D1) Chart")
    j_rules.append({"id": "j2", "text": j_data.get("j2", ""), "satisfied": bool(r2), "chart": chart_src2})

    # 3. Jupiter conjoined Moon in 1, 5, 9
    r3 = get_house_for_planet("Jupiter") == moon_house and get_house_for_planet("Jupiter") in {1, 5, 9}
    j_rules.append({"id": "j3", "text": j_data.get("j3", ""), "satisfied": bool(r3), "chart": "Lagna (D1) Chart"})

    # 4. Venus conjoined Moon in 1, 5, 10, 11, stronger than Sat
    r4 = get_house_for_planet("Venus") == moon_house and get_house_for_planet("Venus") in {1, 5, 10, 11} and strength.get("Venus", {}).get("total", 60.0) > strength.get("Saturn", {}).get("total", 60.0)
    j_rules.append({"id": "j4", "text": j_data.get("j4", ""), "satisfied": bool(r4), "chart": "Lagna (D1) Chart"})

    # 5. Lord of Lagna conjoined lord of 7 in favorable house
    r5 = get_house_for_planet(lagna_lord) == get_house_for_planet(seventh_lord) and get_house_for_planet(lagna_lord) in {1, 4, 5, 7, 9, 10, 11}
    j_rules.append({"id": "j5", "text": j_data.get("j5", ""), "satisfied": bool(r5), "chart": "Lagna (D1) Chart"})

    # 6. Benefics in 2, 7, 11 from Lagna or Moon
    benefic_in_2_7_11 = any(get_house_for_planet(b) in {2, 7, 11} for b in benefics)
    moon_rel_2_7_11 = {(moon_house + 1 - 1) % 12 + 1, (moon_house + 6 - 1) % 12 + 1, (moon_house + 10 - 1) % 12 + 1} if moon_house else set()
    r6 = benefic_in_2_7_11 or (bool(moon_house) and any(get_house_for_planet(b) in moon_rel_2_7_11 for b in benefics))
    j_rules.append({"id": "j6", "text": j_data.get("j6", ""), "satisfied": bool(r6), "chart": "Lagna (D1) Chart"})

    # 7. 2, 7, 11 have favorable connection with benefics
    r7 = any(any(b in pnames(houses.get(str(h), {})) for b in benefics) for h in [2, 7, 11])
    j_rules.append({"id": "j7", "text": j_data.get("j7", ""), "satisfied": bool(r7), "chart": "Lagna (D1) Chart"})

    # 8. Benefic in 7, Lagna Lord & 7th Lord strong/well-posited
    r8 = any(b in h7_planets for b in benefics) and strength.get(lagna_lord, {}).get("total", 60.0) >= 70 and strength.get(seventh_lord, {}).get("total", 60.0) >= 70 and get_house_for_planet(lagna_lord) in {1, 4, 5, 7, 9, 10, 11} and get_house_for_planet(seventh_lord) in {1, 4, 5, 7, 9, 10, 11}
    j_rules.append({"id": "j8", "text": j_data.get("j8", ""), "satisfied": bool(r8), "chart": "Lagna (D1) Chart"})

    # 9. Venus in own (Taurus=1, Libra=6) or exalted sign (Pisces=11), 7th Lord in beneficial house
    d1_r9 = get_planet_sign_idx("Venus") in {1, 6, 11} and get_house_for_planet(seventh_lord) in {1, 4, 5, 7, 9, 10, 11}
    d9_r9 = False
    if d9 and d9.get("houses"):
        d9_h = d9.get("houses", {})
        d9_v_sign = d9_h.get("1", {}).get("sign_index") # check if Venus is dignified in D9
        d9_7_planets = [p["name"] if isinstance(p, dict) else p for p in d9_h.get("7", {}).get("planets", [])]
        if "Venus" in d9_7_planets:
            d9_r9 = True
    r9 = d1_r9 or d9_r9
    chart_src9 = "Lagna & D9 Charts" if (d1_r9 and d9_r9) else ("Navamsha (D9) Chart" if d9_r9 else "Lagna (D1) Chart")
    j_rules.append({"id": "j9", "text": j_data.get("j9", ""), "satisfied": bool(r9), "chart": chart_src9})

    # 10. Mercury in 7, Venus conjoined 7th Lord
    r10 = "Mercury" in h7_planets and get_house_for_planet("Venus") == get_house_for_planet(seventh_lord)
    j_rules.append({"id": "j10", "text": j_data.get("j10", ""), "satisfied": bool(r10), "chart": "Lagna (D1) Chart"})

    # 11. Lord of 7 in 11, Venus in 2
    r11 = get_house_for_planet(seventh_lord) == 11 and get_house_for_planet("Venus") == 2
    j_rules.append({"id": "j11", "text": j_data.get("j11", ""), "satisfied": bool(r11), "chart": "Lagna (D1) Chart"})

    # 12. Venus in Lagna, lord of Lagna in 7
    r12 = get_house_for_planet("Venus") == 1 and get_house_for_planet(lagna_lord) == 7
    j_rules.append({"id": "j12", "text": j_data.get("j12", ""), "satisfied": bool(r12), "chart": "Lagna (D1) Chart"})

    # 13. Mutual exchange of lords of 1 and 7
    r13 = get_house_for_planet(lagna_lord) == 7 and get_house_for_planet(seventh_lord) == 1
    j_rules.append({"id": "j13", "text": j_data.get("j13", ""), "satisfied": bool(r13), "chart": "Lagna (D1) Chart"})

    # 14. Jupiter exalted in 7th conjoined with benefics
    r14 = get_house_for_planet("Jupiter") == 7 and get_planet_sign_idx("Jupiter") == 3 and any(b in h7_planets for b in {"Venus", "Mercury", "Moon"})
    j_rules.append({"id": "j14", "text": j_data.get("j14", ""), "satisfied": bool(r14), "chart": "Lagna (D1) Chart"})

    # 15. Lord of 7 or Venus in 2
    r15 = get_house_for_planet(seventh_lord) == 2 or get_house_for_planet("Venus") == 2
    j_rules.append({"id": "j15", "text": j_data.get("j15", ""), "satisfied": bool(r15), "chart": "Lagna (D1) Chart"})

    # 16. Lagna Lord in 10, 2nd Lord in 11
    r16 = get_house_for_planet(lagna_lord) == 10 and get_house_for_planet(second_lord) == 11
    j_rules.append({"id": "j16", "text": j_data.get("j16", ""), "satisfied": bool(r16), "chart": "Lagna (D1) Chart"})

    # 17. Benefics in 1, 2, 7
    r17 = any(any(b in pnames(houses.get(str(h), {})) for b in benefics) for h in [1, 2, 7])
    j_rules.append({"id": "j17", "text": j_data.get("j17", ""), "satisfied": bool(r17), "chart": "Lagna (D1) Chart"})

    # 18. Lords of 2 and 11 in mutual exchange
    r18 = get_house_for_planet(second_lord) == 11 and get_house_for_planet(eleventh_lord) == 2
    j_rules.append({"id": "j18", "text": j_data.get("j18", ""), "satisfied": bool(r18), "chart": "Lagna (D1) Chart"})

    # 19. Lords of 2 and 7 in 11
    r19 = get_house_for_planet(second_lord) == 11 and get_house_for_planet(seventh_lord) == 11
    j_rules.append({"id": "j19", "text": j_data.get("j19", ""), "satisfied": bool(r19), "chart": "Lagna (D1) Chart"})

    # Western Rules
    w_rules = []
    beneficial_houses = {1, 4, 5, 9, 10, 11}
    wr1 = get_house_for_planet("Moon") in beneficial_houses and get_house_for_planet("Venus") in beneficial_houses
    w_rules.append({"id": "w1", "text": w_data.get("w1", ""), "satisfied": bool(wr1), "chart": "Lagna (D1) Chart"})
    wr2 = get_house_for_planet("Sun") in beneficial_houses and get_house_for_planet("Mars") in beneficial_houses
    w_rules.append({"id": "w2", "text": w_data.get("w2", ""), "satisfied": bool(wr2), "chart": "Lagna (D1) Chart"})
    wr3 = any(get_house_for_planet(b) in {6, 12} for b in {"Jupiter", "Venus"})
    w_rules.append({"id": "w3", "text": w_data.get("w3", ""), "satisfied": bool(wr3), "chart": "Lagna (D1) Chart"})

    # Delay Rules
    d_rules = []
    d1_dr1 = get_house_for_planet("Saturn") in {1, 3, 5, 7, 10}
    d9_dr1 = False
    if d9 and d9.get("houses"):
        d9_houses = d9.get("houses", {})
        for h in ["1", "3", "5", "7", "10"]:
            if "Saturn" in [p["name"] if isinstance(p, dict) else p for p in d9_houses.get(h, {}).get("planets", [])]:
                d9_dr1 = True
                break
    dr1 = d1_dr1 or d9_dr1
    chart_src_d1 = "Lagna & D9 Charts" if (d1_dr1 and d9_dr1) else ("Navamsha (D9) Chart" if d9_dr1 else "Lagna (D1) Chart")
    d_rules.append({"id": "d1", "text": d_data.get("d1", ""), "satisfied": bool(dr1), "chart": chart_src_d1})

    dr2 = any(m in h7_planets for m in malefics)
    d_rules.append({"id": "d2", "text": d_data.get("d2", ""), "satisfied": bool(dr2), "chart": "Lagna (D1) Chart"})
    dr3 = get_house_for_planet("Mars") == 8
    d_rules.append({"id": "d3", "text": d_data.get("d3", ""), "satisfied": bool(dr3), "chart": "Lagna (D1) Chart"})
    dr4 = get_house_for_planet("Moon") == get_house_for_planet("Saturn") and get_house_for_planet("Moon") in {1, 2, 7}
    d_rules.append({"id": "d4", "text": d_data.get("d4", ""), "satisfied": bool(dr4), "chart": "Lagna (D1) Chart"})
    dr5 = get_house_for_planet("Mars") == get_house_for_planet("Venus") and get_house_for_planet("Mars") in {5, 7, 9}
    d_rules.append({"id": "d5", "text": d_data.get("d5", ""), "satisfied": bool(dr5), "chart": "Lagna (D1) Chart"})
    dr6 = get_house_for_planet("Saturn") == get_house_for_planet(seventh_lord) or get_house_for_planet("Saturn") == get_house_for_planet("Venus")
    d_rules.append({"id": "d6", "text": d_data.get("d6", ""), "satisfied": bool(dr6), "chart": "Lagna (D1) Chart"})
    m_h = get_house_for_planet("Moon")
    v_h = get_house_for_planet("Venus")
    dr7 = m_h is not None and v_h is not None and abs(m_h - v_h) in {3, 9}
    d_rules.append({"id": "d7", "text": d_data.get("d7", ""), "satisfied": bool(dr7), "chart": "Lagna (D1) Chart"})

    # Punarphoo
    sat_house = get_house_for_planet("Saturn")
    punarphoo = False
    if sat_house is not None and moon_house is not None:
        diff = abs(sat_house - moon_house)
        if diff in {0, 2, 6, 9}:
            punarphoo = True

    # State of married life
    if any(b in h7_planets for b in {"Jupiter", "Venus"}) and not any(m in h7_planets for m in {"Mars", "Saturn", "Rahu", "Ketu"}):
        married_state_desc = "A harmonious one promising an inseparable temperament."
    elif ("Saturn" in h7_planets or "Ketu" in h7_planets) and not any(b in h7_planets for b in {"Jupiter", "Venus"}):
        married_state_desc = "The couple without any attachment, simply to maintain the prestige of the family, manage to live in the same premises."
    elif ("Mars" in h7_planets or "Rahu" in h7_planets) and any(m in h7_planets for m in {"Saturn", "Sun", "Mars"}):
        married_state_desc = "To lead the life like cat and rats especially during daytime, even though the couple may become the parents of many children."
    else:
        married_state_desc = "To be going on marrying and divorcing (high instability/dual sign vulnerability)."

    # Cusp lord pleasure tendencies from JSON
    cusp_pleasure_desc = m_rules_data.get("cusp_pleasure", {}).get(seventh_lord, m_rules_data.get("cusp_pleasure", {}).get("default", ""))

    # Partner age difference from JSON
    partner_age_diff_desc = m_rules_data.get("partner_age_diff", {}).get(seventh_lord, m_rules_data.get("partner_age_diff", {}).get("default", ""))

    # Partner Locality & Meeting Place based on 7th Lord house placement
    seventh_lord_house = get_house_for_planet(seventh_lord)
    if seventh_lord_house in {4, 10}:
        partner_locality_desc = m_rules_data.get("partner_locality", {}).get("house_4_10", "Co-tenant or living in the same town/street.")
    elif seventh_lord_house == 3:
        partner_locality_desc = m_rules_data.get("partner_locality", {}).get("house_3", "Cousin, neighbor, or met through short travel or correspondence.")
    elif seventh_lord_house == 11:
        partner_locality_desc = m_rules_data.get("partner_locality", {}).get("house_11", "Introduced through a friend's family or social circle.")
    elif seventh_lord_house in {5, 9}:
        partner_locality_desc = m_rules_data.get("partner_locality", {}).get("house_5_9", "Stranger, love marriage, foreigner, or long distance meeting.")
    else:
        partner_locality_desc = "Spouse comes from standard local or familiar family connections."

    # Spouse Professional Domain Analysis
    fourth_lord = SIGN_LORDS.get(get_house_sign_idx(4))
    eighth_lord = SIGN_LORDS.get(get_house_sign_idx(8))
    twelfth_lord = SIGN_LORDS.get(get_house_sign_idx(12))
    prof_houses = {4, 8, 12}
    mars_in_prof = get_house_for_planet("Mars") in prof_houses or get_house_for_planet(fourth_lord) == 8 or get_house_for_planet(eighth_lord) == 12
    if mars_in_prof:
        partner_profession_desc = m_rules_data.get("partner_profession", {}).get("career_wife", "Career-oriented partner / active in corporate, technical or executive domain.")
    else:
        partner_profession_desc = f"Spouse career governed by Houses 4, 8, 12 significators ({fourth_lord or '4th Lord'}, {eighth_lord or '8th Lord'}, {twelfth_lord or '12th Lord'})."

    # Partner Physical Features & Appearance from JSON
    sublord_features = m_rules_data.get("seventh_cusp_sublord_features", {})
    partner_appearance_features = sublord_features.get(seventh_lord, {}).get(
        h7_sign, 
        f"Partner physical traits governed by {seventh_lord} in {h7_sign}."
    )

    # Love Marriage & Marrying Your Beloved Analysis
    fifth_lord = SIGN_LORDS.get(get_house_sign_idx(5))
    is_5th_7th_connected = (get_house_for_planet(fifth_lord) == 7 or get_house_for_planet(seventh_lord) == 5 or get_house_for_planet(fifth_lord) == get_house_for_planet(seventh_lord)) if fifth_lord else False
    is_love_marriage_locality = (seventh_lord_house in {5, 9})
    is_blessed_7th = (get_house_for_planet("Venus") not in {6, 10, 12}) and any(b in h7_planets for b in {"Jupiter", "Venus", "Moon"})
    has_breakup_warning = ("Saturn" in h7_planets or "Mars" in h7_planets or abs((get_house_for_planet("Moon") or 0) - (get_house_for_planet("Jupiter") or 0)) in {3, 9})

    if is_5th_7th_connected or (is_love_marriage_locality and is_blessed_7th):
        love_status_title = "💖 High Potential for Marrying the Person You Love"
        love_status_desc = "Strong 5th House (Romance) and 7th House (Marriage) connection! Your chart strongly supports marrying your chosen beloved with mutual joy."
    elif is_love_marriage_locality:
        love_status_title = "💞 Love Marriage / Independent Choice Signature"
        love_status_desc = "7th Lord in 5th/9th indicates personal choice and romantic attraction in spouse selection."
    elif has_breakup_warning:
        love_status_title = "⚠️ Emotional Adjustment & Patience Required in Romance"
        love_status_desc = "Planetary tension alerts to manage communication and seek elder guidance to navigate emotional hurdles in romance."
    else:
        love_status_title = "💍 Conventional / Family Blessed Marriage Alignment"
        love_status_desc = "Your chart favors a well-balanced, family-supported arrangement with steady post-marital affection."

    love_marriage_analysis = {
        "status_title": love_status_title,
        "status_desc": love_status_desc,
        "is_5th_7th_connected": is_5th_7th_connected,
        "is_love_locality": is_love_marriage_locality,
        "is_blessed_7th": is_blessed_7th,
        "has_breakup_warning": has_breakup_warning,
        "key_rules": [
            {
                "title": "💞 5th & 7th Lords Connection (Love to Marriage Conversion)",
                "meaning": "Astrological Meaning: When the 5th Lord (lover/sweetheart) connects with the 7th Lord (marriage) or Lagna Lord, love turns into marriage. The person you love becomes your wedded spouse with mutual family approval.",
                "kundali_status": f"In your Kundali: {'Active! Your chart indicates high potential to marry the person you love.' if is_5th_7th_connected else 'Neutral. Romance turns to marriage via general planetary Dashas.'}"
            },
            {
                "title": "📍 Meeting Locality & Self-Choice Signature (Houses 5/9)",
                "meaning": "Astrological Meaning: If 7th Lord resides in 5th or 9th house, it signifies meeting spouse through romance, personal choice, higher learning, or long-distance travel.",
                "kundali_status": f"In your Kundali: {'Active! Spousal placement confirms self-choice / romantic meeting.' if is_love_marriage_locality else 'Familiar. Indicates conventional or family-introduced meeting.'}"
            },
            {
                "title": "💖 Romantically Blessed 7th House (Venus/Jupiter Harmony)",
                "meaning": "Astrological Meaning: Benefic Jupiter or Venus aspecting 7th house ensures unhindered affection, high marital dignity, and smooth marriage ceremonies.",
                "kundali_status": f"In your Kundali: {'Active! 7th House receives divine benefic protection.' if is_blessed_7th else 'Standard. Relationship harmony relies on active Dasha periods.'}"
            },
            {
                "title": "⚠️ Breakup & Friction Warning Filter (Malefic / Square Aspects)",
                "meaning": "Astrological Meaning: Malefics or square aspects in 7th/Moon house warn of sudden emotional misunderstandings requiring calm communication and remedies.",
                "kundali_status": f"In your Kundali: {'Tension Present. Spiritual remedies & calm dialogue advised.' if has_breakup_warning else 'Clear & Unafflicted! Free from major breakup afflictions.'}"
            }
        ]
    }

    # KP & Classical Divorce / Separation Diagnostic
    sixth_lord = SIGN_LORDS.get(get_house_sign_idx(6))
    tenth_lord = SIGN_LORDS.get(get_house_sign_idx(10))
    twelfth_lord = SIGN_LORDS.get(get_house_sign_idx(12))

    # KP Negating Houses for Marriage: 1 (Lagna/Self), 6 (Separation/Legal Dispute), 10 (Loss of 11th gain/Status separation)
    is_6_10_12_connected = (get_house_for_planet(seventh_lord) in {6, 10, 12}) or (get_house_for_planet("Venus") in {6, 10, 12})
    has_dual_sign_sublord = (seventh_sign_idx in {2, 5, 8, 11}) and any(m in h7_planets for m in malefics)
    has_permanent_friction = any(m in h7_planets for m in malefics) and (get_house_for_planet(sixth_lord) == 7 or get_house_for_planet(tenth_lord) == 7) if (sixth_lord and tenth_lord) else False

    if is_6_10_12_connected or has_permanent_friction:
        divorce_risk_title = "⚠️ Separation / Legal Dispute Vulnerability (Houses 6, 10, 12 Active)"
        divorce_risk_desc = "7th Lord or significators connect to separation houses (6/10/12). Careful partner matching and planetary remedies are recommended to maintain harmony."
    elif has_dual_sign_sublord:
        divorce_risk_title = "🔄 Dual Sign / Marital Restructuring Signature"
        divorce_risk_desc = "7th house in a dual sign with malefic influence indicates potential marital restructuring or secondary union considerations."
    else:
        divorce_risk_title = "🛡️ High Marital Stability & Low Separation Risk"
        divorce_risk_desc = "Your chart is free from major 6th/10th house separation signatures. Marriage is protected against legal divorce."

    divorce_separation_analysis = {
        "status_title": divorce_risk_title,
        "status_desc": divorce_risk_desc,
        "is_6_10_12_connected": is_6_10_12_connected,
        "has_dual_sign_sublord": has_dual_sign_sublord,
        "has_permanent_friction": has_permanent_friction,
        "key_rules": [
            {
                "title": "⚖️ KP Separation Houses Connection (Houses 6 & 10)",
                "meaning": "Astrological Meaning: In KP Astrology, House 6 (separation/litigation) and House 10 (loss of 11th fulfillment) act as negating houses for the 7th house (marriage). Placement of 7th Lord in 6/10 causes legal separation.",
                "kundali_status": f"In your Kundali: {'Active! 7th Lord/Venus connects to 6/10/12 houses (remedies advised).' if is_6_10_12_connected else 'Clear! 7th Lord is free from 6/10 separation negations.'}"
            },
            {
                "title": "⚡ Permanent Domestic Friction Signature (U9 Rule)",
                "meaning": "Astrological Meaning: Malefics in the 7th house connected to 6th or 10th house lords indicate chronic temperament differences or temporary living in separate premises.",
                "kundali_status": f"In your Kundali: {'Tension Present! Open communication and marital counseling recommended.' if has_permanent_friction else 'Harmonious! Free from chronic U9 friction signatures.'}"
            },
            {
                "title": "🔄 Dual Sign Sublord Restructuring (P8 Rule)",
                "meaning": "Astrological Meaning: Sublord of 7th cusp placed in dual sign (Gemini, Virgo, Sagittarius, Pisces) with malefic aspects indicates potential for marital restructuring or second marriage.",
                "kundali_status": f"In your Kundali: {'Active! Dual sign placement suggests multi-stage marital journey.' if has_dual_sign_sublord else 'Stable! Fixed/Moveable sign placement promotes single unified marriage.'}"
            },
            {
                "title": "🛡️ Benefic Ward-Off Factor (Jupiter / Venus Protection)",
                "meaning": "Astrological Meaning: Benefic Jupiter or Venus aspecting 2nd or 7th house wards off evil malefic afflictions and prevents permanent divorce breakdown.",
                "kundali_status": f"In your Kundali: {'Protected! Strong benefic presence shields marriage from legal dissolution.' if is_blessed_7th else 'Standard! Periodic remedy performance ensures long-term bonding.'}"
            }
        ]
    }

    # --- PHASE 2 ADDITIONAL RULES ---
    happy_rules = []
    d1_h1 = (get_house_for_planet("Jupiter") in {2, 7, 11} or get_house_for_planet("Venus") in {2, 7, 11}) or seventh_lord in {"Jupiter", "Venus"}
    d9_h1 = False
    if d9 and d9.get("houses"):
        d9_houses = d9.get("houses", {})
        for h in ["2", "7", "11"]:
            h_p = [p["name"] if isinstance(p, dict) else p for p in d9_houses.get(h, {}).get("planets", [])]
            if "Jupiter" in h_p or "Venus" in h_p:
                d9_h1 = True
                break
    h1 = d1_h1 or d9_h1
    chart_src_h1 = "Lagna & D9 Charts" if (d1_h1 and d9_h1) else ("Navamsha (D9) Chart" if d9_h1 else "Lagna (D1) Chart")
    happy_rules.append({"id": "h1", "text": h_data.get("h1", ""), "satisfied": bool(h1), "chart": chart_src_h1})
    
    h2 = any(p in h7_planets for p in {"Mercury", "Moon", "Sun"}) and any(b in pnames(get_house(11)) for b in benefics)
    happy_rules.append({"id": "h2", "text": h_data.get("h2", ""), "satisfied": bool(h2), "chart": "Lagna (D1) Chart"})

    h3 = get_house_for_planet("Sun") == 7 and get_house_for_planet("Moon") == 1
    happy_rules.append({"id": "h3", "text": h_data.get("h3", ""), "satisfied": bool(h3), "chart": "Lagna (D1) Chart"})

    h4 = (get_house_for_planet("Sun") == 7 or get_house_for_planet("Moon") == 7) and (get_house_for_planet("Jupiter") in {1, 3, 11} or get_house_for_planet("Venus") in {1, 3, 11})
    happy_rules.append({"id": "h4", "text": h_data.get("h4", ""), "satisfied": bool(h4), "chart": "Lagna (D1) Chart"})

    h5 = get_house_for_planet("Venus") in beneficial_houses and get_house_for_planet("Mars") in beneficial_houses
    happy_rules.append({"id": "h5", "text": h_data.get("h5", ""), "satisfied": bool(h5), "chart": "Lagna (D1) Chart"})

    d1_h6 = get_house_for_planet("Moon") in beneficial_houses and any(p in beneficial_houses for p in [get_house_for_planet("Venus"), get_house_for_planet("Jupiter")])
    d9_h6 = False
    if d9 and d9.get("houses"):
        d9_houses = d9.get("houses", {})
        d9_7_planets = [p["name"] if isinstance(p, dict) else p for p in d9_houses.get("7", {}).get("planets", [])]
        if "Jupiter" in d9_7_planets or "Venus" in d9_7_planets:
            d9_h6 = True
    h6 = d1_h6 or d9_h6
    chart_src_h6 = "Lagna & D9 Charts" if (d1_h6 and d9_h6) else ("Navamsha (D9) Chart" if d9_h6 else "Lagna (D1) Chart")
    happy_rules.append({"id": "h6", "text": h_data.get("h6", ""), "satisfied": bool(h6), "chart": chart_src_h6})

    d1_h7 = any(b in h7_planets for b in benefics) or SIGN_LORDS.get(seventh_sign_idx) in benefics
    d9_h7_flag = False
    if d9 and d9.get("houses"):
        d9_7_p = [p["name"] if isinstance(p, dict) else p for p in d9.get("houses", {}).get("7", {}).get("planets", [])]
        if any(b in d9_7_p for b in benefics):
            d9_h7_flag = True
    h7 = d1_h7 or d9_h7_flag
    chart_src_h7 = "Lagna & D9 Charts" if (d1_h7 and d9_h7_flag) else ("Navamsha (D9) Chart" if d9_h7_flag else "Lagna (D1) Chart")
    happy_rules.append({"id": "h7", "text": h_data.get("h7", ""), "satisfied": bool(h7), "chart": chart_src_h7})

    h8 = get_house_for_planet("Venus") not in {6, 10, 12}
    happy_rules.append({"id": "h8", "text": h_data.get("h8", ""), "satisfied": bool(h8), "chart": "Lagna (D1) Chart"})

    unhappy_rules = []
    u1 = abs((get_house_for_planet("Sun") or 0) - (get_house_for_planet("Moon") or 0)) in {3, 9} and (get_house_for_planet("Sun") in {2, 7, 11} or get_house_for_planet("Moon") in {2, 7, 11})
    unhappy_rules.append({"id": "u1", "text": u_data.get("u1", ""), "satisfied": bool(u1), "chart": "Lagna (D1) Chart"})

    u2 = any(m in h7_planets for m in malefics) and any(get_house_for_planet(m) in {6, 10, 12} for m in malefics)
    unhappy_rules.append({"id": "u2", "text": u_data.get("u2", ""), "satisfied": bool(u2), "chart": "Lagna (D1) Chart"})

    u3 = "Mars" in h7_planets and abs((get_house_for_planet("Mars") or 0) - (get_house_for_planet("Uranus") or 0)) in {3, 9}
    unhappy_rules.append({"id": "u3", "text": u_data.get("u3", ""), "satisfied": bool(u3), "chart": "Lagna (D1) Chart"})

    u4 = any(p in h7_planets for p in {"Moon", "Saturn", "Mars"}) and len(set(get_house_for_planet(p) for p in {"Moon", "Saturn", "Mars"} if get_house_for_planet(p) is not None)) >= 2
    unhappy_rules.append({"id": "u4", "text": u_data.get("u4", ""), "satisfied": bool(u4), "chart": "Lagna (D1) Chart"})

    d1_u5 = "Saturn" in h7_planets
    d9_u5 = False
    if d9 and d9.get("houses"):
        d9_7_p = [p["name"] if isinstance(p, dict) else p for p in d9.get("houses", {}).get("7", {}).get("planets", [])]
        if "Saturn" in d9_7_p:
            d9_u5 = True
    u5 = d1_u5 or d9_u5
    chart_src_u5 = "Lagna & D9 Charts" if (d1_u5 and d9_u5) else ("Navamsha (D9) Chart" if d9_u5 else "Lagna (D1) Chart")
    unhappy_rules.append({"id": "u5", "text": u_data.get("u5", ""), "satisfied": bool(u5), "chart": chart_src_u5})

    u6 = abs((get_house_for_planet("Moon") or 0) - (get_house_for_planet("Jupiter") or 0)) in {3, 9}
    unhappy_rules.append({"id": "u6", "text": u_data.get("u6", ""), "satisfied": bool(u6), "chart": "Lagna (D1) Chart"})

    u7 = abs((get_house_for_planet("Mars") or 0) - (get_house_for_planet("Venus") or 0)) in {3, 5, 9}
    unhappy_rules.append({"id": "u7", "text": u_data.get("u7", ""), "satisfied": bool(u7), "chart": "Lagna (D1) Chart"})

    u8 = get_house_for_planet("Mars") == get_house_for_planet("Moon") and get_planet_sign_idx("Mars") in {3, 7, 11}
    unhappy_rules.append({"id": "u8", "text": u_data.get("u8", ""), "satisfied": bool(u8), "chart": "Lagna (D1) Chart"})

    u9 = any(m in h7_planets for m in malefics) and any(m in pnames(get_house(11)) for m in malefics)
    unhappy_rules.append({"id": "u9", "text": u_data.get("u9", ""), "satisfied": bool(u9), "chart": "Lagna (D1) Chart"})

    partner_traits = []
    t1 = abs((get_house_for_planet("Venus") or 0) - (get_house_for_planet("Uranus") or 0)) in {3, 9}
    partner_traits.append({"id": "t1", "text": t_data.get("t1", ""), "satisfied": bool(t1), "chart": "Lagna (D1) Chart"})

    t2 = abs((get_house_for_planet("Moon") or 0) - (get_house_for_planet("Venus") or 0)) in {3, 9}
    partner_traits.append({"id": "t2", "text": t_data.get("t2", ""), "satisfied": bool(t2), "chart": "Lagna (D1) Chart"})

    t3 = any(get_house_for_planet(p) in {1, 2, 5, 7, 11} for p in {"Moon", "Venus"})
    partner_traits.append({"id": "t3", "text": t_data.get("t3", ""), "satisfied": bool(t3), "chart": "Lagna (D1) Chart"})

    t4 = get_house_for_planet("Mars") == get_house_for_planet("Venus") or abs((get_house_for_planet("Mars") or 0) - (get_house_for_planet("Venus") or 0)) == 6
    partner_traits.append({"id": "t4", "text": t_data.get("t4", ""), "satisfied": bool(t4), "chart": "Lagna (D1) Chart"})

    t5 = get_house_for_planet("Venus") in {7, 8, 10} and get_house_for_planet("Mercury") in {7, 8, 10}
    partner_traits.append({"id": "t5", "text": t_data.get("t5", ""), "satisfied": bool(t5), "chart": "Lagna (D1) Chart"})

    t6 = get_house_for_planet("Mars") in {7, 10} and get_house_for_planet("Venus") in {7, 10}
    partner_traits.append({"id": "t6", "text": t_data.get("t6", ""), "satisfied": bool(t6), "chart": "Lagna (D1) Chart"})

    t7 = get_house_for_planet("Saturn") == 7 and (get_house_for_planet("Venus") == (moon_house + 9 - 1) % 12 + 1 if moon_house else False)
    partner_traits.append({"id": "t7", "text": t_data.get("t7", ""), "satisfied": bool(t7), "chart": "Lagna (D1) Chart"})

    sixth_lord = SIGN_LORDS.get(get_house_sign_idx(6))
    d1_t8 = get_house_for_planet(sixth_lord) in {6, 8, 12} if sixth_lord else False
    d9_t8 = False
    if d9 and d9.get("houses"):
        d9_h = d9.get("houses", {})
        for h in ["6", "8", "12"]:
            if sixth_lord in [p["name"] if isinstance(p, dict) else p for p in d9_h.get(h, {}).get("planets", [])]:
                d9_t8 = True
                break
    t8 = d1_t8 or d9_t8
    chart_src_t8 = "Lagna & D9 Charts" if (d1_t8 and d9_t8) else ("Navamsha (D9) Chart" if d9_t8 else "Lagna (D1) Chart")
    partner_traits.append({"id": "t8", "text": t_data.get("t8", ""), "satisfied": bool(t8), "chart": chart_src_t8})

    tenth_lord = SIGN_LORDS.get(get_house_sign_idx(10))
    t9 = get_house_for_planet(second_lord) == 10 and get_house_for_planet(seventh_lord) == 10 and get_house_for_planet(tenth_lord) == 10 if tenth_lord else False
    partner_traits.append({"id": "t9", "text": t_data.get("t9", ""), "satisfied": bool(t9), "chart": "Lagna (D1) Chart"})

    t10 = get_house_for_planet("Mars") == get_house_for_planet("Venus") == get_house_for_planet("Saturn")
    partner_traits.append({"id": "t10", "text": t_data.get("t10", ""), "satisfied": bool(t10), "chart": "Lagna (D1) Chart"})

    d1_t11 = get_house_for_planet(second_lord) in {3, 4}
    d9_t11 = False
    if d9 and d9.get("houses"):
        d9_h = d9.get("houses", {})
        for h in ["3", "4"]:
            if second_lord in [p["name"] if isinstance(p, dict) else p for p in d9_h.get(h, {}).get("planets", [])]:
                d9_t11 = True
                break
    t11 = d1_t11 or d9_t11
    chart_src_t11 = "Lagna & D9 Charts" if (d1_t11 and d9_t11) else ("Navamsha (D9) Chart" if d9_t11 else "Lagna (D1) Chart")
    partner_traits.append({"id": "t11", "text": t_data.get("t11", ""), "satisfied": bool(t11), "chart": chart_src_t11})

    t12 = get_house_for_planet(seventh_lord) in {1, 7}
    partner_traits.append({"id": "t12", "text": t_data.get("t12", ""), "satisfied": bool(t12), "chart": "Lagna (D1) Chart"})

    t13 = get_house_for_planet(seventh_lord) in {8, 12}
    partner_traits.append({"id": "t13", "text": t_data.get("t13", ""), "satisfied": bool(t13), "chart": "Lagna (D1) Chart"})

    t14 = get_house_for_planet(lagna_lord) == 7 and get_house_for_planet(seventh_lord) == 1
    partner_traits.append({"id": "t14", "text": t_data.get("t14", ""), "satisfied": bool(t14), "chart": "Lagna (D1) Chart"})

    t15 = all(p in h7_planets for p in ["Saturn", "Mars", "Moon"])
    partner_traits.append({"id": "t15", "text": t_data.get("t15", ""), "satisfied": bool(t15), "chart": "Lagna (D1) Chart"})

    t16 = "Sun" in h7_planets
    partner_traits.append({"id": "t16", "text": t_data.get("t16", ""), "satisfied": bool(t16), "chart": "Lagna (D1) Chart"})

    t17 = "Mars" in h7_planets
    partner_traits.append({"id": "t17", "text": t_data.get("t17", ""), "satisfied": bool(t17), "chart": "Lagna (D1) Chart"})

    t18 = "Mercury" in h7_planets
    partner_traits.append({"id": "t18", "text": t_data.get("t18", ""), "satisfied": bool(t18), "chart": "Lagna (D1) Chart"})

    t19 = "Jupiter" in h7_planets
    partner_traits.append({"id": "t19", "text": t_data.get("t19", ""), "satisfied": bool(t19), "chart": "Lagna (D1) Chart"})

    t20 = "Venus" in h7_planets or "Rahu" in h7_planets
    partner_traits.append({"id": "t20", "text": t_data.get("t20", ""), "satisfied": bool(t20), "chart": "Lagna (D1) Chart"})

    d1_t21 = "Saturn" in h7_planets
    d9_t21 = False
    if d9 and d9.get("houses"):
        d9_7_p = [p["name"] if isinstance(p, dict) else p for p in d9.get("houses", {}).get("7", {}).get("planets", [])]
        if "Saturn" in d9_7_p:
            d9_t21 = True
    t21 = d1_t21 or d9_t21
    chart_src_t21 = "Lagna & D9 Charts" if (d1_t21 and d9_t21) else ("Navamsha (D9) Chart" if d9_t21 else "Lagna (D1) Chart")
    partner_traits.append({"id": "t21", "text": t_data.get("t21", ""), "satisfied": bool(t21), "chart": chart_src_t21})

    t22 = get_house_for_planet("Moon") in {7, 9}
    partner_traits.append({"id": "t22", "text": t_data.get("t22", ""), "satisfied": bool(t22), "chart": "Lagna (D1) Chart"})

    plurality_rules = []
    p1 = strength.get(lagna_lord, {}).get("total", 60) < 65 or strength.get(seventh_lord, {}).get("total", 60) < 65
    plurality_rules.append({"id": "p1", "text": p_data.get("p1", ""), "satisfied": bool(p1), "chart": "Lagna (D1) Chart"})

    p2 = get_house_for_planet(second_lord) == 8
    plurality_rules.append({"id": "p2", "text": p_data.get("p2", ""), "satisfied": bool(p2), "chart": "Lagna (D1) Chart"})

    eighth_lord = SIGN_LORDS.get(get_house_sign_idx(8))
    p3 = get_house_for_planet(eighth_lord) in {1, 7} if eighth_lord else False
    plurality_rules.append({"id": "p3", "text": p_data.get("p3", ""), "satisfied": bool(p3), "chart": "Lagna (D1) Chart"})

    p4 = sum(1 for m in malefics if m in h7_planets) >= 3
    plurality_rules.append({"id": "p4", "text": p_data.get("p4", ""), "satisfied": bool(p4), "chart": "Lagna (D1) Chart"})

    p5 = len(h7_planets) >= 2 and get_house_for_planet(second_lord) != 1
    plurality_rules.append({"id": "p5", "text": p_data.get("p5", ""), "satisfied": bool(p5), "chart": "Lagna (D1) Chart"})

    p6 = any(get_planet_sign_idx(p) == 3 for p in pnames(get_house(1))) and "Mars" in h7_planets
    plurality_rules.append({"id": "p6", "text": p_data.get("p6", ""), "satisfied": bool(p6), "chart": "Lagna (D1) Chart"})

    p7 = get_house_for_planet(lagna_lord) == get_house_for_planet(second_lord) == get_house_for_planet(sixth_lord) and any(m in h7_planets for m in malefics) if sixth_lord else False
    plurality_rules.append({"id": "p7", "text": p_data.get("p7", ""), "satisfied": bool(p7)})

    # KP Childbirth & Delivery Timing Engine
    fifth_sign_idx = get_house_sign_idx(5)
    fifth_lord = SIGN_LORDS.get(fifth_sign_idx, "Unknown") if fifth_sign_idx is not None else "Unknown"
    h5_planets = pnames(get_house(5))
    h2_planets = pnames(get_house(2))
    h11_planets = pnames(get_house(11))
    
    # Primary significators for progeny: 2, 5, 11
    progeny_significators = list(set([second_lord, fifth_lord, eleventh_lord, "Jupiter"] + h2_planets + h5_planets + h11_planets))
    progeny_significators = [p for p in progeny_significators if p in SIGN_LORDS.values() or p in {"Rahu", "Ketu"}]

    # Barren Signs: 0 (Aries), 2 (Gemini), 4 (Leo), 5 (Virgo)
    is_fifth_barren = fifth_sign_idx in {0, 2, 4, 5}
    is_moon_barren = (get_planet_sign_idx("Moon") in {0, 2, 4, 5}) if get_planet_sign_idx("Moon") is not None else False
    
    if is_fifth_barren and ("Ketu" in h5_planets or "Saturn" in h5_planets):
        promise_status = "Denied / Risk of Abortion (5th house in Barren Sign afflicted by abortive node/malefic)"
        promise_code = "DENIED_OR_ABORTIVE"
    elif any(b in h5_planets for b in ["Jupiter", "Venus", "Moon"]) or fifth_sign_idx in fruitful_signs:
        promise_status = "Promised (Fruitful 5th house / Benefic influence on progeny)"
        promise_code = "PROMISED"
    else:
        promise_status = "Conditional / Requires KP Cuspal Sub-Lord Verification"
        promise_code = "CONDITIONAL"

    # Ruling Planets
    ruling_planets = list(set([lagna_lord, SIGN_LORDS.get(get_planet_sign_idx("Moon"), "Moon"), fifth_lord, "Jupiter"]))

    # Predicted Moon Transit Pinpoint for Delivery
    kp_childbirth_timing = {
        "title": "KP Astrology Childbirth & Delivery Timing Analysis",
        "promise_status": promise_status,
        "promise_code": promise_code,
        "progeny_houses": [2, 5, 11],
        "negating_houses": [4, 8, 12],
        "fifth_house_lord": fifth_lord,
        "fifth_house_occupants": h5_planets,
        "is_fifth_barren_sign": is_fifth_barren,
        "is_moon_barren_sign": is_moon_barren,
        "chief_karaka": "Jupiter",
        "prime_significators": progeny_significators,
        "ruling_planets": ruling_planets,
        "predicted_transit_rule": "Delivery fructifies when Moon transits Sign Lord, Star Lord, Sub Lord & Sub-Sub Lord matching top significators (Houses 2, 5, 11).",
        "sivapatham_delivery_case_study": m_rules_data.get("case_study_when_delivery_sivapatham", {}),
        "conception_and_mortality_rules": m_rules_data.get("progeny_conception_and_mortality_rules", {})
    }

    return {
        "text": summary, "age": age_range, "age_en": age_en,
        "classification": classification, "classification_note": classification_note,
        "matching_signs": matching, "seventh_house_notes": seventh_house_notes,
        "lord_placement": lord_placement, "karaka_notes": karaka_notes,
        "dasha_note": dasha_note, "navamsa_note": navamsa_note,
        "outcome_score": outcome_score, "outcome_label": outcome_label,
        "outcome_color": outcome_color, "score_breakdown": score_breakdown,
        "score": outcome_score,
        "label": outcome_label,
        "harmony_index": f"{outcome_score}%",
        "karaka_status": f"Venus ({venus_strength:.1f}), Jupiter ({jupiter_strength:.1f})",
        "dasha_influence": dasha_note,
        "remedies": [
            "Worship Goddess Parvati or Lord Shiva (for marital peace)",
            "Donate white items (Sweets, Milk, Cloth) on Fridays",
            "Perform 'Gauri Shankar' Puja for harmony"
        ],
        "note": "Accuracy: Dasha + Transit + D9 together = 90-95%. Consult an astrologer for the exact year.",
        "married_state_desc": married_state_desc,
        "cusp_pleasure_desc": cusp_pleasure_desc,
        "partner_age_diff_desc": partner_age_diff_desc,
        "partner_locality_desc": partner_locality_desc,
        "partner_profession_desc": partner_profession_desc,
        "partner_appearance_features": partner_appearance_features,
        "love_marriage_analysis": love_marriage_analysis,
        "divorce_separation_analysis": divorce_separation_analysis,
        "jataka_rules": j_rules,
        "western_rules": w_rules,
        "delay_rules": d_rules,
        "punarphoo": punarphoo,
        "happy_rules": happy_rules,
        "unhappy_rules": unhappy_rules,
        "partner_traits": partner_traits,
        "plurality_rules": plurality_rules,
        "kp_childbirth_timing": kp_childbirth_timing,
        "all_rules": m_rules_data
    }


ASCENDANT_BUSINESS_MAP = {
    "Aries": {
        "ascendant": "Aries",
        "ruler": "Mars",
        "traits": "Confident and Brave",
        "description": "Aries have a reserve source of boundless energy and extreme focus towards life's ambition and goals. Spontaneous and fast decision makers.",
        "fields": ["Real Estate", "Spare Parts", "Hardware", "Hotel or Restaurant"]
    },
    "Taurus": {
        "ascendant": "Taurus",
        "ruler": "Venus",
        "traits": "Reliable and Responsible",
        "description": "Known for a no-nonsense perspective, Taurus natives are cautious, methodical, and solution-oriented under tough situations.",
        "fields": ["Ladies Apparels & Accessories", "Jewelry", "Hotel / Café / Bistro", "Construction & Building Materials", "Women's Clothing", "Cosmetics"]
    },
    "Gemini": {
        "ascendant": "Gemini",
        "ruler": "Mercury",
        "traits": "Tactful and Adaptive",
        "description": "Highly adaptive, smart, and masters of tactful communication. Drawn to intellect, education, and polished presentations.",
        "fields": ["Stationery & School Supplies", "Jewelry", "Commission & Consultancy Business Firm", "Accountancy Firm", "Law Firm"]
    },
    "Cancer": {
        "ascendant": "Cancer",
        "ruler": "Moon",
        "traits": "Empathetic and Intuitive",
        "description": "Extraordinary intuitive skill to provide crucial solutions at right moments, sensitive, caring, and protective nature.",
        "fields": ["Weaponry, Ammunition & Artillery", "Water Plant", "Beverage Manufacturing", "Hotel or Restaurant", "Real Estate"]
    },
    "Leo": {
        "ascendant": "Leo",
        "ruler": "Sun",
        "traits": "Skillful and Leadership",
        "description": "Dynamic, royal, and creative. Exceptionally skilled in managing large social circles and commanding leadership in commercial ventures.",
        "fields": ["Fashion Apparels & Accessories", "Women Apparels", "Cosmetics", "Jewelry", "Photography", "Hotel & Restaurant"]
    },
    "Virgo": {
        "ascendant": "Virgo",
        "ruler": "Mercury",
        "traits": "Perfectionist yet Critical",
        "description": "Level-headed, sensible, blessed with high logical reasoning, and flexible towards strategic business changes.",
        "fields": ["Stationery & School Supplies", "Commission & Consultancy Business Firm", "Accountancy Firm", "Jewelry Business"]
    },
    "Libra": {
        "ascendant": "Libra",
        "ruler": "Venus",
        "traits": "Tactful and Balanced",
        "description": "Natural troubleshooters who excel at finding harmonious middle ground. Multi-angle evaluators ensuring balanced growth.",
        "fields": ["Construction & Building Materials", "Women's Clothing", "Cosmetics", "Ladies Apparels & Accessories", "Jewelry", "Hotel / Café / Bistro"]
    },
    "Scorpio": {
        "ascendant": "Scorpio",
        "ruler": "Mars",
        "traits": "Intuitive and Bold",
        "description": "Excellent decision-making abilities, secretive, risk-taking attitude, brave, and deeply intuitive under market volatility.",
        "fields": ["Spare Parts", "Hotel or Restaurant", "Hardware", "Real Estate"]
    },
    "Sagittarius": {
        "ascendant": "Sagittarius",
        "ruler": "Jupiter",
        "traits": "Free-spirited yet Hard-working",
        "description": "Independent and ambitious. While generally inclined toward service, when Sagittarius enters business, they achieve high integrity and growth.",
        "fields": ["Stationery & School Supply", "Hardware", "Real Estate", "Publication of Religious Books", "Lender's Firm or Agency"]
    },
    "Capricorn": {
        "ascendant": "Capricorn",
        "ruler": "Saturn",
        "traits": "Goal-oriented and Traditional",
        "description": "Workaholics with a practical, cautious, and methodical approach. Conduct thorough background checks before taking final decisions.",
        "fields": ["Share Market Business", "Cosmetics", "Women's Clothing", "Female Accessories", "Jewelry", "Civil Engineering Consultancy"]
    },
    "Aquarius": {
        "ascendant": "Aquarius",
        "ruler": "Saturn",
        "traits": "Optimistic and Intelligent",
        "description": "Independent soul with great wit, wisdom, and level-headedness. Highly innovative in market opportunities.",
        "fields": ["Construction & Building Materials", "Artillery & Ammunition Supply", "Iron-Related Business", "Real Estate", "Hotel", "Wood-Related Business"]
    },
    "Pisces": {
        "ascendant": "Pisces",
        "ruler": "Jupiter",
        "traits": "Creative and Empathetic",
        "description": "Highly intuitive, creative, adaptable, and flexible. Blessed with high emotional intelligence and customer empathy.",
        "fields": ["Publication of Religious Books", "Hardware", "Lender's Firm or Agency", "Real Estate", "Stationery & School Supply"]
    }
}


def _analyze_business(houses, planets, strength, d9=None, d10=None, dasha=None) -> Dict[str, Any]:
    SIGN_LORDS = {0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"}
    SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    def house_sign_idx(h_num, target_houses=houses):
        h = target_houses.get(str(h_num), {}) or target_houses.get(int(h_num), {})
        si = h.get("sign_index")
        if si is None and h.get("cusp_deg") is not None:
            si = int(h["cusp_deg"] / 30)
        return si

    def house_lord(h_num, target_houses=houses):
        si = house_sign_idx(h_num, target_houses)
        return SIGN_LORDS.get(si, "Unknown") if si is not None else "Unknown"

    def get_planet_house(p_name, target_houses=houses):
        for h_num, h_data in target_houses.items():
            if p_name in pnames(h_data):
                return int(h_num)
        return None

    # Ascendant Sign Analysis for Profit-making Business Fields
    lagna_sign_idx = house_sign_idx(1)
    ascendant_sign = SIGNS[lagna_sign_idx] if lagna_sign_idx is not None and lagna_sign_idx < len(SIGNS) else "Aries"
    user_ascendant_profile = ASCENDANT_BUSINESS_MAP.get(ascendant_sign, ASCENDANT_BUSINESS_MAP["Aries"])
    
    ascendant_business_recommendations = {
        "ascendant": ascendant_sign,
        "ruler": user_ascendant_profile["ruler"],
        "traits": user_ascendant_profile["traits"],
        "description": user_ascendant_profile["description"],
        "recommended_fields": user_ascendant_profile["fields"],
        "note": "General profit-making business fields suggested based on your Ascendant sign. Further refined by planetary placements in natal & divisional charts."
    }

    h6_planets = pnames(houses.get("6", {}))
    h7_planets = pnames(houses.get("7", {}))
    h10_planets = pnames(houses.get("10", {}))
    h11_planets = pnames(houses.get("11", {}))
    h5_planets = pnames(houses.get("5", {}))

    lord_1, lord_2, lord_3, lord_5, lord_6, lord_7, lord_10, lord_11 = (
        house_lord(1), house_lord(2), house_lord(3), house_lord(5),
        house_lord(6), house_lord(7), house_lord(10), house_lord(11)
    )

    lagna_lord_h = get_planet_house(lord_1)
    tenth_lord_h = get_planet_house(lord_10)
    sat_h = get_planet_house("Saturn")
    merc_h = get_planet_house("Mercury")
    rahu_h = get_planet_house("Rahu")
    ven_h = get_planet_house("Venus")

    lagna_lord_str = strength.get(lord_1, {}).get("total", 60.0)
    tenth_lord_str = strength.get(lord_10, {}).get("total", 60.0)
    mercury_strength = strength.get("Mercury", {}).get("total", 60.0)
    venus_strength = strength.get("Venus", {}).get("total", 60.0)
    saturn_strength = strength.get("Saturn", {}).get("total", 60.0)
    jupiter_strength = strength.get("Jupiter", {}).get("total", 60.0)

    # --- CLASSICAL JYOTISH BUSINESS COMBINATIONS ENGINE ---
    # 1. 10th Lord Placement in D1 (3, 5, 7, 8, 9, 12)
    is_10th_lord_in_biz_houses_d1 = tenth_lord_h in {3, 5, 7, 8, 9, 12}

    # 2. 10th Lord Placement in D-10 Dasamsa Chart (3, 7, 11)
    d10_houses = d10.get("houses", {}) if isinstance(d10, dict) else {}
    tenth_lord_d10_h = get_planet_house(lord_10, d10_houses) if d10_houses else None
    is_10th_lord_in_biz_houses_d10 = tenth_lord_d10_h in {3, 7, 11} if tenth_lord_d10_h else False

    # 3. Lagna Lord & 10th Lord Strength
    is_lagna_10th_strong = (lagna_lord_str >= 60 and tenth_lord_str >= 60)

    # 4. Saturn, Mercury, Rahu in 3, 7, 10, 11 (D1)
    biz_key_planets_d1 = [p for p, h in [("Saturn", sat_h), ("Mercury", merc_h), ("Rahu", rahu_h)] if h in {3, 7, 10, 11}]

    # 5. Influence of Saturn, Mercury, Rahu on Lagna Lord & 10th Lord
    is_influencing_lagna_10th = (
        (sat_h in {lagna_lord_h, tenth_lord_h}) or
        (merc_h in {lagna_lord_h, tenth_lord_h}) or
        (rahu_h in {lagna_lord_h, tenth_lord_h})
    )

    # 6. Venus and Mercury Conjunction (Entrepreneurship & Trade)
    is_venus_mercury_conj = (ven_h is not None and ven_h == merc_h)

    # 7. Main House Lords Conjunction in 3, 7, 10, 11
    main_house_lords = {
        "1st Lord": lord_1, "2nd Lord": lord_2, "3rd Lord": lord_3,
        "5th Lord": lord_5, "7th Lord": lord_7, "10th Lord": lord_10,
        "11th Lord": lord_11
    }
    lords_in_biz_houses = {}
    for lname, lplanet in main_house_lords.items():
        if lplanet != "Unknown":
            lh = get_planet_house(lplanet)
            if lh in {3, 7, 10, 11}:
                lords_in_biz_houses.setdefault(lh, []).append(f"{lname} ({lplanet})")
    
    is_main_lords_conj_biz_houses = any(len(lords) >= 2 for lords in lords_in_biz_houses.values())

    # 8. Dhan Yogas vs Rajyogas Count
    dhan_yogas_count = 0
    if get_planet_house(lord_2) in {5, 9, 11, 1, 2}: dhan_yogas_count += 1
    if get_planet_house(lord_5) in {2, 9, 11, 1, 5}: dhan_yogas_count += 1
    if get_planet_house(lord_11) in {2, 5, 9, 1, 11}: dhan_yogas_count += 1
    if get_planet_house("Jupiter") in {2, 5, 9, 11}: dhan_yogas_count += 1
    
    raj_yogas_count = 0
    if lagna_lord_h in {5, 9, 4, 7, 10}: raj_yogas_count += 1
    if tenth_lord_h in {1, 5, 9, 4, 7}: raj_yogas_count += 1
    
    more_dhan_than_raj = dhan_yogas_count > raj_yogas_count

    classical_business_combinations = [
        {
            "id": "b1",
            "title": "10th Lord Placement in Business Houses (D1)",
            "rule": "10th Lord placed in 3rd, 5th, 7th, 8th, 9th, or 12th house in D1 chart.",
            "satisfied": bool(is_10th_lord_in_biz_houses_d1),
            "detail": f"10th Lord ({lord_10}) is placed in House {tenth_lord_h or 'Unknown'}."
        },
        {
            "id": "b2",
            "title": "10th Lord Placement in D-10 Dasamsa (3, 7, 11)",
            "rule": "10th Lord of Lagna chart placed in 3rd, 7th, or 11th house in D-10 chart.",
            "satisfied": bool(is_10th_lord_in_biz_houses_d10),
            "detail": f"10th Lord ({lord_10}) is placed in House {tenth_lord_d10_h} in D-10." if tenth_lord_d10_h else f"10th Lord ({lord_10}) D-10 analysis evaluated."
        },
        {
            "id": "b3",
            "title": "Lagna Lord & 10th Lord Strength",
            "rule": "Lagna Lord and 10th Lord must be strong (>60/150) for commercial success.",
            "satisfied": bool(is_lagna_10th_strong),
            "detail": f"Lagna Lord ({lord_1}: {lagna_lord_str:.0f}/150), 10th Lord ({lord_10}: {tenth_lord_str:.0f}/150)."
        },
        {
            "id": "b4",
            "title": "Saturn, Mercury, Rahu Business Placements (3, 7, 10, 11)",
            "rule": "Saturn, Mercury, Rahu placed individually or in conjunction in 3rd, 7th, 10th, or 11th house.",
            "satisfied": len(biz_key_planets_d1) > 0,
            "detail": f"Active in 3/7/10/11: {', '.join(biz_key_planets_d1) if biz_key_planets_d1 else 'None'}."
        },
        {
            "id": "b5",
            "title": "Saturn, Mercury, Rahu Influence on Lagna & 10th Lords",
            "rule": "Influence of key business planets (Saturn/Mercury/Rahu) on Lagna Lord or 10th Lord is favorable for self-employment.",
            "satisfied": bool(is_influencing_lagna_10th),
            "detail": "Saturn, Mercury, or Rahu shares house or aspects Lagna/10th Lord." if is_influencing_lagna_10th else "No direct conjunction of key planets with Lagna/10th Lord."
        },
        {
            "id": "b6",
            "title": "Venus & Mercury Conjunction (Laxmi-Narayan Trade Yoga)",
            "rule": "Venus and Mercury conjunction provides strong trade intellect, client charm & entrepreneurship.",
            "satisfied": bool(is_venus_mercury_conj),
            "detail": f"Venus & Mercury conjoined in House {ven_h}." if is_venus_mercury_conj else f"Venus (H{ven_h}) and Mercury (H{merc_h}) are in separate houses."
        },
        {
            "id": "b7",
            "title": "Main House Lords Conjunction in 3, 7, 10, 11",
            "rule": "Lords of main business houses (1, 2, 3, 5, 7, 10, 11) conjoining in 3rd, 7th, 10th, or 11th house.",
            "satisfied": bool(is_main_lords_conj_biz_houses),
            "detail": ", ".join([f"House {h}: " + " & ".join(l) for h, l in lords_in_biz_houses.items()]) if lords_in_biz_houses else "No multiple main lords conjoined in 3, 7, 10, 11."
        },
        {
            "id": "b8",
            "title": "Dhan Yogas Dominance Over Rajyogas",
            "rule": "More Dhan Yogas (Wealth Yogas) than Rajyogas (Status/Job Yogas) in chart favors independent business over employment.",
            "satisfied": bool(more_dhan_than_raj),
            "detail": f"Dhan Yogas (Wealth): {dhan_yogas_count} | Rajyogas (Status): {raj_yogas_count}."
        }
    ]

    # --- POWERFUL BUSINESS YOGAS CALCULATOR ---
    powerful_business_yogas = []

    second_lord_h = get_planet_house(lord_2)
    eleventh_lord_h = get_planet_house(lord_11)
    ninth_lord = house_lord(9)
    ninth_lord_h = get_planet_house(ninth_lord)
    ninth_lord_str = strength.get(ninth_lord, {}).get("total", 60.0)
    eleventh_lord_str = strength.get(lord_11, {}).get("total", 60.0)
    moon_h = get_planet_house("Moon")
    mars_h = get_planet_house("Mars")
    sun_h = get_planet_house("Sun")

    # 1. Dhana Yoga (2nd Lord + 11th Lord conjunction or mutual aspect)
    dhana_yoga_satisfied = False
    dhana_detail = ""
    if second_lord_h is not None and eleventh_lord_h is not None:
        if second_lord_h == eleventh_lord_h:
            dhana_yoga_satisfied = True
            dhana_detail = f"2nd Lord ({lord_2}) & 11th Lord ({lord_11}) conjoined in House {second_lord_h}."
        elif abs(second_lord_h - eleventh_lord_h) == 6 or (second_lord_h - eleventh_lord_h) % 12 == 6:
            dhana_yoga_satisfied = True
            dhana_detail = f"2nd Lord ({lord_2} in H{second_lord_h}) & 11th Lord ({lord_11} in H{eleventh_lord_h}) form 7th mutual aspect."
        else:
            dhana_detail = f"2nd Lord in House {second_lord_h}, 11th Lord in House {eleventh_lord_h}."
    else:
        dhana_detail = "2nd or 11th Lord placement evaluated."

    powerful_business_yogas.append({
        "id": "y1",
        "name": "Dhana Yoga",
        "title": "Dhana Yoga (Wealth Generation Foundation)",
        "rule_desc": "2nd Lord + 11th Lord conjunction or mutual aspect creates wealth-generating capacity.",
        "meaning": "Foundation of commercial success and high wealth accumulation.",
        "satisfied": dhana_yoga_satisfied,
        "detail": dhana_detail
    })

    # 2. Lakshmi Yoga (Venus in own/exalted sign in Kendra 1,4,7,10 with strong 9th lord)
    ven_sign_idx = house_sign_idx(ven_h) if ven_h else None
    ven_is_own_exalted = ven_sign_idx in {1, 6, 11}
    ven_is_kendra = ven_h in {1, 4, 7, 10}
    lakshmi_yoga_satisfied = ven_is_own_exalted and ven_is_kendra and (ninth_lord_str >= 60)

    lakshmi_detail = f"Venus in H{ven_h} ({'Own/Exalted' if ven_is_own_exalted else 'Not Own/Exalted'}), 9th Lord ({ninth_lord}: {ninth_lord_str:.0f}/150)."
    powerful_business_yogas.append({
        "id": "y2",
        "name": "Lakshmi Yoga",
        "title": "Lakshmi Yoga (Luxurious Prosperity & Brand Wealth)",
        "rule_desc": "Venus in own/exalted sign in a Kendra house (1, 4, 7, 10), with strong 9th Lord.",
        "meaning": "Brings luxurious business success, high brand prestige, and grand prosperity.",
        "satisfied": lakshmi_yoga_satisfied,
        "detail": lakshmi_detail
    })

    # 3. Chandra-Mangal Yoga (Moon + Mars conjunction/aspect)
    chandra_mangal_satisfied = False
    cm_detail = ""
    if moon_h is not None and mars_h is not None:
        if moon_h == mars_h:
            chandra_mangal_satisfied = True
            cm_detail = f"Moon & Mars conjoined in House {moon_h}."
        elif abs(moon_h - mars_h) == 6 or (moon_h - mars_h) % 12 == 6:
            chandra_mangal_satisfied = True
            cm_detail = f"Moon (H{moon_h}) & Mars (H{mars_h}) form 7th mutual aspect."
        else:
            cm_detail = f"Moon in House {moon_h}, Mars in House {mars_h}."
    else:
        cm_detail = "Moon & Mars placements evaluated."

    powerful_business_yogas.append({
        "id": "y3",
        "name": "Chandra-Mangal Yoga",
        "title": "Chandra-Mangal Yoga (Commercial Instinct & Financial Drive)",
        "rule_desc": "Moon + Mars conjunction or mutual aspect.",
        "meaning": "Creates sharp commercial instincts, bold risk-taking ability, and high financial drive.",
        "satisfied": chandra_mangal_satisfied,
        "detail": cm_detail
    })

    # 4. Budh-Aditya Yoga (Mercury + Sun conjunction)
    budh_aditya_satisfied = (merc_h is not None and sun_h is not None and merc_h == sun_h)
    ba_detail = f"Mercury & Sun conjoined in House {merc_h}." if budh_aditya_satisfied else f"Mercury in H{merc_h}, Sun in H{sun_h}."
    powerful_business_yogas.append({
        "id": "y4",
        "name": "Budh-Aditya Yoga",
        "title": "Budh-Aditya Yoga (Executive Authority & Business Acumen)",
        "rule_desc": "Mercury + Sun conjunction in the same house.",
        "meaning": "Gives sharp trading intellect combined with executive authority, leadership, and public reputation.",
        "satisfied": budh_aditya_satisfied,
        "detail": ba_detail
    })

    # 5. 7th Lord in 10th House
    seventh_in_tenth_satisfied = (get_planet_house(lord_7) == 10)
    s10_detail = f"7th Lord ({lord_7}) is in House {get_planet_house(lord_7)}."
    powerful_business_yogas.append({
        "id": "y5",
        "name": "7th Lord in 10th House",
        "title": "7th Lord in 10th House (Trade Career & Partnership Success)",
        "rule_desc": "7th Lord (market & partnerships) placed in the 10th House (career & status).",
        "meaning": "Partnership business succeeds; career is built directly through business dealings.",
        "satisfied": seventh_in_tenth_satisfied,
        "detail": s10_detail
    })

    # 6. 10th Lord in 11th House
    tenth_in_eleventh_satisfied = (get_planet_house(lord_10) == 11)
    t11_detail = f"10th Lord ({lord_10}) is in House {get_planet_house(lord_10)}."
    powerful_business_yogas.append({
        "id": "y6",
        "name": "10th Lord in 11th House",
        "title": "10th Lord in 11th House (Consistent Profits & High ROI)",
        "rule_desc": "10th Lord (profession) placed in the 11th House (gains).",
        "meaning": "Professional efforts consistently convert into massive financial gains and high ROI.",
        "satisfied": tenth_in_eleventh_satisfied,
        "detail": t11_detail
    })

    # 7. Amala Yoga (Benefic in 10th House)
    h10_planets = pnames(houses.get("10", {}))
    benefics_in_10 = [p for p in h10_planets if p in {"Jupiter", "Venus", "Mercury", "Moon"}]
    malefics_in_10 = [p for p in h10_planets if p in {"Mars", "Saturn", "Rahu", "Ketu"}]
    amala_yoga_satisfied = len(benefics_in_10) > 0 and len(malefics_in_10) == 0
    amala_detail = f"10th House Occupants: {', '.join(h10_planets) if h10_planets else 'Empty'}. Benefics: {', '.join(benefics_in_10) if benefics_in_10 else 'None'}."
    powerful_business_yogas.append({
        "id": "y7",
        "name": "Amala Yoga",
        "title": "Amala Yoga (Ethical Reputation & Brand Goodwill)",
        "rule_desc": "Benefic planet (Jupiter, Venus, Mercury, Moon) in 10th House without malefic affliction.",
        "meaning": "Grants spotless business reputation, strong brand goodwill, and enduring public trust.",
        "satisfied": amala_yoga_satisfied,
        "detail": amala_detail
    })

    # 8. 11th Lord Strong in Kendra (1, 4, 7, 10)
    is_11th_lord_in_kendra = eleventh_lord_h in {1, 4, 7, 10}
    is_11th_lord_strong_kendra = is_11th_lord_in_kendra and (eleventh_lord_str >= 60)
    k11_detail = f"11th Lord ({lord_11}) in House {eleventh_lord_h} ({'Kendra' if is_11th_lord_in_kendra else 'Non-Kendra'}), Strength: {eleventh_lord_str:.0f}/150."
    powerful_business_yogas.append({
        "id": "y8",
        "name": "11th Lord Strong in Kendra",
        "title": "11th Lord Strong in Kendra (Commercial Scale & Aspirations)",
        "rule_desc": "11th Lord placed in a Kendra house (1, 4, 7, 10) with strong Shadbala.",
        "meaning": "Ensures consistent commercial profit, business scaling capacity, and fulfilled aspirations.",
        "satisfied": is_11th_lord_strong_kendra,
        "detail": k11_detail
    })

    # JOB SCORE (0-50)
    job_score, job_notes = 0, []
    s6 = 5
    for p in h6_planets:
        if p in {"Saturn", "Moon", "Mercury"}:
            s6 += 5; job_notes.append(f"{p} in 6th -> Job/service indicator")
        elif p in {"Mars", "Rahu"}:
            s6 -= 2
    s6 = max(0, min(20, s6)); job_score += s6

    s_sat = min(15, max(0, round((saturn_strength - 40) / 7.3)))
    job_score += s_sat
    if saturn_strength > 70:
        job_notes.append(f"Saturn strong ({saturn_strength:.0f}/150) -> Stable job assured")

    s10_job = 5
    if "Saturn" in h10_planets:
        s10_job += 8; job_notes.append("Saturn in 10th -> Government/corporate career")
    elif "Sun" in h10_planets:
        s10_job += 6; job_notes.append("Sun in 10th -> Leadership/authority role")
    elif "Moon" in h10_planets:
        s10_job += 4
    s10_job = max(0, min(15, s10_job)); job_score += s10_job

    # BUSINESS SCORE (0-60)
    biz_score, biz_notes = 0, []
    s7 = 5
    for p in h7_planets:
        if p in {"Mercury", "Venus", "Jupiter"}:
            s7 += 5; biz_notes.append(f"{p} in 7th -> Strong business indicator")
        elif p in {"Rahu"}:
            s7 += 3; biz_notes.append("Rahu in 7th -> Startup/unconventional")
        elif p in {"Saturn"}:
            s7 += 1
    s7 = max(0, min(20, s7)); biz_score += s7

    s_merc_ven = min(15, max(0, round(((mercury_strength + venus_strength) / 2 - 40) / 7.3)))
    biz_score += s_merc_ven
    if mercury_strength > 70:
        biz_notes.append(f"Mercury strong ({mercury_strength:.0f}/150) -> Business mind")
    if venus_strength > 70:
        biz_notes.append(f"Venus strong ({venus_strength:.0f}/150) -> Client attraction")

    s11 = 5
    for p in h11_planets:
        if p in {"Jupiter", "Venus", "Mercury"}:
            s11 += 5; biz_notes.append(f"{p} in 11th -> Profit indicator")
    s11 = max(0, min(15, s11)); biz_score += s11

    s5 = 3
    for p in h5_planets:
        if p in {"Mars", "Rahu"}:
            s5 += 4; biz_notes.append(f"{p} in 5th -> Risk-taking ability")
        elif p in {"Jupiter"}:
            s5 += 3
    s5 = max(0, min(10, s5)); biz_score += s5

    # Boost biz score if classical combinations are met
    satisfied_combos_count = sum(1 for c in classical_business_combinations if c["satisfied"])
    if satisfied_combos_count >= 4:
        biz_score += 10
        biz_notes.append(f"{satisfied_combos_count}/8 Classical Business Combinations Satisfied")

    # DECISION
    if biz_score > job_score + 5:
        path, path_label = "business", "BUSINESS / ENTREPRENEURSHIP"
        path_note = "Your chart strongly favours independent business or entrepreneurship."
    elif job_score > biz_score + 5:
        path, path_label = "job", "JOB / SERVICE"
        path_note = "Your chart favours a stable salaried career."
    else:
        path, path_label = "transition", "JOB to BUSINESS TRANSITION"
        path_note = "Start with a job for stability, then transition to business later."

    # TIMING
    job_planets_set = {lord_6, lord_10, "Saturn"}
    biz_planets_set = {lord_7, lord_10, lord_11, "Mercury", "Rahu"}
    job_age, biz_age = "24-28 years", "27-35 years"
    biz_dasha_note, transition_note = "Dasha data unavailable", ""
    dasha_start_time, dasha_end_time = None, None
    mahadasha_start_time, mahadasha_end_time = None, None
    antardasha_start_time, antardasha_end_time = None, None

    if dasha:
        cm_obj = dasha.get("mahadasha", {}) or {}
        ca_obj = dasha.get("antardasha", {}) or {}
        cm = cm_obj.get("planet", "") or ""
        ca = ca_obj.get("planet", "") or ""
        
        mahadasha_start_time = cm_obj.get("start_date") or cm_obj.get("start")
        mahadasha_end_time = cm_obj.get("end_date") or cm_obj.get("end")
        antardasha_start_time = ca_obj.get("start_date") or ca_obj.get("start")
        antardasha_end_time = ca_obj.get("end_date") or ca_obj.get("end")
        
        # Primary operating window start and end time (prefer Antardasha window, fallback to Mahadasha window)
        dasha_start_time = antardasha_start_time or mahadasha_start_time
        dasha_end_time = antardasha_end_time or mahadasha_end_time

        if cm in biz_planets_set:
            biz_dasha_note = f"{cm} Mahadasha active -> Business window OPEN now"
            biz_age = "Current period"
        elif cm in job_planets_set:
            biz_dasha_note = f"{cm} Mahadasha active -> Job/service phase now"
            job_age = "Current period"
        else:
            biz_dasha_note = f"{cm}/{ca} - Wait for {lord_7}/Mercury/Rahu Dasha."
        if cm in job_planets_set and cm not in biz_planets_set:
            transition_note = f"After {cm} period, watch for {lord_7}/Mercury Dasha -> Business window"

    if saturn_strength > 75: job_age = "21-24 years (early)"
    elif saturn_strength < 50: job_age = "28-32 years (delayed)"
    biz_age_final = "22-27 years (Mercury strong)" if mercury_strength > 75 else biz_age

    planet_roles = [
        {"planet": "Mercury", "role": "Business mind, trading", "strength": f"{mercury_strength:.0f}/150"},
        {"planet": "Venus", "role": "Clients, sales, luxury", "strength": f"{venus_strength:.0f}/150"},
        {"planet": "Saturn", "role": "Job stability, discipline", "strength": f"{saturn_strength:.0f}/150"},
        {"planet": "Jupiter", "role": "Consulting, advisory", "strength": f"{jupiter_strength:.0f}/150"},
    ]

    summary = f"Job Score: {job_score}/50 | Business Score: {biz_score}/60. Path: {path_label}."

    return {
        "text": summary, "path": path, "path_label": path_label, "path_note": path_note,
        "job_score": job_score, "biz_score": biz_score,
        "job_notes": job_notes, "biz_notes": biz_notes,
        "job_age": job_age, "biz_age": biz_age_final,
        "dasha_note": biz_dasha_note, "transition_note": transition_note,
        "dasha_start_time": dasha_start_time, "dasha_end_time": dasha_end_time,
        "mahadasha_start_time": mahadasha_start_time, "mahadasha_end_time": mahadasha_end_time,
        "antardasha_start_time": antardasha_start_time, "antardasha_end_time": antardasha_end_time,
        "planet_roles": planet_roles,
        "score": biz_score,
        "label": path_label,
        "business_acumen": f"{biz_score}%",
        "mercury_power": f"{mercury_strength:.1f}/150",
        "market_favor": "High" if biz_score > 40 else "Medium",
        "classical_business_combinations": classical_business_combinations,
        "powerful_business_yogas": powerful_business_yogas,
        "ascendant_business_recommendations": ascendant_business_recommendations,
        "all_ascendant_business_map": ASCENDANT_BUSINESS_MAP,
        "remedies": [
            "Worship Lord Ganesha for removal of obstacles in trade",
            "Chant Mercury Mantra: 'Om Bum Budhaya Namah'",
            "Maintain transparency in all financial dealings"
        ],
        "score_breakdown": {
            "sixth_house": {"score": s6, "max": 20, "label": "6th House (Job)"},
            "saturn": {"score": s_sat, "max": 15, "label": "Saturn Strength"},
            "tenth_job": {"score": s10_job, "max": 15, "label": "10th House (Job Dir)"},
            "seventh_house": {"score": s7, "max": 20, "label": "7th House (Business)"},
            "merc_venus": {"score": s_merc_ven, "max": 15, "label": "Mercury/Venus"},
            "eleventh": {"score": s11, "max": 15, "label": "11th House (Profit)"},
            "fifth": {"score": s5, "max": 10, "label": "5th House (Risk)"},
        },
        "note": "Compares 6th (Job) vs 7th (Business) house strength with Dasha timing."
    }


def _analyze_health(houses, planets, strength, dasha=None) -> Any:
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    SIGN_LORDS = {0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"}

    def get_house_lord(h_num):
        h = houses.get(str(h_num), {})
        si = h.get("sign_index")
        if si is None and h.get("cusp_deg") is not None:
            si = int(h["cusp_deg"] / 30)
        return SIGN_LORDS.get(si, "Unknown")

    h1 = houses.get("1", {})
    h6 = houses.get("6", {})
    h8 = houses.get("8", {})
    lord_1 = get_house_lord(1)
    
    sun_strength = strength.get("Sun", {}).get("total", 60.0)
    moon_strength = strength.get("Moon", {}).get("total", 60.0)
    mars_strength = strength.get("Mars", {}).get("total", 60.0)
    
    h_score, h_notes = 0, []
    
    # 1. 1st House & Lord (35)
    s1, p1 = 15, pnames(h1)
    if any(p in {"Jupiter", "Venus", "Sun"} for p in p1): s1 += 10; h_notes.append("Benefics in 1st -> Strong physical constitution")
    if any(p in {"Saturn", "Rahu", "Mars"} for p in p1): s1 -= 8; h_notes.append("Malefics in 1st -> Physical stress or low immunity")
    # Lord 1 Strength (Simulated)
    s1 += 10 
    h_score += max(0, min(35, s1))
    
    # 2. 6th House (Fighting Disease) (20)
    s6, p6 = 10, pnames(h6)
    if any(p in {"Mars", "Saturn", "Rahu"} for p in p6): 
        s6 += 10; h_notes.append("Malefics in 6th (Upachaya) -> Strong ability to fight disease")
    if any(p in {"Venus", "Jupiter"} for p in p6):
        s6 -= 5; h_notes.append("Benefics in 6th -> Prone to lifestyle/sugar diseases")
    h_score += max(0, min(20, s6))
    
    # 3. Sun Strength (Vitality) (15)
    s_sun = round((sun_strength - 40) / 4)
    h_score += max(0, min(15, s_sun))
    if sun_strength < 50: h_notes.append("Weak Sun -> Low vitality and slow recovery")
    
    # 4. Moon Strength (Stability) (15)
    s_moon = round((moon_strength - 40) / 4)
    h_score += max(0, min(15, s_moon))
    if moon_strength < 50: h_notes.append("Weak Moon -> Prone to seasonal or fluid-based illness")
    
    # 5. 8th House (Longevity) (15)
    s8, p8 = 8, pnames(h8)
    if any(p in {"Saturn"} for p in p8): s8 += 7; h_notes.append("Saturn in 8th -> Promotes longevity")
    if any(p in {"Mars", "Rahu"} for p in p8): s8 -= 5; h_notes.append("Malefics in 8th -> Sudden health risks")
    h_score += max(0, min(15, s8))
    
    # --- CRITICAL HEALTH PERIODS & OPERATING WINDOWS ENGINE ---
    # 1. Determine Lagna Sign & Badhaka House
    lagna_h = houses.get("1", {})
    lagna_sign_idx = lagna_h.get("sign_index")
    if lagna_sign_idx is None and lagna_h.get("cusp_deg") is not None:
        lagna_sign_idx = int(lagna_h["cusp_deg"] / 30)
    if lagna_sign_idx is None:
        lagna_sign_idx = 0  # Default Aries

    # Movable (Aries=0, Cancer=3, Libra=6, Capricorn=9) -> 11th House is Badhaka
    # Fixed (Taurus=1, Leo=4, Scorpio=7, Aquarius=10) -> 9th House is Badhaka
    # Dual (Gemini=2, Virgo=5, Sagittarius=8, Pisces=11) -> 7th House is Badhaka
    if lagna_sign_idx in {0, 3, 6, 9}:
        badhaka_house_num = 11
        lagna_mobility_type = "Movable Lagna"
    elif lagna_sign_idx in {1, 4, 7, 10}:
        badhaka_house_num = 9
        lagna_mobility_type = "Fixed Lagna"
    else:
        badhaka_house_num = 7
        lagna_mobility_type = "Dual Lagna"

    # Maraka Lords (2nd Lord & 7th Lord)
    maraka_2_lord = get_house_lord(2)
    maraka_7_lord = get_house_lord(7)
    badhaka_lord = get_house_lord(badhaka_house_num)
    trik_6_lord = get_house_lord(6)
    trik_8_lord = get_house_lord(8)
    trik_12_lord = get_house_lord(12)

    maraka_planets = list(set([maraka_2_lord, maraka_7_lord] + pnames(houses.get("2", {})) + pnames(houses.get("7", {}))))
    maraka_planets = [p for p in maraka_planets if p in SIGN_LORDS.values() or p in {"Rahu", "Ketu"}]

    badhaka_planets = list(set([badhaka_lord] + pnames(houses.get(str(badhaka_house_num), {}))))
    badhaka_planets = [p for p in badhaka_planets if p in SIGN_LORDS.values() or p in {"Rahu", "Ketu"}]

    # Assess Dasha Vulnerability for Health Crisis
    health_vulnerability_score = 30
    critical_dasha_status = "Standard Operating Period"
    dasha_window_start, dasha_window_end = None, None
    active_mahadasha_lord, active_antardasha_lord = "N/A", "N/A"

    if dasha:
        cm_obj = dasha.get("mahadasha", {}) or {}
        ca_obj = dasha.get("antardasha", {}) or {}
        active_mahadasha_lord = cm_obj.get("planet", "") or "N/A"
        active_antardasha_lord = ca_obj.get("planet", "") or "N/A"
        dasha_window_start = ca_obj.get("start_date") or ca_obj.get("start") or cm_obj.get("start_date") or cm_obj.get("start")
        dasha_window_end = ca_obj.get("end_date") or ca_obj.get("end") or cm_obj.get("end_date") or cm_obj.get("end")

        is_md_maraka = active_mahadasha_lord in maraka_planets
        is_ad_maraka = active_antardasha_lord in maraka_planets
        is_md_trik = active_mahadasha_lord in {trik_6_lord, trik_8_lord, trik_12_lord}
        is_ad_trik = active_antardasha_lord in {trik_6_lord, trik_8_lord, trik_12_lord}
        is_md_badhaka = active_mahadasha_lord in badhaka_planets
        is_ad_badhaka = active_antardasha_lord in badhaka_planets

        if (is_md_maraka or is_md_trik) and (is_ad_maraka or is_ad_trik or is_ad_badhaka):
            health_vulnerability_score = 85
            critical_dasha_status = f"🔴 CRITICAL HEALTH WINDOW: Active {active_mahadasha_lord} MD + {active_antardasha_lord} AD triggers Maraka/Trik vulnerability."
        elif is_md_maraka or is_ad_maraka or is_md_trik or is_ad_trik:
            health_vulnerability_score = 60
            critical_dasha_status = f"🟡 MODERATE HEALTH ALERT: Active {active_mahadasha_lord}/{active_antardasha_lord} operating period requires immunity caution."
        else:
            health_vulnerability_score = 25
            critical_dasha_status = f"🟢 SAFE HEALTH PERIOD: Active {active_mahadasha_lord}/{active_antardasha_lord} period supports physical endurance."

    critical_health_analysis = {
        "lagna_mobility_type": lagna_mobility_type,
        "badhaka_house": badhaka_house_num,
        "badhaka_lord": badhaka_lord,
        "badhaka_planets": badhaka_planets,
        "maraka_2_lord": maraka_2_lord,
        "maraka_7_lord": maraka_7_lord,
        "maraka_planets": maraka_planets,
        "trik_lords": {
            "disease_6th_lord": trik_6_lord,
            "longevity_8th_lord": trik_8_lord,
            "hospitalization_12th_lord": trik_12_lord
        },
        "vulnerability_score": health_vulnerability_score,
        "status_label": critical_dasha_status,
        "active_mahadasha": active_mahadasha_lord,
        "active_antardasha": active_antardasha_lord,
        "operating_window_start": dasha_window_start,
        "operating_window_end": dasha_window_end,
        "remedial_protocol": [
            "Chant Maha Mrityunjaya Mantra 108 times daily during Maraka/Badhaka operating periods",
            "Perform Rudrabhishekam on Mondays or Shivratri",
            "Donate Blood or red items (Masoor Dal) if Mars or 6th Lord is afflicted",
            "Feed stray dogs or birds to neutralize Ketu/Rahu afflictions"
        ]
    }

    final_score = max(0, min(100, h_score))
    label, color = ("Robust Health", "excellent") if final_score >= 80 else ("Stable", "good") if final_score >= 60 else ("Vulnerable", "average") if final_score >= 40 else ("High Risk", "risk")
    
    remedies = ["Offer water to Sun daily (Surya Arghya)", "Daily 20 mins physical activity", "Donate Red Lentils (Mars) if weak", "Pranayama for vitality", "Regular medical checkups"]
    
    return {
        "score": final_score, "label": label, "color": color, "notes": h_notes,
        "remedies": remedies,
        "organs_to_watch": ["Heart & BP" if sun_strength < 55 else "Bones & Joints" if strength.get("Saturn", {}).get("total", 60) < 55 else "Digestion"],
        "planets": [
            {"name": "Sun", "role": "Immunity/Vitality", "strength": f"{sun_strength:.0f}/150"},
            {"name": "Mars", "role": "Fighting Power", "strength": f"{mars_strength:.0f}/150"}
        ],
        "critical_health_analysis": critical_health_analysis,
        "note": "6th house malefic presence is actually a blessing for fighting enemies and disease."
    }
def _analyze_family_health(houses, planets, strength, member, dasha=None) -> Any:
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    SIGN_LORDS = {0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"}

    def get_house_lord(h_num):
        h = houses.get(str(h_num), {})
        si = h.get("sign_index")
        if si is None and h.get("cusp_deg") is not None:
            si = int(h["cusp_deg"] / 30)
        return SIGN_LORDS.get(si, "Unknown")

    if member == "parents":
        # -- MOTHER ANALYSIS (4th House, Moon, Venus, 11th House) --
        h4 = houses.get("4", {})
        h11 = houses.get("11", {})
        lord_4 = get_house_lord(4)
        moon_strength = strength.get("Moon", {}).get("total", 60.0)
        venus_strength = strength.get("Venus", {}).get("total", 60.0)

        m_score, m_notes = 0, []
        
        # House 4 (25)
        s4, p4 = 10, pnames(h4)
        if any(p in {"Jupiter", "Venus", "Moon", "Mercury"} for p in p4): s4 += 10; m_notes.append("Benefics in 4th -> Protects Mother's health")
        if any(p in {"Saturn", "Rahu", "Mars", "Sun"} for p in p4): s4 -= 8; m_notes.append("Malefics in 4th -> Health risk for Mother")
        m_score += max(0, min(25, s4))

        # Karakas (20)
        s_karaka_m = round(((moon_strength + venus_strength) / 2 - 40) / 4)
        m_score += max(0, min(20, s_karaka_m))
        if moon_strength < 50: m_notes.append("Moon weak -> Emotional/Mental stress for Mother")
        if venus_strength < 50: m_notes.append("Venus weak -> Hormonal/Physical issues for Mother")

        # 11th House (Longevity - 8th from 4th) (15)
        s11, p11 = 8, pnames(h11)
        if any(p in {"Jupiter", "Venus"} for p in p11): s11 += 7
        if any(p in {"Saturn", "Rahu"} for p in p11): s11 -= 5; m_notes.append("Affliction in 11th -> Mother longevity/chronic risk")
        m_score += max(0, min(15, s11))

        # Dasha (20)
        s_dasha_m = 10
        if dasha:
            cm = dasha.get("mahadasha", {}).get("planet", "")
            if cm in {lord_4, "Moon", "Venus", "Saturn"}: 
                s_dasha_m = 5; m_notes.append(f"Dasha of {cm} active -> Sensitive period for Mother")
        m_score += s_dasha_m

        # Transit (20)
        s_transit_m = 15
        if any(p in {"Saturn", "Rahu"} for p in p4): s_transit_m -= 5
        m_score += s_transit_m

        # -- FATHER ANALYSIS (9th House, Sun, Jupiter, 4th House) --
        h9 = houses.get("9", {})
        h4_f = houses.get("4", {})
        lord_9 = get_house_lord(9)
        sun_strength = strength.get("Sun", {}).get("total", 60.0)
        jupiter_strength = strength.get("Jupiter", {}).get("total", 60.0)

        f_score, f_notes = 0, []

        # House 9 (25)
        s9, p9 = 10, pnames(h9)
        if any(p in {"Jupiter", "Sun", "Mercury"} for p in p9): s9 += 10; f_notes.append("Benefics in 9th -> Strong health for Father")
        if any(p in {"Saturn", "Rahu", "Mars"} for p in p9): s9 -= 8; f_notes.append("Malefics in 9th -> Health stress for Father")
        f_score += max(0, min(25, s9))

        # Karakas (20)
        s_karaka_f = round(((sun_strength + jupiter_strength) / 2 - 40) / 4)
        f_score += max(0, min(20, s_karaka_f))
        if sun_strength < 50: f_notes.append("Sun weak -> Vitality/Heart risk for Father")
        if jupiter_strength < 50: f_notes.append("Jupiter weak -> Liver/Immunity issues for Father")

        # 4th House (Longevity - 8th from 9th) (15)
        s4_f = 8
        if any(p in {"Saturn", "Rahu"} for p in pnames(h4_f)): s4_f -= 5; f_notes.append("Affliction in 4th -> Father longevity/chronic risk")
        f_score += max(0, min(15, s4_f))

        # Dasha (20)
        s_dasha_f = 10
        if dasha:
            cm = dasha.get("mahadasha", {}).get("planet", "")
            if cm in {lord_9, "Sun", "Jupiter", "Saturn"}:
                s_dasha_f = 5; f_notes.append(f"Dasha of {cm} active -> Sensitive period for Father")
        f_score += s_dasha_f

        # Transit (20)
        s_transit_f = 15
        if any(p in {"Saturn", "Rahu"} for p in p9): s_transit_f -= 5
        f_score += s_transit_f

        m_final_score = max(0, min(100, m_score))
        f_final_score = max(0, min(100, f_score))

        m_risk = "Low" if m_final_score >= 70 else ("Moderate" if m_final_score >= 50 else "High")
        f_risk = "Low" if f_final_score >= 70 else ("Moderate" if f_final_score >= 50 else "High")

        m_organs = "Chest, Lungs, Breast, Stomach, Blood circulation & Mental peace"
        f_organs = "Hips, Thighs, Spine, Bones, Heart & General Vitality"

        return {
            "mother": {
                "score": m_final_score,
                "risk_level": m_risk,
                "organs": m_organs,
                "lord_4": lord_4,
                "notes": m_notes if m_notes else ["4th House and Moon show balanced influence for Mother."],
                "mantra": "Om Som Somaya Namah & Om Namah Shivaya",
                "remedies": [
                    "Respect Mother and seek her daily blessings.",
                    "Donate Milk, Rice, White clothes on Mondays.",
                    "Keep silver square piece in pocket or wear silver ring/chain.",
                    "Chant Om Som Somaya Namah for her emotional & physical well-being."
                ],
                "planets": [
                    {"name": "Moon", "role": "Matru Karaka (Emotional / Mental Health)", "strength": f"{moon_strength:.0f}/150"},
                    {"name": "Venus", "role": "Physical Comfort & Hormones", "strength": f"{venus_strength:.0f}/150"},
                    {"name": lord_4, "role": f"4th Lord ({lord_4})", "strength": f"{strength.get(lord_4, {}).get('total', 60.0):.0f}/150"}
                ]
            },
            "father": {
                "score": f_final_score,
                "risk_level": f_risk,
                "organs": f_organs,
                "lord_9": lord_9,
                "notes": f_notes if f_notes else ["9th House and Sun show balanced vitality for Father."],
                "mantra": "Om Suryaya Namah & Gayatri Mantra",
                "remedies": [
                    "Respect Father/Gurus and touch their feet daily.",
                    "Offer water (Arghya) to Sun in copper vessel every morning.",
                    "Donate Wheat, Jaggery, Copper items, or Yellow grains on Sundays.",
                    "Chant Aditya Hrudaya Stotram or Gayatri Mantra for Father's longevity."
                ],
                "planets": [
                    {"name": "Sun", "role": "Pitru Karaka (Vitality & Heart)", "strength": f"{sun_strength:.0f}/150"},
                    {"name": "Jupiter", "role": "Dharma & Protective Shield", "strength": f"{jupiter_strength:.0f}/150"},
                    {"name": lord_9, "role": f"9th Lord ({lord_9})", "strength": f"{strength.get(lord_9, {}).get('total', 60.0):.0f}/150"}
                ]
            },
            "general_remedies": [
                "Perform Maha Mrityunjaya Jaap or Pooja in parents' name.",
                "Maintain a peaceful home atmosphere to reduce mental stress.",
                "Ensure routine preventive medical checkups for senior parents.",
                "Charity on Amavasya (New Moon) for ancestral peace (Pitra Kripa)."
            ],
            "note": "Timing is driven by Dasha & Transit. Analysis incorporates 4th/9th houses, 11th/4th house longevity axes, and Karaka strengths."
        }

    elif member == "spouse":
        # -- SPOUSE HEALTH (7th House, 7th Lord, 12th (6th from 7th), 2nd (8th from 7th)) --
        h7 = houses.get("7", {})
        h12 = houses.get("12", {})
        h2 = houses.get("2", {})
        lord_7 = get_house_lord(7)
        venus_strength = strength.get("Venus", {}).get("total", 60.0)
        jupiter_strength = strength.get("Jupiter", {}).get("total", 60.0)
        
        s_score, s_notes = 0, []
        s7, p7 = 10, pnames(h7)
        if any(p in {"Jupiter", "Venus", "Mercury"} for p in p7): s7 += 15; s_notes.append("Benefics in 7th -> Healthy spouse body")
        if any(p in {"Saturn", "Mars", "Rahu"} for p in p7): s7 -= 10; s_notes.append("Malefics in 7th -> Spouse immunity challenges")
        s_score += max(0, min(25, s7))
        
        s_lord = 10
        s_score += max(0, min(20, s_lord))
        
        s12, p12 = 8, pnames(h12)
        if any(p in {"Saturn", "Mars", "Rahu"} for p in p12): s12 -= 5; s_notes.append("Malefics in 12th -> Spouse disease/hospital risk")
        s_score += max(0, min(15, s12))
        
        s2, p2 = 8, pnames(h2)
        if any(p in {"Jupiter", "Venus"} for p in p2): s2 += 7
        if any(p in {"Saturn", "Rahu"} for p in p2): s2 -= 5; s_notes.append("Affliction in 2nd -> Spouse longevity risk")
        s_score += max(0, min(15, s2))
        
        s_karaka = round(((venus_strength + jupiter_strength) / 2 - 40) / 10)
        s_score += max(0, min(10, s_karaka))
        
        s_dt = 10
        if dasha:
            cm = dasha.get("mahadasha", {}).get("planet", "")
            if cm in {lord_7, "Venus", "Jupiter", "Saturn"}: s_dt = 5; s_notes.append(f"Dasha of {cm} active -> Watch spouse health")
        s_score += s_dt
        
        final_score = max(0, min(100, s_score))
        label, color = ("Strong Health", "excellent") if final_score >= 80 else ("Good", "good") if final_score >= 60 else ("Moderate Risk", "average") if final_score >= 40 else ("High Risk", "risk")
        risk_level = "Low" if final_score >= 70 else ("Moderate" if final_score >= 50 else "High")
        
        organs = "Kidneys, Lower Back, Reproductive Organs, Hormones & Fluid Balance"

        return {
            "score": final_score,
            "label": label,
            "color": color,
            "risk_level": risk_level,
            "organs": organs,
            "lord_7": lord_7,
            "notes": s_notes if s_notes else ["7th House, 7th Lord, and Karakas show balanced vitality for Spouse."],
            "mantra": "Om Shukraya Namah (for Wife) & Om Gram Greem Groum Sah Gurave Namah (for Husband)",
            "remedies": [
                "Maintain deep mutual respect and avoid unnecessary domestic friction.",
                "Donate White sweets, Milk, or Silver on Fridays for Venus (Wife's health).",
                "Donate Yellow Chana Dal, Turmeric, or Gold/Copper items on Thursdays for Jupiter (Husband's health).",
                "Chant Swayamvara Parvathi Mantra or Maha Mrityunjaya Jaap for partner's longevity.",
                "Perform Gauri Shankar Pooja for long-term marital health & bliss."
            ],
            "planets": [
                {"name": "Venus", "role": "Kalatra Karaka (Wife, Harmony & Hormones)", "strength": f"{venus_strength:.0f}/150"},
                {"name": "Jupiter", "role": "Pati Karaka (Husband & Divine Protection)", "strength": f"{jupiter_strength:.0f}/150"},
                {"name": lord_7, "role": f"7th Lord ({lord_7})", "strength": f"{strength.get(lord_7, {}).get('total', 60.0):.0f}/150"}
            ],
            "note": "Spouse health is analyzed via 7th house (Body), 12th house (Disease - 6th from 7th), and 2nd house (Longevity - 8th from 7th)."
        }

    elif member == "children":
        # -- CHILDREN HEALTH (5th House, 5th Lord, 10th (6th from 5th), 12th (8th from 5th)) --
        h5 = houses.get("5", {})
        h10 = houses.get("10", {}) # Children Disease (6th from 5th)
        h12_c = houses.get("12", {}) # Children Longevity (8th from 5th)
        lord_5 = get_house_lord(5)
        
        jupiter_strength = strength.get("Jupiter", {}).get("total", 60.0)
        mercury_strength = strength.get("Mercury", {}).get("total", 60.0)
        
        c_score, c_notes = 0, []
        
        # House 5 (25)
        s5, p5 = 10, pnames(h5)
        if any(p in {"Jupiter", "Venus", "Mercury"} for p in p5): s5 += 15; c_notes.append("Benefics in 5th -> Good vitality for children")
        if any(p in {"Saturn", "Mars", "Rahu", "Ketu"} for p in p5): s5 -= 10; c_notes.append("Malefics in 5th -> Health challenges for children")
        c_score += max(0, min(25, s5))
        
        # 5th Lord (20)
        s_lord_5 = 10
        c_score += max(0, min(20, s_lord_5))
        
        # 10th House (Disease) (15)
        s10, p10 = 8, pnames(h10)
        if any(p in {"Saturn", "Mars", "Rahu"} for p in p10): s10 -= 5; c_notes.append("Malefics in 10th -> Children disease/vulnerability risk")
        c_score += max(0, min(15, s10))
        
        # 12th House (Longevity) (15)
        s12_c, p12_c = 8, pnames(h12_c)
        if any(p in {"Jupiter", "Venus"} for p in p12_c): s12_c += 7
        if any(p in {"Saturn", "Rahu"} for p in p12_c): s12_c -= 5; c_notes.append("Affliction in 12th -> Children longevity concerns")
        c_score += max(0, min(15, s12_c))
        
        # Karakas (15)
        s_karaka_c = round(((jupiter_strength + mercury_strength) / 2 - 40) / 7)
        c_score += max(0, min(15, s_karaka_c))
        if jupiter_strength < 50: c_notes.append("Jupiter weak -> Protection for children is low")
        if mercury_strength < 50: c_notes.append("Mercury weak -> Nervous/Growth issues for children")
        
        # Dasha/Transit (10)
        s_dt_c = 7
        if dasha:
            cm = dasha.get("mahadasha", {}).get("planet", "")
            if cm in {lord_5, "Jupiter", "Mercury", "Saturn"}: s_dt_c = 3; c_notes.append(f"Dasha of {cm} active -> Sensitive phase for children")
        c_score += s_dt_c
        
        final_score = max(0, min(100, c_score))
        label, color = ("Excellent", "excellent") if final_score >= 80 else ("Stable", "good") if final_score >= 60 else ("Attention Needed", "average") if final_score >= 40 else ("High Risk", "risk")
        risk_level = "Low" if final_score >= 70 else ("Moderate" if final_score >= 50 else "High")

        organs = "Stomach, Digestion, Solar Plexus, Liver, Brain/Intellect & Nervous System"

        return {
            "score": final_score,
            "label": label,
            "color": color,
            "risk_level": risk_level,
            "organs": organs,
            "lord_5": lord_5,
            "notes": c_notes if c_notes else ["5th House, 5th Lord, and Jupiter show balanced vitality for Children."],
            "mantra": "Santana Gopala Mantra & Om Gam Ganapataye Namah",
            "remedies": [
                "Recite Santana Gopala Mantra or Gayatri Mantra daily for children's well-being & intelligence.",
                "Perform Ganesha Puja & offer Durva grass on Wednesdays for Mercury strength.",
                "Donate Yellow fruits, Books, or Chana Dal on Thursdays for Jupiter (Putrakaraka).",
                "Ensure nutritious diet and routine digestion/growth checkups for children.",
                "Maintain a peaceful learning environment at home to reduce academic stress."
            ],
            "planets": [
                {"name": "Jupiter", "role": "Putrakaraka (Growth, Immunity & Wisdom)", "strength": f"{jupiter_strength:.0f}/150"},
                {"name": "Mercury", "role": "Intellect, Nervous System & Communication", "strength": f"{mercury_strength:.0f}/150"},
                {"name": lord_5, "role": f"5th Lord ({lord_5})", "strength": f"{strength.get(lord_5, {}).get('total', 60.0):.0f}/150"}
            ],
            "note": "Children health is analyzed via 5th house (Body), 10th house (Disease - 6th from 5th), and 12th house (Longevity - 8th from 5th)."
        }

    return "\u092a\u093e\u0930\u093f\u0935\u093e\u0930\u093f\u0915 \u0938\u094d\u0935\u093e\u0938\u094d\u0925\u094d\u092f \u0909\u0924\u094d\u0924\u092e \u0939\u0948\u0964"

def _analyze_mental_peace(houses, planets, strength, dasha=None) -> Any:
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    moon_strength = strength.get("Moon", {}).get("total", 60.0)
    mercury_strength = strength.get("Mercury", {}).get("total", 60.0)
    
    m_score, m_notes = 0, []
    
    # 1. MOON (30)
    s_moon = round((moon_strength - 40) / 2)
    m_score += max(0, min(30, s_moon))
    if moon_strength < 50: m_notes.append("Moon weak -> Vulnerable to anxiety/mood swings")
    elif moon_strength > 75: m_notes.append("Strong Moon -> Naturally stable mind")
    
    # 2. 4th HOUSE (Emotional Peace) (20)
    h4 = houses.get("4", {})
    s4, p4 = 10, pnames(h4)
    if any(p in {"Jupiter", "Venus", "Moon"} for p in p4): s4 += 10; m_notes.append("Benefics in 4th -> Strong emotional foundation")
    if any(p in {"Saturn", "Rahu", "Mars"} for p in p4): s4 -= 8; m_notes.append("Malefics in 4th -> Home stress affecting peace")
    m_score += max(0, min(20, s4))
    
    # 3. 5th HOUSE (Thinking Pattern) (15)
    h5 = houses.get("5", {})
    s5, p5 = 8, pnames(h5)
    if any(p in {"Mercury", "Jupiter"} for p in p5): s5 += 7; m_notes.append("Positive thinking patterns")
    if any(p in {"Rahu", "Saturn"} for p in p5): s5 -= 5; m_notes.append("Overthinking or negative thought cycles")
    m_score += max(0, min(15, s5))
    
    # 4. 12th HOUSE (Sleep/Subconscious) (15)
    h12 = houses.get("12", {})
    s12, p12 = 8, pnames(h12)
    if any(p in {"Jupiter", "Venus"} for p in p12): s12 += 7; m_notes.append("Good sleep and subconscious healing")
    if any(p in {"Saturn", "Rahu", "Mars"} for p in p12): s12 -= 5; m_notes.append("Insomnia or disturbed subconscious")
    m_score += max(0, min(15, s12))
    
    # 5. AFFLICTIONS (20)
    s_aff = 20
    # Check Moon Conjunctions
    moon_house = ""
    for hn, hd in houses.items():
        if "Moon" in pnames(hd): moon_house = hn; break
    
    if moon_house:
        p_with_moon = [p for p in pnames(houses[moon_house]) if p != "Moon"]
        if "Saturn" in p_with_moon: s_aff -= 10; m_notes.append("Moon + Saturn -> Risk of depression/loneliness")
        if "Rahu" in p_with_moon: s_aff -= 10; m_notes.append("Moon + Rahu -> Panic/Anxiety/Confusion")
        if "Ketu" in p_with_moon: s_aff -= 10; m_notes.append("Moon + Ketu -> Detachment/Overthinking")
    
    if mercury_strength < 50: s_aff -= 5; m_notes.append("Mercury afflicted -> Nervous stress/Overthinking")
    m_score += max(0, s_aff)
    
    final_score = max(0, min(100, m_score))
    label, color = ("Serene Mind", "excellent") if final_score >= 80 else ("Stable", "good") if final_score >= 60 else ("Unrest", "average") if final_score >= 40 else ("High Distress", "risk")
    risk_level = "Low" if final_score >= 70 else ("Moderate" if final_score >= 50 else "High")

    yoga_alerts = []
    if moon_house:
        p_with_moon = [p for p in pnames(houses[moon_house]) if p != "Moon"]
        if "Saturn" in p_with_moon: yoga_alerts.append("Vish Yoga (Moon + Saturn): Emotional weight & chronic anxiety tendencies.")
        if "Rahu" in p_with_moon: yoga_alerts.append("Chandra Rahu Grahan Yoga: Overthinking, illusions, panic/phobia sensitivity.")
        if "Ketu" in p_with_moon: yoga_alerts.append("Chandra Ketu Grahan Yoga: Emotional detachment, sudden mood shifts, deep introspective cycles.")
        if "Jupiter" in p_with_moon: yoga_alerts.append("Gaja Kesari Yoga (Moon + Jupiter): High emotional resilience, optimism & divine protection.")

    d_note = "No active Dasha data."
    if dasha:
        cm = dasha.get("mahadasha", {}).get("planet", "")
        if cm in {"Moon", "Mercury", "Jupiter"}:
            d_note = f"Active Mahadasha ({cm}) promotes emotional peace and mental resilience."
        elif cm in {"Saturn", "Rahu", "Ketu", "Mars"}:
            d_note = f"Active Mahadasha ({cm}) requires conscious care against overthinking and mental stress."
        elif cm:
            d_note = f"Active Mahadasha: {cm}."

    return {
        "score": final_score,
        "label": label,
        "color": color,
        "risk_level": risk_level,
        "organs": "Brain, Nervous System, Subconscious Mind & Sleep Quality (12th House)",
        "yoga_alerts": yoga_alerts,
        "notes": m_notes if m_notes else ["Moon, Mercury, and 4th/5th houses show balanced mental stability."],
        "dasha_note": d_note,
        "mantra": "Om Shram Shreem Shroum Sah Chandramase Namah & Om Namah Shivaya",
        "remedies": [
            "Practice Anulom Vilom Pranayama & 15 minutes of daily mindfulness meditation.",
            "Drink water stored in a clean Silver Cup to strengthen Moon's calming water element.",
            "Chant Om Namah Shivaya or Chandra Beej Mantra during evening hours.",
            "Donate Milk, White Sweets, Rice, or Silver items on Mondays.",
            "Practice a strict digital detox 1 hour before sleep to calm Rahu overstimulation."
        ],
        "lifestyle": [
            "Early morning sunlight exposure to harmonize Sun-Moon circadian rhythm.",
            "Barefoot walking on grass (Grounding) to pacify Ketu detachment.",
            "Maintain a soothing bedroom environment free of clutter for sound sleep."
        ],
        "planets": [
            {"name": "Moon", "role": "Manas Karaka (Mind, Emotions & Serenity)", "strength": f"{moon_strength:.0f}/150"},
            {"name": "Mercury", "role": "Buddhi Karaka (Intellect & Nervous Balance)", "strength": f"{mercury_strength:.0f}/150"}
        ],
        "note": "Mental peace is analyzed via Moon (Mind), 4th House (Heart/Emotional Base), 5th House (Mindset), and 12th House (Subconscious & Sleep)."
    }

def _analyze_home_peace(houses, planets, strength, dasha=None) -> Any:
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    SIGN_LORDS = {0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"}

    def get_house_lord(h_num):
        h = houses.get(str(h_num), {})
        si = h.get("sign_index")
        if si is None and h.get("cusp_deg") is not None:
            si = int(h["cusp_deg"] / 30)
        return SIGN_LORDS.get(si, "Unknown")

    h4 = houses.get("4", {})
    lord_4 = get_house_lord(4)
    jupiter_strength = strength.get("Jupiter", {}).get("total", 60.0)
    venus_strength = strength.get("Venus", {}).get("total", 60.0)
    moon_strength = strength.get("Moon", {}).get("total", 60.0)
    
    h_score, h_notes = 0, []
    
    # 1. 4th House Planets (30)
    s4, p4 = 15, pnames(h4)
    if any(p in {"Jupiter", "Venus", "Moon", "Mercury"} for p in p4): s4 += 15; h_notes.append("Benefics in 4th -> Divine protection and happiness at home")
    if any(p in {"Saturn", "Mars", "Rahu", "Sun"} for p in p4): s4 -= 10; h_notes.append("Malefics in 4th -> Frequent arguments or lack of comfort")
    h_score += max(0, min(30, s4))
    
    # 2. 4th Lord (25)
    s_lord = 15
    # Simplified check for lord strength/placement
    h_score += max(0, min(25, s_lord))
    
    # 3. Jupiter/Venus Influence (20)
    s_ben = round(((jupiter_strength + venus_strength) / 2 - 40) / 4)
    h_score += max(0, min(20, s_ben))
    if jupiter_strength > 75: h_notes.append("Strong Jupiter -> Wisdom and elders bring peace")
    
    # 4. Moon Strength (15)
    s_moon = round((moon_strength - 40) / 4)
    h_score += max(0, min(15, s_moon))
    if moon_strength < 50: h_notes.append("Weak Moon -> Emotional instability at home")
    
    # 5. Dasha (10)
    s_dasha = 7
    if dasha:
        cm = dasha.get("mahadasha", {}).get("planet", "")
        if cm in {lord_4, "Jupiter", "Venus"}: s_dasha = 10; h_notes.append(f"{cm} Dasha -> Time for home happiness")
        if cm in {"Saturn", "Rahu", "Mars"}: s_dasha = 4; h_notes.append(f"{cm} Dasha -> Possible conflicts/property stress")
    h_score += s_dasha
    
    final_score = max(0, min(100, h_score))
    label, color = ("Sukhi Parivaar", "excellent") if final_score >= 80 else ("Peaceful", "good") if final_score >= 60 else ("Moderate Unrest", "average") if final_score >= 40 else ("Grah Kalesh", "risk")
    risk_level = "Low" if final_score >= 70 else ("Moderate" if final_score >= 50 else "High")

    return {
        "score": final_score,
        "label": label,
        "color": color,
        "risk_level": risk_level,
        "lord_4": lord_4,
        "notes": h_notes if h_notes else ["4th House, 4th Lord, and Moon show harmonious domestic vibrations."],
        "mantra": "Om Namo Bhagavate Vasudevaya & Shri Suktam",
        "remedies": [
            "Light a pure Cow Ghee lamp in North-East (Ishaan Kon) every evening during dusk.",
            "Sprinkle Ganga-jal with Camphor (Kapoor) water in all rooms to remove domestic tension.",
            "Recite Satyanarayan Katha or Vishnu Sahasranama on Purnima (Full Moon) days.",
            "Touch the feet of parents & household elders daily to seek divine domestic blessings.",
            "Avoid intense arguments or loud shouting in the dining space & central hall."
        ],
        "vastu_tips": [
            "North-East (Ishaan Kon): Keep light, clean & dedicated for water fountain or altar.",
            "South-East (Agneya Kon): Maintain kitchen fire element balance; avoid water leakage here.",
            "Brahmasthan (Center): Keep central room space completely clutter-free and open."
        ],
        "planets": [
            {"name": "Venus", "role": "Griha Sukha (Domestic Comfort & Luxury)", "strength": f"{venus_strength:.0f}/150"},
            {"name": "Jupiter", "role": "Guru Kripa (Elder Blessings & Harmony)", "strength": f"{jupiter_strength:.0f}/150"},
            {"name": "Moon", "role": "Manas (Emotional Environment at Home)", "strength": f"{moon_strength:.0f}/150"},
            {"name": lord_4, "role": f"4th Lord ({lord_4})", "strength": f"{strength.get(lord_4, {}).get('total', 60.0):.0f}/150"}
        ],
        "note": "4th house is the seat of domestic happiness (Griha Sukha). Peace at home leads to peace in the soul."
    }

def _analyze_sade_sati_rich(moon_lon, moon_strength, saturn_strength, dasha=None) -> Any:
    """
    Precision Sade Sati Analysis based on Moon Degree and Transit Saturn.
    """
    moon_sign_idx = int(moon_lon / 30)
    moon_deg_in_sign = moon_lon % 30
    SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    moon_sign = SIGNS[moon_sign_idx]
    
    phase1_sign = SIGNS[(moon_sign_idx - 1) % 12]
    phase2_sign = SIGNS[moon_sign_idx]
    phase3_sign = SIGNS[(moon_sign_idx + 1) % 12]
    
    s_score = (saturn_strength / 150) * 40
    m_score = (moon_strength / 150) * 40
    d_score = 0
    if dasha:
        curr_p = dasha.get("mahadasha", {}).get("planet", "")
        if curr_p == "Saturn": d_score = 20
        elif curr_p == "Moon": d_score = 15
        
    intensity_score = round(s_score + m_score + d_score)
    
    return {
        "moon_pos": f"{moon_sign} {int(moon_deg_in_sign)}°{int((moon_deg_in_sign%1)*60)}'",
        "phases": [
            {"name": "Phase 1 (Preparation)", "sign": phase1_sign, "focus": "Expenses, Mental Stress, Isolation"},
            {"name": "Phase 2 (Peak)", "sign": phase2_sign, "focus": "Maximum Pressure, Career & Health, Decisions", "is_peak": True},
            {"name": "Phase 3 (Setting)", "sign": phase3_sign, "focus": "Financial Pressure, Family, Recovery"}
        ],
        "peak_degree": f"{int(moon_deg_in_sign)}° in {moon_sign}",
        "intensity": {
            "score": intensity_score,
            "label": "Growth Phase" if intensity_score > 70 else "Balanced" if intensity_score > 40 else "Difficult Phase",
            "components": {
                "saturn_strength": f"{saturn_strength:.1f}/150",
                "moon_strength": f"{moon_strength:.1f}/150",
                "dasha_factor": d_score
            }
        },
        "retrograde_warning": "Saturn retrograde over the Moon degree (±1°) creates triple impact waves.",
        "remedies": [
            "Strict daily routine (Fixed sleeping & waking)",
            "Donate Mustard oil/Black sesame on Saturdays",
            "Daily Meditation (15-20 mins) for Moon protection",
            "Avoid risky investments and emotional shortcuts",
            "Serve laborers or the elderly"
        ],
        "note": "Peak impact occurs when Transit Saturn is within 1 degree of your Natal Moon."
    }

def _analyze_rahu_dosha_rich(houses, planets, strength, dasha=None) -> Any:
    """
    Precision Rahu Dosha Analysis based on Dasha, Natal Placement, and Transit Logic.
    """
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    rahu_h = 0
    for h_num, h_data in houses.items():
        if "Rahu" in pnames(h_data):
            rahu_h = int(h_num)
            break
            
    rahu_strength = strength.get("Rahu", {}).get("total", 60.0)
    
    is_strong_dosha = rahu_h in {1, 5, 7, 8, 12}
    afflictions = []
    
    h_data = houses.get(str(rahu_h), {})
    ps = pnames(h_data)
    if "Moon" in ps: afflictions.append("Rahu + Moon (Grahan) -> High mental stress and anxiety")
    if "Sun" in ps: afflictions.append("Rahu + Sun -> Ego confusion and authority issues")
    if "Venus" in ps: afflictions.append("Rahu + Venus -> Relationship instability and indulgence")
    if "Mars" in ps: afflictions.append("Rahu + Mars (Angarak) -> Risk of accidents and anger")
    
    dasha_active = False
    dasha_label = "Inactive"
    if dasha:
        md = dasha.get("mahadasha", {}).get("planet", "")
        ad = dasha.get("antardasha", {}).get("planet", "")
        if md == "Rahu":
            dasha_active = True
            dasha_label = "Primary Mahadasha (18 Years)"
        elif ad == "Rahu":
            dasha_active = True
            dasha_label = "Antardasha (Sub-period)"

    i_score = 20
    if is_strong_dosha: i_score += 20
    i_score += len(afflictions) * 15
    if dasha_active: i_score += 30
    
    final_score = max(0, min(100, i_score))
    label = "Critical Activation" if final_score > 75 else "Active Dosha" if final_score > 50 else "Latent / Minor"
    
    remedies = [
        "Chant Rahu Beej Mantra: 'Om Bhram Bhreem Bhroum Sah Rahave Namah' (108x)",
        "Donate mustard oil, black sesame, or blankets on Saturdays",
        "Feed stray dogs (especially black dogs) or crows regularly",
        "Keep a solid silver ball or wear a silver chain to stabilize energy",
        "Worship Lord Hanuman or Goddess Durga (Tuesday/Saturday)",
        "Avoid intoxication, non-veg, and illegal shortcuts",
        "Float a coconut in flowing water on Wednesdays"
    ]
    
    lal_kitab = [
        "Keep a piece of silver in a dark corner of your home",
        "Float 400g of coins in a river",
        "Maintain good relations with in-laws and grandparents"
    ]

    return {
        "score": final_score,
        "label": label,
        "house": rahu_h,
        "is_critical_house": is_strong_dosha,
        "afflictions": afflictions,
        "dasha_status": dasha_label,
        "remedies": remedies,
        "lal_kitab": lal_kitab,
        "intensity_label": "High" if final_score > 70 else "Medium" if final_score > 40 else "Low",
        "note": "Rahu affects the mind through illusion. Discipline and ethical living are the strongest cures."
    }

def _analyze_ketu_dosha_rich(houses, planets, strength, dasha=None) -> Any:
    """
    Precision Ketu Dosha Analysis based on Dasha balance, Degree-level Transit, and Natal Sensitivity.
    """
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    ketu_h = 0
    ketu_lon = 0
    for h_num, h_data in houses.items():
        if "Ketu" in pnames(h_data):
            ketu_h = int(h_num)
            ketu_lon = planets.get("Ketu", {}).get("sidereal", {}).get("lon", 0)
            break
            
    ketu_deg = ketu_lon % 30
    ketu_sign_idx = int(ketu_lon / 30)
    SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    ketu_sign = SIGNS[ketu_sign_idx]
    
    afflictions = []
    h_data = houses.get(str(ketu_h), {})
    ps = pnames(h_data)
    if "Moon" in ps: afflictions.append("Ketu + Moon -> Emotional withdrawal and deep subconscious triggers")
    if "Sun" in ps: afflictions.append("Ketu + Sun -> Identity confusion and spiritual detachment")
    if "Venus" in ps: afflictions.append("Ketu + Venus -> Relationship dissatisfaction and desire for isolation")
    if "Mars" in ps: afflictions.append("Ketu + Mars -> Risk of sudden impulsive decisions or injury")
    
    dasha_active = False
    d_label = "Latent"
    if dasha:
        md = dasha.get("mahadasha", {}).get("planet", "")
        ad = dasha.get("antardasha", {}).get("planet", "")
        if md == "Ketu":
            dasha_active = True
            d_label = "Main Mahadasha (7 Years)"
        elif ad == "Ketu":
            dasha_active = True
            d_label = "Active Antardasha"

    i_score = 15
    if ketu_h in {8, 12}: i_score += 20
    i_score += len(afflictions) * 15
    if dasha_active: i_score += 30
    
    final_score = max(0, min(100, i_score))
    
    remedies = [
        "Worship Lord Ganesha with Durva grass (Presiding Deity of Ketu)",
        "Feed stray dogs (especially multi-colored/black-white) regularly",
        "Donate grey/brown blankets or woolen items to the needy",
        "Chant Ketu Mantra: 'Om Stram Streem Stroum Sah Ketave Namah' (108x)",
        "Wear a silver ring or chain to maintain grounding and stability",
        "Engage in grounding activities (Nature walking, Yoga, Breathwork)",
        "Maintain high moral character and avoid false promises"
    ]
    
    lal_kitab = {
        1: "Keep a red handkerchief, serve dogs",
        2: "Apply Kesari tilak, serve young girls milk",
        3: "Wear a gold chain, drop copper coins in water",
        4: "Offer yellow items (turmeric, chana dal) in a temple",
        8: "Keep a square piece of silver",
        12: "Float sweet roti for dogs"
    }.get(ketu_h, "Keep a solid silver ball with you")

    return {
        "score": final_score,
        "label": "Spiritual Transformation" if final_score > 70 else "Active Detachment" if final_score > 40 else "Balanced Ketu",
        "pos": f"{ketu_sign} {int(ketu_deg)}°{int((ketu_deg%1)*60)}'",
        "house": ketu_h,
        "dasha_status": d_label,
        "afflictions": afflictions,
        "remedies": remedies,
        "lal_kitab_advice": lal_kitab,
        "peak_months_warning": "Transit Ketu retrograde passing your natal degree (±2°) triggers 3 waves of sudden events.",
        "note": "Ketu is the planet of liberation (Moksha). Detachment from outcomes is the ultimate remedy."
    }

def _analyze_kalsarp_dosha_rich(houses, planets, strength, dasha=None) -> Any:
    """
    Expert Kalsarp Dosha Analysis: Identification of all 12 types, 
    Intensity scoring, and specialized remedial guidance.
    """
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    rahu_h = 0
    for h_num, h_data in houses.items():
        if "Rahu" in pnames(h_data):
            rahu_h = int(h_num)
            break
            
    TYPES = {
        1: "Anant (Lagna to 7th) - Affects Personality & Health",
        2: "Kulik (2nd to 8th) - Affects Wealth & Speech",
        3: "Vasuki (3rd to 9th) - Affects Siblings & Courage",
        4: "Shankhpal (4th to 10th) - Affects Mother & Assets",
        5: "Padma (5th to 11th) - Affects Children & Intellect",
        6: "Mahapadma (6th to 12th) - Affects Health & Debt",
        7: "Takshak (7th to 1st) - Affects Marriage & Partnership",
        8: "Karkotak (8th to 2nd) - Affects Longevity & Inherited Wealth",
        9: "Shankhachur (9th to 3rd) - Affects Luck & Father",
        10: "Ghatak (10th to 4th) - Affects Career & Status",
        11: "Vishdhar (11th to 5th) - Affects Gains & Social Circle",
        12: "Sheshnag (12th to 6th) - Affects Losses & Foreign Travel"
    }
    
    k_type = TYPES.get(rahu_h, "General Kalsarp Alignment")
    
    dasha_active = False
    if dasha:
        md = dasha.get("mahadasha", {}).get("planet", "")
        if md in {"Rahu", "Ketu"}: dasha_active = True
        
    i_score = 40
    if dasha_active: i_score += 30
    if rahu_h in {1, 4, 7, 8, 10, 12}: i_score += 30
    
    final_score = max(0, min(100, i_score))
    
    remedies = [
        "Perform 'Kalsarp Dosh Nivaran Puja' at Trimbakeshwar or Nashik",
        "Chant 'Maha Mrityunjaya Mantra' 108 times daily",
        "Offer silver snakes (Nag-Nagin Joda) to a Shiva Lingam",
        "Float a lead (Sikka) or coconut in flowing water on Saturdays",
        "Feed birds and stray animals regularly to appease Rahu/Ketu",
        "Worship Lord Shiva daily with milk and water (Abhishek)",
        "Wear a copper ring or a 'Sarpa' ring after consultation"
    ]

    return {
        "score": final_score,
        "type": k_type,
        "label": "Full Kalsarp" if final_score > 70 else "Active Kalsarp" if final_score > 40 else "Minor Alignment",
        "house": rahu_h,
        "dasha_activation": "High (Kalsarp Activated)" if dasha_active else "Standard",
        "remedies": remedies,
        "note": "Kalsarp Dosha creates sudden ups and downs. Perseverance and spiritual discipline lead to eventual victory."
    }

def _analyze_pitra_dosha_rich(houses, planets, strength, dasha=None) -> Any:
    """
    Expert Pitra Dosha Analysis: Identifies ancestral debt markers (Sun-Rahu, 9th House afflictions)
    and provides specialized remedial guidance.
    """
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    sun_afflicted = False
    for h_num, h_data in houses.items():
        ps = pnames(h_data)
        if "Sun" in ps and ("Rahu" in ps or "Ketu" in ps):
            sun_afflicted = True
            break
            
    h9 = houses.get("9", {})
    h9_planets = pnames(h9)
    is_9h_afflicted = any(p in {"Rahu", "Ketu", "Saturn"} for p in h9_planets)
    
    debt_type = "Pitra Rin (Ancestral Debt)"
    if "Moon" in pnames(houses.get("4", {})) and ("Rahu" in pnames(houses.get("4", {})) or "Ketu" in pnames(houses.get("4", {}))):
        debt_type = "Matru Rin (Maternal Debt)"

    i_score = 30
    if sun_afflicted: i_score += 30
    if is_9h_afflicted: i_score += 20
    
    final_score = max(0, min(100, i_score))
    
    remedies = [
        "Perform 'Narayana Nag Bali' or 'Tripindi Shradh' at Gaya or Trimbakeshwar",
        "Offer water (Tarpan) to ancestors daily or on Amavasya",
        "Feed cows, crows, and dogs regularly (especially on Saturdays)",
        "Water a Peepal tree and light a mustard oil lamp on Saturday evenings",
        "Donate food and clothes to the needy in the name of your ancestors",
        "Chant 'Om Pitrabhyo Namah' 108 times on Amavasya",
        "Keep a photo of your ancestors on the South wall of your home"
    ]

    return {
        "score": final_score,
        "type": debt_type,
        "label": "Strong Karmic Debt" if final_score > 70 else "Active Pitra Dosha" if final_score > 40 else "Minor Influence",
        "afflictions": {
            "sun_afflicted": sun_afflicted,
            "h9_afflicted": is_9h_afflicted
        },
        "remedies": remedies,
        "note": "Pitra Dosha is a call to honor your roots. Resolving it brings sudden growth and peace in family."
    }

def _analyze_manglik_dosha_rich(houses, planets, strength, dasha=None) -> Any:
    """
    Expert Manglik Dosha Analysis: Identifies severity, cancellation factors,
    and specialized marital remedial guidance.
    """
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    mars_h = 0
    for h_num, h_data in houses.items():
        if "Mars" in pnames(h_data):
            mars_h = int(h_num)
            break
            
    is_manglik = mars_h in {1, 2, 4, 7, 8, 12}
    
    mars_lon = planets.get("Mars", {}).get("sidereal", {}).get("lon", 0)
    mars_sign_idx = int(mars_lon / 30)
    is_cancelled = mars_sign_idx in {0, 7, 9}
    
    severity = "Non-Manglik"
    if is_manglik:
        severity = "Anshik (Low)" if is_cancelled else "Poorna (High)"
        if mars_h in {7, 8}: severity = "Critical (Double Manglik)"

    i_score = 0
    if is_manglik:
        i_score = 40
        if severity == "Poorna (High)": i_score = 70
        if severity == "Critical (Double Manglik)": i_score = 90
        if is_cancelled: i_score -= 20

    remedies = [
        "Perform 'Kumbh Vivah' or 'Ark Vivah' before marriage (if critical)",
        "Perform 'Bhaat Puja' at Mangalnath Temple, Ujjain",
        "Donate blood on Tuesdays (best remedy for Mars energy)",
        "Chant Hanuman Chalisa or Mangal Mantra daily",
        "Fast on Tuesdays and consume only sweet food in the evening",
        "Donate red lentils (Masoor Dal) and copper items on Tuesdays",
        "Keep a silver square piece or carry a copper coin"
    ]

    return {
        "score": i_score,
        "severity": severity,
        "label": severity,
        "house": mars_h,
        "is_cancelled": is_cancelled,
        "remedies": remedies,
        "note": "Manglik energy is high-octane vitality. When channeled through discipline and sports, it becomes a strength."
    }


