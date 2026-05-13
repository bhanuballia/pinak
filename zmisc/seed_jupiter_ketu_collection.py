"""
Seed: Jupiter_Ketu collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Jupiter-Ketu Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Jupiter represents expansion and wisdom; Ketu represents detachment and liberation.",
        "Known as 'Ganesha Yoga', which is highly auspicious for knowledge with a purposeful intention.",
        "Natives are often true humanitarians who work progressively for the benefit of society.",
        "Grants expertise in extraordinary matters and an analytical ability based on deep intuition.",
        "Approach is very straightforward, which can sometimes appear impolite to others."
    ],
    "effects": {
        "powerfulJupiter": [
            "Manifests as a deep concern for spiritual values and benevolent behavior toward others.",
            "Blesses the native with optimism and patience to share intellectual wisdom as advice.",
            "Weakness here can lead to emotional restlessness and a complete detachment from the world."
        ],
        "powerfulKetu": [
            "Activates a strong inclination toward detachment from the materialistic aspects of life.",
            "Gives the mind a powerful ability to research and look deeply into complex subject matters.",
            "High levels of contentment with fewer desires, though observation depends on Jupiter's strength."
        ]
    },
    "nature": {
        "positive": [
            "Ability to look deeply into matters of concern, especially those related to life's depth.",
            "High level of contentment and the ability to perform worldly duties while progressing spiritually.",
            "Native turns inward for self-guidance, often becoming a famous and appreciated mentor."
        ],
        "negative": [
            "Opposite forces can ruin harmony in relationships and professional responsibilities.",
            "May lead to indifference toward familial duties and, in extreme cases, leaving the family.",
            "Native can become restless and obsessed with detachment, losing the balance of wisdom."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong prosperity and luck with powerful religious and spiritual inclinations."
        },
        {
            "house": "2nd House",
            "effect": "Potential troubles in family life and wealth retention; possible addiction to bad habits."
        },
        {
            "house": "3rd House",
            "effect": "Strong and daring nature; native is often blessed with excellent writing skills."
        },
        {
            "house": "4th House",
            "effect": "Good prosperity related to children and high intelligence due to Jupiter's strength here."
        },
        {
            "house": "5th House",
            "effect": "Restlessness in attitude and stress regarding children's education or performance."
        },
        {
            "house": "6th House",
            "effect": "Monetary benefits are possible, though health and rivals may cause issues if afflicted."
        },
        {
            "house": "7th House",
            "effect": "Disharmony in marital relations; partner may exhibit cunning or secretive behavior."
        },
        {
            "house": "8th House",
            "effect": "Aggravates existing problems and increases obstacles from all possible sources."
        },
        {
            "house": "9th House",
            "effect": "Moderate religious inclination with less progressive relations with the father."
        },
        {
            "house": "10th House",
            "effect": "Frequent problems in career advancement and the achievement of worldly goals."
        },
        {
            "house": "11th House",
            "effect": "Good monetary gains, though there may be a tendency toward dishonesty at work."
        },
        {
            "house": "12th House",
            "effect": "Strong spiritual inclination with significantly less interest in physical intimacy."
        }
    ],
    "keywords": ["jupiter", "ketu", "conjunction", "ganesha yoga", "detachment", "liberation", "humanitarian", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Jupiter is the significator of wealth and wisdom, while Ketu (dragon's tail) represents "
        "separation from materialistic wealth in favor of spiritual salvation. Their conjunction "
        "creates 'Ganesha Yoga,' an auspicious alignment for purposeful knowledge. Natives with "
        "this placement are often humanitarians who preach unique beliefs and possess expertise "
        "in extraordinary matters. While it fosters deep intuition and analytical logic, it can "
        "also cause a restless mind over small matters and an impolitely straightforward manner."
    ),
    "effectsDetail": {
        "powerfulJupiter": (
            "When Jupiter dominates, you are deeply concerned with spiritual beliefs. You are "
            "benevolent and eager to share your wisdom with others, helping them navigate "
            "learning journeys with optimism and patience while staying close to reality."
        ),
        "powerfulKetu": (
            "When Ketu dominates, your mind is inclined toward research and looking deeply into "
            "the core of things. You may experience a strong urge to detach from materialistic life "
            "to pursue liberation, though the effectiveness of your wisdom depends on Jupiter's "
            "underlying strength."
        ),
        "positiveConjunction": (
            "A positive conjunction allows you to perform your worldly duties while consecutively "
            "making efforts for spiritual progress. You turn inward for guidance and reach high "
            "levels of contentment with fewer desires, often gaining appreciation as a mentor."
        ),
        "negativeConjunction": (
            "A negative conjunction leads to obsession with disconnection. This can ruin the "
            "harmony of your relationships as you become indifferent to familial responsibilities. "
            "Without the wisdom of Jupiter, this detachment leads to restlessness and isolation."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "4th House",
            "detail": "Native is endowed with high intelligence and experiences prosperity through children; Jupiter acts as if it were in its exaltation sign here."
        },
        {
            "house": "1st House",
            "detail": "Grants high prosperity and luck, fueled by a strong religious inclination that guides the native's lifelong path."
        },
        {
            "house": "12th House",
            "detail": "Perfect for spiritual seekers; the native develops a deep interest in liberation and a corresponding lack of interest in physical or worldly pleasures."
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
    col = db["Jupiter_Ketu"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Jupiter_Ketu collection: document {action}.")
    print(f"     Total documents in Jupiter_Ketu: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Jupiter_Ketu collection...")
    asyncio.run(seed())
    print("[+] Done.")
