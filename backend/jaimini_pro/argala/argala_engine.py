# jaimini_pro/argala/argala_engine.py
class ArgalaEngine:
    ARGALA_HOUSES = [2, 4, 11]
    def calculate(self, house_positions, reference_house):
        result = []
        for h in self.ARGALA_HOUSES:
            target = ((reference_house + h - 2) % 12) + 1
            if target in house_positions:
                result.append(target)
        return result
