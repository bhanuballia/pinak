from typing import Dict, Any, List, Optional

DEITY_MAPPING = {
    "Sun": "Lord Rama / Shiva",
    "Moon": "Krishna / Gauri (Divine Mother)",
    "Mars": "Hanuman / Subramanya",
    "Mercury": "Vishnu",
    "Jupiter": "Vamana / Dakshinamurthy",
    "Venus": "Parashurama / Lakshmi",
    "Saturn": "Kurma / Shiva",
    "Rahu": "Durga / Ganesh",
    "Ketu": "Ganesha",
}

SIGN_LORDS = {
    0: "Mars",      # Aries
    1: "Venus",     # Taurus
    2: "Mercury",   # Gemini
    3: "Moon",      # Cancer
    4: "Sun",       # Leo
    5: "Mercury",   # Virgo
    6: "Venus",     # Libra
    7: "Mars",      # Scorpio
    8: "Jupiter",   # Sagittarius
    9: "Saturn",    # Capricorn
    10: "Saturn",   # Aquarius
    11: "Jupiter",  # Pisces
}

SIGN_NAMES = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]


def get_atmakaraka(d1_chart: Dict[str, Any]) -> Optional[str]:
    """
    Atmakaraka (AK): Identify the planet with the highest longitude (in its sign)
    in the Rashi (D1) chart, excluding Rahu/Ketu.
    """
    planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    ak = None
    max_deg = -1.0
    
    positions = d1_chart.get("planet_positions", {})
    for p in planets:
        if p in positions:
            lon = positions[p]["sidereal"]["lon"]
            deg_in_sign = lon % 30.0
            if deg_in_sign > max_deg:
                max_deg = deg_in_sign
                ak = p
                
    return ak


def calculate_ishta_devata(d1_chart: Dict[str, Any], d9_chart: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculates Ishta Devata based on Jaimini astrology.
    """
    ak = get_atmakaraka(d1_chart)
    if not ak:
        return {
            "ishta_devata": "Unknown",
            "atmakaraka": None,
            "karakamsa_sign": "Unknown",
            "twelfth_house_sign": "Unknown",
            "planets_in_twelfth": [],
            "ruling_planet": None,
            "description": "Could not determine Atmakaraka."
        }

    # Karakamsa: the sign where Atmakaraka falls in the Navamsa (D9) chart.
    nav_positions = d9_chart.get("varga_positions", d9_chart.get("planet_navamsa", {}))
    if ak not in nav_positions:
        return {
            "ishta_devata": "Unknown",
            "atmakaraka": ak,
            "karakamsa_sign": "Unknown",
            "twelfth_house_sign": "Unknown",
            "planets_in_twelfth": [],
            "ruling_planet": None,
            "description": "Navamsa position of Atmakaraka not found."
        }
        
    karakamsa_sign_idx = nav_positions[ak].get("sign_index", nav_positions[ak].get("navamsa_sign_index"))
    
    # 12th House from Karakamsa (Sign-based)
    twelfth_sign_idx = (karakamsa_sign_idx - 1) % 12
    
    # Check planets in 12th house of D9
    planets_in_12th = []
    # Try looking into the D9 signs mapping if there is one
    d9_signs = d9_chart.get("signs", {})
    if twelfth_sign_idx in d9_signs:
        planets_in_12th = d9_signs[twelfth_sign_idx].get("planets", [])
        # Filter out nodes if they aren't considered, but generally they can represent deities here
        
    if not planets_in_12th:
        # If no planets, take the lord of that sign
        ruling_planet = SIGN_LORDS[twelfth_sign_idx]
    else:
        # If multiple, ideally the strongest. We'll pick the first/most prominent, or combine.
        # Often, if Rahu/Ketu are there, they are taken. Let's just pick the first one for the main deity,
        # but list all.
        # Filter strictly to the 9 planets
        valid_planets = [p for p in planets_in_12th if p in DEITY_MAPPING]
        if valid_planets:
            ruling_planet = valid_planets[0]  # simplified to picking the first
        else:
            ruling_planet = SIGN_LORDS[twelfth_sign_idx]

    ishta_devata = DEITY_MAPPING.get(ruling_planet, "Unknown")
    
    desc = []
    desc.append(f"Your Atmakaraka (soul planet) is {ak}.")
    desc.append(f"In your Navamsa (D9) chart, {ak} is in {SIGN_NAMES[karakamsa_sign_idx]} (your Karakamsa).")
    desc.append(f"The 12th house from Karakamsa is {SIGN_NAMES[twelfth_sign_idx]}.")
    if planets_in_12th:
        desc.append(f"Planets in this house: {', '.join(planets_in_12th)}.")
    else:
        desc.append(f"No planets are in {SIGN_NAMES[twelfth_sign_idx]}, so we look at its Lord, {ruling_planet}.")
    desc.append(f"The planet determining your Ishta Devata is {ruling_planet}.")
    
    return {
        "ishta_devata": ishta_devata,
        "atmakaraka": ak,
        "karakamsa_sign": SIGN_NAMES[karakamsa_sign_idx],
        "twelfth_house_sign": SIGN_NAMES[twelfth_sign_idx],
        "planets_in_twelfth": planets_in_12th,
        "ruling_planet": ruling_planet,
        "description": " ".join(desc)
    }
