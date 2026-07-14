class CompatibilityHeatmap:
    """
    Visual relationship intelligence.
    """
    def generate(self, yearly_scores):
        heatmap = []
        for year, score in yearly_scores.items():
            heatmap.append({
                "year": year,
                "score": score,
                "color": self.color(score)
            })
        return heatmap

    def color(self, score):
        if score >= 80: return "green"
        if score >= 60: return "yellow"
        return "red"
