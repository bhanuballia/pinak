"""
Seed: Jupiter_Mars_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mars-Jupiter-Venus Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a vibrant, charismatic, and spiritually active personality.",
        "Combines Passion (Mars), Wisdom (Jupiter), and Grace (Venus) for creative leadership and diplomatic success.",
        "Natives are known as 'Philosophical Warriors,' balancing bold ambition with ethical strength and artistic intelligence."
    ],
    "planetRoles": {
        "Mars": "Action, courage, ambition, willpower, physical drive",
        "Jupiter": "Wisdom, expansion, moral values, mentors, higher education, spiritual drive",
        "Venus": "Art, beauty, romance, social charm, luxury, refined strategy"
    },
    "effects": {
        "powerfulMars": [
            "Ensures ambition is fueled by the courage to overcome rivals with ethical strength.",
            "Grants a dynamic and socially magnetic personality capable of balanced actions.",
            "Provides the drive to achieve success through a blend of physical vitality and charm."
        ],
        "powerfulJupiter": [
            "Ensures an optimistic approach and a vibrant, magnetic presence in society.",
            "Grants success in leadership or social fields such as law, education, or diplomacy.",
            "Provides a passionate approach supported by a refined plan and a large following."
        ],
        "powerfulVenus": [
            "Grants soft but disciplined personal traits with a strong inclination toward creative work.",
            "Ensures success in artistic, luxury-related, or high-profile leadership roles.",
            "Provides the ability to attract wealth, admiration, and romantic attention effortlessly."
        ]
    },
    "nature": {
        "positive": [
            "Wise and mature personality who is passionate about knowledge, ideas, and spiritual wisdom.",
            "Bold creative character who uses art to show reality to society with courage and grace.",
            "Optimistic risk-taker with financial growth driven by ethical decisions and mentorship.",
            "Socially popular person known for motivational speeches and a generous romantic partner."
        ],
        "negative": [
            "Overindulgence, lustful ambitions, and unrealistic goals due to overconfidence.",
            "Extravagant approach and restrictive behavior toward partners causing ego clashes.",
            "Misplaced passion or spiritual arrogance leading to lack of discipline and financial loss.",
            "Scattered creative focus and a lack of emotional harmony in family and marital life."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong and confident; support from mentors; high rank in professional fields."
        },
        {
            "house": "4th House",
            "effect": "Abundance of assets; deep attachment to lineage and ancestral property; warm but protective."
        },
        {
            "house": "5th House",
            "effect": "Artistically gifted; success in higher studies abroad; courage to take wise risks."
        },
        {
            "house": "9th House",
            "effect": "The Philosophical Warrior; success in publishing or spiritual travels; support from elders."
        },
        {
            "house": "10th House",
            "effect": "Creative leadership; excel in finance, law, or arts; ethical direction and persistence."
        }
    ],
    "keywords": ["mars", "jupiter", "venus", "conjunction", "leadership", "grace", "ambition", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMars": (
            "A positive Mars fuels your ambition and gives you the courage to overcome rivals. You possess "
            "strong ethical strength and a dynamic, socially magnetic personality. Your actions are "
            "balanced by charm, making you capable of achieving success in any competitive environment."
        ),
        "powerfulJupiter": (
            "Jupiter ensures you have a vibrant, magnetic presence and an optimistic approach to life. You "
            "excel in leadership roles within the law, arts, or diplomacy sectors. Your passionate "
            "approach is guided by a refined strategy, earning you a large number of followers."
        ),
        "powerfulVenus": (
            "Venus grants you a soft yet disciplined set of traits, perfect for creative work and architecture. "
            "You attract wealth and admiration easily, succeeding in artistic or luxury-related fields. "
            "Your romantic life is marked by attention and a refined, passionate approach to love."
        )
    },
    "positiveDetail": (
        "This conjunction blends the fire of Mars with the expansion of Jupiter and the grace of Venus, "
        "making you a wise, mature, and passionate individual. You are eager to learn and possess "
        "the romantic idealism required to build a beautiful life. As a bold creative, you have "
        "the courage to reflect reality through your art, supported by a strong moral drive. You "
        "are an optimistic risk-taker whose financial growth is rooted in wise decisions and "
        "energetic mentorship. Your spiritually active personality and motivational speeches "
        "make you socially popular, while a generous romantic partner ensures a blissful and "
        "supportive marital life with the blessing of children."
    ),
    "negativeDetail": (
        "Negative influences can drag you toward overindulgence and lustful, unrealistic ambitions. Overconfidence "
        "may lead to financial losses or an extravagant approach that depletes your resources. "
        "Affliction can cause ego clashes and emotional drama within the family, with a "
        "tendency to be restrictive toward your partner. You might suffer from spiritual "
        "arrogance or a misplaced passion that scatters your creative focus. Conflict "
        "between your actions and values can create professional hurdles, while a lack "
        "of discipline can lead to a loss of harmony in both your creative and personal life."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a strong, confident personality backed by the support of mentors and elders. You enjoy a high professional rank and gains from the government, always guided by a deep understanding of spirituality and siblings' support."
        },
        {
            "house": "4th House",
            "detail": "Identity is centered on family pride and basic comforts. You likely possess a large, inherited house and are deeply attached to ancestral land and property. Your domestic life is warm and protective, enriched by the company of wise mentors."
        },
        {
            "house": "5th House",
            "detail": "Powerhouse for artistic gifts and higher education abroad. You possess the courage to take wise risks in performance or teaching, often earning scholarships and multiple sources of income through your philosophical intelligence."
        },
        {
            "house": "9th House",
            "detail": "Known as the 'Philosophical Warrior,' you enjoy the favor of luck and support from elders. Your decision-making in spirituality and publishing is exceptional, ensuring a successful love life and profound success in foreign travels."
        },
        {
            "house": "10th House",
            "detail": "Ensures success in leadership, finance, arts, or teaching. You blend ambition with ethical direction and grace, excelling in roles that require both drive and diplomacy. Guidance from your father and bosses helps you achieve lasting respect."
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
    # Alphabetical order: Jupiter, Mars, Venus
    col_name = "Jupiter_Mars_Venus"
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
    print("[*] Seeding Jupiter_Mars_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
