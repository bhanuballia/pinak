from .neural_memory import load_memory

MAX_COMPARE = 50  # Only compare against recent entries to keep this O(1)

def neural_score(features):
    try:
        memory = load_memory()
    except Exception:
        return 0.5

    if not memory:
        return 0.5

    # Only use recent entries — avoid O(n) scan on large memory files
    recent = memory[-MAX_COMPARE:]

    similarity_sum = 0
    for row in recent:
        past = row.get("features") or []
        similarity = sum(
            1 for i in range(len(features))
            if i < len(past) and past[i] == features[i]
        )
        similarity_sum += similarity

    return min(1.0, similarity_sum / (len(recent) * 10 + 1))
