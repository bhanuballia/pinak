"""
Seed: Sun_Venus collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Venus Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Sun represents soul, status, and authority; Venus represents relationships, emotions, and beauty.",
        "The connection determines the essence and strength of relationships in the native's life.",
        "Close conjunction (combustion) can lead to impulsiveness or loss of Venus's positive traits.",
        "Excellent for creative fields like acting, performing arts, and beauty-related industries.",
        "Often indicates a charismatic personality that attracts the public or a crowd."
    ],
    "effects": {
        "powerfulSun": [
            "Personality is ruled by ego and a strong sense of self-importance.",
            "Desires materialistic luxury and comfort but is reluctant to leave the personal comfort zone.",
            "Easily influenced by flattery and highly conscious of social reputation."
        ],
        "powerfulVenus": [
            "Peace and harmony in relationships are the top priorities.",
            "Diplomatic attitude in dealing with problems and avoiding arguments.",
            "Strong desire to be loved and appreciated, often leading to giving in to the partner."
        ]
    },
    "nature": {
        "positive": [
            "Blesses the native with a vibrant, beautiful, and supportive partner.",
            "Fine understanding of balancing romance and diplomatic relationship management.",
            "High creativity and success in arts, entertainment, or political careers."
        ],
        "negative": [
            "Brings restlessness and a potential lack of authenticity in relationships.",
            "Selfishness in personal relations, often seeking status through the partner.",
            "Void in relations that may lead to emotional losses or superficiality."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Good looks, charismatic personality, and fine acumen in maintaining relationships."
        },
        {
            "house": "2nd House",
            "effect": "Materialistic comforts and a great voice that captures listeners' interest."
        },
        {
            "house": "3rd House",
            "effect": "Courage and mental strength to win over rivals; success through hard work."
        },
        {
            "house": "4th House",
            "effect": "Wise and creative; the center of attraction in social groups with leadership caliber."
        },
        {
            "house": "5th House",
            "effect": "Strong romantic inclination, though can be fickle-minded or egoistic."
        },
        {
            "house": "6th House",
            "effect": "Competitive nature leading to success in government jobs or politics."
        },
        {
            "house": "7th House",
            "effect": "Charming partner; flaw-finding nature is good for politics but bad for home life."
        },
        {
            "house": "8th House",
            "effect": "Long life and materialistic comforts, but potential problems in marital coordination."
        },
        {
            "house": "9th House",
            "effect": "Magnificent financial ambience and a charming, religious personality."
        },
        {
            "house": "10th House",
            "effect": "Good wealth, status, and business acumen; potential for political success."
        },
        {
            "house": "11th House",
            "effect": "Natural leadership qualities and a desire for high materialistic comforts."
        },
        {
            "house": "12th House",
            "effect": "Success in stock markets and influential contacts, with a strong desire for luxury."
        }
    ],
    "keywords": ["sun", "venus", "conjunction", "relationships", "charisma", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Sun represents the soul, ego, status, and purpose, while Venus represents relationships, "
        "emotions, and the essence of how we value others. Their conjunction indicates the strength "
        "of social and romantic connections. While it can cause impulsiveness if Venus is combust, "
        "it also creates charismatic actors, performers, and politicians. In marital dynamics, the "
        "interaction of Solar authority and Venusian desire can lead to either shared power or "
        "ego-based disharmony."
    ),
    "effectsDetail": {
        "powerfulSun": (
            "When the Sun dominates, ego and self-importance rule your world. You showcase knowledge "
            "in your career and are very conscious of your reputation. You desire materialistic "
            "luxury but are reluctant to step out of your comfort zone, often being swayed by flattery."
        ),
        "powerfulVenus": (
            "When Venus dominates, peace is the priority. You deal with problems diplomatically and "
            "incline toward ignoring arguments. You have a cheerful personality and a strong desire "
            "to be loved, which sometimes leads to yielding to your partner's wishes too easily."
        ),
        "positiveConjunction": (
            "A positive conjunction brings a vibrant, supportive partner. It provides the ability "
            "to balance love and romance diplomatically. It fosters high creativity, making the native "
            "successful as an artist, actor, or in government and politics."
        ),
        "negativeConjunction": (
            "A negative conjunction leads to restlessness and a lack of authenticity. The Sun's power "
            "here can make one selfish in personal relations, often pursuing relationships for "
            "status, position, or personal enjoyment rather than mutual growth."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Blesses with looks and a charismatic personality; expert in creative talents."
        },
        {
            "house": "2nd House",
            "detail": "High financial quotient and a voice that can hold the interest of any listener."
        },
        {
            "house": "7th House",
            "detail": "Partner is charming and elegant; native may be a good politician but struggle with domestic coordination."
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
    col = db["Sun_Venus"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Sun_Venus collection: document {action}.")
    print(f"     Total documents in Sun_Venus: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Sun_Venus collection...")
    asyncio.run(seed())
    print("[+] Done.")
