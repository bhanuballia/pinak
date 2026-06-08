# astottaramsa/spiritual_indicators.py

class SpiritualIndicators:

    def calculate(self, chart):

        indicators = []

        if chart.get("Jupiter"):
            indicators.append(
                "Strong Guru Influence"
            )

        if chart.get("Ketu"):
            indicators.append(
                "Moksha Tendency"
            )

        return indicators
