"""
Seed: Mercury_Sun_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mercury-Venus Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly intelligent, charming, and authoritative personality with a royal touch.",
        "Combines Soul (Sun), Logic (Mercury), and Beauty (Venus) for refined leadership and creative excellence.",
        "Natives possess a sharp intellect, a regal aura, and exceptional diplomatic and verbal persuasion skills."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, father, government status, high moral values",
        "Mercury": "Intelligence, communication, management, technical mindset, business",
        "Venus": "Beauty, luxury, fashion, architecture, charm, social validation"
    },
    "effects": {
        "powerfulSun": [
            "Grants high moral values and the ability to succeed in high-stakes competitive exams.",
            "Ensures growth and success in government-related banking and finance sectors.",
            "Provides strong support from the father and siblings for professional advancement."
        ],
        "powerfulMercury": [
            "Grants a sharp ability to resolve complex problems and excellence in management.",
            "Ensures strong communication skills and mastery over multiple languages.",
            "Provides a technical mindset and engineering skills for enterprising business success."
        ],
        "powerfulVenus": [
            "Grants a regal approach to living and an eye for artistic detail.",
            "Ensures an attractive, magnetic personality with a refined taste in food and fashion.",
            "Provides confidence, authority, and strategy for attaining high-ranking careers."
        ]
    },
    "nature": {
        "positive": [
            "Royal aura and charismatic personality that radiates intellect and charm.",
            "Exceptional skill in business negotiations, verbal persuasion, and building alliances.",
            "Natural inclination toward arts, media, diplomacy, politics, or scholarly teaching.",
            "Balanced approach of power, love, and creativity, often rooted in noble lineage."
        ],
        "negative": [
            "Challenges due to overthinking, demanding nature, and excessive desire for luxury.",
            "Potential for flirtatious behavior or using charm to control/deceive others.",
            "Relationship instability due to unrealistic romantic ideals or poor emotional boundaries.",
            "Financial loss or decline in status due to chasing fame over substance or substance-less comfort."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Attractive and disciplined; execute tasks with perfection; romantic demeanor."
        },
        {
            "house": "3rd House",
            "effect": "Support from siblings and authorities; command over multiple skills; strictness in voice."
        },
        {
            "house": "4th House",
            "effect": "Basic comforts and beautiful home architecture; essence of care, love, and purity."
        },
        {
            "house": "5th House",
            "effect": "Quick decision-making and diplomatic approach; sharp intellect and artistic talents."
        },
        {
            "house": "10th House",
            "effect": "High professional rank with support from father; slow but steady rise to positions of power."
        }
    ],
    "keywords": ["sun", "mercury", "venus", "conjunction", "charm", "intellect", "luxury", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A powerful Sun in conjunction with Mercury and Venus grants high morale and success in "
            "competitive environments. You find support from your father and siblings, leading to "
            "growth in the government sector, particularly in finance and banking. Your lifestyle "
            "is marked by luxury and a regal bearing."
        ),
        "powerfulMercury": (
            "Mercury provides you with the sharp ability to resolve complex problems from a young age. "
            "You excel in professions dealing with banking, finance, or management. Your personality "
            "is defined by strong communication, multi-language mastery, and an enterprising "
            "technical mindset that fuels business success."
        ),
        "powerfulVenus": (
            "Venus grants you an eye for detail and a regal approach to life. Your attractive "
            "personality is matched by your expertise in strategy and authority. You likely "
            "attain a high rank in careers related to fashion, administration, architecture, "
            "or design, maintaining exceptional taste in all things artistic."
        )
    },
    "positiveDetail": (
        "This conjunction blends intellect, charm, and authority, possibly reflecting a royal lineage. "
        "You possess the right decision-making ability to deal with challenges with grace and emotional "
        "sensitivity. Mercury makes you eloquent, while Venus grants you a charismatic, artistic "
        "aura. You carry yourself with a royal fashion sense and a high intellectual approach, "
        "building strong relationships and mastering verbal persuasion. Whether in diplomacy, "
        "politics, or media, your refined approach allows you to see 'behind the scenes' and "
        "solve complex situations with ease."
    ),
    "negativeDetail": (
        "Challenges manifest as a demanding nature and an excessive chase for pleasure. You may "
        "use your charm for control, leading to flirtatious behavior or sudden relationship breaks. "
        "Affliction can cause you to crave constant validation or adopt unrealistic romantic ideals. "
        "Ego clashes with authorities or poor emotional boundaries in marriage can lead to wealth "
        "loss and domestic instability. You may struggle to express genuine feelings, often "
        "choosing fame and comfort over substance, leading to professional fluctuations."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses an attractive, soft-voiced, yet highly disciplined personality. Known for following rules with perfection, you are passionate about literature and fine arts. While diplomatic and clever, you may face multiple attractions or ego clashes in love affairs if pleasure outweighs your disciplined core."
        },
        {
            "house": "3rd House",
            "detail": "Identity is shaped by romantic travels and a command over diverse skills. Support from female friends and seniors is strong, but a strict voice at work can make others feel restricted. Aggressive responses or ego clashes between the Sun and Venus can arise if not carefully managed."
        },
        {
            "house": "4th House",
            "detail": "Ensures basic comforts and success in creative arts or engineering. Your home is likely a masterpiece of architecture, and you possess a 'green thumb' and a deep love for nature. Your personality reflects love, care, and a pure emotional essence."
        },
        {
            "house": "5th House",
            "detail": "Grants quick reasoning and a diplomatic approach to opponents. You possess an eye for detail and artistic talent that ensures easy selection in interviews. Your leadership is boosted by the Sun's confidence and Mercury's sharp intellectual reasoning."
        },
        {
            "house": "10th House",
            "detail": "Power yoga for a good professional rank. You receive consistent support from your father and senior officials. Your analytical approach and eye for detail help you rise steadily to positions of power in administration, the military, or law."
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
    # Alphabetical order: Mercury, Sun, Venus
    col_name = "Mercury_Sun_Venus"
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
    print("[*] Seeding Mercury_Sun_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
