# reports/interpretation/core.py

from .rules import *
from .dosha_effects import *
from .templates import *
from .remedies import *

def generate_ai_life_analysis(chart, dosha, dasha, strength):
    analysis = {}

    analysis["character_personality"] = personality_analysis(chart, strength)
    analysis["happiness"] = happiness_analysis(chart)
    analysis["life_purpose"] = life_purpose_analysis(chart)
    analysis["lifestyle"] = lifestyle_analysis(chart)
    analysis["career"] = career_analysis(chart, dasha)
    analysis["health"] = health_analysis(chart, dosha)
    analysis["relationships"] = relationship_analysis(chart, dosha)
    analysis["education"] = education_analysis(chart)
    analysis["finance"] = finance_analysis(chart, strength)
    analysis["hobbies"] = hobbies_analysis(chart)
    analysis["spirituality"] = spirituality_analysis(chart)
    analysis["hidden_potential"] = hidden_potential_analysis(chart)
    analysis["travel"] = travel_analysis(chart)
    analysis["siblings_and_courage"] = siblings_analysis(chart)
    analysis["parental_heritage"] = parental_analysis(chart)

    # Remedies auto-linked
    analysis["remedies"] = recommend_remedies(chart, dosha, dasha)

    return analysis
