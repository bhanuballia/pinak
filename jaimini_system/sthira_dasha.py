# jaimini_system/sthira_dasha.py

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
