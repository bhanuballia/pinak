from core.life_vector.ai_topic_modules import *


def generate_ai_predictions(ctx):

    return {
        "career_finance": career_finance_prediction(ctx),
        "character_personality": personality_prediction(ctx),
        "life_purpose": purpose_prediction(ctx),
        "happiness": happiness_prediction(ctx),
        "lifestyle": lifestyle_prediction(ctx),
        "occupation": occupation_prediction(ctx),
        "health": health_prediction(ctx),
        "hobbies": hobbies_prediction(ctx),
        "relationships": relationship_prediction(ctx),
        "education": education_prediction(ctx),
        "wealth": wealth_prediction(ctx),
    }
