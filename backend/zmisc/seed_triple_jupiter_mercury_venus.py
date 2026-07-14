"""
Seed: Jupiter_Mercury_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mercury-Jupiter-Venus Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly intelligent, articulate, and diplomatic personality.",
        "Combines Logic (Mercury), Wisdom (Jupiter), and Grace (Venus) for exceptional communication and social success.",
        "Natives are known for their magnetic aura, refined demeanor, and ability to resolve conflicts through eloquent speech and artistic intelligence."
    ],
    "planetRoles": {
        "Mercury": "Logic, intelligence, communication, business acumen, wit, diplomatic resourcefulness",
        "Jupiter": "Wisdom, expansion, moral values, higher education, philosophical depth, teaching",
        "Venus": "Art, beauty, charm, social harmony, refined taste, creative ideas, domestic happiness"
    },
    "effects": {
        "powerfulMercury": [
            "Ensures the ability to utilize resources effectively and manage complex financial responsibilities.",
            "Grants success in education, business-related matters, and meaningful travels.",
            "Provides a witty and resourceful personality that maintains harmony with relatives."
        ],
        "powerfulJupiter": [
            "Ensures an exceptional educational background and the ability to win intellectual debates.",
            "Grants in-depth knowledge of scriptures combined with a practical, scientific approach.",
            "Provides gains from lineage and constant guidance from wise mentors and grandparents."
        ],
        "powerfulVenus": [
            "Grants a deep sense of beauty and the ability to work with a refined technical mindset.",
            "Ensures success in engineering, graphic design, fashion data handling, or education.",
            "Provides a strong home foundation and significant support from a creative life partner."
        ]
    },
    "nature": {
        "positive": [
            "Eloquent speaker and diplomat who resolves critical situations with artistic intelligence.",
            "Financial wisdom and stability rooted in the ability to make smart investment plans.",
            "Generous and attractive personality with many creative abilities in dance, acting, and art.",
            "Strong love for learning and balanced judgment that builds lasting professional relationships."
        ],
        "negative": [
            "Demanding nature and ego-related challenges causing clashes in personal and professional life.",
            "Tendency toward gossiping, manipulative speech, or flirtatious behavior leading to friction.",
            "Potential for financial losses due to laziness, extravagance, or lack of a disciplined plan.",
            "Risk of health issues related to weight gain or sugar, fueled by overindulgence and overthinking."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Charming and persuasive; magnetic aura; success in public-facing roles like media or counseling."
        },
        {
            "house": "9th House",
            "effect": "Blessed with scholarships and higher studies abroad; support from government and grandparents."
        },
        {
            "house": "10th House",
            "effect": "Success in media, politics, or diplomacy; admired by authority figures for ethical conduct."
        }
    ],
    "keywords": ["mercury", "jupiter", "venus", "conjunction", "diplomacy", "eloquence", "wisdom", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMercury": (
            "A strong Mercury allows you to enjoy life with the full support of your relatives. You are "
            "adept at utilizing resources and managing financial responsibilities. Success flows to you "
            "in business, travel, and education, where your wit and diplomatic resourcefulness keep "
            "all interactions harmonious."
        ),
        "powerfulJupiter": (
            "Jupiter ensures you possess a prestigious educational background and the intellectual depth to "
            "win any debate. You blend philosophical knowledge with a scientific approach, often "
            "receiving guidance from grandparents and mentors that helps you achieve significant "
            "gains from your lineage."
        ),
        "powerfulVenus": (
            "Venus grants you the ability to work with a technical mindset while maintaining a high sense "
            "of beauty. You excel in engineering, design, or fashion, supported by a life partner who "
            "shares your refined tastes. Your command over philosophical knowledge is impressive, "
            "creating a home life that is both successful and harmonious."
        )
    },
    "positiveDetail": (
        "This conjunction is a 'Saraswati-Lakshmi' blend of wisdom, charm, and intelligence. You possess "
        "a positive and attractive personality, known for eloquent speech and the ability to resolve "
        "conflicts with a diplomatic touch. Your marital life is stable and affectionate, enriched "
        "by your spouse's support and your own generosity. You are blessed with 'artistic intelligence' "
        "that brings success in creative fields like dance, acting, and the arts. Jupiter grants "
        "exceptional teaching abilities, while Mercury and Venus together ensure you have refined, "
        "poetic expressions. Your financial wisdom allows you to build a strong professional reputation "
        "based on ethical communication and balanced judgment, ensuring you never face critical "
        "resource shortages when most needed."
    ),
    "negativeDetail": (
        "Negative influences can lead to a demanding nature and ego-related challenges that strain your "
        "professional rank. Affliction can cause you to engage in gossip or manipulative speech, "
        "leading to clashes over property or family money matters. You may suffer from 'superficial "
        "intellect' or flirtatious behavior that causes emotional manipulation in relationships. "
        "Financial losses may occur due to laziness, an extravagant approach, or a lack of focus on "
        "long-term security. A dependence on luxury and a rigid approach to life's shifts can "
        "lead to indecisiveness. Managing your diet and avoiding overthinking is vital to "
        "prevent health issues related to sugar and weight, ensuring your charm remains "
        "an asset rather than a tool for manipulation."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a magnetic aura and refined demeanor. You are naturally persuasive and diplomatic, making you ideal for public-facing roles. Your self-expression is articulate and wise, earning you immense respect in society and a stable, affectionate love life."
        },
        {
            "house": "9th House",
            "detail": "Identity is shaped by higher learning and spiritual knowledge. You likely receive scholarships or government support for studies abroad, guided by a great lineage. Your investment plans are strategically sound, often leading to growth through teaching or legal work."
        },
        {
            "house": "10th House",
            "detail": "Powerhouse for career expansion and high status. You possess the creative intelligence and ethics required to thrive in media, politics, or diplomacy. Your conduct brings admiration from authority figures, ensuring your professional platform is one of wisdom and charm."
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
    # Alphabetical order: Jupiter, Mercury, Venus
    col_name = "Jupiter_Mercury_Venus"
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
    print("[*] Seeding Jupiter_Mercury_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
