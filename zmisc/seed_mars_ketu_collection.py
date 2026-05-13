"""
Seed: Mars_Ketu collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mars-Ketu Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Mars represents willpower and action; Ketu represents detachment and spiritual isolation.",
        "A conjunction of extreme fiery energies that can make the native both determined and grounded.",
        "Often referred to as Pishacha Yoga, which can bring out serious behavior and severe conflicts.",
        "Natives possess the capacity for hard work with less emotional attachment to materialism.",
        "If emotionally hurt, they may react with illogical vigor or indulge in nonsensical behavior."
    ],
    "effects": {
        "powerfulMars": [
            "Indicates a native who stands firmly for their beliefs with a carefree attitude.",
            "Grants direction to actions and the inertia needed to win over complex situations.",
            "Display of Martian traits like passion and aggression is tempered by a more controlled manner."
        ],
        "powerfulKetu": [
            "Activates a strong sense of detachment from materialistic goals and daily routine competition.",
            "Increases inclination toward spirituality and deep research work throughout life.",
            "Can lead to low confidence in social settings but high confidence in spiritual pursuits."
        ]
    },
    "nature": {
        "positive": [
            "Blending of extreme energies that makes the individual aware of their own inner caliber.",
            "Feet remain firmly fixed to the ground due to moderate attachment to people and situations.",
            "Spiritually strong and action-oriented, particularly successful in research-based fields."
        ],
        "negative": [
            "Headless Ketu may deprive the native of their worldly ambitions, leading to a directionless life.",
            "Involvement in contradictions with others can make the individual impulsive and indecisive.",
            "Uncontrolled anger and irritation can cause frequent fights and unresolved social conflicts."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Competitive nature and aggression; success if channeled through sports or fitness."
        },
        {
            "house": "2nd House",
            "effect": "Not progressive; tends to affect wealth quotient and family harmony negatively."
        },
        {
            "house": "3rd House",
            "effect": "Efforts may not coordinate well with situations; potential for sibling separation."
        },
        {
            "house": "4th House",
            "effect": "Challenges related to domestic peace, prosperity, and the mother's health."
        },
        {
            "house": "5th House",
            "effect": "Problems with educational pursuits and children; constant efforts needed for life balance."
        },
        {
            "house": "6th House",
            "effect": "Good success on the professional front and a streak for winning over rivals."
        },
        {
            "house": "7th House",
            "effect": "Increased sexual orientation; setbacks in marital relations or extra-marital affairs."
        },
        {
            "house": "8th House",
            "effect": "Hurdles in life and health problems; deep urge to gain knowledge of the unknown."
        },
        {
            "house": "9th House",
            "effect": "Action-oriented toward fulfilling desires but becomes detached from religion."
        },
        {
            "house": "10th House",
            "effect": "Progress on the career front and the ability to control pressures of heavy workload."
        },
        {
            "house": "11th House",
            "effect": "Gains in income, relationships, and general professional progress."
        },
        {
            "house": "12th House",
            "effect": "Potential for work disputes and energy loss; possibility of settlement abroad."
        }
    ],
    "keywords": ["mars", "ketu", "conjunction", "pishacha yoga", "detachment", "determination", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Mars represents willpower and the skill to act, while Ketu (dragon’s tail) represent "
        "separation and detachment from the materialistic world. Their conjunction, often "
        "known as Pishacha Yoga, blends two extreme energies. While it can grant strong "
        "determination and a grounded reality check, it also brings out anger and irritation. "
        "If a person with this conjunction is hurt emotionally, they react with nonsensical "
        "behavior. It essentially desires self-realization and spiritual inclination over "
        "worldly accomplishments."
    ),
    "effectsDetail": {
        "powerfulMars": (
            "When Mars dominates, you stand for your beliefs with controlled passion. Your energy "
            "gives clear direction to your actions, allowing you to win over complex situations "
            "with an analytical thought process. You remain action-oriented but with a carefree "
            "manner."
        ),
        "powerfulKetu": (
            "When Ketu dominates, you detach from materialistic attributes. While this might "
            "result in low social confidence, your spiritual strength and research abilities "
            "increase. You may find everyday routine competition difficult but excel in isolated "
            "intellectual work."
        ),
        "positiveConjunction": (
            "A positive conjunction helps you realize your capacity for materialistic gains "
            "without becoming obsessed. You maintain a moderate attachment to others, which "
            "keeps you spiritually strong and action-oriented toward research and self-discovery."
        ),
        "negativeConjunction": (
            "A negative conjunction makes you directionless. You may feel unable to look beyond "
            "Ketu's headless influence, leading to impulsiveness and indecision. This often "
            "results in frequent contradictions with others and a loss of worldly ambition."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Native makes significant progress on the career front and possesses the unique ability to handle high-pressure workloads without burning out."
        },
        {
            "house": "1st House",
            "detail": "Indicates a high inclination toward physical activities like sports; aggression here acts as a competitive fuel for professional success."
        },
        {
            "house": "7th House",
            "detail": "Heightened sexual orientation and desire can lead to marital setbacks or a search for intimacy outside the primary relationship."
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
    col = db["Mars_Ketu"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Mars_Ketu collection: document {action}.")
    print(f"     Total documents in Mars_Ketu: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Mars_Ketu collection...")
    asyncio.run(seed())
    print("[+] Done.")
