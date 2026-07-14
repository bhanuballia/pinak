
import os

append_code = r'''
def _analyze_kalsarp_dosha_rich(houses, planets, strength, dasha=None) -> Any:
    """
    Expert Kalsarp Dosha Analysis: Identification of all 12 types, 
    Intensity scoring, and specialized remedial guidance.
    """
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    rahu_h = 0
    for h_num, h_data in houses.items():
        if "Rahu" in pnames(h_data):
            rahu_h = int(h_num)
            break
            
    # 1. Identify Type of Kalsarp (Based on Rahu House)
    TYPES = {
        1: "Anant (Lagna to 7th) - Affects Personality & Health",
        2: "Kulik (2nd to 8th) - Affects Wealth & Speech",
        3: "Vasuki (3rd to 9th) - Affects Siblings & Courage",
        4: "Shankhpal (4th to 10th) - Affects Mother & Assets",
        5: "Padma (5th to 11th) - Affects Children & Intellect",
        6: "Mahapadma (6th to 12th) - Affects Health & Debt",
        7: "Takshak (7th to 1st) - Affects Marriage & Partnership",
        8: "Karkotak (8th to 2nd) - Affects Longevity & Inherited Wealth",
        9: "Shankhachur (9th to 3rd) - Affects Luck & Father",
        10: "Ghatak (10th to 4th) - Affects Career & Status",
        11: "Vishdhar (11th to 5th) - Affects Gains & Social Circle",
        12: "Sheshnag (12th to 6th) - Affects Losses & Foreign Travel"
    }
    
    k_type = TYPES.get(rahu_h, "General Kalsarp Alignment")
    
    # 2. Check for "Ardh" (Partial) Kalsarp
    # In a full Kalsarp, all 7 planets (Sun-Sat) must be between Rahu and Ketu axis.
    # For now, we use the 'present' flag from the basic analyzer, 
    # but we'll add logic to describe the intensity.
    
    dasha_active = False
    if dasha:
        md = dasha.get("mahadasha", {}).get("planet", "")
        if md in {"Rahu", "Ketu"}: dasha_active = True
        
    # Intensity Score (0-100)
    # Base: 40, +30 for Rahu/Ketu Dasha, +30 for critical house placement (1, 4, 7, 8, 10, 12)
    i_score = 40
    if dasha_active: i_score += 30
    if rahu_h in {1, 4, 7, 8, 10, 12}: i_score += 30
    
    final_score = max(0, min(100, i_score))
    
    remedies = [
        "Perform 'Kalsarp Dosh Nivaran Puja' at Trimbakeshwar or Nashik",
        "Chant 'Maha Mrityunjaya Mantra' 108 times daily",
        "Offer silver snakes (Nag-Nagin Joda) to a Shiva Lingam",
        "Float a lead (Sikka) or coconut in flowing water on Saturdays",
        "Feed birds and stray animals regularly to appease Rahu/Ketu",
        "Worship Lord Shiva daily with milk and water (Abhishek)",
        "Wear a copper ring or a 'Sarpa' ring after consultation"
    ]

    return {
        "score": final_score,
        "type": k_type,
        "label": "Full Kalsarp" if final_score > 70 else "Active Kalsarp" if final_score > 40 else "Minor Alignment",
        "house": rahu_h,
        "dasha_activation": "High (Kalsarp Activated)" if dasha_active else "Standard",
        "remedies": remedies,
        "note": "Kalsarp Dosha creates sudden ups and downs. Perseverance and spiritual discipline lead to eventual victory."
    }
'''

filepath = r'd:\vedic-astrology-app\core\analysis\life_oracle.py'
with open(filepath, 'a', encoding='utf-8') as f:
    f.write(append_code)
