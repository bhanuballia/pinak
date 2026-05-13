"""
Seed: Mercury_Moon_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mercury-Venus Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a soft, nurturing, and highly creative personality.",
        "Combines Mind (Moon), Logic (Mercury), and Art (Venus) for exceptional emotional intelligence and charm.",
        "Natives are known for their soft-spoken, well-mannered demeanor and poetic approach to life."
    ],
    "planetRoles": {
        "Moon": "Mind, emotions, maternal care, intuition, basic comforts",
        "Mercury": "Logic, communication, analytical skills, wit, business acumen",
        "Venus": "Art, harmony, romance, wealth, luxury, social grace"
    },
    "effects": {
        "powerfulMoon": [
            "Grants intuitive powers to execute logical ideas and execute work on time.",
            "Provides empathy and nurturing abilities that build deep, lasting relationships.",
            "Ensures a determined approach and hope even in challenging situations."
        ],
        "powerfulMercury": [
            "Grants the ability to lead teams with empathy and work effectively with the masses.",
            "Provides a keen sense of trending topics and fashion, ensuring business success.",
            "Ensures mental agility and an adaptable nature to learn new skills rapidly."
        ],
        "powerfulVenus": [
            "Grants a highly creative, emotionally intelligent, and graceful personality.",
            "Ensures an eye for detail in building strong personal and professional bonds.",
            "Provides guidance from females and excellence in communication within creative fields."
        ]
    },
    "nature": {
        "positive": [
            "Charismatic, attractive, and romantic personality with excellent communication skills.",
            "Eloquent and poetic approach that draws others toward your pleasant demeanor.",
            "Strong support from mother, maternal family, and a wide circle of female friends.",
            "Success in financial sectors, luxury industries, fashion, media, and the arts."
        ],
        "negative": [
            "Self-centered approach and potential for overindulgence in comfort or luxury.",
            "Tendency toward flirtatious or superficial love relationships and impulsive love decisions.",
            "Mood swings due to an emotional need for constant validation or approval.",
            "Vulnerability to gossip, flattery, and falling in love too quickly or repeatedly."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Charismatic and soft-spoken; diplomat in conflict resolution; charming social presence."
        },
        {
            "house": "4th House",
            "effect": "Abundance of domestic luxury; strong maternal influence; success in interior design or finance."
        },
        {
            "house": "5th House",
            "effect": "Romantic personality with artistic flair; success with friends and creative skillsets."
        },
        {
            "house": "10th House",
            "effect": "Well-known for eloquence and empathy; success in fashion, movies, or counseling."
        }
    ],
    "keywords": ["moon", "mercury", "venus", "conjunction", "creativity", "charm", "eloquence", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A strong Moon grants you the intuitive power to execute logical ideas effectively. You "
            "possess the empathy and nurturing abilities required to provide for others, which "
            "helps you build solid foundations in both personal and professional life."
        ),
        "powerfulMercury": (
            "Mercury provides you with a keen sense of trends and a sharp ability to work with the masses. "
            "You lead teams with empathy and stay updated with the latest in fashion and "
            "business, ensuring your professional ventures are always relevant and successful."
        ),
        "powerfulVenus": (
            "Venus manifests as a highly creative and graceful personality. You have an eye for detail "
            "and never miss the chance for one-to-one contact, which is vital for relationship "
            "building. Guidance from female figures and all basic comforts are assured under "
            "Venus's positive status."
        )
    },
    "positiveDetail": (
        "This conjunction blends emotional sensitivity with intellectual sharpness, resulting in a caring, "
        "soft-hearted personality. You possess artistic brilliance in music, dance, or writing, "
        "and your eloquent communication skills make you a persuasive, trustworthy speaker. "
        "Charisma and attractiveness are your key traits, helping you have positive relationships "
        "with everyone. You find significant support from your mother and female friends, who "
        "guide you through challenges. Prosperity flows from creative fields, luxury brands, "
        "and financial sectors, where your calm, magnetic presence earns you both wealth "
        "and recognition."
    ),
    "negativeDetail": (
        "Negative influences manifest as a self-centered approach and overindulgence in pleasures. "
        "Affliction can lead to flirtatious or superficial relationships, with a risk of "
        "falling in love too quickly or extramarital affairs. You may become prone to gossip, "
        "mood swings, or a lack of commitment if you seek too much approval. Misunderstandings "
        "may arise from mixed emotional signals, and you might struggle to handle rejection "
        "or emotional setbacks. A focus on appearances over depth can lead to self-worth "
        "issues and unplanned expenses on fleeting luxuries."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native has a charming, charismatic personality and a soft-spoken, diplomatic way of handling conflict. You are a natural at building contacts and professional leads through your eloquence and good sense of art and fashion."
        },
        {
            "house": "4th House",
            "detail": "Identity is centered on home comfort and family affection. You enjoy a well-decorated, luxurious living space and possess the intellectual capacity for deep domestic discussions. Success in banking, interior design, or finance is common."
        },
        {
            "house": "5th House",
            "detail": "Powerhouse for romantic adventures and artistic flair. You are expressive in love and enjoy nurturing energy that brings you a successful love life and a pleasant social circle. People are naturally drawn to your company."
        },
        {
            "house": "10th House",
            "detail": "Ensures a good professional rank in fields like architecture, media, movies, or counseling. You are well-known for your eloquence and empathy, though you must guard against letting public admiration affect your professional objectivity."
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
    # Alphabetical order: Mercury, Moon, Venus
    col_name = "Mercury_Moon_Venus"
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
    print("[*] Seeding Mercury_Moon_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
