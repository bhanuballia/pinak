"""
Seed: Mercury_Saturn_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mercury-Venus-Saturn Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a refined, disciplined, and intellectually elegant personality.",
        "Combines Logic (Mercury), Beauty (Venus), and Structure (Saturn) for aesthetic maturity and strategic financial planning.",
        "Natives are known as 'Wise Advisors' or practical creators, balancing classical taste with structured thinking and enduring loyalty."
    ],
    "planetRoles": {
        "Mercury": "Logic, communication, analytical clarity, financial planning, reasoning skills",
        "Venus": "Art, beauty, diplomacy, social grace, aesthetic sense, enduring love",
        "Saturn": "Discipline, patience, maturity, professional endurance, structured thinking"
    },
    "effects": {
        "powerfulMercury": [
            "Grants a refined intellect that combines analytical clarity with a disciplined aesthetic sense.",
            "Ensures gains from siblings, relatives, and government through quick reasoning skills.",
            "Provides success in writing, law, and diplomacy while maintaining a graceful social presence."
        ],
        "powerfulVenus": [
            "Grants charm and diplomacy required to manage conflicts and channelize harmony in relationships.",
            "Ensures an excellent career in art, design, fashion, or luxury services.",
            "Provides a restrained but serious personality that favors enduring commitments over fleeting ones."
        ],
        "powerfulSaturn": [
            "Manifests as a mature, deeply thoughtful individual capable of grabbing opportunities with focus.",
            "Ensures desire for growth is met through patience, endurance, and intellectual perseverance.",
            "Provides a structured approach to artistic and intellectual impulses, resulting in a wise mindset."
        ]
    },
    "nature": {
        "positive": [
            "Disciplined decision-making and a strong educational background leading to high professional rank.",
            "Committed approach to love and marital life with a calm demeanor and long-term vision.",
            "Practical creativity and aesthetic maturity that ensures success on long-term financial projects.",
            "Aesthetic discipline and elegant speech that help build deep, stable professional contacts."
        ],
        "negative": [
            "Overthinking, stress, and emotional suppression leading to distance in family relationships.",
            "Lethargic or extravagant financial approach resulting in stagnant wealth situations.",
            "Delayed romance or cold communication causing a lack of rejuvenation in personal life.",
            "Rigid mindset and harsh criticism that makes the native difficult to approach or work with."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Graceful yet reserved; mature decision-making; well-groomed and diplomatic demeanor."
        },
        {
            "house": "9th House",
            "effect": "Deep philosophical understanding; growth through religion and destiny; intellectually elegant."
        },
        {
            "house": "10th House",
            "effect": "Success in administrative roles or law; maturity and eloquence bring public admiration."
        }
    ],
    "keywords": ["mercury", "venus", "saturn", "conjunction", "aesthetics", "discipline", "advisor", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMercury": (
            "A strong Mercury helps you maintain a refined intellect, blending analytical clarity with "
            "an aesthetic sense. You possess quick reasoning skills and enjoy gains from siblings "
            "and government. Your social presence is graceful, though you are selective about "
            "whom you open up to, ensuring your communication remains precise and professional."
        ),
        "powerfulVenus": (
            "Venus grants you the charm and diplomacy to manage conflicts and maintain harmony. You have "
            "a serious and restrained personality that thrives in design, law, or luxury services. "
            "Your commitment to harmony ensures that you channelize your creative impulses into "
            "successful, high-end business ventures."
        ),
        "powerfulSaturn": (
            "Saturn manifests as the discipline and maturity required for long-term vision. You are deeply "
            "thoughtful and patient, capable of enduring challenging professional phases to attain "
            "the growth you desire. Your approach to art and intellect is structured, making "
            "you a reliable advisor in your field."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Practical Creator'—someone with a structured thinking approach "
        "and a belief in long-term relationships. You possess the right intellect to make decisions "
        "that benefit both your family and your career. Your educational background is likely strong, "
        "providing the foundation for a high rank in law, finance, or architecture. Venus blesses "
        "you with artistic discipline and elegant speech, while Saturn ensures your love is "
        "enduring and your demeanor calm. You have a 'classical taste' and are known for "
        "intellectual perseverance, allowing you to work on long-term projects with confidence "
        "and patience. Your ability to balance financial planning with aesthetic maturity "
        "makes you a wise advisor and a loyal partner who values slow and steady progress "
        "over impulsive actions."
    ),
    "negativeDetail": (
        "Negative influences can manifest as overthinking and stress, particularly on the financial front. "
        "An extravagant or lethargic approach can lead to stagnant situations and a lack of "
        "rejuvenation in your love life. Affliction can cause 'emotional suppression' or cold "
        "communication, creating distance from family members. You may suffer from artistic "
        "blockages or a rigid mindset that makes your speech seem boring or overly logical. "
        "Fear of rejection or a tendency toward harsh criticism can make it difficult for "
        "others to stay in your company. Guilt-driven choices and a fear of pleasure "
        "may lead to isolation, making it important to guard against dwelling on past "
        "mistakes and over-expectations in marital life."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native appears graceful, serious, and intelligent. You possess an attractive yet reserved personality, behaving with deep responsibility and diplomacy. Your inner world is rich with creativity, often leading to a long-term committed relationship built on maturity."
        },
        {
            "house": "9th House",
            "detail": "Identity is grounded in traditional ethics and higher learning. You follow the guidance of mentors strictly and possess in-depth knowledge of spirituality. Success in foreign travels and higher education is assured through your deep philosophical understanding."
        },
        {
            "house": "10th House",
            "detail": "Powerhouse for professional success through administrative excellence. You are good at social building and taking calculated risks. While early career stages may feel rigid, your maturity and wisdom eventually bring you eloquence, clarity, and immense respect."
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
    # Alphabetical order: Mercury, Saturn, Venus
    col_name = "Mercury_Saturn_Venus"
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
    print("[*] Seeding Mercury_Saturn_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
