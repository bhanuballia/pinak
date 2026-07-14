"""
Seed: Mercury_Moon_Sun_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Mercury-Venus Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents an attractive, intelligent, and highly social personality with royal taste.",
        "Combines Authority (Sun), Emotions (Moon), Logic (Mercury), and Attraction (Venus) for balanced success.",
        "Natives excel in creative leadership, fashion, brand awareness, and government-connected businesses."
    ],
    "planetRoles": {
        "Sun": "Authority, father, status, discipline, structured power, career growth",
        "Moon": "Mind, emotions, mother, intuition, empathy, domestic comfort",
        "Mercury": "Logic, multitasking, analytical calculation, communication, multitasking",
        "Venus": "Love, beauty, luxury, fashion, financial stability, fixing loopholes"
    },
    "effects": {
        "powerfulSun": [
            "Grants high status and significant gains through government and senior authorities.",
            "Ensures sharp intelligence and the ability to give quick, effective responses in crisis.",
            "Provides a disciplined approach that handles heavy responsibilities with relative ease."
        ],
        "powerfulMoon": [
            "Grants a strong emotional bond with family and a kind, caring personality.",
            "Ensures a luxurious lifestyle with a big house, comfortable vehicles, and quality food.",
            "Provides natural intuition and empathy, allowing for deep connections with the spouse and friends."
        ],
        "powerfulMercury": [
            "Grants exceptional analytical abilities and success in higher educational pursuits.",
            "Ensures the ability to multitask effectively while maintaining a calculated approach to business.",
            "Provides clarity in presenting ideas, supported by a large circle of followers and maternal guidance."
        ],
        "powerfulVenus": [
            "Grants the ability to identify and fix loopholes, ensuring long-term career stability.",
            "Ensures gains in fashion, engineering, or technical sectors related to the food industry.",
            "Provides a graceful personality that expresses love and care with strong emotional bonding."
        ]
    },
    "nature": {
        "positive": [
            "Ambitious leader with high moral values and the ability to inspire others toward success.",
            "Creative and strategic thinker who balances practical logic with deep-rooted intuition.",
            "Successful on the political front due to natural charm and the ability to connect with diverse groups.",
            "Wealthy and disciplined life with support from siblings and spouse for financial growth."
        ],
        "negative": [
            "Overthinking and stress leading to a lack of clarity and internal restlessness.",
            "Self-centered approach or ego clashes that can strain marital and professional relationships.",
            "Financial losses caused by repetitive mistakes, ignorance, or a lack of clear planning.",
            "Anxiety and health issues related to indigestion or a burning sensation if the ego is not managed."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Attractive appearance and royal bearing; friendly nature with a strong educational background."
        },
        {
            "house": "5th House",
            "effect": "Creative skills and multiple income sources; growth for children and potential acting career."
        },
        {
            "house": "10th House",
            "effect": "High status and strict decision-making; success in fashion, brand awareness, and art."
        },
        {
            "house": "7th House",
            "effect": "Dynamic social presence; success if Venus/Mercury are strong, though ego must be checked."
        }
    ],
    "keywords": ["sun", "moon", "mercury", "venus", "conjunction", "fashion", "luxury", "intellect", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun grants you high status and success on the professional front. You receive great "
            "favour from senior authorities and the government, allowing you to handle responsibilities "
            "with ease. Your intelligence is sharp, providing you the ability to give quick responses "
            "even in the most challenging situations, ensuring your growth remains steady and respected."
        ),
        "powerfulMercury": (
            "Mercury provides you with superior analytical skills and a calculated approach to life. You "
            "excel in higher studies and possess the rare ability to multitask without losing focus. "
            "Your mother's guidance is a constant source of clarity, helping you decide at every major "
            "stage of your life while you build a large following through your refined communication."
        ),
        "powerfulMoon": (
            "Moon ensures a kind and caring personality with deep emotional bonds. You enjoy a luxurious "
            "lifestyle, marked by a big house and comfortable vehicles. Your intuition is your greatest "
            "asset, allowing you to learn from travels and maintain a strong, empathetic connection with "
            "your family, father, and spouse, ensuring domestic happiness."
        ),
        "powerfulVenus": (
            "Venus gives you the unique ability to find and fix loopholes in any business or career structure. "
            "You are likely to find success in fashion, engineering, or food-related technical work. Your "
            "graceful personality helps you manage relationships with ease, expressing love and "
            "commitment in a way that ensures both stability and emotional fulfillment."
        )
    },
    "positiveDetail": (
        "This conjunction creates an 'Aesthetic Authority' personality. You possess high moral values and "
        "an ambitious approach that inspires those around you. You balance practical logic with "
        "intuitive wisdom, leading to a good rank in your career. Support from siblings and your "
        "spouse ensures that you attain your desired financial growth. Your leadership style is "
        "both creative and strategic, making you an ideal candidate for politics or brand management. "
        "With an introspective mind and a disciplined life, you build a legacy based on "
        "intelligent choices, luxurious living, and strong family foundations."
    ),
    "negativeDetail": (
        "Negative influences manifest as overthinking and a self-centered approach. Affliction can cause "
        "internal restlessness and anxiety, particularly affecting your digestion and mental peace. "
        "Ego clashes with partners or senior authorities can disrupt your professional stability if "
        "not managed with humility. Lack of clarity can lead to repetitive mistakes and "
        "unnecessary expenses, potentially draining your savings. It is essential to avoid a "
        "demanding nature in relationships to maintain the harmony required for your "
        "overall growth and success."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native has an attractive aura and royal bearing that naturally attracts others. Your disciplined personality and strong educational background lead to significant gains. While you are friendly and talkative, you must manage inner restlessness when Sun and Moon are in close association."
        },
        {
            "house": "5th House",
            "detail": "Identity is defined by sharp intellect and creative skills. You likely have multiple sources of income and work closely with senior authorities. This placement grants a royal status and a successful career in acting or creative arts, with expected growth for your children."
        },
        {
            "house": "10th House",
            "detail": "Ensures a high rank and strict decision-making in your professional life. You excel in brand awareness, fashion, and business-related education. Your ability to present ideas in a user-friendly way, combined with government support, leads to long-term business success."
        },
        {
            "house": "7th House",
            "detail": "Powerhouse for social connections and public branding. While it brings challenges in personal relationships due to ego, a strong Venus and Mercury ensure that you find success in partnerships that involve travel, beauty, or intellectual advisory work."
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
    # Alphabetical order: Mercury, Moon, Sun, Venus
    col_name = "Mercury_Moon_Sun_Venus"
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
    print("[*] Seeding Mercury_Moon_Sun_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
