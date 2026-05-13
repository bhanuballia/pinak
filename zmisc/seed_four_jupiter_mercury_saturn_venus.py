"""
Seed: Jupiter_Mercury_Saturn_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mercury-Jupiter-Venus-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a highly intellectual, obedient, and disciplined personality with an extraordinary memory.",
        "Combines Logic (Mercury), Wisdom (Jupiter), Attraction (Venus), and Hardship/Structure (Saturn).",
        "Natives excel in astrology, politics, and agriculture, and are sociably admirable despite a highly candid nature."
    ],
    "planetRoles": {
        "Mercury": "Logic, sharp mind, extraordinary memory, communication, candid nature",
        "Jupiter": "Wisdom, ancient scriptures, astrology, politics, knowledge",
        "Venus": "Attraction, aesthetic pleasures, sociability, arts, charm",
        "Saturn": "Discipline, obedience, agriculture, structure, grounding"
    },
    "effects": {
        "powerfulSun": [
            "Note: This conjunction lacks the Sun; its authority is provided by Jupiter's wisdom and Saturn's discipline.",
            "Natives rely on their intellect and specialized knowledge to gain status rather than raw power.",
            "Success comes through political maneuvering or mastery of ancient sciences."
        ],
        "powerfulMercury": [
            "Grants a higher-than-average intellect and an incredibly sharp mind.",
            "Ensures an extraordinary memory that helps the native excel in complex subjects.",
            "Provides a highly candid communication style, saying what is in the heart without a second thought."
        ],
        "powerfulJupiter": [
            "Grants a profound inclination toward ancient scriptures and traditional wisdom.",
            "Ensures the native becomes highly well-versed in specialized fields such as astrology or politics.",
            "Provides the philosophical depth that balances the materialistic tendencies of Venus and Saturn."
        ],
        "powerfulVenus": [
            "Grants a sociably admirable personality that naturally attracts friends and supporters.",
            "Ensures the native is heavily involved in and deeply appreciates aesthetic pleasures.",
            "Provides a refined charm that softens the native's extremely candid speech."
        ],
        "powerfulSaturn": [
            "Grants an obedient and highly disciplined nature, allowing the native to focus on long-term goals.",
            "Ensures the native may gain significant benefits and wealth from agriculture or land management.",
            "Provides the practical structure necessary to turn intellectual pursuits into tangible success."
        ]
    },
    "nature": {
        "positive": [
            "Extraordinary memory and higher-than-average intellect that leads to academic and professional success.",
            "Highly obedient and disciplined individual who respects structure and tradition.",
            "Sociably admirable and deeply involved in the finer, aesthetic pleasures of life.",
            "Adept in ancient scriptures, excelling as a scholar, astrologer, or political advisor."
        ],
        "negative": [
            "Extremely candid nature; speaking without a second thought can occasionally offend sensitive individuals.",
            "Internal conflict between Jupiter's expansive wisdom and the limiting structure of Saturn.",
            "May struggle to balance aesthetic indulgence (Venus) with strict obedience and discipline (Saturn).",
            "The combination of three friendly planets against Jupiter can sometimes suppress pure spiritual growth in favor of logic."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Sharp-minded and attractive personality; disciplined approach to life; highly candid speech."
        },
        {
            "house": "4th House",
            "effect": "Benefit from agriculture and real estate; home filled with ancient scriptures and aesthetic beauty."
        },
        {
            "house": "9th House",
            "effect": "Exceptional mastery of astrology and philosophy; high political intellect; strict obedience to mentors."
        },
        {
            "house": "10th House",
            "effect": "Career success in politics or advisory roles; sociably admirable public image; disciplined work ethic."
        }
    ],
    "keywords": ["mercury", "jupiter", "venus", "saturn", "conjunction", "intellectual", "astrology", "disciplined", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMercury": (
            "Mercury provides you with a sharp mind and an extraordinary memory. This higher-than-average "
            "intellect allows you to process and retain complex information easily. However, this same "
            "influence makes you extremely candid. You tend to say exactly what is in your heart without "
            "giving it a second thought, which can sometimes startle those who expect diplomacy."
        ),
        "powerfulJupiter": (
            "Jupiter is the source of your deep wisdom. Even though it is inimical to Mercury and Venus, "
            "it blends with them to create a profound intellect. It makes you adept in ancient "
            "scriptures and ensures you become well-versed in complex fields such as astrology "
            "or politics, where your wisdom can be used to guide others."
        ),
        "powerfulVenus": (
            "Venus ensures that despite your disciplined and intellectual nature, you are sociably "
            "admirable. You naturally attract a wide circle of friends and supporters. Furthermore, "
            "you are deeply involved in aesthetic pleasures, enjoying the beauty of arts, culture, "
            "and literature, which provides a necessary balance to your serious studies."
        ),
        "powerfulSaturn": (
            "Saturn acts as the ultimate grounding force. It makes you quite obedient and highly disciplined "
            "in nature, ensuring that your vast intellect is put to practical use. Additionally, Saturn's "
            "earthy influence indicates that you may receive substantial benefits and financial gains "
            "from agriculture, farming, or managing large estates."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Disciplined Scholar' personality. You are blessed with a "
        "higher-than-average intellect, possessing an extraordinary memory and a very sharp mind. "
        "You are highly obedient and disciplined, which allows you to master complex subjects "
        "like ancient scriptures, astrology, and politics. Despite your serious pursuits, "
        "you are sociably admirable and heavily involved in aesthetic pleasures. You "
        "also possess a practical side that may bring you success in agriculture. Your "
        "life is a beautiful blend of intellectual depth, structured discipline, "
        "and social charm."
    ),
    "negativeDetail": (
        "The negative influences of this conjunction are quite mild, mostly revolving around your "
        "communication style. Because your mind operates so quickly and clearly, you have a "
        "tendency to be extremely candid. You often say what is in your heart without giving "
        "it a second thought, which can inadvertently cause friction or offend people who "
        "are not used to such direct honesty. Balancing your sharp intellect with "
        "emotional tact is your primary lifelong challenge."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a sharp-minded and sociably admirable personality. You are highly disciplined and possess an extraordinary memory. While you are respected for your intellect, your candid speech requires you to learn tact to maintain your broad social appeal."
        },
        {
            "house": "4th House",
            "detail": "Identity is defined by a strong connection to land and tradition. You are likely to benefit significantly from agriculture and real estate. Your home is a place of discipline, filled with aesthetic pleasures and ancient scriptures."
        },
        {
            "house": "9th House",
            "detail": "Powerhouse for higher learning and philosophy. You are adept in ancient scriptures and likely a master of astrology. Your obedience to traditional wisdom and disciplined approach to study make you a revered scholar or political advisor."
        },
        {
            "house": "10th House",
            "detail": "Ensures a highly successful career in politics, administration, or advisory roles. You rise to a position of authority through your sharp mind and extraordinary memory. Your disciplined nature earns you the respect of both subordinates and superiors."
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
    # Alphabetical order: Jupiter, Mercury, Saturn, Venus
    col_name = "Jupiter_Mercury_Saturn_Venus"
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
    print("[*] Seeding Jupiter_Mercury_Saturn_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
