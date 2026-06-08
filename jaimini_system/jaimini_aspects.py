# jaimini_system/jaimini_aspects.py

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
