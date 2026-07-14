"""
Seed: Jupiter_Moon_Sun collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Jupiter Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a pious and powerful personality with high moral values.",
        "Combines Soul (Sun), Mind (Moon), and Wisdom (Jupiter) for a righteous life path.",
        "Natives are often ministerial in nature, possessing deep scientific and philosophical knowledge."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, father, government status, ego",
        "Moon": "Mind, education, mother, emotional energy, food",
        "Jupiter": "Wisdom, righteousness, grandparents, higher learning, expansion"
    },
    "effects": {
        "powerfulSun": [
            "Grants high moral values and the ability to utilize wisdom for power.",
            "Blesses with clarity and decision-making abilities, though often through learning from challenges.",
            "Ensures gains from the government related to wealth and status."
        ],
        "powerfulMoon": [
            "Grants a strong foundation in health, family, and education from a young age.",
            "Provides high spiritual and emotional energy, though may lead to an overthinking personality.",
            "Ensures support and guidance from the mother and maternal family."
        ],
        "powerfulJupiter": [
            "Ensures confidence, clarity, and harmony in all decisions.",
            "Grants excellence in professions like teaching, law, counseling, and spiritual leadership.",
            "Instills a natural sense of righteousness and deep compassion for others."
        ]
    },
    "nature": {
        "positive": [
            "Pious nature with strong affection and harmony in all relationships.",
            "Ministerial qualities with a firm disposition and command over multiple languages.",
            "High intellect in philosophy, administration, and service-related fields.",
            "Success in banking, finance, and high-authority government posts."
        ],
        "negative": [
            "Psychological challenges and discomfort in sharing views if afflicted.",
            "Tendency to overrule social norms and struggle with career stability (fickle mind).",
            "Potential for inner transformation struggles due to ego clashes and rigidity.",
            "Hurdles in completing education or inability to execute tasks on time."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Mix of ego-mind-wisdom; high moral values and support from elders."
        },
        {
            "house": "5th House",
            "effect": "High intellectual approach; excellent for finance, law, and research-based strategy."
        },
        {
            "house": "9th House",
            "effect": "Philosophical approach; deep knowledge of religion and obedience to higher knowledge."
        },
        {
            "house": "10th House",
            "effect": "Ability to lead big organizations; success in public administration as a balanced boss."
        }
    ],
    "keywords": ["sun", "moon", "jupiter", "conjunction", "wisdom", "pious", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A powerful Sun in this combination will give high moral values in conjunction with the Moon and Jupiter. "
            "It will utilize wisdom in acquiring power and status, providing support from the father and facilities "
            "from the government. It grants the ability to lead teams and run a political career with determination. "
            "The close conjunction with Jupiter helps you have clarity, though the combustion of Jupiter may "
            "force you to face challenges first. Pride and a self-centered approach could manifest if the Sun "
            "dominates excessively."
        ),
        "powerfulMoon": (
            "The Moon in a powerful position grants a strong basic foundation in health, food, family, and education. "
            "You will find guidance from your mother and maternal family. However, in close conjunction with the Sun, "
            "it may create an overthinking personality. If not in a friendly sign, it can lead to emotional clashes, "
            "yet it also manifests high spiritual energy and success as a service-oriented personality."
        ),
        "powerfulJupiter": (
            "A powerful Jupiter helps you be the wise person among family and colleagues. Your presence ensures harmony. "
            "It grants confidence, clarity, and guidance from grandparents. A natural sense of righteousness and "
            "deep compassion will be present in all your work. You will likely excel in professions like teaching, "
            "law, counseling, or spiritual leadership."
        )
    },
    "positiveDetail": (
        "This three-planet conjunction will make you pious and affectionate toward relatives. You have the ability "
        "to sustain all relationships with harmony. It blesses you with ministerial qualities and a firm disposition. "
        "You are an expert in science and a master of multiple languages. This combination is excellent for attaining "
        "success abroad and ensures a strong educational background. Success in the education sector, finance, or "
        "banking is highly likely, often leading to high-authority government posts."
    ),
    "negativeDetail": (
        "While these three planets are friends, affliction can cause psychological challenges, making you uncomfortable "
        "sharing your ideas. You may overrule social norms or find it difficult to stick to one job, leading to career "
        "instability. Anger issues or a cunning, fickle mind could manifest, leading to challenges and loss. "
        "Inner transformation may be painful due to ego clashes and a rigid approach. You may be skilled but unable "
        "to execute tasks on time, struggling with a lack of focus and confusion in career goals."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Gives a personality that is a mix of ego, mind, and wisdom. In a positive status, it grants high moral values and the ability to execute tasks in challenging situations with the support of elders. Excellent for careers in government, healing, or spiritual institutions."
        },
        {
            "house": "5th House",
            "detail": "Blesses you with high intellectual ability and quick thinking. Strong in strategy, research, and discretion. Financial gains are often made through teaching, advisory work, or finance-related sectors."
        },
        {
            "house": "9th House",
            "detail": "Grants a philosophical approach and in-depth knowledge of religion and spirituality. Ideal for becoming a guide or preacher with moral authority. You will obey rules and learn the value of promises, following your father's guidance closely."
        },
        {
            "house": "10th House",
            "detail": "Gives the synergy to run big organizations and lead teams as a balanced boss. You possess the wisdom to know when to accept or deny suggestions, leading to great success in public administration."
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
    # Sorting: Jupiter, Moon, Sun
    col_name = "Jupiter_Moon_Sun"
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
    print("[*] Seeding Jupiter_Moon_Sun triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
