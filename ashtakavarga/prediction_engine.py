# ashtakavarga/prediction_engine.py
# Event probability forecasting using dasha activation + AV transit score.

class PredictionEngine:

    def predict_event(self, dasha_active, transit_score):
        """
        Predict event probability by combining dasha and AV transit quality.

        Args:
            dasha_active (bool): whether the relevant dasha is currently running
            transit_score (int): Samudaya AV points for the transit sign

        Returns:
            dict: { "event_probability": "HIGH" | "LOW" }
        """
        if dasha_active and transit_score >= 30:
            return {"event_probability": "HIGH"}
        return {"event_probability": "LOW"}
