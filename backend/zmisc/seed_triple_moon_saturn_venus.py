"""
Seed: Moon_Saturn_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Venus-Saturn Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a graceful, disciplined, and emotionally mature personality.",
        "Combines Mind (Moon), Beauty (Venus), and Restriction (Saturn) for a down-to-earth yet refined character.",
        "Natives are known for their calm emotional responses, deep commitment in relationships, and ability to work with grace under pressure."
    ],
    "planetRoles": {
        "Moon": "Mind, emotions, maternal support, nurturing, psychological depth",
        "Venus": "Art, beauty, romance, social harmony, refined taste, inner elegance",
        "Saturn": "Discipline, stability, practical approach, maturity, long-term commitment"
    },
    "effects": {
        "powerfulMoon": [
            "Grants emotional intelligence and a caring personality with a deep sense of maturity.",
            "Blesses the native with a graceful and disciplined approach to balancing beauty and responsibility.",
            "Ensures an artistic approach to life, providing emotional stability and calm responses."
        ],
        "powerfulVenus": [
            "Grants a graceful, down-to-earth personality with the ability to maintain harmony.",
            "Ensures deep sensitivity and commitment in relationships with a practical approach to love.",
            "Provides the talent to help others resolve conflicts and find inner elegance."
        ],
        "powerfulSaturn": [
            "Manifests as emotional maturity and the ability to make decisions with a structured, practical approach.",
            "Ensures discipline in both personal and professional life, valuing long-term ties.",
            "Provides the endurance to achieve perfection in tasks through persistent and steady effort."
        ]
    },
    "nature": {
        "positive": [
            "Calm emotional responses and the ability to work with grace under extreme pressure.",
            "Refined taste and a cultured demeanor that values inner beauty over superficial attraction.",
            "Success in art-related careers with a traditional approach and persistent effort toward perfection.",
            "Strong sense of public duty and professional aesthetics, leading to fame in healing or design."
        ],
        "negative": [
            "Emotional coldness, suppressed feelings, and frustrated desires leading to loneliness.",
            "Stagnant emotions and a pessimistic approach due to overthinking or family burdens.",
            "Overprotective or demanding nature in love causing relationship challenges and social withdrawal.",
            "Potential for anxiety and loss of peace at home if afflicted by Saturn-Moon friction."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Quietly introspective but intelligent; stable marital life; high professional rank."
        },
        {
            "house": "4th House",
            "effect": "Strong family background; abundance of assets; dutiful toward the mother."
        },
        {
            "house": "7th House",
            "effect": "Long-term committed partnership; partner may be more mature; strong professional influences."
        },
        {
            "house": "10th House",
            "effect": "Authoritative yet warm public image; success in beauty, government, or real estate."
        }
    ],
    "keywords": ["moon", "venus", "saturn", "conjunction", "grace", "discipline", "maturity", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A strong Moon grants emotional intelligence and a caring heart. You balance beauty with a "
            "deep sense of responsibility, approaching life with a graceful and disciplined mind. Your "
            "emotional maturity allows you to nurture others while maintaining your own inner stability."
        ),
        "powerfulVenus": (
            "Venus manifests as a down-to-earth and graceful personality. You maintain harmony in your "
            "relationships and possess the unique talent of helping others escape conflict. In love, "
            "you are deeply sensitive and committed, bringing a practical yet beautiful touch to "
            "all your interactions."
        ),
        "powerfulSaturn": (
            "Saturn provides the maturity to make practical decisions. You value long-term commitment "
            "above all else and approach both personal and professional duties with strict discipline. "
            "While you may be prone to overthinking, your slow and steady approach ensures your "
            "achievements are lasting."
        )
    },
    "positiveDetail": (
        "This conjunction creates a personality of inner elegance and cultured demeanor. You possess the "
        "self-awareness and disciplined outlook required to achieve perfection in each task. Your "
        "approach to love is responsible, prioritizing inner beauty and authenticity over fleeting "
        "attractions. The blend of Moon and Saturn provides a structured plan for your life, "
        "preventing you from being dragged down by volatile emotions, while Venus grants the "
        "grace to work under pressure. You enjoy refined tastes and a loyal partner, often "
        "attaining success in traditional art-related careers. Your professional image is "
        "authoritative yet warm, blending a strong sense of public duty with a keen eye "
        "for professional aesthetics."
    ),
    "negativeDetail": (
        "Negative influences manifest as emotional coldness and stagnant feelings, potentially leading "
        "to loneliness in your love life. Overexpectations and an overprotective nature can cause "
        "challenges in romantic partnerships. Affliction can turn your discipline into a "
        "pessimistic approach, pulling you toward social withdrawal or chronic anxiety. You "
        "may feel burdened by family responsibilities, leading to a loss of peace at home. "
        "Insecurity regarding your creative talents and a tendency to isolate yourself due to "
        "overthinking are risks. A lazy approach or dependency in relationships can block "
        "your ambitions unless overcome with consistent, persistent effort."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native has a calm, mature, and attractive appearance. People perceive you as an intelligent individual with a traditional outlook. You enjoy a stable public image and high professional rank, though stability may only truly manifest after age 36."
        },
        {
            "house": "4th House",
            "detail": "Identity is rooted in a strong family background and maternal support. You are dutiful toward your mother and prioritize basic comforts in a large, disciplined home. This placement ensures a good gain of property and success in your daily work routine."
        },
        {
            "house": "7th House",
            "detail": "Powerhouse for long-term, mature partnerships based on loyalty and karmic ties. Your partner is likely more mature than you, influencing your decisions with wisdom. While marriage may be delayed, the eventual bond is emotionally deep, beautiful, and stable."
        },
        {
            "house": "10th House",
            "detail": "Ensures a high professional rank in fields like design, healing, or government. You are known for your persistent effort and eye for detail, achieving perfection in your career. Your public image balances authoritative professionalism with nurturing warmth."
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
    db = client["Triple_Planet_Conjunction"]
    # Alphabetical order: Moon, Saturn, Venus
    col_name = "Moon_Saturn_Venus"
    col = db[col_name]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Triple Planet Conjunction: {col_name} {action}.")
    print(f"     Total documents in {col_name}: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Moon_Saturn_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
