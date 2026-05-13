"""
Seed: Jupiter_Mars_Moon collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mars-Jupiter Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a 'Spiritual Warrior' dynamic driven by empathy, courage, and wisdom.",
        "Combines Mind (Moon), Action (Mars), and Higher Ideals (Jupiter) for an inspiring leadership path.",
        "Natives possess a charismatic, magnetic presence and are known for fighting for others' well-being with ethical clarity."
    ],
    "planetRoles": {
        "Moon": "Mind, emotions, maternal support, intuition, emotional intelligence",
        "Mars": "Action, courage, command, motivational drive, physical aura",
        "Jupiter": "Wisdom, ethics, higher ideals, mentors, wealth, expansion"
    },
    "effects": {
        "powerfulMars": [
            "Ensures a high rank and command over a team with an action-oriented personality.",
            "Grants success in the military, as a motivational speaker, or in national leadership.",
            "Provides the stamina and drive to lead organizations toward significant career growth."
        ],
        "powerfulMoon": [
            "Grants leadership qualities fueled by strong emotional intelligence and empathy.",
            "Ensures a calm, mature approach to stress and decision-making.",
            "Combines logic with intuition, allowing the native to stand firmly without being aggressive."
        ],
        "powerfulJupiter": [
            "Manifests as a 'philosophical warrior' who acts based on higher ideals rather than reactive impulses.",
            "Ensures rewards for effort, financial support from maternal family, and marital happiness.",
            "Provides a problem-solving approach that makes the native a respected leader in challenging situations."
        ]
    },
    "nature": {
        "positive": [
            "Charismatic and magnetic presence that inspires others toward a righteous path.",
            "Strong intuitive approach and 'gut feelings' that lead to mental clarity and success.",
            "Empathetic warrior ready to fight for injustice and the betterment of society.",
            "Success in financial sectors, teaching, law, and leadership roles with high ethical standards."
        ],
        "negative": [
            "Emotional volatility and overconfidence leading to reckless, impulsive decisions.",
            "Potential for moral superiority complexes that cause friction and lack of peace at work.",
            "Risk of ignoring logic due to over-trusting people or emotional biases in decision-making.",
            "Overzealous attachment to beliefs and impulsive spending caused by over-optimism."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Vibrant and dynamic personality; wealthy lifestyle; success in teaching, law, or spirituality."
        },
        {
            "house": "5th House",
            "effect": "Quick decision-making and powerful imagination; commanding presence in artistic pursuits."
        },
        {
            "house": "9th House",
            "effect": "Success in arts and creative work; driven by ideals to fight for truth and righteousness."
        },
        {
            "house": "10th House",
            "effect": "Respected leadership with a natural sense of justice; high rank in wealth and property."
        }
    ],
    "keywords": ["moon", "mars", "jupiter", "conjunction", "spiritual warrior", "charisma", "wisdom", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMars": (
            "A powerful Mars ensure you attain a high rank and command over your team. Your action-oriented "
            "personality fuels success in the military or as a motivational speaker. You have the "
            "commanding physical aura required to lead organizations and potentially the nation."
        ),
        "powerfulMoon": (
            "A powerful Moon grants leadership through empathy and strong emotional intelligence. You are an "
            "empathetic warrior, fighting for the well-being of others with a calm, mature approach. "
            "Your decisions are a rare blend of logic and intuition, standing firmly on truth."
        ),
        "powerfulJupiter": (
            "Jupiter transforms you into a philosophical warrior who acts on higher ideals. You possess "
            "the wisdom to avoid reactive decisions in challenging situations. Financial support from "
            "maternal relatives and happiness in marriage are common rewards for your wise actions."
        )
    },
    "positiveDetail": (
        "This conjunction brings a charismatic and magnetic aura that inspires many followers. You possess "
        "a spiritual energy mixed with passion and empathy, transforming your surroundings for the "
        "betterment of society. Your mother plays a significant role in your financial and career "
        "plans, and your strong intuitive gut feelings provide immense mental clarity. You are a "
        "righteous leader who balances emotional drive with mental strategy, ensuring that your "
        "courage is always backed by wisdom. Success in the financial sector, legal work, or "
        "spiritual leadership is indicated, as you are willing to take bold risks for the truth."
    ),
    "negativeDetail": (
        "Negative influences manifest as emotional volatility and impulse-control issues. Overconfidence "
        "and an overly optimistic approach can lead to reckless financial or relationship decisions. "
        "A sense of 'moral superiority' can cause friction with colleagues, while over-trusting "
        "people may lead to ignoring logical loopholes. Overzealous attachment to beliefs or "
        "suffocating behaviors in personal relationships can cause a lack of peace. You may also "
        "struggle with a scattered focus if your desires are not disciplined, leading to "
        "unnecessary overspending."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a vibrant, dynamic, and spiritually inclined personality. You attract the masses with a commanding physical aura and mental alertness. Gains from acting, art, or finance ensure a wealthy lifestyle, while your charitable work earns you fame."
        },
        {
            "house": "5th House",
            "detail": "Identity is shaped by a powerful imagination and the ability to make quick, intelligent decisions. Support from a mentor and a fulfilling love life are indicated. You possess a commanding presence in creative or artistic fields, supported by sharp intellect."
        },
        {
            "house": "9th House",
            "detail": "Drive for truth and righteousness makes you successful in religious or creative work. You take your personal and professional roles seriously, integrating a higher philosophical approach into mature decision-making that influences your whole community."
        },
        {
            "house": "10th House",
            "detail": "Powerhouse for attaining high rank and social respect. Destined for leadership roles, you are blessed with property, knowledge, and a natural sense of justice. Your ethical decisions help you navigate challenges with integrity and earn you lasting fame."
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
    # Alphabetical order: Jupiter, Mars, Moon
    col_name = "Jupiter_Mars_Moon"
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
    print("[*] Seeding Jupiter_Mars_Moon triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
