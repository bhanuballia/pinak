def build_dimension_graphs(marriage, career, wealth):

    return {
        "marriage_score": marriage["probability"],
        "career_curve": career,
        "wealth_curve": wealth
    }
