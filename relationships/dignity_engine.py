# relationships/dignity_engine.py

COMPOUND_DIGNITY = {

    "Great Friend": 12.5,
    "Friend": 10.0,
    "Neutral": 7.5,
    "Enemy": 5.0,
    "Great Enemy": 2.5
}


def dignity_score(
    relationship
):

    return COMPOUND_DIGNITY.get(
        relationship,
        7.5
    )
