# panch_pakshi/activity_cycles.py

from datetime import timedelta
from panch_pakshi.constants import ACTIVITIES

ACTIVITY_DURATION_MINUTES = 144

def generate_daily_cycles(start_dt):
    """
    Generates activity cycle timeline.
    """

    cycles = []

    current = start_dt

    for activity in ACTIVITIES:

        end = current + timedelta(
            minutes=ACTIVITY_DURATION_MINUTES
        )

        cycles.append({
            "activity": activity,
            "start": current,
            "end": end
        })

        current = end

    return cycles
