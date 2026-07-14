import os
import sys
import json

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from core.knowledge.planet_house_text import planet_rich_interpretation
from utils.translator import translate_dict
import utils.translator

def patched_translate_dict(d: dict, target_lang: str) -> dict:
    if target_lang == "en" or not d:
        return d
    
    json_str = json.dumps(d, ensure_ascii=False)
    cache_key = f"{target_lang}_dict_{hash(json_str)}"
    
    if cache_key in utils.translator._cache:
        try:
            return json.loads(utils.translator._cache[cache_key])
        except:
            pass
            
    try:
        model = utils.translator.get_translator_model()
        if target_lang.lower() == "hi":
            target_lang = "Hindi"
        prompt = f"Translate ALL string values in the following JSON object into {target_lang}. Keep all the keys exactly the same in English. You MUST translate every single sentence in the values to {target_lang}, do not leave them in English. Ensure the output is valid JSON.\n\nJSON:\n{json_str}"
        print("Sending prompt to Gemini...")
        response = model.generate_content(prompt)
        print("Received response!")
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        translated_dict = json.loads(text.strip())
        
        utils.translator._cache[cache_key] = json.dumps(translated_dict, ensure_ascii=False)
        utils.translator.save_cache(utils.translator._cache)
        
        return translated_dict
    except Exception as e:
        print(f"Dictionary translation error: {e}")
        return d

# Test translating Sun
planet_effects = {}
for h_num in range(1, 13):
    planet_effects[str(h_num)] = planet_rich_interpretation("Sun", h_num)

print("Starting translation...")
translated = patched_translate_dict(planet_effects, "Hindi")
print(list(translated.keys()))
print(translated["8"]["summary"])
