"""
Seed: Jupiter_Mercury_Sun_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mercury-Jupiter-Venus Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a highly intelligent, wealthy, and respected personality with an enviable social and personal life.",
        "Combines Authority (Sun), Logic (Mercury), Wisdom (Jupiter), and Attraction (Venus) for balanced prosperity.",
        "Natives excel in business, leadership, and public administration, often enjoying a bountiful life through strategic partnerships."
    ],
    "planetRoles": {
        "Sun": "Authority, leadership, position of power, father, status",
        "Mercury": "Logic, resource management, sharp mind, business acumen, communication",
        "Jupiter": "Wisdom, vast knowledge, social fame, respect, sound judgment",
        "Venus": "Luxury, comfort, blissful family life, gains through marriage, attraction"
    },
    "effects": {
        "powerfulSun": [
            "Grants strong leadership qualities that help attain positions of significant power and authority.",
            "Ensures a respected standing in society with the support of eminent individuals.",
            "Provides a determined approach toward career goals and long-term professional success."
        ],
        "powerfulMercury": [
            "Grants a sharp mind and the ability to use all available resources wisely and effectively.",
            "Ensures success in personal business ventures with multiple innovative and profitable ideas.",
            "Provides the clarity needed to fulfill complex goals without any significant difficulty."
        ],
        "powerfulJupiter": [
            "Grants vast knowledge and a reputation for wisdom and sound judgment in the social sphere.",
            "Ensures the native is famous and respected among their social and professional peers.",
            "Provides a humanitarian outlook that attracts positive growth and spiritual fulfillment."
        ],
        "powerfulVenus": [
            "Grants a comfortable and luxurious life with a focus on blissful domestic and family harmony.",
            "Ensures financial gains through the opposite sex or through a successful and bountiful marriage.",
            "Provides an enviable personal life that mirrors the native's high public status and fame."
        ]
    },
    "nature": {
        "positive": [
            "Enviable and bountiful personal life with strong financial and domestic stability.",
            "Highly respected in society with an expansive and influential social circle.",
            "Sharp intelligence and the wisdom to optimize resources for maximum success.",
            "Determined leader who fulfills goals with ease and enjoys the finest luxuries."
        ],
        "negative": [
            "Potential for over-attachment to social image or luxurious indulgence.",
            "Internal pressure to maintain a perfect public and private life at all times.",
            "Risk of neglecting raw emotional needs in pursuit of resource optimization.",
            "Anxiety related to maintaining a high-status lifestyle if resources are mismanaged."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong determined personality; famous social bearing; success in authoritative business roles."
        },
        {
            "house": "10th House",
            "effect": "High position of power and authority; career success through wisdom and sharp logic."
        },
        {
            "house": "7th House",
            "effect": "Blissful marriage with significant financial gains through the spouse; success in partnerships."
        },
        {
            "house": "2nd House",
            "effect": "Stable wealth and luxury; cordial family relations and wise management of inherited assets."
        }
    ],
    "keywords": ["sun", "mercury", "jupiter", "venus", "conjunction", "intelligent", "wealthy", "respected", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun grants you high leadership qualities and the ability to attain positions of "
            "power and authority. You possess a determined approach towards your life and career, "
            "ensuring that your professional standing is respected and influential in your "
            "chosen field of leadership."
        ),
        "powerfulMercury": (
            "Mercury provides you with a sharp mind and the ability to use your resources wisely. You "
            "attain your goals without difficulty, excelling in business or communication-related "
            "sectors. Your logic is your greatest tool for ensuring that your career and "
            "financial decisions are always optimized for success."
        ),
        "powerfulJupiter": (
            "Jupiter acts as your source of vast knowledge and social fame. You are highly respected "
            "in society and among your peers for your wise approach to life. It ensures that your "
            "public life is as bountiful as your private life, attracting success in education, "
            "law, or high-level administration."
        ),
        "powerfulVenus": (
            "Venus ensures a comfortable and luxurious life with significant financial gains through "
            "the opposite sex or marriage. Your family life is blissful, and your personal "
            "surroundings reflect your high status. You enjoy an enviable life where comfort "
            "and harmony are prioritized in all your relationships."
        )
    },
    "positiveDetail": (
        "This conjunction creates an 'Enviable Intellectual' personality. You possess a sharp mind "
        "and a lot of knowledge, which you use to build a comfortable and luxurious life. You "
        "know how to use your resources wisely, fulfilling your goals with determination and "
        "ease. Respected in society and famous among your peers, you hold strong leadership "
        "qualities that lead to positions of power. Your financial position is strong, "
        "often bolstered by your own business or through a bountiful marriage. Your "
        "personal life is blissful and enviable, mirroring the high-status public life "
        "you maintain with grace and wisdom."
    ),
    "negativeDetail": (
        "Negative influences manifest as a pressure to maintain a perfect public image and the "
        "potential for over-indulgence in comfort. Affliction can cause internal anxiety "
        "if resource optimization becomes more important than emotional connection. While "
        "the combination is generally bountiful, you must ensure that your pursuit of "
        "luxury doesn't lead to a superficial existence. Staying grounded in your "
        "vast knowledge and using your wisdom to lead with empathy will prevent the "
        "stress that comes from purely material or status-driven goals."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a strong determined personality and a royal social aura. You are known for your sharp mind and receive significant gains from authoritative roles and personal business ventures. Your social fame provides a steady rise in status."
        },
        {
            "house": "10th House",
            "detail": "Ensures a successful career in high-level administration or business. You rise to a position of power by optimizing your knowledge and resources. Your reputation for wisdom makes you a respected leader among senior authorities and peers."
        },
        {
            "house": "7th House",
            "detail": "Powerhouse for marital bliss and financial gains through the spouse. You find success in business partnerships that involve the opposite sex, and your personal life is viewed as enviably bountiful by your entire social circle."
        },
        {
            "house": "2nd House",
            "detail": "Identity is defined by stable wealth and a luxurious lifestyle. You manage your family assets with wisdom and sharp logic, ensuring that your domestic harmony and financial position remain strong across generations."
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
    # Alphabetical order: Jupiter, Mercury, Sun, Venus
    col_name = "Jupiter_Mercury_Sun_Venus"
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
    print("[*] Seeding Jupiter_Mercury_Sun_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
