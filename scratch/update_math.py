import os
base_dir = r'd:\vedic-astrology-app - 2 - okFinal - Deploy\matchmaking'

files = {
    r'divorce\divorce_risk_engine.py': '''class DivorceRiskEngine:
    """
    Separation probability analysis.
    """
    def evaluate(self, chart):
        risk = 15 # Base risk
        houses = chart.get("houses", {})
        
        # Check 7th house for malefics
        h7 = houses.get(7, {}).get("planets", [])
        h7_planets = [p["name"] if isinstance(p, dict) else p for p in h7]
        
        if "Mars" in h7_planets: risk += 25
        if "Saturn" in h7_planets: risk += 20
        if "Rahu" in h7_planets: risk += 25
        if "Ketu" in h7_planets: risk += 20
        if "Sun" in h7_planets: risk += 10
        
        # Check for benefic mitigations
        if "Jupiter" in h7_planets or "Venus" in h7_planets:
            risk -= 15
            
        return {
            "risk_score": min(100, max(0, risk)),
            "risk_level": "HIGH" if risk >= 50 else "MODERATE" if risk >= 30 else "LOW"
        }
''',
    r'core\marriage_outcome_engine.py': '''class MarriageOutcomeEngine:
    """
    Marriage sustainability analysis.
    """
    def analyze(self, chart):
        score = 50
        houses = chart.get("houses", {})
        
        # Check 7th house and 9th house (dharma) for benefics
        h7 = houses.get(7, {}).get("planets", [])
        h9 = houses.get(9, {}).get("planets", [])
        
        h7_planets = [p["name"] if isinstance(p, dict) else p for p in h7]
        h9_planets = [p["name"] if isinstance(p, dict) else p for p in h9]
        
        if "Jupiter" in h7_planets or "Venus" in h7_planets: score += 20
        if "Jupiter" in h9_planets: score += 15
        if "Moon" in h7_planets: score += 10
        
        if "Saturn" in h7_planets or "Rahu" in h7_planets: score -= 15
        
        return {
            "longevity": min(100, max(0, score)),
            "stability": "HIGH" if score >= 70 else "MEDIUM" if score >= 40 else "LOW"
        }
''',
    r'timing\kp_marriage_engine.py': '''class KPMarriageTiming:
    """
    KP-based event timing.
    """
    MARRIAGE_HOUSES = [2, 7, 11]

    def predict(self, chart):
        active = []
        houses = chart.get("houses", {})
        
        # Find planets in houses 2, 7, 11
        for h in self.MARRIAGE_HOUSES:
            h_planets = houses.get(h, {}).get("planets", [])
            for p in h_planets:
                name = p["name"] if isinstance(p, dict) else p
                if name not in active:
                    active.append(name)
                    
        return {
            "active_planets": active,
            "event_probability": "HIGH" if len(active) >= 2 else "LOW",
            "is_active": len(active) > 0
        }
''',
    r'core\compatibility_engine.py': '''import asyncio
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
        
        divorce_risk = DivorceRiskEngine().evaluate(bride.get("chart", {}))
        children = ProgenyAnalysisEngine().analyze(bride, groom)
        longevity = MarriageOutcomeEngine().analyze(bride.get("chart", {}))
        intimacy = IntimacyAnalysisEngine().analyze(bride, groom)
        financial = FinancialHarmonyEngine().analyze(bride, groom)
        family = FamilyHarmonyEngine().analyze(bride, groom)
        kp_timing = KPMarriageTiming().predict(bride.get("chart", {}))
        
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
            "kp_activation": kp_timing
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
'''
}

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path)
    with open(full_path, 'w') as f:
        f.write(content)
print('Advanced Math populated.')
