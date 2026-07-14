"""
Seed: Venus_Jupiter collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Venus-Jupiter Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Venus represents love and materialistic gains; Jupiter represents wisdom and expansion.",
        "One of the most auspicious and peaceful conjunctions, highlighting creative talent and deep wisdom.",
        "Grants a fortunate life with prosperous marriage relations and respected professional earnings.",
        "Natives are typically optimistic, generous, social, and well-respected within their society.",
        "Blending of 'spiritual love' (Jupiter foundation) and 'artistic pursuit' (Venus foundation)."
    ],
    "effects": {
        "powerfulVenus": [
            "Activates artistic instincts, leading to success in music, fashion, and creative arts.",
            "Increases interest in luxury and materialistic gains with deep trust in relationships.",
            "Skilled in creative expression, often finding a perfect balance between beauty and wealth."
        ],
        "powerfulJupiter": [
            "Activates a spiritual inclination within the materialistic world, creating a 'sophisticated' persona.",
            "Blesses the native with contentment in marriage, wealth, and the growth of progeny.",
            "Ideal for being a counselor or mentor for children, using creative ways of teaching."
        ]
    },
    "nature": {
        "positive": [
            "Manifests as a peace-loving, harmonious, and generous nature that proactively avoids conflicts.",
            "Inclination toward literature, poetry, and art that often becomes a fine source of income.",
            "Surrounded by congenial, like-minded people who foster intellectual and artistic growth."
        ],
        "negative": [
            "May cause a fluctuation between strict self-discipline and extreme lavishness/expenditure.",
            "Greed or addiction toward making money may clash with the desire for a contented life.",
            "High expectations in relationships can sometimes lead to personal disappointments."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Learned and well-behaved; excellent creative ability (Acting, Filmmaking, Design)."
        },
        {
            "house": "2nd House",
            "effect": "Blesses the native with wealth, luxury, good looks, and excellent communication skills."
        },
        {
            "house": "3rd House",
            "effect": "Proficient in creative works (Acting, Dance, Music) and expert consulting fields."
        },
        {
            "house": "4th House",
            "effect": "Stability and happiness in family matters with success in the home country."
        },
        {
            "house": "5th House",
            "effect": "High intelligence for studies; beneficial for marriage, childbirth, and children's progress."
        },
        {
            "house": "7th House",
            "effect": "Extremely beneficial for marriage; spouse has a sophisticated, cooperative personality."
        },
        {
            "house": "9th House",
            "effect": "Broad-minded and helpful; successful in medicine, law, or the public domain."
        },
        {
            "house": "10th House",
            "effect": "Career success through a consistently honest and sincere approach to work."
        },
        {
            "house": "11th House",
            "effect": "Honest earnings lead to high recognition and reputation; strong support from partner."
        }
    ],
    "keywords": ["venus", "jupiter", "conjunction", "prosperity", "creativity", "wisdom", "auspicious", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Venus is the planet of love and materialistic gains, while Jupiter is the planet of "
        "expansion and wisdom. When they come close together, they create a powerhouse of "
        "fortune, art, and deeper knowledge. The native is usually optimistic and well-respected, "
        "with a zeal to enjoy life to the fullest. Depending on which planet holds the lower "
        "degree, the personality may lean more toward spiritual love and divine devotion "
        "(Jupiter) or creative talents in the fashion and entertainment industries (Venus)."
    ),
    "effectsDetail": {
        "powerfulVenus": (
            "When Venus dominates, your artistic instincts are highly active. You earn well from "
            "creative talents like music and fashion. You value physical intimacy and materialistic "
            "luxury, maintaining a strong sense of trust and expression in all your personal "
            "ventures."
        ),
        "powerfulJupiter": (
            "When Jupiter dominates, your spiritual inclination is activated. You possess "
            "sophisticated behavior and a touch of romance. You are an efficient mentor and "
            "counselor, finding deep contentment in marriage, family, and the expansion of wisdom."
        ),
        "positiveConjunction": (
            "A positive conjunction makes you a prime example of a peace-loving person. You avoid "
            "conflict and prefer compromise. Your interests in literature, poetry, and music "
            "not only provide emotional satisfaction but often become a stable source of income."
        ),
        "negativeConjunction": (
            "A negative conjunction leads to greed or addiction to money, clashing with the "
            "need for a contented life. You may struggle to find the middle ground between "
            "lavishness and discipline, leading to fluctuations in both your finances and "
            "relationships."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Natives have a brilliant blend of creative and intellectual skills, often excelling in interior design, teaching, or modeling."
        },
        {
            "house": "7th House",
            "detail": "Considered highly beneficial for marital relations, ensuring a spouse who is not only beautiful but also deeply cooperative and sophisticated."
        },
        {
            "house": "10th House",
            "detail": "Success is achieved through an honest and sincere work approach, leading to a prestigious career and high social status."
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
    col = db["Venus_Jupiter"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Venus_Jupiter collection: document {action}.")
    print(f"     Total documents in Venus_Jupiter: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Venus_Jupiter collection...")
    asyncio.run(seed())
    print("[+] Done.")
