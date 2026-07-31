import json

file_path = "d:/Astro Consult-Vedic Astrology/Vedic Astrology/frontend/src/data/vimshottariExplanation.json"

# Load current json containing the 9 Mahadasha -> Antardasha items
with open(file_path, "r", encoding="utf-8") as f:
    explanation_data = json.load(f)

# Let's define the pratyantar data structure
pratyantar_effects = [
  {
    "major": "Sūrya",
    "sub": "Sūrya",
    "effects": "Argument with other persons, loss of wealth, distress to wife, headache etc. The above are general effects. Such inauspicious effects will not be produced, if Sūrya is in a Trikon etc., if Sūrya is the Lord of an auspicious Bhava, or is in an auspicious Bhava and in a benefic Varg. All other Pratyanta effects should be judged in this manner."
  },
  {
    "major": "Sūrya",
    "sub": "Candr",
    "effects": "Excitement, quarrels, loss of wealth, mental agony etc."
  },
  {
    "major": "Sūrya",
    "sub": "Mangal",
    "effects": "Danger from the king and from weapons, imprisonment and distress from enemies and fire."
  },
  {
    "major": "Sūrya",
    "sub": "Rahu",
    "effects": "Disorder of phlegm, danger from weapons, loss of wealth, destruction of a kingdom and mental agony."
  },
  {
    "major": "Sūrya",
    "sub": "Guru",
    "effects": "Victory, increase in wealth, gains of gold, garments, conveyances etc."
  },
  {
    "major": "Sūrya",
    "sub": "Śani",
    "effects": "Loss of wealth, distress to cattle, excitement, diseases etc."
  },
  {
    "major": "Sūrya",
    "sub": "Budh",
    "effects": "Affectionate relations with kinsmen, availability of good food, gains of wealth, religious-mindedness, reverence from the king."
  },
  {
    "major": "Sūrya",
    "sub": "Ketu",
    "effects": "Danger to life, loss of wealth, danger from the king, trouble with enemies."
  },
  {
    "major": "Sūrya",
    "sub": "Śukr",
    "effects": "Moderate effects, or some gains of wealth may be expected."
  },
  {
    "major": "Chandra",
    "sub": "Candr",
    "effects": "Acquisition of land, wealth and property, reverence from the king and availability of sweetish preparations."
  },
  {
    "major": "Chandra",
    "sub": "Mangal",
    "effects": "Wisdom and discretion, reverence from the people, increase in wealth, enjoyments to kinsmen, but there will be danger from an enemy."
  },
  {
    "major": "Chandra",
    "sub": "Rahu",
    "effects": "Well-being, gain of wealth from the king and danger of death, if Rahu is yuti with a malefic."
  },
  {
    "major": "Chandra",
    "sub": "Guru",
    "effects": "Enjoyments, increase in dignity and glory, gain of knowledge through the preceptor, acquisition of a kingdom and acquisition of gems etc."
  },
  {
    "major": "Chandra",
    "sub": "Śani",
    "effects": "Bilious troubles, loss of wealth and name and fame."
  },
  {
    "major": "Chandra",
    "sub": "Budh",
    "effects": "Birth of a son, acquisition of a horse and other conveyances, success in education, progress, gain of white garments and grains."
  },
  {
    "major": "Chandra",
    "sub": "Ketu",
    "effects": "Quarrels with Brahmins, fear of premature death, loss of happiness and distress all-round."
  },
  {
    "major": "Chandra",
    "sub": "Śukr",
    "effects": "Gain of wealth, enjoyments, birth of a daughter, availability of sweet preparations and cordial relations with all."
  },
  {
    "major": "Chandra",
    "sub": "Sūrya",
    "effects": "Gain of happiness, grains and garments, victories everywhere."
  },
  {
    "major": "Mangal",
    "sub": "Mangal",
    "effects": "Danger from enemies, quarrels and fear of premature death on account of blood diseases."
  },
  {
    "major": "Mangal",
    "sub": "Rahu",
    "effects": "Destruction of wealth and kingdom (fall of government), unpalatable food and quarrels with the enemy."
  },
  {
    "major": "Mangal",
    "sub": "Guru",
    "effects": "Loss of intelligence, distress, sorrows to children, fear of premature death, negligence, quarrels and no fulfillment of any ambition."
  },
  {
    "major": "Mangal",
    "sub": "Śani",
    "effects": "Destruction of the employer, distress, loss of wealth, danger from enemies, anxiety, quarrels and sorrows."
  },
  {
    "major": "Mangal",
    "sub": "Budh",
    "effects": "Loss of intelligence, loss of wealth, fevers and loss of grains, garments and friends."
  },
  {
    "major": "Mangal",
    "sub": "Ketu",
    "effects": "Distress from diseases, lethargy, premature death, danger from the king and weapons."
  },
  {
    "major": "Mangal",
    "sub": "Śukr",
    "effects": "Distress from Chandal, sorrows, danger from the king and from weapons, dysentery and vomiting."
  },
  {
    "major": "Mangal",
    "sub": "Sūrya",
    "effects": "Increase in landed property and wealth, satisfaction, visits of friends, happiness all-round."
  },
  {
    "major": "Mangal",
    "sub": "Candr",
    "effects": "Gains of white garments etc. from the southern direction, success in all ventures."
  },
  {
    "major": "Rahu",
    "sub": "Rahu",
    "effects": "Imprisonment, disease, danger of injuries from weapons."
  },
  {
    "major": "Rahu",
    "sub": "Guru",
    "effects": "Reverence everywhere, acquisition of conveyances, like elephants etc., gain of wealth."
  },
  {
    "major": "Rahu",
    "sub": "Śani",
    "effects": "Rigorous imprisonment, loss of enjoyments, danger from enemies, affliction with rheumatism."
  },
  {
    "major": "Rahu",
    "sub": "Budh",
    "effects": "Gain in all ventures, abnormal gain through wife."
  },
  {
    "major": "Rahu",
    "sub": "Ketu",
    "effects": "Loss of intelligence, danger from enemies, obstacles, loss of wealth, quarrels, excitement."
  },
  {
    "major": "Rahu",
    "sub": "Śukr",
    "effects": "Danger from a Yogini, danger from the king, loss of conveyances, availability of unpalatable food, loss of a wife, sorrow in the family."
  },
  {
    "major": "Rahu",
    "sub": "Sūrya",
    "effects": "Danger from enemies, fevers, distress to children, fear of premature death, negligence."
  },
  {
    "major": "Rahu",
    "sub": "Candr",
    "effects": "Excitement, quarrels, worries, loss of reputation, fear, distress to father."
  },
  {
    "major": "Rahu",
    "sub": "Mangal",
    "effects": "Septic boil in the anus (Bhagandhar), distress, due to a bite and pollution of blood, loss of wealth, excitement."
  },
  {
    "major": "Guru",
    "sub": "Guru",
    "effects": "Acquisition of gold, increase in wealth etc."
  },
  {
    "major": "Guru",
    "sub": "Śani",
    "effects": "Increase in lands, conveyances and grains."
  },
  {
    "major": "Guru",
    "sub": "Budh",
    "effects": "Success in the educational sphere, acquisition of clothes and gems, like pearls etc., visits of friends."
  },
  {
    "major": "Guru",
    "sub": "Ketu",
    "effects": "Danger from water and thieves."
  },
  {
    "major": "Guru",
    "sub": "Śukr",
    "effects": "Several kinds of learning, gain of gold, clothes, ornaments, well-being and satisfaction."
  },
  {
    "major": "Guru",
    "sub": "Sūrya",
    "effects": "Gain from the king, friends and parents, reverence everywhere."
  },
  {
    "major": "Guru",
    "sub": "Candr",
    "effects": "No distress, gain of wealth and conveyances, success in ventures."
  },
  {
    "major": "Guru",
    "sub": "Mangal",
    "effects": "Danger from weapons, pain in anus, burning in the stomach, indigestion, distress from enemies."
  },
  {
    "major": "Guru",
    "sub": "Rahu",
    "effects": "Antagonism with menials (Chandaldhi) and loss of wealth and distress through them."
  },
  {
    "major": "Śani",
    "sub": "Śani",
    "effects": "Physical distress, quarrels, danger from menials."
  },
  {
    "major": "Śani",
    "sub": "Budh",
    "effects": "Loss of intelligence, quarrels, dangers, anxiety about availability of food, loss of wealth, danger from enemy."
  },
  {
    "major": "Śani",
    "sub": "Ketu",
    "effects": "Imprisonment in the camp of the enemy, loss of luster, hunger, anxiety and agony."
  },
  {
    "major": "Śani",
    "sub": "Śukr",
    "effects": "Fulfillment of ambitions, well-being in the family, success in ventures and gains therefrom."
  },
  {
    "major": "Śani",
    "sub": "Sūrya",
    "effects": "Conferment of authority by the king, quarrels in the family, fevers."
  },
  {
    "major": "Śani",
    "sub": "Candr",
    "effects": "Development of intelligence, inauguration of big a venture, loss of luster, extravagant expenditure, association with many women."
  },
  {
    "major": "Śani",
    "sub": "Mangal",
    "effects": "Loss of valour, distress to son, danger from fire and enemy, distress from bile and wind."
  },
  {
    "major": "Śani",
    "sub": "Rahu",
    "effects": "Loss of wealth, clothes, land, going away to foreign lands, fear of death."
  },
  {
    "major": "Śani",
    "sub": "Guru",
    "effects": "Inability to prevent losses, caused by women, quarrels, excitement."
  },
  {
    "major": "Budh",
    "sub": "Budh",
    "effects": "Gain of intelligence, education, wealth, clothes etc."
  },
  {
    "major": "Budh",
    "sub": "Ketu",
    "effects": "Coarse food, stomach troubles, eye troubles, distress from bilious and blood disorders."
  },
  {
    "major": "Budh",
    "sub": "Śukr",
    "effects": "Gains from a northern direction, loss of cattle, acquisition of authority from government."
  },
  {
    "major": "Budh",
    "sub": "Sūrya",
    "effects": "Loss of splendour and distress through diseases, distress in the heart."
  },
  {
    "major": "Budh",
    "sub": "Candr",
    "effects": "Marriage, gain of wealth and property, birth of a daughter, enjoyments all-round."
  },
  {
    "major": "Budh",
    "sub": "Mangal",
    "effects": "Religious-mindedness, increase in wealth, danger from fire and enemies, gain of red clothes, injury from a weapon."
  },
  {
    "major": "Budh",
    "sub": "Rahu",
    "effects": "Quarrels, danger from wife, or some other woman, danger from the king."
  },
  {
    "major": "Budh",
    "sub": "Guru",
    "effects": "Acquisition of a kingdom, conferment of authority by the king, reverence from the king, education, intelligence."
  },
  {
    "major": "Budh",
    "sub": "Śani",
    "effects": "Bilious and windy troubles, injuries to the body, loss of wealth."
  },
  {
    "major": "Ketu",
    "sub": "Ketu",
    "effects": "Sudden disaster, going away to foreign lands, loss of wealth."
  },
  {
    "major": "Ketu",
    "sub": "Śukr",
    "effects": "Loss of wealth through a non-Hindu king, eye troubles, headache, loss of cattle."
  },
  {
    "major": "Ketu",
    "sub": "Sūrya",
    "effects": "Antagonism with friends, premature death, defeat, exchange of arguments."
  },
  {
    "major": "Ketu",
    "sub": "Candr",
    "effects": "Loss of grains, physical distress, misunderstanding, dysentery."
  },
  {
    "major": "Ketu",
    "sub": "Mangal",
    "effects": "Injury from weapons, distress from fire, danger from menials and enemies."
  },
  {
    "major": "Ketu",
    "sub": "Rahu",
    "effects": "Danger from women and enemies, distress, caused by menials."
  },
  {
    "major": "Ketu",
    "sub": "Guru",
    "effects": "Loss of friends, wealth and garments, opprobrium in the house, troubles from everywhere."
  },
  {
    "major": "Ketu",
    "sub": "Śani",
    "effects": "Death of cattle and friends, physical distress, very meagre gain of wealth."
  },
  {
    "major": "Ketu",
    "sub": "Budh",
    "effects": "Loss of understanding, excitement, failure in education, dangers, failure in all ventures."
  },
  {
    "major": "Śukr",
    "sub": "Śukr",
    "effects": "Gains of white clothes, conveyances, gems, like pearls etc., association with beautiful damsel."
  },
  {
    "major": "Śukr",
    "sub": "Sūrya",
    "effects": "Rheumatic fever, headache, danger from the king and enemies and meagre gain of wealth."
  },
  {
    "major": "Śukr",
    "sub": "Candr",
    "effects": "Birth of a daughter, gain of clothes etc. from the king, acquisition of authority."
  },
  {
    "major": "Śukr",
    "sub": "Mangal",
    "effects": "Blood and bile troubles, quarrels, many kinds of distresses."
  },
  {
    "major": "Śukr",
    "sub": "Rahu",
    "effects": "Quarrels with wife, danger, distress from the king and enemies."
  },
  {
    "major": "Śukr",
    "sub": "Guru",
    "effects": "Acquisition of kingdom, wealth, garments, gems, ornaments and conveyance, like elephants etc."
  },
  {
    "major": "Śukr",
    "sub": "Śani",
    "effects": "Acquisition of donkey, camel, goat, iron, grains, sesame seeds, physical pains."
  },
  {
    "major": "Śukr",
    "sub": "Budh",
    "effects": "Gains of wealth, knowledge, authority from the king, gain of money, distributed by others."
  },
  {
    "major": "Śukr",
    "sub": "Ketu",
    "effects": "Premature death, going away from homeland, gains of wealth at times."
  }
]

# Let's package this as a combined wrapper or separate key in the JSON, but since the component is expecting a list
# of dasha objects or we can separate the file to hold both objects or append it.
# Let's save it under a new key or a separate file if it is better. Wait! The file is vimshottariExplanation.json.
# Let's check how the file is imported or read in VimshottariExplanation.jsx.
# Let's view the beginning of VimshottariExplanation.jsx to see how it reads the data.
