"""
Seed: Mars_Moon_Saturn collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mars-Saturn Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a personality defined by deep emotional endurance, discipline, and persistent effort.",
        "Combines Mind (Moon), Action (Mars), and Restriction (Saturn) for a serious and resilient character.",
        "Natives often achieve professional stability through struggle, earning respect through their relentless energy and mature wisdom."
    ],
    "planetRoles": {
        "Moon": "Mind, emotions, mental discipline, emotional endurance, mother",
        "Mars": "Action, passion, courage, self-control, physical drive",
        "Saturn": "Discipline, stability, practical approach, maturity, endurance"
    },
    "effects": {
        "powerfulMars": [
            "Ensures passion toward goals and the ability to lead teams with determination.",
            "Grants emotional discipline and the courage to complete tireless work to achieve objectives.",
            "Helps channel aggressive energy into productive leadership if balanced."
        ],
        "powerfulMoon": [
            "Helps overcome pessimism and emotional turbulence caused by Saturn and Mars.",
            "Grants command over desires and a mental discipline that transforms aggression into passion.",
            "Ensures the ability to manage real-life challenges with a calm, assertive approach."
        ],
        "powerfulSaturn": [
            "Provides a good amount of endurance and a practical approach under extreme pressure.",
            "Ensures consistent growth and professional stability, even if success is delayed.",
            "Grants a sense of maturity beyond years and exceptional decision-making abilities."
        ]
    },
    "nature": {
        "positive": [
            "Strong emotional endurance and the ability to work under pressure with consistent effort.",
            "Practical thinking combined with emotional intelligence to manage complex responsibilities.",
            "Self-control in volatile environments, leading to steady income and professional respect.",
            "Deep spiritual understanding and determination to complete long-term goals despite setbacks."
        ],
        "negative": [
            "Emotional conflicts, overthinking, and suppressed anger leading to passive-aggressive behavior.",
            "Mental restlessness and mood swings caused by clashing planetary energies.",
            "Fear of failure or a pessimistic approach due to lack of family support.",
            "Vulnerability to depression, anxiety, and health issues like digestion or skin disorders."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Emotionally intense and determined; serious personality dedicated to impossible tasks."
        },
        {
            "house": "5th House",
            "effect": "Sharp, determined intellect; delays in recognition; lessons in emotional self-expression."
        },
        {
            "house": "10th House",
            "effect": "Workaholic personality; rise to power through struggle; highly reliable and tough leader."
        }
    ],
    "keywords": ["moon", "mars", "saturn", "conjunction", "endurance", "resilience", "discipline", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMars": (
            "A strong Mars makes you passionate about your goals and helps you lead teams with focus. "
            "It demands emotional discipline to manage workloads effectively. While an afflicted Mars "
            "can cause anger or jealousy, a well-placed one ensures you work tirelessly until "
            "your objectives are met."
        ),
        "powerfulMoon": (
            "A powerful Moon helps you overcome the pessimism that often accompanies Saturn. It grants "
            "you command over your desires, even with Mars in conjunction, transforming potential "
            "aggression into refined passion. You manage real-life challenges with mental discipline "
            "and an assertive yet calm energy."
        ),
        "powerfulSaturn": (
            "Saturn provides the practical endurance needed to succeed under pressure. While success "
            "may be delayed, it is never denied, and the stability you build is lasting. You "
            "possess a sense of maturity beyond your years, allowing you to make wise, grounded "
            "decisions even in volatile professional landscapes."
        )
    },
    "positiveDetail": (
        "This conjunction creates a powerhouse of emotional endurance. You possess the self-control "
        "to thrive in volatile environments and the patience to build a strong professional "
        "foundation. Your practical thinking is balanced by emotional intelligence, making "
        "you reliable and tough under stress. You are spiritually inclined and emotionally "
        "mature, determined to see long-term goals through to completion despite any "
        "setbacks. Success often comes through consistent effort and a law-abiding, "
        "disciplined personality that earns deep respect in society."
    ),
    "negativeDetail": (
        "Challenges manifest as suppressed anger and passive-aggressive behaviors. Overthinking and "
        "emotional suppression can lead to inner conflict and a distant relationship with maternal "
        "relatives. You may struggle with 'Vish Dosha' (Saturn-Moon friction), making it difficult "
        "to trust others emotionally and prone to frustration due to delays. A fear of failure "
        "might block you from taking healthy risks, while processed emotions can manifest as "
        "chronic health issues like digestion problems, headaches, or skin disorders. A pessimistic "
        "approach and a lack of spontaneity can create distance with family and friends."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native is emotionally intense and dedicated to their responsibilities. You possess a serious look and the ability to take on 'impossible' tasks through sheer perseverance. While highly resilient, you must manage internal conflicts and potential mood swings to maintain balanced health."
        },
        {
            "house": "5th House",
            "detail": "Identity is shaped by a sharp, determined intellect and a traditional approach to life. While creativity may feel forced early on, you eventually develop deep wisdom. Love life and relations with children require emotional patience to bridge gaps in expression."
        },
        {
            "house": "10th House",
            "detail": "Powerhouse workaholic who creates new traditions with a technical mindset. You climb the ladder of success through struggle, learning from failures and earning massive respect as a reliable, tough leader who thrives under relentless professional pressure."
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
    # Alphabetical order: Mars, Moon, Saturn
    col_name = "Mars_Moon_Saturn"
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
    print("[*] Seeding Mars_Moon_Saturn triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
