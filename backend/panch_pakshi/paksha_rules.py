# panch_pakshi/paksha_rules.py

def determine_paksha(tithi: int) -> str:
    """
    Determines Shukla or Krishna Paksha.
    """

    if tithi <= 15:
        return "Bright Half"

    return "Dark Half"
