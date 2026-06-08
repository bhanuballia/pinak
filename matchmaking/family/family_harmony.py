from matchmaking.core.ultra.utils import get_aspecting_planets

class FamilyHarmonyEngine:
    def analyze(self, bride, groom):
        score = 50
        
        for person_name, person_data in [("Bride", bride), ("Groom", groom)]:
            chart = person_data.get("chart", {})
            houses = chart.get("houses", {})
            
            h2 = houses.get(2, {}).get("planets", [])
            h4 = houses.get(4, {}).get("planets", [])
            
            h2_p = [p["name"] if isinstance(p, dict) else p for p in h2]
            h4_p = [p["name"] if isinstance(p, dict) else p for p in h4]
            
            if "Jupiter" in h2_p or "Venus" in h2_p: score += 10
            if "Jupiter" in h4_p or "Moon" in h4_p: score += 10
            
            aspects_h4 = get_aspecting_planets(chart, 4)
            if "Saturn" in aspects_h4: score -= 10
            if "Mars" in aspects_h4: score -= 10
            if "Jupiter" in aspects_h4: score += 15
            
        return {
            "score": min(100, max(0, score)),
            "description": "High likelihood of domestic peace and harmonious family integration." if score >= 70 else "Average domestic environment."
        }
