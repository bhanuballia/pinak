"""
Seed: Mercury_Rahu collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Note: The user mentioned "Mars-Rahu" in one sub-heading of the text provided, 
# but the context clearly describes Mercury-Rahu throughout. Corrected to Mercury-Rahu.

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Mercury-Rahu Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Mercury represents intelligence and wit; Rahu represents craving and materialistic expansion.",
        "A powerhouse of analytical ability and mesmerizing communication skills if unafflicted.",
        "Excellent for fields like marketing, public relations, and high-stakes public speaking.",
        "Rahu expands Mercury's materialistic qualities at a quick pace and on a larger scale.",
        "Blueprint of plans is often unconventional and innovative, favoring a unique approach to life."
    ],
    "effects": {
        "powerfulMercury": [
            "Blesses the native with proficiency in speech and well-manipulated, intelligent actions.",
            "Grants a highly intellectual approach with the ability to be insistent and convincing in talk.",
            "Ideal for a successful career as a salesperson or a public speaker with clear messaging."
        ],
        "powerfulRahu": [
            "Indicates a cunning temperament with the mental caliber to convince others for personal gain.",
            "Throws a 'veil of illusion' that allows the native to dominate conversations through any medium.",
            "Can lead to hypersensitivity and zero-level satisfaction as the native chases huge materialistic shares."
        ]
    },
    "nature": {
        "positive": [
            "Explodes intellectual properties, making the native precise, witty, and clever in perception.",
            "Ability to derive benefits from others through persistent and intelligent communication.",
            "Functions like Jupiter, providing a well-planned analytical approach toward life and gains."
        ],
        "negative": [
            "Affects the analytical quotient, leading the native toward deception and fake ethics for gains.",
            "Likely to create false communication with excessive exaggeration to cheat or mislead others.",
            "Creates a strong veil of illusions that masks self-serving motives behind a charming facade."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Low physical immunity and work disputes; however, financial gains are still possible."
        },
        {
            "house": "2nd House",
            "effect": "Loss in wealth quotient and significant differences of opinion within family relations."
        },
        {
            "house": "3rd House",
            "effect": "Gains from bold attempts, though sibling relations and goal achievement remain low."
        },
        {
            "house": "4th House",
            "effect": "Domestic peace is disturbed; native may be rude or disrespectful toward the mother."
        },
        {
            "house": "5th House",
            "effect": "Beneficial for research work, though education, progeny, and love matters face obstacles."
        },
        {
            "house": "6th House",
            "effect": "Health problems; career requires extreme manipulation over rivals and vigilance with papers."
        },
        {
            "house": "7th House",
            "effect": "Less stable marital relations and a lack of coordination with professional partners."
        },
        {
            "house": "8th House",
            "effect": "Speech control is vital; gains possible through spouse or children, but avoid bribes."
        },
        {
            "house": "9th House",
            "effect": "Conflicts with the father and less spiritual inclination; possible losses during travel."
        },
        {
            "house": "10th House",
            "effect": "Diplomatic nature and creative mind; excess ambition may lead to a dishonest attitude."
        },
        {
            "house": "11th House",
            "effect": "Assures gain in income, though the methods used to attain it may be questionable."
        },
        {
            "house": "12th House",
            "effect": "Loss of personal happiness and professional success; native may lack commitment."
        }
    ],
    "keywords": ["mercury", "rahu", "conjunction", "intelligence", "wit", "marketing", "illusion", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Mercury represents wit, humor, and sharp thinking, while Rahu (dragon’s head) represents "
        "restless craving and the evolution of the mind toward materialistic authority. Their "
        "conjunction is a potent mix of intelligence and expansion. When positive, it grants a "
        "mesmerizing ability to convince others, making it perfect for PR and marketing. However, "
        "when afflicted, it can lead to communication problems, excessive exaggeration, and a "
        "tendency to use false ethics for personal gain."
    ),
    "effectsDetail": {
        "powerfulMercury": (
            "When Mercury dominates, your intellect is sharp and your actions are well-manipulated. "
            "You convey thoughts with a clear message and have an intelligent streak in convincing "
            "others to follow your lead. You are insistent in your speech, making you a "
            "formidable public speaker or salesperson."
        ),
        "powerfulRahu": (
            "When Rahu dominates, you possess a cunning temperament. You use a 'veil of illusion' "
            "to win acceptance and satisfy your cravings for status and comfort. While this makes "
            "you highly persuasive, it can also lead to a lack of satisfaction and "
            "hypersensitivity in your personal and professional interactions."
        ),
        "positiveConjunction": (
            "A positive conjunction explodes your intellectual properties. You become witty and "
            "precise, with a well-planned analytical approach to life. You handle situations "
            "cleverly, deriving benefits for your own growth through persistent, high-quality "
            "communication."
        ),
        "negativeConjunction": (
            "A negative conjunction affects your analytical ability, tempting you toward "
            "deception. You may create a strong veil of illusions to mask fake ethics, using "
            "excessive exaggeration to cheat others. Prosperity is often fleeting as it is built "
            "on a base of false communication and insistence."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Native possesses a highly diplomatic nature and a creative mind; however, they must guard against a dishonest attitude fueled by excessive professional ambition."
        },
        {
            "house": "5th House",
            "detail": "While potentially causing losses in speculation or love, this placement is highly beneficial for deep research-related work and intensive academic studies."
        },
        {
            "house": "8th House",
            "detail": "Native may experience gains through their spouse or children, but must strictly avoid taking bribes as it will inevitably lead to professional downfall."
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
    col = db["Mercury_Rahu"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Mercury_Rahu collection: document {action}.")
    print(f"     Total documents in Mercury_Rahu: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Mercury_Rahu collection...")
    asyncio.run(seed())
    print("[+] Done.")
