# nakshatra/nakshatra_compatibility.py

def compatibility_score(
    boy_nak: int,
    girl_nak: int
):

    diff = abs(
        boy_nak - girl_nak
    )

    if diff <= 3:
        return 90

    if diff <= 9:
        return 75

    return 50
