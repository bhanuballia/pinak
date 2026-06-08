import asyncio
import traceback

class CompatibilityEngine:
    """
    Enterprise relationship intelligence engine.
    """
    def __init__(self):
        pass
        
    def _fire_alert(self, event_type, data):
        try:
            from matchmaking.websocket.live_marriage_alerts import broadcast_marriage_alert
            # Fire and forget
            asyncio.create_task(broadcast_marriage_alert(event_type, data))
        except Exception as e:
            print(f"WS Broadcast error: {e}")

    def analyze(self, bride, groom, precomputed_reports=None):
        if precomputed_reports is None:
            precomputed_reports = {}
            
        self._fire_alert("ENGINE_START", {"status": "Starting Master Compatibility Engine"})
            
        guna = precomputed_reports.get("guna_milan", {})
        manglik = precomputed_reports.get("manglik", {}).get("analysis", {})
        navamsa = precomputed_reports.get("navamsa", {})
        timing = precomputed_reports.get("timing", {})
        
        self._fire_alert("ENGINE_PROGRESS", {"step": "Precomputed Reports Loaded"})
        
        from matchmaking.divorce.divorce_risk_engine import DivorceRiskEngine
        from matchmaking.childbirth.progeny_analysis import ProgenyAnalysisEngine
        from matchmaking.core.marriage_outcome_engine import MarriageOutcomeEngine
        from matchmaking.emotional.intimacy_analysis import IntimacyAnalysisEngine
        from matchmaking.family.wealth_after_marriage import FinancialHarmonyEngine
        from matchmaking.family.family_harmony import FamilyHarmonyEngine
        from matchmaking.ai.predictive_ai import PredictiveRelationshipAI
        from matchmaking.timing.kp_marriage_engine import KPMarriageTiming
        from matchmaking.advanced.synastry_engine import SynastryEngine
        from matchmaking.ashtakoota.ashtakoota_engine import AshtakootaEngine
        from matchmaking.manglik.manglik_engine import ManglikEngine
        from matchmaking.muhurat.marriage_muhurta import MarriageMuhurat
        
        divorce_risk = DivorceRiskEngine().evaluate(bride.get("chart", {}))
        children = ProgenyAnalysisEngine().analyze(bride, groom)
        longevity = MarriageOutcomeEngine().analyze(bride.get("chart", {}))
        intimacy = IntimacyAnalysisEngine().analyze(bride, groom)
        financial = FinancialHarmonyEngine().analyze(bride, groom)
        family = FamilyHarmonyEngine().analyze(bride, groom)
        kp_timing = KPMarriageTiming().predict(bride.get("chart", {}), bride.get("dasha", {}))
        synastry = SynastryEngine().analyze(bride, groom)
        
        # New Engine Integrations
        ashtakoota_guna = AshtakootaEngine().calculate(bride, groom)
        is_manglik_check = ManglikEngine().check(bride.get("chart", {}))
        best_muhurta = MarriageMuhurat().select(["2027-11-15", "2028-02-14"])
        
        self._fire_alert("ENGINE_PROGRESS", {"step": "Advanced Engines Computed"})
        
        result = {
            "guna_milan": {"score": (guna.get("total_score", 0) / 36.0) * 100, "details": guna.get("interpretation", "")},
            "manglik": {"is_manglik": manglik.get("cancelled", False) == False, "score": 100 if manglik.get("cancelled") else 40},
            "navamsha": {"score": navamsa.get("d9_stability_score", 50), "details": navamsa.get("spiritual_bond", "")},
            "marriage_timing": timing,
            "emotional": {"score": 75, "details": "Good emotional bonding"},
            "divorce_risk": divorce_risk,
            "children": children,
            "longevity": longevity,
            "intimacy": intimacy,
            "financial": financial,
            "family": family,
            "kp_activation": kp_timing,
            "synastry": synastry,
            "muhurta": best_muhurta
        }
        
        scores = {
            "guna": result["guna_milan"].get("score", 0),
            "emotional": result["emotional"].get("score", 0),
            "d9": result["navamsha"].get("score", 0),
            "intimacy": result["intimacy"].get("score", 0),
            "financial": result["financial"].get("score", 0)
        }
        result["ai_prediction"] = PredictiveRelationshipAI().forecast(scores)
        
        final_score = (
            result["guna_milan"].get("score", 0) * 0.20 +
            result["emotional"].get("score", 0) * 0.20 +
            result["navamsha"].get("score", 0) * 0.15 +
            80 * 0.15 + 
            result["longevity"].get("longevity", 0) * 0.10 +
            result["intimacy"].get("score", 0) * 0.10 +
            result["financial"].get("score", 0) * 0.05 +
            result["family"].get("score", 0) * 0.05
        )
        result["final_score"] = final_score
        
        self._fire_alert("ENGINE_COMPLETE", {"final_score": final_score})
        
        return result
