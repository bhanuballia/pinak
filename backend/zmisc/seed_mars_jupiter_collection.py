"""
Seed: Mars_Jupiter collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mars-Jupiter Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Mars represents courage and initiative; Jupiter represents wisdom and expansion.",
        "A conjunction of a natural malefic and natural benefic that grants an optimistic, positive attitude.",
        "Jupiter expands the energy and assertiveness of Mars, granting sharp intelligence and depth.",
        "Grants the confidence to get work done effectively and influence others positively.",
        "Indicative of a personality that is well-versed, highly educated, and ambitious toward goals."
    ],
    "effects": {
        "powerfulMars": [
            "Manifests as impulsive behavior without pretense, driven by a strong inner force.",
            "Blesses the native with rational action, high knowledge, and bold speech for good gains.",
            "Grants a daring attitude and the energy needed to win over complex situations."
        ],
        "powerfulJupiter": [
            "Directs the native toward a constructive path based on accumulated wisdom and experience.",
            "Expands the ability to follow the correct life path and succeed in professional endeavors.",
            "Blesses the individual with self-belief and the ability to act wisely in any given situation."
        ]
    },
    "nature": {
        "positive": [
            "Strong determination and authority to lead others with wisdom and intellect.",
            "Highly qualified with detailed observing power and the ability to give beneficial advice.",
            "Strong spiritual viewpoint that exerts a positive influence over social and professional circles."
        ],
        "negative": [
            "Hasty actions and high optimism based on 'fake strength' rather than true knowledge.",
            "Energy is wasted in debating challenges rather than achieving progressive results.",
            "Incorrect values can lead to uncertainty and impulsiveness in behavior."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Powerful personality with a good social circle; may have rude or stubborn speech."
        },
        {
            "house": "2nd House",
            "effect": "Excellent orator with command over wealth; may sound egoistic or rigid in tone."
        },
        {
            "house": "3rd House",
            "effect": "Goal-oriented actions that win over adversity, though temperamental issues may arise."
        },
        {
            "house": "4th House",
            "effect": "Good materialistic comforts and managerial skills; restless mind with a bold mother."
        },
        {
            "house": "5th House",
            "effect": "Knowledgeable in science and philosophy, but short-tempered and fickle-minded."
        },
        {
            "house": "6th House",
            "effect": "Strong mental determination and analytical abilities; influential leader with high status."
        },
        {
            "house": "7th House",
            "effect": "Good married life with a passionate, influential, and charming life partner."
        },
        {
            "house": "8th House",
            "effect": "Bold, straightforward personality with inheritance prospects; potential for extra-marital affairs."
        },
        {
            "house": "9th House",
            "effect": "Logical tactics and good knowledge leading to powerful positions in politics."
        },
        {
            "house": "10th House",
            "effect": "Business acumen and daring attitude for bold decisions; high profit and status."
        },
        {
            "house": "11th House",
            "effect": "Very persuasive nature; gains through words and successful speculation in share markets."
        },
        {
            "house": "12th House",
            "effect": "Clever but selfish nature with rude speech and potentially weak financial/physical health."
        }
    ],
    "keywords": ["mars", "jupiter", "conjunction", "guru mangal yoga", "wisdom", "courage", "authority", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Mars represents the energy and willpower required to act, while Jupiter represents wisdom, "
        "growth, and spirituality. Their conjunction blends assertiveness with knowledge, "
        "granting a sharp intelligence and the ability to understand any subject with depth. "
        "It makes the native well-versed and often serves as a marker for a good teacher or "
        "mentor. However, the audacious and bold speech associated with this pair can "
        "sometimes lead to overpowering others if not well-balanced in the horoscope."
    ),
    "effectsDetail": {
        "powerfulMars": (
            "When Mars dominates, you are a driving force. You act with rational facts and high "
            "knowledge, ensuring that your bold speech and daring actions result in tangible "
            "gains. You don't hide your basic instincts, moving forward with confidence."
        ),
        "powerfulJupiter": (
            "When Jupiter dominates, you are constructively guided by experience. You follow "
            "the correct path in life, using your self-belief to expand your endeavors. This "
            "placement symbolizes the ability to act based on high moral and intellectual ground."
        ),
        "positiveConjunction": (
            "A positive conjunction gives you the authority to lead others. You possess strong "
            "determination and detailed observing power. Your speech and actions often serve "
            "as beneficial advice for others, influenced by a strong spiritual viewpoint."
        ),
        "negativeConjunction": (
            "A negative conjunction leads to hasty actions and a lack of constructive results. "
            "Incorrect values can cause energy to be wasted in debating challenges rather "
            "than overcoming them, leading to uncertainty in professional ventures."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Native possesses excellent business acumen and the wisdom to take daring, bold decisions that result in high status and earnings."
        },
        {
            "house": "2nd House",
            "detail": "Native is a fluent speaker and a great orator, able to get their work done through powerful and sophisticated expression."
        },
        {
            "house": "6th House",
            "detail": "High mental determination and analytical abilities make the native an influential leader who can easily win the confidence of others."
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
    col = db["Mars_Jupiter"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Mars_Jupiter collection: document {action}.")
    print(f"     Total documents in Mars_Jupiter: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Mars_Jupiter collection...")
    asyncio.run(seed())
    print("[+] Done.")
