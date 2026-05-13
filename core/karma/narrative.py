import hashlib

def get_yearly_narrative(year: int, lord: str, score: float, phase: str) -> str:
    """Generates a unique narrative for the given karmic year coordinates."""
    
    # Use a hash of the year and lord for deterministic variety
    seed = f"{year}-{lord}-{phase}"
    h = int(hashlib.md5(seed.encode()).hexdigest(), 16)
    
    narratives = [
        f"The {lord} energy this year focuses on your personal foundation. The {phase} suggests stable ground for long-term seeds.",
        f"With {lord} dominating {year}, expect a surge in social dynamics. This {phase} is ideal for building alliances.",
        f"Karmic cycles under {lord} point toward inner refinement. The {phase} indicates a period of psychological clarity.",
        f"Material growth is highlighted as {lord} aligns with your financial houses. This {phase} supports tactical investments.",
        f"Spiritual introspection becomes the primary theme in {year}. {lord}'s influence during this {phase} favors meditation.",
        f"Professional transitions are likely as {lord} impacts your career sector. Navigate this {phase} with steady resolve.",
        f"Educational pursuits and knowledge gathering are auspicious now. {lord} provides the mental agility for this {phase}.",
        f"Creativity and self-expression bloom under this {lord} cycle. Harness the {phase} to manifest your hidden talents."
    ]
    
    return narratives[h % len(narratives)]

def get_yearly_guidance(year: int, lord: str, score: float) -> str:
    """Generates diverse guidance for the year."""
    seed = f"guidance-{year}-{lord}"
    h = int(hashlib.md5(seed.encode()).hexdigest(), 16)
    
    guidance_options = [
        f"Strengthen your connection to {lord} through daily discipline. Avoid impulsive decisions in mid-{year}.",
        f"The stars suggest a path of equilibrium. Focus on your {lord}-related rituals to stabilize your energy.",
        f"Patience is your greatest ally during this cycle. The transit of {lord} suggests a waiting phase for big moves.",
        f"Bold action in {lord}'s domain will yield results. This is the year to trust your inner fire and take the lead.",
        f"Listen to your intuition regarding family matters. {lord}'s influence indicates a need for domestic harmony.",
        f"Focus on physical wellness and routine. High {lord} energy can be taxing if not grounded in healthy habits.",
        f"Collaboration is the key to unlocking {year}'s potential. Seek mentors who embody the higher traits of {lord}.",
        f"Let go of old patterns that no longer serve you. {lord} brings the energy of release and renewal this year."
    ]
    
    return guidance_options[h % len(guidance_options)]
