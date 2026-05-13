
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

import random

def generate_reasoning(question, qtype, chart, strength, dosha, dasha, cosmic):
    result = []
    seed = sum(ord(c) for c in question)
    random.seed(seed)
    
    # Helper to get sign and lord for a specific house
    def get_house_info(house_num):
        h = chart.get("houses", {}).get(house_num) or chart.get("houses", {}).get(str(house_num), {})
        sign_name = h.get("sign_name", "Unknown")
        planets_raw = h.get("planets", [])
        planets = [p.get("name", str(p)) if isinstance(p, dict) else str(p) for p in planets_raw]
        return sign_name, planets

    # 1. Career (10th House Focus)
    if "career" in qtype:
        sign_10, planets_10 = get_house_info(10)
        sun = _get_strength(strength, "Sun", 1.0)
        saturn = _get_strength(strength, "Saturn", 1.0)
        jupiter = _get_strength(strength, "Jupiter", 1.0)
        mercury = _get_strength(strength, "Mercury", 1.0)
        
        possibilities = []
        if planets_10:
            possibilities.append(f"Your 10th house of career contains {', '.join(planets_10)}, creating a specific professional vibration.")
        else:
            possibilities.append(f"The house of career is ruled by {sign_10}, suggesting a path aligned with its qualities.")

        if qtype == "career_growth" and jupiter > 1.1:
            possibilities.append("Jupiter's expansion suggests a period of significant professional elevation.")
        elif qtype == "career_obstacle" and saturn > 1.2:
            possibilities.append("Saturn indicates that discipline and persistence are the keys to overcoming current challenges.")
        
        if sun > 1.2:
            possibilities.append("Solar strength grants you natural authority in your workspace.")
            
        if mercury > 1.1:
            possibilities.append("Mercury's placement favors careers involving communication, technology, or trade.")
            
        # Select 2-3 unique bullets based on seed
        random.shuffle(possibilities)
        result.extend(possibilities[:min(len(possibilities), 3)])

    # 2. Relationships (7th House Focus)
    elif "relationship" in qtype:
        sign_7, planets_7 = get_house_info(7)
        venus = _get_strength(strength, "Venus", 1.0)
        moon = _get_strength(strength, "Moon", 1.0)
        mars = _get_strength(strength, "Mars", 1.0)
        
        possibilities = []
        if planets_7:
            possibilities.append(f"The presence of {', '.join(planets_7)} in your 7th house shapes your partnership dynamics.")
        else:
            possibilities.append(f"Your house of union is governed by {sign_7}, bringing its traits to your lasting bonds.")

        if qtype == "relationship_evolution" and moon > 1.1:
            possibilities.append("The Moon sign suggests your relationships will evolve through emotional deepening over time.")
        
        if venus > 1.2:
            possibilities.append("Strong Venusian energy attracts harmony and artistic connection in your personal life.")
            
        if mars > 1.1:
            possibilities.append("Martian influence indicates a need for clear communication to balance passion and harmony.")

        random.shuffle(possibilities)
        result.extend(possibilities[:min(len(possibilities), 3)])

    # 3. Finance (2nd & 11th House Focus)
    elif "finance" in qtype:
        sign_2, planets_2 = get_house_info(2)
        sign_11, planets_11 = get_house_info(11)
        jupiter = _get_strength(strength, "Jupiter", 1.0)
        mercury = _get_strength(strength, "Mercury", 1.0)
        saturn = _get_strength(strength, "Saturn", 1.0)

        possibilities = []
        if planets_2:
            possibilities.append(f"The 2nd house of wealth contains {', '.join(planets_2)}, directly impacting your saving potential.")
        if planets_11:
            possibilities.append(f"Earnings (11th house) are influenced by {', '.join(planets_11)}, indicating diverse sources of income.")
        
        if qtype == "finance_stability" and saturn > 1.1:
            possibilities.append("Saturn's structure provides a foundation for long-term financial security.")
        elif qtype == "finance_opportunity" and mercury > 1.1:
            possibilities.append("Mercury's agility helps you identify unique financial gains through trade.")

        if jupiter > 1.2:
            possibilities.append("The 'Divine Grace' of Jupiter promises abundance if you follow an ethical path.")

        random.shuffle(possibilities)
        result.extend(possibilities[:min(len(possibilities), 3)])

    # 4. Health (1st & 6th House Focus)
    elif qtype == "health":
        sign_1, planets_1 = get_house_info(1)
        sign_6, planets_6 = get_house_info(6)
        sun = _get_strength(strength, "Sun", 1.0)
        mars = _get_strength(strength, "Mars", 1.0)
        
        result.append(f"Your physical vitality (1st house) is influenced by the sign of {sign_1}.")
        if planets_6:
            result.append(f"Placements in the 6th house like {', '.join(planets_6)} suggest areas requiring mindful maintenance.")
        
        if sun > 1.2:
            result.append("Strong solar vitality provides robust recovery and high energy levels.")
        elif mars > 1.1:
            result.append("High Mars energy requires regular physical activity to maintain internal balance.")

    # 5. Destiny & Spiritual (9th & 12th House Focus)
    elif "destiny" in qtype or qtype == "spiritual":
        sign_9, planets_9 = get_house_info(9)
        sign_12, planets_12 = get_house_info(12)
        ketu = _get_strength(strength, "Ketu", 1.0)
        jupiter = _get_strength(strength, "Jupiter", 1.0)
        rahu = _get_strength(strength, "Rahu", 1.0)

        possibilities = []
        if "purpose" in qtype:
            possibilities.append(f"The 9th house of dharma, ruled by {sign_9}, points toward your true North Star.")
        if planets_12 or qtype == "spiritual":
            possibilities.append("The 12th house placements suggest a deep connection to the subconscious or spiritual realms.")
        
        if ketu > 1.2:
            possibilities.append("Prominent Ketu suggests a soul carrying ancestral wisdom and a drive for liberation.")
        if jupiter > 1.1:
            possibilities.append("Guru-element (Jupiter) provides a protective shield on your spiritual journey.")
        if rahu > 1.1:
            possibilities.append("Rahu's drive pushes you toward unconventional path-finding in this incarnation.")

        random.shuffle(possibilities)
        result.extend(possibilities[:min(len(possibilities), 3)])

    # 6. General
    else:
        score = cosmic.get("weighted_scores", {}).get("cosmic_score", 1.0)
        if score > 1.3:
            result.append("You are in a high-synchronicity phase where intentions align with cosmic timing.")
        elif score < 0.8:
            result.append("The universe signals a phase of internal consolidation and patience.")
        else:
            result.append("The current cosmic grid suggests a period of steady, balanced progress.")
        
        # Add a unique "flavor" bullet based on seed
        flavor_bullets = [
            "Observe the subtle signs appearing in your daily environment.",
            "Silence is where the deepest cosmic messages are heard.",
            "Your persistence in small duties is being noted by the universe.",
            "Look for mentors in unexpected places this week.",
            "Nature is your best guide for re-aligning your energy right now."
        ]
        result.append(flavor_bullets[seed % len(flavor_bullets)])

    # Ensure uniqueness and presence
    if not result:
        result.append("The universe signals a time of quiet preparation before the next major shift.")

    return result
