def build_confidence(neural_score, classical_strength):

    base = classical_strength / 10

    final = (base * 0.6) + (neural_score * 0.4)

    if final > 0.75:
        return "Very High"
    elif final > 0.5:
        return "High"
    elif final > 0.3:
        return "Moderate"
    else:
        return "Developing"
