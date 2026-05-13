"""
Seed: Sun_Moon collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Sun represents soul, authority, and father; Moon represents mind, emotions, and mother.",
        "A combination of fire (Sun) and water (Moon) that creates determination but can cause blurred perceptions.",
        "Forms a beneficial Raj Yoga for Aries ascendants, linking stability (4th) with creativity (5th).",
        "The planets are friendly despite opposite characteristics; positive in Cancer, Leo, and Aries.",
        "Success and reputation are promoted when there is a greater distance between the two."
    ],
    "effects": {
        "powerfulSun": [
            "Grants a bold personality and the strength to stand proudly against all odds.",
            "Decisive nature that avoids excuses, focusing on rectifying faults rather than emotions.",
            "May appear egoistic as decisions are made independently, sometimes overruling others' sentiments."
        ],
        "powerfulMoon": [
            "Compassionate nature that strives for perfection in all ventures.",
            "Actions and decisions are ruled by the heart and mind; loves to share success with others.",
            "Possesses the ability to forgive, forget mistakes, and move forward with compassion."
        ]
    },
    "nature": {
        "positive": [
            "Brings a balance of parental energies, leading to power combined with kindness.",
            "Blesses the native with materialistic happiness and a 'live and let live' philosophy.",
            "Can manifest as a well-versed learner, philosopher, or mentor with a kind disposition."
        ],
        "negative": [
            "May indicate a lack of motherly emotion or a very strict, rule-bound upbringing.",
            "Native may be easily influenced by others and follow prescribed paths rather than their own.",
            "Combustion of the Moon can lead to a late realization of one's true career potential."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Charming personality and professional success, but can be selfish in personal relations."
        },
        {
            "house": "2nd House",
            "effect": "Parents in authoritative positions; excellent as financial managers with high career aspirations."
        },
        {
            "house": "3rd House",
            "effect": "Strong in writing, literature, and creativity; bold approach to achieving personal goals."
        },
        {
            "house": "4th House",
            "effect": "Emotional and secure in a home environment; the Moon is particularly strong here."
        },
        {
            "house": "5th House",
            "effect": "Inclined toward political science, medicine, or environment; strong focus on family/children."
        },
        {
            "house": "6th House",
            "effect": "Restless nature but finds stability through social welfare and administrative work."
        },
        {
            "house": "9th House",
            "effect": "Spiritually inclined and respectful toward the father; can be demanding in personal matters."
        },
        {
            "house": "10th House",
            "effect": "Clear professional prospects from an early age as the Sun gains directional strength."
        },
        {
            "house": "11th House",
            "effect": "Focus on matters related to children and consistent wealth throughout life."
        }
    ],
    "keywords": ["sun", "moon", "conjunction", "raj yoga", "emotions", "authority", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "The Sun (King) and Moon (Queen) conjunction represents the union of soul and mind. "
        "While fire and water can create a determined nature, they can also cause a wavering "
        "attitude or blurred perceptions. In the natural horoscope, this forms a Raj Yoga "
        "linking the lords of the 4th and 5th houses. When positive, it creates courageous "
        "and diplomatic individuals, but under malefic influence, it can manifest as arrogance. "
        "A greater distance between them usually results in a more stable and positive reputation."
    ),
    "effectsDetail": {
        "powerfulSun": (
            "When the Sun dominates, you have the strength to stand against all odds with your head held high. "
            "You don't make excuses for faults but work decisively to prevent them in the future. "
            "Because you prefer not to be guided by others, you may be perceived as egoistic."
        ),
        "powerfulMoon": (
            "When the Moon dominates, you are compassionate toward others' feelings despite your own abilities. "
            "Decisions are ruled by the heart, and you strive for perfection while happily sharing "
            "success with those around you. You forgive easily and move forward with compassion."
        ),
        "positiveConjunction": (
            "A well-balanced Sun-Moon conjunction blesses you with good possessions, a solid reputation, "
            "and power tempered with kindness. It represents a balance of paternal and maternal energies, "
            "fostering a 'live and let live' attitude."
        ),
        "negativeConjunction": (
            "A weak conjunction can result in a lack of independent nature. If the Moon is combust, "
            "career potential is often realized late in life. It may also reflect an upbringing "
            "focused more on rules and discipline than emotional connection."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Sun gains directional strength here, providing absolute professional clarity from a very early age."
        },
        {
            "house": "4th House",
            "detail": "Sun loses direction while the Moon is strong; creates an emotional person who feels most secure at home."
        },
        {
            "house": "2nd House",
            "detail": "Indicates authoritative parents and potential for high-profile careers in financial management."
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
    col = db["Sun_Moon"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Sun_Moon collection: document {action}.")
    print(f"     Total documents in Sun_Moon: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Sun_Moon collection...")
    asyncio.run(seed())
    print("[+] Done.")
