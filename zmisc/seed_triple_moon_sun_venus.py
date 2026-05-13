"""
Seed: Moon_Sun_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Venus Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a powerful, attractive personality with a regal and creative touch.",
        "Combines Soul (Sun), Mind (Moon), and Beauty (Venus) for grace, charm, and diplomatic skill.",
        "Natives often enjoy fame, financial success, and a luxurious lifestyle with deep emotional depth."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, father, high status, vitality",
        "Moon": "Mind, emotional care, mother, basic comforts, adaptability",
        "Venus": "Beauty, creativity, life partner, luxury, social validation"
    },
    "effects": {
        "powerfulSun": [
            "Grants clarity in professional decision-making and strong support from elders/father.",
            "Ensures a high rank in society and easy recognition for one's efforts.",
            "Provides a self-disciplined approach and strong physical vitality."
        ],
        "powerfulMoon": [
            "Ensures a strong foundation in education and deep emotional connection with the mother.",
            "Provides a luxurious lifestyle with a focus on healthy diet and nourishment.",
            "Grants gains from maternal property and a high sense of emotional adaptability."
        ],
        "powerfulVenus": [
            "Gives a creative, regal touch and a sharp eye for detail in all tasks.",
            "Ensures success in technical or creative fields like engineering, interior design, or fashion.",
            "Brings support and care from a life partner and high moral/financial values."
        ]
    },
    "nature": {
        "positive": [
            "Leadership qualities with the ability to manage large teams through empathy.",
            "Diplomatic approach with grace, charm, and a refined artistic sense.",
            "Success in legal, governmental, medical, and luxury-related sectors.",
            "Fulfillment of desires and a significant rise in status after marriage."
        ],
        "nature": [
            "Challenges due to ego clashes and inner turmoil during relationship disputes.",
            "Potential for indigestion, bone-related health issues, and inheritance-related legal stress.",
            "Mood swings and a need for constant validation causing emotional instability.",
            "Difficulty in forming sincere, lasting bonds if the desire for admiration becomes too self-centered."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Attractive, disciplined personality with a strong attachment to power and homeland."
        },
        {
            "house": "4th House",
            "effect": "Happiness, good education, and unique artistic sense in home decoration; political success."
        },
        {
            "house": "10th House",
            "effect": "Leadership roles in luxury industries, fashion, or beauty; excellent public image."
        },
        {
            "house": "11th House",
            "effect": "Multiple sources of income and achievement of long-held dreams through social networks."
        }
    ],
    "keywords": ["sun", "moon", "venus", "conjunction", "creativity", "luxury", "diplomacy", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A Sun-Moon-Venus conjunction with a prominent Sun gives exceptional clarity on the professional front. "
            "It grants a high status and strong support from elders and the father. Recognition and appreciation "
            "come easily, allowing the native to lead teams with authority and maintain a self-disciplined, "
            "high-vitality approach."
        ),
        "powerfulMoon": (
            "With the Moon in high dignity, the native demands emotional care and finds it easy to provide "
            "comforts for others. A luxurious lifestyle with high-quality nourishment is common. The mother "
            "plays a pivotal role in shaping the native's journey, providing a strong foundation in education "
            "and potential property gains through the maternal line."
        ),
        "powerfulVenus": (
            "Venus gives a creative and regal touch. The native excels in technical skills like engineering "
            "or fashion design. It brings disciplined financial growth and deep support from a life partner. "
            "While it fosters a strong desire for beauty and aesthetics, it may also lead to a self-centered "
            "attitude or over-concern with social validation."
        )
    },
    "positiveDetail": (
        "This combination develops a strong personality with clear leadership qualities. The native's "
        "empathy helps build a massive network and bond well with society. A refined sense of beauty, "
        "diplomacy, and artistic grace makes the native a wise decision-maker. Success is indicated in "
        "governmental, legal, and medical sectors. Marital life is generally successful, with the "
        "native expressing deep care and guidance, often leading to a rise in status after the union."
    ),
    "negativeDetail": (
        "Challenges often arise from ego clashes and domestic instability. There may be legal hurdles "
        "regarding inheritance or property. Overthinking and a lack of empathy can damage workplace "
        "relationships. In close conjunction, it may manifest as an inflated ego or emotional instability, "
        "leading to mood swings and difficulty in forming lasting, sincere bonds. Indigestion and "
        "bone health may also be areas of physical concern."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Gives a strong, attractive, and disciplined personality with an introspective approach. Perfection in skills is sought, but overthinking or a rigid approach in relationships can create clashes with partners. The influence of both parents is significant in each life choice."
        },
        {
            "house": "4th House",
            "detail": "Provides general happiness, unique aesthetic taste in home decoration, and a soft, family-oriented personality. Often leads to success in political careers or professions related to water resources, food business, or aeronautical engineering."
        },
        {
            "house": "10th House",
            "detail": "Rules the career with charm and diplomacy. The native is an excellent team player with high emotional intelligence, excelling in artistic careers, luxury industries, fashion, and high-end beauty sectors."
        },
        {
            "house": "11th House",
            "detail": "Ensures multiple sources of income and the achievement of long-held aspirations. The native forms strong social alliances and receives guidance from elder siblings or neighbors, attracting wealth through extensive social networks."
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
    # Alphabetical order: Moon, Sun, Venus
    col_name = "Moon_Sun_Venus"
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
    print("[*] Seeding Moon_Sun_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
