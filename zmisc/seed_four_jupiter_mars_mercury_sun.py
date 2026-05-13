"""
Seed: Jupiter_Mars_Mercury_Sun collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mars-Mercury-Jupiter Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents an active, attractive, and highly intelligent leader with a strong determined personality.",
        "Combines Authority (Sun), Drive (Mars), Logic (Mercury), and Wisdom (Jupiter) for strategic dominance.",
        "Natives excel in government administration, engineering, infrastructure, and high-rank financial business."
    ],
    "planetRoles": {
        "Sun": "Authority, father, status, boldness, career rise, straight decisions",
        "Mars": "Drive, motivation, leadership, siblings, property, physical vitality",
        "Mercury": "Logic, learning, business ideas, interpretation, diplomatic speech, multitasking",
        "Jupiter": "Wisdom, clarity, vision, higher education, financial intelligence, mentoring"
    },
    "effects": {
        "powerfulSun": [
            "Grants boldness in voice and the courage to make unbiased, straight decisions.",
            "Ensures a big status and a significant rise in career with consistent financial gains.",
            "Provides the courage to take a stand, supported by a wise and understandable approach to family."
        ],
        "powerfulMars": [
            "Grants the drive and motivation to achieve higher goals in government or private business.",
            "Ensures natural leadership qualities and the readiness to help siblings and neighbors.",
            "Provides gains in property and vehicles, fueled by a prominent ambition to lead."
        ],
        "powerfulMercury": [
            "Grants the ability to interpret coded messages and learn effectively from hearing.",
            "Ensures clarity in thoughts and speech when presenting ideas to a mass audience.",
            "Provides growth through following the suggestions of the father and senior elders."
        ],
        "powerfulJupiter": [
            "Grants exceptional clarity in vision and success in higher educational pursuits.",
            "Ensures wise and intelligent decisions related to business, finance, and investment.",
            "Provides a humanitarian and spiritual outlook that attracts the support of wise mentors."
        ]
    },
    "nature": {
        "positive": [
            "Skillful at balancing personal expression with social grace and diplomatic charm.",
            "Active and attractive personality that thrives on new technologies and strategic challenges.",
            "Strong bond with friends, siblings, and neighbors, ensuring a life of abundance and support.",
            "Innovative thinker who successfully runs companies or builds high-performance teams."
        ],
        "negative": [
            "Ego clashes and unnecessary anger with senior authorities and elderly figures.",
            "Health challenges related to high blood pressure, fevers, or being overweight.",
            "Legal hurdles and loss of property or fame if the ego dominates moral values.",
            "Lack of faith or morality in relationships leading to anxiety and financial cheating."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong determined personality; mastery over many languages; success in raw materials/infrastructure."
        },
        {
            "house": "5th House",
            "effect": "Diplomatic speech that grabs opportunities; success in building teams and running companies."
        },
        {
            "house": "10th House",
            "effect": "Support from wise elders; success in communication/infrastructure and government roles."
        },
        {
            "house": "9th House",
            "effect": "Life-changing long-distance travel; strong inclination toward spiritual and traditional growth."
        }
    ],
    "keywords": ["sun", "mars", "mercury", "jupiter", "conjunction", "leadership", "vision", "drive", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun with Mercury grants you a bold voice and the courage to make unbiased "
            "decisions. You are not afraid to take a stand, especially when supported by the "
            "aggressive drive of Mars. Your status rises significantly, and you find success "
            "in your career by adopting a wise approach that maintains harmony with your "
            "family and professional peers."
        ),
        "powerfulMars": (
            "Mars provides the drive to achieve better results at every stage. You are motivated to "
            "excel in the government sector or build a business with the support of your father. "
            "Your ambition is prominent, and you are always ready to help your siblings. This "
            "natural leadership manifests in the gain of property and high-status vehicles, "
            "ensuring you are respected in your community."
        ),
        "powerfulMercury": (
            "Mercury grants you the unique ability to learn from hearing and interpret encrypted "
            "information. You excel at creating new business ideas and dealing with complex "
            "professional relationships. Your speech is clear and confident, even before large "
            "audiences, as you follow the wise suggestions of your father and elders to "
            "achieve your desired professional growth."
        ),
        "powerfulJupiter": (
            "Jupiter acts as your source of vision, providing the clarity needed for complex "
            "decision-making. You find immense success in higher studies and the financial sector. "
            "Combined with Mercury, it ensure that your business and investment choices are "
            "intelligent and wise, attracting the company of educated people and successful "
            "mentors who guide your long-term prosperity."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Visionary Leader' personality. You possess an active and "
        "attractive aura that thrives on new ideas and technological challenges. Growth is "
        "foreseen in the government, financial, or engineering sectors, especially when your "
        "speech is diplomatic and your actions are balanced by social grace. You are a "
        "loved member of your family and workplace, receiving the support of siblings and "
        "friends who admire your energetic work ethic. Long-distance travels may change "
        "your life, and your inclination toward spirituality provides the grounding needed "
        "to manage large teams and run successful companies with high moral values."
    ),
    "negativeDetail": (
        "Negative influences manifest as ego clashes and a lack of focus that can cause "
        "inconsistency in long-term tasks. Affliction can lead to high blood pressure, "
        "fevers, or legal challenges related to property. A tendency to gossip or overshare "
        "can cause sudden clashes with authorities. If the Sun is debilitated, fame may "
        "be lost, and a lack of morality in relationships could cause anxiety and "
        "mistrust. It is essential to avoid arrogance and maintain a polite but "
        "practical approach to prevent your ambitions from being blocked by unnecessary "
        "disagreements with elders."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a strong and determined personality, often mastering many languages. You excel in businesses involving raw materials or infrastructure, supported by a sense of maturity and disciplined structure. Your bond with family and mentors is deep, ensuring abundance through following their instructions."
        },
        {
            "house": "5th House",
            "detail": "Identity is defined by thriving on new ideas and people. You are skilled at building teams and running companies through diplomatic speech. While you must guard against inconsistency or oversharing, your ability to grab good opportunities ensures you stay ahead on the professional front."
        },
        {
            "house": "10th House",
            "detail": "Ensures success in government sectors dealing with communication or technical work. You are skilled at making decisions when faced with multiple opportunities, leading your team with a polite but firm practical approach. Guidance from wise elders is your greatest asset here."
        },
        {
            "house": "9th House",
            "detail": "Powerhouse for spiritual and philosophical growth. Long-distance travels or overseas connections may provide the breakthrough your career needs. Your strong inclination toward higher studies and traditional values helps you maintain a respectable rank in society."
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
    # Alphabetical order: Jupiter, Mars, Mercury, Sun
    col_name = "Jupiter_Mars_Mercury_Sun"
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
    print("[*] Seeding Jupiter_Mars_Mercury_Sun four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
