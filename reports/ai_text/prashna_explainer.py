import os
import re

try:
    import google.generativeai as genai
    _HAS_GEMINI = True
except ImportError:
    _HAS_GEMINI = False
    print("[PRASHNA EXPLAINER] Warning: google-generativeai not installed. Using fallback.")

def guess_target_house(question: str) -> int:
    """
    Uses Gemini AI to determine which astrological house (1-12) the question is about.
    """
    if not _HAS_GEMINI or not os.getenv("GEMINI_API_KEY"):
        # Fallback keyword logic
        q_lower = question.lower()
        if "marri" in q_lower or "partner" in q_lower or "relationship" in q_lower:
            return 7
        if "job" in q_lower or "career" in q_lower or "promot" in q_lower:
            return 10
        if "money" in q_lower or "wealth" in q_lower or "finance" in q_lower:
            return 2
        if "health" in q_lower or "sick" in q_lower or "disease" in q_lower:
            return 6
        if "child" in q_lower or "pregnan" in q_lower:
            return 5
        if "home" in q_lower or "property" in q_lower or "car" in q_lower or "vehicle" in q_lower:
            return 4
        if "loss" in q_lower or "foreign" in q_lower or "jail" in q_lower:
            return 12
        if "friend" in q_lower or "gain" in q_lower or "profit" in q_lower:
            return 11
        if "death" in q_lower or "inheritance" in q_lower or "accident" in q_lower:
            return 8
        if "religion" in q_lower or "father" in q_lower or "guru" in q_lower or "travel" in q_lower:
            return 9
        if "sibling" in q_lower or "courage" in q_lower or "short trip" in q_lower:
            return 3
        return 1 # Default to self

    try:
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-flash-latest")
        
        prompt = f"""
        You are an expert Vedic astrologer classifying a Horary (Prashna) question.
        
        Question: "{question}"
        
        Which of the 12 astrological houses does this question best map to?
        1: Self, overall state, new beginnings
        2: Wealth, savings, family, speech
        3: Siblings, courage, short trips, communication
        4: Mother, home, vehicles, property, peace
        5: Children, romance, intelligence, investments
        6: Disease, enemies, debts, litigation, pets
        7: Marriage, partnerships, business, spouse
        8: Death, inheritance, sudden events, hidden things
        9: Father, religion, long travel, luck, higher education
        10: Career, profession, status, government
        11: Gains, friends, elder siblings, fulfillment of desires
        12: Losses, foreign lands, hospitals, isolation
        
        Reply with ONLY a single integer from 1 to 12. Do not include any other text.
        """
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Extract just the number
        match = re.search(r'\d+', text)
        if match:
            num = int(match.group())
            if 1 <= num <= 12:
                return num
        return 1 # Fallback
    except Exception as e:
        print(f"[PRASHNA EXPLAINER] AI house guess failed: {e}")
        return 1 # Fallback

def generate_prashna_reading(
    question: str,
    lagna_sign: str,
    lagna_lord: str,
    target_house: int,
    target_lord: str,
    math_score: int,
    reasoning: str
) -> str:
    """
    Generates the final human-readable Yes/No/Maybe reading.
    """
    # math_score is expected to be positive for YES, negative for NO, 0 for MAYBE.
    if not _HAS_GEMINI or not os.getenv("GEMINI_API_KEY"):
        outcome = "YES" if math_score > 0 else "NO" if math_score < 0 else "MAYBE / DELAYED"
        return f"Outcome: {outcome}\nReasoning: {reasoning}"
        
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-flash-latest")
        
        outcome_str = "YES" if math_score > 0 else "NO" if math_score < 0 else "MAYBE / DELAYED"
        
        prompt = f"""
        You are an expert Vedic astrologer reading a Prashna (Horary) chart.
        
        The user asked: "{question}"
        
        Here is the mathematical analysis of the exact moment they asked the question:
        - Ascendant (Querent): {lagna_sign}
        - Ascendant Lord: {lagna_lord}
        - Target House for question: {target_house}
        - Target House Lord (Quesited): {target_lord}
        - Calculated Outcome: {outcome_str}
        - Astrological Reasoning: {reasoning}
        
        Write a compassionate, insightful 3-4 paragraph response to the user.
        Structure:
        1. Start with a clear, direct answer (Yes, No, or Maybe/Delayed).
        2. Explain the astrological reasoning beautifully, mentioning the Ascendant Lord ({lagna_lord}) and the Target Lord ({target_lord}) and how their connection (or lack thereof) leads to this outcome.
        3. End with a compassionate piece of advice for the user based on the outcome.
        
        Do not use overly complex jargon without brief context. Make it sound mystical but clear.
        """
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[PRASHNA EXPLAINER] AI reading failed: {e}")
        outcome = "YES" if math_score > 0 else "NO" if math_score < 0 else "MAYBE / DELAYED"
        return f"Outcome: {outcome}\nReasoning: {reasoning}"
