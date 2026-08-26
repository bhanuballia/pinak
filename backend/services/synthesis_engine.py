def synthesize_readings(birth_chart: dict, face_reading: dict) -> dict:
    """
    Synthesizes the astrological birth chart (Lagna, planets) with the 
    physical facial features (Samudrika Shastra).
    """
    if "error" in birth_chart:
        return {"error": birth_chart["error"]}
        
    ascendant = birth_chart.get("ascendant")
    planets = birth_chart.get("planets", {})
    
    # We will build a list of synthesis insights
    insights = []
    
    # 1. Ascendant vs Face Shape (Overall constitution)
    face_shape = next((mod for mod in face_reading.get("detailed", {}).get("deep_dive_modules", []) if mod["module_name"] == "Face Shape"), None)
    if face_shape:
        if ascendant in ["Aries", "Leo", "Sagittarius"]:
            if "Saturn" in face_shape["planet"] or "Moon" in face_shape["planet"]:
                insights.append({
                    "title": "Fire Ascendant vs Soft/Structured Features",
                    "description": f"Your birth chart indicates a fiery, action-oriented Ascendant ({ascendant}), but your face shape leans towards {face_shape['planet']} traits. This means you have a burning inner drive, but you project a much calmer, adaptable, or disciplined exterior to the world."
                })
            else:
                insights.append({
                    "title": "Fiery Constitution",
                    "description": f"Your {ascendant} Ascendant perfectly matches your active facial structure. You are driven, dynamic, and meant for leadership."
                })
        elif ascendant in ["Taurus", "Virgo", "Capricorn"]:
            insights.append({
                "title": "Earth Ascendant",
                "description": f"With an earthy {ascendant} Ascendant, your physical stamina is high. Your facial geometry ({face_shape['detected_value']}) confirms a grounded, highly practical approach to life."
            })
        else:
            insights.append({
                "title": f"{ascendant} Ascendant Influence",
                "description": f"Your {ascendant} Ascendant gives you a unique auric field. Your face shape ({face_shape['detected_value']}) shows how you've molded this energy to adapt to your environment."
            })
            
    # 2. Check Strong Face Planets vs Birth Chart
    # For example, if Nose is prominent (Sun/Jupiter), where is Sun/Jupiter in chart?
    nose_mod = next((mod for mod in face_reading.get("detailed", {}).get("deep_dive_modules", []) if mod["module_name"] == "Nose"), None)
    if nose_mod and "Prominent" in nose_mod["detected_value"]:
        sun_sign = planets.get("Sun")
        if sun_sign in ["Leo", "Aries"]:
            insights.append({
                "title": "Double Solar Power",
                "description": "Incredible alignment! Your birth chart has a highly dignified Sun, AND your physical face (prominent nose) shows intense solar energy. You are a natural-born leader and authority figure."
            })
        else:
            insights.append({
                "title": "Developed Authority",
                "description": f"Your birth chart shows a more subdued Sun ({sun_sign}), but your physical features reveal you have consciously developed immense authority, career drive, and leadership skills in this lifetime."
            })
            
    # 3. Check Eyebrows (Mars)
    eyebrow_mod = next((mod for mod in face_reading.get("detailed", {}).get("deep_dive_modules", []) if mod["module_name"] == "Eyebrows"), None)
    if eyebrow_mod and "Thick" in eyebrow_mod["description"]:
        mars_sign = planets.get("Mars")
        if mars_sign in ["Aries", "Scorpio", "Capricorn"]:
            insights.append({
                "title": "Peak Martian Energy",
                "description": "Your thick eyebrows perfectly reflect the extremely powerful Mars in your birth chart. You possess boundless energy, courage, and a warrior's spirit."
            })
        else:
            insights.append({
                "title": "Compensating Drive",
                "description": "Your birth chart's Mars is less aggressive, but your facial features show you have cultivated immense willpower, focus, and physical endurance."
            })
            
    # 4. Check Lips (Venus)
    lips_mod = next((mod for mod in face_reading.get("detailed", {}).get("deep_dive_modules", []) if mod["module_name"] == "Lips & Mouth"), None)
    if lips_mod and ("Thick" in lips_mod["description"] or "wide" in lips_mod["description"]):
        venus_sign = planets.get("Venus")
        if venus_sign in ["Taurus", "Libra", "Pisces"]:
            insights.append({
                "title": "Venusian Harmony",
                "description": "A beautiful match! Your strong natal Venus is clearly visible in your facial features, granting you natural charm, magnetism, and a deep capacity for love."
            })
        else:
            insights.append({
                "title": "Enhanced Magnetism",
                "description": "Despite a challenging Venus in your chart, your physical features show you have developed great charm, communication skills, and relationship intelligence."
            })

    if not insights:
        insights.append({
            "title": "Balanced Integration",
            "description": f"Your {ascendant} Ascendant and planetary placements integrate harmoniously with your facial features, showing a balanced progression of your soul's journey."
        })

    return {
        "ascendant": ascendant,
        "planets": planets,
        "insights": insights
    }
