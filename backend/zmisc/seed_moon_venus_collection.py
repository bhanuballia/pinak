"""
Seed: Moon_Venus collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Moon-Venus Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Moon represents the mind and emotions; Venus represents luxury, love, and materialistic gains.",
        "A combination focused on security, pleasure, beauty, and enjoyment, especially in creative fields.",
        "Moon-Venus are primary significators of domestic happiness and comforts.",
        "Fluctuations in the Moon (waxing/waning) can lead to unstable emotional spending on luxuries.",
        "In a male horoscope, this conjunction significantly influences the relationship between mother and wife."
    ],
    "effects": {
        "powerfulMoon": [
            "Grants intellectual sensitivity and the ability to understand others' problems deeply.",
            "Defines a subjective perception of life that responds with psychological intellect to the environment.",
            "Ensures a strong emotional connection with the mother and a stable state of mind."
        ],
        "powerfulVenus": [
            "Heavy focus on assets, monetary gains, happiness, and worldly pleasures.",
            "High capability for attracting new partners; often leads to love marriages and passion.",
            "Grants artistic talent and maintains a very healthy bank balance through creative endeavors."
        ]
    },
    "nature": {
        "positive": [
            "Blesses the native with a secure financial and emotional upbringing with motherly nurturing.",
            "Polite speech and a diplomatic manner that stabilizes financial and professional standing.",
            "Native is drawn to beauty and physical attributes while organizing wealth channels efficiently."
        ],
        "negative": [
            "Can manifest as a shrewd personality that seeks wealth and pleasure through manipulation.",
            "Prone to high emotional reactions and stress in the workplace during adverse situations.",
            "Deep dissatisfaction with life and luxuries even when the native possesses them in abundance."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Attractive personality and excellent dressing sense; success through fitness and hard work."
        },
        {
            "house": "2nd House",
            "effect": "Financial stability and the capability of becoming a sophisticated, eloquent spokesperson."
        },
        {
            "house": "3rd House",
            "effect": "Increases courage and initiative, particularly in sectors related to adornment or spirituality."
        },
        {
            "house": "4th House",
            "effect": "Domestic happiness, property/vehicle benefits, and excellent public relations skills."
        },
        {
            "house": "5th House",
            "effect": "Commitment in love and marriage, though may cause a lack of focus on professional goals."
        },
        {
            "house": "7th House",
            "effect": "Sweetness and close bonding in marriage; potential for significant gains from the spouse."
        },
        {
            "house": "9th House",
            "effect": "Good fortune, cooperation from others, and a consistently luxurious standard of living."
        },
        {
            "house": "10th House",
            "effect": "Professional success and high status, especially in creative or adornment-related fields."
        },
        {
            "house": "11th House",
            "effect": "Fulfillment of desires, social fame, and gains through a large circle of friendships."
        }
    ],
    "keywords": ["moon", "venus", "conjunction", "luxury", "beauty", "domestic happiness", "creativity", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Moon represents the mind and emotional balance, while Venus is the symbol of materialistic "
        "gains, luxury, and love. Their conjunction is not just about wealth, but about the mental "
        "process of gaining luxuries through hard work and emotional balance. While it fosters "
        "creative excellence, a weak combination can lead to a cunning nature focused solely on "
        "pleasure. Fluctuations in the Moon's phases can also cause fluctuations in spending and "
        "emotional stability regarding materialistic goals."
    ),
    "effectsDetail": {
        "powerfulMoon": (
            "When the Moon dominates, you have the sensitivity to understand others' intellectual "
            "and emotional problems. Your subjective perception of the world is guided by your "
            "surroundings, defining your unique response to life's events."
        ),
        "powerfulVenus": (
            "When Venus dominates, your focus is entirely on assets, beauty, and having fun. You "
            "possess the talent and passion to convert love affairs into marriages and maintain "
            "a good financial status through your artistic or professional skills."
        ),
        "positiveConjunction": (
            "A positive conjunction provides a secure and nurtured upbringing. It draws you "
            "toward partners with physical and materialistic strength and grants you the polite "
            "speech necessary to stabilize your financial caliber with colleagues."
        ),
        "negativeConjunction": (
            "A negative conjunction leads to a shrewd personality seeking wealth through "
            "emotional reactions. You may experience dissatisfaction with your possessions and "
            "struggle with emotional stress on the work front when meeting adverse situations."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "4th House",
            "detail": "Excellent for domestic bonding and property gains; native has a natural caliber for public relations."
        },
        {
            "house": "10th House",
            "detail": "Grants high professional status and earnings, particularly from fields related to beauty, luxury, or art."
        },
        {
            "house": "1st House",
            "detail": "Native is charismatic and well-dressed, with a physical fitness that supports their professional endeavors."
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
    col = db["Moon_Venus"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Moon_Venus collection: document {action}.")
    print(f"     Total documents in Moon_Venus: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Moon_Venus collection...")
    asyncio.run(seed())
    print("[+] Done.")
