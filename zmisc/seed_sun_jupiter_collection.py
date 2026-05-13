"""
Seed: Sun_Jupiter collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Jupiter Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Sun represents soul, authority, and status; Jupiter represents wisdom, growth, and prosperity.",
        "Considered an auspicious conjunction that brings strength of intellect and open-mindedness.",
        "Often leads to connections with influential personalities and social standing.",
        "Jupiter's expansion can increase the Sun's egoistic traits.",
        "Excellent for government jobs and fields related to law, counseling, and finance."
    ],
    "effects": {
        "powerfulSun": [
            "Blesses with a royal personality, wisdom, and composed behavior.",
            "Ego and self-respect are key pillars of the personality.",
            "Leads associates toward goals with an administrative and practical approach."
        ],
        "powerfulJupiter": [
            "Increases confidence through knowledge and life experiences.",
            "Symbolizes the ability to follow the correct and lawful path in life.",
            "Enables expansion of endeavors based on acquired wisdom."
        ]
    },
    "nature": {
        "positive": [
            "Confidence and authority to lead others with wisdom.",
            "Optimistic attitude and deep knowledge in professional fields.",
            "Success as professors, financial advisers, astrologers, or lecturers."
        ],
        "negative": [
            "Difficulty using creativity and knowledge for personal progress.",
            "Challenges arise if Jupiter is combust or in a malefic house.",
            "Uncertainty in ventures despite high effort and hard work."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "High esteem, honest attributes, and a strong physical constitution."
        },
        {
            "house": "2nd House",
            "effect": "Financial gains from knowledge and strong support from family."
        },
        {
            "house": "3rd House",
            "effect": "Generous spending for noble causes and efforts toward family happiness."
        },
        {
            "house": "4th House",
            "effect": "Success in education, fame, and gains from parental property."
        },
        {
            "house": "5th House",
            "effect": "Wise and learned; spiritual prosperity and earnings from creative works."
        },
        {
            "house": "6th House",
            "effect": "Good for government/medical jobs and recovery from illness, despite money losses."
        },
        {
            "house": "7th House",
            "effect": "Brings a good partner and financial support from spouse, but may cause ego clashes."
        },
        {
            "house": "9th House",
            "effect": "Fortune from father and government; earnings from high knowledge."
        },
        {
            "house": "10th House",
            "effect": "Honest and successful career leading to name, fame, and wealth."
        },
        {
            "house": "11th House",
            "effect": "Financial gains and the fulfillment of deep desires."
        },
        {
            "house": "12th House",
            "effect": "Strong spiritual inclination but may increase unnecessary expenditure."
        }
    ],
    "keywords": ["sun", "jupiter", "conjunction", "wisdom", "government job", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Sun represents soul, personality, father, king, and authority, while Jupiter is the planet of wisdom, "
        "knowledge, and prosperity. Their conjunction is highly auspicious. When beneficially connected, "
        "it results in a strong mental disposition and professional success. It grants the individual "
        "intellectual strength, financial prosperity, and potential government benefits. Nature-wise, "
        "while Jupiter brings wisdom, its expansive quality can also increase the egoistic traits of the Sun."
    ),
    "effectsDetail": {
        "powerfulSun": (
            "When the Sun dominates, it grants wisdom and a royal personality. Ego or self-respect becomes the "
            "crux of personality. You likely work hard and lead others toward goals with a positive, practical, "
            "and administrative approach."
        ),
        "powerfulJupiter": (
            "When Jupiter dominates, confidence increases through knowledge over time. Jupiter symbolizes "
            "our ability to follow the correct path and laws. We are able to expand our endeavors based "
            "on experiences acquired throughout our lifetime."
        ),
        "positiveConjunction": (
            "A positive conjunction gives authority to lead with wisdom. It blesses individuals with "
            "careers as university professors, astrologers, or financial advisers. It provides an "
            "optimistic attitude toward life."
        ),
        "negativeConjunction": (
            "A negative conjunction may lead to a lack of confidence to use one's knowledge effectively. "
            "If Jupiter is combust or in malefic houses, life brings challenges and results may not be "
            "progressive despite significant hard work."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Blesses with high esteem and a physical constitution that follows set principles."
        },
        {
            "house": "10th House",
            "detail": "Sun becomes very strong here, bringing name, fame, and wealth. Common in successful doctors and officers."
        },
        {
            "house": "4th House",
            "detail": "Excellent for educational pursuits and a comfortable, generous, luxurious lifestyle."
        }
    ]
}

async def seed():
    client = AsyncIOMotorClient(
        MONGO_URL,
        tlsCAFile=certifi.where(),
        tls=True,
        tlsAllowInvalidCertificates=True,
        tlsAllowInvalidHostnames=True
    )
    db = client["Two_Planet_Conjunction"]
    col = db["Sun_Jupiter"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Sun_Jupiter collection: document {action}.")
    print(f"     Total documents in Sun_Jupiter: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Sun_Jupiter collection...")
    asyncio.run(seed())
    print("[+] Done.")
