"""
Seed: Jupiter_Mars_Mercury_Moon collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mars-Mercury-Jupiter Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a spiritually inclined, highly intelligent, and socially respected personality.",
        "Combines Wisdom (Jupiter), Drive (Mars), Logic (Mercury), and Emotions (Moon) for social acclaim.",
        "Natives excel in occult subjects and high government roles but often face financial struggles and personal unfulfillment."
    ],
    "planetRoles": {
        "Moon": "Emotions, intuition, occult interest, astrology inclination, secret relationships",
        "Mars": "Drive, action, social status, government acclaim, raw energy",
        "Mercury": "Logic, intelligence, command over scriptures, analytical thinking, communication",
        "Jupiter": "Wisdom, spirituality, ministry favor, social reputation, moral guidance"
    },
    "effects": {
        "powerfulSun": [
            "Note: This conjunction lacks the Sun; its authority is provided by Jupiter and Mars.",
            "Natives rely on spiritual wisdom and aggressive drive rather than pure structured authority.",
            "Success comes through reputation and recognition in government circles."
        ],
        "powerfulMoon": [
            "Grants a strong inclination toward occult subjects, astrology, and spiritual depths.",
            "Ensures deep emotional intuition, though it may lead to secret or socially constrained relationships.",
            "Provides the mental capacity to understand hidden meanings in scriptures and spiritual texts."
        ],
        "powerfulMars": [
            "Grants a superior position in society, often leading to a role in the government or ministry.",
            "Ensures significant acclaim and recognition throughout life, building an enviable reputation.",
            "Provides the motivation to excel in public service despite a lack of interest in worldly matters."
        ],
        "powerfulMercury": [
            "Grants an above-average intelligence level with a great command over holy scriptures.",
            "Ensures the logic needed to interpret complex occult subjects and traditional wisdom.",
            "Provides an analytical mind that excels in intellectual discourse and administrative planning."
        ],
        "powerfulJupiter": [
            "Grants a deep spiritual inclination and the favour of high-ranking wise individuals.",
            "Ensures success in ministry and education sectors through moral and intellectual superiority.",
            "Provides the vision to guide others spiritually, even if personal financial stability is lacking."
        ]
    },
    "nature": {
        "positive": [
            "Spiritually inclined individual with vast knowledge of scriptures and occult sciences.",
            "Enviable social reputation with significant acclaim in government or high-status circles.",
            "Above-average intelligence that allows for the mastery of complex intellectual subjects.",
            "Respected leader who values spiritual growth over temporary worldly achievements."
        ],
        "negative": [
            "Chronic financial struggle despite achieving high name, fame, and social position.",
            "Lack of personal fulfillment and potential for secret, socially constrained relationships.",
            "Detachment from worldly matters that can lead to difficulties in managing practical finances.",
            "Mental unrest arising from the gap between public success and private emotional satisfaction."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong spiritual personality; famous social bearing; success in occult or ministry roles."
        },
        {
            "house": "10th House",
            "effect": "Superior position in government; acclaim through intellectual and spiritual command."
        },
        {
            "house": "9th House",
            "effect": "Deep mastery over scriptures; authority through philosophical and astrological depth."
        },
        {
            "house": "4th House",
            "effect": "Support from mother in spiritual growth; domestic life may feel worldly but detached."
        }
    ],
    "keywords": ["moon", "mars", "mercury", "jupiter", "conjunction", "spiritual", "occult", "intelligence", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A strong Moon grants you a deep inclination toward occult subjects and astrology. You possess "
            "a strong intuitive bond with the spiritual world and the capacity to understand the "
            "hidden meanings in holy scriptures. However, this depth can sometimes manifest "
            "as secret relationships that you maintain due to social constraints."
        ),
        "powerfulMars": (
            "Mars provides you with a superior position in society and the government. You are respected "
            "for your energetic drive and achieve significant acclaim and recognition. Your "
            "enviable social reputation is built on your public service, even if you do "
            "not personally value the worldly aspects of your power."
        ),
        "powerfulMercury": (
            "Mercury grants you an above-average intelligence level. You have a great command over "
            "scriptures and analytical subjects, making you an expert in intellectual discourse. "
            "Your logic is sharp, allowing you to interpret complex astrological and occult "
            "matters with a clarity that earns you the respect of your peers."
        ),
        "powerfulJupiter": (
            "Jupiter acts as your pillar of spirituality, ensuring you have the favour of those in "
            "ministry and high office. You are seen as a wise and spiritually inclined leader. "
            "While you provide guidance and vision to others, you may personally struggle with "
            "financial stability, as your focus remains fixed on the higher truths of life."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Spiritual Intellectual' personality. You possess a sharp mind "
        "and above-average intelligence, specifically in the realms of scriptures, astrology, "
        "and the occult. You enjoy an enviable social reputation, often holding a superior "
        "position in government or a ministry. Your life is filled with acclaim and "
        "recognition, as you are respected for your spiritual depth and intellectual "
        "command. You are a person who values the 'higher' matters of life, using "
        "your status to inspire others through your vast knowledge and moral "
        "integrity, ensuring that your public legacy is one of wisdom and spiritual authority."
    ),
    "negativeDetail": (
        "Negative influences manifest as chronic financial struggle and a lack of personal fulfillment. "
        "Despite your fame, you may find thatworldly success does not translate into "
        "monetary stability or emotional satisfaction. Secret relationships or "
        "socially constrained partnerships can cause internal unrest. Your "
        "detachment from worldly matters, while spiritual, can make you "
        "inefficient in practical life management, leading to a gap between "
        "your high-status public persona and your private struggles."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native is spiritually inclined and possesses a wise social bearing. You are known for your occult mastery and receive significant acclaim from government circles. While you face financial hurdles, your spiritual authority ensures you remain a respected figure."
        },
        {
            "house": "10th House",
            "detail": "Ensures a successful career in ministry or high-level administration. You rise to a position of power through your intellectual command and knowledge of scriptures. Your reputation for spiritual wisdom makes you a trusted leader among senior authorities."
        },
        {
            "house": "9th House",
            "detail": "Powerhouse for astrological and philosophical growth. You excel in fields that require deep study of hidden subjects, using your learned nature to guide others. Your status grows through your command over scriptures and traditional wisdom."
        },
        {
            "house": "4th House",
            "detail": "Identity is defined by a spiritual home environment, often influenced by a wise mother figure. While you may feel detached from worldly domestic matters, your intuition helps you build a family life that is grounded in higher moral values."
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
    # Alphabetical order: Jupiter, Mars, Mercury, Moon
    col_name = "Jupiter_Mars_Mercury_Moon"
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
    print("[*] Seeding Jupiter_Mars_Mercury_Moon four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
