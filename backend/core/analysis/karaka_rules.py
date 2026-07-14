"""
backend/core/analysis/karaka_rules.py

Rule engine for analyzing cross-chart relationships, particularly for Karakas
and Bhava Lords as described in Brihat Parashara Hora Shastra (BPHS).
"""

def evaluate_planet_strength_across_vargas(planet_name: str, rasi_dignity: str, navamsha_dignity: str, is_vargottama: bool) -> dict:
    """
    Evaluates the true strength of a planet by comparing its D-1 and D-9 dignities,
    including the powerful Vargottama state.
    """
    strong_dignities = ["EXALTED", "MOOLATRIKONA", "OWN_SIGN"]
    weak_dignities = ["DEBILITATED", "ENEMY", "GREAT_ENEMY"]
    
    r_dig = rasi_dignity.upper().replace(" ", "_") if rasi_dignity else "NEUTRAL"
    n_dig = navamsha_dignity.upper().replace(" ", "_") if navamsha_dignity else "NEUTRAL"

    if is_vargottama:
        if r_dig in strong_dignities:
            return {"status": "Exceptionally Strong", "text": f"{planet_name} is Vargottama and in good dignity. This makes it supremely powerful and capable of giving excellent results."}
        elif r_dig in weak_dignities:
            return {"status": "Vargottama (Weak)", "text": f"{planet_name} is Vargottama but debilitated/weak. It gives intense inner resilience after initial struggles."}
        else:
            return {"status": "Vargottama", "text": f"{planet_name} is Vargottama, giving it the strength of an exalted planet regardless of its sign."}

    if r_dig in strong_dignities and n_dig in strong_dignities:
        return {"status": "Very Strong", "text": f"{planet_name} is strong in both Rasi and Navamsha charts, ensuring stable and highly favorable outcomes."}
    
    if r_dig in strong_dignities and n_dig in weak_dignities:
        return {"status": "Deceptive Strength", "text": f"{planet_name} appears strong in the birth chart but lacks inner strength in Navamsha. Early success may fade or lack deep fulfillment."}

    if r_dig in weak_dignities and n_dig in strong_dignities:
        return {"status": "Hidden Strength", "text": f"{planet_name} appears weak initially, but has great inner strength in Navamsha. Success comes later through persistence."}

    if r_dig in weak_dignities and n_dig in weak_dignities:
        return {"status": "Very Weak", "text": f"{planet_name} is weak in both charts, requiring significant remedial measures to overcome challenges in its domain."}

    return {"status": "Average", "text": f"{planet_name} has mixed or average strength across charts."}

def analyze_bhava_lord_in_varga(bhava_name: str, lord_name: str, varga_name: str, varga_dignity: str, is_vargottama: bool) -> str:
    """
    Generates a rule-based interpretation for a house lord placed in a specific Varga.
    Example: 7th Lord in D-9.
    """
    strong_dignities = ["EXALTED", "MOOLATRIKONA", "OWN_SIGN"]
    v_dig = varga_dignity.upper().replace(" ", "_") if varga_dignity else "NEUTRAL"
    
    if is_vargottama:
        return f"The {bhava_name} lord ({lord_name}) is Vargottama in the {varga_name} chart. The foundation of this area of life is exceptionally strong and resilient."
        
    if v_dig in strong_dignities:
        return f"The {bhava_name} lord ({lord_name}) is well-placed in the {varga_name} chart, ensuring positive growth and stability in this domain."
        
    if v_dig == "DEBILITATED":
        return f"The {bhava_name} lord ({lord_name}) is debilitated in the {varga_name} chart. This indicates deep-rooted challenges or delays that need patience to resolve."
        
    return ""
