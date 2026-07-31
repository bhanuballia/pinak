import json

file_path = "d:/Astro Consult-Vedic Astrology/Vedic Astrology/frontend/src/data/vimshottariExplanation.json"

with open(file_path, "r", encoding="utf-8") as f:
    current_data = json.load(f)

# If it is already a dictionary, we don't want to double wrap it
if isinstance(current_data, list):
    antardashas = current_data
else:
    antardashas = current_data.get("antardashas", [])

pratyantar_effects = [
  {
    "id": "pd-surya-surya",
    "major": "Sūrya",
    "sub": "Sūrya",
    "verses": "1-2",
    "effects": "Argument with other persons, loss of wealth, distress to wife, headache etc. Sūrya-Sūrya (Pratyantar Dasha of Sūrya in the Antar Dasha of Sūrya). General effects. Such inauspicious effects will not be produced, if Sūrya is in a Trikon etc., if Sūrya is the Lord of an auspicious Bhava, or is in an auspicious Bhava and in a benefic Varg. All other Pratyanta effects should be judged in this manner."
  },
  {
    "id": "pd-surya-candr",
    "major": "Sūrya",
    "sub": "Candr",
    "verses": "3",
    "effects": "Excitement, quarrels, loss of wealth, mental agony etc."
  },
  {
    "id": "pd-surya-mangal",
    "major": "Sūrya",
    "sub": "Mangal",
    "verses": "4",
    "effects": "Danger from the king and from weapons, imprisonment and distress from enemies and fire."
  },
  {
    "id": "pd-surya-rahu",
    "major": "Sūrya",
    "sub": "Rahu",
    "verses": "5",
    "effects": "Disorder of phlegm, danger from weapons, loss of wealth, destruction of a kingdom and mental agony."
  },
  {
    "id": "pd-surya-guru",
    "major": "Sūrya",
    "sub": "Guru",
    "verses": "6",
    "effects": "Victory, increase in wealth, gains of gold, garments, conveyances etc."
  },
  {
    "id": "pd-surya-sani",
    "major": "Sūrya",
    "sub": "Śani",
    "verses": "7",
    "effects": "Loss of wealth, distress to cattle, excitement, diseases etc."
  },
  {
    "id": "pd-surya-budh",
    "major": "Sūrya",
    "sub": "Budh",
    "verses": "8",
    "effects": "Affectionate relations with kinsmen, availability of good food, gains of wealth, religious-mindedness, reverence from the king."
  },
  {
    "id": "pd-surya-ketu",
    "major": "Sūrya",
    "sub": "Ketu",
    "verses": "9",
    "effects": "Danger to life, loss of wealth, danger from the king, trouble with enemies."
  },
  {
    "id": "pd-surya-sukr",
    "major": "Sūrya",
    "sub": "Śukr",
    "verses": "10",
    "effects": "Moderate effects, or some gains of wealth may be expected."
  },
  {
    "id": "pd-candr-candr",
    "major": "Chandra",
    "sub": "Candr",
    "verses": "11",
    "effects": "Acquisition of land, wealth and property, reverence from the king and availability of sweetish preparations."
  },
  {
    "id": "pd-candr-mangal",
    "major": "Chandra",
    "sub": "Mangal",
    "verses": "12",
    "effects": "Wisdom and discretion, reverence from the people, increase in wealth, enjoyments to kinsmen, but there will be danger from an enemy."
  },
  {
    "id": "pd-candr-rahu",
    "major": "Chandra",
    "sub": "Rahu",
    "verses": "13",
    "effects": "Well-being, gain of wealth from the king and danger of death, if Rahu is yuti with a malefic."
  },
  {
    "id": "pd-candr-guru",
    "major": "Chandra",
    "sub": "Guru",
    "verses": "14",
    "effects": "Enjoyments, increase in dignity and glory, gain of knowledge through the preceptor, acquisition of a kingdom and acquisition of gems etc."
  },
  {
    "id": "pd-candr-sani",
    "major": "Chandra",
    "sub": "Śani",
    "verses": "15",
    "effects": "Bilious troubles, loss of wealth and name and fame."
  },
  {
    "id": "pd-candr-budh",
    "major": "Chandra",
    "sub": "Budh",
    "verses": "16",
    "effects": "Birth of a son, acquisition of a horse and other conveyances, success in education, progress, gain of white garments and grains."
  },
  {
    "id": "pd-candr-ketu",
    "major": "Chandra",
    "sub": "Ketu",
    "verses": "17",
    "effects": "Quarrels with Brahmins, fear of premature death, loss of happiness and distress all-round."
  },
  {
    "id": "pd-candr-sukr",
    "major": "Chandra",
    "sub": "Śukr",
    "verses": "18",
    "effects": "Gain of wealth, enjoyments, birth of a daughter, availability of sweet preparations and cordial relations with all."
  },
  {
    "id": "pd-candr-surya",
    "major": "Chandra",
    "sub": "Sūrya",
    "verses": "19",
    "effects": "Gain of happiness, grains and garments, victories everywhere."
  },
  {
    "id": "pd-mangal-mangal",
    "major": "Mangal",
    "sub": "Mangal",
    "verses": "20",
    "effects": "Danger from enemies, quarrels and fear of premature death on account of blood diseases."
  },
  {
    "id": "pd-mangal-rahu",
    "major": "Mangal",
    "sub": "Rahu",
    "verses": "21",
    "effects": "Destruction of wealth and kingdom (fall of government), unpalatable food and quarrels with the enemy."
  },
  {
    "id": "pd-mangal-guru",
    "major": "Mangal",
    "sub": "Guru",
    "verses": "22",
    "effects": "Loss of intelligence, distress, sorrows to children, fear of premature death, negligence, quarrels and no fulfillment of any ambition."
  },
  {
    "id": "pd-mangal-sani",
    "major": "Mangal",
    "sub": "Śani",
    "verses": "23",
    "effects": "Destruction of the employer, distress, loss of wealth, danger from enemies, anxiety, quarrels and sorrows."
  },
  {
    "id": "pd-mangal-budh",
    "major": "Mangal",
    "sub": "Budh",
    "verses": "24",
    "effects": "Loss of intelligence, loss of wealth, fevers and loss of grains, garments and friends."
  },
  {
    "id": "pd-mangal-ketu",
    "major": "Mangal",
    "sub": "Ketu",
    "verses": "25",
    "effects": "Distress from diseases, lethargy, premature death, danger from the king and weapons."
  },
  {
    "id": "pd-mangal-sukr",
    "major": "Mangal",
    "sub": "Śukr",
    "verses": "26",
    "effects": "Distress from Chandal, sorrows, danger from the king and from weapons, dysentery and vomiting."
  },
  {
    "id": "pd-mangal-surya",
    "major": "Mangal",
    "sub": "Sūrya",
    "verses": "27",
    "effects": "Increase in landed property and wealth, satisfaction, visits of friends, happiness all-round."
  },
  {
    "id": "pd-mangal-candr",
    "major": "Mangal",
    "sub": "Candr",
    "verses": "28",
    "effects": "Gains of white garments etc. from the southern direction, success in all ventures."
  },
  {
    "id": "pd-rahu-rahu",
    "major": "Rahu",
    "sub": "Rahu",
    "verses": "29",
    "effects": "Imprisonment, disease, danger of injuries from weapons."
  },
  {
    "id": "pd-rahu-guru",
    "major": "Rahu",
    "sub": "Guru",
    "verses": "30",
    "effects": "Reverence everywhere, acquisition of conveyances, like elephants etc., gain of wealth."
  },
  {
    "id": "pd-rahu-sani",
    "major": "Rahu",
    "sub": "Śani",
    "verses": "31",
    "effects": "Rigorous imprisonment, loss of enjoyments, danger from enemies, affliction with rheumatism."
  },
  {
    "id": "pd-rahu-budh",
    "major": "Rahu",
    "sub": "Budh",
    "verses": "32",
    "effects": "Gain in all ventures, abnormal gain through wife."
  },
  {
    "id": "pd-rahu-ketu",
    "major": "Rahu",
    "sub": "Ketu",
    "verses": "33",
    "effects": "Loss of intelligence, danger from enemies, obstacles, loss of wealth, quarrels, excitement."
  },
  {
    "id": "pd-rahu-sukr",
    "major": "Rahu",
    "sub": "Śukr",
    "verses": "34",
    "effects": "Danger from a Yogini, danger from the king, loss of conveyances, availability of unpalatable food, loss of a wife, sorrow in the family."
  },
  {
    "id": "pd-rahu-surya",
    "major": "Rahu",
    "sub": "Sūrya",
    "verses": "35",
    "effects": "Danger from enemies, fevers, distress to children, fear of premature death, negligence."
  },
  {
    "id": "pd-rahu-candr",
    "major": "Rahu",
    "sub": "Candr",
    "verses": "36",
    "effects": "Excitement, quarrels, worries, loss of reputation, fear, distress to father."
  },
  {
    "id": "pd-rahu-mangal",
    "major": "Rahu",
    "sub": "Mangal",
    "verses": "37",
    "effects": "Septic boil in the anus (Bhagandhar), distress, due to a bite and pollution of blood, loss of wealth, excitement."
  },
  {
    "id": "pd-guru-guru",
    "major": "Guru",
    "sub": "Guru",
    "verses": "38",
    "effects": "Acquisition of gold, increase in wealth etc."
  },
  {
    "id": "pd-guru-sani",
    "major": "Guru",
    "sub": "Śani",
    "verses": "39",
    "effects": "Increase in lands, conveyances and grains."
  },
  {
    "id": "pd-guru-budh",
    "major": "Guru",
    "sub": "Budh",
    "verses": "40",
    "effects": "Success in the educational sphere, acquisition of clothes and gems, like pearls etc., visits of friends."
  },
  {
    "id": "pd-guru-ketu",
    "major": "Guru",
    "sub": "Ketu",
    "verses": "41",
    "effects": "Danger from water and thieves."
  },
  {
    "id": "pd-guru-sukr",
    "major": "Guru",
    "sub": "Śukr",
    "verses": "42",
    "effects": "Several kinds of learning, gain of gold, clothes, ornaments, well-being and satisfaction."
  },
  {
    "id": "pd-guru-surya",
    "major": "Guru",
    "sub": "Sūrya",
    "verses": "43",
    "effects": "Gain from the king, friends and parents, reverence everywhere."
  },
  {
    "id": "pd-guru-candr",
    "major": "Guru",
    "sub": "Candr",
    "verses": "44",
    "effects": "No distress, gain of wealth and conveyances, success in ventures."
  },
  {
    "id": "pd-guru-mangal",
    "major": "Guru",
    "sub": "Mangal",
    "verses": "45",
    "effects": "Danger from weapons, pain in anus, burning in the stomach, indigestion, distress from enemies."
  },
  {
    "id": "pd-guru-rahu",
    "major": "Guru",
    "sub": "Rahu",
    "verses": "46",
    "effects": "Antagonism with menials (Chandaldhi) and loss of wealth and distress through them."
  },
  {
    "id": "pd-sani-sani",
    "major": "Śani",
    "sub": "Śani",
    "verses": "47",
    "effects": "Physical distress, quarrels, danger from menials."
  },
  {
    "id": "pd-sani-budh",
    "major": "Śani",
    "sub": "Budh",
    "verses": "48",
    "effects": "Loss of intelligence, quarrels, dangers, anxiety about availability of food, loss of wealth, danger from enemy."
  },
  {
    "id": "pd-sani-ketu",
    "major": "Śani",
    "sub": "Ketu",
    "verses": "49",
    "effects": "Imprisonment in the camp of the enemy, loss of luster, hunger, anxiety and agony."
  },
  {
    "id": "pd-sani-sukr",
    "major": "Śani",
    "sub": "Śukr",
    "verses": "50",
    "effects": "Fulfillment of ambitions, well-being in the family, success in ventures and gains therefrom."
  },
  {
    "id": "pd-sani-surya",
    "major": "Śani",
    "sub": "Sūrya",
    "verses": "51",
    "effects": "Conferment of authority by the king, quarrels in the family, fevers."
  },
  {
    "id": "pd-sani-candr",
    "major": "Śani",
    "sub": "Candr",
    "verses": "52",
    "effects": "Development of intelligence, inauguration of big a venture, loss of luster, extravagant expenditure, association with many women."
  },
  {
    "id": "pd-sani-mangal",
    "major": "Śani",
    "sub": "Mangal",
    "verses": "53",
    "effects": "Loss of valour, distress to son, danger from fire and enemy, distress from bile and wind."
  },
  {
    "id": "pd-sani-rahu",
    "major": "Śani",
    "sub": "Rahu",
    "verses": "54",
    "effects": "Loss of wealth, clothes, land, going away to foreign lands, fear of death."
  },
  {
    "id": "pd-sani-guru",
    "major": "Śani",
    "sub": "Guru",
    "verses": "55",
    "effects": "Inability to prevent losses, caused by women, quarrels, excitement."
  },
  {
    "id": "pd-budh-budh",
    "major": "Budh",
    "sub": "Budh",
    "verses": "56",
    "effects": "Gain of intelligence, education, wealth, clothes etc."
  },
  {
    "id": "pd-budh-ketu",
    "major": "Budh",
    "sub": "Ketu",
    "verses": "57",
    "effects": "Coarse food, stomach troubles, eye troubles, distress from bilious and blood disorders."
  },
  {
    "id": "pd-budh-sukr",
    "major": "Budh",
    "sub": "Śukr",
    "verses": "58",
    "effects": "Gains from a northern direction, loss of cattle, acquisition of authority from government."
  },
  {
    "id": "pd-budh-surya",
    "major": "Budh",
    "sub": "Sūrya",
    "verses": "59",
    "effects": "Loss of splendour and distress through diseases, distress in the heart."
  },
  {
    "id": "pd-budh-candr",
    "major": "Budh",
    "sub": "Candr",
    "verses": "60",
    "effects": "Marriage, gain of wealth and property, birth of a daughter, enjoyments all-round."
  },
  {
    "id": "pd-budh-mangal",
    "major": "Budh",
    "sub": "Mangal",
    "verses": "61",
    "effects": "Religious-mindedness, increase in wealth, danger from fire and enemies, gain of red clothes, injury from a weapon."
  },
  {
    "id": "pd-budh-rahu",
    "major": "Budh",
    "sub": "Rahu",
    "verses": "62",
    "effects": "Quarrels, danger from wife, or some other woman, danger from the king."
  },
  {
    "id": "pd-budh-guru",
    "major": "Budh",
    "sub": "Guru",
    "verses": "63",
    "effects": "Acquisition of a kingdom, conferment of authority by the king, reverence from the king, education, intelligence."
  },
  {
    "id": "pd-budh-sani",
    "major": "Budh",
    "sub": "Śani",
    "verses": "64",
    "effects": "Bilious and windy troubles, injuries to the body, loss of wealth."
  },
  {
    "id": "pd-ketu-ketu",
    "major": "Ketu",
    "sub": "Ketu",
    "verses": "65",
    "effects": "Sudden disaster, going away to foreign lands, loss of wealth."
  },
  {
    "id": "pd-ketu-sukr",
    "major": "Ketu",
    "sub": "Śukr",
    "verses": "66",
    "effects": "Loss of wealth through a non-Hindu king, eye troubles, headache, loss of cattle."
  },
  {
    "id": "pd-ketu-surya",
    "major": "Ketu",
    "sub": "Sūrya",
    "verses": "67",
    "effects": "Antagonism with friends, premature death, defeat, exchange of arguments."
  },
  {
    "id": "pd-ketu-candr",
    "major": "Ketu",
    "sub": "Candr",
    "verses": "68",
    "effects": "Loss of grains, physical distress, misunderstanding, dysentery."
  },
  {
    "id": "pd-ketu-mangal",
    "major": "Ketu",
    "sub": "Mangal",
    "verses": "69",
    "effects": "Injury from weapons, distress from fire, danger from menials and enemies."
  },
  {
    "id": "pd-ketu-rahu",
    "major": "Ketu",
    "sub": "Rahu",
    "verses": "70",
    "effects": "Danger from women and enemies, distress, caused by menials."
  },
  {
    "id": "pd-ketu-guru",
    "major": "Ketu",
    "sub": "Guru",
    "verses": "71",
    "effects": "Loss of friends, wealth and garments, opprobrium in the house, troubles from everywhere."
  },
  {
    "id": "pd-ketu-sani",
    "major": "Ketu",
    "sub": "Śani",
    "verses": "72",
    "effects": "Death of cattle and friends, physical distress, very meagre gain of wealth."
  },
  {
    "id": "pd-ketu-budh",
    "major": "Ketu",
    "sub": "Budh",
    "verses": "73",
    "effects": "Loss of understanding, excitement, failure in education, dangers, failure in all ventures."
  },
  {
    "id": "pd-sukr-sukr",
    "major": "Śukr",
    "sub": "Śukr",
    "verses": "74",
    "effects": "Gains of white clothes, conveyances, gems, like pearls etc., association with beautiful damsel."
  },
  {
    "id": "pd-sukr-surya",
    "major": "Śukr",
    "sub": "Sūrya",
    "verses": "75",
    "effects": "Rheumatic fever, headache, danger from the king and enemies and meagre gain of wealth."
  },
  {
    "id": "pd-sukr-candr",
    "major": "Śukr",
    "sub": "Candr",
    "verses": "76",
    "effects": "Birth of a daughter, gain of clothes etc. from the king, acquisition of authority."
  },
  {
    "id": "pd-sukr-mangal",
    "major": "Śukr",
    "sub": "Mangal",
    "verses": "77",
    "effects": "Blood and bile troubles, quarrels, many kinds of distresses."
  },
  {
    "id": "pd-sukr-rahu",
    "major": "Śukr",
    "sub": "Rahu",
    "verses": "78",
    "effects": "Quarrels with wife, danger, distress from the king and enemies."
  },
  {
    "id": "pd-sukr-guru",
    "major": "Śukr",
    "sub": "Guru",
    "verses": "79",
    "effects": "Acquisition of kingdom, wealth, garments, gems, ornaments and conveyance, like elephants etc."
  },
  {
    "id": "pd-sukr-sani",
    "major": "Śukr",
    "sub": "Śani",
    "verses": "80",
    "effects": "Acquisition of donkey, camel, goat, iron, grains, sesame seeds, physical pains."
  },
  {
    "id": "pd-sukr-budh",
    "major": "Śukr",
    "sub": "Budh",
    "verses": "81",
    "effects": "Gains of wealth, knowledge, authority from the king, gain of money, distributed by others."
  },
  {
    "id": "pd-sukr-ketu",
    "major": "Śukr",
    "sub": "Ketu",
    "verses": "82",
    "effects": "Premature death, going away from homeland, gains of wealth at times."
  }
]

output_data = {
    "antardashas": antardashas,
    "pratyantardashas": pratyantar_effects
}

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

print("Successfully converted Vimshottari JSON to hierarchical schema!")
