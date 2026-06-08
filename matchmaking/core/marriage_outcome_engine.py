class MarriageOutcomeEngine:
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
