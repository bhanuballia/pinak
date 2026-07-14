"""
Seed: Mercury_Venus collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mercury-Venus Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Mercury represents intelligence and speech; Venus represents love and beauty.",
        "Grants a lively, charming personality with eloquence in both verbal and written communication.",
        "Natives are typically polite, clever, and highly skilled in creative arts or professional management.",
        "Bestows professional acumen and a deep understanding of latest trends in one's industry.",
        "Provides materialistic comforts and multiple sources of income with a high reputation."
    ],
    "effects": {
        "powerfulVenus": [
            "Activates artistic instincts, leading to success in music, fashion, and creative technology.",
            "Increases interest in luxury and trust in relationships with strong expressions of intimacy.",
            "Native displays artistic expression through wit and etiquette in all professional ventures."
        ],
        "powerfulMercury": [
            "Grants an intelligent display of expressions through eloquent speech and calculation.",
            "Native may earn through the strength of their voice or in finance and banking sectors.",
            "Success in sectors requiring sharp calculation like Chartered Accountancy or creative technology."
        ]
    },
    "nature": {
        "positive": [
            "Manifests as professional acumen and a great sense of humor that helps climb the success ladder.",
            "Native avoids confrontation and instead shares innovative ideas with clear perspectives.",
            "Strong support from the opposite gender and high willingness to share the horizon of success."
        ],
        "negative": [
            "Affliction may suggest unconventional sexuality or a greed-driven addiction to making money.",
            "May tempt the native to use false communication, promising hope that cannot be fulfilled.",
            "Increased expectations in relationships can lead to personal disappointments if based on false promises."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Charming personality with quick wit and eloquent speech; overall life success."
        },
        {
            "house": "2nd House",
            "effect": "Excellent family relations and multiple monetary gains; high wealth retention."
        },
        {
            "house": "3rd House",
            "effect": "Success in personal and professional endeavors; special bonding with siblings."
        },
        {
            "house": "4th House",
            "effect": "Stability in domestic peace; monetary gains from land and cordial relation with mother."
        },
        {
            "house": "5th House",
            "effect": "Forms 'Lakshmi Narayan Yoga'; success in education for children and strong love bonds."
        },
        {
            "house": "6th House",
            "effect": "Inclination toward affairs; success in vocations like dance, music, and fine arts."
        },
        {
            "house": "7th House",
            "effect": "High status in marriage with dignity and mutual respect between partners."
        },
        {
            "house": "8th House",
            "effect": "Monetary gains through marriage or spouse's earnings; potential for spouse separation."
        },
        {
            "house": "9th House",
            "effect": "Recognition in creative arts and communication; name and fame at home and overseas."
        },
        {
            "house": "10th House",
            "effect": "Appreciation on the work front; ability to crack great deals with clients through speech."
        },
        {
            "house": "11th House",
            "effect": "Fulfillment of desires with multiple income sources and high wealth acquisition."
        },
        {
            "house": "12th House",
            "effect": "Dishonest intellect driven by greed; strong financial strategies and physical intimacy."
        }
    ],
    "keywords": ["mercury", "venus", "conjunction", "lakshmi narayan yoga", "charm", "eloquence", "wealth", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Mercury is the planet of intelligence and communication, while Venus is the planet of "
        "love, beauty, and wealth. Their conjunction creates a lively, charming personality "
        "endowed with eloquence and polite cleverness. This is a powerful combination for "
        "authors, musicians, and actors, as it defines the positivity of love through "
        "communication. Beyond creativity, it grants professional acumen and the ability to stay "
        "ahead of trends, ensuring multiple sources of income and a reputable social standing."
    ),
    "effectsDetail": {
        "powerfulVenus": (
            "When Venus dominates, your artistic instincts are primary. You earn well from creative "
            "talents like fashion and music. You possess a strong expression of physical intimacy "
            " and a deep interest in luxury, always displaying artistic etiquette in your ventures."
        ),
        "powerfulMercury": (
            "When Mercury dominates, your earnings come from the strength of your speech and "
            "intellect. You excel in calculations and money matters, often finding success in "
            "finance, banking, or the creative technology sector through eloquent communication."
        ),
        "positiveConjunction": (
            "A positive conjunction allows you to avoid confrontation and use innovative ideas "
            "to climb the success ladder. Your sense of humor and understanding of latest "
            "trends make you a respected professional who is willing to share success with others."
        ),
        "negativeConjunction": (
            "A negative conjunction may lead to a greed-driven lifestyle where you use false "
            "promises to gain money or manipulate relationships. Without positive strength, "
            "this can suggest unconventional sexuality or a constant thirst for unrealistic "
            "materialistic expectations."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "5th House",
            "detail": "Native experiences the rare Lakshmi Narayan Yoga, leading to high financial gains, educational success for their children, and an exceptionally strong bond with their spouse."
        },
        {
            "house": "10th House",
            "detail": "Professional appreciation is common; entrepreneurs with this placement crack high-value deals with clients thanks to their superior communication and reputation."
        },
        {
            "house": "9th House",
            "detail": "Grants high recognition and fame in creative arts and communication, extending the native's reputation both in their native land and across international borders."
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
    col = db["Mercury_Venus"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Mercury_Venus collection: document {action}.")
    print(f"     Total documents in Mercury_Venus: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Mercury_Venus collection...")
    asyncio.run(seed())
    print("[+] Done.")
