"""
Seed: Mars_Mercury_Moon_Sun collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Mars-Mercury Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a highly intelligent, dynamic, and emotionally aware personality.",
        "Combines Authority (Sun), Emotions (Moon), Action (Mars), and Logic (Mercury) for a disciplined but innovative approach.",
        "Natives are known for their sharp intelligence, quick decision-making, and ability to lead large teams with strong ethical values."
    ],
    "planetRoles": {
        "Sun": "Authority, father, status, discipline, structured power",
        "Moon": "Mind, emotions, mother, empathy, emotional intelligence",
        "Mars": "Courage, action, aggression, calculated risk, physical vitality",
        "Mercury": "Logic, intelligence, communication, business acumen, wit"
    },
    "effects": {
        "powerfulSun": [
            "Grants dynamic power to lead big teams and amplifies social status.",
            "Ensures a disciplined and structured personality that overcomes aggression with authority.",
            "Provides the courage to ask critical questions instead of following traditional norms blindly."
        ],
        "powerfulMoon": [
            "Grants success in overcoming challenges through a blend of courage and emotional intelligence.",
            "Ensures expected growth with consistent guidance and support from the mother and maternal family.",
            "Provides clarity in decision-making and ensures gains in property, land, and real estate."
        ],
        "powerfulMars": [
            "Grants success in leadership roles within military, surgery, business, or sports-related sectors.",
            "Ensures a courageous personality that makes quick decisions under pressure.",
            "Provides significant support from father and siblings, often leading to gains in the food or land sectors."
        ],
        "powerfulMercury": [
            "Grants an exceptional relationship with the father and significant support from the maternal family.",
            "Ensures growth in careers involving communication, travel, and the medical fields.",
            "Provides a large mass following through refined speech and intellectual prowess."
        ]
    },
    "nature": {
        "positive": [
            "Innovative thinker and energetic worker with sharp intelligence and quick decision-making skills.",
            "Strong lineage and background support, ensuring inheritance and gains from the paternal family.",
            "Confident self-presentation with the ability to maintain ethical communication with neighbors and siblings.",
            "Disciplined approach to emotional awareness that ensures steady professional and financial growth."
        ],
        "negative": [
            "Instability in life and family relationships if the conjunction is heavily afflicted.",
            "Argumentative nature and sudden changes in decisions caused by a weak or afflicted Mars.",
            "Opinion clashes between paternal and maternal families leading to emotional friction.",
            "Potential loss of inheritance and lack of domestic harmony if the ego is not managed."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Sharp intelligence, attractive personality, and success in high-rank government careers."
        },
        {
            "house": "2nd House",
            "effect": "Strong financial background; success in research, occult sciences, and medical sectors."
        },
        {
            "house": "4th House",
            "effect": "Support of parents and success in birthplace; family business growth with maternal guidance."
        },
        {
            "house": "10th House",
            "effect": "Balanced temperament with strong ethics; leadership of large teams and high social status."
        }
    ],
    "keywords": ["sun", "moon", "mars", "mercury", "conjunction", "intelligence", "leadership", "logic", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun allows you to lead large teams with dynamic power. It amplifies your status and "
            "gives you a structured personality that effectively harnesses Mars' energy. You possess the "
            "discipline to ask critical questions and lead rather than follow, ensuring that your "
            "authority is respected in all professional circles."
        ),
        "powerfulMars": (
            "Mars provides the courage to take calculated risks. When strong, you excel in the military, "
            "surgery, or martial arts. You receive great support from your father and siblings, "
            "manifesting solutions quickly and with a brave heart. Gains in property and food sectors "
            "are common, especially when your actions are balanced by the Moon's empathy."
        ),
        "powerfulMoon": (
            "Moon grants you the emotional intelligence to navigate hurdles. You rely heavily on the guidance "
            "of your mother, whose support is pivotal in your growth. This combination ensures "
            "that your courage is rooted in emotional clarity, providing a strong circle of friends "
            "and success in real estate through a sound and empathetic strategic approach."
        ),
        "powerfulMercury": (
            "Mercury ensures you have the wit and logical clarity to succeed in communication-heavy careers. "
            "Your mother plays a significant role in your life, and your refined intellect earns you "
            "mass followers. You excel in medical, travel, or media fields, maintaining a "
            "commanding but graceful presence that bridges the gap between authority and the public."
        )
    },
    "positiveDetail": (
        "This conjunction is a 'Saraswati-Lakshmi-Agni' blend of intelligence, wealth potential, and "
        "disciplined power. You possess an innovative mind and an energetic work ethic, often "
        "supported by a strong lineage and background. Your paternal and maternal families provide "
        "the guidance needed to make the right decisions at the right time. You are known for your "
        "sharp intellect and quick decision-making, which helps you present yourself with "
        "unwavering confidence. Your ability to integrate feelings with logic ensures "
        "consistent professional success, allowing you to sustain high-level results throughout "
        "your career journey."
    ),
    "negativeDetail": (
        "Negative influences manifest as a lack of stability and argumentative tendencies. Affliction "
        "can lead to sudden, rash decisions that disrupt your professional rank. You may face "
        "intense opinion clashes between your paternal and maternal sides, causing emotional "
        "friction at home. A weak Mars can lead to a loss of inheritance or legal challenges "
        "related to property. Parents may struggle with their own relationship dynamics, "
        "which can affect your early development. Managing your ego and avoiding a lazy "
        "approach is essential to prevent your ambitions from becoming blocked by "
        "unnecessary internal or external conflicts."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses sharp intelligence and an attractive aura. You are ready to help others and excel at introspection. This placement often grants a high government rank and the opportunity to learn multiple skills from wise mentors, ensuring a life of wealth and success."
        },
        {
            "house": "2nd House",
            "detail": "Identity is centered on a big family and a strong financial background. You thrive in research, occult sciences, or medicine. Guidance from elders helps you navigate challenges with confidence, especially in media, speech, and teaching sectors."
        },
        {
            "house": "4th House",
            "detail": "Powerhouse for educational success and growth in your birthplace. Your mother's disciplined and structured personality plays a vital role in your wealth management. You find great support in family business, ensuring that your foundation is built on legacy."
        },
        {
            "house": "10th House",
            "detail": "Ensures a high status and respected rank for your parents and yourself. You lead large teams with high idealism and strong ethics, supported by government and seniors. Your temperament is balanced, making you a natural leader who commands respect through wisdom."
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
    # Alphabetical order: Mars, Mercury, Moon, Sun
    col_name = "Mars_Mercury_Moon_Sun"
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
    print("[*] Seeding Mars_Mercury_Moon_Sun four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
