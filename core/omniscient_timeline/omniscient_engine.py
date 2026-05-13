from core.destiny_matrix.destiny_context import build_destiny_context
from core.omniscient_timeline.timeline_rules import build_year_events


def run_omniscient_timeline(report_data, start=2025, end=2035):

    ctx = build_destiny_context(report_data)

    timeline = []

    for year in range(start, end + 1):
        timeline.append(build_year_events(year, ctx))

    return {
        "omniscient_timeline": timeline
    }
