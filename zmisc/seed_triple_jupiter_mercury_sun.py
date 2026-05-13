"""
Seed: Jupiter_Mercury_Sun collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mercury-Jupiter Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly intellectual, noble, and charismatic personality.",
        "Combines Soul (Sun), Intelligence (Mercury), and Wisdom (Jupiter) for scholarly and ethical leadership.",
        "Natives possess strong literary abilities and a royal approach to life, often attaining high rank and status."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, high rank, royal approach, government support",
        "Mercury": "Intelligence, public affairs, domestic responsibility, communication",
        "Jupiter": "Wisdom, expansion, ethics, mentors, higher studies, divine grace"
    },
    "effects": {
        "powerfulSun": [
            "Grants sharp intelligence and high self-respect with deep moral values.",
            "Ensures a royal approach to life and interactions, commanding respect like a king.",
            "Provides strong support from the government and father for a successful political career."
        ],
        "powerfulMercury": [
            "Grants intelligence and the ability to manage complex public and domestic affairs.",
            "Ensures success in business related to education, water resources, and religion.",
            "Encourages empathy, potentially leading to success as a psychologist or counselor."
        ],
        "powerfulJupiter": [
            "Grants the ability to understand complex situations and make wise, disciplined decisions.",
            "Ensures a sound educational background and strong support from mentors and grandparents.",
            "Provides in-depth knowledge of scientific and philosophical subjects."
        ]
    },
    "nature": {
        "positive": [
            "Wise and eloquent personality who influences others at a soul level.",
            "Down-to-earth leadership approach with strong ethical judgment and scholarly skills.",
            "Success in higher studies, literature, and roles involving counseling or mentoring.",
            "Committed and noble approach toward love, family, and social responsibilities."
        ],
        "negative": [
            "Ego clashes regarding knowledge and academic achievements.",
            "Tendency toward self-righteousness or looking down on others if afflicted.",
            "Relationship challenges due to a rigid approach and talking more than listening.",
            "Financial instability caused by over-optimism or idealistic attitudes toward money."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Wise, eloquent, and charismatic personality; big family and company of wise people."
        },
        {
            "house": "4th House",
            "effect": "Domestic comfort and happiness; pure heart with deep affection for everyone."
        },
        {
            "house": "5th House",
            "effect": "Strong moral foundation in love and creativity; inclination toward philosophy and teaching."
        },
        {
            "house": "10th House",
            "effect": "High rank and visibility; respected leader in government, law, or management sectors."
        }
    ],
    "keywords": ["sun", "mercury", "jupiter", "conjunction", "scholar", "noble", "wisdom", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun in this conjunction grants sharp intelligence and high self-respect. You interact "
            "with others with a royal approach, commanding respect like a king. This situation ensures "
            "support from the government and your father, leading to a rise in status and potential "
            "success in politics."
        ),
        "powerfulMercury": (
            "With Mercury in good strength, you possess the ability to care for everyone and manage "
            "domestic responsibilities with expertise. You excel in dealing with public affairs and "
            "attain success in business related to education or religion. Your empathy makes you "
            "an ideal candidate for careers in psychology or counseling."
        ),
        "powerfulJupiter": (
            "Jupiter grants you the ability to navigate complex situations with disciplined wisdom. "
            "You enjoy strong support from mentors and grandparents, providing a sound educational "
            "foundation. Your in-depth knowledge of scientific and philosophical subjects helps "
            "you attain lasting happiness and growth."
        )
    },
    "positiveDetail": (
        "This conjunction influences your intelligence toward righteousness and ethical judgment. "
        "You possess strong literary and scholarly abilities, combined with a down-to-earth "
        "leadership approach. Fortune, skills, and recognition follow you, helping you earn "
        "a high rank in society. You are a committed partner in love and marriage, and "
        "your children are likely to find great success. Your practical nature helps you "
        "handle money and power with morality, making you an ideal guide or counselor."
    ),
    "negativeDetail": (
        "Affliction can turn your high self-respect into ego clashes, especially regarding your "
        "academic skills. You may become rigid, refusing to accept feedback or listen to "
        "others' views. Talking too much or imposing beliefs can harm relationships and "
        "financial management. An overly optimistic attitude toward money may lead to losses, "
        "while a self-righteous demeanor can cause resistance in professional circles. "
        "Unnecessary complications arise from a lack of clarity in decision-making."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native is a wise, eloquent, and charismatic individual whom people love to be around. Life themes include intelligence, adaptability, and ethical expansion. You will likely attract wealth and success through the company of wise individuals and a vast skill set."
        },
        {
            "house": "4th House",
            "detail": "Brings comfort and a big family with strong cultural values. Guidance from elders helps you navigate challenges with confidence. You possess a pure, noble heart and build long-term relationships based on deep affection and intellectual synergy."
        },
        {
            "house": "5th House",
            "detail": "Ensures stability in love and meaningful romantic relationships. The native is naturally inclined toward philosophy, literature, and teaching. Jupiter and the Sun boost confidence in leadership expression, while Mercury makes you articulate and persuasive."
        },
        {
            "house": "10th House",
            "detail": "Powerhouse for high rank and society's respect. High ambitions are met with strategic visibility. Your mature decisions lead to prominent roles in government, law, or management, supported by a strong moral code and clarity in thought."
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
    # Alphabetical order: Jupiter, Mercury, Sun
    col_name = "Jupiter_Mercury_Sun"
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
    print("[*] Seeding Jupiter_Mercury_Sun triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
