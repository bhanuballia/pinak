"""
Seed: Mars_Mercury_Moon_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mars-Mercury-Venus Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents an astute, intelligent, and compassionate personality with a profound penchant for the arts and occult.",
        "Combines Emotions (Moon), Drive (Mars), Logic (Mercury), and Attraction (Venus) for wealth and creative power.",
        "Natives are mentally stable and courageous but may struggle with sensuality and argumentative tendencies."
    ],
    "planetRoles": {
        "Moon": "Emotions, mental stability, compassion, astrology inclination, mother, occult interest",
        "Mars": "Drive, fearlessness, courage, aggression, skill in arts, raw energy",
        "Mercury": "Logic, intelligence, astuteness, communication, hearing, analytical mind",
        "Venus": "Attraction, arts, wealth, generosity, sensuality, luxury, marriage"
    },
    "effects": {
        "powerfulSun": [
            "Note: This conjunction lacks the Sun; its authority is provided by Mars and the wisdom of Mercury/Moon.",
            "Natives rely on their fearless actions and astute logic to gain social standing.",
            "Success comes through artistic mastery and the command of occult subjects."
        ],
        "powerfulMoon": [
            "Grants deep mental stability and a sharp, compassionate mind that understands human suffering.",
            "Ensures an inclination toward astrology and occult areas of study through emotional intuition.",
            "Provides the mental clarity required to manage large-scale wealth and generous donations."
        ],
        "powerfulMars": [
            "Grants fearlessness and courage in all actions, ensuring the native never backs down from a challenge.",
            "Ensures skill in many arts, providing the energy required to master complex creative techniques.",
            "Provides a bold personality that is respected for its directness, though it can turn hostile if afflicted."
        ],
        "powerfulMercury": [
            "Grants an astute and intelligent approach to life's challenges, optimizing every resource.",
            "Ensures success in intellectual and artistic fields through sharp communication and logic.",
            "Provides the ability to master multiple crafts, though it may be linked to hearing sensitivity."
        ],
        "powerfulVenus": [
            "Grants a penchant for the arts and ensures the native is blessed with abundant wealth and generosity.",
            "Ensures an attractive social aura that values luxury, aesthetics, and high-quality lifestyles.",
            "Provides a sensuous personality that enjoys the finer things in life, though it may lead to multiple marriages."
        ]
    },
    "nature": {
        "positive": [
            "Astute and intelligent leader blessed with both great wealth and an equal level of generosity.",
            "Mentally stable and courageous individual whose actions are backed by fearless determination.",
            "Highly skilled in multiple arts with a strong inclination toward astrology and occult studies.",
            "Compassionate being who uses their sharp mind to improve the lives of those in their social circle."
        ],
        "negative": [
            "Overly sensuous nature leading to multiple marriages or attraction to immoral partners.",
            "Argumentative and wicked tendencies that can result in hostility toward even loved ones.",
            "Potential for hearing disorders or mental unrest if the planetary energy is not grounded.",
            "Struggle to enjoy a happy and harmonious relationship with children."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong artistic personality; mentally stable bearing; success in wealth and occult studies."
        },
        {
            "house": "10th House",
            "effect": "Career success through creative intelligence; wealth in arts or advisory sectors; status through generosity."
        },
        {
            "house": "7th House",
            "effect": "Multiple marriages; complex domestic dynamics; success in artistic partnerships."
        },
        {
            "house": "5th House",
            "effect": "Exceptional talent in many arts; deep interest in astrology; challenges in progeny relationships."
        }
    ],
    "keywords": ["moon", "mars", "mercury", "venus", "conjunction", "astute", "artistic", "compassionate", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A strong Moon grants you exceptional mental stability and a sharp mind. You possess a "
            "naturally compassionate heart and a deep inclination toward the occult and astrology. "
            "Your intuition helps you navigate the complexities of life with ease, ensuring that "
            "your actions are always guided by a wise and empathetic understanding of others."
        ),
        "powerfulMars": (
            "Mars provides you with the fearlessness and courage to pursue your artistic passions. You "
            "are skilled at many crafts and use your raw energy to build a legacy of success. While "
            "your directness is respected, you must be careful not to let your courage turn into "
            "hostility, especially when dealing with those you hold dear in your personal life."
        ),
        "powerfulMercury": (
            "Mercury grants you an astute and intelligent mind. You excel in intellectual discourse and "
            "master multiple arts through sharp logic and analytical thinking. However, this "
            "placement can sometimes be linked to hearing sensitivity or disorders, requiring "
            "you to maintain a balanced and healthy lifestyle to protect your sensory well-being."
        ),
        "powerfulVenus": (
            "Venus ensures you are blessed with a life of wealth and generosity. You have a profound "
            "penchant for art and are likely skilled in many creative fields yourself. While you "
            "enjoy a luxurious and sensuous lifestyle, you must guard against the tendency toward "
            "immoral associations or the instability that can come from multiple marital unions."
        )
    },
    "positiveDetail": (
        "This conjunction creates an 'Astute Artistic' personality. You are someone who is mentally "
        "stable, intelligent, and highly compassionate. Blessed with great wealth, you are "
        "equally known for your generosity and your penchant for the arts. Your actions are "
        "backed by fearlessness and courage, allowing you to master many creative and occult "
        "subjects. Whether it is astrology, painting, or administrative planning, you "
        "excel through a blend of sharp logic and deep intuition. You build a life "
        "that is both materialistically abundant and spiritually inquisitive, earning "
        "you a respected place in society as a wealthy and wise patron of the arts."
    ),
    "negativeDetail": (
        "Negative influences manifest as a wicked or argumentative nature that creates friction in "
        "your personal life. You may be overly sensuous, leading to multiple marriages or "
        "relationships with partners who do not share your moral values. Hostility toward "
        "loved ones and a struggle to connect with children can cause significant mental "
        "anguish. Furthermore, potential hearing or mental disorders can disrupt your "
        "otherwise stable mind. Balancing your deep desires with ethical conduct "
        "is essential to avoid the isolation and unrest that an afflicted state "
        "can bring to your domestic and spiritual journey."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a strong determined personality and an astute mind. You are known for your fearless actions and receive significant gains from artistic and occult ventures. While you face relationship challenges, your mental stability ensures a steady rise in status."
        },
        {
            "house": "10th House",
            "detail": "Ensures a successful career in creative intelligence or advisory fields. You rise to a position of wealth through your generosity and command of complex crafts. Your reputation for artistic mastery makes you a respected figure among peers and authorities."
        },
        {
            "house": "7th House",
            "detail": "Powerhouse for wealth through partnerships, though it indicates a complex marital history. You naturally attract the opposite sex, but your sensuality may lead to more than one marriage. Success in artistic business ventures is highly indicated."
        },
        {
            "house": "5th House",
            "detail": "Identity is defined by a deep interest in astrology and a sharp intelligence. You are skilled at many arts, but your relationship with your children may be marked by friction or a lack of emotional harmony due to your argumentative nature."
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
    # Alphabetical order: Mars, Mercury, Moon, Venus
    col_name = "Mars_Mercury_Moon_Venus"
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
    print("[*] Seeding Mars_Mercury_Moon_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
