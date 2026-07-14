"""
Seed: Mars_Mercury_Saturn_Sun collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mars-Mercury-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents an astute, wise, and authoritative personality with a fierce fighting spirit.",
        "Combines the drive of Mars and the logic of Mercury with the discipline of Saturn and Sun's authority.",
        "Natives often attain high government or state positions but may struggle with a harsh demeanor."
    ],
    "planetRoles": {
        "Sun": "Authority, status, government favour, ego, leadership",
        "Mars": "Fighting spirit, drive, action, aggression, raw power",
        "Mercury": "Wisdom, astuteness, communication, poetry, advisory skills",
        "Saturn": "Discipline, structure, harshness, base activities, karma"
    },
    "effects": {
        "powerfulSun": [
            "Grants a high position with the government or state through strong leadership.",
            "Ensures an authoritative presence that is respected in the professional sphere.",
            "Provides a strong foundation for career growth, though it may amplify self-centeredness."
        ],
        "powerfulMars": [
            "Grants a fierce fighting spirit and the motivation to overcome any obstacle.",
            "Ensures the native's actions are based on a solid foundation rather than misfired judgment.",
            "Provides the drive needed to succeed in occupations involving high-level authority."
        ],
        "powerfulMercury": [
            "Grants an astute and wise mind with a significant affinity for poetry and creative arts.",
            "Ensures success in advisory roles through logical and calculated communication.",
            "Provides the intelligence to navigate complex administrative systems with ease."
        ],
        "powerfulSaturn": [
            "Grants a structured approach to heavy responsibilities and long-term endurance.",
            "Ensures that actions are weighed carefully, though it may lean toward a harsh or blunt expression.",
            "Provides success in backend work or roles that require a strict, non-distracted focus."
        ]
    },
    "nature": {
        "positive": [
            "Astute and wise leader who enjoys high status and governmental recognition.",
            "Strong fighting spirit that allows the native to emerge victorious from professional challenges.",
            "Creative talent in poetry or advisory skills that earn the respect of peers.",
            "Authority based on a disciplined and well-calculated foundation."
        ],
        "negative": [
            "Fierce and self-centered approach that can alienate family and friends.",
            "Expression lacks politeness, leading to difficulties caused by a harsh demeanor.",
            "Potential for involvement in illicit or base activities if the ego remains unchecked.",
            "Destructive influence on the positive aspects of the house where the conjunction occurs."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong determined personality; authoritative presence; success in government careers."
        },
        {
            "house": "10th House",
            "effect": "High rank in state/government positions; advisory success; disciplined professional life."
        },
        {
            "house": "7th House",
            "effect": "Challenges in domestic harmony due to harsh speech; success in structured business partnerships."
        },
        {
            "house": "9th House",
            "effect": "Traditional wisdom and interest in poetry or scriptures; authority through philosophical depth."
        }
    ],
    "keywords": ["sun", "mars", "mercury", "saturn", "conjunction", "astute", "authority", "fighting spirit", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun grants you a high status and significant rise in your career. You enjoy the "
            "favour of the government and are respected for your authoritative presence. Your "
            "leadership qualities are prominent, allowing you to occupy higher positions with "
            "state organizations where your decisions are viewed as firm and structured."
        ),
        "powerfulMars": (
            "Mars provides you with a fierce fighting spirit. You do not shy away from challenges and "
            "ensure that your actions are based on a strong foundation. This drive motivates you "
            "to achieve excellence in fields involving precision, force, or high-level command, "
            "ensuring your professional journey is both exciting and successful."
        ),
        "powerfulMercury": (
            "Mercury grants you an astute and wise mind, often manifesting as an affinity for poetry "
            "or creative advisory roles. You possess the intelligence to interpret complex situations "
            "accurately, ensuring your advice is sought after by leaders. Your communication is "
            "calculated and insightful, bridging the gap between raw authority and wise logic."
        ),
        "powerfulSaturn": (
            "Saturn is the disciplinarian here, ensuring you work with a serious and attentive nature. "
            "It grants you the endurance for long-term projects but can also make your expression "
            "lack politeness. You must guard against a tendency toward base activities, using "
            "Saturn's structure to ground your ambitions rather than becoming hardened by its harshness."
        )
    },
    "positiveDetail": (
        "This conjunction creates an 'Astute Authority' personality. You are a person of significant "
        "wisdom and fighting spirit, often attaining a high rank in government or administrative "
        "sectors. Your decisions are not based on misfired judgment but on a solid, well-calculated "
        "foundation. You may possess a notable talent for poetry or advisory work, earning you "
        "recognition in both artistic and professional circles. Your leadership is marked by "
        "endurance and high moral standing, allowing you to lead large teams with a disciplined "
        "and successful approach that ensures your long-term status and fame."
    ),
    "negativeDetail": (
        "Negative influences manifest as a fierce, self-centered demeanor that lacks politeness. "
        "Your harsh expression can cause unnecessary difficulties in both personal and "
        "professional relationships. There is a risk of being drawn toward illicit or base "
        "activities if the ego is not carefully managed. This conjunction often acts as a "
        "challenging force in the house where it sits, potentially destroying its positive "
        "aspects if the native does not strive to overcome their inner aggression and "
        "adopt a more empathetic and balanced approach to life's challenges."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a strong determined personality and a royal bearing. You excel in high-rank government careers, though your harsh speech may cause friction. Your foundation is solid, ensuring you overcome any initial hurdles through sheer persistence."
        },
        {
            "house": "10th House",
            "detail": "Ensures a successful career in state administration or advisory sectors. You are seen as an astute leader who builds a career on a disciplined foundation. While you face opinion clashes with seniors, your wise decisions eventually lead to the high-status results you crave."
        },
        { "house": "7th House", "detail": "Powerhouse for business dominance, though it brings challenges to marital harmony due to frozen or harsh emotions. Success in partnerships is high if you manage to keep your self-centered approach in check and respect your partner's space." },
        {
            "house": "9th House",
            "detail": "Inclination toward philosophical depth and traditional wisdom. You may become a respected poet or advisor in spiritual matters, using your astute mind to interpret complex scriptures with the authority and discipline this conjunction provides."
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
    # Alphabetical order: Mars, Mercury, Saturn, Sun
    col_name = "Mars_Mercury_Saturn_Sun"
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
    print("[*] Seeding Mars_Mercury_Saturn_Sun four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
