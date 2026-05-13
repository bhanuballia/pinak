"""
Seed: Moon_Saturn collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Saturn Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Moon represents emotional equilibrium; Saturn represents boundaries and realistic facts.",
        "A combination that often confines the thought process or limits goals until hard work is applied.",
        "Reveals a tug-of-war between creative hope (Moon) and harsh reality (Saturn).",
        "Natives are restricted in expressing affection but are highly dedicated to the security of loved ones.",
        "Success and gains are primarily self-earned through a disciplined, practical approach."
    ],
    "effects": {
        "powerfulMoon": [
            "Grants compassion toward others' feelings and limitations despite Saturn's harsh influence.",
            "Blesses the individual to see promising possibilities even in demanding, adverse situations.",
            "Maintains a nurturing perspective that keeps the world feeling promising and hopeful."
        ],
        "powerfulSaturn": [
            "Directs the native to move forward with a constant reality check and practical clarity.",
            "Encourages recognizing personal limits and moving with patience, discipline, and hard work.",
            "Shifts focus from idealistic dreams to a realistic array of events for professional success."
        ]
    },
    "nature": {
        "positive": [
            "Intelligence combined with the realization that patience and hard work bring lasting success.",
            "Ability to discriminate between events with a disciplined approach and balanced emotions.",
            "Results in a person who is exceptionally reliable and organized in their professional life."
        ],
        "negative": [
            "Results in a 'dry' or detached manner of expressing love and affection to others.",
            "Pace conflict between fast Moon and slow Saturn causes internal friction in expectations.",
            "Tendency to feel dejected or isolated when creative actions do not meet immediate success."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "High self-expectations and hard work; mindset is heavily influenced by the surroundings."
        },
        {
            "house": "2nd House",
            "effect": "Oscillation between saving and spending; native may expect high morals from others."
        },
        {
            "house": "3rd House",
            "effect": "Success achieved away from the birthplace with significant professional travel."
        },
        {
            "house": "5th House",
            "effect": "Opportunities to earn through creative pursuits or specialized knowledge."
        },
        {
            "house": "6th House",
            "effect": "Favorable for physical labor and rigorous fitness routines; high initiative for hard work."
        },
        {
            "house": "7th House",
            "effect": "Frequent small differences in marriage but a strong chance of compromise over separation."
        },
        {
            "house": "9th House",
            "effect": "Strong spiritual progress after materialistic struggles; native becomes a real mentor in maturity."
        },
        {
            "house": "10th House",
            "effect": "Success in businesses related to liquids (water, oil, chemicals) or professional administration."
        },
        {
            "house": "12th House",
            "effect": "Gains from foreign lands along with extensive travel prospects."
        }
    ],
    "keywords": ["moon", "saturn", "conjunction", "visha yoga", "discipline", "reality", "patience", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Moon represents the mind and emotional balance, while Saturn represents the boundaries and "
        "delays in our achievements. Their conjunction can confine the thought process or limit "
        "goals, often leading to feelings of dejection when immediate success is not met. It is "
        "a meeting of creative hope (Moon) and realistic facts (Saturn). While the native may "
        "appear restricted in their expressions of love, they are deeply dedicated to the "
        "security and materialistic comfort of their family. Gains are hard-won and self-earned."
    ),
    "effectsDetail": {
        "powerfulMoon": (
            "When the Moon dominates, you remain compassionate toward others' limitations despite "
            "Saturn's pressure. You see adverse situations through a bright perspective, allowing "
            "you to experience the world as a promising and nurturing place even when it is tough."
        ),
        "powerfulSaturn": (
            "When Saturn dominates, you move forward with a constant reality check. You recognize "
            "your limits and act with patience and open eyes. This placement keeps you away "
            "from idealistic traps, focusing instead on the realistic efforts required for success."
        ),
        "positiveConjunction": (
            "A positive conjunction connects intelligence with the light of realization. You understand "
            "that patience and hard work bring success in challenging times. This grants you the "
            "ability to discriminate between events with a disciplined, balanced, and practical approach."
        ),
        "negativeConjunction": (
            "A negative conjunction (often called Visha Yoga) can make one dry or detached in "
            "expressing affection. The difference in pace between the fast-moving Moon and slow "
            "Saturn brings about conflicts in expectations, potentially leading to emotional isolation."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "7th House",
            "detail": "Differences between partners may be frequent over small matters, but they aggravate slowly, meaning compromise is much more likely than separation."
        },
        {
            "house": "9th House",
            "detail": "Native tends to detach from false glamour after experiencing struggles, eventually becoming a true preceptor or spiritual guide."
        },
        {
            "house": "10th House",
            "detail": "Excellent for business success, particularly in sectors involving liquid products like oils, minerals, or chemicals."
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
    col = db["Moon_Saturn"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Moon_Saturn collection: document {action}.")
    print(f"     Total documents in Moon_Saturn: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Moon_Saturn collection...")
    asyncio.run(seed())
    print("[+] Done.")
