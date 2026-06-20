from typing import Dict
import re

# Domain keywords for classification
DOMAINS = {
    "travel": ["travel", "journey", "flight", "trip", "drive", "go to", "visiting", "vacation"],
    "business": ["business", "money", "invest", "buy", "sell", "trade", "deal", "start", "launch", "work", "job", "interview", "meeting"],
    "health": ["health", "doctor", "surgery", "medicine", "treatment", "hospital", "sick", "heal"],
    "auspicious": ["marriage", "wedding", "ceremony", "puja", "auspicious", "good time", "house", "move", "shift"]
}

# Choghadiya qualities and advice matrix
# 7 Types: Amrit, Shubh, Labh, Chal, Udveg, Rog, Kaal
CHOGHADIYA_ADVICE = {
    "Amrit": {
        "quality": "Extremely Auspicious",
        "travel": "Highly recommended. Travel during Amrit brings joy and success.",
        "business": "Perfect time. Investments or new ventures started now will yield nectar-like (everlasting) results.",
        "health": "Excellent for starting treatments or recovering.",
        "auspicious": "Extremely favorable for all life ceremonies and spiritual activities.",
        "general": "This is an 'Amrit' (Nectar) period. It is one of the most powerful and auspicious times of the day for any endeavor."
    },
    "Shubh": {
        "quality": "Auspicious",
        "travel": "Very good for travel. Journeys will be safe and pleasant.",
        "business": "A highly favorable window for business, meetings, and wealth generation.",
        "health": "Good for seeking medical advice or focusing on wellness.",
        "auspicious": "Very auspicious for marriages, buying property, and spiritual events.",
        "general": "This is a 'Shubh' (Auspicious) period. Activities performed now generally bring positive and blessed outcomes."
    },
    "Labh": {
        "quality": "Auspicious",
        "travel": "Favorable. Travel is likely to bring material or personal gains.",
        "business": "Excellent for closing deals, making investments, and anything related to profit.",
        "health": "Neutral to Good. Recovery is favored.",
        "auspicious": "Favorable for purchasing assets or starting something new.",
        "general": "This is a 'Labh' (Gain) period. It is an excellent time for anything where you seek material or personal benefit."
    },
    "Chal": {
        "quality": "Neutral",
        "travel": "Favorable. 'Chal' means movement, so traveling or starting a journey is well-supported.",
        "business": "Neutral. Good for routine work, but avoid launching major, permanent ventures.",
        "health": "Neutral. Routine checkups are fine.",
        "auspicious": "Avoid for things that require permanence (like marriage or moving into a forever home).",
        "general": "This is a 'Chal' (Movement) period. It is neutral and favors activities involving motion, travel, or routine tasks."
    },
    "Udveg": {
        "quality": "Inauspicious",
        "travel": "Not recommended. Traveling now may cause anxiety, delays, or distress.",
        "business": "Avoid dealing with authorities or making risky investments. Anxiety is high.",
        "health": "Not favorable. Wait for a better time for major health decisions.",
        "auspicious": "Strictly avoid for important ceremonies or new beginnings.",
        "general": "This is an 'Udveg' (Anxiety) period. It is generally inauspicious. It is advised to avoid starting important tasks now."
    },
    "Rog": {
        "quality": "Inauspicious",
        "travel": "Strictly avoid. Journeys may encounter complications.",
        "business": "Highly unfavorable. Financial decisions may lead to losses or 'disease' in the business.",
        "health": "Do not start new medical treatments or surgeries if avoidable.",
        "auspicious": "Strictly avoid for all auspicious activities.",
        "general": "This is a 'Rog' (Disease) period. It is a highly inauspicious time. It is best used for resting or routine, unavoidable tasks."
    },
    "Kaal": {
        "quality": "Inauspicious",
        "travel": "Avoid. 'Kaal' periods can bring obstacles or losses during journeys.",
        "business": "Strictly avoid. It is considered a time of loss or 'death' of an endeavor.",
        "health": "Not favorable for medical interventions.",
        "auspicious": "Strictly avoid for all auspicious activities.",
        "general": "This is a 'Kaal' (Time/Death) period. It is highly inauspicious. Do not initiate any new or important activities during this window."
    }
}

def analyze_choghadiya_question(choghadiya_name: str, question: str) -> Dict[str, str]:
    """
    Analyzes a question and returns an Oracle response based on the active Choghadiya.
    """
    name = choghadiya_name.capitalize()
    if name not in CHOGHADIYA_ADVICE:
        return {
            "response": "The Oracle could not determine the active Choghadiya. Please try again.",
            "quality": "Unknown"
        }
        
    advice_matrix = CHOGHADIYA_ADVICE[name]
    question_lower = question.lower()
    
    # Identify domain
    matched_domain = "general"
    for domain, keywords in DOMAINS.items():
        if any(re.search(r'\b' + kw + r'\b', question_lower) for kw in keywords):
            matched_domain = domain
            break
            
    advice = advice_matrix[matched_domain]
    quality = advice_matrix["quality"]
    
    # Construct response
    response = f"**{name} Choghadiya ({quality})**\n\n{advice}"
    
    # Add a little oracle flavor
    if matched_domain != "general":
        response += f"\n\n*Overall energy:* {advice_matrix['general']}"
        
    return {
        "response": response,
        "quality": quality,
        "domain": matched_domain
    }
