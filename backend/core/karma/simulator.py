from .dasha_timeline import build_yearly_dasha_map
from .transit_engine import saturn_pressure, jupiter_support
from .karma_score import compute_karma_score
from .phase_classifier import classify_phase
from .destiny_curve import build_destiny_curve
from .narrative import get_yearly_narrative, get_yearly_guidance


def run_karma_simulation(report_data, start_year=2025, end_year=2035):

    chart = report_data.get("chart",{})
    dosha = report_data.get("dosha",{})
    strength = report_data.get("strength",{})
    dasha = report_data.get("dasha",{})

    yearly_map = build_yearly_dasha_map(dasha)

    results = []

    for year in range(start_year, end_year+1):

        lord = yearly_map.get(year,
                              dasha.get("current",{}).get("lord",""))

        score = compute_karma_score(year,lord,strength,dosha)

        score += saturn_pressure(year,chart)
        score += jupiter_support(year,chart)

        score = max(0,min(1,score))

        phase = classify_phase(score)
        
        results.append({
            "year": year,
            "lord": lord,
            "score": score,
            "phase": phase,
            "description": get_yearly_narrative(year, lord, score, phase),
            "guidance": get_yearly_guidance(year, lord, score)
        })


    report_data["karma_timeline"] = results
    report_data["destiny_curve"] = build_destiny_curve(results)

    return report_data
