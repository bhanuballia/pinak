"""
Seed: Jupiter_Moon_Saturn_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Jupiter-Venus-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a fortunate and highly expressive personality who easily skips past major life hurdles.",
        "Combines Wisdom (Jupiter), Emotions (Moon), Attraction (Venus), and Hardship (Saturn) for a complex life path.",
        "Natives are multilingual and straightforward but often suffer from mental unrest and a lack of maternal love."
    ],
    "planetRoles": {
        "Moon": "Emotions, peace of mind (or lack thereof), motherly love (deprived), intuition",
        "Jupiter": "Wisdom, fortune, skipping hurdles, truthfulness, straightforwardness",
        "Venus": "Attraction, expression, language mastery, skin sensitivity, adultery (when afflicted)",
        "Saturn": "Hardship, aimless wanders, emotional coldness, detachment from relatives, isolation"
    },
    "effects": {
        "powerfulSun": [
            "Note: This conjunction lacks the Sun; its authority is replaced by Jupiter's wisdom and Saturn's structure.",
            "Natives rely on their expression and fortune to navigate society rather than raw power.",
            "Success comes through intellectual and linguistic mastery."
        ],
        "powerfulMoon": [
            "Grants a deep emotional intuition, though it often results in struggling to enjoy peace of mind.",
            "Ensures the native is deeply sensitive to their environment, making them rarely at ease.",
            "Provides an emotional depth that fuels expression, despite feeling deprived of motherly love."
        ],
        "powerfulJupiter": [
            "Grants exceptional fortune, making the native quite lucky in skipping past major hurdles in life.",
            "Ensures a straightforward and truthful personality that earns respect through honesty.",
            "Provides the broad vision required to understand and master many languages."
        ],
        "powerfulVenus": [
            "Grants the gift of expression, making the native articulate and attractive in communication.",
            "Ensures an appreciation for beauty, though unchecked desires may lead to adultery.",
            "Provides physical sensitivity that may manifest as skin disorders during stressful periods."
        ],
        "powerfulSaturn": [
            "Grants the endurance to survive a life that can sometimes feel like a series of aimless wanders.",
            "Ensures a detachment that deprives the native of the typical warmth developed with relatives.",
            "Provides a strict, disciplined approach to life that isolates the native from emotional comforts."
        ]
    },
    "nature": {
        "positive": [
            "Highly fortunate individual who easily avoids or skips past significant life hurdles.",
            "Exceptional communicator who is good with expression and knows many languages.",
            "Straightforward and truthful personality who is respected for their honesty.",
            "Resilient survivor who navigates a lack of familial warmth with intellectual strength."
        ],
        "negative": [
            "Struggles to enjoy peace of mind, feeling rarely at ease or constantly restless.",
            "Deprived of motherly love and the emotional warmth usually shared with relatives.",
            "Life can feel like a series of aimless wanders due to internal emotional disconnection.",
            "Prone to skin disorders and potential indulgence in adultery or moral instability."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Expressive and truthful personality; potential for skin disorders; mentally restless."
        },
        {
            "house": "4th House",
            "effect": "Deprived of motherly love; lack of domestic peace; aimless wandering seeking home."
        },
        {
            "house": "7th House",
            "effect": "Good communication with partners but risk of adultery; emotional distance in marriage."
        },
        {
            "house": "9th House",
            "effect": "Mastery of many foreign languages; fortune in skipping academic or travel hurdles."
        }
    ],
    "keywords": ["moon", "jupiter", "venus", "saturn", "conjunction", "fortunate", "expressive", "restless", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A strong Moon in this combination creates deep emotional undercurrents. While you possess "
            "strong intuition, you usually struggle to enjoy peace of mind and are rarely at ease. "
            "This placement indicates a significant emotional void, as you are often deprived of "
            "motherly love, leading to a lifelong search for emotional stability."
        ),
        "powerfulJupiter": (
            "Jupiter acts as your saving grace, making you quite fortunate in skipping past hurdles "
            "in life. It grants you a straightforward and truthful nature. Your wisdom allows you "
            "to navigate complex situations honestly, ensuring that even during aimless wanders, "
            "you maintain a core sense of moral integrity."
        ),
        "powerfulVenus": (
            "Venus ensures you are good with expression and possess a talent for learning many languages. "
            "You have an attractive way of communicating that draws people in. However, the affliction "
            "from Saturn and Moon can make you susceptible to skin disorders and, at times, may "
            "tempt you to indulge in adultery due to a lack of deep emotional fulfillment at home."
        ),
        "powerfulSaturn": (
            "Saturn is the isolating force that detaches you from your roots. It ensures you do not get "
            "to enjoy the love and warmth one typically develops with relatives and closed ones. "
            "It can make your life feel like a series of aimless wanders, demanding that you find "
            "structure and meaning within yourself rather than relying on family support."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Fortunate Linguist' personality. You are someone who is highly "
        "expressive, possessing the intellect and wisdom to master many languages. You are quite "
        "fortunate in life, easily skipping past hurdles that would stop others. Your straight "
        "forward and truthful nature earns you respect in your professional and social circles. "
        "While your emotional life is complex, your ability to communicate effectively allows "
        "you to navigate the world as an independent, resilient individual who finds success "
        "through intellect and honesty rather than relying on inherited familial comfort."
    ),
    "negativeDetail": (
        "Negative influences manifest as a profound lack of emotional warmth. You are often deprived "
        "of motherly love and struggle to build deep bonds with relatives and loved ones. This "
        "isolation leads to a lack of peace of mind, making you feel rarely at ease. Your life "
        "may sometimes feel like a series of aimless wanders as you search for true belonging. "
        "Additionally, the stress of this emotional disconnect can manifest physically as "
        "skin disorders, and a desire for connection may sometimes lead to adultery or "
        "unstable romantic relationships."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a straightforward and expressive personality. You are highly skilled in communication and languages, easily skipping past career hurdles. However, you are rarely at ease and must take extra care of your health, particularly regarding skin disorders."
        },
        {
            "house": "4th House",
            "detail": "Identity is defined by a lack of domestic peace and the deprivation of motherly love. You may wander aimlessly seeking a place to call home. Despite this, your fortune ensures you always land on your feet, using your truthfulness to build your own sanctuary."
        },
        {
            "house": "7th House",
            "detail": "Powerhouse for communication in partnerships, but it indicates a lack of emotional warmth in marriage. You may be tempted by adultery seeking the affection you missed early on. However, your fortune helps you navigate these relationship hurdles safely."
        },
        {
            "house": "9th House",
            "detail": "Ensures success in higher education, philosophy, or foreign travel. You easily learn many languages and skip past academic hurdles. While you may feel detached from your cultural roots, your wisdom and truthful expression make you a respected guide."
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
    # Alphabetical order: Jupiter, Moon, Saturn, Venus
    col_name = "Jupiter_Moon_Saturn_Venus"
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
    print("[*] Seeding Jupiter_Moon_Saturn_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
