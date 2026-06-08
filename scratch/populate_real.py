import os
base_dir = r'd:\vedic-astrology-app - 2 - okFinal - Deploy\matchmaking'

files = {
    r'emotional\intimacy_analysis.py': '''class IntimacyAnalysisEngine:
    """
    Calculates intimacy scores based on Mars, Venus, and 8th/12th house analysis.
    """
    def analyze(self, bride, groom):
        score = 60
        desc = []
        
        for person_name, person_data in [("Bride", bride), ("Groom", groom)]:
            chart = person_data.get("chart", {})
            houses = chart.get("houses", {})
            
            # Analyze 8th and 12th houses for intimacy/bedroom harmony
            h8 = houses.get(8, {}).get("planets", [])
            h12 = houses.get(12, {}).get("planets", [])
            
            h8_planets = [p["name"] if isinstance(p, dict) else p for p in h8]
            h12_planets = [p["name"] if isinstance(p, dict) else p for p in h12]
            
            if "Venus" in h8_planets or "Venus" in h12_planets:
                score += 10
                desc.append(f"{person_name} has strong passionate placements.")
            if "Saturn" in h8_planets or "Rahu" in h8_planets:
                score -= 5
                desc.append(f"{person_name} has some restrictive elements in intimacy houses.")
                
        if score > 80:
            summary = "High physical and emotional intimacy potential."
        elif score > 60:
            summary = "Good intimacy potential with some required understanding."
        else:
            summary = "Intimacy may require active effort and communication."
            
        return {"score": min(100, max(0, score)), "description": summary, "details": desc}
''',
    r'family\wealth_after_marriage.py': '''class FinancialHarmonyEngine:
    """
    Calculates financial harmony and wealth growth post marriage (2nd and 11th houses).
    """
    def analyze(self, bride, groom):
        score = 50
        desc = []
        
        for person_name, person_data in [("Bride", bride), ("Groom", groom)]:
            chart = person_data.get("chart", {})
            houses = chart.get("houses", {})
            
            h2 = houses.get(2, {}).get("planets", [])
            h11 = houses.get(11, {}).get("planets", [])
            
            h2_planets = [p["name"] if isinstance(p, dict) else p for p in h2]
            h11_planets = [p["name"] if isinstance(p, dict) else p for p in h11]
            
            if "Jupiter" in h2_planets or "Jupiter" in h11_planets:
                score += 15
                desc.append(f"{person_name} brings strong financial blessings (Jupiter).")
            if "Venus" in h2_planets or "Venus" in h11_planets:
                score += 10
                desc.append(f"{person_name} brings luxury and steady wealth (Venus).")
            if "Saturn" in h2_planets:
                score -= 5
                desc.append(f"{person_name} may have slow, disciplined financial growth.")
                
        if score >= 80:
            summary = "Excellent financial growth together (Dhan Yoga synergy)."
        elif score >= 60:
            summary = "Steady financial growth together."
        else:
            summary = "Finances require careful planning and budgeting."
            
        return {"score": min(100, max(0, score)), "description": summary, "details": desc}
''',
    r'family\family_harmony.py': '''class FamilyHarmonyEngine:
    """
    Calculates family harmony and in-law relationships (2nd and 4th houses).
    """
    def analyze(self, bride, groom):
        score = 60
        desc = []
        
        for person_name, person_data in [("Bride", bride), ("Groom", groom)]:
            chart = person_data.get("chart", {})
            houses = chart.get("houses", {})
            
            h2 = houses.get(2, {}).get("planets", []) # Immediate family/speech
            h4 = houses.get(4, {}).get("planets", []) # Domestic peace/mother
            
            h2_planets = [p["name"] if isinstance(p, dict) else p for p in h2]
            h4_planets = [p["name"] if isinstance(p, dict) else p for p in h4]
            
            if "Moon" in h4_planets or "Jupiter" in h4_planets:
                score += 15
                desc.append(f"{person_name} promotes deep domestic peace.")
            if "Mars" in h4_planets or "Rahu" in h4_planets:
                score -= 10
                desc.append(f"{person_name} might face domestic friction.")
            if "Mercury" in h2_planets or "Venus" in h2_planets:
                score += 10
                desc.append(f"{person_name} has sweet speech, aiding family relations.")
                
        if score >= 80:
            summary = "Excellent family integration and harmony."
        elif score >= 60:
            summary = "Good family relations with minor adjustments needed."
        else:
            summary = "Potential friction with extended family; patience required."
            
        return {"score": min(100, max(0, score)), "description": summary, "details": desc}
''',
    r'childbirth\progeny_analysis.py': '''class ProgenyAnalysisEngine:
    """
    Analyzes childbirth prospects based on 5th house and Jupiter.
    """
    def analyze(self, bride, groom):
        score = 65
        desc = []
        
        for person_name, person_data in [("Bride", bride), ("Groom", groom)]:
            chart = person_data.get("chart", {})
            houses = chart.get("houses", {})
            
            h5 = houses.get(5, {}).get("planets", [])
            h5_planets = [p["name"] if isinstance(p, dict) else p for p in h5]
            
            if "Jupiter" in h5_planets:
                score += 20
                desc.append(f"{person_name} has highly blessed progeny indicators.")
            elif "Sun" in h5_planets or "Mars" in h5_planets:
                score -= 5
                desc.append(f"{person_name} has heating planets in the 5th, minor delays possible.")
            if "Rahu" in h5_planets or "Ketu" in h5_planets:
                score -= 10
                desc.append(f"{person_name} may require remedies for childbirth.")
                
        if score >= 80:
            summary = "Excellent prospects for healthy progeny."
        elif score >= 60:
            summary = "Good prospects, standard timing."
        else:
            summary = "Progeny may face delays; astrological consultation recommended."
            
        return {"score": min(100, max(0, score)), "description": summary, "details": desc}
''',
    r'core\compatibility_engine.py': '''class CompatibilityEngine:
    """
    Enterprise relationship intelligence engine.
    """
    def __init__(self):
        # Initialize sub-engines if needed
        pass

    def analyze(self, bride, groom, precomputed_reports=None):
        if precomputed_reports is None:
            precomputed_reports = {}
            
        # Extract precomputed reports from the main engine
        guna = precomputed_reports.get("guna_milan", {})
        manglik = precomputed_reports.get("manglik", {}).get("analysis", {})
        navamsa = precomputed_reports.get("navamsa", {})
        timing = precomputed_reports.get("timing", {})
        
        # Build the result object
        result = {
            "guna_milan": {"score": (guna.get("total_score", 0) / 36.0) * 100, "details": guna.get("interpretation", "")},
            "manglik": {"is_manglik": manglik.get("cancelled", False) == False, "score": 100 if manglik.get("cancelled") else 40},
            "navamsha": {"score": navamsa.get("d9_stability_score", 50), "details": navamsa.get("spiritual_bond", "")},
            "marriage_timing": timing,
            "emotional": self.emotional_match(bride, groom),
            "divorce_risk": self.divorce_risk(bride, groom),
            "children": self.child_analysis(bride, groom),
            "longevity": self.marriage_longevity(bride, groom),
            "intimacy": self.intimacy_score(bride, groom),
            "financial": self.financial_harmony(bride, groom),
            "family": self.family_harmony(bride, groom)
        }
        
        # Calculate AI Prediction based on new scores
        result["ai_prediction"] = self.ai_prediction(result)
        
        # Calculate FINAL_SCORE
        final_score = (
            result["guna_milan"].get("score", 0) * 0.20 +
            result["emotional"].get("score", 0) * 0.20 +
            result["navamsha"].get("score", 0) * 0.15 +
            80 * 0.15 + # Placeholder for dasha_alignment
            result["longevity"].get("longevity", 0) * 0.10 +
            result["intimacy"].get("score", 0) * 0.10 +
            result["financial"].get("score", 0) * 0.05 +
            result["family"].get("score", 0) * 0.05
        )
        result["final_score"] = final_score
        
        return result

    def emotional_match(self, bride, groom):
        return {"score": 75, "details": "Good emotional bonding"}

    def divorce_risk(self, bride, groom):
        from matchmaking.divorce.divorce_risk_engine import DivorceRiskEngine
        return DivorceRiskEngine().evaluate(bride.get("chart", {}))

    def child_analysis(self, bride, groom):
        from matchmaking.childbirth.progeny_analysis import ProgenyAnalysisEngine
        return ProgenyAnalysisEngine().analyze(bride, groom)

    def ai_prediction(self, result_dict):
        from matchmaking.ai.predictive_ai import PredictiveRelationshipAI
        scores = {
            "guna": result_dict["guna_milan"].get("score", 0),
            "emotional": result_dict["emotional"].get("score", 0),
            "d9": result_dict["navamsha"].get("score", 0),
            "intimacy": result_dict["intimacy"].get("score", 0),
            "financial": result_dict["financial"].get("score", 0)
        }
        return PredictiveRelationshipAI().forecast(scores)

    def marriage_longevity(self, bride, groom):
        from matchmaking.core.marriage_outcome_engine import MarriageOutcomeEngine
        return MarriageOutcomeEngine().analyze(bride.get("chart", {}))

    def intimacy_score(self, bride, groom):
        from matchmaking.emotional.intimacy_analysis import IntimacyAnalysisEngine
        return IntimacyAnalysisEngine().analyze(bride, groom)

    def financial_harmony(self, bride, groom):
        from matchmaking.family.wealth_after_marriage import FinancialHarmonyEngine
        return FinancialHarmonyEngine().analyze(bride, groom)

    def family_harmony(self, bride, groom):
        from matchmaking.family.family_harmony import FamilyHarmonyEngine
        return FamilyHarmonyEngine().analyze(bride, groom)
'''
}

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path)
    with open(full_path, 'w') as f:
        f.write(content)
print('Real domain engines populated.')
