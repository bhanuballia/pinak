"""
Seed: Jupiter_Saturn_Sun collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Jupiter-Saturn Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly serious, mature, and ethically grounded personality.",
        "Combines Soul (Sun), Wisdom (Jupiter), and Discipline (Saturn) for long-term stability and high authority.",
        "Natives are often respected for their calm authority, commitment to responsibility, and deep philosophical understanding."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, father, government status, ego",
        "Jupiter": "Wisdom, expansion, moral values, mentors, education, law",
        "Saturn": "Discipline, consistency, stability, hard work, tradition, time"
    },
    "effects": {
        "powerfulSun": [
            "Grants success in government careers and high status in political roles.",
            "Ensures a leadership style where the native creates their own rules and sets clear instructions.",
            "Provides facilities from the government and strong support from the father."
        ],
        "powerfulJupiter": [
            "Grants a wise and harmonious personality among family and colleagues.",
            "Ensures confidence and clarity in decision-making with a focus on long-term goals.",
            "Provides guidance from grandparents and excellence in law, finance, or education."
        ],
        "powerfulSaturn": [
            "Ensures stability and consistent growth, particularly as a thriving industrialist.",
            "Helps the native understand the value of consistent effort despite initial stagnant situations.",
            "Grants a disciplined approach that builds a highly respected professional reputation."
        ]
    },
    "nature": {
        "positive": [
            "Mature, balanced, and emotionally controlled personality with high moral values.",
            "Altruistic yet pragmatic approach to life, balancing ethics with responsibility.",
            "Strong capacity to withstand pressure and a deep understanding of duty and tradition.",
            "Success in administrative roles, judicial positions, and large-scale industrial ventures."
        ],
        "negative": [
            "Moral superiority complex leading to a tendency to judge or preach to others.",
            "Delayed recognition or growth causing anxiety and psychological stress.",
            "Energy clashes between Sun and Saturn resulting in suppressed expressions or lack of spontaneity.",
            "Workaholic tendencies causing emotional distance from family and friends."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "More mature than age; serious look; success in law, research, or higher teaching."
        },
        {
            "house": "2nd House",
            "effect": "Gains from inheritance; ethical speech; speech that raises optimism in society."
        },
        {
            "house": "5th House",
            "effect": "Traditional approach to conflicts; success as a judge or philosopher; structured growth."
        },
        {
            "house": "9th House",
            "effect": "Growth in law and legal work; strong philosophical and scientific approach."
        },
        {
            "house": "10th House",
            "effect": "High rank in private or government sectors; growth through experience and resilience."
        },
        {
            "house": "11th House",
            "effect": "Rise in structured careers; building strong relationships with higher authorities."
        }
    ],
    "keywords": ["sun", "jupiter", "saturn", "conjunction", "wisdom", "discipline", "authority", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun in this conjunction ensures success in a government career. You demonstrate high "
            "morals and won't let others rule over your organization. You create your own set of rules, "
            "earning respect and support from senior officials and your father. Your determined approach "
            "makes you an ideal candidate for political leadership."
        ),
        "powerfulJupiter": (
            "Jupiter grants a wise personality, making you the pillar of harmony in your circles. You "
            "possess clarity in decision-making and a strong commitment to social norms. Your "
            "educational background is sound, and you find deep support from grandparents, excelling "
            "in law, finance, or legal sectors."
        ),
        "powerfulSaturn": (
            "Saturn provides stability and consistent professional growth. While you may encounter initial "
            "stagnation, Saturn forces you to value consistent effort, leading to success as a "
            "thriving industrialist. Combined with Jupiter's wisdom, you build a foundation "
            "of lasting success through disciplined baby steps."
        )
    },
    "positiveDetail": (
        "This conjunction creates a serious, mature personality. You follow your path with patience, "
        "ambition, and vision, attaining high authority through a disciplined approach. You balance "
        "altruism with pragmatism, earning a prestigious image in society. Spiritual maturity "
        "and a deep understanding of religion and duty are key traits. You are emotionally "
        "controlled and thoughtful, making you an ideal leader who respects tradition while "
        "navigating modern responsibilities."
    ),
    "negativeDetail": (
        "Challenges often arise from a 'moral superiority complex' or a tendency to judge others. "
        "Delayed recognition can cause anxiety, and the energy clash between the Sun and Saturn "
        "may suppress your spontaneity. You might become overly rigid in your beliefs or "
        "burdened by responsibility, leading to distance in personal relationships. "
        "Workaholic tendencies and a lack of emotional openness can make you appear distant "
        "to family and friends."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native is wise and serious beyond their years, often having a goal-driven personality. Consistency in effort brings success in research, law, or as a professor. You possess natural authority and an undeniable social rank."
        },
        {
            "house": "2nd House",
            "detail": "Gains from inheritance and a family background of high morals. You may have opinion clashes with elders but possess the maturity to integrate their guidance. Your speech is eloquent and optimistic, influencing the masses and attracting wealth."
        },
        {
            "house": "5th House",
            "detail": "Traditional approach to income generation and conflict resolution. While creativity might be initially blocked, you eventually find success as a scholar, judge, or educator. Support from both grandparents and grandchildren enriches your professional life."
        },
        {
            "house": "9th House",
            "detail": "Identity is shaped by a strong inclination toward religious and legal work. You possess a rare blend of philosophical and scientific approaches, receiving deep support from grandparents and spiritual mentors."
        },
        {
            "house": "10th House",
            "detail": "Excellent for attaining a high rank in both private and government sectors. While the first phase of life involves learning through experience and friction, the second phase brings massive support from authorities and consistent growth."
        },
        {
            "house": "11th House",
            "detail": "A powerhouse placement for learning from challenges. You build strong ties with higher authorities and political parties. Success is marked by a structured rise in law, administration, or government-connected careers."
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
    # Alphabetical order: Jupiter, Saturn, Sun
    col_name = "Jupiter_Saturn_Sun"
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
    print("[*] Seeding Jupiter_Saturn_Sun triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
