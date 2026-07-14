from .destiny_scoring import calculate_destiny_score
from .destiny_curve import build_curve
from .destiny_windows import detect_windows
from .destiny_texts import destiny_explanation

def build_destiny_timeline(report_data):
    dasha = report_data.get("dasha", {})
    dosha = report_data.get("dosha", {})
    strength = report_data.get("strength", {})
    transits = report_data.get("transits", {})
    
    timeline = []
    karma_timeline = report_data.get("karma_timeline", [])

    # Generate scores for the simulation window (2025-2035)
    for year in range(2025, 2036):
        # Fetch dynamic score from karma simulator if available
        karma_data = next((k for k in karma_timeline if k.get("year") == year), None)
        if karma_data and "score" in karma_data:
            # karma score is 0-1 float, convert to 0-100 scale
            score = int(karma_data["score"] * 100)
        else:
            score = calculate_destiny_score(year, dasha, dosha, strength, transits)
            
        timeline.append({
            "year": year,
            "score": score
        })
    
    # 1. Classify phases (Peak vs Challenge)
    timeline = build_curve(timeline)
    
    # 2. Add textual explanations
    for year_data in timeline:
        year_data["summary"] = destiny_explanation(year_data)
        
    report_data["destiny_timeline"] = timeline
    
    # 3. Detect specialized windows (Marriage/Career)
    report_data["destiny_windows"] = detect_windows(timeline)
    
    return report_data

