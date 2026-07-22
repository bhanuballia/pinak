# backend/strength/sphuta_drishti.py
"""
Sphuta Drishti (Mathematical Aspect Strength)
Calculates exact aspect strength (Drishti Pinda) in Shashtiamsas (0 to 60)
between planets based on their sidereal longitudes.
"""

PLANETS_LIST = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]

BENEFICS = {"Jupiter", "Venus", "Moon", "Mercury"}
MALEFICS = {"Sun", "Mars", "Saturn", "Rahu", "Ketu"}

SPECIAL_ASPECT_TARGETS = {
    "Saturn": [60.0, 270.0],  # 3rd & 10th aspects
    "Mars": [90.0, 210.0],    # 4th & 8th aspects
    "Jupiter": [120.0, 240.0], # 5th & 9th aspects
    "Rahu": [120.0, 240.0],    # Rahu & Ketu also share Jupiter's 5th/9th aspects in many systems
    "Ketu": [120.0, 240.0]
}

def calculate_single_sphuta_drishti(lon_aspecting: float, lon_aspected: float, planet_name: str) -> float:
    """
    Calculate the mathematical aspect strength (in Shashtiamsas) cast by one planet on another.
    Range is 0 to 60. 60 Shashtiamsas = 100% full aspect.
    """
    # Compute the difference in longitude (Drishti Kendra) from aspecting to aspected
    diff = (lon_aspected - lon_aspecting) % 360.0

    # 1. Base General Aspect Calculation (based on classical rules)
    gen_aspect = 0.0
    if 30.0 <= diff < 60.0:
        gen_aspect = (diff - 30.0) / 2.0  # rises 0 -> 15
    elif 60.0 <= diff < 90.0:
        gen_aspect = 15.0 + (diff - 60.0) / 2.0  # rises 15 -> 30
    elif 90.0 <= diff < 120.0:
        gen_aspect = 30.0 + (diff - 90.0) / 2.0  # rises 30 -> 45
    elif 120.0 <= diff < 150.0:
        gen_aspect = 45.0 - (diff - 120.0) / 2.0  # falls 45 -> 30
    elif 150.0 <= diff < 180.0:
        gen_aspect = 30.0 + (diff - 150.0)  # rises 30 -> 60 (at exactly 180 / 7th house)
    elif 180.0 <= diff < 210.0:
        gen_aspect = 60.0 - (diff - 180.0) * 2.0  # falls 60 -> 0
    elif 270.0 <= diff < 300.0:
        gen_aspect = (diff - 270.0) / 2.0  # rises 0 -> 15
    elif 300.0 <= diff < 330.0:
        gen_aspect = 15.0 - (diff - 300.0) / 2.0  # falls 15 -> 0
    
    # Ensure general aspect is positive
    gen_aspect = max(0.0, gen_aspect)

    # 2. Special Aspect Calculation (Jupiter, Mars, Saturn, Rahu, Ketu)
    special_aspect = 0.0
    if planet_name in SPECIAL_ASPECT_TARGETS:
        for target in SPECIAL_ASPECT_TARGETS[planet_name]:
            # Peak of 60 Shashtiamsas at target degree, with a 15-degree linear orb on either side
            dist_to_target = abs(diff - target)
            if dist_to_target < 15.0:
                val = 60.0 * (1.0 - (dist_to_target / 15.0))
                special_aspect = max(special_aspect, val)

    # 3. 7th Aspect is always full (60 Shashtiamsas) at exactly 180 degrees difference
    # Let's apply a 15-degree orb around 180 degrees as well, peaking at 60
    dist_to_180 = abs(diff - 180.0)
    if dist_to_180 < 15.0:
        opp_aspect = 60.0 * (1.0 - (dist_to_180 / 15.0))
    else:
        opp_aspect = 0.0

    # Sphuta Drishti is the maximum of all aspect components
    final_drishti = max(gen_aspect, special_aspect, opp_aspect)
    
    # Clamp to max 60.0
    return round(min(final_drishti, 60.0), 2)

def calculate_sphuta_drishti_matrix(chart: dict) -> dict:
    """
    Generate a complete 9x9 matrix of aspect strengths between all planets.
    """
    positions = chart.get("planet_positions", {})
    matrix = {}
    
    # Extract longitudes
    longitudes = {}
    for p in PLANETS_LIST:
        if p in positions:
            longitudes[p] = float(positions[p].get("sidereal", {}).get("lon", 0.0))
        else:
            longitudes[p] = 0.0

    for p1 in PLANETS_LIST:
        matrix[p1] = {}
        for p2 in PLANETS_LIST:
            if p1 == p2:
                matrix[p1][p2] = 0.0
            else:
                matrix[p1][p2] = calculate_single_sphuta_drishti(longitudes[p1], longitudes[p2], p1)
                
    return matrix
