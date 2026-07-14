def health_analysis(chart, dosha):
    effects = []

    if dosha.get("manglik", {}).get("present"):
        effects.append(
            "Mars influence may cause stress-related health issues, inflammation, or minor "
            "injuries if physical discipline and emotional regulation are not maintained. "
            "It is advisable to engage in regular physical activity to channel this high "
            "energy productively and avoid impulsive actions that could lead to accidents."
        )

    if dosha.get("kalsarp", {}).get("present"):
        effects.append(
            "Potential energy fluctuations may affect your mental well-being and levels "
            "of vitality. You may experience periods of high drive followed by sudden "
            "sensitivity. Consistent meditation, grounding routines, and staying "
            "connected with nature are strongly advised to harmonize these patterns."
        )

    if not effects:
        return (
            "Your overall health and vitality remain stable. Your constitution is "
            "supported by balanced planetary energies, allowing for a healthy and "
            "active lifestyle. Maintaining your current disciplined routine will "
            "further enhance your long-term well-being."
        )

    return "\n\n".join(effects)

