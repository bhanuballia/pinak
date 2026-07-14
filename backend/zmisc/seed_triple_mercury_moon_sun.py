"""
Seed: Mercury_Moon_Sun collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Mercury Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly intellectual and expressive personality with strong leadership.",
        "Indicates a sharp mind, emotional intelligence, and a powerful soul-driven ego.",
        "Combines logic (Mercury), intuition (Moon), and authority (Sun) for balanced decision-making."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, high rank, power, ego",
        "Moon": "Mind, balanced emotions, relatives, maternal family",
        "Mercury": "Intelligence, communication, skills, logic, analytical mindset"
    },
    "effects": {
        "powerfulSun": [
            "Ensures soul's desire to attain high rank and leadership power.",
            "Blesses the native with Budh-Aaditya Yoga for right decision-making.",
            "Integrates feelings with logic for practical, sound choices."
        ],
        "powerfulMoon": [
            "Commands emotional decisions and considers family/relatives' needs.",
            "Guides the native toward a successful political or social leadership career.",
            "Ensures support and guidance from the maternal family."
        ],
        "powerfulMercury": [
            "Grants sharp memory, fast comprehension, and ability to process complex data.",
            "Provides a sharp analytical mindset and quick logical reasoning/calculations.",
            "Aligns thoughts, feelings, and purpose to create mental harmony."
        ]
    },
    "nature": {
        "positive": [
            "Highly intelligent and potentially an expert on scriptures.",
            "Charismatic voice with inclination toward art, music, and poetry.",
            "Brilliant success in intellectual, communication, and leadership fields.",
            "Ability to read between the lines and master multiple languages."
        ],
        "negative": [
            "Mental overload and ego-driven intellect causing emotional instability.",
            "Rushed or impulsive speech leading to misunderstandings and perceived arrogance.",
            "Restlessness, anxiety, and overthinking due to emotional hyperactive mind.",
            "Tendency to overpromise and underdeliver if afflicted."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Charismatic, intelligent, and attractive personality; strong authority."
        },
        {
            "house": "2nd House",
            "effect": "Strong command over savings; bonding with family and heritage wealth."
        },
        {
            "house": "4th House",
            "effect": "Domestic comfort and general happiness; excellent career in education or finance."
        },
        {
            "house": "5th House",
            "effect": "High intellectual ability; potential in performing arts, politics, or education."
        },
        {
            "house": "10th House",
            "effect": "Power yoga for career; networks with senior officials; clarity in long-term goals."
        }
    ],
    "keywords": ["sun", "moon", "mercury", "conjunction", "intellect", "communication", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "When the Sun is in a powerful status in conjunction with Mercury and Moon, it ensures that the soul's "
            "desire to attain a high rank, good status, and power will be in your favor. It ensures you lead like "
            "a king, with people following your instructions without doubt. The close conjunction with Mercury "
            "blesses you with Budh-Aaditya Yoga, granting right decision-making ability even in challenging "
            "situations. You integrate feelings with logic for sound, practical results."
        ),
        "powerfulMoon": (
            "A strong dignity of the Moon takes command of emotional decisions. You think about all relatives—family, "
            "friends, and the masses—making you an excellent candidate for a successful political career. Confidence, "
            "authority, and strategy help you attain a good rank. Your maternal family will likely serve as a guide "
            "and support system throughout your growth in life."
        ),
        "powerfulMercury": (
            "Mercury in close conjunction with Moon and Sun gives a sharp memory and fast comprehension. It provides "
            "perfection in skills and the ability to process complex information with a sharp analytical mindset. It "
            "boosts logical reasoning and provides good contacts with business partners and the government. Mercury "
            "helps the Moon articulate emotions and creates mental harmony between thoughts and purpose."
        )
    },
    "positiveDetail": (
        "The Moon with Mercury gives emotional intelligence and good analytical skills. This three-planet conjunction "
        "is a brilliant combination for success in intellectual and leadership fields. It makes you highly intelligent, "
        "possibly an expert on scriptures, with a sound ability to read between the lines. You likely possess a "
        "charismatic voice and may excel as a motivational speaker or inspiring poet. Success is indicated in "
        "businesses related to food, government construction, education, chartered accountancy, and travel. Your "
        "mind and intellectual approach are your greatest assets, allowing you to balance humility and empathy "
        "with logic and skill."
    ),
    "negativeDetail": (
        "A close conjunction can cause mental overload and ego-driven intellect, eventually affecting emotional health "
        "and relationships. It may cause rushed or impulsive speech, leading to misunderstandings or a lack of tact. "
        "Arrogance and restlessness are possible if the status is challenging. You may struggle with articulation or "
        "fail to express ideas clearly. Chronic overthinking and mental hyperactivity can make it difficult to switch "
        "off your mind, leading to anxiety. Poor decision-making, driven by ego or urgency rather than analysis, "
        "can lead to overpromising and underdelivering in business plans. Conflict with authority figures due to "
        "overly direct or prideful communication is a risk."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Gives a charismatic, intelligent, and attractive personality with emotional depth and strong authority. Bold communication and a presence that attracts attention easily. Affliction can cause mental agitation and emotional decisions stuck in pride."
        },
        {
            "house": "2nd House",
            "detail": "Placement gives strong command over savings and good bonding with family and government officials. Gains from the mother, happiness from a healthy-food lifestyle, and emotional attachment to family heritage and property are indicated."
        },
        {
            "house": "4th House",
            "detail": "Provides comfort and happiness related to property, vehicles, and general domestic peace. Support from the maternal family and mother is strong. You will have administrative skills and an emotional mental connection with your homeland, likely collecting significant property."
        },
        {
            "house": "5th House",
            "detail": "Native possesses high intellectual abilities and strong analytical decision-making skills. Creativity, education, and speculative intelligence are in-built traits. High potential in performing arts, politics, or roles involving children and education."
        },
        {
            "house": "10th House",
            "detail": "A 'Power Yoga' for career and public life. You will have a massive professional network and can excel in government administration, business, or media. Clarity in setting long-term goals and synergy to run large businesses are hallmarks of this placement."
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
    # Sorting: Mercury, Moon, Sun
    col_name = "Mercury_Moon_Sun"
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
    print("[*] Seeding Mercury_Moon_Sun triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
