"""
Seed: Jupiter_Moon_Sun_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Jupiter-Venus Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a royal, bright, and bold personality with magnetic social appeal.",
        "Combines Authority (Sun), Emotions (Moon), Wisdom (Jupiter), and Attraction (Venus) for balanced prosperity.",
        "Natives excel in government leadership, legal advisory, creative engineering, and high-rank financial roles."
    ],
    "planetRoles": {
        "Sun": "Authority, father, status, discipline, responsibility, financial oversight",
        "Moon": "Mind, emotions, mother, intuition, empathy, domestic nourishment",
        "Jupiter": "Wisdom, law, tradition, optimism, judgment, spiritual guidance",
        "Venus": "Love, beauty, luxury, design, creative engineering, detailed execution"
    },
    "effects": {
        "powerfulSun": [
            "Grants a deep sense of responsibility and an attentive manner in executing family and office tasks.",
            "Ensures a creative approach to financial matters, education, and social leadership.",
            "Provides success in political careers through learning inherited from the father and senior figures."
        ],
        "powerfulMoon": [
            "Grants a kind and caring personality that nourishes family bonds with love and affection.",
            "Ensures clarity of thought even in high-pressure situations, earning a mass following.",
            "Provides an enjoyment of each moment, coupled with the luxury of quality food and a big house."
        ],
        "powerfulJupiter": [
            "Grants an optimistic approach with in-depth knowledge that ensures success in higher studies.",
            "Ensures a superior sense of judgment, leading to growth in the law and financial sectors.",
            "Provides gain through mentors and parents, making the native a source of wise advice."
        ],
        "powerfulVenus": [
            "Grants a sense of detail and the ability to 'connect the dots' in creative or engineering projects.",
            "Ensures financial abundance and status rise through the help of government and female colleagues.",
            "Provides a strong emotional bond in relationships, expressing love with grace and luxury."
        ]
    },
    "nature": {
        "positive": [
            "Royal and bright personality that commands respect and attracts positive social company.",
            "Wise decision-maker who trusts their own judgment and confidence over external validation.",
            "Prosperity and status rise through spiritual guidance and knowledge from diverse sources.",
            "Strong educational background with a balanced approach to practicality and intuition."
        ],
        "negative": [
            "Over-expectations and self-centered approach in relationships leading to stress and anxiety.",
            "Anxiety and health challenges driven by attachment to money, property, and past experiences.",
            "Financial losses caused by ignorance in investments or an over-ambitious, reckless drive.",
            "Potential blocks in educational success or marital peace if over-expectations are not managed."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Attractive personality with a strong aura; wise judgment and unbiased decision-making."
        },
        {
            "house": "2nd House",
            "effect": "Luxury in food and furniture; sweet but bold voice that people do not take lightly."
        },
        {
            "house": "5th House",
            "effect": "Creative and intelligent decision-making; smooth relationships with children and siblings."
        },
        {
            "house": "10th House",
            "effect": "Polite but bold leadership; connection with higher authorities and success in engineering/finance."
        }
    ],
    "keywords": ["sun", "moon", "jupiter", "venus", "conjunction", "royal", "prosperity", "wisdom", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun gives you the ability to look after financial matters and family duties in an "
            "attentive manner. You possess a high sense of responsibility and structure in daily life, "
            "especially regarding education and food. Your father's influence is significant, helping "
            "you execute professional work with a creative and disciplined approach that can lead to "
            "a successful political or administrative career."
        ),
        "powerfulMoon": (
            "Moon ensures you are a source of nourishment and care for your family. You enjoy each moment "
            "with affection and possess a kind, caring personality. Your intuition is your shield, "
            "providing clarity of thought even in challenging times. You likely have a large following "
            "and enjoy the finer things in life, such as quality food, comfortable vehicles, and a "
            "big, supportive home."
        ),
        "powerfulJupiter": (
            "Jupiter acts as your pillar of optimism, granting you in-depth knowledge and success in "
            "higher studies. You receive immense gains from mentors and parents, building a career "
            "in law or finance based on your superior sense of judgment. You are seen as a wise "
            "thinker who acquires knowledge from various sources, making you a respected leader in "
            "your community."
        ),
        "powerfulVenus": (
            "Venus grants you an eye for detail, allowing you to connect the dots in complex projects. "
            "You excel in creative work, engineering design, or development sectors. Your status rises "
            "through government support and the influence of female colleagues, ensuring "
            "financial abundance and a luxurious lifestyle where you care for your relationships "
            "with a deep and refined emotional bonding."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Bright Royal' personality. You are a bold leader who makes "
        "decisions with confidence, rarely needing to rely on others' opinions. Your aura attracts "
        "the masses, and you find expected growth in the government, financial, or artistic "
        "sectors. You are seen as an intelligent and wise strategist, often benefiting from "
        "spiritual guidance and the wisdom of mentors. Prosperity and status rise are "
        "natural for you, especially as you balance practical finances with an intuitive "
        "understanding of human connection. You build a legacy through high moral values "
        "and the ability to inspire others with your royal bearing and wise judgments."
    ),
    "negativeDetail": (
        "Negative influences manifest as over-expectations and a self-centered approach to love and money. "
        "Affliction can cause internal stress due to an attachment to past experiences or "
        "over-ambitious goals that lead to reckless investments. Marital life may face "
        "challenges if desires outpace the reality of the partnership. Lack of focus on diet "
        "or ignorance in financial management can cause health crunches or financial losses. "
        "It is essential to stay grounded and manage your expectations of others to maintain "
        "the peace and abundance this combination is meant to provide."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses an attractive aura that naturally draws the attention of the masses. You are known for unbiased decision-making and a wise personality. Support from your parents and spouse ensures your path is smooth, and you enjoy a refined taste in food, fashion, and management."
        },
        {
            "house": "2nd House",
            "detail": "Identity is centered on family support and multiple income sources. You possess a sweet but bold voice—people take your suggestions seriously. You enjoy luxury in your home surroundings and food, though you must guard against ignorance in diet or savings to avoid financial crunches."
        },
        {
            "house": "5th House",
            "detail": "Powerhouse for creative and intelligent decision-making. You find success in love relationships and maintain smooth bonds with siblings and children. Your professional life thrives through a blend of empathy and sharp intellect, often supported by a love partner's financial insight."
        },
        {
            "house": "10th House",
            "detail": "Ensures a polite but strong leadership style that is highly respected by senior authorities. You have a direct connection with higher officials, excelling in engineering, architecture, or finance. Your broad vision and patience lead to a productive, high-status lifestyle that others find inspiring."
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
    db = client["Four_Planet_Conjunction"]
    # Alphabetical order: Jupiter, Moon, Sun, Venus
    col_name = "Jupiter_Moon_Sun_Venus"
    col = db[col_name]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Four Planet Conjunction: {col_name} {action}.")
    print(f"     Total documents in {col_name}: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Jupiter_Moon_Sun_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
