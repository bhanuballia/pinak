import json

file_path = "d:/Astro Consult-Vedic Astrology/Vedic Astrology/frontend/src/data/vimshottariExplanation.json"

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

new_items = [
  {
    "id": "sani-sani-1",
    "dasha": "Śani",
    "antarDasha": "Śani",
    "verses": "1-3",
    "general": "Effects, like acquisition of a kingdom, happiness from wife and children, acquisition of conveyances, like elephants, gain of clothes, attainment of the position of a Commander of the Army by the beneficence of the king, acquisition of cattle, villages and land etc., will be derived in the Antar Dasha of Śani in the Dasha of Śani, if Śani is in his own, in his exaltation Rāśi, or in deep exaltation, or, if Śani is in a Kendr, or Trikon, or, if Śani is a Yog Karak.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-sani-2",
    "dasha": "Śani",
    "antarDasha": "Śani",
    "verses": "4-5½",
    "general": "The last part of the Dasha will yield beneficial results.",
    "adverse": "Fear, or danger from the king, getting inflicted with injuries with some weapon, bleeding gums, dysentery etc. will be the evil effects at the commencement of the Dasha, if Śani is in Randhr, or Vyaya, or, if Śani is associated with malefics in his debilitation Rāśi. There will be danger from thieves etc., going away from the homeland, mental agony etc. in the middle portion of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-sani-3",
    "dasha": "Śani",
    "antarDasha": "Śani",
    "verses": "6-7",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be danger of premature death, if Śani is Dhan's, or Yuvati's Lord.",
    "remedial": "Lord Shiva will afford protection and render relief, if Mrityunjaya Japa is performed in the prescribed manner."
  },
  {
    "id": "sani-budh-1",
    "dasha": "Śani",
    "antarDasha": "Budh",
    "verses": "8-11",
    "general": "Effects, like reverence from the people, good reputation, gain of wealth, comforts of conveyances etc., inclination towards performance of religious sacrifices (Yagyas), Raj Yog, bodily felicity, enthusiasm, well-being in the family, pilgrimage to holy places, performance of religious rites, listening to Puranas, charities, availability of sweetish preparations etc., will be derived in the Antar Dasha of Budh in the Dasha of Śani, if Budh is in a Kendr, or Trikon.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-budh-2",
    "dasha": "Śani",
    "antarDasha": "Budh",
    "verses": "12-13½",
    "general": "Acquisition of a kingdom, gain of wealth, headship of a village will be the effects at the commencement of the Dasha, if Budh is in Ari, Randhr, or Vyaya from Lagn, or from the Lord of the Dasha, or, if Budh is associated with Sūrya, Mangal and Rahu.",
    "adverse": "Affliction with diseases, failure in all ventures, anxiety and feeling of danger etc. will be experienced in the middle portion and in the last part of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-budh-3",
    "dasha": "Śani",
    "antarDasha": "Budh",
    "verses": "14-15",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, if Budh is Dhan's, or Yuvati's Lord.",
    "remedial": "recitation of Vishnu Sahasranam and giving grains in charity to regain enjoyment in life."
  },
  {
    "id": "sani-ketu-1",
    "dasha": "Śani",
    "antarDasha": "Ketu",
    "verses": "16-18",
    "general": "If Ketu is related to the Lagn's Lord, there will be gain of wealth and enjoyment and bathing in holy places and visit to a sacred shrine at the commencement of the Antar Dasha.",
    "adverse": "Evil effects, like loss of position, dangers, poverty, distress, foreign journeys etc., will be derived in the Antar Dasha of Ketu in the Dasha of Śani, even if Ketu is in his exaltation, in his own, in a benefic Rāśi, or in a Kendr, or Trikon, or, if Ketu is associated with, or receives a Drishti from benefics.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-ketu-2",
    "dasha": "Śani",
    "antarDasha": "Ketu",
    "verses": "19-19½",
    "general": "Gain of physical strength and courage, religious thoughts, audience with the king (high dignitaries of government) and all kinds of enjoyments will be experienced, if Ketu is in a Kendr, in a Trikon, in the 3rd, or 11th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-ketu-3",
    "dasha": "Śani",
    "antarDasha": "Ketu",
    "verses": "20-21½",
    "general": "",
    "adverse": "coarse food, cold fever, dysentery, wounds, danger from thieves, separation from wife and children etc., will be the results, if Ketu is in Randhr, or Vyaya from Lagn, or from the Lord of the Dasha.",
    "deathEffects": "Fear of premature death",
    "remedial": ""
  },
  {
    "id": "sani-ketu-4",
    "dasha": "Śani",
    "antarDasha": "Ketu",
    "verses": "22-23",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, if Ketu is in Dhan, or Yuvati.",
    "remedial": "giving a goat in charity to regain enjoyments of life."
  },
  {
    "id": "sani-sukr-1",
    "dasha": "Śani",
    "antarDasha": "Śukr",
    "verses": "24-27½",
    "general": "Effects, like marriage, birth of a son, gain of wealth, sound health, well-being in the family, acquisition of a kingdom, enjoyments by the beneficence of the king, honours, gain of clothes, ornaments, conveyance and other desired objects, will be derived in the Antar Dasha of Śukr in the Dasha of Śani, if Śukr is in a Kendr, Trikon, or in Labh, associated with, or receiving a Drishti from benefics. If during this period Guru is favourable in transit, there will be dawn of fortune and growth of property. If Śani is favourable in transit, there will be Raj Yog effects, or the accomplishment of Yog rites (Yog Triya Siddhi).",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-sukr-2",
    "dasha": "Śani",
    "antarDasha": "Śukr",
    "verses": "28-29",
    "general": "",
    "adverse": "Distress to wife, loss of position, mental agony, quarrels with close relations etc. will be the results, if Śukr is in his debilitation Rāśi, if Śukr is combust, or, if Śukr is in Ari, Randhr, or Vyaya.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-sukr-3",
    "dasha": "Śani",
    "antarDasha": "Śukr",
    "verses": "30-31½",
    "general": "Fulfillment of ambitions by the beneficence of the king, charities, performance of religious rites, creation of interest in the study of Shastras, composition of poems, interest in Vedanta etc., listening to Puranas, happiness from wife and children will be experienced, if Śukr is in Dharm, Labh, or Kendr from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-sukr-4",
    "dasha": "Śani",
    "antarDasha": "Śukr",
    "verses": "32-34",
    "general": "",
    "adverse": "There will be eye trouble, fevers, loss of good conduct, dental problems, heart disease, pain in arms, danger from drowning, or falling from a tree, antagonism towards relations with the officials of government and brothers, if Śukr is in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-sukr-5",
    "dasha": "Śani",
    "antarDasha": "Śukr",
    "verses": "35-36",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, if Śukr is Dhan's, or Yuvati's Lord.",
    "remedial": "performance of Durga Saptashati Path and giving a cow, or a female buffalo in charity."
  },
  {
    "id": "sani-surya-1",
    "dasha": "Śani",
    "antarDasha": "Sūrya",
    "verses": "37-38½",
    "general": "Effects, like good relations with one's employer, well-being in the family, happiness from children, gain of conveyances and cattle etc., will be derived in the Antar Dasha of Sūrya in the Dasha of Śani, if Sūrya is in his exaltation, in his own Rāśi, or, if Sūrya is associated with Dharm's Lord, or, if Sūrya is in a Kendr, or Trikon, associated with, or receiving a Drishti from benefics.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-surya-2",
    "dasha": "Śani",
    "antarDasha": "Sūrya",
    "verses": "39-41",
    "general": "",
    "adverse": "There will be heart disease, defamation, loss of position, mental agony, separation from close relatives, obstacles in industrial ventures, fevers, fears, loss of kinsmen, loss of articles, dear to the person, if Sūrya is in Randhr, or Vyaya, or, if Sūrya is in the 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-surya-3",
    "dasha": "Śani",
    "antarDasha": "Sūrya",
    "verses": "42",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, if Sūrya is Dhan's, or Yuvati's Lord.",
    "remedial": "worship of Sūrya."
  },
  {
    "id": "sani-candr-1",
    "dasha": "Śani",
    "antarDasha": "Candr",
    "verses": "43-45",
    "general": "Effects, like gains of conveyance, garments, ornaments, improvement of fortune and enjoyments, taking care of brothers, happiness in both maternal and paternal homes, increase in cattle wealth etc., will be derived in the Antar Dasha of Candr in the Dasha of Śani, if Candr is full, in her exaltation, or in her own Rāśi, or in a Kendr, or Trikon, or in the 11th from the Dasha Lord, or, if Candr receives a Drishti from benefics.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-candr-2",
    "dasha": "Śani",
    "antarDasha": "Candr",
    "verses": "46-48½",
    "general": "There will, however, be good effects and some gain of wealth at the commencement of the Antar Dasha.",
    "adverse": "There will be great distress, wrath, separation from parents, ill health of children, losses in business, irregular meals, administration of medicines, if Candr is waning, if Candr is associated with, or receives Drishti from malefics, or, if Candr is in his debilitation Rāśi, or, if Candr is in malefic Navāńś, or, if Candr is in the Rāśi of a malefic Grah.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-candr-3",
    "dasha": "Śani",
    "antarDasha": "Candr",
    "verses": "49-50½",
    "general": "Enjoyment of conveyances and garments, happiness from kinsmen, happiness from parents, wife, employer etc. will be the results, if Candr is in a Kendr, Trikon, or in the 11th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-candr-4",
    "dasha": "Śani",
    "antarDasha": "Candr",
    "verses": "51-52",
    "general": "",
    "adverse": "Effects, like sleepiness, lethargy, loss of position, loss of enjoyments, increase in the number of enemies, antagonism with kinsmen, will be experienced, if Candr is weak and is in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-candr-5",
    "dasha": "Śani",
    "antarDasha": "Candr",
    "verses": "53-54",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be lethargy and physical distress, if Candr is Dhan', or Yuvati's Lord.",
    "remedial": "Havan and giving jaggery, Ghī, rice, mixed with curd, a cow, or a female buffalo in charity."
  },
  {
    "id": "sani-mangal-1",
    "dasha": "Śani",
    "antarDasha": "Mangal",
    "verses": "55-57",
    "general": "Effects, like enjoyments, gain of wealth, reverence from the king, gain of conveyances, clothes and ornaments, attainment of the position of a Commander of the Army, increase in agricultural and cattle wealth, construction of a new house, happiness to kinsmen, will be derived from the very commencement of the Antar Dasha of Mangal in the Dasha of Śani, if Mangal is in his exaltation, in his own Rāśi, or, if Mangal is associated with Lagn's Lord, or with the Dasha Lord.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-mangal-2",
    "dasha": "Śani",
    "antarDasha": "Mangal",
    "verses": "58-60",
    "general": "",
    "adverse": "There will be loss of wealth, danger of wounds, danger from thieves, snakes, weapons, gout and other similar diseases, distress to father and brothers, quarrels with copartners, loss of kinsmen, coarse food, going away to foreign lands, unnecessary expenditure etc., if Mangal is in his debilitation Rāśi, or combust, or in Randhr, or Vyaya and associated with, or receiving a Drishti from malefics.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-mangal-3",
    "dasha": "Śani",
    "antarDasha": "Mangal",
    "verses": "61-62",
    "general": "",
    "adverse": "dependence on others",
    "deathEffects": "Great distress and fear of premature death, may be expected, if Mangal is in Dhan, or, if Mangal is Yuvati's, or Randhr's Lord.",
    "remedial": "performance of Havan and giving a bull in charity."
  },
  {
    "id": "sani-rahu-1",
    "dasha": "Śani",
    "antarDasha": "Rahu",
    "verses": "63-64",
    "general": "",
    "adverse": "Effects, like quarrels, mental agony, physical distress, agony, antagonism with the sons, danger from diseases, unnecessary expenditure, discord with close relations, danger from the government, foreign journeys, loss of house and agricultural lands, will be derived in the Antar Dasha of Rahu in the Dasha of Śani, if Rahu not be in his house of exaltation, or any other auspicious position.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-rahu-2",
    "dasha": "Śani",
    "antarDasha": "Rahu",
    "verses": "65-67",
    "general": "Enjoyment, gains of wealth, increase in agricultural production, devotion to deities and Brahmins, pilgrimage to holy places, increase in cattle wealth, well-being in the family will be the results at the commencement of the Antar Dasha, if Rahu is associated with Lagn's Lord, or a Yog Karak Grah, or, if Rahu is in his exaltation, or in his own Rāśi, or, if Rahu is in a Kendr, or Labh from Lagn, or from the Lord of the Dasha. There will be cordiality with the king and happiness from friends in the middle portion of the Antar Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-rahu-3",
    "dasha": "Śani",
    "antarDasha": "Rahu",
    "verses": "68-68½",
    "general": "There will be acquisition of elephants, opulence and glory, cordial relations with the king, gains of valuable clothes, if Rahu is in Mesh, Kanya, Kark, Vrishabh, Meen, or Dhanu.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-rahu-4",
    "dasha": "Śani",
    "antarDasha": "Rahu",
    "verses": "69-70",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, if Rahu is associated with Dhan's, or Yuvati's Lord.",
    "remedial": "Mrityunjaya Japa and giving a goat in charity."
  },
  {
    "id": "sani-guru-1",
    "dasha": "Śani",
    "antarDasha": "Guru",
    "verses": "71-73½",
    "general": "Effects, like success all-round, well-being in the family, gain of conveyances, ornaments and clothes by the beneficence of the king, reverence, devotion to deities and the preceptor, association with men of learning, happiness from wife and children etc., will be derived in the Antar Dasha of Guru in the Dasha of Śani, if Guru is in a Kendr, or in a Trikon, or, if Guru is associated with Lagn's Lord, or, if Guru is in his own, or in his exaltation Rāśi.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-guru-2",
    "dasha": "Śani",
    "antarDasha": "Guru",
    "verses": "74-75½",
    "general": "",
    "adverse": "Results, like death of the near relations, loss of wealth, antagonism with the government officials, failure in projects, journeys to foreign lands, affliction with diseases, like leprosy etc., will be experienced, if Guru is in his debilitation Rāśi, or, if Guru is associated with malefics, or, if Guru is in Ari, Sahaj, or Vyaya.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-guru-3",
    "dasha": "Śani",
    "antarDasha": "Guru",
    "verses": "76-78",
    "general": "There will be opulence and glory, happiness to wife, gains through the king, comforts of good food and clothes, religious-mindedness, name and fame in the country, interest in Vedas and Vedanta, performance of religious sacrifices, giving grains etc. in charity, if Guru is in the 5th, 9th, 11th, 2nd, or Kendr from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-guru-4",
    "dasha": "Śani",
    "antarDasha": "Guru",
    "verses": "79-80",
    "general": "",
    "adverse": "Antagonism with kinsmen, mental agony, quarrels, loss of position, losses in ventures, loss of wealth, as a result of imposition of fines, or penalties by government, imprisonment distress to wife and son will be the results, if Guru is weak and is in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "sani-guru-5",
    "dasha": "Śani",
    "antarDasha": "Guru",
    "verses": "81-82",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be physical distress, agony, death of the native, or any member of the family, if Guru is Dhan's, or Yuvati's Lord.",
    "remedial": "recitation of Shiva Sahasranam and giving gold in charity."
  }
]

data.extend(new_items)

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Successfully updated JSON with Śani Dasha items!")
