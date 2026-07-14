import os
import sys
import json
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))

from core.knowledge.planet_house_text import planet_rich_interpretation
from utils.translator import translate_dict

# Test translating all planets at once
rich_effects = {}
for p_name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]:
    planet_effects = {}
    for h_num in range(1, 13):
        planet_effects[str(h_num)] = planet_rich_interpretation(p_name, h_num)
    rich_effects[p_name] = planet_effects

print("Starting translation...")
translated = translate_dict(rich_effects, "Hindi")
print("Done! Keys:", list(translated.keys()))
if "Sun" in translated:
    print(translated["Sun"]["8"]["summary"])
