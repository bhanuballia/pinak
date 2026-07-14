"""
Seed: Moon_Mars collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mars Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Moon represents the mind and emotional balance; Mars represents courage and initiative.",
        "Forms the highly auspicious 'Chandra-Mangal Yoga' for wealth and leadership.",
        "Indicates a strong will and the ability to attain goals despite significant hardships.",
        "Natural friends, this combination works exceptionally well in the corporate world.",
        "In a female horoscope, this can sometimes indicate a more dominant or independent personality."
    ],
    "effects": {
        "powerfulMoon": [
            "Directs the psychological faculty to respond with logic and controlled anger.",
            "Thinking process and emotional responses are well-balanced and objective.",
            "Enables reacting to adversity with a calm but decisive mindset."
        ],
        "powerfulMars": [
            "Grants the willpower and inertia to stand for beliefs and win over complex situations.",
            "Positive energy that enables one to fight for the country or the underprivileged.",
            "Provides the direction needed for actions to be progressive and results-oriented."
        ]
    },
    "nature": {
        "positive": [
            "Innovative creativity combined with the positive energy required for career success.",
            "Enhanced personality with a good sense of humor and a strong social reputation.",
            "Ability to listen to others and respect personal space, avoiding unnecessary contradictions."
        ],
        "negative": [
            "Shadows of fear and aggression that block emotional balance and logical action.",
            "Spark of rudeness in speech and arrogance in attitude that strains relationships.",
            "Impulsive anger and manipulative tactics used to achieve desires at any cost."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Courageous and attractive personality with a level of emotional strictness."
        },
        {
            "house": "2nd House",
            "effect": "Grants name and fame, though there may be contradictions in family relationships."
        },
        {
            "house": "3rd House",
            "effect": "Bold and influential speech that impresses others, though straightforwardness may offend."
        },
        {
            "house": "4th House",
            "effect": "Happiness, wealth, and property achieved through sheer willpower; lacks social company."
        },
        {
            "house": "5th House",
            "effect": "Popularity and creativity; charitable nature but potentially stubborn regarding children."
        },
        {
            "house": "6th House",
            "effect": "Success in professional life and victory over rivals, though health caution is needed."
        },
        {
            "house": "7th House",
            "effect": "Blesses the native with a beautiful, responsible partner and professional success."
        },
        {
            "house": "8th House",
            "effect": "Kind and supportive nature with the possibility of sudden gains through hard work."
        },
        {
            "house": "9th House",
            "effect": "Increased inclination toward spirituality and government support; can be irritable."
        },
        {
            "house": "10th House",
            "effect": "High success in business and government positions, but discord in personal life."
        },
        {
            "house": "11th House",
            "effect": "Success through stock markets and speculation; high respect and wealth in life."
        },
        {
            "house": "12th House",
            "effect": "Emotional and impulsive nature; potential earnings through foreign connections."
        }
    ],
    "keywords": ["moon", "mars", "conjunction", "chandra mangal yoga", "wealth", "prosperity", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Moon represents the mind and mother, while Mars represents anger, courage, and initiative. "
        "Their conjunction forms the 'Chandra-Mangal Yoga,' which is exceptionally auspicious for "
        "wealth and prosperity. Since both planets are natural friends, they work well together "
        "to create an action-oriented person who achieves goals despite obstacles. However, "
        "if the energy is unbalanced, it can lead to impulsive anger, stubbornness, and "
        "manipulative tactics in social or personal interactions."
    ),
    "effectsDetail": {
        "powerfulMoon": (
            "When the Moon dominates, your emotional responses are logically controlled. You have "
            "the psychological faculty to respond to stressful situations with balanced action "
            "rather than explosive reactions. This makes you dependable and objective."
        ),
        "powerfulMars": (
            "When Mars dominates, you stand firmly for your beliefs. This energy gives clear "
            "direction to your actions and the willpower to win over complex situations. You "
            "possess the fighting spirit of a soldier or sportsman who strives for victory."
        ),
        "positiveConjunction": (
            "A positive conjunction is a perfect mix of energy and creativity. It brings prosperity "
            "in both career and marital life, often granting a good sense of humor and a strong "
            "reputation. Success comes easily if you maintain respect for others' personal space."
        ),
        "negativeConjunction": (
            "A negative conjunction creates shadows of aggression that block emotional balance. "
            "You may invite challenges through rudeness in speech and arrogance, leading to "
            "strained relationships and emotional turbulence."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Highly successful for business and government positions, though self-efforts may lead to discord in personal life."
        },
        {
            "house": "3rd House",
            "detail": "Speech is influential and bold enough to impress the public, but straightforwardness can turn friends into rivals."
        },
        {
            "house": "4th House",
            "detail": "Native achieves wealth and property through sheer willpower, though they may prefer solitude over social company."
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
    col = db["Moon_Mars"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Moon_Mars collection: document {action}.")
    print(f"     Total documents in Moon_Mars: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Moon_Mars collection...")
    asyncio.run(seed())
    print("[+] Done.")
