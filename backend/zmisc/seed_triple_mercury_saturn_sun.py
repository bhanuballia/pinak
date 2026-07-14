"""
Seed: Mercury_Saturn_Sun collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mercury-Saturn Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a sharp, disciplined, and highly rational intellect.",
        "Combines Soul (Sun), Logic (Mercury), and Responsibility (Saturn) for law-abiding and reliable leadership.",
        "Natives often achieve massive professional stability and authority after age 36, excelling in strategic and technical fields."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, father, government status, higher moral values",
        "Mercury": "Intelligence, communication, rational thinking, business deals, skillsets",
        "Saturn": "Discipline, strategy, responsibility, maturity, long-term effort"
    },
    "effects": {
        "powerfulSun": [
            "Ensures gradual progress and a high rank in the government sector.",
            "Grants growth in construction and heavy machinery industries.",
            "Provides the intelligence to create innovative business ideas and finds support from the father."
        ],
        "powerfulMercury": [
            "Grants exceptional thinking abilities and mastery over business negotiations.",
            "Ensures support from siblings, friends, and professional contacts.",
            "Provides an eloquent speech and command over multiple skillsets and educational backgrounds."
        ],
        "powerfulSaturn": [
            "Ensures maturity over emotional decisions and success through a strategic approach.",
            "Provides clarity and the right mentor after age 36; ensures law-abiding conduct.",
            "Grants the ability to operate with a serious sense of responsibility toward family and society."
        ]
    },
    "nature": {
        "positive": [
            "Deep thinker with a practical approach and immense patience.",
            "Law-abiding, disciplined, and reliable personality capable of managing large institutions.",
            "Execution of long-term strategies with high efficiency and a mature sense of duty.",
            "Ideal for fields requiring logic, discipline, and bureaucratic management."
        ],
        "negative": [
            "Clashes of opinion and inner conflict, often leading to low self-esteem in early life.",
            "Difficulty following others' instructions, making employment as a subordinate challenging.",
            "Reserved, self-centered approach with a tendency to focus on flaws or worst-case scenarios.",
            "Cold or distant dynamics in love and marital life due to emotional dryness."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Analytical approach; mature and aged outlook on life; confident sharing of ideas after 36."
        },
        {
            "house": "3rd House",
            "effect": "Restricted initial sharing; specific skillset for professional growth; gain from travels."
        },
        {
            "house": "5th House",
            "effect": "Sharp intellect in tough situations; success in engineering, math, and languages."
        },
        {
            "house": "10th House",
            "effect": "High rank and professional comforts; ability to learn diplomatic and manipulative strategies."
        }
    ],
    "keywords": ["sun", "mercury", "saturn", "conjunction", "strategy", "discipline", "logic", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun in this conjunction helps you make gradual progress toward a high rank in "
            "government. You possess the intelligence to generate innovative business ideas and find "
            "success in construction or heavy machinery. Support from your father and government "
            "facilities provides a solid base for your ambitions."
        ),
        "powerfulMercury": (
            "Mercury grants you exceptional thinking and deal-making abilities. You find expected growth "
            "in business and professional circles through your eloquent speech. Your educational "
            "background is diverse, and you possess a command over multiple skills, earning the "
            "trust of professional contacts and siblings."
        ),
        "powerfulSaturn": (
            "Saturn ensures you operate with maturity rather than emotion. While it may initially "
            "restrict success due to a lack of strategy, you find your path and right mentors after "
            "age 36. It grants the discipline to manage heavy responsibilities, though it can "
            "manifest as a serious or 'dry' demeanor in personal relationships."
        )
    },
    "positiveDetail": (
        "This triple conjunction blends higher moral values with disciplined logic. You are a deep "
        "thinker with a sharp, rational intellect and a mature sense of responsibility. Success "
        "comes through long-term strategies and an efficient, law-abiding personality. You are "
        "ideally suited for high-ranking bureaucratic roles, managing institutions with logic "
        "and patience. Your reliable nature makes you the pillar of your family and friend "
        "circles, always ready to support those in need and uphold societal norms with dignity."
    ),
    "negativeDetail": (
        "Negative influences cause inner conflict and a rigid resistance to new ideas. In the "
        "initial phase of life, you may suffer from low self-esteem and mental clutter due to "
        "a lack of support. Anger issues and an inability to follow instructions can make "
        "traditional employment difficult. Relationships may suffer from emotional detachment, "
        "pride, and a 'worst-case scenario' mindset. Love life can feel dry or distant, and "
        "a lack of thankfulness may alienate you from family and friends."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a strong strategic and analytical approach. You appear more mature than your age and are specific about expressing feelings. Confidence in sharing ideas peaks after age 36, leading to long life, sound health, and acceptance by elders."
        },
        {
            "house": "3rd House",
            "detail": "Identity is shaped by a restricted initial approach to communication. However, travel and guidance from elders eventually sharpen your judgment. You possess a specific skillset that ensures professional growth despite hurdles in higher education."
        },
        {
            "house": "5th House",
            "detail": "Blesses the native with sharp intelligence and success in math, engineering, or languages. Multiple income sources are indicated, though creativity may feel forced. Love relationships require extra effort due to diminished empathy and difficulty expressing feelings."
        },
        {
            "house": "10th House",
            "detail": "Ensures a high professional rank and social comfort, particularly after age 36. You excel at learning multiple languages and building senior professional contacts. Clashes of opinion between Saturn and the Sun eventually teach you valuable diplomatic and manipulative strategies."
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
    # Alphabetical order: Mercury, Saturn, Sun
    col_name = "Mercury_Saturn_Sun"
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
    print("[*] Seeding Mercury_Saturn_Sun triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
