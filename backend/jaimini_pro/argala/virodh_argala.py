# jaimini_pro/argala/virodh_argala.py
class VirodhArgala:
    BLOCKING_HOUSES = { 2: 12, 4: 10, 11: 3 }
    def get_blockers(self, argala_house):
        return self.BLOCKING_HOUSES.get(argala_house)
