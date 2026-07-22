class GPTReportEngine:

    def generate(self, data, personalized_context=None):
        if personalized_context:
            janma = personalized_context.get("janma_nakshatra") or "Rohini"
            antardasha = personalized_context.get("active_antardasha") or "Saturn"
            transit_planets = personalized_context.get("transit_planets") or {}
            
            saturn_transit = transit_planets.get("Saturn") or "Rohini"
            jupiter_transit = transit_planets.get("Jupiter") or "Punarvasu"
            
            return f"Transit Saturn in {saturn_transit} casts Vedha to your Janma Nakshatra ({janma}) while {antardasha} is active by Antardasha. This may indicate increased responsibilities and slower progress over the next few months. Because Jupiter in {jupiter_transit} is simultaneously aspecting and strengthening your 10th house, career growth remains possible, though it may come after delays."

        return """

        Sarvatobhadra Analysis Report

        Strong karmic activation detected.

        Transit overlays indicate
        important life developments.

        Marriage and financial sectors
        highly activated.

        """
