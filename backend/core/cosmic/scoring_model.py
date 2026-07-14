def cosmic_score(features, dataset):

    if not dataset:
        return 0.5

    matches = 0

    for row in dataset:
        if row["features"][:10] == features[:10]:
            matches += 1

    return min(1.0, matches / len(dataset))
