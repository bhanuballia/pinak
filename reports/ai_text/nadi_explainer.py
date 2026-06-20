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
        You are a Master of Bhrigu Nandi Nadi (BNN) Astrology. 
        You interpret charts strictly using Nadi principles: Planets in the same sign, trines (1,5,9), 2nd to each other, 12th to each other, and opposition (7th).
        Do NOT use Parashari houses or Ascendants in your reading. Do NOT mention Nakshatras.

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
        ### The Native's Soul & Life Path (Jiva)
        (Analyze the {jiva_planet} connections. What is their fundamental nature, drive, and major life themes based on the planets influencing {jiva_planet}?)
        
        ### Career & Karma (Saturn)
        (Analyze Saturn's connections. What type of work will they do? Will it be business or service? Are there breaks or huge successes based on Saturn's trines/2nd house?)
        
        ### Wealth & Prosperity (Venus)
        (Analyze Venus. How does money flow to them?)
        
        ### Major Life Themes
        (Look at the Elemental Groupings. Are they fiery and active, or earthy and stable? Are there any powerful combinations like Sun+Mercury or Jupiter+Venus anywhere in the chart?)
        
        Use mystical yet practical language. Avoid listing raw math (e.g. don't say "because Mars is in the 2nd"), instead weave it naturally (e.g. "Because your Soul is moving towards the energy of Mars, you will show immense courage in your future endeavors").
        """
        
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[NADI EXPLAINER] AI reading failed: {e}")
        return f"Could not generate AI reading. Error: {str(e)}"
