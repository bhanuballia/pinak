"""
Seed: Saturn_Ketu collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Saturn-Ketu Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Saturn represents discipline and boundaries; Ketu represents separation and detachment.",
        "A conjunction of 'less progressive' traits like frustration, denial, and overthinking.",
        "Grants the unique ability to become a researcher of deep occult studies or a spiritual seeker.",
        "Heightened confusion occurs as Saturn's systematic drive meets Ketu's headless intuition.",
        "Natives may experience excessive introverted behavior and a confused vision regarding life goals."
    ],
    "effects": {
        "powerfulSaturn": [
            "May origin a 'false spiritual mentor' who portrays holiness but harbors hidden materialistic desires.",
            "Brings significant conflict regarding the choice between a materialistic path and a spiritual one.",
            "Saturn's systematic drive for worldly accomplishments clashes with Ketu's urge for isolation."
        ],
        "powerfulKetu": [
            "Activates a heightened sense of detachment from the materialistic world and isolation.",
            "The native is guided primarily by intuition and instincts rather than diplomatic intelligence.",
            "Initial internal conflicts are eventually resolved by following a dedicated route of spirituality."
        ]
    },
    "nature": {
        "positive": [
            "Intelligence of balance where intuition, hard work, and research lead to success.",
            "Rise of spiritual leaders who work for the betterment of humanity rather than personal gain.",
            "Clear intelligence and balanced emotions that allow the native to stay detached during success."
        ],
        "negative": [
            "Heart-guided entity with no 'head' for diplomacy or practical timing in the material world.",
            "May produce mentors who preach spirituality but use concealed ways to fulfill personal desires.",
            "Extreme stress arises when the native does not know when to stop due to lack of practical reasoning."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Hard work yields poor results and fame; negatively affects stamina and peace of mind."
        },
        {
            "house": "2nd House",
            "effect": "Lack of financial stability and rough speech; issues with eyes, bones, and teeth."
        },
        {
            "house": "3rd House",
            "effect": "Less progressive in initiative; native may become a 'quitter' from responsibilities."
        },
        {
            "house": "4th House",
            "effect": "Detachment from domestic happiness and family; likely to leave home for spiritual life."
        },
        {
            "house": "5th House",
            "effect": "Delays or separation in family happiness or progeny matters; affects physical health."
        },
        {
            "house": "6th House",
            "effect": "Not progressive; affected by bad health, rivals, and a tendency to give up on challenges."
        },
        {
            "house": "7th House",
            "effect": "Significant delay in marriage prospects and a denial of honesty in professional partnerships."
        },
        {
            "house": "8th House",
            "effect": "Sudden obstacles; the native may negate any sudden gains; high risk of chronic diseases."
        },
        {
            "house": "9th House",
            "effect": "Native may abandon responsibilities to explore spiritual realms for personal growth."
        },
        {
            "house": "10th House",
            "effect": "Minimal success in career; native is not keen to gain status or professional recognition."
        },
        {
            "house": "11th House",
            "effect": "Detached from materialistic gains due to a lack of them; native denies social responsibilities."
        },
        {
            "house": "12th House",
            "effect": "Separation from family and marital relations; likely to wander in search of salvation."
        }
    ],
    "keywords": ["saturn", "ketu", "conjunction", "detachment", "spirituality", "occult", "isolation", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Saturn represents reality, discipline, and the delay of gains, while Ketu (dragon's tail) "
        "represents isolation, detachment, and separation from the materialistic world. Their "
        "conjunction is marked by frustration and overthinking, often leading to a confused "
        "vision of life. While it is challenging for worldly success, it is excellent for deep "
        "occult research and spiritual growth. The native often feels an internal friction "
        "between Saturn’s systematic hard work and Ketu’s urge for solitude, creating extreme "
        "stress if the right time to 'stop' isn't recognized."
    ),
    "effectsDetail": {
        "powerfulSaturn": (
            "When Saturn dominates, you might struggle with a 'false spiritual' exterior. While "
            "portraying spiritual instincts on the surface, you may still be working to gain "
            "materialistic desires. This creates an internal conflict where you are unsure of "
            "which path—material or spiritual—is the correct one for your life."
        ),
        "powerfulKetu": (
            "When Ketu dominates, your sense of detachment is heightened. You follow your intuition "
            "and instincts rather than diplomatic tactics. You may lose all interest in the "
            "materialistic world after an initial phase of conflict, eventually following "
            "the route of pure spirituality."
        ),
        "positiveConjunction": (
            "A positive conjunction initiates an intelligence of balance. You use your intuition "
            "and hard work to succeed even in the material world, but remain detached and "
            "balanced during that success. This placement is common in spiritual leaders who "
            "work for humanity."
        ),
        "negativeConjunction": (
            "A negative conjunction means you are guided primarily by 'heart' with no 'head' for "
            "practical diplomacy. You may preach spirituality with fake maturity while concealing "
            "materialistic desires. This imbalance often ruins the harmony of your "
            "responsibilities and relationships."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "4th House",
            "detail": "Native feels a deep detachment from domestic happiness and fixed assets, often separating from the family to pursue a purely spiritual path."
        },
        {
            "house": "7th House",
            "detail": "Marriage prospects are significantly delayed; professional partnerships may suffer from a lack of honesty or mutual commitment."
        },
        {
            "house": "8th House",
            "detail": "Obstacles arise suddenly from all sources. Even when sudden gains appear, the native's mindset tends to negate them or focus on the obstacles."
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
    col = db["Saturn_Ketu"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Saturn_Ketu collection: document {action}.")
    print(f"     Total documents in Saturn_Ketu: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Saturn_Ketu collection...")
    asyncio.run(seed())
    print("[+] Done.")
