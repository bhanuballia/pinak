def benefic_planets(lagna):

    benefics = {
        "Aries": ["Sun", "Jupiter", "Mars"],
        "Taurus": ["Saturn", "Mercury"],
        "Gemini": ["Venus", "Mercury"],
        "Cancer": ["Moon", "Mars", "Jupiter"],
        "Leo": ["Sun", "Mars", "Jupiter"],
        "Virgo": ["Mercury", "Venus"],
        "Libra": ["Saturn", "Mercury"],
        "Scorpio": ["Mars", "Sun", "Jupiter"],
        "Sagittarius": ["Jupiter", "Sun", "Mars"],
        "Capricorn": ["Venus", "Mercury"],
        "Aquarius": ["Saturn", "Venus"],
        "Pisces": ["Jupiter", "Moon", "Mars"],
    }

    return benefics.get(lagna, [])