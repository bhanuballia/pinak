import os
import json
from typing import Dict, Any

try:
    import google.generativeai as genai
    _HAS_GEMINI = True
except ImportError:
    _HAS_GEMINI = False
    print("[NADI EXPLAINER] Warning: google-generativeai not installed. Using fallback.")

def generate_nadi_reading(nadi_data: Dict[str, Any], gender: str = "Male", age: int = None) -> Dict[str, Any]:
    """
    Generates a full Bhrigu Nandi Nadi reading based on planetary yogas.
    """
    if not _HAS_GEMINI or not os.getenv("GEMINI_API_KEY"):
        print("[NADI EXPLAINER] Missing Gemini API key or module. Using fallback reading.")
        return _generate_fallback_reading(nadi_data, gender)
        
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-flash-latest")
        
        # In BNN, Jiva (Soul) is Jupiter for Male, Venus for Female
        jiva_planet = "Jupiter" if gender.lower() == "male" else "Venus"
        
        aspects = nadi_data.get("nadi_aspects", {})
        trines = nadi_data.get("elemental_trines", {})
        retrograde_planets = nadi_data.get("retrograde_planets", [])
        sign_exchanges = nadi_data.get("sign_exchanges", [])
        transits = nadi_data.get("current_transits", {})
        special_yogas = nadi_data.get("special_yogas", [])
        d9_dignities = nadi_data.get("d9_dignities", {})
        
        # Prepare context for Gemini
        jiva_aspects = aspects.get(jiva_planet, {})
        saturn_aspects = aspects.get("Saturn", {}) # Karma / Career
        venus_aspects = aspects.get("Venus", {}) # Wealth / Wife (if male)
        mercury_aspects = aspects.get("Mercury", {}) # Intellect / Business
        
        ZODIAC_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        SIGN_LORDS = {
            "Aries": "Mars", "Scorpio": "Mars",
            "Taurus": "Venus", "Libra": "Venus",
            "Gemini": "Mercury", "Virgo": "Mercury",
            "Cancer": "Moon", "Leo": "Sun",
            "Sagittarius": "Jupiter", "Pisces": "Jupiter",
            "Capricorn": "Saturn", "Aquarius": "Saturn"
        }
        
        jiva_sign_num = jiva_aspects.get("sign", 1)
        saturn_sign_num = saturn_aspects.get("sign", 1)
        jiva_sign_name = ZODIAC_SIGNS[jiva_sign_num - 1]
        saturn_sign_name = ZODIAC_SIGNS[saturn_sign_num - 1]
        jiva_dispositor = SIGN_LORDS[jiva_sign_name]
        saturn_dispositor = SIGN_LORDS[saturn_sign_name]
        
        dispositor_text = f'''
        *** CRITICAL: DISPOSITOR THEORY (THE LANDLORD) ***
        In BNN, a planet's strength depends heavily on its Dispositor (the Lord of the sign it sits in).
        - The Jiva (Soul) is in {jiva_sign_name}. The "Landlord" of the Soul is {jiva_dispositor}. Check {jiva_dispositor}'s conjunctions and trines to see the ultimate fate and psychological state of the native.
        - Saturn (Karma/Profession) is in {saturn_sign_name}. The "Landlord" of Karma is {saturn_dispositor}. Check {saturn_dispositor}'s condition to see if the native's career will be supported or blocked.
        '''
        
        special_yogas_text = ""
        if special_yogas:
            yogas_bullet_list = '\n'.join([f"        - {y}" for y in special_yogas])
            special_yogas_text = f'''
        *** CRITICAL: NADI-SPECIFIC YOGAS (BLESSINGS & CLASHES) ***
        The native has the following specific Bhrigu Nandi Nadi combinations:
{yogas_bullet_list}
        You MUST highlight these combinations clearly in your reading and explain their deep karmic significance.
        '''
        
        d9_text = ""
        if d9_dignities:
            d9_bullet_list = '\n'.join([f"        - {p}: {s}" for p, s in d9_dignities.items()])
            d9_text = f'''
        *** CRITICAL: NAVAMSHA (D9) HIDDEN STRENGTH ***
        In BNN, the second half of life is governed by Navamsha strength. The following planets have special dignity in D9:
{d9_bullet_list}
        If a planet is weak in the main chart but Exalted/Own Sign in D9, predict a massive rise later in life.
        '''
        
        bhrigu_progression_text = ""
        if age is not None:
            progressed_sign_num = ((jiva_sign_num - 1 + int(age)) % 12) + 1
            progressed_sign_name = ZODIAC_SIGNS[progressed_sign_num - 1]
            bhrigu_progression_text = f'''
        *** CRITICAL: BHRIGU AGE PROGRESSION (CURRENT YEAR) ***
        The native is {age} years old.
        In BNN, the Jiva (Soul) progresses one sign per year. 
        This year, the native's progressed Jiva is transiting through the sign of {progressed_sign_name}.
        Look at which natal planets are in {progressed_sign_name} or aspect it to predict major events happening *this specific year*.
        '''
        
        karmic_axis = nadi_data.get("karmic_axis", {})
        karmic_axis_text = ""
        if karmic_axis:
            axis_bullet_list = ""
            for p, axis in karmic_axis.items():
                if p in [jiva_planet, "Saturn", "Venus", "Moon"]: # Only include key planets to save tokens
                    r_pos = axis.get("rahu_position_from_planet")
                    k_pos = axis.get("ketu_position_from_planet")
                    axis_bullet_list += f"\n        - {p}: Rahu is in the {r_pos}th house from it. Ketu is in the {k_pos}th house from it."
                    
            karmic_axis_text = f'''
        *** CRITICAL: DIRECTIONAL ANALYSIS (KARMIC AXIS) ***
        In BNN, planets move forward, but Nodes (Rahu/Ketu) move backward. 
        If Rahu is 2nd, 3rd, or 4th from a planet, the planet is moving TOWARDS Rahu (heading towards illusion, expansion, new karma, foreign influences).
        If Ketu is 2nd, 3rd, or 4th from a planet, the planet is moving TOWARDS Ketu (heading towards liberation, detachment, blockages, spiritual roots).
        If a Node is in the 12th from a planet, the planet has just CROSSED that Node (past karma cleared).
        Here is the relative position of the Nodes from key planets in the chart:{axis_bullet_list}
        Deeply interpret this "moving towards / moving away" directional axis for the Jiva ({jiva_planet}) and Karma (Saturn).
        '''

        
        prompt = f"""
        You are a Master of Bhrigu Nandi Nadi (BNN) Astrology, addressing your disciple.
        You interpret charts strictly using Nadi principles: Planets in the same sign (conjunctions), trines (1,5,9), 2nd to each other, 12th to each other, and opposition (7th).
        Do NOT use Parashari houses or Ascendants in your reading. Do NOT mention Nakshatras.

        Apply these strict BNN Karakatwas (Significators) to your interpretation:
        - Jupiter: The Male Native (Jiva/Soul) and Dharma.
        - Venus: The Female Native (Jiva/Soul), Wife (for males), and Wealth.
        - Saturn: Karma, Profession, and Action.
        - Sun: Father, Government, Royalty.
        - Moon: Mother, Mind, Travel, Change, Art, Fluids.
        - Mercury: Intellect, Education, Business, Speech, Trade.
        - Mars: Brothers, Husband (for females), Disputes, Machinery, Engineering, Courage.
        - Rahu: Paternal Grandfather, Past life karma (Tamasic), Foreign/Outcaste, Mouth, Expansion.
        - Ketu: Maternal Grandfather, Spiritual roots, Moksha, Austerity, Tail, Endings.

        Examples of specific combinations to use as inspiration:
        - Sun + Venus: Father is an agriculturist or amasses wealth, enjoys a royal type of living.
        - Saturn + Mercury + Mars aspect: Engineering profession or working in an educational institution.
        - Jupiter + Ketu: Deep spiritual inclination, perhaps born near a temple or holding past-life connections to religious austerities.
        - Saturn + Moon: Chandra Mouli Yoga, indicates travel, changing professions, or settling near a water body.
        - Mercury + Venus in Trine/Conjunct: High intellect, sweet tongue, potential for multiple relationships.

        Timing Principle (Jupiter's Rounds):
        Assume timing is triggered when Jupiter (the life propeller) transits over natal planets in 12-year rounds:
        - 1st round (0-12 yrs)
        - 2nd round (12-24 yrs): often impacts education (Mercury)
        - 3rd round (24-36 yrs): often impacts marriage (Venus) and career settlement (Saturn)
        - 4th round (36-48 yrs): often brings wealth or high positions if well supported.

        *** CRITICAL: RETROGRADE (VAKRI) PLANETS ***
        The following planets are Retrograde: {', '.join(retrograde_planets) if retrograde_planets else 'None'}
        In BNN, a retrograde planet MUST be treated as giving effects from the PREVIOUS house as well. 
        If Jupiter is retrograde, it carries the karma of the previous house. If Saturn is retrograde, the native will have to redo tasks and career karma is connected to the previous sign. Integrate this into your reading heavily if applicable.

        *** CRITICAL: SIGN EXCHANGE (PARIVARTANA YOGA) ***
        The following planets are in Sign Exchange: {', '.join(sign_exchanges) if sign_exchanges else 'None'}
        In BNN, when two planets exchange signs, they act as if they are placed in their own signs. This creates a very powerful link between their significations and often cancels out afflictions involving them, bringing sudden rises or destiny shifts.

        *** CRITICAL: CURRENT TRANSITS (GOCHAR) ***
        Current transiting positions for slow-moving planets (today):
        - Transit Saturn is in {transits.get('Saturn', 'Unknown')}
        - Transit Jupiter is in {transits.get('Jupiter', 'Unknown')}
        - Transit Rahu is in {transits.get('Rahu', 'Unknown')}
        - Transit Ketu is in {transits.get('Ketu', 'Unknown')}
        Use these exact transit positions to predict the native's *current year* themes. If Transit Saturn is aspecting (conjunct/trine) Natal Moon or Venus, predict accordingly.
        {bhrigu_progression_text}
        
        {karmic_axis_text}
        
        {dispositor_text}
        
        {special_yogas_text}
        
        {d9_text}

        The native is a {gender}. The Jiva (Soul/Native) is represented by {jiva_planet}.
        Karma (Profession) is represented by Saturn.
        
        Here are the calculated Nadi Yogas for this native:
        (NOTE: The planets listed in Conjunctions, Trines, etc. are strictly ordered by their exact degrees. The planet appearing FIRST has the lowest degree and will give its results EARLIER in the native's life. Pay close attention to this order.)
        
        1. JIVA (The Native's Life Path - {jiva_planet}):
           - Conjunct (Same Sign): {', '.join(jiva_aspects.get('conjunct', [])) or 'None'}
           - Trine Support (1-5-9): {', '.join(jiva_aspects.get('trine', [])) or 'None'}
           - 2nd House (Future/Moving Towards): {', '.join(jiva_aspects.get('front_2nd', [])) or 'None'}
           - 12th House (Past/Roots): {', '.join(jiva_aspects.get('rear_12th', [])) or 'None'}
           - 7th House (Opposition/Partners): {', '.join(jiva_aspects.get('opposite_7th', [])) or 'None'}

        2. KARMA (Career/Profession - Saturn):
           - Conjunct: {', '.join(saturn_aspects.get('conjunct', [])) or 'None'}
           - Trine Support: {', '.join(saturn_aspects.get('trine', [])) or 'None'}
           - 2nd House (What career leads to): {', '.join(saturn_aspects.get('front_2nd', [])) or 'None'}
           
        3. WEALTH / RELATIONSHIPS (Venus):
           - Conjunct: {', '.join(venus_aspects.get('conjunct', [])) or 'None'}
           - Trine Support: {', '.join(venus_aspects.get('trine', [])) or 'None'}

        Elemental Groupings:
        Fire (1,5,9): {', '.join(trines.get('Fire (1,5,9)', [])) or 'None'}
        Earth (2,6,10): {', '.join(trines.get('Earth (2,6,10)', [])) or 'None'}
        Air (3,7,11): {', '.join(trines.get('Air (3,7,11)', [])) or 'None'}
        Water (4,8,12): {', '.join(trines.get('Water (4,8,12)', [])) or 'None'}
        """ + """
        Write a comprehensive Bhrigu Nandi Nadi reading for this person, BUT return it STRICTLY as a JSON object matching this schema:
        
        {
            "marriageTiming": {
                "description": "string",
                "probableAgeRange": "string (e.g. 'Ages 38 - 68')",
                "type": "string (e.g. 'Love Marriage' or 'Arranged Marriage')",
                "religion": "string (e.g. 'Same Religion' or 'Other Religion/Intercaste')",
                "favorablePeriods": ["string"]
            },
            "financialSuccess": {
                "potential": "string",
                "wealthGainAge": "string (e.g. 'Age 32-35')",
                "sources": "string",
                "focus": "string"
            },
            "businessVsJob": {
                "recommendation": "string",
                "description": "string",
                "bestTiming": "string",
                "prepSteps": ["string"]
            },
            "currentPhase": {
                "type": "string (MUST format like: 'You are currently in a FAVORABLE/BAD phase for: [Topics]. This is a period of [Details].')",
                "description": "string",
                "endTiming": "string",
                "nextMajor": "string (MUST format like: 'Your next major growth period: Ages X-Y (Topic, Intensity)')",
                "remedies": ["string"]
            },
            "abroadSettlement": {
                "probability": "string",
                "favorableTiming": "string",
                "description": "string",
                "destinations": ["string"]
            },
            "soulmateTiming": {
                "probableTiming": "string",
                "description": "string",
                "recognitionSigns": ["string"]
            },
            "lifeStagnation": {
                "breakthroughTiming": "string",
                "description": "string",
                "causes": ["string"],
                "actionSteps": ["string"]
            },
            "careerSuggestions": [
                {
                    "title": "string",
                    "rating": "string (e.g. '10/10 Match')",
                    "subtitle": "string",
                    "influencedBy": ["string"],
                    "why": "string"
                }
            ],
            "health": {
                "status": "string (e.g. 'Generally Good', 'Prone to issues')",
                "description": "string",
                "proneDiseases": ["string"],
                "remedies": ["string"]
            },
            "marriageLife": {
                "quality": "string (e.g. 'Harmonious', 'Challenging')",
                "description": "string",
                "issues": ["string"],
                "strengths": ["string"]
            },
            "spirituality": {
                "level": "string (e.g. 'High', 'Moderate')",
                "description": "string",
                "karmicPath": "string"
            },
            "lifePeriods": [
                {
                    "area": "Career | Wealth | Love | Marriage",
                    "strength": "Weak | Moderate | Strong",
                    "ageStart": "number",
                    "ageEnd": "number",
                    "description": "string",
                    "activatedBy": ["string"],
                    "maximize": "string"
                }
            ],
            "rajYogas": [
                {
                    "name": "string",
                    "type": "Aspect | Conjunction",
                    "direction": "string (e.g. 'East (Fire - Dharma)')",
                    "description": "string",
                    "specificEffects": ["string"]
                }
            ]
        }
        
        Make sure the values are written in a mystical yet practical, storytelling language, as if a Master is speaking to a disciple.
        """
        
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return json.loads(response.text.strip())
    except Exception as e:
        print(f"[NADI EXPLAINER] AI reading failed: {e}")
        # Return a rule-based fallback so the UI can still display the requested sections
        return _generate_fallback_reading(nadi_data, gender)

def _generate_fallback_reading(nadi_data: Dict[str, Any], gender: str) -> Dict[str, Any]:
    """Generates a basic fallback reading if the AI API fails."""
    jiva = "Jupiter" if gender.lower() == "male" else "Venus"
    return {
        "marriageTiming": {
            "description": "Based on Venus (significator of marriage).",
            "probableAgeRange": "Ages 24 - 32",
            "type": "Arranged Marriage",
            "religion": "Same Religion",
            "favorablePeriods": ["When Jupiter transits over natal Venus", "During Venus return"]
        },
        "financialSuccess": {
            "potential": "Determined by Earth trines (2,6,10)",
            "wealthGainAge": "Age 28 - 36",
            "sources": "Linked to the planets conjunct Saturn and Venus",
            "focus": "Focus on stability and long-term investments."
        },
        "businessVsJob": {
            "recommendation": "Service/Job (Default)",
            "description": "If Saturn is influenced by Mercury, business is favored. Otherwise, steady service is indicated.",
            "bestTiming": "When Saturn crosses natal Jupiter",
            "prepSteps": ["Build a solid foundation", "Avoid risky ventures"]
        },
        "currentPhase": {
            "type": "Karmic Maturation",
            "description": "The current transits of Saturn and Jupiter are activating your natal chart. (Note: AI rate limit reached. This is a fallback reading).",
            "endTiming": "Within the next 2.5 years",
            "nextMajor": "A phase of new beginnings",
            "remedies": ["Visit a local temple", "Donate to the needy on Saturdays"]
        },
        "abroadSettlement": {
            "probability": "Moderate",
            "favorableTiming": "When Rahu or Moon connects with Jiva",
            "description": "Foreign travel is heavily influenced by Rahu and Moon in the chart.",
            "destinations": ["Places connected to past life karma"]
        },
        "soulmateTiming": {
            "probableTiming": "When Jupiter trines Venus",
            "description": "BNN indicates relationships are destined from past lives.",
            "recognitionSigns": ["Immediate familiarity", "Spiritual connection"]
        },
        "lifeStagnation": {
            "breakthroughTiming": "After Ketu's influence passes",
            "description": "Stagnation occurs when Saturn or Jiva is afflicted by Ketu.",
            "causes": ["Past life attachments", "Unresolved karma"],
            "actionSteps": ["Spiritual practices", "Letting go of old habits"]
        },
        "careerSuggestions": [
            {
                "title": "Administrative / Service",
                "rating": "8/10",
                "subtitle": "Steady growth",
                "influencedBy": ["Saturn"],
                "why": "Saturn represents duty and steady karma."
            }
        ],
        "health": {
            "status": "Generally Stable",
            "description": "Health is influenced by the condition of the Jiva planet and any malefic trines.",
            "proneDiseases": ["Stress related issues", "Joint or bone sensitivity (Saturn)"],
            "remedies": ["Regular exercise", "Dietary discipline"]
        },
        "marriageLife": {
            "quality": "Stable but Requires Effort",
            "description": "Marriage life depends heavily on Venus and its aspects. Mutual understanding is key.",
            "issues": ["Occasional misunderstandings", "Karmic adjustments"],
            "strengths": ["Commitment", "Shared responsibilities"]
        },
        "spirituality": {
            "level": "Moderate",
            "description": "Spiritual inclination grows as Saturn matures and Ketu activates.",
            "karmicPath": "Learning through practical experience and duty."
        },
        "lifePeriods": [
            {
                "area": "Career",
                "strength": "Moderate",
                "ageStart": 24,
                "ageEnd": 36,
                "description": "A period of establishing your professional foundation.",
                "activatedBy": ["Saturn"],
                "maximize": "Focus on hard work and discipline."
            }
        ],
        "rajYogas": [
            {
                "name": "Karma-Dharma Yoga",
                "type": "Basic Combination",
                "direction": "General",
                "description": "The combination of your life force and your karma indicates a structured path.",
                "specificEffects": ["Steady progress", "Learning through experience"]
            }
        ]
    }

def generate_nadi_qa_reading(nadi_data: Dict[str, Any], gender: str, question: str, age: int = None) -> str:
    """
    Answers a specific user question using Bhrigu Nandi Nadi rules.
    """
    if not _HAS_GEMINI or not os.getenv("GEMINI_API_KEY"):
        return "Bhrigu Nandi Nadi analysis generated. Please configure Gemini AI to answer questions."
        
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-flash-latest")
        
        jiva_planet = "Jupiter" if gender.lower() == "male" else "Venus"
        
        aspects = nadi_data.get("nadi_aspects", {})
        trines = nadi_data.get("elemental_trines", {})
        retrograde_planets = nadi_data.get("retrograde_planets", [])
        sign_exchanges = nadi_data.get("sign_exchanges", [])
        transits = nadi_data.get("current_transits", {})
        special_yogas = nadi_data.get("special_yogas", [])
        d9_dignities = nadi_data.get("d9_dignities", {})
        
        # Prepare context for Gemini
        jiva_aspects = aspects.get(jiva_planet, {})
        saturn_aspects = aspects.get("Saturn", {})
        venus_aspects = aspects.get("Venus", {})
        mercury_aspects = aspects.get("Mercury", {})
        mars_aspects = aspects.get("Mars", {})
        moon_aspects = aspects.get("Moon", {})
        
        ZODIAC_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        SIGN_LORDS = {
            "Aries": "Mars", "Scorpio": "Mars",
            "Taurus": "Venus", "Libra": "Venus",
            "Gemini": "Mercury", "Virgo": "Mercury",
            "Cancer": "Moon", "Leo": "Sun",
            "Sagittarius": "Jupiter", "Pisces": "Jupiter",
            "Capricorn": "Saturn", "Aquarius": "Saturn"
        }
        
        jiva_sign_num = jiva_aspects.get("sign", 1)
        saturn_sign_num = saturn_aspects.get("sign", 1)
        jiva_sign_name = ZODIAC_SIGNS[jiva_sign_num - 1]
        saturn_sign_name = ZODIAC_SIGNS[saturn_sign_num - 1]
        jiva_dispositor = SIGN_LORDS[jiva_sign_name]
        saturn_dispositor = SIGN_LORDS[saturn_sign_name]
        
        dispositor_text = f'''
        *** CRITICAL: DISPOSITOR THEORY (THE LANDLORD) ***
        In BNN, a planet's strength depends heavily on its Dispositor (the Lord of the sign it sits in).
        - The Jiva (Soul) is in {jiva_sign_name}. The "Landlord" of the Soul is {jiva_dispositor}. Check {jiva_dispositor}'s conjunctions to answer questions about the native's core fate.
        - Saturn (Karma/Profession) is in {saturn_sign_name}. The "Landlord" of Karma is {saturn_dispositor}. Check {saturn_dispositor}'s condition to answer career questions.
        '''
        
        special_yogas_text = ""
        if special_yogas:
            yogas_bullet_list = '\n'.join([f"        - {y}" for y in special_yogas])
            special_yogas_text = f'''
        *** CRITICAL: NADI-SPECIFIC YOGAS (BLESSINGS & CLASHES) ***
        The native has the following specific Bhrigu Nandi Nadi combinations:
{yogas_bullet_list}
        You MUST incorporate these combinations if they are relevant to the user's question.
        '''
        
        d9_text = ""
        if d9_dignities:
            d9_bullet_list = '\n'.join([f"        - {p}: {s}" for p, s in d9_dignities.items()])
            d9_text = f'''
        *** CRITICAL: NAVAMSHA (D9) HIDDEN STRENGTH ***
        In BNN, the second half of life is governed by Navamsha strength. The following planets have special dignity in D9:
{d9_bullet_list}
        Use this D9 strength to predict long-term outcomes for the user's question.
        '''
        
        bhrigu_progression_text = ""
        if age is not None:
            jiva_sign_num = jiva_aspects.get("sign", 1)
            progressed_sign_num = ((jiva_sign_num - 1 + int(age)) % 12) + 1
            progressed_sign_name = ZODIAC_SIGNS[progressed_sign_num - 1]
            bhrigu_progression_text = f'''
        *** CRITICAL: BHRIGU AGE PROGRESSION (CURRENT YEAR) ***
        The native is {age} years old.
        In BNN, the Jiva progresses one sign per year. 
        This year, their progressed Jiva is in {progressed_sign_name}.
        Use this to answer questions related to "when" or "this year".
        '''
        
        karmic_axis = nadi_data.get("karmic_axis", {})
        karmic_axis_text = ""
        if karmic_axis:
            axis_bullet_list = ""
            for p, axis in karmic_axis.items():
                if p in [jiva_planet, "Saturn", "Venus", "Moon", "Mercury"]:
                    r_pos = axis.get("rahu_position_from_planet")
                    k_pos = axis.get("ketu_position_from_planet")
                    axis_bullet_list += f"\n        - {p}: Rahu is in the {r_pos}th house from it. Ketu is in the {k_pos}th house from it."
                    
            karmic_axis_text = f'''
        *** CRITICAL: DIRECTIONAL ANALYSIS (KARMIC AXIS) ***
        In BNN, planets move forward, but Nodes (Rahu/Ketu) move backward. 
        If Rahu is 2nd, 3rd, or 4th from a planet, the planet is moving TOWARDS Rahu (heading towards illusion, expansion, new karma).
        If Ketu is 2nd, 3rd, or 4th from a planet, the planet is moving TOWARDS Ketu (heading towards liberation, detachment, blockages).
        If a Node is in the 12th from a planet, the planet has just CROSSED that Node.
        Here is the relative position of the Nodes from key planets in the chart:{axis_bullet_list}
        Use this directional axis to explain if the user is heading towards expansion (Rahu) or detachment/blocks (Ketu) regarding their question.
        '''

        
        prompt = f"""
        You are a Master of Bhrigu Nandi Nadi (BNN) Astrology, addressing your disciple.
        Your disciple has asked a specific question: "{question}"

        You must answer this question STRICTLY using Nadi principles: Planets in the same sign (conjunctions), trines (1,5,9), 2nd to each other, 12th to each other, and opposition (7th).
        Do NOT use Parashari houses, Ascendants, or Nakshatras.

        BNN Karakatwas:
        - Jupiter: The Male Native (Jiva/Soul)
        - Venus: The Female Native (Jiva/Soul), Wife (for males), Wealth
        - Saturn: Karma, Profession, Action
        - Sun: Father, Government, Royalty
        - Moon: Mother, Mind, Travel, Change, Art, Fluids
        - Mercury: Intellect, Education, Business, Speech, Trade
        - Mars: Brothers, Husband (for females), Disputes, Machinery, Engineering, Courage
        - Rahu: Past life karma (Tamasic), Foreign, Mouth, Expansion
        - Ketu: Spiritual roots, Moksha, Austerity, Endings, Blockages

        *** CRITICAL: RETROGRADE (VAKRI) PLANETS ***
        The following planets are Retrograde: {', '.join(retrograde_planets) if retrograde_planets else 'None'}
        In BNN, a retrograde planet MUST be treated as giving effects from the PREVIOUS house as well. 
        Integrate this deeply into your analysis if these planets are involved in answering the question.

        *** CRITICAL: SIGN EXCHANGE (PARIVARTANA YOGA) ***
        The following planets are in Sign Exchange: {', '.join(sign_exchanges) if sign_exchanges else 'None'}
        In BNN, when two planets exchange signs, they act as if they are placed in their own signs. This creates a very powerful link between their significations and often cancels out afflictions involving them, bringing sudden rises or destiny shifts.

        *** CRITICAL: CURRENT TRANSITS (GOCHAR) ***
        Current transiting positions for slow-moving planets (today):
        - Transit Saturn is in {transits.get('Saturn', 'Unknown')}
        - Transit Jupiter is in {transits.get('Jupiter', 'Unknown')}
        - Transit Rahu is in {transits.get('Rahu', 'Unknown')}
        - Transit Ketu is in {transits.get('Ketu', 'Unknown')}
        Use these exact transit positions to answer the disciple's question if it relates to current timing. Look for Transit Jupiter or Saturn crossing over relevant natal planets.
        {bhrigu_progression_text}
        
        {karmic_axis_text}
        
        {dispositor_text}
        
        {special_yogas_text}
        
        {d9_text}

        The native is a {gender}. The Jiva (Soul/Native) is represented by {jiva_planet}.
        
        Here are the calculated Nadi Yogas for this native:
        (NOTE: The planets listed in Conjunctions, Trines, etc. are strictly ordered by their exact degrees. The planet appearing FIRST has the lowest degree and will give its results EARLIER in the native's life. Pay close attention to this order.)
        
        1. JIVA (The Native's Life Path - {jiva_planet}):
           - Conjunct: {', '.join(jiva_aspects.get('conjunct', [])) or 'None'}
           - Trine (1-5-9): {', '.join(jiva_aspects.get('trine', [])) or 'None'}
           - 2nd House: {', '.join(jiva_aspects.get('front_2nd', [])) or 'None'}
           - 12th House: {', '.join(jiva_aspects.get('rear_12th', [])) or 'None'}
           - 7th House: {', '.join(jiva_aspects.get('opposite_7th', [])) or 'None'}

        2. KARMA (Saturn):
           - Conjunct: {', '.join(saturn_aspects.get('conjunct', [])) or 'None'}
           - Trine: {', '.join(saturn_aspects.get('trine', [])) or 'None'}
           - 2nd House: {', '.join(saturn_aspects.get('front_2nd', [])) or 'None'}
           
        3. WEALTH/RELATIONSHIPS (Venus):
           - Conjunct: {', '.join(venus_aspects.get('conjunct', [])) or 'None'}
           - Trine: {', '.join(venus_aspects.get('trine', [])) or 'None'}
           
        4. BUSINESS/INTELLECT (Mercury):
           - Conjunct: {', '.join(mercury_aspects.get('conjunct', [])) or 'None'}
           - Trine: {', '.join(mercury_aspects.get('trine', [])) or 'None'}

        5. EFFORT/HUSBAND (Mars):
           - Conjunct: {', '.join(mars_aspects.get('conjunct', [])) or 'None'}
           - Trine: {', '.join(mars_aspects.get('trine', [])) or 'None'}
           
        6. MIND/TRAVEL (Moon):
           - Conjunct: {', '.join(moon_aspects.get('conjunct', [])) or 'None'}
           - Trine: {', '.join(moon_aspects.get('trine', [])) or 'None'}

        Elemental Groupings:
        Fire (1,5,9): {', '.join(trines.get('Fire (1,5,9)', [])) or 'None'}
        Earth (2,6,10): {', '.join(trines.get('Earth (2,6,10)', [])) or 'None'}
        Air (3,7,11): {', '.join(trines.get('Air (3,7,11)', [])) or 'None'}
        Water (4,8,12): {', '.join(trines.get('Water (4,8,12)', [])) or 'None'}

        Based on these Nadi combinations, answer the disciple's question directly, clearly, and practically.
        Provide the astrological reasoning (e.g. "Because Saturn is trine to Venus...") but keep it conversational.
        """
        
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[NADI EXPLAINER QA] AI reading failed: {e}")
        return f"Could not generate AI answer. Error: {str(e)}"

