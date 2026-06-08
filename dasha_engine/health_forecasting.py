class HealthRiskForecasting:

    def forecast(
        self,
        sixth_house,
        saturn_affliction,
        rahu_affliction,
        dasha_score
    ):

        risk = (
            sixth_house * 0.35 +
            saturn_affliction * 0.25 +
            rahu_affliction * 0.20 -
            dasha_score * 0.20
        )

        if risk > 70:
            level = "High"

        elif risk > 40:
            level = "Moderate"

        else:
            level = "Low"

        return {
            "risk_score": round(risk, 2),
            "risk_level": level
        }
