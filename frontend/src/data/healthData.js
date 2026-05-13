
export const HEALTH_HOUSE_INTERPRETATIONS = {
    1: {
        title: "1st House: Overall Vitality & Constitution",
        description: "The 1st house (Lagna) represents your physical body, self-healing capacity, and general immunity. A strong 1st house ensures a robust constitution.",
        placements: {
            Sun: {
                intro: "Sun in the 1st house gives strong vitality, high energy, and a charismatic presence. It indicates a person with great self-healing power.",
                effects: {
                    "Strong Immunity": "Highly resistant to common infections.",
                    "Heat Sensitivity": "Prone to headaches or heat-related issues.",
                    "Vision": "Good eyesight but may need protection from glare.",
                    "Posture": "Strong bones and upright posture."
                },
                remedies: [
                    "Perform Surya Namaskar daily",
                    "Avoid excessive salt",
                    "Spend time in the morning sun",
                    "Stay hydrated"
                ]
            },
            Moon: {
                intro: "Moon in the 1st house indicates a sensitive constitution. Health is often influenced by emotional well-being and cycles.",
                effects: {
                    "Fluid Balance": "Prone to water retention or cold/cough.",
                    "Emotional Impact": "Stress directly affects physical health.",
                    "Soft Constitution": "A youthful but delicate physical frame.",
                    "Digestion": "Sensitive stomach, needs regular eating habits."
                },
                remedies: [
                    "Stay emotionally balanced",
                    "Avoid cold food at night",
                    "Drink enough water",
                    "Practice moon meditation"
                ]
            },
            Mars: {
                intro: "Mars in the 1st house gives athletic energy but can lead to injuries, inflammation, or rashes.",
                effects: {
                    "High Energy": "Quick recovery and muscular strength.",
                    "Inflammation": "Prone to fevers or skin eruptions.",
                    "Risk of Injury": "Prone to cuts, burns, or accidents.",
                    "Blood Pressure": "Need to manage stress and blood circulation."
                },
                remedies: [
                    "Engage in physical exercise",
                    "Stay calm and avoid aggression",
                    "Avoid very spicy food",
                    "Donate blood periodically"
                ]
            }
        }
    },
    6: {
        title: "6th House: Diseases & Healing",
        description: "The 6th house is the primary house for diseases (Roga). It shows the types of ailments you might face and your ability to fight them. Malefics here (Mars, Saturn, Rahu) are actually considered good as they fight disease effectively.",
        placements: {
            Sun: {
                emoji: "☀️",
                intro: "Strong immunity but prone to burnout. Body fights back quickly against ailments.",
                effects: {
                    "Disease Types": "Heart issues, blood pressure, Eye problems, fatigue",
                    "When Strong": "Defeats diseases easily through willpower.",
                    "When Weak": "Chronic fatigue, vitality issues.",
                    "Lifestyle Plan": "Fixed routine, Avoid overwork & ego stress"
                },
                remedies: [
                    "Morning sunlight & Surya Namaskar",
                    "Offer water to the Sun daily",
                    "Donate wheat/jaggery"
                ]
            },
            Moon: {
                emoji: "🌙",
                intro: "Emotional health strongly affects body. Stress directly affects physical health.",
                effects: {
                    "Disease Types": "Anxiety, depression, Water retention, digestion issues",
                    "When Strong": "Recovers quickly from ailments.",
                    "When Weak": "Stress-related illness and mood swings.",
                    "Lifestyle Plan": "Emotional balance, Proper sleep cycle"
                },
                remedies: [
                    "Practice regular meditation",
                    "Avoid cold food at night",
                    "Donate milk or rice"
                ]
            },
            Mars: {
                emoji: "♂️",
                rating: "⭐",
                intro: "Strong fighter against disease. Quick recovery and muscular strength.",
                effects: {
                    "Disease Types": "Injuries, surgery, Blood disorders, inflammation",
                    "When Strong": "Defeats illness quickly; high energy.",
                    "When Weak": "Accidents, aggressive health issues.",
                    "Lifestyle Plan": "Regular exercise, Avoid risky behavior"
                },
                remedies: [
                    "Control anger and aggression",
                    "Donate red lentils",
                    "Avoid very spicy food"
                ]
            },
            Mercury: {
                emoji: "☿",
                intro: "Stress leads to physical illness. Health is tied to the nervous system.",
                effects: {
                    "Disease Types": "Nervous system issues, Skin problems, allergies",
                    "When Strong": "Quick healing and mental agility.",
                    "When Weak": "Anxiety-related disease and overthinking.",
                    "Lifestyle Plan": "Reduce screen stress, Balanced diet"
                },
                remedies: [
                    "Mental relaxation exercises",
                    "Donate green items or clothes",
                    "Practice deep breathing"
                ]
            },
            Jupiter: {
                emoji: "♃",
                intro: "Can increase disease if overindulgent. Protects from major illness but prone to lifestyle issues.",
                effects: {
                    "Disease Types": "Obesity, diabetes, Liver issues",
                    "When Strong": "Broad protection from major ailments.",
                    "When Weak": "Tendency toward lifestyle-related diseases.",
                    "Lifestyle Plan": "Balanced eating, Avoid overeating"
                },
                remedies: [
                    "Strictly control diet and sugar",
                    "Donate yellow items or lentils",
                    "Practice yoga and pranayama"
                ]
            },
            Venus: {
                emoji: "♀️",
                intro: "Sensitive to lifestyle habits and emotional balance. Good recovery if habits are clean.",
                effects: {
                    "Disease Types": "Hormonal imbalance, Reproductive issues, Sugar-related problems",
                    "When Strong": "Good recovery and youthful vitality.",
                    "When Weak": "Indulgence leads to specific diseases.",
                    "Lifestyle Plan": "Healthy diet, Control sugar intake"
                },
                remedies: [
                    "Avoid excess luxury and indulgence",
                    "Donate white items or clothes",
                    "Maintain high physical hygiene"
                ]
            },
            Saturn: {
                emoji: "♄",
                rating: "⭐",
                intro: "Slow disease but long-lasting. Excellent for long-term endurance.",
                effects: {
                    "Disease Types": "Chronic illness, Arthritis, bones, joints",
                    "When Strong": "Defeats disease slowly but surely; stable life.",
                    "When Weak": "Chronic long-term issues and bone pain.",
                    "Lifestyle Plan": "Regular routine, Long-term consistency"
                },
                remedies: [
                    "Maintain strict discipline",
                    "Donate black sesame or mustard oil",
                    "Massage joints with oil regularly"
                ]
            },
            Rahu: {
                emoji: "☊",
                rating: "⭐",
                intro: "Strong immunity but unusual health patterns. Hard to diagnose ailments.",
                effects: {
                    "Disease Types": "Unknown diseases, Allergies, toxins",
                    "When Strong": "Defeats enemies and most diseases.",
                    "When Weak": "Mysterious or sudden illnesses.",
                    "Lifestyle Plan": "Clean diet, Avoid chemicals/toxins"
                },
                remedies: [
                    "Maintain a detox lifestyle",
                    "Avoid addictions and intoxicants",
                    "Keep a high hygiene standard"
                ]
            },
            Ketu: {
                emoji: "☋",
                rating: "⭐",
                intro: "Strong spiritual healing capacity. Sudden health issues may arise.",
                effects: {
                    "Disease Types": "Hidden or sudden illness, Nerve-related issues",
                    "When Strong": "Immunity is naturally resilient.",
                    "When Weak": "Sudden health issues without clear cause.",
                    "Lifestyle Plan": "Grounding practices, Regular health checkups"
                },
                remedies: [
                    "Regular meditation and introspection",
                    "Worship Lord Ganesha",
                    "Use herbal or natural remedies"
                ]
            }
        }
    },
    8: {
        title: "8th House: Longevity & Chronic Health",
        description: "The 8th house represents longevity (Ayus) and deep-seated or chronic health transformations.",
        placements: {
            Jupiter: {
                intro: "Jupiter here generally protects longevity and helps in deep healing.",
                effects: {
                    "Deep Healing": "Ability to recover from serious conditions.",
                    "Metabolism": "Need to monitor weight and liver health.",
                    "Longevity": "Supports a healthy and long lifespan.",
                    "Growth": "Tendency toward expansion in health matters."
                },
                remedies: [
                    "Avoid excessive sweets/fats",
                    "Practice yoga and pranayama",
                    "Respect teachers",
                    "Donate yellow lentils"
                ]
            }
        }
    }
};

export const HEALTH_CONJUNCTIONS = [
    {
        planets: ["Sun", "Saturn"],
        rating: "⚠️",
        effects: "Chronic fatigue + pressure. Risk: heart + bone issues",
        lifestyle: "Strict routine + stress control"
    },
    {
        planets: ["Sun", "Mars"],
        rating: "⚠️",
        effects: "High BP, inflammation, accidents",
        lifestyle: "Avoid aggression"
    },
    {
        planets: ["Moon", "Saturn"],
        rating: "⚠️",
        effects: "Depression, anxiety, emotional suppression",
        lifestyle: "Mental health focus"
    },
    {
        planets: ["Moon", "Rahu"],
        rating: "⚠️",
        effects: "Panic attacks, mental instability",
        lifestyle: "Detox + meditation"
    },
    {
        planets: ["Mars", "Saturn"],
        rating: "⚠️",
        effects: "Injuries + chronic pain",
        lifestyle: "Avoid overexertion"
    },
    {
        planets: ["Mars", "Rahu"],
        rating: "⚠️",
        effects: "Accidents, surgeries, sudden illness",
        lifestyle: "Extreme caution"
    },
    {
        planets: ["Mercury", "Rahu"],
        rating: "⚠️",
        effects: "Anxiety, nervous breakdown, skin issues",
        lifestyle: "Reduce digital stress"
    },
    {
        planets: ["Jupiter", "Venus"],
        rating: "⚠️",
        effects: "Obesity, diabetes, hormonal imbalance",
        lifestyle: "Strict diet control"
    },
    {
        planets: ["Saturn", "Rahu"],
        rating: "⚠️",
        effects: "Chronic + mysterious disease",
        lifestyle: "Disciplined + detox"
    },
    {
        planets: ["Venus", "Rahu"],
        rating: "⚠️",
        effects: "Addiction, reproductive issues",
        lifestyle: "Control indulgence"
    }
];

export const HEALTH_INSIGHTS = {
    sixth_house_rule: "6th house is special: Malefics (Mars, Saturn, Rahu) → GOOD (fight disease). Benefics (Venus, Jupiter) → can increase lifestyle diseases if uncontrolled."
};

export const HEALTH_TIPS = [
    {
        category: "Diet",
        tip: "Eat according to your Dosha (Vata, Pitta, Kapha) and prioritize seasonal, fresh produce.",
        icon: "🥗"
    },
    {
        category: "Routine",
        tip: "Follow Dinacharya (Daily Routine) starting with early rising and morning hydration.",
        icon: "⏰"
    },
    {
        category: "Mental",
        tip: "Practice daily meditation to reduce stress, as mind and body are deeply connected.",
        icon: "🧘"
    }
];

export const DOSHA_TYPES = {
    Vata: {
        description: "Air & Space element. Governs movement, nervous system, and circulation.",
        signs: ["Aries", "Gemini", "Libra", "Aquarius"],
        imbalance: "Anxiety, insomnia, joint pain, dry skin.",
        remedy: "Warm, cooked food, routine, and grounding."
    },
    Pitta: {
        description: "Fire & Water element. Governs metabolism, digestion, and body temperature.",
        signs: ["Leo", "Sagittarius", "Scorpio"],
        imbalance: "Inflammation, acidity, anger, skin rashes.",
        remedy: "Cooling foods, meditation, and avoiding heat."
    },
    Kapha: {
        description: "Earth & Water element. Governs structure, stability, and immunity.",
        signs: ["Taurus", "Cancer", "Virgo", "Capricorn", "Pisces"],
        imbalance: "Weight gain, lethargy, congestion, attachment.",
        remedy: "Active exercise, light food, and warmth."
    }
};
