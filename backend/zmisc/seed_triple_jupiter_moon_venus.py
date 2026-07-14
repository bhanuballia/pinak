"""
Seed: Jupiter_Moon_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Jupiter-Venus Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents an exceptionally auspicious, wise, and harmonious personality.",
        "Combines Mind (Moon), Wisdom (Jupiter), and Grace (Venus) for high emotional intelligence and artistic brilliance.",
        "Natives possess a generous heart, a magnetic charm, and are often destined for high status through their nurturing and healing abilities."
    ],
    "planetRoles": {
        "Moon": "Mind, emotions, maternal support, intuition, nourishment, public image",
        "Jupiter": "Wisdom, integrity, judgment, financial expansion, mentors, higher education",
        "Venus": "Art, magnetic charm, graceful appearance, social grace, luxury, celebration"
    },
    "effects": {
        "powerfulMoon": [
            "Grants mental clarity and wisdom with a sharp eye for detail.",
            "Ensures strong relationships in society and significant support from the mother.",
            "Blesses the native with career success in their hometown and financial growth."
        ],
        "powerfulJupiter": [
            "Grants excellent decision-making abilities concerning wealth and luxury items.",
            "Ensures a strong public image with many followers and success in education or finance.",
            "Provides a thoughtful, respectful speech and a sincere desire to provide security to loved ones."
        ],
        "powerfulVenus": [
            "Manifests as a magnetic personality with a graceful appearance and pleasant voice.",
            "Ensures gifts in creative fields like music, dance, painting, and fashion.",
            "Provides strong support from females and an inherent ability to build emotional bonds."
        ]
    },
    "nature": {
        "positive": [
            "Compassionate approach toward life with artistic grace and a generous, romantic heart.",
            "Spiritual and loving personality with a kind, soft-spoken, and well-mannered demeanor.",
            "Fortunate growth in higher studies and substantial financial gains from the maternal side.",
            "Intuitive wisdom and healing abilities that lead to fame and a joyful expression."
        ],
        "negative": [
            "Overindulgence, laziness, and a lethargic approach to professional goals.",
            "Unrealistic expectations and excessive daydreaming leading to financial carelessness.",
            "Emotional dependency on others and confusion in relationships due to over-trusting.",
            "Moodiness or vanity causing sudden disagreements over money management or social validation."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Very auspicious; charming and magnetic personality; success in arts, food, or politics."
        },
        {
            "house": "2nd House",
            "effect": "Abundance of wealth and eloquent speech; articulation leads to high earnings through arts."
        },
        {
            "house": "10th House",
            "effect": "Career growth under parents/mentors; pleasing professional image in healing or creative sectors."
        }
    ],
    "keywords": ["moon", "jupiter", "venus", "conjunction", "grace", "wisdom", "harmony", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A strong Moon grants you mental clarity and wisdom. Your mother plays a significant role in your "
            "career and financial decisions, helping you attain success in your hometown. Your eye for "
            "detail ensures you maintain excellent relationships within society."
        ),
        "powerfulJupiter": (
            "Jupiter ensures a strong public image and followers. Your integrity and discipline help you "
            "attain a high rank in finance or education. You possess a sincere desire to provide security "
            "to loved ones, and your thoughtful speech earns you lasting respect."
        ),
        "powerfulVenus": (
            "Venus manifests as a magnetic personality with a graceful appearance. You possess a pleasant "
            "voice and are exceptionally gifted in the arts, including music and fashion. Support "
            "from female figures ensures your emotional and creative life is vibrant and stable."
        )
    },
    "positiveDetail": (
        "This conjunction of three 'soft' planets grants a harmonious personality and artistic grace. You "
        "possess high emotional intelligence, which helps you build strong bonds and a generous heart. "
        "Your positive, hopeful outlook helps you deal with life's challenges gracefully. As a "
        "friendly and sociable person, you generate multiple sources of income and enjoy "
        "fortune in higher studies. The blend of Moon and Jupiter provides intuitive wisdom and "
        "nurturing abilities that make you famous. You enjoy a romantic and joyful life, "
        "supported by your spouse, children, and maternal relatives, ensuring a life of "
        "abundance and spiritual depth."
    ),
    "negativeDetail": (
        "Negative influences cause an uncontrolled desire for wealth and multiple income sources, leading "
        "to relationship friction over money. Overindulgence and laziness can manifest as a "
        "lethargic approach to work. Excessive daydreaming and unrealistic expectations may "
        "lead to financial carelessness. Affliction can cause moodiness, self-pampering, and "
        "sentimental weaknesses, where your over-trusting nature is misused by others. You "
        "might struggle with vanity or a constant need for validation, leading to inner "
        "conflicts when your high ideals clash with your need for affection."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses an auspicious, charming, and magnetic personality. You attract people effortlessly with your warmth and eloquent speech. Success is indicated in arts, food businesses, and politics, where your emotional depth and sense of maturity shine."
        },
        {
            "house": "2nd House",
            "detail": "Identity is centered on prosperity and eloquent, articulate speech. You generate stable earnings through artistic or intellectual pursuits, supported heavily by the guidance of your mother and maternal family. Your luck and presentation skills earn you many followers."
        },
        {
            "house": "10th House",
            "detail": "Powerhouse for career growth under guidance from parents and mentors. You possess a charming professional appearance and are known for your ethics and polite, soft-spoken nature. Your image is highly respected in fields like healing, beauty, or spiritual services."
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
    # Alphabetical order: Jupiter, Moon, Venus
    col_name = "Jupiter_Moon_Venus"
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
    print("[*] Seeding Jupiter_Moon_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
