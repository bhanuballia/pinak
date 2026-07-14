
import os

append_code = r'''
def _analyze_marriage(houses, planets, strength, d9_chart=None, dasha=None) -> Any:
    """
    Expert Marriage & Relationship Analysis: Uses 7th house, Venus/Jupiter, 
    Navamsha (D9), and Dasha timing.
    """
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    h7 = houses.get("7", {})
    h2 = houses.get("2", {})
    h11 = houses.get("11", {})
    
    venus_strength = strength.get("Venus", {}).get("total", 60.0)
    jupiter_strength = strength.get("Jupiter", {}).get("total", 60.0)
    
    # 1. Marital Harmony Score (Base 60)
    score = 60
    
    # Positive: Benefics in 7th or 2nd
    benefics = {"Jupiter", "Venus", "Moon", "Mercury"}
    h7_ps = set(pnames(h7))
    h2_ps = set(pnames(h2))
    
    if h7_ps & benefics: score += 10
    if h2_ps & benefics: score += 5
    
    # Negative: Malefics in 7th (Mars, Rahu, Saturn, Sun)
    malefics = {"Mars", "Rahu", "Saturn", "Sun"}
    if h7_ps & malefics: score -= 15
    
    # 2. Karaka Strength
    if venus_strength > 100: score += 10
    if jupiter_strength > 100: score += 10
    
    # 3. Dasha Context
    dasha_boost = False
    if dasha:
        md = dasha.get("mahadasha", {}).get("planet", "")
        if md in {"Venus", "Jupiter"}: dasha_boost = True
    
    final_score = max(0, min(100, score))
    
    return {
        "score": final_score,
        "label": "Deep Harmony" if final_score > 75 else "Stable Bond" if final_score > 50 else "Testing Phase",
        "harmony_index": f"{final_score}%",
        "karaka_status": f"Venus ({venus_strength:.1f}), Jupiter ({jupiter_strength:.1f})",
        "dasha_influence": "High (Positive Activation)" if dasha_boost else "Neutral",
        "remedies": [
            "Worship Goddess Parvati or Lord Shiva (for marital peace)",
            "Donate white items (Sweets, Milk, Cloth) on Fridays",
            "Wear a diamond or opal (only after consultation)",
            "Perform 'Gauri Shankar' Puja for harmony",
            "Chant Venus Beej Mantra: 'Om Shum Shukraya Namah'"
        ],
        "note": "Marriage is a union of energies. Understanding and patience are the ultimate remediations."
    }

def _analyze_business(houses, planets, strength, dasha=None) -> Any:
    """
    Expert Business & Trade Analysis: Compares 6th (Service) vs 7th (Business),
    uses Mercury (Trade) and 10th/11th houses.
    """
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    h7 = houses.get("7", {}) # Business
    h6 = houses.get("6", {}) # Service
    h10 = houses.get("10", {}) # Career
    h11 = houses.get("11", {}) # Gains
    
    mercury_strength = strength.get("Mercury", {}).get("total", 60.0)
    
    # 1. Entrepreneurial Score (Base 55)
    score = 55
    
    # Comparison: If 7th is stronger than 6th (Simplified)
    h7_count = len(pnames(h7))
    h6_count = len(pnames(h6))
    
    if h7_count > h6_count: score += 15
    if mercury_strength > 100: score += 15
    
    # Gains potential
    if pnames(h11): score += 10
    
    final_score = max(0, min(100, score))
    
    return {
        "score": final_score,
        "label": "Master Trader" if final_score > 75 else "Growth Phase" if final_score > 50 else "Service Preferred",
        "business_acumen": f"{final_score}%",
        "mercury_power": f"{mercury_strength:.1f}/150",
        "market_favor": "High" if final_score > 70 else "Medium",
        "remedies": [
            "Worship Lord Ganesha for removal of obstacles in trade",
            "Keep a green handkerchief or emerald (after consultation)",
            "Feed green fodder to cows on Wednesdays",
            "Chant Mercury Mantra: 'Om Bum Budhaya Namah'",
            "Maintain transparency in all financial dealings"
        ],
        "note": "Success in business comes from a blend of Mercury's intellect and Mars's courage."
    }
'''

filepath = r'd:\vedic-astrology-app\core\analysis\life_oracle.py'
with open(filepath, 'a', encoding='utf-8') as f:
    f.write(append_code)
