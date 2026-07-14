"""
Seed: Jupiter_Mars_Sun collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mars-Jupiter Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a powerful, dynamic personality driven by willpower, wisdom, and authority.",
        "Combines Soul (Sun), Action (Mars), and Wisdom (Jupiter) for a forceful and righteous life path.",
        "Natives are known for making decisions that consider everyone's welfare while maintaining a fierce, brave identity."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, father, government status, vitality, ego",
        "Mars": "Action, courage, willpower, resilience, physical strength, real estate",
        "Jupiter": "Wisdom, expansion, wealth, divine grace, morality, law, spiritual upliftment"
    },
    "effects": {
        "powerfulSun": [
            "Grants high self-esteem and a successful career as a government or administrative official.",
            "Blesses with sharp intelligence and right decision-making ability even in challenging times.",
            "Ensures strong immunity and vitality, though may lead to a workaholic approach."
        ],
        "powerfulMars": [
            "Ensures stability in property-related matters and significant growth on the financial front.",
            "Grants command over emotions, channeling energy into productive professional ventures.",
            "Encourages participation in religious communities, bringing a new perspective to life."
        ],
        "powerfulJupiter": [
            "Grants a positive, influential personality with gains from the government and elders.",
            "Provides a strong foundation for education and high-ranking success as a professor or mentor.",
            "Ensures facilities of royal or government property and support from siblings/maternal side."
        ]
    },
    "nature": {
        "positive": [
            "Brave and confident personality focused on the welfare of everyone.",
            "Highly skilled orator capable of influencing the masses with truthful and fierce words.",
            "Success in engineering, bureaucracy, political leadership, and high-authority government roles.",
            "Sacrifices self-focus for the betterment of society, driven by high moral clarity."
        ],
        "negative": [
            "Highly irritable, impulsive, and prone to jealousy when afflicted.",
            "Stubborn nature and aggression leading to legal challenges and loss of paternal wealth.",
            "Impatience in attaining success; may choose shortcuts that eventually lead to loss of status.",
            "Arrogant, self-righteous, and domineering attitude if ego overrides wisdom."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Charismatic and strong personality; natural leadership with high social status."
        },
        {
            "house": "3rd House",
            "effect": "Courageous and ready to take risks; success through self-effort and integrity."
        },
        {
            "house": "4th House",
            "effect": "Stability in owning vehicles and property; strong cultural values and inheritance gains."
        },
        {
            "house": "5th House",
            "effect": "Sharp intelligence in resolving conflicts; success in legal, banking, and finance sectors."
        },
        {
            "house": "9th House",
            "effect": "Philosophical approach with blessings from religious mentors; success after higher studies."
        }
    ],
    "keywords": ["sun", "mars", "jupiter", "conjunction", "power", "wisdom", "courage", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A positive Sun in conjunction with Mars and Jupiter helps you have high self-esteem and a "
            "successful career in government. You find support from senior officials and possess a "
            "sharp intelligence that guides you through challenging times. While it grants strong "
            "immunity, it may also lead to ego clashes in marital life due to a workaholic nature."
        ),
        "powerfulMars": (
            "Powerful Mars brings desired growth on the financial front and stability in real estate "
            "matters. You have strong command over your emotions, which you channel into professional "
            "success. Support from the maternal family in education is likely, and you may find deep "
            "stability through involvement in religious or community work."
        ),
        "powerfulJupiter": (
            "A strong Jupiter grants a positive personality and gains from the government in educational "
            "matters. You may acquire a good rank in the educational sector, possibly as a professor. "
            "It ensures support from siblings and maternal relatives, providing a solid foundation "
            "for professional success and wealth accumulation."
        )
    },
    "positiveDetail": (
        "This combination makes you known for wise decisions that take everyone's welfare into account. "
        "You are fortunate, wealthy, and brave, possessing a truthful and fierce personality. You "
        "excel in leadership roles where you can sacrifice a self-focused approach for the betterment "
        "of society. As a skilled orator, you influence masses and rise to prominent roles such as "
        "ministers, political leaders, or judges. Your career success is often marked by public "
        "influence in fields like politics, law, administration, or engineering."
    ),
    "negativeDetail": (
        "Affliction can manifest as a highly irritable and impulsive personality, driven by jealousy and "
        "ego. You may struggle with an impatient rush for success, leading to poor investment plans "
        "or legal challenges. A self-righteous attitude can cause professional setbacks and "
        "alienation in relationships. Aggression and a drive for total control can cause losses "
        "in inheritance and a decline in social status. Marital life may also suffer due to "
        "a fiery temperament and a lack of empathy."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a charismatic and commanding presence with natural leadership qualities. Good health and social status are assured, though a tendency to dominate others must be checked to maintain relationship harmony."
        },
        {
            "house": "3rd House",
            "detail": "Identity is shaped by daring initiatives and risk-taking. Luck often favors self-effort in fields like police work, finance, or education. Maturity and knowledge help in competitive relationships with siblings."
        },
        {
            "house": "4th House",
            "detail": "Ensures a big house, vehicles, and a strong sense of cultural values. The native takes pride in property and is likely to acquire inheritance. Affliction, however, can disturb inner peace and lead to family disputes or wealth loss."
        },
        {
            "house": "5th House",
            "detail": "Blesses the native with sharp intelligence and analytical decision-making skills. Success is indicated in legal, banking, and investment sectors. The native finds joy and success in love relationships and receives strong support from children."
        },
        {
            "house": "9th House",
            "detail": "Brings good luck and blessings from religious mentors. Success follows higher studies in law, philosophy, or politics. Long-term material success is backed by family support and the wise utilization of religious/scriptural knowledge."
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
    # Alphabetical order: Jupiter, Mars, Sun
    col_name = "Jupiter_Mars_Sun"
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
    print("[*] Seeding Jupiter_Mars_Sun triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
