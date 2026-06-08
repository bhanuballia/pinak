# jaimini_pro/soul_karma/atmakaraka_engine.py
class AtmakarakaEngine:
    def calculate(self, planetary_degrees):
        sorted_planets = sorted(planetary_degrees.items(), key=lambda x: x[1], reverse=True)
        return { "Atmakaraka": sorted_planets[0][0], "degree": sorted_planets[0][1] }
