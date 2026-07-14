import os
from typing import Dict, Any

try:
    import google.generativeai as genai
    _HAS_GEMINI = True
except ImportError:
    _HAS_GEMINI = False
    print("[NADI EXPLAINER] Warning: google-generativeai not installed. Using fallback.")

def generate_nadi_reading(nadi_data: Dict[str, Any], gender: str = "Male") -> str:
    """
    Generates a full Bhrigu Nandi Nadi reading based on planetary yogas.
    """
    if not _HAS_GEMINI or not os.getenv("GEMINI_API_KEY"):
        return "Bhrigu Nandi Nadi analysis generated. Please configure Gemini AI for the full text reading."
        
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-flash-latest")
        
        # In BNN, Jiva (Soul) is Jupiter for Male, Venus for Female
        jiva_planet = "Jupiter" if gender.lower() == "male" else "Venus"
        
        aspects = nadi_data.get("nadi_aspects", {})
        trines = nadi_data.get("elemental_trines", {})
        
        # Prepare context for Gemini
        jiva_aspects = aspects.get(jiva_planet, {})
        saturn_aspects = aspects.get("Saturn", {}) # Karma / Career
        venus_aspects = aspects.get("Venus", {}) # Wealth / Wife (if male)
        mercury_aspects = aspects.get("Mercury", {}) # Intellect / Business
        
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

        The native is a {gender}. The Jiva (Soul/Native) is represented by {jiva_planet}.
        Karma (Profession) is represented by Saturn.
        
        Here are the calculated Nadi Yogas for this native:
        
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

        Write a comprehensive Bhrigu Nandi Nadi reading for this person. Structure it with these exact headers:
        
        ### Career
        (Analyze Saturn's connections to determine the native's career path, based on conjunct, trine, 2nd, 12th, and 7th house aspects.)

        ### Marriage Timing
        (Analyze Venus (for male) or Mars (for female) connections, and Jupiter's transit rounds to predict marriage timing.)

        ### Financial Success
        (Analyze Venus and Jupiter connections for wealth and prosperity flow.)

        ### Business vs Job
        (Look at Mercury (business/trade) vs Saturn (karma/service) strength to determine if the native is suited for business or a job.)

        ### Bad Phase Timing
        (Identify any difficult periods or blockages caused by Rahu/Ketu or afflicted Saturn.)

        ### Abroad Settlement
        (Check for connections involving Moon (travel), Rahu (foreign), and 12th from Jiva or Saturn.)

        ### Soulmate Timing
        (When will the native meet their soulmate? Analyze based on Venus/Mars and Jupiter transits.)

        ### Life Stagnation
        (Are there periods of stagnation? Look for Saturn-Ketu or Jiva-Ketu connections.)

        ### Career Suggestion
        (Provide specific career recommendations based on the strongest planets influencing Saturn.)

        ### Life Periods (Favorable Timing)
        (Break down favorable timing for Love, Career First Phase, Wealth, Marriage, and Career Second Phase using Jupiter's 12-year rounds.)

        ### Rajyoga as per BNN
        (Identify any powerful combinations like Sun+Venus, Mercury+Venus, or strong trines that create Rajyoga-like effects.)

        ### Planetary Position and Interpretations as per BNN
        (Provide a detailed breakdown of the planets, their signs, and how they interact with each other based on BNN rules.)
        
        Use a mystical yet practical, storytelling language, as if a Master is speaking to a disciple. Avoid listing raw math (e.g. don't say "because Mars is in the 2nd"), instead weave it naturally (e.g. "Because your Soul is moving towards the energy of Mars, you will show immense courage in your future endeavors").
        """
        
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[NADI EXPLAINER] AI reading failed: {e}")
        return f"Could not generate AI reading. Error: {str(e)}"

def generate_nadi_qa_reading(nadi_data: Dict[str, Any], gender: str, question: str) -> str:
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
        
        # Prepare context for Gemini
        jiva_aspects = aspects.get(jiva_planet, {})
        saturn_aspects = aspects.get("Saturn", {})
        venus_aspects = aspects.get("Venus", {})
        mercury_aspects = aspects.get("Mercury", {})
        mars_aspects = aspects.get("Mars", {})
        moon_aspects = aspects.get("Moon", {})
        
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

        The native is a {gender}. The Jiva (Soul/Native) is represented by {jiva_planet}.
        
        Here are the calculated Nadi Yogas for this native:
        
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

