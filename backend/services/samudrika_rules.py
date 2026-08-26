def get_face_reading(ratios: dict) -> dict:
    reading = {
        "face_shape": {},
        "eyes": {},
        "nose": {},
        "lips": {},
        "summary": ""
    }

    face_ratio = ratios.get("face_width_to_height", 0.75)
    eye_dist = ratios.get("eye_distance_to_width", 1.05)
    nose_len = ratios.get("nose_length_to_face", 0.27)
    lip_ratio = ratios.get("upper_to_lower_lip", 1.0)
    forehead_ratio = ratios.get("forehead_ratio", 0.33)
    jaw_ratio = ratios.get("jaw_ratio", 0.85)
    forehead_width_ratio = ratios.get("forehead_width_ratio", 0.95)
    
    # New metrics
    eb_spacing_ratio = ratios.get("eb_spacing_ratio", 1.0)
    eb_thickness_ratio = ratios.get("eb_thickness_ratio", 0.05)
    eye_size_ratio = ratios.get("eye_size_ratio", 0.3)
    nose_tip_ratio = ratios.get("nose_tip_ratio", 0.2)
    mouth_width_ratio = ratios.get("mouth_width_ratio", 0.3)
    upper_lip_ratio = ratios.get("upper_lip_ratio", 0.02)
    lower_lip_ratio = ratios.get("lower_lip_ratio", 0.02)

    # We will build a list of Deep Dive Modules
    deep_dive_modules = []

    # 1. Face Shape (6 Categories)
    shape_val = "Oval"
    planet_val = "Jupiter (Guru)"
    theme_val = "Wisdom, expansion, and balance."
    desc_val = "Your balanced face shape shows Jupiter's grace, indicating diplomacy, charm, and steady growth."
    
    if face_ratio > 0.82: # Round or Square
        if jaw_ratio > 0.85:
            shape_val = "Square"
            planet_val = "Mars (Mangal) / Saturn (Shani)"
            theme_val = "Strength, determination, and structure."
            desc_val = "A square face shape indicates strong Martian and Saturnian energy. You are practical, decisive, and possess immense willpower."
        else:
            shape_val = "Round"
            planet_val = "Moon (Chandra)"
            theme_val = "Emotional nature, intuition, and adaptability."
            desc_val = "A round face shape signifies strong lunar influence. You are naturally nurturing, sociable, and highly adaptable to your surroundings."
    elif face_ratio < 0.70:
        shape_val = "Oblong"
        planet_val = "Saturn (Shani) / Mercury (Budh)"
        theme_val = "Persistence, analytical thinking, and depth."
        desc_val = "An oblong face reflects Saturnian depth. You are likely thoughtful, analytical, and possess a strong sense of duty."
    else:
        # Oval, Heart, or Diamond
        if forehead_width_ratio > 1.0 and jaw_ratio < 0.78:
            shape_val = "Heart"
            planet_val = "Venus (Shukra) / Mercury (Budh)"
            theme_val = "Creativity, charm, and intellectual speed."
            desc_val = "A heart-shaped face is often linked to Venusian charm and Mercury's intellect. You are creative, intuitive, and possess a warm personality."
        elif forehead_width_ratio < 0.90 and jaw_ratio < 0.80:
            shape_val = "Diamond"
            planet_val = "Rahu / Mars (Mangal)"
            theme_val = "Unconventional thinking, ambition, and focus."
            desc_val = "A diamond face shape indicates a sharp, focused mind with unconventional ideas. You are driven and highly observant."
        else:
            shape_val = "Oval"
            planet_val = "Jupiter (Guru) / Sun (Surya)"
            theme_val = "Wisdom, balance, and natural leadership."
            desc_val = "An oval face is considered the most balanced, reflecting Jupiter's grace. It suggests a harmonious blend of intellect and emotion, making you diplomatic and adaptable."

    deep_dive_modules.append({
        "module_name": "Face Shape",
        "detected_value": shape_val,
        "planet": planet_val,
        "theme": theme_val,
        "description": desc_val
    })

    # 2. Forehead (Mercury)
    if forehead_ratio > 0.35:
        deep_dive_modules.append({
            "module_name": "Forehead",
            "detected_value": "High / Broad",
            "planet": "Mercury (Budh)",
            "theme": "Intelligence, learning, and planning.",
            "description": "A broad forehead represents a powerful Mercury. It shows high analytical skills, a thirst for knowledge, and strong business acumen."
        })
    elif forehead_ratio < 0.31:
        deep_dive_modules.append({
            "module_name": "Forehead",
            "detected_value": "Low / Short",
            "planet": "Mars (Mangal) / Mercury",
            "theme": "Practicality, action, and focus.",
            "description": "A shorter forehead indicates practical intelligence. You prefer hands-on experience and direct action over abstract theories."
        })
    else:
        deep_dive_modules.append({
            "module_name": "Forehead",
            "detected_value": "Proportionate",
            "planet": "Mercury (Budh)",
            "theme": "Balanced intellect and adaptability.",
            "description": "You possess a harmonious blend of theoretical knowledge and practical execution."
        })

    # 3. Eyebrow Module (Mars)
    eb_desc = ""
    if eb_thickness_ratio > 0.055:
        eb_desc = "Thick eyebrows indicate a dominant Mars, showing high energy, determination, and intense focus. "
    elif eb_thickness_ratio < 0.045:
        eb_desc = "Thinner eyebrows point to a more refined, diplomatic, and sensitive nature. "
    else:
        eb_desc = "Proportionate eyebrows show balanced determination. "
        
    if eb_spacing_ratio < 0.95:
        eb_desc += "The close spacing indicates intense concentration but potential for impatience."
    else:
        eb_desc += "The wide spacing indicates broad-mindedness and emotional independence."
        
    deep_dive_modules.append({
        "module_name": "Eyebrows",
        "detected_value": "Analyzed Thickness & Spacing",
        "planet": "Mars (Mangal)",
        "theme": "Determination, temperament, and concentration.",
        "description": eb_desc
    })

    # 4. Eye Module (Sun / Moon)
    eye_desc = ""
    if eye_size_ratio > 0.33:
        eye_desc = "Large, prominent eyes reflect a strong Moon influence, showing deep emotional sensitivity, openness, and high intuition. "
    elif eye_size_ratio < 0.28:
        eye_desc = "Smaller or deep-set eyes reflect Saturn's depth, indicating intense focus, observation skills, and a guarded inner life. "
    else:
        eye_desc = "Proportionate eyes show a balance of emotion and logic. "

    if eye_dist > 1.082:
        eye_desc += "Wide spacing grants a visionary, tolerant perspective."
    elif eye_dist < 1.072:
        eye_desc += "Close spacing grants sharp, detail-oriented focus."

    deep_dive_modules.append({
        "module_name": "Eyes",
        "detected_value": "Analyzed Size & Spacing",
        "planet": "Sun (Surya) & Moon (Chandra)",
        "theme": "Emotional nature, intuition, and perception.",
        "description": eye_desc
    })

    # 5. Nose Module (Sun / Jupiter)
    if nose_len > 0.269:
        deep_dive_modules.append({
            "module_name": "Nose",
            "detected_value": "Prominent / Long",
            "planet": "Sun (Surya)",
            "theme": "Leadership, ambition, and material tendencies.",
            "description": "A prominent nose is a classic sign of strong solar energy. It grants authority, career drive, and natural leadership abilities."
        })
    elif nose_len < 0.268:
        deep_dive_modules.append({
            "module_name": "Nose",
            "detected_value": "Short / Small",
            "planet": "Venus (Shukra)",
            "theme": "Creativity, collaboration, and resource management.",
            "description": "A smaller nose indicates a preference for teamwork and creativity over strict authoritative roles."
        })
    else:
        deep_dive_modules.append({
            "module_name": "Nose",
            "detected_value": "Proportionate",
            "planet": "Jupiter (Guru)",
            "theme": "Balanced ambition and steady growth.",
            "description": "Your nose proportions suggest a steady, structured climb in your career without overwhelming ego."
        })

    # 6. Cheeks (Mars / Venus)
    deep_dive_modules.append({
        "module_name": "Cheeks",
        "detected_value": "Analyzed Prominence",
        "planet": "Venus (Shukra) & Mars (Mangal)",
        "theme": "Vitality, social nature, and confidence.",
        "description": "Based on the width of your cheekbones relative to your face, you show a balance of Venusian charm and Martian vitality in social settings."
    })

    # 7. Lips and Mouth (Venus)
    lip_desc = ""
    if upper_lip_ratio > lower_lip_ratio * 1.1:
        lip_desc = "A thicker upper lip indicates a highly giving, generous, and emotionally expressive nature. "
    elif lower_lip_ratio > upper_lip_ratio * 1.1:
        lip_desc = "A thicker lower lip indicates a practical, security-oriented approach to relationships. "
    else:
        lip_desc = "Balanced lips show a harmonious give-and-take in relationships. "

    if mouth_width_ratio > 0.35:
        lip_desc += "A wide mouth points to extraversion and strong communication skills."
    else:
        lip_desc += "A narrower mouth points to selective, thoughtful communication."

    deep_dive_modules.append({
        "module_name": "Lips & Mouth",
        "detected_value": "Analyzed Fullness & Width",
        "planet": "Venus (Shukra)",
        "theme": "Communication, relationships, and sensuality.",
        "description": lip_desc
    })

    # 8. Chin and Jaw (Saturn / Mars)
    if jaw_ratio > 0.88:
        deep_dive_modules.append({
            "module_name": "Chin & Jaw",
            "detected_value": "Broad / Strong",
            "planet": "Mars (Mangal) & Saturn (Shani)",
            "theme": "Persistence, stability, and determination.",
            "description": "A strong, broad jawline indicates immense Martian willpower and Saturnian endurance. You can handle high pressure."
        })
    elif jaw_ratio < 0.82:
        deep_dive_modules.append({
            "module_name": "Chin & Jaw",
            "detected_value": "Narrow / Pointed",
            "planet": "Mercury (Budh)",
            "theme": "Intellect, flexibility, and practical nature.",
            "description": "A narrower jaw indicates a reliance on intellect, diplomacy, and quick thinking rather than sheer physical force."
        })
    else:
        deep_dive_modules.append({
            "module_name": "Chin & Jaw",
            "detected_value": "Proportionate",
            "planet": "Saturn (Shani)",
            "theme": "Balanced determination.",
            "description": "You possess a healthy balance of flexibility and firmness in your convictions."
        })

    # Restore old simple reading dict mappings as fallback for Classic View.
    reading["face_shape"] = {
        "trait": deep_dive_modules[0]["detected_value"],
        "description": deep_dive_modules[0]["description"]
    }
    reading["forehead"] = {
        "trait": deep_dive_modules[1]["detected_value"],
        "description": deep_dive_modules[1]["description"]
    }
    reading["eyes"] = {
        "trait": deep_dive_modules[3]["detected_value"],
        "description": deep_dive_modules[3]["description"]
    }
    reading["nose"] = {
        "trait": deep_dive_modules[4]["detected_value"],
        "description": deep_dive_modules[4]["description"]
    }
    reading["lips"] = {
        "trait": deep_dive_modules[6]["detected_value"],
        "description": deep_dive_modules[6]["description"]
    }
    reading["jaw"] = {
        "trait": deep_dive_modules[7]["detected_value"],
        "description": deep_dive_modules[7]["description"]
    }
        
    reading["summary"] = "Based on Samudrika Shastra principles, your facial features indicate a blend of traits that shape your personality and destiny. Your prominent element shapes your approach to the world, while specific features provide insights into your career potential and relationship dynamics."

    # Additional Analysis: Marriage Life
    marriage_life_analysis = ""
    if lip_ratio > 0.73:
        marriage_life_analysis = "Good marriage life expected. You are highly expressive, romantic, and nurturing, which brings natural harmony into relationships. "
        if eye_dist < 1.072:
            marriage_life_analysis += "Your close-set eyes suggest you are deeply focused on your partner, but be careful of becoming overly possessive or dependent."
        elif jaw_ratio > 0.85:
            marriage_life_analysis += "Your strong jawline indicates that while you are loving, you also stand firm on your boundaries and principles within the home."
    elif face_ratio < 0.762:
        marriage_life_analysis = "Marriage life may require conscious effort, patience, and compromise as you have a strong, independent streak. "
        if forehead_ratio > 0.35:
            marriage_life_analysis += "Your broad forehead suggests you might over-analyze relationship issues; try to lead more with your heart than your head to maintain peace."
        elif jaw_ratio > 0.85:
            marriage_life_analysis += "Your strong jaw indicates a tendency towards stubbornness, so practicing flexibility and active listening will be key to long-term harmony."
    else:
        marriage_life_analysis = "A balanced and steady marriage life is indicated. Mutual understanding and clear communication will be the foundation of your happiness. "
        if eye_dist > 1.082:
            marriage_life_analysis += "Your wide-set eyes show that you naturally give your partner plenty of space and expect the same in return, fostering a healthy, unrestrictive bond."
        else:
            marriage_life_analysis += "You handle conflicts with a calm and diplomatic approach, ensuring that minor disagreements don't escalate."
            
    reading["marriage_life"] = marriage_life_analysis

    # Additional Analysis: Career (Business vs Job)
    career_analysis = ""
    if nose_len > 0.269:
        career_analysis = "Business and independent ventures are highly recommended. You possess natural leadership, authority, and the risk-taking abilities of the Sun. "
        if forehead_ratio > 0.35:
            career_analysis += "Combined with your broad forehead (strong Mercury), you have excellent strategic vision, making you suited for tech, finance, or consulting businesses."
        elif jaw_ratio > 0.85:
            career_analysis += "Your strong jawline adds immense endurance (Saturn), meaning you can build large-scale, physical enterprises like real estate, manufacturing, or construction."
    elif nose_len < 0.268:
        career_analysis = "A Job or collaborative role is better suited for your initial career phase, as you thrive in structured team environments. "
        if face_ratio > 0.76:
            career_analysis += "Your strong Moon influence makes you exceptionally gifted in HR, counseling, hospitality, or any people-facing roles."
        else:
            career_analysis += "However, after gaining solid industry experience, your adaptability will allow you to successfully transition into your own business after age 35."
    else:
        career_analysis = "You have a highly versatile profile, equally capable of climbing the corporate ladder or running a business. "
        if forehead_ratio > 0.35 and jaw_ratio < 0.82:
            career_analysis += "Your intellect and diplomacy are your greatest assets. A career in management, law, or academia will bring you steady, uninterrupted growth."
        else:
            career_analysis += "A stable job in administration or operations is best initially, with strong potential to launch a successful entrepreneurial side-hustle after age 32."
            
    reading["career"] = career_analysis

    # Additional Analysis: Marriage Type (Love vs Arrange)
    marriage_type_analysis = ""
    if eye_dist > 1.079 and face_ratio > 0.762:
        marriage_type_analysis = "High probability of a Love Marriage. Your broad-minded nature and expressive personality (Moon/Jupiter influence) make you very open to finding your own partner. "
        if lip_ratio > 0.73:
            marriage_type_analysis += "Your highly romantic and passionate nature (Venus) means you are likely to fall in love deeply and follow your heart, regardless of societal norms."
        else:
            marriage_type_analysis += "You value an intellectual and spiritual connection first, often finding a partner through your own expansive social or professional networks."
    elif eye_dist < 1.075:
        marriage_type_analysis = "Strong indications of an Arranged Marriage or a partnership formed through family and community networks. "
        if jaw_ratio > 0.85:
            marriage_type_analysis += "Your respect for structure and tradition (Saturn) makes you comfortable trusting your family's wisdom in selecting a stable and dependable partner."
        elif forehead_ratio > 0.35:
            marriage_type_analysis += "Your analytical mind prefers the practical, vetted approach of an arranged setup over the unpredictability of modern dating."
    else:
        marriage_type_analysis = "A beautiful blend of both—likely an arranged setup that quickly turns into a strong romantic bond, or a love marriage that easily wins full family consent. "
        if lip_ratio > 0.73:
            marriage_type_analysis += "Your natural charm ensures that even in a traditional setup, romance and a deep emotional connection will bloom very quickly."
        else:
            marriage_type_analysis += "You approach partnerships with a perfectly balanced mix of emotional openness and practical family considerations."
            
    reading["marriage_type"] = marriage_type_analysis

    # Additional Analysis: Nature in Love
    love_nature_analysis = ""
    if lip_ratio > 0.732:
        love_nature_analysis = "Highly dedicated and emotionally invested in your partner. You give your all in love and prioritize deep romantic connections. "
        if eye_size_ratio > 0.32:
            love_nature_analysis += "With your large, expressive eyes (Moon), you wear your heart on your sleeve and deeply empathize with your partner's feelings."
        elif jaw_ratio > 0.85:
            love_nature_analysis += "However, your strong jaw indicates you are also fiercely protective and will stand like a rock for your loved ones during tough times."
    elif lip_ratio < 0.728:
        love_nature_analysis = "Independent and sometimes guarded. You value personal space in love and prefer actions over grand romantic words. "
        if forehead_ratio > 0.35:
            love_nature_analysis += "Your analytical mind means you often try to 'solve' relationship issues logically rather than just experiencing the emotions."
        elif eye_dist > 1.08:
            love_nature_analysis += "Your wide-set eyes indicate you need a partner who completely respects your freedom and individuality."
    else:
        love_nature_analysis = "Balanced and practical in love. You are a dependable partner who communicates clearly without making unrealistic promises. "
        if face_ratio > 0.76:
            love_nature_analysis += "Your slightly broader face adds a warm, comforting presence, making your partner feel very secure and nurtured around you."
        else:
            love_nature_analysis += "You approach romance with a steady, grounded maturity, ensuring both partners are growing together harmoniously."
            
    reading["love_nature"] = love_nature_analysis

    # Additional Analysis: Marriage Timing
    timing_analysis = ""
    if face_ratio > 0.763:
        timing_analysis = "Indications point towards an early and harmonious settlement in marriage, likely before the age of 27. "
        if lip_ratio > 0.73:
             timing_analysis += "Your highly nurturing nature suggests you may feel ready for commitment even earlier, around ages 24-25, as you naturally prioritize deep emotional connections."
        elif jaw_ratio > 0.85:
             timing_analysis += "However, your strong ambition and drive might push this timeline closer to 27 as you strive to balance your relationship desires with your personal career goals."
    elif face_ratio < 0.758:
        timing_analysis = "A slightly delayed marriage is favorable for you. Focusing on personal growth and self-discovery first will lead to a highly stable union after age 29. "
        if jaw_ratio > 0.85:
            timing_analysis += "Your strong discipline means you are likely to prioritize establishing your career and financial security first, making ages 30-32 the most ideal and fruitful time for settling down."
        elif eye_dist > 1.08:
            timing_analysis += "Your independent and visionary nature means you won't rush into societal expectations; you prefer to wait patiently for a truly spiritually aligned partner."
    else:
        timing_analysis = "Standard timing for marriage, typically aligning naturally with your career stability around ages 27-29. "
        if forehead_ratio > 0.34:
             timing_analysis += "Your analytical and logical mind ensures you will weigh all pros and cons carefully before making any permanent, long-term commitment."
        else:
             timing_analysis += "You are likely to transition smoothly and naturally into married life once you feel a baseline level of comfort in your professional journey."
             
    reading["marriage_timing"] = timing_analysis

    # Additional Analysis: Wealth Prospects
    if nose_len > 0.269:
        reading["wealth_prospects"] = "Strong indications of substantial wealth accumulation, particularly through independent ventures, investments, or real estate."
    elif nose_len < 0.268:
        reading["wealth_prospects"] = "Financial stability comes through steady, consistent savings rather than sudden windfalls. You are very prudent with resources."
    else:
        reading["wealth_prospects"] = "A balanced financial life. You will have comfortable wealth, often tied to your professional network and consistent career growth."

    # Elements Score generation for Radar Chart
    # Baseline 50, modify based on features
    fire_score = 50 + (nose_len - 0.33) * 200
    water_score = 50 + (face_ratio - 0.75) * 100 + (lip_ratio - 1.0) * 30
    earth_score = 50 + (1.0 - face_ratio) * 100
    air_score = 50 + (eye_dist - 1.0) * 100

    # Normalize between 10 and 100
    fire_score = max(10, min(100, int(fire_score)))
    water_score = max(10, min(100, int(water_score)))
    earth_score = max(10, min(100, int(earth_score)))
    air_score = max(10, min(100, int(air_score)))

    reading["elements_score"] = [
        {"element": "Fire (Agni)", "value": fire_score},
        {"element": "Water (Jala)", "value": water_score},
        {"element": "Earth (Prithvi)", "value": earth_score},
        {"element": "Air (Vayu)", "value": air_score}
    ]

    # Planetary Analysis
    strong_planets = []
    weak_planets = []
    
    if lip_ratio > 0.735:
        strong_planets.append("Venus (Shukra) - Indicates excellent relationship, charm, & luxury prospects.")
    elif lip_ratio < 0.725:
        weak_planets.append("Venus (Shukra) - Indicates a need for conscious effort and patience in relationships.")
        
    if nose_len > 0.269:
        strong_planets.append("Sun (Surya) - Shows strong authority, career success, and natural leadership.")
        strong_planets.append("Mars (Mangal) - Indicates high drive, courage, and ambition.")
    elif nose_len < 0.268:
        weak_planets.append("Sun (Surya) - Indicates a preference for collaboration over strict solitary authority.")
        
    if face_ratio > 0.76:
        strong_planets.append("Moon (Chandra) - Highly intuitive, empathetic, and possesses great emotional intelligence.")
    elif face_ratio < 0.74:
        strong_planets.append("Saturn (Shani) - Deeply analytical, structured, hardworking, and disciplined.")
        weak_planets.append("Moon (Chandra) - Emotional expression might sometimes be suppressed by pure logic.")
        
    if eye_dist > 1.082:
        strong_planets.append("Jupiter (Guru) - Possesses broad vision, wisdom, tolerance, and good fortune.")
    elif eye_dist < 1.072:
        strong_planets.append("Mercury (Budh) - Has high attention to detail, sharp intellect, and great focus.")
        weak_planets.append("Jupiter (Guru) - May sometimes over-analyze details and miss the broader perspective.")

    # Ensure we always have at least some data
    if not strong_planets:
        strong_planets.append("Mercury (Budh) - Balanced intellect, good communication, and adaptability.")
    if not weak_planets:
        weak_planets.append("None prominent - Your planetary influences are highly balanced and stable.")

    reading["planetary_strength"] = {
        "strong": strong_planets,
        "weak": weak_planets
    }

    # Generate Detailed Vedic Analysis dynamically
    core_nature = []
    career_scores = {
        "Leadership": 50,
        "Communication": 50,
        "Creativity": 50,
        "Analysis": 50,
        "Entrepreneurship": 50,
        "Public-facing": 50
    }
    strengths = []
    challenges = []
    remedies = []

    # Map from the ratios and generated reading
    if forehead_ratio > 0.35:
        core_nature.append("Highly analytical and intellectually driven.")
        career_scores["Analysis"] += 30
        career_scores["Communication"] += 20
        strengths.append("Sharp intellect and business acumen")
    elif forehead_ratio < 0.31:
        core_nature.append("Action-oriented and practical in approach.")
        career_scores["Entrepreneurship"] += 20
        challenges.append("May act impulsively without over-planning")
        remedies.append({"theme": "Impulsiveness", "action": "Practice mindfulness and deliberate planning."})
    else:
        core_nature.append("Balanced approach combining thought and action.")
        career_scores["Communication"] += 10
        career_scores["Analysis"] += 10

    if jaw_ratio > 0.88:
        core_nature.append("Strong-willed, determined, and highly enduring.")
        career_scores["Leadership"] += 30
        career_scores["Entrepreneurship"] += 15
        strengths.append("Courage and high physical/mental endurance")
    elif jaw_ratio < 0.82:
        core_nature.append("Intuitive and relies on diplomacy.")
        career_scores["Analysis"] += 15
        career_scores["Public-facing"] += 15
        challenges.append("May struggle with physical endurance under pressure")
        remedies.append({"theme": "Endurance", "action": "Engage in regular physical exercise to build stamina."})
    else:
        strengths.append("Adaptable and knows when to stand firm")

    if nose_len > 0.269:
        core_nature.append("Authoritative and naturally ambitious.")
        career_scores["Leadership"] += 20
        career_scores["Entrepreneurship"] += 25
        strengths.append("Natural leadership and authority")
    elif nose_len < 0.268:
        core_nature.append("Collaborative and prefers shared experiences.")
        career_scores["Creativity"] += 25
        career_scores["Public-facing"] += 20
        challenges.append("May avoid taking strict leadership roles")
        remedies.append({"theme": "Leadership", "action": "Take small initiatives to build confidence in leading."})
    else:
        strengths.append("Balanced ambition")

    if face_ratio > 0.76:
        core_nature.append("Highly empathetic and emotionally intelligent.")
        career_scores["Creativity"] += 20
        career_scores["Public-facing"] += 25
        strengths.append("Emotional intelligence and adaptability")
    elif face_ratio < 0.74:
        core_nature.append("Deeply analytical and structured.")
        career_scores["Analysis"] += 25
        career_scores["Leadership"] += 15
        challenges.append("May suppress emotional expression")
        remedies.append({"theme": "Emotional Expression", "action": "Practice openly sharing feelings with trusted ones."})
    else:
        strengths.append("Charming and diplomatic")

    # Format career scores
    formatted_career = [{"label": k, "score": min(100, v)} for k, v in career_scores.items()]
    # Sort career by score descending
    formatted_career.sort(key=lambda x: x["score"], reverse=True)

    if not remedies:
        remedies.append({"theme": "General Wellbeing", "action": "Maintain a balanced daily routine and proper sleep hygiene."})
    if not challenges:
        challenges.append("Occasional overthinking or minor stress")

    reading["detailed"] = {
        "deep_dive_modules": deep_dive_modules,
        "coreNature": core_nature,
        "career": formatted_career,
        "finance": reading.get("wealth_prospects", "Balanced financial life."),
        "marriage": reading.get("marriage_life", "Balanced marriage life."),
        "strengths": strengths,
        "challenges": challenges,
        "remedies": remedies
    }

    return reading
