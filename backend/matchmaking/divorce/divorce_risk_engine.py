class DivorceRiskEngine:
    """
    Separation probability analysis.
    """
    def evaluate(self, bride_chart, groom_chart):
        def _get_risk(chart):
            risk = 15 # Base risk
            houses = chart.get("houses", {})
            
            # Check 7th house for malefics
            h7_data = houses.get(7) or houses.get("7", {})
            h7 = h7_data.get("planets", [])
            h7_planets = [p["name"] if isinstance(p, dict) else p for p in h7]
            
            if "Mars" in h7_planets: risk += 25
            if "Saturn" in h7_planets: risk += 20
            if "Rahu" in h7_planets: risk += 25
            if "Ketu" in h7_planets: risk += 20
            if "Sun" in h7_planets: risk += 10
            
            # Check for benefic mitigations
            if "Jupiter" in h7_planets or "Venus" in h7_planets:
                risk -= 15
                
            return risk
            
        bride_risk = _get_risk(bride_chart)
        groom_risk = _get_risk(groom_chart)
        
        avg_risk = (bride_risk + groom_risk) / 2
        
        return {
            "risk_score": min(100, max(0, int(avg_risk))),
            "risk_level": "HIGH" if avg_risk >= 50 else "MODERATE" if avg_risk >= 30 else "LOW"
        }
