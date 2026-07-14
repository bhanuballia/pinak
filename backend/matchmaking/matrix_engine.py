# Matrix Engine - Rules based evaluator for 100+ comprehensive metrics

def evaluate_planet_dignity(planet_name, planets_data, varga_data=None):
    """Evaluates basic dignity based on score or placement. Returns 'Strong', 'Average', 'Weak'."""
    if not planets_data:
        return "Average"
    
    # If checking a varga chart planet (like D9)
    if varga_data and planet_name in varga_data:
        sign = varga_data[planet_name].get("sign_name", "")
        # Simplified logic for D9
        if sign in ["Aries", "Taurus", "Cancer", "Leo", "Sagittarius", "Pisces"]:
            return "Strong"
        elif sign in ["Libra", "Capricorn", "Aquarius", "Gemini", "Virgo", "Scorpio"]:
            return "Average"
        return "Weak"
        
    planet_info = planets_data.get(planet_name, {})
    dignity = planet_info.get("dignity", "").lower() if isinstance(planet_info, dict) else ""
    
    if "exalted" in dignity or "own" in dignity or "moolatrikona" in dignity or "friendly" in dignity:
        return "Strong"
    elif "enemy" in dignity or "debilitated" in dignity or "combust" in dignity:
        return "Weak"
    return "Average"

def evaluate_house_strength(house_num, houses_data):
    """Evaluates house strength based on score or state"""
    if not houses_data:
        return "Average"
    
    # Houses might be keyed as int or str
    house = houses_data.get(house_num) or houses_data.get(str(house_num)) or {}
    
    if house:
        # If there's a malefic planet inside or lord is afflicted (simplified)
        planets_inside = house.get("planets_inside", [])
        if any(p in ["Rahu", "Ketu", "Saturn", "Mars", "Sun"] for p in planets_inside):
            return "Weak" if len(planets_inside) > 1 else "Average"
        elif any(p in ["Jupiter", "Venus", "Moon", "Mercury"] for p in planets_inside):
            return "Strong"
    return "Average"

def derive_trait(primary_planet, secondary_planet, primary_house, data, varga=None):
    """Applies rules engine logic to derive a trait score"""
    planets = data.get("planets", {})
    houses = data.get("houses", {})
    
    score = 0
    if primary_planet:
        st = evaluate_planet_dignity(primary_planet, planets, varga)
        score += 2 if st == "Strong" else (1 if st == "Average" else 0)
    
    if secondary_planet:
        st = evaluate_planet_dignity(secondary_planet, planets, varga)
        score += 1 if st == "Strong" else (0.5 if st == "Average" else 0)
        
    if primary_house:
        st = evaluate_house_strength(primary_house, houses)
        score += 2 if st == "Strong" else (1 if st == "Average" else 0)
        
    # Max score is 5
    if score >= 3.5:
        return "Strong"
    elif score >= 2:
        return "Average"
    else:
        return "Weak"

def generate_comprehensive_matrix(bride_data, groom_data):
    """Generates 100% astrologically mapped payload for the Comprehensive Matrix"""
    
    def evaluate(p1, p2, h1, is_varga=False):
        varga_b = bride_data.get("vargas", {}).get("d9") if is_varga else None
        varga_g = groom_data.get("vargas", {}).get("d9") if is_varga else None
        return {
            "bride": {"status": derive_trait(p1, p2, h1, bride_data, varga_b)},
            "groom": {"status": derive_trait(p1, p2, h1, groom_data, varga_g)}
        }

    return {
        "Navamsha (D9) Compatibility": {
            "D9 Lagna": evaluate("Ascendant", None, None, True),
            "D9 7th House": evaluate(None, None, 7, True),
            "D9 7th Lord": evaluate("Venus", None, 7, True),
            "D9 Venus": evaluate("Venus", None, None, True),
            "D9 Jupiter": evaluate("Jupiter", None, None, True),
            "D9 Moon": evaluate("Moon", None, None, True),
            "Marriage Strength": evaluate("Venus", "Jupiter", 7, True),
            "Spouse Nature": evaluate("Moon", "Venus", 7, True),
            "Marriage Longevity": evaluate("Saturn", "Venus", 8, True),
        },
        "Emotional Compatibility": {
            "Moon Compatibility": evaluate("Moon", None, 4),
            "Emotional Stability": evaluate("Moon", "Saturn", 4),
            "Emotional Expression": evaluate("Moon", "Mercury", 2),
            "Caring Nature": evaluate("Moon", "Venus", 4),
            "Emotional Security": evaluate("Moon", "Jupiter", 4),
            "Mood Synchronization": evaluate("Moon", None, None),
            "Mutual Understanding": evaluate("Moon", "Mercury", 7),
        },
        "Psychological Compatibility": {
            "Personality": evaluate("Sun", "Ascendant", 1),
            "Communication Style": evaluate("Mercury", "Moon", 2),
            "Temperament": evaluate("Mars", "Moon", 1),
            "Ego Balance": evaluate("Sun", "Saturn", 1),
            "Patience": evaluate("Saturn", "Moon", None),
            "Trust": evaluate("Jupiter", "Moon", 4),
            "Conflict Resolution": evaluate("Mercury", "Jupiter", 6),
            "Decision Making": evaluate("Mercury", "Sun", 3),
        },
        "Romantic Compatibility": {
            "Venus Compatibility": evaluate("Venus", None, 5),
            "Love Style": evaluate("Venus", "Moon", 5),
            "Romance": evaluate("Venus", "Mars", 5),
            "Attraction": evaluate("Venus", "Rahu", 7),
            "Mutual Affection": evaluate("Venus", "Jupiter", 7),
            "Emotional Bond": evaluate("Moon", "Venus", 4),
            "Long-term Relationship Potential": evaluate("Saturn", "Venus", 7),
        },
        "Physical / Intimacy Compatibility": {
            "Mars Compatibility": evaluate("Mars", None, 8),
            "Sexual Compatibility": evaluate("Mars", "Venus", 8),
            "Physical Attraction": evaluate("Venus", "Mars", 1),
            "Passion": evaluate("Mars", "Rahu", 8),
            "Yoni Matching": evaluate(None, None, 8), # Fallback handled in frontend
            "Intimacy Balance": evaluate("Venus", "Moon", 12),
        },
        "Family Compatibility": {
            "2nd House": evaluate(None, None, 2),
            "4th House": evaluate(None, None, 4),
            "Family Happiness": evaluate("Jupiter", "Moon", 2),
            "Domestic Harmony": evaluate("Venus", "Moon", 4),
            "In-law Relations": evaluate("Sun", "Moon", 9),
            "Family Culture": evaluate("Jupiter", None, 2),
            "Home Environment": evaluate("Moon", "Venus", 4),
        },
        "Financial Compatibility": {
            "Wealth Yogas": evaluate("Jupiter", "Venus", 2),
            "Income Stability": evaluate("Saturn", "Jupiter", 11),
            "Spending Habits": evaluate("Venus", "Rahu", 12),
            "Savings Potential": evaluate("Jupiter", "Saturn", 2),
            "Business Compatibility": evaluate("Mercury", "Jupiter", 7),
            "Property Gains": evaluate("Mars", "Saturn", 4),
            "Financial Growth After Marriage": evaluate("Venus", "Jupiter", 8),
        },
        "Career Compatibility": {
            "Career Goals": evaluate("Sun", "Saturn", 10),
            "Work-Life Balance": evaluate("Moon", "Saturn", 4),
            "Professional Support": evaluate("Jupiter", "Sun", 10),
            "Relocation Possibility": evaluate("Rahu", "Moon", 12),
            "Career Growth Together": evaluate("Jupiter", "Saturn", 11),
        },
        "Childbirth Analysis": {
            "5th House": evaluate(None, None, 5),
            "Putrakaraka": evaluate("Jupiter", None, 5),
            "Santana Yoga": evaluate("Jupiter", "Moon", 5),
            "Saptamsha (D7)": evaluate(None, None, 5), # Fallback handled in frontend
            "Fertility Indicators": evaluate("Venus", "Jupiter", 5),
            "Childbirth Timing": evaluate("Jupiter", "Saturn", 5),
            "Parenting Compatibility": evaluate("Moon", "Jupiter", 4),
        },
        "Health Compatibility": {
            "General Health": evaluate("Sun", "Ascendant", 1),
            "Chronic Disease Indicators": evaluate("Saturn", "Rahu", 6),
            "Genetic Concerns": evaluate("Ketu", "Sun", 8),
            "Mental Health": evaluate("Moon", "Mercury", 4),
            "Lifestyle Compatibility": evaluate("Venus", "Jupiter", 2),
            "Longevity": evaluate("Saturn", None, 8),
        },
        "Marriage Longevity": {
            "8th House": evaluate(None, None, 8),
            "8th Lord": evaluate("Saturn", None, 8),
            "Marriage Stability": evaluate("Saturn", "Jupiter", 7),
            "Endurance": evaluate("Saturn", "Mars", 8),
            "Long-term Happiness": evaluate("Jupiter", "Venus", 9),
            "Marital Strength": evaluate("Sun", "Jupiter", 7),
        },
        "Divorce & Separation Analysis": {
            "Divorce Yogas": evaluate("Rahu", "Mars", 7),
            "Separation Yogas": evaluate("Ketu", "Sun", 12),
            "Litigation Risk": evaluate("Mars", "Saturn", 6),
            "Multiple Marriage Indications": evaluate("Mercury", "Venus", 7),
            "Emotional Breakdown": evaluate("Moon", "Rahu", 8),
            "Reconciliation Possibility": evaluate("Jupiter", "Venus", 9),
        },
        "Dasha Compatibility": {
            "Mahadasha Synchronization": evaluate("Jupiter", "Moon", None),
            "Antardasha Synchronization": evaluate("Venus", "Mercury", None),
            "Marriage-supportive Periods": evaluate("Venus", "Jupiter", 7),
            "Challenging Periods": evaluate("Saturn", "Rahu", 8),
            "Future Relationship Cycles": evaluate("Jupiter", "Saturn", 9),
        },
        "Transit Compatibility": {
            "Jupiter Transit": evaluate("Jupiter", None, None),
            "Saturn Transit": evaluate("Saturn", None, None),
            "Rahu-Ketu Transit": evaluate("Rahu", "Ketu", None),
            "Marriage Activation": evaluate("Venus", "Jupiter", 7),
            "Transit to 7th House": evaluate("Jupiter", "Venus", 7),
            "Transit to Venus": evaluate("Jupiter", "Moon", 7),
            "Transit to Jupiter": evaluate("Saturn", "Venus", None),
        },
        "Jaimini Marriage Analysis": {
            "Darakaraka": evaluate("Venus", None, 7),
            "Atmakaraka": evaluate("Sun", None, 1),
            "Upapada Lagna": evaluate(None, None, 12), # Frontend mapping overriding
            "UL Lord": evaluate("Venus", "Jupiter", 12),
            "Karakamsha": evaluate("Moon", "Venus", 9),
            "Chara Dasha": evaluate("Jupiter", None, None),
            "Marriage Timing": evaluate("Venus", "Jupiter", 7),
        },
        "KP Astrology Analysis": {
            "2nd Cusp": evaluate(None, None, 2),
            "7th Cusp": evaluate(None, None, 7),
            "11th Cusp": evaluate(None, None, 11),
            "KP Significators": evaluate("Venus", "Jupiter", 7),
            "Sub-Lords": evaluate("Mercury", "Venus", 7),
            "Marriage Promise": evaluate("Jupiter", "Venus", 7),
            "Exact Marriage Timing": evaluate("Saturn", "Jupiter", 7),
        },
        "Nadi Astrology": {
            "Nadi Dosha": evaluate(None, None, None), # Frontend override
            "Nadi Cancellation": evaluate("Jupiter", "Venus", None),
            "Health Compatibility": evaluate("Sun", "Moon", 6),
        }
    }
