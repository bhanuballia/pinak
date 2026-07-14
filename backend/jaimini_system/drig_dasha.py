# jaimini_system/drig_dasha.py

from .jaimini_aspects import JaiminiAspects

class DrigDasha:
    def calculate(self, start_sign):
        aspects = JaiminiAspects()
        return {
            "start_sign": start_sign,
            "aspected_signs": aspects.get_aspects(start_sign)
        }
