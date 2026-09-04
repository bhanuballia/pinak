# prediction/garga_sutras.py

def evaluate_garga_sutras(chart_data: dict):
    """
    Evaluates a representative subset of Garga Muni's sutras (yogas and combinations).
    Returns a list of dictionaries with matching sutras.
    
    Expected chart_data format is the one produced by /api/report/data
    """
    sutras = []
    
    if not chart_data or "planet_positions" not in chart_data or "chart" not in chart_data:
        return sutras
        
    planets = chart_data.get("planet_positions", [])
    houses = chart_data.get("chart", {}).get("houses", {})
    
    # Helper to find a planet by name
    def get_planet(name):
        return next((p for p in planets if p.get("planet") == name), None)
        
    sun = get_planet("Sun")
    moon = get_planet("Moon")
    jupiter = get_planet("Jupiter")
    venus = get_planet("Venus")
    mercury = get_planet("Mercury")
    mars = get_planet("Mars")
    saturn = get_planet("Saturn")
    rahu = get_planet("Rahu")
    ketu = get_planet("Ketu")

    # 1. Garga Sutra - Sun and Jupiter in the 9th or 10th House
    if sun and jupiter:
        if sun.get("house") in [9, 10] and jupiter.get("house") in [9, 10]:
            sutras.append({
                "name": "Dharma-Karma Garga Yoga",
                "condition": "Sun and Jupiter placed in the 9th or 10th house.",
                "interpretation": "Sage Garga states that this combination brings immense respect, a righteous disposition, and success in matters of state or public administration. The native will be known for their wisdom and ethical conduct.",
                "category": "Career & Reputation"
            })

    # 2. Garga Sutra - Moon and Venus in a Kendra (1, 4, 7, 10)
    if moon and venus:
        if moon.get("house") in [1, 4, 7, 10] and venus.get("house") in [1, 4, 7, 10]:
            sutras.append({
                "name": "Sukha-Samriddhi Garga Yoga",
                "condition": "Moon and Venus placed in Kendras (angular houses).",
                "interpretation": "According to Garga Muni, when these two benefics occupy angular houses, the native enjoys luxurious vehicles, fine arts, a charismatic personality, and enduring comforts throughout life.",
                "category": "Wealth & Comforts"
            })

    # 3. Garga Sutra - Malefics (Mars, Saturn) in 3, 6, 11 (Upachaya houses)
    malefics_in_upachaya = []
    if mars and mars.get("house") in [3, 6, 11]: malefics_in_upachaya.append("Mars")
    if saturn and saturn.get("house") in [3, 6, 11]: malefics_in_upachaya.append("Saturn")
    
    if len(malefics_in_upachaya) >= 2:
        sutras.append({
            "name": "Upachaya Parakrama Yoga (Garga Principle)",
            "condition": "Natural malefics (Mars and Saturn) in 3rd, 6th, or 11th houses.",
            "interpretation": "Garga's principle highlights that natural malefics in growing houses (Upachayas) grant the native immense courage, the ability to conquer enemies, and significant material success achieved through self-effort and resilience.",
            "category": "Courage & Victory"
        })

    # 4. Mercury and Jupiter conjunction
    if mercury and jupiter:
        if mercury.get("house") == jupiter.get("house"):
            sutras.append({
                "name": "Vidya Garga Yoga",
                "condition": "Mercury and Jupiter conjunct in the same house.",
                "interpretation": "This combination, praised by Garga, makes the native highly learned, articulate, and skilled in astrology, mathematics, or scriptures. They possess a sharp intellect combined with deep wisdom.",
                "category": "Intellect & Education"
            })

    # 5. Garga Sutra - Rahu in the 10th house
    if rahu and rahu.get("house") == 10:
        sutras.append({
            "name": "Rajya-Bhanga/Kirti Garga Yoga",
            "condition": "Rahu posited in the 10th house of career.",
            "interpretation": "Garga Muni observes that Rahu in the 10th house can propel a person to sudden and massive public heights, often involving politics, foreign elements, or unconventional careers. However, it requires caution against sudden downfalls.",
            "category": "Career & Politics"
        })

    return sutras

def calculate_name_akshar_predictions(name: str) -> dict:
    """
    Calculates Nakshatra, Rashi, marriage age, and financial prospects 
    based on the Name Akshar (Avakahada Chakra) according to Vedic principles.
    """
    if not name or len(name) < 2:
        return {"error": "Please provide a valid name with at least 2 characters."}
        
    name = name.strip().lower()
    prefix2 = name[:2]
    prefix3 = name[:3]
    prefix4 = name[:4]

    # Simplified mapping of Akshars to Nakshatra and Rashi
    # (Akshar: (Nakshatra, Rashi))
    akshar_map = {
        'chu': ('Ashwini', 'Aries'), 'che': ('Ashwini', 'Aries'), 'cho': ('Ashwini', 'Aries'), 'la': ('Ashwini', 'Aries'),
        'li': ('Bharani', 'Aries'), 'lu': ('Bharani', 'Aries'), 'le': ('Bharani', 'Aries'), 'lo': ('Bharani', 'Aries'),
        'a': ('Krittika', 'Aries'), 'i': ('Krittika', 'Aries'), 'u': ('Krittika', 'Aries'), 'e': ('Krittika', 'Taurus'),
        'o': ('Rohini', 'Taurus'), 'va': ('Rohini', 'Taurus'), 'vi': ('Rohini', 'Taurus'), 'vu': ('Rohini', 'Taurus'),
        'we': ('Mrigashira', 'Taurus'), 'wo': ('Mrigashira', 'Taurus'), 'ka': ('Mrigashira', 'Gemini'), 'ki': ('Mrigashira', 'Gemini'),
        'ku': ('Ardra', 'Gemini'), 'gha': ('Ardra', 'Gemini'), 'ng': ('Ardra', 'Gemini'), 'chha': ('Ardra', 'Gemini'),
        'ke': ('Punarvasu', 'Gemini'), 'ko': ('Punarvasu', 'Gemini'), 'ha': ('Punarvasu', 'Cancer'), 'hi': ('Punarvasu', 'Cancer'),
        'hu': ('Pushya', 'Cancer'), 'he': ('Pushya', 'Cancer'), 'ho': ('Pushya', 'Cancer'), 'da': ('Pushya', 'Cancer'),
        'di': ('Ashlesha', 'Cancer'), 'du': ('Ashlesha', 'Cancer'), 'de': ('Ashlesha', 'Cancer'), 'do': ('Ashlesha', 'Cancer'),
        'ma': ('Magha', 'Leo'), 'mi': ('Magha', 'Leo'), 'mu': ('Magha', 'Leo'), 'me': ('Magha', 'Leo'),
        'mo': ('Purva Phalguni', 'Leo'), 'ta': ('Purva Phalguni', 'Leo'), 'ti': ('Purva Phalguni', 'Leo'), 'tu': ('Purva Phalguni', 'Leo'),
        'te': ('Uttara Phalguni', 'Leo'), 'to': ('Uttara Phalguni', 'Virgo'), 'pa': ('Uttara Phalguni', 'Virgo'), 'pi': ('Uttara Phalguni', 'Virgo'),
        'pu': ('Hasta', 'Virgo'), 'sha': ('Hasta', 'Virgo'), 'na': ('Hasta', 'Virgo'), 'tha': ('Hasta', 'Virgo'),
        'pe': ('Chitra', 'Virgo'), 'po': ('Chitra', 'Virgo'), 'ra': ('Chitra', 'Libra'), 'ri': ('Chitra', 'Libra'),
        'ru': ('Swati', 'Libra'), 're': ('Swati', 'Libra'), 'ro': ('Swati', 'Libra'), 'ta': ('Swati', 'Libra'),
        'ti': ('Vishakha', 'Libra'), 'tu': ('Vishakha', 'Libra'), 'te': ('Vishakha', 'Libra'), 'to': ('Vishakha', 'Scorpio'),
        'na': ('Anuradha', 'Scorpio'), 'ni': ('Anuradha', 'Scorpio'), 'nu': ('Anuradha', 'Scorpio'), 'ne': ('Anuradha', 'Scorpio'),
        'no': ('Jyeshtha', 'Scorpio'), 'ya': ('Jyeshtha', 'Scorpio'), 'yi': ('Jyeshtha', 'Scorpio'), 'yu': ('Jyeshtha', 'Scorpio'),
        'ye': ('Mula', 'Sagittarius'), 'yo': ('Mula', 'Sagittarius'), 'ba': ('Mula', 'Sagittarius'), 'bi': ('Mula', 'Sagittarius'),
        'bu': ('Purva Ashadha', 'Sagittarius'), 'dha': ('Purva Ashadha', 'Sagittarius'), 'bha': ('Purva Ashadha', 'Sagittarius'),
        'be': ('Uttara Ashadha', 'Sagittarius'), 'bo': ('Uttara Ashadha', 'Capricorn'), 'ja': ('Uttara Ashadha', 'Capricorn'), 'ji': ('Uttara Ashadha', 'Capricorn'),
        'ju': ('Shravana', 'Capricorn'), 'je': ('Shravana', 'Capricorn'), 'jo': ('Shravana', 'Capricorn'),
        'ga': ('Dhanishta', 'Capricorn'), 'gi': ('Dhanishta', 'Capricorn'), 'gu': ('Dhanishta', 'Aquarius'), 'ge': ('Dhanishta', 'Aquarius'),
        'go': ('Shatabhisha', 'Aquarius'), 'sa': ('Shatabhisha', 'Aquarius'), 'si': ('Shatabhisha', 'Aquarius'), 'su': ('Shatabhisha', 'Aquarius'),
        'se': ('Purva Bhadrapada', 'Aquarius'), 'so': ('Purva Bhadrapada', 'Aquarius'), 'da': ('Purva Bhadrapada', 'Pisces'), 'di': ('Purva Bhadrapada', 'Pisces'),
        'du': ('Uttara Bhadrapada', 'Pisces'), 'tha': ('Uttara Bhadrapada', 'Pisces'), 'jha': ('Uttara Bhadrapada', 'Pisces'), 'nya': ('Uttara Bhadrapada', 'Pisces'),
        'de': ('Revati', 'Pisces'), 'do': ('Revati', 'Pisces'), 'cha': ('Revati', 'Pisces'), 'chi': ('Revati', 'Pisces'),
        
        # Single letter fallbacks to ensure a match for any English name
        'b': ('Mula', 'Sagittarius'), 'c': ('Revati', 'Pisces'), 'd': ('Ashlesha', 'Cancer'),
        'f': ('Uttara Phalguni', 'Virgo'), 'g': ('Dhanishta', 'Capricorn'), 'h': ('Punarvasu', 'Cancer'),
        'j': ('Uttara Ashadha', 'Capricorn'), 'k': ('Mrigashira', 'Gemini'), 'l': ('Ashwini', 'Aries'),
        'm': ('Magha', 'Leo'), 'n': ('Anuradha', 'Scorpio'), 'p': ('Uttara Phalguni', 'Virgo'),
        'q': ('Mrigashira', 'Gemini'), 'r': ('Chitra', 'Libra'), 's': ('Shatabhisha', 'Aquarius'),
        't': ('Purva Phalguni', 'Leo'), 'v': ('Rohini', 'Taurus'), 'w': ('Mrigashira', 'Taurus'),
        'x': ('Mrigashira', 'Gemini'), 'y': ('Jyeshtha', 'Scorpio'), 'z': ('Uttara Ashadha', 'Capricorn')
    }

    matched_nakshatra = "Unknown"
    matched_rashi = "Unknown"
    akshar_found = name[0]

    # Try matching longer prefixes first
    for prefix in [prefix4, prefix3, prefix2, name[0]]:
        if prefix in akshar_map:
            matched_nakshatra, matched_rashi = akshar_map[prefix]
            akshar_found = prefix
            break

    if matched_nakshatra == "Unknown":
        return {"error": f"Could not determine Nakshatra for Name Akshar: {name[0].upper()}"}

    # Generate archetypes based on element
    fire_profile = {
        "best_age_finance": "28 to 36 years",
        "foreign_travel_age": "24, 28, or 32 years",
        "career_profession": "Engineering, military, sports, leadership, entrepreneurship, management.",
        "business": "Highly successful in independent ventures and competitive markets.",
        "children": "Fewer in number but highly independent and energetic.",
        "property_asset": "Acquires property early; deals in land or machinery.",
        "family_ancestry": "Takes the lead in the family, often moves away from birthplace.",
        "education": "Technical or specialized education suits best. Quick learner.",
        "fame_status": "Gains fame through courage, innovation, and bold actions.",
        "obstacles": "Impatience and aggressive decisions lead to sudden issues.",
        "health": "Prone to heat-related issues, fevers, and stress.",
        "spirituality": "Action-oriented spirituality (Karma Yoga).",
        "qna": {
            "financial_improve": "Major improvement typically seen after age 28.",
            "good_job": "Around age 22-24, often through bold initiatives.",
            "career_stable": "Stability arrives around age 32.",
            "earning_substantially": "Post 30 years.",
            "get_married": "Early window around 21-24 years.",
            "acquire_property": "Around age 28-30.",
            "business_successful": "After initial struggles, major success by 35.",
            "financial_opportunity": "During Jupiter or Mars periods.",
            "professional_status": "Gains rapid leaps rather than steady climbs.",
            "strongest_period": "Between 28 and 42 years.",
            "greatest_gains": "Mars and Jupiter planetary periods.",
            "caution_period": "Saturn periods require extreme patience."
        }
    }
    
    earth_profile = {
        "best_age_finance": "32 to 45 years",
        "foreign_travel_age": "29 or 36 years",
        "career_profession": "Banking, agriculture, real estate, administration, arts.",
        "business": "Steady, calculated growth. Retail, food, or traditional businesses.",
        "children": "Stable and grounded, strong traditional values.",
        "property_asset": "Accumulates substantial fixed assets over time.",
        "family_ancestry": "Deeply connected to roots and ancestral traditions.",
        "education": "Methodical learner, drawn to practical sciences and finance.",
        "fame_status": "Gains status slowly through reliability and hard work.",
        "obstacles": "Stubbornness and resistance to change cause missed opportunities.",
        "health": "Prone to throat, bone, or weight-related issues.",
        "spirituality": "Devotional and ritualistic (Bhakti Yoga).",
        "qna": {
            "financial_improve": "Gradual improvement starting at 28, peaking at 36.",
            "good_job": "Around age 25, preferring stable corporations.",
            "career_stable": "Very stable from age 32 onwards.",
            "earning_substantially": "Post 32 years.",
            "get_married": "Average window around 24-28 years.",
            "acquire_property": "Usually around 32-35 years.",
            "business_successful": "Slow start, massive success after 35.",
            "financial_opportunity": "During Venus or Mercury periods.",
            "professional_status": "Steady climb up the corporate ladder.",
            "strongest_period": "Between 36 and 50 years.",
            "greatest_gains": "Venus and Saturn planetary periods.",
            "caution_period": "Mars periods can bring sudden expenditures."
        }
    }
    
    air_profile = {
        "best_age_finance": "24 to 38 years",
        "foreign_travel_age": "Very frequent, starting as early as 22.",
        "career_profession": "IT, communication, media, writing, sales, consulting.",
        "business": "Excellent in networking, tech startups, and trading.",
        "children": "Intellectual and communicative.",
        "property_asset": "Prefers liquid assets or multiple small properties.",
        "family_ancestry": "Friendly but detached, values intellectual connection.",
        "education": "Highly intellectual, drawn to literature, IT, and research.",
        "fame_status": "Gains fame through ideas, speaking, and social networks.",
        "obstacles": "Overthinking and lack of focus scatter energy.",
        "health": "Prone to nervous system and respiratory issues.",
        "spirituality": "Knowledge-based spirituality (Jnana Yoga).",
        "qna": {
            "financial_improve": "Fluctuates, but stabilizes around age 32.",
            "good_job": "Early start, often 21-23 years.",
            "career_stable": "Around age 35 after multiple changes.",
            "earning_substantially": "Post 28 years.",
            "get_married": "Slightly delayed, 26-29 years.",
            "acquire_property": "Around age 36.",
            "business_successful": "Quick success if partnered with stable signs.",
            "financial_opportunity": "During Mercury or Venus periods.",
            "professional_status": "Rises through networking and communication.",
            "strongest_period": "Between 32 and 48 years.",
            "greatest_gains": "Mercury and Saturn planetary periods.",
            "caution_period": "Rahu periods can bring confusion."
        }
    }
    
    water_profile = {
        "best_age_finance": "30 to 42 years",
        "foreign_travel_age": "27, 31, or settling abroad later.",
        "career_profession": "Healthcare, psychology, arts, maritime, teaching.",
        "business": "Succeeds in creative fields, hospitality, or caregiving.",
        "children": "Deep emotional bond, highly intuitive.",
        "property_asset": "Properties near water or beautiful landscapes.",
        "family_ancestry": "Extremely attached to family and emotional roots.",
        "education": "Intuitive learner, drawn to arts, psychology, or occult.",
        "fame_status": "Gains recognition for empathy, healing, or creativity.",
        "obstacles": "Emotional volatility and taking things personally.",
        "health": "Prone to digestive, fluid, or emotional stress issues.",
        "spirituality": "Deeply mystical and intuitive (Raja Yoga).",
        "qna": {
            "financial_improve": "Steady flow starting from age 30.",
            "good_job": "Around age 26, often in nurturing roles.",
            "career_stable": "Stability arrives around age 33.",
            "earning_substantially": "Post 32 years.",
            "get_married": "Average window around 24-28 years.",
            "acquire_property": "Around age 33-36.",
            "business_successful": "Success driven by intuition, usually after 30.",
            "financial_opportunity": "During Moon or Jupiter periods.",
            "professional_status": "Grows quietly through behind-the-scenes work.",
            "strongest_period": "Between 30 and 45 years.",
            "greatest_gains": "Moon and Jupiter planetary periods.",
            "caution_period": "Saturn periods can bring emotional heaviness."
        }
    }

    if matched_rashi in ["Aries", "Leo", "Sagittarius"]:
        profile = fire_profile
    elif matched_rashi in ["Taurus", "Virgo", "Capricorn"]:
        profile = earth_profile
    elif matched_rashi in ["Gemini", "Libra", "Aquarius"]:
        profile = air_profile
    else:
        profile = water_profile

    return {
        "name": name.capitalize(),
        "akshar": akshar_found.capitalize(),
        "nakshatra": matched_nakshatra,
        "rashi": matched_rashi,
        "details": profile,
        "method": "Garga Samhita / Avakahada Chakra"
    }
