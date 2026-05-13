"""
Seed: Mars_Sun_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mars-Venus Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly dynamic, passionate, and magnetic personality.",
        "Combines Soul (Sun), Action (Mars), and Beauty (Venus) for a strategic and graceful presence.",
        "Natives possess intense desires, high vitality, and a command over artistic and technical skills."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, father, high morale, discipline",
        "Mars": "Action, courage, willpower, physical strength, technical skills",
        "Venus": "Art, beauty, luxury, life partner, fine arts, diplomacy"
    },
    "effects": {
        "powerfulSun": [
            "Grants high morale and professional success with support from elders and father.",
            "Ensures recognition and appreciation from senior authorities.",
            "May lead to a dominating or slightly jealous personality if not balanced."
        ],
        "powerfulMars": [
            "Provides courage to protect self-respect and support for the family and relatives.",
            "Manifests a dynamic, magnetic personality with strong physical abilities.",
            "Ensures gains from property and success in technical sectors or martial arts."
        ],
        "powerfulVenus": [
            "Grants an eye for detail and the ability to make perfect professional decisions.",
            "Ensures success in creative fields like architecture, fashion, gemstones, and fine arts.",
            "Brings potential financial gains through the spouse and a regal touch to life."
        ]
    },
    "nature": {
        "positive": [
            "Dynamic and charismatic presence that radiates confidence and charm.",
            "Strategic approach to adversity, standing alone with grace and authority.",
            "Intense emotional and physical energy channeled into committed relationships.",
            "Success in legal, governmental, engineering, and medical sectors."
        ],
        "negative": [
            "Aggression and heated arguments leading to ego clashes with authorities.",
            "Impulsive behavior and short-tempered nature affecting social comfort.",
            "Potential for extramarital affairs or lack of commitment in love if afflicted.",
            "Legal challenges and fluctuating financial returns due to poor anger control."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Passionate and daring; romantic demeanor; success in entrepreneurship or engineering."
        },
        {
            "house": "3rd House",
            "effect": "Courageous personality successful in police, army, or sports; expressive speech."
        },
        {
            "house": "6th House",
            "effect": "Perfection in daily tasks; ability to overcome legal challenges with intellectual decisions."
        },
        {
            "house": "10th House",
            "effect": "Fame and leadership in career; excel in conflict resolution and technical sectors."
        },
        {
            "house": "11th House",
            "effect": "Multiple sources of income; attractive social image; support from elder siblings."
        }
    ],
    "keywords": ["sun", "mars", "venus", "conjunction", "passion", "magnetism", "technical", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A powerful Sun in this conjunction grants high morale and professional success. You find constant "
            "support and guidance from your father and senior authorities. While it brings recognition "
            "and status, it can also manifest as a dominating or jealous personality trait that "
            "requires conscious self-regulation."
        ),
        "powerfulMars": (
            "A strong Mars gives you the courage to protect your self-respect and family. Your magnetic "
            "personality and high vitality leave a lasting impression on authorities. You likely excel "
            "in the technical sector or martial arts and possess a natural flair for fashion and "
            "property management, unafraid to take bold risks for growth."
        ),
        "powerfulVenus": (
            "Venus grants a regal and creative touch to your decisions. You have an eye for detail that "
            "leads to perfection in architecture, fashion, or the fine arts. Financial gains often come "
            "through your spouse, and you are bestowed with a deep appreciation for gemstones, "
            "dance, and refined aesthetics."
        )
    },
    "positiveDetail": (
        "This combination creates a magnetic warrior with a diplomatic heart. You enjoy your earnings "
        "and radiate a charm that attracts the masses. Unlike pure aggression, you face adversity "
        "with a strategic, graceful approach. Your intense desires are balanced by high moral values, "
        "making you deeply committed to your loved ones. You excel in planning and engineering, "
        "possessing the confidence to lead any sphere of life with grace and authority. Gains are "
        "indicated from both paternal and maternal sides, as well as in-laws."
    ),
    "negativeDetail": (
        "Affliction can turn your passion into impulsive aggression and heated arguments. Ego clashes "
        "with siblings or bosses can damage your professional standing. You may suffer from a lack "
        "of empathy, leading to social alienation or a demanding nature in family life. Fluctuating "
        "financial decisions and health issues like muscle pain or hemoglobin imbalance can cause "
        "stress. A close conjunction might also lead to extramarital affairs or a recurring "
        "lack of commitment, making it difficult to maintain sincere, lasting bonds."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native is a passionate, goal-oriented individual with a romantic demeanor. Paternal and maternal traits are strongly reflected in their personality. While naturally inclined to lead, they must guard against arrogance and act-before-thinking tendencies to avoid strained relationships."
        },
        {
            "house": "3rd House",
            "detail": "Identity is shaped by courage and assertive speech. The native excels in sports or military fields but remains deeply attached to their home. While highly expressive and eloquent, there's a risk of being manipulative or flirtatious if the planets are too closely conjoined."
        },
        {
            "house": "6th House",
            "detail": "Blesses the native with perfection in execution and the ability to resolve legal or complex daily tasks. A philosophical yet practical approach helps in making highly intellectual decisions that lead to significant gains."
        },
        {
            "house": "10th House",
            "detail": "Ensures success through leadership, creativity, and ambition. The native is an expert at conflict resolution and receives consistent support from the government and senior officials. Fame and professional reputation are high, provided aggression toward seniors is managed."
        },
        {
            "house": "11th House",
            "detail": "A powerhouse placement for wealth and desire fulfillment. The native attracts opportunities through extensive social networks and remains image-conscious and stylish. No opponent dares fight you, though control over deep-seated desires is necessary for long-term peace."
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
    # Alphabetical order: Mars, Sun, Venus
    col_name = "Mars_Sun_Venus"
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
    print("[*] Seeding Mars_Sun_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
