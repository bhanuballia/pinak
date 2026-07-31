import json

file_path = "d:/Astro Consult-Vedic Astrology/Vedic Astrology/frontend/src/data/vimshottariExplanation.json"

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

new_items = [
  {
    "id": "sukr-sukr-1",
    "dasha": "Śukr",
    "antarDasha": "Śukr",
    "verses": "1-2½",
    "general": "Effects, like gain of wealth, cattle etc. through Brahmins, celebrations in connection with the birth of a son, well-being, recognition from the king, acquisition of a kingdom, will be derived in the Antar Dasha of Śukr in his own Dasha, if Śukr is in a Kendr, Trikon, or in Labh and, if Śukr is endowed with strength.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-sukr-2",
    "dasha": "Śukr",
    "antarDasha": "Śukr",
    "verses": "3-6",
    "general": "Construction of a new house, availability of sweet preparations, happiness to wife and children, companionship with a friend, giving grains etc. in charity, beneficence of the king, gain of clothes, conveyances and ornaments, success in business, increase in the number of cattle, gain of garments by performing journeys in the western direction etc. will be the results, if Śukr is in his exaltation, in his own Rāśi, or, if Śukr is in his exalted, or own Navāńś.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-sukr-3",
    "dasha": "Śukr",
    "antarDasha": "Śukr",
    "verses": "7-8",
    "general": "There will be acquisition of a kingdom, enthusiasm, beneficence of the king, well-being in the family, increase in the number of wives, children and wealth etc., if Śukr is associated with, or receives a Drishti from a benefic and is in a friendly Navāńś, in Sahaj, Ari, or Labh.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-sukr-4",
    "dasha": "Śukr",
    "antarDasha": "Śukr",
    "verses": "9-10",
    "general": "",
    "adverse": "Danger from thieves etc., antagonistic relations with government officials, destruction of friends and kinsmen, distress to wife and children may be expected, if Śukr is associated with, or receives a Drishti from a malefic in Ari, Randhr, or Vyaya.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-sukr-5",
    "dasha": "Śukr",
    "antarDasha": "Śukr",
    "verses": "11",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be fear of death, if Śukr is Dhan's, or Yuvati's Lord.",
    "remedial": "Durga Path and giving a cow in charity."
  },
  {
    "id": "sukr-surya-1",
    "dasha": "Śukr",
    "antarDasha": "Sūrya",
    "verses": "12",
    "general": "",
    "adverse": "There will be a period of agony, wrath of the king, quarrels with the coparceners etc. in the Antar Dasha of Sūrya in the Dasha of Śukr, if Sūrya is in any Rāśi, other than his exaltation, or debilitation Rāśi.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-surya-2",
    "dasha": "Śukr",
    "antarDasha": "Sūrya",
    "verses": "13-15",
    "general": "Effects, like acquisition of a kingdom and wealth, happiness from wife and children, happiness from employer, meeting with friends, happiness from parents, marriage, name and fame, betterment of fortune, birth of a son etc., will be experienced, if Sūrya is in his exaltation, in his own Rāśi, in a Kendr, Trikon, in Dhan, or Labh, or in Kendr, Trikon, in the 2nd, or 11th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-surya-3",
    "dasha": "Śukr",
    "antarDasha": "Sūrya",
    "verses": "16-18",
    "general": "",
    "adverse": "Distress, agony, distress to members of the family, harsh language, distress to father, loss of kinsmen, wrath of the king, danger at home, many diseases, destruction of agricultural production etc. will be the results, if Sūrya is in Ari, Randhr, or Vyaya, or, if Sūrya is in his debilitation, or in an enemy's Rāśi.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-surya-4",
    "dasha": "Śukr",
    "antarDasha": "Sūrya",
    "verses": "19-20",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be evil influence of the Grahas, if Sūrya is Dhan's, or Yuvati's Lord.",
    "remedial": "Worship of Sūrya."
  },
  {
    "id": "sukr-candr-1",
    "dasha": "Śukr",
    "antarDasha": "Candr",
    "verses": "21-22",
    "general": "Effects, like gain of wealth, conveyances, clothes by the beneficence of the king, happiness in the family, great opulence and glory, devotion to deities and Brahmins, will be derived in the Antar Dasha of Candr in the Dasha of Śukr, if Candr is in her exaltation, or in her own Rāśi, or is associated with the Lord of Dharm, benefics, or with Karm's Lord, or, if Candr is in a Kendr, Trikon, or Labh.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-candr-2",
    "dasha": "Śukr",
    "antarDasha": "Candr",
    "verses": "23-23½",
    "general": "In the above circumstances there will also be association with musicians and men of learning and receiving of decorations, gain of cows, buffaloes and other cattle, abnormal profits in business, dining with brothers etc.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-candr-3",
    "dasha": "Śukr",
    "antarDasha": "Candr",
    "verses": "24-26½",
    "general": "",
    "adverse": "Loss of wealth, fears, physical distress, agony, wrath of the king, journeys to foreign lands, or pilgrimage, distress to wife and children and separation from kinsmen will be the results, if Candr is in her debilitation Rāśi, is combust, or is in Ari, Randhr, or Vyaya, or, if Candr is in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-candr-4",
    "dasha": "Śukr",
    "antarDasha": "Candr",
    "verses": "27-29",
    "general": "There will be sovereignty over a province, or village by the beneficence of the king, clothes etc., construction of a reservoir, increase in wealth etc., if Candr is in a Kendr, or Trikon, or in the 3rd, or 11th from the Lord of the Dasha. There will be physical fitness at the commencement of the Antar Dasha.",
    "adverse": "physical distress in its last portion.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-mangal-1",
    "dasha": "Śukr",
    "antarDasha": "Mangal",
    "verses": "30-31½",
    "general": "Effects, like acquisition of kingdom, property, clothes, ornaments, land and desired objects, will be derived in the Antar Dasha of Mangal in the Dasha of Śukr, if Mangal is in a Kendr, or Trikon, or in Labh, or, if Mangal is in his exaltation Rāśi, or is in one of his own Rāśis, or is associated with the Lagn's, Dharm's, or Karm's Lord.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-mangal-2",
    "dasha": "Śukr",
    "antarDasha": "Mangal",
    "verses": "32-34",
    "general": "",
    "adverse": "There will be fever from cold, diseases (like fever) to parents, loss of position, quarrels, antagonism with the king and government officials, extravagant expenditure etc., if Mangal is in Ari, Randhr, or Vyaya, or, if Mangal is in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-mangal-3",
    "dasha": "Śukr",
    "antarDasha": "Mangal",
    "verses": "35",
    "general": "",
    "adverse": "losses in profession, loss of village, land etc.",
    "deathEffects": "Physical distress will be the results, if Mangal is the Dhan's, or Yuvati's Lord.",
    "remedial": ""
  },
  {
    "id": "sukr-rahu-1",
    "dasha": "Śukr",
    "antarDasha": "Rahu",
    "verses": "36-37½",
    "general": "Effects, like great enjoyment, gain of wealth, visits of friends, successful journeys, gain of cattle and land etc., will be derived in the Antar Dasha of Rahu in the Dasha of Śukr, if Rahu is in a Kendr, or Trikon, or in Labh, or, if Rahu is in his exaltation, or in his own Rāśi, or is associated with, or receives a Drishti from benefics.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-rahu-2",
    "dasha": "Śukr",
    "antarDasha": "Rahu",
    "verses": "38-39",
    "general": "Enjoyments, destruction of enemy, enthusiasm and beneficence of the king will be the results, if Rahu is in Sahaj, or Ari, or Karm, or Labh. Good effects will be experienced up to 5 months from the commencement of the Antar Dasha.",
    "adverse": "at the end of the Dasha there will be danger from fevers and indigestion.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-rahu-3",
    "dasha": "Śukr",
    "antarDasha": "Rahu",
    "verses": "40-41½",
    "general": "In the above circumstances, except for obstacles in ventures and journeys and worries, there will be all enjoyment, like those of a king. Journeys to foreign lands will bring success and the person will return safely to his homeland. There will also be blessings from Brahmins and auspicious results consequent to visits to holy places.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-rahu-4",
    "dasha": "Śukr",
    "antarDasha": "Rahu",
    "verses": "42-44",
    "general": "",
    "adverse": "There will be inauspicious effects on oneself and one's parents and antagonism with people, if Rahu be associated with a malefic in the 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "Physical distress will be caused, if Rahu is Dhan's, or Yuvati's Lord.",
    "remedial": "Mrityunjaya Japa."
  },
  {
    "id": "sukr-guru-1",
    "dasha": "Śukr",
    "antarDasha": "Guru",
    "verses": "45-48",
    "general": "Effects, like recovery of the lost kingdom, acquisition of desired grains, clothes and property etc., reverence from one's friend and the king and gain of wealth, recognition from the king, good reputation, gain of conveyances, association with an employer and with men of learning, industriousness in the study of Shastras, birth of a son, satisfaction, visits of close friends, happiness to parents and son etc., will be derived in the Antar Dasha of Guru in the Dasha of Śukr, if Guru is in his exaltation, in his own Rāśi, or in a Kendr, or Trikon to Lagn, or to the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-guru-2",
    "dasha": "Śukr",
    "antarDasha": "Guru",
    "verses": "49-50",
    "general": "",
    "adverse": "There will be danger from the king and from thieves, distress to oneself and to kinsmen, quarrels, mental agony, loss of position, going away to foreign lands and danger of many kinds of diseases, if Guru is in the 6th, 8th, or 12th from the Lord of the Dasha and be associated with a malefic.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-guru-3",
    "dasha": "Śukr",
    "antarDasha": "Guru",
    "verses": "51",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, if Guru is Dhan's, or Yuvati's Lord.",
    "remedial": "Mrityunjaya Japa."
  },
  {
    "id": "sukr-sani-1",
    "dasha": "Śukr",
    "antarDasha": "Śani",
    "verses": "52-54",
    "general": "Effects, like great enjoyments, visits of friends and kinsmen, recognition from the king, birth of a daughter, visits to holy places and sacred shrines, conferment of authority by the king, will be derived in the Antar Dasha of Śani in the Dasha of Śukr, if Śani is in his exaltation, in his own Rāśi, in a Kendr, Trikon, or in his own Navāńś.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-sani-2",
    "dasha": "Śukr",
    "antarDasha": "Śani",
    "verses": "55-57",
    "general": "",
    "adverse": "There will be lethargy and more expenditure than income, if Śani is in his debilitation Rāśi. Many kinds of distresses and troubles at the commencement of the Antar Dasha, like stress to parents, wife and children, going away to foreign lands, losses in profession, destruction of cattle etc., will be the results, if Śani is in Randhr, or Labh, or Vyaya, or, if Śani is in the 8th, 11th, or 12th from the Lord of the Dasha.",
    "deathEffects": "There will be physical distress, if Śani is Dhan's, or Yuvati's Lord.",
    "remedial": "Havan with sesame seeds (Til), Mrityunjaya Japa, Durga Saptashati Path."
  },
  {
    "id": "sukr-budh-1",
    "dasha": "Śukr",
    "antarDasha": "Budh",
    "verses": "60-62",
    "general": "Effects, like dawn of fortune, birth of a son, gain of wealth through judgement of court, listening to stories from the Puranas, association with persons, competent in poetry etc., visits of close friends, happiness from employer, availability of sweetish preparations etc., will be derived in the Antar Dasha of Budh in the Dasha of Śukr, if Budh is in a Kendr, or Trikon, or in Labh (from Lagn, or from the Lord of the Dasha), or is in his exaltation, or in his own Rāśi.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-budh-2",
    "dasha": "Śukr",
    "antarDasha": "Budh",
    "verses": "63-65",
    "general": "There will be some good effects at the commencement, moderate in the middle portion.",
    "adverse": "If Budh is in the 6th, 8th, or 12th from the Lord of Dasha, or, if Budh is weak, or is associated with a malefic, there will be agony, loss of cattle, residence in other people's houses and losses in business. There will be distress from fever etc. at the end of the Antar Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-budh-3",
    "dasha": "Śukr",
    "antarDasha": "Budh",
    "verses": "66",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, if Budh is Dhan's, or Yuvati's Lord.",
    "remedial": "recitation of Vishnu Sahasranam."
  },
  {
    "id": "sukr-ketu-1",
    "dasha": "Śukr",
    "antarDasha": "Ketu",
    "verses": "67-68",
    "general": "Auspicious effects, like availability of sweetish preparations, abnormal gains in profession and increase in cattle wealth, will be derived from the very commencement of the Antar Dasha of Ketu in the Dasha of Śukr, if Ketu is in his exaltation, or in his own Rāśi, or is related to a Yog Karak Grah, or, if Ketu is possessed of positional strength.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-ketu-2",
    "dasha": "Śukr",
    "antarDasha": "Ketu",
    "verses": "69-69½",
    "general": "In the above circumstances there will be definite victory in war at the end of the Antar Dasha. Moderate results will be experienced in the middle portion.",
    "adverse": "sometimes there will also be the feeling of distress.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-ketu-3",
    "dasha": "Śukr",
    "antarDasha": "Ketu",
    "verses": "70-72",
    "general": "",
    "adverse": "There will be danger from snakes, thieves and wounds, loss of power of thinking, headache, agony, quarrels without any cause, or reason, diabetes, excessive expenditure, antagonism with wife and children, going away to foreign land, loss in ventures, if Ketu is in the 8th, or 12th from the Lord of the Dasha, or, if Ketu is associated with a malefic.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sukr-ketu-4",
    "dasha": "Śukr",
    "antarDasha": "Ketu",
    "verses": "73-74",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, if Ketu is Dhan's, or Yuvati's Lord.",
    "remedial": "Mrityunjaya Japa and giving a goat in charity. Remedial measures for appeasing Śukr will also prove beneficial."
  }
]

data.extend(new_items)

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Successfully updated JSON with Śukr Dasha items!")
