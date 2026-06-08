class FinancialHarmonyEngine:
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
