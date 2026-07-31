import json

file_path = "d:/Astro Consult-Vedic Astrology/Vedic Astrology/frontend/src/data/vimshottariExplanation.json"

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Structure check
antardashas = data.get("antardashas", [])
pratyantardashas = data.get("pratyantardashas", [])
sukshmantardashas = data.get("sukshmantardashas", [])

prana_effects = [
  {
    "id": "prd-surya-surya",
    "major": "Sūrya",
    "sub": "Sūrya",
    "verses": "1-2",
    "effects": "Interest in unnatural sexual intercourse, danger from thieves, fire and the king, physical distress. Sūrya-Sūrya (Prana Dasha of Sūrya in Sukshm Dasha of Sūrya)."
  },
  {
    "id": "prd-surya-candr",
    "major": "Sūrya",
    "sub": "Candr",
    "verses": "3",
    "effects": "Enjoyments, availability of good food, development of intelligence, opulence and glory, like that of a king, by the beneficence of generous people."
  },
  {
    "id": "prd-surya-mangal",
    "major": "Sūrya",
    "sub": "Mangal",
    "verses": "4",
    "effects": "Antagonism with the king with the connivance of others, dangers and great losses."
  },
  {
    "id": "prd-surya-rahu",
    "major": "Sūrya",
    "sub": "Rahu",
    "verses": "5",
    "effects": "Hunger, danger from poison, loss of wealth, as a result of punishment by the king."
  },
  {
    "id": "prd-surya-guru",
    "major": "Sūrya",
    "sub": "Guru",
    "verses": "6",
    "effects": "Success in many educational spheres, gain of wealth, success in ventures, as a result of the exchange of visits with the king and Brahmins."
  },
  {
    "id": "prd-surya-sani",
    "major": "Sūrya",
    "sub": "Śani",
    "verses": "7",
    "effects": "Imprisonment, death, excitement, obstacles and losses in ventures."
  },
  {
    "id": "prd-surya-budh",
    "major": "Sūrya",
    "sub": "Budh",
    "verses": "8",
    "effects": "Feeding from the kings kitchen, acquisition of Chatr and Chamar with royal symbols, attainment of the position of a high dignitary in government."
  },
  {
    "id": "prd-surya-ketu",
    "major": "Sūrya",
    "sub": "Ketu",
    "verses": "9",
    "effects": "Loss of wealth, due to quarrels with the preceptor (elders), wife and kinsmen."
  },
  {
    "id": "prd-surya-sukr",
    "major": "Sūrya",
    "sub": "Śukr",
    "verses": "10",
    "effects": "Recognition, or reverence from the king, increase in wealth, happiness from wife and children, enjoyments from eating and drinking."
  },
  {
    "id": "prd-candr-candr",
    "major": "Chandra",
    "sub": "Candr",
    "verses": "11",
    "effects": "Happiness from wife and children, gain of wealth and clothes, Yog Sidhi."
  },
  {
    "id": "prd-candr-mangal",
    "major": "Chandra",
    "sub": "Mangal",
    "verses": "12",
    "effects": "Consumption, leprosy, destruction of kinsmen, bleeding, creation of turbulence by friends and goblins."
  },
  {
    "id": "prd-candr-rahu",
    "major": "Chandra",
    "sub": "Rahu",
    "verses": "13",
    "effects": "Danger from snakes, creation of turbulance by evil spirits, weakness of eyesight, confusion of mind."
  },
  {
    "id": "prd-candr-guru",
    "major": "Chandra",
    "sub": "Guru",
    "verses": "14",
    "effects": "Growth of religious-mindedness, forgiveness, devotion towards deities and Brahmins, good fortune, meeting with near and dear ones."
  },
  {
    "id": "prd-candr-sani",
    "major": "Chandra",
    "sub": "Śani",
    "verses": "15",
    "effects": "Unexpected and sudden physical distress, creation of troubles by enemies, weakness of eyesight, gain of wealth."
  },
  {
    "id": "prd-candr-budh",
    "major": "Chandra",
    "sub": "Budh",
    "verses": "16",
    "effects": "Gift of Chamar and Chatr by the king, acquisition of a kingdom, even-mindedness in people."
  },
  {
    "id": "prd-candr-ketu",
    "major": "Chandra",
    "sub": "Ketu",
    "verses": "17",
    "effects": "Danger from weapons, from fire, from an enemy and from poison, stomach troubles, separation from wife and children."
  },
  {
    "id": "prd-candr-sukr",
    "major": "Chandra",
    "sub": "Śukr",
    "verses": "18",
    "effects": "Acquisition of friends and wife, gain of wealth from foreign lands, all kinds of enjoyments."
  },
  {
    "id": "prd-candr-surya",
    "major": "Chandra",
    "sub": "Sūrya",
    "verses": "19",
    "effects": "Brutality, increase in anger, fear of death, agony, going away from the homeland, dangers."
  },
  {
    "id": "prd-mangal-mangal",
    "major": "Mangal",
    "sub": "Mangal",
    "verses": "20",
    "effects": "Quarrels with the enemy, imprisonment, bilious and blood pollution troubles."
  },
  {
    "id": "prd-mangal-rahu",
    "major": "Mangal",
    "sub": "Rahu",
    "verses": "21",
    "effects": "Separation from wife and children, distress, as a result of oppression by kinsmen, fear of death, poison."
  },
  {
    "id": "prd-mangal-guru",
    "major": "Mangal",
    "sub": "Guru",
    "verses": "22",
    "effects": "Devotion towards deities, gain of wealth, competence in Mantra rituals."
  },
  {
    "id": "prd-mangal-sani",
    "major": "Mangal",
    "sub": "Śani",
    "verses": "23",
    "effects": "Danger from fire, death, loss of wealth, loss of position, but good relations with kinsmen."
  },
  {
    "id": "prd-mangal-budh",
    "major": "Mangal",
    "sub": "Budh",
    "verses": "24",
    "effects": "Gains of splendid garments, ornaments, marriage."
  },
  {
    "id": "prd-mangal-ketu",
    "major": "Mangal",
    "sub": "Ketu",
    "verses": "25",
    "effects": "Fear of falling down from a high place, eye troubles, danger from snakes, loss of reputation."
  },
  {
    "id": "prd-mangal-sukr",
    "major": "Mangal",
    "sub": "Śukr",
    "verses": "26",
    "effects": "Gain of wealth, reverence amongst people, enjoyment of many kinds of luxuries."
  },
  {
    "id": "prd-mangal-surya",
    "major": "Mangal",
    "sub": "Sūrya",
    "verses": "27",
    "effects": "Fevers, lunacy, loss of wealth, wrath of the king, poverty."
  },
  {
    "id": "prd-mangal-candr",
    "major": "Mangal",
    "sub": "Candr",
    "verses": "28",
    "effects": "Comforts of good food and garments, distress from heat and cold."
  },
  {
    "id": "prd-rahu-rahu",
    "major": "Rahu",
    "sub": "Rahu",
    "verses": "29",
    "effects": "Loss of taste in eating, danger from poison, loss of wealth through rashness."
  },
  {
    "id": "prd-rahu-guru",
    "major": "Rahu",
    "sub": "Guru",
    "verses": "30",
    "effects": "Physical well-being, fearlessness, gain of conveyance and quarrels with menials."
  },
  {
    "id": "prd-rahu-sani",
    "major": "Rahu",
    "sub": "Śani",
    "verses": "31",
    "effects": "Danger from fire, diseases, loss of wealth through menials, imprisonment."
  },
  {
    "id": "prd-rahu-budh",
    "major": "Rahu",
    "sub": "Budh",
    "verses": "32",
    "effects": "Devotion towards the preceptor and increase of wealth through his beneficence, good qualities and well cultured."
  },
  {
    "id": "prd-rahu-ketu",
    "major": "Rahu",
    "sub": "Ketu",
    "verses": "33",
    "effects": "Antagonism with wife and children, going away from home, loss of wealth through rashness."
  },
  {
    "id": "prd-rahu-sukr",
    "major": "Rahu",
    "sub": "Śukr",
    "verses": "34",
    "effects": "Acquisition of Chatr, Chamar, conveyances etc., success in all ventures, worship of Lord Shiva, construction of a house."
  },
  {
    "id": "prd-rahu-surya",
    "major": "Rahu",
    "sub": "Sūrya",
    "verses": "35",
    "effects": "Affliction with piles, wrath of the king, loss of cattle."
  },
  {
    "id": "prd-rahu-candr",
    "major": "Rahu",
    "sub": "Candr",
    "verses": "36",
    "effects": "Development of mental powers and intelligence, popularity, visits of preceptors, danger of committing sins."
  },
  {
    "id": "prd-rahu-mangal",
    "major": "Rahu",
    "sub": "Mangal",
    "verses": "37",
    "effects": "Dangers from menials and fire, loss of position, disaster, filthiness and meanness."
  },
  {
    "id": "prd-guru-guru",
    "major": "Guru",
    "sub": "Guru",
    "verses": "38",
    "effects": "Happiness, increase in wealth, performance of Havan, worship of Lord Shiva, acquisition of Chatr and conveyances."
  },
  {
    "id": "prd-guru-sani",
    "major": "Guru",
    "sub": "Śani",
    "verses": "39",
    "effects": "Failure in fasting, unhappiness, going away to foreign lands, loss of wealth, antagonism with kinsmen."
  },
  {
    "id": "prd-guru-budh",
    "major": "Guru",
    "sub": "Budh",
    "verses": "40",
    "effects": "Progress in education, increase in intelligence, happiness to wife and children, popularity, gain of wealth."
  },
  {
    "id": "prd-guru-ketu",
    "major": "Guru",
    "sub": "Ketu",
    "verses": "41",
    "effects": "Opulence and glory, learnedness, gain of knowledge of Shastras, worship of Lord Shiva, performance of Havan, devotion towards preceptor."
  },
  {
    "id": "prd-guru-sukr",
    "major": "Guru",
    "sub": "Śukr",
    "verses": "42",
    "effects": "Freedom from diseases, enjoyments, increase in wealth, happiness from wife and children."
  },
  {
    "id": "prd-guru-surya",
    "major": "Guru",
    "sub": "Sūrya",
    "verses": "43",
    "effects": "Disorders of wind, bile and phlegm, pains, due to disorders of juices in the body."
  },
  {
    "id": "prd-guru-candr",
    "major": "Guru",
    "sub": "Candr",
    "verses": "44",
    "effects": "Acquisition of Chatr with royal symbol, opulence and glory, increase in children, eye and stomach troubles."
  },
  {
    "id": "prd-guru-mangal",
    "major": "Guru",
    "sub": "Mangal",
    "verses": "45",
    "effects": "Danger of administration of poison by wife, imprisonment, foreign journeys, confusion of mind."
  },
  {
    "id": "prd-guru-rahu",
    "major": "Guru",
    "sub": "Rahu",
    "verses": "46",
    "effects": "Distress from diseases, troubles from thieves, danger from snakes, scorpions etc."
  },
  {
    "id": "prd-sani-sani",
    "major": "Śani",
    "sub": "Śani",
    "verses": "47",
    "effects": "Loss of luster, due to fevers, leprosy, stomach troubles, danger of death from fire."
  },
  {
    "id": "prd-sani-budh",
    "major": "Śani",
    "sub": "Budh",
    "verses": "48",
    "effects": "Gain of wealth and grains, profits in business, reverence, devotion towards deities and Brahmins."
  },
  {
    "id": "prd-sani-ketu",
    "major": "Śani",
    "sub": "Ketu",
    "verses": "49",
    "effects": "Death-like distress, creation of turbulence by evil spirits, insult from a woman, other than one's wife."
  },
  {
    "id": "prd-sani-sukr",
    "major": "Śani",
    "sub": "Śukr",
    "verses": "50",
    "effects": "Enjoyments through wealth, son and beneficence of the king, performance of Havanas, marriage etc."
  },
  {
    "id": "prd-sani-surya",
    "major": "Śani",
    "sub": "Sūrya",
    "verses": "51",
    "effects": "Troubles in the eyes and forehead, danger from snakes and enemies, loss of wealth, distress."
  },
  {
    "id": "prd-sani-candr",
    "major": "Śani",
    "sub": "Candr",
    "verses": "52",
    "effects": "Sound health, birth of a son, relief, thriving strength, devotion towards deities and Brahmins."
  },
  {
    "id": "prd-sani-mangal",
    "major": "Śani",
    "sub": "Mangal",
    "verses": "53",
    "effects": "Affliction with Gulma, danger from enemy, danger of death during hunting, danger from snakes, from fire and from poison."
  },
  {
    "id": "prd-sani-rahu",
    "major": "Śani",
    "sub": "Rahu",
    "verses": "54",
    "effects": "Going away from the homeland, danger from the king, bewitchment, taking of poison, troubles from wind and bile."
  },
  {
    "id": "prd-sani-guru",
    "major": "Śani",
    "sub": "Guru",
    "verses": "55",
    "effects": "Attainment of the position of a Commander in the Army, gain of land, association with ascetics, reverence from the king."
  },
  {
    "id": "prd-budh-budh",
    "major": "Budh",
    "sub": "Budh",
    "verses": "56",
    "effects": "Increase in enjoyments, wealth and religious-mindedness, even-mindedness in all living beings."
  },
  {
    "id": "prd-budh-ketu",
    "major": "Budh",
    "sub": "Ketu",
    "verses": "57",
    "effects": "Danger from thieves, from fire and from poison, death-like suffering."
  },
  {
    "id": "prd-budh-sukr",
    "major": "Budh",
    "sub": "Śukr",
    "verses": "58",
    "effects": "Supremacy over others, increase in wealth, reputation and religious-mindedness, devotion to Lord Shiva, happiness from son."
  },
  {
    "id": "prd-budh-surya",
    "major": "Budh",
    "sub": "Sūrya",
    "verses": "59",
    "effects": "Agony, fevers, lunacy, affectionate relations with wife and kinsmen, receipt of stolen property."
  },
  {
    "id": "prd-budh-candr",
    "major": "Budh",
    "sub": "Candr",
    "verses": "60",
    "effects": "Happiness from wife, birth of a daughter, gain of wealth and enjoyments all-round."
  },
  {
    "id": "prd-budh-mangal",
    "major": "Budh",
    "sub": "Mangal",
    "verses": "61",
    "effects": "Tendency to indulge in nefarious activities, pain in eyes, teeth and stomach, piles, danger from death."
  },
  {
    "id": "prd-budh-rahu",
    "major": "Budh",
    "sub": "Rahu",
    "verses": "62",
    "effects": "Gain of clothes, ornaments and wealth, separation from one's own people, antagonism with Brahmins, delirium."
  },
  {
    "id": "prd-budh-guru",
    "major": "Budh",
    "sub": "Guru",
    "verses": "63",
    "effects": "Sublimately, progress in education, increase in wealth and good qualities, profits in business."
  },
  {
    "id": "prd-budh-sani",
    "major": "Budh",
    "sub": "Śani",
    "verses": "64",
    "effects": "Danger of death from thieves, poverty, beggary."
  },
  {
    "id": "prd-ketu-ketu",
    "major": "Ketu",
    "sub": "Ketu",
    "verses": "65",
    "effects": "Danger of fall from a conveyance, quarrels with the enemy, committing a murder inadvertently."
  },
  {
    "id": "prd-ketu-sukr",
    "major": "Ketu",
    "sub": "Śukr",
    "verses": "66",
    "effects": "Gain of land and conveyance, happiness, destruction of enemy, increase in cattle wealth."
  },
  {
    "id": "prd-ketu-surya",
    "major": "Ketu",
    "sub": "Sūrya",
    "verses": "67",
    "effects": "Danger from fire and enemy, loss of wealth, mental agony, death-like suffering."
  },
  {
    "id": "prd-ketu-candr",
    "major": "Ketu",
    "sub": "Candr",
    "verses": "68",
    "effects": "Devotion towards deities and Brahmin, journeys to distant places, gain of wealth and happiness, eye and ear troubles."
  },
  {
    "id": "prd-ketu-mangal",
    "major": "Ketu",
    "sub": "Mangal",
    "verses": "69",
    "effects": "Bilious troubles, enlargement of veins, delirium, antagonism with kinsmen."
  },
  {
    "id": "prd-ketu-rahu",
    "major": "Ketu",
    "sub": "Rahu",
    "verses": "70",
    "effects": "Antagonism with son and wife, going away from home, loss in ventures, due to rashness."
  },
  {
    "id": "prd-ketu-guru",
    "major": "Ketu",
    "sub": "Guru",
    "verses": "71",
    "effects": "Injuries from weapons, wounds, heart disease, separation from wife and children."
  },
  {
    "id": "prd-ketu-sani",
    "major": "Ketu",
    "sub": "Śani",
    "verses": "72",
    "effects": "Confusion of mind, tendencies towards nefarious deeds, imprisonment on account of addictions (in drugs etc.), distress."
  },
  {
    "id": "prd-ketu-budh",
    "major": "Ketu",
    "sub": "Budh",
    "verses": "73",
    "effects": "Enjoyments of bed, perfumery, ornaments and sandal, good food and availability of all kinds of comforts."
  },
  {
    "id": "prd-sukr-sukr",
    "major": "Śukr",
    "sub": "Śukr",
    "verses": "74",
    "effects": "Learning, devotion to deities, satisfaction, gain of wealth, increase in the number of children."
  },
  {
    "id": "prd-sukr-surya",
    "major": "Śukr",
    "sub": "Sūrya",
    "verses": "75",
    "effects": "Good reputation in public, loss of happiness in respect of children, heat troubles."
  },
  {
    "id": "prd-sukr-candr",
    "major": "Śukr",
    "sub": "Candr",
    "verses": "76",
    "effects": "Devotion towards deities, competence, relief by the application of Mantras, increase in wealth and fortune."
  },
  {
    "id": "prd-sukr-mangal",
    "major": "Śukr",
    "sub": "Mangal",
    "verses": "77",
    "effects": "Fevers, wounds, ringworms, itches, devotion towards deities and Brahmins."
  },
  {
    "id": "prd-sukr-rahu",
    "major": "Śukr",
    "sub": "Rahu",
    "verses": "78",
    "effects": "Distress from an enemy, eye and stomach troubles, antagonism with friends."
  },
  {
    "id": "prd-sukr-guru",
    "major": "Śukr",
    "sub": "Guru",
    "verses": "79",
    "effects": "Good longevity, sound health, happiness from wealth, wife and children, acquisition of Chatr and conveyances."
  },
  {
    "id": "prd-sukr-sani",
    "major": "Śukr",
    "sub": "Śani",
    "verses": "80",
    "effects": "Danger from the king, loss of happiness, critical disease, controversy with menials."
  },
  {
    "id": "prd-sukr-budh",
    "major": "Śukr",
    "sub": "Budh",
    "verses": "81",
    "effects": "Satisfaction, reverence from the king, gains of land and wealth from many directions, increase in enthusiasm."
  },
  {
    "id": "prd-sukr-ketu",
    "major": "Śukr",
    "sub": "Ketu",
    "verses": "82",
    "effects": "Loss of life, wealth and reputation, only some money is left for charities and sustenance."
  }
]

output_data = {
    "antardashas": antardashas,
    "pratyantardashas": pratyantardashas,
    "sukshmantardashas": sukshmantardashas,
    "pranadashas": prana_effects
}

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

print("Successfully updated JSON with Prana Dasha items!")
