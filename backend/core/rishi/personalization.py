def personalize_text(report_data, user_profile):

    style = user_profile.get("style", "classical")

    if style == "modern":
        report_data["writing_style"] = "clear, modern, motivational"

    elif style == "vedic":
        report_data["writing_style"] = "classical jyotish language"

    else:
        report_data["writing_style"] = "balanced professional"

    return report_data
