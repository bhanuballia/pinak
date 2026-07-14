# shadbala/shadbala_normalizer.py

MAX_RUPA = 10.0


def normalize_score(
    score,
    max_score=300
):
    """
    Normalize a raw Shadbala score (sum of 6 balas, each 0-60,
    practical max ~300) to a 0–10 Rupa scale for UI display.

    Parameters
    ----------
    score     : raw total Shadbala score (Rupas)
    max_score : ceiling used for normalization (default 300)

    Returns
    -------
    float — normalized value capped at MAX_RUPA (10.0)
    """
    if max_score == 0:
        return 0.0

    normalized = (
        score / max_score
    ) * MAX_RUPA

    return min(
        round(normalized, 2),
        MAX_RUPA
    )
