
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

from core.quantum.quantum_rules import MARRIAGE_LORDS, CAREER_LORDS, WEALTH_LORDS


def calculate_age_windows(dasha, strength):
    """
    Calculate critical life windows based on Dasha periods and planetary strengths.
    Uses centralized quantum rules for classification.
    """
    windows = []
    
    # Simple logic: map dasha periods to age-based windows
    dasha_list = dasha.get("list", [])
    
    for d in dasha_list:
        lord = d.get("lord", "")
        lord_strength = _get_strength(strength, lord, 1.0)
        
        # Define window potential based on lord strength
        potential = "High" if lord_strength > 1.1 else "Moderate" if lord_strength > 0.9 else "Low"
        
        # Identify categories
        categories = []
        if lord in MARRIAGE_LORDS: categories.append("Relationship")
        if lord in CAREER_LORDS: categories.append("Career")
        if lord in WEALTH_LORDS: categories.append("Wealth")
        
        windows.append({
            "period": f"{d.get('start_date')} - {d.get('end_date')}",
            "lord": lord,
            "potential": potential,
            "strength_score": lord_strength,
            "categories": categories
        })
        
    return windows
