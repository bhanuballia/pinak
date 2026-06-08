class DivorceRiskEngine:
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
