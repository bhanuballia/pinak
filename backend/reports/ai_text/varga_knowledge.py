"""
reports/ai_text/varga_knowledge.py

Knowledge base for divisional (varga) charts containing traditional Vedic astrology
information about each chart's purpose, domain, and interpretation principles.
"""

VARGA_KNOWLEDGE = {
    1: {
        "name": "Rashi (D1)",
        "sanskrit": "राशि",
        "purpose": "Main birth chart showing overall life, personality, and physical body",
        "domain": "General life, physical constitution, personality traits",
        "life_areas": [
            "Overall personality and character",
            "Physical appearance and health",
            "General life direction and destiny",
            "Basic nature and temperament"
        ],
        "key_principles": [
            "Foundation chart for all analysis",
            "Shows the soul's journey in this lifetime",
            "Planetary positions indicate karmic patterns",
            "Ascendant represents the self and physical body"
        ]
    },
    2: {
        "name": "Hora (D2)",
        "sanskrit": "होरा",
        "purpose": "Wealth, prosperity, and financial matters",
        "domain": "Money, assets, material resources, financial fortune",
        "life_areas": [
            "Wealth accumulation and financial status",
            "Movable and immovable assets",
            "Earning capacity and prosperity",
            "Material comforts and luxuries"
        ],
        "key_principles": [
            "Sun's hora indicates paternal wealth",
            "Moon's hora indicates maternal wealth",
            "Benefics in good positions indicate prosperity",
            "Malefics may cause financial struggles"
        ]
    },
    3: {
        "name": "Drekkana (D3)",
        "sanskrit": "द्रेष्काण",
        "purpose": "Siblings, courage, and co-borns",
        "domain": "Brothers, sisters, courage, valor, short journeys",
        "life_areas": [
            "Relationship with siblings",
            "Courage and bravery",
            "Mental strength and determination",
            "Short travels and communications"
        ],
        "key_principles": [
            "3rd house matters are analyzed here",
            "Mars and Mercury are key significators",
            "Strong planets indicate supportive siblings",
            "Afflictions may show sibling conflicts"
        ]
    },
    4: {
        "name": "Chaturthamsa (D4)",
        "sanskrit": "चतुर्थांश",
        "purpose": "Property, real estate, and fixed assets",
        "domain": "Landed property, houses, buildings, vehicles, material comforts",
        "life_areas": [
            "Ownership of land and property",
            "Residential happiness and comfort",
            "Vehicles and conveyances",
            "Fixed assets and inheritance"
        ],
        "key_principles": [
            "4th house matters are examined",
            "Moon and Venus indicate property gains",
            "Benefics in angles show property ownership",
            "Mars may indicate property disputes"
        ]
    },
    5: {
        "name": "Panchamsha (D5)",
        "sanskrit": "पंचांश",
        "purpose": "Fame, power, authority, and recognition",
        "domain": "Status, political influence, fame, spiritual knowledge",
        "life_areas": [
            "Recognition and authority",
            "Fame and social standing",
            "Karmic merits from past lives",
            "Spiritual and intellectual capacities"
        ],
        "key_principles": [
            "Reveals capacity for fame and power",
            "Sun and Jupiter are key significators",
            "Benefics in angles indicate strong authority",
            "Important for political and public life"
        ]
    },
    6: {
        "name": "Shashtamsha (D6)",
        "sanskrit": "षष्ठांश",
        "purpose": "Health, diseases, debts, and enemies",
        "domain": "Vulnerabilities, chronic illnesses, adversarial forces, obstacles",
        "life_areas": [
            "Physical and mental health",
            "Debts and financial struggles",
            "Enemies and litigation",
            "Obstacles in life path"
        ],
        "key_principles": [
            "6th house matters are heavily analyzed",
            "Mars and Saturn represent diseases and enemies",
            "Afflictions indicate specific body parts affected",
            "Crucial for diagnosing chronic problems"
        ]
    },
    7: {
        "name": "Saptamsa (D7)",
        "sanskrit": "सप्तांश",
        "purpose": "Children, progeny, and creativity",
        "domain": "Offspring, grandchildren, creative expression, fertility",
        "life_areas": [
            "Number and nature of children",
            "Relationship with offspring",
            "Creative and artistic abilities",
            "Fertility and conception"
        ],
        "key_principles": [
            "5th house matters are analyzed",
            "Jupiter is the prime significator for children",
            "Benefics indicate healthy progeny",
            "Afflictions may show delays or difficulties"
        ]
    },
    8: {
        "name": "Ashtamsha (D8)",
        "sanskrit": "अष्टमांश",
        "purpose": "Longevity, obstacles, and sudden transformations",
        "domain": "Hidden matters, chronic issues, unexpected events, longevity",
        "life_areas": [
            "Life span and longevity",
            "Unexpected transformations or accidents",
            "Chronic difficulties and debts",
            "Hidden or occult knowledge"
        ],
        "key_principles": [
            "8th house matters are analyzed",
            "Saturn is the prime significator for longevity",
            "Afflictions here show sudden reversals",
            "Crucial for diagnosing sudden catastrophic events"
        ]
    },
    9: {
        "name": "Navamsa (D9)",
        "sanskrit": "नवांश",
        "purpose": "Marriage, spouse, and dharma",
        "domain": "Life partner, marital harmony, spiritual inclinations, fortune",
        "life_areas": [
            "Marriage and spouse characteristics",
            "Marital happiness and compatibility",
            "Spiritual growth and dharma",
            "Overall fortune and destiny"
        ],
        "key_principles": [
            "Most important divisional chart after D1",
            "Shows true strength of planets",
            "Venus and 7th lord indicate spouse nature",
            "Vargottama planets are very powerful"
        ]
    },
    10: {
        "name": "Dasamsa (D10)",
        "sanskrit": "दशांश",
        "purpose": "Career, profession, and achievements",
        "domain": "Occupation, status, authority, professional success, fame",
        "life_areas": [
            "Career path and profession",
            "Professional achievements and recognition",
            "Authority and leadership",
            "Public reputation and fame"
        ],
        "key_principles": [
            "10th house matters are examined",
            "Sun and Saturn are key significators",
            "Strong 10th lord indicates career success",
            "Planets in angles show professional prominence"
        ]
    },
    12: {
        "name": "Dwadasamsa (D12)",
        "sanskrit": "द्वादशांश",
        "purpose": "Parents, ancestry, and lineage",
        "domain": "Mother, father, ancestors, family heritage, parental influence",
        "life_areas": [
            "Relationship with parents",
            "Ancestral blessings and karma",
            "Family lineage and heritage",
            "Parental health and longevity"
        ],
        "key_principles": [
            "Sun represents father, Moon represents mother",
            "4th and 9th houses are analyzed",
            "Benefics indicate parental support",
            "Malefics may show parental separation"
        ]
    },
    11: {
        "name": "Rudramsha (D11)",
        "sanskrit": "रुद्रांश",
        "purpose": "Gains, elder siblings, and fulfillment of desires",
        "domain": "Income, fortune, social networks, realization of goals",
        "life_areas": [
            "Accumulation of wealth and income",
            "Relationship with elder siblings",
            "Fulfillment of deepest desires",
            "Gains from social networks"
        ],
        "key_principles": [
            "11th house matters are expanded",
            "Jupiter and Venus indicate financial gains",
            "Benefics in angles maximize fortune",
            "Crucial for assessing ultimate material success"
        ]
    },
    12: {
        "name": "Dwadasamsa (D12)",
        "sanskrit": "द्वादशांश",
        "purpose": "Parents, lineage, and ancestral karma",
        "domain": "Mother, father, grandparents, genetic inheritance",
        "life_areas": [
            "Well-being and longevity of parents",
            "Relationship with the father and mother",
            "Ancestral karma and genetics",
            "Family lineage and roots"
        ],
        "key_principles": [
            "Examines the roots of the native",
            "Sun (father) and Moon (mother) are key significators",
            "Benefics indicate supportive parents",
            "Afflictions show inherited karmic debts"
        ]
    },
    16: {
        "name": "Shodasamsa (D16)",
        "sanskrit": "षोडशांश",
        "purpose": "Vehicles, conveyances, and comforts",
        "domain": "Cars, transportation, material luxuries, happiness from assets",
        "life_areas": [
            "Ownership of vehicles",
            "Comfort from conveyances",
            "Material luxuries and pleasures",
            "General happiness and contentment"
        ],
        "key_principles": [
            "4th house matters related to vehicles",
            "Venus and Mercury are significators",
            "Benefics indicate luxury vehicles",
            "Strong chart shows comfort and happiness"
        ]
    },
    20: {
        "name": "Vimsamsa (D20)",
        "sanskrit": "विंशांश",
        "purpose": "Spiritual pursuits and religious activities",
        "domain": "Worship, meditation, mantras, spiritual practices, devotion",
        "life_areas": [
            "Spiritual inclinations and practices",
            "Religious devotion and faith",
            "Mantra sadhana and meditation",
            "Connection with divine energies"
        ],
        "key_principles": [
            "9th and 12th house matters examined",
            "Jupiter is the prime significator",
            "Strong chart indicates spiritual progress",
            "Benefics show devotion and grace"
        ]
    },
    24: {
        "name": "Chaturvimsamsa (D24)",
        "sanskrit": "चतुर्विंशांश",
        "purpose": "Education, learning, and knowledge",
        "domain": "Academic achievements, higher learning, wisdom, scholarly pursuits",
        "life_areas": [
            "Educational qualifications",
            "Learning abilities and intelligence",
            "Academic success and degrees",
            "Knowledge and wisdom acquisition"
        ],
        "key_principles": [
            "2nd, 4th, and 5th houses are analyzed",
            "Mercury and Jupiter are key planets",
            "Benefics indicate educational success",
            "Strong chart shows higher degrees"
        ]
    },
    27: {
        "name": "Saptavimsamsa (D27)",
        "sanskrit": "सप्तविंशांश",
        "purpose": "Strengths, weaknesses, and inherent qualities",
        "domain": "Physical strength, mental fortitude, character traits, virtues and vices",
        "life_areas": [
            "Physical and mental strength",
            "Character strengths and weaknesses",
            "Inherent virtues and talents",
            "Areas of vulnerability"
        ],
        "key_principles": [
            "Shows subtle character traits",
            "Benefics indicate positive qualities",
            "Malefics show areas needing work",
            "Overall strength assessment"
        ]
    },
    30: {
        "name": "Trimsamsa (D30)",
        "sanskrit": "त्रिंशांश",
        "purpose": "Misfortunes, evils, and difficulties",
        "domain": "Troubles, obstacles, enemies, diseases, accidents, suffering",
        "life_areas": [
            "Types of difficulties faced",
            "Health issues and diseases",
            "Enemies and opposition",
            "Accidents and misfortunes"
        ],
        "key_principles": [
            "6th, 8th, and 12th houses examined",
            "Malefics show nature of troubles",
            "Benefics provide protection",
            "Used for identifying vulnerabilities"
        ]
    },
    40: {
        "name": "Khavedamsa (D40)",
        "sanskrit": "खवेदांश",
        "purpose": "Auspicious and inauspicious effects",
        "domain": "Good and bad results, fortune and misfortune, karmic fruits",
        "life_areas": [
            "Overall auspiciousness of life",
            "Balance of good and bad karma",
            "Fortune and misfortune patterns",
            "Karmic rewards and punishments"
        ],
        "key_principles": [
            "Shows maturity of karmic results",
            "Benefics indicate good fortune",
            "Malefics show challenges",
            "Overall life balance assessment"
        ]
    },
    45: {
        "name": "Akshavedamsa (D45)",
        "sanskrit": "अक्षवेदांश",
        "purpose": "General character and conduct",
        "domain": "Moral character, behavior patterns, ethical conduct, personality traits",
        "life_areas": [
            "Moral and ethical behavior",
            "Character and personality",
            "Conduct in society",
            "Behavioral patterns and habits"
        ],
        "key_principles": [
            "Shows subtle character nuances",
            "Jupiter indicates ethical conduct",
            "Benefics show good character",
            "Malefics indicate character flaws"
        ]
    },
    60: {
        "name": "Shastiamsa (D60)",
        "sanskrit": "षष्ट्यांश",
        "purpose": "Past life karma and overall life assessment",
        "domain": "Karmic baggage, past life influences, complete life analysis, destiny",
        "life_areas": [
            "Past life karma and influences",
            "Deep karmic patterns",
            "Overall life destiny",
            "Complete astrological assessment"
        ],
        "key_principles": [
            "Most subtle and important divisional chart",
            "Shows past life karma clearly",
            "Used for final judgment of horoscope",
            "Reveals hidden karmic patterns",
            "Considered the ultimate divisional chart"
        ]
    }
}

def get_varga_info(d_number: int) -> dict:
    """
    Get traditional knowledge about a specific divisional chart.
    
    Args:
        d_number: The divisional chart number (1, 2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60)
    
    Returns:
        Dictionary containing chart information, or empty dict if not found
    """
    return VARGA_KNOWLEDGE.get(d_number, {})

def get_all_varga_numbers() -> list:
    """Get list of all available divisional chart numbers."""
    return sorted(VARGA_KNOWLEDGE.keys())
