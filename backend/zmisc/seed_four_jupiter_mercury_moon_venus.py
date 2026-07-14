"""
Seed: Jupiter_Mercury_Moon_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mercury-Jupiter-Venus Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents an attractive, intellectual, and highly respected personality with ample wealth.",
        "Combines Wisdom (Jupiter), Logic (Mercury), Emotions (Moon), and Attraction (Venus) for social harmony.",
        "Natives are trusted confidants who enjoy progeny bliss but often face early separation from parents."
    ],
    "planetRoles": {
        "Moon": "Emotions, intuition, mother (early loss), foundling status, attractiveness",
        "Mercury": "Logic, intellect, learned nature, hearing, resource management, friendship",
        "Jupiter": "Wisdom, progeny bliss, wealth, growth opportunities, social respect",
        "Venus": "Attraction, beauty, luxury, absence of enemies, fortune, cordiality"
    },
    "effects": {
        "powerfulSun": [
            "Note: This conjunction lacks the Sun; its authority is provided by Jupiter's wisdom and Mercury's logic.",
            "Natives rely on their intellectual status to gain respect rather than raw power.",
            "Success comes through being a trusted confidant in the community."
        ],
        "powerfulMoon": [
            "Grants an exceptionally attractive personality that draws people naturally.",
            "Ensures deep emotional intuition, though the native may be a foundling or lose parents early.",
            "Provides the unique experience of having more than one mother figure in life."
        ],
        "powerfulMercury": [
            "Grants an intellectual and learned mind with a strong focus on resource optimization.",
            "Ensures friendly relations with all, resulting in almost no enemies or opposition.",
            "Provides a sharp mind, though it may be strike the native with hearing disorders at times."
        ],
        "powerfulJupiter": [
            "Grants ample wealth and consistent growth opportunities throughout the career.",
            "Ensures the bliss of progeny after marriage and a cordial relationship with children.",
            "Provides a respected status where the native becomes a trusted confidant of the community."
        ],
        "powerfulVenus": [
            "Grants a fortunate life filled with luxury and an attractive social aura.",
            "Ensures a life of cordiality and peace, where growth is achieved without significant conflict.",
            "Provides the aesthetic taste and financial gains required for an enviable lifestyle."
        ]
    },
    "nature": {
        "positive": [
            "Highly intellectual and learned individual who earns a lot of fame and respect.",
            "Blessed with ample wealth, fortune, and consistent growth opportunities.",
            "Trusted confidant who maintains friendly and cordial relations with all social circles.",
            "Enjoys the bliss of progeny and a happy, supportive relationship with their own children."
        ],
        "negative": [
            "Early loss of parents or being a foundling, leading to childhood emotional trauma.",
            "Potential for hearing disorders or sensitivities that require medical attention.",
            "Internal anguish arising from the lack of biological parental roots at a young age.",
            "Risk of being overly reliant on social approval as a trusted community figure."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Exceptionally attractive personality; intellectual bearing; success as a community leader."
        },
        {
            "house": "10th House",
            "effect": "Career success through wisdom and intellect; fame in education or advisory roles."
        },
        {
            "house": "5th House",
            "effect": "Bliss of progeny; creative intelligence; recognition for being learned and wise."
        },
        {
            "house": "4th House",
            "effect": "Presence of multiple mother figures; early domestic changes; wealth through inheritance or luck."
        }
    ],
    "keywords": ["moon", "mercury", "jupiter", "venus", "conjunction", "intellectual", "wealthy", "attractive", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A strong Moon grants you an exceptionally attractive personality. You possess a unique "
            "emotional aura that makes you a trusted confidant for your community. However, this "
            "placement often indicates that you were a foundling or lost your parents early, "
            "potentially resulting in having more than one mother figure in your life."
        ),
        "powerfulMercury": (
            "Mercury provides you with an intellectual and learned mind. You are sharp in your "
            "dealings and use your resourcefulness to maintain friendly relations with all. While "
            "you rarely face enemies, you must guard against potential hearing disorders that "
            "may strike you at different periods of your life."
        ),
        "powerfulJupiter": (
            "Jupiter acts as your source of fortune and wealth. It grants you consistent growth "
            "opportunities and ensures that you enjoy the bliss of progeny after marriage. Your "
            "relationship with your children is cordial, and your status as a learned person "
            "earns you a lot of fame and recognition."
        ),
        "powerfulVenus": (
            "Venus ensures you are blessed with an attractive and fortunate life. You possess a life "
            "filled with luxury and peace, where your growth is achieved through cordiality "
            "rather than conflict. You are loved by your community and maintain an "
            "enviable social position through your attractive and friendly nature."
        )
    },
    "positiveDetail": (
        "This conjunction creates an 'Attractive Intellectual' personality. You are someone who is "
        "exceptionally learned and intellectual, earning a lot of fame and respect in your community. "
        "Fortune blesses you with ample wealth and consistent growth opportunities. You maintain "
        "friendly relations with everyone, rarely facing enemies or opposition. As a trusted "
        "confidant, you are a pillar of your community. You enjoy the bliss of progeny and "
        "share a cordial relationship with your children. Your life is marked by "
        "intellectual authority and a fortunate, harmonious social standing that others "
        "find both attractive and inspiring."
    ),
    "negativeDetail": (
        "Negative influences manifest as early childhood loss or the trauma of being a foundling. "
        "The lack of biological parental roots can cause internal emotional anguish, even "
        "if you are raised by multiple mother figures. Hearing disorders can sometimes "
        "disrupt your life, and the pressure of being a trusted community figure "
        "can be overwhelming. Despite your high-status public life and wealth, the "
        "early childhood void remains a significant factor that you must manage "
        "through spiritual grounding and the support of your own blissful family."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses an exceptionally attractive personality and a learned bearing. You are known for your intellectual command and receive significant gains from growth opportunities. While you face early parental loss, your social popularity ensures a steady rise in status."
        },
        {
            "house": "10th House",
            "detail": "Ensures a successful career through wisdom and intellectual command. You rise to a position of fame by being a trusted confidant for senior authorities. Your reputation for being learned makes you a respected figure among peers."
        },
        {
            "house": "5th House",
            "detail": "Powerhouse for progeny bliss and creative intelligence. You possess a sharp intellect that you use to guide your children, with whom you share a cordial bond. Your fortune and growth opportunities provide a life of wealth."
        },
        {
            "house": "4th House",
            "detail": "Identity is defined by early domestic changes, often involving more than one mother figure. While you may have been a foundling, your ability to attract support from the community helps you build a stable and wealthy home life."
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
    # Alphabetical order: Jupiter, Mercury, Moon, Venus
    col_name = "Jupiter_Mercury_Moon_Venus"
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
    print("[*] Seeding Jupiter_Mercury_Moon_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
