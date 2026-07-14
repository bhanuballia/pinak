"""
backend/core/astrology/divisional/deities.py

Module to determine the Deity of a given planet in various divisional charts (Vargas)
based on its exact longitude in the Rasi (D-1) chart.
Rules are taken from Brihat Parashara Hora Shastra (BPHS).
"""

def get_sign_index(longitude_360: float) -> int:
    """Returns the sign index (0-11, 0=Aries) for a given longitude."""
    return int((longitude_360 % 360) // 30)

def get_degree_in_sign(longitude_360: float) -> float:
    """Returns the degree within the sign (0.0 to 29.999...)."""
    return (longitude_360 % 360) % 30

def get_d9_deity(longitude_360: float) -> dict:
    """
    D-9 (Navamsha) Deities:
    A Navamsha is 3 degrees 20 minutes (3.333... degrees).
    The resulting D-9 sign determines the deity:
    - Movable (Aries, Cancer, Libra, Capricorn): Deva (Divine)
    - Fixed (Taurus, Leo, Scorpio, Aquarius): Manushya (Human)
    - Dual (Gemini, Virgo, Sagittarius, Pisces): Rakshasa (Demonic)
    """
    sign = get_sign_index(longitude_360)
    deg = get_degree_in_sign(longitude_360)
    amsha = int(deg // (30 / 9)) # 0 to 8
    
    if sign % 3 == 0: # Movable
        d9_sign = (sign + amsha) % 12
    elif sign % 3 == 1: # Fixed
        d9_sign = (sign + 8 + amsha) % 12
    else: # Dual
        d9_sign = (sign + 4 + amsha) % 12

    mod = d9_sign % 3
    if mod == 0:
        return {"deity": "Deva", "interpretation": "Divine, pure, helpful nature. Bestows good results and blessings."}
    elif mod == 1:
        return {"deity": "Manushya", "interpretation": "Human nature. Mixed results based on efforts and environment."}
    else:
        return {"deity": "Rakshasa", "interpretation": "Demonic, harsh, or materialistic nature. May cause delays, harshness, or intense struggles."}


def get_d10_deity(longitude_360: float) -> dict:
    """
    D-10 (Dashamsha) Deities (10 Dikpalas - Guardians of Directions)
    Division is 3 degrees each.
    """
    sign = get_sign_index(longitude_360)
    deg = get_degree_in_sign(longitude_360)
    amsha = int(deg // 3) # 0 to 9
    
    deities = [
        {"deity": "Indra", "interpretation": "Power, leadership, and high authority in career."},
        {"deity": "Agni", "interpretation": "Transformation, energy, engineering, or aggressive pursuits."},
        {"deity": "Yama", "interpretation": "Justice, discipline, law, or matters related to endings/death."},
        {"deity": "Rakshasa", "interpretation": "Unconventional career, breaking rules, or intense struggles."},
        {"deity": "Varuna", "interpretation": "Travel, foreign connections, healing, or fluid situations."},
        {"deity": "Vayu", "interpretation": "Speed, communication, travel, or unstable career path."},
        {"deity": "Kubera", "interpretation": "Wealth, finance, banking, and great prosperity."},
        {"deity": "Ishana", "interpretation": "Knowledge, spirituality, teaching, or pure endeavors."},
        {"deity": "Brahma", "interpretation": "Creation, initiation, research, and monumental work."},
        {"deity": "Ananta", "interpretation": "Eternal, vastness, limitless scope, or deeply hidden work."}
    ]
    
    if sign % 2 == 0:
        deity_idx = amsha
    else:
        deity_idx = 9 - amsha

    return deities[deity_idx]

def get_d2_deity(longitude_360: float) -> dict:
    """
    D-2 (Hora) Deities:
    - Sun's Hora (Leo): Deva (Gods)
    - Moon's Hora (Cancer): Pitri (Ancestors)
    """
    sign = get_sign_index(longitude_360)
    deg = get_degree_in_sign(longitude_360)
    
    # 0-15 degrees in odd signs -> Leo (Sun), 15-30 -> Cancer (Moon)
    # 0-15 degrees in even signs -> Cancer (Moon), 15-30 -> Leo (Sun)
    is_odd = (sign % 2 == 0) # 0 is Aries (odd sign)
    
    if is_odd:
        is_sun_hora = deg < 15
    else:
        is_sun_hora = deg >= 15
        
    if is_sun_hora:
        return {"deity": "Deva", "interpretation": "Ruled by gods, showing self-reliance, initiative, and active wealth creation."}
    else:
        return {"deity": "Pitri", "interpretation": "Ruled by ancestors, indicating inherited wealth, savings, and emotional/passive accumulation."}

def get_varga_deities(longitude_360: float) -> dict:
    """Returns a dictionary of deities for key Vargas for a given longitude."""
    return {
        "d2": get_d2_deity(longitude_360),
        "d9": get_d9_deity(longitude_360),
        "d10": get_d10_deity(longitude_360)
    }
