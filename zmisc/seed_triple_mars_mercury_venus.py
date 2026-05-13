"""
Seed: Mars_Mercury_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mars-Mercury-Venus Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a passionate, dynamic, and creatively strategic personality.",
        "Combines Logic (Mercury), Passion (Mars), and Beauty (Venus) for charismatic communication and artistic success.",
        "Natives are bold negotiators with an eye for detail, often excelling in technical, creative, or political sectors."
    ],
    "planetRoles": {
        "Mars": "Action, courage, initiative, physical vitality, protective love",
        "Mercury": "Logic, communication, wit, analytical thinking, diplomatic approach",
        "Venus": "Art, beauty, romance, creative strategy, social charm, royal touch"
    },
    "effects": {
        "powerfulMars": [
            "Ensures ideas are expressed with high confidence and a domineering, assertive approach.",
            "Grants an inclination toward physical vitality, yoga, and athletic activities.",
            "Provides a protective nature, expressing love through action, touch, and assertive presence."
        ],
        "powerfulMercury": [
            "Ensures love and care are expressed through thoughtful, detailed conversations.",
            "Grants the ability to use wit, jokes, and teasing to keep relationships lively.",
            "Provides close attention to words and quick, structured responses in challenging times."
        ],
        "powerfulVenus": [
            "Grants a passionate personality capable of turning hobbies into successful careers.",
            "Ensures rejuvenation in relationships with a royal and creative touch to responsibilities.",
            "Provides a strong family background and significant support from the life partner."
        ]
    },
    "nature": {
        "positive": [
            "Dynamic communicator and enthusiastic speaker who thrives on helping others.",
            "Artistic intelligence and creative strategy leading to success in fashion or media.",
            "Bold negotiation skills and sharp intelligence for dealing with rivals diplomatically.",
            "Multitasking ability and success in technical sectors, engineering, or design planning."
        ],
        "negative": [
            "Uncontrolled desires and lack of discipline causing financial overindulgence or loss.",
            "Verbal aggression and argumentative tendencies disrupting family and marital peace.",
            "Risk of manipulative personality traits, aggressive flirtation, or jealousy-driven career losses.",
            "Impatient communication and a self-centered approach alienating siblings and friends."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Charming and witty personality; success in law, engineering, or politics; physical vitality."
        },
        {
            "house": "3rd House",
            "effect": "Success through siblings' guidance; mastery of multiple skills; quick sense of humor in travel."
        },
        {
            "house": "10th House",
            "effect": "Technical mindset with an eye for detail; growth through public relations, entertainment, or media."
        }
    ],
    "keywords": ["mars", "mercury", "venus", "conjunction", "passion", "eloquence", "strategy", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMars": (
            "A strong Mars manifests as a high level of confidence and an initiative-taking nature. You "
            "express ideas with an assertive approach and have a strong inclination toward physical "
            "vitality, such as gym or yoga. Your love is action-oriented, shown through protection "
            "and intimacy."
        ),
        "powerfulMercury": (
            "Mercury provides you with the ability to express care through meaningful conversations. You "
            "pay close attention to words and remember details that others miss. In relationships, "
            "your wit and jokes keep the bond light and lively, even during challenging times."
        ),
        "powerfulVenus": (
            "Venus grants a passionate and royal touch to all your endeavors. You have the unique "
            "ability to turn a creative hobby into a flourishing career. A strong Venus ensures "
            "rejuvenation in your personal life and a solid family background, providing "
            "constant support from your life partner."
        )
    },
    "positiveDetail": (
        "This conjunction makes you a dynamic, active communicator always ready to help others. You "
        "possess 'artistic intelligence'—the ability to apply creative strategy to technical or "
        "business problems. As a bold negotiator, you use your sharp intellect to perform under "
        "pressure, often excelling in engineering, design, or the cosmetic industries. Your "
        "enthusiasm as a speaker draws a large following, and your poetic approach to life "
        "is balanced by a sharp eye for detail. Success is indicated through the support of "
        "your maternal family and life partner, where your multitasking abilities and "
        "diplomatic handling of rivals ensure consistent professional growth."
    ),
    "negativeDetail": (
        "Negative influences can lead to uncontrolled desires and a lack of discipline, particularly in "
        "finances. You may suffer losses through overindulgence or poorly planned expenses. "
        "Affliction can cause aggressive flirtation, manipulative behaviors, and argumentative "
        "tendencies that disrupt marital harmony. Jealousy can lead to career setbacks, "
        "while a restless mind may cause you to overthink relationships. Verbal aggression "
        "and a self-centered approach can distance you from siblings and friends, and a "
        "habit of comparing your life to others' may lead to emotional instability. Discipline "
        "is the key to preventing passion from turning into destructive anger."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a witty and charming personality with strong physical vitality. You bring people together in harmony and have a high number of followers. Success is likely in law, politics, or engineering, though you must guard against passion without discipline."
        },
        {
            "house": "3rd House",
            "detail": "Identity is centered on quick, sharp communication and mastery of multiple skills. You enjoy frequent travel and learn rapidly from your environment. Guidance from siblings ensures you reach your professional potential through humor and sharp intelligence."
        },
        {
            "house": "10th House",
            "detail": "Powerhouse for career growth through public relations, entertainment, and the creative arts. Your technical mindset and eye for detail help you excel in roles that require quick decision-making and diplomatic handling of high-profile contacts."
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
    # Alphabetical order: Mars, Mercury, Venus
    col_name = "Mars_Mercury_Venus"
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
    print("[*] Seeding Mars_Mercury_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
