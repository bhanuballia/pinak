import os
import json
import google.generativeai as genai

TRANSLATION_CACHE_FILE = os.path.join(os.path.dirname(__file__), "..", "cache", "translations.json")

def load_cache():
    if os.path.exists(TRANSLATION_CACHE_FILE):
        try:
            with open(TRANSLATION_CACHE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_cache(cache_data):
    os.makedirs(os.path.dirname(TRANSLATION_CACHE_FILE), exist_ok=True)
    with open(TRANSLATION_CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(cache_data, f, ensure_ascii=False, indent=2)

_cache = load_cache()

def get_translator_model():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment.")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-flash-latest")

def translate_text(text: str, target_lang: str) -> str:
    if target_lang == "en" or not text:
        return text
    
    # Check cache
    cache_key = f"{target_lang}_{text}"
    if cache_key in _cache:
        return _cache[cache_key]
    
    # Translate using Gemini
    try:
        model = get_translator_model()
        if target_lang.lower() == "hi":
            target_lang = "Hindi"
        prompt = f"Translate the following text into {target_lang}. Provide ONLY the translation, without any additional conversational text or quotes. Preserve formatting if any.\n\nText:\n{text}"
        response = model.generate_content(prompt)
        translated = response.text.strip()
        
        # Save to cache
        _cache[cache_key] = translated
        save_cache(_cache)
        return translated
    except Exception as e:
        print(f"Translation error: {e}")
        return text # fallback to english

def translate_dict(d: dict, target_lang: str) -> dict:
    if target_lang == "en" or not d:
        return d
    
    # Convert dict to JSON string for bulk translation to save API calls
    json_str = json.dumps(d, ensure_ascii=False)
    cache_key = f"{target_lang}_dict_{hash(json_str)}"
    
    if cache_key in _cache:
        try:
            return json.loads(_cache[cache_key])
        except:
            pass
            
    try:
        model = get_translator_model()
        if target_lang.lower() == "hi":
            target_lang = "Hindi"
        prompt = f"Translate ALL string values in the following JSON object into {target_lang}. Keep all the keys exactly the same in English. You MUST translate every single sentence in the values to {target_lang}, do not leave them in English. Ensure the output is valid JSON.\n\nJSON:\n{json_str}"
        response = model.generate_content(prompt)
        
        # Clean up response in case it contains markdown formatting
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        translated_dict = json.loads(text.strip())
        
        # Save to cache
        _cache[cache_key] = json.dumps(translated_dict, ensure_ascii=False)
        save_cache(_cache)
        
        return translated_dict
    except Exception as e:
        print(f"Dictionary translation error: {e}")
        return d # fallback to english
