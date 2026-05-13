
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

from typing import Dict, Any, List
from core.knowledge.planet_house_text import planet_interpretation

def planetary_wisdom_analysis(chart: Dict[str, Any], strength: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generates a deep-dive analysis for every planet in its specific house and sign."""
    
    planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
    analysis_blocks = []
    
    for planet in planets:
        # Find planet data in chart
        planet_data = None
        # Check in houses
        found = False
        for house_num, house_data in chart.get("houses", {}).items():
            for p in house_data.get("planets", []):
                if p == planet or (isinstance(p, dict) and p.get("name") == planet):
                    planet_data = {
                        "name": planet,
                        "house": house_num,
                        "sign": house_data.get("sign_name", "Unknown")
                    }
                    found = True
                    break
            if found: break
            
        if not planet_data:
            continue
            
        p_name = planet_data["name"]
        p_house = planet_data["house"]
        p_sign = planet_data["sign"]
        p_strength = _get_strength(strength, p_name, 1.0)
        
        # Build multi-paragraph analysis
        title = f"{p_name} in the {p_house} House ({p_sign})"
        
        paragraphs = []
        
        # Paragraph 0: Database interpretation
        db_text = planet_interpretation(p_name, int(p_house))
        if db_text:
            paragraphs.append(f"<b>Key Interpretation:</b> {db_text}")
        
        # Paragraph 1: Core Influence
        paragraphs.append(
            f"The placement of {p_name} in your {p_house} house, within the sign of {p_sign}, "
            f"creates a unique vibration that significantly colors your life's path. {p_name} represents "
            f"{_get_planet_meaning(p_name)}, and its presence here highlights a area of intense focus and "
            f"learning. With a strength of {p_strength:.2f}, this influence is {'particularly dominant' if p_strength > 1.2 else 'subtle yet steady' if p_strength > 0.8 else 'a area that requires conscious work'}. "
            f"The cosmic geometry suggests that you are meant to master the qualities of {p_sign} through the "
            f"practical activities associated with the {p_house} house."
        )
        
        # Paragraph 2: Psychological Depth
        paragraphs.append(
            f"Psychologically, this placement suggests a deep-seated drive toward {_get_house_meaning(p_house)}. "
            f"You may find that your sense of {_get_planet_meaning(p_name, context='internal')} is constantly "
            f"vibrating with the need for {p_sign}-like expression. This can lead to moments of great insight "
            f"where you suddenly understand the hidden motives behind your actions. Over time, you will develop "
            f"a sophisticated ability to navigate the complexities of this house, turning potential friction "
            f"into a polished facet of your personality. The {p_sign} influence ensures that your approach is "
            f"{_get_sign_quality(p_sign)}, which adds a layer of depth to your public and private persona."
        )
        
        # Paragraph 3: Karmic Lesson
        paragraphs.append(
            f"From a karmic perspective, {p_name} in the {p_house} house points to lessons inherited from previous "
            f"soul journeys. You are here to reconcile the drive for {p_name} with the limitations or opportunities "
            f"of {p_house}. This is not a random placement but a deliberate calibration of your soul's growth "
            f"requirements. As you align with this energy, you will notice synchronistic events that confirm "
            f"you are on the right track. The challenge is to avoid the shadow side of {p_sign}, which might manifest "
            f"as over-emphasis or avoidance in certain cycles. Embracing the higher octave of this placement "
            f"unlocks the true potential of your {p_house} house affairs."
        )
        
        # Paragraph 4: Practical Guidance
        paragraphs.append(
            f"In practical terms, you should focus on {_get_practical_advice(p_name, p_house)}. "
            f"This will help you bridge the gap between abstract planetary energy and daily reality. "
            f"During dasha periods involving {p_name}, these themes will become even more pronounced. "
            f"Setting specific goals related to {p_house} while maintaining the ethical standards of {p_sign} "
            f"will result in both material success and inner peace. Remember that {p_name} is your guide in "
            f"manifesting the qualities of this house, and its placement in {p_sign} provides the tools "
            f"needed to building a lasting legacy."
        )
        
        analysis_blocks.append({
            "planet": p_name,
            "title": title,
            "paragraphs": paragraphs
        })
        
    return analysis_blocks

def _get_planet_meaning(name: str, context: str = 'external') -> str:
    meanings = {
        "Sun": "your core identity, vitality, and authority" if context == 'external' else "soul-level illumination",
        "Moon": "your emotions, intuition, and mind" if context == 'external' else "inner nurturing and emotional flow",
        "Mars": "your drive, courage, and energy" if context == 'external' else "the fire of transformation",
        "Mercury": "your communication, intellect, and business acumen" if context == 'external' else "the bridge between mind and spirit",
        "Jupiter": "your wisdom, expansion, and prosperity" if context == 'external' else "the guiding light of truth",
        "Venus": "your desires, luxury, and relationships" if context == 'external' else "harmonizing love and creative beauty",
        "Saturn": "your discipline, karma, and time" if context == 'external' else "the structural integrity of the soul",
        "Rahu": "your obsessions, future growth, and worldly desires" if context == 'external' else "the boundary-breaking cosmic north node",
        "Ketu": "your past life skills, detachment, and spirituality" if context == 'external' else "the soul's release and karmic south node"
    }
    return meanings.get(name, "cosmic energy")

def _get_house_meaning(num: Any) -> str:
    house_num = str(num)
    meanings = {
        "1": "self-expression and world-facing identity",
        "2": "financial security and family values",
        "3": "communication, siblings, and courageous effort",
        "4": "inner happiness, home, and ancestral roots",
        "5": "creativity, children, and speculative wisdom",
        "6": "daily work, health, and overcoming obstacles",
        "7": "partnerships, relationship dynamics, and public interaction",
        "8": "transformation, occult research, and shared resources",
        "9": "higher learning, religion, and long-distance travel",
        "10": "professional reputation, career status, and social contribution",
        "11": "gains, social networks, and community aspirations",
        "12": "spiritual liberation, isolated reflection, and creative expenditures"
    }
    return meanings.get(house_num, "an important life domain")

def _get_sign_quality(sign: str) -> str:
    qualities = {
        "Aries": "dynamic and pioneering",
        "Taurus": "stable and enduring",
        "Gemini": "intellectual and versatile",
        "Cancer": "nurturing and intuitive",
        "Leo": "creative and authoritative",
        "Virgo": "analytical and precise",
        "Libra": "harmonious and diplomatic",
        "Scorpio": "intense and transformative",
        "Sagittarius": "optimistic and philosophical",
        "Capricorn": "disciplined and ambitious",
        "Aquarius": "innovative and humanitarian",
        "Pisces": "compassionate and spiritual"
    }
    return qualities.get(sign, "unique and meaningful")

def _get_practical_advice(planet: str, house: Any) -> str:
    advice = {
        "Sun": "stepping into your leadership power within this area",
        "Moon": "nurturing your emotional connection to these life themes",
        "Mars": "taking courageous and decisive action to achieve your goals",
        "Mercury": "developing clear communication and specialized logic",
        "Jupiter": "expanding your horizons through knowledge and ethical growth",
        "Venus": "bringing beauty, harmony, and creative value to these affairs",
        "Saturn": "building a solid foundation through discipline and perseverance",
        "Rahu": "exploring new frontiers and breaking free from traditional bounds",
        "Ketu": "using deep-seated intuition and spiritual detachment for success"
    }
    return advice.get(planet, "aligning your actions with your higher purpose")
