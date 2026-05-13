"""
Seed: Mars_Saturn_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mars-Venus-Saturn Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly ambitious, disciplined, and creatively strategic personality.",
        "Combines Passion (Mars), Grace (Venus), and Restriction (Saturn) for structured ambition and goal-oriented leadership.",
        "Natives are known for their ability to work under pressure, balancing intense emotions with practical realism and an eye for professional aesthetics."
    ],
    "planetRoles": {
        "Mars": "Action, courage, ambition, willpower, protective nature, physical vitality",
        "Venus": "Art, beauty, romance, social harmony, refined strategy, aesthetic sense",
        "Saturn": "Discipline, persistence, structure, maturity, professional stability, cautious action"
    },
    "effects": {
        "powerfulMars": [
            "Grants high and intense ambition combined with an attractive, assertive personality.",
            "Ensures the native is protective toward relationships, career, and financial matters.",
            "Provides the drive to achieve success through balanced actions and tactical intelligence."
        ],
        "powerfulVenus": [
            "Grants an eye for detail and commitment in relationships with a strategic financial approach.",
            "Ensures charm and grace under pressure, preferring stability over fleeting romance.",
            "Provides luxury and comfort to loved ones while maintaining a refined sense of aesthetic."
        ],
        "powerfulSaturn": [
            "Manifests as a highly disciplined personality capable of consistent effort over long periods.",
            "Ensures the ability to manage complex, long-term projects with responsibility and caution.",
            "Provides success in law, government, real estate, and leadership through structured persistence."
        ]
    },
    "nature": {
        "positive": [
            "Passionate and committed approach to work and love, favoring long-term bonds.",
            "Focused ambition with a structured approach to meeting goals and professional perfection.",
            "Success in architecture, fashion, law, diplomacy, engineering, or administrative roles.",
            "Ethical personality who balances bold action with an aesthetic sense and calculated restraint."
        ],
        "negative": [
            "Suppressed passion and frustrated desires leading to cold romance or delayed marriage.",
            "Harsh personality in love life with overprotective or obsessive affection traits.",
            "Emotional challenges on professional fronts due to uncontrolled anger or jealousy.",
            "Possessiveness and lack of empathy leading to friction with female relatives or friends."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Powerful yet complex; disciplined and determined; success in engineering or architecture."
        },
        {
            "house": "4th House",
            "effect": "Wealthy family background; gain of property; strict maternal discipline leads to success."
        },
        {
            "house": "10th House",
            "effect": "High professional rank and status; career-oriented with a blend of creativity and structure."
        }
    ],
    "keywords": ["mars", "venus", "saturn", "conjunction", "ambition", "discipline", "aesthetics", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMars": (
            "A strong Mars fuels intense ambition and an attractive, authoritative presence. You are "
            "protective of your achievements and relationships, using your courage and tactical "
            "smartness to lead teams. Your energy is stabilized by discipline, allowing you to "
            "perform exceptionally well under pressure."
        ),
        "powerfulVenus": (
            "Venus provides an eye for detail and a strategic approach to finance. You prefer stability "
            "and security over fleeting romance, always providing comfort and luxury to those you "
            "live with. Your aesthetic sense adds a layer of charm and grace to your "
            "professional and personal life."
        ),
        "powerfulSaturn": (
            "Saturn manifests as the ability to work with consistent, tireless effort. You excel in "
            "managing long-term projects and approach both life and love with caution and "
            "responsibility. This discipline ensures you attain growth in real estate, law, "
            "or government roles, often inheriting gains through persistence."
        )
    },
    "positiveDetail": (
        "This conjunction blends the fire of Mars with the refinement of Venus and the structure of Saturn. "
        "You possess a passionate and committed approach, known for your hard work and practical "
        "ambition. You are a 'Passionate Perfectionist' who values quality and calculated restraint. "
        "Success is indicated in architecture, fashion, diplomacy, or administrative roles, where "
        "you demonstrate bold action balanced with an ethical personality. Your domestic life is "
        "disciplined yet loyal, and over time, your consistency earns you deep respect and trust. "
        "You are an optimistic risk-taker who never hesitates to help others, ensuring long-term "
        "security for your family through active and cautious financial investments."
    ),
    "negativeDetail": (
        "Negative influences manifest as suppressed passion and 'rigid sensuality,' which can delay "
        "marital happiness or cause coldness in relationships. You may struggle with obsessive "
        "affection or an overprotective nature that restricts your partner. Affliction can turn "
        "ambition into 'lustful desires' and cause ego clashes or emotional drama within the "
        "family. Challenges with female relatives, a domineering approach, or a lack of "
        "empathy can hinder your peace. You may face internal conflicts between desire and "
        "restraint, leading to guilt around pleasure or bitter emotional experiences. "
        "Managing anger and possessiveness is vital for maintaining harmony in your "
        "domestic and professional life."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a powerful, complex personality with a calculated approach toward goals. You are attractive yet reserved, commanding respect through discipline. While you may face aggression issues in relationships, your ability to handle conflict leads to success in engineering or art."
        },
        {
            "house": "4th House",
            "detail": "Identity is rooted in a wealthy and disciplined family background. Your mother likely plays a significant role in your education, exhibiting strict discipline. Gains in property and public administration are assured, though you must fight to maintain personal emotional peace."
        },
        {
            "house": "10th House",
            "detail": "Powerhouse for career rank and high status. You are highly driven and persevere through long-term planning. Success in architecture, law, or finance is favored, as you blend creative vision with technical mindset and sound work ethics."
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
    # Alphabetical order: Mars, Saturn, Venus
    col_name = "Mars_Saturn_Venus"
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
    print("[*] Seeding Mars_Saturn_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
