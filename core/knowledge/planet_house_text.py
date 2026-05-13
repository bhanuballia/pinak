# core/knowledge/planet_house_text.py
"""
Rich, structured planet-in-house interpretations.
Uses a template approach: planet traits + house themes + special overrides.
"""

_ORDINALS = {
    1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th",
    7: "7th", 8: "8th", 9: "9th", 10: "10th", 11: "11th", 12: "12th"
}

HOUSE_THEMES = {
    1:  {"area": "Lagna (Self & Body)",        "focus": "self-identity, physical body, and overall personality"},
    2:  {"area": "Dhana (Wealth & Family)",    "focus": "accumulated wealth, speech, family, and values"},
    3:  {"area": "Sahaja (Courage & Siblings)","focus": "courage, communication, siblings, and short journeys"},
    4:  {"area": "Sukha (Home & Happiness)",   "focus": "home, mother, inner peace, and immovable property"},
    5:  {"area": "Putra (Intelligence & Children)", "focus": "intellect, creativity, children, and past-life merit"},
    6:  {"area": "Shatru (Enemies & Health)",  "focus": "service, enemies, health challenges, and daily routine"},
    7:  {"area": "Kalatra (Marriage & Partnerships)", "focus": "spouse, partnerships, public relations, and business"},
    8:  {"area": "Mrityu (Transformation & Longevity)", "focus": "longevity, transformation, hidden matters, and inheritance"},
    9:  {"area": "Bhagya (Fortune & Dharma)",  "focus": "fortune, higher wisdom, teachers, and spiritual path"},
    10: {"area": "Karma (Career & Status)",    "focus": "career, social status, authority, and public reputation"},
    11: {"area": "Labha (Gains & Network)",    "focus": "income, social networks, fulfilled desires, and elder siblings"},
    12: {"area": "Vyaya (Loss & Liberation)",  "focus": "foreign lands, spiritual liberation, isolation, and expenses"},
}

# ── Divisional Chart Contexts ─────────────────────────────────────────────────
# Each entry describes what the divisional chart governs and how to interpret
# planetary positions within it.
VARGA_CONTEXT = {
    1: {
        "name": "Rasi Chart (D1)",
        "domain": "Overall life — self, body, personality, and all life areas",
        "reveals": "the complete picture of the native's life, karma, destiny, and general fortune.",
        "lens": "In the D1 chart, planetary positions show their most fundamental, direct influence on the native's physical life and personality.",
        "ascendant_note": "The D1 ascendant (Lagna) sets the entire tone of the native's life path, body constitution, and self-expression.",
    },
    2: {
        "name": "Hora Chart (D2)",
        "domain": "Wealth, money, material resources, and financial fortune",
        "reveals": "insights about money, assets, material resources, and financial fortune.",
        "lens": "In the D2 chart, planetary positions indicate their influence on the native's financial security, earning capacity, and material accumulation.",
        "ascendant_note": "The D2 ascendant indicates the predominant energy governing wealth accumulation and financial temperament.",
    },
    3: {
        "name": "Drekkana Chart (D3)",
        "domain": "Siblings, courage, short journeys, and communication",
        "reveals": "the nature of relationships with siblings, one's inherent courage, communication style, and short travels.",
        "lens": "In the D3 chart, planetary positions show how the native's courage, communication, and sibling relationships are shaped.",
        "ascendant_note": "The D3 ascendant reveals the nature of the native's initiative, bravery, and relationship with close companions.",
    },
    4: {
        "name": "Chaturthamsha Chart (D4)",
        "domain": "Property, home, vehicles, and fixed assets",
        "reveals": "the destiny regarding immovable property, real estate, domestic happiness, and vehicles.",
        "lens": "In the D4 chart, planetary positions indicate the type and quality of property, home environment, and fixed assets the native acquires.",
        "ascendant_note": "The D4 ascendant shows the nature of the home environment, property fortune, and relationship with the motherland.",
    },
    7: {
        "name": "Saptamsha Chart (D7)",
        "domain": "Children, progeny, creative legacy, and grandchildren",
        "reveals": "the destiny related to children, their nature, number, and one's legacy through creative output.",
        "lens": "In the D7 chart, planetary positions reveal the timing, nature, and quality of blessings related to children and creative fruits.",
        "ascendant_note": "The D7 ascendant indicates the overarching energy shaping one's relationship with children and the legacy they leave.",
    },
    9: {
        "name": "Navamsha Chart (D9)",
        "domain": "Marriage, spouse, dharma, and the fruit of all actions",
        "reveals": "the true potential of the soul, the nature of the spouse, quality of marital life, and spiritual dharma.",
        "lens": "In the D9 chart (the most important divisional), planetary positions show their refined, soul-level influence on marriage, spouse, and overall life direction after age 35.",
        "ascendant_note": "The D9 ascendant reveals the soul's deeper nature and the qualities the native seeks in a life partner.",
    },
    10: {
        "name": "Dashamsha Chart (D10)",
        "domain": "Career, profession, social status, and public achievements",
        "reveals": "the native's true career potential, professional trajectory, and societal contribution.",
        "lens": "In the D10 chart, planetary positions directly indicate career strengths, professional environment, and the type of success achievable.",
        "ascendant_note": "The D10 ascendant reveals the core professional identity, work style, and the field most aligned with the native's soul mission.",
    },
    12: {
        "name": "Dvadashamsha Chart (D12)",
        "domain": "Parents, ancestry, and karmic inheritance from previous generations",
        "reveals": "the nature of the native's parents, blessings from ancestors, and karmic inheritance.",
        "lens": "In the D12 chart, planetary positions reveal the karmic role of parents, ancestral blessings or debts, and the native's relationship with their lineage.",
        "ascendant_note": "The D12 ascendant identifies the dominant ancestral energy flowing through the native's lineage.",
    },
    16: {
        "name": "Shodashamsha Chart (D16)",
        "domain": "Vehicles, luxury, mental happiness, and comforts",
        "reveals": "the native's access to luxury, comfort, vehicles, and the quality of mental happiness and pleasure.",
        "lens": "In the D16 chart, planetary positions indicate the type of conveyances, luxury items, and sources of mental joy available to the native.",
        "ascendant_note": "The D16 ascendant sets the tone for how the native experiences pleasure, comfort, and happiness in material life.",
    },
    20: {
        "name": "Vishamsha Chart (D20)",
        "domain": "Spiritual life, religious pursuits, and inner growth",
        "reveals": "the depth of the native's spiritual inclination, piety, and capacity for religious practice.",
        "lens": "In the D20 chart, planetary positions show how spiritual forces operate in the native's life and which deities or paths are most potent for them.",
        "ascendant_note": "The D20 ascendant reveals the spiritual path the native is karmically inclined to follow in this lifetime.",
    },
    24: {
        "name": "Chaturvimshamsha Chart (D24)",
        "domain": "Education, learning, scholarship, and academic achievement",
        "reveals": "the native's capacity for higher education, the type of knowledge they excel in, and scholarly potential.",
        "lens": "In the D24 chart, planetary positions indicate the fields of study, mentors, and academic achievements that are karmically destined.",
        "ascendant_note": "The D24 ascendant reveals the learning archetype — whether the native is a natural scholar, researcher, artist, or spiritual seeker.",
    },
    27: {
        "name": "Saptavimshamsha Chart (D27)",
        "domain": "Strength, vitality, and the soul's inherent resilience",
        "reveals": "the native's core strength, physical vitality, and the resilience of the soul in facing life's trials.",
        "lens": "In the D27 chart, planetary positions show which areas of life the native has the most inherent strength and where challenges may test their resilience.",
        "ascendant_note": "The D27 ascendant reveals the dominant energy of the native's soul-strength and capacity for endurance.",
    },
    30: {
        "name": "Trimshamsha Chart (D30)",
        "domain": "Misfortunes, character flaws, and moral resilience",
        "reveals": "the nature of potential misfortunes, subconscious character flaws, and the moral resilience that helps overcome them.",
        "lens": "In the D30 chart, planetary positions reveal hidden vulnerabilities and the specific life areas where the native must exercise extra caution and spiritual vigilance.",
        "ascendant_note": "The D30 ascendant indicates the primary archetype of challenge the native must consciously work to transcend in this lifetime.",
    },
    40: {
        "name": "Khavedamsha Chart (D40)",
        "domain": "Auspicious/inauspicious results of maternal lineage",
        "reveals": "the fine-grained auspicious and inauspicious results flowing from the maternal side of the family.",
        "lens": "In the D40 chart, planetary positions provide granular insight into the karmic credits and debts received through the mother's lineage.",
        "ascendant_note": "The D40 ascendant indicates the dominant maternal karmic energy influencing the native's fortune.",
    },
    45: {
        "name": "Akshavedamsha Chart (D45)",
        "domain": "Moral conduct, ethics, and paternal karmic legacy",
        "reveals": "the native's moral character, ethical conduct, and the karmic inheritance from the paternal lineage.",
        "lens": "In the D45 chart, planetary positions reveal the ethical framework the soul operates from and the karmic patterns inherited from the father's line.",
        "ascendant_note": "The D45 ascendant indicates the dominant paternal karmic energy and the area of life where ethical growth is most crucial.",
    },
    60: {
        "name": "Shashtiamsha Chart (D60)",
        "domain": "Accumulated karma across multiple lifetimes",
        "reveals": "the deepest karmic imprints from previous lifetimes, shaping the foundational conditions of the current birth.",
        "lens": "In the D60 chart — the most subtle and profound divisional — planetary positions reveal the karmic seeds planted across many lifetimes that now bear fruit.",
        "ascendant_note": "The D60 ascendant is considered the most spiritually significant sign, indicating the soul's overall evolutionary status.",
    },
}


def get_varga_context(d_num: int) -> dict:
    """Return the context dict for a divisional chart number (1, 2, 3, ..., 60)."""
    return VARGA_CONTEXT.get(d_num, {
        "name": f"D{d_num} Chart",
        "domain": f"Divisional chart {d_num} domain",
        "reveals": f"specific sub-domain insights for the D{d_num} chart.",
        "lens": f"In the D{d_num} chart, planetary positions are interpreted through the specific lens of this divisional.",
        "ascendant_note": f"The D{d_num} ascendant reveals the dominant energy for this divisional's domain.",
    })


# ── Sarvashtakavarga House Score Interpretations ─────────────────────────────
# Score thresholds: <=20=very weak, 21-25=weak, 26-28=average, 29-33=strong, 34+=very strong

SAV_HOUSE_CONTEXT = {
    1: {
        "area": "Self, Body & Personality",
        "significator": "Sun",
        "implications": {
            "Health & Vitality": {
                "low": "Prone to lower immunity and fluctuating physical energy. Needs consistent discipline to maintain vitality.",
                "high": "Robust physical constitution, high immunity, and strong natural vitality."
            },
            "Self-Expression": {
                "low": "Potential struggles with self-confidence or difficulty asserting oneself in the world.",
                "high": "Strong willpower, natural confidence, and a commanding personality."
            },
            "Personality": {
                "low": "Personality may lack initial impact or appear subdued in social environments.",
                "high": "Magnetism, strong first impressions, and a dignified presence."
            },
            "Initiative & Drive": {
                "low": "Tendency toward hesitation or lack of proactive drive in starting new ventures.",
                "high": "Powerful initiative and the ability to take decisive independent action."
            },
            "Transit Impact": {
                "low": "Malefic transits can significantly affect health and self-image due to low reserves.",
                "high": "Resilient against difficult transits; able to maintain self-assurance through challenges."
            },
        },
        "remedies": "Strengthen the body through yoga and physical discipline. Worship the Sun. Wear Ruby after expert advice.",
        "better_perspective": "A strong Lagna lord in the natal chart can compensate for a low SAV score and protect personal vitality.",
    },
    2: {
        "area": "Wealth, Family & Speech",
        "significator": "Jupiter/Venus",
        "implications": {
            "Financial Accumulation": {
                "low": "Financial savings may be slow to build, with frequent unexpected expenses.",
                "high": "Natural talent for wealth accumulation and building stable financial reserves."
            },
            "Family Harmony": {
                "low": "Potential for misunderstandings or lack of strong support from the immediate family circle.",
                "high": "Strong family bonds and supportive environment within the household."
            },
            "Speech & Communication": {
                "low": "Speech may lack persuasiveness or there may be issues with oral expression.",
                "high": "Articulate, persuasive speech and a naturally authoritative voice."
            },
            "Food & Nourishment": {
                "low": "Needs to be cautious about dietary habits to maintain overall well-being.",
                "high": "Excellent nourishment and a healthy, disciplined approach to dietary habits."
            },
            "Transit Impact": {
                "low": "Malefics transiting here can trigger immediate financial losses or family disputes.",
                "high": "Financial stability remains largely intact even during challenging transits."
            },
        },
        "remedies": "Practice gratitude and generosity. Worship Goddess Lakshmi on Fridays. Focus on building savings systematically.",
        "better_perspective": "A well-placed 2nd lord or Jupiter in the natal chart helps sustain wealth despite a lower SAV score.",
    },
    3: {
        "area": "Courage, Siblings & Efforts",
        "significator": "Mars",
        "implications": {
            "Efforts & Initiative": {
                "low": "Weakened will, lack of initiative, and significant challenges in achieving goals through self-effort.",
                "high": "Undaunted willpower and the ability to achieve success through persistent, courageous effort."
            },
            "Courage & Energy": {
                "low": "Reduced mental courage, potentially causing procrastination or a defeatist mindset.",
                "high": "High mental bravery, dynamic energy, and a proactive approach to obstacles."
            },
            "Siblings & Family": {
                "low": "Potential for strained relationships or frequent worries regarding younger siblings.",
                "high": "Supportive siblings and excellent cooperative efforts with peers."
            },
            "Communication & Skills": {
                "low": "Possible difficulties in bringing personal skills/talents to full fruition.",
                "high": "Exceptional development of personal skills and effective communication of ideas."
            },
            "Transit Impact": {
                "low": "Malefics passing through can aggravate struggles, cause illness, or mental anxiety.",
                "high": "Transits of malefics are countered by strong inherent courage and proactive steps."
            },
        },
        "remedies": "Focus on self-effort and improving communication skills. Strengthen Mars through physical exercise and discipline.",
        "better_perspective": "If the 3rd lord is well-placed in the natal chart, it can substantially mitigate a low SAV score here.",
    },
    4: {
        "area": "Home, Mother & Inner Happiness",
        "significator": "Moon",
        "implications": {
            "Domestic Happiness": {
                "low": "Home life may feel unsettled or lack the desired peace and comfort.",
                "high": "Pervasive sense of peace and deep satisfaction within the domestic sphere."
            },
            "Property & Assets": {
                "low": "Acquiring immovable property or vehicles may face delays or recurring obstacles.",
                "high": "Natural ease in acquiring land, property, and comfortable vehicles."
            },
            "Relationship with Mother": {
                "low": "Relationship with the mother may be emotionally distant or a source of worry.",
                "high": "Strong emotional bond and significant blessings received through the mother."
            },
            "Inner Peace": {
                "low": "Tendency toward emotional restlessness and difficulty in achieving mental rest.",
                "high": "Deep emotional stability and a naturally contented, peaceful mind."
            },
            "Transit Impact": {
                "low": "Malefic transits can easily disturb domestic harmony or bring property disputes.",
                "high": "Emotional resilience protects domestic peace during challenging outer transits."
            },
        },
        "remedies": "Honor and care for your mother. Worship the Moon and Goddess Durga. Perform home-related rituals on Mondays.",
        "better_perspective": "A strong Moon or 4th lord in the natal chart provides emotional security even with a lower SAV score.",
    },
    5: {
        "area": "Intelligence, Children & Creativity",
        "significator": "Jupiter",
        "implications": {
            "Intellect & Learning": {
                "low": "May face challenges in concentration or consistent academic progress.",
                "high": "Sharp intellect, exceptional memory, and a natural aptitude for higher learning."
            },
            "Children & Progeny": {
                "low": "Delays or concerns regarding children's growth and relationship harmony.",
                "high": "Joy through children and a deeply rewarding relationship with progeny."
            },
            "Creative Expression": {
                "low": "Creative talents may remain dormant or face blocks in public expression.",
                "high": "Powerful creative self-expression and fulfillment through artistic endeavors."
            },
            "Speculation & Risk": {
                "low": "Cautious or unfavorable results in speculative investments and games of skill.",
                "high": "Good fortune in investments, speculation, and strategic risk-taking."
            },
            "Transit Impact": {
                "low": "Transits can temporarily diminish intellectual clarity or affect children's well-being.",
                "high": "Supportive transits enhance academic success and creative breakthroughs."
            },
        },
        "remedies": "Worship Lord Brihaspati (Jupiter) on Thursdays. Teach and mentor others as a form of spiritual giving.",
        "better_perspective": "A strong 5th lord or well-placed Jupiter significantly compensates for a weaker SAV score in this house.",
    },
    6: {
        "area": "Service, Health & Enemies",
        "significator": "Mars/Saturn",
        "implications": {
            "Health & Immunity": {
                "low": "Slower recovery from illness and lower resistance to daily health stresses.",
                "high": "Strong physical immunity and the ability to overcome health challenges quickly."
            },
            "Enemies & Rivals": {
                "low": "Native may feel easily overwhelmed by competition or workplace opposition.",
                "high": "Capacity to win over enemies and excel in highly competitive environments."
            },
            "Service & Work Ethic": {
                "low": "Difficulty in maintaining routine or finding satisfaction in daily service roles.",
                "high": "Exceptional dedication to duty and success through disciplined service."
            },
            "Debts & Obligations": {
                "low": "Need for careful management to avoid the burden of debts or legal complications.",
                "high": "Ability to effectively manage finances and stay free from long-term debts."
            },
            "Transit Impact": {
                "low": "Malefic transits can intensify workplace friction or trigger unexpected health issues.",
                "high": "Disciplined routine mitigates the impact of malefic transits in this house."
            },
        },
        "remedies": "Serve the underprivileged selflessly. Worship Lord Hanuman. Maintain strict health routines and discipline.",
        "better_perspective": "A strong 6th lord in the natal chart or powerful Saturn/Mars can help offset a lower SAV score here.",
    },
    7: {
        "area": "Marriage, Partnerships & Business",
        "significator": "Venus/Jupiter",
        "implications": {
            "Marital Happiness": {
                "low": "Marital life may require extra effort to maintain harmony and mutual understanding.",
                "high": "Natural harmony, deep bonding, and consistent happiness in marriage."
            },
            "Partner's Nature": {
                "low": "Partner may be struggling with health or lack the desired supportive nature.",
                "high": "Supportive, healthy, and prosperous life partner who aids the native's growth."
            },
            "Business Partnerships": {
                "low": "Challenges in team ventures or potential for misunderstandings with partners.",
                "high": "Success in professional collaborations and long-lasting joint ventures."
            },
            "Public Relations": {
                "low": "Public social standing may be modest or require significant effort to build.",
                "high": "Charismatic public presence and very positive social interactions."
            },
            "Transit Impact": {
                "low": "Malefic transits easily trigger relationship strain or spouse-related worries.",
                "high": "Stable foundation protects the marriage from temporary malefic transits."
            },
        },
        "remedies": "Worship Goddess Parvati on Mondays. Practice patience and understanding in relationships. Offer sweets to couples.",
        "better_perspective": "A strong Venus or 7th lord in the natal chart provides marital support despite a lower SAV score.",
    },
    8: {
        "area": "Longevity, Transformation & Hidden Matters",
        "significator": "Saturn",
        "implications": {
            "Longevity & Lifespan": {
                "low": "Vitality reserves may be lower, requiring a focus on health and safety.",
                "high": "Excellent longevity and deep reserves of inner survival energy."
            },
            "Transformative Experiences": {
                "low": "Native may find sudden changes and life upheavals difficult to navigate.",
                "high": "Capacity for profound inner transformation and growth through life's changes."
            },
            "Hidden Wealth & Inheritance": {
                "low": "Gains through heritage or hidden sources may be limited or delayed.",
                "high": "Potential for significant inheritance or gains from insurance/unearned wealth."
            },
            "Occult & Research": {
                "low": "Interest in occult/research may exist but face blocks in practical attainment.",
                "high": "Natural aptitude for research, investigative skills, and metaphysical wisdom."
            },
            "Transit Impact": {
                "low": "Malefic transits to this house can cause severe health or financial disruptions.",
                "high": "Inner resilience allows the native to emerge stronger from karmic transits."
            },
        },
        "remedies": "Practice Mrityunjaya mantra regularly. Worship Lord Shiva. Donate to hospitals and serve the elderly.",
        "better_perspective": "A strong 8th lord or Saturn in a good position can significantly reduce the intensity of difficult 8th house events.",
    },
    9: {
        "area": "Fortune, Dharma & Wisdom",
        "significator": "Jupiter/Sun",
        "implications": {
            "Fortune & Luck": {
                "low": "Luck may appear inconsistent, requiring more effort to achieve fortunate results.",
                "high": "Consistent good fortune and natural support of fate in major life events."
            },
            "Father & Mentors": {
                "low": "May lack strong guidance from a father figure or find mentors hard to access.",
                "high": "Significant support and wisdom inherited from father, gurus, and teachers."
            },
            "Spiritual Growth": {
                "low": "Spiritual path may feel obstructed or lack deep devotional focus.",
                "high": "Profound spiritual inclination and natural success in religious pursuits."
            },
            "Higher Learning": {
                "low": "Academic success in higher fields may require significant perseverance.",
                "high": "Great aptitude for philosophy, law, and pursuit of deep scholarly wisdom."
            },
            "Transit Impact": {
                "low": "Malefic transits can temporarily block fortune or cause strain with gurus.",
                "high": "Benefic transits through this sign bring massive breakthroughs and luck."
            },
        },
        "remedies": "Honour your father and teachers. Worship Lord Vishnu and make pilgrimages. Perform acts of charity on Thursdays.",
        "better_perspective": "Even with a moderate score, a strong Jupiter or 9th lord can activate fortune and blessings from the divine.",
    },
    10: {
        "area": "Career, Status & Public Reputation",
        "significator": "Saturn/Sun/Mercury/Jupiter",
        "implications": {
            "Career Success": {
                "low": "Career path may be characterized by frequent changes or slow recognition.",
                "high": "Rapid professional growth and achieving high peaks in the chosen field."
            },
            "Public Status": {
                "low": "Status and public recognition may remain modest despite hard work.",
                "high": "Authority, high social status, and a widely respected public image."
            },
            "Ambition & Discipline": {
                "low": "native may struggle to maintain long-term career focus or discipline.",
                "high": "Unwavering ambition, professional discipline, and strong work ethic."
            },
            "Leadership & Authority": {
                "low": "Opportunities for command or leadership may be limited or brief.",
                "high": "Natural aptitude for command and success in leadership roles."
            },
            "Transit Impact": {
                "low": "Malefic transits can cause job insecurity or damage to reputation.",
                "high": "Strong professional foundation withstands temporary malefic transits."
            },
        },
        "remedies": "Perform your duties diligently and ethically. Worship Lord Shani/Sun. Avoid shortcuts in professional life.",
        "better_perspective": "A strong 10th lord or exalted Saturn/Sun in the natal chart can sustain career success with lower SAV scores.",
    },
    11: {
        "area": "Gains, Income & Fulfillment of Desires",
        "significator": "Jupiter/Saturn",
        "implications": {
            "Financial Gains": {
                "low": "Income streams may be limited or income growth feels stagnant.",
                "high": "Abundant income and consistent financial gains from multiple channels."
            },
            "Fulfillment of Desires": {
                "low": "Native's aspirations and wishes may take significantly longer to manifest.",
                "high": "Strong planetary support for the real-world fulfillment of one's deepest desires."
            },
            "Social Network": {
                "low": "Social circle may be small or lack influential supporters.",
                "high": "Vast network of helpful friends, elder siblings, and powerful allies."
            },
            "Multiple Income Sources": {
                "low": "Income usually restricted to a single source with limited passive streams.",
                "high": "Potential for wealth from investments, business, and multiple streams."
            },
            "Transit Impact": {
                "low": "Malefic transits can block gains or create friction with associates.",
                "high": "Benefic transits bring windfall gains and fulfillment of long-held goals."
            },
        },
        "remedies": "Expand your social circle with integrity. Donate a portion of income to charity. Worship Jupiter on Thursdays.",
        "better_perspective": "A strong Jupiter or 11th lord in the natal chart can unlock income and social gains even from a moderate SAV score.",
    },
    12: {
        "area": "Expenses, Liberation & Foreign Connections",
        "significator": "Saturn/Ketu",
        "implications": {
            "Expenditure & Losses": {
                "low": "Financial focus may be on managing wasteful expenses or sudden losses.",
                "high": "Capacity to channel expenses into charity, investments, or spiritual growth."
            },
            "Foreign Travel & Stay": {
                "low": "Opportunities for foreign travel or residence may be restricted.",
                "high": "Strong potential for success in foreign lands or international work."
            },
            "Spiritual Liberation": {
                "low": "Spiritual seeking may lack depth or face internal distractions.",
                "high": "Natural aptitude for meditation, solitude, and inner spiritual freedom."
            },
            "Hospital & Isolation": {
                "low": "Higher vulnerability to periods of isolation or required hospitalization.",
                "high": "Resilience against isolation; ability to find peace even in retreat."
            },
            "Transit Impact": {
                "low": "Malefic transits can intensify expenses or bring periods of reclusion.",
                "high": "Transits through this house enhance spiritual insight and foreign gains."
            },
        },
        "remedies": "Practice meditation and spiritual discipline. Donate generously to hospitals or orphanages. Limit unnecessary spending.",
        "better_perspective": "A naturally benefic 12th house or strong 12th lord can turn expenses into spiritual investments and foreign opportunities.",
    },
}

# ── Sign Context Logic ────────────────────────────────────────────────────────
SIGN_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

SIGN_TRAITS = {
    "Aries": "dynamic energy and pioneering spirit",
    "Taurus": "artistic refinement and material stability",
    "Gemini": "intellectual curiosity and communication skill",
    "Cancer": "emotional depth and nurturing care",
    "Leo": "authority, creativity, and self-expression",
    "Virgo": "analytical precision and dedication to service",
    "Libra": "diplomacy, balance, and aesthetic harmony",
    "Scorpio": "transformative power and intense focus",
    "Sagittarius": "wisdom, philosophy, and spiritual expansion",
    "Capricorn": "discipline, structure, and professional ambition",
    "Aquarius": "innovation, social vision, and unique gains",
    "Pisces": "spiritual sensitivity, imagination, and liberation"
}

def get_varga_sign_intro(d_num: int, sign_name: str) -> str:
    """Return a contextual sentence for an ascendant sign in a varga chart."""
    ctx = get_varga_context(d_num)
    lord = SIGN_LORDS.get(sign_name, "")
    traits = SIGN_TRAITS.get(sign_name, "unique energy")
    
    # Custom sentence based on user's requested style
    if d_num == 2 and sign_name == "Cancer":
        return "With Cancer ascendant in this divisional chart, financial matters and wealth accumulation are indicated with emotional depth and fluctuating abundance."
        
    return f"With {sign_name} ascendant in this divisional chart, {ctx['domain']} are influenced by {traits}."


# ── Score Band Definitions ──────────────────────────────────────────────────
_SCORE_BANDS = [
    (0,  20, "Very Weak",  "#c62828", "This house has an extremely low bindu count, indicating severely restricted results in its domain. The native may face persistent struggles in this life area, especially during related dasha and transit periods."),
    (21, 25, "Weak",       "#e65100", "A score below 25 is generally considered weak in SAV analysis. The native may face recurring challenges in this house's domain, with limited support from planetary transits through this sign."),
    (26, 28, "Average",    "#f9a825", "An average score indicates moderate results — neither particularly fortunate nor particularly difficult. The native can achieve results in this domain through deliberate effort."),
    (29, 33, "Strong",     "#2e7d32", "A strong bindu count indicates this house has good planetary support. Results in this domain tend to come with relative ease, and transits through this sign are generally supportive."),
    (34, 56, "Very Strong","#1565c0", "An exceptional score indicates exceptional planetary support for this house's domain. The native enjoys natural luck and ease in this life area, with highly beneficial transits reinforcing positive outcomes."),
]


def get_sav_interpretation(house: int, score: int) -> dict:
    """
    Return a structured interpretation dict for a house's SAV score.
    Keys: area, significator, score, band_label, band_color, band_desc,
          implications (dict), remedies, better_perspective, avg_note
    """
    ctx = SAV_HOUSE_CONTEXT.get(house, {})
    band_label, band_color, band_desc = "Unknown", "#555555", ""
    for lo, hi, label, color, desc in _SCORE_BANDS:
        if lo <= score <= hi:
            band_label, band_color, band_desc = label, color, desc
            break

    # Resolve score-sensitive implications
    implications = {}
    is_high = score >= 28
    ctx_impl = ctx.get("implications", {})
    if isinstance(ctx_impl, dict):
        for key, val in ctx_impl.items():
            if isinstance(val, dict):
                implications[key] = val.get("high" if is_high else "low", "")
            else:
                implications[key] = str(val)

    return {
        "area":              ctx.get("area", f"House {house}"),
        "significator":      ctx.get("significator", ""),
        "score":             score,
        "band_label":        band_label,
        "band_color":        band_color,
        "band_desc":         band_desc,
        "implications":      implications,
        "remedies":          ctx.get("remedies", ""),
        "better_perspective":ctx.get("better_perspective", ""),
        "avg_note": (
            "In SAV, the average score per house is 28 points. "
            "Scores below 25 are relatively low; above 30 are strong. "
            "The total of all 12 houses must equal 337 bindus."
        ),
    }


PLANET_TRAITS = {

    "Sun": {
        "nature": "regal, authoritative, and soul-driven",
        "personality": "Confident, dignified, and naturally commanding with strong leadership presence and a desire for recognition.",
        "behavioral": "Proud, generous, and principled; can become egoistic or domineering if afflicted.",
        "health": "Issues with heart, eyes, bones, and vitality; excess heat or inflammation possible.",
        "relationships": "Seeks a partner of equal status; can overshadow the spouse due to strong individuality.",
        "career": "Excels as a leader, government official, politician, administrator, doctor, or in public-facing authority roles.",
        "strength_note": "Exalted Sun (Aries) gives exceptional leadership; debilitated Sun (Libra) may cause ego conflicts.",
        "remedies": "Offer water to the Sun at sunrise, worship Lord Shiva, wear Ruby (Manik) after expert advice, and chant Aditya Hridayam.",
        "special": {
            1: "Creates a 'Sun Lagna' personality — proud, authoritative, and deeply connected to the soul's purpose.",
            10: "One of the finest placements for career; the native achieves fame and authority in professional life.",
        }
    },
    "Moon": {
        "nature": "emotional, nurturing, and mind-driven",
        "personality": "Sensitive, intuitive, and empathetic with a strong emotional aura and fluctuating moods.",
        "behavioral": "Caring, imaginative, and receptive; can become over-emotional, anxious, or overly dependent.",
        "health": "Prone to water-related issues, mental stress, hormonal imbalances, and lung/chest ailments.",
        "relationships": "Deeply emotional and nurturing partner; seeks security and emotional bonding.",
        "career": "Thrives in nursing, hospitality, food industry, counseling, travel, import-export, and public relations.",
        "strength_note": "Exalted Moon (Taurus) gives a calm, wealthy mind; debilitated Moon (Scorpio) may cause emotional turmoil.",
        "remedies": "Fast on Mondays, worship Goddess Parvati/Durga, wear Pearl (Moti) after expert advice, and chant Chandra mantra.",
        "special": {
            4: "Moon in its own-like zone — brings deep domestic happiness, emotional peace, and strong maternal bond.",
        }
    },
    "Mars": {
        "nature": "fiery, energetic, and action-oriented",
        "personality": "Athletic, bold, direct, and high-energy with strong willpower and a competitive drive. Known for muscular build and sharp features.",
        "behavioral": "Outspoken, courageous, and proactive; quick to anger but also quick to forgive. Can be stubborn or self-centric.",
        "health": "Issues with high blood pressure, skin rashes, cuts, burns, fevers, and blood-related disorders due to fiery nature.",
        "relationships": "Creates Manglik Dosha in houses 1, 2, 4, 7, 8, and 12. Aggressive or assertive in partnerships; needs a strong partner.",
        "career": "Excels in military, police, engineering, surgery, sports, construction, and entrepreneurship requiring physical courage.",
        "strength_note": "Strong Mars (Aries, Scorpio, Capricorn) brings leadership and charisma; weak Mars leads to recklessness or aggression.",
        "remedies": "Worship Lord Hanuman, fast on Tuesdays, offer red flowers to Lord Hanuman, wear Coral (Moonga) after expert advice.",
        "special": {
            1: "Mars in the 1st house (Lagna) creates a dynamic, courageous personality often making the native athletic, impulsive, and energetic. Creates Manglik Dosha. Natives can be short-tempered, accident-prone, or struggle with a self-centric infant-like nature.",
            10: "Ruchaka Yoga may form — one of the Pancha Mahapurusha Yogas — giving exceptional authority, fame, and professional power.",
        }
    },
    "Mercury": {
        "nature": "intellectual, analytical, and communicative",
        "personality": "Quick-witted, youthful, and expressive with strong analytical and verbal abilities. Often appears younger than their age.",
        "behavioral": "Adaptive, curious, and logical; may become nervous, indecisive, or overly critical when afflicted.",
        "health": "Prone to nervous system issues, skin conditions, speech disorders, and respiratory problems.",
        "relationships": "Intellectual and communicative in partnerships; seeks a witty and intelligent companion.",
        "career": "Excels in writing, accounting, IT, teaching, law, astrology, journalism, and all analytical or communication fields.",
        "strength_note": "Exalted Mercury (Virgo) gives exceptional intellect; debilitated Mercury (Pisces) may cause confusion and indecision.",
        "remedies": "Worship Lord Vishnu or Goddess Saraswati, wear Emerald (Panna) after expert advice, feed green vegetables to animals.",
        "special": {
            1: "Bhadra Yoga may form if Mercury is in Gemini or Virgo in the 1st house — granting extraordinary intellect and communication skills.",
        }
    },
    "Jupiter": {
        "nature": "wise, expansive, and spiritually inclined",
        "personality": "Optimistic, philosophical, generous, and naturally fortunate with a broad world-view and strong moral character.",
        "behavioral": "Wise, benevolent, and inspiring; can become over-indulgent, preachy, or lazy when afflicted.",
        "health": "Prone to liver issues, obesity, diabetes, and problems from over-indulgence in food and comfort.",
        "relationships": "Supportive, wise, and noble partner; brings grace and stability to relationships.",
        "career": "Thrives as teacher, judge, priest, counselor, financial advisor, philosopher, or banker.",
        "strength_note": "Exalted Jupiter (Cancer) is supremely auspicious; debilitated Jupiter (Capricorn) may cause overconfidence or missed wisdom.",
        "remedies": "Worship Lord Vishnu/Brihaspati, fast on Thursdays, offer yellow flowers, wear Yellow Sapphire (Pukhraj) after expert advice.",
        "special": {
            9: "Supremely auspicious placement — known as 'Dharma Karmadhipati' combination, granting deep wisdom, spiritual leadership, and divine grace.",
        }
    },
    "Venus": {
        "nature": "artistic, refined, and pleasure-seeking",
        "personality": "Charming, beautiful, diplomatic, and aesthetically sensitive with a love for luxury, beauty, and harmony.",
        "behavioral": "Loving, creative, and socially graceful; can become indulgent, vain, or overly relationship-dependent.",
        "health": "Issues with kidneys, reproductive system, skin, throat, and hormonal balance.",
        "relationships": "Brings a charming, artistic spouse; highly values love and beauty in partnerships.",
        "career": "Excels in arts, fashion, music, film, luxury goods, beauty industry, hospitality, and diplomacy.",
        "strength_note": "Exalted Venus (Pisces) is supremely refined; debilitated Venus (Virgo) may make love elusive or overly critical.",
        "remedies": "Worship Goddess Lakshmi, fast on Fridays, offer white flowers/sweets, wear Diamond (Heera) or White Sapphire after expert advice.",
        "special": {
            7: "Malavya Yoga may form — one of the Pancha Mahapurusha Yogas — giving exceptional beauty, luxury, and a loving, artistic spouse.",
        }
    },
    "Saturn": {
        "nature": "disciplined, karmic, and slow-working",
        "personality": "Serious, structured, responsible, and enduring with a mature outlook on life and strong work ethic.",
        "behavioral": "Patient, disciplined, and dutiful; can become pessimistic, rigid, fearful, or cold when afflicted.",
        "health": "Prone to bone/joint issues, chronic illness, dental problems, skin diseases, and nerve-related ailments.",
        "relationships": "Brings a mature, stable, and serious partner; relationships require effort and patience to flourish.",
        "career": "Excels in law, mining, construction, real estate, government service, agriculture, and any field requiring discipline and persistence.",
        "strength_note": "Exalted Saturn (Libra) builds remarkable long-term success; debilitated Saturn (Aries) may cause chronic struggles.",
        "remedies": "Worship Lord Shani/Hanuman, fast on Saturdays, donate black sesame/iron, wear Blue Sapphire (Neelam) only after expert advice.",
        "special": {
            10: "Shasha Yoga may form — one of the Pancha Mahapurusha Yogas — giving authority, discipline, and enduring career achievement.",
        }
    },
    "Rahu": {
        "nature": "unconventional, ambitious, and illusion-creating",
        "personality": "Ambitious, unconventional, and worldly with a magnetic personality and a strong drive for material attainment.",
        "behavioral": "Bold, innovative, and rule-breaking; can become obsessive, deceptive, or prone to extreme desires.",
        "health": "Issues with nervous system, skin, mental health, poisoning, and chronic or mysterious ailments.",
        "relationships": "Brings an unconventional, foreign, or unique partner; relationships can be intense and transformative.",
        "career": "Excels in technology, media, politics, foreign trade, research, psychology, and unconventional or futuristic fields.",
        "strength_note": "Rahu in friendly signs (Gemini, Virgo) drives massive worldly success. In difficult signs, it may manifest as obsession or deceit.",
        "remedies": "Worship Goddess Durga/Saraswati, donate to charity on Saturdays, feed birds, wear Hessonite Garnet (Gomed) after expert advice.",
        "special": {
            10: "Extremely powerful for worldly fame and unconventional career success when well-placed — many celebrities and entrepreneurs have this.",
        }
    },
    "Ketu": {
        "nature": "spiritual, detached, and karmically significant",
        "personality": "Intuitive, spiritual, and introspective with a detached view of the material world and strong past-life wisdom.",
        "behavioral": "Mysterious, psychic, and contemplative; can become reclusive, confused, or disconnected from reality.",
        "health": "Prone to mysterious illnesses, surgeries, spiritual crises, and nervous or immune system issues.",
        "relationships": "Brings a spiritual, detached, or past-life-connected partner; relationships require understanding and mutual independence.",
        "career": "Thrives in spiritual work, astrology, research, medicine, technology, and any field involving hidden knowledge.",
        "strength_note": "Ketu in spiritual signs (Pisces, Sagittarius, Scorpio) accelerates liberation; in material signs, detachment may harm worldly pursuits.",
        "remedies": "Worship Lord Ganesha/Shiva, fast on Thursdays, donate saffron/blankets, wear Cat's Eye (Lehsunia) only after expert advice.",
        "special": {
            12: "Classic placement for spiritual liberation (Moksha). Native is deeply meditative and may achieve enlightenment or great spiritual freedom.",
        }
    },
}

KEY_EFFECT_CATEGORIES = [
    "Personality & Appearance",
    "Behavioral Traits",
    "Health",
    "Relationships & Marriage",
    "Career & Success",
]


def planet_rich_interpretation(planet: str, house: int) -> dict:
    """
    Returns a rich, structured interpretation dict for a planet in a house.
    Keys: summary, key_effects (dict), considerations (dict)
    """
    traits = PLANET_TRAITS.get(planet)
    house_theme = HOUSE_THEMES.get(house)
    if not traits or not house_theme:
        return {}

    traits_dict = traits if isinstance(traits, dict) else {}
    house_theme_dict = house_theme if isinstance(house_theme, dict) else {}
    
    ordinal = _ORDINALS.get(house, str(house))
    area = house_theme_dict.get("area", f"House {house}")
    focus = house_theme_dict.get("focus", "this life area")

    # Check for special override for summary
    special_note = traits_dict.get("special", {}).get(house, "")
    if special_note:
        summary = str(special_note)
    else:
        summary = (
            f"{planet} in the {ordinal} house ({area}) brings its {traits_dict.get('nature', 'unique')} energy "
            f"into the domain of {focus}. This placement significantly colours the native's "
            f"approach to this area of life, shaping outcomes both materially and spiritually."
        )

    key_effects = {
        "Personality & Appearance": (
            f"{traits_dict.get('personality', '')} "
            f"In the {ordinal} house, this {traits_dict.get('nature', 'unique')} influence shapes the native's outlook on {focus}."
        ),
        "Behavioral Traits": traits_dict.get("behavioral", ""),
        "Health": traits_dict.get("health", ""),
        "Relationships & Marriage": traits_dict.get("relationships", ""),
        "Career & Success": traits_dict.get("career", ""),
    }

    considerations = {
        "Strength Matters": traits_dict.get("strength_note", ""),
        "Remedies": traits_dict.get("remedies", ""),
    }

    return {
        "summary": summary,
        "key_effects": key_effects,
        "considerations": considerations,
        "planet": planet,
        "house": house,
        "ordinal": ordinal,
        "area": area,
    }


# ── Legacy one-liner interface (kept for backward compatibility) ──────────────
PLANET_HOUSE_TEXT = {
    "Sun": {
        1: "Sun in the first house indicates a strong, confident personality with natural leadership qualities.",
        2: "Sun in the second house suggests focus on wealth, family values, and authoritative speech.",
        3: "Sun in the third house emphasizes courage, strong communication, and proactive relations with siblings.",
        4: "Sun in the fourth house emphasizes strong attachment to homeland and family traditions.",
        5: "Sun in the fifth house highlights creativity, intelligence, and interest in progeny.",
        6: "Sun in the sixth house indicates strength in overcoming obstacles and success in competition.",
        7: "Sun in the seventh house brings an authoritative partner and highlights public social standing.",
        8: "Sun in the eighth house suggests deep inner transformation and interest in research/occult.",
        9: "Sun in the ninth house points toward wisdom, spiritual inclination, and higher learning.",
        10: "Sun in the tenth house is a very strong placement for career peak and public leadership.",
        11: "Sun in the eleventh house indicates fulfillment of desires through powerful social networks.",
        12: "Sun in the twelfth house suggests spiritual path potential and internal contemplation.",
    },
    "Moon": {
        1: "Moon in the first house makes for a sensitive, intuitive, and empathetic personality.",
        2: "Moon in the second house indicates emotional security found in family and financial stability.",
        3: "Moon in the third house suggests an active mind and close emotional bond with siblings.",
        4: "Moon in the fourth house emphasizes deep inner peace and maternal connection.",
        5: "Moon in the fifth house highlights creative intelligence and emotional investment in children.",
        6: "Moon in the sixth house suggests emotional involvement in service and health routines.",
        7: "Moon in the seventh house indicates an emotional, nurturing relationship partner.",
        8: "Moon in the eighth house suggests deep intuition and psychic sensitivity.",
        9: "Moon in the ninth house points toward philosophical depth and spiritual journeys.",
        10: "Moon in the tenth house brings nurturing professional image and public-facing success.",
        11: "Moon in the eleventh house indicates emotional fulfillment through social circles.",
        12: "Moon in the twelfth house suggests vivid dreams and emotional maturity through solitude.",
    },
    "Mars": {
        1: "Mars in the first house brings high energy, competitive spirit, and a pioneering approach.",
        2: "Mars in the second house suggests dynamic wealth generation with caution on impulsive spending.",
        3: "Mars in the third house emphasizes extreme courage and an assertive communication style.",
        4: "Mars in the fourth house indicates a protective, energetic domestic environment.",
        5: "Mars in the fifth house highlights passionate creativity and logic-driven intelligence.",
        6: "Mars in the sixth house provides strength to defeat competitors and high-energy work approach.",
        7: "Mars in the seventh house brings an energetic, assertive partner requiring collaborative balance.",
        8: "Mars in the eighth house suggests intense resilience and interest in investigative research.",
        9: "Mars in the ninth house points toward independent spiritual views and higher knowledge.",
        10: "Mars in the tenth house is powerful for professional authority and career victory.",
        11: "Mars in the eleventh house indicates success through active participation in large groups.",
        12: "Mars in the twelfth house suggests high energy used for humanitarian or spiritual work.",
    },
    "Mercury": {
        1: "Mercury in the first house indicates a quick wit, intellectual curiosity, and expressive personality.",
        2: "Mercury in the second house suggests skill in commerce and an eloquent manner of speaking.",
        3: "Mercury in the third house emphasizes excellence in writing and constant learning.",
        4: "Mercury in the fourth house brings an intellectual domestic atmosphere.",
        5: "Mercury in the fifth house highlights strategic intelligence and speculative skill.",
        6: "Mercury in the sixth house indicates talent in detailed work and analytical health approaches.",
        7: "Mercury in the seventh house suggests intellectual partnership and skill in negotiation.",
        8: "Mercury in the eighth house points toward research skills and investigative intelligence.",
        9: "Mercury in the ninth house emphasizes higher learning and success in publishing or teaching.",
        10: "Mercury in the tenth house indicates professional reputation based on intellect and communication.",
        11: "Mercury in the eleventh house brings diverse intellectual social networks.",
        12: "Mercury in the twelfth house suggests a highly imaginative mind and interest in mysticism.",
    },
    "Jupiter": {
        1: "Jupiter in the first house brings wisdom, optimism, and a personality that attracts natural luck.",
        2: "Jupiter in the second house suggests abundance and financial growth through ethical means.",
        3: "Jupiter in the third house emphasizes wise communication and success in media.",
        4: "Jupiter in the fourth house indicates peaceful home life and spiritual happiness.",
        5: "Jupiter in the fifth house highlights exceptional intelligence and virtuous children.",
        6: "Jupiter in the sixth house provides protection from enemies and balanced daily service.",
        7: "Jupiter in the seventh house brings a wise, supportive partner and success in legal partnerships.",
        8: "Jupiter in the eighth house suggests longevity, inheritance gains, and spiritual insights.",
        9: "Jupiter in the ninth house is supreme for wisdom, higher knowledge, and divine grace.",
        10: "Jupiter in the tenth house indicates a respected career and leadership based on wisdom.",
        11: "Jupiter in the eleventh house brings influential mentors and financial expansion.",
        12: "Jupiter in the twelfth house suggests spiritual liberation and success in foreign lands.",
    },
    "Venus": {
        1: "Venus in the first house indicates charm, beauty, and a refined, harmonious personality.",
        2: "Venus in the second house suggests artistic wealth and finding value in luxury and family.",
        3: "Venus in the third house emphasizes artistic hobbies and pleasant journeys with siblings.",
        4: "Venus in the fourth house indicates a beautiful home and deep emotional contentment.",
        5: "Venus in the fifth house highlights creative genius, romantic inclinations, and joy through children.",
        6: "Venus in the sixth house suggests maintaining harmony in the workplace.",
        7: "Venus in the seventh house brings a charming, artistic partner and highlights beauty in love.",
        8: "Venus in the eighth house suggests deep transformative relationships and financial gains through partners.",
        9: "Venus in the ninth house points toward love for travel and refined philosophical views.",
        10: "Venus in the tenth house indicates a career in arts, fashion, or diplomacy.",
        11: "Venus in the eleventh house brings gains through artistic social circles.",
        12: "Venus in the twelfth house suggests refined inner world and spiritual artistic expression.",
    },
    "Saturn": {
        1: "Saturn in the first house indicates a serious, disciplined personality with a mature life view.",
        2: "Saturn in the second house suggests cautious, slow wealth-building through hard work.",
        3: "Saturn in the third house emphasizes perseverance in skills and long-term efforts.",
        4: "Saturn in the fourth house indicates a structured domestic life and stability through heritage.",
        5: "Saturn in the fifth house highlights disciplined creativity and responsibility toward progeny.",
        6: "Saturn in the sixth house provides discipline for tedious work and victory over rivals.",
        7: "Saturn in the seventh house brings a mature, stable partner and emphasizes commitment.",
        8: "Saturn in the eighth house suggests longevity and mastery of complex occult subjects.",
        9: "Saturn in the ninth house points toward traditional spirituality and disciplined learning.",
        10: "Saturn in the tenth house indicates status achieved through hard work and endurance.",
        11: "Saturn in the eleventh house indicates steady, long-term gains and a loyal mature social circle.",
        12: "Saturn in the twelfth house suggests disciplined spiritual seeking and foreign success.",
    },
    "Rahu": {
        1: "Rahu in the first house brings an unconventional, adventurous personality with a drive for achievement.",
        2: "Rahu in the second house suggests intense focus on wealth acquisition and family innovation.",
        3: "Rahu in the third house emphasizes revolutionary communication and courageous risk-taking.",
        4: "Rahu in the fourth house indicates a unique home environment and non-traditional emotional security.",
        5: "Rahu in the fifth house highlights innovative creativity and unconventional educational paths.",
        6: "Rahu in the sixth house provides an unconventional approach to defeating rivals.",
        7: "Rahu in the seventh house suggests an unconventional or foreign partner.",
        8: "Rahu in the eighth house suggests deep interest in mysteries and research.",
        9: "Rahu in the ninth house points toward foreign wisdom and non-traditional spirituality.",
        10: "Rahu in the tenth house indicates a drive for massive worldly status via innovative paths.",
        11: "Rahu in the eleventh house brings diverse social connections and unconventional desire fulfillment.",
        12: "Rahu in the twelfth house suggests vivid imagination and unique spiritual experiences.",
    },
    "Ketu": {
        1: "Ketu in the first house brings a detached, spiritual personality disconnected from ego.",
        2: "Ketu in the second house suggests a detached approach to wealth valuing spirituality.",
        3: "Ketu in the third house emphasizes intuitive communication and spiritual bond with siblings.",
        4: "Ketu in the fourth house indicates an internal search for emotional peace.",
        5: "Ketu in the fifth house highlights deep intuitive intelligence and spiritual creative insights.",
        6: "Ketu in the sixth house provides success over enemies through spiritual detachment.",
        7: "Ketu in the seventh house suggests a spiritually-leaning partner.",
        8: "Ketu in the eighth house suggests profound spiritual transformations and hidden truths.",
        9: "Ketu in the ninth house is high for spiritual liberation (moksha) and deep wisdom.",
        10: "Ketu in the tenth house indicates a subtle professional reputation without worldly attachment.",
        11: "Ketu in the eleventh house brings detachment from social ambitions through selfless altruism.",
        12: "Ketu in the twelfth house is classic for spiritual liberation and freedom from karmic bonds.",
    },
}


def planet_interpretation(planet: str, house: int) -> str:
    """Backward-compatible simple one-liner interpretation."""
    return PLANET_HOUSE_TEXT.get(planet, {}).get(house, "")
