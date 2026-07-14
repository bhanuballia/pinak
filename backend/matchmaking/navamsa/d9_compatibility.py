# matchmaking/navamsa/d9_compatibility.py
"""
Navamsa (D9) Compatibility Engine.
Analyzes long-term stability and spiritual bond between partners.
"""

from typing import Dict, Any
from core.utils import ZODIAC_SIGNS

def analyze_d9_compatibility(bride_vargas: Dict[str, Any], groom_vargas: Dict[str, Any]) -> Dict[str, Any]:
    """
    Compares D9 charts for spiritual and long-term compatibility.
    Checks relationship between Navamsha ascendants.
    """
    b_d9 = bride_vargas.get("d9", {})
    g_d9 = groom_vargas.get("d9", {})
    
    if not b_d9 or not g_d9:
        return {
            "d9_stability_score": 50,
            "spiritual_bond": "Unknown",
            "long_term_prospect": "Unknown",
            "description": "Navamsha data not available for deep compatibility analysis."
        }
        
    b_asc = b_d9.get("ascendant_sign", "")
    g_asc = g_d9.get("ascendant_sign", "")
    
    score = 75
    relationship_desc = ""
    bond = "Moderate"
    prospect = "Stable"
    
    if b_asc and g_asc and b_asc in ZODIAC_SIGNS and g_asc in ZODIAC_SIGNS:
        b_idx = ZODIAC_SIGNS.index(b_asc)
        g_idx = ZODIAC_SIGNS.index(g_asc)
        
        # Calculate distance (1-indexed)
        # B to G
        dist_b_to_g = (g_idx - b_idx) % 12 + 1
        dist_g_to_b = (b_idx - g_idx) % 12 + 1
        
        # Normalize naming (e.g., smaller/larger) or just output both
        relationship = f"{dist_b_to_g}/{dist_g_to_b}"
        
        if relationship in ["1/1", "7/7"]:
            score = 95
            bond = "Very Strong"
            prospect = "Highly Stable and Harmonious"
            relationship_desc = f"Excellent Navamsha Ascendant relationship ({relationship}). Deep spiritual connection and mirrored goals."
        elif relationship in ["5/9", "9/5"]:
            score = 90
            bond = "Very Strong"
            prospect = "Highly Stable and Harmonious"
            relationship_desc = f"Excellent Navamsha Ascendant relationship (5/9 Trikona). Natural harmony, luck, and spiritual alignment."
        elif relationship in ["3/11", "11/3"]:
            score = 85
            bond = "Strong"
            prospect = "Growth-oriented"
            relationship_desc = f"Favorable Navamsha Ascendant relationship (3/11). Mutual gains, strong friendship, and support."
        elif relationship in ["4/10", "10/4"]:
            score = 75
            bond = "Practical"
            prospect = "Stable"
            relationship_desc = f"Neutral/Solid Navamsha Ascendant relationship (4/10). Focus on mutual duties, career, and building a foundation."
        elif relationship in ["2/12", "12/2"]:
            score = 45
            bond = "Challenging"
            prospect = "Requires Adjustment"
            relationship_desc = f"Challenging Navamsha Ascendant relationship (2/12 Dwirdvadasa). Potential for misunderstandings, financial stress, or emotional distance."
        elif relationship in ["6/8", "8/6"]:
            score = 35
            bond = "Intense/Friction"
            prospect = "Karmic Challenges"
            relationship_desc = f"Difficult Navamsha Ascendant relationship (6/8 Shadashtaka). Warning: indicates hidden friction, karmic challenges, or health/debt issues in marriage."
        else:
            relationship_desc = f"Navamsha Ascendant relationship is {relationship}."
            
    return {
        "d9_stability_score": score,
        "spiritual_bond": bond,
        "long_term_prospect": prospect,
        "description": relationship_desc if relationship_desc else "The Navamsa charts show moderate synchronization.",
        "bride_d9_ascendant": b_asc,
        "groom_d9_ascendant": g_asc
    }
