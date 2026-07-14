class ProgenyAnalysisEngine:
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
