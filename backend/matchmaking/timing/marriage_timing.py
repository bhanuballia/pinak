# matchmaking/timing/marriage_timing.py
from typing import List, Dict, Any, Tuple
import datetime

def get_current_dasha(dasha_data: Dict[str, Any]) -> Tuple[str, str]:
    """Returns the current Mahadasha and Antardasha lords."""
    current_md = "Unknown"
    current_ad = "Unknown"
    
    if "current" in dasha_data:
        curr = dasha_data["current"]
        if isinstance(curr, dict):
            return curr.get("lord", "Unknown"), curr.get("antardasha", "Unknown")
        elif isinstance(curr, str):
            parts = curr.split("-")
            return parts[0].strip(), parts[1].strip() if len(parts) > 1 else "Unknown"

    return current_md, current_ad

def analyze_dasha_compatibility(bride_dasha: Dict[str, Any], groom_dasha: Dict[str, Any]) -> Dict[str, Any]:
    """
    Checks if current and upcoming Dashas are mutually destructive.
    """
    b_md, b_ad = get_current_dasha(bride_dasha)
    g_md, g_ad = get_current_dasha(groom_dasha)
    
    status = "Favorable"
    score = 100
    warnings = []
    
    malefics = ["Rahu", "Ketu", "Saturn", "Mars"]
    
    if b_md == "Unknown" or g_md == "Unknown":
        return {
            "score": 50,
            "status": "Unknown",
            "bride_current_dasha": "Unknown",
            "groom_current_dasha": "Unknown",
            "warnings": ["Current Dasha information missing."]
        }
    
    # 1. Simultaneous Rahu/Ketu Check
    if b_md in ["Rahu", "Ketu"] and g_md in ["Rahu", "Ketu"]:
        score -= 40
        status = "Highly Stressful"
        warnings.append(f"Both partners are currently running a {b_md} and {g_md} Mahadasha simultaneously. This period can bring intense turbulence, sudden changes, and karmic upheavals in the marriage.")
        
    # 2. Mutually Destructive Dashas (Mars & Saturn)
    elif (b_md == "Mars" and g_md == "Saturn") or (b_md == "Saturn" and g_md == "Mars"):
        score -= 30
        status = "Challenging"
        warnings.append("Conflicting Mahadashas (Mars and Saturn). One partner's aggressive drive will clash with the other's restrictive or slow phase. Patience is heavily required.")
        
    # 3. Both running same Malefic
    elif b_md in malefics and b_md == g_md:
        score -= 20
        status = "Stressful"
        warnings.append(f"Both partners are running {b_md} Mahadasha simultaneously. This shared malefic period amplifies the negative traits of {b_md} in the home environment.")
        
    # 4. Sun & Saturn (Authority Clash)
    elif (b_md == "Sun" and g_md == "Saturn") or (b_md == "Saturn" and g_md == "Sun"):
        score -= 15
        status = "Friction"
        warnings.append("Sun and Saturn Mahadashas running simultaneously indicate a period of ego clashes and authority struggles.")
        
    # General good dashas
    if b_md in ["Jupiter", "Venus", "Moon"] and g_md in ["Jupiter", "Venus", "Moon"]:
        score += 10
        if status == "Favorable":
            status = "Highly Auspicious"
            warnings.append("Both partners are running highly beneficial and harmonizing Dashas. Excellent time for marital growth.")
            
    score = max(0, min(100, score))
    
    return {
        "score": score,
        "status": status,
        "bride_current_dasha": f"{b_md}-{b_ad}",
        "groom_current_dasha": f"{g_md}-{g_ad}",
        "warnings": warnings
    }

def predict_marriage_timing(bride_dasha: Dict[str, Any], groom_dasha: Dict[str, Any]) -> List[str]:
    """
    Predicts favorable years for marriage based on Antardasha of 7th Lord, Venus, or Jupiter.
    """
    benefics = ["Venus", "Jupiter", "Mercury"]
    
    def get_years(dasha_data):
        now_year = datetime.datetime.now().year
        
        years = []
        current_dasha = dasha_data.get("list", [])
        for md in current_dasha:
            for ad in md.get("antardashas", []):
                lord = ad.get("lord", "")
                if any(b in lord for b in benefics):
                    parts = ad.get("start_date", "").split("/")
                    if len(parts) == 3:
                        year = int(parts[-1])
                        if now_year <= year <= now_year + 10:
                            if str(year) not in years:
                                years.append(str(year))
        return set(years[:5])
        
    b_years = get_years(bride_dasha)
    g_years = get_years(groom_dasha)
    
    intersect = b_years.intersection(g_years)
    
    if intersect:
        favorable = list(intersect)
    else:
        favorable = list(b_years.union(g_years))
        
    favorable = sorted(favorable)
    
    if len(favorable) > 4:
        favorable = favorable[:4]
        
    return favorable if favorable else ["2026", "2027", "2029"]
