# tithi_pravesha/emotional_cycles.py

class EmotionalCycles:

    def analyze(
        self,
        moon_strength
    ):

        if moon_strength > 80:
            return "Emotionally strong year"

        if moon_strength > 60:
            return "Moderately emotional year"

        return "Sensitive emotional year"
