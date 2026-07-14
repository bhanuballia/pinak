"""
Seed: Moon_Ketu collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Ketu Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Moon represents emotions and imagination; Ketu represents ancient knowledge and detachment.",
        "A conjunction of inner conflict that often transforms into a profound spiritual inner journey.",
        "Grants a unique, intuitive personality that may follow a lifestyle different from family or society.",
        "Indicates a strong connection to research, medical sectors, and ancient spiritual activities.",
        "Challenges often arise in love and marital life due to emotional detachment or self-centeredness."
    ],
    "effects": {
        "powerfulMoon": [
            "Grants a determined approach and significant support/guidance from the maternal family.",
            "Increases the chances for travel on ships, sea-side living, and high-quality basic comforts.",
            "When exalted in Taurus, it provides deep emotional depth, a positive mood, and a romantic nature."
        ],
        "powerfulKetu": [
            "Provides emotional stability and a calm, self-realized approach to both career and relationships.",
            "Inclines the native toward learning scriptures and spiritual protection guided by divine power.",
            "Grants an independent nature and the ability to manage anxiety through healthy detachment."
        ]
    },
    "nature": {
        "positive": [
            "Highly intuitive personality with a deep interest in counseling, science, or research.",
            "Promotes spiritual growth and the carryover of past-life knowledge in areas like Sanskrit or Mathematics.",
            "Enhanced creativity and imagination that supports success in arts, writing, or storytelling."
        ],
        "negative": [
            "Can lead to emotional instability, confusion, and a suspicious or argumentative personality.",
            "May cause one to get 'stuck in the past,' creating significant emotional blockages.",
            "Self-obsessed approach and fear of commitment can cause breaks in personal relationships."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Highly intuitive but may feel lost or distracted initially; spiritual inclination."
        },
        {
            "house": "7th House",
            "effect": "Unusual karmic connection with the partner; foreign settlement and long-distance travel."
        },
        {
            "house": "10th House",
            "effect": "Unconventional career path (scientists, actors, leaders); sets own rules and norms."
        }
    ],
    "keywords": ["moon", "ketu", "conjunction", "intuition", "detachment", "spiritual journey", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Moon represents our emotional side and motherly influence, while Ketu represents the south "
        "node of the Moon associated with illusions, detachment, and ancient wisdom. Their "
        "conjunction is marked by inner conflict that eventually leads to soul-level transformation. "
        "The native often possesses a unique personality and different lifestyle compared to "
        "societal norms. While it offers deep intuitive and research capabilities, it often brings "
        "challenges in managing materialistic lifestyles and maintaining marital harmony."
    ),
    "effectsDetail": {
        "powerfulMoon": (
            "When the Moon is strong, especially in the 2nd or 4th house or in Taurus, you gain "
            "financial support and guidance from your family. You likely possess a spacious home "
            "with basic comforts and have a highly romantic, supportive personality that helps others."
        ),
        "powerfulKetu": (
            "When Ketu is strong, you approach life with self-realization and calmness. You are good "
            "at managing restlessness because you don't react impulsively. This placement can "
            "also bring a highly spiritual life partner who provides mature, experience-based guidance."
        ),
        "positiveConjunction": (
            "A positive conjunction rewards you with emotional understanding and spiritual growth. "
            "You may have a natural gift for mantra chanting, yoga, and meditation. It favors "
            "a minimalistic, content lifestyle and a career as a religious mentor or counselor."
        ),
        "negativeConjunction": (
            "A negative conjunction causes confusion and suspicious behavior. You may forget your "
            "routine and struggle with daily responsibilities. Emotional instability and a "
            "self-centered approach can create blockages, making it hard to move forward from the past."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native has a mysterious personality and finds it difficult to express individuality; initial phases of life are often marked by feeling lost."
        },
        {
            "house": "7th House",
            "detail": "Transformation often occurs after the birth of a child; native may experience a sudden shift in lifestyle or residence."
        },
        {
            "house": "10th House",
            "detail": "Native may choose unconventional careers and often doesn't want credit for their work, focusing instead on intuitive or abroad-based ventures."
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
    col = db["Moon_Ketu"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Moon_Ketu collection: document {action}.")
    print(f"     Total documents in Moon_Ketu: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Moon_Ketu collection...")
    asyncio.run(seed())
    print("[+] Done.")
