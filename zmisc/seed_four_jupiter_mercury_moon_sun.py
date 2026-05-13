"""
Seed: Jupiter_Mercury_Moon_Sun collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Mercury-Jupiter Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a wise, insightful, and intellectually commanding personality.",
        "Combines Authority (Sun), Emotions (Moon), Logic (Mercury), and Wisdom (Jupiter) for exceptional judgment.",
        "Natives are known for their sharp grasping abilities, deep spiritual insights, and success in high-rank leadership or advisory roles."
    ],
    "planetRoles": {
        "Sun": "Authority, father, status, self-respect, structure, judgment",
        "Moon": "Mind, emotions, mother, intuition, empathy, mental peace",
        "Mercury": "Logic, calculation, data management, business ethics, grasping ability",
        "Jupiter": "Wisdom, law, tradition, philosophy, spiritual studies, mentor figure"
    },
    "effects": {
        "powerfulSun": [
            "Grants deeper insights and a superior sense of judgment and structure in all tasks.",
            "Ensures strong self-respect and the ability to maintain authority even in high-pressure situations.",
            "Provides excellent bonding with government officials and senior authorities."
        ],
        "powerfulMoon": [
            "Grants success in creative work and exceptional intuitive powers for professional growth.",
            "Ensures empathy and the ability to convey complex thoughts to a mass following effectively.",
            "Provides emotional stability through maternal guidance and female support in the life path."
        ],
        "powerfulMercury": [
            "Grants sharp thinking and superior grasping abilities in calculation and data management.",
            "Ensures an ethical and principled approach to love, business, and long-term growth.",
            "Provides financial gains through logical planning and significant interest in spiritual studies."
        ],
        "powerfulJupiter": [
            "Grants a wise nature and an attractive personality that commands respect without doubt.",
            "Ensures a high rank in career and the ability to find positive hope in challenging situations.",
            "Provides the guidance of good mentors and a command over both rational and spiritual thinking."
        ]
    },
    "nature": {
        "positive": [
            "Wise and courageous personality with the ability to spot opportunities earlier than others.",
            "Substantial wealth accumulation through a disciplined life and strong lineage support.",
            "Exceptional growth in government, financial, teaching, and mass communication sectors.",
            "Robust vitality and high stamina, supported by a quick recovery system and sharp intellect."
        ],
        "negative": [
            "Pessimistic approach and internal arguments if the Sun and Moon are in close affliction.",
            "Opinion clashes with parents and senior authorities leading to financial or status losses.",
            "Challenges in marital or love life due to ego clashes and rigid differences in financial views.",
            "Tendency to ignore valuable suggestions, leading to a block in career understanding or growth."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "High stamina and robust vitality; success through wise decisions and support from elders."
        },
        {
            "house": "2nd House",
            "effect": "Gains from family business; luxurious lifestyle and command over speech and insurance sectors."
        },
        {
            "house": "4th House",
            "effect": "Royal status and property gains; inner peace through maternal support and strong assets."
        },
        {
            "house": "10th House",
            "effect": "High rank and leadership; success in education, water, food, and financial industries."
        }
    ],
    "keywords": ["sun", "moon", "mercury", "jupiter", "conjunction", "wisdom", "logic", "insight", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun allows you to work with deeper insights, granting you a refined sense of "
            "judgment. You possess unyielding self-respect and the ability to structure complex "
            "tasks with ease. Your bonding with senior authorities and government officials is "
            "exceptional, ensuring your authority is recognized and respected in all professional circles."
        ),
        "powerfulMercury": (
            "Mercury provides sharp thinking and superior grasping abilities. You are particularly "
            "skilled in data management and calculations, making you a force in business or "
            "education. Because of your close association with Jupiter, you remain ethical in "
            "your dealings and principled in your personal life, leading to consistent financial gains."
        ),
        "powerfulMoon": (
            "Moon grants you success through intuition and creative expression. You have a unique "
            "ability to convey your thoughts to the masses, earning a large following. Following "
            "maternal guidance is a key to your growth, as it helps you balance your rational "
            "logic with the empathy needed to lead people with a caring heart."
        ),
        "powerfulJupiter": (
            "Jupiter acts as the pillar of wisdom in your life, giving you a wise nature and an "
            "attractive, respected personality. You acquire higher education easily and find "
            "the best mentors to guide your path. People follow your instructions without "
            "hesitation, as your decisions are rooted in both logic and spiritual depth."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Sage-Leader' personality. You possess a bold and courageous "
        "decision-making ability that naturally raises your status in society. You are not "
        "prone to pessimism because Jupiter provides consistent hope and solutions, even when "
        "circumstances are challenging. Growth is foreseen in government, financial, and "
        "teaching sectors, as you are fueled by a blend of passion and sharp intelligence. "
        "Your life is marked by the accumulation of substantial wealth, property, and a "
        "royal bearing that comes from a well-disciplined life and the early spotting "
        "of life-changing opportunities."
    ),
    "negativeDetail": (
        "Negative influences manifest as a rigid refusal to listen to suggestions and unnecessary "
        "opinion clashes with authority. Affliction to the Sun and Moon can create a "
        "pessimistic outlook, leading to arguments caused by a lack of understanding. "
        "Financial matters can become a source of conflict in your marital life, especially if "
        "ego clashes dominate your decision-making. Managing your internal dialogue to "
        "avoid a negative approach is crucial to maintaining the high status and stability "
        "that this conjunction otherwise promises."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native enjoys robust vitality and high stamina. You possess a sharp, intelligent approach that attracts a large following. While you are introspective, you must guard against a pessimistic approach if the Moon is afflicted, ensuring your recovery system remains at its peak."
        },
        {
            "house": "2nd House",
            "detail": "Identity is centered on wealth and comfort. You enjoy luxurious foods and acquire jewelry and gems through success in family business. Your speech is unique and commanding, often leading to financial gains in mass communication or the insurance sector."
        },
        {
            "house": "4th House",
            "detail": "Powerhouse for property and vehicle gains, ensuring a royal status. Your mother's guidance plays a pivotal role in your clarity of thought, leading to strong family bonds and an abundance of assets. Inner peace is maintained through maternal support."
        },
        {
            "house": "10th House",
            "detail": "Ensures a high rank and success in leading large teams. You find immense growth in sectors requiring precision—like finance, education, or mass communication. Your industrious approach and moral authority allow you to work seamlessly with high-rank officials."
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
    db = client["Four_Planet_Conjunction"]
    # Alphabetical order: Jupiter, Mercury, Moon, Sun
    col_name = "Jupiter_Mercury_Moon_Sun"
    col = db[col_name]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Four Planet Conjunction: {col_name} {action}.")
    print(f"     Total documents in {col_name}: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Jupiter_Mercury_Moon_Sun four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
