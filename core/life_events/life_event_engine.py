from .event_models import LifeEvent
from .event_rules import (
    is_marriage_period,
    is_career_peak,
    is_finance_rise,
    is_health_warning,
    is_spiritual_phase
)
from .event_scoring import event_intensity
from .event_texts import generate_event_text


def detect_life_events(report_data):

    timeline = report_data.get("karma_timeline",[])
    events = []

    for year_data in timeline:

        year = year_data["year"]
        score = year_data.get("score",50)

        def add_event(category,title):
            events.append(
                LifeEvent(
                    year=year,
                    category=category,
                    title=title,
                    intensity=event_intensity(score),
                    summary=generate_event_text(category,year)
                )
            )

        if is_marriage_period(year_data):
            add_event("marriage","Relationship Window")

        if is_career_peak(year_data):
            add_event("career","Career Growth Phase")

        if is_finance_rise(year_data):
            add_event("finance","Financial Opportunity")

        if is_health_warning(year_data):
            add_event("health","Health Awareness Period")

        if is_spiritual_phase(year_data):
            add_event("spiritual","Spiritual Development Phase")

    report_data["life_events"] = [e.__dict__ for e in events]

    return report_data
