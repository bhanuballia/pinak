"""
Seed: Venus_Rahu collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Venus-Rahu Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Venus represents love and materialistic comfort; Rahu represents obsession and craving.",
        "A combination that can make an individual obsessed with money, relationships, and luxury.",
        "Indicates a highly active sexual nature with a constant craving for undivided attention.",
        "Often leads to a 'never-ending' search for satisfaction in both emotional and physical realms.",
        "Rahu can spoil the auspicious aura of Venus, leading to restlessness and marital instability."
    ],
    "effects": {
        "powerfulVenus": [
            "Grants an attractive personality and a loud, expressive way of showing emotions to a partner.",
            "Native enjoys materialistic luxury and intoxicating pleasures that are significantly enhanced.",
            "Sexual gratification is present but accompanied by a restless, inconsistent level of contentment."
        ],
        "powerfulRahu": [
            "Activates extreme eagerness and excitement for sensual pleasures and materialistic desires.",
            "May lead to unnecessary contradictions that negatively impact the native's social image.",
            "Can cause anger and a persisting fear of loss in relationships, leading to possessive behavior."
        ]
    },
    "nature": {
        "positive": [
            "Fulfills heightened desires and brings a vibrant, albeit intense, happiness in relationships.",
            "Grants success in creative fields like media, entertainment, and the arts through unique charm.",
            "Native possesses the ability to overcome cultural or distance-related obstacles for love."
        ],
        "negative": [
            "Confusion and restlessness dominate the attitude toward routine life and sensual pleasures.",
            "Likely to seek achievements beyond ethical limitations to enjoy the blessings of Venus.",
            "Low contentment value in life, regardless of how much luxury or pleasure is attained."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Attractive personality; highly ambitious and restless for success with a love for lust."
        },
        {
            "house": "2nd House",
            "effect": "Gains through daring attempts, sometimes avoiding honest codes; potential for rude speech."
        },
        {
            "house": "4th House",
            "effect": "Financial stability and asset growth, though the mother's health may be negatively affected."
        },
        {
            "house": "7th House",
            "effect": "Limitless emotion for the partner; native may overcome obstacles for success in love."
        },
        {
            "house": "10th House",
            "effect": "Significant success in entertainment, media, acting, and dance-related professions."
        },
        {
            "house": "11th House",
            "effect": "Excellent financial gains and social fame, sometimes through unfair or greedy means."
        }
    ],
    "keywords": ["venus", "rahu", "conjunction", "obsession", "craving", "sensuality", "luxury", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Venus is the planet of happiness, love, and materialistic comforts, while Rahu (dragon’s head) "
        "is the bodyless north node that represents restless evolution and zero satisfaction. Their "
        "conjunction is one of the most intense for desire, often making the individual obsessed "
        "with perfect relationships and undivided attention. While it can heighten the feelings "
        "of love to an extraordinary degree, it also brings a persisting fear of loss and a "
        "tendency toward secret or extra-marital affairs as the native seeks total gratification."
    ),
    "effectsDetail": {
        "powerfulVenus": (
            "When Venus dominates, your personality is naturally attractive. You enjoy the 'intoxication' "
            "of life's pleasures with loud expressions of emotion. While you find physical "
            "gratification, you remain restless due to the underlying impact of Rahu, leading "
            "to inconsistent levels of satisfaction despite having all the luxuries of life."
        ),
        "powerfulRahu": (
            "When Rahu dominates, your central point of life becomes the fulfillment of sensual and "
            "materialistic desires. This can result in heightened anger and restlessness when "
            "desires aren't met instantly. You may fall prey to addictions or unnecessary "
            "contradictions that tarnish your social standing."
        ),
        "positiveConjunction": (
            "A positive conjunction connects the planet of gratification with the planet of "
            "intoxication, heightening desires and ensuring they are often met. You possess "
            "the charm to succeed in media or entertainment and the dedication to overcome "
            "immense obstacles for the success of your romantic partnerships."
        ),
        "negativeConjunction": (
            "A negative conjunction leads to a confused and non-progressive attitude. You may "
            "constantly look for means of achievement beyond ethical boundaries, driven by "
            "dissatisfaction and low contentment. This often manifests as a possessive or "
            "suspicious nature that creates a war-zone in personal relationships."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Native experiences significant professional success in the creative arts, media, or acting, using their unique charm to bring fame and recognition."
        },
        {
            "house": "1st House",
            "detail": "Native is highly ambitious and restless for success, often possessing an aura that demands undivided attention and experiences high emotional intensity."
        },
        {
            "house": "7th House",
            "detail": "While it grants immense emotion for the partner, it also brings a risk of instability or extra-marital affairs as the native searches for 'limitless' love."
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
    col = db["Venus_Rahu"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Venus_Rahu collection: document {action}.")
    print(f"     Total documents in Venus_Rahu: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Venus_Rahu collection...")
    asyncio.run(seed())
    print("[+] Done.")
