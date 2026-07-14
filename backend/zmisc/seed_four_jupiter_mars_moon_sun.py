"""
Seed: Jupiter_Mars_Moon_Sun collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Mars-Jupiter Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a highly principled, wise, and courageous personality with a problem-solving approach.",
        "Combines Authority (Sun), Emotions (Moon), Action (Mars), and Wisdom (Jupiter) for a leadership style fueled by passion and ethics.",
        "Natives excel in government sectors, astrology, medical fields, and high-rank advisory roles, often guided by moral authority."
    ],
    "planetRoles": {
        "Sun": "Authority, father, status, discipline, creative soul, responsibility",
        "Moon": "Mind, emotions, mother, intuition, spiritual beliefs, basic comforts",
        "Mars": "Courage, action, physical vitality, strategic strategy, goal-oriented drive",
        "Jupiter": "Wisdom, law, tradition, philosophy, spiritual studies, intuitive intelligence"
    },
    "effects": {
        "powerfulSun": [
            "Grants self-respect and the ability to take significant responsibility for both family and profession.",
            "Ensures a creative approach to work and a strong sense of law and order.",
            "Provides significant support from senior authorities to lead teams or organizations with wisdom."
        ],
        "powerfulMoon": [
            "Grants emotional strength and courage to stand firm in challenging circumstances.",
            "Ensures success in higher studies and provides a positive, mature lifestyle.",
            "Provides loyalty, depth, and a spiritual connection with partners and family in a rational manner."
        ],
        "powerfulMars": [
            "Grants the ability to present ideas courageously and take bold risks to achieve goals.",
            "Ensures interest in martial arts or technical sectors with a strong strategic approach.",
            "Provides unwavering support from siblings and friends, allowing you to fight challenges with vigor."
        ],
        "powerfulJupiter": [
            "Grants a strong inclination toward traditions, Vedas, and scriptures.",
            "Ensures a love for the company of wise people and a priority for morality and ethics.",
            "Provides a broad vision and intuitive intelligence that helps in mastering philosophy and law."
        ]
    },
    "nature": {
        "positive": [
            "Principled leader with a problem-solving mindset and a royal bearing.",
            "Strong lineage and background support, ensuring inheritance and success in higher studies.",
            "Expected growth in government, astrology, medical, or architecture sectors based on merit.",
            "Commitment fueled by passion and intelligence, making your word highly valued in society."
        ],
        "negative": [
            "Aggression and impulsive approach leading to financial losses or misunderstandings.",
            "Reserved personality that struggles to express needs, causing friction in relationships.",
            "Arrogance and impulsive speech that can lead to a lack of articulation and failed ideas.",
            "Restlessness and anxiety caused by emotional instability if the Sun and Moon are conflicted."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Sharp intelligence, royal bearing, and strong bond with mother; success in higher studies."
        },
        {
            "house": "2nd House",
            "effect": "Wealth and inheritance; bold speech and success in family business; commanding nature."
        },
        {
            "house": "4th House",
            "effect": "Strong foundation from mother; quick thinker and skillful guide with moral authority."
        },
        {
            "house": "10th House",
            "effect": "Productive lifestyle with a broad vision; success in engineering, surgery, or technical work."
        }
    ],
    "keywords": ["sun", "moon", "mars", "jupiter", "conjunction", "wisdom", "authority", "ethics", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun gives you the self-respect to work alone when needed, yet you easily take "
            "responsibility for your family and office. You possess a creative approach to "
            "problem-solving and a profound sense of law and responsibility. Combined with "
            "Jupiter, it ensures you are viewed as a wise leader by senior authorities."
        ),
        "powerfulMars": (
            "Mars provides the courage and strength to present your ideas without fear. You are goal-oriented "
            "and bold, often finding success in technical or martial arts sectors. With Jupiter's "
            "influence, your risks are strategic rather than reckless, allowing you to navigate "
            "complex situations with a brave and winning mindset."
        ),
        "powerfulMoon": (
            "Moon grants you emotional strength and a romantic but rational personality. You prioritize "
            "basic comforts and family happiness, excelling in your educational journey. Your "
            "spiritual beliefs are strong, and you communicate with a depth and loyalty that earns "
            "the respect of your partner and maternal family alike."
        ),
        "powerfulJupiter": (
            "Jupiter acts as your moral compass, giving you a broad vision and intuitive intelligence. You "
            "love the company of educated people and find success in traditional sciences, law, and "
            "philosophy. It ensures you have the support of mentors and elder siblings, guiding "
            "you toward higher spiritual studies and a respected status in society."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Wise Warrior' personality. You receive immense support from siblings, "
        "parents, and mentors, ensuring steady growth in prestigious fields like the government, "
        "medical sectors, or architecture. Your decision-making is quick and fueled by a "
        "passionate but intelligent commitment to your promises. You are seen as a leader with "
        "royal bearing, capable of balancing individual self-respect with deep-rooted traditional "
        "values. Your lineage provides a strong foundation, and your ability to come up with "
        "solutions makes you indispensable to any organization or community you lead."
    ),
    "negativeDetail": (
        "Negative influences manifest as restlessness and an impulsive approach to speech. Aggression "
        "can cloud your judgment, leading to financial losses or misunderstandings with family. A "
        "reserved side might make it difficult to articulate your needs, causing internal anxiety "
        "and failed ideas. Arrogance can creep in if your status is not balanced by humility, "
        "potentially causing blocks in your articulation. It is vital to manage emotional "
        "instability, especially when Sun and Moon are in close association, to avoid "
        "straining the very relationships that provide your foundation of support."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native prioritizes self-respect and possesses a dynamic, sharp intelligence. While you are known for your courage and royal bearing, you must manage aggression to maintain harmony. Strong bonds with mother and success in higher studies are guaranteed."
        },
        {
            "house": "2nd House",
            "detail": "Identity is defined by wealth, inheritance, and a commanding nature. You succeed in family business and influence others with your bold, insightful speech. Support from siblings helps you earn money, though aggression must be checked to preserve these bonds."
        },
        {
            "house": "4th House",
            "detail": "Powerhouse for achieving career success through maternal guidance and a strong educational background. You are well-learned and skillful, excelling as a guide or mentor with moral authority. Gains in property and happiness from vehicles are clearly indicated."
        },
        {
            "house": "10th House",
            "detail": "Ensures a productive lifestyle with a broad vision and patience. You are skilled at balancing personal expression with social grace, finding immense success in precision-based sectors like engineering, surgery, or technical research. You fight against wrongs with a winning strategy."
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
    # Alphabetical order: Jupiter, Mars, Moon, Sun
    col_name = "Jupiter_Mars_Moon_Sun"
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
    print("[*] Seeding Jupiter_Mars_Moon_Sun four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
