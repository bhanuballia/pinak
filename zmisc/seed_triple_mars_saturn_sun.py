"""
Seed: Mars_Saturn_Sun collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mars-Saturn Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a powerful, determined, and highly industrious personality.",
        "Combines Soul (Sun), Action (Mars), and Discipline (Saturn) for immense endurance.",
        "Natives are often visionary leaders who balance passion with patience to achieve long-term success."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, father figure, government status, discipline",
        "Mars": "Action, courage, stamina, strategic aggression, technical skills",
        "Saturn": "Discipline, consistency, long-term goals, endurance, precision"
    },
    "effects": {
        "powerfulSun": [
            "Grants a strong, determined personality and courageous approach to challenges.",
            "Ensures support from government and father figures for professional growth.",
            "Provides financial gains from legal work and administrative status."
        ],
        "powerfulMars": [
            "Helps manage high workloads and climb the professional ladder effectively.",
            "Ensures support from friends/siblings and grants courage to navigate complex situations.",
            "Enables a strategic approach to resolve challenges through force and precision."
        ],
        "powerfulSaturn": [
            "Brings significant success and high-ranking status in the second phase of life.",
            "Forces a focus on long-term goals, preventing elation over short-term gains.",
            "Ensures clarity in decision-making and excellence in law or engineering sectors."
        ]
    },
    "nature": {
        "positive": [
            "Highly responsible leader with immense stamina and endurance.",
            "Industrious and hard-working person with an engineering or technical mindset.",
            "Diplomatic speech helps grab professional opportunities and build strong teams.",
            "Strong capacity to withstand pressure and criticism while fighting against wrongs."
        ],
        "negative": [
            "Challenges in relationships due to anger, strict rules, and ego clashes.",
            "Restlessness and overthinking caused by the opposing energies of Mars and Saturn.",
            "Potential for rebellious behavior against authority figures or the father.",
            "Pessimistic approach leading to inner conflict and blocked ambitions."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "High moral values and passion; struggle between action and restraint."
        },
        {
            "house": "5th House",
            "effect": "Sharp analytical powers; delayed joy or emotional expression due to structural growth."
        },
        {
            "house": "9th House",
            "effect": "Philosophical bent with strong beliefs; potential distance in paternal relationships."
        },
        {
            "house": "10th House",
            "effect": "Successful industrialist or business owner; success comes through consistent 'baby steps'."
        }
    ],
    "keywords": ["sun", "mars", "saturn", "conjunction", "endurance", "industrious", "discipline", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A powerful Sun in this conjunction grants a determined personality. You overcome hurdles with a "
            "courageous, motivational approach. An optimistic outlook helps you find solutions, and "
            "support from government or father figures ensures financial gains in legal or administrative work."
        ),
        "powerfulMars": (
            "With Mars in good strength, you manage heavy workloads with ease. Support from siblings and "
            "friends aids your climb to success. You possess the strategic courage needed to fight "
            "against challenges and navigate complex professional landscapes with precision."
        ),
        "powerfulSaturn": (
            "Saturn ensures success in the second phase of life, often leading to a high rank in government "
            "or law. It forces you to think about long-term goals, providing a clarity in decision-making "
            "that prevents you from being distracted by temporary gains."
        )
    },
    "positiveDetail": (
        "This combination grants a brave, industrious personality. You are a highly responsible leader "
        "blessed with immense stamina and endurance. Your diplomatic speech helps you build efficient "
        "teams and lead companies with a technical or engineering mindset. You have the vision to "
        "dream big and the consistency to make those dreams come true. Sectors like construction, "
        "surgery, and mechanics are ideal for your precise and forceful approach. You possess the "
        "rare ability to balance personal expression with social grace and withstand high pressure."
    ),
    "negativeDetail": (
        "Negative influences can create severe friction due to the opposing energies of Mars (fire) "
        "and Saturn (restriction). Ego clashes with seniors, anger issues, and sarcastic communication "
        "can strain relationships. You may suffer from self-ruin due to overthinking or a pessimistic "
        "outlook that blocks your ambitions. Excessive dependence on external validation and "
        "rebelliousness against authority can lead to professional hurdles. Marital life may face "
        "challenges due to emotional vulnerability or a rigid, overly strict demeanor."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses high moral values but struggles with anxiety due to internal restrictions. A workaholic nature may cause a tussle with parents and strain personal relationships. Life is a constant balance between the urge to act (Mars) and the need for restraint (Saturn)."
        },
        {
            "house": "5th House",
            "detail": "Active and intelligent approach with sharp analytical powers. While it provides structured professional growth, it can delay emotional joy. Ambition-driven anxiety is a risk; managing anger is key to preserving love relationships and financial investments."
        },
        {
            "house": "9th House",
            "detail": "Attention is focused on duty and responsibility. The native builds a strong, unbreakable set of philosophical beliefs, though this can create distance from those with differing opinions. Paternal relationships may be strained or emotionally distant."
        },
        {
            "house": "10th House",
            "detail": "Ideal for a successful industrialist or bureaucrat. Gains from government officials are indicated, but clashing planetary energies bring delays. Success requires celebrating small milestones and following a 'baby steps' approach to avoid despair over hurdles."
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
    # Alphabetical order: Mars, Saturn, Sun
    col_name = "Mars_Saturn_Sun"
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
    print("[*] Seeding Mars_Saturn_Sun triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
