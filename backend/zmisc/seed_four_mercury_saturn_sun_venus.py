"""
Seed: Mercury_Saturn_Sun_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mercury-Venus-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a cheerful, energetic, and intellectually astute personality with significant charisma.",
        "Combines Authority (Sun), Logic (Mercury), Attraction (Venus), and Discipline (Saturn) for virtuous leadership.",
        "Natives are influential speakers who often find great acclaim in foreign lands and enjoy consistent luck."
    ],
    "planetRoles": {
        "Sun": "Authority, charisma, enthusiasm, foreign success, status",
        "Mercury": "Logic, clear-cut expression, persuasive speaking, critical thinking, intellect",
        "Venus": "Attraction, physical beauty, luxury, supportive friendships, marital life",
        "Saturn": "Discipline, spiritual depth, moral truthfulness, loyalty, progeny challenges"
    },
    "effects": {
        "powerfulSun": [
            "Grants higher-than-average enthusiasm and a charismatic presence that attracts acclaim.",
            "Ensures success away from the native place, often leading to a high status in foreign lands.",
            "Provides a virtuous and spiritual foundation for all authoritative actions."
        ],
        "powerfulMercury": [
            "Grants a clear-cut and persuasive expression, making the native an influential speaker.",
            "Ensures the ability to be a great critic through intellectually astute and sharp logic.",
            "Provides the persuasive power to influence others and succeed in communication-heavy roles."
        ],
        "powerfulVenus": [
            "Grants a physically attractive appearance and a naturally charming social aura.",
            "Ensures an easygoing and comfortable nature that makes the native very supportive to friends.",
            "Provides an attraction toward the opposite sex, though marriage may involve complex dynamics."
        ],
        "powerfulSaturn": [
            "Grants a morally truthful and loyal character with a strong spiritual inclination.",
            "Ensures the discipline required for long-term success, though it may cause progeny issues.",
            "Provides the endurance to stay loyal to values even in the face of social or personal pressure."
        ]
    },
    "nature": {
        "positive": [
            "Cheerful and energetic individual who inspires others with their charisma and luck.",
            "Persuasive and influential speaker who finds success as a critic or advisor.",
            "Virtuous and spiritual being who is respected for their truthfulness and loyalty.",
            "Physically attractive and intellectually astute with a highly supportive friend circle."
        ],
        "negative": [
            "Issues in progeny and child-bearing matters despite strong marital foundations.",
            "Potential for multiple marriages or complex dynamics in love and domestic life.",
            "Internal pressure to maintain a perfect moral standing and clear-cut expression.",
            "Separation from the birthplace as success is majorly indicated in foreign territories."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong determined personality; physically attractive bearing; famous in foreign land."
        },
        {
            "house": "10th House",
            "effect": "High rank in communication or diplomatic fields; success through persuasive logic."
        },
        {
            "house": "9th House",
            "effect": "Deep spiritual and virtuous growth; authority through moral truthfulness and foreign connections."
        },
        {
            "house": "3rd House",
            "effect": "Influential speaking and critical skills; supportive to siblings and a wide social circle."
        }
    ],
    "keywords": ["sun", "mercury", "venus", "saturn", "conjunction", "charismatic", "persuasive", "spiritual", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun grants you a cheerful and energetic personality with a higher-than-average "
            "sense of enthusiasm. You possess a charismatic aura that ensures you find acclaim "
            "away from your native place. Your success is often linked to foreign lands, where "
            "your virtuous nature and luck combine to grant you high-status recognition."
        ),
        "powerfulMercury": (
            "Mercury provides you with a clear-cut and persuasive expression. You are an intellectually "
            "astute individual who can become a great critic or an influential speaker. Your "
            "ability to interpret situations logically and present them persuasively allows "
            "you to influence peers and leaders alike with your sharp mental capacity."
        ),
        "powerfulVenus": (
            "Venus ensures you are physically attractive and possess a charming social presence. You "
            "are easygoing and comfortable, making you a highly supportive friend. While you "
            "naturally attract the opposite sex, you seek relationships that are grounded "
            "in the luxury and comfort that your successful career provides."
        ),
        "powerfulSaturn": (
            "Saturn acts as your source of spiritual depth and moral truthfulness. It makes you a loyal "
            "and virtuous being who values ethics above all else. While it grants the discipline "
            "required for long-term success, it also introduces challenges in progeny matters, "
            "requiring patience and a structured approach to child-bearing and family expansion."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Charismatic Virtuoso' personality. You are someone who is cheerful, "
        "energetic, and intellectually astute. Your influential speaking skills and clear-cut "
        "expression allow you to become a great critic or advisor, often earning you acclaim "
        "in foreign lands. Luck is almost always on your side as you navigate your "
        "career with a virtuous and spiritual approach. Morally truthful and loyal, "
        "you are respected in your social circle as a supportive and easygoing friend. "
        "Your life is a blend of physical attraction, intellectual command, and "
        "moral integrity, making you a vital and trusted leader in any community."
    ),
    "negativeDetail": (
        "Negative influences manifest as significant challenges in progeny and progeny-related matters. "
        "While you may have more than one marriage or a strong attraction to the opposite "
        "sex, child-bearing can be difficult. The internal drive for moral truthfulness "
        "can sometimes create pressure on your personal relationships. Furthermore, "
        "the indication that your success lies away from your birthplace may lead "
        "to a sense of detachment from your roots, requiring you to build a "
        "new home and legacy in territories that are far from your origin."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a strong determined personality and a physically attractive aura. You are a natural multitasker who handles responsibilities in a clear-cut manner. While you face progeny challenges, your charismatic lifestyle ensures steady growth in foreign lands."
        },
        {
            "house": "10th House",
            "detail": "Ensures a successful career in high-status diplomatic or critical fields. You grow through your persuasive logic and influential speech, overcoming challenges with an energetic and cheerful approach that earns the favour of senior authorities."
        },
        {
            "house": "9th House",
            "detail": "Powerhouse for spiritual and virtuous growth. You excel in territories away from your birthplace, using your moral truthfulness to build a legacy. Your luck and charisma make you a respected figure in philosophical and international circles."
        },
        {
            "house": "3rd House",
            "detail": "Identity is centered on persuasive communication and loyal friendships. You are known for being supportive to peers and siblings, using your critical skills to help them grow. Your cheerful nature ensures you are always surrounded by a wide and supportive social circle."
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
    # Alphabetical order: Mercury, Saturn, Sun, Venus
    col_name = "Mercury_Saturn_Sun_Venus"
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
    print("[*] Seeding Mercury_Saturn_Sun_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
