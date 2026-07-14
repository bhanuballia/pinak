"""
Seed: Venus_Ketu collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Venus-Ketu Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Venus represents love and luxury; Ketu represents detachment and karmic lessons.",
        "A combination that often leads to dissatisfaction with even the highest materialistic luxuries.",
        "Ketu's directionless influence can create confusion, delusions, and ego-hassles in love.",
        "Natives may be highly passionate in youth but shift toward deep spiritual wisdom in mature age.",
        "Venus becomes 'sightless' in front of Ketu, often canceling clarity in personal relationships."
    ],
    "effects": {
        "powerfulVenus": [
            "Native enjoys worldly possessions and standard contentment levels in their younger years.",
            "Materialistic benefits continue in later life, but with a natural sense of detachment.",
            "Allows the native to maintain a positive, though perhaps less intense, attachment to luxury."
        ],
        "powerfulKetu": [
            "Activates a strong inclination toward detachment from materialistic life from a very young age.",
            "Partner may be supportive, but a truly harmonious emotional equation often fails to develop.",
            "Native becomes directionless in love and eventually accepts events as they are positioned spiritually."
        ]
    },
    "nature": {
        "positive": [
            "Ketu acts as a karmic teacher, helping the native understand the deeper meaning and purpose of life.",
            "Drives the native to be selfless and work toward noble causes for the betterment of humanity.",
            "Balances the subconscious forces to choose between widespread right and wrong options."
        ],
        "negative": [
            "Deprives the individual of Venus's blessings, leading to a directionless and dissatisfied life.",
            "Native may become overconfident in matters requiring vigilance, like finance or relationships.",
            "Frequent misunderstandings arise from the illusion that only one partner is making sacrifices."
        ]
    },
    "housePlacements": [
        {
            "house": "2nd House",
            "effect": "Repetitive losses in partnership or marriage due to a lack of interest in making efforts."
        },
        {
            "house": "3rd House",
            "effect": "Heightened inability to communicate feelings, which hampers personal and professional initiative."
        },
        {
            "house": "7th House",
            "effect": "Significant loss of interest or emotional connectivity between partners; risks of separation."
        },
        {
            "house": "10th House",
            "effect": "Passive strength and low ambition; native accepts professional events with uniform resignation."
        }
    ],
    "keywords": ["venus", "ketu", "conjunction", "detachment", "spirituality", "dissatisfaction", "karma", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Venus is the planet of luxury, love, and sexual desires, while Ketu (dragon’s tail) is "
        "the bodyless south node that represents illusions and spiritual disconnection. When "
        "they conjoin, the native often experiences a profound dissatisfaction with "
        "materialistic luxury. Ketu leads the heart in varied directions, creating conflicts "
        "and ego-hassles in relationships until the native realizes that worldly understanding "
        "has its limits. Clarity is often canceled, and the native may eventually choose a "
        "path of salvation over sensory gratification."
    ),
    "effectsDetail": {
        "powerfulVenus": (
            "When Venus dominates, you enjoy the standard pleasures of luxury and relationships. "
            "In your youth, you are very sensual and find contentment in possessions. As you "
            "mature, these benefits remain, but you naturally develop a more detached and "
            "spiritually-inclined perspective, enjoying things without being 'chained' to them."
        ),
        "powerfulKetu": (
            "When Ketu dominates, you feel detached from worldly responsibilities from a young "
            "age. You face disappointments in the materialistic arena and may find yourself "
            "directionless in love. Even with a supportive partner, a deep emotional bond is hard "
            "to sustain, eventually leading you toward the path of pure spirituality."
        ),
        "positiveConjunction": (
            "A positive conjunction drives you to be selfless. You understand the karmic "
            "purpose of your life and maintain a balance between right and wrong in the "
            "materialistic world. You grow through noble causes and approach relationships "
            "with a selfless, humanitarian focus rather than just personal gratification."
        ),
        "negativeConjunction": (
            "A negative conjunction makes you directionless and delusional to good advice. You "
            "may suffer from chronic dissatisfaction, possessing luxury but never feeling its "
            "warmth. In relationships, you become sightless to your partner's efforts, "
            "leading to ego-clashes and an eventual loss of connectivity."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "7th House",
            "detail": "Native experiences repetitive losses in interest regarding the success of their relationship; the connection between partners often fades into a spiritual or passive indifference."
        },
        {
            "house": "3rd House",
            "detail": "Heightens the inability to express deep feelings, which creates a barrier to personal initiative and success in communicative professional endeavors."
        },
        {
            "house": "10th House",
            "detail": "There is a noticeable lack of ambition and hard work to attain status. The native works with a passive strength, accepting professional changes without much resistance."
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
    col = db["Venus_Ketu"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Venus_Ketu collection: document {action}.")
    print(f"     Total documents in Venus_Ketu: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Venus_Ketu collection...")
    asyncio.run(seed())
    print("[+] Done.")
