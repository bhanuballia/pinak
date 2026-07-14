# matchmaking/marriage_engine.py
"""
Master Marriage Compatibility Engine ULTRA PRO.
Orchestrates Guna Milan, Manglik, Navamsa, Risk Analysis, Timing, and AI Summaries.
"""
from core.utils import ZODIAC_SIGNS

from typing import Dict, Any, List
import traceback


# Core Engines
from matchmaking.guna_milan.guna_score import calculate_ashta_koota
from matchmaking.manglik.manglik_detection import check_manglik_dosha, analyze_manglik_compatibility
from matchmaking.navamsa.d9_compatibility import analyze_d9_compatibility

# Advanced Ultra Pro Modules
from matchmaking.risk_analysis.divorce_risk import calculate_divorce_risk
from matchmaking.risk_analysis.afflictions import analyze_planetary_afflictions
from matchmaking.timing.marriage_timing import predict_marriage_timing
from matchmaking.remedies.remedy_engine import get_marriage_remedies
from matchmaking.ai.narrative_engine import generate_relationship_summary
from matchmaking.bride_analysis import analyze_bride_chart
from matchmaking.groom_analysis import analyze_groom_chart

def run_marriage_matching(bride_data: Dict[str, Any], groom_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes ULTRA PRO compatibility between Bride and Groom.
    """
    try:
        # 1. Metadata Extraction
        b_meta = bride_data.get("meta", {})
        g_meta = groom_data.get("meta", {})
        b_panchang = bride_data.get("panchang", {})
        g_panchang = groom_data.get("panchang", {})
        # 2. Guna Milan (Ashta Koota)
        b_moon_sign = b_meta.get("moon_sign", "Aries")
        g_moon_sign = g_meta.get("moon_sign", "Aries")

        b_nak_info = {
            "nakshatra_name": b_panchang.get("nakshatra", {}).get("nakshatra_name") or b_meta.get("nakshatra"),
            "nakshatra_index": b_panchang.get("nakshatra", {}).get("nakshatra_index", 0),
            "pada": b_panchang.get("nakshatra", {}).get("pada", 1),
            "sign_name": b_moon_sign,
            "sign_index": ZODIAC_SIGNS.index(b_moon_sign) if b_moon_sign in ZODIAC_SIGNS else 0
        }
        g_nak_info = {
            "nakshatra_name": g_panchang.get("nakshatra", {}).get("nakshatra_name") or g_meta.get("nakshatra"),
            "nakshatra_index": g_panchang.get("nakshatra", {}).get("nakshatra_index", 0),
            "pada": g_panchang.get("nakshatra", {}).get("pada", 2),
            "sign_name": g_moon_sign,
            "sign_index": ZODIAC_SIGNS.index(g_moon_sign) if g_moon_sign in ZODIAC_SIGNS else 0
        }
        guna_report = calculate_ashta_koota(b_nak_info, g_nak_info)
        
        # 3. Manglik & Navamsa
        b_manglik = check_manglik_dosha(bride_data.get("chart", {}))
        g_manglik = check_manglik_dosha(groom_data.get("chart", {}))
        manglik_report = analyze_manglik_compatibility(b_manglik, g_manglik)
        d9_report = analyze_d9_compatibility(bride_data.get("vargas", {}), groom_data.get("vargas", {}))
        
        # 4. Success Probability Calculation (Weights: Guna 50, Manglik 25, D9 25)
        guna_perc = (guna_report.get("total_score", 0) / 36.0) * 100
        manglik_perc = 100 if manglik_report.get("cancelled") else 40
        d9_perc = d9_report.get("d9_stability_score", 50)
        success_probability = (guna_perc * 0.5) + (manglik_perc * 0.25) + (d9_perc * 0.25)
        
        # 5. Risk Analysis
        divorce_data = calculate_divorce_risk(bride_data.get("chart", {}), groom_data.get("chart", {}), success_probability)
        afflictions_data = analyze_planetary_afflictions(bride_data.get("chart", {}), groom_data.get("chart", {}))
        
        # 5.5 Bhava Milan, Karaka, Upapada Lagna, Darakaraka, Progeny, Ashtakavarga, Synastry, Dharma, D-30
        from matchmaking.risk_analysis.seventh_house import perform_bhava_milan
        bhava_analysis = perform_bhava_milan(
            bride_data.get("chart", {}), bride_data.get("vargas", {}).get("d9", {}),
            groom_data.get("chart", {}), groom_data.get("vargas", {}).get("d9", {})
        )
        
        from matchmaking.risk_analysis.karaka_analysis import analyze_marriage_karakas
        karaka_analysis = analyze_marriage_karakas(bride_data.get("chart", {}), groom_data.get("chart", {}))
        
        from matchmaking.risk_analysis.upapada_lagna import analyze_upapada_lagna
        ul_analysis = analyze_upapada_lagna(bride_data.get("chart", {}), groom_data.get("chart", {}))
        
        from matchmaking.risk_analysis.darakaraka import analyze_darakaraka_compatibility
        dk_analysis = analyze_darakaraka_compatibility(bride_data.get("chart", {}), groom_data.get("chart", {}))
        
        from matchmaking.risk_analysis.progeny_sphuta import analyze_progeny_sphuta
        progeny_analysis = analyze_progeny_sphuta(bride_data.get("chart", {}), groom_data.get("chart", {}))
        
        from matchmaking.risk_analysis.ashtakavarga_bindu import analyze_ashtakavarga_compatibility
        ashtakavarga_analysis = analyze_ashtakavarga_compatibility(bride_data, groom_data)
        
        from matchmaking.risk_analysis.synastry import analyze_synastry
        synastry_analysis = analyze_synastry(bride_data.get("chart", {}), groom_data.get("chart", {}))
        
        from matchmaking.risk_analysis.dharma_romance import analyze_dharma_romance
        dharma_analysis = analyze_dharma_romance(bride_data.get("chart", {}), groom_data.get("chart", {}))
        
        from matchmaking.risk_analysis.karaka_analysis import analyze_marriage_karakas
        karaka_analysis = analyze_marriage_karakas(bride_data, groom_data)
        
        from matchmaking.risk_analysis.upapada_lagna import analyze_upapada_lagna
        ul_analysis = analyze_upapada_lagna(bride_data, groom_data)
        
        from matchmaking.risk_analysis.trishamsha import analyze_d30_trishamsha
        d30_analysis = analyze_d30_trishamsha(bride_data.get("vargas", {}).get("d30", {}), groom_data.get("vargas", {}).get("d30", {}))
        
        from matchmaking.risk_analysis.financial_synastry import analyze_financial_synastry
        financial_analysis = analyze_financial_synastry(bride_data, groom_data)
        
        from matchmaking.risk_analysis.saptamsha_d7 import analyze_saptamsha_d7
        d7_analysis = analyze_saptamsha_d7(bride_data, groom_data)
        
        from matchmaking.matrix_engine import generate_comprehensive_matrix
        comprehensive_matrix = generate_comprehensive_matrix(bride_data, groom_data)
        
        # 6. Timing, Dasha & Remedies
        from matchmaking.timing.marriage_timing import predict_marriage_timing, analyze_dasha_compatibility
        marriage_years = predict_marriage_timing(bride_data.get("dasha", {}), groom_data.get("dasha", {}))
        dasha_analysis = analyze_dasha_compatibility(bride_data.get("dasha", {}), groom_data.get("dasha", {}))
        
        remedies = get_marriage_remedies(guna_report.get("total_score", 0), manglik_report)
        
        # 7. AI Narrative Synthesis
        toxic_warnings = [a["title"] for a in afflictions_data]
        ai_narrative = generate_relationship_summary(success_probability, guna_report.get("total_score", 0), toxic_warnings)
        
        # 8. Enterprise Compatibility Engine Integration
        from matchmaking.core.compatibility_engine import CompatibilityEngine
        enterprise_engine = CompatibilityEngine()
        
        precomputed_reports = {
            "guna_milan": guna_report,
            "manglik": {"analysis": manglik_report},
            "navamsa": d9_report,
            "timing": {"favorable_years": marriage_years, "dasha_compatibility": dasha_analysis}
        }
        
        enterprise_results = enterprise_engine.analyze(bride_data, groom_data, precomputed_reports)

        # Merge the enterprise results with the legacy/existing results
        bride_kundali_analysis = analyze_bride_chart(bride_data)
        groom_kundali_analysis = analyze_groom_chart(groom_data)
        
        return {
            "guna_milan": guna_report,
            "manglik": {
                "bride": b_manglik,
                "groom": g_manglik,
                "analysis": manglik_report
            },
            "navamsa": d9_report,
            "comprehensive_matrix": comprehensive_matrix,
            "risk_analysis": {
                "divorce": divorce_data,
                "afflictions": afflictions_data,
                "bhava_milan": bhava_analysis,
                "karaka_analysis": karaka_analysis,
                "upapada_lagna": ul_analysis,
                "darakaraka": dk_analysis,
                "progeny_sphuta": progeny_analysis,
                "ashtakavarga_bindus": ashtakavarga_analysis,
                "synastry": synastry_analysis,
                "dharma_romance": dharma_analysis,
                "trishamsha_d30": d30_analysis,
                "financial_synastry": financial_analysis,
                "saptamsha_d7": d7_analysis,
                "dasha_stress": dasha_analysis
            },
            "bride_chart": bride_data.get("chart"),
            "bride_d9_chart": bride_data.get("vargas", {}).get("d9"),
            "groom_chart": groom_data.get("chart"),
            "groom_d9_chart": groom_data.get("vargas", {}).get("d9"),
            "timing": {
                "favorable_years": marriage_years,
                "dasha_compatibility": dasha_analysis
            },
            "remedies": remedies,
            "ai_narrative": ai_narrative,
            "success_probability": round(success_probability, 2),
            "summary": {
                "status": guna_report.get("interpretation", "Average"),
                "recommendation": ai_narrative["summary"]
            },
            "enterprise_analysis": enterprise_results,
            "bride_kundali_analysis": bride_kundali_analysis,
            "groom_kundali_analysis": groom_kundali_analysis
        }
    except Exception as e:
        print(f"[MARRIAGE ENGINE ERROR] {e}")
        traceback.print_exc()
        return {"error": str(e)}
