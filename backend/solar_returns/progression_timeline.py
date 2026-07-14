# solar_returns/progression_timeline.py

class ProgressionTimeline:
    """
    Generates progression timeline.
    """

    def build(
        self,
        progression_data
    ):
        timeline = []

        for p in progression_data:
            timeline.append({
                "month":
                    p["month"],
                "date":
                    str(p["date"])
            })

        return timeline
