# matchmaking/guna_milan/guna_score.py
"""
Ashta Koota (36 Guna Milan) Core Engine.
Calculates the total compatibility score by integrating all 8 Koota modules.
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

    scores = {
        "Varna": calculate_varna(b_attr.get("varna", ""), g_attr.get("varna", "")),
        "Vashya": calculate_vashya(b_attr.get("vashya", ""), g_attr.get("vashya", "")),
        "Tara": calculate_tara(b_nak_idx, g_nak_idx),
        "Yoni": calculate_yoni(b_attr.get("yoni", ""), g_attr.get("yoni", "")),
        "Graha Maitri": calculate_graha_maitri(b_sign_attr.get("lord", ""), g_sign_attr.get("lord", "")),
        "Gana": calculate_gana(b_attr.get("gana", ""), g_attr.get("gana", "")),
        "Bhakoot": calculate_bhakoot(bride_info.get("sign_index", 0), groom_info.get("sign_index", 0)),
        "Nadi": calculate_nadi(b_attr.get("nadi", ""), g_attr.get("nadi", ""))
    }

    # Map attributes for the professional table - Corrected lookup keys
    details = {
        "Varna": {"boy": g_attr.get("varna", "N/A"), "girl": b_attr.get("varna", "N/A"), "area": "Work"},
        "Vashya": {"boy": g_attr.get("vashya", "N/A"), "girl": b_attr.get("vashya", "N/A"), "area": "Dominance"},
        "Tara": {"boy": g_tara, "girl": b_tara, "area": "Destiny"},
        "Yoni": {"boy": g_attr.get("yoni", "N/A"), "girl": b_attr.get("yoni", "N/A"), "area": "Mentality"},
        "Graha Maitri": {"boy": g_sign_attr.get("lord", "N/A"), "girl": b_sign_attr.get("lord", "N/A"), "area": "Compatibility"},
        "Gana": {"boy": g_attr.get("gana", "N/A"), "girl": b_attr.get("gana", "N/A"), "area": "Guna Level"},
        "Bhakoot": {"boy": g_sign, "girl": b_sign, "area": "Love"},
        "Nadi": {"boy": g_attr.get("nadi", "N/A"), "girl": b_attr.get("nadi", "N/A"), "area": "Health"}
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
        "details": details
    }
