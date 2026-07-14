"""
Seed: Mars_Mercury_Sun_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mars-Mercury-Venus Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a dynamic, creative, and highly communicative leader with a youthful aura.",
        "Combines Authority (Sun), Passion (Mars), Logic (Mercury), and Attraction (Venus) for expressive success.",
        "Natives excel in creative leadership, sports, brand management, and government-connected technical roles."
    ],
    "planetRoles": {
        "Sun": "Authority, father, status, discipline, structured expression, career rise",
        "Mars": "Passion, enthusiasm, quick decisions, courage, humor, competitiveness",
        "Mercury": "Logic, youthfulness, business ideas, sports acumen, eloquent speech",
        "Venus": "Love, beauty, comfort, luxury, creative expression, relationship management"
    },
    "effects": {
        "powerfulSun": [
            "Grants the ability to present ideas in a structured way and transform desires into reality.",
            "Ensures high moral values and success in financial matters to enjoy a wealthy life.",
            "Provides strong support from higher authorities and a deep emotional attachment to the birthplace."
        ],
        "powerfulMars": [
            "Grants a passionate and enthusiastic personality with the drive to find solutions without delay.",
            "Ensures a good sense of humor and the courage to participate in work-related risks.",
            "Provides natural leadership and the readiness to help siblings and friends in creative projects."
        ],
        "powerfulMoon": [
            "Note: This conjunction lacks the Moon, but its logic is handled by Mercury and its charm by Venus.",
            "Natives rely on structured effort and diplomatic speech rather than raw emotional intuition.",
            "Strong family understanding is built through logical guidance rather than pure empathy."
        ],
        "powerfulMercury": [
            "Grants an attractive, youthful look and exceptional clarity in decision-making.",
            "Ensures success in business with multiple innovative ideas and a sweet, attractive voice.",
            "Provides success in sports, racing, or technology-based careers like video games or chess."
        ],
        "powerfulVenus": [
            "Grants priority for comfort and luxury, with the ability to manage relationships with grace.",
            "Ensures gains in property and government support to enjoy a high-status lifestyle.",
            "Provides a good sense of understanding that helps fix loopholes in both personal and professional life."
        ]
    },
    "nature": {
        "positive": [
            "Natural multitasker who performs exceptionally well even in high-pressure situations.",
            "Eloquent communicator who balances bold leadership with creative and expressive charm.",
            "Wealthy life fueled by strong passion and the motivation to attain high-rank goals.",
            "Supportive social circle and family bonds, guided by the wisdom of the father and siblings."
        ],
        "negative": [
            "Over-expectations and aggression causing instability and challenges to mental peace.",
            "Envy and hostility affecting marital life due to a self-centered or dominating approach.",
            "Competitive jealousy at work that can drag the native toward unnecessary conflicts.",
            "Financial dependency or sudden losses due to repetitive mistakes and lack of clear planning."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Dynamic multitasker; eloquent speech; noticeable personality with a disciplined lifestyle."
        },
        {
            "house": "5th House",
            "effect": "Success in real estate and engineering; recognition for creative skills; strong bond with children."
        },
        {
            "house": "10th House",
            "effect": "Passion in career; rise in status and high moral values; success in government/business."
        },
        {
            "house": "7th House",
            "effect": "Marital life requires space; success if Venus/Mercury are strong, though dominance must be checked."
        }
    ],
    "keywords": ["sun", "mars", "mercury", "venus", "conjunction", "creativity", "passion", "youthful", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun allows you to present your ideas with structure and discipline. You transform "
            "your desires into reality through focused effort, supported by higher authorities. You "
            "possess high moral values and a deep attachment to your birthplace, ensuring that your "
            "rise in status is built on a foundation of integrity and family support."
        ),
        "powerfulMars": (
            "Mars provides the passion and enthusiasm to act quickly. You possess a good sense of humor "
            "and are always ready for new challenges. Combined with Mercury, it ensures you find "
            "solutions without delay, leading your team with a brave and motivated spirit that "
            "doesn't shy away from creative risks or travel-related opportunities."
        ),
        "powerfulMercury": (
            "Mercury grants you a youthful aura and exceptional clarity of thought. You are a natural "
            "business thinker with multiple good ideas that translate into financial success. Your "
            "voice is sweet and attractive, helping you present complex ideas without getting "
            "nervous, especially when dealing with a mass audience or competitive fields like sports."
        ),
        "powerfulVenus": (
            "Venus ensures you give priority to comfort and the finer things in life. You possess the "
            "ability to connect with others on a deep, creative level, managing both personal and "
            "professional relationships with grace. Gains in property and support from the government "
            "are common, allowing you to enjoy a high-status life with emotional fulfillment."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Creative Dynamo' personality. You are a natural multitasker who "
        "excels under pressure, blending bold leadership with expressive charm. Your family "
        "and friends provide the guidance needed to make the right financial decisions, often "
        "following the instructions of your father. You possess a strong passion for wealth and "
        "status, and the presence of the Sun with Mars motivates you to attain those goals "
        "systematically. In your love life, you are expressive and caring, using your "
        "diplomatic speech and high-status bearing to build a legacy of success and "
        "grace in your chosen creative or technical field."
    ),
    "negativeDetail": (
        "Negative influences manifest as a lack of mental peace driven by over-expectations and raw "
        "aggression. Envy and jealousy can disrupt your domestic harmony if you allow a "
        "self-centered approach to dominate your views. On the professional front, excessive "
        "competitiveness can lead to sudden clashes or instability. You must guard against "
        "financial dependency and manage your health, particularly digestion, to ensure that "
        "your high-energy drive doesn't lead to chronic stress or failed personal bonds."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a dynamic personality and noticeable aura. You are a natural multitasker who handles responsibilities in a structured manner. While you face marital challenges if you dominate others, your eloquent speech and disciplined lifestyle ensure steady growth in politics or leadership."
        },
        {
            "house": "5th House",
            "detail": "Identity is centered on creative skills and success in real estate or engineering. You are blessed with a good number of followers and children who do well in their lives. While you must guard against digestion issues, your ability to work on multiple tasks ensures consistent recognition."
        },
        {
            "house": "10th House",
            "detail": "Ensures a successful career with a platform for constant new ideas. You possess high moral values and a passionate drive that leads to a rise in status. Your eloquence and business ideas, supported by the government, make you a force to be reckoned with in any professional sector."
        },
        {
            "house": "7th House",
            "detail": "Powerhouse for public connections and business growth. While your domestic life requires you to give space to your partner, your ability to express love and care ensures that your partnerships eventually contribute to your overall wealth and luxurious lifestyle."
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
    # Alphabetical order: Mars, Mercury, Sun, Venus
    col_name = "Mars_Mercury_Sun_Venus"
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
    print("[*] Seeding Mars_Mercury_Sun_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
