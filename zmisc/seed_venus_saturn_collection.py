"""
Seed: Venus_Saturn collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Venus-Saturn Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Venus represents relationships and romance; Saturn represents restriction and discipline.",
        "Desires a mature and sensible partner; often indicates partners of different age groups.",
        "Natives are vigilant and responsible in relationships but may struggle to express affection verbally.",
        "Marital sustainability issues can arise from a fear of restrictions imposed by the other partner.",
        "Blending of 'glamour' (Venus) and 'tradition' (Saturn) requires a balance of expectations."
    ],
    "effects": {
        "powerfulVenus": [
            "Native prefers younger partners and remains 'young at heart' regardless of physical age.",
            "Discards Saturn's practical restrictions to enjoy pleasures, art, and entertainment openly.",
            "Strong expression of physical intimacy and high interest in the beauty and fashion sectors."
        ],
        "powerfulSaturn": [
            "Native prefers older or more mature partners and follows strict social norms in love.",
            "Imposes discipline, loyalty, and honesty in relationships, which may feel restrictive to others.",
            "Benefits like luxury and self-earned money tend to materialize later in life (age 30-36)."
        ]
    },
    "nature": {
        "positive": [
            "Creates an aura of love and security supported by discipline and clear life perspectives.",
            "High creativity in professional sectors like designing, crafts, and technical arts.",
            "Native takes responsibility for their partner with detailed action and following of boundaries."
        ],
        "negative": [
            "Shyness in expressing love can lead to misconceptions and emotional distance in partnerships.",
            "The different pace of both planets (Saturn slow, Venus fast) brings conflicts in thought processes.",
            "Struggle for personal space and freedom may occur if discipline is imposed too rigidly."
        ]
    },
    "housePlacements": [
        {
            "house": "2nd House",
            "effect": "Considered good for financial gains; blessed with a high wealth quotient and fame."
        },
        {
            "house": "3rd House",
            "effect": "Monetary gains from the father, ancestors, relatives, and the spouse."
        },
        {
            "house": "4th House",
            "effect": "Sudden gains or promotions; strong social recognition and stability in wealth."
        },
        {
            "house": "5th House",
            "effect": "Good education but potential delay in progeny-related matters or expected recognition."
        },
        {
            "house": "6th House",
            "effect": "Grants the strength and technique needed to win over professional rivals with success."
        },
        {
            "house": "7th House",
            "effect": "Grants a good spouse, though differences in nature based on planetary strength are likely."
        },
        {
            "house": "9th House",
            "effect": "Increases inherited assets and reputation manifold through consistent hard work."
        },
        {
            "house": "10th House",
            "effect": "Best placement for high reputation and significant influence in the respective field."
        },
        {
            "house": "11th House",
            "effect": "Success in ventures with minimal effort; materialistic luxury throughout mature life."
        }
    ],
    "keywords": ["venus", "saturn", "conjunction", "maturity", "responsibility", "discipline", "luxury", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Venus represents our compatibility and how we value romantic feelings, while Saturn "
        "represents restrictions and a practical, disciplined approach to life. When they "
        "conjoin, Saturn’s mature effect on Venus creates a desire for a sensible partner and a "
        "vigilant attitude in relationships. While this ensures stability and responsibility, "
        "it can also make it difficult for the native to express love with endearing words. "
        "The native often prioritizes security and materialistic comfort over emotional "
        "displays, leading to a unique but sometimes reserved bond."
    ),
    "effectsDetail": {
        "powerfulVenus": (
            "When Venus dominates, you discard Saturn's practical behavior in favor of Venusian "
            "pleasures. You may prefer younger partners and disregard social criticism, enjoying "
            "art, fun, and entertainment with open expression. You stay young at heart and "
            "prioritize the beauty of life over its restrictions."
        ),
        "powerfulSaturn": (
            "When Saturn dominates, you prefer mature or older partners. You impose a discipline "
            "of loyalty and honesty in your relationships, which can sometimes lead to a "
            "struggle for personal space. Expressions of love are restricted, and true "
            "materialistic success typically arrives between the ages of 30 and 36."
        ),
        "positiveConjunction": (
            "A positive conjunction allows you to take responsibility in relationships while "
            "creating a secure aura of love. You follow 'undescribed boundaries' with discipline "
            "and clear perspectives. Professionally, this makes you highly creative in designing "
            "and crafts, though the biggest gains often realize later in life."
        ),
        "negativeConjunction": (
            "A negative conjunction makes you shy in expressing your love, leading to potential "
            "misconceptions. The different 'speed' of Venus (fast) and Saturn (slow) creates "
            "frequent conflicts in expectations. You may feel a constant tension between the "
            "need for glamour and the weight of traditional instincts."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "10th House",
            "detail": "Consistently recognized as the best placement for this conjunction, ensuring the native gains a formidable reputation and significant influence in their career field."
        },
        {
            "house": "4th House",
            "detail": "Native experiences sudden gains and promotions at work, alongside stable social recognition and a very secure wealth quotient throughout life."
        },
        {
            "house": "11th House",
            "detail": "Fulfillment of desires comes with remarkably less effort, particularly in the later, mature stages of life when materialistic luxury is most prominent."
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
    col = db["Venus_Saturn"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Venus_Saturn collection: document {action}.")
    print(f"     Total documents in Venus_Saturn: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Venus_Saturn collection...")
    asyncio.run(seed())
    print("[+] Done.")
