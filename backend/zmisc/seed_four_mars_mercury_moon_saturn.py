"""
Seed: Mars_Mercury_Moon_Saturn collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mars-Mercury-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a fearless and mentally sharp personality who marches ahead in life with high intelligence.",
        "Combines Emotions (Moon), Drive (Mars), Logic (Mercury), and Hardship (Saturn) for social resilience.",
        "Natives are sociable and fertile but often face early childhood trauma, including the loss of parents or adoption."
    ],
    "planetRoles": {
        "Moon": "Emotions, mental sharpness, parents (vulnerable), mother, sociability",
        "Mars": "Drive, fearlessness, courage, confidence, raw energy",
        "Mercury": "Logic, intelligence, intellect, friends, social circle, communication",
        "Saturn": "Hardship, discipline, adoption, unfamiliar heritage, defame, children, multiple marriages"
    },
    "effects": {
        "powerfulSun": [
            "Note: This conjunction lacks the Sun; its authority is replaced by Mars' raw drive and Mercury's logic.",
            "Natives rely on their own fearless efforts to gain status, as parental support is often missing.",
            "Success comes through intellectual command and social networking."
        ],
        "powerfulMoon": [
            "Grants exceptional mental sharpness and a sociable nature that attracts many friends.",
            "Ensures the native can navigate complex social dynamics with ease, despite internal emotional scars.",
            "Provides the resilience to handle early childhood changes, though it may involve adoption."
        ],
        "powerfulMars": [
            "Grants a fearless and confident approach to life, ensuring the native always marches forward.",
            "Ensures the courage to build a legacy even when starting from an unfamiliar family background.",
            "Provides the drive to overcome social humiliation or defame through persistent action."
        ],
        "powerfulMercury": [
            "Grants a high level of intellect and intelligence that helps the native outsmart obstacles.",
            "Ensures a broad social circle where the native finds the 'family' they may have lost early on.",
            "Provides the analytical mind needed to manage multiple marriages and a large number of children."
        ],
        "powerfulSaturn": [
            "Grants the discipline to raise a large family, often resulting in having many children.",
            "Ensures endurance during times of public humiliation or when dealing with unfamiliar heritage.",
            "Provides the structure for a second or third marriage that may bring more stability than the first."
        ]
    },
    "nature": {
        "positive": [
            "Fearless and confident leader who uses their high intellect to succeed against all odds.",
            "Highly sociable personality with a large circle of supportive friends and many children.",
            "Mentally sharp individual who can reinvent themselves regardless of their family background.",
            "Resilient survivor who transforms early hardships into a story of intellectual and social triumph."
        ],
        "negative": [
            "Early loss of parents or adoption, leading to a life in an unfamiliar family or heritage.",
            "Risk of defame and humiliation in public or social circles during certain periods.",
            "Emotional instability arising from childhood trauma and multiple marital unions.",
            "Feeling of being an 'outsider' even when surrounded by many friends and family members."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong determined personality; fearless social bearing; success despite early hardships."
        },
        {
            "house": "10th House",
            "effect": "Status through intellectual command; overcoming defame through professional excellence."
        },
        {
            "house": "5th House",
            "effect": "Large number of children; sharp intelligence; creative success through social networks."
        },
        {
            "house": "4th House",
            "effect": "Adoption or unfamiliar home environment; emotional detachment from biological roots."
        }
    ],
    "keywords": ["moon", "mars", "mercury", "saturn", "conjunction", "fearless", "intelligent", "adoption", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A strong Moon grants you exceptional mental sharpness and a highly sociable nature. You possess "
            "the ability to attract many friends who keep you company throughout your life. However, "
            "this placement often indicates an early loss of parents, requiring you to find "
            "emotional nourishment through your social circle and adopted family structures."
        ),
        "powerfulMars": (
            "Mars provides you with a fearless and confident approach. You march ahead in life with "
            "unmatched courage, refusing to let childhood trauma or social humiliation stop you. "
            "Your drive is your greatest asset, allowing you to build a successful life even "
            "if you start from a background of unfamiliar heritage."
        ),
        "powerfulMercury": (
            "Mercury grants you a high level of intellect and intelligence. You are sharp in your "
            "dealings and use your analytical mind to navigate the complexities of having "
            "multiple marriages and a large family. Your logic helps you outsmart those "
            "who might attempt to humiliate you, ensuring your intellectual status remains high."
        ),
        "powerfulSaturn": (
            "Saturn acts as the source of your resilience during public defame. It grants you the "
            "discipline to raise a large number of children and the endurance to manage "
            "multiple marriages. While it brings the hardship of early parental loss or "
            "adoption, it also provides the structure for a long life defined by "
            "perseverance and social survival."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Resilient Intellectual' personality. You are someone who is "
        "fearless and mentally sharp, using your high level of intelligence to march ahead in "
        "life with confidence. You are naturally sociable and enjoy the company of many "
        "friends. Fertile and family-oriented, you often have a large number of children. "
        "Your ability to succeed despite starting from an unfamiliar heritage or facing "
        "early childhood loss makes you a symbol of survival. You build a legacy "
        "through your sharp mind and social connections, ensuring that your public "
        "life is marked by intellectual authority and a large, supportive family network."
    ),
    "negativeDetail": (
        "Negative influences manifest as early childhood trauma, specifically the loss of parents or "
        "adoption into an unfamiliar family. You may suffer from public defame or "
        "humiliation, requiring significant mental strength to overcome. Multiple "
        "marriages may bring emotional instability before a final balance is found. "
        "The feeling of being disconnected from your roots can cause internal "
        "anguish, and you must guard against the bitterness that can arise "
        "from the hardships that Saturn and Mars bring to your early "
        "domestic and social life."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a fearless determined personality and a sharp mind. You are known for your sociability and receive significant support from your large circle of friends. While you face early family challenges, your intellectual confidence ensures a steady rise in status."
        },
        {
            "house": "10th House",
            "detail": "Ensures a successful career through sheer persistence and intellectual command. You rise to a position of status by overcoming any public defame or initial social hurdles. Your reputation for being a fearless finisher makes you a respected figure among peers."
        },
        {
            "house": "5th House",
            "detail": "Powerhouse for a large family and many children. You possess a sharp intelligence that you use to guide your offspring. Your social networks provide a steady stream of creative and professional opportunities that help you build your wealth."
        },
        {
            "house": "4th House",
            "detail": "Identity is defined by an unfamiliar home environment or adoption. While you may feel a lack of connection to your biological heritage, your ability to build a new 'chosen family' helps you find the emotional stability that was missing in your early years."
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
    # Alphabetical order: Mars, Mercury, Moon, Saturn
    col_name = "Mars_Mercury_Moon_Saturn"
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
    print("[*] Seeding Mars_Mercury_Moon_Saturn four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
