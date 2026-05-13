"""
Seed: Jupiter_Moon_Saturn collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Jupiter-Saturn Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a mature, emotionally resilient, and spiritually grounded personality.",
        "Combines Mind (Moon), Wisdom (Jupiter), and Discipline (Saturn) for practical optimism and structured thinking.",
        "Natives possess the rare ability to stay calm under extreme pressure, balancing high moral values with consistent hard work."
    ],
    "planetRoles": {
        "Moon": "Mind, emotions, mental strength, hope, maternal support",
        "Jupiter": "Wisdom, optimism, mentors, financial prudence, spiritual knowledge",
        "Saturn": "Discipline, endurance, persistence, maturity, professional stability"
    },
    "effects": {
        "powerfulMoon": [
            "Grants strong emotional strength and the ability to work under pressure with persistent hope.",
            "Ensures gains and support from the mother, whose teachings guide the native through adversity.",
            "Provides the mental resilience required to offer hope to others in challenging times."
        ],
        "powerfulJupiter": [
            "Grants a wise and optimistic approach to dealing with stagnant or restrictive situations.",
            "Ensures positive support from elders and mentors and a supportive financial status.",
            "Provides a thoughtful, respectful speech and an inherent sense of righteousness."
        ],
        "powerfulSaturn": [
            "Manifests as an exceptional ability to bear pain and work pressure with continuous effort.",
            "Ensures support from subordinates and gradual but certain professional growth.",
            "Grants emotional resilience and maturity over time, even if it leads to some distancing."
        ]
    },
    "nature": {
        "positive": [
            "Mature personality with wise decision-making abilities and high moral values.",
            "Practical optimism that balances emotional health with structured thinking patterns.",
            "Strong inclination toward spirituality, scriptures, and mental discipline under stress.",
            "Financial prudence and a responsible approach toward nurturing long-term relationships."
        ],
        "negative": [
            "Excessive seriousness and emotional repression that hinders the enjoyment of life.",
            "Rigid belief systems, fear of change, and religious dogmatism if afflicted.",
            "Vulnerability to self-doubt, pessimism, and stagnant emotional health (Moon-Saturn friction).",
            "Obsessive planning and slow adaptability leading to cold detachment or loneliness."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Inner balance and self-discipline; spiritual/humanitarian outlook with leadership potential."
        },
        {
            "house": "2nd House",
            "effect": "Gains from family business; eloquent speech with social value; wise financial decisions."
        },
        {
            "house": "4th House",
            "effect": "Abundance of assets and wealth; wise and disciplined maternal guidance; strong educational background."
        },
        {
            "house": "10th House",
            "effect": "Ethical conduct and high professional rank; success in public administration or spiritual domains."
        }
    ],
    "keywords": ["moon", "jupiter", "saturn", "conjunction", "resilience", "wisdom", "discipline", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A strong Moon grants immense emotional strength. You work under pressure without losing hope "
            "and often become a beacon of optimism for others. Guidance from your mother serves as a "
            "foundational teaching on how to gracefully overcome adversity."
        ),
        "powerfulJupiter": (
            "Jupiter provides a wise and optimistic approach when dealing with the restrictive nature of "
            "Saturn. You enjoy positive support from mentors, and your financial status remains "
            "supportive during challenging times. Your speech is thoughtful, carrying the weight "
            "of your integrity."
        ),
        "powerfulSaturn": (
            "Saturn manifests as the ability to bear significant work pressure and pain. Through continuous "
            "hard work, you attain professional growth and earn the respect of those working under you. "
            "Over time, you develop deep emotional resilience and a grounded maturity."
        )
    },
    "positiveDetail": (
        "This conjunction blends the expansion of Jupiter with the restriction of Saturn and the "
        "sensitivity of the Moon, resulting in practical optimism. You are known for your high "
        "moral values and structured thinking patterns that maintain clarity even under pressure. "
        "A strong inclination toward spirituality and sacred knowledge is indicated. You possess "
        "mental discipline and a responsible approach toward relationships, ensuring you remain "
        "calm and focused during setbacks. Your financial prudence and ability to take a stand "
        "for what is right make you a respected figure in public and spiritual circles alike."
    ),
    "negativeDetail": (
        "Negative influences can lead to excessive seriousness, where the burden of responsibility "
        "prevents you from enjoying life's simple pleasures. Emotional repression and overthinking "
        "can cause stagnation in your mental health. A rigid belief system or religious dogmatism "
        "may cause hurdles in your growth. Moon-Saturn friction (Vish Dosha) can manifest as "
        "self-doubt, pessimism, and slow adaptability. You may suffer from 'misplaced guilt' or "
        "cold detachment, leading to feelings of loneliness despite professional success. "
        "Obsessive planning and a dependency on others' approval can also cause internal "
        "moral conflicts."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a thoughtful, wise, and balanced personality with strong humanitarian values. Success in higher studies and an eloquent speech help you lead others with self-discipline. You oscillate between depth and action, always choosing the righteous path."
        },
        {
            "house": "2nd House",
            "detail": "Identity is centered on family wealth and material stability. You accumulate assets through the family business and make wise financial decisions that society values. Your speech carries gravitas, and your educational background adds to your prestige."
        },
        {
            "house": "4th House",
            "detail": "Ensures an abundance of assets and wealth gain. Your mother is likely a wise figure whose strict discipline helps you learn high moral values. This placement ensures a strong educational foundation and consistent growth in your domestic and professional life."
        },
        {
            "house": "10th House",
            "detail": "Powerhouse for public administration and ethical leadership. You carve a name in society through expansive thinking and academic or spiritual ambitions. As a leader, you know how to balance authority with the valuable suggestions of others, earning lasting fame."
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
    # Alphabetical order: Jupiter, Moon, Saturn
    col_name = "Jupiter_Moon_Saturn"
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
    print("[*] Seeding Jupiter_Moon_Saturn triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
