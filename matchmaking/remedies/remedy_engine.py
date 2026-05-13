# matchmaking/remedies/remedy_engine.py
from typing import List, Dict, Any

def get_marriage_remedies(guna_score: float, manglik_report: Dict[str, Any]) -> List[Dict[str, str]]:
    """
    Generates specific remedies for marriage harmony.
    """
    remedies = []
    
    if manglik_report.get("cancelled") is False:
        remedies.append({
            "type": "Puja",
            "title": "Mangal Shanti",
            "description": "Perform Mangal Shanti puja at Ujjain or a local Shiva temple to neutralize Mars afflictions."
        })
        
    if guna_score < 18:
        remedies.append({
            "type": "Mantra",
            "title": "Gauri Shankar Mantra",
            "description": "Chant 'Hey Gauri Shankarardhangi...' 108 times daily to strengthen the bond."
        })
        
    # Default Vedic recommendations
    remedies.append({
        "type": "Gemstone",
        "title": "Venus Strengthening",
        "description": "Both partners should ensure Venus is strong. Diamond or White Sapphire is recommended for the partner with a weaker Venus."
    })
    
    return remedies
