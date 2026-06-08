# backend/dashboard/timeline_visualizer.py

class TimelineVisualizer:
    def format_timeline(self, predictions: list):
        """
        Convert prediction items into standard timeline node formats for visualization.
        """
        nodes = []
        for index, p in enumerate(predictions):
            nodes.append({
                "id": f"node_{index}",
                "timestamp": p.get("date", "2026-05-20"),
                "title": p.get("event_type", "Astrological Event"),
                "subtitle": p.get("planet", "Unknown Planet"),
                "content": p.get("description", ""),
                "weight": p.get("impact_score", 50),
                "meta": {
                    "house": p.get("house"),
                    "sign": p.get("sign")
                }
            })
        # Sort nodes chronologically
        nodes.sort(key=lambda x: x["timestamp"])
        return nodes
