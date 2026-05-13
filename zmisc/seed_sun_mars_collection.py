"""
Seed: Sun_Mars collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mars Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Indicates strong courage, power, and competitive nature.",
        "Father may belong to army/police or have a strong personality.",
        "Enhances action, authority, and leadership qualities.",
        "May create challenges in relationships due to dominance."
    ],
    "effects": {
        "powerfulSun": [
            "Sun dominates Mars and may reduce Mars positive qualities.",
            "Gives strong authority, discipline, and leadership.",
            "Provides courage to face challenges."
        ],
        "powerfulMars": [
            "Early life struggles but strong after age 28.",
            "Gives fighting spirit and competitive nature.",
            "Helps overcome obstacles."
        ]
    },
    "nature": {
        "positive": [
            "Courage, confidence, leadership",
            "Strong will power",
            "Ability to take action and decisions"
        ],
        "negative": [
            "Anger and aggression",
            "Ego clashes in relationships",
            "Dominating behavior"
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Attractive personality, ambitious, overworking tendency"
        },
        {
            "house": "2nd House",
            "effect": "Good for wealth but not for family harmony"
        },
        {
            "house": "3rd House",
            "effect": "Courage and success over rivals"
        },
        {
            "house": "6th House",
            "effect": "Success in competition and career"
        },
        {
            "house": "9th House",
            "effect": "Gains from abroad and religious inclination"
        },
        {
            "house": "10th House",
            "effect": "Career success, intelligence, wealth accumulation"
        },
        {
            "house": "11th House",
            "effect": "Good health, financial gains, family responsibilities"
        }
    ],
    "keywords": ["sun", "mars", "conjunction", "vedic astrology"],

    # ── Detailed narrative descriptions ──
    "description": (
        "Sun is Father and Mars is warrior so the conjunction of these two planets may indicate "
        "some possibilities in any horoscope. The conjunction of Sun-Mars can indicate the possibility "
        "that Father may belong to Army/Police background, or the father may be courageous, daring and "
        "strong-willed powerful and competitive. You may belong to a Military/Police ranking with a strong "
        "will, powerful, courageous nature and attitude. The power of energy for both planets is complimentary "
        "to enhance each other's capabilities. Sun is authority and Mars is action so the combination of these "
        "two works in coordination for each other for their mutual success. The Sun has the authority/power to "
        "increase the daring energy of Mars which can increase your strength and courage as you mature in life. "
        "The combination of Sun-Mars works well in the action areas but disintegrates in the areas of relationships "
        "where we need to adjust with each other rather than compete or dominate. The greater the distance between "
        "the Sun and Mars in Sun-Mars Conjunction in any horoscope, it can promote the good qualities of Mars."
    ),

    "effectsDetail": {
        "powerfulSun": (
            "When the Sun has the dominating role in Sun-Mars conjunction, it will have the power to negate "
            "the goodness of Mars, if Mars is closer to the Sun in any horoscope degree wise. Sun-Mars is a "
            "powerful conjunction with positive attributes that can bless a person with tremendous courage and "
            "strong will to stand against the odds with the power of warrior to fight against them. They will "
            "work with abiding all rules and regulations in their career and pursue their respective career with "
            "competition and warrior-like attitude against others and events."
        ),
        "powerfulMars": (
            "When Mars has the dominating role in Sun-Mars conjunction the person may be timid during his early "
            "life but will stand like a fighter after the age of 28 years. There may be ups/downs or sudden changes "
            "in events of life, but the only positive thing will be that you will have the strength, power and "
            "attitude to overcome all obstacles with your competitive attitude. The power of Mars in this conjunction "
            "will increase your confidence and vigor in the areas of life where this conjunction has the placement "
            "in the horoscope."
        ),
        "positiveConjunction": (
            "The potential of Sun energy is that of Father who has the authority in any family whereas Mars has the "
            "young energy when combined with the energy of Sun gets the positive support and boost for right direction, "
            "courage and initiative to take the right decision, action and will power to overcome any obstacles. "
            "Positive Sun-Mars conjunction makes them both cooperate mutually with each other and bless you with "
            "courage and confidence in moving forward in life despite challenges. This conjunction will work with "
            "good strength in Aries and Leo sign as both the planets have good poise and strength here."
        ),
        "negativeConjunction": (
            "The negative Sun-Mars Conjunction gives you a reckless attitude, angry temperament, argumentative streak "
            "with less or no inclination towards family responsibilities. The conjunction of Sun and Mars is not "
            "progressive in relationships as there are the possibilities of clashes on the personal front based on ego "
            "with the desire to compete and dominate others rather than moving in the progress of mutual relationships. "
            "Debilited Mars and closeness to Sun in any horoscope will exhaust the good qualities of Mars and make it "
            "necessary for you to keep a tab on his/her anger and aggression to avoid any discrepancy in events."
        )
    },

    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": (
                "Sun-Mars Conjunction in the 1st house indicates that you may possess an attractive personality "
                "with a high degree ambition to achieve his/her goals. He/she will have the inertia to work more "
                "than the physical capacity of the body that must be avoided for good health."
            )
        },
        {
            "house": "2nd House",
            "detail": (
                "Sun-Mars Conjunction in the 2nd house is good for the wealth and finance related matters but is "
                "not very progressive in matters related to family and personal relationships."
            )
        },
        {
            "house": "3rd House",
            "detail": (
                "Sun-Mars Conjunction in the 3rd house will be progressive for you with efforts and courage as "
                "you will have the knack to win over your rivals with courage and gusto."
            )
        },
        {
            "house": "6th House",
            "detail": (
                "Sun-Mars Conjunction in the 6th house can give you good position, power, materialistic happiness, "
                "success in competition and good earnings."
            )
        },
        {
            "house": "9th House",
            "detail": (
                "Sun-Mars Conjunction in the 9th house will be progressive for the matters related to wealth gains "
                "from abroad and good inclination and action in religious activities."
            )
        },
        {
            "house": "10th House",
            "detail": (
                "Sun-Mars Conjunction in the 10th house will bless you with good pointers of intelligence and action "
                "to achieve their goals. You can achieve good success during this conjunction and there will be good "
                "accumulation of wealth through good earnings and efforts. Relationships will not be fine."
            )
        },
        {
            "house": "11th House",
            "detail": (
                "Sun-Mars Conjunction in the 11th house indicates the blessings of good health, good financial state "
                "and success in share market but may have to bear the responsibility of his/her family."
            )
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
    col = db["Sun_Mars"]

    # Upsert by combination name so re-runs are safe
    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Sun_Mars collection: document {action}.")
    print(f"     Total documents in Sun_Mars: {count}")
    client.close()


if __name__ == "__main__":
    print("[*] Seeding Sun_Mars collection in Two_Planet_Conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
