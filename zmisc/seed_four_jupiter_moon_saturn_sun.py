"""
Seed: Jupiter_Moon_Saturn_Sun collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Jupiter-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a wise, serious, and deeply responsible personality with a pure soul.",
        "Combines Authority (Sun), Emotions (Moon), Wisdom (Jupiter), and Endurance (Saturn) for structured leadership.",
        "Natives excel in government administration, education, healing, and spiritual institutions through high moral values."
    ],
    "planetRoles": {
        "Sun": "Authority, father, status, pure soul, spiritual insights, execution power",
        "Moon": "Mind, emotions, mother, empathy, family nourishment, close connections",
        "Jupiter": "Wisdom, law, tradition, optimism, judgment, spiritual growth",
        "Saturn": "Discipline, responsibility, serious nature, long hours, endurance"
    },
    "effects": {
        "powerfulSun": [
            "Grants a pure soul and the ability to present complex ideas with clarity.",
            "Ensures strong insights into executing work plans with support from government and father.",
            "Provides a natural understanding of religious and spiritual matters in a structured way."
        ],
        "powerfulMoon": [
            "Grants deep empathy toward family, elders, and paternal figures, ensuring domestic care.",
            "Ensures emotional attachment with grandparents and mentors, building lifelong bonds.",
            "Provides a close connection with friends and family that remains stable despite changes in residence."
        ],
        "powerfulJupiter": [
            "Grants a wise personality capable of handling multifaceted and complex responsibilities.",
            "Ensures stability in the career through maternal support and spiritual guidance.",
            "Provides the ability to make the right decisions even in high-pressure and challenging situations."
        ],
        "powerfulSaturn": [
            "Grants a focused and attentive nature, necessary for working long hours without distraction.",
            "Ensures the ability to deal effectively with senior authorities through patience and discipline.",
            "Provides a serious personality that handles heavy responsibilities with unmatched endurance."
        ]
    },
    "nature": {
        "positive": [
            "Structured leader with a strong sense of responsibility toward financial and family matters.",
            "Emotionally strong individual who leads teams and manages heavy workloads with ease.",
            "Expected fame and a steady rise in career with significant financial stability.",
            "Strong bond with parents and mentors, fueled by high moral values and wise execution."
        ],
        "negative": [
            "Pessimistic approach and overthinking that can lead to internal confusion and failure.",
            "Self-centered approach and opinion clashes with father or mentors, causing status losses.",
            "Potential challenges in mother's health or lack of emotional support from the paternal side.",
            "Anxiety and distractions that cause hurdles in attaining growth or government support."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Introspective approach with in-depth knowledge; success in higher studies and high-rank roles."
        },
        {
            "house": "5th House",
            "effect": "Recognition for creative efforts; success in statistics, healing, and financial sectors."
        },
        {
            "house": "10th House",
            "effect": "Excellent career in administration; command over emotional and professional decisions."
        },
        {
            "house": "2nd House",
            "effect": "Stability in wealth; strong family bonds, though delay in savings if afflicted."
        }
    ],
    "keywords": ["sun", "moon", "jupiter", "saturn", "conjunction", "responsibility", "wisdom", "endurance", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun grants you a pure soul and the ability to work with deeper insights. You possess "
            "the clarity to understand your responsibilities and present your ideas effectively. "
            "Supported by your father and the government, you excel in executing work plans and "
            "possess a natural gift for understanding spiritual and religious matters."
        ),
        "powerfulSaturn": (
            "Saturn provides you with the serious and attentive nature required to handle heavy workloads "
            "without distraction. You have the endurance to work long hours and the discipline to "
            "interact successfully with senior authorities. This combination ensures that your "
            "leadership is rooted in patience and long-term results rather than short-term gains."
        ),
        "powerfulMoon": (
            "Moon ensure you are an empathetic person who takes great care of your family and elders. You "
            "maintain close connections with grandparents and mentors, and your emotional bonds "
            "remain unshakeable even if you move away. You nourish your surroundings with love "
            "and are always surrounded by a loyal circle of friends and family."
        ),
        "powerfulJupiter": (
            "Jupiter acts as your source of wisdom, allowing you to manage complex responsibilities with "
            "ease. It grants stability to your career, often supported by your mother's influence. "
            "Even in high-pressure situations, you make the right choices, ensuring your financial "
            "growth is steady and your judgment is respected by those who follow your guidance."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Structured Sage' personality. You receive immense support from your "
        "family and workplace, resulting in fame and a significant rise in your career. Your "
        "disciplined approach toward financial matters ensures stability, while your ability to "
        "manage heavy workloads makes you a natural team leader. You share a strong bond with "
        "your parents, especially when planetary war is absent. Your moral values are your "
        "greatest strength, allowing you to lead with a blend of emotional depth and wise "
        "execution that ensures a high-rank, respected status in administrative, educational, "
        "or spiritual organizations."
    ),
    "negativeDetail": (
        "Negative influences manifest as a pessimistic approach and a tendency toward overthinking. "
        "Affliction can cause internal confusion and a self-centered attitude that alienates "
        "mentors or parents. You may face hurdles with the government or experience "
        "opinion clashes with father figures. It is important to guard against a "
        "distracted personality, as confusion can lead to missed opportunities and "
        "failed life goals. Maintaining emotional balance and seeking the guidance of "
        "elders is essential to overcome the hurdles this complex combination can bring."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native is introspective and possesses in-depth knowledge that facilitates sharp decision-making. You receive significant gains from inheritance and paternal support. Your sense of responsibility and success in higher studies guarantee a high rank in your chosen career path."
        },
        {
            "house": "5th House",
            "detail": "Identity is defined by creative recognition and the company of a mature life partner. You perform exceptionally well in statistics, healing, or the financial sector, even under challenging circumstances. You receive recognition for even the smallest efforts you put into your work."
        },
        {
            "house": "10th House",
            "detail": "Ensures an excellent career in government administration or spiritual institutions. While your polite approach needs to be balanced with practicality to avoid being misused, you possess high moral values and command over emotional decisions that allow you to climb the ladder of success."
        },
        {
            "house": "2nd House",
            "detail": "Powerhouse for wealth stability and deep family bonds. While you may face delays in savings if Jupiter or Saturn are afflicted, you generally enjoy a secure financial status. You possess a wise but authoritative way of speaking that ensures others take your suggestions seriously."
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
    # Alphabetical order: Jupiter, Moon, Saturn, Sun
    col_name = "Jupiter_Moon_Saturn_Sun"
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
    print("[*] Seeding Jupiter_Moon_Saturn_Sun four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
