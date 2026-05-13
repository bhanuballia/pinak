"""
Seed: Sun_Saturn collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Saturn Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Sun represents ego, authority, and soul; Saturn represents discipline, delay, and boundaries.",
        "Often indicates a difference of opinion or ego clashes between father and son.",
        "The impact is most visible when the planets are 9 to 14 degrees apart.",
        "A combination that demands practicality and hard work for the realization of gains.",
        "Best suited for careers in government, law, politics, and the medical profession."
    ],
    "effects": {
        "powerfulSun": [
            "Grants a composed state of mind and a natural aura of authority and leadership.",
            "Ability to manage large organizations in sectors like IT, business, or entertainment.",
            "Increases the sense of responsibility and organizational skills toward one's obligations."
        ],
        "powerfulSaturn": [
            "Moves forward in life with a constant reality check of all situations.",
            "Acknowledge personal limits and operates with practical clarity and discipline.",
            "Relies on past experiences to lead others with a slow but positive tread for success."
        ]
    },
    "nature": {
        "positive": [
            "Disciplined practical approach leading to a strong social reputation.",
            "Favorable for career growth and materialistic gains, especially in the 10th house.",
            "Ability to discriminate between events with confidence and authority."
        ],
        "negative": [
            "Undisciplined attitude and a tendency to wander from important life goals.",
            "Lowered self-confidence and a lack of courage to accept difficult challenges.",
            "Tendency to make excuses for mistakes and seek easy ways out rather than working hard."
        ]
    },
    "housePlacements": [
        {
            "house": "6th House",
            "effect": "Success in acquiring a dream job, winning over rivals, and marital harmony."
        },
        {
            "house": "9th House",
            "effect": "Opportunities for long travel and gaining significant new life experiences."
        },
        {
            "house": "10th House",
            "effect": "Best location for career; combines authority with career significator for high success."
        },
        {
            "house": "11th House",
            "effect": "Brings financial stability, gains, and a good social reputation."
        }
    ],
    "keywords": ["sun", "saturn", "conjunction", "discipline", "hard work", "government", "medical", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Sun is the king of the planetary kingdom (ego, power, authority), while Saturn represents the boundaries "
        "and reality of our achievements. Their conjunction often creates a 'tug of war' between father and son "
        "due to ego clashes. While Saturn can restrict self-confidence when the Sun is debilitated, it also "
        "makes the native mature early by presenting life's harsh realities and heavy responsibilities from "
        "a young age. This conjunction is highly effective in the medical, legal, and political sectors."
    ),
    "effectsDetail": {
        "powerfulSun": (
            "When the Sun dominates, you possess a composed mind and an aura of leadership. This unique caliber "
            "allows for managing large organizations. You become more organized and responsible toward "
            "every obligation in your life."
        ),
        "powerfulSaturn": (
            "When Saturn dominates, life is approached with a reality check. You acknowledge your limits "
            "and move forward with practical clarity. You follow a line of discipline that ensures success "
            "through slow, steady, and positive steps based on past knowledge."
        ),
        "positiveConjunction": (
            "A positive conjunction is favorable in the house of career. It allows you to approach life with "
            "discipline and practicality, bringing a good reputation and materialistic gains, often leading "
            "to work for social causes."
        ),
        "negativeConjunction": (
            "A negative conjunction leads to an undisciplined attitude. Confidence is easily affected, "
            "making you avoid challenges. Instead of hard work, you may emphasize your ego and make "
            "excuses for mistakes rather than accepting and correcting them."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Sun gets directional strength and Saturn is the significator of career; this creates a powerful combination for authority and professional success."
        },
        {
            "house": "6th House",
            "detail": "Positive for winning over rivals and finding professional satisfaction in a dream role."
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
    col = db["Sun_Saturn"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Sun_Saturn collection: document {action}.")
    print(f"     Total documents in Sun_Saturn: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Sun_Saturn collection...")
    asyncio.run(seed())
    print("[+] Done.")
