"""
Seed: Jupiter_Mars_Saturn_Sun collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mars-Jupiter-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a highly popular and committed leader who never strays from fulfilling promises.",
        "Combines Authority (Sun), Drive (Mars), Wisdom (Jupiter), and Discipline (Saturn) for social prominence.",
        "Natives enjoy the grace of the government and maintain cordial relationships with a large social circle."
    ],
    "planetRoles": {
        "Sun": "Authority, government grace, eminent rank, status, ego",
        "Mars": "Drive, action, commitment to tasks, courage, physical energy",
        "Jupiter": "Wisdom, popularity, social circle, relative cordiality, fulfillment of promises",
        "Saturn": "Discipline, structure, psychological depth, wrapping up tasks, endurance"
    },
    "effects": {
        "powerfulSun": [
            "Grants the grace of the government and favour from people of eminent rank.",
            "Ensures a prominent status in society, making the native popular among peers.",
            "Provides a strong authoritative presence that is respected in high-level circles."
        ],
        "powerfulMars": [
            "Grants the drive to start and wrap up tasks with unmatched commitment and focus.",
            "Ensures the native never relaxes until a project is completed successfully.",
            "Provides the courage and physical vitality needed to manage a large social network."
        ],
        "powerfulJupiter": [
            "Grants an expansive social circle and cordiality in relationships with relatives.",
            "Ensures the native is known for their integrity and for never breaking a commitment.",
            "Provides wise guidance that attracts attention and respect from colleagues and family."
        ],
        "powerfulSaturn": [
            "Grants a structured approach to fulfilling promises and managing heavy responsibilities.",
            "Ensures that tasks are finished with precision, though it may cause mental exhaustion.",
            "Provides psychological depth, allowing the native to understand complex social dynamics."
        ]
    },
    "nature": {
        "positive": [
            "Highly reliable individual who is deeply committed to their word and promises.",
            "Popular social leader with a large, supportive network of friends and relatives.",
            "Enjoys high-status recognition from state authorities and eminent individuals.",
            "Consistent finisher who only relaxes once the work is fully wrapped up."
        ],
        "negative": [
            "Potential for psychological or mental disorders due to extreme focus on wrap-up and commitment.",
            "Over-exhaustion and stress from taking on too many responsibilities for the social circle.",
            "Internal pressure to maintain a perfect public image and fulfill every social promise.",
            "Risk of neglecting personal peace in pursuit of social prominence and status."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong determined personality; popular social bearing; success in authoritative roles."
        },
        {
            "house": "10th House",
            "effect": "Grace of government and eminent rank; career success through commitment and trust."
        },
        {
            "house": "11th House",
            "effect": "Large social circle; gains through high-status friends and fulfills all social promises."
        },
        {
            "house": "2nd House",
            "effect": "Cordial relationships with relatives; stability in wealth through government-connected work."
        }
    ],
    "keywords": ["sun", "mars", "jupiter", "saturn", "conjunction", "popular", "commitment", "reliable", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun grants you the grace of the government and favour from people of eminent rank. "
            "You are naturally popular among your peers and possess an aura of authority that makes "
            "you a prominent figure in your social and professional circle. Your status is built on "
            "the foundation of trust and high-level recognition."
        ),
        "powerfulMars": (
            "Mars provides the drive to fulfill your promises with unmatched intensity. Once you start "
            "a task, you only relax after wrapping it up completely. Your commitment to your word "
            "is your greatest asset, ensuring that you are seen as a reliable and brave leader "
            "who never backs down from a challenge or a commitment."
        ),
        "powerfulJupiter": (
            "Jupiter acts as your source of social popularity, helping you maintain a large and cordial "
            "circle of relatives and friends. It grants you the wisdom to value integrity above "
            "all else, ensuring you never stray from your commitments. You are highly respected "
            "for your moral standing and your ability to bring people together under your wise guidance."
        ),
        "powerfulSaturn": (
            "Saturn is the disciplinarian that ensures your promises are kept with precision. It grants "
            "you the endurance to see projects through to the very end. While it provides "
            "psychological depth, you must be careful not to let the pressure of perfect "
            "commitment lead to mental exhaustion or psychological stress, as Saturn demands "
            "constant structure in your social and personal life."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Committed Social Leader' personality. You are someone who is "
        "highly popular and enjoys a large, supportive social network. Your reputation is based "
        "on your unwavering integrity—you never break a promise and only rest once your "
        "tasks are wrapped up. You enjoy the grace of the government and the support of "
        "eminent individuals, allowing you to rise to high ranks in your career. Your "
        "cordial relationships with relatives and peers provide a strong foundation for "
        "long-term success. You are a person of deep psychological understanding and "
        "unmatched commitment, making you a vital and trusted pillar in your community."
    ),
    "negativeDetail": (
        "Negative influences manifest as extreme mental pressure and the potential for psychological "
        "disorders if the drive to fulfill promises becomes overwhelming. The stress of "
        "maintaining social prominence and the 'perfect finisher' image can lead to mental "
        "exhaustion. While the conjunction is generally positive, the intensity of these "
        "four powerful planets can sometimes create an 'average' experience if the native "
        "suffers from psychological strain or over-commitment. Balancing your social "
        "duties with internal peace is essential to avoid the mental disorders that "
        "can arise from such heavy planetary weight."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a strong determined personality and a popular social aura. You are known for fulfilling all commitments and receive significant gains from authoritative roles and government connections. Your large social circle provides a constant stream of opportunities."
        },
        {
            "house": "10th House",
            "detail": "Ensures a successful career with the grace of the government. You rise to an eminent rank by being the person who never leaves a task unfinished. Your reliability makes you the first choice for senior authorities looking for a trusted leader."
        },
        {
            "house": "11th House",
            "detail": "Powerhouse for social gains and networking. You enjoy a massive circle of high-status friends and relatives who support your ambitions. Your reputation for keeping promises ensures that your social status only grows with time."
        },
        {
            "house": "2nd House",
            "detail": "Identity is defined by cordial relative bonds and stable inheritance or government gains. You possess a bold but wise way of speaking that ensures others value your commitment. Your wealth is sustained through reliable and high-status professional connections."
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
    # Alphabetical order: Jupiter, Mars, Saturn, Sun
    col_name = "Jupiter_Mars_Saturn_Sun"
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
    print("[*] Seeding Jupiter_Mars_Saturn_Sun four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
