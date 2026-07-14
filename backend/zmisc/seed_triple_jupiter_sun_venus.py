"""
Seed: Jupiter_Sun_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Jupiter-Venus Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly moral, optimistic, and luxurious personality with royal status.",
        "Combines Soul (Sun), Wisdom (Jupiter), and Beauty (Venus) for a harmonious blend of wealth and values.",
        "Natives possess exceptional leadership potential, a refined sense of aesthetics, and strong educational foundations."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, father, government status, high self-confidence",
        "Jupiter": "Wisdom, education, financial responsibility, problem-solving, mentors",
        "Venus": "Luxury, comfort, eye for detail, creative fields, royal vibe"
    },
    "effects": {
        "powerfulSun": [
            "Grants high morals and a strong educational background with perfection in skills.",
            "Ensures support from senior authorities and helps excel with an intellectual approach.",
            "Increases the likelihood of receiving scholarships and finding the right mentor."
        ],
        "powerfulVenus": [
            "Provides a luxurious lifestyle, comfort, and significant government support.",
            "Instills a 'royal vibe' in the personality and a sharp eye for detail in decision-making.",
            "Ensures success in creative fields like arts, fashion, and the financial sector."
        ],
        "powerfulJupiter": [
            "Ensures success in higher education and a mature approach to financial responsibilities.",
            "Grants a problem-solving approach that makes the native an ideal team or company leader.",
            "Encourages an optimistic outlook, providing hope and solutions even in challenging situations."
        ]
    },
    "nature": {
        "positive": [
            "Harmonious blend of wealth, values, and expression with leadership potential.",
            "Early recognition and fame, attaining a high rank in society and the workplace.",
            "Refined sense of style and ability to balance higher values with worldly enjoyment.",
            "Strong literary and scholarly abilities with committed ethical judgment."
        ],
        "negative": [
            "Challenges due to ego clashes, aggression, and unrealistic idealistic expectations.",
            "Potential for health issues related to the liver, eyes, or skin due to fiery/benefic friction.",
            "Risk of uncontrolled desire for money leading to losses in share markets or gambling.",
            "Relationship challenges caused by overindulgence, addiction, or excessive spending."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Blend of wisdom, ethics, charm, and self-confidence; strong physical appearance."
        },
        {
            "house": "2nd House",
            "effect": "Sweet voice and eloquence; management of family wealth and gains from inheritance."
        },
        {
            "house": "4th House",
            "effect": "Big family and beautiful home interiors; support from mother and maternal family."
        },
        {
            "house": "5th House",
            "effect": "Fame and multiple income sources; intellectual success in arts, law, or philosophy."
        },
        {
            "house": "9th House",
            "effect": "Grace, artistic talent, and leadership in religious or philosophical circles; travel gains."
        }
    ],
    "keywords": ["sun", "jupiter", "venus", "conjunction", "wealth", "wisdom", "luxury", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A powerful Sun in this conjunction grants high morals and strong self-confidence. You possess a "
            "perfectionist approach to skills and excel in your career through the support of senior "
            "authorities. This combination also makes you an ideal candidate for educational "
            "scholarships and connects you with the right mentors at pivotal moments."
        ),
        "powerfulVenus": (
            "Venus provides you with a luxurious lifestyle and a royal aura. Your decision-making abilities "
            "are defined by an eye for detail, allowing you to fix loopholes and add the final touch "
            "to complex projects. You excel in creative fields such as fashion and the arts, while "
            "also thriving in the financial sector."
        ),
        "powerfulJupiter": (
            "A strong Jupiter ensures excellence in education and a mature approach toward financial "
            "responsibilities. You are a natural problem-solver, providing hope and solutions to others "
            "even in challenging times. This makes you an ideal leader for teams and organizations, "
            "always guiding your company with wisdom and expansion."
        )
    },
    "positiveDetail": (
        "This triple conjunction represents royal status, high morals, and a harmonious blend of wealth. "
        "You possess a refined sense of style and aesthetics, radiating optimism that leads to "
        "early recognition and fame. You can balance higher spiritual values with worldly "
        "enjoyment, making you ideal for public roles in law, the arts, or education. Your "
        "intellectual and ethical judgment, combined with scholarly abilities, makes you a "
        "great guide or counselor. Family ties are strong, and you likely enjoy the company "
        "of a large, influential family."
    ),
    "negativeDetail": (
        "Challenges arise from ego clashes and a self-centered approach when the Sun's fire affects the "
        "benefic nature of Jupiter and Venus. Uncontrolled desires for money can lead to losses "
        "through gambling or hasty investments. Pride and idealism may lead to unrealistic "
        "expectations in relationships, while overindulgence in food or luxury can affect your "
        "health and social standing. Issues related to the liver, eyes, or skin may manifest, "
        "and excessive spending can cause significant domestic strain."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a personality that is a perfect blend of wisdom, charm, and beauty. You have a balanced temperament with strong ethics and high idealism, making you a charismatic leader capable of running a large team with self-confidence."
        },
        {
            "house": "2nd House",
            "detail": "Blessed with eloquence and a sweet voice, you use your traits to manage family finances and responsibilities. Success in law, education, and mass communication is likely. You feel a deep pride in your family lineage and enjoy gains from inheritance."
        },
        {
            "house": "4th House",
            "detail": "Identity is strongly tied to a big family and a beautiful home with exquisite interiors. Your mother and maternal family play an important role in your career and wealth management. Success is indicated in fashion, art, or the education sector."
        },
        {
            "house": "5th House",
            "detail": "Ensures fame and recognition for your creative efforts. You possess multiple sources of income and achieve high growth in law or philosophy. A large, harmonious friend circle enriches your life, and you find joy in intellectual achievements."
        },
        {
            "house": "9th House",
            "detail": "Identity is shaped by grace, artistic talent, and an authoritative belief system. You excel as a leader in religious or philosophical circles, benefiting from long-distance travel and the profound guidance of grandparents and elders."
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
    # Alphabetical order: Jupiter, Sun, Venus
    col_name = "Jupiter_Sun_Venus"
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
    print("[*] Seeding Jupiter_Sun_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
