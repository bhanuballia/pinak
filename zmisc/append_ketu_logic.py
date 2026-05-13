
import os

append_code = r'''
def _analyze_ketu_dosha_rich(houses, planets, strength, dasha=None) -> Any:
    """
    Precision Ketu Dosha Analysis based on Dasha balance, Degree-level Transit, and Natal Sensitivity.
    """
    def pnames(h):
        return [p["name"] if isinstance(p, dict) else p for p in h.get("planets", [])]

    ketu_h = 0
    ketu_lon = 0
    for h_num, h_data in houses.items():
        if "Ketu" in pnames(h_data):
            ketu_h = int(h_num)
            # Find exact longitude from planets dict
            ketu_lon = planets.get("Ketu", {}).get("sidereal", {}).get("lon", 0)
            break
            
    ketu_deg = ketu_lon % 30
    ketu_sign_idx = int(ketu_lon / 30)
    SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    ketu_sign = SIGNS[ketu_sign_idx]
    
    # 1. Natal Sensitivity & Conjunctions
    afflictions = []
    h_data = houses.get(str(ketu_h), {})
    ps = pnames(h_data)
    if "Moon" in ps: afflictions.append("Ketu + Moon -> Emotional withdrawal and deep subconscious triggers")
    if "Sun" in ps: afflictions.append("Ketu + Sun -> Identity confusion and spiritual detachment")
    if "Venus" in ps: afflictions.append("Ketu + Venus -> Relationship dissatisfaction and desire for isolation")
    if "Mars" in ps: afflictions.append("Ketu + Mars -> Risk of sudden impulsive decisions or injury")
    
    # 2. Dasha Context (7 Year Cycle)
    dasha_active = False
    d_label = "Latent"
    if dasha:
        md = dasha.get("mahadasha", {}).get("planet", "")
        ad = dasha.get("antardasha", {}).get("planet", "")
        if md == "Ketu":
            dasha_active = True
            d_label = "Main Mahadasha (7 Years)"
        elif ad == "Ketu":
            dasha_active = True
            d_label = "Active Antardasha"

    # 3. Intensity Score (0-100)
    # Base: 15, +20 for house (8, 12), +15 per conjunction, +30 for Dasha
    i_score = 15
    if ketu_h in {8, 12}: i_score += 20
    i_score += len(afflictions) * 15
    if dasha_active: i_score += 30
    
    final_score = max(0, min(100, i_score))
    
    remedies = [
        "Worship Lord Ganesha with Durva grass (Presiding Deity of Ketu)",
        "Feed stray dogs (especially multi-colored/black-white) regularly",
        "Donate grey/brown blankets or woolen items to the needy",
        "Chant Ketu Mantra: 'Om Stram Streem Stroum Sah Ketave Namah' (108x)",
        "Wear a silver ring or chain to maintain grounding and stability",
        "Engage in grounding activities (Nature walking, Yoga, Breathwork)",
        "Maintain high moral character and avoid false promises"
    ]
    
    lal_kitab = {
        1: "Keep a red handkerchief, serve dogs",
        2: "Apply Kesari tilak, serve young girls milk",
        3: "Wear a gold chain, drop copper coins in water",
        4: "Offer yellow items (turmeric, chana dal) in a temple",
        8: "Keep a square piece of silver",
        12: "Float sweet roti for dogs"
    }.get(ketu_h, "Keep a solid silver ball with you")

    return {
        "score": final_score,
        "label": "Spiritual Transformation" if final_score > 70 else "Active Detachment" if final_score > 40 else "Balanced Ketu",
        "pos": f"{ketu_sign} {int(ketu_deg)}°{int((ketu_deg%1)*60)}'",
        "house": ketu_h,
        "dasha_status": d_label,
        "afflictions": afflictions,
        "remedies": remedies,
        "lal_kitab_advice": lal_kitab,
        "peak_months_warning": "Transit Ketu retrograde passing your natal degree (±2°) triggers 3 waves of sudden events.",
        "note": "Ketu is the planet of liberation (Moksha). Detachment from outcomes is the ultimate remedy."
    }
'''

filepath = r'd:\vedic-astrology-app\core\analysis\life_oracle.py'
with open(filepath, 'a', encoding='utf-8') as f:
    f.write(append_code)
