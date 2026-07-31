import json

file_path = "d:/Astro Consult-Vedic Astrology/Vedic Astrology/frontend/src/data/vimshottariExplanation.json"

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

new_items = [
  {
    "id": "budh-budh-1",
    "dasha": "Budh",
    "antarDasha": "Budh",
    "verses": "1-3½",
    "general": "Gain of jewels, like pearls etc., learning, increase in happiness and performance of pious deeds, success in the educational sphere, acquisition of name and fame, meeting with new kings, gain of wealth and happiness from wife, children and parents will be the effects in the Antar Dasha of Budh in his own Dasha, if Budh is placed in his exaltation Rāśi, or is otherwise well placed.",
    "adverse": "There will be loss of wealth and cattle, antagonism with kinsmen, diseases, like stomach pains, piety in discharging duties, as a government official, if Budh is in his debilitation Rāśi etc., or, if Budh is in Ari, Randhr, or Vyaya, or, if Budh is associated with malefics.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-budh-2",
    "dasha": "Budh",
    "antarDasha": "Budh",
    "verses": "4-5",
    "general": "",
    "adverse": "Distress to wife, death of members of the family, affliction with diseases, like rheumatism and stomach pains etc. will result.",
    "deathEffects": "if Budh is Dhan's, or Yuvati's Lord.",
    "remedial": "recitation of Vishnu Sahasranam."
  },
  {
    "id": "budh-ketu-1",
    "dasha": "Budh",
    "antarDasha": "Ketu",
    "verses": "6-8½",
    "general": "Effects, like physical fitness, little gain of wealth, affectionate relations with kinsmen, increase in cattle wealth, income from industries, success in the educational sphere, acquisition of name and fame, honours, audience with the king and joining a banquet with him, comforts of clothes etc., will be experienced, if Ketu is associated with benefics in a Kendr, or Trikon, or, if Ketu is yuti with Lagn's Lord, or with a Yog Karak. The same will be the results, if Ketu is in a Kendr, or in the 11th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-ketu-2",
    "dasha": "Budh",
    "antarDasha": "Ketu",
    "verses": "9-11",
    "general": "",
    "adverse": "Fall from a conveyance, distress to son, danger from the king, indulgence in sinful deeds, danger from scorpions etc., quarrels with the menials, sorrow, diseases and association with menials etc. will be the results, if Ketu is yuti with malefics in the 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-ketu-3",
    "dasha": "Budh",
    "antarDasha": "Ketu",
    "verses": "12",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, if Ketu is Dhan's, or Yuvati's Lord.",
    "remedial": "giving a goat in charity."
  },
  {
    "id": "budh-sukr-1",
    "dasha": "Budh",
    "antarDasha": "Śukr",
    "verses": "13-15½",
    "general": "Effects, like inclination to perform religious rites, fulfillment of all ambitions through the help of the king and friends, gains of agricultural lands and happiness etc. will be derived in the Antar Dasha of Śukr in the Dasha of Budh, if Śukr is in a Kendr, in Labh, in Putr, or in Dharm. There will be acquisition of a kingdom, gain of wealth and property, construction of a reservoir, readiness to give charities and to perform religious rites, extraordinary gain of wealth and gains in business, if Śukr is in a Kendr, in the 5th, 9th, or 11th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-sukr-2",
    "dasha": "Budh",
    "antarDasha": "Śukr",
    "verses": "16-17½",
    "general": "",
    "adverse": "Heart disease, defamation, fevers, dysentery, separation from kinsmen, physical distress and agony will result, if Śukr is weak in the 6th, 8th, or 12th from the Lord, or the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-sukr-3",
    "dasha": "Budh",
    "antarDasha": "Śukr",
    "verses": "18-19",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be fear of premature death, if Śukr is Dhan's, or Yuvati's Lord.",
    "remedial": "recite Mantras of Goddess Durga."
  },
  {
    "id": "budh-surya-1",
    "dasha": "Budh",
    "antarDasha": "Sūrya",
    "verses": "20-22",
    "general": "Effects, like dawn of fortune by the beneficence of the king, happiness from friends etc., will be derived in the Antar Dasha of Sūrya in the Dasha of Budh, if Sūrya is in his own, or in his exaltation Rāśi, or in a Kendr, or Trikon, or in Dhan, or Labh, or in his exalted, or own Navāńś. There will be acquisition of land, if Sūrya receives a Drishti from Mangal and comforts of good food and clothes, if such a Sūrya receives a Drishti from Lagn's Lord.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-surya-2",
    "dasha": "Budh",
    "antarDasha": "Sūrya",
    "verses": "23-24",
    "general": "",
    "adverse": "Fear, or danger from thieves, fire and weapons, bilious troubles, headaches, mental agony and separation from friends etc. will be the results, if Sūrya is in Ari, Randhr, or Vyaya from Lagn, or from the Lord of the Dasha and, if Sūrya is weak and associated with Śani, Mangal and Rahu.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-surya-3",
    "dasha": "Budh",
    "antarDasha": "Sūrya",
    "verses": "25",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be fear of premature death, if Sūrya is Dhan's, or Yuvati's Lord.",
    "remedial": "Worship of Sūrya."
  },
  {
    "id": "budh-candr-1",
    "dasha": "Budh",
    "antarDasha": "Candr",
    "verses": "26-27",
    "general": "The Yog becomes very strong for beneficial effects, if in the Antar Dasha of Candr in the Dasha of Budh Candr is in a Kendr, or Trikon from Lagn, or, if Candr is in her exaltation, or in her own Rāśi, associated with, or receiving a Drishti from Guru, or, if Candr is a Yog Karak herself. Then there will be marriage, birth of a son and gain of clothes and ornaments.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-candr-2",
    "dasha": "Budh",
    "antarDasha": "Candr",
    "verses": "28-29½",
    "general": "In the circumstances, mentioned above, there will also be construction of a new house, availability of sweetish preparations, enjoyment of music, study of Shastras, journey to the South, gains of clothes from beyond the seas, gain of gems, like pearls etc.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-candr-3",
    "dasha": "Budh",
    "antarDasha": "Candr",
    "verses": "30-31½",
    "general": "If Candr is in a Kendr, Trikon, in the 3rd, or 11th from the Lord of the Dasha, there will be at the commencement of the Antar Dasha visits to sacred shrines, patience, enthusiasm and gains of wealth from foreign countries.",
    "adverse": "There will be physical distress, if Candr is in her debilitation, or in an enemy's Rāśi.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-candr-4",
    "dasha": "Budh",
    "antarDasha": "Candr",
    "verses": "32-33",
    "general": "",
    "adverse": "Danger from the king, fire and thieves, defamation, or disgrace and loss of wealth on account of wife, destruction of agricultural lands and cattle etc. will be the results, if Candr is weak and is in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-candr-5",
    "dasha": "Budh",
    "antarDasha": "Candr",
    "verses": "34-35",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, if Candr is Dhan's, or Yuvati's Lord.",
    "remedial": "reciting the Mantras of Goddess Durga and giving clothes in charity."
  },
  {
    "id": "budh-mangal-1",
    "dasha": "Budh",
    "antarDasha": "Mangal",
    "verses": "36-38½",
    "general": "Effects, like well-being and enjoyments in the family by the beneficence of the king, increase in property, recovery of a lost kingdom etc., birth of a son, satisfaction, acquisition of cattle, conveyances and agricultural lands, happiness from wife etc., will be derived in the Antar Dasha of Mangal in the Dasha of Budh, if Mangal is in his exaltation, in his own Rāśi, in a Kendr, or Trikon, or, if Mangal is associated with Lagn's Lord.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-mangal-2",
    "dasha": "Budh",
    "antarDasha": "Mangal",
    "verses": "39-40½",
    "general": "",
    "adverse": "Physical distress, mental agony, obstacles in industrial ventures, loss of wealth, gout, distress from wounds and danger from weapons and fever etc. will be the results, if Mangal be associated with, or receives a Drishti from malefics in Randhr, or in Vyaya.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-mangal-3",
    "dasha": "Budh",
    "antarDasha": "Mangal",
    "verses": "41-42",
    "general": "There will be gain of wealth, physical felicity, birth of a son, good reputation, affectionate relations etc. with kinsmen etc., if Mangal receives a Drishti from benefics in a Kendr, Trikon, or in the 11th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-mangal-4",
    "dasha": "Budh",
    "antarDasha": "Mangal",
    "verses": "43-44½",
    "general": "enjoyments and gains of wealth in the middle portion of the Antar Dasha",
    "adverse": "If Mangal be associated with malefics in the 8th, or 12th from the Lord of the Dasha, there will be distress, danger from kinsmen, wrath of the king and fire, antagonism with the son, loss of position at the commencement of the Antar Dasha, danger from the king and loss of position at the end of the Antar Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-mangal-5",
    "dasha": "Budh",
    "antarDasha": "Mangal",
    "verses": "45-46",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be fear of premature death, if Mangal is Dhan's, or Yuvati's Lord.",
    "remedial": "Mrityunjaya Japa and giving a cow in charity."
  },
  {
    "id": "budh-rahu-1",
    "dasha": "Budh",
    "antarDasha": "Rahu",
    "verses": "47-49",
    "general": "Effects, like reverence from the king, good reputation, gain of wealth, visits to sacred shrines, performance of religious sacrifices and oblations, recognition, gain of clothes etc., are derived in the Antar Dasha of Rahu in the Dasha of Budh, if Rahu is in a Kendr, or Trikon, or, if Rahu is in Mesh, Kumbh, Kanya, or Vrishabh. There will be some evil effects at the commencement of the Antar Dasha, but all will be well later.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-rahu-2",
    "dasha": "Budh",
    "antarDasha": "Rahu",
    "verses": "51",
    "general": "There will be an opportunity to have conversation, or a meeting with the king, if Rahu is in Sahaj, Randhr, Karm, or Labh. In this position, if Rahu be associated with a benefic, there will be a visit to a new king.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-rahu-3",
    "dasha": "Budh",
    "antarDasha": "Rahu",
    "verses": "52-53",
    "general": "",
    "adverse": "Pressure of hard work, as a government functionary, loss of position, fears, imprisonment, diseases, agony to self and kinsmen, heart disease, loss of reputation and wealth, will be the results, if Rahu is associated with a malefic, or malefics in the 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-rahu-4",
    "dasha": "Budh",
    "antarDasha": "Rahu",
    "verses": "54-55",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be fear of premature death, if Rahu is in Dhan, or in Ari.",
    "remedial": "recitation of Mantras of Goddess Durga and Goddess Lakshmi and giving a tawny-coloured cow, or female buffalo in charity."
  },
  {
    "id": "budh-guru-1",
    "dasha": "Budh",
    "antarDasha": "Guru",
    "verses": "56-58½",
    "general": "Effects, like physical felicity, gain of wealth, beneficence of the king, celebration of auspicious functions, like marriage etc., at home, availability of sweetish preparations, increase in cattle wealth, attending discourses on Puranas etc., devotion to deities and the preceptor, interest in religion, charities etc., worship of Lord Shiva etc., will be derived in the Antar Dasha of Guru in the Dasha of Budh, if Guru is in a Kendr, Trikon, or in Labh, or, if Guru is in his exaltation, or in his own Rāśi.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-guru-2",
    "dasha": "Budh",
    "antarDasha": "Guru",
    "verses": "59-61",
    "general": "",
    "adverse": "Discord with king and kinsmen, danger from thieves etc., death of parents, disgrace, punishment from government, loss of wealth, danger from snakes and poison, fever, losses in agricultural production, loss of lands etc., will be the results, if Guru is in his debilitation Rāśi, is combust, or is in Ari, Randhr, or in Vyaya, or, if Guru is associated with, or receives a Drishti from Śani and Mangal.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-guru-3",
    "dasha": "Budh",
    "antarDasha": "Guru",
    "verses": "62-63½",
    "general": "There will be happiness from kinsmen and from one's son, enthusiasm, increase in wealth and name and fame, giving grains etc. in charity, if Guru is in a Kendr, Trikon, or in the 11th from the Lord of the Dasha and, if Guru is endowed with strength.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-guru-4",
    "dasha": "Budh",
    "antarDasha": "Guru",
    "verses": "64-64½",
    "general": "",
    "adverse": "Agony, anxiety, danger from diseases, antagonism with wife and kinsmen, wrath of the king, quarrels, loss of wealth, danger from Brahmins will be the results, if Guru is weak and, if Guru is in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-guru-5",
    "dasha": "Budh",
    "antarDasha": "Guru",
    "verses": "65-66",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, if Guru is Dhan's, or Yuvati's Lord, or, if Guru is in Dhan, or Yuvati.",
    "remedial": "recitation of Shiva Sahasranam and giving a cow and gold in charity."
  },
  {
    "id": "budh-sani-1",
    "dasha": "Budh",
    "antarDasha": "Śani",
    "verses": "67-68½",
    "general": "Effects, like well-being in the family, acquisition of a kingdom, enthusiasm, increase in cattle wealth, gain of a position, visits to sacred shrines etc., will be derived in the Antar Dasha of Śani in the Dasha of Budh, if Śani is in his exaltation, his in his own Rāśi, or in a Kendr, or Trikon, or in Labh.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-sani-2",
    "dasha": "Budh",
    "antarDasha": "Śani",
    "verses": "69-70½",
    "general": "",
    "adverse": "Danger from enemies, distress to wife and children, loss of thinking power, loss of kinsmen, loss in ventures, mental agony, journeys to foreign lands and bad dreams will be the results, if Śani is in the 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "budh-sani-3",
    "dasha": "Budh",
    "antarDasha": "Śani",
    "verses": "71-72",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be fear of premature death, if Śani is Dhan's, or Yuvati's Lord.",
    "remedial": "performance of Mrityunjaya Japa and giving a black cow and female buffalo in charity."
  }
]

data.extend(new_items)

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Successfully updated JSON with Budh Dasha items!")
