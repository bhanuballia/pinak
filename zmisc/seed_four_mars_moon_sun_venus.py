"""
Seed: Mars_Moon_Sun_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Moon-Mars-Venus Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a potent mix of power, emotions, bold action, and magnetic attraction.",
        "Grants a unique combination of high ambition, leadership, passion, and emotional intelligence.",
        "Creates a dynamic personality capable of managing complex social and professional roles with a 'Spotlight' presence."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, father, government favour, status, ego",
        "Moon": "Mind, emotions, mother, mental peace, empathy",
        "Mars": "Courage, action, aggression, protective instincts, vitality",
        "Venus": "Love, beauty, relationships, luxury, artistic refinement"
    },
    "effects": {
        "powerfulSun": [
            "Grants great fame, power, authority, and status, making the native an idol in society.",
            "Ensures strong support from the father and government authorities.",
            "Provides a disciplined approach to duty, often prioritizing results over raw emotions."
        ],
        "powerfulMars": [
            "Manifests as a strong-headed and bold personality with the courage to present innovative ideas.",
            "Grants the protective instinct to help others earn money and shield them with courageous support.",
            "Ensures a lovable group dynamic where the native never hesitates to lead outings or initiatives."
        ],
        "powerfulMoon": [
            "Provides high emotional intelligence and empathy, allowing the native to resolve complex challenges with ease.",
            "Ensures financial growth, savings, and domestic happiness through maternal support.",
            "Grants peace and success on the professional front, especially if in Cancer or Full Moon status."
        ],
        "powerfulVenus": [
            "Grants a graceful personality with bold decision-making abilities and a royal taste in fashion.",
            "Ensures the native remains in the spotlight due to unique charm and artistic refinement.",
            "Provides sound educational backgrounds and significant wealth gains from the spouse."
        ]
    },
    "nature": {
        "positive": [
            "Introspective and caring personality with deep self-respect and strong lineage blessings.",
            "Exceptional leadership and confidence that ensures success in public sectors or family business.",
            "Strong family and social presence, particularly supported by mother and siblings.",
            "Creative and passionate outlook that finds success in engineering, food, or government sectors."
        ],
        "negative": [
            "Ego clashes and dominance issues leading to strained relations with seniors or father.",
            "Relationship instability caused by over-expectations and emotional battles.",
            "Compromised peace at home or birthplace due to a lack of mental strength if Sun/Moon are weak.",
            "Potential for wrong decisions driven by aggression or a disregard for established norms."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Great fame, ingenious ideas, and strong intuitive powers; success in politics or public roles."
        },
        {
            "house": "4th House",
            "effect": "Positional strength for Moon and Venus; luxury home, royal status, and support from maternal relatives."
        },
        {
            "house": "7th House",
            "effect": "Dynamic business relationships; potential for a luxurious lifestyle if Malavya Yoga forms."
        },
        {
            "house": "10th House",
            "effect": "High-rank career in technical, defense, or government sectors; support of father is a major asset."
        }
    ],
    "keywords": ["sun", "moon", "mars", "venus", "conjunction", "power", "emotion", "passion", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "The Sun governs self-respect and intelligence. When powerful, it grants you great fame, "
            "status, and pride in your achievements. You become an ambitious leader who leads with "
            "discipline and authority, receiving significant favour from senior authorities and the "
            "government. Even in duty, you know how to manage anger with a principled approach."
        ),
        "powerfulMars": (
            "A strong Mars gives you a bold, courageous personality. You are not afraid to participate "
            "in work or social gatherings, making you a lovable person in any group. You protect "
            "others with your courage and help them achieve financial growth, though you must guard "
            "against overriding norms if the Sun is not there to balance your drive."
        ),
        "powerfulMoon": (
            "Moon provides the emotional intelligence needed to navigate complex challenges. If in its "
            "exaltation or in Cancer, it blesses you with a wealthy family, maternal support, and "
            "savings of every luxury. A Full Moon status ensures professional peace and happiness in "
            "relationships, giving you the empathy to lead others with a caring heart."
        ),
        "powerfulVenus": (
            "Venus grants you a royal taste and a unique sense of fashion that keeps you in the spotlight. "
            "You possess bold decision-making abilities and a refined educational background. "
            "Wealth gains from your spouse are likely, and your graceful presence makes you a "
            "dynamic force in both family and social circles."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Royal Dynamic' personality. You are introspective and caring, "
        "carrying deep self-respect and an inclination toward your lineage. Blessings from "
        "grandparents and parents are strong, especially when the Sun is dignified. You find "
        "immense success in the food, engineering, or government sectors. Supported by your "
        "mother and siblings, you grow steadily in your career, balancing your bold actions "
        "with an attentive and intuitive approach to life's many responsibilities."
    ),
    "negativeDetail": (
        "Negative influences manifest as ego clashes and emotional battles. Strained relationships with "
        "authority figures or father can arise if close conjunction degrees cause combustion or "
        "instability. You may develop a dominating personality that disrupts harmony in "
        "marital or professional partnerships. If the Sun and Moon lack strength, you might "
        "face challenges in finding stability at your birthplace or be forced to compromise "
        "too heavily in family matters. Misjudgments caused by aggression can lead to "
        "sudden breaks in growth if not carefully managed."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native attains great fame and status through ingenious ideas and disciplined conduct. You are energetic, socially active, and possess strong intuitive powers. Success is likely in public sectors, government, or carrying forward a successful family lineage."
        },
        {
            "house": "4th House",
            "detail": "Identity is centered on happiness from female friends and relatives. You take the initiative in domestic work and build a royal status for yourself. Your sense of beauty and art is well-developed, ensuring a luxurious and supportive home life."
        },
        {
            "house": "7th House",
            "detail": "Powerhouse for business growth and a luxurious lifestyle. While it brings ups and downs, a dignified Venus ensures that you overcome challenges to attain high professional and financial status, potentially forming the auspicious Malavya Yoga."
        },
        {
            "house": "10th House",
            "detail": "Ensures a successful career in technical sectors, defense forces, or the police. You have the full support of your father and likely rise to a high government rank. Domestic responsibilities are managed with an attentive and organized approach."
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
    # Alphabetical order: Mars, Moon, Sun, Venus
    col_name = "Mars_Moon_Sun_Venus"
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
    print("[*] Seeding Mars_Moon_Sun_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
