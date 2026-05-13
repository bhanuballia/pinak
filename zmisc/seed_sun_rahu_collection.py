"""
Seed: Sun_Rahu collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Rahu Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Sun represents honesty and authority; Rahu represents deception and materialistic craving.",
        "A conjunction of natural enemies that creates a double-faced personality (Honesty vs. Deception).",
        "Often results in strained relationships or separation from the father/father-figure.",
        "Can lead to professional setbacks due to false ego, insecurity, and low confidence.",
        "Potential for official government notices, tax issues, or delays in professional promotion."
    ],
    "effects": {
        "powerfulSun": [
            "Grants good confidence and power for a successful professional life in politics or entrepreneurship.",
            "Curb's Rahu's deceptive tendencies, facilitating more honest behavior and hard work.",
            "Helps handle ego better and maintains a relatively better relationship with the father."
        ],
        "powerfulRahu": [
            "Manifests as a false ego, short temper, and a dishonest mind planning to cheat others.",
            "Throws a veil of illusion over perceptions, leading to deep relationship problems with the father.",
            "Results in low progress despite hard work and a trademark two-faced personality."
        ]
    },
    "nature": {
        "positive": [
            "Visible when Sun is in Aries or Leo; allows for better handling of Rahu's volatile nature.",
            "Favorable for political life, business growth, and overall reputation/income increase.",
            "Happiness and prosperity are achieved, though constant vigilance is required."
        ],
        "negative": [
            "Affects the luck quotient as Rahu attempts to gain materialistic happiness by deception.",
            "Creates a veil of mystery that destroys mutual understanding and emotional connection in relations.",
            "Leads to physical fatigue, lack of vitality, stress, and fear without a clear external reason."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Good level of confidence for success, but native can be selfish and use wrong means."
        },
        {
            "house": "2nd House",
            "effect": "Communication problems; however, potential for sudden financial gains over stuck money."
        },
        {
            "house": "3rd House",
            "effect": "Success in winning over rivals through daring attempts, but strained sibling relations."
        },
        {
            "house": "4th House",
            "effect": "Financial gains from property or inheritance, though family and work relations suffer."
        },
        {
            "house": "5th House",
            "effect": "Financial gains from speculation/shares, but prone to illusions in money matters."
        },
        {
            "house": "6th House",
            "effect": "Possibility of going abroad and winning over rivals, but high stress affects health."
        },
        {
            "house": "7th House",
            "effect": "Generally not prosperous for partnerships or marriage relationships."
        },
        {
            "house": "8th House",
            "effect": "Benefits from ancestral property but prone to speculative addictions and work hurdles."
        },
        {
            "house": "9th House",
            "effect": "Selfish desire for materialistic gains leads to increased stress levels."
        },
        {
            "house": "10th House",
            "effect": "Requires care regarding reputation and money; stress affects the work front significantly."
        },
        {
            "house": "11th House",
            "effect": "Expected gains may not materialize; personal life problems, though some share market gains possible."
        },
        {
            "house": "12th House",
            "effect": "Increased expenditure and potential for being cheated by friends or partners."
        }
    ],
    "keywords": ["sun", "rahu", "conjunction", "grahan yoga", "deception", "ego", "authority", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "The Sun represents soul and authority, while Rahu represents materialistic craving and mind "
        "evolution. Their conjunction is a meeting of opposites: power through honesty vs. power "
        "through deception. This 'Grahan' (Eclipse) energy often creates a two-faced personality "
        "and typical strained circumstances with the father. While it can be favorable for "
        "politics and creative business, it often brings delays in childbirth and issues "
        "with government officials or tax matters."
    ),
    "effectsDetail": {
        "powerfulSun": (
            "When the Sun dominates (especially in Aries or Leo), it brings confidence and curb's "
            "Rahu's attempts to cheat. It enables better management of professional ventures "
            "and facilitates better relationships with authority figures and parents."
        ),
        "powerfulRahu": (
            "When Rahu dominates, a false ego and short temper take over. You may have a dishonest "
            "bend of mind and struggle with progress despite working hard. Perception is "
            "shrouded in illusion, making it difficult to maintain authentic connections."
        ),
        "positiveConjunction": (
            "A positive conjunction leads to reputation, job promotion, and increased income. "
            "The native handles challenges with vigilance and curbs Rahu's deceptive nature "
            "through solar honesty, leading to true prosperity."
        ),
        "negativeConjunction": (
            "A negative conjunction destroys mutual understanding through a 'veil of mystery.' "
            "It causes physical fatigue and stress-induced fear, often leading to a loss of "
            "authenticity in relationships and a depleted luck quotient."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Native must be extremely careful with reputation and financial management as stress heavily impacts work."
        },
        {
            "house": "5th House",
            "detail": "While lucrative for share markets, Rahu creates strong illusions that can lead to significant money miscalculations."
        },
        {
            "house": "1st House",
            "detail": "Success is achieved with confidence, but there is a persistent temptation to use unethical means for status."
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
    col = db["Sun_Rahu"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Sun_Rahu collection: document {action}.")
    print(f"     Total documents in Sun_Rahu: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Sun_Rahu collection...")
    asyncio.run(seed())
    print("[+] Done.")
