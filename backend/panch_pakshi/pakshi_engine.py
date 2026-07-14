# panch_pakshi/pakshi_engine.py

from datetime import datetime

from panch_pakshi.bird_calculator import (
    calculate_birth_bird
)

from panch_pakshi.activity_cycles import (
    generate_daily_cycles
)

from panch_pakshi.ai_timing_engine import (
    calculate_timing_score
)

from panch_pakshi.timing_alerts import (
    generate_alert
)


class PanchPakshiEngine:

    def __init__(
        self,
        nakshatra_number: int
    ):

        self.birth_bird = calculate_birth_bird(
            nakshatra_number
        )

    def generate_timeline(
        self,
        start_dt: datetime
    ):

        cycles = generate_daily_cycles(
            start_dt
        )

        result = []

        for c in cycles:

            score = calculate_timing_score(
                c["activity"],
                "Self"
            )

            result.append({

                "bird": self.birth_bird,
                "activity": c["activity"],
                "relationship": "Self",
                "score": score,
                "start": c["start"],
                "end": c["end"],
                "alert": generate_alert(
                    c["activity"]
                )
            })

        return result
