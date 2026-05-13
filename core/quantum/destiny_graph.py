def build_destiny_graph(windows, dosha, strength):
    """
    Score the destiny graph based on windows, doshas, and planetary strengths.
    """
    graph_data = []
    
    for w in windows:
        # Base score from potential
        score_map = {"Peak": 90, "High": 75, "Strong": 65, "Moderate": 50, "Low": 35}
        base_score = score_map.get(w["potential"], 50)
        
        # Dosha adjustments
        # Dosha adjustments
        if dosha.get("kalsarp", {}).get("present") and w.get("lord") in ["Rahu", "Ketu"]:
            base_score -= 10
            
        if dosha.get("sadesati", {}).get("present") and w.get("lord") == "Saturn":
            base_score -= 15
            
        final_score = max(0, min(100, base_score))
        
        # Parse years from period string "dd/mm/yyyy - dd/mm/yyyy"
        try:
            p_str = w.get("period", "")
            parts = p_str.split(" - ")
            if len(parts) == 2:
                s_year = int(parts[0].split("/")[-1])
                e_year = int(parts[1].split("/")[-1])
                
                # clamping to reasonable range if needed, but dasha should be fine
                for y in range(s_year, e_year + 1):
                    graph_data.append({
                        "year": y,
                        "value": final_score,
                        "label": w.get("potential", "Moderate")
                    })
        except Exception:
            pass
            
    # Sort by year to ensure clean line graph
    graph_data.sort(key=lambda x: x["year"])
        
    return graph_data
