import json

file_path = "d:/Astro Consult-Vedic Astrology/Vedic Astrology/frontend/src/data/vimshottariExplanation.json"

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Ensure data is in the hierarchical format
if isinstance(data, list):
    antardashas = data
    pratyantardashas = []
else:
    antardashas = data.get("antardashas", [])
    pratyantardashas = data.get("pratyantardashas", [])

sukshma_effects = [
  {
    "id": "sd-surya-surya",
    "major": "Sūrya",
    "sub": "Sūrya",
    "verses": "1-2",
    "effects": "Going away from homeland, danger of death, loss of position, losses all round. Sūrya-Sūrya (Sukshm Dasha of Sūrya in Pratyantar Dasha of Sūrya)."
  },
  {
    "id": "sd-surya-candr",
    "major": "Sūrya",
    "sub": "Candr",
    "verses": "3",
    "effects": "Devotion towards deities and Brahmins, interest in pious deeds, affectionate relations with friends."
  },
  {
    "id": "sd-surya-mangal",
    "major": "Sūrya",
    "sub": "Mangal",
    "verses": "4",
    "effects": "Indulgence in sinful deeds, distress from cruel enemies, bleeding."
  },
  {
    "id": "sd-surya-rahu",
    "major": "Sūrya",
    "sub": "Rahu",
    "verses": "5",
    "effects": "Danger from thieves, fire and poison, defeat in war, religious inclination."
  },
  {
    "id": "sd-surya-guru",
    "major": "Sūrya",
    "sub": "Guru",
    "verses": "6",
    "effects": "Recognition by government, respected by government employees, becoming favourite of the king."
  },
  {
    "id": "sd-surya-sani",
    "major": "Sūrya",
    "sub": "Śani",
    "verses": "7",
    "effects": "Causing trouble to respected persons and Brahmins by theft and by other bold deeds, going away from ones own place, mental agony."
  },
  {
    "id": "sd-surya-budh",
    "major": "Sūrya",
    "sub": "Budh",
    "verses": "8",
    "effects": "Gains of fancy garments, association with a beautiful damsel, sudden success in ventures."
  },
  {
    "id": "sd-surya-ketu",
    "major": "Sūrya",
    "sub": "Ketu",
    "verses": "9",
    "effects": "Achievement of glory through wife and employees, loss of wealth, comforts from servants."
  },
  {
    "id": "sd-surya-sukr",
    "major": "Sūrya",
    "sub": "Śukr",
    "verses": "10",
    "effects": "Happiness from son, friends and wife, acquisition of many kinds of properties."
  },
  {
    "id": "sd-candr-candr",
    "major": "Chandra",
    "sub": "Candr",
    "verses": "11",
    "effects": "Gain of ornaments and land, reverence, recognition from the king, anger, glory."
  },
  {
    "id": "sd-candr-mangal",
    "major": "Chandra",
    "sub": "Mangal",
    "verses": "12",
    "effects": "Distress, antagonism with the enemy, stomach troubles, death of father, troubles, due to imbalance of wind and bile."
  },
  {
    "id": "sd-candr-rahu",
    "major": "Chandra",
    "sub": "Rahu",
    "verses": "13",
    "effects": "Disharmony with friends and kinsmen, going away from homeland, loss of wealth, imprisonment."
  },
  {
    "id": "sd-candr-guru",
    "major": "Chandra",
    "sub": "Guru",
    "verses": "14",
    "effects": "Opulence and glory with royal symbols, birth of a son, gain of property, enjoyments all-round."
  },
  {
    "id": "sd-candr-sani",
    "major": "Chandra",
    "sub": "Śani",
    "verses": "15",
    "effects": "Wrath of the king, loss of wealth in business dealings, danger from thieves and Brahmins."
  },
  {
    "id": "sd-candr-budh",
    "major": "Chandra",
    "sub": "Budh",
    "verses": "16",
    "effects": "Reverence from the king, gain of wealth, gain of conveyance from a foreign land, increase in the number of children."
  },
  {
    "id": "sd-candr-ketu",
    "major": "Chandra",
    "sub": "Ketu",
    "verses": "17",
    "effects": "Loss in the livelihood, earned by sale etc., grains, medicines, cattle etc., danger from fire and the sun's rays (sun-stroke)."
  },
  {
    "id": "sd-candr-sukr",
    "major": "Chandra",
    "sub": "Śukr",
    "verses": "18",
    "effects": "Marriage, gain of a kingdom, land, garments, ornaments, reputation etc."
  },
  {
    "id": "sd-candr-surya",
    "major": "Chandra",
    "sub": "Sūrya",
    "verses": "19",
    "effects": "Troubles, losses in ventures, destruction of grains and cattle, physical distress."
  },
  {
    "id": "sd-mangal-mangal",
    "major": "Mangal",
    "sub": "Mangal",
    "verses": "20",
    "effects": "Sorrows on account of loss of lands, epilepsy, imprisonment, unhappiness."
  },
  {
    "id": "sd-mangal-rahu",
    "major": "Mangal",
    "sub": "Rahu",
    "verses": "21",
    "effects": "Physical distress, danger from the people (due to unpopularity), loss of wife and children, danger from fire."
  },
  {
    "id": "sd-mangal-guru",
    "major": "Mangal",
    "sub": "Guru",
    "verses": "22",
    "effects": "Devotion towards deities, Mantra Siddhi, reverence from the people, enjoyments."
  },
  {
    "id": "sd-mangal-sani",
    "major": "Mangal",
    "sub": "Śani",
    "verses": "23",
    "effects": "Release from imprisonment, happiness on account of wealth, gains of clothes and servants."
  },
  {
    "id": "sd-mangal-budh",
    "major": "Mangal",
    "sub": "Budh",
    "verses": "24",
    "effects": "Comforts of Chatr, Chamar etc. (receiving respect, as that of a king), breathing troubles."
  },
  {
    "id": "sd-mangal-ketu",
    "major": "Mangal",
    "sub": "Ketu",
    "verses": "25",
    "effects": "Indulgence in undesirable deeds at the instance of others, one always remains filthy."
  },
  {
    "id": "sd-mangal-sukr",
    "major": "Mangal",
    "sub": "Śukr",
    "verses": "26",
    "effects": "Enjoyment with women of choice, gain of wealth, food etc."
  },
  {
    "id": "sd-mangal-surya",
    "major": "Mangal",
    "sub": "Sūrya",
    "verses": "27",
    "effects": "Wrath of the king, distress through Brahmins, failure in ventures, odium in public (Loka Nindha)."
  },
  {
    "id": "sd-mangal-candr",
    "major": "Mangal",
    "sub": "Candr",
    "verses": "28",
    "effects": "Piousness, gain of wealth, devotion towards deities and Brahmins, danger from diseases."
  },
  {
    "id": "sd-rahu-rahu",
    "major": "Rahu",
    "sub": "Rahu",
    "verses": "29",
    "effects": "Tendering to create turbulence by people, lack of wisdom in performance of duties, affliction of the mind."
  },
  {
    "id": "sd-rahu-guru",
    "major": "Rahu",
    "sub": "Guru",
    "verses": "30",
    "effects": "Affliction with a chronic disease, poverty, but revered by the people and the religious-mindedness."
  },
  {
    "id": "sd-rahu-sani",
    "major": "Rahu",
    "sub": "Śani",
    "verses": "31",
    "effects": "Gain of wealth through unfair means, wicked, or mean nature, performing other person's duties, undesirable association."
  },
  {
    "id": "sd-rahu-budh",
    "major": "Rahu",
    "sub": "Budh",
    "verses": "32",
    "effects": "Increase in desires for sexual acts with women, eloquence, hunger, physical distress."
  },
  {
    "id": "sd-rahu-ketu",
    "major": "Rahu",
    "sub": "Ketu",
    "verses": "33",
    "effects": "Politeness, loss of reputation, imprisonment, cold heartedness, loss of public money."
  },
  {
    "id": "sd-rahu-sukr",
    "major": "Rahu",
    "sub": "Śukr",
    "verses": "34",
    "effects": "Freedom from imprisonment, gain of position and wealth."
  },
  {
    "id": "sd-rahu-surya",
    "major": "Rahu",
    "sub": "Sūrya",
    "verses": "35",
    "effects": "Settling down in foreign lands, affliction with Gulma, even temperament, comforts of conveyances."
  },
  {
    "id": "sd-rahu-candr",
    "major": "Rahu",
    "sub": "Candr",
    "verses": "36",
    "effects": "Gain of gems (money), wealth, education, attachment to prayers, good behavior and devotion towards deities."
  },
  {
    "id": "sd-rahu-mangal",
    "major": "Rahu",
    "sub": "Mangal",
    "verses": "37",
    "effects": "Fleeing after defeat, anger, imprisonment, indulgence in thefts and stealing."
  },
  {
    "id": "sd-guru-guru",
    "major": "Guru",
    "sub": "Guru",
    "verses": "38",
    "effects": "Banishment of sorrows, increase in wealth, performing Havan, devotion to Lord Shiva, gains of conveyance, marked with royal symbols."
  },
  {
    "id": "sd-guru-sani",
    "major": "Guru",
    "sub": "Śani",
    "verses": "39",
    "effects": "Obstacles in fasting, agony, foreign journeys, loss of wealth, antagonism with kinsmen."
  },
  {
    "id": "sd-guru-budh",
    "major": "Guru",
    "sub": "Budh",
    "verses": "40",
    "effects": "Success in education, increase in intelligence, reverence from the people (popularity), gains of wealth, all sorts of enjoyments and comforts at home."
  },
  {
    "id": "sd-guru-ketu",
    "major": "Guru",
    "sub": "Ketu",
    "verses": "41",
    "effects": "Knowledge, glory, learning, study of Shastras, worship of Lord Shiva, Havan, devotion toward preceptor."
  },
  {
    "id": "sd-guru-sukr",
    "major": "Guru",
    "sub": "Śukr",
    "verses": "42",
    "effects": "Recovery from diseases, enjoyments, gain of wealth, happiness from wife and children."
  },
  {
    "id": "sd-guru-surya",
    "major": "Guru",
    "sub": "Sūrya",
    "verses": "43",
    "effects": "Troubles of wind and bile, stomach pains through imbalance of phlegm and Rasas."
  },
  {
    "id": "sd-guru-candr",
    "major": "Guru",
    "sub": "Candr",
    "verses": "44",
    "effects": "Glory with umbrella with royal symbols, celebrations on the birth of a son, distress in eyes and stomach."
  },
  {
    "id": "sd-guru-mangal",
    "major": "Guru",
    "sub": "Mangal",
    "verses": "45",
    "effects": "Administration of poison by wife, imprisonment, danger from diseases, going away to foreign lands, confusion and misunderstandings."
  },
  {
    "id": "sd-guru-rahu",
    "major": "Guru",
    "sub": "Rahu",
    "verses": "46",
    "effects": "Danger from thieves, snakes and scorpions, diseases and distress."
  },
  {
    "id": "sd-sani-sani",
    "major": "Śani",
    "sub": "Śani",
    "verses": "47",
    "effects": "Loss of wealth, diseases, like rheumatism etc., destruction of the family, taking meals separately from the family, full of sorrows."
  },
  {
    "id": "sd-sani-budh",
    "major": "Śani",
    "sub": "Budh",
    "verses": "48",
    "effects": "Profits in business, progress in education, increase in wealth and lands."
  },
  {
    "id": "sd-sani-ketu",
    "major": "Śani",
    "sub": "Ketu",
    "verses": "49",
    "effects": "Turbulence by thieves, leprosy, loss of livelihood, physical pains."
  },
  {
    "id": "sd-sani-sukr",
    "major": "Śani",
    "sub": "Śukr",
    "verses": "50",
    "effects": "Opulence and glory, learning the use of weapons, birth of a son, coronation, good health and fulfillment of all ambitions."
  },
  {
    "id": "sd-sani-surya",
    "major": "Śani",
    "sub": "Sūrya",
    "verses": "51",
    "effects": "Wrath of the king, quarrels in the family, physical distress."
  },
  {
    "id": "sd-sani-candr",
    "major": "Śani",
    "sub": "Candr",
    "verses": "52",
    "effects": "Development of intelligence, inauguration of a big project, loss of luster, extravagance, happiness from wife and children."
  },
  {
    "id": "sd-sani-mangal",
    "major": "Śani",
    "sub": "Mangal",
    "verses": "53",
    "effects": "Loss of luster, excitement, burning in the stomach, misunderstanding, quarrels and wind and bile disorders."
  },
  {
    "id": "sd-sani-rahu",
    "major": "Śani",
    "sub": "Rahu",
    "verses": "54",
    "effects": "Death of parents, agony, extravagance, failure in ventures."
  },
  {
    "id": "sd-sani-guru",
    "major": "Śani",
    "sub": "Guru",
    "verses": "55",
    "effects": "Acquisition of gold coins, reverence from the public, increase in wealth and grains, acquisition of Chatr with royal symbols."
  },
  {
    "id": "sd-budh-budh",
    "major": "Budh",
    "sub": "Budh",
    "verses": "56",
    "effects": "Dawn of fortune, reverence from the king, increase in wealth and property and affectionate relations with all."
  },
  {
    "id": "sd-budh-ketu",
    "major": "Budh",
    "sub": "Ketu",
    "verses": "57",
    "effects": "Danger from fire, agony, distress to wife, coarse food and immoral tendencies."
  },
  {
    "id": "sd-budh-sukr",
    "major": "Budh",
    "sub": "Śukr",
    "verses": "58",
    "effects": "Gain of conveyances, wealth, grains, produced in water, good repute and enjoyments."
  },
  {
    "id": "sd-budh-surya",
    "major": "Budh",
    "sub": "Sūrya",
    "verses": "59",
    "effects": "Injuries, wrath of the king, confusion in the mind, diseases, loss of wealth, ridicule in public."
  },
  {
    "id": "sd-budh-candr",
    "major": "Budh",
    "sub": "Candr",
    "verses": "60",
    "effects": "Good fortune, stability of mind, reverence from the king, gains of property, visits of friends and the preceptor."
  },
  {
    "id": "sd-budh-mangal",
    "major": "Budh",
    "sub": "Mangal",
    "verses": "61",
    "effects": "Danger from fire and poison, idiocy, poverty, confusion of mind, excitement."
  },
  {
    "id": "sd-budh-rahu",
    "major": "Budh",
    "sub": "Rahu",
    "verses": "62",
    "effects": "Danger from fire and snakes and the victory over an enemy (with difficulty), opprobrium from goblins."
  },
  {
    "id": "sd-budh-guru",
    "major": "Budh",
    "sub": "Guru",
    "verses": "63",
    "effects": "Construction of a house, interest in charities, comforts and enjoyments, increase in opulence, gain of wealth from the king."
  },
  {
    "id": "sd-budh-sani",
    "major": "Budh",
    "sub": "Śani",
    "verses": "64",
    "effects": "Profits in business, progress in education and increase in wealth, marriage, circumambience of comprehensiveness."
  },
  {
    "id": "sd-ketu-ketu",
    "major": "Ketu",
    "sub": "Ketu",
    "verses": "65",
    "effects": "Happiness from wife and children, physical troubles, poverty, begging."
  },
  {
    "id": "sd-ketu-sukr",
    "major": "Ketu",
    "sub": "Śukr",
    "verses": "66",
    "effects": "Freedom from diseases, gains of wealth, devotion towards Brahmins and the preceptor, union with members of the family."
  },
  {
    "id": "sd-ketu-surya",
    "major": "Ketu",
    "sub": "Sūrya",
    "verses": "67",
    "effects": "Quarrels, loss of land, residence in foreign lands, disaster upon friends."
  },
  {
    "id": "sd-ketu-candr",
    "major": "Ketu",
    "sub": "Candr",
    "verses": "68",
    "effects": "Promotion in service, victory in war, good reputation in public."
  },
  {
    "id": "sd-ketu-mangal",
    "major": "Ketu",
    "sub": "Mangal",
    "verses": "69",
    "effects": "Danger of falling down from a horse etc., distress from thieves and the wicked, suffering from Gulma and headache."
  },
  {
    "id": "sd-ketu-rahu",
    "major": "Ketu",
    "sub": "Rahu",
    "verses": "70",
    "effects": "Destruction of wife, father etc., defamation, due to association with a wicked woman, vomiting, blood pollution, bilious diseases."
  },
  {
    "id": "sd-ketu-guru",
    "major": "Ketu",
    "sub": "Guru",
    "verses": "71",
    "effects": "Antagonism with the enemy, increase in property and opulence, distress, due to losses in cattle, wealth and agricultural production."
  },
  {
    "id": "sd-ketu-sani",
    "major": "Ketu",
    "sub": "Śani",
    "verses": "72",
    "effects": "Imaginary distress, little comfort, fasting, antagonism with wife, indulgence in falsehood."
  },
  {
    "id": "sd-ketu-budh",
    "major": "Ketu",
    "sub": "Budh",
    "verses": "73",
    "effects": "Union and separation from many kinds of people, distress to the enemy, increase in wealth and property."
  },
  {
    "id": "sd-sukr-sukr",
    "major": "Śukr",
    "sub": "Śukr",
    "verses": "74",
    "effects": "Destruction of enemies, enjoyments, construction of temples of Lord Shiva etc. and reservoirs."
  },
  {
    "id": "sd-sukr-surya",
    "major": "Śukr",
    "sub": "Sūrya",
    "verses": "75",
    "effects": "Agony in mind and heart, confusion of mind, wanderings, both losses and gains at different times."
  },
  {
    "id": "sd-sukr-candr",
    "major": "Śukr",
    "sub": "Candr",
    "verses": "76",
    "effects": "Sound health, increase in wealth, success in ventures through business dealings, progress in education and increase of intelligence."
  },
  {
    "id": "sd-sukr-mangal",
    "major": "Śukr",
    "sub": "Mangal",
    "verses": "77",
    "effects": "Idiocy, danger from an enemy, going away from one's homeland, danger from diseases."
  },
  {
    "id": "sd-sukr-rahu",
    "major": "Śukr",
    "sub": "Rahu",
    "verses": "78",
    "effects": "Danger from fire and snakes, destruction of kinsmen, resignation from position (service etc.)."
  },
  {
    "id": "sd-sukr-guru",
    "major": "Śukr",
    "sub": "Guru",
    "verses": "79",
    "effects": "Success in ventures, increase in wealth and agricultural production, abnormal profits from purchase and sale business."
  },
  {
    "id": "sd-sukr-sani",
    "major": "Śukr",
    "sub": "Śani",
    "verses": "80",
    "effects": "Distress from an enemy, sorrows, destruction of cattle, loss of persons, belonging to the Gotra of the native and elders (preceptors)."
  },
  {
    "id": "sd-sukr-budh",
    "major": "Śukr",
    "sub": "Budh",
    "verses": "81",
    "effects": "Increase in wealth with the assistance of kinsmen, gain of wealth through business, happiness from wife and children."
  },
  {
    "id": "sd-sukr-ketu",
    "major": "Śukr",
    "sub": "Ketu",
    "verses": "82",
    "effects": "Danger from fire, distress from diseases, distress in mouth, eyes and forehead, loss of accumulated wealth, mental agony."
  }
]

output_data = {
    "antardashas": antardashas,
    "pratyantardashas": pratyantardashas,
    "sukshmantardashas": sukshma_effects
}

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

print("Successfully updated JSON with Sukshmantar Dasha items!")
