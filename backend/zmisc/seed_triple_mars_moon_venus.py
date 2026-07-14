"""
Seed: Mars_Moon_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Mars-Venus Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly magnetic, passionate, and artistically brilliant personality.",
        "Combines Mind (Moon), Passion (Mars), and Beauty (Venus) for an irresistibly charming aura.",
        "Natives possess emotional courage, exceptional creative depth, and a natural penchant for luxury and aesthetics."
    ],
    "planetRoles": {
        "Moon": "Mind, emotions, intuition, emotional intelligence, psychic receptivity",
        "Mars": "Passion, courage, aggressive drive, humor, physical endurance",
        "Venus": "Art, beauty, charm, luxury, prosperity, romantic stabilization"
    },
    "effects": {
        "powerfulMoon": [
            "Ensures intuitive decision-making in relationships and strong confidence in team leadership.",
            "Grants high emotional intelligence to navigate professional ups and downs gracefully.",
            "Blesses the native with the ability to lead a team with empathy and clarity."
        ],
        "powerfulMars": [
            "Channels aggressive energy and passion into poetic or expressive talents and a good sense of humor.",
            "Ensures a committed and loyal nature, ready to support those in need.",
            "May make it difficult to work under others due to a strong, self-governing drive."
        ],
        "powerfulVenus": [
            "Blesses with exceptional talents in art, music, design, film, and fashion.",
            "Stabilizes emotional waves and aggression, resulting in deep, affectionate behavior.",
            "Brings material prosperity and the ability to control sensual energy positively."
        ]
    },
    "nature": {
        "positive": [
            "Artistic brilliance and charismatic presence that captivates large audiences.",
            "Boldness in expressing feelings and desires with emotional depth and flair.",
            "Natural penchant for beauty, fashion, and luxury, leading to success in the glamour industry.",
            "Eloquent and poetic approach to life, helping to survive emotional swings classily."
        ],
        "negative": [
            "Emotional drama, mood swings, and overexpectations in personal relationships.",
            "Possessive and controlling nature in love, often leading to jealousy or rivalries.",
            "Sexual restlessness and potential for love triangles or difficulty with fidelity.",
            "Lavish spending and overindulgence in luxuries causing unplanned financial strain."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong magnetic personality; successful in entertainment or fashion; charismatic public life."
        },
        {
            "house": "5th House",
            "effect": "Creative mindset with inclination toward drama and performance; multiple sources of income."
        },
        {
            "house": "9th House",
            "effect": "Duty-bound and religious personality; blends creativity with spiritual teaching."
        },
        {
            "house": "10th House",
            "effect": "Strong career success through artistic flair and bold leadership; high ambitions and fame."
        }
    ],
    "keywords": ["moon", "mars", "venus", "conjunction", "passion", "artistic", "charm", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulMoon": (
            "A strong Moon ensures intuitive decision-making, particularly in relationships. It helps you "
            "build and lead teams with emotional intelligence, surviving the high and lows of career "
            "life with grace. You lead others with confidence, using your empathy to maintain "
            "harmony in your professional circles."
        ),
        "powerfulMars": (
            "With Mars in good strength, you channel your intense passion into poetic or expressive talents. "
            "You possess a great sense of humor and a loyal, committed nature. While you may find it "
            "challenging to work under strict subordinates, you are a fearless supporter of those "
            "who require help."
        ),
        "powerfulVenus": (
            "Venus grants you irresistible charm and brilliance in art, design, or fashion. It stabilizes "
            "the fiery energy of Mars and the emotional tides of the Moon, resulting in deep, romantic "
            "behavior. You enjoy prosperity and possess a rare ability to channel sensual energy "
            "into positive, material accomplishments."
        )
    },
    "positiveDetail": (
        "This triple conjunction produces an attractive personality with a sound physical appearance. "
        "You possess artistic brilliance in music, dance, or painting, captivate audiences with "
        "emotional depth and leadership. Your emotional courage allows you to be bold in expressing "
        "desires, while your refined sense of aesthetics leads to success in the glamour industry or "
        "luxury décor. People are naturally drawn to your eloquent and poetic approach, and you "
        "survive emotional swings classily. Mars and Venus together ensure you work hard for "
        "your comforts, achieving a harmonious blend of passion and prosperity."
    ),
    "negativeDetail": (
        "Negative influences manifest as overexpectations and a lack of patience in relationships. "
        "Possessiveness and a tendency to dominate partners can lead to emotional drama and "
        "mood swings. Sexual restlessness or a difficulty with fidelity may cause stable "
        "relationships to falter. Affliction can turn your charm into arrogance or a demanding "
        "nature, affecting your emotional health. Lavish spending on fleeting pleasures or "
        "overindulgence in food and sex can scatter your energy and lead to unplanned "
        "financial setbacks and a lack of professional focus."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a magnetic personality and active passion toward career and romance. Multiple relationships may precede a committed one, but you eventually find romantic success through charisma. You excel in roles requiring self-expression, though you must guard against vanity and impulsive short tempers."
        },
        {
            "house": "5th House",
            "detail": "Identity is shaped by a creative mindset and an early inclination toward drama. You enjoy a successful love life with partner support and deep bonding with children. Multiple income sources are indicated, but over-emotional involvement can lead to relationship breaks."
        },
        {
            "house": "9th House",
            "detail": "A duty-bound, religious approach to life ensures growth and success. You blend creativity with spiritual teaching, potentially becoming a cultural icon or preacher. However, affliction can lead to conflicts with mentors or misguided emotional loyalty."
        },
        {
            "house": "10th House",
            "detail": "Strongly career-oriented with high ambitions and fame. Your public image is seen as both nurturing and persuasive, leading to fast recognition in creative or feminine industries. Bold leadership and artistic flair ensure you climb the success ladder with confidence."
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
    # Alphabetical order: Mars, Moon, Venus
    col_name = "Mars_Moon_Venus"
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
    print("[*] Seeding Mars_Moon_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
