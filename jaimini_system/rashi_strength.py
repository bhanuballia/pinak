# jaimini_system/rashi_strength.py

class RashiStrength:
    def calculate_strength(self, sign, chart):
        score = 0
        for planet, planet_sign in chart.items():
            if planet_sign == sign:
                score += 10
        return score
