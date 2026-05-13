"""
Seed: Mars_Venus collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mars-Venus Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Mars represents passion and aggression; Venus represents luxury, love, and creativity.",
        "A conjunction of fire and water elements that triggers intense desires and a zest for life.",
        "Natives are often competitive and pleasurable, enjoying their work with bold initiatives.",
        "Grants success in creative fields such as Fashion Design, Hotel Management, or Surgery.",
        "Characterized by a mixture of passion and compassion, leading to professional appreciation."
    ],
    "effects": {
        "powerfulMars": [
            "Aggravates physical dominance and an assertive way of expressing artistic work.",
            "Focused and dedicated toward beauty and appearance, but with a highly competitive edge.",
            "May lead to physical attraction without deep emotional connection if not balanced."
        ],
        "powerfulVenus": [
            "Transforms aggressiveness into artistic expressions of love and a calm, charming persona.",
            "Native avoids violence and maintains purity, attracting others through grace and charm.",
            "Beauty and appearance are prioritized in a way that fosters harmony rather than dominance."
        ]
    },
    "nature": {
        "positive": [
            "Control over actions and the ability to achieve success by widening creative horizons.",
            "Accumulation of wealth, name, fame, and beauty through harmonious relationships.",
            "Graceful personality that understands the importance of love, affection, and partner desires."
        ],
        "negative": [
            "Fire and water mix creates overwhelming sexual desires that may overpower emotional love.",
            "Driven toward eroticism if Mars is significantly stronger, leading to potential lust over love.",
            "Increased risk of sudden mishappenings or accidents if the energy is poorly channeled."
        ]
    },
    "housePlacements": [
        {
            "house": "2nd House",
            "effect": "Impacts speech and wealth; may lead to manipulative or disrespectful communication."
        },
        {
            "house": "7th House",
            "effect": "High sexual desires and potential for disharmony; may exhibit control-freak tendencies."
        },
        {
            "house": "10th House",
            "effect": "Materialistic success and luxury; professional peak with high rewards and appreciation."
        },
        {
            "house": "12th House",
            "effect": "Intimacy at an early age; spouse brings luck, but infidelity can cause separation."
        }
    ],
    "keywords": ["mars", "venus", "conjunction", "passion", "luxury", "creativity", "desire", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Mars is the fighter and soldier, representing boldness and discipline, while Venus "
        "represents happiness, luxury, and relationship security. When these two are conjunct, "
        "they create a passionate native with a competitive yet pleasurable approach to life. "
        "This combination triggers deep desires and boosts the willpower needed to fulfill them. "
        "However, because it blends fire (Mars) and water (Venus), it can lead to intense "
        "sexual urges that may overpower emotional connection if not carefully balanced."
    ),
    "effectsDetail": {
        "powerfulMars": (
            "When Mars dominates, physical dominance and assertive expression prevail. You win "
            "limelight through courage and are always at the front. While focused on beauty, "
            "your approach is passionate and assertive, sometimes lacking the emotional depth "
            "found when Venus is stronger."
        ),
        "powerfulVenus": (
            "When Venus dominates, your aggressiveness turns into artistic love. You attract "
            "others through charm rather than force. You maintain purity and avoid initiating "
            "violence, ensuring that beauty and appearance are expressed gracefully."
        ),
        "positiveConjunction": (
            "A positive conjunction allows you to control your actions and listen to others. "
            "You achieve success, name, and fame through widened creativity. You prioritize "
            "love and affection, and your grace reflects in your personality, winning you "
            "consistent limelight."
        ),
        "negativeConjunction": (
            "A negative conjunction increases heat in the blood (Mars) mixed with desire (Venus), "
            "making lust overpower love. This eroticism can lead to accidents or sudden "
            "mishappenings, and you may find it difficult to satisfy these intense urges "
            "without disrupting personal harmony."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Native achieves high materialistic success and a luxurious life, often being appreciated for their hard work in professional circles."
        },
        {
            "house": "7th House",
            "detail": "Native may struggle with being a control freak in relationships; high sexual desires can create disharmony or separation if not managed."
        },
        {
            "house": "12th House",
            "detail": "Spouse brings happiness and luck, but native must be careful of infidelity which can lead to separation despite the initial intimacy."
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
    col = db["Mars_Venus"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Mars_Venus collection: document {action}.")
    print(f"     Total documents in Mars_Venus: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Mars_Venus collection...")
    asyncio.run(seed())
    print("[+] Done.")
