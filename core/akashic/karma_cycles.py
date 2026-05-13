def karmic_cycles(chart, dosha):

    cycles = []

    if dosha.get("kalsarp",{}).get("present"):
        cycles.append("Repetitive karmic tests linked to Rahu-Ketu axis.")

    if dosha.get("pitra",{}).get("present"):
        cycles.append("Ancestral lineage karma repeating across generations.")

    if chart.get("ketu_house"):
        cycles.append(f"Past-life mastery linked to House {chart['ketu_house']}.")

    return cycles
