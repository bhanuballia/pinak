// frontend/src/data/bphsHouseEffects.js

export const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

export const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const MALEFIC_PLANETS = ["Saturn", "Mars", "Rahu", "Ketu", "Sun"];
export const BENEFIC_PLANETS = ["Jupiter", "Venus", "Mercury", "Moon"];

export const BPHS_FIRST_HOUSE_RULES = {
  physicalComforts: {
    title: "Physical Comforts & Health (Slokas 1-2)",
    sanskrit: "लग्नेशे पापसंयुक्ते रन्ध्रषष्ठाष्टमस्थिते।\nदेहसौख्यं भवेन्नास्य क्रूरे तुङ्गादिगेऽपि वा॥\nशुभयुक्ते विलग्नेशे केन्द्रकोणगतेऽपि वा।\nसर्वदा देहसौख्यं स्याद्रोगहीनो भवेन्नरः॥",
    english: "Should the ascendant lord be conjunct a malefic or be in the 8th, 6th or 12th house, physical comfort and health will diminish. If the ascendant lord is in an inimical sign, there will be diseases. If the ascendant lord is exalted, in a friendly sign, in a kendra (angle) or a trikona (trine) with benefics, comforts of the body will exist at all times and all diseases will disappear.",
    notes: "The placement of the ascendant lord is crucial. Its association with dusthana (6, 8, 12) houses or malefics weakens vitality, whereas placement in benefic houses, friend's signs, or exaltation removes disease."
  },
  bodilyHealth: {
    title: "Bodily Health & Aspect Rules (Sloka 3)",
    sanskrit: "क्रूराक्रान्ते विलग्ने तु चन्द्रे वा क्रूरसंयुते।\nशुभदृष्टिविहीने च देहसौख्यं न लभ्यते॥",
    english: "There will not be bodily health if the ascendant or the Moon be aspected by or conjunct a malefic, being devoid of a benefic's aspect.",
    notes: "If either the rising sign (Lagna) or the Moon sign contains malefics, or is aspected by them, without any relief/aspect from benefics (Jupiter, Venus, Mercury), bodily strength suffers."
  },
  bodilyBeauty: {
    title: "Bodily Beauty & Charm (Sloka 4)",
    sanskrit: "शुभैर्युक्ते विलग्ने तु सुरुचिरवपुर्भवेत्।\nक्रूरैर्हीनाङ्गता तद्वच्छुभदृष्टियुतेऽपि वा॥",
    english: "A benefic in the ascendant will give a pleasing appearance and beauty, while a malefic will make one bereft of good appearance. Felicity and grace of the body will be enjoyed if the ascendant is aspected by or conjunct a benefic.",
    notes: "Benefics like Jupiter or Venus in the 1st house enhance personal magnetism, style, and physical appeal, while unafflicted planets provide symmetry and attractiveness."
  },
  otherBenefits: {
    title: "Success, Fortune & Longevity (Slokas 5-7)",
    sanskrit: "लग्नेशे ज्ञगुरौ शुक्रे केन्द्रे वा त्रिकोणगे।\nदीर्घायुर्बुद्धिमान् वित्तयुतो राजप्रियो भवेत्॥\nचरराशौ विलग्नेशे शुभग्रहनिरीक्षिते।\nकीर्तिर्विभवसौख्यं च देहसौख्यं च विन्दति॥\nलग्ने शशियुते ज्ञे च गुरौ शुक्रेऽथवा स्थिते।\nकेन्द्रे वा राजलक्षणयुक्तो भवति मानवः॥",
    english: "If the ascendant lord, Mercury, Jupiter, or Venus be in an angle (kendra) or in a trine (trikona), the native will be long-lived, wealthy, highly intelligent, and liked by authorities (kings). Fame, wealth, abundant pleasures, and comforts of the body will be acquired if the ascendant lord is in a movable sign (Aries, Cancer, Libra, Capricorn) and aspected by a benefic. One will be endowed with royal marks (fortune) if Mercury, Jupiter, or Venus be in the ascendant along with the Moon, or be in an angle.",
    notes: "Kendra and Trikona positions of benefic planets ensure social recognition, high intellect, and success in professional pursuits."
  },
  coiledBirth: {
    title: "Coiled Birth - Umbilical Cord (Sloka 8)",
    sanskrit: "मेषवृषसिंहलग्ने मन्दकुजयोर्विपत्तिगे।\nसर्पवेष्टितगात्रः स्याज्जातो नात्र विचारणा॥",
    english: "If there be a birth in one of Aries, Taurus, or Leo ascendants containing either Saturn or Mars, the birth of the child is with a coil around the body. The corresponding limb will be in accordance with the Rising Sign (Rasi) or Navamsa rising.",
    notes: "This classical indicator maps to obstetric events where the umbilical cord wraps around a body part corresponding to the rising sign/navamsa."
  },
  birthOfTwins: {
    title: "Birth of Twins (Sloka 9)",
    sanskrit: "चतुष्पदगते सूर्यो द्विस्वभावे च संस्थिते।\nबलवद्भिर्ग्रहैर्जातो यमलद्वयसम्भवः॥",
    english: "The native who has the Sun in a quadruped sign (Aries, Taurus, Leo, first half of Capricorn, second half of Sagittarius) while all other planets are strong in dual signs (Gemini, Virgo, Sagittarius, Pisces) is born as one of twins.",
    notes: "A rare classical configuration for twin births based on quadruped and dual sign planetary placements."
  },
  nurturedByThreeMothers: {
    title: "Nurtured by Three Mothers (Sloka 10)",
    sanskrit: "एकराशौ गतावंशे रविचन्द्रौ यदा स्थितौ।\nत्रिभिर्मातृभिरापुष्टस्त्रिमासात् पितृभ्रातृभिः॥",
    english: "If the Sun and the Moon join in one and the same house (bhava) and fall in the same Navamsa, the native will be nurtured by 3 different mothers for the first 3 months from birth, and will later be brought up by the father and brother/relatives.",
    notes: "Historically, this denotes the early loss of the birth mother and being raised by wet nurses or female relatives, followed by paternal care."
  },
  decanatesAndLimbs: {
    title: "Decanates & Bodily Limbs (Slokas 12-14)",
    sanskrit: "शिरो नेत्रं च कर्णौ च नासिका च कपोलकौ।\nहनुर्वक्त्रं च लग्नाद्याः कल्पयेत् प्रथमे दले॥\nकण्ठस्कन्धभुजाः पार्श्वहृदयोदरनाभयः।\nद्वितीये तु दले ज्ञेयाः कल्प्याः स्वस्वगृहादिभिः॥\nबस्तिर्गुह्यं वृषणं च चोरूरु जानु जङ्घकौ।\nचरणौ चेति कल्प्याः स्युस्तृतीये द्रेष्काणके॥\nवामदक्षिणभागौ च उदितानुदिताङ्गकाः।",
    english: "The physical limbs correspond to the houses based on which decanate (10-degree division) is rising in the Ascendant. The visible half of the horoscope (from cusp of 1st house backwards to 7th house cusp via 10th house) represents the left side of the body, and the invisible half (from 1st house forward to 7th house via 4th house) represents the right side of the body.",
    decanateDetails: {
      1: {
        description: "First Decanate rising (0° - 10°)",
        mapping: [
          { house: "1st House", part: "Head / Crown" },
          { house: "2nd / 12th House", part: "Right Eye / Left Eye" },
          { house: "3rd / 11th House", part: "Right Ear / Left Ear" },
          { house: "4th / 10th House", part: "Right Nostril / Left Nostril" },
          { house: "5th / 9th House", part: "Right Temple / Left Temple" },
          { house: "6th / 8th House", part: "Right Cheek / Left Cheek" },
          { house: "7th House", part: "Face / Mouth / Chin" }
        ]
      },
      2: {
        description: "Second Decanate rising (10° - 20°)",
        mapping: [
          { house: "1st House", part: "Neck / Throat" },
          { house: "2nd / 12th House", part: "Right Shoulder / Left Shoulder" },
          { house: "3rd / 11th House", part: "Right Arm / Left Arm" },
          { house: "4th / 10th House", part: "Right Side / Left Side of Trunk" },
          { house: "5th / 9th House", part: "Right Heart / Left Heart" },
          { house: "6th / 8th House", part: "Right Stomach / Left Stomach" },
          { house: "7th House", part: "Navel" }
        ]
      },
      3: {
        description: "Third Decanate rising (20° - 30°)",
        mapping: [
          { house: "1st House", part: "Pelvis / Genitals" },
          { house: "2nd / 12th House", part: "Anus / Excretory Organs" },
          { house: "3rd / 11th House", part: "Right Testicle (or Ovary) / Left Testicle (or Ovary)" },
          { house: "4th / 10th House", part: "Right Thigh / Left Thigh" },
          { house: "5th / 9th House", part: "Right Knee / Left Knee" },
          { house: "6th / 8th House", part: "Right Calf / Left Calf" },
          { house: "7th House", part: "Feet / Sole" }
        ]
      }
    }
  },
  limbsAffected: {
    title: "Scars, Marks & Moles (Sloka 15)",
    sanskrit: "क्रूरयुक्तो व्रणो देशे शुभयुक्तो लक्षणम्।\nकथयन्ति बुधास्तद्वत् स्वस्वराशिनवांशयोः॥",
    english: "The limb related to a malefic by occupation will have ulcers, scars, or injuries, while the limb occupied by a benefic will have a mark (like a mole, birthmark, or beauty spot).",
    notes: "If a planet occupies its own Rasi or Navamsa, these marks are present right from birth; in other cases, they develop during the course of life."
  }
};

export const BPHS_SECOND_HOUSE_RULES = {
  wealthCombinations: {
    title: "Combinations for Wealth & Prosperity (Slokas 1-2)",
    sanskrit: "धनेशे धनगे वाऽपि केन्द्रकोणगतेऽपि वा।\nधनवृद्धिं करोत्येव क्रूरयुक्ते च दुर्बले॥\nसौम्यग्रहे धनगते धनवृद्धिः प्रजायते।\nपापग्रहे धनगते धननाशो भवेद् ध्रुवम्॥",
    english: "If the lord of the 2nd house is placed in the 2nd house itself, or occupies a Kendra (1st, 4th, 7th, 10th) or a Trikona (5th, 9th) house, it will promote wealth and prosperity. Should the 2nd lord be relegated to dusthanas (6th, 8th, or 12th houses), financial conditions will decline. A benefic planet occupying the 2nd house brings wealth, whereas a malefic planet in the 2nd house destroys it.",
    notes: "A strong 2nd lord in key houses ensures financial security, while placement in dusthanas indicates financial volatility. Benefics in the 2nd act as natural wealth accumulators."
  },
  jupiterMarsCombinations: {
    title: "Jupiter & Mars Wealth Yogas (Sloka 3)",
    sanskrit: "धने गुरौ धनेशे वा कुजेन सहितेऽपि वा।\nधनाधिपो भवेच्छीघ्रं धनी भवति मानवः॥",
    english: "One will be highly wealthy if Jupiter occupies the 2nd house as its lord (applicable for Sagittarius and Aquarius ascendants), or if Jupiter is conjunct Mars in any house of the horoscope.",
    notes: "Jupiter associated with Mars forms a powerful Guru-Mangala Yoga, bringing wealth through strategic actions, determination, and professional success."
  },
  lordExchange: {
    title: "Exchange of 2nd & 11th Lords (Sloka 4)",
    sanskrit: "धनेशे लाभगे वाऽपि लाभेशे धनगे तथा।\nतयोरेकत्वगे वाऽपि धनलाभमुदीरयेत्॥",
    english: "Wealth will be abundantly acquired if the lord of the 2nd house is in the 11th house, while the lord of the 11th house is in the 2nd house (Parivartana Yoga). Alternatively, the 2nd and 11th lords joining together in a Kendra or Trikona house yields similar financial gains.",
    notes: "The exchange between the house of wealth accumulation (2nd) and the house of gains (11th) is one of the highest financial Yogas in Vedic astrology."
  },
  kendraTrikonaRelation: {
    title: "Wealth via Planetary Aspects (Sloka 5)",
    sanskrit: "धनेशे केन्द्रकोणस्थे लाभेशे तत्रिकोणगे।\nजीवशुक्रेण संयुक्ते वीक्षिते वा धनी भवेत्॥",
    english: "If the lord of the 2nd house is in a Kendra (angle) while the 11th lord is in a Trikona (trine) from it, or if the 2nd lord is aspected by or conjunct Jupiter and Venus, the subject will be wealthy.",
    notes: "Aspects or conjunctions of natural benefics like Jupiter and Venus on the wealth lord acts as a celestial blessing for luxury and financial growth."
  },
  povertyYogas: {
    title: "Yogas for Poverty & Penury (Slokas 6-7)",
    sanskrit: "धनेशे त्रिषडायस्थे लाभेशेऽपि तथा स्थिते।\nपापग्रहे धनगते भवेन्निःस्वो न संशयः॥\nधनेशलाभपौ दग्धौ पापयुक्तौ गतायुषौ।\nजातस्त्वतिदरिद्रः स्याद् भिक्षाहारो भवेन्नरः॥",
    english: "One will be poor if the 2nd lord and the 11th lord are placed in evil houses (6th, 8th, 12th) and a malefic planet resides in the 2nd house. Furthermore, if the lords of the 2nd and 11th houses are combust (too close to the Sun) or heavily afflicted by conjunctions with severest malefics, the native suffers extreme poverty and struggles for basic sustenance.",
    notes: "Combustion or deep dusthana placement of both wealth indicators deprives the native of financial stability, requiring remedies for relief."
  },
  governmentLosses: {
    title: "Loss of Wealth through Penalties & Authorities (Sloka 8)",
    sanskrit: "धनेशलाभपधनेष्वरिरन्ध्रव्ययगतेषु च।\nलाभे कुजे धने राहौ राजदण्डाद् धनक्षयः॥",
    english: "If the lords of the 2nd and 11th houses are in the 6th, 8th, or 12th houses, while Mars occupies the 11th house and Rahu is placed in the 2nd house, the native will face loss of wealth due to royal punishments, government fines, legal penalties, or administrative audits.",
    notes: "Mars in the 11th combined with Rahu in the 2nd under afflicted wealth lords signifies high risk of legal disputes, tax audits, or state penalties."
  },
  charitableExpenses: {
    title: "Expenses on Noble & Charitable Causes (Sloka 9)",
    sanskrit: "लाभे गुरौ धने शुक्रे व्यये च शुभसंयुते।\nधनेशे शुभसंयुक्ते सत्कर्मणि व्ययो भवेत्॥",
    english: "If Jupiter is in the 11th house, Venus is in the 2nd house, and a benefic is placed in the 12th house, while the 2nd lord is conjunct a benefic, the native's expenses will be directed towards religious, spiritual, or charitable causes.",
    notes: "This configuration directs the wealth towards righteous deeds (Dharma), such as helping the underprivileged, running charities, or supporting temples/spiritual centers."
  },
  exaltationFame: {
    title: "Fame and Duty to Family (Sloka 10)",
    sanskrit: "धनेशे स्वगृहे तुङ्गे स्वकुटुम्बकपालकः।\nसर्वोपकारी विख्यातो जायते नात्र संशयः॥",
    english: "If the 2nd lord is placed in its own sign or is exalted, the native will be a pillar of support for their family, will be benevolent and helpful to all, and will achieve great fame.",
    notes: "A dignified wealth lord ensures that the native uses their resources responsibly to nourish their dependents and earn respect in society."
  },
  effortlessWealth: {
    title: "Effortless Acquisition of Wealth (Sloka 11)",
    sanskrit: "धनेशे शुभसंयुक्ते पारावतांशकेऽपि वा।\nसर्वसौख्ययुतस्तस्य कुटुम्बे जायते धनम्॥",
    english: "If the 2nd lord is conjunct a benefic and is placed in a highly favorable division (such as Paravatamsa or other superior vargas), the family will acquire all kinds of wealth effortlessly.",
    notes: "Paravatamsa represents high dignity in divisional charts, signifying past-life merits (Punya) that translate into comfort and automatic wealth generation."
  },
  eyeSight: {
    title: "Aesthetics and Health of the Eyes (Sloka 12)",
    sanskrit: "धनेशे बलसंयुक्ते सुरूचिरं च लोचनम्।\nषष्ठाष्टमव्ययस्थे च नेत्ररोगी भवेन्नरः॥",
    english: "If the lord of the 2nd house is strong, the native will possess beautiful and healthy eyes. Should the 2nd lord be placed in the 6th, 8th, or 12th house, the native will suffer from eye disease or physical deformity of the eyes.",
    notes: "The 2nd house rules the right eye. Afflictions to the 2nd lord or its placement in dusthanas are primary indicators of vision impairments or eye ailments."
  },
  speechAndTruthfulness: {
    title: "Speech, Truthfulness & Windy Diseases (Sloka 13)",
    sanskrit: "धने च धननाथे च पापखेचरसंयुते।\nपिशुनोऽसत्यवादी च वातरोगी भवेन्नरः॥",
    english: "If the 2nd house and its lord are conjunct malefic planets, the native will speak untruths, act as a tale-bearer, and suffer from windy diseases (such as gastric issues, arthritis, or nervous disorders).",
    notes: "Conjunction of the speech lord with harsh malefics makes the tone crude or deceitful, while also affecting physical health through wind-related imbalances."
  }
};

export const BPHS_THIRD_HOUSE_RULES = {
  courageAndSiblings: {
    title: "Courage and Sibling Blessings (Sloka 1)",
    english: "If the 3rd house is occupied or aspected by benefic planets, the native will be endowed with younger siblings (co-borns) and will possess great courage and initiative.",
    notes: "The 3rd house represents younger siblings and courage. Benefic influences here build a supportive family circle and strong willpower."
  },
  prosperityOfCoborn: {
    title: "Sibling Prosperity and Strength (Sloka 2)",
    english: "When the lord of the 3rd house and Mars (the natural significator for siblings) aspect the 3rd house or occupy the 3rd house together, it ensures high success, protection, and prosperity for younger brothers and sisters.",
    notes: "A mutual association of the house lord and the natural indicator (Karaka) Mars strengthens the themes of the house dramatically."
  },
  afflictionOfSiblings: {
    title: "Afflictions and Longevity of Siblings (Sloka 3)",
    english: "If Mars and the 3rd lord are conjunct malefic planets or occupy a sign owned by a malefic planet, it indicates potential longevity challenges or early separation from siblings.",
    notes: "Double affliction to both the lord of the 3rd and Mars indicates a vulnerability regarding siblings, requiring remedies for protection."
  },
  genderOfSiblings: {
    title: "Gender Determination of Siblings (Slokas 4-4.1)",
    english: "If the 3rd lord is a female planet, or if the 3rd house is occupied by female planets, it indicates younger sisters. If the 3rd lord is a male planet or the house is occupied by male planets, it indicates younger brothers. A mixed placement indicates siblings of both sexes.",
    notes: "Saturn and Rahu are historically classified as male influencers, while Mercury and Ketu are treated as female influencers for siblings. Odd signs denote brothers, and even signs denote sisters."
  },
  dusthanaVsBeneficPlacements: {
    title: "Dusthana Placements vs. Benefic Placements (Slokas 5-6)",
    english: "If the 3rd lord and Mars are jointly placed in the 8th house, it signifies obstacles or loss of siblings. However, if Mars or the 3rd lord is in a Kendra (angle), Trikona (trine), or placed in exaltation or friendly divisions, happiness and support from siblings are assured.",
    notes: "A planet placed in the 8th house suffers debility, whereas angles, trines, or high dignity (exaltation) restore the positive significations of siblings and courage."
  },
  siblingCountYogas: {
    title: "Specific Yogas for Sibling Counts (Slokas 7-11)",
    english: "Specific planetary alignments determine sibling counts. For instance, Mercury in the 3rd house with the 3rd lord and the Moon, while Mars joins Saturn, indicates elder sisters and younger brothers. Similarly, if the 3rd lord is in a Kendra while Mars is exalted in a Trikona conjunct Jupiter, it promises a large family circle.",
    notes: "These formulas demonstrate how combinations of the Moon, Mercury, and Mars determine the order of birth and size of the family."
  },
  specialPlacementsMoon: {
    title: "Sibling Count based on Moon and Aspects (Slokas 12-13)",
    english: "If the 11th or 12th lord joins Mars and Jupiter while the Moon occupies the 3rd house, it indicates multiple siblings. If the Moon is placed alone in the 3rd house and aspected by male planets, younger brothers are predicted; if aspected by Venus, younger sisters are indicated.",
    notes: "The Moon acts as a catalyst for growth, and aspects from gender-specific planets determine the gender of the siblings."
  },
  adversePlanets: {
    title: "Adverse Planets in the 3rd House (Sloka 14)",
    english: "The Sun in the 3rd house tends to limit or cause separation from elder siblings. Saturn in the 3rd house limits younger siblings. Mars in the 3rd house can be adverse for both elder and younger siblings.",
    notes: "Planets like the Sun, Saturn, and Mars have separating natures. While they make the native highly courageous, they often cause separation or lack of support from siblings."
  },
  strengthAssessment: {
    title: "Sastra Principle of Strength Assessment (Sloka 15)",
    english: "All predictions regarding courage, younger brothers, and sisters must be declared only after carefully assessing the relative strengths (Shadbala) and weaknesses of the planets involved.",
    notes: "A fundamental astrological principle stating that rules should not be applied blindly; the overall strength of Mars and the 3rd house must be weighted."
  }
};

export const BPHS_FOURTH_HOUSE_RULES = {
  residentialComforts: {
    title: "Residential Comforts & Real Estate (Sloka 2)",
    english: "One will enjoy excellent housing and residential comforts in full measure if the 4th house is occupied by its own lord, or by the ascendant lord, and is aspected by a benefic planet.",
    notes: "Direct association of the house lord or the self-identity lord (Ascendant lord) with the 4th house, blessed by benefic aspects, guarantees a comfortable and harmonious home environment."
  },
  landAndConveyances: {
    title: "Comforts from Lands, Vehicles & Instruments (Sloka 3)",
    english: "Should the 4th lord occupy its own sign, its own Navamsa, or be in a sign of exaltation, the native will be blessed with comforts relating to lands, houses, conveyances (vehicles), and creative or musical pursuits.",
    notes: "A strong and dignified 4th lord secures physical assets like property and vehicles. Its strength also relates to inner contentness (Sukha), often expressed through music and arts."
  },
  beautifulMansions: {
    title: "Acquisition of Beautiful Mansions (Sloka 4)",
    english: "If the lord of the 10th house joins the lord of the 4th house in a Kendra (angle) or a Trikona (trine), the native will acquire magnificent and beautiful houses.",
    notes: "The connection between the 10th lord (career, social status) and the 4th lord (home) combines authority with domestic comfort, resulting in elite properties."
  },
  honorByRelatives: {
    title: "Honor and Respect from Relatives (Sloka 5)",
    english: "If Mercury occupies the Ascendant (1st house) while the 4th lord is a benefic and receives the aspect of another benefic planet, the native will be highly honored, respected, and supported by their relatives.",
    notes: "Mercury in the 1st house gives excellent communication and charm, while a well-supported 4th lord ensures harmonious relations within the extended family."
  },
  motherLongevity: {
    title: "Longevity of the Mother (Sloka 6)",
    english: "If the 4th house is occupied by a benefic planet, its lord is exalted, and the natural significator of the mother (the Moon) is strong and well-placed, the mother will enjoy a long and healthy life.",
    notes: "For mother's longevity, all three factors—the 4th house, the 4th lord, and the Moon (Matru-Karaka)—must be strong and free from malefic afflictions."
  },
  motherHappiness: {
    title: "Domestic Happiness for the Mother (Sloka 7)",
    english: "The native's mother will enjoy a happy and peaceful life if the 4th lord is in a Kendra (angle), Venus (the indicator of domestic comfort) is also in a Kendra, and Mercury occupies its sign of exaltation (Virgo).",
    notes: "Benefic angles and an exalted Mercury support mental peace and high intellectual harmony for the mother."
  },
  quadrupedsAndAssets: {
    title: "Agricultural Assets & Cattle (Sloka 8)",
    english: "The Sun in the 4th house, the Moon and Saturn in the 9th house, and Mars in the 11th house—this specific configuration confers ownership of agricultural properties, livestock, or large estates.",
    notes: "A classical configuration linking solar domestic energy, higher philosophy (9th), and gains (11th) to agricultural prosperity."
  },
  speechImpairment: {
    title: "Yogas for Speech Deformity or Dumbness (Sloka 9)",
    english: "If the 4th house falls in a movable sign (Aries, Cancer, Libra, Capricorn) while its lord and Mars are conjunct in the 6th or 8th house, the native may experience speech challenges or dumbness.",
    notes: "The 4th house is closely associated with vocalization and expression. Affliction by Mars in dusthanas can lead to physical vocal impairments."
  },
  conveyanceAcquisition: {
    title: "Timing of Vehicle Acquisition (Slokas 10-14)",
    english: "The timing of vehicle acquisition is determined by key configurations: an exchange between the 11th and 4th lords, or the 4th lord in the 11th with Venus in the 12th, brings conveyances in the 12th year. The Sun in the 4th house with Venus under an exalted 4th lord brings vehicles in the 32nd year. The 4th lord conjunct the 10th lord in its exaltation Navamsa brings vehicles in the 42nd year.",
    notes: "Vedic astrology maps specific planetary periods (Dashas) and age milestones to physical acquisitions based on the strength of the 4th house and Venus (the vehicle Karaka)."
  },
  accidentProtection: {
    title: "Protection from Vehicular Accidents (Sloka 14 Notes)",
    english: "If a benefic planet is related to the 4th house or its lord (by aspect or conjunction), the native will enjoy comfortable vehicles and remain free from accidents. If replaced by a malefic, it indicates a risk of vehicular accidents and losses.",
    notes: "Safety on journeys is governed by the 4th house. Malefics like Rahu, Mars, or Saturn in the 4th require caution during travel, whereas Jupiter or Venus aspects act as protective shields."
  }
};

export const BPHS_FIFTH_HOUSE_RULES = {
  progenyHappiness: {
    title: "Happiness and Success from Progeny (Slokas 1-3)",
    english: "If the lords of both the Ascendant (1st) and the 5th house are placed in their own signs, or occupy a Kendra (angle) or a Trikona (trine), the native will enjoy supreme happiness and comfort through their children. If the 5th lord is combust, placed in the 6th, 8th, or 12th houses, or heavily afflicted, it indicates potential delays or challenges in obtaining progeny.",
    notes: "A strong relationship between the 1st lord (self) and the 5th lord (children) in auspicious houses ensures a loving bond, while placement of the 5th lord in dusthanas indicates blocks."
  },
  firstBornChallenges: {
    title: "Specific Obstacles for First-born (Sloka 4)",
    english: "If the 5th lord is in the 6th house while the Ascendant lord is conjunct Mars, the native may face challenges or medical issues with the first child, after which special efforts are required for subsequent progeny.",
    notes: "Afflictions from Mars and dusthana placements of the 5th lord signify a need for medical attention or spiritual remedies for the first-born."
  },
  limitedProgenyYogas: {
    title: "Yogas for Limited Progeny (Slokas 5-7)",
    english: "Specific planetary configurations restrict the number of progeny. For instance, if the 5th lord is in its sign of debilitation in the 6th, 8th, or 12th house, while Mercury and Ketu reside in the 5th house, the native may obtain only a single child. Similarly, Ketu and Mercury in the 5th under a debilitated 9th lord signify progeny after overcoming major delays.",
    notes: "Mercury and Ketu are dry or neuter planets; their presence in the 5th house often acts as a biological limiter, bringing a single child (Kakavandhya Yoga)."
  },
  progenyObstacles: {
    title: "Difficulty in Conceiving (Sloka 8)",
    english: "If the 5th lord is in the 6th, 8th, or 12th house, or occupies an inimical or debilitated sign, the native will obtain children only after overcoming substantial obstacles and delays.",
    notes: "Dusthana placements of the 5th lord do not deny children entirely but demand patience, therapeutic care, or spiritual remedies."
  },
  adoptedProgeny: {
    title: "Combinations for Adoption (Slokas 9, 11)",
    english: "If the 5th house is ruled by Saturn or Mercury and is occupied or aspected by Saturn and Mandi (Gulika), or if the 5th house contains multiple planets while its lord resides in the 12th under a strong Moon and Ascendant, the native may obtain children through adoption.",
    notes: "Mercury and Saturn represent unconventional progeny. Their dominance over the 5th house under the influence of Mandi aligns the native's destiny toward adopting a child."
  },
  daughterPredominance: {
    title: "Predominance of Daughters (Sloka 13)",
    english: "If the 5th lord is conjunct the Moon or is placed in a decanate (Dreshkana) owned by the Moon, the native is predicted to have more daughters.",
    notes: "The Moon represents feminine energy and multiplicity. Her influence on the 5th lord tilts the biological balance towards female offspring."
  },
  unconventionalProgeny: {
    title: "Unconventional Birth Indicators (Slokas 14-15)",
    english: "Unusual configurations, such as the 5th lord in a movable sign while Saturn is in the 5th and Rahu is conjunct the Moon, or the Moon in the 8th house while Jupiter is in the 9th from the Moon under malefic aspects, historically pointed to unconventional lineage or complex family backgrounds.",
    notes: "These formulas are interpreted in modern contexts as indicating foster parenting, complex step-family dynamics, or surrogacy."
  },
  timingOfProgeny: {
    title: "Timing and Milestones of Progeny (Slokas 18-20)",
    english: "The timing of birth is mapped to key life milestones. For instance, Jupiter in the 5th house with its lord conjunct Venus indicates progeny around the 32nd or 33rd year. If the 5th lord is in an angle along with Jupiter, it indicates birth at the age of 30 or 36. Jupiter in the 9th with Venus and the Ascendant lord in the 9th from Jupiter indicates birth at age 40.",
    notes: "Vedic astrology correlates planetary transits and major Dasha cycles of Jupiter (the Putra-Karaka) with specific age milestones for childbirth."
  },
  progenyCounts: {
    title: "Planetary Formulas for Sibling & Child Counts (Slokas 24-32)",
    english: "Exalted configurations of Jupiter and the 5th lord indicate multiple children. For example, if the 5th lord is in deep exaltation joining the Ascendant lord while Jupiter is with another benefic, a large family is promised. Conversely, a malefic in the 5th house while Jupiter is in the 5th from Saturn indicates children through remarriage, or late-stage progeny.",
    notes: "A strong, exalted Jupiter acts as a powerful protector of progeny, offsetting malefic influences in the chart."
  }
};

export const BPHS_SIXTH_HOUSE_RULES = {
  ulcersAndBruises: {
    title: "Physical Ulcers, Injuries & Scars (Sloka 2)",
    english: "If the lord of the 6th house occupies the 6th house itself, or resides in the Ascendant (1st) or 8th house, the native will be prone to bodily scars, bruises, or physical injuries. The specific bodily limb affected corresponds to the sign index of the 6th house.",
    notes: "The 6th house rules wounds (Vrana). The placement of its lord in key physical centers (1st or 8th) manifests as visible markers on the body."
  },
  relativesAfflicted: {
    title: "Health Afflictions to Relatives (Slokas 3-5)",
    english: "If the lord of any house, or its natural significator (Karaka), is placed in the 6th or 8th house, or joins the 6th lord, the relative signified by that house will suffer from physical ailments or injuries. The physical organs mapped to afflicted planets are: Sun (head), Moon (face), Mars (neck), Mercury (navel), Jupiter (nose), Venus (eyes), Saturn (feet), and the Nodes (abdomen).",
    notes: "For example, if the 4th lord (mother) or Moon (Matru-Karaka) is conjunct the 6th lord, it indicates health challenges for the mother."
  },
  facialAilments: {
    title: "Yogas for Facial Ailments (Sloka 6)",
    english: "If the lord of the Ascendant is placed in a sign ruled by Mars (Aries, Scorpio) or Mercury (Gemini, Virgo) and receives the aspect of Mercury, it indicates vulnerability to facial skin issues or nerve disorders.",
    notes: "Mars governs blood and inflammation, while Mercury rules the nervous system and skin. Their combined influence on the Ascendant lord affects the face."
  },
  chronicSkinDisorders: {
    title: "Predisposition to Chronic Skin Conditions (Slokas 7-8.1)",
    english: "If Mars or Mercury owns the Ascendant and is conjunct the Moon, Saturn, and Rahu, severe skin disorders are indicated. If Rahu and the Moon are conjunct in the Ascendant (excluding Cancer), it indicates white patches (vitiligo). Replacing Rahu with Saturn indicates dry, dark patches, while Mars indicates inflammatory blood-related skin conditions.",
    notes: "Vedic medical astrology links chronic skin eruptions and pigment variations to deep afflictions of the Moon (blood chemistry) and Ascendant lord by Rahu, Saturn, or Mars."
  },
  generalDiseases: {
    title: "General Diseases and Planetary Triggers (Slokas 9-12.1)",
    english: "When the 6th and 8th lords occupy the Ascendant, the accompanying planet dictates the ailment: the Sun causes fevers and inflammatory tumors; Mars causes blood vessel swellings, weapon cuts, or surgeries; Mercury causes bilious disorders (jaundice); Venus causes reproductive or venereal issues; Saturn causes windy disorders (paralysis, arthritis); Rahu causes toxins or foreign diseases; Ketu causes navel infections; and the Moon causes phlegmatic disorders (asthma) or drowning risk. Jupiter in this case acts as a healer and dissolves the illness.",
    notes: "The conjunction of dusthana lords (6th & 8th) in the 1st house forces the body to process specific illnesses based on the element of the conjunct planet."
  },
  timingOfIllness: {
    title: "Age Milestones for Health Events (Slokas 13-19)",
    english: "The timing of health events is triggered at specific ages: Mars in the 6th with its lord in the 8th triggers severe fevers at ages 6 and 12. Rahu in the 6th with the Ascendant lord in the 8th and Mandi in an angle indicates lung issues at age 26. An exchange between the 6th and 12th lords triggers splenetic or digestive disorders at ages 29 and 30. Saturn and the Moon in the 6th trigger skin flare-ups at age 45. Saturn conjunct an enemy planet while the Ascendant lord is in the Ascendant triggers windy disorders at age 59.",
    notes: "Medical transits and planetary Dashas activate latent physical blockages at these mathematically derived age periods."
  },
  accidentalDangers: {
    title: "Environmental and Animal Hazards (Slokas 20-25)",
    english: "Hazards at specific ages are triggered by planetary aspects: the Moon conjunct the 6th lord while the 8th lord is in the 6th indicates danger from animals at age 8. Rahu in the 6th with Saturn in the 8th from Rahu indicates danger from fire at ages 1 and 2. The Sun in the 6th/8th with the Moon in the 12th from the Sun indicates water hazards at ages 5 and 7. Saturn in the 8th and Mars in the 7th indicates eruptive viral skin diseases at ages 10 and 30.",
    notes: "Childhood environmental vulnerabilities are mapped to solar, lunar, and nodal placements in difficult houses."
  },
  adversariesAndLosses: {
    title: "Financial Losses and Adversaries (Slokas 26-28)",
    english: "Exchange between the 11th (gains) and 6th (debts/enemies) lords brings financial losses or litigation in the 31st year. The 5th lord in the 6th while the 6th lord is conjunct Jupiter and the 12th lord resides in the Ascendant indicates disputes with family. An exchange between the 1st and 6th lords indicates fear of animal bites (like dogs) at ages 10 and 19.",
    notes: "The interaction of the 6th house of litigation, debt, and animals with the wealth and self houses indicates points of social or physical conflict."
  }
};

export const BPHS_SEVENTH_HOUSE_RULES = {
  maritalHappiness: {
    title: "Marital Happiness & Partner Support (Slokas 1-2)",
    english: "If the lord of the 7th house is placed in its own sign or is in its sign of exaltation, the native will obtain full happiness and prosperity through marriage and partnership. If the 7th lord occupies dusthana houses (6th, 8th, or 12th), the spouse may experience health challenges, unless the planet is in its own sign or exaltation sign within those houses.",
    notes: "A dignified 7th lord is the foundation of marital harmony. Its placement in dusthanas indicates physical distance, health vulnerability, or blocks, unless neutralised by own-sign or exaltation strength."
  },
  libidoAndSpouseLoss: {
    title: "Libido, Passions & Afflictions (Sloka 3)",
    english: "Venus residing in the 7th house makes the native highly passionate and relationship-oriented. If Venus is conjunct a malefic in any house of the horoscope, it indicates potential separation or early loss of the partner.",
    notes: "Venus in the 7th is a classic Karako Bhava Nashaya placement (significator in the house of its signification), which can lead to high expectations or intense passions, while malefic conjunctions create relationship instability."
  },
  worthinessOfSpouse: {
    title: "Virtues and Prosperity of the Partner (Slokas 4-5)",
    english: "If the 7th lord is strong and aspected by or conjunct benefic planets, the partner will be wealthy, honorable, and supportive. Conversely, if the 7th lord is debilitated, combust, or in an inimical sign, the native may face marital delays, health issues for the spouse, or multiple relationships.",
    notes: "Benefic aspects on the 7th lord act as a cosmic protector, ensuring that the spouse is supportive and belongs to a respected family."
  },
  partnerCharacteristics: {
    title: "Characteristics of the Partner (Slokas 7-8.1)",
    english: "The planet occupying the 7th house reveals the partner's background: the Sun indicates an independent or career-driven spouse; the Moon signifies a nurturing partner matching the sign's element; Mars indicates an athletic, passionate, or fiery spouse; Mercury denotes an intellectual, business-minded, or young spouse; Jupiter denotes a wise, noble, and deeply moral spouse; Saturn, Rahu, or Ketu indicates an unconventional spouse, or one from a different cultural background.",
    notes: "The 7th house acts as a mirror showing the qualities of the people we draw into close partnership."
  },
  physicalAesthetics: {
    title: "Physical Attributes of the Partner (Slokas 9-9.1)",
    english: "The physical form of the partner is influenced by the dominant planet: Mars brings an athletic build; Saturn indicates a slender, tall, or physically delicate build; Jupiter brings a full, robust, and dignified build; Venus indicates exceptional symmetry, charm, and beauty.",
    notes: "Planetary rays aspecting or occupying the 7th house stamp their physical archetype on the spouse's appearance."
  },
  intimacyAndBonding: {
    title: "Yogas for Intimacy & Relationship Dynamics (Slokas 10-13.1)",
    english: "A decreasing Moon in the 5th house, coupled with malefics in the 12th and 7th houses, indicates that the spouse may have a dominant or challenging temper. Venus conjunct Mars, or placed in Martian signs/Navamsas, gives highly unconventional and passionate relationship habits.",
    notes: "Venus-Mars connections represent deep physical attraction and intense passion, which can lead to unconventional relationship dynamics."
  },
  virtuousSpouse: {
    title: "Blessing of a Worthy Spouse & Dynasty (Slokas 14-15)",
    english: "If the 7th lord is exalted while the 7th house is occupied by a strong Ascendant lord and a benefic planet, the native is blessed with an exceptionally virtuous spouse, leading to a happy family line.",
    notes: "A strong connection between the Ascendant lord (the self) and the 7th house (the spouse) indicates mutual alignment and marital longevity."
  },
  earlyLossOrSeparation: {
    title: "Separation and Domestic Afflictions (Slokas 16-18)",
    english: "If the 7th lord is combust, debilitated, or placed in the 6th, 8th, or 12th houses without any strength, it indicates early separation or loss. A decreasing Moon in the 7th house under a weak Venus and the 7th lord in the 12th indicates a lack of domestic harmony.",
    notes: "Multiple afflictions to the 7th lord and Venus deplete the vital energy of the relationship, leading to distance or legal separation."
  },
  multipleMarriages: {
    title: "Combinations for Multiple Marriages (Slokas 19-21)",
    english: "Two marriages are indicated if the 7th lord is debilitated or in a malefic sign conjunct a malefic, while the 7th house or its Navamsa falls in a sign ruled by Mercury or Saturn. Mars and Venus in the 7th house, or Saturn in the 7th with the Ascendant lord in the 8th, indicate three marriages. Venus in a dual sign with its lord exalted indicates multiple relationships.",
    notes: "Dual signs (Gemini, Virgo, Sagittarius, Pisces) or signs ruled by Saturn/Mercury in the 7th house naturally introduce themes of multiplicity in relationships."
  },
  timingOfMarriage: {
    title: "Timing of Marriage Milestones (Slokas 22-34)",
    english: "The timing of marriage is mapped to planetary ages: Venus in a Kendra under Capricorn/Aquarius ascendant brings marriage in the 11th year. The 2nd lord in the 11th with the Ascendant lord in the 10th brings marriage in the 15th year. An exchange between the 2nd and 11th lords brings marriage in the 13th year. The 7th lord in the 12th with the Ascendant lord in the 7th in Navamsa brings marriage at age 23 or 26. Venus in the 5th house with Rahu in the 5th or 9th brings marriage at age 31 or 33.",
    notes: " Vimsottari Dasha transits involving Venus (the relationship Karaka) and the 2nd/7th lords trigger marriage at these age milestones."
  },
  timingOfSpouseLoss: {
    title: "Timing of Spouse's Separation (Slokas 35-39, 42)",
    english: "Separation or crisis periods are indicated at specific ages: the 7th lord debilitated while Venus is in the 8th triggers spouse loss at age 18 or 33. The 7th lord in the 8th with the 12th lord in the 7th triggers a crisis at age 19. Venus in the 8th with its dispositor in Saturn's sign triggers a crisis at age 11 or 21. If the 6th, 7th, and 8th houses are occupied by Mars, Rahu, and Saturn in order, it indicates extreme longevity challenges for the spouse.",
    notes: "Afflicted placements of Venus in the 8th house (mangalya-sthana) or dusthanas act as critical periods for relationship longevity."
  }
};

export const BPHS_EIGHTH_HOUSE_RULES = {
  generalLongevity: {
    title: "Primary Longevity Indicators (Sloka 1)",
    english: "If the lord of the 8th house is placed in an angle (Kendra - 1st, 4th, 7th, 10th house), it is a primary indicator of a long and stable life span.",
    notes: "The 8th house is the house of longevity (Ayu Bhava). Its lord placed in a powerful Kendra house strengthens the native's life force."
  },
  shortLifeIndicators: {
    title: "Short Life Span Configurations (Slokas 2-3)",
    english: "If the 8th lord joins the Ascendant lord or a malefic planet, and resides in the 8th house itself, the native may face longevity challenges. Similarly, severe afflictions to Saturn (the natural longevity Karaka) or the 10th lord by malefics in dusthanas reduce the overall life expectancy.",
    notes: "A weakened 8th house conjunct severe malefics without benefic aspects acts as a biological drain on the native's vitality."
  },
  longLifeYogas: {
    title: "Advanced Yogas for Long Life (Slokas 4-7)",
    english: "Longevity is significantly enhanced under specific placements: the 6th lord in the 12th house (Vipareeta Raja Yoga); the 6th and 12th lords placed in their respective houses; or the 6th lord in the Ascendant with the 12th lord in the 8th house. Additionally, if the lords of the 5th, 9th, and Ascendant occupy their own signs, exaltation, or friendly divisions, or if the Ascendant, 9th, and 10th lords along with Saturn occupy Kendras, Trikonas, or the 11th house, a long and prosperous life is assured.",
    notes: "Vipareeta Raja Yogas (dusthana lords in other dusthanas) neutralize the negative qualities of the 6th and 8th houses, translating into vitality and immunity."
  },
  infantMortalityAlerts: {
    title: "Balarishta and Early Infancy Evils (Slokas 8-13)",
    english: "Severe early life vulnerabilities (Balarishta) are indicated if the 8th house, its lord, and the 12th house are all conjunct malefics, or if the 5th house, 8th house, and 8th lord are simultaneously afflicted. Furthermore, if the 8th lord is in the 8th while the Moon is conjunct malefics without any aspect from benefics, it indicates health threats in early infancy.",
    notes: "Balarishta Yogas represent physical vulnerabilities in childhood. In modern times, these indicate a need for neonatal care, maternal health focus, and spiritual remedies (recycles of prayers)."
  },
  exaltedVitality: {
    title: "Exalted Vitality and Wealth (Slokas 14-15)",
    english: "The native is blessed with exceptional longevity, wealth, and virtue if the Ascendant lord is exalted while the Moon occupies the 11th house and Jupiter is in the 8th house. A highly fortified Ascendant lord aspected by a benefic from a Kendra secures a long, healthy, and celebrated life.",
    notes: "Jupiter's placement in the 8th house is highly celebrated for longevity (though it can limit other 8th house significations), creating a protective shield for the native's physical body."
  }
};

export const BPHS_NINTH_HOUSE_RULES = {
  generalFortunes: {
    title: "Yogas for Abundant Fortune & Affluence (Slokas 1-2)",
    english: "The native will be highly fortunate, moral, and affluent if the 9th lord is placed in the 9th house with strength. If Jupiter occupies the 9th house while the 9th lord is in a Kendra (angle) and the Ascendant lord is strong, the native will enjoy extraordinary fortune.",
    notes: "The 9th house is the house of fortune (Bhagyasthana). A well-placed 9th lord and Jupiter (natural Karaka of expansion) represent spiritual merits that manifest as material ease."
  },
  fatherProsperity: {
    title: "Prosperity of the Father (Slokas 3, 6-7)",
    english: "The native's father will be affluent and respected if the 9th lord is strong, Venus is in the 9th house, and Jupiter is in a Kendra. Furthermore, if the 9th lord is in a Kendra aspected by Jupiter, or occupies the 10th house while the 10th lord is aspected by a benefic, the father enjoys royal/high social status, wealth, and fame.",
    notes: "The father's prosperity is mapped through the 9th house, its lord, and indicators like the Sun and Venus in the chart."
  },
  fatherAfflictions: {
    title: "Financial Challenges for the Father (Sloka 4)",
    english: "If the 9th lord is debilitated while Mars occupies the 10th or 12th house (the 2nd or 4th houses counted from the 9th), the father may experience financial setbacks, property litigations, or loss of inheritance.",
    notes: "Mars in these placements introduces conflict and legal disputes regarding ancestral properties or paternal relationships."
  },
  fatherLongevity: {
    title: "Longevity of the Father (Sloka 5)",
    english: "The native's father will enjoy a very long life if the 9th lord is deeply exalted, Venus resides in a Kendra from the Ascendant, and Jupiter is placed in the 9th house from the Navamsa Ascendant.",
    notes: "Triple validation involving the exaltation of the 9th lord, Venus in angles, and Jupiter's Navamsa position ensures structural protection for the father."
  },
  devotionToFather: {
    title: "Filial Devotion and Virtue (Slokas 8-9)",
    english: "If the Sun is deeply exalted while the 9th lord is placed in the 11th house, the native will be virtuous, favored by authorities, and deeply devoted to their father. If the Sun is in a trine (5th/9th) while the 9th lord is in the 7th house conjunct or aspected by Jupiter, the native will show great respect and service to their father.",
    notes: "A strong Sun (Pitru-Karaka) combined with the 9th lord promotes mutual understanding, respect, and shared moral codes between father and child."
  },
  timingOfFortunes: {
    title: "Timing of Fortune & Career Milestones (Slokas 10, 27-28)",
    english: "Acquisition of wealth, vehicles, and fame is predicted in the 32nd year if there is an exchange (Parivartana Yoga) between the 2nd and 9th lords. Fortunes will rise after the 20th year if the 9th house has Jupiter in it and its lord is in a Kendra. If Mercury is deeply exalted while the 9th lord occupies the 9th house itself, fortunes rise after the 36th year.",
    notes: "Specific planetary periods trigger major social and professional ascents at these age milestones."
  },
  paternalConflict: {
    title: "Enmity with the Father (Sloka 11)",
    english: "There will be mutual disagreements or estrangement between the native and their father if the Ascendant lord is placed in the 9th house conjunct the 6th lord (lord of disputes).",
    notes: "The presence of the 6th lord of conflict in the house of the father (9th) indicates divergent ideologies or legal disputes between father and child."
  },
  severeHardships: {
    title: "Financial Hardships & Begging Yogas (Slokas 12, 30-31)",
    english: "If the 10th and 3rd lords are weak while the 9th lord is debilitated or combust, the native will struggle for daily livelihood. Similarly, if Saturn is in the 9th house with the Moon while the Ascendant lord is in debilitation, it indicates severe financial hardships.",
    notes: "Weakness of the career lord (10th) and the fortune lord (9th) combined with a debilitated Ascendant lord deprives the native of professional opportunities, requiring remedies."
  },
  timingOfFatherDeath: {
    title: "Timing of Father's Separation (Slokas 13-25)",
    english: "Critical periods or early separation from the father are mapped to specific ages: if the Sun is in the 6th, 8th, or 12th house while the 8th lord is in the 9th and the 12th lord is in the Ascendant, it indicates separation prior to birth or in early infancy. Similar configurations trigger critical periods at ages 2, 7, 12, 16, 18, 19, 21, 26, 30, 35, 41, 44, and 50.",
    notes: "These age milestones represent challenging periods for the father's health based on solar afflictions by Mars, Saturn, or Rahu."
  },
  fortunesExchange: {
    title: "Fortunes through Self-effort (Slokas 26, 29)",
    english: "If Venus is deeply exalted conjunct the 9th lord while Saturn is in the 3rd house, or if the Ascendant lord is in the 9th while the 9th lord is in the Ascendant with Jupiter in the 7th, the native will gain outstanding fortunes, vehicles, and status through their own efforts.",
    notes: "Exchange of the 1st lord (self) and the 9th lord (fortune) is one of the highest Raja Yogas, denoting self-made prosperity."
  }
};

export const BPHS_TENTH_HOUSE_RULES = {
  reputationAndPaternalJoy: {
    title: "Career Fame and Paternal Happiness (Sloka 2)",
    english: "If the lord of the 10th house is strong and placed in its own sign, exaltation sign, or own Navamsa, the native enjoys excellent paternal support, professional fame, and performs noble deeds.",
    notes: "The 10th house (Karma Bhava) dictates professional trajectory. A strong 10th lord indicates natural authority, professional honors, and paternal support."
  },
  obstructionsVsSpiritualWorks: {
    title: "Career Stagnation and Spiritual Sacrifices (Sloka 3)",
    english: "If the 10th lord lacks strength, the native faces professional obstacles and delays in their work. However, if Rahu is placed in an angle (Kendra) or a trine (Trikona), the native will perform major philanthropic works, religious ceremonies, or spiritual duties.",
    notes: "Rahu in active houses often drives the native towards unconventional or highly visible public rituals and large-scale ceremonies."
  },
  patronageAndProfit: {
    title: "Success in Business & Public Office (Sloka 4)",
    english: "If the 10th lord is conjunct a benefic planet or is placed in an auspicious house, the native will consistently gain through royal patronage, government favor, or corporate businesses. If afflicted, reverse results are predicted.",
    notes: "A benefic association with the career lord ensures easy access to capital, supportive superiors, and public recognition."
  },
  unethicalActions: {
    title: "Obstacles & Unethical Conduct (Slokas 5-6)",
    english: "Should both the 10th and 11th houses be occupied by malefics, the native may engage in questionable or controversial activities. If the 10th lord is in the 8th house conjunct Rahu, the native faces professional downfalls, public disputes, or performs foolish deeds.",
    notes: "Rahu and dusthana lords affecting the 10th lord indicate sudden job loss, career disruptions, or controversial public profiles."
  },
  materialDesires: {
    title: "Focus on Basic Needs & Carnal Pleasures (Sloka 7)",
    english: "If Saturn, Mars, and the 10th lord are placed in the 7th house, while the 7th lord is conjunct a malefic planet, the native's actions will be highly driven by basic survival needs and sensory gratification.",
    notes: "This configuration directs the native's career energy (10th lord) towards raw physical matters or business partnerships focused on basic commodities."
  },
  honorAndOrnaments: {
    title: "Royal Honor, Ornaments & Wealth (Slokas 8-10)",
    english: "The native will earn great respect, valour, and wealth if the 10th lord is exalted and conjunct Jupiter, while the 9th lord occupies the 10th house. A strong 10th lord in Pisces conjunct Jupiter promises abundant ornaments, garments, and luxury.",
    notes: "The connection between the 9th lord (fortune) and the 10th lord (action) forms a powerful Dharma-Karmadhipati Raja Yoga, the highest indicator of status and leadership."
  },
  dutyDiscontinuation: {
    title: "Cessation of Professional Duties (Sloka 11)",
    english: "If the Sun, Mars, Rahu, and Saturn simultaneously occupy the 11th house, the native will face sudden breaks or discontinuation of their primary professional duties.",
    notes: "Four severe malefics in the house of gains (11th) overload the energy of the house, indicating career restarts or sudden shifts."
  },
  spiritualWisdom: {
    title: "Supreme Spiritual Wisdom & Wealth (Sloka 12)",
    english: "If Jupiter occupies Pisces conjunct Venus, while the Ascendant lord is strong and the Moon resides in its sign of exaltation, the native will be highly learned, spiritually wise, and financially wealthy.",
    notes: "Jupiter and Venus in Pisces (the sign of liberation) combine supreme spiritual knowledge with material prosperity, granting inner peace and self-realization."
  },
  preciousStoneAcquisition: {
    title: "Acquisition of Precious Gems & Assets (Slokas 13, 15)",
    english: "If the 10th lord occupies the 11th house, the 11th lord is in the Ascendant, and Venus resides in the 10th house, the native acquires immense wealth and precious gems. If the 10th lord is in the Ascendant along with the Ascendant lord while the Moon is in a Kendra or Trikona, the native devotes their life to charitable actions.",
    notes: "Venus in the 10th house under a strong wealth exchange grants a highly artistic, luxurious, and celebrated career."
  },
  careerObstructions: {
    title: "Career Degradation and Blocks (Slokas 16-18)",
    english: "If Saturn occupies the 10th house conjunct a debilitated planet, or if the 10th lord is debilitated while malefics occupy both the 10th house and the 7th house (which is the 10th from the 10th), the native will face persistent career blocks and professional stagnation.",
    notes: "Debilitation of the career lord coupled with malefic occupation of key career angles creates structural challenges in maintaining employment."
  },
  careerFame: {
    title: "Yogas for Outstanding Professional Fame (Slokas 19-21)",
    english: "Outstanding fame is promised if the Moon occupies the 10th house while the 10th lord is in a trine from the 10th (2nd/6th house) and the Ascendant lord is in a Kendra. Alternatively, fame is assured if the 11th lord is in the 10th while the 10th lord is strong and aspected by Jupiter, or if the 10th lord is in the 9th, the Ascendant lord is in the 10th, and the Moon occupies the 5th house.",
    notes: "The Moon in the 10th house acts as a reflector of public fame, making the native highly popular in their community or field."
  }
};

export const BPHS_ELEVENTH_HOUSE_RULES = {
  generalGains: {
    title: "Yogas for Abundant Gains & Success (Slokas 1-2)",
    english: "The native will enjoy multiple sources of income and overall success if the 11th lord occupies the 11th house itself, or is placed in a Kendra (angle) or a Trikona (trine) from the Ascendant. Even if the 11th lord is combust, its placement in its sign of exaltation guarantees extensive gains.",
    notes: "The 11th house is the house of gains (Labha Bhava) and desires. A strong 11th lord represents the ease with which goals are achieved and ambitions are fulfilled."
  },
  massiveIncome: {
    title: "Yogas for Massive Accumulation of Wealth (Slokas 3, 6-7)",
    english: "If the 11th lord is placed in the 2nd house while the 2nd lord occupies a Kendra conjunct Jupiter, the native's gains will be massive. If Jupiter occupies the 11th house while the Moon is in the 2nd and Venus is in the 9th, it indicates opulent wealth. If Jupiter, Mercury, and the Moon are in the 9th house (the 11th from the 11th), the native will possess diamonds, grains, and ornaments.",
    notes: "Jupiter in the 11th house is one of the most celebrated wealth indicators (Dhana Karaka), expanding gains through ethical and intellectual paths."
  },
  timingOfIncome: {
    title: "Timing and Age Milestones for Financial Gains (Slokas 4-5, 8)",
    english: "Wealth acquisition is activated at specific ages: if the 11th lord is in the 3rd house while the 11th house holds a benefic planet, the native gains major assets (historically 2000 gold coins) in the 36th year. The 11th lord conjunct a benefic in a Kendra/Trikona brings wealth (500 gold coins) in the 40th year. An exchange between the 1st and 11th lords brings wealth (1000 gold coins) in the 33rd year.",
    notes: "Vedic astrology maps major financial expansions to the activation of the 11th lord's energy during specific years of life."
  },
  wealthAfterMarriage: {
    title: "Fortune and Gains Post-Marriage (Sloka 9)",
    english: "If there is an exchange (Parivartana Yoga) between the lords of the 2nd and 11th houses, the native will amass abundant fortunes, lands, and assets after marriage.",
    notes: "The connection of the 2nd (family, finance) and 11th (gains) lords signifies that partnership stabilizes the native's financial fortunes."
  },
  gainsThroughSiblings: {
    title: "Wealth and Benefits through Siblings (Sloka 10)",
    english: "If there is a mutual exchange between the lords of the 3rd (siblings) and 11th (gains) houses, the native will acquire wealth, support, and valuable ornaments through their siblings.",
    notes: "This exchange coordinates sibling actions with the native's profits, ensuring mutual cooperation and joint professional success."
  },
  blockedEarnings: {
    title: "Obstacles in Gains & Zero Profit (Sloka 11)",
    english: "If the 11th lord is in its sign of debilitation, is combust, or resides in the 6th, 8th, or 12th house in conjunction with a malefic planet, the native will face stagnation in earnings and see no profits despite making immense efforts.",
    notes: "Debilitation or dusthana placements of the 11th lord drain profits into debts, losses, or legal disputes, indicating a need for spiritual remedies."
  }
};

export const BPHS_TWELFTH_HOUSE_RULES = {
  righteousExpensesAndLuxuries: {
    title: "Righteous Expenditures & Bed Comforts (Slokas 1-4)",
    english: "If the 12th lord is conjunct a benefic, exalted, or placed in its own house, the native's expenses will be on noble and worthy causes. If the Moon is the 12th lord and is exalted or placed in its own sign or Navamsa, or occupies the 5th, 9th, or 11th house, the native will possess comfortable mansions, fine beds, luxury items, and enjoy deep sleep and physical comforts.",
    notes: "The 12th house rules sleep, bed pleasures (Sayana Sukha), and expenditures. A strong 12th lord or benefic occupancy indicates that resources are spent on productive, luxurious, or charitable avenues."
  },
  domesticStruggles: {
    title: "Domestic Dissatisfaction and Expenditures (Slokas 5-6)",
    english: "If the 12th lord is placed in the 6th, 8th, or 12th house, or occupies an inimical or debilitated Navamsa, the native will experience domestic friction, unexpected expenditures, and lack of general happiness. Placement of the 12th lord in a Kendra or a Trikona guarantees marriage.",
    notes: "Afflicted 12th lord placement in dusthanas indicates that domestic peace is disturbed, whereas its placement in angles supports relationship stability."
  },
  derivativeReadings: {
    title: "Bhavat Bhavam: Derivative Horoscope Analysis (Sloka 7)",
    english: "Just as direct calculations are made from the Ascendant for the native, the health, wealth, and marriage of relatives are calculated from respective reference houses. For example, a sibling's finances are read from the 4th house (2nd from the 3rd), and a father's health is read from the 2nd house (6th from the 9th).",
    notes: "This is a fundamental principle of Vedic astrology, allowing detailed predictions for family members from the native's birth chart."
  },
  visibleVsInvisibleZodiac: {
    title: "Visible vs. Invisible Half of the Zodiac (Sloka 8)",
    english: "Planets placed in the visible half of the zodiac (houses 7 to 12 counted backwards from the Ascendant cusp via the 10th house) yield explicit, public, and manifest results. Planets in the invisible half (houses 1 to 6 counted forwards via the 4th house) yield secret, internal, or unmanifest results.",
    notes: "The visible half represents conscious and outer achievements, while the invisible half corresponds to private, subconscious, or preparatory phases of life."
  },
  spiritualLiberation: {
    title: "Yogas for Spiritual Liberation & Moksha (Sloka 10)",
    english: "If a benefic planet occupies the 12th house while the 12th lord is exalted or is aspected/conjunct by a benefic, the native will attain final spiritual emancipation or Moksha.",
    notes: "The 12th house is the ultimate house of liberation. Exaltation and benefic influences here denote that the soul resolves its karmic debts and moves toward spiritual graduation."
  },
  wanderingVsLocalSuccess: {
    title: "Aimless Wandering vs. Domestic Progress (Slokas 11-12)",
    english: "If the 12th lord and 12th house are afflicted by malefic conjunctions or aspects, the native will wander aimlessly or travel abroad without progress. If the 12th lord and house are aspected or occupied by benefics, the native progresses stably in their own country or travels for constructive gains.",
    notes: "Afflictions to the 12th house indicate displacement, rootlessness, or exile, while benefic aspects represent comfortable travels and local success."
  },
  earningsAndExpenses: {
    title: "Source of Wealth and Charitable Expenses (Slokas 13-14)",
    english: "If Saturn or Mars occupies the 12th house without a benefic aspect, earnings will be through questionable or corrupt measures. If the Ascendant lord is in the 12th house while the 12th lord resides in the Ascendant conjunct Venus, the native's expenses will be on spiritual, religious, or charitable grounds.",
    notes: "The Ascendant lord in the 12th connects self-identity directly with spending, and conjunction with Venus redirects resources to noble or artistic endeavors."
  }
};











