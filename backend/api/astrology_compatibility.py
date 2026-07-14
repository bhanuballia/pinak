# backend/api/astrology_compatibility.py

# Group signs by element
ELEMENTS = {
    "Fire": ["Aries", "Leo", "Sagittarius"],
    "Earth": ["Taurus", "Virgo", "Capricorn"],
    "Air": ["Gemini", "Libra", "Aquarius"],
    "Water": ["Cancer", "Scorpio", "Pisces"]
}

def get_element(sign: str) -> str:
    for element, signs in ELEMENTS.items():
        if sign in signs:
            return element
    return None

def get_moon_sign_compatibility(sign1: str, sign2: str) -> dict:
    """
    Determines compatibility between two Moon signs.
    This uses a basic astrological elemental compatibility matrix.
    """
    sign1 = sign1.title()
    sign2 = sign2.title()
    
    element1 = get_element(sign1)
    element2 = get_element(sign2)
    
    if not element1 or not element2:
        return {
            "score": 0,
            "message": "Invalid Moon signs provided."
        }
        
    if sign1 == sign2:
        return {
            "score": 90,
            "message": "You share the same Moon sign! Deep emotional understanding and mirrored feelings."
        }
        
    # Same element is generally harmonious (Trine)
    if element1 == element2:
        return {
            "score": 85,
            "message": "Your Moon signs share the same element. You naturally understand each other's emotional needs."
        }
        
    # Complementary elements (Fire/Air, Earth/Water)
    complementary = {
        "Fire": "Air",
        "Air": "Fire",
        "Earth": "Water",
        "Water": "Earth"
    }
    
    if complementary[element1] == element2:
        return {
            "score": 75,
            "message": "Your Moon signs are in complementary elements, creating a stimulating and balancing connection."
        }
        
    # Difficult combinations (Fire/Water, Earth/Air, etc.)
    return {
        "score": 45,
        "message": "Your Moon signs are in contrasting elements. This relationship offers growth through understanding differences, though emotional disconnects may occur."
    }

def get_zodiac_from_name(name: str) -> str:
    """
    Simplified mapping of the first letter of a name to a Zodiac sign.
    Based loosely on Vedic Astrology (Avakahada Chakra) principles for name initials.
    """
    if not name:
        return "Aries" # default fallback
        
    first_letter = name.strip().upper()[0]
    
    mapping = {
        'Aries': ['A', 'L', 'E', 'I', 'O'],
        'Taurus': ['B', 'V', 'U', 'W'],
        'Gemini': ['K', 'C', 'Q'],
        'Cancer': ['D', 'H'],
        'Leo': ['M', 'T'],
        'Virgo': ['P'],
        'Libra': ['R', 'T'], # Using R mostly
        'Scorpio': ['N', 'Y'],
        'Sagittarius': ['F', 'P'], # Using F, Bh, Dh, Ph
        'Capricorn': ['J', 'G'],
        'Aquarius': ['G', 'S'],
        'Pisces': ['D', 'Z']
    }
    
    for sign, letters in mapping.items():
        if first_letter in letters:
            return sign
            
    # Default fallback if letter not explicitly mapped (for simplicity)
    return "Aries"

def get_passion_compatibility_score(venus1: str, mars1: str, venus2: str, mars2: str) -> dict:
    """
    Evaluates romantic and passionate compatibility based on Venus and Mars placements.
    Checks Venus-Mars cross connections and Venus-Venus / Mars-Mars harmony.
    """
    v1_el = get_element(venus1.title())
    m1_el = get_element(mars1.title())
    v2_el = get_element(venus2.title())
    m2_el = get_element(mars2.title())
    
    if not all([v1_el, m1_el, v2_el, m2_el]):
        return {"score": 0, "message": "Invalid signs provided."}
        
    score = 50 # Base score
    
    complementary = {
        "Fire": "Air", "Air": "Fire", "Earth": "Water", "Water": "Earth"
    }
    
    # Check Venus 1 to Mars 2 (Attraction P1 -> P2)
    if v1_el == m2_el:
        score += 20
    elif complementary.get(v1_el) == m2_el:
        score += 15
        
    # Check Venus 2 to Mars 1 (Attraction P2 -> P1)
    if v2_el == m1_el:
        score += 20
    elif complementary.get(v2_el) == m1_el:
        score += 15
        
    # Check Venus to Venus (Romantic harmony)
    if v1_el == v2_el:
        score += 10
        
    # Check Mars to Mars (Physical harmony)
    if m1_el == m2_el:
        score += 10
        
    # Cap score at 98
    score = min(score, 98)
    
    if score >= 85:
        msg = "Intense, magnetic attraction! Your Venus and Mars alignments are off the charts."
    elif score >= 70:
        msg = "Strong romantic and physical chemistry. A very exciting connection."
    elif score >= 55:
        msg = "Moderate chemistry. You have enough sparks to make it work with effort."
    else:
        msg = "Challenging dynamic. Your love languages and drives might be very different."
        
    return {
        "score": score,
        "message": msg
    }

def get_sun_sign_compatibility_score(sign1: str, sign2: str) -> dict:
    """
    Determines compatibility between two Sun signs (Core personality/Ego).
    """
    sign1 = sign1.title()
    sign2 = sign2.title()
    
    element1 = get_element(sign1)
    element2 = get_element(sign2)
    
    if not element1 or not element2:
        return {
            "score": 0,
            "message": "Invalid Sun signs provided."
        }
        
    if sign1 == sign2:
        return {
            "score": 80,
            "message": "You share the same Sun sign! Your core personalities and life goals are very similar."
        }
        
    # Same element is harmonious (Trine)
    if element1 == element2:
        return {
            "score": 90,
            "message": "Your Sun signs share the same element. You have a natural understanding of each other's core nature."
        }
        
    # Complementary elements (Fire/Air, Earth/Water)
    complementary = {
        "Fire": "Air",
        "Air": "Fire",
        "Earth": "Water",
        "Water": "Earth"
    }
    
    if complementary[element1] == element2:
        return {
            "score": 85,
            "message": "Your Sun signs are complementary. You balance each other out perfectly."
        }
        
    # Difficult combinations
    return {
        "score": 50,
        "message": "Your Sun signs represent very different approaches to life. This relationship will require compromise and understanding."
    }

