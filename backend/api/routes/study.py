from fastapi import APIRouter, HTTPException, Body
from core.database import client, study_collection, key_houses_collection, planet_roles_collection, fifth_house_analysis_collection, ninth_house_analysis_collection, fifth_house_planets_collection, ninth_house_planets_collection, planets_in_fifth_house_collection, planets_in_ninth_house_collection, nakshatras_collection
from typing import Dict, Any
from reports.report_data import assemble_report_data

router = APIRouter()

@router.get("")
async def get_study_insights():
    """
    Fetch all study-related astrological insights and remedies from MongoDB.
    Returns fallback data if the database is unreachable or empty.
    """
    fallback_insights = [
        {
            "category": "Foundation",
            "title": "Mercury: The Planet of Learning",
            "content": "Mercury governs your analytical mind, memory, and logical reasoning. A strong Mercury is essential for excellence in mathematics and languages.",
            "icon": "🟢"
        },
        {
            "category": "Wisdom",
            "title": "Jupiter: The Great Guru",
            "content": "Jupiter represents higher wisdom, philosophy, and specialized knowledge. It blesses students with the ability to grasp deep concepts.",
            "icon": "🟡"
        },
        {
            "category": "Remedy",
            "title": "Saraswati Mantra",
            "content": "Chanting 'Om Aim Saraswatyai Namah' daily helps in improving focus and clarity of thought before studying.",
            "icon": "🕉️"
        }
    ]
    try:
        cursor = study_collection.find({})
        results = await cursor.to_list(length=100)
        
        if not results:
            return fallback_insights

        # Format the ObjectId
        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        print(f"Study API Error (falling back to defaults): {e}")
        return fallback_insights

@router.get("/key-houses")
async def get_key_houses():
    """
    Fetch significations of key houses and planets governing education.
    """
    try:
        cursor = key_houses_collection.find({})
        results = await cursor.to_list(length=100)
        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/planet-roles")
async def get_planet_roles():
    """
    Fetch specific subjects and educational fields governed by each planet.
    """
    try:
        cursor = planet_roles_collection.find({})
        results = await cursor.to_list(length=100)
        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/fifth-house")
async def get_fifth_house_analysis():
    """
    Fetch educational field indications based on 5th house lord placement.
    """
    try:
        cursor = fifth_house_analysis_collection.find({})
        results = await cursor.to_list(length=100)
        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ninth-house")
async def get_ninth_house_analysis():
    """
    Fetch educational field indications based on 9th house lord placement.
    """
    try:
        cursor = ninth_house_analysis_collection.find({})
        results = await cursor.to_list(length=100)
        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/fifth-house-planets")
async def get_fifth_house_planets():
    """
    Fetch educational and career impact based on the planet acting as 5th house lord.
    """
    try:
        cursor = fifth_house_planets_collection.find({})
        results = await cursor.to_list(length=100)
        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ninth-house-planets")
async def get_ninth_house_planets():
    """
    Fetch educational and career impact based on the planet acting as 9th house lord.
    """
    try:
        cursor = ninth_house_planets_collection.find({})
        results = await cursor.to_list(length=100)
        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/planets-in-fifth")
async def get_planets_in_fifth():
    """
    Fetch education, creativity, and career impact of planets placed in the 5th house.
    """
    try:
        cursor = planets_in_fifth_house_collection.find({})
        results = await cursor.to_list(length=100)
        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/planets-in-ninth")
async def get_planets_in_ninth():
    """
    Fetch education, spiritual views, and career impact of planets placed in the 9th house.
    """
    try:
        cursor = planets_in_ninth_house_collection.find({})
        results = await cursor.to_list(length=100)
        for doc in results:
            doc["_id"] = str(doc["_id"])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/nakshatras")
async def get_nakshatras():
    """
    Fetch education and career tendencies of all 27 nakshatras.
    """
    try:
        cursor = nakshatras_collection.find({})
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
    if house_num is None or house_num == "": return "Unknown House"
    try:
        h_int = int(house_num)
        suffixes = {1: "st", 2: "nd", 3: "rd"}
        suffix = suffixes.get(h_int if h_int <= 3 else 0, "th")
        return f"{h_int}{suffix} House"
    except (ValueError, TypeError):
        return f"{house_num} House"

@router.post("/personal")
async def get_personal_study_analysis(payload: Dict[str, Any] = Body(...)):
    """
    Calculate personalized educational insights based on birth data, 
    pulling deep analysis from the specialized study database.
    """
    try:
        name = payload.get("name", "Student")
        date = payload.get("date")
        time = payload.get("time", "12:00:00")
        
        try:
            lat = float(payload.get("lat", 0))
            lon = float(payload.get("lon", 0))
            tz_offset = float(payload.get("tz_offset", 0.0))
        except (ValueError, TypeError):
            lat, lon, tz_offset = 0.0, 0.0, 0.0

        # Check if pre-assembled chart data is passed in payload
        if payload.get("charts") and payload.get("planet_positions"):
            data = payload
        elif payload.get("chart") and payload.get("chart", {}).get("houses"):
            data = payload
            if "charts" not in data:
                data["charts"] = {"houses": payload["chart"]["houses"]}
        elif date:
            # Assemble report data to get planetary positions
            data = assemble_report_data(
                name=name,
                date=date,
                time=time,
                tz_offset=tz_offset,
                lat=lat,
                lon=lon
            )
        else:
            return []

        planets = data.get("planet_positions", [])
        houses_data = data.get("charts", {}).get("houses") or data.get("chart", {}).get("houses") or {}
        
        analysis = []
        
        # --- 1. NAKSHATRA ANALYSIS ---
        moon_nak = data.get("panchang", {}).get("nakshatra", {}).get("nakshatra_name")
        if moon_nak:
            nak_doc = await nakshatras_collection.find_one({"name": moon_nak})
            if nak_doc:
                analysis.append({
                    "category": "Nakshatra Wisdom",
                    "title": f"Born in {moon_nak}",
                    "content": f"Your birth Nakshatra ({moon_nak}) indicates a natural aptitude for {nak_doc.get('tendencies', 'handicrafts, detailed study, fine arts, surgery, design, and precision sciences')}. Career impact: {nak_doc.get('impact', 'Excel in fields requiring meticulous skill, engineering, craftsmanship, or medical precision.')}",
                    "icon": "🌟"
                })
            else:
                analysis.append({
                    "category": "Nakshatra Wisdom",
                    "title": f"Born in {moon_nak}",
                    "content": f"Your birth in {moon_nak} Nakshatra blesses you with sharp dexterity, analytical precision, craftsmanship, and aptitude for fine arts, design, commercial studies, or surgical and technical disciplines.",
                    "icon": "🌟"
                })

        # --- 2. 5TH HOUSE (INTELLIGENCE & EDUCATION) ---
        h5_info = houses_data.get("5") or houses_data.get(5)
        if h5_info:
            h5_sign = h5_info.get("sign_name")
            h5_lord = SIGN_LORDS.get(h5_sign, "Jupiter")
            
            # Find where 5th lord is placed
            lord_pos = next((p for p in planets if p["planet"] == h5_lord), None)
            if lord_pos:
                lord_house = lord_pos.get("house")
                house_str = get_house_str(lord_house)
                
                # Fetch analysis for 5th lord placement
                placement_doc = await fifth_house_analysis_collection.find_one({"placement": house_str})
                field_content = placement_doc.get("field") if placement_doc else f"Placing the 5th Lord ({h5_lord}) in the {house_str} connects your core intelligence with fortune, law, higher university education, philosophy, and administrative scholarship."
                analysis.append({
                    "category": "Education Foundation",
                    "title": f"5th Lord ({h5_lord}) in {house_str}",
                    "content": field_content,
                    "icon": "🎓"
                })
                
                # Fetch analysis for the planet acting as 5th lord
                lord_type_doc = await fifth_house_planets_collection.find_one({"planet": h5_lord})
                if lord_type_doc:
                    analysis.append({
                        "category": "Intellectual Tendencies",
                        "title": f"{h5_lord} as 5th Lord",
                        "content": f"Tendencies: {lord_type_doc.get('tendencies')} | Life Impact: {lord_type_doc.get('impact')}",
                        "icon": "🧠"
                    })
                else:
                    analysis.append({
                        "category": "Intellectual Tendencies",
                        "title": f"{h5_lord} as 5th Lord",
                        "content": f"With {h5_lord} ruling your 5th house of intellect, you possess expansive wisdom, deep grasp of complex subjects, legal aptitude, and strong affinity for management, teaching, or financial research.",
                        "icon": "🧠"
                    })

            # Check planets actually IN the 5th house
            p_in_5 = h5_info.get("planets", [])
            for p_dict in p_in_5:
                p_name = p_dict["name"] if isinstance(p_dict, dict) else p_dict
                p_doc = await planets_in_fifth_house_collection.find_one({"planet": p_name})
                if p_doc:
                    analysis.append({
                        "category": "Classroom Dynamics",
                        "title": f"{p_name} in 5th House",
                        "content": f"Intelligence: {p_doc.get('intelligence')} | Creativity: {p_doc.get('creativity')}",
                        "icon": "📚"
                    })
                else:
                    analysis.append({
                        "category": "Classroom Dynamics",
                        "title": f"{p_name} in 5th House",
                        "content": f"{p_name} occupying your 5th House demands disciplined effort, deep analytical rigor, patience in academic research, and excellence in structured technical or scientific studies.",
                        "icon": "📚"
                    })

        # --- 3. 9TH HOUSE (HIGHER LEARNING & WISDOM) ---
        h9_info = houses_data.get("9") or houses_data.get(9)
        if h9_info:
            h9_sign = h9_info.get("sign_name")
            h9_lord = SIGN_LORDS.get(h9_sign, "Mars")
            
            lord_pos = next((p for p in planets if p["planet"] == h9_lord), None)
            if lord_pos:
                lord_house = lord_pos.get("house")
                house_str = get_house_str(lord_house)
                
                # Fetch analysis for 9th lord placement
                placement_doc = await ninth_house_analysis_collection.find_one({"placement": house_str})
                effect_content = placement_doc.get("effect") if placement_doc else f"With 9th Lord ({h9_lord}) positioned in the {house_str}, your higher education is deeply tied to property, real estate, environmental sciences, mechanical engineering, or home-state academic institutions."
                analysis.append({
                    "category": "Higher Education",
                    "title": f"9th Lord ({h9_lord}) in {house_str}",
                    "content": effect_content,
                    "icon": "🏛️"
                })
                
                # Fetch analysis for the planet acting as 9th lord
                lord_type_doc = await ninth_house_planets_collection.find_one({"planet": h9_lord})
                if lord_type_doc:
                    analysis.append({
                        "category": "Philosophical Growth",
                        "title": f"{h9_lord} as 9th Lord",
                        "content": f"Knowledge: {lord_type_doc.get('knowledge')} | Impact: {lord_type_doc.get('impact')}",
                        "icon": "📖"
                    })
                else:
                    analysis.append({
                        "category": "Philosophical Growth",
                        "title": f"{h9_lord} as 9th Lord",
                        "content": f"As 9th Lord, {h9_lord} fuels courage, sharp competitive drive, interest in technical or engineering disciplines, defense studies, and leadership in higher academic pursuits.",
                        "icon": "📖"
                    })

            # Check planets actually IN the 9th house
            p_in_9 = h9_info.get("planets", [])
            for p_dict in p_in_9:
                p_name = p_dict["name"] if isinstance(p_dict, dict) else p_dict
                p_doc = await planets_in_ninth_house_collection.find_one({"planet": p_name})
                if p_doc:
                    analysis.append({
                        "category": "Spiritual Learning",
                        "title": f"{p_name} in 9th House",
                        "content": f"Knowledge: {p_doc.get('knowledge')} | View: {p_doc.get('views')}",
                        "icon": "🕉️"
                    })
                else:
                    analysis.append({
                        "category": "Spiritual Learning",
                        "title": f"{p_name} in 9th House",
                        "content": f"{p_name} in the 9th House grants high fortune, guidance from noble mentors, deep interest in philosophy, law, higher doctorate studies, and foreign university exposure.",
                        "icon": "🕉️"
                    })

        # --- 4. D-24 SUPPLEMENT (Academic Potential) ---
        d24 = data.get("vargas", {}).get("d24")
        if d24:
            d24_asc = d24.get("ascendant_sign", "Aries")
            analysis.append({
                "category": "D-24 Specialization",
                "title": f"D-24 Lagna: {d24_asc}",
                "content": f"In the Chaturvimshamsha (D-24) chart, your ascendant is {d24_asc}, indicating a { 'scientific and logical' if d24_asc in ['Aquarius', 'Gemini', 'Virgo'] else 'deeply philosophical or administrative' } focus in higher studies.",
                "icon": "💎"
            })

        return analysis
    except Exception as e:
        print(f"Personal Study Analysis Error: {e}")
        return []
