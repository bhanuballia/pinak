# jaimini_pro/ai/predictive_ai.py
class PredictiveAI:
    def forecast(self, activation_score):
        if activation_score > 80: return "Highly active karmic period"
        if activation_score > 50: return "Moderate activation"
        return "Low activation"
