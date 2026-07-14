
def generate_wealth_report(data):
    """
    Synthesizes technical wealth data into a structured narrative.
    """
    score = data.get("score", 50)
    income = data.get("income_type", "Mixed")
    timeline = data.get("timeline", [])
    yogas = data.get("yogas", [])
    
    paragraphs = []
    
    # --- Overall Capacity ---
    if score > 80:
        paragraphs.append("Your astrological blueprint indicates an extraordinary capacity for wealth accumulation. You possess the rare 'Yogas' that transform effort into significant material success.")
    elif score > 65:
        paragraphs.append("You have a very strong financial foundation. Your chart suggests that prosperity will flow consistently, especially when you align your actions with your natural professional strengths.")
    elif score > 50:
        paragraphs.append("Financial growth for you is characterized by steady progress. While you may not see overnight windfalls, your long-term asset building potential is solid.")
    else:
        paragraphs.append("Your financial path emphasizes the need for disciplined planning and risk mitigation. Success is achieved through careful management rather than speculative ventures.")

    # --- Income Structure ---
    income_map = {
        "Job": "structured employment and hierarchical roles",
        "Business": "entrepreneurial ventures, trade, and independent consulting",
        "Mixed": "a hybrid path combining stable employment with independent income streams"
    }
    paragraphs.append(f"The planetary alignment suggests that your wealth is most effectively generated through {income_map.get(income, 'diverse channels')}.")

    # --- Strategic Timeline ---
    high_gain_years = [str(y["year"]) for y in timeline if y["label"] == "High Gain"]
    risk_years = [str(y["year"]) for y in timeline if y["label"] == "Risk"]
    
    timeline_text = []
    if high_gain_years:
        timeline_text.append(f"Strategic expansion is highly favored during {', '.join(high_gain_years[:3])}.")
    if risk_years:
        timeline_text.append(f"Conversely, exercise financial caution and avoid major investments in {', '.join(risk_years[:2])}.")
    
    if timeline_text:
        paragraphs.append(" ".join(timeline_text))

    return "\n\n".join(paragraphs)
