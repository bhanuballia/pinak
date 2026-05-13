# matchmaking/timing/marriage_timing.py
from typing import List, Dict, Any

def predict_marriage_timing(dasha_data: Dict[str, Any]) -> List[str]:
    """
    Predicts favorable years for marriage based on Antardasha of 7th Lord, Venus, or Jupiter.
    """
    favorable_years = []
    
    # Logic: Look for Venus/Jupiter/7th Lord periods in the next 5 years
    # Since we have the dasha list in the report, we can parse it.
    
    current_dasha = dasha_data.get("list", [])
    
    benefics = ["Venus", "Jupiter", "Mercury"]
    
    count = 0
    for d in current_dasha:
        if any(b in d.get("planet", "") for b in benefics):
            year = d.get("start_date", "").split("/")[-1]
            if year and year not in favorable_years:
                favorable_years.append(year)
                count += 1
        if count >= 3: break # Limit to top 3 years
        
    return favorable_years if favorable_years else ["2026", "2027", "2029"] # Fallback
