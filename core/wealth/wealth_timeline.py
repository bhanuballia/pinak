
def build_wealth_timeline(timeline):
    """
    Analyzes the multi-year timeline to identify financial peaks and troughs
    by analyzing events, descriptions, and existing scores.
    """
    results = []
    
    # We expect a list of yearly data
    for entry in timeline:
        year = entry.get("year")
        events = entry.get("events", [])
        
        # Start with a baseline score. If the timeline already provides a general score, blend it.
        base_score = entry.get("score", 50)
        score = (base_score + 50) / 2 if base_score != 50 else 50
        
        # Adjust based on event types detected by higher-level engines
        for e in events:
            e_type = str(e.get("type", "")).lower()
            e_title = str(e.get("title", "")).lower()
            e_desc = str(e.get("description", "")).lower()
            
            combined_text = f"{e_type} {e_title} {e_desc}"
            
            # Massive wealth triggers
            if any(x in combined_text for x in ["windfall", "inheritance", "massive gain", "lottery", "sudden wealth"]):
                score += 30
            # Solid positive wealth triggers
            elif any(x in combined_text for x in ["wealth", "gain", "profit", "prosperity", "investment", "bonus", "business expansion"]):
                score += 20
            # Career/Steady growth triggers
            elif any(x in combined_text for x in ["career", "success", "promotion", "elevation", "salary", "new job"]):
                score += 10
            
            # Massive negative triggers
            if any(x in combined_text for x in ["bankruptcy", "major loss", "scam", "heavy debt", "litigation"]):
                score -= 30
            # Standard negative wealth triggers
            elif any(x in combined_text for x in ["loss", "expense", "caution", "risk", "setback", "debt", "penalty"]):
                score -= 15
                
        # Clamp score between 0 and 100
        score = max(0, min(100, score))
                
        # Categorize
        if score >= 80:
            label = "High Gain"
        elif score >= 60:
            label = "Growth"
        elif score >= 40:
            label = "Stable"
        else:
            label = "Risk"
            
        results.append({
            "year": year,
            "score": int(score),
            "label": label
        })
        
    return results
