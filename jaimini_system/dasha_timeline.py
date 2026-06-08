# jaimini_system/dasha_timeline.py

class DashaTimeline:
    def generate(self, dasha_data):
        timeline = []
        for item in dasha_data:
            timeline.append(f"{item['sign']} -> {item.get('years', 1)} years")
        return timeline
