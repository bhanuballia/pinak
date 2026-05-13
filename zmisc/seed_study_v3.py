import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://vedic-astrology:XyZ123@cluster0.mongodb.net/vedic_astrology?retryWrites=True&w=majority")
client = MongoClient(MONGO_URL)
db = client.vedic_astrology
study_collection = db.get_collection("study")

# Clear existing data
study_collection.delete_many({})

study_data = [
    {
        "category": "Key Houses",
        "title": "Educational Foundations",
        "content": "• 2nd House: Basic education, speech, and communication.\n• 4th House: Formal schooling and grasping ability.\n• 5th House: Intelligence, memory, and analytical power.\n• 9th House: Higher wisdom, philosophy, and research.\n• 10th House: Career-oriented education and practical qualifications.",
        "icon": "🎓"
    },
    {
        "category": "Planet Roles",
        "title": "Sun: Authority & Admin",
        "content": "Focuses on Political Science, Public Admin, and Law. Best in 1st, 5th, 9th, or 10th houses. Leads to careers in Government Service (IAS/IPS) or Politics.",
        "icon": "☀️"
    },
    {
        "category": "Planet Roles",
        "title": "Moon: Psychology & Arts",
        "content": "Focuses on Psychology, Literature, Nursing, and Hospitality. Best in 4th, 5th, 9th, or 12th houses. Leads to teaching or counseling.",
        "icon": "🌙"
    },
    {
        "category": "Planet Roles",
        "title": "Mars: Engineering & Tech",
        "content": "Focuses on Mechanical/Civil Engineering, Military Science, and Surgery. Best in 1st, 6th, or 10th houses. Leads to defense or engineering roles.",
        "icon": "⚔️"
    },
    {
        "category": "Planet Roles",
        "title": "Mercury: Commerce & IT",
        "content": "Focuses on Mathematics, Journalism, Marketing, and Data Science. Best in 2nd, 4th, 5th, or 10th houses. Leads to accounting or writing.",
        "icon": "☿"
    },
    {
        "category": "Planet Roles",
        "title": "Jupiter: Higher Learning",
        "content": "Focuses on Philosophy, Religious Studies, Teaching, and Finance. Best in 2nd, 5th, or 9th houses. Leads to professorships or law.",
        "icon": "♃"
    },
    {
        "category": "Planet Roles",
        "title": "Venus: Arts & Media",
        "content": "Focuses on Fine Arts, Musical Design, Fashion, and Film. Best in 2nd, 4th, 5th, or 12th houses. Leads to entertainment or design careers.",
        "icon": "🎨"
    },
    {
        "category": "Planet Roles",
        "title": "Saturn: Research & History",
        "content": "Focuses on Industrial Management, Mining, History, and Agriculture. Best in 1st, 9th, or 10th houses. Leads to research or judiciary roles.",
        "icon": "♄"
    },
    {
        "category": "Planet Roles",
        "title": "Rahu & Ketu: Modern & Mystic",
        "content": "• Rahu: AI, Aviation, Space Research. Best in 3, 10, 12.\n• Ketu: Astrology, Mathematics, Occult Science. Best in 9, 12.",
        "icon": "🌑"
    },
    {
        "category": "Lord Placement",
        "title": "5th Lord Through Houses",
        "content": "1H: Self-driven learning. 2H: Finance/Banking. 3H: Journalism/Media. 4H: Real Estate/Architecture. 5H: Pure Research. 6H: Medicine/Defense. 7H: Business/Law. 8H: Occult/Surgery. 9H: Spirituality/Foreign studies. 10H: Authoritative Admin. 11H: Economics/IT. 12H: Humanitarian work.",
        "icon": "🏢"
    },
    {
        "category": "Lord Placement",
        "title": "9th Lord Through Houses",
        "content": "1H: Philosophy/Leadership. 2H: Wealth from knowledge. 3H: Publishing/Journalism. 4H: Academic excellence. 5H: Deep intellect/Math. 6H: Social justice/Law. 7H: Foreign Trade. 8H: Transformative research. 9H: International education. 10H: Judiciary/Politics. 11H: Business Analytics. 12H: Foreign settlement.",
        "icon": "🧭"
    },
    {
        "category": "Lords & Influence",
        "title": "Planets as 5th & 9th Lords",
        "content": "• Sun: Leadership/Law.\n• Moon: Nursing/Literature.\n• Mars: Sports/Defense.\n• Mercury: IT/Commerce.\n• Jupiter: Spiritual Advisory/Judiciary.\n• Venus: Cinema/Hospitality.\n• Saturn: Mining/Corporate Law.\n• Rahu: Digital Media/Foreign Tech.\n• Ketu: Mysticism/Ancient Texts.",
        "icon": "👑"
    },
    {
        "category": "Placement Effects",
        "title": "Planets In 5th & 9th Houses",
        "content": "Placement here modifies the quality of intelligence. Jupiter here grants 'Dharma' in study, while Rahu gives futuristic and unconventional vision. Saturn brings discipline and long-term planning, whereas Mars brings a fiery, competitive approach to learning.",
        "icon": "✨"
    },
    {
        "category": "Nakshatras",
        "title": "Lunar Mansions (1-9)",
        "content": "• Ashwini: Medicine/Surgery.\n• Bharani: Law/Forensics.\n• Krittika: Politics/CEO.\n• Rohini: Art/Finance.\n• Mrigashira: Research/Journalism.\n• Ardra: AI/Crisis Management.\n• Punarvasu: Philosophy/Environment.\n• Pushya: Management/Public Service.\n• Ashlesha: Chemist/Secret Service.",
        "icon": "⭐"
    },
    {
        "category": "Nakshatras",
        "title": "Lunar Mansions (10-18)",
        "content": "• Magha: Historiography/Diplomat.\n• P.Phalguni: Cinema/Fashion.\n• U.Phalguni: HR/Social Work.\n• Hasta: Architect/Craftsman.\n• Chitra: Photography/Engineering.\n• Swati: Aviation/Trade.\n• Vishakha: Priest/Politician.\n• Anuradha: Active Social Science.\n• Jyeshtha: Intelligence/Forensics.",
        "icon": "🌟"
    },
    {
        "category": "Nakshatras",
        "title": "Lunar Mansions (19-27)",
        "content": "• Moola: Ayurveda/Genetics.\n• P.Ashadha: Law/Diplomacy.\n• U.Ashadha: Strategist/High Official.\n• Shravana: Linguistics/History.\n• Dhanishta: Perform Arts/Military.\n• Shatabhisha: Astronomy/Pilot.\n• P.Bhadrapada: Monk/Deep Research.\n• U.Bhadrapada: Marine Biology/Yogi.\n• Revati: Social Reform/Arts.",
        "icon": "💫"
    },
    {
        "category": "D-Charts",
        "title": "Advanced Refinement (D-24)",
        "content": "The D-24 chart (Chaturvimshamsha) is specifically analyzed for precise academic results. While the Rashi (D1) shows the general inclination, the Navamsa (D9) and D-24 verify if the student will actually excel and achieve recognition in their chosen field.",
        "icon": "🔭"
    },
    {
        "category": "Timing",
        "title": "Dasha & Transit Analysis",
        "content": "The running Mahadasha or Antardasha determines if the potential in the chart will manifest. Jupiter Dashas favor higher studies, while Rahu Dashas often trigger interest in technology or foreign-based distance learning.",
        "icon": "⏳"
    }
]

# Insert records
result = study_collection.insert_many(study_data)
print(f"Successfully seeded {len(result.inserted_ids)} ultra-detailed study records into MongoDB!")
