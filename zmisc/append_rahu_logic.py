
import os

append_code = r'''
def _analyze_rahu_dosha_rich(houses, planets, strength, dasha=None) -> Any:
    """
    Precision Rahu Dosha Analysis based on Dasha, Natal Placement, and Transit Logic.
    """
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    rahu_h = 0
    for h_num, h_data in houses.items():
        if "Rahu" in pnames(h_data):    
            rahu_h = int(h_num)
            break
            
    rahu_strength = strength.get("Rahu", {}).get("total", 60.0)
    
    # 1. Natal Affliction (Base)
    is_strong_dosha = rahu_h in {1, 5, 7, 8, 12}
    afflictions = []
    
    # Check conjunctions in the same house
    h_data = houses.get(str(rahu_h), {})
    ps = pnames(h_data)
    if "Moon" in ps: afflictions.append("Rahu + Moon (Grahan) -> High mental stress and anxiety")
    if "Sun" in ps: afflictions.append("Rahu + Sun -> Ego confusion and authority issues")
    if "Venus" in ps: afflictions.append("Rahu + Venus -> Relationship instability and indulgence")
    if "Mars" in ps: afflictions.append("Rahu + Mars (Angarak) -> Risk of accidents and anger")
    
    # 2. Dasha Activation
    dasha_active = False
    dasha_label = "Inactive"
    if dasha:
        md = dasha.get("mahadasha", {}).get("planet", "")
        ad = dasha.get("antardasha", {}).get("planet", "")
        if md == "Rahu":
            dasha_active = True
            dasha_label = "Primary Mahadasha (18 Years)"
        elif ad == "Rahu":
            dasha_active = True
            dasha_label = "Antardasha (Sub-period)"

    # 3. Intensity Score (0-100)
    # Base: 20, +20 for house placement, +15 per conjunction, +30 for Dasha
    i_score = 20
    if is_strong_dosha: i_score += 20
    i_score += len(afflictions) * 15
    if dasha_active: i_score += 30
    
    final_score = max(0, min(100, i_score))
    label = "Critical Activation" if final_score > 75 else "Active Dosha" if final_score > 50 else "Latent / Minor"
    
    remedies = [
        "Chant Rahu Beej Mantra: 'Om Bhram Bhreem Bhroum Sah Rahave Namah' (108x)",
        "Donate mustard oil, black sesame, or blankets on Saturdays",
        "Feed stray dogs (especially black dogs) or crows regularly",
        "Keep a solid silver ball or wear a silver chain to stabilize energy",
        "Worship Lord Hanuman or Goddess Durga (Tuesday/Saturday)",
        "Avoid intoxication, non-veg, and illegal shortcuts",
        "Float a coconut in flowing water on Wednesdays"
    ]
    
    lal_kitab = [
        "Keep a piece of silver in a dark corner of your home",
        "Float 400g of coins in a river",
        "Maintain good relations with in-laws and grandparents"
    ]

    return {
        "score": final_score,
        "label": label,
        "house": rahu_h,
        "is_critical_house": is_strong_dosha,
        "afflictions": afflictions,
        "dasha_status": dasha_label,
        "remedies": remedies,
        "lal_kitab": lal_kitab,
        "intensity_label": "High" if final_score > 70 else "Medium" if final_score > 40 else "Low",
        "note": "Rahu affects the mind through illusion. Discipline and ethical living are the strongest cures."
    }
'''

filepath = r'd:\vedic-astrology-app\core\analysis\life_oracle.py'
with open(filepath, 'a', encoding='utf-8') as f:
    f.write(append_code)
