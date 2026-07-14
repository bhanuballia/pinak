# nakshatra/tara_bala.py

TARA_NAMES = [
    "Janma",
    "Sampat",
    "Vipat",
    "Kshema",
    "Pratyari",
    "Sadhaka",
    "Vadha",
    "Mitra",
    "Param Mitra"
]

def calculate_tara(
    birth_nak: int,
    current_nak: int
):

    tara_num = (
        (current_nak - birth_nak)
        % 27
    ) + 1

    tara_idx = (
        tara_num - 1
    ) % 9

    return {

        "tara_number": tara_num,
        "tara_name": TARA_NAMES[tara_idx]
    }
