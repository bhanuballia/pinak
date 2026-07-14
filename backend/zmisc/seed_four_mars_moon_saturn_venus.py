"""
Seed: Mars_Moon_Saturn_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mars-Venus-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a personality blessed with significant wealth and early comfort but prone to emotional volatility.",
        "Combines Drive (Mars), Emotions (Moon), Discipline (Saturn), and Attraction (Venus) for material success.",
        "Natives are courageous and daring, though they often face later-life hurdles and domestic miseries."
    ],
    "planetRoles": {
        "Moon": "Emotions, mother, early life comfort, emotional storms, sensitivity",
        "Mars": "Drive, courage, daring nature, unique physical traits (reptilian eyes), raw power",
        "Venus": "Wealth, initial luxury, comfort, spouse (potentially immoral), attraction",
        "Saturn": "Later-life hurdles, miseries, discipline, hardship, structural endurance"
    },
    "effects": {
        "powerfulSun": [
            "Note: This conjunction lacks the Sun; its authority is provided by Mars and the stability of Saturn.",
            "Natives rely on their own daring efforts to build wealth rather than inherited status.",
            "Success comes through courageous actions in competitive environments."
        ],
        "powerfulMoon": [
            "Grants a life that starts with significant comfort and emotional support in the first few years.",
            "Ensures deep emotional sensitivity, though it can lead the native to get caught in storms of feelings.",
            "Provides the intuition needed to navigate initial wealth, though emotional storms may cause later unrest."
        ],
        "powerfulMars": [
            "Grants a courageous and daring spirit to fight the challenges of life head-on.",
            "Ensures the native possesses unique physical traits, such as reptilian or snake-like eyes.",
            "Provides the raw power required to acquire property and wealth through sheer persistence."
        ],
        "powerfulVenus": [
            "Grants a lot of wealth and affluence, especially during the early stages of professional life.",
            "Ensures a life of initial luxury and aesthetic comfort, attracting financial gains easily.",
            "Provides a passionate approach to life, though it may result in an immoral or challenging spouse."
        ],
        "powerfulSaturn": [
            "Grants the structural endurance to survive the hurdles and miseries of the later part of life.",
            "Ensures discipline during difficult times, though it may feel like a life of constant struggle.",
            "Provides the lessons of hardship that eventually ground the native's initial wealth and ego."
        ]
    },
    "nature": {
        "positive": [
            "Wealthy individual who enjoys a life of initial comfort and luxury through creative assets.",
            "Courageous and daring spirit that allows the native to overcome major life hurdles.",
            "Emotional depth that provides a unique understanding of human feelings and artistic expression.",
            "Highly persistent survivor who builds wealth through courageous and direct actions."
        ],
        "negative": [
            "Later part of life is often full of miseries, hurdles, and structural difficulties.",
            "Emotional storms and extreme sensitivity that cloud judgment during critical periods.",
            "Potential for an immoral spouse or complex, unhappy domestic relationships.",
            "Physical oddities, such as reptilian eyes, that may cause social isolation or unique perceptions."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Courageous personality; unique reptilian eyes; early comfort followed by later struggle."
        },
        {
            "house": "2nd House",
            "effect": "Abundant wealth and initial family support; emotional storms over financial management."
        },
        {
            "house": "7th House",
            "effect": "Initial comfort in marriage followed by miseries; potential for a challenging or immoral spouse."
        },
        {
            "house": "12th House",
            "effect": "Later-life miseries and spiritual hurdles; wealth through isolated or daring foreign ventures."
        }
    ],
    "keywords": ["moon", "mars", "venus", "saturn", "conjunction", "wealth", "courageous", "emotional storms", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A strong Moon grants you early years filled with comfort and emotional support. However, you "
            "are prone to extreme emotional volatility, often getting caught up in a storm of feelings "
            "that can cloud your otherwise sharp intuition. You value emotional depth but must "
            "guard against the later-life miseries that this sensitivity can attract."
        ),
        "powerfulMars": (
            "Mars provides you with a courageous and daring soul. You possess unique physical traits, "
            "such as reptilian or snake-like eyes, and you are fearless when fighting life's "
            "challenges head-on. This drive ensures you acquire significant wealth, even if the "
            "path is marked by daring and unconventional decisions."
        ),
        "powerfulVenus": (
            "Venus ensures you are awarded a lot of wealth and enjoy initial luxury in your life. You possess "
            "a natural taste for the finer things and attract financial abundance with ease. "
            "However, this placement can also indicate an immoral or challenging spouse, "
            "potentially leading to domestic miseries during the later stages of your journey."
        ),
        "powerfulSaturn": (
            "Saturn is the harbinger of later-life hurdles in this conjunction. It grants you the discipline "
            "to survive miseries, though it ensures that your later years are more difficult than "
            "your initial comfortable phase. It provides the grounding influence that forces you "
            "to build a life of structural endurance rather than purely emotional luxury."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Courageous Wealthy' personality. You are someone who is awarded "
        "significant wealth and enjoys the first few years of life in great comfort and luxury. "
        "Possessing a courageous and daring soul, you fight life's challenges head-on with "
        "unmatched persistence. Your emotional depth provides you with a unique perspective "
        "on life, and you build a legacy of material success through your daring actions. "
        "While hurdles are indicated later on, your initial foundation of wealth and your "
        "daring spirit provide you with the tools to endure and eventually conquer the "
        "difficulties that the later part of your life may present."
    ),
    "negativeDetail": (
        "Negative influences manifest as a later life full of miseries and emotional hurdles. You may "
        "get caught in intense storms of feelings that lead to poor decision-making. Domestic "
        "life can be challenging, with a potential for an immoral or difficult spouse. "
        "Physical traits like reptilian eyes may draw unusual attention or isolation. The "
        "contrast between your initial comfortable years and your later-life struggles "
        "can cause significant mental unrest, requiring you to find internal "
        "peace and spiritual grounding to balance the material and emotional "
        "cycles of your life."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a courageous determined personality and unique physical features like reptilian eyes. You enjoy early fame and comfort, but your later life requires structural endurance to manage the hurdles that Saturn and Mars bring to your doorstep."
        },
        {
            "house": "2nd House",
            "detail": "Ensures high wealth and initial luxury through family support. However, your emotional storms can lead to financial mismanagement or miseries in the family sphere later in life. You must use your daring drive to protect your assets."
        },
        {
            "house": "7th House",
            "detail": "Powerhouse for wealth through partnership, though it indicates domestic miseries. You may enjoy early marital comfort, but the spouse's immoral tendencies or your own emotional storms can lead to a challenging domestic environment later."
        },
        {
            "house": "10th House",
            "detail": "Identity is defined by a courageous and daring professional rise. You acquire significant wealth through direct and brave decisions, but you must guard against the later-life hurdles that can affect your status and public reputation."
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
    # Alphabetical order: Mars, Moon, Saturn, Venus
    col_name = "Mars_Moon_Saturn_Venus"
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
    print("[*] Seeding Mars_Moon_Saturn_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
