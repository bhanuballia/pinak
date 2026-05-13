"""
Seed: Mars_Mercury_Saturn collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mars-Mercury-Saturn Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly disciplined, analytical, and strategically minded personality.",
        "Combines Action (Mars), Logic (Mercury), and Restriction (Saturn) for precision, problem-solving, and endurance.",
        "Natives are known for their ability to think and introspect before acting, excelling in technical, legal, and engineering sectors."
    ],
    "planetRoles": {
        "Mars": "Action, courage, ambition, willpower, protective nature",
        "Mercury": "Logic, intelligence, communication, technical mindset, analytical skills",
        "Saturn": "Discipline, persistence, structure, maturity, professional stability"
    },
    "effects": {
        "powerfulMars": [
            "Grants the ability to speak up for what is right and bear significant work pressures.",
            "Ensures a team-leading spirit and a protective nature toward relatives and subordinates.",
            "Provides the drive to achieve long-term goals through persistence and strategic willpower."
        ],
        "powerfulMercury": [
            "Grants an intellectually sharp and highly disciplined personality focused on business clues.",
            "Ensures success in technical sectors and dealing with multiple data points/information.",
            "Provides a thoughtful debating style and the ability to find precision in complex tasks."
        ],
        "powerfulSaturn": [
            "Manifests as a reserved, purposeful personality with a deep belief in long-term stability.",
            "Ensures growth in technical, legal, and engineering areas through mature decision-making.",
            "Provides the endurance required to handle harsh work environments and turn delays into perfection."
        ]
    },
    "nature": {
        "positive": [
            "Introspective thinker who avoids jumping to conclusions and excels under pressure.",
            "High inspiration fueled by ambition and long-term planning for financial growth.",
            "Success in property, real estate, and businesses requiring technical precision.",
            "Reliable and dedicated worker capable of executing complex responsibilities on time."
        ],
        "negative": [
            "Harsh speech, dominating personality, and overly rigid mindset causing opinion clashes.",
            "Suppressed anger, ruthless thinking, and a commanding approach leading to domestic unhappiness.",
            "Impatience under pressure and self-critical behavior resulting in delayed emotional growth.",
            "Restricted social circles due to being overly cautious or distrustful of friendships."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Mentally tough and strategically minded; active in physical wellness; intense analytical mind."
        },
        {
            "house": "6th House",
            "effect": "Excellent planner in legal/debt disputes; capable of overcoming rivals with logic and tenacity."
        },
        {
            "house": "10th House",
            "effect": "Highly focused on goals; capable of handling large responsibilities with ethical persistence."
        },
        {
            "house": "11th House",
            "effect": "Multiple sources of income; strategic alliances lead to enduring professional rewards."
        }
    ],
    "keywords": ["mars", "mercury", "saturn", "conjunction", "precision", "strategy", "endurance", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMars": (
            "A strong Mars manifests as the spirit to lead a team and speak up for justice. You possess "
            "the ability to bear immense work pressures while remaining protective of those under "
            "your authority. Your ambition is fueled by a strategic willpower that ensures you "
            "reach your goals through persistence."
        ),
        "powerfulMercury": (
            "Mercury grants an intellectually sharp and disciplined character. You excel at making big "
            "deals in business by analyzing multiple data points to find the clues others miss. "
            "Your technical mindset and logical approach ensure you create strong, durable "
            "bonds in both personal and professional life."
        ),
        "powerfulSaturn": (
            "Saturn manifests as a reserved but purposeful personality. You believe in long-term stability "
            "and approach your career with a mature, structured mindset. While you may overthink "
            "at times, your persistence allows you to thrive in technical and legal areas, "
            "turning early struggles into professional perfection."
        )
    },
    "positiveDetail": (
        "This conjunction creates a personality defined by strategic endurance and precise logic. You "
        "introspect deeply before making decisions, ensuring you avoid impulsive errors. This "
        "combination makes you a highly reliable worker, capable of dedicating yourself to "
        "executing work on time even in harsh environments. You possess an 'action-oriented "
        "logic' that helps you overcome challenging situations in business and technical sectors. "
        "Success is indicated in real estate, engineering, and property matters, where your "
        "thoughtful approach as a debater and employee earns you respect and a high rank. "
        "Persistence and long-term planning are your greatest assets, helping you carve a "
        "permanent name in society through ethical conduct and strategic willpower."
    ),
    "negativeDetail": (
        "Negative influences manifest as a harsh speech and a dominating, overly rigid personality. You "
        "may find yourself in conflict with partners, siblings, and family due to a commanding "
        "approach. Affliction can lead to suppressed anger and ruthless thinking, potentially "
        "straining your domestic happiness and marital peace. You might become self-critical "
        "or impatient under pressure, leading to opinion clashes at the workplace. A lack "
        "of team-building spirit and a distrust of friendships can lead to social "
        "isolation or betrayal. Managing your critical behavior and adopting a more "
        "down-to-earth approach is vital for maintaining relationship harmony."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a mentally tough, strategically minded personality. You are focused on health through physical activities like yoga and gym. Your appearance is attractive, and your mind is intensely analytical, making you purposeful and capable of enduring significant struggles."
        },
        {
            "house": "6th House",
            "detail": "Identity is defined by the energy to fight and win against systemic problems. You are an excellent planner, capable of handling legal disputes and debt management with logic and tenacity. Your growth is certain in engineering, law, or back-end data handling."
        },
        {
            "house": "10th House",
            "detail": "Powerhouse for career ambition and responsibility. You are hardworking and follow the guidelines of elders with strategic persistence. While opinion conflicts may arise, your analytical mindset helps you handle large professional loads with focused ethics."
        },
        {
            "house": "11th House",
            "detail": "Ensures multiple sources of income and enduring professional rewards through strategic alliances. You achieve success after consistent effort, leading large teams in structured projects. You must guard against being overly cautious or distrustful of your social circle."
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
    # Alphabetical order: Mars, Mercury, Saturn
    col_name = "Mars_Mercury_Saturn"
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
    print("[*] Seeding Mars_Mercury_Saturn triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
