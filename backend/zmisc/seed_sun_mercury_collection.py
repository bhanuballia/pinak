"""
Seed: Sun_Mercury collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mercury Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Sun represents father, authority, and soul; Mercury represents intelligence and speech.",
        "Mercury is a princely planet that blends with the traits of the Sun.",
        "Commonly known as Budhaditya Yoga when certain conditions are met.",
        "Proximity within 7 degrees enhances intelligence; more than 15 degrees is less beneficial.",
        "Father often supports and initiates the person's achievements."
    ],
    "effects": {
        "powerfulSun": [
            "Forms Budhaditya yoga, contributing to progress in assorted fields.",
            "Strong Sun brings quick realization of success.",
            "Drives personality through ego, pride, and a confident attitude."
        ],
        "powerfulMercury": [
            "Example of high intelligence and creativity.",
            "Blesses proficiency in speech and confident delivery of thoughts.",
            "Skills may be acquired or inherited from the father, leading to professional efficiency."
        ]
    },
    "nature": {
        "positive": [
            "Eloquent speech, dignity, and a magnetic personality.",
            "Placement of authority based on strong intellect.",
            "Leads to good earnings, power, and high social status."
        ],
        "negative": [
            "Hesitancy in speaking due to confusion or unreliable thoughts.",
            "Difficulty handling leadership roles despite the sense of power.",
            "Slower pace of progress and skills acquired late in life."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong self, excellent career, and outstanding analytical/communication skills."
        },
        {
            "house": "3rd House",
            "effect": "Unconditional support and love from siblings and peers."
        },
        {
            "house": "4th House",
            "effect": "Success in tasks, reputation, and politics, though hurdles in love life may exist."
        },
        {
            "house": "5th House",
            "effect": "Expert in calculative/financial work; rich, creative, and admired by peers."
        },
        {
            "house": "7th House",
            "effect": "Intelligence and logical thoughts; good marriage if planets are benefice."
        },
        {
            "house": "8th House",
            "effect": "Healthy long life, gains from inheritance, and profit from foreign trade."
        },
        {
            "house": "9th House",
            "effect": "High status and authority, though success may lead to egoistic hurdles in relations."
        },
        {
            "house": "10th House",
            "effect": "Professional and political success with a strong reputation and status."
        },
        {
            "house": "11th House",
            "effect": "Fulfillment of monetary desires and gains from stock markets/speculation."
        },
        {
            "house": "12th House",
            "effect": "Profits from foreign connections and interest in exploring spirituality."
        }
    ],
    "keywords": ["sun", "mercury", "conjunction", "budhaditya yoga", "vedic astrology"],
    
    # Narrative descriptions for detailed view
    "description": (
        "Sun represents your father, authority, aggression and soul, royal presence and power that displays the "
        "confidence and the actions in any given situation. Mercury is the planet of intelligence, speech and "
        "communications which has the princely status and the attitude to blend with the traits of the planet it "
        "conjoins. Sun-Mercury conjunction is common as Mercury is never far from the Sun. Proximity within 7 degrees "
        "gives good intelligence, but more than 15 degrees apart is less beneficial. The person is often supported "
        "by the father in achievements. If placed in quadrant or trine houses, speech carries a streak of confidence."
    ),
    "effectsDetail": {
        "powerfulSun": (
            "When the Sun dominates, it translates into drive, ego, pride and attitude. This forms Budhaditya yoga, "
            "a major contributor to progress in various fields. A strong Sun brings quick realization of success."
        ),
        "powerfulMercury": (
            "When Mercury dominates, it showcases intelligence and creativity. A strong Mercury blesses you with "
            "proficiency in speech and action. You can deliver thoughts confidently. Skills may be inherited "
            "from the father, making you efficient on both personal and professional fronts."
        ),
        "positiveConjunction": (
            "A positive conjunction blesses you with a good personality, intelligence, and eloquence of speech. "
            "Progress is visible in the arena of its placement. This majestic combination leads to authority "
            "positions, good earnings, power, and status."
        ),
        "negativeConjunction": (
            "A negative conjunction causes hesitancy in speaking due to confusion over reliability. While there "
            "is a sense of power, leadership is hard to handle due to average creative skills. Progress is "
            "often slow and comes late in life."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Most beneficial placement for Budh-Aditya yoga. Self is strong with a good career and analytical skills."
        },
        {
            "house": "5th House",
            "detail": "Beneficial for calculative work, accounting, and financial sectors. Admired by peers for eloquence."
        },
        {
            "house": "10th House",
            "detail": "Best house for professional and political success. High reputation achieved through hard work."
        }
        # Other houses can be accessed via the main housePlacements array
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
    col = db["Sun_Mercury"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Sun_Mercury collection: document {action}.")
    print(f"     Total documents in Sun_Mercury: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Sun_Mercury collection...")
    asyncio.run(seed())
    print("[+] Done.")
