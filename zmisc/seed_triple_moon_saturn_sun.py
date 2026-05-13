"""
Seed: Moon_Saturn_Sun collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Saturn Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly disciplined, mature, and serious personality.",
        "Combines Soul (Sun), Mind (Moon), and Discipline (Saturn) for endurance and responsibility.",
        "Natives often possess a calm authority and are capable of working effectively under extreme pressure."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, government, father, ego",
        "Moon": "Mind, emotional depth, research, mother, financial command",
        "Saturn": "Discipline, stability, hard work, industrial growth, consistency"
    },
    "effects": {
        "powerfulSun": [
            "Grants success in professional fields dealing with government or politics.",
            "Rewards hard work with promotions, despite potential friction with seniors.",
            "Helps make decisions with clarity, though may cause ego-related overthinking."
        ],
        "powerfulMoon": [
            "Ensures success through a serious, consistent, and research-oriented approach.",
            "Provides deep knowledge and strong command over financial matters.",
            "Grants emotional stability through introspection and depth of thought."
        ],
        "powerfulSaturn": [
            "Ensures stability and consistent growth as a thriving industrialist.",
            "Instills the value of consistent effort in engineering, medicine, and government.",
            "Brings long-term professional success, despite initial stagnant situations."
        ]
    },
    "nature": {
        "positive": [
            "Highly disciplined personality following strict routines and win against rivals.",
            "Mature approach toward domestic and professional life with patience and calm authority.",
            "Success in administrative, legal, and machinery/oil-related sectors.",
            "Visionary yet realistic outlook, enduring hardships with commitment to responsibility."
        ],
        "negative": [
            "Psychological stress and emotional tension due to restrictive personality traits.",
            "Challenges in relationship harmony with fathers, elders, and maternal family.",
            "Tendency toward a pessimistic approach, burden of duty, and fear of judgment.",
            "Distant or emotionally reserved behavior affecting family connections."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Serious and tough look; hardworking and ready to take risks; success in government."
        },
        {
            "house": "2nd House",
            "effect": "High moral values from family heritage; able to manage wealth and create savings."
        },
        {
            "house": "5th House",
            "effect": "Emotional attachment to social status; potential clashes of opinion with children."
        },
        {
            "house": "6th House",
            "effect": "Overcoming financial challenges; punctual personality; success in legal/medical sectors."
        },
        {
            "house": "10th House",
            "effect": "Rise in status in government or engineering; key lies in emotional regulation."
        }
    ],
    "keywords": ["sun", "moon", "saturn", "conjunction", "discipline", "authority", "responsibility", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A powerful Sun in this conjunction helps you make decisions with clarity and ensures success in "
            "government or political sectors. It brings a rise in status, though ego and overthinking may "
            "create internal friction. While it might limit your approach with seniors, your hard work "
            "eventually earns you rewards and promotions."
        ),
        "powerfulMoon": (
            "A strong Moon ensures success through a serious and consistent approach. Your ability for research "
            "and deep introspection grants you the knowledge needed to thrive professionally. You also "
            "possess excellent command over financial matters and navigate complex situations with depth."
        ),
        "powerfulSaturn": (
            "Powerful Saturn ensures stability and growth, possibly leading you to become a thriving industrialist. "
            "It helps you understand the value of consistent effort, bringing success in engineering, medicine, "
            "and government. While it may cause initial stagnant situations, it builds a foundation for long-term "
            "professional security."
        )
    },
    "positiveDetail": (
        "This combination creates a highly disciplined personality. You develop a mature, balanced outlook "
        "that allows you to navigate challenges with patience and win debates with calm authority. You likely "
        "benefit from inheritance and find guidance from both maternal and paternal lines. You are the "
        "person who can work under intense pressure, earning respect for your commitment to responsibility. "
        "Your personality is a rare blend of being realistic yet visionary, managing ego and fluctuating "
        "emotions with maturity."
    ),
    "negativeDetail": (
        "Negative influences can lead to ego clashes and a self-centered approach, causing significant psychological "
        "stress. You may develop a restrictive personality that hampers harmony in marital and professional life. "
        "A pessimistic approach or fear of judgment might drag you into challenges, making you appear emotionally "
        "distant. You may struggle to express true feelings and suffer from stagnant emotions, often regretting "
        "past mistakes. Physical health, particularly digestion and bones, may suffer if discipline toward "
        "diet is neglected."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Gives a serious and tough look. You are perceived as hardworking and argumentative—it's not easy to win against you in debates. While marital life may face ego clashes, you will likely attain a high rank in government or administrative roles, excelling in food or nature-based businesses."
        },
        {
            "house": "2nd House",
            "detail": "Grants high values and serious speech. People seek your advice, and you are excellent at creating savings. However, overthinking or family interference may delay marriage or impact relationship harmony. You remain emotionally attached to your wealth and security."
        },
        {
            "house": "5th House",
            "detail": "Success and recognition may be delayed, and love relationships often start with friction. You may feel stressed due to overthinking your social status and results. Clashes of opinion with children are possible, but you remain deeply committed to your creative and social goals."
        },
        {
            "house": "6th House",
            "detail": "Ensures enemies will not dare go against you and provides success in government jobs (Law, Education, Medical). You are highly punctual but may be reserved at the workplace, finding it difficult to share experiences. Health conditions require vigilant knowledge to avoid chronic issues."
        },
        {
            "house": "10th House",
            "detail": "A powerhouse placement for status and authority. Punctuality and hard work are your core themes. You may rise in politics or engineering. A strong Moon here supports medical success. Success depends on regulating your emotions and not over-identifying with your status alone."
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
    # Alphabetical order: Moon, Saturn, Sun
    col_name = "Moon_Saturn_Sun"
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
    print("[*] Seeding Moon_Saturn_Sun triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
