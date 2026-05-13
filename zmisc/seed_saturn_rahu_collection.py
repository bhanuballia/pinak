"""
Seed: Saturn_Rahu collection in Two_Planet_Conjunction database
"""
import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

document = {
    "combination": "Saturn-Rahu Conjunction",
    "category": "Planetary Combination",
    "overview": [
        "Saturn represents discipline and boundaries; Rahu represents craving and law-breaking.",
        "Known as 'Shrapit Yoga', a challenging conjunction that can lead to significant life delays.",
        "A meeting of the Law-maker (Saturn) and the Law-breaker (Rahu), ideal for foreign law administration.",
        "Natives are often talented in high-stakes fields like Real Estate, Stockbroking, and Finance.",
        "Can lead to personal isolation or 'love failures' where few people remain during tough times."
    ],
    "effects": {
        "powerfulSaturn": [
            "Inducts the native into administration or judiciary roles where firmness is required.",
            "Grants an insight into when to move fast or slow, acknowledging situational limits.",
            "Affliction here can lead to aimless wandering without direction or clear scenarios."
        ],
        "powerfulRahu": [
            "Activates intense interest in worldly temptations and crossing boundaries to achieve goals.",
            "Promotes an argumentative mentality that opts for a bigger share of gains with less effort.",
            "Can lead to sudden, surprising spiritual breakthroughs after attaining materialistic contentment."
        ]
    },
    "nature": {
        "positive": [
            "Ability to use discipline and manipulation simultaneously to win over legal or professional rivals.",
            "Unique way of breaking old traditions to achieve personal gains and professional success.",
            "Discriminates events with a sudden energy that constructs competence in high-pressure deals."
        ],
        "negative": [
            "Leads to chaotic activity and illusions that lack a strong base or long-term 'shelf life'.",
            "Obsession with personal achievement can make the individual unconcerned about others' feelings.",
            "May involve the native in immoral deeds or illegal escape-tactics that lead to legal trouble."
        ]
    },
    "housePlacements": [
        {
            "house": "1st House",
            "effect": "Constant worry and negative thoughts; afflicted health and low physical vitality."
        },
        {
            "house": "2nd House",
            "effect": "Speech problems and family disputes; less money accumulation and workplace friction."
        },
        {
            "house": "3rd House",
            "effect": "Fluctuations in life with low initiative; lack of sibling happiness or clear communication."
        },
        {
            "house": "4th House",
            "effect": "Not progressive for stability; fixed assets and domestic relations are prone to confusion."
        },
        {
            "house": "5th House",
            "effect": "Negative thoughts and education hurdles; elder siblings or children's health may suffer."
        },
        {
            "house": "6th House",
            "effect": "Great courage to fight rivals, but risk of heart issues, debts, or gambling/drinking addictions."
        },
        {
            "house": "7th House",
            "effect": "War-zone atmosphere at home; professional rivalry and lack of cooperation from coworkers."
        },
        {
            "house": "8th House",
            "effect": "Bad health and dire relationships; high likelihood of involving in secret affairs."
        },
        {
            "house": "9th House",
            "effect": "Low luck quotient and poor relations with father; success only through extreme hard work."
        },
        {
            "house": "10th House",
            "effect": "Setbacks in both personal and professional life; risk of punishment for government offenses."
        },
        {
            "house": "11th House",
            "effect": "Gains through gambling or betting, but health of children and siblings is often low."
        },
        {
            "house": "12th House",
            "effect": "Low health prospects and lack of happiness; potential for immoral relationships."
        }
    ],
    "keywords": ["saturn", "rahu", "conjunction", "shrapit yoga", "law and order", "cunning", "restlessness", "vedic astrology"],

    # Detailed narrative for deep dives
    "description": (
        "Saturn represents reality, discipline, and boundaries, while Rahu (dragon’s head) represents "
        "restless cravings and the evolution of the mind toward materialistic comforts. Their "
        "conjunction, frequently known as Shrapit Yoga, is a complex blend of law-making and "
        "law-breaking energy. While it can produce master-mind tacticians for illegal deals or "
        "cunning lawyers, it often leaves the native isolated in their personal lives. It "
        "presents a unique talent for foreign deals and stockbroking but warns of severe "
        "health issues like arthritis or gastric problems in extreme cases."
    ),
    "effectsDetail": {
        "powerfulSaturn": (
            "When Saturn dominates, you are inducted into the worlds of administration or law. You "
            "possess the firmness needed for results, blended with just enough manipulation from "
            "Rahu to be effective. You know when to acknowledge limits and when to push through "
            "with discipline."
        ),
        "powerfulRahu": (
            "When Rahu dominates, you crave a bigger share of the gains with minimal effort. You "
            "opt for worldly arenas that rule temptations. However, this same energy can lead to "
            "a sudden and surprising spiritual breakthrough once your materialistic desires are "
            "momentarily satisfied."
        ),
        "positiveConjunction": (
            "A positive conjunction allows you to discriminate between events using a unique "
            "energy to break traditions. You win over others through a blend of discipline and "
            "manipulation, achieving success in legal or financial deals that favor your personal "
            "growth."
        ),
        "negativeConjunction": (
            "A negative conjunction leads to uncontrolled obsession with personal achievements. "
            "You may become extremely cunning and careless about others' emotions. Chaotic "
            "events manifest as illusions with no strong base, potentially leading to immoral "
            "deeds that conflict with the law."
        )
    },
    "housePlacementsDetail": [
        {
            "house": "7th House",
            "detail": "Can turn the home into a war-zone with frequent conflicts; however, success in business is possible if the native applies extreme patience and hard work."
        },
        {
            "house": "10th House",
            "detail": "Professional life is prone to significant setbacks, and the native must be extremely careful to avoid illegal acts that lead to government punishment."
        },
        {
            "house": "6th House",
            "detail": "While it grants the courage to fight rivals, the native must be wary of blood disorders or falling into addictive habits like gambling or heavy drinking."
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
    col = db["Saturn_Rahu"]

    result = await col.update_one(
        {"combination": document["combination"]},
        {"$set": document},
        upsert=True
    )

    count = await col.count_documents({})
    action = "inserted" if result.upserted_id else "updated"
    print(f"[ok] Saturn_Rahu collection: document {action}.")
    print(f"     Total documents in Saturn_Rahu: {count}")
    client.close()

if __name__ == "__main__":
    print("[*] Seeding Saturn_Rahu collection...")
    asyncio.run(seed())
    print("[+] Done.")
