# nakshatra_advanced/multilingual/hindi_interpretations.py

HINDI_NAKSHATRA_TEXT = {

    "Ashwini":
        "अश्विनी नक्षत्र तीव्र गति, "
        "उपचार और आरंभ का प्रतीक है।",

    "Rohini":
        "रोहिणी आकर्षण, सृजन और "
        "समृद्धि का प्रतीक है।"
}


def get_hindi_interpretation(
    nakshatra
):

    return HINDI_NAKSHATRA_TEXT.get(
        nakshatra,
        ""
    )
