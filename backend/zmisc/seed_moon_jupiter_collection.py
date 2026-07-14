"""
Seed: Moon_Jupiter collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Jupiter Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Moon represents emotional response and mind; Jupiter represents expansion, wisdom, and growth.",
        "A highly benefic conjunction of mutual friends, often referred to as the Gaj Kesari Yoga (in some contexts).",
        "Blends the sympathy of the Moon with the intellect and wisdom of Jupiter.",
        "Grants a kind, liberal, and concerned personality that acts as a wise mentor to others.",
        "Requires balance, as Jupiter can expand emotional optimism beyond the reach of reality."
    ],
    "effects": {
        "powerfulMoon": [
            "Grants a world-view rooted in optimism and the ability to nurture others even in adversity.",
            "Enables learning through new experiences with a supportive and kind emotional base.",
            "Weak placement can create illusions and fears that block the intellectual potential of Jupiter."
        ],
        "powerfulJupiter": [
            "Focuses heavily on values, beliefs, and the sharing of intellectual wisdom with others.",
            "Increases benevolence and the ability to navigate life with patience and a firm footing in reality.",
            "Weak placement leads to an emotional realm of optimism devoid of practical grounding."
        ]
    },
    "nature": {
        "positive": [
            "Quick intellect combined with a tactful wisdom and a genuinely kind heart.",
            "Natural inclination toward performing good deeds and caring for everyone with positive emotions.",
            "Often attracts natural 'divine blessings' that help the native overcome unexpected odds."
        ],
        "negative": [
            "Distracts the native from positive decision-making during highly adverse situations.",
            "Explosive emotional reactions (Moon) are expanded and inflated by Jupiter's energy.",
            "Being overly optimistic without navigating the reality check, leading to future disappointments."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Public figure or mentor with a royal lifestyle; may show traces of impatience."
        },
        {
            "house": "2nd House",
            "effect": "Good financial stability and organized, eloquent speech that attracts others."
        },
        {
            "house": "3rd House",
            "effect": "Blesses the native with a good name and fame through their own personal efforts."
        },
        {
            "house": "4th House",
            "effect": "Family happiness and unconditional support from the mother regarding material assets."
        },
        {
            "house": "5th House",
            "effect": "Strong reasoning and knowledge lead to wealth, fame, and happiness with children."
        },
        {
            "house": "7th House",
            "effect": "Supportive life partner with good marital relations and gains through the spouse's legacy."
        },
        {
            "house": "8th House",
            "effect": "Unexpected gains through legacy or mysterious learning (like astrology) amidst hurdles."
        },
        {
            "house": "9th House",
            "effect": "Luck for gains without much effort; redefined inclination toward spirituality and God."
        },
        {
            "house": "10th House",
            "effect": "Excellent recognition and status on the professional front with good career gains."
        },
        {
            "house": "11th House",
            "effect": "Income from multiple sources and strong overall stability in money matters."
        }
    ],
    "keywords": ["moon", "jupiter", "conjunction", "gaj kesari", "wisdom", "optimism", "prosperity", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "The Moon represents the emotional response to our surroundings, while Jupiter is the planet "
        "of wisdom, expansion, and spirituality. Their conjunction is a benefic union of mutual "
        "friends. When the sympathy of the Moon meets the intellect of Jupiter, the result is a "
        "kind, liberal, and intelligent individual who has much wisdom to share. However, because "
        "Jupiter expands whatever it touches, a weak Moon can lead to inflated negativity or "
        "unrealistic optimism that eventually faces a harsh reality check."
    ),
    "effectsDetail": {
        "powerfulMoon": (
            "When the Moon is strong, you perceive the world as a good place to live. You nurture life "
            "with new experiences and remain supportive toward the feelings of others. If weak, however, "
            "consistent fear and illusions may block your thought process and intellectual support."
        ),
        "powerfulJupiter": (
            "When Jupiter is strong, you are concerned with values and sharing wisdom. You act as a "
            "benevolent advisor, helping others carry their journey with optimism and patience. If "
            "weak, you may live in an emotional realm of optimism that lacks a firm footing in reality."
        ),
        "positiveConjunction": (
            "A positive conjunction blesses you with liberal ideas and a balanced, quick intellect. "
            "You care for everyone with positive emotions and choose goodness over negativity. This "
            "aspect is often seen as a divine blessing that protects against life's odds."
        ),
        "negativeConjunction": (
            "A negative conjunction leads to explosive emotional reactions that Jupiter inflates. "
            "You may become over-optimistic about prospects without checking the pros and cons, "
            "expecting others to follow your lead without a practical route or reality check."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "5th House",
            "detail": "Native possesses strong reasoning and deep knowledge, leading to a good reputation and earnings from intellectual work."
        },
        {
            "house": "10th House",
            "detail": "A powerful placement for professional status, granting the native widespread recognition and success in their career."
        },
        {
            "house": "2nd House",
            "detail": "The native's speech is eloquent and balanced, serving as a magnet for social and financial success."
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
    col = db["Moon_Jupiter"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Moon_Jupiter collection: document {action}.")
    print(f"     Total documents in Moon_Jupiter: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Moon_Jupiter collection...")
    asyncio.run(seed())
    print("[+] Done.")
