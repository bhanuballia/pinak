# backend/ai/timeline_forecaster.py

class TimelineForecaster:
    def forecast_events(self, natal_chart: dict, transits: list):
        """
        Forecast transit events over a timeline based on natal chart placements and active transits.
        """
        forecast = []
        for tr in transits:
            planet = tr.get("planet", "Saturn")
            house = tr.get("house", 1)
            sign = tr.get("sign", "Aries")
            date = tr.get("date", "2026-05-20")
            
            # Simple rule-based event prediction
            impact_score = 50
            if planet in ["Saturn", "Rahu", "Ketu"]:
                impact_score = 75 if house in [1, 4, 7, 8, 12] else 45
            elif planet in ["Jupiter", "Venus", "Moon"]:
                impact_score = 85 if house in [5, 9, 11, 2] else 60

            forecast.append({
                "date": date,
                "planet": planet,
                "house": house,
                "sign": sign,
                "impact_score": impact_score,
                "event_type": "Challenging Transit" if impact_score > 70 else "Auspicious Transit" if impact_score > 60 else "Neutral Transit",
                "description": f"{planet} transiting through house {house} in {sign} sign."
            })
        return forecast
