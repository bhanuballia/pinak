"""
Seed: Jupiter_Saturn_Sun_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Jupiter-Venus-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a fearless, artistic, and highly persuasive personality who is popular among the masses.",
        "Combines Authority (Sun), Wisdom (Jupiter), Attraction (Venus), and Endurance (Saturn) for social influence.",
        "Natives excel in arts like sculpting and poetry but often remain a loner in their personal sphere."
    ],
    "planetRoles": {
        "Sun": "Authority, leadership, high-position favours, status, ego",
        "Jupiter": "Wisdom, persuasion, eloquence, social popularity, artistic excellence",
        "Venus": "Attraction, sculpting, poetry, arts, jealousy (when afflicted), luxury",
        "Saturn": "Fearlessness, courage, harshness, loner nature, lack of trusted confidants"
    },
    "effects": {
        "powerfulSun": [
            "Grants strong leadership qualities and the ability to enjoy favours from people in higher positions.",
            "Ensures an authoritative presence that is respected by the masses and social circles.",
            "Provides the status required to attain positions of power through public popularity."
        ],
        "powerfulJupiter": [
            "Grants the art of persuasion and an eloquent speaking style that attracts social authority.",
            "Ensures a wise and respected personality who excels at traditional or creative wisdom.",
            "Provides a broad vision that allows the native to connect with diverse groups of people."
        ],
        "powerfulVenus": [
            "Grants excellence in many arts, particularly sculpting and poetry, with a refined aesthetic sense.",
            "Ensures an attractive social aura that draws the attention and respect of peers.",
            "Provides a passionate approach toward creative projects, though it may lean toward jealousy."
        ],
        "powerfulSaturn": [
            "Grants a fearless soul and exceptional courage to face life's most difficult challenges.",
            "Ensures a disciplined and structured approach to arts, though it may result in a harsh nature.",
            "Provides the endurance to thrive in public life while maintaining a reserved, loner private life."
        ]
    },
    "nature": {
        "positive": [
            "Fearless and courageous individual who excels at multiple creative arts and poetry.",
            "Eloquent and persuasive speaker who attains authority through charismatic public discourse.",
            "Highly popular among the masses and enjoys significant favours from high-ranking individuals.",
            "Strong leadership skills backed by a refined aesthetic and artistic understanding."
        ],
        "negative": [
            "Tendency to get easily jealous of others' achievements and social standing.",
            "Harsh or mean nature that can alienate those who attempt to get close.",
            "Remains a loner in the personal sphere despite having an active and popular public life.",
            "Lack of trusted confidants or close friends whom they can share secrets with."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Fearless determined personality; popular social bearing; success in artistic leadership."
        },
        {
            "house": "10th House",
            "effect": "High rank through public persuasion; favours from eminent authorities; success in arts/politics."
        },
        {
            "house": "5th House",
            "effect": "Exceptional talent in sculpting and poetry; creative fame; recognition for artistic courage."
        },
        {
            "house": "7th House",
            "effect": "Popularity through partnership, though personal domestic life remains loner-like and reserved."
        }
    ],
    "keywords": ["sun", "jupiter", "venus", "saturn", "conjunction", "fearless", "persuasive", "artistic", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun grants you high leadership qualities and the ability to enjoy significant favours "
            "from people in higher positions. You are seen as a natural leader by the masses, "
            "possessing an authoritative presence that allows you to rise to high ranks through your "
            "charismatic and popular social standing."
        ),
        "powerfulJupiter": (
            "Jupiter provides you with the art of persuasion and an eloquent speaking style. You are "
            "highly skilled at convincing others of your vision, which helps you gain positions "
            "of authority. Your wisdom is respected, and you maintain a popular presence "
            "that draws people toward your intellectual and creative guidance."
        ),
        "powerfulVenus": (
            "Venus ensures you excel at many arts, specifically sculpting and poetry. You have a "
            "refined aesthetic sense and a creative drive that makes your work stand out. While "
            "you possess a charming social aura, you must guard against getting easily jealous "
            "of others' achievements, using your artistic passion to fuel your own growth instead."
        ),
        "powerfulSaturn": (
            "Saturn is the source of your fearlessness and courage. It grants you the endurance to "
            "face challenges head-on but can also make you a loner in your personal sphere. You "
            "may have a harsh or mean nature at times, which prevents people from getting "
            "close, ensuring that your private life remains separate from your active public "
            "persona."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Fearless Artistic Leader' personality. You are someone who is "
        "popular among the masses and widely respected for your strong leadership qualities. Your "
        "eloquence and persuasive speaking skills help you attain authority, while your "
        "fearless soul allows you to excel at complex arts like sculpting and poetry. "
        "Favours from people in eminent positions follow you throughout your career, "
        "and you are known for your courage in both your personal and professional "
        "actions. You build a legacy of public success, marked by an authoritative "
        "command that others find both inspiring and intimidating."
    ),
    "negativeDetail": (
        "Negative influences manifest as a harsh and mean nature that creates an emotional gap in your "
        "personal life. Despite being famous and popular, you tend to remain a loner in "
        "your private sphere. You lack close confidants whom you can trust and share "
        "secrets with, often feeling isolated despite the crowd's applause. A tendency "
        "to be jealous of others' success can further isolate you, and your harsh "
        "demeanor may drive away potential allies who attempt to cross the barrier "
        "of your public persona."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native is fearless and possesses a royal social bearing. You are known for your eloquent speech and artistic mastery. While you face a loner personal life, your public popularity guarantees a high rank in leadership or creative sectors."
        },
        {
            "house": "10th House",
            "detail": "Ensures a successful career in public leadership or the arts. You rise to a position of power through your persuasive communication and favours from senior authorities. Your artistic excellence in poetry or sculpting brings you significant fame."
        },
        {
            "house": "5th House",
            "detail": "Powerhouse for creative fame and recognition. You excel in sculpting and poetry, using your courageous and fearless nature to push the boundaries of artistic expression. Your children may also show a strong inclination toward authoritative or artistic roles."
        },
        {
            "house": "7th House",
            "detail": "Identity is centered on public popularity and persuasive partnerships. However, your marital or personal life may lack deep emotional intimacy, as you remain a loner at heart who struggles to trust others with your private secrets."
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
    # Alphabetical order: Jupiter, Saturn, Sun, Venus
    col_name = "Jupiter_Saturn_Sun_Venus"
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
    print("[*] Seeding Jupiter_Saturn_Sun_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
