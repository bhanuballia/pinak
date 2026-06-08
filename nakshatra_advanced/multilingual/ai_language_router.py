# nakshatra_advanced/multilingual/ai_language_router.py

from nakshatra_advanced.multilingual.hindi_interpretations import get_hindi_interpretation
from nakshatra_advanced.multilingual.english_interpretations import get_english_interpretation

def route_query_by_language(nakshatra_name: str, language_code: str):
    """
    Stub to route queries to language-specific interpretation dictionaries.
    """
    if language_code.lower() == "hi":
        return get_hindi_interpretation(nakshatra_name)
    return get_english_interpretation(nakshatra_name)
