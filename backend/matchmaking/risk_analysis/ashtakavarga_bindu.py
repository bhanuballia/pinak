# matchmaking/risk_analysis/ashtakavarga_bindu.py
from typing import Dict, Any

def get_lagna_sign_index(chart: Dict[str, Any]) -> int:
    return chart.get("ascendant_sign_index", 0)

def analyze_ashtakavarga_compatibility(bride_data: Dict[str, Any], groom_data: Dict[str, Any]) -> Dict[str, Any]:
    b_asht = bride_data.get("ashtakavarga", {})
    g_asht = groom_data.get("ashtakavarga", {})
    
    # Check if there was an exception captured in report_data.py
    if "error" in b_asht or "error" in g_asht:
        b_err = b_asht.get("error", "")
        g_err = g_asht.get("error", "")
        return {
            "score": 50,
            "status": "Error",
            "description": f"Backend Error:\nBride: {b_err}\n\nGroom: {g_err}",
            "bride": {},
            "groom": {}
        }
        
    b_sarva = b_asht.get("sarvashtakavarga", [])
    g_sarva = g_asht.get("sarvashtakavarga", [])
    
    b_lagna_idx = get_lagna_sign_index(bride_data.get("chart", {}))
    g_lagna_idx = get_lagna_sign_index(groom_data.get("chart", {}))
    
    if not b_sarva or not g_sarva or len(b_sarva) < 12 or len(g_sarva) < 12:
        return {
            "score": 50,
            "status": "Unknown",
            "description": "Ashtakavarga data missing.",
            "bride": {},
            "groom": {}
        }
    
    res = {
        "score": 50,
        "status": "Unknown",
        "description": "Ashtakavarga data missing.",
        "bride": {},
        "groom": {}
    }
        
    # Calculate indices
    b_7th_idx = (b_lagna_idx + 6) % 12
    b_11th_idx = (b_lagna_idx + 10) % 12
    
    g_7th_idx = (g_lagna_idx + 6) % 12
    g_11th_idx = (g_lagna_idx + 10) % 12
    
    # Get Bindus
    b_7th_bindus = b_sarva[b_7th_idx]
    b_11th_bindus = b_sarva[b_11th_idx]
    
    g_7th_bindus = g_sarva[g_7th_idx]
    g_11th_bindus = g_sarva[g_11th_idx]
    
    # Calculate Score
    score = 0
    desc = []
    
    # Evaluate 7th House (Marriage)
    if b_7th_bindus >= 30 and g_7th_bindus >= 30:
        score += 70
        desc.append(f"Both partners have extraordinarily high Bindus in the 7th House (Bride: {b_7th_bindus}, Groom: {g_7th_bindus}). The marriage is mathematically destined to be supportive, resilient, and enduring, capable of overcoming any Guna Milan deficiencies.")
    elif b_7th_bindus >= 28 and g_7th_bindus >= 28:
        score += 50
        desc.append(f"Both partners have strong 7th Houses (Bride: {b_7th_bindus}, Groom: {g_7th_bindus}). The foundation of the marriage is solid.")
    elif b_7th_bindus < 25 or g_7th_bindus < 25:
        score += 20
        desc.append(f"One or both partners have low 7th House Bindus (Bride: {b_7th_bindus}, Groom: {g_7th_bindus}). The marriage will require intense effort, patience, and mutual adjustment.")
    else:
        score += 35
        desc.append(f"Average 7th House Bindus (Bride: {b_7th_bindus}, Groom: {g_7th_bindus}). Standard relationship effort is required.")
        
    # Evaluate 11th House (Fulfillment / Wealth in Marriage)
    if b_11th_bindus >= 30 and g_11th_bindus >= 30:
        score += 30
        desc.append(f"Excellent 11th House Bindus (Bride: {b_11th_bindus}, Groom: {g_11th_bindus}) ensure mutual wealth, fulfillment of desires, and a large social circle post-marriage.")
    elif b_11th_bindus > b_7th_bindus and g_11th_bindus > g_7th_bindus:
        score += 20
        desc.append("The 11th House is stronger than the 7th House for both, indicating that desires and mutual gains from the partnership will be successfully fulfilled.")
    elif b_11th_bindus < 25 or g_11th_bindus < 25:
        score += 5
        desc.append("Low 11th House Bindus indicate that high expectations and financial desires may face delays or frustrations.")
    else:
        score += 15
        desc.append("Moderate 11th House Bindus indicating average fulfillment of material desires.")
        
    score = max(0, min(100, score))
    
    status = "Moderate"
    if score >= 80:
        status = "Highly Destined & Prosperous"
    elif score >= 60:
        status = "Supportive"
    elif score < 40:
        status = "Effort Intensive"
        
    return {
        "score": score,
        "status": status,
        "description": " ".join(desc),
        "bride": {
            "7th_house_bindus": b_7th_bindus,
            "11th_house_bindus": b_11th_bindus
        },
        "groom": {
            "7th_house_bindus": g_7th_bindus,
            "11th_house_bindus": g_11th_bindus
        }
    }
