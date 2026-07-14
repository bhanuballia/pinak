"""
Seed: Moon_Mercury collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mercury Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Moon represents emotions and intuition; Mercury represents intelligence and sharp communication.",
        "Natives are blessed with analytical intelligence, a soft voice, and a witty 'armor' that attracts others.",
        "Grants a keen eye for detail and the ability to observe and read others' thoughts realistically.",
        "While highly intelligent, decisions and actions can sometimes be driven by moods and anxiety.",
        "Benefic placement brings name, fame, and wealth, while malefic placement can lead to indecisiveness."
    ],
    "effects": {
        "powerfulMoon": [
            "Grants intellectual sensitivity and the capacity to nurture the interests of others.",
            "Possesses clear perception and communication that is objective and dependable.",
            "Understanding of others' problems is guided by high emotional intelligence."
        ],
        "powerfulMercury": [
            "Illustration of intelligence and creativity, delivering thoughts with clear messages.",
            "Expertise in speech and communication skills, often inherited or influenced by the mother.",
            "Competence in professional fronts with high status, wealth, and an active social life."
        ]
    },
    "nature": {
        "positive": [
            "Excellent professional status and reputation combined with nurturing personal relations.",
            "Attractive personality with witty communication that is endearing to partners.",
            "Ability to express personal feelings effectively and acquire assets for future security."
        ],
        "negative": [
            "Hesitancy in speaking due to uncertainty, potentially losing creative or literary potential.",
            "Risk of being overly talkative to the point where the essence of creativity is lost.",
            "Suspicious nature and emotional/psychological issues under severe malefic influence."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Good looks, gentle nature, and verbal skills with poetic or artistic talent."
        },
        {
            "house": "2nd House",
            "effect": "Good orator and acting skills, though prone to a restless mind and moderate finance."
        },
        {
            "house": "3rd House",
            "effect": "Daring courage and creativity, though may be lazy to complete pending tasks."
        },
        {
            "house": "4th House",
            "effect": "Stability, happiness with material assets, and excellent relations with the mother."
        },
        {
            "house": "5th House",
            "effect": "High creativity and speaking skills, but native may struggle to focus on specific tasks."
        },
        {
            "house": "6th House",
            "effect": "Good nature but easily influenced; success in competitions and victory over rivals."
        },
        {
            "house": "7th House",
            "effect": "Sensitive partner (intelligent wife); job changes bring professional prosperity."
        },
        {
            "house": "8th House",
            "effect": "Potential for ancestral gains, but may indicate bad health for the mother."
        },
        {
            "house": "9th House",
            "effect": "Intelligent and wise; success in profession and good relations with father and family."
        },
        {
            "house": "10th House",
            "effect": "Name, fame, and business success with support from colleagues, despite work stress."
        },
        {
            "house": "11th House",
            "effect": "Financial gains in professional life or stock markets; success over rivals."
        },
        {
            "house": "12th House",
            "effect": "Attractive personality and spiritual bend, but quick to feel mental stress."
        }
    ],
    "keywords": ["moon", "mercury", "conjunction", "intellect", "wit", "nurturing", "communication", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Moon presents the emotional side and intuition, while Mercury represents wit, humor, and "
        "communication skills. Their conjunction produces highly analytical and observant "
        "individuals who can read others' thoughts with ease. They often possess a soft, "
        "endearing voice and a witty charm that melts hearts. However, an active mind can "
        "sometimes lead to mood-based decisions, anxiety, or psychological stress if the "
        "conjunction is malefic. It often grants poetic or literary inclinations."
    ),
    "effectsDetail": {
        "powerfulMoon": (
            "When the Moon dominates, your intellect is guided by sensitivity. You understand others' "
            "problems deeply and aim to nurture their interests. Your communication is objective, "
            "clear, and highly dependable."
        ),
        "powerfulMercury": (
            "When Mercury dominates, you are an expert in creativity and speech. You deliver ideas "
            "confidently with a clear message. Skills are often inherited from the mother, "
            "making you highly competent in both personal and professional social circles."
        ),
        "positiveConjunction": (
            "A positive conjunction leads to excellent professional reputation and asset acquisition. "
            "It blesses the native with an attractive personality and a witty, endearing communication "
            "style that fosters deep connections with romantic partners."
        ),
        "negativeConjunction": (
            "A negative conjunction leads to either extreme hesitancy or being overly talkative. "
            "Uncertainty can stifle creative skills, and a lack of confidence may cause the "
            "importance of your ideas to be lost in daily routine sharing."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses good looks, a gentle nature, and excellent education with strong verbal skills."
        },
        {
            "house": "7th House",
            "detail": "Native is highly sensitive; while it brings an intelligent spouse, job changes are often the key to professional prosperity."
        },
        {
            "house": "10th House",
            "detail": "Excellent for name and fame in business, though work overload can lead to significant mental stress."
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
    col = db["Moon_Mercury"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Moon_Mercury collection: document {action}.")
    print(f"     Total documents in Moon_Mercury: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Moon_Mercury collection...")
    asyncio.run(seed())
    print("[+] Done.")
