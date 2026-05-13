"""
Seed: Jupiter_Mercury_Moon collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mercury-Jupiter Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly intelligent, empathetic, and wise personality.",
        "Combines Mind (Moon), Logic (Mercury), and Wisdom (Jupiter) for exceptional emotional intelligence.",
        "Natives are masters of multiple skills, known for their eloquent speech and deep desire to share knowledge meaningfully."
    ],
    "planetRoles": {
        "Moon": "Mind, emotions, maternal support, intuition, basic comforts",
        "Mercury": "Intelligence, communication, adaptability, analytical skills, acting/wit",
        "Jupiter": "Wisdom, morality, expansion, higher education, divine grace, wealth"
    },
    "effects": {
        "powerfulMoon": [
            "Grants nurturing abilities and psychic receptivity to people's emotional needs.",
            "Ensures a concentrated approach toward earning knowledge and attracting the masses.",
            "Provides deep support from mentors and friends, leading to a socially pleasant life."
        ],
        "powerfulMercury": [
            "Grants a sharp intellect and command over multiple languages and mathematics.",
            "Ensures success in logical reasoning and picking up new skills rapidly.",
            "Provides guidance from the right mentors at an early age, leading to scholarship success."
        ],
        "powerfulJupiter": [
            "Grants an optimistic approach and the ability to generate ideas that guide others.",
            "Ensures growth and recognition in finance, religion, philosophy, and spirituality.",
            "Provides strong command over emotional decisions and success in marital life."
        ]
    },
    "nature": {
        "positive": [
            "High emotional intelligence and a balanced, wise, and analytical approach to life.",
            "Persuasive and trustworthy speaker with emotional warmth and intellectual depth.",
            "Substantial gains in wealth and income with financial stability even after retirement.",
            "Natural counseling ability and success in teaching, law, writing, or administration."
        ],
        "negative": [
            "Tendency to overthink and overanalyze emotions, causing decision-making delays.",
            "Emotional dependence on intellectual validation and potential for preachy behavior.",
            "Vulnerability to being gullible or self-righteous about one's knowledge.",
            "Nervous issues or headaches due to mental overload and constant reflection."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Attractive and charismatic; emotionally expressive; support from parents and maternal family."
        },
        {
            "house": "5th House",
            "effect": "Calm and optimistic; ability to resolve others' conflicts; successful love life and children."
        },
        {
            "house": "10th House",
            "effect": "High intellectual approach; respected leader in education, law, or finance sectors."
        }
    ],
    "keywords": ["moon", "mercury", "jupiter", "conjunction", "wisdom", "intellect", "empathy", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A powerful Moon in this conjunction grants exceptional nurturing abilities and psychic receptivity. "
            "You possess a concentrated approach toward knowledge and attracting the masses. Your public "
            "image is of a nurturing leader who finds deep support from mentors and a wide circle of friends."
        ),
        "powerfulMercury": (
            "Mercury provides a sharp intellect and command over multiple languages. You excel in "
            "logical reasoning and analytical tasks, often earning scholarships. Your adaptability "
            "allows you to learn new skills rapidly, aided by guidance from the right mentors "
            "at the perfect age."
        ),
        "powerfulJupiter": (
            "A strong Jupiter ensures an optimistic outlook and the ability to guide others with wise "
            "suggestions. You see significant growth in the financial sector and enjoy a good name "
            "in society. Your decisions are ethically sound, ensuring success in marital life "
            "and professional domains related to spirituality or philosophy."
        )
    },
    "positiveDetail": (
        "This conjunction makes you a master of multiple skills, providing all basic comforts and "
        "massive growth through knowledge. You are emotionally intuitive and logical, balancing "
        "high moral values with intellectual depth. As a persuasive and trustworthy speaker, "
        "your words carry emotional warmth that inspires others. You are naturally inclined toward "
        "teaching, counseling, and writing, often attaining a high rank in finance, education, "
        "or religious sectors. Substantial gains in wealth and stability continue even after "
        "retirement, and you enjoy deep happiness in domestic and marital life."
    ),
    "negativeDetail": (
        "Negative influences can lead to overthinking and emotional dependence on intellectual "
        "validation. You may become preachy, self-righteous, or arrogant about your knowledge. "
        "Affliction can cause mental restlessness, procrastination, or a tendency to reveal "
        "secrets impulsively. Inconsistencies in thought can disturb relationship harmony, "
        "while mental overload may manifest as headaches or nervous issues. Being gullible "
        "or adopting an overly idealistic approach can hinder practical decision-making "
        "and lead to emotional overwhelm."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses an attractive, charismatic personality and strong immunity. Affection from the mother and maternal family ensures a wealthy lifestyle and sound emotional upbringing. You build excellent relationships with siblings and are known for your expressive wisdom and ethics."
        },
        {
            "house": "5th House",
            "detail": "Identity is defined by a calm, optimistic personality and the ability to resolve complex conflicts. Your suggestions are viewed as a boon by others. You enjoy a successful love life and support from children, backed by sharp analytical skills and multi-language proficiency."
        },
        {
            "house": "10th House",
            "detail": "Powerhouse for intellectual success and duty-bound leadership. You use logical ability to learn at any age and climb the professional ladder with support from high-level leaders. High rank in administration, law, or counseling is assured through your wise emotional intelligence."
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
    # Alphabetical order: Jupiter, Mercury, Moon
    col_name = "Jupiter_Mercury_Moon"
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
    print("[*] Seeding Jupiter_Mercury_Moon triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
