class D10ProfessionAI:
    """
    AI Career Prediction Layer
    Analyzes Mercury, Mars, and Venus placements to recommend career paths.
    """
    def predict(
        self,
        chart
    ):
        recommendations = []

        mercury = chart.get("Mercury")
        mars = chart.get("Mars")
        venus = chart.get("Venus")

        if mercury:
            recommendations.append("Technology")
            recommendations.append("Business")

        if mars:
            recommendations.append("Engineering")
            recommendations.append("Military")

        if venus:
            recommendations.append("Design")
            recommendations.append("Luxury Industry")

        return list(
            set(recommendations)
        )
