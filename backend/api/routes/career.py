from fastapi import APIRouter, HTTPException, Body
from core.database import career_collection, tenth_house_lord_collection, planets_in_tenth_house_collection, career_planet_roles_collection, nakshatras_collection, zodiac_signs_collection
from typing import Dict, Any
from reports.report_data import assemble_report_data

router = APIRouter()

@router.get("")
async def get_career_insights():
    """
    Fetch all career-related astrological insights and remedies from MongoDB.
    Returns fallback data if the database is unreachable or empty.
    """
    fallback_career = [
        {
            "category": "Archetype",
            "title": "The Sun: Leadership & Authority",
            "content": "The Sun represents your professional identity and public standing. A strong Sun in D10 favors government roles and executive leadership.",
            "icon": "☀️"
        },
        {
            "category": "Skills",
            "title": "Mercury: Commerce & Communication",
            "content": "Mercury governs business acumen, writing, and analytical professions. It is the key planet for success in trade and technology.",
            "icon": "☿"
        },
        {
            "category": "Ambition",
            "title": "Mars: The Drive to Succeed",
            "content": "Mars provides the energy and competitive spirit needed for professional growth. It is essential for engineers, athletes, and military leaders.",
            "icon": "🚀"
        }
    ]
    try:
        cursor = career_collection.find({})
        results = await cursor.to_list(length=100)
        
        if not results:
            return fallback_career

        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        print(f"Career API Error (falling back to defaults): {e}")
        return fallback_career

@router.get("/tenth-house")
async def get_tenth_house_analysis():
    """
    Fetch career field indications based on 10th house lord placement.
    """
    try:
        cursor = tenth_house_lord_collection.find({})
        results = await cursor.to_list(length=100)
        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/planets-in-tenth")
async def get_planets_in_tenth():
    """
    Fetch career, authority, and professional impact of planets placed in the 10th house.
    """
    try:
        cursor = planets_in_tenth_house_collection.find({})
        results = await cursor.to_list(length=100)
        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/zodiac-signs")
async def get_zodiac_signs():
    """
    Fetch career indications based on the 10th house zodiac sign.
    """
    try:
        cursor = zodiac_signs_collection.find({})
        results = await cursor.to_list(length=100)
        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/planet-roles")
async def get_career_planet_roles():
    """
    Fetch specific professions and career fields governed by each planet.
    """
    try:
        cursor = career_planet_roles_collection.find({})
        results = await cursor.to_list(length=100)
        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

SIGN_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

def get_house_str(house_num):
    if not house_num: return "Unknown House"
    suffixes = {1: "st", 2: "nd", 3: "rd"}
    suffix = suffixes.get(house_num if house_num <= 3 else 0, "th")
    return f"{house_num}{suffix} House"

HINDI_TRANSLATIONS = {
    "Aries": "मेष", "Taurus": "वृषभ", "Gemini": "मिथुन", "Cancer": "कर्क",
    "Leo": "सिंह", "Virgo": "कन्या", "Libra": "तुला", "Scorpio": "वृश्चिक",
    "Sagittarius": "धनु", "Capricorn": "मकर", "Aquarius": "कुंभ", "Pisces": "मीन",
    "Professional Archetype": "पेशेवर व्यक्तित्व",
    "Career Path": "करियर का मार्ग",
    "Zodiac Influence": "राशि का प्रभाव",
    "Workplace Influence": "कार्यक्षेत्र का प्रभाव",
    "Professional DNA": "पेशेवर डी.एन.ए.",
    "Skill Set": "कौशल सेट",
    "D-10 (Career Depth)": "D-10 (करियर की गहराई)",
    "Sun": "सूर्य", "Moon": "चंद्रमा", "Mars": "मंगल", "Mercury": "बुध",
    "Jupiter": "बृहस्पति", "Venus": "शुक्र", "Saturn": "शनि", "Rahu": "राहु", "Ketu": "केतु"
}

@router.post("/personal")
async def get_personal_career_analysis(payload: Dict[str, Any] = Body(...)):
    """
    Calculate personalized career insights based on birth data, 
    pulling deep analysis from the specialized career database.
    Supports Hindi translation via 'lang' parameter.
    """
    try:
        name = payload.get("name", "User")
        date = payload.get("date")
        time = payload.get("time", "12:00:00")
        lang = payload.get("lang", "english")
        
        try:
            lat = float(payload.get("lat", 0))
            lon = float(payload.get("lon", 0))
            tz_offset = float(payload.get("tz_offset", 0.0))
        except (ValueError, TypeError):
            return []

        if not date:
            return []

        # Assemble report data to get planetary positions and divisional charts
        data = assemble_report_data(
            name=name,
            date=date,
            time=time,
            tz_offset=tz_offset,
            lat=lat,
            lon=lon
        )

        planets = data.get("planet_positions", [])
        houses_data = data.get("charts", {}).get("houses", {})
        
        analysis = []
        
        # --- 1. NAKSHATRA ANALYSIS ---
        moon_nak = data.get("panchang", {}).get("nakshatra", {}).get("nakshatra_name")
        if moon_nak:
            nak_doc = await nakshatras_collection.find_one({"name": moon_nak})
            if nak_doc:
                analysis.append({
                    "category": "Professional Archetype",
                    "title": f"Born in {moon_nak}",
                    "content": f"Your birth Nakshatra ({moon_nak}) suggests career strengths in {nak_doc.get('impact', 'your field')}. You naturally gravitate towards {nak_doc.get('tendencies', 'leadership and innovation')}.",
                    "icon": "💼"
                })

        # --- 2. 10TH HOUSE (CAREER & KARMA) ---
        h10_info = houses_data.get("10") or houses_data.get(10)
        if h10_info:
            h10_sign = h10_info.get("sign_name")
            h10_lord = SIGN_LORDS.get(h10_sign)
            
            lord_pos = next((p for p in planets if p["planet"] == h10_lord), None)
            if lord_pos:
                lord_house = lord_pos.get("house")
                house_str = get_house_str(lord_house)
                
                placement_doc = await tenth_house_lord_collection.find_one({"placement": house_str})
                if placement_doc:
                    analysis.append({
                        "category": "Career Path",
                        "title": f"10th Lord ({h10_lord}) in {house_str}",
                        "content": f"{placement_doc.get('summary', '')}: {', '.join(placement_doc.get('features', []))}",
                        "icon": placement_doc.get("icon", "🚀")
                    })

            sign_doc = await zodiac_signs_collection.find_one({"sign": h10_sign})
            if sign_doc:
                analysis.append({
                    "category": "Zodiac Influence",
                    "title": f"10th House in {h10_sign}",
                    "content": f"Governed by {', '.join(sign_doc.get('governing_planets', []))}. Suitable profiles: {', '.join(sign_doc.get('career_profiles', []))}.",
                    "icon": "♈"
                })

            p_in_10 = h10_info.get("planets", [])
            for p_dict in p_in_10:
                p_name = p_dict["name"] if isinstance(p_dict, dict) else p_dict
                p_doc = await planets_in_tenth_house_collection.find_one({"planet": p_name})
                if p_doc:
                    analysis.append({
                        "category": "Workplace Influence",
                        "title": f"{p_name} in 10th House",
                        "content": f"{p_doc.get('summary', '')}: {', '.join(p_doc.get('traits', []))}. Best for: {', '.join(p_doc.get('best_for', []))}.",
                        "icon": p_doc.get("icon", "🏢")
                    })

        # --- 3. PROFESSIONAL DNA (KARAKAS) ---
        h10_lord_role = await career_planet_roles_collection.find_one({"planet": h10_lord})
        if h10_lord_role:
            analysis.append({
                "category": "Professional DNA",
                "title": f"{h10_lord} Significations",
                "content": f"As your career significator, {h10_lord} governs {h10_lord_role.get('signification')}. Key roles: {', '.join(h10_lord_role.get('roles', []))}.",
                "icon": h10_lord_role.get("icon", "🧬")
            })

        merc_role = await career_planet_roles_collection.find_one({"planet": "Mercury"})
        if merc_role and h10_lord != "Mercury":
            analysis.append({
                "category": "Skill Set",
                "title": "Mercury (Business/Communication)",
                "content": f"Mercury's influence: {merc_role.get('signification')}. Focus on: {', '.join(merc_role.get('roles', []))}.",
                "icon": "☿"
            })

        # --- 4. D-10 (DASHAMSHA) ANALYSIS ---
        d10 = data.get("vargas", {}).get("d10")
        if d10:
            d10_asc = d10.get("ascendant_sign", "Aries")
            analysis.append({
                "category": "D-10 (Career Depth)",
                "title": f"Dashamsha Lagna: {d10_asc}",
                "content": f"Your D-10 chart confirms a { 'powerful administrative' if d10_asc in ['Leo', 'Aries', 'Capricorn'] else 'specialized technical or creative' } professional destiny. Success is most likely in fields requiring { 'leadership' if d10_asc in ['Leo', 'Aries'] else 'detailed execution' }.",
                "icon": "📈"
            })

        # --- 5. SPORTS CAREER SUITABILITY ---
        SPORTS_DOMAINS = {
            "Mars": {
                "title": "Martial Arts, Boxing & Power Athletics",
                "sports": "Martial Arts, Boxing, Wrestling, Football, Athletics/Sprinting, Weightlifting, Fencing & Rugby",
                "icon": "🥊"
            },
            "Mercury": {
                "title": "Racket & Strategic Precision Sports",
                "sports": "Lawn Tennis, Table Tennis, Badminton, Chess, Squash, Archery & Precision Aim Sports",
                "icon": "🎾"
            },
            "Sun": {
                "title": "Leadership & Outdoor Field Sports",
                "sports": "Shooting, Golf, Outdoor Track & Field, Team Captaincy & Equestrian (Horse Riding)",
                "icon": "🎯"
            },
            "Moon": {
                "title": "Aquatic & Water Sports",
                "sports": "Swimming, Water Polo, Rowing, Sailing, Diving & Water Athletics",
                "icon": "🏊"
            },
            "Saturn": {
                "title": "Endurance & Marathon Sports",
                "sports": "Marathon Running, Long-distance Cycling, Heavy Endurance Athletics & Mountaineering",
                "icon": "🚵"
            },
            "Venus": {
                "title": "Cricket, Motor Racing & Aesthetic Sports",
                "sports": "Cricket (Batting & Popularity), Gymnastics, Figure Skating, Formula 1 / Motor Racing & Dance Sports",
                "icon": "🏏"
            },
            "Rahu": {
                "title": "Esports & Cyber Athletics",
                "sports": "Professional Esports, Cyber Gaming, Drone Racing & High-Tech Tactical Sports",
                "icon": "🎮"
            }
        }

        h3_info = houses_data.get("3") or houses_data.get(3)
        h6_info = houses_data.get("6") or houses_data.get(6)
        
        h3_lord = SIGN_LORDS.get(h3_info.get("sign_name")) if h3_info else None
        h6_lord = SIGN_LORDS.get(h6_info.get("sign_name")) if h6_info else None
        
        sports_scores = {p: 0.0 for p in SPORTS_DOMAINS.keys()}
        
        if h3_lord in sports_scores: sports_scores[h3_lord] += 3.5
        if h6_lord in sports_scores: sports_scores[h6_lord] += 3.0
        if h10_lord in sports_scores: sports_scores[h10_lord] += 2.5
        
        for house_obj, weight in [(h3_info, 2.5), (h6_info, 2.0), (h10_info, 1.5)]:
            if house_obj:
                for p_dict in house_obj.get("planets", []):
                    p_name = p_dict["name"] if isinstance(p_dict, dict) else p_dict
                    if p_name in sports_scores:
                        sports_scores[p_name] += weight

        top_sports_planet = max(sports_scores.items(), key=lambda x: x[1])[0]
        top_sports_data = SPORTS_DOMAINS.get(top_sports_planet, SPORTS_DOMAINS["Mars"])

        analysis.append({
            "category": "Sports Career Suitability",
            "title": f"Sports Domain: {top_sports_data['title']} ({top_sports_planet})",
            "content": f"Evaluated from your 3rd House (Stamina), 6th House (Competition), and 10th House (Profession). Your highest athletic potential lies in: {top_sports_data['sports']}.",
            "icon": top_sports_data["icon"]
        })

        # --- 7. SPECIFIC CAREER DOMAIN SUITABILITY ALGORITHM ---
        # Evaluates Tech, Non-Tech, Civil Servant, CA, Lawyer, Teacher, Scientist, Engineer, Doctor
        CAREER_RULES = [
            {
                "key": "tech",
                "name": "💻 Tech / Software Engineer / AI / Cloud Architecture",
                "karakas": ["Mercury", "Mars", "Rahu"],
                "target_houses": [3, 5, 8, 10],
                "base_score": 65,
                "icon": "💻",
                "desc": "Driven by Mercury (Coding logic), Mars (Engineering execution), and Rahu (Cyber/AI innovation)."
            },
            {
                "key": "civil_servant",
                "name": "👑 Civil Servant / IAS / IPS / Government Officer",
                "karakas": ["Sun", "Mars", "Saturn"],
                "target_houses": [1, 6, 10, 11],
                "base_score": 60,
                "icon": "👑",
                "desc": "Driven by Sun (State administrative authority), Mars (Enforcement), and Saturn (Public governance)."
            },
            {
                "key": "ca_finance",
                "name": "📊 Chartered Accountant (CA) / Finance & Investment Banker",
                "karakas": ["Mercury", "Venus", "Jupiter"],
                "target_houses": [2, 5, 10, 11],
                "base_score": 62,
                "icon": "📊",
                "desc": "Driven by Mercury (Audit & Accounting), Venus (Commerce & Wealth), and Jupiter (Financial treasury)."
            },
            {
                "key": "lawyer",
                "name": "⚖️ Lawyer / Advocate / Legal Counsel / Judge",
                "karakas": ["Jupiter", "Mercury", "Mars"],
                "target_houses": [6, 9, 10],
                "base_score": 58,
                "icon": "⚖️",
                "desc": "Driven by Jupiter (Dharma & Justice), Mercury (Pleadings & Contracts), and Mars (Litigation defense)."
            },
            {
                "key": "govt_teacher",
                "name": "🎓 Government Teacher / University Professor",
                "karakas": ["Jupiter", "Sun"],
                "target_houses": [5, 9, 10],
                "base_score": 60,
                "icon": "🎓",
                "desc": "Driven by Jupiter (Wisdom & Higher Education) and Sun (State Educational Board/University)."
            },
            {
                "key": "pvt_teacher",
                "name": "🏫 Private Teacher / EdTech Educator / Corporate Trainer",
                "karakas": ["Jupiter", "Mercury"],
                "target_houses": [3, 5, 10],
                "base_score": 58,
                "icon": "🏫",
                "desc": "Driven by Jupiter (Pedagogy) and Mercury (Commercial EdTech platforms & communication)."
            },
            {
                "key": "scientist",
                "name": "🔬 Scientist / ISRO / DRDO / Deep Data Research",
                "karakas": ["Ketu", "Saturn", "Mars"],
                "target_houses": [8, 12, 10],
                "base_score": 55,
                "icon": "🔬",
                "desc": "Driven by Ketu (Deep research & lab isolation), Saturn (Perseverance), and Mars (Experimental technology)."
            },
            {
                "key": "engineer",
                "name": "🛠️ Engineer (Civil / Mechanical / Electrical / Hardware)",
                "karakas": ["Mars", "Saturn"],
                "target_houses": [4, 6, 10],
                "base_score": 60,
                "icon": "🛠️",
                "desc": "Driven by Mars (Machinery, Metals & Hardware) and Saturn (Construction, Civil works & PWD)."
            },
            {
                "key": "non_tech",
                "name": "🏢 Non-Tech / Corporate HR / Operations / Management",
                "karakas": ["Moon", "Venus", "Saturn"],
                "target_houses": [4, 7, 10],
                "base_score": 58,
                "icon": "🏢",
                "desc": "Driven by Moon (People & Talent Management), Venus (Corporate Relations), and Saturn (Operations)."
            },
            {
                "key": "doctor",
                "name": "🩺 Medical Doctor / Surgeon / Healthcare Specialist",
                "karakas": ["Sun", "Mars", "Ketu", "Moon"],
                "target_houses": [6, 8, 10],
                "base_score": 55,
                "icon": "🩺",
                "desc": "Driven by Sun (Vitality), Mars (Surgeries), Ketu (Medical precision), and Moon (Nursing & Healing)."
            }
        ]

        calculated_domains = []

        for rule in CAREER_RULES:
            match_score = rule["base_score"]
            for p_name in rule["karakas"]:
                p_pos = next((p for p in planets if p["planet"] == p_name), None)
                if p_pos:
                    p_house = p_pos.get("house")
                    if p_house in rule["target_houses"]:
                        match_score += 9.5
                    elif p_house in [1, 10, 11]:
                        match_score += 6.0
            
            if h10_lord in rule["karakas"]:
                match_score += 12.0
            
            match_score = min(98.5, round(match_score, 1))
            
            calculated_domains.append({
                "key": rule["key"],
                "name": rule["name"],
                "score": match_score,
                "icon": rule["icon"],
                "desc": rule["desc"]
            })

        calculated_domains.sort(key=lambda x: x["score"], reverse=True)

        for rank_idx, dom in enumerate(calculated_domains[:4], 1):
            analysis.append({
                "category": "Specific Career Domain Suitability",
                "title": f"Rank #{rank_idx}: {dom['name']} ({dom['score']}% Match)",
                "content": f"{dom['desc']} Astrological Lagna & D10 calculation confirms a {dom['score']}% compatibility score for this domain.",
                "icon": dom["icon"]
            })

        # --- TRANSLATION LOGIC ---
        if lang == "hindi":
            for item in analysis:
                item["category"] = HINDI_TRANSLATIONS.get(item["category"], item["category"])
                # Simple replacement for common words in title and content
                for eng, hin in HINDI_TRANSLATIONS.items():
                    item["title"] = item["title"].replace(eng, hin)
                    item["content"] = item["content"].replace(eng, hin)
                
                # Contextual translations for common terms
                item["content"] = item["content"].replace("Born in", "आपका जन्म")
                item["content"] = item["content"].replace("suggests career strengths in", "में आपके करियर की ताकत का संकेत देता है")
                item["content"] = item["content"].replace("You naturally gravitate towards", "आप स्वाभाविक रूप से इसकी ओर झुकते हैं")
                item["content"] = item["content"].replace("Governed by", "इसके द्वारा शासित")
                item["content"] = item["content"].replace("Suitable profiles", "उपयुक्त प्रोफाइल")
                item["content"] = item["content"].replace("Best for", "इसके लिए सर्वश्रेष्ठ")
                item["content"] = item["content"].replace("As your career significator", "आपके करियर के कारक के रूप में")
                item["content"] = item["content"].replace("governs", "शासन करता है")
                item["content"] = item["content"].replace("Key roles", "मुख्य भूमिकाएं")
                item["content"] = item["content"].replace("Focus on", "इस पर ध्यान दें")
                item["content"] = item["content"].replace("Your D-10 chart confirms a", "आपकी D-10 कुंडली पुष्टि करती है")
                item["content"] = item["content"].replace("professional destiny", "पेशेवर नियति")
                item["content"] = item["content"].replace("Success is most likely in fields requiring", "उन क्षेत्रों में सफलता की संभावना अधिक है जिनमें इसकी आवश्यकता होती है")

        return analysis
    except Exception as e:
        print(f"Personal Career Analysis Error: {e}")
        return []
