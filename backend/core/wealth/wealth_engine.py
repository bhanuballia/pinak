
from core.wealth.dhan_yoga_engine import detect_dhan_yogas
from core.wealth.wealth_score import calculate_wealth_score
from core.wealth.wealth_rules import income_type
from core.wealth.wealth_timeline import build_wealth_timeline
from core.wealth.wealth_ai_writer import generate_wealth_report

def run_wealth_engine(report_data):
    """
    Main orchestration point for the Wealth Prediction Engine.
    Integrates technical analysis, timeline data, and AI generation.
    """
    # Extract core data components
    chart = report_data.get("chart", {})
    planet_positions = report_data.get("planet_positions", [])
    
    # Strength data can be under 'strength' or 'strength_analysis'
    strength_data = report_data.get("strength") or report_data.get("strength_analysis", {})
    p_strengths = strength_analysis.get("planets", {}) if (strength_analysis := strength_data) else {}
    
    # Timeline fusion
    timeline = []
    if "omniscient_timeline" in report_data:
        timeline = report_data["omniscient_timeline"].get("omniscient_timeline", [])
    elif "quantum_timeline" in report_data:
        timeline = report_data["quantum_timeline"].get("years", [])
    else:
        timeline = report_data.get("timeline", [])

    # Step 1: Detect Yogas
    yogas = detect_dhan_yogas(chart, planet_positions)

    # Step 2: Calculate Technical Score
    score = calculate_wealth_score(chart, p_strengths, yogas)

    # Step 3: Determine Professional Income Stream
    income = income_type(chart, planet_positions, p_strengths)

    # Step 4: Generate Financial Timeline
    wealth_timeline = build_wealth_timeline(timeline)

    # Step 5: Synthesize AI Narrative
    ai_text = generate_wealth_report({
        "score": score,
        "income_type": income,
        "yogas": yogas,
        "timeline": wealth_timeline
    })

    return {
        "score": score,
        "income_type": income,
        "yogas": yogas,
        "timeline": wealth_timeline,
        "analysis": ai_text
    }
