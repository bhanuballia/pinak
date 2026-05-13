"""
Seed: Moon_Saturn_Sun_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Venus-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a royal, disciplined, and hardworking personality with a mastery over hidden skills.",
        "Combines Authority (Sun), Emotions (Moon), Attraction (Venus), and Endurance (Saturn) for aesthetic stability.",
        "Natives excel in creative infrastructure, engineering, backend leadership, and high-status political careers."
    ],
    "planetRoles": {
        "Sun": "Authority, father, status, discipline, moral values, birthplace attachment",
        "Moon": "Mind, emotions, mother, intuition, creative implementation, emotional stability",
        "Venus": "Love, beauty, technical skills, hidden languages, rejuvenation, luxury",
        "Saturn": "Discipline, endurance, hard work, introspection, backend results, structure"
    },
    "effects": {
        "powerfulSun": [
            "Grants high moral values and a structured approach toward career and financial plans.",
            "Ensures strong support from higher authorities and significant gains from the paternal family.",
            "Provides an emotional attachment to the birthplace and a demand for attention in relationships."
        ],
        "powerfulMoon": [
            "Grants the ability to work under intense pressure and implement creative ideas successfully.",
            "Ensures emotional stability and a secure environment at both home and the workplace.",
            "Provides the luxury to enjoy food, clothes, and high-status items with maternal support."
        ],
        "powerfulVenus": [
            "Grants mastery over hidden or coded languages and advanced technical or engineering skills.",
            "Ensures success in creative business industries to attain a high rank even in challenges.",
            "Provides stability and sustenance in love and marital life through a disciplined approach."
        ],
        "powerfulSaturn": [
            "Grants an introspective approach that finds solutions where others fail, especially in backend work.",
            "Ensures a hardworking personality that eventually reaches a high rank through endurance.",
            "Provides a reserved nature that balances the outgoing energies of Sun and Venus with structure."
        ]
    },
    "nature": {
        "positive": [
            "Royal lifestyle with the luxury to enjoy status and comfort like a royal family.",
            "Master of planning and balance, achieving expected growth through strategic endurance.",
            "Strong political connections and success in high-status government-connected careers.",
            "Stability in marital life through rejuvenation in love and a supportive emotional circle."
        ],
        "negative": [
            "Greed, jealousy, and self-centeredness leading to dryness in emotions and relationships.",
            "Emotional gaps or communication breakdowns with father and senior bureaucrats.",
            "Frozen emotions and difficulty expressing feelings to a partner if Saturn and Venus conflict.",
            "Potential loss of social standing or relationship challenges due to overruling ethical values."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Noticeable personality with strong immunity; success in infrastructure or recycling sectors."
        },
        {
            "house": "5th House",
            "effect": "High intellectual ability and multiple income sources; artistic and romantic approach."
        },
        {
            "house": "10th House",
            "effect": "Directional strength for Sun; mastery over difficult situations and backend career growth."
        },
        {
            "house": "7th House",
            "effect": "Stability if Venus is well-placed, though potential for silence or frozen emotions in love."
        }
    ],
    "keywords": ["sun", "moon", "venus", "saturn", "conjunction", "royal", "technical", "endurance", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun with Venus demands attention in relationships and structure in your career. You "
            "possess high moral values and a deep attachment to your birthplace. Supported by higher "
            "authorities and your paternal family, you execute financial plans with a disciplined "
            "approach that ensures you enjoy the finest luxuries life has to offer."
        ),
        "powerfulVenus": (
            "Venus grants you mastery over hidden codes and technical skills. You possess a strict and "
            "disciplined approach to calculations, allowing you to attain high rank in creative or "
            "business industries. Even in challenging situations, your mastery of design and "
            "development ensures that you rejuvenate your career and personal life with grace."
        ),
        "powerfulMoon": (
            "Moon provides the emotional stability needed to work under pressure. You excel at implementing "
            "creative ideas and building a secure environment for your family. Your life is filled "
            "with the enjoyment of food and high-status items, supported by the maternal lineage "
            "and a deep intuitive connection to your domestic surroundings."
        ),
        "powerfulSaturn": (
            "Saturn acts as your anchor of endurance. It grants a reserved and introspective personality "
            "that thrives in backend work. You find solutions to problems that baffle others, and "
            "though you may maintain a distant relationship with public leaders, your hardworking "
            "nature ensures you eventually reach a respected rank in your chosen field."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Royal Builder' personality. You live a lifestyle characterized by "
        "comfort, status, and luxury, often with strong political or government connections. Your "
        "strength lies in planning and balance, allowing you to achieve consistent growth through "
        "patience. Supported by your mother and maternal family, you often gain property or vehicles "
        "that raise your social status. Your marital life is sustained through a disciplined yet "
        "rejuvenating love, where your ability to master complex technical or creative skills "
        "makes you a vital asset to your community and lineage. You are a person of high moral "
        "standing who finds success through a blend of royal bearing and hardworking endurance."
    ),
    "negativeDetail": (
        "Negative influences manifest as greed and a self-centered approach that alienates those around "
        "you. Affliction can cause a huge emotional gap between you and your father, and "
        "challenges with bureaucrats may arise. If Saturn and Venus are in close conflict, "
        "your emotions may feel 'frozen,' making it difficult to express love or maintain "
        "harmony at home. Jealousy and anger can disrupt your social standing, and you must "
        "be careful not to overrule your moral values for short-term gain, as this could "
        "lead to long-term relationship challenges and a lack of mental peace."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a noticeable personality and strong immunity. You follow a disciplined and strict lifestyle, often finding success in construction, engineering, or infrastructure sectors. Guidance from your father is essential to overcome ego clashes and maintain high moral values."
        },
        {
            "house": "5th House",
            "detail": "Identity is defined by high intellectual ability and artistic romance. You likely have multiple sources of income and intuitive abilities that help build strong family bonds. While you face overthinking due to the Sun-Moon association, you maintain a romantic and creative outlook."
        },
        {
            "house": "10th House",
            "detail": "Ensures a powerful career where you find solutions for even the most difficult situations. You grow through the guidance of bosses and your father, overcoming challenges with ease. While Saturn may make your professional emotions feel frozen, your results remain high-status and steady."
        },
        {
            "house": "7th House",
            "detail": "Powerhouse for marital stability if Venus is not afflicted. While you may experience silence or an emotional distance in relationships due to Saturn's presence, your overall planning and balance ensure that your partnerships contribute to your long-term status rise."
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
    # Alphabetical order: Moon, Saturn, Sun, Venus
    col_name = "Moon_Saturn_Sun_Venus"
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
    print("[*] Seeding Moon_Saturn_Sun_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
