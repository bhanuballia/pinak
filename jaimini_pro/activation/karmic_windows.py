# jaimini_pro/activation/karmic_windows.py
class KarmicWindows:
    def generate(self, years):
        return [ { "year": y, "intensity": y % 10 } for y in years ]
