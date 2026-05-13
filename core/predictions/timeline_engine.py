# core/predictions/timeline_engine.py

from .yearly_engine import yearly_prediction


def build_timeline(chart, dasha, dosha, strength,
                   start_year=2025,
                   end_year=2035):

    timeline = []

    for year in range(start_year, end_year + 1):

        data = yearly_prediction(
            year,
            chart,
            dasha,
            dosha,
            strength
        )

        timeline.append(data)

    return timeline
