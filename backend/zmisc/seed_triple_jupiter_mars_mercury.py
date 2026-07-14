"""
Seed: Jupiter_Mars_Mercury collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mars-Mercury-Jupiter Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly intelligent, action-oriented, and strategic personality.",
        "Combines Logic (Mercury), Courage (Mars), and Wisdom (Jupiter) for financial brilliance and leadership.",
        "Natives are known for their sharp memory, diplomatic debate skills, and ability to turn technical knowledge into wealth."
    ],
    "planetRoles": {
        "Mars": "Action, courage, enthusiasm, physical drive, protective approach",
        "Mercury": "Logic, intelligence, communication, wit, business acumen, memory",
        "Jupiter": "Wisdom, expansion, mentors, higher education, financial prudence, moral values"
    },
    "effects": {
        "powerfulMars": [
            "Ensures an action-oriented approach and the ability to deal with challenges wisely.",
            "Grants a good sense of humor and the enthusiasm to learn new technical skills.",
            "Provides a sharp memory and a protective approach toward loved ones and responsibilities."
        ],
        "powerfulMercury": [
            "Ensures a sharp intellect and quick, effective decision-making abilities.",
            "Grants success in school, higher studies, and business-related matters.",
            "Provides eloquent speech and the ability to attract others through a diplomatic approach."
        ],
        "powerfulJupiter": [
            "Grants a wise personality with success in higher studies and spiritual inclinations.",
            "Ensures growth and recognition in financial and educational sectors.",
            "Provides guidance from mentors, grandparents, and seniors, ensuring maturity in investments."
        ]
    },
    "nature": {
        "positive": [
            "Exceptional financial wisdom and smart investment planning that leads to wealth.",
            "Bold decision-making ability and strategic planning that ensures a high professional rank.",
            "Strong leadership qualities and an entrepreneurial drive combined with legal expertise.",
            "Energetic thinker and dynamic writer with an honest and honest communication approach."
        ],
        "negative": [
            "Verbal aggression and intellectual arrogance leading to workplace ego conflicts.",
            "Career instability due to harsh responses and an impatient approach to challenges.",
            "Rash financial decisions or impulsive investments causing family relationship strain.",
            "Intellectual superiority complex and judgmental attitude toward others' beliefs."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Technical intelligence and management potential; recognition as a motivational speaker; energetic thinker."
        },
        {
            "house": "5th House",
            "effect": "Sharp intellect and love for learning; support from siblings and mentors; success in higher studies."
        },
        {
            "house": "10th House",
            "effect": "Success in technical and financial sectors; diplomatic approach and gain of property."
        }
    ],
    "keywords": ["mars", "mercury", "jupiter", "conjunction", "strategy", "intellect", "wealth", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMars": (
            "A powerful Mars ensures you have an action-oriented approach to life. You possess a sharp "
            "memory and enjoy solving complex puzzles. Your enthusiasm for learning new technical "
            "skills, combined with Jupiter's wisdom, makes you an effective problem solver and "
            "a protective leader."
        ),
        "powerfulMercury": (
            "Mercury provides a sharp intellect and quick decision-making abilities. You excel in school "
            "and business, using your eloquent speech and diplomatic approach to win over any "
            "opposition. Your action-oriented logic ensures substantial financial gains in "
            "education, communication, or travel industries."
        ),
        "powerfulJupiter": (
            "Jupiter grants a wise personality and success in higher studies. You are naturally inclined "
            "toward spiritual work and act as a motivator for others. Guidance from mentors and "
            "grandparents ensures you develop a deep maturity regarding money and long-term "
            "investment strategies."
        )
    },
    "positiveDetail": (
        "This conjunction is a powerhouse for financial wisdom and wealth accumulation. You are adept at "
        "utilizing resources and managing people, often attaining growth under the guidance of "
        "mentors or your spouse. Jupiter and Mercury together grant success through writing and "
        "wealth management knowledge, while Mars provides the technical mindset for engineering "
        "success. You possess the leadership qualities and strategic planning required to attain "
        "a high rank. Your communication is aggressive yet analytical, making you an expert in "
        "legal matters and entrepreneurial ventures. Even in challenging times, your bold "
        "decision-making ability ensures you stay on the path of prosperity and recognition."
    ),
    "negativeDetail": (
        "Negative influences can lead to verbal aggression and an impatient approach, causing instability "
        "in your career. Intellectual arrogance and a tendency toward overanalysis can interfere "
        "with your tasks. Rash, impulsive investments can lead to financial challenges and "
        "strained family relationships. A 'workplace ego' may alienate colleagues, while "
        "heated arguments and a judgmental attitude can create unnecessary conflicts. Restlessness "
        "in your love life due to a lack of trust or overexpectations may lead to relationship "
        "breaks. Your financial goals may become scattered if you allow Mars's fiery energy "
        "to override Mercury's logical planning."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses technical intelligence and management potential. You are a skilled debater and dynamic writer who can influence the masses. An honest communication style helps you build strong professional relationships and a stable, intellectually stimulating marital life."
        },
        {
            "house": "5th House",
            "detail": "Identity is shaped by a sharp intellect and a deep love for learning. You are likely to earn scholarships and enjoy the company of mentors and siblings who guide you through adversity. Your analytical and performance skills are exceptional, often leaning toward philosophical wisdom."
        },
        {
            "house": "10th House",
            "detail": "Powerhouse for technical and financial success. You possess a diplomatic approach and a wide circle of professional friends. Gains in property and asset-related matters are assured, especially in roles involving legal work, business, or education."
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
    # Alphabetical order: Jupiter, Mars, Mercury
    col_name = "Jupiter_Mars_Mercury"
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
    print("[*] Seeding Jupiter_Mars_Mercury triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
