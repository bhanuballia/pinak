"""
Seed: Mars_Mercury collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mars-Mercury Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Mars represents courage and energy; Mercury represents intelligence and communication.",
        "Grants the inertia for execution of innovative ideas through constructive action.",
        "Ability to convince others about schemes and ideas through strong logical points.",
        "Mars empowers the intelligence, but placement in water signs can lead to impulsive, defensive behavior.",
        "Natives often need constant mental stimulation and may enjoy mind games in their leisure hours."
    ],
    "effects": {
        "powerfulMars": [
            "Grants a direction to actions and the willpower to win over complex situations through analytical thought.",
            "Characterized by a competitive combating mechanism in communication and action.",
            "Native becomes an excellent performer in technical fields like engineering or professional sports."
        ],
        "powerfulMercury": [
            "Illustration of intelligence and impulsive actions, delivering ideas with proficiency and clear messages.",
            "Blesses the person with an insistent speech and a sharp streak for winning debates.",
            "Excellent for careers as lawyers, judges, political writers, or revolutionary poets."
        ]
    },
    "nature": {
        "positive": [
            "Strong interest and success in technical fields, software engineering, and electronics.",
            "Aggressiveness in speech is channeled into logical, organized, and winning debates.",
            "Organized and intelligent actions lead to prosperity in both personal and professional relationships."
        ],
        "negative": [
            "Creates shadows of aggression and confusion that block the balance of intelligence and action.",
            "Placement in water signs (Cancer/Pisces) leads to a defensive self-protective mechanism.",
            "Can invite significant challenges due to impulsive statements or defending wrong beliefs."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Aggression in nature and speech; potential health or financial loss; avoid speculation."
        },
        {
            "house": "2nd House",
            "effect": "Good oratorical ability but marked by aggressive speech and family friction."
        },
        {
            "house": "3rd House",
            "effect": "Daring and strong nature; occasional conflicts in the household and workplace."
        },
        {
            "house": "4th House",
            "effect": "Aggressive nature and health/mother issues, but brings potential political success."
        },
        {
            "house": "5th House",
            "effect": "Enhanced memory for quick learning and good oratorical skills; relationship struggles."
        },
        {
            "house": "6th House",
            "effect": "Courage to win over rivals and good financial health; vigilance over skin is needed."
        },
        {
            "house": "7th House",
            "effect": "Sharp and rude speech can cause significant problems in marital or love relationships."
        },
        {
            "house": "8th House",
            "effect": "Potential health problems and rifts, but good sexual orientation keeps marriage stable."
        },
        {
            "house": "9th House",
            "effect": "Good luck, fortune, and religious inclination, though conflicts with father are likely."
        },
        {
            "house": "10th House",
            "effect": "Professional success and ancestral gains, though mental stress arises from work overload."
        },
        {
            "house": "11th House",
            "effect": "Strong determined mental caliber and professional success, but may have a deceptive nature."
        },
        {
            "house": "12th House",
            "effect": "Intelligent and materialistic outlook on life; instability in personal relationships."
        }
    ],
    "keywords": ["mars", "mercury", "conjunction", "technical intelligence", "logic", "debates", "engineering", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Mars represents the energy and willpower required to act, while Mercury represents the "
        "intelligence and wit needed to make sharp decisions. Their conjunction creates a powerful "
        "inertia for executing innovative ideas. Mars empowers the intelligence, providing the "
        "logical force needed to win debates and convince others. However, if either planet is "
        "debilitated or placed in water signs, the native may become defensive and act "
        "impulsively without thinking, emphasizing beliefs in a defensive tone."
    ),
    "effectsDetail": {
        "powerfulMars": (
            "When Mars dominates, you stand firmly for your beliefs. Your energy gives clear direction "
            "to your actions, allowing you to win over complex situations through an analytical "
            "thought process expressed via logical communication."
        ),
        "powerfulMercury": (
            "When Mercury dominates, you are proficient in speech and intelligent actions. You "
            "deliver ideas with a clear message and possess an insistent streak that makes you "
            "a formidable opponent in debates—ideal for lawyers or political writers."
        ),
        "positiveConjunction": (
            "A positive conjunction favors technical fields like Software or Electronics Engineering. "
            "It grants the native the fighting ability and stamina to win conversations through "
            "intelligent and logical speech, fostering prosperity on all fronts."
        ),
        "negativeConjunction": (
            "A negative conjunction (especially in water signs) creates a dilemma. Self-protective "
            "mechanisms lead to a defensive stance where actions are taken as problems rather "
            "than solutions, blocking the healthy balance of intelligence and energy."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Native achieves name, fame, and professional success, but must manage mental stress from high social involvement and work overload."
        },
        {
            "house": "5th House",
            "detail": "Native possesses an enhanced memory and quick learning ability, making them an excellent student or teacher, though relationships may suffer."
        },
        {
            "house": "2nd House",
            "detail": "While it grants good speaking ability, the inherent aggression in speech can create persistent friction in family harmony."
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
    col = db["Mars_Mercury"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Mars_Mercury collection: document {action}.")
    print(f"     Total documents in Mars_Mercury: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Mars_Mercury collection...")
    asyncio.run(seed())
    print("[+] Done.")
