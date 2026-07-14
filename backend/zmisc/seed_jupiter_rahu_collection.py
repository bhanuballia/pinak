"""
Seed: Jupiter_Rahu collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Jupiter-Rahu Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Jupiter represents wisdom and law; Rahu represents craving and law-breaking tendencies.",
        "A conjunction that can lead to disrespect for moral values in favor of own 'indisciplinary' laws.",
        "Grants the ability to make changes on a large scale, potentially having a global impact.",
        "Jupiter's slow, wise expansion acts as a safety net against Rahu's rash, impulsive pace.",
        "Rahu intensifies the growth of the house qualities, but often with underlying restlessness."
    ],
    "effects": {
        "powerfulJupiter": [
            "Manifests as patient, disciplinary behavior where ideas are backed by underlying wisdom.",
            "Blesses the native with a balanced way of working, making them an inspiration for others.",
            "Ensures a clear perspective and saves the person from significant setbacks in life."
        ],
        "powerfulRahu": [
            "Indicates an impulsive nature and a rash pace of action without considering consequences.",
            "Creates a veil of illusion that can lead to amplified speech and problems in personal relations.",
            "Often results in professional setbacks due to illusions about potential gains and status."
        ]
    },
    "nature": {
        "positive": [
            "Advance through wisdom with a clear direction of thoughts in all professional ventures.",
            "Possesses deep knowledge about the respective profession while maintaining a balanced tone.",
            "Benevolent Jupiter controls Rahu's pace, keeping the upcoming situation in a healthy balance."
        ],
        "negative": [
            "Creates deep illusions and a lack of confidence or clarity in perceptions.",
            "Malefic house placements can bring persistent challenges and less progressive results despite hard work.",
            "Inability to see the original character of people or the true essence of a situation."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Auspicious results; learned and well-versed, potential to be a great spiritual teacher."
        },
        {
            "house": "2nd House",
            "effect": "Rashness in speech leading to potential separation from family and loved ones."
        },
        {
            "house": "3rd House",
            "effect": "Success in ventures with fewer efforts, particularly through travel opportunities."
        },
        {
            "house": "4th House",
            "effect": "Unique creative ability and deep affection for mother; may isolate other relationships."
        },
        {
            "house": "5th House",
            "effect": "Expertise in the creative field, though a high-profile lifestyle may lead to bad habits."
        },
        {
            "house": "6th House",
            "effect": "Success in speculative business but likely to cause issues with physical health."
        },
        {
            "house": "7th House",
            "effect": "Delays in marriage and lack of happiness in professional or marital partnerships."
        },
        {
            "house": "8th House",
            "effect": "Fascination with mystic fields and research, though rivals may challenge success."
        },
        {
            "house": "9th House",
            "effect": "Endowed with refined religious inclination and a generous nature despite high status."
        },
        {
            "house": "10th House",
            "effect": "Can result in an unsuccessful career path, though the native remains a great learner."
        },
        {
            "house": "11th House",
            "effect": "Good social image and affection for children, but native may chase wealth all their life."
        },
        {
            "house": "12th House",
            "effect": "Success in careers abroad away from family, though mental health issues may arise."
        }
    ],
    "keywords": ["jupiter", "rahu", "conjunction", "guru chandal yoga", "expansion", "craving", "wisdom", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Jupiter represents refined wisdom, law, and spiritual beliefs, while Rahu represents "
        "the law-breaking craving for materialistic comfort and status. Their conjunction, "
        "often referred to as Guru-Chandal Yoga, blends expansion with intensification. While "
        "it can make a person disrespect traditional morals in favor of their own rules, it "
        "also grants the unique ability to influence society on a global scale. Jupiter’s "
        "benevolence is the key factor that saves the native from Rahu’s illusionary setbacks."
    ),
    "effectsDetail": {
        "powerfulJupiter": (
            "When Jupiter dominates, your actions are patient and wise. You act according to the "
            "demand of the situation with clear perspectives. This disciplinary attitude makes "
            "you an inspiration, as you work toward goals without the rashness typically "
            "associated with Rahu."
        ),
        "powerfulRahu": (
            "When Rahu dominates, a veil of illusion colors your perception. You may impulsively "
            "amplify your speech or actions, leading to friction in personal relationships. In "
            "professional life, this can cause setbacks if you chase illusions of gains rather "
            "than grounded reality."
        ),
        "positiveConjunction": (
            "A positive conjunction allows you to advance through clear direction and professional "
            "knowledge. Jupiter pulls the 'collar' of Rahu, forcing it to work at a controlled "
            "pace. This keeps the tone of your life in balance and allows for significant progress."
        ),
        "negativeConjunction": (
            "A negative conjunction offers knowledge but lacks the confidence to apply it "
            "effectively. You may struggle to see the true character of people or situations. "
            "Placement in malefic houses can result in hard work yielding very few progressive results."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses intellectual wisdom and can become a respected mentor or spiritual teacher, using their learned nature to guide others."
        },
        {
            "house": "9th House",
            "detail": "Auspicious placement where religious inclination remains refined; the native maintains a generous nature regardless of their successful designation."
        },
        {
            "house": "12th House",
            "detail": "Provides prosperity through foreign connections and careers away from the birthplace, though at the cost of potential mental or physical health strain."
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
    col = db["Jupiter_Rahu"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Jupiter_Rahu collection: document {action}.")
    print(f"     Total documents in Jupiter_Rahu: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Jupiter_Rahu collection...")
    asyncio.run(seed())
    print("[+] Done.")
