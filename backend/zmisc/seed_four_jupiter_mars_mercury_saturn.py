"""
Seed: Jupiter_Mars_Mercury_Saturn collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mars-Mercury-Jupiter-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a highly balanced, heroic, and creative genius who blends courage with profound wisdom.",
        "Combines Drive (Mars), Logic (Mercury), Wisdom (Jupiter), and Discipline (Saturn) to overcome all opposition.",
        "Natives are articulate and victorious over enemies but often struggle with poverty and significant marital issues."
    ],
    "planetRoles": {
        "Mars": "Heroism, courage, aggression, candid nature, drive, harshness",
        "Mercury": "Logic, articulation, creative genius, problem-solving, intellect",
        "Jupiter": "Wisdom, good virtues, pious path, reputation, politeness",
        "Saturn": "Discipline, poverty, overcoming enemies, marital suffering, structure"
    },
    "effects": {
        "powerfulSun": [
            "Note: This conjunction lacks the Sun; its authority is provided by Mars' courage and Jupiter's reputation.",
            "Natives rely on their heroic character and problem-solving skills to gain status.",
            "Success comes through defeating opposition and following a pious path."
        ],
        "powerfulMars": [
            "Grants a heroic character that is well-balanced and filled with the virtues of a gallant individual.",
            "Ensures the native has the courage to topple enemies and overcome any opposition.",
            "Provides an assertive drive that can sometimes turn aggressive, harsh, or overly candid."
        ],
        "powerfulMercury": [
            "Grants exceptional intellect and articulation, making the native a creative genius.",
            "Ensures the native has a solution to almost any problem that may strike.",
            "Provides the logic to sidestep challenges gracefully, enabling a smoother life path."
        ],
        "powerfulJupiter": [
            "Grants profound wisdom and politeness, elevating the native to a highly respected social status.",
            "Ensures the native follows a pious path and holds strong moral virtues.",
            "Provides a good reputation, especially among high-ranking individuals and societal leaders."
        ],
        "powerfulSaturn": [
            "Grants the discipline to completely crush and topple enemies and opposition.",
            "Ensures a tough, resilient approach to life's harsh realities.",
            "Provides structural challenges, notably leading to a poor wealth profile (poverty) and marital suffering."
        ]
    },
    "nature": {
        "positive": [
            "Heroic, balanced, and gallant individual who possesses strong moral and intellectual virtues.",
            "Creative genius with an articulate mind, capable of solving complex problems effortlessly.",
            "Respected by high-ranking individuals for their wisdom, politeness, and pious life path.",
            "Unbeatable in conflict, possessing everything needed to topple enemies and opposition."
        ],
        "negative": [
            "Highly detrimental for wealth accumulation, often leading to poverty or severe financial struggles.",
            "Aggressive, harsh, and overly candid nature that can alienate close companions.",
            "Significant suffering and dissatisfaction in marital life and domestic partnerships.",
            "Internal friction caused by the conflicting planetary relationships (Mars/Jupiter vs. Mercury/Saturn)."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Heroic and articulate personality; highly respected but prone to aggressive outbursts and poverty."
        },
        {
            "house": "6th House",
            "effect": "Absolute victory over all enemies and opposition; genius problem solver; struggles with debt."
        },
        {
            "house": "7th House",
            "effect": "Severe marital suffering; aggressive partnerships; respected in public but harsh in private."
        },
        {
            "house": "10th House",
            "effect": "Good reputation among high-ranking people; pious career path; fame without substantial wealth."
        }
    ],
    "keywords": ["mars", "mercury", "jupiter", "saturn", "conjunction", "heroic", "genius", "poverty", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMars": (
            "Mars provides the foundational heroism and courage in this conjunction. It gives you a "
            "gallant character that is balanced and ready to face any challenge. You possess the "
            "raw energy required to topple enemies and opposition. However, this same energy "
            "can make you aggressive, harsh, and overly candid, which may cause friction "
            "in your personal relationships."
        ),
        "powerfulMercury": (
            "Mercury acts as your intellectual engine. It makes you articulate and a true creative "
            "genius. You possess an uncanny ability to find solutions to any problem that strikes. "
            "Your sharp logic allows you to gracefully sidestep unnecessary challenges, ensuring "
            "that your life path is as smooth as possible despite external hurdles."
        ),
        "powerfulJupiter": (
            "Jupiter is the source of your wisdom and good virtues. It ensures that your heroic actions "
            "are guided by a pious path. You are polite and morally grounded, which earns you a "
            "very good reputation, especially among high-ranking individuals in society. Your "
            "wisdom balances the aggressive tendencies of Mars and Saturn."
        ),
        "powerfulSaturn": (
            "Saturn is the planet of harsh realities in this conjunction. While it gives you the "
            "structural endurance to defeat opposition, it is highly detrimental to your wealth "
            "profile, often leading to poverty or constant financial struggles. Furthermore, "
            "Saturn's cold influence combined with Mars' aggression leads to significant "
            "suffering and dissatisfaction in your marital life."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Heroic Genius' personality. You are a highly balanced individual "
        "who possesses all the good virtues expected in a gallant leader. You are intellectual, "
        "wise, articulate, polite, and exceptionally courageous. As a creative genius, you have "
        "a solution for almost any problem and know exactly how to sidestep challenges for a "
        "smoother life. You follow a pious path, earning a stellar reputation among high-ranking "
        "individuals. When faced with conflict, you have everything necessary to completely "
        "topple enemies and overcome any opposition that stands in your way."
    ),
    "negativeDetail": (
        "Negative influences manifest primarily in your material and domestic life. This combination "
        "is notoriously bad for wealth, often leading to poverty and severe financial hardship "
        "despite your genius intellect. In your personal life, your nature can become aggressive, "
        "harsh, and brutally candid, which alienates those closest to you. This harshness, "
        "combined with the restrictive energy of Saturn, results in significant suffering "
        "in your marital life, requiring immense patience to maintain domestic harmony."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a heroic, balanced, and highly articulate personality. You are a creative genius who easily solves problems. While you are respected by high-ranking people, you must manage your harsh candidness to avoid marital suffering and poverty."
        },
        {
            "house": "6th House",
            "detail": "Powerhouse for defeating enemies. You effortlessly topple all opposition and use your genius intellect to navigate conflicts. However, this house amplifies the risk of poverty and debt, requiring you to use your problem-solving skills to stay afloat."
        },
        {
            "house": "7th House",
            "detail": "A challenging placement for domestic peace. While you enjoy a strong public reputation and are a creative genius in partnerships, the aggressive and harsh energies lead to severe marital suffering and potential poverty through legal disputes."
        },
        {
            "house": "10th House",
            "detail": "Ensures a highly respected career path. You are virtuous and pious, earning the favor of high-ranking authorities. You are a heroic leader who overcomes professional opposition, though your high status may not translate into material wealth."
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
    db = client["Four_Planet_Conjunction"]
    # Alphabetical order: Jupiter, Mars, Mercury, Saturn
    col_name = "Jupiter_Mars_Mercury_Saturn"
    col = db[col_name]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Four Planet Conjunction: {col_name} {action}.")
    print(f"     Total documents in {col_name}: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Jupiter_Mars_Mercury_Saturn four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
