"""
Seed: Jupiter_Mercury_Saturn_Sun collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mercury-Jupiter-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents an intellectual, learned, and highly communicative personality who is widely respected.",
        "Combines Authority (Sun), Logic (Mercury), Wisdom (Jupiter), and Discipline (Saturn) for social fame.",
        "Natives excel in intellectual discourse and travel but may struggle with a harsh or argumentative demeanor."
    ],
    "planetRoles": {
        "Sun": "Authority, status, social fame, ego, father",
        "Mercury": "Logic, communication (endless talking), intellect, learning, travel logistics",
        "Jupiter": "Wisdom, vast knowledge, social respect, fruitful journeys, morality",
        "Saturn": "Discipline, harsh demeanor, separation, lack of enthusiasm, argumentative nature"
    },
    "effects": {
        "powerfulSun": [
            "Grants social fame and a highly respected position within the social structure.",
            "Ensures an authoritative presence that is recognized in intellectual and professional circles.",
            "Provides the status required to make journeys and travel fruitful and productive."
        ],
        "powerfulMercury": [
            "Grants an intellectual and learned mind with a tendency to communicate or talk endlessly.",
            "Ensures strong communicative skills, though they may lean toward being confrontational.",
            "Provides the logic needed to manage complex intellectual tasks with relative ease."
        ],
        "powerfulJupiter": [
            "Grants vast wisdom and a reputation for being a deeply learned and respected individual.",
            "Ensures that all journeys and travels turn out to be highly fruitful and productive.",
            "Provides a humanitarian outlook that earns the native a respected rank in their community."
        ],
        "powerfulSaturn": [
            "Grants a serious and disciplined approach, though it may result in a lack of enthusiasm.",
            "Ensures endurance during times of separation from near and dear ones.",
            "Provides the logic to win arguments, though it may manifest as arrogance or a harsh demeanor."
        ]
    },
    "nature": {
        "positive": [
            "Intellectual and learned individual who is widely famous and respected in society.",
            "Fruitful and productive travel experiences that lead to growth and success.",
            "Strong communication suit that allows for the mastery of multiple languages and skills.",
            "Wise strategist who enjoys high status through intellectual command and logic."
        ],
        "negative": [
            "Argumentative and arrogant personality that can be harsh or confrontational to others.",
            "Lack of passion or enthusiasm in actions, leading to a detached or cold public image.",
            "Separation from near and dear ones causing internal mental anguish or unrest.",
            "Harsh demeanor that turns their strong communicative skills into a social disadvantage."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong intellectual personality; famous social bearing; success in travel-related careers."
        },
        {
            "house": "10th House",
            "effect": "Respected rank in administrative or intellectual fields; success through wise logic."
        },
        {
            "house": "9th House",
            "effect": "Fruitful journeys and deep interest in scriptures; authority through philosophical depth."
        },
        {
            "house": "3rd House",
            "effect": "Endless talking and communicative mastery; potential for argumentative clashes with peers."
        }
    ],
    "keywords": ["sun", "mercury", "jupiter", "saturn", "conjunction", "intellectual", "famous", "travel", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun grants you social fame and a highly respected position in society. You possess "
            "an authoritative presence that ensures your journeys are fruitful and your voice is "
            "heard in the highest circles. Your status is built on your intellectual capacity and "
            "the social respect you command through your achievements."
        ),
        "powerfulMercury": (
            "Mercury provides you with an intellectual and learned mind. While you have a tendency to "
            "talk endlessly, your communication is your strongest suit. However, you must guard "
            "against a confrontational approach, as your sharp logic can sometimes turn into a "
            "harsh demeanor that alienates those who cannot keep up with your mental speed."
        ),
        "powerfulJupiter": (
            "Jupiter acts as your source of vast wisdom, ensuring that your travels and journeys turn out "
            "to be productive. You are seen as a deeply learned individual whose knowledge is "
            "respected by all. Your wise guidance attracts positive growth, making you a "
            "trusted advisor in intellectual and administrative matters."
        ),
        "powerfulSaturn": (
            "Saturn is the disciplinarian that can make you an argumentative person. It grants you the "
            "endurance for long-term study but often takes away the passion and enthusiasm in "
            "your actions. You may endure separation from loved ones, using your harsh and "
            "serious nature to cope with the distances that your intellectual pursuits create."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Learned Intellectual' personality. You are someone who is famous "
        "and highly respected in your social structure for your vast knowledge and communicative "
        "prowess. Your journeys and travels are almost always fruitful, leading to productive "
        "breakthroughs in your career or personal growth. Your strong suit is communication, "
        "allowing you to interpret and present complex ideas with an authoritative clarity "
        "that earns you a respected rank. You build a legacy through your sharp mind "
        " and the wise use of your resources, ensuring that your public life is "
        "marked by intellectual command and social stability."
    ),
    "negativeDetail": (
        "Negative influences manifest as an arrogant and argumentative personality. Your harsh "
        "and confrontational demeanor can turn your greatest strength—communication—into "
        "a social disadvantage. There is a notable lack of passion and enthusiasm in your "
        "actions, making you appear cold or detached. You may face significant mental "
        "unrest due to separation from near and dear ones, and your arrogance may "
        "blind you to the emotional needs of others. Balancing your intellectual "
        "rigor with empathy is essential to maintain the harmony required for "
        "true success and peace."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native is intellectual and possesses a royal social bearing. You are known for your endless talking and sharp decision-making. Your sense of responsibility and success in travel guarantee a high rank in intellectual or administrative sectors."
        },
        {
            "house": "10th House",
            "detail": "Ensures a successful career in high-level intellectual or administrative roles. You rise to a position of power through wise logic and productive travels. While your harsh demeanor may cause friction, your reputation for wisdom makes you a respected leader."
        },
        {
            "house": "9th House",
            "detail": "Powerhouse for fruitful journeys and philosophical growth. You excel in fields that require deep study and travel, using your learned nature to influence others. Your status grows through your command over scriptures and traditional wisdom."
        },
        {
            "house": "3rd House",
            "detail": "Identity is centered on communication and logic. You possess the ability to talk endlessly about complex subjects, making you a natural for teaching or advisory roles. However, your argumentative nature may cause separation from siblings or peers."
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
    # Alphabetical order: Jupiter, Mercury, Saturn, Sun
    col_name = "Jupiter_Mercury_Saturn_Sun"
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
    print("[*] Seeding Jupiter_Mercury_Saturn_Sun four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
