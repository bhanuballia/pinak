class WeddingDateAI:
    """
    AI wedding date selector.
    """
    def evaluate(self, date_data):
        score = 0
        if date_data.get("tara_bala"): score += 20
        if date_data.get("chandrabala"): score += 20
        if date_data.get("strong_lagna"): score += 30
        if not date_data.get("malefic_affliction"): score += 30
        return {
            "score": score,
            "quality": "Excellent" if score >= 80 else "Average"
        }
