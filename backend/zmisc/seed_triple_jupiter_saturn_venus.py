"""
Seed: Jupiter_Saturn_Venus collection in Triple_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Jupiter-Saturn-Venus Conjunction",
    "type": "Triple Planet Conjunction",
    "overview": [
        "Represents a highly stable, ethical, and refined personality.",
        "Combines Wisdom (Jupiter), Discipline (Saturn), and Grace (Venus) for long-term vision and financial maturity.",
        "Natives are known for their balanced judgment, creative patience, and commitment to legacy over quick success."
    ],
    "planetRoles": {
        "Jupiter": "Wisdom, expansion, high moral values, strategic discipline, spiritual drive",
        "Saturn": "Discipline, stability, patience, traditional approach, legacy building",
        "Venus": "Art, beauty, charm, refined taste, creative ideas, social harmony"
    },
    "effects": {
        "powerfulJupiter": [
            "Grants high moral values and an optimistic approach to managing complex responsibilities.",
            "Ensures maturity and strategic discipline in both professional and spiritual pursuits.",
            "Provides success in finance and education through ethical business practices."
        ],
        "powerfulSaturn": [
            "Manifests as a highly stable and ethical personality with a preference for long-term goals.",
            "Ensures success in governance, architecture, or traditional arts through consistent effort.",
            "Provides the patience to achieve significant professional rank without compromising integrity."
        ],
        "powerfulVenus": [
            "Grants elegance, beauty, and charm harmonized by wisdom and disciplined restraint.",
            "Ensures artistic success and the ability to attract attention with creative, diplomatic ideas.",
            "Provides sound spiritual knowledge and the ability to expand qualities in relationships meaningfully."
        ]
    },
    "nature": {
        "positive": [
            "Mature love life with a deep sense of responsibility and refined tastes in art and fashion.",
            "Disciplined approach toward wealth management, investment, and long-term financial vision.",
            "Law-abiding and principled character with the creative patience to endure long partnerships.",
            "Wise approach to relationships guided by the teachings of female relatives and elder mentors."
        ],
        "negative": [
            "Stagnant family situations and emotional coldness leading to distance in relationships.",
            "Rigid beliefs in love life and suppressed desires due to fear of luxury or indulgence.",
            "Relationship challenges caused by delayed gratification or chronic misjudgments.",
            "Legal challenges, slow growth, and frustration due to an extravagant or poorly planned financial approach."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Graceful yet grounded; success in education, engineering, or law; steady long-term growth."
        },
        {
            "house": "4th House",
            "effect": "Gains from inheritance and lineage; spiritually uplifting domestic life; support from maternal family."
        },
        {
            "house": "9th House",
            "effect": "Conservative but deep belief system; gains from grandparents; spiritual practice with beauty."
        },
        {
            "house": "10th House",
            "effect": "High professional status; ethical career choices in finance, administration, or teaching."
        }
    ],
    "keywords": ["jupiter", "saturn", "venus", "conjunction", "legacy", "wisdom", "discipline", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulJupiter": (
            "A strong Jupiter grants you high moral values and an optimistic approach. You possess the "
            "strategic discipline required to handle complex financial and educational responsibilities. "
            "Your actions are principled, and you see the steady growth you expect through ethical "
            "commitments to your long-term vision."
        ),
        "powerfulSaturn": (
            "Saturn manifests as a highly stable and traditional personality. You value legacy over quick "
            "success, achieving your goals through patience and consistent hard work. Your approach "
            "to life is grounded and respectful, making you a reliable leader in governance, "
            "architecture, or law."
        ),
        "powerfulVenus": (
            "Venus provides elegance and creative charm that is harmonized by your wisdom. You attract others "
            "with new, diplomatic ideas and maintain a sound balance between your spiritual and "
            "marital life. Your artistic success is built on the ability to expand your qualities "
            "meaningfully in all relationships."
        )
    },
    "positiveDetail": (
        "This conjunction blends the wisdom of Jupiter with the discipline of Saturn and the refinement "
        "of Venus, resulting in a 'Balanced Legacy Builder.' You enjoy a stable life with financial "
        "support whenever needed, backed by a disciplined approach toward managing investments. "
        "Your tastes are refined—favoring high-quality art, fashion, and traditional music—and "
        "you approach relationships with a mature sense of responsibility. As a law-abiding "
        "individual, you possess 'creative patience,' allowing you to build enduring partnerships "
        "and successful professional legacies. Guidance from female relatives and elders "
        "further matures your long-term decision-making, ensuring a joyful expression of "
        "wealth and grace that lasts a lifetime."
    ),
    "negativeDetail": (
        "Negative influences manifest as 'emotional coldness' and stagnant family dynamics. You may struggle "
        "with rigid beliefs that prevent you from enjoying life's luxuries or expressing your "
        "true feelings to loved ones. Affliction can lead to delayed gratification, misjudgments "
        "in relationships, or distance from children and partners. An extravagant approach "
        "without a solid financial plan can cause frustration, while legal challenges and "
        "slow professional growth may arise from suppressed emotions. A pessimistic outlook "
        "can block you from stepping out of your comfort zone, and health issues related "
        "to obesity or anxiety may manifest if overthinking is not managed."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a complex yet dynamic personality, becoming more grounded with time and experience. You are attractive yet conservative, balancing indulgence with restraint. Success is likely in engineering, law, or education through steady, ethical efforts."
        },
        {
            "house": "4th House",
            "detail": "Identity is centered on a big family and gains from inheritance. You build a domestic life that is both luxurious and spiritually uplifting, supported by strong maternal influences. Your home is your sanctuary, built slowly but surely with beauty and comfort."
        },
        {
            "house": "9th House",
            "detail": "Powerhouse for spiritual and philosophical depth inherited from elders. You appreciate beauty in spiritual practices and enjoy long-distance travels for career and religious learning. Gains from grandparents and a conservative belief system provide long-term stability."
        },
        {
            "house": "10th House",
            "detail": "Ensures success through structured growth and ethical career choices. You rise in fields like finance, administration, or teaching, often guided by a female mentor. Your hardworking and consistent personality earns you a high rank and lasting respect."
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
    # Alphabetical order: Jupiter, Saturn, Venus
    col_name = "Jupiter_Saturn_Venus"
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
    print("[*] Seeding Jupiter_Saturn_Venus triple conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
