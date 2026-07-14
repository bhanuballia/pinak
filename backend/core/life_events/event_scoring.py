def event_intensity(score):

    if score > 80:
        return 0.9
    elif score > 60:
        return 0.7
    elif score > 40:
        return 0.5
    else:
        return 0.3
