"""
Seed: Saturn_Sun_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Venus-Saturn Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a serious, disciplined, and refined personality with a classic charm.",
        "Combines Soul (Sun), Beauty (Venus), and Discipline (Saturn) for grounded authority and mature grace.",
        "Natives often achieve stable career success in old age, balancing artistic talent with consistent effort."
    ],
    "planetRoles": {
        "Sun": "Soul, authority, father, government status, ego",
        "Venus": "Beauty, luxury, arts, partnerships, social grace",
        "Saturn": "Discipline, consistency, stability, maturity, traditional values"
    },
    "effects": {
        "powerfulSun": [
            "Ensures power and authority to provide for the needy.",
            "Grants growth in cosmetics, legal sectors, medicine, and government work.",
            "Provides recognition for hard work and perfection in professional output."
        ],
        "powerfulVenus": [
            "Grants an attractive, magnetic look and a graceful demeanor.",
            "Provides a traditional approach to beauty and a royal vibe in decision-making.",
            "Ensures success in creative fields such as fashion, arts, and the financial sector."
        ],
        "powerfulSaturn": [
            "Manifests as a highly disciplined, serious, and refined personality.",
            "Instills a sense of responsibility in love and a deep respect for duties in partnerships.",
            "Grants the ability to manage heavy workloads and pressure with grounded authority."
        ]
    },
    "nature": {
        "positive": [
            "Graceful leadership with the ability to maintain excellent professional relationships.",
            "Serious, loyal, and mature approach to love with grounded romantic ideals.",
            "Mature beauty with classic attraction and a balanced public image.",
            "Success through creative brilliance and structured artistic talent."
        ],
        "negative": [
            "Emotional coldness, detachment, or potential for separation in relationships.",
            "Obstruction of creative and romantic energies leading to unfulfilled desires.",
            "Arrogant approach and fear of rejection causing delays in marriage and success.",
            "Legal challenges with siblings or colleagues due to a pessimistic or guarded attitude."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Serious and gracious personality; excellent for design, diplomacy, or politics."
        },
        {
            "house": "5th House",
            "effect": "Sharp intellect; rise to prestigious positions through steady and consistent effort."
        },
        {
            "house": "9th House",
            "effect": "Strong moral discipline and spiritual realism; upholding dharmic (righteous) ideals."
        },
        {
            "house": "10th House",
            "effect": "Stable career and social recognition after age 36; structured and elegant public image."
        }
    ],
    "keywords": ["sun", "venus", "saturn", "conjunction", "discipline", "grace", "tradition", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A powerful Sun ensures authority and the means to provide for others. You find professional "
            "success in cosmetics, legal work, and politics. While it brings recognition for your "
            "perfectionism, it may also lead to ego clashes or aggressive responses if your "
            "status is challenged."
        ),
        "powerfulVenus": (
            "Venus grants an attractive look and a traditional, magnetic personality. Your graceful "
            "demeanor and royal vibe help in complex decision-making. However, Saturn's influence "
            "may add a serious undertone, sometimes creating restrictions in the 'free space' "
            "of your relationships."
        ),
        "powerfulSaturn": (
            "Saturn manifests a refined and disciplined personality. While it brings a deep sense "
            "of loyalty and responsibility to partnerships, it can also lead to a pessimistic "
            "approach if afflicted. You possess the grounded authority to lead teams with "
            "dignity and withstand significant work pressure."
        )
    },
    "positiveDetail": (
        "This conjunction brings wealth in old age and structured artistic talent. You are a graceful "
        "leader with a loyal, mature partner. The blend of Sun, Venus, and Saturn provides a "
        "classic beauty and grounded authority. You are respected for your maturity and "
        "disciplined artistic brilliance. Your romantic approach is realistic yet respectful, "
        "balancing worldly enjoyment with traditional duties. This combination is excellent "
        "for a career in politics or high-end administration, where your balanced public "
        "image and lack of arrogance earn you lasting respect."
    ),
    "negativeDetail": (
        "Negative influences can lead to emotional detachment or even separation. Arrogance may delay "
        "your success, and you might struggle to express your true desires, leading to unfulfilled "
        "relationships. Ego clashes with elders and seniors are a risk due to a guarded or overly "
        "cautious attitude. Stagnant creativity and a fear of rejection can manifest as "
        "social inhibition. Financial losses or health issues related to muscle or skin "
        "may occur if you neglect your well-being for work."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a serious yet gracious personality with a high sense of maturity. Ideal for professions like design, diplomacy, or politics that require structure. A self-centered image can sometimes suppress spontaneity, leading to emotional inhibition."
        },
        {
            "house": "5th House",
            "detail": "Grants sharp analytical power and the ability to make right decisions in tough times. Success in business and politics is achieved through steady, prestigious efforts. Recognition grows over time, though ego clashes with authority figures must be managed."
        },
        {
            "house": "9th House",
            "detail": "Manifests as a spiritual realist with a strong set of moral disciplines. You are a disciplined learner and a devoted follower of refined values. Ideal for cultural authorities or counselors, you support arts and education with a strong work ethic and traditional values."
        },
        {
            "house": "10th House",
            "detail": "Ensures a stable career and social recognition in the second phase of life (after 36). Your public image is structured and elegant. Success is found in law, government, or luxury-related arts, where your social grace and diplomatic leadership shine."
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
    # Alphabetical order: Saturn, Sun, Venus
    col_name = "Saturn_Sun_Venus"
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
    print("[*] Seeding Saturn_Sun_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
