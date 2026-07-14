# backend/api/prediction_routes.py

from fastapi import APIRouter, HTTPException, Body
from enterprise_astrology.backend.ai.event_probability_ai import EventProbabilityAI
from enterprise_astrology.backend.ai.timeline_forecaster import TimelineForecaster
from enterprise_astrology.backend.ai.gpt_interpretation_engine import GPTInterpretationEngine
from enterprise_astrology.backend.ai.report_writer import AstrologicalReportWriter
from enterprise_astrology.backend.dashboard.timeline_visualizer import TimelineVisualizer

router = APIRouter()
prob_ai = EventProbabilityAI()
forecaster = TimelineForecaster()
gpt_engine = GPTInterpretationEngine()
report_writer = AstrologicalReportWriter()
timeline_viz = TimelineVisualizer()

@router.post("/calculate-probability")
def calculate_probability(payload: dict = Body(...)):
    try:
        dasha_score = float(payload.get("dasha_score", 50))
        transit_score = float(payload.get("transit_score", 50))
        divisional_support = float(payload.get("divisional_support", 50))
        
        result = prob_ai.calculate_probability(dasha_score, transit_score, divisional_support)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/forecast-timeline")
def forecast_timeline(payload: dict = Body(...)):
    try:
        natal_chart = payload.get("natal_chart", {})
        transits = payload.get("transits", [])
        
        raw_forecast = forecaster.forecast_events(natal_chart, transits)
        visual_timeline = timeline_viz.format_timeline(raw_forecast)
        return {
            "forecast": raw_forecast,
            "timeline": visual_timeline
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/gpt-report")
def generate_gpt_report(payload: dict = Body(...)):
    try:
        chart_data = payload.get("chart_data", {})
        interpretation = gpt_engine.generate_report(chart_data)
        pdf_meta = report_writer.write_pdf_report(chart_data, interpretation)
        return {
            "interpretation": interpretation,
            "pdf_status": pdf_meta
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
