from .jaimini_aspects import JaiminiAspects

class DrigDasha:
    def __init__(self, chart=None):
        self.chart = chart or {}

    def calculate(self, start_sign):
        aspects = JaiminiAspects(self.chart)
        sign_name = start_sign if isinstance(start_sign, str) else JaiminiAspects.SIGNS[(start_sign - 1) % 12]
        return {
            "start_sign": start_sign,
            "aspected_signs": aspects.get_aspecting_signs(sign_name)
        }
