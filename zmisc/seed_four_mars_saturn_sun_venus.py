"""
Seed: Mars_Saturn_Sun_Venus collection in Four_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Sun-Mars-Venus-Saturn Conjunction",
    "type": "Four Planet Conjunction",
    "overview": [
        "Represents a financially affluent but morally challenged personality with a focus on immediate gratification.",
        "Combines Authority (Sun), Drive (Mars), Attraction (Venus), and Hardship (Saturn) for material success.",
        "Natives often enjoy great wealth but may suffer from a lack of intelligence and inimical relationships with relatives."
    ],
    "planetRoles": {
        "Sun": "Authority, status, father (afflicted), ego, material power",
        "Mars": "Drive, action, brothers (unfavorable), aggression, raw power",
        "Venus": "Wealth, affluence, indulgence, luxury, immediate gratification",
        "Saturn": "Affliction, discipline (distorted), mental anguish, moral decay, hardship"
    },
    "effects": {
        "powerfulSun": [
            "Grants a high level of material wealth and financial affluence in the life.",
            "Ensures an authoritative presence in the professional world, though it may be self-centered.",
            "Provides the power to acquire assets, but often at the cost of peace with father figures."
        ],
        "powerfulMars": [
            "Grants an aggressive drive to achieve financial goals, regardless of the means.",
            "Ensures a bold approach to acquiring property, though it leads to conflicts with brothers.",
            "Provides the energy to pursue immediate gratification and material indulgence."
        ],
        "powerfulVenus": [
            "Grants significant affluence and the ability to enjoy luxurious items and comfort.",
            "Ensures a life of financial success, though it may lack deeper intellectual or moral grounding.",
            "Provides an attractive lifestyle that hides internal unrest and moral challenges."
        ],
        "powerfulSaturn": [
            "Grants a structured focus on material gains while suppressing the happiness of others.",
            "Ensures that tasks are finished, but often through a mean or morally 'off-beam' nature.",
            "Provides the endurance to handle mental anguish arising from inimical relationships."
        ]
    },
    "nature": {
        "positive": [
            "Highly successful in financial matters, attaining significant wealth and affluence.",
            "Bold and determined in the pursuit of material goals and high-status assets.",
            "Enjoys a life of physical comfort and luxury through disciplined (if aggressive) work.",
            "Unmatched drive to achieve immediate results and tangible rewards."
        ],
        "negative": [
            "Lack of intelligence or wise judgment, leading to 'morally off-beam' decisions.",
            "Inimical relationships with relatives, parents, and brothers causing mental unrest.",
            "Tendency toward illicit activities and a self-centered approach to life's challenges.",
            "Mental anguish and a mean nature that prioritizes immediate gratification over ethics."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Strong material focus; physically unattractive bearing; success in wealth acquisition."
        },
        {
            "house": "2nd House",
            "effect": "High financial affluence; conflicts with family members; lack of wise speech."
        },
        {
            "house": "10th House",
            "effect": "Status rise through aggressive means; wealth in government sectors; moral challenges."
        },
        {
            "house": "4th House",
            "effect": "Lack of peace at home; material luxury coupled with emotional unrest; inopportune for parents."
        }
    ],
    "keywords": ["sun", "mars", "venus", "saturn", "conjunction", "wealth", "affluence", "moral challenges", "vedic astrology"],

    # Detailed narrative based on user's text
    "effectsDetail": {
        "powerfulSun": (
            "A strong Sun in this combination ensures you enjoy a lot of wealth and affluence. However, "
            "because the Sun and Mars are in conflict with Saturn, your material success often comes "
            "with a self-centered ego that disregards the advice of others, potentially leading to "
            "unfavourable outcomes for your status and relationship with paternal figures."
        ),
        "powerfulMars": (
            "Mars provides the raw drive to pursue immediate gratification. You are energetic in your "
            "pursuit of material gains, but this aggression often manifests as an inimical "
            "relationship with your brothers and relatives. Your actions are bold but can be "
            "morally misaligned, focusing on results rather than the ethical consequences of "
            "your decisions."
        ),
        "powerfulVenus": (
            "Venus grants you significant financial success and a life of comfort. You have a natural "
            "taste for luxury, but this is often coupled with a lack of deeper intelligence or "
            "philosophical vision. Your focus remains on the aesthetic and material world, where "
            "you find ease in acquiring assets while struggling to maintain inner peace and "
            "moral clarity."
        ),
        "powerfulSaturn": (
            "Saturn is the afflictive force here, sitting with three 'enemies' and destroying the "
            "prospects of true happiness. It makes you a mean or reserved person who suffers "
            "from mental anguish and unrest. While it grants the endurance to stay on a "
            "'wrong' path, it eventually forces you to face the psychological consequences "
            "of a life lived without moral grounding or family support."
        )
    },
    "positiveDetail": (
        "This conjunction creates a 'Wealthy Materialist' personality. You are someone who is "
        "highly successful financially, attaining a level of affluence that many would envy. "
        "Your life is marked by the enjoyment of luxury, property, and high-status assets. "
        "Your drive is unwavering, and you have the ability to manifest material results "
        "quickly. While the combination is generally considered unfavourable for long-term "
        "peace, it provides the native with the tools to build a powerful financial empire "
        "and live a life of comfort, provided they can manage the internal unrest and "
        "morally challenging path that this heavy planetary weight often dictates."
    ),
    "negativeDetail": (
        "Negative influences manifest as a complete lack of intelligence and a morally 'off-beam' "
        "approach to life. You may find yourself following the wrong direction, indulging in "
        "illicit activities for immediate gratification. Inimical relationships with relatives "
        "and a mean nature lead to significant mental anguish. You are often seen as "
        "inopportune for your parents and brothers, and your physical appearance may not "
        "reflect the wealth you possess. This combination is considered a challenging burden, "
        "as it destroys the positive aspects of the house it occupies, leaving the native "
        "wealthy but emotionally and spiritually hollow."
    ),
    "housePlacementsDetail": [
        {
            "house": "1st House",
            "detail": "Native possesses a strong material drive but is often physically unattractive. You are known for following your own path, even if it leads to moral decay. While wealth is indicated, your internal peace is constantly disrupted by ego clashes and a lack of wise guidance."
        },
        {
            "house": "2nd House",
            "detail": "Ensures a life of financial affluence and different sources of income. However, your speech is often mean or harsh, leading to disputes with family and a lack of support from relatives. You must guard against losses through wrong investments and illicit greed."
        },
        {
            "house": "10th House",
            "detail": "Powerhouse for status rise through aggressive or unconventional means. You grow financially through government connections, but your reputation is often marred by a self-centered and morally questionable approach that alienates peers and mentors alike."
        },
        {
            "house": "4th House",
            "detail": "Identity is defined by a lack of domestic peace despite material comfort. You may have a luxury home and vehicles, but the emotional environment is one of unrest. You are often seen as a source of stress for your parents, particularly the mother, whose health may suffer."
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
    # Alphabetical order: Mars, Saturn, Sun, Venus
    col_name = "Mars_Saturn_Sun_Venus"
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
    print("[*] Seeding Mars_Saturn_Sun_Venus four-planet conjunction...")
    asyncio.run(seed())
    print("[+] Done.")
