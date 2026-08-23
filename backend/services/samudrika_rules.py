def get_face_reading(ratios: dict) -> dict:
    reading = {
        "face_shape": {},
        "eyes": {},
        "nose": {},
        "lips": {},
        "summary": ""
    }

    face_ratio = ratios.get("face_width_to_height", 0.75)
    if face_ratio > 0.76:
        reading["face_shape"] = {
            "trait": "Round Face (Jala/Water Element)",
            "description": "Emotional, nurturing, adaptable, and intuitive. You have a strong sense of empathy and connect easily with others."
        }
    elif face_ratio < 0.74:
        reading["face_shape"] = {
            "trait": "Long/Oblong Face (Vayu/Air Element)",
            "description": "Analytical, intellectual, and independent. You value freedom and tend to process the world through thoughts and logic."
        }
    else:
        reading["face_shape"] = {
            "trait": "Oval Face (Balanced Elements)",
            "description": "Balanced, charming, and diplomatic. You can adapt to different situations while maintaining your core principles."
        }

    eye_dist = ratios.get("eye_distance_to_width", 1.05)
    if eye_dist > 1.082:
        reading["eyes"] = {
            "trait": "Wide-Set Eyes",
            "description": "Broad-minded, visionary, and tolerant. You see the big picture and are open to diverse perspectives."
        }
    elif eye_dist < 1.072:
        reading["eyes"] = {
            "trait": "Close-Set Eyes",
            "description": "Detail-oriented, focused, and intense. You have strong concentration but can sometimes over-analyze situations."
        }
    else:
        reading["eyes"] = {
            "trait": "Balanced Eyes",
            "description": "Practical and balanced approach to life. You have a healthy mix of focus and broad perspective."
        }

    nose_len = ratios.get("nose_length_to_face", 0.27)
    if nose_len > 0.269:
        reading["nose"] = {
            "trait": "Prominent/Long Nose",
            "description": "Ambitious, authoritative, and driven. Indicates strong career prospects, business acumen, and a desire to lead."
        }
    elif nose_len < 0.268:
        reading["nose"] = {
            "trait": "Short/Small Nose",
            "description": "Creative, spontaneous, and unpretentious. You value experiences over strict authority and work well in collaborative settings."
        }
    else:
        reading["nose"] = {
            "trait": "Proportionate Nose",
            "description": "Steady career progression and a balanced approach to ambition and personal life."
        }

    lip_ratio = ratios.get("upper_to_lower_lip", 0.8)
    if lip_ratio > 0.735:
        reading["lips"] = {
            "trait": "Thicker Upper Lip",
            "description": "Expressive, generous, and emotionally giving. You place high value on relationships and communication."
        }
    elif lip_ratio < 0.725:
        reading["lips"] = {
            "trait": "Thicker Lower Lip",
            "description": "Independent, comfort-seeking, and practical in relationships. You know what you want and value security."
        }
    else:
        reading["lips"] = {
            "trait": "Balanced Lips",
            "description": "Harmonious in relationships. You balance giving and receiving well."
        }
        
    forehead_ratio = ratios.get("forehead_ratio", 0.33)
    if forehead_ratio > 0.35:
        reading["forehead"] = {
            "trait": "High, Broad Forehead",
            "description": "Indicates a strong, well-placed Mercury and Sun. You possess sharp intellect, business acumen, and a high capacity for leadership."
        }
    elif forehead_ratio < 0.31:
        reading["forehead"] = {
            "trait": "Low/Short Forehead",
            "description": "Practical and action-oriented. You prefer direct experience and hands-on work over abstract theories."
        }
    else:
        reading["forehead"] = {
            "trait": "Proportionate Forehead",
            "description": "Balanced intellect and practical wisdom. You can blend theory with execution effectively."
        }
        
    jaw_ratio = ratios.get("jaw_ratio", 0.85)
    if jaw_ratio > 0.88:
        reading["jaw"] = {
            "trait": "Strong/Square Jaw",
            "description": "Indicates a prominent Mars. You have courage, strong willpower, and high physical endurance."
        }
    elif jaw_ratio < 0.82:
        reading["jaw"] = {
            "trait": "Narrow/Pointed Jaw",
            "description": "Intellectual and intuitive. You rely on intelligence and diplomacy rather than physical force."
        }
    else:
        reading["jaw"] = {
            "trait": "Balanced Jawline",
            "description": "A good mix of determination and adaptability. You know when to stand firm and when to compromise."
        }
        
    reading["summary"] = "Based on Samudrika Shastra principles, your facial features indicate a blend of traits that shape your personality and destiny. Your prominent element shapes your approach to the world, while specific features provide insights into your career potential and relationship dynamics."

    # Additional Analysis: Marriage Life
    if lip_ratio > 0.73:
        reading["marriage_life"] = "Good marriage life expected. You are highly expressive and nurturing, which brings harmony into relationships, usually stabilizing after age 26."
    elif face_ratio < 0.762:
        reading["marriage_life"] = "Marriage life may require conscious effort and compromise. Stability and mature relationships are indicated slightly later, usually after age 30."
    else:
        reading["marriage_life"] = "Balanced marriage life. Mutual understanding will be the key to long-term happiness, generally stabilizing around age 28."

    # Additional Analysis: Career (Business vs Job)
    if nose_len > 0.269:
        reading["career"] = "Business is highly recommended for you. You possess natural leadership, authority, and risk-taking abilities. You can start your entrepreneurial journey early and see peak growth between ages 32 to 36."
    elif nose_len < 0.268:
        reading["career"] = "A Job is better suited for your initial career phase, as you thrive in collaborative and structured environments. However, after gaining experience, you can successfully transition and start your own business after age 35."
    else:
        reading["career"] = "You have a versatile profile suitable for both Job and Business. A stable job in management or administration is best initially, with strong potential to start a successful business after age 32."

    # Additional Analysis: Marriage Type (Love vs Arrange)
    if eye_dist > 1.079 and face_ratio > 0.762:
        reading["marriage_type"] = "High probability of a Love Marriage. Your broad-minded nature and expressive personality make you open to finding your own partner."
    elif eye_dist < 1.075:
        reading["marriage_type"] = "Strong indications of an Arranged Marriage or a partnership formed through family and community networks."
    else:
        reading["marriage_type"] = "A blend of both—likely an arranged setup that turns into a strong romantic bond, or a love marriage with full family consent."

    # Additional Analysis: Nature in Love
    if lip_ratio > 0.732:
        reading["love_nature"] = "Highly dedicated and emotionally invested in your partner. You give your all in love, but must be careful not to overwhelm them."
    elif lip_ratio < 0.728:
        reading["love_nature"] = "Independent and sometimes detached. You value personal space in love and might inadvertently give mixed signals or false hopes if not careful."
    else:
        reading["love_nature"] = "Balanced and practical in love. You are a dependable partner who communicates clearly without making unrealistic promises."

    # Additional Analysis: Marriage Timing
    if face_ratio > 0.763:
        reading["marriage_timing"] = "Indications point towards an early and harmonious settlement in marriage, likely before the age of 27."
    elif face_ratio < 0.758:
        reading["marriage_timing"] = "A slightly delayed marriage is favorable for you. Focusing on personal growth first will lead to a highly stable union after age 29."
    else:
        reading["marriage_timing"] = "Standard timing for marriage, typically aligning naturally with your career stability around ages 27-29."

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

    return reading
