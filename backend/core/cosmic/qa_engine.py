
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def auto_qa_predictions(chart, strength, dosha):
    """
    Automated QA predictions based on core astronomical factors.
    """
    predictions = {
        "career": "Stability through discipline",
        "finance": "Gradual wealth accumulation",
        "health": "Vitality supported by energetic alignment",
        "relationship": "Focus on emotional clarity"
    }
    
    # Simple logic adjustments
    if _get_strength(strength, "Jupiter", 1.0) > 1.2:
        predictions["career"] = "Significant growth and expansion"
        predictions["finance"] = "Abundance and prosperity"
        
    if _get_strength(strength, "Saturn", 1.0) < 0.8:
        predictions["career"] = "Temporary challenges requiring patience"
        
    return predictions
