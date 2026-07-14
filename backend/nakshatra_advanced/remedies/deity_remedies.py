# nakshatra_advanced/remedies/deity_remedies.py

def recommend_deity(nakshatra_name: str):
    """
    Stub to return the corresponding worship deity recommendation for a Nakshatra.
    """
    deities = {
        "Ashwini": "Ganesha / Ashwini Kumaras",
        "Bharani": "Yama / Kali"
    }
    return deities.get(nakshatra_name, "Lord Shiva")
