def neural_style(prediction_text, neural_score):

    if neural_score > 0.7:
        prefix = "Strong planetary alignment indicates: "
    elif neural_score > 0.4:
        prefix = "Astrological trends suggest: "
    else:
        prefix = "Potential tendencies may include: "

    return prefix + prediction_text
