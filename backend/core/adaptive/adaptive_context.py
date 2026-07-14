def build_adaptive_context(report_data):

    return {
        "chart": report_data.get("chart"),
        "dosha": report_data.get("dosha", {}),
        "strength": report_data.get("strength", {}),
        "dasha": report_data.get("dasha", {}),
        "life_vector": report_data.get("life_vector_predictions", {}),
        "timeline": report_data.get("timeline_predictions", []),
        "yogas": report_data.get("yogas", [])
    }
