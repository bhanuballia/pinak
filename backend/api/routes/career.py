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
