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

    def get_house_for_planet(p_name):
        for h_num, h_data in houses.items():
            if p_name in pnames(h_data):
                return int(h_num)
        return None

    delay_factors = 0
    early_factors = 0

    # ── STEP 1: 7th House ──────────────────────────────────────────────────────
    h7 = houses.get("7", {})
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
        h_of_lord = houses.get(str(seventh_lord_house), {})
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
        h_conj = houses.get(str(seventh_lord_house), {})
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
        "note": "Accuracy: Dasha + Transit + D9 together = 90-95%. Consult an astrologer for the exact year."
    }

def _analyze_business(houses, planets, strength, dasha=None) -> Dict[str, Any]:
    SIGN_LORDS = {0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"}

    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    def house_sign_idx(h_num):
        h = houses.get(str(h_num), {})
        si = h.get("sign_index")
        if si is None and h.get("cusp_deg") is not None:
            si = int(h["cusp_deg"] / 30)
        return si

    def house_lord(h_num):
        si = house_sign_idx(h_num)
        return SIGN_LORDS.get(si, "Unknown") if si is not None else "Unknown"

    h6_planets = pnames(houses.get("6", {}))
    h7_planets = pnames(houses.get("7", {}))
    h10_planets = pnames(houses.get("10", {}))
    h11_planets = pnames(houses.get("11", {}))
    h5_planets = pnames(houses.get("5", {}))

    lord_6, lord_7, lord_10, lord_11 = house_lord(6), house_lord(7), house_lord(10), house_lord(11)

    mercury_strength = strength.get("Mercury", {}).get("total", 60.0)
    venus_strength = strength.get("Venus", {}).get("total", 60.0)
    saturn_strength = strength.get("Saturn", {}).get("total", 60.0)
    jupiter_strength = strength.get("Jupiter", {}).get("total", 60.0)

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

    if dasha:
        cm = dasha.get("mahadasha", {}).get("planet", "") or ""
        ca = dasha.get("antardasha", {}).get("planet", "") or ""
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
        "planet_roles": planet_roles,
        "score": biz_score,
        "label": path_label,
        "business_acumen": f"{biz_score}%",
        "mercury_power": f"{mercury_strength:.1f}/150",
        "market_favor": "High" if biz_score > 40 else "Medium",
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

        return {
            "mother": {
                "score": max(0, min(100, m_score)), "notes": m_notes,
                "remedies": ["Respect mother", "Donate Milk, Rice, White clothes", "Peaceful home environment"],
                "planets": [{"name": "Moon", "role": "Mental Health", "strength": f"{moon_strength:.0f}/150"}, {"name": "Venus", "role": "Physical Comfort", "strength": f"{venus_strength:.0f}/150"}]
            },
            "father": {
                "score": max(0, min(100, f_score)), "notes": f_notes,
                "remedies": ["Respect father/guru", "Offer water to Sun daily", "Donate Wheat, Jaggery, Yellow items"],
                "planets": [{"name": "Sun", "role": "Vitality/Heart", "strength": f"{sun_strength:.0f}/150"}, {"name": "Jupiter", "role": "Protection", "strength": f"{jupiter_strength:.0f}/150"}]
            },
            "general_remedies": ["Charity in parents' name", "Avoid conflicts", "Regular health checkups"],
            "note": "Timing is driven by Dasha & Transit. Analysis uses 4th/9th houses and Longevity patterns."
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
        
        return {
            "score": final_score, "label": label, "color": color, "notes": s_notes,
            "remedies": ["Maintain harmony", "Donate White items (for Wife) / Yellow (for Husband)", "Discipline & Charity"],
            "planets": [{"name": "Venus", "role": "Wife/Comfort", "strength": f"{venus_strength:.0f}/150"}, {"name": "Jupiter", "role": "Husband/Protection", "strength": f"{jupiter_strength:.0f}/150"}],
            "note": "Spouse health is analyzed via 7th house (Body), 12th (Disease) and 2nd (Longevity)."
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
        
        return {
            "score": final_score, "label": label, "color": color, "notes": c_notes,
            "remedies": ["Worship Lord Ganesha", "Donate Green items (Mercury)", "Respect Guru/Elders (Jupiter)", "Regular health checkups"],
            "planets": [
                {"name": "Jupiter", "role": "Primary Karaka", "strength": f"{jupiter_strength:.0f}/150"},
                {"name": "Mercury", "role": "Growth/Intelligence", "strength": f"{mercury_strength:.0f}/150"}
            ],
            "note": "Children health is analyzed via 5th house (Body), 10th (Disease) and 12th (Longevity)."
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
    
    # Remedies
    remedies = ["Daily Meditation (mandatory)", "Stay near water/nature", "Donate Milk/Rice (Moon)", "Digital Detox (Rahu)", "Grounding/Barefoot walking (Ketu)"]
    
    # Dasha
    d_note = "Emotional cycles are currently stable."
    if dasha:
        cm = dasha.get("mahadasha", {}).get("planet", "")
        if cm in {"Moon", "Saturn", "Rahu", "Ketu"}:
            d_note = f"{cm} Dasha active -> High-sensitivity phase for mental peace."

    return {
        "score": final_score, "label": label, "color": color, "notes": m_notes,
        "dasha_note": d_note, "remedies": remedies,
        "lifestyle": ["Wake up early", "Sunlight exposure", "Yoga/Pranayama", "Avoid isolation"],
        "planets": [
            {"name": "Moon", "role": "Mind & Emotions", "strength": f"{moon_strength:.0f}/150"},
            {"name": "Mercury", "role": "Thought Process", "strength": f"{mercury_strength:.0f}/150"}
        ],
        "note": "Mental peace is the foundation of all success. Discipline + Meditation = Real Cure."
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
    
    remedies = ["Ghee lamp in North-East (Ishaan Kon)", "Respect parents/elders daily", "Recite Satyanarayan Katha", "Spray Ganga-jal in rooms", "Keep North-East clutter-free"]
    
    return {
        "score": final_score, "label": label, "color": color, "notes": h_notes,
        "remedies": remedies,
        "vastu_tips": ["Place a small water fountain in NE", "Avoid heavy furniture in center (Brahmasthan)", "Worship Lord Vishnu & Lakshmi"],
        "planets": [
            {"name": "Jupiter", "role": "Blessing/Elders", "strength": f"{jupiter_strength:.0f}/150"},
            {"name": "Venus", "role": "Luxury/Comfort", "strength": f"{venus_strength:.0f}/150"}
        ],
        "note": "4th house is the seat of happiness. Peace at home leads to progress in the world."
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


