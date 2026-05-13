def build_vector_context(report_data):

    return {
        "basic": report_data.get("basic_details", {}),
        "strength": report_data.get("strength", {}),
        "dosha": report_data.get("dosha", {}),
        "dasha": report_data.get("dasha", {}),
        "destiny": report_data.get("destiny", {}),
        "neural": report_data.get("neural_context", {}),
        "yogas": report_data.get("yogas", []),
    }
