"""
Seed: Jupiter_Mars_Sun_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mars-Jupiter-Venus Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a highly optimistic, determined, and creative personality with a structured life.",
        "Combines Authority (Sun), Drive (Mars), Wisdom (Jupiter), and Attraction (Venus) for balanced power.",
        "Natives excel in engineering, government leadership, architecture, and high-rank financial management."
    ],
    "planetRoles": {
        "Sun": "Authority, father, status, discipline, structured life, career rank",
        "Moon": "Note: This conjunction lacks the Moon; its emotional balance is provided by Venus and Jupiter.",
        "Mars": "Drive, determination, leadership, followers, property, raw energy",
        "Jupiter": "Wisdom, clarity, vision, education, law, financial oversight",
        "Venus": "Love, beauty, creative engineering, harmony, expressiveness, suppressed ego"
    },
    "effects": {
        "powerfulSun": [
            "Grants the ability to organize complex tasks with a disciplined and focused approach.",
            "Ensures a good rank in the career by effectively channeling aggression into structured success.",
            "Provides a focused personality that avoids distractions and maintains a high professional status."
        ],
        "powerfulMars": [
            "Grants a determined approach to deal with higher authorities without getting stuck in fear.",
            "Ensures the native can utilize power and leadership to build a loyal following.",
            "Provides the drive needed to overcome challenges and achieve status rise through courageous actions."
        ],
        "powerfulJupiter": [
            "Grants clarity in thoughts and vision, ensuring the native is never confused by multiple options.",
            "Ensures success in higher studies, law, and education sectors through in-depth knowledge.",
            "Provides the company of wise and elderly mentors who motivate and guide during difficult times."
        ],
        "powerfulVenus": [
            "Grants the ability to work with harmony and balance relationships even in difficult times.",
            "Ensures success in creative engineering, design, and development-related fields.",
            "Provides a passionate and affectionate personality that easily suppresses the ego in close associations."
        ]
    },
    "nature": {
        "positive": [
            "Optimistic personality who motivates others and makes any environment lively and active.",
            "Wise decision-maker who understands the thin line between ego and self-respect.",
            "Successful in balancing personal expression with social grace through a disciplined life.",
            "Abundant wealth and assets gained through creative thinking and strategic investments."
        ],
        "negative": [
            "Aggressiveness and dominant personality leading to ego clashes with co-workers or female relatives.",
            "Acidity, high blood pressure, and health issues related to fever due to untamed heat.",
            "Loss of property or assets caused by wrong investments or a lack of focus on long-term strategy.",
            "Inability to complete higher studies if the aggression is not channeled into productive learning."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Sound intelligence and wise fame; luxury and rise in status after marriage; support from mentors."
        },
        {
            "house": "5th House",
            "effect": "Sharp intelligence and creative skills; recognition for out-of-the-box thinking; caring partner support."
        },
        {
            "house": "10th House",
            "effect": "Directional strength for Sun/Mars; success in engineering, architecture, and government sectors."
        },
        {
            "house": "7th House",
            "effect": "Passionate partnerships; success if ego is suppressed; potential for public leadership through spouse."
        }
    ],
    "keywords": ["sun", "mars", "jupiter", "venus", "conjunction", "optimism", "leadership", "creativity", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun allows you to organize your life with a disciplined approach. You effectively "
            "control the raw energy of Mars, directing your desires toward a focused professional "
            "goal. This discipline ensures you attain a high rank in your career, avoiding the "
            "distractions that often derail others with multiple responsibilities."
        ),
        "powerfulMars": (
            "Mars provides the determination to stand before any authority without fear. You utilize your "
            "leadership qualities to build a loyal team, ensuring you never get stuck in "
            "challenging situations. When combined with the Sun's authority, Mars grants you a "
            "brave and motivated presence that is respected by followers and superiors alike."
        ),
        "powerfulJupiter": (
            "Jupiter acts as your pillar of clarity, granting you in-depth knowledge that ensures success "
            "in law, education, or higher studies. You are blessed with the constant presence of "
            "wise mentors who guide you through tricky scenarios. Your vision is broad, and you "
            "make decisions with positive hope rather than confusion."
        ),
        "powerfulVenus": (
            "Venus gives you the ability to nourish and support your relationships even during difficult times. "
            "You are passionate and expressive, excelling in creative industries or engineering "
            "design. Because Venus is conjunct the Sun, you find it easy to suppress your ego, "
            "maintaining a balanced and harmonious approach that attracts financial abundance."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Lively Motivator' personality. You possess clarity of thought and a "
        "disciplined lifestyle that helps you navigate the thin line between ego and self-respect. "
        "Your presence makes any environment—whether home or office—lively and active. You are "
        "not easily influenced by others' negativity, instead choosing to trust your own wise "
        "judgment and the guidance of your father and mentors. Success is foreseen in government "
        "administration, financial management, or creative engineering. Your ability to "
        "channelize aggression into productive work ensures that you build a legacy of "
        "high moral standing and luxurious prosperity."
    ),
    "negativeDetail": (
        "Negative influences manifest as untamed aggression and a dominant personality that disrupts "
        "harmony. Affliction can cause health challenges like high blood pressure or acidity, "
        "reflecting the internal heat of the Sun and Mars. Ego clashes with female relatives "
        "or coworkers can lead to a loss of status if not checked. Wrong investments or "
        "impulsive financial decisions can lead to the loss of property. It is vital to "
        "maintain focus and channel your internal drive into education and career success "
        "to avoid the stress and instability that an afflicted state can bring."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses sound intelligence and a wise approach to decision-making. You are known for your fame and receive significant support from mentors. Suggestions from your spouse often lead to high financial profits, and you enjoy a luxurious status rise after marriage."
        },
        {
            "house": "5th House",
            "detail": "Identity is defined by sharp intelligence and out-of-the-box creative skills. You receive recognition for your unique decisions and maintain a caring, understanding personality. While you face friction with partners, your clarity in tricky situations ensures you find success."
        },
        {
            "house": "10th House",
            "detail": "Ensures success in engineering, architecture, or government roles. While you have a soft side that others might misuse, a dominant Sun energy ensures you make bold decisions that lead your team to victory in competitive and high-pressure scenarios."
        },
        {
            "house": "2nd House",
            "detail": "Powerhouse for wealth and inheritance, where your speech influences others with ease. You maintain a good bond with your family, though any affliction to Jupiter or Venus may cause delays in savings or financial crunches due to ignorance in diet."
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
    # Alphabetical order: Jupiter, Mars, Sun, Venus
    col_name = "Jupiter_Mars_Sun_Venus"
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
    print("[*] Seeding Jupiter_Mars_Sun_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
