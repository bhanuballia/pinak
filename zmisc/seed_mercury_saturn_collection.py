"""
Seed: Mercury_Saturn collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mercury-Saturn Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Mercury represents speech and skills; Saturn represents hard work and structure.",
        "A blend of intelligence and discipline that ensures a quick, efficient approach to problem-solving.",
        "Natives are often mature souls who manage conflict gracefully and handle responsibility without complaint.",
        "Provides the ability to create well-structured long-term plans with a strong foundation.",
        "Mercury's mantra-chanting ability combined with Saturn's self-awareness transforms life challenges."
    ],
    "effects": {
        "powerfulMercury": [
            "Grants the ability to write well-structured information for career or business success.",
            "Blesses the native with eloquent speech and the skill to manage any situation with grace.",
            "Strong business management skills and strong connections within society and female relatives."
        ],
        "powerfulSaturn": [
            "Ensures a dedicated, honest personality with high rank in law, administration, or judiciary.",
            "Blesses the native with patience and a practical approach that leads to stable wealth creation.",
            "Grants the ability to manage heavy workloads and build efficient, long-lasting teams."
        ]
    },
    "nature": {
        "positive": [
            "Deep understanding of life and a calm approach to managing multiple social and family responsibilities.",
            "Highly effective in research-based fields and fields addressing cultural backgrounds like Ayurveda.",
            "Command over multiple languages and exceptional clarity in developing sustainable business plans."
        ],
        "negative": [
            "Can lead to delays in understanding others' viewpoints and a self-centered, argumentative nature.",
            "Lack of patience and communication gaps may lead to property disputes and inheritance issues.",
            "Risk of chronic health concerns like joint pain, neurodegenerative issues, or memory loss."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Expresses ideas brilliantly but with a serious, controlled, and mature personality."
        },
        {
            "house": "6th House",
            "effect": "Wise and mature personality; resolves conflict calmly and enjoys long-term career stability."
        },
        {
            "house": "7th House",
            "effect": "Strong workplace circumstances; success as a professional bureaucrat or businessperson."
        },
        {
            "house": "10th House",
            "effect": "Capable of working long hours; high authority in administrative work or legal sectors."
        }
    ],
    "keywords": ["mercury", "saturn", "conjunction", "discipline", "intelligence", "structure", "law", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Mercury is the planet of communication and skills, while Saturn is the planet of "
        "hard work and self-awareness. When they combine, they create a 'disciplined intellect' "
        "capable of managing complex problems with a calm, practical approach. This conjunction "
        "is excellent for those in law, administration, or any field requiring long-term "
        "planning and a strong foundation. While it may bring a reserved or serious personality, "
        "it rewards the native with a reputable image and stable career growth after a period of "
        "hard work."
    ),
    "effectsDetail": {
        "powerfulMercury": (
            "When Mercury dominates, your approach to life is quick and efficient. You possess "
            "excellent grasping power and academic skills, allowing you to run businesses "
            "successfully. You manage conflicts without making complaints and maintain strong, "
            "positive bonds with your social circle."
        ),
        "powerfulSaturn": (
            "When Saturn dominates, you possess a mature and practical personality. You are "
            "dedicated to your duties and often attain high ranks in administration or law. Your "
            "status tends to rise significantly after the age of 39, as your long-term plans "
            "finally yield substantial wealth and reputation."
        ),
        "positiveConjunction": (
            "A positive conjunction helps you manage multiple responsibilities with a calm, mature "
            "approach. You possess deeper insights into life and are excellent at research. Your "
            "clarity in business planning and ability to manage risks ensure that you build "
            "sustainable, long-term relationships in both society and the office."
        ),
        "negativeConjunction": (
            "A negative conjunction leads to a rigid, self-centered approach. You may face "
            "challenges in adapting to others' viewpoints, leading to property disputes or "
            "legal hurdles. Affliction can cause communication gaps with family and chronic "
            "health concerns like skin issues or neurodegenerative disorders."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Native becomes a higher authority in their field, known for a mature, practical approach that helps others resolve conflicts through well-calculated risks."
        },
        {
            "house": "1st House",
            "detail": "While the native may have a reserved or introverted approach to personal feelings, they implement business ideas with brilliant precision and a disciplined mind."
        },
        {
            "house": "6th House",
            "detail": "Provides guidance and support from the maternal family and ensures success in legal professions or careers related to the law sector abroad."
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
    db = client["Two_Planet_Conjunction"]
    col = db["Mercury_Saturn"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Mercury_Saturn collection: document {action}.")
    print(f"     Total documents in Mercury_Saturn: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Mercury_Saturn collection...")
    asyncio.run(seed())
    print("[+] Done.")
