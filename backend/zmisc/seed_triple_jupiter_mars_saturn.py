"""
Seed: Jupiter_Mars_Saturn collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mars-Jupiter-Saturn Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a forceful, principled, and strategically minded personality.",
        "Combines Action (Mars), Wisdom (Jupiter), and Discipline (Saturn) for ethical leadership and endurance.",
        "Natives are known as 'Philosophical Warriors' or reformists, balancing bold ambition with a deep respect for law and tradition."
    ],
    "planetRoles": {
        "Mars": "Action, courage, ambition, strategic willpower, physical stamina",
        "Jupiter": "Wisdom, integrity, moral values, higher education, spiritual purpose",
        "Saturn": "Discipline, persistence, structure, patience, professional stability"
    },
    "effects": {
        "powerfulMars": [
            "Ensures ambition is guided by high ideals and structured execution.",
            "Grants the courage to act boldly but responsibly, often drawn to societal duties.",
            "Provides the determination and toughness required to overcome rivals with ethical strength."
        ],
        "powerfulJupiter": [
            "Ensures a wise and down-to-earth personality focused on integrity and practical solutions.",
            "Grants success in higher studies and a strong educational background without compromising values.",
            "Provides the ability to inspire others through beliefs and actions rooted in spiritual drive."
        ],
        "powerfulSaturn": [
            "Manifests as an intense, disciplined personality with a patient and structured approach.",
            "Ensures endurance and steady ambition that controls impulsiveness or over-optimism.",
            "Provides a tough look but a very optimistic internal approach, earning respect as an advisor."
        ]
    },
    "nature": {
        "positive": [
            "Highly disciplined and strategic thinker who takes wise risks for the long term.",
            "Ethical leader with a strong sense of duty and commitment to a higher purpose.",
            "Tireless worker with the stamina to execute long-term projects with dedication and patience.",
            "Mentorship personality who is energetic yet grounded, ensuring endurance under pressure."
        ],
        "negative": [
            "Delayed success despite immense hard work and internal conflict between impulse and restraint.",
            "Stubborn, rigid nature and suppressed anger leading to spiritual arrogance or overcontrol.",
            "Workaholic approach causing a lack of quality time and harmony in marital life.",
            "Potential for legal challenges, property losses, and a fear of failure that blocks progress."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong convictions and serious demeanor; natural strategist who inspires through action."
        },
        {
            "house": "9th House",
            "effect": "Truth-seeker and social reformer; success in foreign travels; builds beliefs through testing."
        },
        {
            "house": "10th House",
            "effect": "Ethical powerhouse in government/law; persistent rise to power through sustained merit."
        }
    ],
    "keywords": ["mars", "jupiter", "saturn", "conjunction", "principled", "strategy", "reformist", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMars": (
            "A strong Mars gives you a principled and strategic personality. You act boldly yet "
            "responsibly, guided by high ideals and a determination that serves the greater "
            "good. Your stamina and willpower are morally focused, making you a tough opponent "
            "who never compromises on integrity."
        ),
        "powerfulJupiter": (
            "Jupiter ensures you have a wise and down-to-earth personality. You achieve success in "
            "higher studies and maintain a strong educational background. Your moral values "
            "are unshakeable, allowing you to inspire others with beliefs that are both "
            "optimistic and practical."
        ),
        "powerfulSaturn": (
            "Saturn manifests as an intense and disciplined character. You possess the endurance "
            "required for long-term projects and approach challenges with a patient realism. "
            "While you may appear tough, your inner optimism and structured ambition make "
            "you a sought-after advisor."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Philosophical Warrior'—someone who is mentally tough, spiritually "
        "driven, and exceptionally disciplined. You possess the stamina to be a tireless worker, "
        "ready to commit to long-term projects with dedicated patience. Your leadership "
        "qualities are rooted in ethical strength, where you take wise risks for the sake "
        "of a higher purpose. In relationships, you are deeply committed and responsible, "
        "taking care of your family and parents with an action-oriented devotion. Your "
        "grounded yet energetic nature ensures you remain calm under pressure, blending "
        "respect for tradition with a bold drive for reform. Success flows from your "
        "ability to balance aggression with structure, earning you a lasting legacy "
        "built on merit and unshakeable principles."
    ),
    "negativeDetail": (
        "Negative influences can lead to delayed success despite your hard work, often causing internal "
        "conflict between your impulses and Saturn's restraint. Suppressed anger and a "
        "stubborn, rigid nature can cause hurdles in friendships and marital life. You "
        "may suffer from 'spiritual arrogance' or a workaholic approach that leaves no room "
        "for domestic happiness. Affliction can make you over-critical or overburdened "
        "with responsibilities, leading to stress and a fear of failure. Moral conflicts "
        "and legal challenges regarding property may arise if your values and actions "
        "clash. Your demanding nature might make loved ones feel uncomfortable, "
        "making it difficult for you to share your true feelings."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a unique blend of ambition and wisdom. You radiate inner strength and carry strong convictions, never hesitating to make tough decisions. You are a natural strategist who inspires the masses through your purposeful and serious demeanor."
        },
        {
            "house": "9th House",
            "detail": "Identity is defined as a social reformer or truth-seeker. You build your beliefs through rigorous testing and possess the drive to fight for your philosophical understanding. Success in foreign travels and higher education is assured, often receiving favors from rulers."
        },
        {
            "house": "10th House",
            "detail": "Powerhouse for ethical professional success. You rise to positions of power in government, law, or engineering through sustained effort and merit. While career success may be delayed, the legacy you build is stable, visionary, and highly respected."
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
    # Alphabetical order: Jupiter, Mars, Saturn
    col_name = "Jupiter_Mars_Saturn"
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
    print("[*] Seeding Jupiter_Mars_Saturn triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
