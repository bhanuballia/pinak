# jaimini_pro/marriage/upapada_analysis.py
class UpapadaAnalysis:
    def calculate(self, twelfth_lord_house):
        return ((twelfth_lord_house * 2) % 12) + 1
