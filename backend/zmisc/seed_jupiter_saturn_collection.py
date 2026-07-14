"""
Seed: Jupiter_Saturn collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Jupiter-Saturn Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Jupiter represents expansion and wisdom; Saturn represents restriction and maturity.",
        "A 'practical mindset' conjunction that brings the light of awareness into complex problems.",
        "Provides the ability to understand when to act (Jupiter) and when to stop or restrain (Saturn).",
        "Slow-moving nature of both planets ensures deep understanding of finance, health, and faith.",
        "Known for instilling persistence in work and clarity in long-term belief systems."
    ],
    "effects": {
        "powerfulJupiter": [
            "Enhances emotional depth and sensitivity, especially when exalted in Cancer or placed in Pisces.",
            "Blesses the native with domestic comfort, vehicle gains, and strong academic success.",
            "Grants an optimistic aura that guides others and helps them grow through mentoring."
        ],
        "powerfulSaturn": [
            "Grants the ability to work for long hours with extreme discipline and a structured approach.",
            "Provides a powerful sense of responsibility toward family expenses and professional duties.",
            "Fosters mature social connections and wise financial decisions through philosophical clarity."
        ]
    },
    "nature": {
        "positive": [
            "Possesses a calm, non-reactive personality that excels at managing risk without loss.",
            "Endows the native with a sense of responsibility and a committed approach to love and marriage.",
            "Exceptional for high-ranking legal, administrative, or research-based careers (Lawyers, Judges)."
        ],
        "negative": [
            "Can lead to a depressive personality that gets 'stuck in the past' with a complaining attitude.",
            "Procrastination and rigid thinking can prevent the native from achieving desired success.",
            "Workaholic nature might lead to social isolation or neglected personal relationships."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Wise personality with a strong physique; speaks less but wisely with good academic skills."
        },
        {
            "house": "7th House",
            "effect": "Sincere and workaholic personality; deeper understanding of spirituality within marriage."
        },
        {
            "house": "10th House",
            "effect": "Excellent career in law or administration; focuses on duty rather than people-pleasing."
        }
    ],
    "keywords": ["jupiter", "saturn", "conjunction", "dharma karmadhipati yoga", "maturity", "wisdom", "discipline", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Jupiter represents expansion, faith, and knowledge, while Saturn represents restriction, "
        "maturity, and persistence. Their conjunction brings a unique blend of awareness and "
        "practicality. This friction gives the individual the ability to understand when to "
        "stop and when to move forward. Together, they create a practical mindset that values "
        "long-term results and structured belief systems, often leading to deep wisdom and "
        "graceful conflict resolution."
    ),
    "effectsDetail": {
        "powerfulJupiter": (
            "When Jupiter dominates, you are a beacon of optimism. You possess deeper spiritual "
            "understanding and emotional sensitivity. This helps you guide others and achieve "
            "success in higher studies and administrative sectors, especially when Jupiter "
            "is in its own signs or exalted."
        ),
        "powerfulSaturn": (
            "When Saturn dominates, you work with a disciplined, career-oriented approach. You "
            "manage your work in a structured way and handle multiple responsibilities with "
            "a calm, mature approach. You are highly effective in healing, counseling, and "
            "influencing your work domain through emotional intelligence."
        ),
        "positiveConjunction": (
            "A positive conjunction rewards the individual with a strong, calm personality. You "
            "don't react impulsively; instead, you make wise decisions based on in-depth "
            "knowledge of books and reality. You have a committed approach toward family, "
            "love, and your professional duties."
        ),
        "negativeConjunction": (
            "A negative conjunction causes a rigid or depressive personality. You may get stuck "
            "in the past, leading to a complaining attitude and procrastination. Inner conflicts "
            "and overthinking can result in financial ups and downs and a self-centered approach "
            "that damages personal relationships."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Native achieves a structured lifestyle and is capable of making wise decisions abroad or far from the birthplace, focusing purely on duty and professional excellence."
        },
        {
            "house": "1st House",
            "detail": "Individuals are hardworking and good at making decisions even in challenging situations, often leading teams gracefully while possessing a mature outlook."
        },
        {
            "house": "7th House",
            "detail": "While marriage may see some delays or workaholic friction, the native eventually receives high social respect and support from a sincere, mature spouse."
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
    col = db["Jupiter_Saturn"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Jupiter_Saturn collection: document {action}.")
    print(f"     Total documents in Jupiter_Saturn: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Jupiter_Saturn collection...")
    asyncio.run(seed())
    print("[+] Done.")
