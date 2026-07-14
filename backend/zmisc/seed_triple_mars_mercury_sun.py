"""
Seed: Mars_Mercury_Sun collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mars-Mercury Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly intelligent, courageous, and action-oriented personality.",
        "Combines Soul (Sun), Action (Mars), and Logic (Mercury) for strategic leadership.",
        "Natives possess a sharp sense of humor and eloquent speech, making them natural commanders."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, government support, high rank, creativity",
        "Mars": "Action, robust willpower, courage, risk management, leadership",
        "Mercury": "Logic, quick thinking, strategic planning, persuasive speech, analytical mind"
    },
    "effects": {
        "powerfulSun": [
            "Grants command over languages and high ambitions for a top-tier rank.",
            "Blesses the native with the company of brilliant people and government support.",
            "Encourages a creative approach and a good sense of humor in financial decisions."
        ],
        "powerfulMars": [
            "Provides robust willpower and bold communication for professional success.",
            "Manifests strong leadership traits and the ability to manage high-stakes risks.",
            "Ensures the native is well-versed in multiple languages and strategic arts."
        ],
        "powerfulMercury": [
            "Grants quick thinking and the ability to process complex strategic data.",
            "Encourages action-oriented decisions with a sharp analytical backup.",
            "Allows the native to take calculated risks without fear of failure."
        ]
    },
    "nature": {
        "positive": [
            "Courageous with high morals; prefers resolving conflicts with diplomatic speech.",
            "Strong sense of humor used as a tool to diffuse tension and cope with stress.",
            "Navigates difficult conversations with grace and attains widespread popularity.",
            "Strategic mastermind capable of leading teams like a king with undisputed authority."
        ],
        "negative": [
            "Challenges in maintaining relationship harmony, especially in marriage and with children.",
            "Potential for significant financial loss due to aggressive or harsh responses.",
            "Stubbornness and impatience in attaining success, possibly leading to unethical shortcuts.",
            "Vulnerability to legal challenges and obstacles from poorly planned investments."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Highly intellectual and goal-driven; command over logical skills and calculated risks."
        },
        {
            "house": "3rd House",
            "effect": "Courageous and daring; authoritative voice; success in engineering and programming."
        },
        {
            "house": "6th House",
            "effect": "Dominance over enemies; fighting spirit; success in legal, police, or medical careers."
        },
        {
            "house": "10th House",
            "effect": "Public recognition and high ambitions; success in law, politics, or big business."
        }
    ],
    "keywords": ["sun", "mars", "mercury", "conjunction", "strategy", "intellect", "courage", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A powerful Sun in this conjunction grants you a command over languages and helps you achieve high "
            "ambitions. You will enjoy the company of brilliant minds and receive support from government "
            "authorities. Your creative approach and sharp humor will be key assets in your career growth."
        ),
        "powerfulMars": (
            "A strong Mars gives robust willpower and sharp intellect. Bold communication helps you achieve "
            "success on the professional front. Leadership traits are highly visible, and you possess the "
            "unique ability to manage risks while being well-versed in diverse fields."
        ),
        "powerfulMercury": (
            "You possess quick thinking and strategic-planning abilities. The combination of Mars and "
            "Mercury makes you highly action-oriented. You make decisions rapidly with an analytical "
            "approach, unafraid to take calculated risks to run your organization or team."
        )
    },
    "positiveDetail": (
        "Mars with the Sun gives courage and high morals, but you prefer resolving matters through eloquent "
        "speech. Your humor is a sophisticated tool for diffusing tension and navigating difficult "
        "conversations with grace. You possess a 'Warrior of Peace' personality, capable of leading "
        "like a king while maintaining the support of siblings and children. Success is indicated "
        "in martial arts, engineering, politics, and high-end businesses like government construction "
        "or finance. You overcome rivals with a sharp intellect and sound decision-making."
    ),
    "negativeDetail": (
        "The primary challenge lies in maintaining relationship harmony. Aggressive responses or a stubborn "
        "personality can lead to domestic strife and losses in paternal wealth. Fiery elements (Sun/Mars) "
        "may cause an impatient rush for success, while Mercury might tempt you toward shortcuts "
        "that end in legal trouble. To sustain marital beauty, harsh approaches must be replaced "
        "with empathy. While others may fear your revenge-oriented courage, your reputation "
        "depends on balancing your strength with compassion."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native is an articulate, goal-driven individual with natural leadership. While highly popular due to humor and logic, they may face marital challenges due to an overbearing nature. Arguments and blunt speech are risks that require conscious avoidance to maintain business stability."
        },
        {
            "house": "3rd House",
            "detail": "Identity is shaped by an authoritative, commanding voice. Daring and protective of siblings, the native excels in engineering, programming, or heavy machinery. A strong debater who isn't afraid to speak harsh truths or take communicative risks."
        },
        {
            "house": "6th House",
            "detail": "Blesses the native with dominance over enemies and the wisdom to resolve financial challenges. Ideal for legal work, the police, or medical professions. People rarely dare to oppose your decisions once your fighting spirit is activated."
        },
        {
            "house": "10th House",
            "detail": "Ensures success in law, politics, or engineering through high ambitions and public recognition. The native has an analytical approach and receives parental-like support from siblings. Success in big business is highly likely with the support of the government."
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
    # Alphabetical order: Mars, Mercury, Sun
    col_name = "Mars_Mercury_Sun"
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
    print("[*] Seeding Mars_Mercury_Sun triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
