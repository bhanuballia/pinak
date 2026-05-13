"""
Seed: Mars_Moon_Saturn_Sun collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Mars-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a highly structured, disciplined, and courageous personality.",
        "Combines Authority (Sun), Emotions (Moon), Action (Mars), and Responsibility (Saturn) for long-term endurance.",
        "Natives are known as 'Unshakable Determiners,' excelling in administrative, defense, and legal leadership roles."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, father, government, duty, self-respect",
        "Moon": "Mind, emotions, mother, empathy, intuition, inner balance",
        "Mars": "Courage, action, manifesting solutions, bold drive, real estate",
        "Saturn": "Discipline, responsibility, law, long-term persistence, structure"
    },
    "effects": {
        "powerfulSun": [
            "Grants strong immunity and virtues, making you mindful of duty and self-respect.",
            "Ensures success in defense and police services through courageous leadership.",
            "Provides favour from government and senior authorities, though may cause distance from sons."
        ],
        "powerfulMars": [
            "Grants the ability to manifest solutions with courageous steps and a structured approach.",
            "Ensures consistent growth through risks and challenges, resulting in a successful life journey.",
            "Provides good gains from property and real estate business with support from the society."
        ],
        "powerfulMoon": [
            "Grants balanced emotional and intellectual intelligence, integrating feelings with logic.",
            "Ensures success in liquid-related finance and receives guidance from senior women.",
            "Provides a mature sense of decision-making without hesitation, even in high-pressure situations."
        ],
        "powerfulSaturn": [
            "Grants a deep sense of responsibility and the ability to execute work without getting stuck.",
            "Ensures right decision-making in law, career, and finance through an introspective lens.",
            "Provides the chance to attain a high administrative rank when in positive association with the Sun."
        ]
    },
    "nature": {
        "positive": [
            "Unshakable determination and systematic sustaining of efforts for long-term results.",
            "Preservation of paternal and maternal wealth through strategic planning and balance.",
            "High status in society with blessings from lineage and strong paternal guidance.",
            "Skilled at working under extreme pressure with patience and endurance."
        ],
        "negative": [
            "Indigestion and chronic health challenges due to ignoring diet or genetic markers.",
            "Legal matters dragging on, causing potential loss of property or financial status.",
            "Ego clashes with seniors and family due to a stubborn adherence to personal beliefs.",
            "Tendency toward emotional suppression or a lazy approach that blocks career ambition."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Analytical expert; financial gains from government and legal work; Determined personality."
        },
        {
            "house": "2nd House",
            "effect": "Commanding speech and leadership; good gains from mother and siblings."
        },
        {
            "house": "4th House",
            "effect": "Problem-solving skills; ready to fight against wrongs; strong capacity to withstand criticism."
        },
        {
            "house": "10th House",
            "effect": "High rank in engineering or construction; guidance from father/boss; property gains."
        }
    ],
    "keywords": ["sun", "moon", "mars", "saturn", "conjunction", "discipline", "authority", "endurance", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun makes you mindful of duty and gives you the virtues to lead. You nourish the "
            "energy of Mars, avoiding unnecessary aggression while remaining passionate about your "
            "career. While it brings success in defense and government roles, you must manage "
            "potential distance in relationships with sons or family due to your focus on duty."
        ),
        "powerfulMars": (
            "Mars provides the courage to manifest solutions. In conjunction with the Sun and Saturn, "
            "it helps you adopt a structured and disciplined lifestyle. Your journey is marked by "
            "exciting risks that eventually lead to high status, especially in real estate or "
            "administrative sectors where you protect and lead your community."
        ),
        "powerfulMoon": (
            "Moon grants you the ability to integrate logic with feelings, ensuring your decisions are "
            "both sound and practical. You receive invaluable guidance from the women in your life, "
            "especially senior mentors. This emotional intelligence allows you to maintain "
            "authority and strategy even in the most challenging and hesitant situations."
        ),
        "powerfulSaturn": (
            "Saturn acts as the anchor of responsibility. It helps you manage complex legal and financial "
            "matters without getting stuck in negative situations. When strong, it allows you to "
            "attain a high administrative rank, ensuring that your introspective nature leads to "
            "mature execution rather than pessimistic thinking."
        )
    },
    "positiveDetail": (
        "This conjunction is the hallmark of 'Unshakable Determination.' You likely come from a strong "
        "lineage with a solid financial background, preserving the wealth of both your paternal and "
        "maternal families. You are a systematic planner, capable of sustaining efforts over long "
        "periods to achieve results that others find impossible. Guidance from elders and seniors "
        "shapes your disciplined approach, allowing you to work under intense pressure with "
        "patience. Your endurance in real estate and property matters brings significant gains, "
        "cementing your status as a respected leader in your society."
    ),
    "negativeDetail": (
        "Negative influences can manifest as a lack of discipline, leading to chronic health issues "
        "like indigestion or diabetes. Affliction to Mars can cause legal matters to drag on, "
        "draining your financial status and property. Your tendency to act solely on your "
        "beliefs, ignoring the opinions of others, can create friction in the workplace and "
        "family. If the Moon is afflicted, inner conflicts and emotional suppression may "
        "arise. You must guard against overruling ethical values for convenience, as "
        "this can lead to a sudden loss of professional rank or personal status."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native is an expert in calculative and analytical decision-making. You possess a determined personality that overcomes challenges with a motivational approach. Support from the government and father figure ensures consistent financial gains through legal or administrative work."
        },
        {
            "house": "2nd House",
            "detail": "Identity is defined by commanding speech and confidence. You focus on long-term goals rather than short-term gains, becoming a highly responsible leader. You excel at balancing personal expression with social grace, supported by gains from your mother."
        },
        {
            "house": "4th House",
            "detail": "Powerhouse for withstanding pressure and criticism. You have the problem-solving skills to fight against wrongs, supported by a positive relationship with your parents. If afflicted, however, you may become overly dependent on external validation."
        },
        {
            "house": "10th House",
            "detail": "Ensures a high rank and significant gains through engineering, construction, or government work. You are skilled at balancing professional conduct with social grace, often receiving guidance from bureaucrats and senior officials who admire your strength."
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
    # Alphabetical order: Mars, Moon, Saturn, Sun
    col_name = "Mars_Moon_Saturn_Sun"
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
    print("[*] Seeding Mars_Moon_Saturn_Sun four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
