# sanghatta_chakra/crisis_detection.py

class CrisisDetection:

    def detect(self, score):

        if score > 80:
            return "Critical"

        if score > 60:
            return "High"

        if score > 40:
            return "Moderate"

        return "Low"
