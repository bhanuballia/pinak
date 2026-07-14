from ashtakavarga.ashtakavarga import compute_bhinnashtakavarga_for_positions

PLANETS = [
    "Sun","Moon","Mars","Mercury",
    "Jupiter","Venus","Saturn"
]

def compute_ashtakavarga(chart):
    planet_positions = chart.get("planet_positions")
    ascendant_deg = chart.get("ascendant_deg")

    if planet_positions is None or ascendant_deg is None:
        # Fallback if chart structure is incomplete
        return {"BAV": {p: [0]*12 for p in PLANETS}, "SAV": [0]*12}

    # Compute Bhinnashtakavarga (BAV) for all 8 donors (7 planets + Lagna)
    # The compute_bhinnashtakavarga_for_positions returns recipient-wise bindus per SIGN
    bhinn = compute_bhinnashtakavarga_for_positions(planet_positions, ascendant_deg)

    # Convert sign-wise bindus to house-wise bindus (relative to Lagna's sign)
    # ashtakavarga_engine.py seems to expect list of 12 values (houses 1..12 or signs 0..11)
    # We will provide bindus per SIGN as that's standard for BAV tables.
    bav = {}
    for p in PLANETS:
        # bhinn contains 'Sun', 'Moon', etc.
        bav[p] = bhinn.get(p, [0]*12)

    # Compute Sarvashtakavarga (SAV) - sum of all 8 donors per sign
    sav = [0]*12
    for recipient_vals in bhinn.values():
        for i in range(12):
            sav[i] += int(recipient_vals[i])

    return {
        "BAV": bav,
        "SAV": sav
    }