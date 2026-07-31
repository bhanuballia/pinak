import json

file_path = "d:/Astro Consult-Vedic Astrology/Vedic Astrology/frontend/src/data/vimshottariExplanation.json"

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

new_items = [
  {
    "id": "guru-guru-1",
    "dasha": "Guru",
    "antarDasha": "Guru",
    "verses": "1-3½",
    "general": "Effects, like sovereignty over many kings, very well endowed with riches, revered by the king, gains of cattle, clothes, ornaments, conveyances, construction of a new house and a decent mansion, opulence and glory, dawn of fortune, success in ventures, meetings with Brahmins and the king, extraordinary profits from the employer and happiness to wife and children, will be experienced in the Antar Dasha of Guru in his own Dasha, if Guru is in his exaltation Rāśi, in his own Rāśi, in a Kendr, or Trikon.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-guru-2",
    "dasha": "Guru",
    "antarDasha": "Guru",
    "verses": "4-5½",
    "general": "",
    "adverse": "Association with the menials, great distress, slander by coparceners, wrath of the employer, separation from wife and children and loss of wealth and grains will be the results, if Guru is in his debilitation Rāśi, in his debilitated Navāńś, or in Ari, Randhr, or Vyaya.",
    "deathEffects": "danger of premature death",
    "remedial": ""
  },
  {
    "id": "guru-guru-3",
    "dasha": "Guru",
    "antarDasha": "Guru",
    "verses": "6-7",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be pains in the body, if Guru is the Lord of Yuvati (or of Dhan).",
    "remedial": "recitation of Rudr Japa and Shiva Sahasranam."
  },
  {
    "id": "guru-sani-1",
    "dasha": "Guru",
    "antarDasha": "Śani",
    "verses": "8-11½",
    "general": "Effects, like acquisition of a kingdom, gain of clothes, ornaments, wealth, grains, conveyances, cattle and position, happiness from son and friends etc., gains specially of a blue-coloured horse, journey to the West, audience with the king and receipt of wealth from him, will be derived in the Antar Dasha of Śani in the Dasha of Guru, if Śani is in his exaltation, in his own Rāśi, in a Kendr, or Trikon endowed with strength.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-sani-2",
    "dasha": "Guru",
    "antarDasha": "Śani",
    "verses": "12-14",
    "general": "",
    "adverse": "Loss of wealth, affliction with fever, mental agony, infliction of wounds to wife and children, inauspicious events at home, loss of cattle and employment, antagonism with kinsmen etc. will be results, if Śani is in Ari, Randhr, or Vyaya, if Śani is combust, or, if Śani is in an enemy's Rāśi.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-sani-3",
    "dasha": "Guru",
    "antarDasha": "Śani",
    "verses": "15-15½",
    "general": "There will be gain of land, house, son and cattle, acquisition of riches and property through the enemy etc., if Śani is in Kendr, Trikon, the 11th, or in the 2nd from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-sani-4",
    "dasha": "Guru",
    "antarDasha": "Śani",
    "verses": "16-17",
    "general": "",
    "adverse": "Effects, like loss of wealth, antagonistic relations with kinsmen, obstacles in industrial ventures, pains in the body, danger from the members of the family etc. will be realized, if Śani is in the 6th, 8th, or 12th from the Lord of the Dasha, or, if Śani is associated with a malefic.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-sani-5",
    "dasha": "Guru",
    "antarDasha": "Śani",
    "verses": "18-19",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be fear of premature death, if Śani is Dhan's, or Yuvati's Lord.",
    "remedial": "recitation of Vishnu Sahasranam and giving in charity a black cow, or a female buffalo."
  },
  {
    "id": "guru-budh-1",
    "dasha": "Guru",
    "antarDasha": "Budh",
    "verses": "20-21½",
    "general": "Effects, like gains of wealth, bodily felicity, acquisition of a kingdom, gain of conveyances, clothes and cattle etc., will be derived in the Antar Dasha of Budh in the Dasha of Guru, if Budh is in his exaltation, in his own Rāśi, or in Kendr, in Trikon, or, if Budh is associated with the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-budh-2",
    "dasha": "Guru",
    "antarDasha": "Budh",
    "verses": "22-22½",
    "general": "",
    "adverse": "There will be increase in the number of enemies, loss of enjoyment and comforts, loss in business, affliction with fever and dysentery, if Budh receives a Drishti from Mangal.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-budh-3",
    "dasha": "Guru",
    "antarDasha": "Budh",
    "verses": "23-24",
    "general": "Gains of wealth in his own country, happiness from parents and acquisition of conveyances by the beneficence of the king will result, if Budh is in a Kendr, in the 5th, or 9th from the Lord of the Dasha, or, if Budh is in his exaltation Rāśi.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-budh-4",
    "dasha": "Guru",
    "antarDasha": "Budh",
    "verses": "25-26",
    "general": "",
    "adverse": "There will be loss of wealth, journeys to foreign countries, danger from thieves while traveling, wounds, burning sensations, eye troubles, wanderings in foreign lands, if Budh is in the 6th, 8th, or 12th from the Lord of the Dasha, or, if Budh is associated with a malefic without receiving a Drishti from a benefic.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-budh-5",
    "dasha": "Guru",
    "antarDasha": "Budh",
    "verses": "27-28",
    "general": "",
    "adverse": "Distress without reason, anger, loss of cattle, loss in business etc. will be the results, if Budh be associated with a malefic, or malefics in Ari, in Randhr, or in Vyaya.",
    "deathEffects": "fear of premature death",
    "remedial": ""
  },
  {
    "id": "guru-budh-6",
    "dasha": "Guru",
    "antarDasha": "Budh",
    "verses": "29-29½",
    "general": "There will be enjoyment, gains of wealth, conveyances and clothes at the commencement of the Antar Dasha, even if Budh is associated with a malefic, but receives a Drishti from a benefic.",
    "adverse": "At the end of the Dasha, however, there will be loss of wealth.",
    "deathEffects": "bodily distress",
    "remedial": ""
  },
  {
    "id": "guru-budh-7",
    "dasha": "Guru",
    "antarDasha": "Budh",
    "verses": "30-31",
    "general": "",
    "adverse": "",
    "deathEffects": "Premature death may be expected, if Budh is Dhan's, or Yuvati's Lord.",
    "remedial": "recitation of Vishnu Sahasranam."
  },
  {
    "id": "guru-ketu-1",
    "dasha": "Guru",
    "antarDasha": "Ketu",
    "verses": "32-32½",
    "general": "Moderate enjoyment, moderate gain of wealth, and acquisition of wealth through undesirable means will be the results, in the Antar Dasha of Ketu in the Dasha of Guru, if Ketu is associated with, or receives a Drishti from a benefic.",
    "adverse": "coarse food, or food, given by others, food, given at the time of death ceremonies",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-ketu-2",
    "dasha": "Guru",
    "antarDasha": "Ketu",
    "verses": "33-34",
    "general": "",
    "adverse": "Loss of wealth by the wrath of the king, imprisonment, diseases, loss of physical strength, antagonism with father and brother and mental agony, if Ketu be in the 6th, 8th, or 12th from the Lord of the Dasha, or be associated with malefics.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-ketu-3",
    "dasha": "Guru",
    "antarDasha": "Ketu",
    "verses": "35-36½",
    "general": "Acquisition of a palanquin, elephants etc., beneficence of the king, success in the desired spheres, profits in business, increase in the number of cattle, gain of wealth, clothes etc. from a Yavana king (Muslim dignitary) will be the auspicious effects, if Ketu is in the 5th, 9th, 4th, or 10th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-ketu-4",
    "dasha": "Guru",
    "antarDasha": "Ketu",
    "verses": "37-38",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, if Ketu is Dhan's, or Yuvati's Lord (or, if Ketu is in Dhan, or in Yuvati).",
    "remedial": "performance of Mrityunjaya Japa."
  },
  {
    "id": "guru-sukr-1",
    "dasha": "Guru",
    "antarDasha": "Śukr",
    "verses": "39-43",
    "general": "Effects, like acquisition of conveyances, like palanquin, elephants etc., gain of wealth by the beneficence of the king, enjoyment, gain of blue and red articles, extraordinary income from journeys to the East, well-being in the family, happiness from parents, devotion to deities, construction of reservoirs, charities etc., will be derived in the Antar Dasha of Śukr, if Śukr is in a Kendr, Trikon, or in Labh, or, if Śukr is in his own Rāśi and receives a Drishti from a benefic, or from benefics.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-sukr-2",
    "dasha": "Guru",
    "antarDasha": "Śukr",
    "verses": "44-44½",
    "general": "",
    "adverse": "quarrels, antagonism with kinsmen, distress to wife and children, if Śukr is in the 6th, 8th, or 12th from the Lord of the Dasha, or Lagn, or, if Śukr is in his debilitation Rāśi. Quarrels, danger from the king, antagonism with the wife, disputes with the father-in-law and with brothers, loss of wealth etc., if Śukr is associated with Śani, or Rahu, or with both.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-sukr-3",
    "dasha": "Guru",
    "antarDasha": "Śukr",
    "verses": "45-47½",
    "general": "There will be gain of wealth, happiness from wife, meeting with the king, increase in the number of children, conveyances and cattle, enjoyment of music, society with men of learning, availability of sweetish preparations, giving help and assistance to kinsmen etc., if Śukr is in a Kendr, Trikon, or in the 2nd from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-sukr-4",
    "dasha": "Guru",
    "antarDasha": "Śukr",
    "verses": "48-50",
    "general": "",
    "adverse": "",
    "deathEffects": "Loss of wealth, fear of premature death, antagonism with wife etc. will be experienced, if Śukr is Dhan's, or Yuvati's Lord.",
    "remedial": "giving a tawny-coloured cow, or a female buffalo in charity."
  },
  {
    "id": "guru-surya-1",
    "dasha": "Guru",
    "antarDasha": "Sūrya",
    "verses": "51-53",
    "general": "Gain of wealth, reverence, happiness and acquisition of conveyances, clothes, ornaments etc., birth of children, cordial relations with the king, success in ventures etc. will be the auspicious results in the Antar Dasha of Sūrya in the Dasha of Guru, if Sūrya is in his exaltation, in his own Rāśi, in a Kendr, Trikon, or in Sahaj, Labh, or Dhan and be endowed with strength.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-surya-2",
    "dasha": "Guru",
    "antarDasha": "Sūrya",
    "verses": "54-55½",
    "general": "",
    "adverse": "nervous disorder, fever, laziness, or reluctance in the performance of good deeds, indulgence in sins, antagonistic attitude towards all, separation from kinsmen and distress without reasons, if Sūrya is in Ari, Randhr, or Vyaya, or, if Sūrya is in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-surya-3",
    "dasha": "Guru",
    "antarDasha": "Sūrya",
    "verses": "56-57",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, if Sūrya is Dhan's, or Yuvati's Lord.",
    "remedial": "recitation of Adhitya Hridaya Path."
  },
  {
    "id": "guru-candr-1",
    "dasha": "Guru",
    "antarDasha": "Candr",
    "verses": "58-60½",
    "general": "Effects, like reverence from the king, opulence and glory, happiness from wife and children, availability of good food, gain of reputation by performance of good deeds, increase in the number of children and grandchildren, comforts by the beneficence of the king, religious and charitable inclinations etc., will be derived in the Antar Dasha of Candr in the Dasha of Guru, if Candr is in a Kendr, Trikon, or in Labh, or, if Candr is in her exaltation, or in her own Rāśi and, if Candr is full and strong and in an auspicious Bhava from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-candr-2",
    "dasha": "Guru",
    "antarDasha": "Candr",
    "verses": "61-63",
    "general": "",
    "adverse": "There will be loss of wealth and kinsmen, wanderings in foreign lands, danger from the king, thieves, quarrels with coparceners, separation from a maternal uncle, distress to mother etc., if Candr is weak, or is associated with malefics, or, if Candr is in Ari, Randhr, or Vyaya, or, if Candr is in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-candr-3",
    "dasha": "Guru",
    "antarDasha": "Candr",
    "verses": "64",
    "general": "",
    "adverse": "",
    "deathEffects": "Physical distress will be experienced, if Candr is Dhan's, or Yuvati's Lord.",
    "remedial": "Durga Saptashati Path."
  },
  {
    "id": "guru-mangal-1",
    "dasha": "Guru",
    "antarDasha": "Mangal",
    "verses": "65-66",
    "general": "Effects, like the celebration of functions, such as marriage etc., gain of land, or villages, growth of strength and valour and success in all ventures, will be derived in the Antar Dasha of Mangal in the Dasha of Guru, if Mangal is in his exaltation, in his own Rāśi, or in his exalted, or own Navāńś.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-mangal-2",
    "dasha": "Guru",
    "antarDasha": "Mangal",
    "verses": "67-68",
    "general": "There will be gain of wealth and grains, availability of good sweetish preparations, pleasure of the king, happiness from wife and children and other auspicious effects, if Mangal is in a Kendr, Trikon, in Labh, or Dhan and is associated with, or receives a Drishti from benefics.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-mangal-3",
    "dasha": "Guru",
    "antarDasha": "Mangal",
    "verses": "69-71",
    "general": "There will be some mitigation of evil effects later.",
    "adverse": "Loss of wealth and house, eye trouble and other inauspicious effects will be the results, if Mangal is in the 8th, or 12th from the Lord of the Dasha, or, if Mangal is in his debilitation Rāśi, associated with, or receiving a Drishti from malefics. The effects will be particularly adverse at the commencement of the Antar Dasha.",
    "deathEffects": "There will be physical distress and mental agony, if Mangal is the Lord of Dhan, or Yuvati.",
    "remedial": "give a bull in charity."
  },
  {
    "id": "guru-rahu-1",
    "dasha": "Guru",
    "antarDasha": "Rahu",
    "verses": "72-75",
    "general": "Effects, like attachment to Yog, gain of wealth and grains during the first five months, sovereignty over a village, or country, meeting with a foreign king, well-being in the family, journeys to distant lands, bathing in holy places, will be derived in the Antar Dasha of Rahu in the Dasha of Guru, if Rahu is in his exaltation, in his own Rāśi, in his Multrikon, or, if Rahu is in a Kendr, or Trikon, or, if Rahu receives a Drishti from the Lord of a Kendr, or, if Rahu is associated with, or receives a Drishti from a benefic.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-rahu-2",
    "dasha": "Guru",
    "antarDasha": "Rahu",
    "verses": "76-78",
    "general": "",
    "adverse": "Danger from thieves, snakes, the king, wounds, troubles in domestic affairs, antagonism with co-borns and coparceners, bad dreams, quarrels without reason, danger from diseases etc. will result, if Rahu is associated with a malefic, if Rahu is in the 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "guru-rahu-3",
    "dasha": "Guru",
    "antarDasha": "Rahu",
    "verses": "79-80",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, if Rahu is in Dhan, or in Yuvati.",
    "remedial": "Mrityunjaya Japa and giving a goat in charity."
  }
]

data.extend(new_items)

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Successfully updated JSON with Guru Dasha items!")
