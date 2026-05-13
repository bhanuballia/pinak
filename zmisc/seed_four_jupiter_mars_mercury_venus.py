"""
Seed: Jupiter_Mars_Mercury_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mars-Mercury-Jupiter-Venus Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a highly balanced and morally upright personality driven by two friendly planetary pairs.",
        "Combines Wisdom (Jupiter) with Drive (Mars) for ambition, and Logic (Mercury) with Attraction (Venus) for artistic balance.",
        "Natives enjoy substantial wealth, a healthy life, and are revered for their good virtues, though they may face confrontations with females."
    ],
    "planetRoles": {
        "Mars": "Ambition, drive, health, physical vitality, confrontations",
        "Mercury": "Logic, intellect, artistic inclination, balancing desires, communication",
        "Jupiter": "Wisdom, intellect, moral compass, good virtues, right direction, reputation",
        "Venus": "Attraction, substantial wealth, affluence, arts, literature, music, desires"
    },
    "effects": {
        "powerfulSun": [
            "Note: This conjunction lacks the Sun; its authority is completely replaced by Jupiter's wisdom and Mars' ambition.",
            "Natives rely on their aesthetic talents and high morals to gain respect and status.",
            "Success comes through being balanced and creatively gifted."
        ],
        "powerfulMars": [
            "Grants a strong sense of ambition that constantly drives the native in the right direction.",
            "Ensures a robust and healthy life throughout, providing the vitality needed for sustained success.",
            "Provides the courage to stand by their virtues, though it may trigger confrontations with females."
        ],
        "powerfulMercury": [
            "Grants a sharp intellect that perfectly balances the sensual energy of Venus.",
            "Ensures the native remains morally upright by logicizing their desires.",
            "Provides a strong artistic inclination, making the native highly skilled in complex crafts."
        ],
        "powerfulJupiter": [
            "Grants exceptional wisdom and good virtues, making the native almost worshipped by others.",
            "Ensures the native holds a highly reputable position in society through ethical conduct.",
            "Provides the moral foundation that guides the ambitious energy of Mars."
        ],
        "powerfulVenus": [
            "Grants substantial wealth, affluence, and a life surrounded by luxury.",
            "Ensures a deep aesthetic inclination, making the native extremely fond of arts, literature, and music.",
            "Provides an attractive social aura that, when balanced by Mercury, results in pure creative expression."
        ]
    },
    "nature": {
        "positive": [
            "Balanced and morally upright individual who perfectly harmonizes ambition with artistic passion.",
            "Enjoys substantial wealth, affluence, and a highly reputable position in society.",
            "Possesses a multitude of good virtues and is often worshipped or deeply revered by others.",
            "Leads a robust and healthy life, deeply enjoying the finer aspects of arts, literature, and music."
        ],
        "negative": [
            "Tendency to get involved in unnecessary confrontations or disputes with females.",
            "Potential to become overly focused on aesthetic perfection, ignoring practical realities.",
            "The combination of high ambition and strong desires requires constant intellectual management.",
            "High expectations from society due to their reputation for being 'worshipped' for their virtues."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Balanced and attractive personality; highly ambitious; success in arts and literature."
        },
        {
            "house": "10th House",
            "effect": "Reputable position in society; career success through moral leadership and aesthetic industries."
        },
        {
            "house": "2nd House",
            "effect": "Substantial wealth and affluence; eloquent speech; potential confrontations over family assets."
        },
        {
            "house": "5th House",
            "effect": "Exceptional talent in music and literature; good virtues passed to progeny; creative fame."
        }
    ],
    "keywords": ["mars", "mercury", "jupiter", "venus", "conjunction", "balanced", "artistic", "virtuous", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMars": (
            "Mars provides the raw ambition and drive in this balanced conjunction. Paired with Jupiter, "
            "it ensures that your energy is always directed toward the right path. It grants you a "
            "healthy life throughout your journey. However, you must be cautious, as this fiery "
            "energy can sometimes lead to unnecessary confrontations, particularly with females."
        ),
        "powerfulMercury": (
            "Mercury acts as the intellectual balancer for Venus. It ensures that your desires "
            "and passions do not overwhelm your logic, keeping you morally upright. This harmonious "
            "blend grants you a strong artistic inclination, allowing you to express complex "
            "emotions through intellectual mediums like literature and structured arts."
        ),
        "powerfulJupiter": (
            "Jupiter is the source of your wisdom and good virtues. It forms a friendly pair with Mars, "
            "elevating your ambitions to a righteous level. As noted in classic texts like Saravali, "
            "this placement makes you so highly respected that you are almost worshipped by others. "
            "You enjoy a reputable position in society built on trust and ethical conduct."
        ),
        "powerfulVenus": (
            "Venus ensures you are endowed with substantial wealth and affluence. Because it is "
            "balanced by Mercury, your love for luxury manifests as a refined aesthetic inclination. "
            "You are exceptionally fond of arts, literature, and music, building a beautiful "
            "and comfortable life that inspires those around you without falling into pure hedonism."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Virtuous Artist' personality. It is a highly balanced placement "
        "because it forms two friendly pairs: Mars & Jupiter (Ambition & Wisdom) and Mercury & Venus "
        "(Intellect & Aesthetics). You are morally upright and highly respected, often revered "
        "or worshipped for your good virtues. Your life is marked by substantial wealth, affluence, "
        "and a reputable social standing. With a deep fondness for arts, literature, and music, "
        "you channel your balanced energy into creative mastery. Furthermore, you are "
        "blessed with a healthy and vibrant life, allowing you to fully enjoy the "
        "beautiful world you build around yourself."
    ),
    "negativeDetail": (
        "Negative influences are mostly subdued due to the balanced nature of the friendly planetary "
        "pairs. However, the assertive energy of Mars combined with the sensual nature of Venus "
        "can occasionally create friction, manifesting as a tendency to get involved in "
        "confrontations with females. You must use your Jupiterian wisdom and Mercurial "
        "logic to defuse these situations before they affect your highly reputable "
        "social standing or your otherwise peaceful and healthy domestic life."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a beautifully balanced personality, combining ambition with aesthetic grace. You enjoy a healthy life and are respected for your moral uprightness. While you may face minor confrontations, your good virtues ensure you remain highly regarded."
        },
        {
            "house": "10th House",
            "detail": "Ensures a successful career where you hold a highly reputable position in society. You achieve substantial wealth through ethical practices and may find fame in fields related to arts, literature, or moral leadership."
        },
        {
            "house": "2nd House",
            "detail": "Powerhouse for substantial wealth and affluence. You use your intellect and artistic inclination to build financial security. Your speech is poetic and wise, though you must guard against verbal confrontations with female family members."
        },
        {
            "house": "5th House",
            "detail": "Identity is defined by a deep fondness for music, literature, and the arts. You are a creative genius whose balanced mind allows for both structured logic and beautiful expression. Your children will likely inherit your good virtues and healthy constitution."
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
    # Alphabetical order: Jupiter, Mars, Mercury, Venus
    col_name = "Jupiter_Mars_Mercury_Venus"
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
    print("[*] Seeding Jupiter_Mars_Mercury_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
