def build_destiny_curve(yearly):

    return [
        {"year": y["year"], "score": y["score"]}
        for y in yearly
    ]
