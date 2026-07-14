"""
Seed: Mercury_Jupiter collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mercury-Jupiter Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Mercury represents speech and skills; Jupiter represents wisdom and expansion.",
        "Grants clarity on when to execute work and the ability to look behind the scenes.",
        "Excellent for observing long-term consequences and making practical, calm decisions.",
        "A combination that instills high moral values and a balanced, intellectual mindset.",
        "Natives often possess a charming, youthful look and attract others' attention easily."
    ],
    "effects": {
        "powerfulMercury": [
            "Grants sharp intelligence and the ability to maintain supportive contacts and friends.",
            "Blesses the native with excellent memory, grasping power, and academic success.",
            "Exalted Mercury provides high rank in jobs, success in business, and a great sense of humor."
        ],
        "powerfulJupiter": [
            "Provides a strong personality and the ability to guide others with a wise approach.",
            "Ensures a compassionate, caring nature that helps resolve challenges and conflicts.",
            "Exalted Jupiter leads to spiritual upliftment and a deeper understanding of religious law."
        ]
    },
    "nature": {
        "positive": [
            "Known for a wise and intellectual approach that helps attain high social ranks.",
            "Eloquent in managing relationship challenges and building a strong social image.",
            "Successful careers as mentors, influencers, lawyers, or professionals in the education sector."
        ],
        "negative": [
            "Can lead to overthinking, a self-centered approach, and a 'preachy' or exaggerating image.",
            "Greed for wealth may trigger financial losses through deception or poor judgment.",
            "Affliction may cause a lack of concentration and failures in early academic pursuits."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Highly intellectual and charming; presence provides a supportive environment for others."
        },
        {
            "house": "4th House",
            "effect": "Strong school education foundation; comfort from vehicles and a spacious home."
        },
        {
            "house": "7th House",
            "effect": "Early and successful marriage to an intelligent, spiritually inclined life partner."
        },
        {
            "house": "10th House",
            "effect": "Earning respect and reputation in law, education, or administration through honest ethics."
        }
    ],
    "keywords": ["mercury", "jupiter", "conjunction", "wisdom", "intelligence", "communication", "mentor", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Mercury represents speech, communication, and sharp thinking, while Jupiter represents "
        "wisdom, abundance, and spirituality. Their conjunction provides a unique clarity on "
        "work execution. It allows the native to look behind the scenes and perform well even in "
        "challenging situations. It is a marker of intellectual depth, high moral values, and "
        "practical decision-making. Natives are often respected for their knowledge and have "
        "a calm, optimistic approach that inspires others."
    ),
    "effectsDetail": {
        "powerfulMercury": (
            "When Mercury dominates, you possess sharp intellect and excellent grasp over academic "
            "skills. You maintain a wide circle of friends and relatives who support your "
            "professional ventures. Your sense of humor and communication skills ensure success "
            "in both business and corporate environments."
        ),
        "powerfulJupiter": (
            "When Jupiter dominates, you are a wise guide and a natural mentor. You possess a "
            "strong sense of responsibility and support your partner with hope and insight. "
            "Whether as a professor or an administrative leader, your caring and wise personality "
            "helps you resolve challenges with a systematic order."
        ),
        "positiveConjunction": (
            "A positive conjunction makes you perform well even under pressure. You manage "
            "relationship challenges with an eloquent approach and build a prestigious social "
            "image. You excel in fields like acting, writing, or law, where intellectual depth "
            "and wise decision-making are paramount."
        ),
        "negativeConjunction": (
            "A negative conjunction leads to overthinking and overconfidence. You may project "
            "an image of being highly knowledgeable, which can alienate others and lead to "
            "deception in the workplace. Financial losses may occur due to poor judgment and "
            "a tendency to follow your own rules over ethical standards."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Native achieves a rise in intellectual status and finds success in telecommunications, law, or administrative sectors through ethics and reputation."
        },
        {
            "house": "1st House",
            "detail": "Native has a charming, young look and maintains harmony in all relationships through a balanced mindset and wise decision-making from a young age."
        },
        {
            "house": "4th House",
            "detail": "Brings support from the maternal family and a big house with vehicle comfort; ensures ger guidance shapes the native's lifelong success journey."
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
    col = db["Mercury_Jupiter"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Mercury_Jupiter collection: document {action}.")
    print(f"     Total documents in Mercury_Jupiter: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Mercury_Jupiter collection...")
    asyncio.run(seed())
    print("[+] Done.")
