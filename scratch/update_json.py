import json

file_path = "d:/Astro Consult-Vedic Astrology/Vedic Astrology/frontend/src/data/vimshottariExplanation.json"

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

new_items = [
  {
    "id": "rahu-rahu-1",
    "dasha": "Rahu",
    "antarDasha": "Rahu",
    "verses": "1-4",
    "general": "Effects, like acquisition of a kingdom, enthusiasm, cordial relations with the king, happiness from wife and children and increase in property, will be derived in the Antar Dasha of Rahu in the Dasha of Rahu, if Rahu is in Kark, Vrischik, Kanya, or Dhanu and is in Sahaj, Ari, Karm, or Labh, or is yuti with a Yog Karak Grah in his exaltation Rāśi.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-rahu-2",
    "dasha": "Rahu",
    "antarDasha": "Rahu",
    "verses": "5-6",
    "general": "",
    "adverse": "There will be danger from thieves, distress from wounds, antagonism with government officials, destruction of kinsmen, distress to wife and children, if Rahu is in Randhr, or Vyaya, or be associated with malefics.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-rahu-3",
    "dasha": "Rahu",
    "antarDasha": "Rahu",
    "verses": "7",
    "general": "",
    "adverse": "",
    "deathEffects": "If Rahu is Dhan's, or Yuvati's Lord, or is in Dhan, or Yuvati, there will be distress and diseases.",
    "remedial": "To obtain relief from the above evil effects Rahu should be worshipped (by recitation of his Mantras) and by giving in charity things, connected with, or ruled by Rahu."
  },
  {
    "id": "rahu-guru-1",
    "dasha": "Rahu",
    "antarDasha": "Guru",
    "verses": "8-12½",
    "general": "Effects, like gain of position, patience, destruction of foes, enjoyment, cordial relations with the king, regular increase in wealth and property, like the growth of Candr of the bright half of the month (Shukla Paksh), gain of conveyance and cows, audience with the king by performing journey to the West, or South-East, success in the desired ventures, return to one's homeland, doing good for Brahmins, visit to holy places, gain of a village, devotion to deities and Brahmins, happiness from wife, children and grand children, availability of sweetish preparations daily etc. will be derived in the Antar Dasha of Guru in the Dasha of Rahu, if Guru is in his exaltation, in his own Rāśi, in his own Navāńś, or in his exalted Navāńś, or, if Guru is in a Kendr, or in a Trikon with reference to Lagn.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-guru-2",
    "dasha": "Rahu",
    "antarDasha": "Guru",
    "verses": "13-14½",
    "general": "",
    "adverse": "Loss of wealth, obstacles in work, defamation, distress to wife and children, heart disease, entrustment of governmental authority etc. will result, if Guru is in his debilitation Rāśi, is combust, is in Ari, Randhr, or Vyaya, is in an enemy Rāśi, or is associated with malefics.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-guru-3",
    "dasha": "Rahu",
    "antarDasha": "Guru",
    "verses": "15-17",
    "general": "There will be gains of land, good food, gains of cattle etc., inclinations towards charitable and religious work etc., if Guru is in a Kendr, in a Trikon, the 11th, the 2nd, or the 3rd from the Lord of the Dasha and is endowed with strength.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-guru-4",
    "dasha": "Rahu",
    "antarDasha": "Guru",
    "verses": "18-20",
    "general": "",
    "adverse": "Loss of wealth and distress to body will result, if Guru is in the 6th, the 8th, or the 12th from the Lord of the Dasha, or, if Guru is associated with malefics.",
    "deathEffects": "There will be danger of premature death, if Guru is Dhan's, or Yuvati's Lord.",
    "remedial": "The person will get relief from the above evil effects and enjoy good health by the beneficence of the Lord Shiva, if he worships his idol, made of gold."
  },
  {
    "id": "rahu-sani-1",
    "dasha": "Rahu",
    "antarDasha": "Śani",
    "verses": "21-24",
    "general": "Effects, like pleasure of the king for devotion in his service, auspicious functions, like celebration of marriage etc. at home, construction of a garden, reservoir etc., gain of wealth and cattle from well-to-do persons, belonging to the Sudra class, return to homeland, will be derived in the Antar Dasha of Śani in the Dasha of Rahu, if Śani is in a Kendr, in a Trikon, in his exaltation, in his own Rāśi, in his Multrikon, in Sahaj, or in Labh.",
    "adverse": "loss of wealth caused by the king during journey to the West, reduction in income, due to lethargy.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-sani-2",
    "dasha": "Rahu",
    "antarDasha": "Śani",
    "verses": "25-26",
    "general": "sudden gain of ornaments.",
    "adverse": "Danger from menials, the king and enemies, distress to wife and children, distress to kinsmen, disputes with the coparceners, disputes in dealings with others will result, if Śani is in his debilitation Rāśi, in his enemy's Rāśi, or in Randhr, or Vyaya.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-sani-3",
    "dasha": "Rahu",
    "antarDasha": "Śani",
    "verses": "27-29",
    "general": "",
    "adverse": "There will be heart disease, defamation, quarrels, danger from enemies, foreign journeys, affliction with Gulma, unpalatable food and sorrows etc., if Śani is in the 6th, the 8th, or the 12th from the Lord of the Dasha.",
    "deathEffects": "Premature death is likely, if Śani is Dhan's, or Yuvati's Lord.",
    "remedial": "Remedial measure to obtain relief from the above evil effects and to regain good health is giving a black cow, or a she-buffalo in charity."
  },
  {
    "id": "rahu-budh-1",
    "dasha": "Rahu",
    "antarDasha": "Budh",
    "verses": "30-33",
    "general": "Auspicious effects, like Raj Yog, well being in the family, profits and gain of wealth in business, comforts of conveyances, marriage and other auspicious functions, increase in the number of cattle, gain of perfumes, comforts of bed, women etc., will be derived in the Antar Dasha of Budh in the Dasha of Rahu, if Budh is in his exaltation Rāśi, in a Kendr, or in Putr and, if Budh is endowed with strength. Good results, like Raj Yog, beneficence of the king and gain of wealth and reputation, will be realized particularly on Wednesday in the month of Budh.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-budh-2",
    "dasha": "Rahu",
    "antarDasha": "Budh",
    "verses": "34-35",
    "general": "Sound health, Isht Siddhi, attending discourse on Puranas and ancient history, marriage, offering of oblations, charities, religious inclination and sympathetic attitude towards others will result, if Budh is in a Kendr, in the 11th, 3rd, 9th, or 10th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-budh-3",
    "dasha": "Rahu",
    "antarDasha": "Budh",
    "verses": "36-38",
    "general": "",
    "adverse": "There will be opprobrium (Ninda) of deities and Brahmins by the native, loss of fortune, speaking lies, unwise actions, fear from snakes, thieves and the government, quarrels, distress to wife and children etc., if Budh is in Ari, Randhr, or Vyaya, or, if Budh receives a Drishti from Śani.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-budh-4",
    "dasha": "Rahu",
    "antarDasha": "Budh",
    "verses": "39",
    "general": "",
    "adverse": "",
    "deathEffects": "If Budh is Dhan's, or Yuvati's Lord, there will be fear of premature death.",
    "remedial": "Remedial measure to obtain relief from the above evil effects is recitation of Vishnu Sahasranam."
  },
  {
    "id": "rahu-ketu-1",
    "dasha": "Rahu",
    "antarDasha": "Ketu",
    "verses": "40-41",
    "general": "Enjoyment, gain of wealth, recognition by the king, acquisition of gold etc. will be the results, if Ketu is associated with, or receives a Drishti from benefics.",
    "adverse": "During the Antar Dasha of Ketu in the Dasha of Rahu there will be journeys to foreign countries, danger from the king, rheumatic fever etc. and loss of cattle.",
    "deathEffects": "If Ketu is yuti with Randhr's Lord, there will be distress to the body and mental tension.",
    "remedial": ""
  },
  {
    "id": "rahu-ketu-2",
    "dasha": "Rahu",
    "antarDasha": "Ketu",
    "verses": "42-42½",
    "general": "There will be Isht Siddhi, if Ketu is related to the Lord of Lagn. If he is associated with the Lord of Lagn, there will definitely be gain of wealth. There will also definitely be increase in the number of cattle, if Ketu is in a Kendr, or in a Trikon.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-ketu-3",
    "dasha": "Rahu",
    "antarDasha": "Ketu",
    "verses": "43-45",
    "general": "",
    "adverse": "Effects, like danger from thieves and snakes, distress from wounds, separation from parents, antagonistic relations with kinsmen, mental agony etc. will be derived, if Ketu is without strength in Randhr, or Vyaya.",
    "deathEffects": "If Ketu is Dhan's, or Yuvati's Lord, there will be distress to the body.",
    "remedial": "giving a goat in charity."
  },
  {
    "id": "rahu-sukr-1",
    "dasha": "Rahu",
    "antarDasha": "Śukr",
    "verses": "46-47½",
    "general": "Effects, like gains of wealth through Brahmins, increase in the number of cattle, celebrations for the birth of a son, well-being, recognition from government, acquisition of a kingdom, attainment of a high position in government, great enjoyment and comforts etc. will be experienced in the Antar Dasha of Śukr in the Dasha of Rahu, if Śukr is with strength in a Kendr, in a Trikon, or in Labh.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-sukr-2",
    "dasha": "Rahu",
    "antarDasha": "Śukr",
    "verses": "48-50½",
    "general": "Construction of a new house, availability of sweet preparations, happiness from wife and children, association with friends, giving of grains etc. in charity, beneficence of the king, gain of conveyances and clothes, extraordinary profits in business, celebration of Upasayan ceremony of wearing the sacred thread (Janou) etc. will be the auspicious results, if Śukr be in his exaltation, in his own Rāśi, in is exalted, or in his own Navāńś.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-sukr-3",
    "dasha": "Rahu",
    "antarDasha": "Śukr",
    "verses": "51-53½",
    "general": "",
    "adverse": "There will be diseases, quarrels, separation from one's son, or father, distress to kinsmen, disputes with coparceners, unhappiness to wife and children, pain in the stomach etc., if Śukr is in Ari, Randhr, or Vyaya, in his debilitation, or in an enemy's Rāśi, or, if Śukr is associated with Śani, Mangal, or Rahu.",
    "deathEffects": "danger of death to oneself, or to one's employer.",
    "remedial": ""
  },
  {
    "id": "rahu-sukr-4",
    "dasha": "Rahu",
    "antarDasha": "Śukr",
    "verses": "54-55½",
    "general": "Enjoyments from perfumes, bed, music etc., gain of a desired object, fulfillment of desires will be the results, if Śukr is in a Kendr, in a Trikon, in the 11th, or in the 10th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-sukr-5",
    "dasha": "Rahu",
    "antarDasha": "Śukr",
    "verses": "56-59",
    "general": "",
    "adverse": "wrath of Brahmins, snakes and the king, possibility of affliction with diseases, like stoppage of urine, diabetes, pollution of blood, anaemia, availability of only coarse food, nervous disorder, nervous breakdown, imprisonment, loss of wealth, as a result of penalties, or fines, imposed by government, will be derived, if Śukr is associated with malefics in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "There will be distress to wife and children, danger of premature death to oneself, if Śukr is Dhan's, or Yuvati's Lord.",
    "remedial": "Worship of Goddess Durga and Goddess Lakshmi."
  },
  {
    "id": "rahu-surya-1",
    "dasha": "Rahu",
    "antarDasha": "Sūrya",
    "verses": "60-61½",
    "general": "Effects, like cordial relations with the king, increase in wealth and grains, some popularity/respect, some possibility of becoming head of a village etc., will be experienced in the Antar Dasha of Sūrya in the Dasha of Rahu, if Sūrya is in his exaltation, in his own Rāśi, in Labh, in a Kendr, or in a Trikon, or in his exalted, or own Navāńś.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-surya-2",
    "dasha": "Rahu",
    "antarDasha": "Sūrya",
    "verses": "62-63½",
    "general": "There will be good reputation and encouragement and assistance by government, journeys to foreign countries, acquisition of the sovereignty of the country, gains of elephants, horses, clothes, ornaments, fulfillment of ambitions, happiness to children etc., if Sūrya is associated with, or receives a Drishti from Lagn's, Dhan's, or Karm's Lord.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-surya-3",
    "dasha": "Rahu",
    "antarDasha": "Sūrya",
    "verses": "64-65",
    "general": "",
    "adverse": "Fevers, dysentery, other diseases, quarrels, antagonism with the king, travels, danger from foes, thieves, fire etc. will be the results, if Sūrya is in his debilitation Rāśi, or, if Sūrya is in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-surya-4",
    "dasha": "Rahu",
    "antarDasha": "Sūrya",
    "verses": "66",
    "general": "Well-being in every way and recognition from kings in foreign countries will be the results, if Sūrya is in a Kendr, in a Trikon, in the 3rd, or in the 11th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-surya-5",
    "dasha": "Rahu",
    "antarDasha": "Sūrya",
    "verses": "67",
    "general": "",
    "adverse": "",
    "deathEffects": "There will be danger of critical illness, if Sūrya is Dhan's, or Yuvati's Lord.",
    "remedial": "Worship of Sūrya is the remedial measure, recommended to obtain relief from the above evil effects."
  },
  {
    "id": "rahu-candr-1",
    "dasha": "Rahu",
    "antarDasha": "Candr",
    "verses": "68-70",
    "general": "Effects, like acquisition of a kingdom, respect from the king, gains of wealth, sound health, gains of garments and ornaments, happiness from children, comforts of conveyances, increase in house and landed property etc., will be derived in the Antar Dasha of Candr in the Dasha of Rahu, if Candr is in his exaltation, in his own Rāśi, in a Kendr, Trikon, or in Labh, or, if Candr is in a friendly Rāśi, receiving a Drishti from benefics.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-candr-2",
    "dasha": "Rahu",
    "antarDasha": "Candr",
    "verses": "71-72",
    "general": "Beneficence of the Goddess Lakshmi, all-round success, increase in wealth and grains, good reputation and worship of deities will be the results, if Candr is in the 5th, 9th, in a Kendr, or in the 11th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-candr-3",
    "dasha": "Rahu",
    "antarDasha": "Candr",
    "verses": "73-75",
    "general": "",
    "adverse": "There will be the creation of disturbances at home and in the agricultural activities by evil spirits, leopards and other wild animals, danger from thieves during journeys and stomach disorders, if Candr is bereft of strength in the 6th, 8th, or 12th from the Lord of the Dasha.",
    "deathEffects": "There will the possibility of premature death, if Candr is Dhan's, or Vyaya's Lord.",
    "remedial": "give in charity a white cow, or a female buffalo."
  },
  {
    "id": "rahu-mangal-1",
    "dasha": "Rahu",
    "antarDasha": "Mangal",
    "verses": "76-77½",
    "general": "Effects, like the recovery of a lost kingdom and recovery of lost wealth, property at home and increase in agricultural production, gain of wealth, blessings by the household deity (Isht Dev), happiness from children, enjoyment of good food etc., will be derived in the Antar Dasha of Mangal in the Dasha of Rahu, if Mangal is in Labh, Putr, or Dharm, or, if Mangal is in a Kendr, if Mangal receives a Drishti from benefics, or, if Mangal is in his exaltation, or in his own Rāśi.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-mangal-2",
    "dasha": "Rahu",
    "antarDasha": "Mangal",
    "verses": "78-79½",
    "general": "There will be acquisition of red-coloured garments, journeys, audience with the king, well-being of children and employer, attainment of the position of a Commander of the Army, enthusiasm and gain of wealth through kinsmen, if Mangal is in a Kendr, in the 5th, 9th, 3rd, or in the 11th from the Lord of the Dasha.",
    "adverse": "",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-mangal-3",
    "dasha": "Rahu",
    "antarDasha": "Mangal",
    "verses": "80-82",
    "general": "",
    "adverse": "Distress to wife, children and co-borns, loss of position, antagonistic relations with children, wife and other close relations, danger from thieves, wounds and pain in the body etc. will result, if Mangal is in the 6th, 8th, or 12th from the Lord of the Dasha, receiving a Drishti from malefics.",
    "deathEffects": "",
    "remedial": ""
  },
  {
    "id": "rahu-mangal-4",
    "dasha": "Rahu",
    "antarDasha": "Mangal",
    "verses": "83",
    "general": "",
    "adverse": "lethargy.",
    "deathEffects": "danger of death, if Mangal is Dhan's, or Yuvati's Lord.",
    "remedial": "giving a cow, or a bull in charity."
  }
]

data.extend(new_items)

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Successfully updated JSON with Rahu Dasha items!")
