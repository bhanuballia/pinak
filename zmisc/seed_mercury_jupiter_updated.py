"""
Update: Mercury_Jupiter collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mercury-Jupiter Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Mercury represents speech, communication, and intelligence; Jupiter represents wisdom, wealth, and mentorship.",
        "This conjunction gives clarity on when to execute work and the ability to look behind the scenes.",
        "Good at observing long-term consequences and making practical decisions with a calm approach.",
        "Natives avoid getting stuck with a 'consistent giving nature' by applying rational logic."
    ],
    "effects": {
        "powerfulMercury": [
            "Blessed with sharp intelligence to make good personal and professional decisions.",
            "Ability to have a good number of contacts and friends who support professional growth.",
            "Strong grasp over academic skills, excellent memory, and a sharp sense of humor."
        ],
        "powerfulJupiter": [
            "Grants a strong personality and the ability to guide others with a wise approach.",
            "Compassionate, caring, and dedicated toward responsibilities in society and family.",
            "Success in basic education (Moon influence on Jupiter) and higher studies abroad (Sagittarius sign)."
        ]
    },
    "nature": {
        "positive": [
            "Fearless personality when it comes to intellectual debates.",
            "Eloquent approach to relationship challenges; attracts the masses with a wise social image.",
            "Success as teachers, mentors, influencers, and in fields like law and preaching."
        ],
        "negative": [
            "Challenges due to overthinking and a self-centered, preachy approach.",
            "Greed for wealth gains may trigger financial losses through deception or poor judgment.",
            "Confusion and information overload can lead to a lack of concentration and academic delays."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Highly intellectual, good at debate, attractive and young-looking personality."
        },
        {
            "house": "4th House",
            "effect": "Support from maternal family, success in education, guidance from supportive mentors."
        },
        {
            "house": "7th House",
            "effect": "Early marriage to an intelligent, spiritually inclined spouse; optimistic life direction."
        },
        {
            "house": "10th House",
            "effect": "High status in education, law, or telecom sectors; educated paternal background."
        }
    ],
    "keywords": ["mercury", "jupiter", "conjunction", "wisdom", "intellect", "speech", "vedic astrology"],

    # Detailed narrative based on user's text
    "description": (
        "Mercury with Jupiter gives clarity on when to execute work. It gives you the ability to look "
        "behind the scenes and perform well even in challenging situations. You are good at observing "
        "long-term consequences and making practical decisions that help you make the right choice "
        "with a calm approach, rather than getting stuck with a consistent giving nature."
    ),
    "effectsDetail": {
        "powerfulMercury": (
            "Powerful Mercury is blessed with sharp intelligence to make good decisions on personal "
            "and professional fronts. It gives you the ability to have a good number of contacts and "
            "friends, who will support you on the professional and financial front. Positive Mercury "
            "in its own zodiac brings supportive circumstances for friends and relatives, including "
            "support from the maternal family. Exalted Mercury rewards you with excellent communication "
            "skills, ensuring high rank in jobs and success in business."
        ),
        "powerfulJupiter": (
            "Strong Jupiter gives you the ability to make wise decisions and guide others. When placed "
            "in the first house, it helps the individual have a strong personality. Well-placed Jupiter "
            "in Cancer gives a compassionate, caring personality that helps attain success. You will "
            "be dedicated toward your responsibility and support your partner with positive hope. "
            "Exalted Jupiter gives a strong inclination toward spirituality and deeper religious understanding."
        )
    },
    "positiveDetail": (
        "Mercury with Jupiter gives a positive personality trait to perform well even in challenging "
        "situations. They are known for their wise and intellectual approach, attaining high rank and "
        "managing wealth effectively. They handle relationship challenges with an eloquent approach "
        " and build a strong social image. Career paths include teaching, mentoring, influencing, "
        "law, writing, and preaching. If exalted, they may excel in creative fields like acting and directing."
    ),
    "negativeDetail": (
        "Mercury with Jupiter may create challenges due to overthinking and a self-centered approach. "
        "A tendency to project an image of being highly knowledgeable may lead to relationship difficulties. "
        "Greed for wealth gains can trigger financial losses through deception and poor judgment. "
        "Confusion and information overload may lead to academic failures or lack of concentration. "
        "Affliction can cause a dominating personality that affects peace in marital and love relationships."
    ),
    "healthDetails": {
        "afflictionEffects": "Obesity, nerve-related health issues, indigestion, liver disorders, diabetes tendency, and hormonal imbalance may cause challenges during Mercury or Jupiter periods if afflicted."
    },
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Highly intellectual and good at debate to find the conclusion. Your presence makes everything positive. You possess high moral values and a balanced mindset. You will have a young look with a charming personality and maintain harmony in relationships with maturity."
        },
        {
            "house": "4th House",
            "detail": "Support from the mother and maternal family with a wise educational background. Good commands over emotions along with a highly intellectual approach help manage emotional challenges. You will have a big house and enjoy comfort from vehicles."
        },
        {
            "house": "7th House",
            "detail": "Optimistic approach and clarity about life direction. You will attain a good rank in society and find growth in business. Early marriage and a successful marital life with an intelligent, educated, and spiritually inclined spouse."
        },
        {
            "house": "10th House",
            "detail": "Rise to a wise and intellectual approach. Paternal family belongs to an educated and stable lifestyle. Success in businesses dealing with education, telecommunications, printing, and law. Affliction may lead to deception at the workplace or loss of status."
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
    db = client["Two_Planet_Conjunction"]
    col = db["Mercury_Jupiter"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Mercury_Jupiter collection (Two Planet): document {action}.")
    print(f"     Total documents in Mercury_Jupiter: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Updating Mercury_Jupiter collection...")
    asyncio.run(seed())
    print("[+] Done.")
