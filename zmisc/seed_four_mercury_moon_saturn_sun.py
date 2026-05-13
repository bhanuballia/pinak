"""
Seed: Mercury_Moon_Saturn_Sun collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Mercury-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a highly structured, disciplined, and mentally resilient personality.",
        "Combines Authority (Sun), Emotions (Moon), Logic (Mercury), and Endurance (Saturn) for long-term stability.",
        "Natives excel in engineering, data handling, and administrative roles, often serving as 'Grounded Strategists' in complex environments."
    ],
    "planetRoles": {
        "Sun": "Authority, father, status, discipline, structured personality, introspection",
        "Moon": "Mind, emotions, mother, empathy, emotional resilience, understanding",
        "Mercury": "Logic, skills, writing, business acumen, analytical multitasking",
        "Saturn": "Discipline, responsibility, hardships, mining, engineering, data handling"
    },
    "effects": {
        "powerfulSun": [
            "Grants sharp intelligence but ensures a slow, deliberate approach to executing tasks.",
            "Ensures a strong, approachable personality where others feel comfortable sharing emotions.",
            "Provides a structured and disciplined outlook, though may cause distance from the father due to Saturn."
        ],
        "powerfulMoon": [
            "Grants strong emotional health and the intuitive capacity to understand others' thoughts.",
            "Ensures a caring approach that builds solid relationships with siblings, friends, and elders.",
            "Provides success in terms of liquid money and consistent support from maternal figures."
        ],
        "powerfulMercury": [
            "Grants an introverted but highly skilled personality, excelling in writing and presenting ideas.",
            "Ensures steady growth and success in business, supported by siblings and neighbors.",
            "Provides a practical and intellectual approach that ensures professional results over time."
        ],
        "powerfulSaturn": [
            "Grants a reserved personality that suppressed ego and teaches emotional maturity through hardship.",
            "Ensures success in data handling, mining, or research-based sectors through extreme focus.",
            "Provides the resilience to sustain relationships on a positive note through long-term grounding."
        ]
    },
    "nature": {
        "positive": [
            "Focused and structured strategist who creates long-term stability in any task or organization.",
            "Mentally disciplined individual with extreme endurance under high-stress circumstances.",
            "Eloquent and convincing communicator who balances practical logic with sound knowledge of mantras.",
            "Successfully manages the friction between Sun and Saturn with a disciplined work plan."
        ],
        "negative": [
            "Pessimistic outlook driven by challenging early family life or lack of emotional support.",
            "Financial crunches and lack of peace at home due to rigid beliefs and fear of change.",
            "Arguments and miscommunication in the workplace if Mercury is afflicted or retrograde.",
            "Health challenges related to skin, digestion, and nerve-related pain if the ego remains unchecked."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Exceptional grasping capacity; success in administrative positions; sharp intelligence."
        },
        {
            "house": "2nd House",
            "effect": "Stability in money and inheritance; gains from lineage; authoritative speech."
        },
        {
            "house": "5th House",
            "effect": "Spiritual and humanitarian outlook; success in finance and mass communication business."
        },
        {
            "house": "10th House",
            "effect": "Expected growth in the second phase of life; success in government and administrative roles."
        }
    ],
    "keywords": ["sun", "moon", "mercury", "saturn", "conjunction", "resilience", "strategy", "discipline", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun gives you sharp intelligence but favors a slow, deliberate approach to execution. "
            "You possess a structured personality that makes others feel safe sharing their feelings "
            "with you. However, the close association with Saturn requires you to balance your "
            "authority with a sense of duty, often resulting in an introspective dryness to your "
            "emotional expression that favors discipline over raw feeling."
        ),
        "powerfulMercury": (
            "Mercury provides you with an introverted but highly skilled personality. You have a superior "
            "command over writing and presenting complex ideas, though your results often manifest "
            "with time. Your analytical nature ensures success on the professional front, supported "
            "by a practical mindset and strong bonds with siblings and neighbors in your business pursuits."
        ),
        "powerfulMoon": (
            "Moon ensures strong emotional health and a deep empathy that allows you to read others' "
            "intentions. You depend on the guidance of the females in your life, especially your mother, "
            "to build stable relationships with friends and elders. This combination also promises "
            "success in managing liquid money and domestic stability through intuitive choices."
        ),
        "powerfulSaturn": (
            "Saturn is the great teacher here, forcing you to learn maturity through hardships. It suppresses "
            "the ego and encourages a reserved personality that does not reveal secrets unnecessarily. "
            "You excel in data handling, engineering, or mining sectors, building a resilience "
            "that helps you sustain relationships through the most challenging and grounding "
            "life experiences."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Focused Strategist' personality. You possess a disciplined and "
        "practical approach that allows you to create long-term stability and sustainability in "
        "any project you undertake. People value your presence because of your eloquent "
        "communication and your ability to stay grounded under immense stress. You successfully "
        "navigate the complex energies of Sun and Saturn by adopting a structured work plan. "
        "Additionally, your thirst for knowledge often leads you to acquire sound expertise in "
        "scriptures or mantras, allowing you to deal with pessimistic thoughts and emerge "
        "victorious with high-rank administrative success."
    ),
    "negativeDetail": (
        "Negative influences manifest as a rigid fear of change and a pessimistic approach to family "
        "life. Affliction can cause financial crunches and a strict personality that pushes people "
        "away due to a lack of emotional support. If Mercury is retrograde, miscommunication "
        "and arguments can disrupt your workplace harmony. Health issues like skin sensitivity, "
        "digestion problems, or nerve-related pain can arise if your mental discipline is "
        "compromised by chronic anxiety. Overcoming a self-centered approach and "
        "prioritizing expenses is essential to maintain the stability you crave."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses an exceptional capacity to digest multiple information streams at once. You are a natural fit for high administrative positions or government careers. While you face anxiety and overthinking due to Saturn, a positive Mercury ensures you learn from elders instead of getting stuck in arguments."
        },
        {
            "house": "2nd House",
            "detail": "Identity is defined by responsibilities and a strict life that limits a 'normal' lifestyle but grants property gains from lineage. Your speech is authoritative and harsh, reflecting your heavy responsibilities. Stability in money is indicated, provided you manage your information on savings wisely."
        },
        {
            "house": "5th House",
            "detail": "Powerhouse for intellectual dominance and strict decision-making. You manage large teams with a humanitarian and philosophical outlook. While you face opinion clashes with government officials, a strong Moon ensures optimism and success in business or mass communication sectors."
        },
        {
            "house": "10th House",
            "detail": "Ensures success that blossoms in the second phase of life. Under the guidance of your father, you rise to a high rank in government or administrative roles. While you face early challenges and opinion clashes, your persistence eventually leads to the high-status results you work so hard for."
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
    # Alphabetical order: Mercury, Moon, Saturn, Sun
    col_name = "Mercury_Moon_Saturn_Sun"
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
    print("[*] Seeding Mercury_Moon_Saturn_Sun four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
