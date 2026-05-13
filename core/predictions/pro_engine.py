# core/predictions/pro_engine.py

from .timeline_engine import build_timeline
from .dasha_scoring import score_dasha_periods
from .transit_scoring import transit_score_year
from .fortune_engine import detect_fortune_peaks
from .marriage_engine import detect_marriage_windows
from .wealth_engine import detect_wealth_periods


def build_pro_predictions(chart, dasha, dosha, strength):

    timeline = build_timeline(chart, dasha, dosha, strength)

    # Enhance each year with scoring
    for y in timeline:

        year = y["year"]

        y["dasha_score"] = score_dasha_periods(year, dasha, strength)
        y["transit_score"] = transit_score_year(year, chart)
        y["total_score"] = y["dasha_score"] + y["transit_score"]

    peaks = detect_fortune_peaks(timeline)
    marriage = detect_marriage_windows(timeline, chart, dosha)
    wealth = detect_wealth_periods(timeline)

    return {
        "timeline": timeline,
        "fortune_peaks": peaks,
        "marriage_windows": marriage,
        "wealth_periods": wealth,
    }
