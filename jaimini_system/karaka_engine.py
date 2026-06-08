# jaimini_system/karaka_engine.py

class KarakaEngine:
    KARAKAS = [
        "Atmakaraka",
        "Amatyakaraka",
        "Bhratrukaraka",
        "Matrukaraka",
        "Putrakaraka",
        "Gnatikaraka",
        "Darakaraka"
    ]

    def calculate(self, planets):
        sorted_planets = sorted(
            planets.items(),
            key=lambda x: x[1],
            reverse=True
        )
        result = {}
        for i, (planet, deg) in enumerate(sorted_planets):
            if i < len(self.KARAKAS):
                result[self.KARAKAS[i]] = planet
        return result
