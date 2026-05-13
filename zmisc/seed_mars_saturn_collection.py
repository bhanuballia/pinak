"""
Seed: Mars_Saturn collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mars-Saturn Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Mars represents energy and vitality; Saturn represents discipline and boundaries.",
        "A blend of 'hot and cold' attributes where energy meets control.",
        "When unbalanced, it creates a phase of indecision where situations reach a 'dead-end'.",
        "When constructive, it restrains uncontrolled impulses, leading to massive hard work and durable strength.",
        "Produces a trend of anger that must be kept in check for progressive development."
    ],
    "effects": {
        "powerfulMars": [
            "Indicates a native who stands firmly for their beliefs with strong willpower.",
            "Can lead to a rebellious and independent nature that may resist legal or social norms.",
            "In constructive settings, it empowers leading a team to success through innovative rebellion."
        ],
        "powerfulSaturn": [
            "Illustrates perfectly controlled impulsive actions and awareness of personal limits.",
            "Grants victory and progress based on sensible, war-like discipline in action.",
            "A challenging Saturn here can cause aimless wandering and wastage of energy."
        ]
    },
    "nature": {
        "positive": [
            "Ability to use both vigor (Mars) and control (Saturn) constructively in any situation.",
            "Originality in creativity and action that results in durable, long-term progress.",
            "Tempering impulsive energy with restrained flow to build high competence for hard labor."
        ],
        "negative": [
            "Strong impulsive and rebellious nature that results in hasty, uncontrolled actions.",
            "Anger and a dominating attitude that lead to uncompromised conflicts and frictions.",
            "Rebellious attitude can lead to legal hassles and dead-locks in intellectual conversations."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Dominating and inflexible attitude in relationships; impulsive streak requires low profile."
        },
        {
            "house": "2nd House",
            "effect": "Monetary gains through hard work, but prone to family contradictions and money stress."
        },
        {
            "house": "3rd House",
            "effect": "Good initiative and courage for wealth; however, stubbornness causes sibling conflicts."
        },
        {
            "house": "4th House",
            "effect": "Stability in domestic happiness and religious involvement; frequent conflicts with mother."
        },
        {
            "house": "5th House",
            "effect": "Malefic effects on matters related to children, speculation, and love bonding."
        },
        {
            "house": "6th House",
            "effect": "Courage to win over rivals and good vitality; caution against added anger and rash driving."
        },
        {
            "house": "7th House",
            "effect": "Less progressive in marriage, but utilized constructively, it gives success in business."
        },
        {
            "house": "8th House",
            "effect": "Wealth, name, fame, and long life; however, health issues and debts are likely."
        },
        {
            "house": "9th House",
            "effect": "Rise in religious inclination; generous in money but less cordial with father/siblings."
        },
        {
            "house": "10th House",
            "effect": "Success in business with government policies; strong competition from rivals."
        },
        {
            "house": "11th House",
            "effect": "Gains from many sources through hard work; potential for bad reputation from false allegations."
        },
        {
            "house": "12th House",
            "effect": "Setbacks in endeavors and energy loss, but prosperity in educational pursuits."
        }
    ],
    "keywords": ["mars", "saturn", "conjunction", "energy and control", "discipline", "hard work", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Mars represents willpower and vitality, while Saturn represents restrictions and "
        "discipline. Their conjunction is a meeting of hot and cold energy. When they fight "
        "for control, it results in indecision and dead-ends. However, when the impulsive "
        "energy of Mars is tempered by Saturn's restraint, it grants the native an incredible "
        "capacity for hard work, durable strength, and original creativity. It is a powerful "
        "marker for success through persistence, provided anger is kept in check."
    ),
    "effectsDetail": {
        "powerfulMars": (
            "When Mars dominates, you stand firmly for your beliefs. This power gives direction "
            "to your actions and willpower. If challenging, it can lead to legal trouble and a "
            "born-rebel attitude, but if constructive, it empowers you to lead others toward "
            "innovative heights."
        ),
        "powerfulSaturn": (
            "When Saturn dominates, you are aware of the strength of controlling your impulses. "
            "You move forward with sensible actions, akin to fighting a war with discipline. "
            "This leads to progress and victory, though a weak Saturn can result in setbacks "
            "due to aimless wandering."
        ),
        "positiveConjunction": (
            "A positive conjunction allows you to utilize both vigor and control. You temper "
            "the impulsive fire of Mars with a restrained flow, constructing a competence for "
            "hard work that is both consistent and durable, leading to original success."
        ),
        "negativeConjunction": (
            "A negative conjunction leads to uncompromised, rebellious reactions. Uncontrolled "
            "anger and a dominating attitude persist, preventing progress in intellectual "
            "conversations and potentially leading to significant legal or social conflicts."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Native achieves success through business and government policies, though they must maintain cooperation with others to handle strong rival competition."
        },
        {
            "house": "2nd House",
            "detail": "While hard work brings more monetary gains, the combination often results in increased stress over money matters and friction in family relations."
        },
        {
            "house": "6th House",
            "detail": "Grants the vitality to win over rivals and maintain good health, but native must be extremely cautious against rash driving and sudden anger."
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
    col = db["Mars_Saturn"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Mars_Saturn collection: document {action}.")
    print(f"     Total documents in Mars_Saturn: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Mars_Saturn collection...")
    asyncio.run(seed())
    print("[+] Done.")
