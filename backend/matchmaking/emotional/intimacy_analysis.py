from matchmaking.core.ultra.utils import get_aspecting_planets

class IntimacyAnalysisEngine:
    def analyze(self, bride, groom):
        score = 60
        desc = []
        
        for person_name, person_data in [("Bride", bride), ("Groom", groom)]:
            chart = person_data.get("chart", {})
            houses = chart.get("houses", {})
            
            h8 = houses.get(8, {}).get("planets", [])
            h12 = houses.get(12, {}).get("planets", [])
            
            h8_p = [p["name"] if isinstance(p, dict) else p for p in h8]
            h12_p = [p["name"] if isinstance(p, dict) else p for p in h12]
            
            # Check for direct placements
            if "Venus" in h12_p: score += 15
            if "Mars" in h8_p: score += 10
            
            # Check for aspects
            aspects_h8 = get_aspecting_planets(chart, 8)
            aspects_h12 = get_aspecting_planets(chart, 12)
            
            if "Venus" in aspects_h8: score += 10
            if "Jupiter" in aspects_h12: score += 10
            if "Saturn" in aspects_h12 or "Saturn" in aspects_h8: score -= 15
            if "Rahu" in aspects_h12: score -= 10
            
        return {
            "score": min(100, max(0, score)),
            "description": "Excellent physical compatibility." if score >= 75 else "Moderate compatibility." if score >= 50 else "Requires mutual effort."
        }
