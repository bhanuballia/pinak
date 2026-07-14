# matchmaking/guna_milan/guna_score.py
"""
Ashta Koota (36 Guna Milan) Core Engine.
Calculates the total compatibility score by integrating all 8 Koota modules.
Includes Dosha Cancellations for Nadi and Bhakoot.
"""

from typing import Dict, Any
from matchmaking.guna_milan.nakshatra_data import NAKSHATRA_ATTRIBUTES, SIGN_ATTRIBUTES
from matchmaking.guna_milan.varna import calculate_varna
from matchmaking.guna_milan.vashya import calculate_vashya
from matchmaking.guna_milan.tara import calculate_tara
from matchmaking.guna_milan.yoni import calculate_yoni
from matchmaking.guna_milan.graha_maitri import calculate_graha_maitri
from matchmaking.guna_milan.gana import calculate_gana
from matchmaking.guna_milan.bhakoot import calculate_bhakoot
from matchmaking.guna_milan.nadi import calculate_nadi

def calculate_ashta_koota(bride_info: Dict[str, Any], groom_info: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes the 36 Guna Milan score and partner attributes for each Koota.
    """
    # Normalize names for robust lookup
    b_nak = str(bride_info.get("nakshatra_name") or "").strip().title()
    g_nak = str(groom_info.get("nakshatra_name") or "").strip().title()
    b_sign = str(bride_info.get("sign_name") or "").strip().title()
    g_sign = str(groom_info.get("sign_name") or "").strip().title()
    
    b_attr = NAKSHATRA_ATTRIBUTES.get(b_nak, {})
    g_attr = NAKSHATRA_ATTRIBUTES.get(g_nak, {})
    b_sign_attr = SIGN_ATTRIBUTES.get(b_sign, {})
    g_sign_attr = SIGN_ATTRIBUTES.get(g_sign, {})

    # Tara Category Helper
    tara_names = ["Janma", "Sampat", "Vipat", "Kshem", "Pratyari", "Sadhak", "Vadh", "Mitra", "Ati-Mitra"]
    b_nak_idx = bride_info.get("nakshatra_index", 0)
    g_nak_idx = groom_info.get("nakshatra_index", 0)
    
    # Tara for groom from bride
    g_from_b = (g_nak_idx - b_nak_idx) % 9
    if g_from_b == 0: g_from_b = 9
    g_tara = tara_names[g_from_b - 1]
    
    # Tara for bride from groom
    b_from_g = (b_nak_idx - g_nak_idx) % 9
    if b_from_g == 0: b_from_g = 9
    b_tara = tara_names[b_from_g - 1]

    # Calculate Base Scores
    varna_score = calculate_varna(b_attr.get("varna", ""), g_attr.get("varna", ""))
    vashya_score = calculate_vashya(b_attr.get("vashya", ""), g_attr.get("vashya", ""))
    tara_score = calculate_tara(b_nak_idx, g_nak_idx)
    yoni_score = calculate_yoni(b_attr.get("yoni", ""), g_attr.get("yoni", ""))
    graha_maitri_score = calculate_graha_maitri(b_sign_attr.get("lord", ""), g_sign_attr.get("lord", ""))
    gana_score = calculate_gana(b_attr.get("gana", ""), g_attr.get("gana", ""))
    
    bhakoot_score = calculate_bhakoot(bride_info.get("sign_index", 0), groom_info.get("sign_index", 0))
    nadi_score = calculate_nadi(b_attr.get("nadi", ""), g_attr.get("nadi", ""))
    
    # ---------------------------
    # BHAKOOT DOSHA CANCELLATION
    # ---------------------------
    bhakoot_cancelled = False
    b_lord = b_sign_attr.get("lord", "")
    g_lord = g_sign_attr.get("lord", "")
    friends = {
        "Sun": ["Moon", "Mars", "Jupiter"],
        "Moon": ["Sun", "Mercury"],
        "Mars": ["Sun", "Moon", "Jupiter"],
        "Mercury": ["Sun", "Venus"],
        "Jupiter": ["Sun", "Moon", "Mars"],
        "Venus": ["Mercury", "Saturn"],
        "Saturn": ["Mercury", "Venus"]
    }
    
    if bhakoot_score == 0:
        if b_lord == g_lord and b_lord != "":
            bhakoot_score = 7
            bhakoot_cancelled = True
        elif b_lord in friends and g_lord in friends.get(b_lord, []) and g_lord in friends and b_lord in friends.get(g_lord, []):
            bhakoot_score = 7
            bhakoot_cancelled = True

    # ---------------------------
    # NADI DOSHA CANCELLATION
    # ---------------------------
    nadi_cancelled = False
    b_pada = bride_info.get("pada", 1)
    g_pada = groom_info.get("pada", 2) # Default to 2 so they don't accidentally match if missing
    
    if nadi_score == 0:
        if b_sign == g_sign and b_nak != g_nak:
            nadi_score = 8
            nadi_cancelled = True
        elif b_nak == g_nak and b_pada != g_pada:
            nadi_score = 8
            nadi_cancelled = True

    scores = {
        "Varna": varna_score,
        "Vashya": vashya_score,
        "Tara": tara_score,
        "Yoni": yoni_score,
        "Graha Maitri": graha_maitri_score,
        "Gana": gana_score,
        "Bhakoot": bhakoot_score,
        "Nadi": nadi_score
    }

    # Details mapping
    bhakoot_str = g_sign
    if bhakoot_cancelled:
        bhakoot_str += " (Dosha Cancelled)"
        
    nadi_str = g_attr.get("nadi", "N/A")
    if nadi_cancelled:
        nadi_str += " (Dosha Cancelled)"

    details = {
        "Varna": {"boy": g_attr.get("varna", "N/A"), "girl": b_attr.get("varna", "N/A"), "area": "Work"},
        "Vashya": {"boy": g_attr.get("vashya", "N/A"), "girl": b_attr.get("vashya", "N/A"), "area": "Dominance"},
        "Tara": {"boy": g_tara, "girl": b_tara, "area": "Destiny"},
        "Yoni": {"boy": g_attr.get("yoni", "N/A"), "girl": b_attr.get("yoni", "N/A"), "area": "Mentality"},
        "Graha Maitri": {"boy": g_sign_attr.get("lord", "N/A"), "girl": b_sign_attr.get("lord", "N/A"), "area": "Compatibility"},
        "Gana": {"boy": g_attr.get("gana", "N/A"), "girl": b_attr.get("gana", "N/A"), "area": "Guna Level"},
        "Bhakoot": {"boy": bhakoot_str, "girl": b_sign, "area": "Love"},
        "Nadi": {"boy": nadi_str, "girl": b_attr.get("nadi", "N/A"), "area": "Health"}
    }
    
    total = sum(scores.values())
    
    # Professional Scale Calibration
    interpretation = "NOT COMPATIBLE MATCH"
    if total >= 33: interpretation = "EXCELLENT MATCH"
    elif total >= 25: interpretation = "VERY GOOD MATCH"
    elif total >= 18: interpretation = "ACCEPTABLE; BUT NEED TO CONSIDER OTHER FACTORS MINUTELY"
    
    return {
        "total_score": total,
        "interpretation": interpretation,
        "scores": scores,
        "details": details,
        "nadi_cancelled": nadi_cancelled,
        "bhakoot_cancelled": bhakoot_cancelled
    }
