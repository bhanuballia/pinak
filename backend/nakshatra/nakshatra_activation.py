# nakshatra/nakshatra_activation.py

def activation_score(
    tara_name: str
):

    scores = {

        "Janma": 70,
        "Sampat": 90,
        "Vipat": 20,
        "Kshema": 85,
        "Pratyari": 30,
        "Sadhaka": 95,
        "Vadha": 10,
        "Mitra": 80,
        "Param Mitra": 100
    }

    return scores.get(
        tara_name,
        50
    )
