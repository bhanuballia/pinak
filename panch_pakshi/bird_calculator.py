# panch_pakshi/bird_calculator.py

def calculate_birth_bird(nakshatra_number: int, paksha: str = "Shukla") -> str:
    """
    Returns the classical birth bird based on Birth Nakshatra and Birth Paksha.
    nakshatra_number: 1 to 27
    paksha: "Shukla" / "Bright Half" or "Krishna" / "Dark Half"
    """
    # Normalize paksha string
    is_shukla = True
    if paksha and any(k in paksha.lower() for k in ["krishna", "dark", "waning"]):
        is_shukla = False

    if 1 <= nakshatra_number <= 5:
        return "Vulture" if is_shukla else "Peacock"
    elif 6 <= nakshatra_number <= 11:
        return "Owl" if is_shukla else "Cock"
    elif 12 <= nakshatra_number <= 16:
        return "Crow"
    elif 17 <= nakshatra_number <= 21:
        return "Cock" if is_shukla else "Owl"
    elif 22 <= nakshatra_number <= 27:
        return "Peacock" if is_shukla else "Vulture"
    else:
        # Fallback in case of out of range
        idx = ((nakshatra_number - 1) % 5) + 1
        standard_map = {1: "Vulture", 2: "Owl", 3: "Crow", 4: "Cock", 5: "Peacock"}
        return standard_map.get(idx, "Vulture")

