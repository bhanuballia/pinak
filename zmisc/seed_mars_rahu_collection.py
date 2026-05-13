"""
Seed: Mars_Rahu collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mars-Rahu Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Mars represents courage and energy; Rahu represents obsession and materialistic craving.",
        "A combination of confirmed enemies often leading to confusion, anger, and anxiety.",
        "Physical energy of Mars is amplified by Rahu, increasing impulsiveness up to three folds.",
        "Indicates a struggle for dominance in both personal and professional situations.",
        "Mars as significator of land and Rahu of foreign land often forces living away from family."
    ],
    "effects": {
        "powerfulMars": [
            "Blesses the individual with high confidence, vitality, and the ability to take right actions.",
            "Anger is kept within limits, allowing for positive and progressive execution of plans.",
            "Helps handle the volatile 'tantrums' of Rahu through disciplined energy."
        ],
        "powerfulRahu": [
            "Leads to an impulsive nature and aggressive temperament with a tendency to pick contradictions.",
            "Throws a veil of 'illusion' over perceptions, causing relationship problems and professional dissatisfaction.",
            "Triggers hypersensitivity and a zero-level of satisfaction despite materialistic gains."
        ]
    },
    "nature": {
        "positive": [
            "Exceptional physical strength and inertia for soldiers, policemen, and athletes.",
            "Gives a fierce urge to fight against adverse situations and come out victorious.",
            "When placed in Capricorn, it allows for high-level accomplishment and disciplined power."
        ],
        "negative": [
            "Restlessness, irritability, and stubbornness with a lack of flexibility.",
            "Prone to dishonest habits and potentially extra-marital affairs in personal life.",
            "Materialistic gains often attempted through deception, leading to luck setbacks."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Boasting character regarding achievements; offensive and dominating in relations."
        },
        {
            "house": "2nd House",
            "effect": "Mixed results: potential financial losses from Mars and sudden gains from Rahu."
        },
        {
            "house": "3rd House",
            "effect": "Daring courage and initiative for making bold attempts to gain success."
        },
        {
            "house": "4th House",
            "effect": "Disturbed domestic peace and poor relationships with the mother."
        },
        {
            "house": "5th House",
            "effect": "Enhanced confidence but may attain success by dishonest means; child-related issues."
        },
        {
            "house": "6th House",
            "effect": "Daring against rivals but potential health neglect due to over-activity."
        },
        {
            "house": "7th House",
            "effect": "Significant problems in love life, marital relationships, and partnerships."
        },
        {
            "house": "8th House",
            "effect": "Prone to dishonesty in marriage; however, beneficial for deep research or occult studies."
        },
        {
            "house": "9th House",
            "effect": "Consistent effort required to keep professional reputation clean; others may be suspicious."
        },
        {
            "house": "10th House",
            "effect": "Good career position and reputation, but a constant fear of losses in finance/relations."
        },
        {
            "house": "11th House",
            "effect": "Makes the person rich and wealthy, often at the cost of personal morals."
        },
        {
            "house": "12th House",
            "effect": "Setbacks in almost all aspects of personal and professional life."
        }
    ],
    "keywords": ["mars", "rahu", "conjunction", "angarak yoga", "physical energy", "obsession", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Mars is defined as courage and energy, while Rahu represents a craving for materialistic "
        "comfort and authoritative positions. They are confirmed enemies, and their conjunction "
        "can create intense restlessness and anxiety. Because Rahu amplifies Mars's energy, "
        "it can lead to extreme physical strength suitable for warriors or athletes, but also "
        "to a 3x increase in impulsiveness. This combination often leads to living in foreign "
        "lands and a stubborn, rigid personality that prefers leading with its own opinion."
    ),
    "effectsDetail": {
        "powerfulMars": (
            "When Mars dominates, you have the vitality to take the right action. You can channel "
            "your anger productively, ensuring that execution is positive rather than irrational. "
            "It gives you the 'soldier' mindset to handle Rahu's chaotic influence."
        ),
        "powerfulRahu": (
            "When Rahu dominates, you may have an aggressive temperament and plan contradictions "
            "with others. It creates illusions about professional gains and relationship status. "
            "You may feel a sense of zero-satisfaction while constantly pursuing large materialistic shares."
        ),
        "positiveConjunction": (
            "A positive conjunction—especially in Capricorn—allows for the handling of Rahu's tantrums. "
            "It is a great combination for those in military, civil services, or professional sports, "
            "granting the excessive urge to win against all odds."
        ),
        "negativeConjunction": (
            "A negative conjunction affects the luck quotient. Rahu attempts to gain materialistic "
            "happiness through deception. This leads to confusion, heightened aggression, and "
            "depleting relationship quality with loved ones."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Provides a high status career and good social reputation, though financial insecurity may persist."
        },
        {
            "house": "5th House",
            "detail": "Enhances confidence but might tempt the native toward achieving success through dishonest means."
        },
        {
            "house": "8th House",
            "detail": "While challenging for marriage, it is highly beneficial for deep research work and hidden knowledge."
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
    col = db["Mars_Rahu"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Mars_Rahu collection: document {action}.")
    print(f"     Total documents in Mars_Rahu: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Mars_Rahu collection...")
    asyncio.run(seed())
    print("[+] Done.")
