"""
Seed: Mercury_Moon_Saturn collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Alphabetical sorting: Mercury, Moon, Saturn
# Mercury (M-e) < Moon (M-o) < Saturn (S)

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mercury-Saturn Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a serious, methodical, and deeply analytical personality.",
        "Combines Mind (Moon), Logic (Mercury), and Discipline (Saturn) for in-depth research and strategic thinking.",
        "Natives are known for their practical wisdom, mature emotional outlook, and ability to thrive through adversity."
    ],
    "planetRoles": {
        "Moon": "Mind, subconscious thoughts, nourishment, emotional maturity, research ability",
        "Mercury": "Memory, intelligence, communication, wit, analytical mindset, calculations",
        "Saturn": "Stability, discipline, structure, persistence, maturity, engineering/law"
    },
    "effects": {
        "powerfulMoon": [
            "Grants the ability to conduct in-depth research with an analytical and thoughtful mindset.",
            "Blesses with emotional intelligence and the adaptability to survive challenges.",
            "Ensures emotions are expressed clearly yet with a mature, restrained approach."
        ],
        "powerfulMercury": [
            "Grants a heavy, impactful voice that carries weight in listeners' minds.",
            "Ensures mental clarity and total command over structured communication.",
            "Provides deep intuition and emotional depth, helping the native understand information deeply."
        ],
        "powerfulSaturn": [
            "Manifests as a serious, methodical, and emotionally controlled personality with high discipline.",
            "Ensures success in long-term goals through slow but steady and reliable thinking.",
            "Grants a formal, structured tone in communication and a high sense of responsibility."
        ]
    },
    "nature": {
        "positive": [
            "Practical thinking and a mature emotional outlook that helps resolve critical situations.",
            "Strong work ethic and honesty toward partners, ensuring long-term relationship stability.",
            "Ability to stay calm under pressure and climb the ladder of success through realistic goals.",
            "Deep understanding of information and a sense of responsibility toward elders and seniors."
        ],
        "negative": [
            "Lethargic approach or physical disabilities if heavily afflicted.",
            "Mentally rigid personality with a cold, formal communication style and trust issues.",
            "Tendency toward chronic mental fatigue, depression, or isolation due to lack of spontaneity.",
            "Stagnancy due to emotional setbacks or a habit of dwelling on past events or flaws."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Emotionally reserved but intellectually deep; quiet, introspective person with deep analytical power."
        },
        {
            "house": "2nd House",
            "effect": "Material stability through persistence; gravitas in speech; gains from lineage and in-laws."
        },
        {
            "house": "10th House",
            "effect": "Strategic thinking in career; success in government, law, research, or administration."
        }
    ],
    "keywords": ["moon", "mercury", "saturn", "conjunction", "research", "discipline", "maturity", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A strong Moon grants the ability to conduct in-depth research. You are deep, thoughtful, "
            "and analytical, expressing emotions with a restraint that makes you appear reserved "
            "yet emotionally mature. Your adaptability helps you navigate life's complexities "
            "with a traditional and steady approach."
        ),
        "powerfulMercury": (
            "Mercury provides you with a heavy, influential voice. Your words play a significant role "
            "in the actions of others. You possess mental clarity and structured communication, "
            "allowing you to convey intuition and emotional depth with seriousness and patience."
        ),
        "powerfulSaturn": (
            "Saturn manifests as a serious and methodical personality. While it may initially restrict "
            "the speed of your romantic or professional success, it ensures that your growth is "
            "steady and reliable. You communicate with formal precision, earning respect "
            "through your discipline and structured approach to long-term goals."
        )
    },
    "positiveDetail": (
        "This conjunction is the hallmark of the 'Practical Sage.' You possess the maturity to "
        "not panic in critical situations, handling challenges with a sense of responsibility "
        "and a strong foundation. Success comes after learning through adversity, where "
        "taking 'baby steps' eventually opens the doors to high rank and recognition. You have "
        "the ability to work alone for long hours, supported by your analytical mindset and "
        "patience. Relationships are marked by commitment and honesty, running for the "
        "long term due to a grounded, realistic approach. Your strategic thinking helps "
        "you build professional contacts and climb the ladder of success with a strong "
        "work ethic and an assertive, action-oriented patience."
    ),
    "negativeDetail": (
        "Negative influences can lead to a lethargic approach or physical health issues related "
        "to nerves and joints. Chronic mental fatigue and a tendency to isolate may manifest "
        "if you dwell too much on past setbacks. Affliction can make your communication "
        "style cold or mentally rigid, leading to trust issues and social awkwardness. "
        "A lack of spontaneity and a fear of losing everything can block you from taking "
        "healthy risks. You may find yourself comparing your progress to others, which "
        "leads to anxiety or anger issues. Emotionally distant relationships and a "
        "tendency to suppress creativity are risks that must be managed with "
        "deliberate emotional self-expression."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a quiet, introspective personality with deep analytical depth. You are cautious in speech and prefer practical decisions over emotional ones. While you may appear hesitant to express feelings, your disciplined approach ensures steady growth in career and social standing."
        },
        {
            "house": "2nd House",
            "detail": "Identity is shaped by a serious outlook and financial discipline. You likely earn from multiple sources and accumulate stable wealth through persistence. While you might have had a delayed speaking ability in childhood, you now speak with thoughtfulness and gravitas."
        },
        {
            "house": "10th House",
            "detail": "Strategic thinking and disciplined communication make you an ideal candidate for government, law, or scientific research. You are cautious yet highly capable, climbing the ladder of success through struggle and building strong, professional professional contacts over time."
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
    db = client["Triple_Planet_Conjunction"]
    # Alphabetical order: Mercury, Moon, Saturn
    col_name = "Mercury_Moon_Saturn"
    col = db[col_name]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Triple Planet Conjunction: {col_name} {action}.")
    print(f"     Total documents in {col_name}: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Mercury_Moon_Saturn triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
