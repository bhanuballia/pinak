import os

os.makedirs("jaimini_system", exist_ok=True)

files = {
    "__init__.py": """# jaimini_system/__init__.py

from .chara_dasha import CharaDasha
from .karaka_engine import KarakaEngine
""",
    "sign_direction.py": """# jaimini_system/sign_direction.py

ODD_SIGNS = [1, 3, 5, 7, 9, 11]
EVEN_SIGNS = [2, 4, 6, 8, 10, 12]

class SignDirection:
    @staticmethod
    def is_forward(sign):
        return sign in ODD_SIGNS

    @staticmethod
    def next_sign(current, forward=True):
        if forward:
            return ((current) % 12) + 1
        return ((current - 2) % 12) + 1
""",
    "karaka_engine.py": """# jaimini_system/karaka_engine.py

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
""",
    "rashi_strength.py": """# jaimini_system/rashi_strength.py

class RashiStrength:
    def calculate_strength(self, sign, chart):
        score = 0
        for planet, planet_sign in chart.items():
            if planet_sign == sign:
                score += 10
        return score
""",
    "jaimini_aspects.py": """# jaimini_system/jaimini_aspects.py

MOVABLE = [1, 4, 7, 10]
FIXED = [2, 5, 8, 11]
DUAL = [3, 6, 9, 12]

class JaiminiAspects:
    def get_aspects(self, sign):
        if sign in MOVABLE:
            return FIXED
        if sign in FIXED:
            return DUAL
        return MOVABLE
""",
    "chara_dasha.py": """# jaimini_system/chara_dasha.py

from datetime import datetime, timedelta
from .sign_direction import SignDirection

class CharaDasha:
    def calculate(self, start_sign, years=12):
        result = []
        current = start_sign
        current_date = datetime.now()
        forward = SignDirection.is_forward(start_sign)

        for _ in range(years):
            next_date = current_date + timedelta(days=365)
            result.append({
                "sign": current,
                "start": current_date.date(),
                "end": next_date.date()
            })
            current = SignDirection.next_sign(current, forward)
            current_date = next_date
        return result
""",
    "sthira_dasha.py": """# jaimini_system/sthira_dasha.py

class SthiraDasha:
    DURATIONS = {
        1: 7, 2: 8, 3: 9, 4: 7, 5: 8, 6: 9,
        7: 7, 8: 8, 9: 9, 10: 7, 11: 8, 12: 9
    }

    def calculate(self, start_sign):
        result = []
        current = start_sign
        for _ in range(12):
            result.append({
                "sign": current,
                "years": self.DURATIONS[current]
            })
            current = (current % 12) + 1
        return result
""",
    "narayana_dasha.py": """# jaimini_system/narayana_dasha.py

class NarayanaDasha:
    def calculate(self, lagna_sign):
        periods = []
        for i in range(12):
            sign = ((lagna_sign + i - 1) % 12) + 1
            periods.append({
                "sign": sign,
                "years": sign
            })
        return periods
""",
    "drig_dasha.py": """# jaimini_system/drig_dasha.py

from .jaimini_aspects import JaiminiAspects

class DrigDasha:
    def calculate(self, start_sign):
        aspects = JaiminiAspects()
        return {
            "start_sign": start_sign,
            "aspected_signs": aspects.get_aspects(start_sign)
        }
""",
    "kalachakra_dasha.py": """# jaimini_system/kalachakra_dasha.py

class KalachakraDasha:
    def calculate(self, nakshatra_pada):
        wheel = []
        for i in range(9):
            wheel.append({
                "cycle": i + 1,
                "nakshatra_pada": nakshatra_pada
            })
        return wheel
""",
    "kendradi_dasha.py": """# jaimini_system/kendradi_dasha.py

KENDRAS = [1, 4, 7, 10]

class KendradiDasha:
    def calculate(self):
        return {
            "kendras": KENDRAS
        }
""",
    "shoola_dasha.py": """# jaimini_system/shoola_dasha.py

class ShoolaDasha:
    def calculate(self, sign):
        return {
            "critical_sign": sign,
            "severity": "High"
        }
""",
    "dasha_timeline.py": """# jaimini_system/dasha_timeline.py

class DashaTimeline:
    def generate(self, dasha_data):
        timeline = []
        for item in dasha_data:
            timeline.append(f"{item['sign']} -> {item.get('years', 1)} years")
        return timeline
""",
    "event_activation.py": """# jaimini_system/event_activation.py

class EventActivation:
    def activate(self, dasha_sign, transit_sign):
        return dasha_sign == transit_sign
""",
    "prediction_engine.py": """# jaimini_system/prediction_engine.py

class PredictionEngine:
    def predict(self, active_sign):
        predictions = {
            1: "Career growth",
            7: "Marriage activation",
            10: "Professional success",
            12: "Spiritual phase"
        }
        return predictions.get(active_sign, "General karmic activation")
""",
    "jaimini_ai.py": """# jaimini_system/jaimini_ai.py

class JaiminiAI:
    def analyze(self, chart):
        return {
            "summary": "Strong destiny activation visible."
        }
""",
    "dasha_visualizer.py": """# jaimini_system/dasha_visualizer.py

import matplotlib.pyplot as plt

class DashaVisualizer:
    def plot(self, dasha):
        signs = [str(d["sign"]) for d in dasha]
        years = [d.get("years", 1) for d in dasha]
        plt.figure(figsize=(10, 5))
        plt.bar(signs, years)
        plt.title("Jaimini Dasha Timeline")
        plt.xlabel("Signs")
        plt.ylabel("Years")
        plt.show()
"""
}

for filename, content in files.items():
    with open(os.path.join("jaimini_system", filename), "w") as f:
        f.write(content)

print("Created 17 files in jaimini_system/")
