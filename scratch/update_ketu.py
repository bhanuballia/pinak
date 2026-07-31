import json

file_path = "d:/Astro Consult-Vedic Astrology/Vedic Astrology/frontend/src/data/vimshottariExplanation.json"

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

new_items = [
  {
    "id": "ketu-ketu-1",
    "dasha": "Ketu",
    "antarDasha": "Ketu",
    "verses": "1-2½",
    "general": "Effects, like happiness from wife and children, recognition from the king, gain of land, village etc. will be derived in the Antar Dasha of Ketu in his own Dasha, if Ketu is in a Kendr, or Trikon, or, if Ketu is related to Dharm's, Karm's, or Bandhu's Lord.",
    "adverse": "mental agony",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-ketu-2",
    "dasha": "Ketu",
    "antarDasha": "Ketu",
    "verses": "3-4",
    "general": "",
    "adverse": "Heart disease, defamation, destruction of wealth and cattle, distress to wife and children, instability of mind etc. will we be the results, if Ketu is in his debilitation Rāśi and, if Ketu is in Randhr, or Vyaya along with a combust Grah.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-ketu-3",
    "dasha": "Ketu",
    "antarDasha": "Ketu",
    "verses": "5-6",
    "general": "",
    "adverse": "great distress and separation from kinsmen",
    "deathEffects": "There will be danger from diseases, if Ketu is related to Dhan's, or Yuvati's Lord, or, if Ketu is in Dhan, or Yuvati.",
    "remedial": "performance of Durga Saptashati Japa and Mrityunjaya Japa."
  },
  {
    "id": "ketu-sukr-1",
    "dasha": "Ketu",
    "antarDasha": "Śukr",
    "verses": "7-9½",
    "general": "Effects, like beneficence from the king, good fortune, gain of clothes etc., recovery of lost kingdom, comforts of conveyances etc., visits to sacred shrines and gain of lands and villages by the beneficence of the king, will be derived in the Antar Dasha of Śukr in the Dasha of Ketu, if Śukr is in his exaltation, in his own Rāśi, or, if Śukr is associated with Karm's Lord in a Kendr, or Trikon. There will be dawn of fortune, if in such position he is associated with Dharm's Lord also.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-sukr-2",
    "dasha": "Ketu",
    "antarDasha": "Śukr",
    "verses": "10-11",
    "general": "Sound health, well-being in the family and gains of good food and conveyances etc. will be the results, if Śukr is in a Kendr, Trikon, or in the 3rd, or 11th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-sukr-3",
    "dasha": "Ketu",
    "antarDasha": "Śukr",
    "verses": "12-14",
    "general": "",
    "adverse": "quarrels without any cause, loss of wealth, distress to cattle, if Śukr is in the 6th, 8th, or 12th from the Lord of the Dasha. If Śukr is in his debilitation Rāśi, or, if Śukr is associated with a debilitated Grah, or, if Śukr is in Ari, or Randhr, there will be quarrels with kinsmen, headaches, eye troubles, heart disease, defamation, loss of wealth and distress to cattle and wife.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-sukr-4",
    "dasha": "Ketu",
    "antarDasha": "Śukr",
    "verses": "15",
    "general": "",
    "adverse": "",
    "deathEffects": "Physical distress and mental agony will be caused, if Śukr is Dhan's, or Yuvati's Lord.",
    "remedial": "performance of Durga Path and giving a tawny-coloured cow, or female buffalo in charity."
  },
  {
    "id": "ketu-surya-1",
    "dasha": "Ketu",
    "antarDasha": "Sūrya",
    "verses": "16-17",
    "general": "The effects, like gains of wealth, beneficence of the king, performance of pious deeds and fulfillment of all ambitions, will be derived in the Antar Dasha of Sūrya in the Dasha Ketu, if Sūrya is in his exaltation, in his own Rāśi, or, if Sūrya is associated with, or receives a Drishti from a benefic in a Kendr, Trikon, or in Labh.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-surya-2",
    "dasha": "Ketu",
    "antarDasha": "Sūrya",
    "verses": "18-19½",
    "general": "",
    "adverse": "Danger from the king, separation from parents, journeys to foreign lands, distress from thieves, snakes and poison, punishment by government, antagonism with the friends, sorrows, danger from fever etc. will be the results, if Sūrya is associated with a malefic, or malefics in Randhr, or in Vyaya.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-surya-3",
    "dasha": "Ketu",
    "antarDasha": "Sūrya",
    "verses": "20-21",
    "general": "There will be physical fitness, gain of wealth, or the birth of a son, success in performance of pious deeds, headship of a small village etc., if Sūrya is in a Kendr, Trikon, in the 2nd, or 11th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-surya-4",
    "dasha": "Ketu",
    "antarDasha": "Sūrya",
    "verses": "22-24",
    "general": "There will be distress at the commencement of the Antar Dasha with some mitigation at its end.",
    "adverse": "Obstacles in availability of food, fears and loss of wealth and cattle will be the results, if Sūrya is associated with evil Grahas in the 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "There will be fear of premature death, if Sūrya is Dhan's, or Yuvati's Lord.",
    "remedial": "give a cow and gold in charity."
  },
  {
    "id": "ketu-candr-1",
    "dasha": "Ketu",
    "antarDasha": "Candr",
    "verses": "25-28",
    "general": "Effects, like recognition from the king, enthusiasm, well-being, enjoyments, acquisition of a house, lands etc., abnormal gains of food, clothes, conveyances, cattle etc., success in business, construction of reservoirs etc. and happiness to wife and children, will be derived in the Antar Dasha of Candr in the Dasha of Ketu, if Candr is in her exaltation, in her own Rāśi, in a Kendr, Trikon, in Labh, or in Dhan. The beneficial results will be realized fully, if Candr is waxing.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-candr-2",
    "dasha": "Ketu",
    "antarDasha": "Candr",
    "verses": "29-30",
    "general": "",
    "adverse": "Unhappiness and mental agony, obstacles in ventures, separation from parents, losses in business, destruction of cattle etc. will be caused, if Candr is in her debilitation Rāśi, or in Ari, Randhr, or Vyaya.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-candr-3",
    "dasha": "Ketu",
    "antarDasha": "Candr",
    "verses": "31-33",
    "general": "There will be the acquisition of a cow, or cows, land, agricultural lands, meeting kinsmen and the achievement of success through them, increase in cows milk and curd, if Candr is in a Kendr, Trikon, or in the 11th from the Lord of the Dasha and, if Candr is endowed with strength. There will be auspicious results at the commencement of the Antar Dasha, cordial relations with the king in the middle portion of the Antar Dasha.",
    "adverse": "danger from the king, foreign journey, or journeys to distant places at its end.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-candr-4",
    "dasha": "Ketu",
    "antarDasha": "Candr",
    "verses": "34-36",
    "general": "",
    "adverse": "Loss of wealth, anxiety, enmity with kinsmen and distress to brother, will be the results, if Candr is in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "If Candr is Dhan's, Yuvati's, or Randhr's Lord, there will be fear of premature death.",
    "remedial": "recitation of Mantras of Candr and giving in charity things, connected with Candr."
  },
  {
    "id": "ketu-mangal-1",
    "dasha": "Ketu",
    "antarDasha": "Mangal",
    "verses": "37-39",
    "general": "Effects, like acquisition of land, village etc., increase in wealth and cattle, laying out of a new garden, gain of wealth by the beneficence of the king, will be derived in the Antar Dasha of Mangal in the Dasha of Ketu, if Mangal is in his exaltation, in his own Rāśi, if Mangal is associated with, or, receives a Drishti from benefics. If Mangal is related to Dharm's, or Karm's Lord, there will definitely be gain of land and enjoyment.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-mangal-2",
    "dasha": "Ketu",
    "antarDasha": "Mangal",
    "verses": "40",
    "general": "There will be recognition from the king, great popularity and reputation and happiness from children and friends, if Mangal is in a Kendr, Trikon, or in the 3rd, or 11th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-mangal-3",
    "dasha": "Ketu",
    "antarDasha": "Mangal",
    "verses": "41-42",
    "general": "In the above circumstances amidst evil effects there will be some auspicious effects also.",
    "adverse": "There will be fear of death/disaster during a foreign journey, diabetes, unnecessary troubles, danger from thieves and the king and quarrels, if Mangal is in the 8th, 12th, or 2nd from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-mangal-4",
    "dasha": "Ketu",
    "antarDasha": "Mangal",
    "verses": "43-44",
    "general": "",
    "adverse": "High fever, danger from poison, distress to wife, mental agony",
    "deathEffects": "fear of premature death will be the results, if Mangal is Dhan's, or Yuvati's Lord.",
    "remedial": "giving a bull in charity to obtain enjoyment and gain of property."
  },
  {
    "id": "ketu-rahu-1",
    "dasha": "Ketu",
    "antarDasha": "Rahu",
    "verses": "45-47",
    "general": "Effects, like increase of wealth and gain of wealth, grains, cattle, lands, village from a Yavan king, will be derived in the Antar Dasha of Rahu in the Dasha of Ketu, if Rahu is in his exaltation, his own, in a friends Rāśi, or in a Kendr, or Trikon, or in Labh, or Sahaj, or Dhan. There will be some trouble at the commencement of the Dasha, but all will be well later.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-rahu-2",
    "dasha": "Ketu",
    "antarDasha": "Rahu",
    "verses": "48-50",
    "general": "",
    "adverse": "Frequent urination, weakness in the body, cold fever, danger from thieves, intermittent fever, opprobrium, quarrels, diabetes, pain in stomach will be the results, if Rahu is associated with a malefic in Randhr, or in Vyaya.",
    "deathEffects": "There will be distress and danger, if Rahu is in Dhan, or in Yuvati.",
    "remedial": "Durga Saptashati Path."
  },
  {
    "id": "ketu-guru-1",
    "dasha": "Ketu",
    "antarDasha": "Guru",
    "verses": "51-54",
    "general": "Effects, like increase in wealth and grains, beneficence of the king, enthusiasm, gain of conveyances etc., celebration, like birth of a son at home, performance of pious deeds, Yagyas, conquest of the enemy and enjoyments, will be derived in the Antar Dasha of Guru in the Dasha of Ketu, if Guru is in his exaltation, in his own Rāśi, or is associated with Lagn's, Dharm's, or Karm's Lord in a Kendr, or Trikon.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-guru-2",
    "dasha": "Ketu",
    "antarDasha": "Guru",
    "verses": "55-56",
    "general": "Though some good effects may be felt at the commencement of the Antar Dasha, there will be only adverse results later.",
    "adverse": "Danger from thieves, snakes and wounds, destruction of wealth, separation from wife and children, physical distress etc. will be the results, if Guru is in his debilitation Rāśi, or in Ari, Randhr, or Vyaya.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-guru-3",
    "dasha": "Ketu",
    "antarDasha": "Guru",
    "verses": "57-58½",
    "general": "There will be gains of many varieties of garments, ornaments by the beneficence of the king, foreign journeys, taking care of kinsmen, availability of decent food, if Guru is associated with a benefic in a Kendr, Trikon, in the 3rd, or 11th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-guru-4",
    "dasha": "Ketu",
    "antarDasha": "Guru",
    "verses": "59-60",
    "general": "",
    "adverse": "",
    "deathEffects": "Fear of premature death will be caused, if Guru is Dhan's, or Yuvati's Lord.",
    "remedial": "Mrityunjaya Japa and recitation of Shiva Sahasranama."
  },
  {
    "id": "ketu-sani-1",
    "dasha": "Ketu",
    "antarDasha": "Śani",
    "verses": "61-62½",
    "general": "Effects, like increase in cattle wealth, will be derived.",
    "adverse": "distress to oneself and one's kinsmen, agony, loss of wealth, as a result of imposition of fines by government, resignation from the existing post, journeys to foreign lands and danger of thieves during travelling, will be derived in the Antar Dasha of Śani in the Dasha of Ketu, if Śani is deprived of strength and dignity. There will be loss of wealth and lethargy, if Śani is in Randhr, or Vyaya.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-sani-2",
    "dasha": "Ketu",
    "antarDasha": "Śani",
    "verses": "63-65",
    "general": "Success in all ventures, happiness from the employer, comforts during journeys, increase in happiness and property in ones own village, audience with the king etc. will be the results, if Śani is in a Trikon in Meen, in Tula, in his own Rāśi, or, if Śani is in an auspicious Navāńś, or is associated with a benefic in a Kendr, Trikon, or in Sahaj.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-sani-3",
    "dasha": "Ketu",
    "antarDasha": "Śani",
    "verses": "67-68",
    "general": "",
    "adverse": "obstacles in ventures, lethargy, defamation, death of parents, if Śani is associated with a malefic, in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "There will be physical distress, agony, and fear of premature death may be expected, if Śani is Dhan's, or Yuvati's Lord.",
    "remedial": "performance of Havan with sesame seeds (Til) and giving a black cow, or female buffalo in charity."
  },
  {
    "id": "ketu-budh-1",
    "dasha": "Ketu",
    "antarDasha": "Budh",
    "verses": "69-71",
    "general": "Effects, like acquisition of a kingdom, enjoyments, charities, gain of wealth and land, birth of a son, celebration of religious functions and functions, like marriage suddenly, well-being in the family, gain of clothes, ornaments etc., will be derived in the Antar Dasha of Budh in the Dasha of Ketu, if Budh is in a Kendr, or Trikon, or, if Budh is in his exaltation, or in his own Rāśi.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-budh-2",
    "dasha": "Ketu",
    "antarDasha": "Budh",
    "verses": "72",
    "general": "There will be association with men of learning, dawn of fortune and listening to religious discourses, if Budh is associated with Dharm's, or Karm's Lord.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-budh-3",
    "dasha": "Ketu",
    "antarDasha": "Budh",
    "verses": "73-74½",
    "general": "There will be some beneficial effects at the commencement of the Dasha, still better results in the middle, but inauspicious at the end.",
    "adverse": "Antagonism with government officials, residing in other people's houses, destruction of wealth, clothes, conveyances and cattle will be the results, if Budh is associated with Śani, Mangal, or Rahu in Ari, Randhr, or Vyaya.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-budh-4",
    "dasha": "Ketu",
    "antarDasha": "Budh",
    "verses": "75-76",
    "general": "There will be good health, happiness from one's son, opulence and glory, availability of good food and clothes and abnormal profits in business, if Budh is in a Kendr, Trikon, or in the 11th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "ketu-budh-5",
    "dasha": "Ketu",
    "antarDasha": "Budh",
    "verses": "77-79",
    "general": "There will, however, be visits to sacred places in the middle of the Dasha.",
    "adverse": "Distress, unhappiness and troubles to wife and children and danger from the king may be expected at the commencement of the Antar Dasha, if Budh is weak in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "Fear of premature death will be caused, if Budh is Dhan's, or Yuvati's Lord.",
    "remedial": "recitation of Vishnu Sahasranam."
  }
]

data.extend(new_items)

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Successfully updated JSON with Ketu Dasha items!")
