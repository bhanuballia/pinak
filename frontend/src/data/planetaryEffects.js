// frontend/src/data/planetaryEffects.js

// This file contains the effects and remedies for all 9 Vedic planets
// categorized by their functional nature (Benefic, Malefic, Neutral) for a given chart.

export const PLANETARY_EFFECTS = {
  Sun: {
    hindiName: "सूर्य (Sun)",
    benefic: {
      effect: "The Sun is benefic when placed in its own sign (Leo), exalted in Aries, or positioned in powerful houses like the 1st, 5th, 9th, 10th, or 11th. Bestows leadership qualities, high self-esteem, professional success (especially in government or politics), and a strong physical constitution. It brings respect from elders and favors from higher authorities.",
      remedies: [
        "Sun Salutations: Perform Surya Namaskar daily at sunrise to align your physical energy with solar power.",
        "Aditya Hridayam: Recite the Aditya Hridayam Stotra for divine protection and mental clarity.",
        "Discipline: Maintain a strict daily routine and show unwavering respect to your father and mentors."
      ]
    },
    malefic: {
      effect: "The Sun becomes malefic when debilitated in Libra, afflicted by Rahu, Ketu, or Saturn, or placed in difficult houses like the 6th, 7th, or 8th. Leads to extreme arrogance, ego clashes, loss of reputation, and conflicts with the government or father. Physically, it can cause eye issues, heart trouble, weak bones, and low vitality.",
      remedies: [
        "Surya Arghya: Offer water mixed with red flowers or kumkum to the rising sun from a copper vessel.",
        "Donations: Donate red items (red cloth, lentils/masoor dal, copper, or wheat) on Sundays.",
        "Sunday Fasting: Observe a fast on Sundays, consuming only one meal without salt.",
        "Charity: Feed wheat and jaggery to a brown cow or monkeys."
      ]
    },
    neutral: {
      effect: "The Sun acts as a neutral influence when it rules houses that balance its power (like the 12th house for a Leo ascendant) or when its positive and negative aspects are equally weighted. Results are inconsistent; you may achieve success but face high stress, or have authority but struggle with internal insecurities.",
      remedies: [
        "Gayatri Mantra: Chant the Gayatri Mantra daily to purify the intellect and stabilize the ego.",
        "Copper Use: Wear a copper ring on your ring finger or use copper utensils to drink water.",
        "Moral Integrity: Focus on honesty and keeping promises, as the Sun thrives on truth."
      ]
    }
  },
  Moon: {
    hindiName: "चंद्र (Moon)",
    benefic: {
      effect: "The Moon is a natural benefic when it is waxing (Shukla Paksha) or near its full phase. Promotes mental peace, kindness, strong intuition, and emotional stability. It often leads to popularity and success in nurturing or creative professions.",
      remedies: [
        "Silver: Drink water from a silver glass to retain its cooling, positive energy.",
        "Mother's Blessings: Regularly touch the feet of your mother or mother-like figures to sustain its lunar grace.",
        "Meditation: Practice daily meditation to keep the 'Mind Karaka' aligned and calm."
      ]
    },
    malefic: {
      effect: "The Moon becomes malefic when it is waning (Krishna Paksha), near the New Moon phase, or afflicted. Causes depression, severe anxiety, mood swings, and insomnia. It can lead to strained relationships with the mother and fickle-mindedness.",
      remedies: [
        "Lord Shiva Worship: Perform Abhishek (ritual bathing) of a Shivalinga with milk and water on Mondays.",
        "Fasting: Observe a fast on Mondays (Somvar Vrat), consuming only white foods like milk or rice kheer after sunset.",
        "Mantra: Chant the Chandra Beej Mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah' 108 times daily.",
        "Donations: Donate white items such as rice, sugar, white clothes, or silver to the needy on Mondays."
      ]
    },
    neutral: {
      effect: "The Moon acts as a 'Functional Neutral' when it rules neutral houses. The impact is mixed, often fluctuating based on the current transit and the Moon's Paksha Bala (digital strength).",
      remedies: [
        "Moonlight Exposure: Spend time walking under the moonlight, especially on Full Moon nights (Purnima), to naturally balance lunar energies.",
        "Hydration: Keep yourself well-hydrated and avoid wasting water, as the Moon governs all bodily and worldly fluids.",
        "Gemstones: Wear a natural Pearl (Moti) set in silver on the little finger (after consulting an astrologer)."
      ]
    }
  },
  Mars: {
    hindiName: "मंगल (Mars)",
    benefic: {
      effect: "Mars is considered benefic when it is exalted in Capricorn, in its own signs (Aries or Scorpio), or serves as a Yoga Karaka (specifically for Cancer and Leo ascendants). Bestows leadership, immense physical strength, bravery, and success in technical fields like engineering or surgery. It provides the drive to overcome obstacles and gain property or wealth.",
      remedies: [
        "Gemstones: Wear a Red Coral (Moonga) in gold or copper on the ring finger after consulting an expert.",
        "Physical Activity: Engage in regular sports or martial arts to channel its energy constructively.",
        "Sibling Harmony: Maintain good relations with younger brothers, whom Mars represents."
      ]
    },
    malefic: {
      effect: "Mars becomes malefic when debilitated in Cancer (unless cancelled), afflicted by Rahu/Saturn, or placed in houses forming Manglik Dosha (1st, 4th, 7th, 8th, or 12th). Leads to extreme aggression, frequent accidents, blood-related disorders, and high-conflict relationships. It can cause impulsive financial losses or property disputes.",
      remedies: [
        "Lord Hanuman Worship: Recite the Hanuman Chalisa daily or visit a temple on Tuesdays.",
        "Donations: Donate red lentils (Masoor Dal), red cloth, or jaggery on Tuesdays.",
        "Blood Donation: Considered one of the best ways to 'bleed off' malefic Mars energy.",
        "Fasting: Observe a fast on Tuesdays and eat salt-free food once a day."
      ]
    },
    neutral: {
      effect: "Mars acts neutrally when its natural cruelty is balanced by the house it rules or when its strength (Shadbala) is average. Energy levels may fluctuate; you might have the ambition but lack the consistent discipline to follow through.",
      remedies: [
        "Chanting: Recite the Mars Beej Mantra: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah' 108 times on Tuesdays.",
        "Dietary Habits: Consume honey first thing in the morning to stabilize your internal fire.",
        "Meditation: Practice mindfulness to manage sudden bursts of temper or impatience."
      ]
    }
  },
  Mercury: {
    hindiName: "बुध (Mercury)",
    benefic: {
      effect: "Mercury is benefic when it is exalted in Virgo, in its own sign (Gemini), or when it is associated with other natural benefics like Jupiter or a strong Moon. Sharp intellect, excellent communication skills, a good sense of humor, and success in business or mathematics. It makes a person youthful, adaptable, and clever.",
      remedies: [
        "Keep indoor plants or spend time in nature.",
        "Regularly read books or learn new skills.",
        "Practice speaking the truth politely to strengthen your power of speech."
      ]
    },
    malefic: {
      effect: "Mercury becomes malefic if it is associated with natural malefics (like Rahu, Ketu, or Saturn) or if it is debilitated in Pisces. Struggles with speech (stuttering or harsh words), poor decision-making, nervous system issues, and skin allergies. In business, it can lead to misunderstandings or legal trouble due to paperwork.",
      remedies: [
        "Worship Lord Ganesha. Recite 'Om Gan Ganapataye Namah' or offer Durva grass on Wednesdays.",
        "Donate green moong dal, green clothes, or green bangles to women or the needy on Wednesdays.",
        "Feed green fodder or grass to a cow on Wednesday mornings.",
        "Support the education of a girl child or orphans."
      ]
    },
    neutral: {
      effect: "Mercury is inherently a neutral planet. If it is alone in a house without any aspects from other planets, it acts as a neutral influence. The results are strictly based on the house it occupies. For example, in the 10th house, it gives a career in communication; in the 2nd house, it affects wealth based on your speech.",
      remedies: [
        "Recite or listen to the Vishnu Sahasranama.",
        "Worship and water a Tulsi plant daily. Consuming a leaf (without chewing, as it contains mercury/metal) can also help.",
        "Wear light green shades on Wednesdays to keep the mental energy balanced."
      ]
    }
  },
  Jupiter: {
    hindiName: "गुरु (Jupiter)",
    benefic: {
      effect: "Jupiter is benefic when exalted in Cancer, in its own signs (Sagittarius or Pisces), or placed in the 1st, 5th, or 9th houses. Brings great wisdom, financial abundance, and a happy family life. It acts as a protective shield (Amrit Drishti) over the houses it aspects. You may be naturally inclined toward teaching, law, or counseling.",
      remedies: [
        "Education: Share knowledge freely or sponsor a student's education.",
        "Respect Elders: Regularly seek the blessings of your father, grandfather, and teachers.",
        "Gold/Yellow: Wear a gold chain or keep a yellow handkerchief to vibrate with Guru's energy."
      ]
    },
    malefic: {
      effect: "Jupiter rarely causes 'harm' in the way Saturn does, but it becomes functionally malefic if it rules difficult houses (like for Taurus or Libra ascendants), is debilitated in Capricorn, or is afflicted by Rahu (Guru Chandal Dosha). Can lead to over-optimism (leading to debt), liver/digestive issues, weight gain, and 'false ego' regarding one's knowledge. It may cause delays in marriage or child-related worries.",
      remedies: [
        "Worship Lord Vishnu: Recite the Vishnu Sahasranama or worship a Banana tree on Thursdays.",
        "Donations: Donate yellow items like Chana Dal (split chickpeas), turmeric, honey, or yellow clothes on Thursdays.",
        "Fasting: Observe a fast on Thursdays, consuming only one meal (without salt and ideally yellow in color).",
        "Chanting: Chant the Guru Beej Mantra: 'Om Graam Greem Graum Sah Gurave Namah' 108 times."
      ]
    },
    neutral: {
      effect: "Jupiter is considered neutral toward planets like Mercury and Venus. It acts neutrally when its expansive energy is restricted by house placement (like the 6th or 8th) without being heavily afflicted. Success comes but only after significant effort. You may have the knowledge but struggle to apply it practically or gain recognition for it.",
      remedies: [
        "Saffron (Kesar): Apply a small tilak of saffron or turmeric on your forehead daily after bathing.",
        "Service: Offer selfless service at a temple or a place of worship.",
        "Meditation: Practice 'Gyan Mudra' while meditating to stabilize the intellect."
      ]
    }
  },
  Venus: {
    hindiName: "शुक्र (Venus)",
    benefic: {
      effect: "Venus is a natural benefic and shines brightest when exalted in Pisces, in its own signs (Taurus or Libra), or in the 2nd, 4th, 7th, or 12th houses. Brings a charming personality, artistic talent, a happy marriage, and material comforts like cars and jewelry. It grants a 'magnetic' aura and success in fashion, media, or hospitality.",
      remedies: [
        "Self-Care: Maintain high standards of hygiene and use pleasant fragrances or perfumes daily.",
        "Respect Women: Venus thrives where women are respected; treat your partner and female colleagues with kindness.",
        "Creative Pursuits: Engage in any form of art, music, or dance to keep the Venusian energy flowing."
      ]
    },
    malefic: {
      effect: "Venus can become malefic if debilitated in Virgo, combust (too close to the Sun), or heavily afflicted by Rahu or Mars. Can lead to 'character' issues, scandals, skin diseases, or reproductive health problems. It often causes excessive indulgence in pleasures, leading to financial instability or broken relationships.",
      remedies: [
        "Goddess Lakshmi Worship: Recite the Sri Suktam or Laxmi Chalisa on Fridays.",
        "Donations: Donate white items like milk, curd, camphor, white silk, or silver on Fridays.",
        "Friday Fasting: Avoid sour foods and salt on Fridays; eat white foods like rice kheer (milk pudding).",
        "Mantra: Chant the Shukra Beej Mantra: 'Om Draam Dreem Droum Sah Shukraya Namah' 108 times."
      ]
    },
    neutral: {
      effect: "Venus is neutral toward Jupiter and considers the Sun and Moon as enemies, while it is friendly with Mercury and Saturn. It acts neutrally when its house lordship balances its natural auspiciousness. You may have a comfortable life but lack true satisfaction in relationships, or you might have artistic talent but struggle to monetize it.",
      remedies: [
        "White Clothes: Try to wear white or cream-colored clothes on Fridays.",
        "Diamond/Opal: Wearing a Diamond or a high-quality Opal can balance Venus, but only if it is a functional benefic for your ascendant.",
        "Cleanliness: Keep your bedroom particularly clean and clutter-free, as Venus governs the 12th house (sleep and intimacy)."
      ]
    }
  },
  Saturn: {
    hindiName: "शनि (Saturn)",
    benefic: {
      effect: "Saturn becomes a functional benefic when it is exalted in Libra, in its own signs (Capricorn or Aquarius), or when it acts as a Yoga Karaka (specifically for Taurus and Libra ascendants). Grants immense patience, organizational skills, long life, and administrative success. It leads to stable wealth, property ownership, and a reputation for being just and reliable.",
      remedies: [
        "Hard Work: Saturn loves persistence; stay committed to your long-term goals without looking for shortcuts.",
        "Help the Underprivileged: Provide food or old clothes to laborers, sweepers, or the elderly.",
        "Honesty: Practice extreme integrity in your professional life."
      ]
    },
    malefic: {
      effect: "Saturn is malefic when debilitated in Aries, placed in the 1st, 4th, or 8th houses (for certain signs), or during difficult phases like Sade Sati or Dhaiya if not well-placed. Causes delays in every aspect of life, chronic health issues (bones, teeth, or joints), poverty, and mental gloom. It can lead to isolation, legal battles, and extreme fatigue.",
      remedies: [
        "Lord Shani/Hanuman Worship: Visit a Shani temple on Saturdays or recite the Hanuman Chalisa to reduce Saturn's sting.",
        "Lighting a Lamp: Light a mustard oil (Sarson ka tel) lamp under a Peepal tree on Saturday evenings.",
        "Donations: Donate black sesame seeds (Til), iron items, black umbrellas, or mustard oil on Saturdays.",
        "Mantra: Chant the Shani Beej Mantra: 'Om Praam Preem Proum Sah Shanaye Namah' 108 times daily."
      ]
    },
    neutral: {
      effect: "Saturn acts neutrally when its restrictive energy is balanced by a strong Jupiter aspect or when it occupies houses where it is neither exceptionally strong nor weak. Life feels like a series of 'slow but steady' gains. Progress isn't denied, but it is always earned through significant effort.",
      remedies: [
        "Blue/Black Clothes: Wear dark blue or black on Saturdays to align with its frequency.",
        "Avoid Laziness: Saturn punishes lethargy; keeping an active, disciplined routine prevents its neutral energy from turning negative.",
        "Bird Feeding: Feed black crows or stray dogs on Saturdays."
      ]
    }
  },
  Rahu: {
    hindiName: "राहु (Rahu)",
    benefic: {
      effect: "Rahu is considered beneficial when exalted in Taurus or Gemini, or placed in 'Upachaya' houses (3rd, 6th, 10th, and 11th), where it provides growth over time. It can bring sudden fame, political success, and wealth. It fosters sharp intelligence, innovative thinking, and success in technology or foreign trade.",
      remedies: [
        "Wear silver or keep a silver elephant at home.",
        "Visit holy places or perform 'Kanyadaan'.",
        "Maintain strong relationships with brothers and in-laws."
      ]
    },
    malefic: {
      effect: "Rahu becomes malefic when debilitated in Scorpio or Sagittarius, or placed in unfavorable houses like the 8th or 9th. It is also harmful when it creates 'Guru-Chandal Yoga' with Jupiter. It causes confusion, mental unrest, financial losses, and legal troubles. It may lead to addictions, dishonest habits, or skin and intestinal disorders.",
      remedies: [
        "Worship Goddess Durga or Lord Shiva (perform Abhishek with milk).",
        "Donate black sesame seeds, mustard oil, blue flowers, or blankets on Saturdays.",
        "Feed stray dogs (especially black dogs) and crows regularly.",
        "Offer coconuts or 400 grams of coriander into flowing water on Wednesdays or Saturdays."
      ]
    },
    neutral: {
      effect: "Rahu is naturally neutral toward Jupiter and the Moon, but its effect is largely determined by its dispositor (the planet ruling the sign Rahu is in). Results are unpredictable and fluctuate between periods of high ambition and deep dissatisfaction. It often pushes the native toward unconventional paths that may or may not succeed.",
      remedies: [
        "Keep houses clutter-free, especially the main entrance and bedroom.",
        "Avoid alcohol and non-vegetarian food.",
        "Chant the Rahu Beej Mantra: 'Om Bhram Bhreem Bhroum Sah Rahave Namah' 108 times daily."
      ]
    }
  },
  Ketu: {
    hindiName: "केतु (Ketu)",
    benefic: {
      effect: "Ketu is considered beneficial when exalted in Scorpio or Sagittarius, or when placed in the 12th house (the house of liberation). Grants deep spiritual insights, strong intuition, and a lack of attachment to worldly stresses. It can make a person a great researcher, occultist, or healer. It provides 'hidden wealth' and protection from enemies.",
      remedies: [
        "Spirituality: Engage in deep meditation or yoga to channel Ketu's quiet power.",
        "Flag Offering: Offer a triangular yellow or saffron flag to a temple to symbolise victory and spiritual height.",
        "Guidance: Listen to your 'gut feeling' or intuition, as a benefic Ketu speaks through your inner voice."
      ]
    },
    malefic: {
      effect: "Ketu is considered malefic when debilitated in Taurus or Gemini, or when it sits with the Moon or Sun (Grahan Yoga), causing mental confusion or a lack of self-identity. A malefic Ketu can lead to feelings of being 'lost' or disconnected from reality. It can cause mysterious health issues, sudden accidents, skin allergies, and social isolation. It often brings a 'rejection' mindset toward life's responsibilities.",
      remedies: [
        "Lord Ganesha Worship: Ganesha is the presiding deity of Ketu. Recite the Ganesha Atharvashirsha or offer Durva grass to him on Wednesdays.",
        "Dog Service: Feed stray dogs (multi-colored or black and white) with sweet bread or biscuits.",
        "Donations: Donate blankets, umbrellas, or black-and-white checkered clothes to the homeless on Thursdays or Saturdays.",
        "Flowing Water: Drop sesame seeds (Til) or a piece of coal into flowing water (like a river) on a Tuesday."
      ]
    },
    neutral: {
      effect: "Ketu is inherently neutral toward the Sun, Moon, and Mars, but its behavior is almost entirely dictated by the planet ruling the sign it occupies (its Dispositor). It creates a 'void' in the house it sits in. You might feel disinterested in that area of life (e.g., in the 7th house, a lack of interest in marriage) without it being necessarily 'bad'.",
      remedies: [
        "Mantra: Chant the Ketu Beej Mantra: 'Om Sraam Sreem Sroum Sah Ketave Namah' 108 times daily.",
        "Temple Visit: Regularly visit a temple or a place of silence to ground your energy.",
        "Saffron (Kesar): Apply a tilak of saffron or turmeric on your forehead and navel to stabilize the 'wandering' energy of Ketu."
      ]
    }
  }
};
