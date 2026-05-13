"""
Seed: Mars_Mercury_Moon collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mars-Mercury Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a sharp, witty, and emotionally resilient personality.",
        "Combines Mind (Moon), Action (Mars), and Logic (Mercury) for a strategic and assertive life path.",
        "Natives possess quick-thinking abilities, fluent communication, and the courage to take smart, calculated risks."
    ],
    "planetRoles": {
        "Moon": "Mind, emotions, psychic receptivity, empathy, memory retention",
        "Mars": "Action, courage, physical strength, immunity, self-defense",
        "Mercury": "Intelligence, communication, adaptability, business deals, eloquence"
    },
    "effects": {
        "powerfulMars": [
            "Ensures a self-defensive and practical approach to professional challenges.",
            "Grants strong physical abilities and emotional bonding with siblings and maternal family.",
            "Blesses with a strong immune system and the tireless work ethic to achieve objectives."
        ],
        "powerfulMoon": [
            "Ensures calm decision-making and psychic receptivity to people's needs.",
            "Grants empathy and the ability to help others through combined manual and intellectual work.",
            "Ensures good memory retention, grasping ability, and a deep inclination toward arts and music."
        ],
        "powerfulMercury": [
            "Manifests as quick, intelligent decisions and an action-oriented approach to commitments.",
            "Ensures expected growth in business and gains from the guidance of siblings.",
            "Grants the ability to adapt seamlessly to new circumstances and maintain eloquent speech."
        ]
    },
    "nature": {
        "positive": [
            "Sharp intellect and quick-thinking abilities that ensure the right decision at the right time.",
            "Fluent, assertive, and emotionally engaging speech that builds strong relationships.",
            "Emotional courage to take risks without getting stuck in fear or stagnation.",
            "Strategic leadership that combines emotional understanding with a commanding mental strategy."
        ],
        "negative": [
            "Volatile personality with frequent changes in decisions and mental restlessness.",
            "Financial losses due to aggressive approaches and impulsive investment choices.",
            "Potential for harsh, sarcastic, or hurtful language that alienates others.",
            "Nervous energy leading to anxiety, insomnia, or emotional lashing out."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Attractive and witty; influences others emotionally while maintaining logical assertiveness."
        },
        {
            "house": "2nd House",
            "effect": "Aggressive but eloquent debating skills; earns through financial education and business."
        },
        {
            "house": "4th House",
            "effect": "Supportive home environment; real estate gains; guidance from mother and maternal family."
        },
        {
            "house": "6th House",
            "effect": "Tactical intelligence in conflict resolution; outsmarts rivals without emotional challenge."
        },
        {
            "house": "10th House",
            "effect": "Productive energy directed toward engineering success; clear and imaginative productivity."
        }
    ],
    "keywords": ["moon", "mars", "mercury", "conjunction", "wit", "resilience", "strategy", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMars": (
            "A strong Mars in this conjunction ensures a self-defensive and practical approach. You possess "
            "strong physical abilities and deep emotional bonding with siblings. Once committed, you "
            "work tirelessly toward your objectives, supported by a strong immune system and "
            "rapid recovery power."
        ),
        "powerfulMoon": (
            "A powerful Moon ensures you remain calm during decision-making. You possess psychic receptivity, "
            "understanding people and situations intuitively. Your empathy, combined with the "
            "intelligence of Mercury and Mars, allows you to help others through both manual "
            "and intellectual work, backed by excellent memory retention."
        ),
        "powerfulMercury": (
            "Mercury manifests in quick, intelligent decisions and an action-oriented approach. You "
            "do not break promises and adapt well to new circumstances. Success in business "
            "and professional contacts is marked by your eloquent speech and command over "
            "multiple skillsets."
        )
    },
    "positiveDetail": (
        "This combination creates a sharp, witty warrior with an eloquent heart. You possess the emotional "
        "courage to take risks and the intellect to make them pay off. Your speech is both assertive "
        "and emotionally engaging, allowing you to dominate debates while building strong professional "
        "relationships. You are ideally suited for entrepreneurship, where your bold and articulate "
        "nature provides a commanding energy. The blend of imagination, speed, and clarity helps "
        "you lead teams with an intelligent approach that combines mental strategy with emotional "
        "understanding."
    ),
    "negativeDetail": (
        "Negative influences can lead to a volatile personality and mental restlessness. Impatience in "
        "communication or a harsh, sarcastic tone can alienate colleagues and family. Financial "
        "losses may occur through aggressive, unthought-out investments. Emotional impulsiveness "
        "might lead to acting before thinking, or even nervous energy manifesting as anxiety and "
        "insomnia. A dual personality or a tendency to lash out without reason can cause "
        "sudden breaks in relationships and unfulfilled commitments."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native is an attractive, bold, and witty individual who attracts the masses easily. You balance logical assertiveness with emotional empathy, allowing you to influence others at both an intellectual and soul level. Your presence is wittily expressive and courageous."
        },
        {
            "house": "2nd House",
            "detail": "Blessed with aggressive yet eloquent speech, you excel in debating and leading family responsibilities. Resource management is a strength, and you likely earn through financial education, diverse business ventures, and your powerful verbal skills."
        },
        {
            "house": "4th House",
            "detail": "Ensures a supportive home and growth through maternal guidance. While you enjoy real estate gains and a solid educational rank, emotional vulnerability can sometimes lead to verbal clashes at home. A practical approach is needed to manage your domestic peace."
        },
        {
            "house": "6th House",
            "detail": "Powerhouse for taking calculated risks and overcoming legal challenges. Your tactical intelligence and fighting spirit help you outsmart competitors in conflict resolution. Emotional resilience ensures you stay focused on work without being drained by rivals."
        },
        {
            "house": "10th House",
            "detail": "Highly productive placement for engineering and technical skills. You are an adaptable and quick decision-maker who climbs the success ladder through sheer resistance and imaginative speed. Clarity under pressure prevents emotional breakdowns during heavy workloads."
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
    db = client["Triple_Planet_Conjunction"]
    # Alphabetical order: Mars, Mercury, Moon
    col_name = "Mars_Mercury_Moon"
    col = db[col_name]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Triple Planet Conjunction: {col_name} {action}.")
    print(f"     Total documents in {col_name}: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Mars_Mercury_Moon triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
