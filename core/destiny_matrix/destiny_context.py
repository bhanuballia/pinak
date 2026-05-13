def build_destiny_context(report_data):
    return {
        "chart": report_data.get("chart"),
        "dasha": report_data.get("dasha", {}),
        "dosha": report_data.get("dosha", {}),
        "strength": report_data.get("strength", {}),
        "timeline": report_data.get("timeline", []), # Fixed key
        "adaptive": report_data.get("adaptive_intelligence", {})
    }
