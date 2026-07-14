# astottaramsa/career/career_analytics.py

class CareerAnalytics:

    def analyze(self, chart):

        indicators = []

        if chart.get("Saturn"):
            indicators.append(
                "Strong discipline"
            )

        if chart.get("Mercury"):
            indicators.append(
                "Business intelligence"
            )

        return indicators
