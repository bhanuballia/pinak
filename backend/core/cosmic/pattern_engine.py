from collections import Counter

def discover_patterns(dataset):

    counter = Counter()

    for row in dataset:
        key = tuple(row["features"][:10])  # core astro signature
        counter[key] += 1

    return counter.most_common(20)
