# backend/muhurat/electional_engine.py

class ElectionalEngine:
    def evaluate_activity(self, activity_type: str, day_of_week: int, tithi: int, active_planets: list):
        """
        Evaluate general auspicious timings for Business, Travel, or Asset purchase.
        """
        score = 70
        reasons = []
        
        # Day indices: 1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri, 7=Sat
        if activity_type.lower() == "business":
            if day_of_week in [4, 5, 6]: # Wed, Thu, Fri are great
                score += 15
                reasons.append("Auspicious weekday for commercial undertakings.")
            elif day_of_week == 3: # Tuesday
                score -= 20
                reasons.append("Tuesday is ruled by Mars; generally avoided for starting business.")
                
            if tithi in [4, 9, 14]: # Rikta Tithis are avoided
                score -= 30
                reasons.append("Occurs during a Rikta (Empty) Tithi; highly inauspicious.")
            else:
                score += 10
                
        elif activity_type.lower() == "travel":
            if day_of_week in [2, 4, 5, 6]: # Mon, Wed, Thu, Fri are good
                score += 10
                reasons.append("Stable planetary weekday for journeys.")
            if tithi in [8, 11, 15]: # Ashtami, Ekadashi, Purnima are excellent for spiritual or general travel
                score += 10
                
        elif activity_type.lower() == "asset_purchase":
            if day_of_week in [5, 6]: # Jupiter (Thu) and Venus (Fri) are excellent
                score += 20
                reasons.append("Day ruled by Jupiter or Venus, perfect for wealth acquisition.")
                
        score = max(0, min(100, score))
        return {
            "activity": activity_type,
            "score": score,
            "status": "Auspicious" if score >= 75 else "Neutral" if score >= 50 else "Inauspicious",
            "notes": reasons
        }
