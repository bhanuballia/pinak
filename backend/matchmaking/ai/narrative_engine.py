# matchmaking/ai/narrative_engine.py
from typing import List, Dict, Any

def generate_relationship_summary(success_prob: float, guna_score: float, toxic_warnings: List[str]) -> Dict[str, Any]:
    """
    AI-driven relationship narrative synthesis.
    """
    strengths = []
    weaknesses = []
    
    if guna_score > 21:
        strengths.append("High mental and temperamental synchronization.")
    if success_prob > 80:
        strengths.append("Exceptional long-term stability and karmic alignment.")
        
    if toxic_warnings:
        weaknesses.extend(toxic_warnings)
    if success_prob < 50:
        weaknesses.append("Potential for communication gaps and interest misalignment.")
        
    summary = ""
    if success_prob > 75:
        summary = "This is a Divine match with strong potential for life-long happiness and mutual growth."
    elif success_prob > 55:
        summary = "A stable and supportive relationship, though conscious effort and remedies are advised for minor frictions."
    else:
        summary = "A challenging combination requiring significant adjustment, compromise, and consistent spiritual remedies."
        
    return {
        "summary": summary,
        "strengths": strengths if strengths else ["Basic stability"],
        "weaknesses": weaknesses if weaknesses else ["Minor adjustments needed"]
    }
