class CareerHeatmap:
    """
    Generates a monthly career success heatmap for the professional year.
    """
    def build(self):
        months = []

        for month in range(1, 13):
            score = (month * 7) % 100

            if score >= 75:
                color = "green"
            elif score >= 45:
                color = "yellow"
            else:
                color = "red"

            months.append({
                "month": month,
                "score": score,
                "color": color
            })

        return months
