# jaimini_system/kalachakra_dasha.py

class KalachakraDasha:
    def calculate(self, nakshatra_pada):
        wheel = []
        for i in range(9):
            wheel.append({
                "cycle": i + 1,
                "nakshatra_pada": nakshatra_pada
            })
        return wheel
