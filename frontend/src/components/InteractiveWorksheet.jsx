import React, { useState, useEffect } from "react";
import ZodiacChart from "./ZodiacChart";
import ShadbalaChart from "./ShadbalaChart";
import PlanetaryRemediesViewer from "./PlanetaryRemediesViewer";
import VimsopakaAssessment from "./VimsopakaAssessment";
import { PLANET_IN_SIGN_EFFECTS } from '../data/planetInSign';
const BulletInterpretation = ({ text, colorClass = "text-slate-600" }) => {
  if (!text) return null;
  const points = text.split(/(?<=\.)\s+|\n+/).filter(p => p.trim());
  return (
    <ul className="space-y-3 relative z-10">
      {points.map((point, i) => (
        <li key={i} className="flex gap-3 items-start group/point">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colorClass.replace('text-', 'bg-')} opacity-40 group-hover/point:opacity-100 transition-opacity`}></span>
          <span className={`text-md leading-relaxed ${colorClass} font-serif`}>{point.trim()}</span>
        </li>
      ))}
    </ul>
  );
};

const ConjunctionAnalysis = ({ houses }) => {
  const [conjunctions, setConjunctions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTextFromDetail = (detail) => {
    if (detail.description) return detail.description;
    if (detail.interpretation) return detail.interpretation;
    if (detail.results) return detail.results;

    if (detail.effects && typeof detail.effects === "object") {
      return Object.entries(detail.effects)
        .map(([key, points]) => {
          const title = key.replace(/([A-Z])/g, " $1").toUpperCase();
          const content = Array.isArray(points) ? points.join(". ") : points;
          return `${title}: ${content}`;
        })
        .join("\n\n");
    }

    return "Detailed diagnostic insights are available for this planetary alignment.";
  };

  useEffect(() => {
    if (!houses) return;

    const detected = [];
    Object.keys(houses).forEach(houseNum => {
      const houseData = houses[houseNum];
      const planets = houseData.planets || [];
      const cleanPlanets = planets.map(p => typeof p === "object" ? p.name : p)
        .filter(p => p !== "Ascendant" && p !== "L");

      if (cleanPlanets.length >= 2 && cleanPlanets.length <= 4) {
        detected.push({
          house: houseNum,
          planets: cleanPlanets
        });
      }
    });

    if (detected.length > 0) {
      setLoading(true);
      Promise.all(detected.map(async (conj) => {
        try {
          let url = "";
          if (conj.planets.length === 2) {
            url = `/api/conjunction/detail/${conj.planets[0]}/${conj.planets[1]}`;
          } else if (conj.planets.length === 3) {
            url = `/api/conjunction/triple/detail/${conj.planets[0]}/${conj.planets[1]}/${conj.planets[2]}`;
          } else if (conj.planets.length === 4) {
            url = `/api/conjunction/four/detail/${conj.planets[0]}/${conj.planets[1]}/${conj.planets[2]}/${conj.planets[3]}`;
          }

          if (!url) return null;

          const res = await fetch(url);
          if (res.ok) {
            const detail = await res.json();
            return { ...conj, detail };
          }
        } catch (err) {
          console.error(`Failed to fetch conjunction for ${conj.planets.join("-")}`, err);
        }
        return null;
      })).then(results => {
        setConjunctions(results.filter(r => r !== null));
        setLoading(false);
      });
    } else {
      setConjunctions([]);
    }
  }, [houses]);

  if (loading) return <div className="p-4 text-center text-[10px] text-gray-400 italic">Exploring House Conjunctions...</div>;
  if (conjunctions.length === 0) return null;

  return (
    <div className="space-y-12 mt-12 border-t border-indigo-200 pt-12">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-900 rounded-lg flex items-center justify-center text-2xl shadow-lg border-2 border-white/20">💠</div>
        <div>
          <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">House Conjunction Analysis</h4>
          <div className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest mt-1">Diagnostic Pairing Insights</div>
        </div>
      </div>

      {conjunctions.map((conj, idx) => (
        <section key={idx} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xl shadow-md border border-white/10">✨</div>
            <div>
              <h4 className="text-lg font-black text-slate-700 uppercase tracking-tight leading-none">{conj.planets.join(" + ")}</h4>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">House {conj.house} Resonance</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden group/item">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl font-black text-indigo-900">{conj.house}</div>
            <BulletInterpretation
              text={getTextFromDetail(conj.detail)}
              colorClass="text-slate-700"
            />
          </div>
        </section>
      ))}
    </div>
  );
};

const PLANET_COLORS = {
  "Sun": "#ef4444", "Moon": "#475569", "Mars": "#dc2626", "Mercury": "#16a34a",
  "Jupiter": "#d97706", "Venus": "#db2777", "Saturn": "#4338ca", "Rahu": "#0d9488",
  "Ketu": "#92400e", "Ascendant": "#000000"
};

const getPlanetPositionsFromHouses = (houses) => {
  if (!houses) return [];
  const positions = [];
  Object.entries(houses).forEach(([hNum, hData]) => {
    (hData.planets || []).forEach(p => {
      const name = typeof p === 'string' ? p : (p.planet || p.name);
      if (name === "Ascendant" || name === "Lagna") return;
      positions.push({
        planet: name,
        house: parseInt(hNum),
        is_retrograde: p.is_retrograde,
        is_combust: p.is_combust
      });
    });
  });
  return positions;
};

const HouseEffectTable = ({ data, planetEffects, customPositions = null }) => {
  const positions = customPositions || data?.planet_positions || [];
  const interpMap = {
    "Sun": SUN_HOUSE_INTERPRETATIONS,
    "Moon": MOON_HOUSE_INTERPRETATIONS,
    "Mars": MARS_HOUSE_INTERPRETATIONS,
    "Mercury": MERCURY_HOUSE_INTERPRETATIONS,
    "Jupiter": JUPITER_HOUSE_INTERPRETATIONS,
    "Venus": VENUS_HOUSE_INTERPRETATIONS,
    "Saturn": SATURN_HOUSE_INTERPRETATIONS,
    "Rahu": RAHU_HOUSE_INTERPRETATIONS,
    "Ketu": KETU_HOUSE_INTERPRETATIONS
  };

  return (
    <div className="mt-12 space-y-12">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center text-2xl shadow-lg border-2 border-white/20">🏠</div>
        <div>
          <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">House-by-House Interpretations</h4>
          <div className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest mt-1">Lagna Chart Placements</div>
        </div>
      </div>
      <div className="space-y-12">
        {positions.filter(p => interpMap[p.planet]).map((p) => {
          const houseText = interpMap[p.planet]?.[p.house];
          if (!houseText) return null;
          const status = planetEffects[p.planet];
          const statusColor = status === "positive" ? "bg-green-100 text-green-700" : status === "negative" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700";

          return (
            <section key={p.planet} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xl shadow-md border border-white/10">✨</div>
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight leading-none" style={{ color: PLANET_COLORS[p.planet] || "#000" }}>
                      {p.planet}{p.is_retrograde ? '*' : ''}{p.is_combust ? '#' : ''} Placement
                    </h4>
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">House {p.house} Analysis</div>
                  </div>
                  <span className={`text-[7px] px-2 py-1 rounded font-black uppercase tracking-widest ${statusColor} shadow-sm`}>
                    {status || "Neutral"}
                  </span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden group/item">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-8xl font-black text-indigo-900 pointer-events-none">{p.house}</div>
                <BulletInterpretation
                  text={houseText}
                  colorClass="text-slate-700"
                />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const GEMSTONES = {
  "Sun": { name: "Ruby", hindi: "Manik", color: "#f87171", bg: "from-red-50 to-red-100", border: "border-red-200", text: "text-red-800" },
  "Moon": { name: "Pearl", hindi: "Moti", color: "#94a3b8", bg: "from-slate-50 to-slate-100", border: "border-slate-200", text: "text-slate-800" },
  "Mars": { name: "Red Coral", hindi: "Moonga", color: "#dc2626", bg: "from-red-50 to-red-600", border: "border-red-700", text: "text-red-900" },
  "Mercury": { name: "Emerald", hindi: "Panna", color: "#10b981", bg: "from-emerald-50 to-emerald-100", border: "border-emerald-200", text: "text-emerald-800" },
  "Jupiter": { name: "Yellow Sapphire", hindi: "Pukhraj", color: "#fbbf24", bg: "from-amber-50 to-amber-100", border: "border-amber-200", text: "text-amber-800" },
  "Venus": { name: "Diamond", hindi: "Heera", color: "#db2777", bg: "from-pink-50 to-pink-100", border: "border-pink-200", text: "text-pink-800" },
  "Saturn": { name: "Blue Sapphire", hindi: "Neelam", color: "#3b82f6", bg: "from-blue-50 to-blue-100", border: "border-blue-200", text: "text-blue-800" },
};

const SUN_HOUSE_INTERPRETATIONS = {
  1: "Sun in 1st house gives you a bright personality and a brilliant mind. Considering the Sun is the actual soul significator, you feel it is your right to be on the throne and deserve the power and the top-spot. When Sun is in 1st house, you feel like it is must for you to be on the top spot and that you deserve to own it without making any efforts. In the professional space, you shall feel as if you are victorious and should be respected for it. You will feel that you can be successful as a self-employed individual and would rule your kingdom. You will know how to impress others and control their actions. You like to lead others and show them the best path for their journey. You may become a politician or hold a high position in the government.",
  2: "Your Sun is placed in the 2nd house, you tend to flaunt your family history with pride. You have a lean physique, and your speech becomes authoritative and royal. You will be blessed with financial success and become fond of collecting gold and jewelry. A well-placed Sun will make you support your family. It helps you achieve your desired goals, so that you and your family flourish with prosperity and abundance. It will also give you a magnetic voice that influences the crowds, and make you fond of food and politics. However, if the Sun is afflicted, it could create disharmony in your marital life, and sour the relationship with children as well as the in-laws due to your ego.",
  3: "The Sun in the 3rd house makes you extremely courageous and empowered. Your ego lies in your communication, and you have a lot of physical and mental strength. This placement of the Sun makes you inquisitive, and gives you an inclination toward creative fields, such as becoming a writer, singer, a fitness coach, or a politician. A well-placed Sun makes you fond of travelling and the performing arts. It grants you wisdom and courage and will keep you kind and supportive toward your siblings. However, if the Sun is afflicted, it will make you distant from your siblings and could give you a loose character.",
  4: "The placement of the Sun in the 4th house gives you a lavish house with all kinds of comforts. Your mother is the one leading the family, and both your parents will be strict and disciplinary. Your early life could be tough, but you will achieve success after your mid-30s. A well-placed Sun makes you sensitive, gentle, and shy. It will bless you with a guiding light in the form of good mentors. You will be able to secure a high status in society and have a prosperous profession. However, if the Sun is afflicted, you may lose your motivation and strength. You could become oversensitive and face troubles with your boss, seniors, and authorities.",
  5: "When in the 5th house, the Sun tends to give favorable results, as the 5th house is its natural zodiac, that is, Leo. It will make you the center of attention in your school and college. Your main goal will be making your children leaders of the community. This placement makes you accomplished and successful at a very early age. A well-placed Sun makes you devoted to your family and children, and your family becomes your pride. It gives you courage and a keen interest in adventure activities. However, if the Sun is afflicted, you could become arrogant and annoying. You may become manipulative and overconfident and that could get you into trouble. Your children may also take shortcuts and cheat others.",
  6: "The Sun in the 6th house gives you the ability to win against your enemies and resolve conflicts. This position of the Sun can make you a successful lawyer, politician, doctor, or a businessman. A well-placed Sun gives you immense strength and a strong bond with your mother and siblings. It will make you a perfectionist and give you a desire to serve others. However, if the Sun is afflicted, it makes you vulnerable and spoils your relationships, especially your married life. It could also cause a drain on finances, and excessive debts.",
  7: "The 7th house placement of the Sun gives you the attitude of a king. It is hard for you to enter business partnerships, since you like to be the sole decision maker. You are likely to run into people who do not respect you, as the Sun becomes debilitated in the 7th zodiac. A well-placed Sun gives you a supportive life partner and a successful business. Your life partner will be wealthy and from a reputable family. You may secure a government job, and you are likely to become rich post marriage. However, if the Sun is afflicted, it could make you pessimistic about life and also make you rude and egoistic. You may face stiff competition in government jobs, and face differences in your married life.",
  8: "The Sun in the 8th house gives you a natural power of making things popular. You will do very well in government jobs, as a surgeon, and in the financial sector. Your professional life will be more fruitful post the age of 30. The Sun also grants you fame and a magnetic personality. You will have a belief in astrology and other occult sciences. A well-placed Sun will give you wealth from property or marriage through inheritance. You will have a spiritual bent and will never face financial crises. However, if the Sun is afflicted, your love life will be hampered and it may cause sadness and pain. It can also push you toward underworld and illegal activities.",
  9: "The Sun in the 9th house elevates your ego level and also makes you highly religious. You will travel overseas and might settle there. You will be significantly influenced by your father and teachers. A well-placed Sun will make you fulfill your responsibilities with unconditional love. Your intellectual qualities will aid your success. You will have mass followers, and people will respect you for your wisdom. It will also grant you a greater share of ancestral properties. However, if the Sun is afflicted, it will affect your father's health and you may face serious financial losses.",
  10: "The Sun in the 10th house gives you immense willpower and determination. Presidents, politicians and CEO's often have the Sun in the 10th house. You will also have a supportive father who could help you professionally. This placement of the Sun gives you a bright career and you could also become a powerful politician. A well-placed Sun gives you leadership qualities and grants you fame through your work. You will generate a good income and could secure a government job. However, if the Sun is afflicted, it will hinder your professional growth and give you enormous anger, aggression, and ego.",
  11: "The Sun in the 11th house could affect your social life negatively. Your main focus in life will be to earn money and you may not have many friends; also, you may not be a good listener. However, a well-placed Sun in this house shows immense gains and highly influential contacts. You will win everyone's heart and will enjoy a long and healthy life. However, if the Sun is afflicted, it could affect your children's education and make them feel worthless. You may also be humiliated because of your children. You will make more enemies than friends, and will not be able to capitalize on the gains that are meant for you.",
  12: "The placement of the Sun in the 12th house may grant you enlightenment. It elevates your imagination, and gives you psychic powers. You make a lot of political connections and might work and settle abroad. Your relationship with your father will be somewhat strained, and you could have a big ego. A well-placed Sun can make you a successful politician, or a leading businessman dealing in foreign goods. However, if the Sun is afflicted, it can lead to difficult situations like a jail sentence, hospitalization, insomnia, addiction, and separation in relationships.",
};

const MARS_HOUSE_INTERPRETATIONS = {
  1: "Mars in 1st house makes you highly energetic as well as aggressive. It puts you in leadership positions and gives you a lot of responsibilities. It gives you a strong physique with a reddish skin tone. This placement of Mars will make you action-oriented and give you excellent endurance and high stamina. It will help you think out of the box when it comes to strategizing. However, if Mars is afflicted, it will ignite jealousy, promote anger without any purpose, and trigger blood- and skin-related issues. A combust Mars will channelize your aggression inwards, creating frustration and stealing limelight from you.",
  2: "Mars in 2nd house gives you a passion to accumulate wealth and possessions by hook or crook. This placement is not ideal for family harmony and could give you a harsh speech, which may disturb your relationships. A well-placed Mars will enhance your professional network and widen your business. It will also give you multiple sources of income. However, if Mars is afflicted, it will trigger anger on family members and create health issues related to indigestion or acidity. You could also face difficulty in conceiving. If Mars is combust, it can make you dishonest and could bring you humiliation.",
  3: "Mars in 3rd house brings you immense energy to multitask and makes your communication filterless. It makes you courageous, but also gives you an aggressive nature and an impatient attitude. It could also disturb your relationship with your siblings. This Mars gives you the capacity to think out of the box, which will benefit you professionally. It will also give you a love for traveling and adventure. However, if Mars is afflicted, you might get caught in controversies and become too adventurous, which may increase the chances of risks and accidents. If Mars is combust, it aggravates your inner anger and resentment. It will also give you inappropriate communication that may create problems from time to time.",
  4: "Mars in 4th house makes you creative enthusiastic and charming. It will give you a short temper and strain your relationship with your family, especially your mother. A well-placed Mars makes you hardworking and strong and will help you acquire real estate through inheritance or hard work. If Mars is afflicted, it will not let you be content and satisfied even after being successful. It may also bring breaks and delays in your education and career. If Mars is combust, you will be confused about what is good for you and you'll have to struggle a lot for a comfortable life.",
  5: "Mars in 5th house will make you manipulative and wealthy. It will enhance your creativity and hidden talents, and may give you multiple love affairs. It will give you conflicts and disagreements in relationships, which could be why your relationships could be short lived. A well-placed Mars will gear you toward success and will help you discover your hidden talents. It will also give you a keen interest in sports and a healthy body with good digestion. However, if Mars is afflicted, it may cause miscarriages and create problems with children. If Mars is combust, your short temper and authoritative nature could hamper your success.",
  6: "Mars in 6th house makes you highly competitive at your workplace. You will always compete with your colleagues and want to win against them. It may also give you envy, jealousy, and arrogance. A well-placed Mars will help you become a successful lawyer or a remarkable politician and will make you invincible against your opponents. If Mars is afflicted, it will cause blood-related health issues, and make you prone to accidents. It will destroy your immune system and may cause a financial crisis because of too many debts.",
  7: "Mars in 7th house directly impacts the longevity of your spouse and the quality of your married life. You will be able to run a successful business if you are the sole owner, but may not do well in partnership because of your dominating nature. A well-placed Mars can make you a successful lawyer or a government leader. You will respect your partner and stand like a rock to support each other. It will also bring immense passion and romance in your relationship. If Mars is afflicted, you will dominate your partner and always have high expectations. It will hamper your fertility and if associated with eunuch planets, it could lead to a queer orientation. A combust Mars may make you physically unable to fulfill your partner's sexual desires.",
  8: "Mars in 8th house will make you highly intuitive and you will easily sense other people's motives. It will make you passionate and ambitious to attain huge success. A well-placed Mars will spark your interest in research and deep study of any subject. You can become a good healer, an excellent spy, or a responsible medical representative. If Mars is afflicted, it can cause inflammation in your body and related diseases. It will also make you prone to sudden accidents. It adversely affects the longevity of your marriage and gives you a sour relationship with your in-laws. If your Mars is combust, you will not have the energy to fulfill your passionate desires and you will end up projecting jealousy and envy over others’ growth.",
  9: "Mars in 9th house will motivate you to break social and religious rules. It expands your imagination power and gives you an opportunity to travel abroad and earn in foreign currency. If Mars is well placed, it can make you a renowned writer or an energetic salesperson, since you have a magnetism to attract people through your work. You could also do well in real estate and could acquire a lot of land and property for yourself. However, if Mars is afflicted, you will become rigid about your religious beliefs and carry grudges if others don't agree with you. It will also adversely affect your father's health. If Mars is combust, it will make you look lethargic and you will earn money through fraud and deception.",
  10: "Mars in 10th house will give you a dynamic personality and make you a leader in your profession. You will act like a courageous warrior who can overcome all obstacles. A very pleased Mars will make you highly ambitious and driven toward a luxurious life. You will be good at heart, but look tough outside. You will be able to finish your job very fast and effectively. If Mars is afflicted, it will create struggles in your work life and give rise to professional rivalries. You will also face anxiety, and your arrogant nature will not allow others to be sympathetic toward you. If Mars is combust, it will make you selfish and cunning and prone to taking shortcuts.",
  11: "Mars in 11th house gives you the brilliance to make gains out of your desires. It will facilitate a big network and you will spend a lot of time in goal setting and give your best to achieve these. If Mars is well placed, it can make you a successful political leader with a huge following. It will make you ambitious, but also content with your life. Your friend circle will be reliable and supportive. However, if Mars is afflicted, it will make you seek gains from anything and everything in order to support your desires. You will become a spendthrift, and your imagination and ideas will become overwhelming.",
  12: "Mars in 12th house will give you a secretive nature, and you will try to suppress your emotions. You may constantly travel abroad for work where your energy will be more productive. A well-placed Mars will make you productive and you will be able to achieve success in your career as well as in your spiritual goals. If Mars is afflicted, you will waste your energy in job hopping and most of the events in your life, including your marriage, will be delayed—because of which you may feel frustrated from time to time. It may also cause accidents. If Mars is combust, it will give additional struggles and obstacles, and you will not be committed toward your partner.",
};

const MERCURY_HOUSE_INTERPRETATIONS = {
  1: "Mercury in the first house helps you reveal your communication skills to the world and makes you fluent in multiple languages. It also blesses you with an artistic and philosophical mind. However, even though you are clever and intelligent, you will be restless and hop on from one thing to another multiple times a day. You will be a multitasker and can become a successful businessman or a salesperson. A well-placed Mercury keeps you thrilled and excited. It will make you attractive, flexible, and fun loving. If Mercury is afflicted, it will make you self-centered and fickle-minded. It will also give relationship issues.",
  2: "Mercury in the second house blesses you with humor, intelligence, and knowledge. It makes you efficient when it comes to public speaking and influencing the masses. You will be an excellent salesman and will also have a melodious voice. A well-placed Mercury will make you clever and intelligent and give you excellent marketing skills. However, if Mercury is afflicted, it will make you stubborn and egoistic. It may also bring financial losses in business, as you may not be able to deliver as per the demands of customers.",
  3: "Mercury in the third house makes you multi-talented and highly efficient when it comes to work. You have excellent communication skills, which make you successful in various fields, including counseling, marketing, and singing. Being a natural motivational speaker, you can inspire crowds and, thus, run a successful business by keeping your employees motivated. A well-placed Mercury will give you exceptional writing skills and the ability to express yourself skillfully. You may even have multiple careers at a time. You will apply your logical thinking and be successful in your profession. However, if Mercury is afflicted, you will become calculative and will think only about your monetary benefits all the time. You will make relations with people in order to gain from them, and may not have any emotional attachment with your friends.",
  4: "Mercury in the fourth house will make you family oriented and highly influenced by your mother. You will enjoy a comfortable life and a luxurious home in childhood. Your mother might be very talkative and fun-loving and could be running a successful business. This placement of Mercury can make you a successful real estate agent or a politician who serves their homeland. A well-placed Mercury will make you extremely imaginative and creative. Your memory will also be sharp, and you will receive a prestigious education. However, if Mercury is afflicted, you will become rigid and not accept other’s opinions easily. You may often have outbursts if things don't go your way.",
  5: "Mercury in the fifth house blesses you with a creative mindset and a wonderful sense of humor. It makes you skilled at acting, singing, writing poetry, understanding religious texts, speculation, and performing comedy shows. You love talking to your children and will relive your childhood with them. A well-placed Mercury will give you the confidence to express your love in a creative way. It will make you witty and humorous and you will love playing tricks, making jokes, and mimicking others. However, if Mercury is afflicted, you will have a strong ego, and your words might be hurtful to others. You will make an excellent liar and will try to manipulate others.",
  6: "When Mercury is placed in the sixth house, you will be able to resolve conflicts and avoid fights with the help of your communication skills. You use your intelligence to serve others and can become a successful lawyer or a chartered accountant. You are intelligent enough to save money in taxes and keep calculating your losses and gains. A well-placed Mercury supports your married life and you will be able to gain the confidence of your subordinates at work. However, if Mercury is afflicted, you may be prone to overthinking and end up with nervous disorders. This position will also give rise to increased debts and make you a spendthrift.",
  7: "Mercury in the seventh house can make you a successful businessperson or a good marriage counselor. Your life partner may also help you with your business and could be your business partner as well. You will be a romantic person, but may not be able to spare enough time for your partner. Your communication with your life partner will be the strength of your relationship. If Mercury is well placed, it will bless you with financial gains, wealth, and fortune. Your married life will also be contented and blissful. However, if Mercury is afflicted, it gives you a feeling of emptiness whenever you are not with your spouse. You will become speculative about your relationships, which will leave you dissatisfied.",
  8: "Mercury in the eighth house can make you an excellent researcher and will also give you a keen interest in and knowledge of occult sciences. You will be interested in esoteric studies, and would like to dig up the facts. You have a curious nature and an interesting personality. A well-placed Mercury may help you settle abroad and gather a good amount of liquid wealth in savings. You will have the power to convince and control others as per your will. However, if Mercury is afflicted, it could make you shrewd and harsh. Your arrogance will hinder your growth, and you might face problems related to your skin and respiratory system.",
  9: "Mercury in the ninth house influences you to try to find reason and logic behind religious beliefs. You can write about philosophy and publish your content to monetize it. You will also travel long distances, and will keep on looking for opportunities to earn money by any means. A well-placed Mercury will make you financially sound and curious to acquire knowledge. You will also be able to make money from your knowledge and spiritualism. However, if Mercury is afflicted, you will try to acquire knowledge through shortcuts and you will lose your respect and credibility at work. This position makes you lack righteousness and morality.",
  10: "Mercury in the tenth house can make you a successful journalist, novelist, writer, counselor, public speaker, mathematician, accountant or an entrepreneur. Your flawless communication skills will help you excel in your career. You will enjoy a fun relationship with your father and treat him like a friend. A well-placed Mercury will help you achieve recognition at work because of your exceptional articulation skills and creative ways of presenting new ideas. You will also be a very good negotiator. However, if Mercury is afflicted, you will not be a team player and would also want to control others always. Your overall personality could be rude, harsh, and selfish, which will leave you a Lone Ranger.",
  11: "Mercury in the eleventh house makes you clever and learned, and helps you gain from speculative businesses. You have a good social network because of your excellent social skills. A well-placed Mercury will enhance your profits and can help you fulfill your dreams. Your personality will be pleasant and charming, and you will have a knack for impressions. However, if Mercury is afflicted, you will not be able to focus on one thing, and keep hopping from one profession to another. Your friends might betray you and you will always be busy with backbiting and gossip.",
  12: "Mercury in the twelfth house makes you well educated and gives you a philosophical mindset. It also sparks your interest in esoteric learning. You will have a strong psychic ability and will be able to communicate with supernatural entities. This position of Mercury will make you secretive, shy and an introvert. A well-placed Mercury will help you travel a lot and settle abroad. You will also be wealthy and will be able to spend lavishly. However, if Mercury is afflicted, it will make you arrogant and tobacco. You will have scarcity of money, and your decisions could be hasty and immature, leading to huge losses. Your fertility and love life will also be adversely affected.",
};

const VENUS_HOUSE_INTERPRETATIONS = {
  1: "Venus in the first house gives you a sensuous and magnetic personality. You look much younger than your actual age and your libido is high. You care a lot about your appearance, and will be a fitness freak. You may also have artistic talents and a caring nature. A well-placed Venus will give you pleasant speech and make you popular with the opposite sex. However, if Venus is afflicted, it may cause fertility issues, your self-love could turn into selfishness, and you will likely become materialistic.",
  2: "Venus in the second house makes you fond of collecting jewelry and clothes. You will also be conscious about your savings. Your speech will be elegant and you're likely to become a profound singer, public speaker, or a cosmetologist. A well-placed Venus will bless you with good family relationships, and grant you wealth through family businesses. You will have an exclusive palate and will be fond of trying new delicacies. Your wealth will multiply post marriage. However, if Venus is afflicted, you could lose your ancestral wealth and may face infertility issues. You will also become greedy for material possessions.",
  3: "Venus in the third house blesses you with mesmerizing communication skills and an attractive personality. It also makes you a miser and makes you average-looking. You will not be determined and hardworking, which could make you suffer professionally as well as in personal life. A well-placed Venus will give you the opportunity to travel a lot. It will make you presentable and well dressed. However, if Venus is afflicted, it will give you sudden ups and downs in personal as well as professional life. You may become very dramatic, and your life could be full of trauma.",
  4: "Venus in the fourth house makes you family-oriented and domestic in nature. Women are highly valued in your family. You enjoy pleasures and comfort through real estate and your family house will be esthetic and beautiful. You have a special bond with your mother and you may follow her blindly. If Venus is well placed, you will gain from your inheritance and have a long and happy married life. Your spouse will also have a warm relationship with your family. You will be satisfied with your life and will enjoy all kinds of luxuries. However, if Venus is afflicted, it may deprive you of luxury and happiness. You may not be blessed with your mother's affection and may also be deprived of your property, and face domestic crises and quarrels about inheritance.",
  5: "Venus in the fifth house makes you academically sound and gives you multiple talents. It will give you a big social circle and unexpected gains. You are playful, sensual, and simply in love with love. You thrive and flourish on romantic attention, and you will have a beautiful heart. You will be fertile, and your children will be talented just like you. A well-placed Venus will make you wealthy, and your children will bring you happiness. It will also enhance your fertility as well as vitality. However, if Venus is afflicted, it will create relationship issues, and your education might get adversely affected. Also, you may not be able to opt for your desired career and may lose money in speculation.",
  6: "Venus in the sixth house gives you noble qualities. You will be helpful and kind toward others. This placement is not ideal for your marriage and may indicate separation. Your fertility will also not be up to the mark and you may indulge in romantic relationships with your colleagues. However, a well-placed Venus will bless you with a good immune system and help you accumulate wealth through your job. You will also have a witty nature and good comic timing. However, if Venus is afflicted, you will experience strain in your relationships due to a lack of trust. You will not be committed and responsible in your marriage, and your spouse will be unhealthy.",
  7: "Venus in the seventh house grants you an attractive personality and blesses you with abundance and wealth. The whole idea of love and romance excites you and gives you several crushes and infatuations before marriage. You will be easy-going and flexible and will not have many conflicts in life. A well-placed Venus will bless you with a great-looking spouse who will be understanding and cultured. You will be sensuous, famous, and may even live abroad. However, if Venus is afflicted, your marital relationship will be unpleasant and may lead to separation.",
  8: "Venus in the eighth house makes you a secretive lover. Your spouse will be shrewd and will manage finances on behalf of both of you. Your combined assets will flourish after marriage. You will have a deep interest in the occult sciences, and may have healing powers. A well-placed Venus will make you committed to your spouse and fill your life with romance and immense love. However, if Venus is afflicted, you could face a lot of heart breaks and disappointment on the relationship front. You will also become lazy and not be appreciated by others.",
  9: "Venus in the ninth house inclines you toward spiritual learning and makes you philosophical. Your life is filled with joy and pleasures, and you can consider yourself very lucky. A well-placed Venus makes you excel in studies and grants you knowledge about spirituality, religion, and history. You can become a successful teacher and inspire others through your achievements. However, if Venus is afflicted, your relationships will become long distance and there will be misunderstandings between you and your spouse. You will become overwhelmed while trying to balance your career as well as your domestic life.",
  10: "Venus in tenth house represents authority, passion, compassion, and public image. You can become a successful social worker or a philanthropist. You will opt for a career that enhances your creativity, and you may discover your spouse in the workplace or professional area. A well-placed Venus will give you influential connections and open doors to elevate you and help others with love and compassion. However, if Venus is afflicted, it will make you self-centered and greedy. You will become overloaded with debts, and you will crave for limelight and attention but will not get it.",
  11: "Venus in the eleventh house will give you opportunities to explore the world and you will use these opportunities to make money. Socially, you have a very soothing and jovial personality, which is why you attract many friends. People find comfort while having conversations with you and you give them great advice. You will become financially stronger after you get married and will be more inclined toward business rather than being employed in a 9 to 5. If Venus is well placed, then your personality will become more attractive, and you will be able to connect and communicate easily with anyone. However, if Venus is afflicted, it will make you highly materialistic and possessive. Your friends will also be self-centered and not loyal to you.",
  12: "Venus in twelfth house will grant you imaginative powers and can help you become a renowned artist. You will have high expectations from your spouse and never be satisfied in one relationship. This placement of Venus gives you utmost bed pleasures and happiness through intimacy from a very early age. A well-placed Venus will give you an attractive personality and make your life pleasurable. You will also live a long life with your spouse. However, if Venus is afflicted, you will be dissatisfied with your spouse and may not be loyal to them. You will also be a spendthrift and take loans to fulfill your desires.",
};

const MOON_HOUSE_INTERPRETATIONS = {
  1: "प्रथम भाव में स्थित चंद्रमा आपको एक राजसी व्यक्तित्व और आकर्षक आभा प्रदान करता है जो लोगों को आकर्षित करती है। आपका सामाजिक दायरा व्यापक होगा और आपमें स्वाभाविक कलात्मक प्रतिभा के साथ-साथ भावनात्मक स्वास्थ्य भी होगा। आपका जीवन आपकी माता के इर्द-गिर्द घूमता है और आप स्वभाव से ही स्नेहशील और पालन-पोषण करने वाले व्यक्ति हैं। आप भावनात्मक रूप से बुद्धिमान हैं और धन एवं सुख-सुविधाओं का आनंद लेते हैं। हालांकि, नकारात्मक स्थिति में स्थित चंद्रमा आपको अलगाव, अवसाद और कुछ मानसिक स्वास्थ्य समस्याओं का कारण बन सकता है। यदि चंद्रमा अस्त हो, तो यह भ्रम, बार-बार मनोदशा में परिवर्तन और भावनात्मक रूप से थका हुआ महसूस करने का कारण बन सकता है। इसका प्रभाव आपकी माता के खराब स्वास्थ्य के रूप में भी दिख सकता है। प्रसिद्ध गायिका मैडोना और अभिनेता राज कपूर प्रथम भाव में स्थित चंद्रमा के प्रभाव में जन्मे हैं।",
  2: "दूसरे भाव में चंद्रमा होने से आपको आर्थिक स्वतंत्रता, भावनात्मक जुड़ाव और पारिवारिक मूल्यों एवं परंपराओं के प्रति झुकाव प्राप्त होता है, जो अक्सर आपको पारिवारिक विरासत को आगे बढ़ाने के लिए प्रेरित करता है। यह आपको कलात्मक व्यक्तित्व और रहस्यवाद में रुचि के साथ-साथ प्रबल मानसिक क्षमता भी प्रदान करता है। आपके पास पर्याप्त बचत है और आप एक चतुर निवेशक हैं। आपको ठंडे पेय पसंद हैं और आप स्वभाव से खाने-पीने के शौकीन हैं। आपका अपने परिवार के साथ गहरा भावनात्मक बंधन है। आपका जीवनसाथी कुछ बातों को गुप्त रख सकता है। हालांकि, यदि आपकी जन्म कुंडली में चंद्रमा पीड़ित है, तो आपकी संपत्ति में उतार-चढ़ाव आ सकता है और आप भौतिकवाद की ओर आकर्षित हो सकते हैं, साथ ही भावनात्मक अशांति और वैवाहिक जीवन में परेशानी का सामना कर सकते हैं। यदि चंद्रमा अस्त है, तो इससे आर्थिक असुरक्षा, धन संकट और वैवाहिक समस्याएं उत्पन्न हो सकती हैं। प्रसिद्ध व्यवसायी मुकेश अंबानी और रैपर जे-जेड द्वितीय भाव में स्थित चंद्रमा के प्रभाव में पैदा हुए हैं।",
  3: "जब चंद्रमा तीसरे भाव में स्थित होता है, तो यह आमतौर पर आपको सक्रिय और जिज्ञासु मन, यात्रा की प्रबल इच्छा और पड़ोसियों और भाई-बैनों के साथ सौहार्दपूर्ण संबंध प्रदान करता है। आप अक्सर आय के कई स्रोतों का आनंद लेते हैं और लेखन, संचार और विपणन कौशल में निपुण होते हैं। कुंडली में अनुकूल स्थिति वाला या सकारात्मक चंद्रमा आपको भाग्यशाली और प्रभावशाली बनाता है, और आपको आध्यात्मिक गुरु या योगी बनने की क्षमता प्रदान करता है। हालांकि, नकारात्मक चंद्रमा आपको बेचैनी, ध्यान भटकने, बार-बार नौकरी बदलने, आर्थिक अस्थिरता और वैवाहिक समस्याओं का सामना करने के लिए प्रेरित करता है। यदि चंद्रमा अस्त हो, तो यह आपको आलसी बना सकता है, आपके मन में नकारात्मक सोच पैदा कर सकता है और आपको विश्वास संबंधी समस्याएं हो सकती हैं। प्रसिद्ध व्यवसायी एलोन मस्क और अभिनेता अक्षय कुमार तीसरे भाव में स्थित चंद्रमा के प्रभाव में पैदा हुए हैं।",
  4: "चौथे भाव में स्थित चंद्रमा आपको हर तरह की विलासिता, अचल संपत्ति और एक घनिष्ठ पारिवारिक बंधन प्रदान करेगा। आप एक सकारात्मक व्यक्तित्व वाले व्यक्ति होंगे, जिनमें मातृत्व की प्रबल भावना और स्नेहपूर्ण स्वभाव होगा। आपका रूप-रंग और आदतें आपकी माता से मिलती-जुलती होंगी। सकारात्मक स्थिति में स्थित चंद्रमा आपको दूसरों की सेवा से संबंधित करियर दिलाएगा। आपका परिवार आपकी पहली प्राथमिकता होगा और आप दान-पुण्य करने के साथ-साथ अपनी संपत्ति का आनंद भी उठाएंगे। हालांकि, पीड़ित चंद्रमा आपको भावनात्मक रूप से अशांत, असंतुष्ट और माता के प्रेम से वंचित कर देगा। यदि चंद्रमा अस्त हो, तो यह आपके जीवन को संघर्षों से भर सकता है और आपको ननिहाल पक्ष से विरासत प्राप्त नहीं होगी। प्रसिद्ध राजनेता डोनाल्ड ट्रम्प और फिल्म निर्माता सिद्धार्थ रॉय कपूर चौथे भाव में स्थित चंद्रमा के प्रभाव में पैदा हुए हैं।",
  5: "जब चंद्रमा पंचम भाव में स्थित होता है, तो यह आपको अत्यधिक रचनात्मक और कुशल वक्ता बनाता है। आप लोगों को अपनी ओर आकर्षित करने में सक्षम होंगे और राजनीति में आपकी गहरी रुचि होगी। आप अपने बच्चों के साथ गहरा भावनात्मक बंधन साझा करेंगे और रिश्तों में वफादार रहेंगे। अनुकूल स्थिति में स्थित चंद्रमा आपको साहसी, नेक और वफादार बनाएगा। आपकी आध्यात्मिक रुचियां गहरी होंगी और आप धन-संपत्ति का आनंद लेंगे। हालांकि, प्रतिकूल स्थिति में स्थित चंद्रमा आपको पढ़ाई से विचलित करेगा और आपको कार्यस्थल पर कलह, चिंता, स्वास्थ्य संबंधी समस्याएं और अनावश्यक खर्चों का सामना करना पड़ेगा। यदि चंद्रमा अस्त हो, तो आपको अपने बच्चों और प्रेम जीवन में असामंजस्य का सामना करना पड़ेगा। प्रसिद्ध उद्योगपति जेआरडी टाटा और फिल्म निर्देशक स्टीवन स्पीलबर्ग पांचवें भाव में स्थित चंद्रमा के प्रभाव में जन्मे हैं।",
  6: "छठे भाव में चंद्रमा की स्थिति वकीलों और पुलिस अधिकारियों के लिए बहुत अच्छी होती है, क्योंकि इससे आपको अनेक शत्रु और उनसे निपटने की क्षमता मिलती है। आप चिकित्सा और स्वास्थ्य सेवाओं में भी अच्छा कर सकते हैं, और जानवरों के प्रति आपका स्नेह अत्यंत प्रबल होगा। यह आपको अपने खान-पान के प्रति सजग बनाएगा और एक सफल व्यवसायी के गुण प्रदान करेगा। अनुकूल स्थिति में स्थित चंद्रमा आपको मददगार स्वभाव और स्वस्थ जीवनशैली प्रदान करता है। यह आपको सहज ज्ञान वाला और कर्मठ भी बनाता है। हालांकि, प्रतिकूल स्थिति में स्थित चंद्रमा आपको छोटी-मोटी स्वास्थ्य समस्याओं के प्रति सजग बना देगा, और आप भ्रमित और असुरक्षित महसूस करेंगे। यदि आपका चंद्रमा अस्त है, तो आप अवसादग्रस्त और एकाकी महसूस करेंगे, और आपको अपने जीवनसाथी पर भरोसा करने में कठिनाई होगी। मशहूर अभिनेता शाहरुख खान और ऐश्वर्या राय बच्चन छठे भाव में स्थित चंद्रमा के प्रभाव में पैदा हुए हैं।",
  7: "जब चंद्रमा सातवें भाव में स्थित होता है, तो आपका जीवनसाथी बिना शर्त आपका साथ देता है। इससे आपके भाव संतुलित रहते हैं और रिश्ते सामंजस्यपूर्ण होते हैं। आप अपने व्यवसाय से धन और प्रसिद्धि अर्जित करेंगे। आपके भाव संतुलित रहते हैं और आपको एक सुंदर जीवनसाथी मिलता है। अनुकूल स्थिति में स्थित चंद्रमा आपको हर प्रकार का सुख, सफल व्यवसाय और सुखमय वैवाहिक जीवन प्रदान करता है। हालांकि, यदि चंद्रमा प्रतिकूल स्थिति में हो, तो यह वैवाहिक और व्यावसायिक दोनों ही क्षेत्रों में घुटन और असामंजस्य पैदा करता है। साथ ही, विदेश में बसना भी मुश्किल हो जाता है। यदि चंद्रमा अस्त हो, तो आप अपने वैवाहिक जीवन से असंतुष्ट और परेशान रहेंगे। यह आपकी आर्थिक वृद्धि में भी बाधा उत्पन्न करेगा। प्रसिद्ध पॉप स्टार माइकल जैक्सन और प्रसिद्ध एथलीट पीटी उषा का जन्म सातवें भाव में चंद्रमा के प्रभाव में हुआ है।",
  8: "आठवें भाव में चंद्रमा होने से आपको गुप्त विद्याओं में गहरी रुचि होगी। आप एक सफल ज्योतिषी या चिकित्सक बन सकते हैं। यह आपको पालन-पोषण का गुण और अनिश्चित भाग्य प्रदान करता है। आप समय-समय पर भावनात्मक उथल-पुथल से गुजरेंगे, जो आपको परिपक्व और संतुलित बनाएगा। अनुकूल स्थिति में स्थित चंद्रमा आपको शांति और उपलब्धियां प्रदान करता है। यह आपको प्रभावशाली संचार कौशल और यात्रा की इच्छा प्रदान करेगा। हालांकि, यदि चंद्रमा प्रतिकूल स्थिति में है, तो आपको ससुराल वालों के साथ कलह और शारीरिक क्षति का निरंतर भय हो सकता है। आप बार-बार मनोदशा में बदलाव, यौन इच्छा की कमी और मोटापे से ग्रस्त हो सकते हैं। यदि आपका चंद्रमा अस्त है, तो यह दीर्घकालिक बीमारियों और रिश्तों में कई समस्याओं का कारण बन सकता है। यह आपको जल भय भी प्रदान करता है। प्रसिद्ध भारतीय आध्यात्मिक गुरु सद्गुरु और ओशो आठवें भाव में स्थित चंद्रमा के प्रभाव में जन्मे हैं।",
  9: "नौवें भाव में स्थित चंद्रमा आपको नाम, यश, धन और पहचान दिलाता है। यह आपको मानसिक शक्तियां प्रदान करता है और सफलता एवं सौभाग्य लाता है। यह दर्शन और धर्म में आपकी रुचि जगाता है। चंद्रमा की यह स्थिति विदेश यात्राओं और बसने की संभावनाओं को बढ़ाती है। अनुकूल स्थिति में स्थित चंद्रमा आपको संतुष्ट और प्रसन्न रखता है तथा प्रबुद्ध गुरुओं के मार्गदर्शन से आपको ईश्वर से जुड़ने में सहायता करता है। यह आपको रचनात्मक बनने और लीक से हटकर सोचने में भी मदद करता है। यदि आपका चंद्रमा पीड़ित है, तो आप अपने परिवार की धार्मिक मान्यताओं के विरुद्ध जा सकते हैं और आपका वैवाहिक जीवन भी अस्त-व्यस्त हो सकता है। आप बिना सोचे-समझे अत्यधिक खर्च करने की प्रवृत्ति रखते हैं, जो आपको आर्थिक संकट की ओर धकेल सकता है। अस्त चंद्रमा आपको अंधविश्वासों से ग्रसित बना सकता है और नकली गुरु आपका अनुचित लाभ उठा सकते हैं। प्रसिद्ध भारतीय अभिनेता अमिताभ बच्चन और राजनीतिज्ञ अमित शाह का जन्म नौवें भाव में स्थित चंद्रमा के प्रभाव में हुआ है।",
  10: "जब चंद्रमा दसवें भाव में स्थित होता है, तो यह आपको अधिकारपूर्ण लेकिन दयालु और उदार बनाता है। आप अपनी समस्याओं को हल करने के लिए हिंसा के बजाय कूटनीति का चुनाव करते हैं। यह सफल सरकारी नेताओं के लिए अनुकूल स्थिति है। आपकी माता अनुशासनप्रिय होंगी, इसलिए आप अपने पिता की ओर आकर्षित होंगे। आप करियर उन्मुख होने के साथ-साथ पारिवारिक व्यक्ति भी होंगे। अच्छी स्थिति में स्थित चंद्रमा आपको आकर्षक व्यक्तित्व प्रदान करेगा। आपमें नेतृत्व के गुण होंगे और आपकी सहज बुद्धि प्रबल होगी। हालांकि, यदि चंद्रमा पीड़ित है, तो यह आपको सफलता और प्रसिद्धि के प्रति जुनूनी बना देता है, और आपके व्यक्तिगत संबंध पीछे छूट जाते हैं। आपका आत्मविश्वास कम होगा और आप हमेशा चिंतित और प्रतिस्पर्धी बने रहेंगे। यदि चंद्रमा अस्त है, तो आप कम आत्मविश्वास के साथ बार-बार नौकरी बदलते रहेंगे और सामाजिक मानदंडों को चुनौती देने का प्रयास करेंगे। प्रसिद्ध अमेरिकी राजनीतिज्ञ हिलेरी क्लिंटन और व्यवसायी बिल गेट्स का जन्म दसवें भाव में स्थित चंद्�रमा के प्रभाव में हुआ है।",
};


const JUPITER_HOUSE_INTERPRETATIONS = {
  1: "स्वभाव आपको समाज में सम्मान और लोकप्रियता दिलाता है और लोग आपके अच्छे कर्मों, ईमानदारी और निस्वार्थ व्यवहार की प्रशंसा करते हैं। कुंडली में अच्छी स्थिति में स्थित बृहस्पति आपको भीड़ से अलग बनाता है और आपको गहन मानसिक शक्ति, आत्मविश्वास, करुणा और आध्यात्मिक झुकाव प्रदान करता है। हालांकि, यदि आपकी कुंडली में बृहस्पति पीड़ित है, तो आप अनजाने में दूसरों को दुख पहुंचा सकते हैं या अत्यधिक मददगार बन सकते हैं। अस्त बृहस्पति भाग्य की कमी ला सकता है और ज्ञान प्राप्त करना चुनौतीपूर्ण हो सकता है। प्रसिद्ध भारतीय क्रिकेटर एमएस धोनी और अमेरिकी राष्ट्रपति बराक ओबामा प्रथम भाव में स्थित बृहस्पति के प्रभाव में पैदा हुए थे।",
  2: "द्वितीय भाव में बृहस्पति आपको प्रभावशाली व्यक्तित्व और आकर्षक वाणी प्रदान करता है। यह स्थिति आपको समृद्ध बनाती है और नेतृत्व की भूमिकाओं के लिए उपयुक्त बनाती है। आपके शत्रु कमजोर हो जाते हैं और आपको सरकार से लाभ प्राप्त होता है। अच्छी स्थिति में स्थित बृहस्पति आपको एक अच्छा लेखक या मधुर वाणी वाला ज्योत",
  4: "चौथे भाव में बृहस्पति का होना बहुत शुभ होता है और इससे आपको विरासत में मिली संपत्ति और सुख-सुविधओं की भरपूर प्राप्ति होती है। आपका अपने परिवार, विशेषकर अपनी माता के साथ घनिष्ठ संबंध है। आपके परिवार के सदस्य भावनात्मक और आर्थिक दोनों तरह से आपका सहयोग करते हैं। अनुकूल स्थिति में स्थित बृहस्पति आपको लाभदायक अचल संपत्ति सौदे करने में मदद करता है और आपको प्रबल अंतर्ज्ञान शक्ति प्रदान करता है। हालांकि, यदि बृहस्पति पीड़ित हो, तो यह आपको कठोर और चालाक बना देगा और आपको अत्यधिक मिलनसार स्वभाव देगा। अस्त बृहस्पति आपकी प्रगति को धीमा कर देगा और आपके भाग्य में कमी लाएगा। भारत के प्रसिद्ध प्रधानमंत्री नरेंद्र मोदी और अभिनेता सलमान खान का जन्म चौथे भाव में स्थित बृहस्पति के प्रभाव में हुआ था।",
  5: "पंचम भाव में बृहस्पति आपके और आपके बच्चों के बीच गहरा बंधन बनाता है और आपको अनेक प्रतिभाएँ प्रदान करता है। यह आपके प्रेम जीवन में भी सुख लाता है और आपके साथी के साथ दिव्य जुड़ाव की गहरी अनुभूति करा सकता है। यह बृहस्पति आपके शौक और प्रतिभाओं को करियर के रूप में आगे बढ़ाने के भरपूर अवसर प्रदान करता है। यह आपको ज्ञान प्राप्त करने की तीव्र इच्छा भी देता है। अच्छी स्थिति में स्थित बृहस्पति आपको दयालु और अपने बच्चों के प्रति अत्यधिक स्नेहशील बनाता है। हालांकि, यदि आपका बृहस्पति पीड़ित है, तो यह संतान संबंधी समस्याओं का कारण बन सकता है और आपको दबंग स्वभाव दे सकता है। अस्त बृहस्पति तनाव और रोमांस में कमी लाएगा और आपकी रचनात्मक क्षमता में ढिलाई आ सकती है। प्रसिद्ध वैज्ञानिक आइजैक न्यूटन और गायक जस्टिन बीबर का जन्म पांचवें भाव में स्थित बृहस्पति के प्रभाव में हुआ था।",
  6: "छठे भाव में बृहस्पति के होने से मिश्रित परिणाम मिलते हैं। यह आपको करियर के अच्छे अवसर प्रदान करता है और ऋण चुकाने में सहायता करता है, लेकिन साथ ही साथ स्वास्थ्य संबंधी चुनौतियाँ भी उत्पन्न करता है। अच्छी स्थिति में स्थित बृहस्पति कानूनी मामलों में सकारात्मक परिणाम लाता है और आपको शत्रुओं से सुरक्षित रखता है। आपके रोग भी आसानी से ठीक हो जाएँगे। हालांकि, यदि बृहस्पति पीड़ित हो, तो यह यकृत संबंधी रोग और कार्यस्थल पर चुनौतियाँ दे सकता है। यदि बृहस्पति अस्त हो, तो आपके शत्रु आपको नुकसान पहुँचाएँगे और आपको ऋण चुकाने में कठिनाइयों का सामना करना पड़ेगा। अभिनेता अमिताभ बच्चन और क्रिकेट के दिग्गज सचिन तेंदुलकर छठे भाव में स्थित बृहस्पति के प्रभाव में पैदा हुए थे।",
  7: "सातवें भाव में बृहस्पति आपको सुखमय वैवाहिक जीवन का आशीर्वाद देता है और आपको एक आध्यात्मिक, वफादार और उच्च कोटि का विद्वान जीवनसाथी प्रदान करता है। यह आपको ईमानदारी, आध्यात्मिकता और पर्याप्त धन भी प्रदान करता है। अच्छी स्थिति में स्थित बृहस्पति आपके व्यावसायिक उपक्रमों, विशेषकर परामर्श, अध्यापन या ज्योतिष से संबंधित उपक्रमों में आपका सहयोग करता है। हालांकि, यदि बृहस्पति पीड़ित हो, तो यह वैवाहिक जीवन के साथ-साथ व्यापार में भी चुनौतियां ला सकता है। यदि बृहस्पति अस्त हो, तो यह आत्मसम्मान में कमी का भाव ला सकता है और आप किसी पर भी विश्वास किए बिना अलग-थलग महसूस कर सकते हैं। प्रसिद्ध भारतीय अभिनेत्री प्रियंका चोपड़ा और नीतिशास्त्री एम.के. (महात्मा) गांधी का जन्म सातवें भाव में स्थित बृहस्पति के प्रभाव में हुआ था।",
  8: "आठवें भाव में बृहस्पति आपको गहन अन्वेषण, शोध और गुप्त विद्याओं की ओर प्रेरित करता है। यह आपको यौन सुख की तीव्र इच्छा देता है और आपके साथी के साथ आपका घनिष्ठ संबंध स्थापित करता है। अनुकूल स्थिति में स्थित बृहस्पति आपको विरासत या ससुराल से अपार धन-संपत्ति दिलाएगा। यह आपकी आध्यात्मिकता में रुचि जगाएगा और समय-समय पर आपको अप्रत्याशित लाभ दिलाएगा। हालांकि, यदि बृहस्पति पीड़ित हो, तो आपको अचानक हानि का सामना करना पड़ सकता है और आपके प्रेम संबंध लंबे समय तक नहीं टिकेंगे। यदि बृहस्पति अस्त हो, तो आपको अपने गुप्त कार्यों के कारण समस्याओं का सामना करना पड़ सकता है। अमेरिका के प्रसिद्ध राष्ट्रपति जो बाइडेन और पाकिस्तानी राजनेता इमरान खान का जन्म आठवें भाव में स्थित बृहस्पति के प्रभाव में हुआ था।",
  9: "नौवें भाव में बृहस्पति होने से आपके पिता के साथ आपका मजबूत रिश्ता बनेगा और आपके धर्म में आपकी गहरी आस्था रहेगी। यह आपको मानसिक शांति और स्थिरता प्रदान करेगा और विदेश यात्रा के बार-बार अवसर देगा। आपके कुछ विदेशी संपर्क भी बनेंगे और आपको विदेश में बसने का मौका मिल सकता है। अच्छी स्थिति में स्थित बृहस्पति आपको उच्च शिक्षा प्राप्त करने की प्रबल इच्छा देगा और आपके जीवन में सकारात्मक परिणाम लाएगा। हालांकि, यदि बृहस्पति पीड़ित है, तो आध्यात्मिक गतिविधियों में अत्यधिक लिप्तता के कारण आप परिवार से विमुख हो सकते हैं। अस्त बृहस्पति निराशा ला सकता है और उच्च शिक्षा के आपके लक्ष्य पूरे नहीं हो सकते हैं। प्रसिद्ध भौतिक विज्ञानी अल्बर्ट आइंस्टीन और भारतीय अभिनेता अक्षय कुमार का जन्म नौवें भाव में स्थित बृहस्पति के प्रभाव में हुआ था।",
  10: "दसवें भाव में बृहस्पति होने से आपको कार्यस्थल पर विशेष पहचान मिलती है। यह आपको दूरदर्शिता, नैतिक मूल्यों का वरदान देता है और आपको बुद्धिमान और धर्मी बनाता है। यह आपको समाज में सकारात्मक प्रतिष्ठा दिलाता है और आपको दयालु और उदार बनाता है। अच्छी स्थिति में स्थित बृहस्पति आपको सफल करियर और अपार प्रसिद्धि दिलाएगा। आप आर्थिक रूप से मजबूत होंगे और फिर भी विनम्र और दयालु बने रहेंगे। हालांकि, यदि बृहस्पति पीड़ित हो, तो यह आपको कार्यस्थल पर अति आत्मविश्वास और अहंकार की समस्या दे सकता है। यदि बृहस्पति अस्त हो, तो यह आत्मविश्वास की कमी ला सकता है और आपके कार्य अपेक्षा के अनुरूप शक्तिशाली और प्रभावी नहीं हो सकते हैं। प्रसिद्ध अभिनेत्री एंजेलिना जोली और कारोबारी मुकेश अंबानी का जन्म दसवें भाव में बृहस्पति के प्रभाव में हुआ था।",
  11: "ग्यारहवें भाव में बृहस्पति आपको लाभ और समृद्धि प्रदान करता है। यह आपके भाई-बहनों के साथ आपके संबंधों को बेहतर बनाता है और आपके सामाजिक दायरे को बढ़ाता है। इस भाव में अच्छी स्थिति में स्थित बृहस्पति विभिन्न माध्यमों से आपकी आय बढ़ाता है और आपकी आर्थिक स्थिति में सुधार करता है। आपके मित्रों के साथ आपका गहरा संबंध होता है और वे आपकी मित्रता को महत्व देते हैं। हालांकि, यदि बृहस्पति पीड़ित हो, तो यह आय में अनियमितता ला सकता है और आपके और आपके भाई-बहनों के बीच मतभेद पैदा कर सकता है। अस्त बृहस्पति आपके व्यवहार में चिड़चिड़ापन और आत्मविश्वास की कमी ला सकता है। प्रसिद्ध भारतीय हास्य अभिनेता कपिल शर्मा और पूर्व भारतीय प्रधानमंत्री इंदिरा गांधी का जन्म ग्यारहवें भाव में स्थित बृहस्पति के प्रभाव में हुआ था।",
  12: "बारहवें भाव में बृहस्पति आपको विदेश से अवसर दिलाएगा और आपको अत्यधिक आध्यात्मिक और धार्मिक बनाएगा। यह आपके मोक्ष का कारण बन सकता है और आपको जीवन के उस सत्य के करीब लाएगा जिसकी आप तलाश कर रहे हैं। कभी-कभी आपको अस्पतालों पर खर्च करना पड़ सकता है और आपके कुल खर्चे बढ़ सकते हैं। अच्छी स्थिति में स्थित बृहस्पति आपके आध्यात्मिक ज्ञान का विस्तार करेगा और आपको मोक्ष के मार्ग पर ले जाएगा। हालांकि, यदि बृहस्पति पीड़ित है, तो यह हानि, अस्पताल में भर्ती होने की आवश्यकता वाली स्वास्थ्य समस्याएं और आपके शत्रुओं से नुकसान ला सकता है। अस्त बृहस्पति ईश्वर से आपके संबंध को बाधित कर सकता है, जिससे आप निराश महसूस कर सकते हैं।",
};

const RAHU_HOUSE_INTERPRETATIONS = {
  1: "प्रथम भाव में राहु आपकी बुद्धि को बढ़ाता है और आपको हाजिरजवाब बनाता है। यह आपको शीघ्र धन प्राप्ति और धन में अचानक वृद्धि का आशीर्वाद देगा। हालांकि, यह आपको कुछ अवांछित आदतें और अव्यवस्था की भावना भी दे सकता है। अच्छी स्थिति में राहु होने से आपकी अंतर्ज्ञान शक्ति तेज होती है और आप तुरंत नए विचार उत्पन्न कर पाते हैं। यह आपको एक आकर्षक व्यक्तित्व प्रदान करता है जो दूसरों को आकर्षित करता है। हालांकि, यदि राहु पीड़ित हो, तो आप सफलता प्राप्त करने के लिए अनैतिक तरीकों का सहारा ले सकते हैं; आप चिड़चिड़े भी हो जाएंगे और दूसरों को नीचा समझेंगे। प्रसिद्ध आविष्कारक निकोला टेस्ला और लेखक चार्ल्स डिकेंस का जन्म प्रथम भाव में राहु के प्रभाव में हुआ था।",
  2: "द्वितीय भाव में राहु होने से आपको अपने करियर और विरासत दोनों के माध्यम से धनवान बनना निश्चित है। आपका अपने परिवार से गहरा संबंध रहेगा, लेकिन आधिकारिक प्रतिबद्धताओं के कारण आपको उनसे दूरी बनानी पड़ सकती है। अच्छी स्थिति में स्थित राहु आपको समाज में अच्छे संपर्क और संबंध दिलाएगा और आपको अपने पूर्वजों के प्रति गहरी श्रद्धा प्रदान करेगा। हालांकि, यदि राहु पीड़ित हो, तो यह आपको खर्चीला बना देगा और आप कानूनी परेशानियों में भी पड़ सकते हैं। प्रसिद्ध अभिनेता सलमान खान और संगीतकार रवि शंकर का जन्म द्वितीय भाव में राहु के प्रभाव में हुआ था।",
  3: "तीसरे भाव में राहु होने से आपका भविष्य मीडिया से जुड़े किसी पेशे में होगा, क्योंकि आपके पास उत्कृष्ट संचार कौशल होगा। आप छोटी-छोटी यात्राओं पर भी जाएंगे, जिनसे आपको विकास के अवसर मिलेंगे। अच्छी स्थिति में राहु होने से आप एकाग्र और समर्पित रहेंगे, जिससे आपको अत्यधिक सफलता मिलेगी। जरूरत पड़ने पर आप साहस और वीरता का प्रदर्शन करेंगे और इसके लिए आपकी सराहना भी होगी। हालांकि, यदि राहु पीड़ित हो, तो यह आपको स्वार्थी बना सकता है और चोट या दुर्घटना का कारण बन सकता है। आपको आर्थिक नुकसान भी हो सकता है। प्रसिद्ध क्रिकेटर विराट कोहली और गायक माइकल जैक्सन का जन्म तीसरे भाव में स्थित राहु के प्रभाव में हुआ था।",
  4: "चौथे भाव में राहु होने से आपको अपने परिवार और मातृभूमि से गहरा लगाव होगा। यह आपको अचल संपत्ति बढ़ाने और धन-संपत्ति में वृद्धि करने वाले परिसंपत्तियां सृजित करने के लिए प्रेरित करेगा। यह वैवाहिक जीवन में सुख भी प्रदान करता है। अच्छी स्थिति में स्थित राहु धन और शक्ति में अचानक वृद्धि ला सकता है और आपको अपने जीवनसाथी के प्रति वफादार बनाएगा। इट विल आल्सो गिव यू अपनी माता के प्रति गहरा भावनात्मक लगाव भी देगा। हालांकि, यदि राहु पीड़ित है, तो आर्थिक और संपत्ति के मामले में अचानक गिरावट की संभावना रहेगी। यह आपके रिश्तों और करियर को भी प्रतिकूल रूप से प्रभावित करेगा। प्रसिद्ध अभिनेता आमिर खान और टेनिस खिलाड़ी सेरेना विलियम्स का जन्म चौथे भाव में राहु के प्रभाव में हुआ था।",
  5: "पांचवें भाव में राहु होने से आपके कई प्रेम संबंध होंगे और यौन संबंध आपके जीवन का एक महत्वपूर्ण हिस्सा बन जाएंगे। सट्टेबाजी से आपको लाभ होगा और आप बहुमुखी प्रतिभा के धनी होंगे। अच्छी स्थिति में स्थित राहु आपके बच्चों के साथ आपके संबंधों को मजबूत करेगा और आपको सामाजिक दायरे में उच्च स्थान दिलाएगा। हालांकि, यदि राहु पीड़ित हो, तो आपका वैवाहिक जीवन प्रभावित होगा और आपको सट्टेबाजी से संबंधित नुकसान का सामना करना पड़ सकता है। प्रसिद्ध राजनेता नरेंद्र मोदी और उद्यमी स्टीव जॉब्स का जन्म पांचवें भाव में राहु के प्रभाव में हुआ था।",
  6: "छठे भाव में राहु आपको जुझारू भावना प्रदान करता है और प्रतियोगिताओं में जीत दिलाने में सहायक होता है। यह आपको बीमार पड़ने पर रोगों से लड़ने की क्षमता भी देता है। आप नौकरी को प्राथमिकता देंगे और व्यापार से दूर रह सकते हैं। अच्छी स्थिति में स्थित राहु आपको अच्छे स्वास्थ्य और भौतिक सुख-सुविधाएं प्रदान कर सकता है। वरिष्ठों के साथ आपके संबंध अच्छे रहेंगे और इससे आपको उच्च पदों तक पहुंचने में मदद मिलेगी। हालांकि, यदि राहु पीड़ित है, तो आपको निवेश करते समय सतर्क रहने और जोखिम रहित विकल्पों को चुनने की आवश्यकता हो सकती है। आपको अपनी लगातार बनी रहने वाली स्वास्थ्य समस्याओं के ठीक न होने से कुछ पीड़ा का सामना करना पड़ सकता है। प्रसिद्ध क्रिकेटर हार्दिक पांड्या और अभिनेत्री एंजेलिना जोली का जन्म छठे भाव में स्थित राहु के प्रभाव में हुआ था।",
  7: "सातवें भाव में राहु होने से वैवाहिक जीवन सुखमय होता है and जीवनसाथी के साथ आपका गहरा and मजबूत रिश्ता बनता है। व्यापार में अच्छे अवसर मिलेंगे and व्यापारिक साझेदारों के साथ अच्छे संबंध विकसित होंगे। अच्छी स्थिति में राहु होने से व्यापार में धन and लाभ प्राप्त होगा; साथ ही वैवाहिक जीवन में प्रेम and स्नेह भी बना रहेगा। हालांकि, यदि राहु पीड़ित हो तो पेशेवर जीवन में बाधाएं आ सकती हैं। इससे जीवनसाथी के साथ गलतफहमियां भी पैदा हो सकती हैं। प्रसिद्ध अभिनेता अमिताभ बच्चन and फुटबॉलर डेविड बेकहम का जन्म सातवें भाव में स्थित राहु के प्रभाव में हुआ था।",
  8: "आठवें भाव में राहु होने से आप रहस्यप्रिय हो जाते हैं and गुप्त विद्याओं तथा काले जादू में आपकी गहरी रुचि होती है। आप नवोन्मेषी होने के साथ-साथ धनी भी होंगे। आपकी रचनात्मक क्षमता आपको नाम and प्रसिद्धि दिलाएगी। अच्छी स्थिति में स्थित राहु आपको शोध में निपुण बनाता है and मजबूत संबंध प्रदान करता है। आप सुशिक्षित and सम्मानित भी होंगे। हालांकि, यदि राहु पीड़ित हो, तो आप धन कमाने के लिए कुछ अवैध गतिविधियों में शामिल हो सकते हैं, जिसके परिणाम भुगतने पड़ सकते हैं। इससे आपके वैवाहिक जीवन में तनाव भी आ सकता है। प्रसिद्ध अभिनेता रणबीर कपूर and राजनीतिज्ञ विंस्टन चर्चिल का जन्म आठवें भाव में राहु के प्रभाव में हुआ था।",
  9: "नौवें भाव में राहु धार्मिक प्रवृत्ति को बढ़ावा देता है and आपको धार्मिक उपदेशक बना सकता है। यह आपके रूप-रंग को भी निखार सकता है and आर्थिक लाभ दिला सकता है। आपको विदेश यात्रा करने and विभिन्न संस्कृतियों को जानने के कई अवसर मिलेंगे। अच्छी स्थिति में स्थित राहु धन-संपत्ति and संपत्ति संचय में सहायक होगा। आपके पिता के साथ आपका गहरा संबंध रहेगा, जो जीवन में आपका मार्गदर्शन करेंगे। हालांकि, यदि राहु पीड़ित हो, तो यह पिता and बच्चों के साथ गलतफहमियों का कारण बन सकता है। यह आपको निराशा and कभी-कभी हानि भी पहुंचा सकता है। प्रसिद्ध हास्य अभिनेता चार्ली चैपलिन and अभिनेत्री मेगन फॉक्स का जन्म नौवें  भाव में राहु के प्रभाव में हुआ था।",
  10: "दसवें भाव में राहु आपको नाम and धन कमाने की ओर प्रेरित करेगा। यह आपको महत्वाकांक्षी बनाएगा and आप अपनी इच्छाओं को पूरा करने में सक्षम होंगे। यह आपको ज्ञान बढ़ाने के लिए भी प्रेरित करेगा, जिससे आपको अपने करियर में उन्नति मिलेगी। अच्छी स्थिति में स्थित राहु आपको विदेश से लाभ दिलाएगा and आपकी आर्थिक स्थिति को मजबूत बनाएगा। आपको सरकारी and कॉर्पोरेट दोनों क्षेत्रों से लाभ प्राप्त होगा। हालांकि, यदि राहु पीड़ित है, तो यह आपके रिश्तों में तनाव लाएगा। विभिन्न क्षेत्रों में लाभ and सफलता के लिए आपको अवैध साधनों का सहारा लेना पड़ सकता है। प्रसिद्ध क्रिकेटर क्रिस गेल and गायिका नेहा कक्कड़ का जन्म दसवें भाव में स्थित राहु   के प्रभाव में हुआ था।",
  11: "ग्यारहवें भाव में राहु होने से अपार साहस and दृढ़ संकल्प प्राप्त होता है। आपके मित्रों का दायरा भी अच्छा रहेगा and आप अपने मित्रों के जीवन में महत्वपूर्ण स्थान रखेंगे। आप कुछ प्रभावशाली लोगों से भी मित्रता कर सकते हैं, जिससे आपको लाभ होगा। अच्छी स्थिति में राहु होने से आपको सरकारी संपर्कों, विदेश यात्राओं and धन की प्रचुरता का लाभ मिलेगा। आपकी बोलने की क्षमता and बातचीत करने की कुशलता असाधारण होगी। हालांकि, यदि राहु पीड़ित हो, तो आप स्वार्थवश अपने मित्रों का दुरुपयोग कर सकते हैं and अपने पिता के साथ अपने संबंधों में तनाव पैदा कर सकते हैं। प्रसिद्ध राजनेता अरविंद केजरीवाल and अमेरिकी राष्ट्रपति अब्राहम लिंकन का जन्म ग्यारहवें भाव में राहु के प्रभाव में हुआ था।",
  12: "बारहवें भाव में राहु आपके करियर को गति देगा and विदेशी संपर्कों के कारण आपकी समृद्धि में वृद्धि करेगा। आपका प्रेम जीवन अच्छा रहेगा, लेकिन छोटी-छोटी बातों पर गलतफहमियों के कारण वैवाहिक जीवन में परेशानी आ सकती है। आप अपनी कमाई से अधिक खर्च करने की प्रवृत्ति भी रख सकते हैं। अच्छी स्थिति में स्थित राहु आपको दान-पुण्य करने and निस्वार्थ बनने के लिए प्रेरित करेगा। हालांकि, यदि राहु पीड़ित है, तो यह अनावश्यक खर्चों को जन्म दे सकता है जिससे आर्थिक समस्याएं उत्पन्न हो सकती हैं। कुछ स्वास्थ्य संबंधी समस्याएं भी आपको परेशान कर सकती हैं।",
};

const KETU_HOUSE_INTERPRETATIONS = {
  1: "प्रथम भाव में केतु होने से आपको एक आकर्षक व्यक्तित्व के साथ-साथ एक रहस्यमय आभा भी मिलती है। यह आपको सामाजिक रूप से बहुत लोकप्रिय बनाता है, लेकिन साथ ही आपको अंतर्मुखी भी बनाए रखता है। आपको रोमांच की ओर झुकाव रहेगा और आप नई-नई गतिविधियों को आजमाना चाहेंगे जो आपको रोमांचित करती हैं। आपका आध्यात्मिक पक्ष प्रबल है जो आपको नैतिकता की भावना प्रदान करता है और आपके चरित्र को मजबूत बनाता है। अच्छी स्थिति में स्थित केतु आपको सत्यवादी और शक्तिशाली बनाता है। आप समाज में प्रसिद्ध हैं और आपकी छवि अच्छी है। हालांकि, यदि केतु पीड़ित है, तो यह आपके जीवनसाथी के लिए स्वास्थ्य संबंधी समस्याएं ला सकता है और आपको लालची और स्वार्थी बना सकता है। आपका साहसिक स्वभाव कभी-कभी आपको खतरे में डाल सकता है। प्रसिद्ध भारतीय समाजसेवी नीता अंबानी और परम पावन दलाई लामा का जन्म प्रथम भाव में केतु के प्रभाव में हुआ था।",
  2: "द्वितीय भाव में केतु आपको गुप्त विद्याओं की ओर आकर्षित करता है और उत्कृष्ट संचार कौशल प्रदान करता है। जब चीजें आपके अनुरूप नहीं होतीं, तो आप कभी-कभी थोड़े कठोर हो सकते हैं। आप अच्छी खासी संपत्ति अर्जित कर सकते हैं और अपने कार्यस्थल पर उच्च पद प्राप्त कर सकते हैं, जिससे आपको बहुत सम्मान मिलेगा। अच्छी स्थिति में स्थित केतु आपको अपने करियर से संबंधित विकास के भरपूर अवसर प्रदान करता है। यह आपके ज्ञान और बुद्धि को भी बढ़ाता है। हालांकि, यदि केतु पीड़ित है, तो यह आपको असभ्य बना सकता है, जिससे समाज में आपकी छवि को नुकसान पहुंच सकता है। आपको परिवार के सदस्यों के साथ भी कुछ समस्याओं का सामना करना पड़ सकता है। प्रसिद्ध ब्रिटिश राजपरिवार की सदस्य लेडी डायना और अभिनेता रजनीकांत का जन्म द्वितीय भाव में केतु के प्रभाव में हुआ था।",
  3: "तीसरे भाव में केतु होने से आप असाधारण रूप से मेहनती, साहसी और साहसिक स्वभाव के बन जाते हैं। आप आध्यात्मिक गतिविधियों में लीन हो सकते हैं जिससे आपको मानसिक शांति मिलेगी और आपको किसी दूसरे धर्म का जीवनसाथी मिल सकता है। अच्छी स्थिति में स्थित केतु आपको अच्छे करियर के अवसर प्रदान करता है जहाँ आप उच्च पद प्राप्त कर सकते हैं। आप मीडिया से संबंधित व्यवसायों की ओर भी आकर्षित होंगे, जो आपके लिए अत्यंत उपयुक्त होंगे। हालांकि, यदि केतु पीड़ित हो तो संतान संबंधी समस्याएं उत्पन्न हो सकती हैं और वैवाहिक जीवन में चुनौतियां आ सकती हैं। प्रसिद्ध नेता किम जोंग उन और अभिनेता रिचर्ड विल्सन का जन्म तीसरे भाव में स्थित केतु के प्रभाव में हुआ था।",
  4: "चौथे भाव में केतु आपको आध्यात्मिकता और पवित्र जीवन शैली की ओर प्रेरित करता है। यह आपको धन, विलासिता और आराम की प्रचुरता भी प्रदान करता है, भले ही आप इसकी लालसा न करें और सादा जीवन जीना पसंद करें। अनुकूल स्थिति में स्थित केतु अप्रत्यायित स्रोतों से अपार लाभ दिला सकता है। यह आपको एक सम्मानजनक सामाजिक छवि भी प्रदान करेगा और आपको अपनी मातृभूमि से जोड़े रखेगा। हालांकि, यदि केतु पीड़ित हो, तो यह आपको कार्य और परिवार से संबंधित अत्यधिक दबाव और तनाव में रख सकता है। यह आपको अपने परिवार से दूर भी कर सकता है। प्रसिद्ध क्रिकेटर राहुल द्रविड़ और राजनेता अमित शाह का जन्म चौथे भाव में केतु के प्रभाव में हुआ था।",
  5: "पंचम भाव में केतु होने से आपका झुकाव दर्शनशास्त्र और गुप्त विद्याओं की ओर होता है। आप धार्मिक गतिविधियों की ओर आकर्षित होंगे, जिससे आपको शांति मिल सकती है। जैसे-जैसे आपकी उम्र बढ़ेगी, आप धीरे-धीरे अपने परिवार से दूर होते जाएंगे। अच्छी स्थिति में स्थित केतु आपको बेहद भाग्यशाली बनाता है और निवेश से लाभ दिलाता है। यह आपको शत्रुओं से बचाता है और आध्यात्मिकता की ओर प्रेरित करता है। हालांकि, यदि केतु पीड़ित हो, तो यह आपको अपने परिवार और मित्रों से दूर कर सकता है। यह आपको बहुत साहसी बना सकता है, जो जोखिम भरा हो सकता है। आपको संतान प्राप्ति से संबंधित समस्याओं का भी सामना करना पड़ सकता है। प्रसिद्ध अभिनेत्री कैटरीना कैफ और गुरु बाबा रामदेव का जन्म पांचवें भाव में केतु के प्रभाव में हुआ था।",
  6: "छठे भाव में केतु आपको अत्यधिक प्रेरक और प्रेरक बनाएगा। यह आपको मानसिक और शारीरिक रूप से मजबूत बनाएगा और आपके शत्रुओं का आसानी से सामना करने में मदद करेगा। हालांकि, यह आपको ऐसी बीमारियों से ग्रसित कर सकता है जो कष्टदायी हो सकती हैं। अनुकूल स्थिति में स्थित केतु आपको आध्यात्मिक ज्ञान प्रदान कर सकता है जो आपके संवाद में स्पष्ट रूप से दिखाई देगा। हालांकि, यदि केतु पीड़ित है, तो आप कार्यस्थल पर चोटों और दुर्घटनाओं के शिकार हो सकते हैं। आपकी आक्रामकता और क्रोध चिंता का विषय हो सकते हैं और आपको कठिन परिस्थितियों में डाल सकते हैं। प्रसिद्ध भौतिक विज्ञानी सर आइजैक न्यूटन और अभिनेत्री मर्लिन मोनरो का जन्म छठे भाव में केतु के प्रभाव में हुआ था।",
  7: "सातवें भाव में केतु होने से आपको आध्यात्मिक झुकाव मिलता है और आपका जीवन बदल जाता है। आपको धन-दौलत की अच्छी-खासी समृद्धि प्राप्त हो सकती है और आप आनंदमय और सुखमय जीवन जी सकते हैं। अच्छी स्थिति में स्थित केतु आपको सुखमय जीवन प्रदान करता है।",
  8: "आठवें भाव में केतु आपको गुप्त विद्याओं और शोध की ओर ले जाता है। यह आपको रहस्यमय विषयों में गहरी रुचि प्रदान करता है।",
  9: "नौवें भाव में केतु धार्मिक और आध्यात्मिक यात्राओं में रुचि जगाता है। यह आपको उच्च ज्ञान की प्राप्ति के लिए प्रेरित करता है।",
  10: "दसवें भाव में केतु करियर में उतार-चढ़ाव ला सकता है लेकिन अंततः आध्यात्मिक सफलता और मानसिक शांति देता है।",
  11: "ग्यारहवें भाव में केतु अचानक लाभ और आध्यात्मिक मित्रों से सहयोग दिलाता है। यह आपकी इच्छाओं की पूर्ति में सहायक होता है।",
  12: "बारहवें भाव में केतु मोक्ष और आध्यात्मिक जागृति के लिए उत्तम माना जाता है। यह आपको सांसारिक बंधनों से मुक्त करने में सहायक है।"
};

const SATURN_HOUSE_INTERPRETATIONS = {
  1: "प्रथम भाव में शनि होने से आप कम उम्र में ही अनुशासित और परिपक्व हो जाते हैं। आप जिम्मेदार और भरोसेमंद होंगे। निष्पक्ष निर्णय लेने के कारण आप एक सफल वकील या न्यायाधीश बन सकते हैं। आपका विवाह विलंबित होगा, लेकिन आपका जीवनसाथी बुद्धिमान और वफादार होगा। अनुकूल स्थिति में स्थित शनि आपको व्यावहारिक और तार्किक दृष्टिकोण प्रदान करेगा और आपको अपने माता-पिता के प्रति कर्तव्यनिष्ठ बनाएगा। आप दृढ़ निश्चयी और विश्वसनीय होंगे, साथ ही आपका मन और शरीर भी मजबूत होगा। हालांकि, यदि शनि पीड़ित हो, तो यह आपको आलसी और निराश बना सकता है। आपके वैवाहिक जीवन में भी कलह उत्पन्न हो सकती है। प्रसिद्ध गायिका ब्रिटनी स्पीयर्स और सम्राट अकबर का जन्म प्रथम भाव में शनि के प्रभाव में हुआ था।",
  2: "द्वितीय भाव में शनि 35 वर्ष की आयु के बाद ही आपकी आर्थिक स्थिति में सहायक होता है। यह बचपन में संघर्षों के कारण आपके पोषण को भी सीमित कर सकता है। आप जीवन में उतार-चढ़ाव दोनों देखेंगे, जो आपको बुद्धिमान और व्यावहारिक बनाएगा। अनुकूल स्थिति में स्थित शनि आपको महत्वाकांक्षी और मेहनती बनाता है और आर्थिक मामलों में जल्दबाजी में निर्णय लेने से रोकता है। हालांकि, यदि शनि पीड़ित है, तो यह आपको माता-पिता के प्यार से वंचित कर सकता है क्योंकि वे बहुत सख्त होंगे। यह आपको पेशेवर मोर्चे पर भी बहुत संघर्षों के कारण क्रोधित और निराश कर सकता है। प्रसिद्ध अभिनेता रजनीकांत और व्यवसायी मुकेश अंबानी का जन्म द्वितीय भाव में शनि के प्रभाव में हुआ था।",
  3: "तीसरे भाव में शनि होने से भाई-बहनों के साथ आपके संबंध सुखद और दुखद दोनों हो सकते हैं और एक चीज़ पर ध्यान केंद्रित करना मुश्किल हो सकता है। शनि की यह स्थिति आपको शर्मीला और अंतर्मुखी बनाती है। यह आपके प्रेम संबंधों को भी सीमित कर सकती है, इसीलिए आप अरेंज मैरिज को चुनेंगे। अच्छी स्थिति में स्थित शनि आपको पेशेवर रवैया देगा और आपको शांत और संयमित बनाएगा। आप जल्दबाजी में निर्णय नहीं लेंगे और अच्छे श्रोता भी बनेंगे। हालांकि, यदि शनि पीड़ित है, तो आप नकारात्मक विचारों से घिरे रहेंगे और अनावश्यक भय का शिकार होंगे। यह आपको निराशावादी रवैया भी दे सकता है। प्रसिद्ध व्यवसायी स्टीव जॉब्स और अभिनेता ब्रैड पिट का जन्म तीसरे भाव में शनि के प्रभाव में हुआ था।",
  4: "चौथे भाव में शनि होने से आपकी माताजी सख्त और अनुशासनप्रिय होंगी; हालांकि, इससे आपको अच्छी शिक्षा मिलेगी और आप रियल एस्टेट बिल्डर, वकील, जज या उद्योगपति बन सकते हैं। अच्छी स्थिति में स्थित शनि से अप्रत्याशित लाभ होगा और आप परिपक्व और जिम्मेदार बनेंगे। आप परिस्थितियों का धैर्यपूर्वक और चतुराई से सामना करेंगे और परिवार के साथ आपके अच्छे संबंध होंगे। हालांकि, यदि शनि पीड़ित है, तो यह आपको स्वार्थी और अवसादग्रस्त बना देगा। आपको अपने कर्ज चुकाने के लिए अपना घर बेचना पड़ सकता है। यह आपको अपने जीवनसाथी से अलग भी कर सकता है। प्रसिद्ध अभिनेता टॉम क्रूज़ और राजनीतिज्ञ बराक ओबामा चौथे भाव में स्थित शनि के प्रभाव में पैदा हुए हैं।",
  5: "पांचवें भाव में शनि होने से आपको बचपन से ही अनुशासन और परिपक्वता मिलती है। आप सतही बातों में रुचि नहीं लेंगे और बड़ों के साथ सार्थक चर्चा करना पसंद करेंगे। अच्छी स्थिति में स्थित शनि आपको पेशेवर और निजी जीवन के बीच संतुलन का महत्व सिखाएगा और आपको दानशील बनाएगा। हालांकि, यदि शनि पीड़ित हो, तो यह आपको उदास और असामाजिक बना सकता है। आप कठोर स्वभाव के हो जाएंगे, जिससे जीवन में आपकी प्रगति बाधित हो सकती है। आपको अवसाद या चिंता जैसी मनोवैज्ञानिक समस्याओं का भी सामना करना पड़ सकता है। प्रसिद्ध व्यवसायी बिल गेट्स और राजनीतिज्ञ विंस्टन चर्चिल का जन्म पांचवें भाव में शनि के प्रभाव में हुआ था।",
  6: "छठे भाव में शनि आपको मेहनती और संघर्ष सुलझाने के लिए दृढ़ निश्चयी बनाता है। आप एक सफल समाजसेवी, परामर्शदाता, मनोवैज्ञानिक, चिकित्सक, वकील या न्यायाधीश बनेंगे। यह आपकी सफलता को धीमा कर सकता है और आपको विदेश में बसने में मदद कर सकता है। आप अपने शत्रुओं को आसानी से परास्त कर सकेंगे। अनुकूल स्थिति में शनि आपको उत्कृष्ट प्रबंधन कौशल और कुशल कर्मचारी प्रदान करेगा। आप दूसरों को काम सौंपना जानते होंगे और लोग आपके आदेशों का पालन करेंगे। हालांकि, यदि शनि पीड़ित है, तो यह पीठ में लगातार दर्द और यौन जीवन में गड़बड़ी का कारण बन सकता है। आपकी वाणी कठोर और असभ्य हो जाएगी। प्रसिद्ध भौतिक विज्ञानी आइजैक न्यूटन और अभिनेत्री दीपिका पादुकोण का जन्म छठे भाव में स्थित शनि के प्रभाव में हुआ था।",
  7: "शनि सातवें भाव में विवाह में देरी का कारण बनता है और यदि आप जल्दी विवाह कर लेते हैं, तो वैवाहिक जीवन में कुछ बाधाओं का सामना करना पड़ सकता है। आपका विवाह एक परिपक्व और अधिक उम्र के व्यक्ति से होगा जो धैर्यवान, जिम्मेदार और मेहनती होगा। आपका अपने जीवनसाथी के साथ एक प्रतिबद्ध और संतुलित संबंध होगा, जो स्वभाव में बिल्कुल विपरीत हो सकता है। यदि शनि अच्छी स्थिति में है, तो आप अपने जीवनसाथी के प्रति समर्पित रहेंगे और एक नियमित दिनचर्या के साथ अनुशासित जीवन शैली अपनाएंगे। इससे आप काम के प्रति समर्पित भी हो जाएंगे। हालांकि, यदि शनि पीड़ित है, तो वैवाहिक जीवन में गलतफहमियां होंगी और आप लगातार अपने जीवनसाथी की आलोचना करते रहेंगे। यह स्थिति आपको आलसी भी बना सकती है और आपको पेट और जोड़ों से संबंधित बीमारियां हो सकती हैं। प्रसिद्ध अभिनेता जॉनी डेप और शाहरुख खान का जन्म सातवें भाव में स्थित शनि के प्रभाव में हुआ था।",
  8: "आठवें भाव में शनि होने से आपके जीवन के विभिन्न चरणों में पूर्ण परिवर्तन आएगा, जो आवश्यक है। अतीत के आघातों से उबरने के दौरान आपके विश्वास की परीक्षा होगी। आप एक सफल चिकित्सक, फार्मासिस्ट बन सकते हैं या राजनीति में प्रवेश कर सकते हैं। आपके ससुराल वालों के साथ आपके संबंध सीमित हो सकते हैं। यदि शनि अच्छी स्थिति में है, तो आपको पारिवारिक विरासत प्राप्त होने का सौभाग्य प्राप्त होगा। आप एक उत्कृष्ट शोधकर्ता भी बनेंगे और अप्रत्याशित लाभ प्राप्त करेंगे। आपके ससुराल वालों के साथ आपके संबंध अच्छे रहेंगे। हालांकि, यदि शनि पीड़ित है, तो आप अपने करियर से निराश होंगे और अस्थिरता का सामना करेंगे। आपका जीवनसाथी आपको धोखा दे सकता है और आपका पारिवारिक जीवन अस्त-व्यस्त हो सकता है। आपके ससुराल वालों के साथ आपके संबंधों पर भी इसका बुरा प्रभाव पड़ेगा। प्रसिद्ध अभिनेता क्रिस्टन स्टीवर्ट और रॉबर्ट डाउनी जूनियर का जन्म आठवें भाव में शनि के प्रभाव में हुआ था।",
  9: "नौवें भाव में शनि आपको दार्शनिक और धार्मिक बनाएगा। आप पेशेवर और व्यक्तिगत रूप से विकास करने के लिए दृढ़ संकल्पित हैं। आप अपनी उच्च शिक्षा और धार्मिक मान्यताओं पर ध्यान केंद्रित करते हैं। यह स्थिति आपको पीएचडी प्राप्त करने और एक सफल वकील या डॉक्टर बनने में मदद कर सकती है, क्योंकि आपमें लंबे समय तक अध्ययन करने की क्षमता और धैर्य है। अच्छी स्थिति में स्थित शनि आपको अपने जीवनसाथी के प्रति वफादार और स्नेही बनाएगा और आपको प्रचुर धन-संपत्ति दिलाएगा। हालांकि, यदि शनि पीड़ित है, तो आप अनुकूलनीय नहीं होंगे और आपके भाई-बहनों के साथ संबंध खराब हो सकते हैं। प्रसिद्ध अभिनेत्री जूलिया रॉबर्ट्स और गायिका रिहाना का जन्म शनि के नौवें भाव में प्रभाव के तहत हुआ था।",
  10: "दसवें भाव में शनि आपको कड़ी मेहनत के बल पर लक्ष्य प्राप्त करने में मदद करेगा और कार्यस्थल पर आपको अधिकार और मान्यता दिलाएगा। यह आपको प्रभावशाली बनाएगा और आप ऐसे नियम बनाएंगे जिनका पालन दूसरे करेंगे। अनुकूल स्थिति में शनि आपको सकारात्मकता, धैर्य और निरंतर विकास प्रदान करेगा। 35 वर्ष की आयु के बाद आप बहुत अनुशासित हो जाएंगे और आपका पारिवारिक जीवन सुखमय होगा। हालांकि, यदि शनि पीड़ित है, तो आप सरकार को धोखा देने का प्रयास कर सकते हैं और आपराधिक गतिविधियों में शामिल हो सकते हैं। आप अपने जीवनसाथी में रुचि खो देंगे और आपका यौन जीवन नीरस हो जाएगा। प्रसिद्ध अभिनेता लियोनार्डो डिकैप्रियो और मुक्केबाज मुहम्मद अली का जन्म दसवें भाव में स्थित शनि के प्रभाव में हुआ था।",
  11: "ग्यारहवें भाव में शनि होने से आपका सामाजिक दायरा परिपक्व लोगों से भरा होगा। कड़ी मेहनत करने पर आपकी सभी इच्छाएँ पूरी होंगी। आपमें कुशल व्यक्तियों को प्रभावित करने की क्षमता भी हो सकती है और आप एक सफल राजनेता या व्यवसायी बन सकते हैं। अच्छी स्थिति में स्थित शनि आपको सशक्त व्यक्तित्व और अपार धन-संपत्ति एवं सम्मान प्रदान करता है। यह आपके परिवार के सदस्यों के साथ सौहार्दपूर्ण संबंध भी सुनिश्चित करता है। हालांकि, यदि शनि पीड़ित हो, तो आप गलत प्रकार के मित्रों के साथ फंस सकते हैं और अवैध तरीकों से धन कमा सकते हैं। आपको हड्डियों या जोड़ों से संबंधित समस्याओं का भी सामना करना पड़ सकता है। मशहूर सोशलाइट किम कार्दशियन और अभिनेता अनिल कपूर का जन्म ग्यारहवें भाव में स्थित शनि के प्रभाव में हुआ है।",
  12: "बारहवें भाव में शनि होने से मन की शांति भंग होती है और आध्यात्मिक खोज की प्रेरणा मिलती है। यह आपको विदेश यात्रा करने और जरूरतमंदों की सहायता करने के लिए प्रेरित करेगा। इससे आपको विदेश से आर्थिक लाभ भी प्राप्त हो सकता है। आपके परिवार के सदस्यों के साथ आपके घनिष्ठ संबंध रहेंगे। अनुकूल स्थिति में स्थित शनि आपको जीवनसाथी का सहयोग और सामंजस्यपूर्ण जीवन प्रदान करेगा। आपकी सफलता में विलंब हो सकता है, लेकिन आप अपने इच्छित लक्ष्य प्राप्त कर लेंगे। हालांकि, यदि शनि पीड़ित है, तो आप स्थायी संबंध स्थापित नहीं कर पाएंगे। आपको चिंता और अवसाद जैसी मनोवैज्ञानिक समस्याएं भी हो सकती हैं।",
};

const CELL_CONTENTS = [
  { id: "lagna", label: "Lagna - Main", category: "Charts" },
  { id: "d1", label: "D1 - Rashi Chart", category: "Charts" },
  { id: "d2", label: "D2 - Hora Chart", category: "Charts" },
  { id: "d3", label: "D3 - Drekkana Chart", category: "Charts" },
  { id: "d4", label: "D4 - Chaturthamsha", category: "Charts" },
  { id: "d7", label: "D7 - Saptamsha Chart", category: "Charts" },
  { id: "d9", label: "D9 - Navamsha Chart", category: "Charts" },
  { id: "d10", label: "D10 - Dashamsha Chart", category: "Charts" },
  { id: "d12", label: "D12 - Dwadashamsha", category: "Charts" },
  { id: "d16", label: "D16 - Shodashamsha", category: "Charts" },
  { id: "d24", label: "D24 - Chaturvimshamsha", category: "Charts" },
  { id: "d30", label: "D30 - Trimshamsha", category: "Charts" },
  { id: "d60", label: "D60 - Shashtiamsha", category: "Charts" },
  { id: "transit_compare", label: "Transit Compare", category: "Charts" },
  { id: "planets_table", label: "Pl-Tables", category: "Tables" },
  { id: "panchang", label: "Panchang", category: "Tables" },
  { id: "dignity", label: "Dignity", category: "Tables" },
  { id: "vimshottari", label: "Vimshottari", category: "Dasha" },
  { id: "shodashottari", label: "Shodashottari", category: "Dasha" },
  { id: "chaturshitisama", label: "Chaturshitisama", category: "Dasha" },
  { id: "numerical", label: "Numerology", category: "Misc" },
  { id: "shadbala", label: "Shadbala Chart", category: "Charts" },
  { id: "gemstones", label: "Ratna", category: "Misc" },
  { id: "transit_gemstones", label: "Gochar Ratna", category: "Misc" },
  { id: "transit", label: "Today-Gochar", category: "Charts" },
  { id: "current_positions", label: "Current Planet Position", category: "Charts" },
  { id: "vimsopaka", label: "Vimsopaka Bala", category: "Tables" },
  { id: "empty", label: "Empty Cell", category: "System" }
];


const calculatePlanetEffects = (data) => {
  const strengths = data?.strength?.planets || {};
  const effects = {};
  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  planets.forEach(p => {
    const s = strengths[p];
    if (s) {
      const ishta = s.ishta_phala || 0;
      const kashta = s.kashta_phala || 0;
      if (ishta > kashta + 3) {
        effects[p] = "positive";
      } else if (kashta > ishta + 3) {
        effects[p] = "negative";
      } else {
        effects[p] = "neutral";
      }
    } else {
      const malefics = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"];
      effects[p] = malefics.includes(p) ? "negative" : "positive";
    }
  });
  effects["Ascendant"] = "neutral";
  return effects;
};

const NAVAMSA_INTRO = `Marriage can be the most essential part of ones life where there can be the most rewarding or sometimes challenging scenario. Whether you are dealing with marital issues or want to know your life’s changes after marriage, then Navamsa or D9 Chart is your one stop solution. In Vedic astrology, Navamsa chart gets deep into relationship ology and gives you clarity over how you should approach your marriage and want changes you will experience after marriage.

  D - 9 or Navamsa chart reveals strengths, karmic patterns and potential challenges that may not be visible in the birth chart or horoscope individually.This chart plays a crucial role in shaping your relationship, navigating challenges, and compatibility and personal growth through marriage.

This chart is basically used for relationship and marriage analysis, but it also gives an insight into career, fortune, professional life, and spiritual progress.Through this chart you can also come to know about your karma and past life connections.Each planet in Navamsa chart reveals your partner, and how you will experience your marriage and relationship on career front.`;

const NAVAMSA_PLANET_DESCRIPTIONS = {
  Sun: {
    title: "Sun in Navamsa Chart",
    description: "Sun is a source of courage and strength and plays a vital role in maintaining your physical and mental health. It has an utmost good status as it shapes one’s wealth, life, and learning abilities. The status of Sun in Navamsa/D-9 chart gives you clarity over the strength of love with your spouse or partner. Strong Sun in D9 will give you courage to deal with challenges on relationship front and live a happy and successful life. The placement of the Sun in different houses shapes your career and relationship, based on its strengths and weakness.",
    icon: "☀️",
    color: "orange"
  },
  Moon: {
    title: "Moon in Navamsa Chart",
    description: "Moon leads emotional sensitivity and psyche of an individual. When Moon is placed in Navamsa chart it clears your perspective of finding hope, love, and loyalty. Moon has a leading role in biological forces, which is also called Dosha in Ayurveda, and deals with our health. Moon controls the Kapha Dosha among the three biological forces/Dosha- Vata, Pitta, and Kapha. It gives the ability to maintain strong emotional health and makes you expressive in sharing your feelings. When the Moon is afflicted, it will cause health issues whereas a well-placed Moon in Navamsa/D9 Chart gives a stable mindset and a clear vision that leads towards success and growth. It has various effects on your life depending on its placement in different houses.",
    icon: "🌙",
    color: "blue"
  },
  Mars: {
    title: "Mars in Navamsa Chart",
    description: "Mars rules competitiveness, confidence, effort, determination, flirty, romantic, security and a technical mindset. Mars in D9 chart ensures that you will find your ambition in life and feel motivated to do well on a personal and professional front. Strong Mars in Navamsa/D9 chart makes you capable of creating new and innovative ideas, and Master of Science and engineering work with a clear vision, leading towards success and growth. An afflicted Mars causes aggressiveness and creates challenges in your relationship. There are various effects and influences of Mars on you based on its placement in different houses in Navamsa chart.",
    icon: "🔴",
    color: "red"
  },
  Mercury: {
    title: "Mercury in Navamsa Chart",
    description: "Mercury makes you curious, analytical, friendly and talkative and when it is placed in Navamsa Chart, it will give you a personality that matches with your maternal family. Mercury has a crucial role in shaping your relationship and has a good command over your sense of humor. Mercury’s placement in divisional chart Navamsa clears your perspective to present yourself, building a good relationship on personal and professional front, and what should be your next move while dealing with tough situations. Afflicted Mercury in Navamsa chart causes major health issues like constipation, gas, and abdominal distension.",
    icon: "🟢",
    color: "emerald"
  },
  Jupiter: {
    title: "Jupiter in Navamsa Chart",
    description: "The placement of Jupiter in Navamsa Chart introduces you to a spouse who will help you make wise decisions, in gaining wealth. Your spouse will be supportive, and always give you hope in your low time. When Jupiter is afflicted or is low in strength, it will cause health issues like diabetes, edema, phlegm, or asthma as it plays a crucial role in biological forces, known as Dosha in Ayurveda. Strong Jupiter in D9 Chart will give you courage to deal with relationship challenges and make wise investment plans. The placement of Jupiter in different houses will influence your life in various ways.",
    icon: "🟡",
    color: "amber"
  },
  Venus: {
    title: "Venus in Navamsa Chart",
    description: "Venus’s placement in Navamsa chart ensures that you will get suggestions and tips over your love, finance, marriage, and happiness. Venus makes you caring and emotional due to feminine energy and it will help you protect your married life by implementing and putting in creative efforts. Venus will bless you with a spouse with attractive eyes, charismatic look, and an attractive personality when it is well-placed. Afflicted Venus in D9 chart will cause health concerns like weak eyesight, dull skin, and detachment from sexual activity in married life. There are various effects and influences of Venus on a person’s life, depending on its placement in different houses.",
    icon: "💖",
    color: "pink"
  },
  Saturn: {
    title: "Saturn in Navamsa Chart",
    description: "Saturn indicates long-term commitment, compromise and a realistic approach to one’s relationship and other aspects of life. Saturn in D9 chart will give you a supportive spouse for your career. It will also bless you with inheritance gains after marriage. Strong Saturn will make you patient, approachable, and saves you from chronic health concerns. On the opposite side, an afflicted Saturn in the D9 chart will cause health issues like acidity, constipation and abdominal distension. Apart from this, there are some ups and downs Saturn creates when it is placed in different houses in Navamsa chart.",
    icon: "⏳",
    color: "slate"
  },
  Rahu: {
    title: "Rahu in Navamsa Chart",
    description: "The combination of Rahu and Navamsa chart rewards you with fulfillment of desires, and manifest dreams and imagination of your spouse. Rahu will make you wealthy after marriage and it will also reveal the honesty and commitment of your partner in the relationship. Rahu affliction in D9 chart will cause health concerns and create diseases that may not be easily diagnosed, and inherited health problems. In addition, Ketu influences your life based on its placement in 12 different houses in D9 chart.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Navamsa Chart",
    description: "Ketu will give you a personality and is expert in observing the surroundings with a strong sense of intuition. It will make you capable of making correct decisions at the right time. Ketu in Navamsa will make you expert in guessing the right thing, good at research field, and quick to make decisions. There will be a lot of challenges and issues due to the placement of Ketu which will make you detached, unable to express your feelings to others, and which will be a reason of challenge in married life or relationship. There might be some health concerns due to the afflicted Ketu in Navamsa chart like sensitivity to cold, acidity, and dryness to skin. Ketu’s placement in different houses will have various impacts and influences on an individual’s life.",
    icon: "💥",
    color: "orange"
  }
};

const DASHAMSHA_INTRO = `The D-10 (Dashamsha) chart, a division of the 10th house, is primarily analyzed to determine career path, success, and professional reputation. To read it, verify the 10th lord and Lagna (Ascendant) strength in D-10.

Dasamsa Chart, also known as D-10 chart is a mixture of two words- Dasham and Amsa, stands for the tenth division of the Rashi Chart. Whether it is about career opportunities, seeking a suitable profession or guidance on professional challenges, D10 chart provides you with accurate and precise information, guiding you towards a fulfilling and successful career.

Analysis of D10 chart with the birth chart can give you a thorough understanding of one’s career path. This chart will help you make informed decisions about your career and navigate your professional life with great clarity. The reading of D10 Chart is important as it reveals the chances of job and the amount of achievement one is expecting in their life.`;

const DASHAMSHA_PLANET_DESCRIPTIONS = {
  Sun: {
    title: "Sun in Dasamsa Chart",
    description: "Sun will guide you in the right direction to get a successful career through your honest efforts and hard work. You will get courage and intelligence to work on your desired projects with the placement of Sun in D10 chart. You will be rewarded with great financial return and implement new ways to achieve success in your career. Sun in Dasamsa gives you status and recognition at work and guides you in the best direction to achieve it in your life. Sun will give you decision-making ability and make you able to take the right decision at the right time. The placement of Sun in different houses will decide your career path, challenges and success.",
    icon: "☀️",
    color: "orange"
  },
  Moon: {
    title: "Moon in Dasamsa Chart",
    description: "The Moon represents the root of your birth and its position in different houses gives an insight into where your life force and rejuvenation will begin. Moon gives you the intelligence and wisdom to implement new things and ideas, helping in your career growth. The Moon in D10 chart holds a crucial role in shaping your career and make you able to take the right decision at the right time. This position will ensure that you will get good productivity at the workplace through your hard work and efforts.",
    icon: "🌙",
    color: "blue"
  },
  Mars: {
    title: "Mars in Dasamsa Chart",
    description: "With Mars, you will be able to deal with every situation using your strong intellectual ability and wisdom. It is not only about your physical fitness, but it also suggests mental fineness with proper training and challenges. Mars in Dasamsa forces you to learn new skills to strengthen your mind and achieve success in career and personal life. Well-placed Mars in D10 Chart will give you strength to take new initiative in your life and keep you protected from challenges on the career front. Whereas when Mars is afflicted, it will create chaos due to your hasty decisions.",
    icon: "🔴",
    color: "red"
  },
  Mercury: {
    title: "Mercury in Dasamsa Chart",
    description: "Mercury will give you intelligence and courage to deal with challenges. It also rewards you with a focused approach to get good financial standing. When Mercury is placed in D10 chart, it makes you capable of working in the right way to enhance your skills and make new connections to gain name and fame. You will take a new initiative and work with a large team, thanks to the blessings of Mercury in D10 chart. You will get clarity over the areas and sectors to do well on the career front. Afflicted Mercury in Dasamsa will cause obstacles in making new connections on the professional front. You may lack support to make the right decision at the right time.",
    icon: "🟢",
    color: "emerald"
  },
  Jupiter: {
    title: "Jupiter in Dasamsa Chart",
    description: "Jupiter is known for growth, positivity, expansion, support, and hope. When it is placed in Dasamsa, it will reward you with career growth, business expansion and support from colleagues and partners. Jupiter in Dasamsa will give you the right suggestions, support and guidance from elders. Strong Jupiter in D10 chart will give you a supportive boss and with the blessings of father and grandparents, you will do well on the professional front. Afflicted Jupiter will force you to make wrong decisions in haste and make you clueless to find any solution when needed.",
    icon: "🟡",
    color: "amber"
  },
  Venus: {
    title: "Venus in Dasamsa Chart",
    description: "Venus rules status, luxury, power, status, and leading a team. Venus helps you find solutions, and hope in the difficult situation where there is no hope when it is well-placed in the D10 chart. You will lead a team in a unique way and gain a name and fame in the workplace. Venus in Dasamsa makes you able to connect the dots to bring creative ideas and make you courageous to execute the tasks. You will overcome all your negative traits with a disciplined approach as it will encourage you to work with multiple vertices. It gives you good control over your desires and brings a focused approach and eye for details to get the desired results despite challenges.",
    icon: "💖",
    color: "pink"
  },
  Saturn: {
    title: "Saturn in Dasamsa Chart",
    description: "Saturn refers to work, duty, profession, labor, business, and employment. When Saturn is well placed in Dasamsa chart, you will get reputation, respect, power, administrative, and a good rank on the career front. Saturn holds a significant role in shaping your career despite challenges and delays. Saturn in D10 Chart gives you a new source of income as your career sees new progress. You will feel motivated to move ahead with honest effort. You will meet an experienced and mature person who will guide you to make the right decision with a practical approach.",
    icon: "⏳",
    color: "slate"
  },
  Rahu: {
    title: "Rahu in Dasamsa Chart",
    description: "Rahu gives you the desire to lead a team on the professional front and achieve a higher post at your workplace. This will help you create new ideas and introduce you to new people and contacts, helping in your career. Rahu will force you to think out of the box to deal with financial and career challenges when it is placed in the Dasamsa. Rahu in D10 chart makes you ambitious and dedicated towards your career so that you can achieve the higher rank, but when it is afflicted, it will create obstacles which will demand honest effort and hard work to achieve your goal.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Dasamsa Chart",
    description: "Ketu in D10 Chart gives you a creative approach to make right decisions on the career front. There will be some obstacles and challenges in your career due to a lazy approach. Well-placed Ketu will help you achieve success and goal with maturity. Ketu in Dasamsa makes you expert by learning from the past life experiences, helping you in expected growth and success on the professional front.",
    icon: "💥",
    color: "orange"
  }
};

const HORA_INTRO = `D2, also known as Hora Chart, provides clarity on financial matters, financial gains, property gains, and investment returns. It is used to analyze wealth strategies through concepts like Dhan Yoga, Indu Lagna (for wealth), and Shree Lagna (for assets, luxury, and happiness). This chart helps in deciding the timing of investments and defining how earnings are converted into assets.

In Vedic Astrology, the Hora chart is designed by dividing the zodiac into two parts. It primarily features three key houses:
- 1st House: Represents self-awareness regarding finances.
- 2nd House: Represents savings and accumulated wealth.
- 12th House: Indicates losses or long-term investments.

The Hora chart clarifies whether your income will rise, if you will achieve expected growth in investments, and whether you will enjoy inherited wealth or face financial challenges. Each planet linked with the D2 chart indicates a specific influence on your financial status.`;

const HORA_PLANET_DESCRIPTIONS = {
  Sun: {
    title: "Sun in D2 Hora Chart",
    description: "Sun in Hora Chart gives you financial benefits through a disciplined approach towards savings. Clarity over investment plans will give you expected outcomes. Sun makes you capable of managing your finances with a persistent approach. You will get major shifts in your finances and achieve financial status through your skills. Sun helps you overcome financial burden and make wise investment in property and government bonds. There will be financial gains in foreign shores, legal or medical work. You will have good gain from heritage properties, but make sure to manage your expenses.",
    icon: "☀️",
    color: "orange"
  },
  Moon: {
    title: "Moon in D2 Hora Chart",
    description: "Moon will give you an emotional bent towards your finances. You will earn money from government sectors and gain strength to manage your finances. By implementing creative and innovative ideas, you will make good wealth. You will get courage to overcome financial challenges and earn from jewels, medicine and food related areas. Moon in D2 chart will give you strength to make savings, expenses and investments in the right assets. Your powerful sense of intuition will help you make wise investments, boosting your finances.",
    icon: "🌙",
    color: "blue"
  },
  Mars: {
    title: "Mars in D2 Hora Chart",
    description: "Mars will give you inheritance benefits and make you motivated to earn from your hard work and efforts. Strong Mars in D2 chart will clear your perspective to take the right decisions. You will make a strong foundation for your wealth and gain strength for property investments. Mars in Hora Chart will give insight into making the right investment. Mars in D2 Chart will bless you with support and guidance from mother to make the right investment at the right time. It will reward you with financial gain far from your present place. Mars will give you benefits from maternal property and financial support from maternal family. It will give you a powerful sense of intuition to grab the right opportunity to overcome financial challenges.",
    icon: "🔴",
    color: "red"
  },
  Mercury: {
    title: "Mercury in D2 Hora Chart",
    description: "You will make the right decisions on the professional front through the available information, knowledge, and references. Mercury will bless you with good knowledge and strategies that will help you attract good wealth, and your great communication skills will give you good friends and siblings who will help you in making the right investments. You will be more attentive towards minimizing your expenses and focus on savings. Mercury in Hora Chart/D2 Chart will give you a broader perspective of wealth and money management. However, afflicted Mercury in D2 chart, will create obstacles in building your assets and accumulating wealth. Whereas strong Mercury will bring you success in career, wealth, and business.",
    icon: "🟢",
    color: "emerald"
  },
  Jupiter: {
    title: "Jupiter in D2 Hora Chart",
    description: "Jupiter makes you optimistic towards your finances, helping in building assets and a good financial standing. It will give you clarity in your opinions that will aid you in executing your plans even in worse circumstances. Jupiter in Hora Chart boosts your wealth and gives you financial growth. You can deal with challenges and financial risks and overcome the worse scenario with your courage and wisdom. Jupiter in D2 gives you the perspective to make a wise investment plan in long-term assets. Share market with securities and bonds related investments will give you expected return, boosting your income.",
    icon: "🟡",
    color: "amber"
  },
  Venus: {
    title: "Venus in D2 Hora Chart",
    description: "Through an active approach towards your finances, you will gain a good income and wealth. You will make wise decisions in partnership investment and create new sources of income. With Venus in D2 Chart, there will be good success on the professional front, related to cosmetics, food business, creativity, arts and crafts, and it will reward you with good income. Afflicted Venus will create challenges on relationship front and ego clashes with family, which will lead to financial crisis. However, Strong Venus will clear your perspective to look at the issue from a different angle and work upon it for a quick resolution. It will also bring support from elders, seniors or grandparents, helping you achieve financial stability in your life.",
    icon: "💖",
    color: "pink"
  },
  Saturn: {
    title: "Saturn in D2 Hora Chart",
    description: "Saturn will give you the support of elders or seniors in the family and on the professional front. In D2 Chart, the placement of Saturn will make you disciplined in financial matters with a priority-based plan, relieving you from loan and debt. Saturn will also reward you with inheritance gain and gain from gold and property. Saturn in D2 Chart gives insight into financial challenges, like loss, loan or debt. This will bless you with maturity, patience, and a broader perspective to stabilize your finances and wealth. You will achieve success and gains in career related to NGO, Job, Yoga, religious work or meditation center.",
    icon: "⏳",
    color: "slate"
  },
  Rahu: {
    title: "Rahu in D2 Hora Chart",
    description: "Your ambition and disciplined approach towards financial management will reward you with savings and gaining of wealth as per the placement of Rahu in D2/Hora Chart. Strong Rahu in Hora chart will make you courageous to deal with the worse situation on the financial front and achieve success in it. You will see a sudden rise in your income that will boost your finances. Through creative ideas, blessed with Rahu, you will get expected success and growth. You will have a good sense of humor which will give you achievement on the professional front. This position will make you inclined towards religion and have a good command over multiple language.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in D2 Hora Chart",
    description: "Ketu will give you financial gain and make you wealthy in the second phase of your life. In the first phase, it will create ups and downs and make you mature while dealing with such situations. You will have the power and authority to lead the family, team, career, and business due to the placement of Ketu in D2 Chart. Your powerful sense of intuition will bless you with good financial gains with the right decisions. Through the guidance of your elders and family, you will manage your financial responsibilities in an effective way and will refrain from spending on a luxurious lifestyle.",
    icon: "💥",
    color: "orange"
  }
};

const D4_INTRO = `The D4 (Chaturthamsa) chart is the primary divisional chart for analyzing immovable property, residences, land, and overall happiness (Sukha). It reveals your property karma, potential for real estate success, and the emotional security derived from your home environment.

According to classical texts like Brihat Parashara Hora Shastra, while the birth chart (D1) shows the general potential for owning property, the D4 chart provides the granular detail regarding the quality, timing, and source of these assets. 

Key Houses in D4:
- 1st House: Your inherent approach to property and general fortune in real estate.
- 4th House: The primary indicator of residence, connection to land, and happiness from assets.
- 7th House: Property through partnerships, marriage, or joint business associations.
- 10th House: Commercial real estate, professional properties, and career-related assets.
- 11th House: Financial gains, rental income, and accumulation through real estate activity.`;

const D4_PLANET_DESCRIPTIONS = {
  Sun: {
    title: "Sun in Chaturthamsa (D4)",
    description: "The Sun relates to property through authority, government allocations, and inherited ancestral lands connected to the paternal lineage. Strong Sun placement indicates potential for acquiring property through official channels or government allotments. Challenged Sun placements often correlate with disputes over inherited property or complications involving government clearances.",
    icon: "☀️",
    color: "orange"
  },
  Moon: {
    title: "Moon in Chaturthamsa (D4)",
    description: "The Moon governs your emotional connection to property and happiness from residences. As the natural 4th house significator, it is crucial in D4 analysis. Favorable Moon suggests a harmonious home environment and success with properties near water sources. Difficult placement may indicate frequent relocations or emotional attachments that create complications.",
    icon: "🌙",
    color: "blue"
  },
  Mars: {
    title: "Mars in Chaturthamsa (D4)",
    description: "Mars is the 'Bhumi Karaka' (indicator of land) and strongly influences real estate. Well-placed Mars indicates success in property acquisition and the ability to handle construction projects. Challenged Mars warns of property disputes, construction delays, or boundary conflicts.",
    icon: "🔴",
    color: "red"
  },
  Mercury: {
    title: "Mercury in Chaturthamsa (D4)",
    description: "Mercury governs documentation, contracts, and property negotiations. Strong Mercury suggests clear paperwork and smooth legal processes in real estate dealings. Challenged Mercury warns of paperwork problems, contract disputes, or miscommunications during transactions.",
    icon: "🟢",
    color: "emerald"
  },
  Jupiter: {
    title: "Jupiter in Chaturthamsa (D4)",
    description: "Jupiter reveals overall fortune and expansion in property matters. Favorable placement blesses the native with legitimate gains, appreciating property values, and access to favorable financing. Weak Jupiter may indicate struggles with financing or properties that fail to grow in value over time.",
    icon: "🟡",
    color: "amber"
  },
  Venus: {
    title: "Venus in Chaturthamsa (D4)",
    description: "Venus brings aesthetic consideration and luxury to property matters. It indicates beautiful homes, comfortable residences, and properties valued for their visual appeal and comfort. Luxury apartments and well-designed residences align with strong Venus influence.",
    icon: "💖",
    color: "pink"
  },
  Saturn: {
    title: "Saturn in Chaturthamsa (D4)",
    description: "Saturn indicates older properties, inherited ancestral homes, and matters involving delays. It often manifests as property that arrives later in life. Strong Saturn brings eventual success through patience and systematic development, while difficult placement warns of legal encumbrances or financial burdens.",
    icon: "⏳",
    color: "slate"
  },
  Rahu: {
    title: "Rahu in Chaturthamsa (D4)",
    description: "Rahu indicates property acquired in foreign lands or unconventional residences. It encourages thinking 'out of the box' for property challenges. If afflicted, it can create sudden obstacles or illusions in real estate dealings, requiring honest effort and clarity.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Chaturthamsa (D4)",
    description: "Ketu provides a creative approach to property decisions but may lead to a detached or 'lazy' approach if not well-placed. It helps in learning from past experiences to achieve property growth, though it can sometimes indicate unexpected changes in residence.",
    icon: "💥",
    color: "orange"
  }
};

const D7_INTRO = `The D7 (Saptamsa) chart is the primary divisional chart for analyzing children (progeny), fertility, and the continuation of lineage. It reveals your "Santana Sukha" (happiness from children) and the specific karmic patterns involving your offspring.

According to classical texts like Saravali and Uttara Kalamrita, while the 5th house of the birth chart shows the potential for children, the D7 chart provides the detailed narrative of their well-being, character, and your emotional experience as a parent.

Key Houses in D7:
- 1st House: Overall approach to parenthood and innate fertility constitution.
- 5th House: The "house within the house"—directly influences fertility and children's lifelong well-being.
- 7th House: Partner's contribution to progeny and marital support for fertility.
- 9th House: Grandchildren and the long-term prosperity of your lineage.
- 11th House: Gains through children and the fulfillment they bring in later life.`;

const D7_PLANET_DESCRIPTIONS = {
  Jupiter: {
    title: "Jupiter in Saptamsa (D7)",
    description: "Jupiter is the 'Santana Karaka' (primary significator of children). Its strength in D7 determines whether parenthood feels like a blessing or a burden. Strong Jupiter indicates fertility blessings, wisdom, and dharmic fulfillment through offspring. Saravali notes that Jupiter's strength is the key to 'Santana Sukha' (happiness through children).",
    icon: "🟡",
    color: "amber"
  },
  Sun: {
    title: "Sun in Saptamsa (D7)",
    description: "The Sun relates particularly to firstborn children and sons. A well-placed Sun indicates offspring who achieve recognition, honor, and authority in society. Challenged Sun placement may suggest that the firstborn requires extra parental support or faces hurdles in achieving social status.",
    icon: "☀️",
    color: "orange"
  },
  Moon: {
    title: "Moon in Saptamsa (D7)",
    description: "The Moon governs daughters and the emotional connection with all children. Favorable Moon indicates strong emotional bonds and children who are emotionally secure. Afflicted Moon may suggest emotional distance or daughters facing emotional challenges, as it affects how you *experience* parenthood.",
    icon: "🌙",
    color: "blue"
  },
  Mars: {
    title: "Mars in Saptamsa (D7)",
    description: "Mars influences children's energy levels, courage, and competitive abilities. Well-placed Mars indicates active, brave offspring who succeed through their own initiative. Challenged Mars may suggest conflicts with children or offspring prone to accidents and impulsive behavior.",
    icon: "🔴",
    color: "red"
  },
  Mercury: {
    title: "Mercury in Saptamsa (D7)",
    description: "Mercury governs the intellectual development and communication of children. Favorable placement indicates clever, witty, and communicative offspring. It also suggests a logical and balanced approach to parenting, facilitating a better understanding between parent and child.",
    icon: "🟢",
    color: "emerald"
  },
  Venus: {
    title: "Venus in Saptamsa (D7)",
    description: "Venus affects the pleasure derived from children and often influences daughters. Strong Venus indicates beautiful, graceful, and artistic children who bring joy to the family. It determines whether children bring pleasure and comfort or anxiety into your life.",
    icon: "💖",
    color: "pink"
  },
  Saturn: {
    title: "Saturn in Saptamsa (D7)",
    description: "Saturn indicates discipline, delays, and karmic lessons related to children. It may suggest fewer children but ones who develop strong character through persistent effort. Challenged Saturn often indicates fertility delays or parenting challenges requiring great maturity and patience.",
    icon: "⏳",
    color: "slate"
  },
  Rahu: {
    title: "Rahu in Saptamsa (D7)",
    description: "Rahu creates unconventional progeny circumstances. It may indicate children through unusual means, foreign connections regarding offspring, or children with unconventional lifestyles. It brings intense desires but can also introduce complex karmic patterns.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Saptamsa (D7)",
    description: "Ketu indicates a spiritual or detached connection to progeny. It can suggest children with a spiritual bent of mind or periods of detachment from children matters. It encourages learning from past-life progeny karma to achieve maturity as a parent.",
    icon: "💥",
    color: "orange"
  }
};

const D12_INTRO = `The D12 (Dwadasamsa) chart is the primary divisional chart for analyzing parents, maternal and paternal lineages, and inherited ancestral karma. It reveals the foundational influences that shaped your early identity and the spiritual debts or blessings passed down through generations.

According to classical texts like Jataka Parijata and Brihat Parashara Hora Shastra, while the birth chart (D1) shows the general relationship with parents, the D12 chart provides deep insights into the character of your parents and the specific evolutionary direction of your family karma.

Key Houses in D12:
- 1st House: Overall family influence on your identity and core personality.
- 2nd House: Family values, collective resources, and inherited wealth.
- 4th House: The primary indicator of the mother, emotional security, and maternal lineage.
- 9th House: Paternal relationship, father's blessings, and dharmic values from the paternal side.
- 10th House: Family reputation, social standing, and how parental legacy affects your public path.
- 12th House: Hidden family patterns, ancestral debts, and spiritual inheritance requiring resolution.`;

const D12_PLANET_DESCRIPTIONS = {
  Sun: {
    title: "Sun in Dwadasamsa (D12)",
    description: "The Sun represents the father and paternal lineage. A strong Sun indicates a positive relationship with the father, inherited leadership qualities, and blessings from the paternal side. A challenged Sun may suggest difficulties with the father, absence of guidance, or paternal karmic burdens requiring conscious healing.",
    icon: "☀️",
    color: "orange"
  },
  Moon: {
    title: "Moon in Dwadasamsa (D12)",
    description: "The Moon governs the mother and maternal inheritance. Well-placed Moon indicates a nurturing relationship and emotional support from the maternal lineage. A difficult Moon placement may suggest relationship challenges or emotional patterns inherited from the mother's side that require transformation.",
    icon: "🌙",
    color: "blue"
  },
  Jupiter: {
    title: "Jupiter in Dwadasamsa (D12)",
    description: "Jupiter reveals the wisdom and moral guidance inherited from parents. Strong Jupiter indicates parents who provide genuine direction and families with strong dharmic traditions. Challenged Jupiter may indicate a lack of parental guidance or ancestral patterns disconnected from spiritual foundations.",
    icon: "🟡",
    color: "amber"
  },
  Saturn: {
    title: "Saturn in Dwadasamsa (D12)",
    description: "Saturn reveals karmic debts and serious family responsibilities. It indicates genuine obligations, such as caring for aging parents or managing family properties. Its challenges in D12 often become the crucible for profound family healing and the fulfillment of ancestral commitments.",
    icon: "⏳",
    color: "slate"
  },
  Mars: {
    title: "Mars in Dwadasamsa (D12)",
    description: "Mars indicates assertive family dynamics or inheritance of courage and determination. Strong Mars shows protective parental energy. Challenged Mars suggests arguments, discord in parental relationships, or inheritance of anger patterns requiring conscious transformation.",
    icon: "🔴",
    color: "red"
  },
  Mercury: {
    title: "Mercury in Dwadasamsa (D12)",
    description: "Mercury relates to communication patterns with parents and intellectual inheritance. Strong Mercury indicates good dialogue and inherited intelligence. Challenged Mercury may indicate family secrets, miscommunication, or intellectual patterns that require refinement.",
    icon: "🟢",
    color: "emerald"
  },
  Venus: {
    title: "Venus in Dwadasamsa (D12)",
    description: "Venus indicates comfort, harmony, and material inheritance (wealth/property) in family life. Strong Venus suggests a loving environment and aesthetic sensitivity passed down from parents. Weak Venus may indicate family discord or limited affection during upbringing.",
    icon: "💖",
    color: "pink"
  },
  Rahu: {
    title: "Rahu in Dwadasamsa (D12)",
    description: "Rahu indicates unfulfilled ancestral ambitions and new directions the family seeks through you. It reveals evolutionary possibilities and the drive to break old family patterns to establish new directions.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Dwadasamsa (D12)",
    description: "Ketu shows what the family lineage has already mastered through previous generations—ancestral achievements, talents, and karmic completions. It represents the spiritual dimension and spiritual wealth of your inheritance.",
    icon: "💥",
    color: "orange"
  }
};

const D16_INTRO = `The D16 (Shodashamsa) chart is the specialized divisional chart for analyzing vehicles (conveyances), luxuries, and overall material comforts (Sukha). It reveals your "transportation karma" and the specific quality of life derived from material possessions.

According to classical texts like Saravali and Brihat Jataka, while the 4th house of the birth chart shows the general potential for comforts, the D16 chart provides precise details about vehicle ownership, mechanical success, and the emotional satisfaction derived from material assets.

Key Houses in D16:
- 1st House: Overall relationship with vehicles and general approach to material comforts.
- 4th House: The primary indicator of vehicle quality, ownership probability, and happiness from transportation.
- 6th House: Vehicle-related problems—repairs, mechanical failures, and potential risks.
- 11th House: Financial gains through vehicles or the capacity for high-end acquisitions.
- 12th House: Expenses, losses, or drains related to vehicles and luxury maintenance.`;

const D16_PLANET_DESCRIPTIONS = {
  Venus: {
    title: "Venus in Shodashamsa (D16)",
    description: "Venus is the 'Vahana Karaka' (natural significator of vehicles and luxuries). Its strength in D16 is the foundation for material pleasure. Strong Venus indicates success with high-end vehicles and the potential for a lifestyle of comfort. Challenged Venus may suggest an inability to fully enjoy luxuries despite possession.",
    icon: "💖",
    color: "pink"
  },
  Mars: {
    title: "Mars in Shodashamsa (D16)",
    description: "Mars governs the mechanical and engineering aspects of transportation. Well-placed Mars indicates success with machinery, engineering, and the physical skill of driving. Challenged Mars warns of mechanical issues, accident risks, or conflicts involving vehicles that require vigilance.",
    icon: "🔴",
    color: "red"
  },
  Moon: {
    title: "Moon in Shodashamsa (D16)",
    description: "The Moon governs emotional satisfaction from possessions. It determines the actual enjoyment of vehicles rather than mere ownership. Strong Moon brings genuine happiness from your assets, while a weak Moon may lead to persistent dissatisfaction regardless of the quality of the vehicle.",
    icon: "🌙",
    color: "blue"
  },
  Jupiter: {
    title: "Jupiter in Shodashamsa (D16)",
    description: "Jupiter influences vehicles through expansion and high quality. Favorable Jupiter suggests spacious, premium, or high-capacity vehicles and expanding ownership over time. It provides good judgment in vehicle decisions and generally supports material prosperity when strong.",
    icon: "🟡",
    color: "amber"
  },
  Saturn: {
    title: "Saturn in Shodashamsa (D16)",
    description: "Saturn indicates practical, durable vehicles and potentially older or inherited conveyances. It favors longevity and function over form. Challenged Saturn may cause delays in ownership, vehicle-related burdens, or the need for sustained effort to acquire transportation.",
    icon: "⏳",
    color: "slate"
  },
  Mercury: {
    title: "Mercury in Shodashamsa (D16)",
    description: "Mercury points toward versatile, efficient, and technologically advanced vehicles. It favors smart designs, good fuel economy, and vehicles that serve multiple practical purposes. Strong Mercury suggests success in negotiations and thorough research during acquisitions.",
    icon: "🟢",
    color: "emerald"
  },
  Sun: {
    title: "Sun in Shodashamsa (D16)",
    description: "The Sun represents authority and status derived from vehicles. It indicates vehicles that carry a sense of power or are connected to official status and government. A strong Sun suggests the use of high-status transportation as a reflection of one's social standing.",
    icon: "☀️",
    color: "orange"
  },
  Rahu: {
    title: "Rahu in Shodashamsa (D16)",
    description: "Rahu often leads to unconventional vehicle choices or the desire for high-tech, futuristic transportation. It can bring sudden acquisitions but may also lead to hidden mechanical problems or unusual legal circumstances regarding material comforts.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Shodashamsa (D16)",
    description: "Ketu indicates a detached approach to material comforts or the use of vehicles for spiritual/secluded travels. It may lead to unexpected changes in vehicle ownership or a preference for simple, understated transportation despite the capacity for luxury.",
    icon: "💥",
    color: "orange"
  }
};

const D24_INTRO = `The D24 (Siddhamsa or Chaturvimshamsa) chart is the specialized divisional chart for analyzing education, learning, higher knowledge, and intellectual accomplishments. It reveals your academic path, deep wisdom, and specialized skills.

In Vedic astrology, while the 4th house shows basic schooling and the 5th house shows intelligence, the D24 chart provides the complete picture of your lifelong learning journey and the specific fields where you will achieve mastery.

Key Houses in D24:
- 4th House: Formal early education, school environment, and academic foundation.
- 5th House: Higher intelligence, learning capacity, and success in examinations.
- 9th House: University education, higher learning, and wisdom from teachers/Gurus.
- 10th House: Application of knowledge and professional training.
- 1st House: Overall aptitude for learning and intellectual identity.`;

const D24_PLANET_DESCRIPTIONS = {
  Mercury: {
    title: "Mercury in Siddhamsa (D24)",
    description: "Mercury is the natural significator of learning and logical skills. Its D24 position determines your capacity for communication-based education, including mathematics, writing, languages, and business. Strong Mercury grants quick learning and effective academic skill.",
    icon: "🟢",
    color: "emerald"
  },
  Jupiter: {
    title: "Jupiter in Siddhamsa (D24)",
    description: "Jupiter is the significator of higher wisdom and traditional learning. It governs advanced degrees, philosophical depth, and advisory fields. Strong Jupiter indicates success in law, religion, philosophy, and receiving profound guidance from enlightened teachers.",
    icon: "🟡",
    color: "amber"
  },
  Sun: {
    title: "Sun in Siddhamsa (D24)",
    description: "The Sun represents intellectual confidence and leadership in learning. It governs government training, executive education, and the capacity for original contribution. A strong Sun suggests someone who achieves recognition through their specialized knowledge.",
    icon: "☀️",
    color: "orange"
  },
  Mars: {
    title: "Mars in Siddhamsa (D24)",
    description: "Mars indicates technical and action-oriented learning. It favors success in engineering, medicine (especially surgery), military training, and sports sciences. It provides the drive and focus needed for intensive technical studies.",
    icon: "🔴",
    color: "red"
  },
  Venus: {
    title: "Venus in Siddhamsa (D24)",
    description: "Venus influences learning in the arts, aesthetics, and design. It favors success in music, fine arts, architecture, and luxury-related education. It indicates that your learning process will be driven by a love for beauty and harmony.",
    icon: "💖",
    color: "pink"
  },
  Saturn: {
    title: "Saturn in Siddhamsa (D24)",
    description: "Saturn indicates traditional, disciplined, and long-form research. It favors classical studies, history, and structured academic work that requires great patience. Strong Saturn grants the ability to achieve mastery through persistent, long-term effort.",
    icon: "⏳",
    color: "slate"
  },
  Moon: {
    title: "Moon in Siddhamsa (D24)",
    description: "The Moon governs the emotional aptitude for learning and psychological depth. It influences success in humanities, nursing, psychology, and fields requiring deep empathy. A well-placed Moon indicates a mind that is receptive and intuitive in its learning process.",
    icon: "🌙",
    color: "blue"
  },
  Rahu: {
    title: "Rahu in Siddhamsa (D24)",
    description: "Rahu creates interest in unconventional or foreign knowledge systems. It favors success in modern technology, electronics, foreign languages, and research into mysterious or hidden subjects. It can lead to sudden intellectual breakthroughs.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Siddhamsa (D24)",
    description: "Ketu indicates a spiritual or intuitive approach to knowledge. It favors mastery in metaphysics, occult sciences, and deep meditation-based wisdom. It can sometimes indicate detachment from formal academic structures in favor of self-taught spiritual mastery.",
    icon: "💥",
    color: "orange"
  }
};

const D30_INTRO = `The D30 (Trimshamsa) chart is the specialized divisional chart for analyzing misfortunes, health risks, hidden vulnerabilities, and the capacity for resilience. It reveals the "karmic friction" and the specific challenges that may arise throughout life.

In Vedic astrology, the D30 is crucial for determining the source of obstacles and the strength of your "karmic cushion" against adversity. It is used to identify vulnerabilities to illness (Roga), conflicts, and transformative crises.

Key Houses in D30:
- 1st House: Overall resilience, constitution, and inherent capacity to recover from adversity.
- 6th House: Health problems, enemies, obstacles, and workplace conflicts.
- 8th House: Sudden changes, profound transformations, chronic illness, and deep crises.
- 12th House: Losses, isolation, self-undoing patterns, and hidden enemies.
- 4th House: Domestic peace, property disputes, and emotional disturbances affecting inner stability.
- 7th House: Relationship misfortunes, legal troubles, and conflicts with others.`;

const D30_PLANET_DESCRIPTIONS = {
  Mars: {
    title: "Mars in Trimshamsa (D30)",
    description: "Mars relates to misfortunes through aggression, accidents, and acute crises. A strong D30 Mars allows you to handle crises with courage. However, a challenged Mars suggests vulnerability to injuries, surgical interventions, or aggressive confrontations that can be overwhelming.",
    icon: "🔴",
    color: "red"
  },
  Saturn: {
    title: "Saturn in Trimshamsa (D30)",
    description: "Saturn governs misfortunes through delay, chronic illness, and restriction. It reveals long-term, grinding difficulties. Strong Saturn grants remarkable resilience through hardship, while an afflicted Saturn suggests overwhelming burdens or prolonged health issues requiring sustained endurance.",
    icon: "⏳",
    color: "slate"
  },
  Jupiter: {
    title: "Jupiter in Trimshamsa (D30)",
    description: "Jupiter reveals the level of divine protection and grace against misfortune. It acts as the 'great protector.' Strong Jupiter provides a 'karmic cushion' so that difficulties never fully overwhelm you. Weak Jupiter indicates reduced protective grace and greater exposure to adversity.",
    icon: "🟡",
    color: "amber"
  },
  Mercury: {
    title: "Mercury in Trimshamsa (D30)",
    description: "Mercury relates to misfortunes through communication, mental health, and business dealings. Challenged Mercury suggests vulnerability to fraud, nervous disorders, or losses through miscommunication. It also points to intellectual faults or documentation errors (Buddhi Dosha).",
    icon: "🟢",
    color: "emerald"
  },
  Venus: {
    title: "Venus in Trimshamsa (D30)",
    description: "Venus governs misfortunes in relationships, reproductive health, and excessive pleasure-seeking. Challenged Venus indicates relationship tragedies or health vulnerabilities in Venus-governed body areas. Classical texts associate its affliction with 'Kama Dosha' (desire-related faults).",
    icon: "💖",
    color: "pink"
  },
  Moon: {
    title: "Moon in Trimshamsa (D30)",
    description: "The Moon's condition determines your mental resilience during difficult times. Afflicted Moon suggests deep emotional vulnerability when misfortunes occur. A strong Moon provides the psychological stability needed to navigate challenges without being emotionally overwhelmed.",
    icon: "🌙",
    color: "blue"
  },
  Sun: {
    title: "Sun in Trimshamsa (D30)",
    description: "The Sun represents your vitality and the strength of your physical ego against crises. While not a primary ruler of Trimshamsa divisions, its strength indicates how well your core identity survives through misfortune and whether you retain your 'inner light' during dark periods.",
    icon: "☀️",
    color: "orange"
  },
  Rahu: {
    title: "Rahu in Trimshamsa (D30)",
    description: "Rahu indicates unusual or unconventional misfortunes and obsessive patterns. It often reveals where unexpected difficulties arise, potentially through foreign connections or sudden illusions. It represents intense karma that can be difficult to predict.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Trimshamsa (D30)",
    description: "Ketu indicates losses through neglect, spiritual crises, or detachment-related problems. It represents past-life karma manifesting as sudden separations or a sense of isolation. It encourages using misfortune as a path toward spiritual detachment and maturity.",
    icon: "💥",
    color: "orange"
  }
};

const D60_INTRO = `The D60 (Shashtiamsa) chart is the deepest and most profound divisional chart in Vedic astrology. It reveals the accumulated past-life karma that forms the foundation of your current incarnation. Sage Parashara gives D60 the highest weight among all divisional charts because it explains the "why" behind your birth blueprint.

According to classical texts like Saravali and Jataka Parijata, D60 reveals the hidden roots of persistent life patterns that resist change. It is the final word in determining whether a planet's promise in the birth chart will fully manifest or face deep-seated karmic resistance.

Key Applications of D60:
- Past-Life Karma: The specific actions from previous lives that influence current identity, health, and fortune.
- Persistent Patterns: Explains recurring relationship, career, or financial struggles that defy logical solutions.
- Chart Hierarchy: Provides the foundational layer that supports or restricts the potential seen in D1, D9, and D10.
- Spiritual Potential: Reveals the accumulated spiritual credit and the obstacles to current dharmic growth.`;

const D60_PLANET_DESCRIPTIONS = {
  Sun: {
    title: "Sun in Shashtiamsa (D60)",
    description: "The Sun's D60 position reveals karma related to ego, authority, and father relationships from past lives. Benefic placement suggests past-life righteous leadership that blesses your current identity. Challenging placement indicates past-life ego issues or misuse of authority requiring resolution through humility.",
    icon: "☀️",
    color: "orange"
  },
  Moon: {
    title: "Moon in Shashtiamsa (D60)",
    description: "The Moon in D60 shows emotional and mental karma from previous incarnations. A benefic division indicates past-life emotional intelligence and nurturing that supports current mental peace. Challenging placement may reveal past-life emotional manipulation or failures in providing support.",
    icon: "🌙",
    color: "blue"
  },
  Mars: {
    title: "Mars in Shashtiamsa (D60)",
    description: "Mars reveals karma related to action, courage, and the use of power. Benefic placement suggests past-life protection of the innocent or righteous battle. Challenging placement may indicate past-life aggression or violence now manifesting as current conflicts or accident-prone tendencies.",
    icon: "🔴",
    color: "red"
  },
  Mercury: {
    title: "Mercury in Shashtiamsa (D60)",
    description: "Mercury shows intellectual and communication karma. Benefic placement indicates past-life honest communication and beneficial use of intelligence. Challenging placement points to past-life deception or misuse of intellectual gifts, often tracing to current learning or communication difficulties.",
    icon: "🟢",
    color: "emerald"
  },
  Jupiter: {
    title: "Jupiter in Shashtiamsa (D60)",
    description: "Jupiter indicates spiritual merit, wisdom accumulation, and teacher relationships from past lives. Benefic placement suggests accumulated credit from devotion and teaching. Challenging placement may indicate past-life religious hypocrisy or corruption of wisdom traditions requiring rectification.",
    icon: "🟡",
    color: "amber"
  },
  Venus: {
    title: "Venus in Shashtiamsa (D60)",
    description: "Venus reveals relationship and pleasure karma from previous incarnations. Benefic placement supports harmonious current relationships. Challenging placement may indicate past-life betrayal or excessive indulgence at others' expense, explaining persistent relationship hurdles.",
    icon: "💖",
    color: "pink"
  },
  Saturn: {
    title: "Saturn in Shashtiamsa (D60)",
    description: "Saturn's D60 position shows karma related to duty, service, and endurance. Benefic placement suggests past-life diligent service and patient endurance. Challenging placement may indicate past-life cruelty or neglect of duty now creating current obligations or restrictions.",
    icon: "⏳",
    color: "slate"
  },
  Rahu: {
    title: "Rahu in Shashtiamsa (D60)",
    description: "Rahu's D60 position reveals the quality of past-life desires and obsessions that still pull on your consciousness. It indicates unconventional karmic directions and the evolutionary pressure to resolve intense past-life desires.",
    icon: "🌑",
    color: "teal"
  },
  Ketu: {
    title: "Ketu in Shashtiamsa (D60)",
    description: "Ketu's placement reveals the genuineness of past-life spiritual renunciation. It shows what was truly transcended versus what was merely abandoned through escapism, guiding your current-life path toward genuine spiritual liberation.",
    icon: "💥",
    color: "orange"
  }
};

const DREKKANA_INTRO = `Drekkana or D3 Chart is the harmonic division of a sign into three parts, primarily used to analyze siblings (co-borns), courage, and the native's ability to execute initiatives. 

In Vedic astrology, this chart reveals your "bhratri sukha" (happiness from siblings) and your "parakrama" (prowess/courage). While the birth chart shows the general potential for courage, the D3 chart specifies how you utilize your physical and mental strength to overcome obstacles and lead your siblings or teammates.`;

const DREKKANA_PLANET_DESCRIPTIONS = {
  Sun: {
    title: "The Authoritative Brother",
    icon: "☀️",
    color: "orange",
    description: "Sun in D3 indicates a courageous and protective influence over siblings. You may take a leadership role among your co-borns or team members, often acting as a father-figure. It bestows an innate sense of duty and authority in all your initiatives."
  },
  Moon: {
    title: "The Emotional Protector",
    icon: "🌙",
    color: "blue",
    description: "Moon in D3 reflects an emotional and nurturing bond with siblings. Your courage is driven by your feelings and intuition. You take initiatives that bring emotional security to those around you, though your physical energy may fluctuate with your mood."
  },
  Mars: {
    title: "The Natural Warrior",
    icon: "⚔️",
    color: "red",
    description: "Mars is the natural karaka (significator) of D3. Its placement here is crucial for physical strength and raw courage. A strong Mars in D3 creates a formidable individual who never backs down from a challenge and possesses a deep, competitive spirit in all ventures."
  },
  Mercury: {
    title: "The Strategic Thinker",
    icon: "☿",
    color: "emerald",
    description: "Mercury in D3 emphasizes intelligence and communication in your initiatives. You rely on strategy rather than brute force. Your relationship with siblings is characterized by intellectual exchange, shared learning, and frequent communication."
  },
  Jupiter: {
    title: "The Wise Counselor",
    icon: "🕉️",
    color: "amber",
    description: "Jupiter in D3 brings wisdom and righteousness to your actions. You are seen as a guide by your siblings. Your initiatives are often for the greater good, and you possess a steady, philosophical courage that remains calm under pressure."
  },
  Venus: {
    title: "The Harmonious Initiator",
    icon: "💖",
    color: "pink",
    description: "Venus in D3 indicates harmony and shared pleasures with siblings. Your courage is refined and often channeled into artistic or social pursuits. You prefer diplomacy over confrontation but possess great stamina for the things you love."
  },
  Saturn: {
    title: "The Disciplined Worker",
    icon: "⚓",
    color: "slate",
    description: "Saturn in D3 suggests a serious or burdensome relationship with siblings. You possess immense patience and a disciplined approach to work. Your courage is 'silent resilience'—the ability to endure long hardships without complaining."
  },
  Rahu: {
    title: "The Unconventional Leader",
    icon: "🌀",
    color: "teal",
    description: "Rahu in D3 indicates unusual or intense initiatives. You may have an unconventional approach to challenges that surprises others. Sibling relationships could be complex, involving foreigners, outcasts, or highly ambitious dynamics."
  },
  Ketu: {
    title: "The Spiritual Brave",
    icon: "☄️",
    color: "orange",
    description: "Ketu in D3 suggests a detached or spiritual attitude towards courage and siblings. You may not feel a strong physical ego, yet you possess the bravery of a renounced soul. Initiatives are often pursued for spiritual liberation rather than material gain."
  }
};

const PlanetTable = ({ data, onPlanetClick }) => (
  <div className="flex flex-col h-full bg-[#fdfbf7]">
    <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase">Birth Chart Details</div>
    <div className="overflow-auto flex-1 text-[10px] font-mono leading-tight">
      <table className="w-full">
        <thead className="bg-[#f1f5f9] sticky top-0">
          <tr className="border-b border-[#cbd5e1]">
            <th className="p-1 text-left">Planet</th>
            <th className="p-1 text-left">Deg</th>
            <th className="p-1 text-left">Nakshatra</th>
            <th className="p-1 text-left">P.</th>
            <th className="p-1 text-left">Lord</th>
          </tr>
        </thead>
        <tbody>
          {(data.planet_positions || []).map(p => {
            const color = PLANET_COLORS[p.planet] || "#000";
            const nameWithStatus = `${p.planet}${p.is_retrograde ? '*' : ''}${p.is_combust ? '#' : ''}`;
            return (
              <tr key={p.planet} className="border-b border-[#f1f5f9] hover:bg-white transition-colors cursor-pointer" onClick={() => onPlanetClick?.(p.planet, p.house)}>
                <td className="p-1 font-bold" style={{ color: color }}>{nameWithStatus}</td>
                <td className="p-1">{p.degree.toFixed(2)}°</td>
                <td className="p-1">{p.nakshatra}</td>
                <td className="p-1">1</td>
                <td className="p-1">{p.sign_lord}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="p-2 border-t border-[#cbd5e1] text-[8px] italic text-slate-500 bg-[#f8fafc]">
        * = Vakri (Retrograde), # = Asth (Combust)
      </div>
    </div>
  </div>
);

const DignityTable = ({ data, planetEffects }) => {
  const lagnaHouse = data.charts?.houses?.[1] || data.charts?.houses?.["1"] || {};
  let lagnaSignIndex = lagnaHouse.sign_index;
  if (lagnaSignIndex === undefined && lagnaHouse.cusp_deg !== undefined) {
    lagnaSignIndex = Math.floor(lagnaHouse.cusp_deg / 30);
  }
  if (lagnaSignIndex === undefined) {
    lagnaSignIndex = data.charts?.ascendant_sign_index || 0;
  }

  const getFunctionalNature = (lagnaIdx, planetName) => {
    const lagnaMap = {
      0: { benefic: ["Sun", "Moon", "Mars", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
      1: { benefic: ["Sun", "Mercury", "Saturn", "Mars"], malefic: ["Moon", "Jupiter", "Venus"] },
      2: { benefic: ["Venus"], malefic: ["Sun", "Mars", "Jupiter"] },
      3: { benefic: ["Moon", "Mars", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
      4: { benefic: ["Sun", "Mars", "Jupiter"], malefic: ["Moon", "Mercury", "Venus", "Saturn"] },
      5: { benefic: ["Venus"], malefic: ["Moon", "Mars", "Jupiter"] },
      6: { benefic: ["Mercury", "Saturn", "Venus"], malefic: ["Sun", "Moon", "Mars", "Jupiter"] },
      7: { benefic: ["Moon", "Sun", "Jupiter"], malefic: ["Mercury", "Venus", "Saturn"] },
      8: { benefic: ["Sun", "Mars"], malefic: ["Venus", "Saturn", "Mercury"] },
      9: { benefic: ["Mercury", "Venus", "Saturn"], malefic: ["Moon", "Mars", "Jupiter"] },
      10: { benefic: ["Venus", "Saturn", "Mars"], malefic: ["Moon", "Jupiter"] },
      11: { benefic: ["Moon", "Mars", "Jupiter"], malefic: ["Sun", "Venus", "Saturn"] }
    };

    const lagnaData = lagnaMap[lagnaIdx] || { benefic: [], malefic: [] };
    if (planetName === "Rahu" || planetName === "Ketu") return "malefic";
    if (lagnaData.benefic.includes(planetName)) return "benefic";
    if (lagnaData.malefic.includes(planetName)) return "malefic";
    return "neutral";
  };

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7]">
      <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase flex-shrink-0">Birth Chart Dignity</div>
      <div className="overflow-auto flex-1 text-[10px] font-mono leading-tight custom-scrollbar">
        <table className="w-full border-collapse mb-6">
          <thead className="bg-[#f1f5f9] sticky top-0 border-b border-[#cbd5e1] z-10">
            <tr>
              <th className="p-1 text-left">Pl.</th>
              <th className="p-1 text-left">Dignity</th>
              <th className="p-1 text-left">SB%</th>
              <th className="p-1 text-left">VB</th>
              <th className="p-1 text-left">Func</th>
            </tr>
          </thead>
          <tbody>
            {(data.planet_positions || []).map(p => {
              const color = PLANET_COLORS[p.planet] || "#000";
              const pStrength = data?.strength?.planets?.[p.planet];
              const sb = pStrength?.total || 1.1;

              const nature = getFunctionalNature(lagnaSignIndex, p.planet);
              const statusText = nature === "benefic" ? "Benefic" : nature === "malefic" ? "Malefic" : "Neutral";
              const statusColor = nature === "benefic" ? "text-green-600" : nature === "malefic" ? "text-red-600" : "text-amber-600";

              return (
                <tr key={p.planet} className="border-b border-[#f1f5f9] hover:bg-white transition-colors">
                  <td className="p-1 font-bold" style={{ color: color }}>
                    {p.planet.substring(0, 2)}{p.is_retrograde ? '*' : ''}{p.is_combust ? '#' : ''}
                  </td>
                  <td className="p-1">{pStrength?.dignity || "Own"}</td>
                  <td className="p-1">{(sb * 10).toFixed(0)}</td>
                  <td className="p-1">12</td>
                  <td className={`p-1 font-bold ${statusColor}`}>{statusText}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Detailed Planetary Analysis */}
        <div className="p-3 border-t border-[#cbd5e1] bg-slate-50">
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-900 mb-4 text-center">Detailed Planetary Analysis</h3>
          <div className="flex flex-col gap-6">
            {(data.planet_positions || []).map(p => {
              const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
              if (!valid.includes(p.planet)) return null;

              const nature = getFunctionalNature(lagnaSignIndex, p.planet);
              return (
                <PlanetaryRemediesViewer key={`rem-${p.planet}`} planet={p.planet} initialNature={nature} />
              );
            })}
          </div>
        </div>
      </div>
      <div className="p-2 border-t border-[#cbd5e1] text-[8px] italic text-slate-500 bg-[#f8fafc] flex-shrink-0">
        * = Vakri (Retrograde), # = Asth (Combust) | Analysis uses Parashari principles for current Lagna.
      </div>
    </div>
  );
};

const PanchangPanel = ({ data }) => {
  const p = data?.panchang || {};
  // Check if we have any actual data beyond just the keys
  const hasPanchang = !!(p.tithi?.tithi_name || p.nakshatra?.nakshatra_name || p.yoga?.yoga_name || p.karana?.karana_name);

  if (!hasPanchang) {
    return (
      <div className="flex flex-col h-full bg-[#fdfbf7]">
        <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-black text-[9px] uppercase tracking-widest italic shadow-sm">
          🗞️ Panchang & Solar data
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 text-center">
          <span className="text-3xl opacity-40">📅</span>
          <p className="text-[10px] text-gray-400 italic">Panchang data not available.</p>
          <p className="text-[9px] text-gray-300">Please regenerate the report to load Tithi, Nakshatra & Yoga.</p>
        </div>
      </div>
    );
  }

  const items = [
    { label: "Tithi", value: p.tithi?.tithi_name, icon: "🌑" },
    { label: "Nakshatra", value: p.nakshatra?.nakshatra_name, icon: "⭐" },
    { label: "Yoga", value: p.yoga?.yoga_name, icon: "🌀" },
    { label: "Karana", value: p.karana?.karana_name, icon: "🐘" },
    { label: "Sunrise", value: data.meta?.sunrise || "N/A", icon: "🌅" },
    { label: "Sunset", value: data.meta?.sunset || "N/A", icon: "🌇" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7]">
      <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-black text-[9px] uppercase tracking-widest italic shadow-sm">
        🗞️ Panchang & Solar data
      </div>
      <div className="flex-1 p-2 grid grid-cols-2 gap-2 overflow-auto custom-scrollbar">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white p-2 rounded border border-gray-100 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">{item.icon}</span>
              <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">{item.label}</span>
            </div>
            <div className="text-[10px] font-bold text-slate-800 truncate">{item.value || "---"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NumericalPanel = ({ data }) => {
  const n = data?.favourable?.numerology || {};
  const hasData = n.radical_number != null || n.destiny_number != null || n.life_path_number != null;

  if (!hasData) {
    return (
      <div className="flex flex-col h-full bg-[#f8fbff]">
        <div className="w-full text-center py-1 border-b bg-[#dbeafe] border-[#93c5fd] text-[#1e40af] font-serif font-black text-[9px] uppercase tracking-widest italic shadow-sm">
          🔢 Numerology Insights
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 text-center">
          <span className="text-3xl opacity-40">🔢</span>
          <p className="text-[10px] text-gray-400 italic">Numerology data not available.</p>
          <p className="text-[9px] text-gray-300">Please regenerate the report to load numerology insights.</p>
        </div>
      </div>
    );
  }

  const items = [
    { label: "Radical", val: n.radical_number, color: "text-blue-600" },
    { label: "Destiny", val: n.destiny_number, color: "text-purple-600" },
    { label: "Life Path", val: n.life_path_number, color: "text-indigo-600" },
    { label: "Lucky Day", val: n.lucky_day?.[0], color: "text-green-600" },
    { label: "Mantra", val: n.lucky_mantra, color: "text-amber-600", full: true },
    { label: "Lucky Stone", val: n.lucky_stone, color: "text-rose-600" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fbff]">
      <div className="w-full text-center py-1 border-b bg-[#dbeafe] border-[#93c5fd] text-[#1e40af] font-serif font-black text-[9px] uppercase tracking-widest italic shadow-sm">
        🔢 Numerology Insights
      </div>
      <div className="flex-1 p-2 flex flex-col gap-1.5 overflow-auto custom-scrollbar">
        <div className="grid grid-cols-2 gap-2">
          {items.filter(i => !i.full).map((item, idx) => (
            <div key={idx} className="bg-white p-2 rounded border border-blue-50/50 shadow-sm">
              <div className="text-[7px] font-black text-gray-400 uppercase mb-0.5">{item.label}</div>
              <div className={`text-[11px] font-black ${item.color}`}>{item.val || "---"}</div>
            </div>
          ))}
        </div>
        {items.filter(i => i.full).map((item, idx) => (
          <div key={idx} className="bg-indigo-50/50 p-2 rounded border border-indigo-100">
            <div className="text-[7px] font-black text-indigo-400 uppercase mb-1">{item.label}</div>
            <div className="text-[9px] font-serif italic text-indigo-900 leading-tight">"{item.val}"</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SecondaryDashaPanel = ({ data, type }) => {
  const list = data?.[type] || [];
  const title = type === 'shodashottari' ? 'Shodashottari' : 'Chaturshitisama';
  const totalYears = type === 'shodashottari' ? 116 : 84;

  if (!list.length) {
    return (
      <div className="flex flex-col h-full bg-white font-serif">
        <div className="w-full text-center py-1.5 border-b bg-gradient-to-r from-teal-100 to-white border-teal-200 text-teal-900 font-serif font-black text-[9px] uppercase italic tracking-widest">
          ⏳ {title} Dasha
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3 text-center">
          <span className="text-3xl opacity-40">⏳</span>
          <p className="text-[10px] text-gray-400 italic">{title} Dasha data not available.</p>
          <p className="text-[9px] text-gray-300">Please regenerate the report to load this dasha ({totalYears}-year cycle).</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white font-serif">
      <div className="w-full text-center py-1.5 border-b bg-gradient-to-r from-teal-100 to-white border-teal-200 text-teal-900 font-serif font-black text-[9px] uppercase italic tracking-widest">
        ⏳ {title} Dasha
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <tbody>
            {list.map((d, i) => (
              <tr key={i} className="border-b border-gray-50 text-[9px]">
                <td className="p-1 px-2 font-bold text-gray-700">{d.lord}</td>
                <td className="p-1 text-gray-400 font-mono italic">{(d.start ?? 0).toFixed(1)}y - {(d.end ?? 0).toFixed(1)}y</td>
                <td className="p-1 text-right text-teal-600 font-bold px-2">{d.duration}y</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const VimshottariPanel = ({ data }) => {
  const list = data.dasha?.list || [];
  const planetStrengths = data.strength?.planets || {};

  return (
    <div className="flex flex-col h-full bg-white font-serif">
      <div className="w-full text-center py-1.5 border-b bg-gradient-to-r from-slate-200 to-slate-50 border-[#94a3b8] text-[#1e293b] font-serif font-black text-xs uppercase italic tracking-widest shadow-sm">
        ⏳ Vimshottari Mahadasha
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead className="bg-[#f8fafc] sticky top-0 z-10 shadow-sm border-b border-gray-200">
            <tr className="text-[8px] uppercase text-gray-500 font-black">
              <th className="p-2 text-left">Lord</th>
              <th className="p-2 text-left">Period (Start - End)</th>
              <th className="p-2 text-right">Age/Year</th>
            </tr>
          </thead>
          <tbody>
            {(list || []).slice(0, 25).map((d, i) => {
              const strength = planetStrengths[d.lord]?.total;
              const nextD = list[i + 1];
              const endDate = d.end_date || (nextD ? nextD.start_date : "Ongoing");

              return (
                <tr key={i} className="border-b border-gray-50 hover:bg-slate-50 transition-colors group">
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PLANET_COLORS[d.lord] || '#000' }}></div>
                      <span className="text-[10px] font-black uppercase text-gray-700" style={{ color: PLANET_COLORS[d.lord] }}>{d.lord}</span>
                    </div>
                  </td>
                  <td className="p-2 text-[9px] text-gray-500 font-mono tracking-tighter">
                    <span className="text-indigo-600 font-semibold">{d.start_date}</span>
                    <span className="mx-1 text-gray-300">to</span>
                    <span className="text-rose-600 font-semibold">{endDate}</span>
                  </td>
                  <td className="p-2 text-right">
                    <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded group-hover:bg-indigo-600 group-hover:text-white transition-colors">{d.start_date.split("/")[2]}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-1.5 px-3 bg-slate-50 border-t border-gray-100">
        <p className="text-[7.5px] text-gray-400 italic leading-tight">Timeline shows the primary (Mahadasha) cycles. Each period activates the specific results of its lord in your chart.</p>
      </div>
    </div>
  );
};

const GemstonePanel = ({ data }) => {
  const lagnaHouse = data.charts?.houses?.[1] || data.charts?.houses?.["1"] || {};

  // Robustly find the Lagna Sign Index
  let lagnaSignIndex = lagnaHouse.sign_index;
  if (lagnaSignIndex === undefined && lagnaHouse.cusp_deg !== undefined) {
    lagnaSignIndex = Math.floor(lagnaHouse.cusp_deg / 30);
  }
  if (lagnaSignIndex === undefined) {
    lagnaSignIndex = data.charts?.ascendant_sign_index;
  }

  if (lagnaSignIndex === undefined) {
    return (
      <div className="flex flex-col h-full bg-[#fdfbf7]">
        <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase italic tracking-widest">Ratna Suggestions</div>
        <div className="flex-1 flex items-center justify-center p-4 text-xs text-gray-400 italic">Sign data unavailable for calculation</div>
      </div>
    );
  }

  const suggest = (houseIdx) => {
    // Standard Vedic House offset from Lagna
    const signIdx = (lagnaSignIndex + houseIdx - 1) % 12;
    const lord = SIGN_LORDS[signIdx];
    return { ...GEMSTONES[lord], lord, sign: SIGNS[signIdx], house: houseIdx };
  };

  const stones = [
    { label: "Life Stone (Tanu Lord)", ...suggest(1) },
    { label: "Lucky Stone (Putra Lord)", ...suggest(5) },
    { label: "Fortune Stone (Bhagya Lord)", ...suggest(9) }
  ];

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7]">
      <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase italic tracking-widest">Ratna Suggestions (Gemstones)</div>
      <div className="flex-1 overflow-auto p-2 space-y-2 custom-scrollbar">
        {stones.map((s, idx) => (
          <div key={idx} className={`p-2 rounded-lg border bg-gradient-to-br ${s.bg} ${s.border} shadow-sm transition-all hover:shadow-md cursor-default`}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[7px] uppercase font-bold text-gray-500 tracking-wider bg-white/40 px-1 rounded">{s.label}</span>
              <span className="text-[8px] font-mono font-black text-gray-700">{s.lord}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded shadow-inner flex items-center justify-center text-lg bg-white/30 backdrop-blur-sm" style={{ border: `1px solid ${s.color}44` }}>
                {s.name === 'Ruby' && '💎'}
                {s.name === 'Pearl' && '⚪'}
                {s.name === 'Red Coral' && '🏮'}
                {s.name === 'Emerald' && '💚'}
                {s.name === 'Yellow Sapphire' && '🟡'}
                {s.name === 'Diamond' && '💍'}
                {s.name === 'Blue Sapphire' && '💙'}
              </div>
              <div className="flex-1">
                <div className={`text-[11px] font-black ${s.text} uppercase tracking-tighter`}>{s.name}</div>
                <div className="text-[9px] text-gray-500 font-serif italic">{s.hindi}</div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-[8px] text-gray-500 bg-white/20 px-1 rounded">House {s.house}</span>
                <span className="text-[8px] font-bold text-gray-600">{s.sign}</span>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-amber-50 border border-amber-100 p-1.5 rounded text-[8px] text-amber-800 leading-tight">
          <b>Note:</b> These are primary stones based on lagna lordship. Verify planet strength (Shadbala) and position (Dignity) before wearing.
        </div>
      </div>
    </div>
  );
};

// Dignity lookup for all 9 planets
const PLANET_DIGNITY = {
  Sun: { exaltation: ['Aries'], debilitation: ['Libra'], own: ['Leo'], friendly: ['Aries', 'Sagittarius', 'Cancer', 'Scorpio', 'Pisces'], enemy: ['Aquarius', 'Capricorn', 'Libra', 'Virgo'] },
  Moon: { exaltation: ['Taurus'], debilitation: ['Scorpio'], own: ['Cancer'], friendly: ['Aries', 'Leo', 'Sagittarius', 'Gemini', 'Libra', 'Aquarius'], enemy: [] },
  Mars: { exaltation: ['Capricorn'], debilitation: ['Cancer'], own: ['Aries', 'Scorpio'], friendly: ['Leo', 'Sagittarius', 'Pisces'], enemy: ['Gemini', 'Virgo'] },
  Mercury: { exaltation: ['Virgo'], debilitation: ['Pisces'], own: ['Gemini', 'Virgo'], friendly: ['Aries', 'Taurus', 'Libra', 'Capricorn'], enemy: ['Cancer', 'Scorpio'] },
  Jupiter: { exaltation: ['Cancer'], debilitation: ['Capricorn'], own: ['Sagittarius', 'Pisces'], friendly: ['Aries', 'Leo', 'Scorpio'], enemy: ['Gemini', 'Virgo', 'Libra', 'Capricorn'] },
  Venus: { exaltation: ['Pisces'], debilitation: ['Virgo'], own: ['Taurus', 'Libra'], friendly: ['Gemini', 'Virgo', 'Capricorn', 'Aquarius'], enemy: ['Aries', 'Scorpio', 'Cancer', 'Leo'] },
  Saturn: { exaltation: ['Libra'], debilitation: ['Aries'], own: ['Capricorn', 'Aquarius'], friendly: ['Gemini', 'Virgo', 'Taurus', 'Libra'], enemy: ['Aries', 'Cancer', 'Leo', 'Scorpio'] },
  Rahu: { exaltation: ['Gemini'], debilitation: ['Sagittarius'], own: ['Gemini'], friendly: ['Libra', 'Taurus', 'Virgo', 'Capricorn', 'Pisces', 'Aries', 'Aquarius'], enemy: ['Leo', 'Cancer'] },
  Ketu: { exaltation: ['Sagittarius'], debilitation: ['Gemini'], own: ['Scorpio'], friendly: ['Libra', 'Taurus', 'Virgo', 'Capricorn', 'Pisces', 'Aries', 'Aquarius'], enemy: ['Leo', 'Cancer'] },
};

const getDignityStatus = (planet, signName) => {
  const d = PLANET_DIGNITY[planet];
  if (!d) return null;
  if (d.exaltation.includes(signName)) return { label: 'Exalted ★', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' };
  if (d.debilitation.includes(signName)) return { label: 'Debilitated ↓', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
  if (d.own.includes(signName)) return { label: 'Own Sign ◆', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
  if (d.friendly.includes(signName)) return { label: 'Friendly ♥', bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' };
  if (d.enemy.includes(signName)) return { label: 'Enemy ✕', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' };
  return { label: 'Neutral', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
};

const TransitPanel = ({ data, transitPositions }) => {
  const lagnaHouse = data.charts?.houses?.[1] || data.charts?.houses?.["1"] || {};
  let lagnaSignIndex = lagnaHouse.sign_index;
  if (lagnaSignIndex === undefined && lagnaHouse.cusp_deg !== undefined) {
    lagnaSignIndex = Math.floor(lagnaHouse.cusp_deg / 30);
  }
  if (lagnaSignIndex === undefined) {
    lagnaSignIndex = data.charts?.ascendant_sign_index;
  }

  if (lagnaSignIndex === undefined || !transitPositions) {
    return (
      <div className="flex flex-col h-full bg-[#fdfbf7]">
        <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase italic tracking-widest">Today's Transit</div>
        <div className="flex-1 flex items-center justify-center p-4 text-xs text-gray-400 italic">
          {!transitPositions ? "Fetching Transit Data..." : "Lagna data unavailable"}
        </div>
      </div>
    );
  }

  // Map transits to houses relative to Natal Lagna
  const transitHouses = {};
  const transitEffects = {}; // Add transitEffects object
  for (let i = 1; i <= 12; i++) {
    const signIdx = (lagnaSignIndex + i - 1) % 12;
    transitHouses[i] = {
      house_number: i,
      sign_index: signIdx,
      planets: []
    };
  }

  Object.entries(transitPositions).forEach(([planet, pos]) => {
    // Basic Vedic planets only for transit chart usually
    const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    if (!valid.includes(planet)) return;

    const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor(pos.sidereal.lon / 30);
    const houseNum = (signIdx - lagnaSignIndex + 12) % 12 + 1;
    if (transitHouses[houseNum]) {
      const isRetro = pos.is_retrograde || pos.sidereal?.is_retrograde;
      const isCombust = pos.is_combust || pos.sidereal?.is_combust;

      transitHouses[houseNum].planets.push({
        name: planet,
        is_retrograde: isRetro,
        is_combust: isCombust
      });
      // Determine effect based on house position relative to Lagna
      // Kendra (1,4,7,10) and Kon (1,5,9) are generally considered positive in transit apps
      if ([1, 4, 5, 7, 9, 10].includes(houseNum)) {
        transitEffects[planet] = "positive";
      } else if ([6, 8, 12].includes(houseNum)) {
        transitEffects[planet] = "negative";
      } else {
        transitEffects[planet] = "neutral";
      }
    }
  });

  // Add Natal Lagna (L) to House 1 as a reference
  if (transitHouses[1]) {
    transitHouses[1].planets.unshift("Ascendant");
    transitEffects["Ascendant"] = "neutral";
  }

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7]">
      <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase italic tracking-widest flex-shrink-0">
        Today's Transit (Gochar)
      </div>
      <div className="flex-1 p-1 bg-white overflow-auto custom-scrollbar">
        <div className="mb-4">
          <ZodiacChart houses={transitHouses} title="" variant="legacy" planetEffects={transitEffects} />
        </div>

        {/* Planet in Sign & House Analysis Section */}
        <div className="p-2 bg-slate-50 border-t border-slate-200 mt-2">
          <h3 className="text-[10px] font-black uppercase tracking-tight mb-3 text-slate-800 text-center">Transit Planet in Sign & House Analysis</h3>
          <div className="space-y-3">
            {Object.entries(transitPositions).map(([planet, pos]) => {
              const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
              if (!valid.includes(planet)) return null;

              const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor(pos.sidereal.lon / 30);
              const transitHouse = ((signIdx - lagnaSignIndex + 12) % 12) + 1;
              const signName = SIGNS[signIdx];
              const isRetro = pos.is_retrograde || pos.sidereal?.is_retrograde;
              const isCombust = pos.is_combust || pos.sidereal?.is_combust;

              // Look up planet-in-sign data from database
              const planetData = PLANET_IN_SIGN_EFFECTS[planet];
              const signData = planetData?.signs?.[signName];
              const signEffect = signData?.effect;
              const houseEffect = signData?.houses?.[String(transitHouse)];

              const houseLabel = transitHouse === 1 ? '1st' : transitHouse === 2 ? '2nd' : transitHouse === 3 ? '3rd' : `${transitHouse}th`;
              const houseBorderColor = [1, 4, 5, 9, 10].includes(transitHouse) ? 'border-l-green-400' :
                [6, 8, 12].includes(transitHouse) ? 'border-l-red-400' :
                  'border-l-indigo-300';

              // Dignity status
              const dignity = getDignityStatus(planet, signName);

              return (
                <section key={planet} className={`bg-white rounded-xl border border-indigo-100 shadow-sm border-l-4 ${houseBorderColor} overflow-hidden relative`}>
                  {/* Watermark house number */}
                  <div className="absolute top-0 right-0 p-3 opacity-[0.04] text-6xl font-black text-indigo-900 pointer-events-none select-none">{transitHouse}</div>

                  {/* Planet header — matches Lagna HouseEffectTable style */}
                  <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-sm shadow-md border border-white/10 flex-shrink-0">✨</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-black uppercase tracking-tight leading-none" style={{ color: PLANET_COLORS[planet] || '#1e293b' }}>
                          {planet}{isRetro ? '*' : ''}{isCombust ? '#' : ''} Transit
                        </h4>
                        {dignity && (
                          <span className={`text-[7px] px-1.5 py-0.5 rounded font-black uppercase border ${dignity.bg} ${dignity.text} ${dignity.border}`}>
                            {dignity.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{signName} · House {houseLabel}</span>
                        {isRetro && <span className="text-[7px] px-1 bg-amber-100 text-amber-700 rounded font-black uppercase">Vakri ℞</span>}
                        {isCombust && <span className="text-[7px] px-1 bg-red-100 text-red-700 rounded font-black uppercase">Combust</span>}
                      </div>
                    </div>
                  </div>

                  {/* Body — font-serif text-sm matching BulletInterpretation */}
                  <div className="px-4 pb-4 space-y-3">
                    {signEffect ? (
                      <div>
                        <p className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest mb-1">In {signName}</p>
                        <p className="text-sm leading-relaxed text-slate-700 font-serif">
                          {signEffect.length > 300 ? signEffect.slice(0, 300) + '…' : signEffect}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic font-serif">Sign interpretation coming soon.</p>
                    )}
                    {houseEffect && (
                      <div className="pt-3 border-t border-indigo-50">
                        <p className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest mb-1">In {houseLabel} House (Transiting)</p>
                        <p className="text-sm leading-relaxed text-slate-700 font-serif">
                          {houseEffect.length > 350 ? houseEffect.slice(0, 350) + '…' : houseEffect}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
          <p className="text-[7.5px] text-center text-slate-400 italic mt-3">House colors: 🟢 Kendra/Trikona · 🔴 Dusthana · Dignity: <span className="text-emerald-700 font-bold">Exalted★</span> · <span className="text-red-700 font-bold">Debilitated↓</span> · <span className="text-blue-700 font-bold">Own◆</span> · <span className="text-sky-600 font-bold">Friendly♥</span> · <span className="text-orange-700 font-bold">Enemy✕</span></p>
        </div>
      </div>
      <div className="flex-shrink-0 p-1 px-2 bg-[#f1f5f9] border-t border-gray-300 flex justify-between items-center text-[7px] text-gray-500 uppercase font-black">
        <span>From Natal Lagna</span>
        <span className="text-blue-600 font-bold">{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const CurrentPositionsDashboard = ({ initialData }) => {
  const [transitPositions, setTransitPositions] = useState(null);

  useEffect(() => {
    const fetchTransit = () => {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0];
      const tz_offset = (now.getTimezoneOffset() / -60.0).toFixed(1);
      const lat = initialData?.basic_details?.lat || 28.6;
      const lon = initialData?.basic_details?.lon || 77.2;

      fetch(`/api/horoscope/positions?date=${dateStr}&time=${timeStr}&tz_offset=${tz_offset}&lat=${lat}&lon=${lon}`)
        .then(res => res.json())
        .then(json => {
          if (json.positions) setTransitPositions(json.positions);
        })
        .catch(err => console.error("Transit fetch failed", err));
    };
    fetchTransit();
  }, []);

  if (!transitPositions) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-indigo-300 font-serif italic text-lg animate-pulse">Calculating Celestial Positions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-4 md:p-10 font-serif overflow-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-[10rem] font-serif pointer-events-none group-hover:scale-110 transition-transform duration-1000 uppercase">NOW</div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-2">Real-time Transit Analysis</h2>
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-indigo-400">
              <span>Planetary Movements</span>
              <span className="w-8 h-[1px] bg-indigo-800"></span>
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 left-6 z-20 px-4 py-1.5 bg-indigo-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Current Gochar Map</div>
            <div className="mt-8">
              <TransitPanel data={initialData} transitPositions={transitPositions} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl">
              <h3 className="text-xl font-black uppercase tracking-tight mb-8 text-slate-800 border-b border-slate-100 pb-4">Planetary Coordinates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(transitPositions).map(([planet, pos]) => {
                  const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
                  if (!valid.includes(planet)) return null;
                  const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor(pos.sidereal.lon / 30);

                  const isRetro = pos.is_retrograde || pos.sidereal?.is_retrograde;
                  const isCombust = pos.is_combust || pos.sidereal?.is_combust;

                  return (
                    <div key={planet} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 transition-colors group">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-tight">{planet}</p>
                          {isRetro && <span className="text-[7px] px-1 bg-amber-100 text-amber-700 rounded font-black uppercase tracking-tighter">Vakri</span>}
                          {isCombust && <span className="text-[7px] px-1 bg-red-100 text-red-700 rounded font-black uppercase tracking-tighter">Asth</span>}
                        </div>
                        <p className="text-xs font-bold text-slate-800 uppercase group-hover:text-indigo-900 transition-colors">{SIGNS[signIdx]}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-indigo-600">{(pos.sidereal?.fullDegree || pos.sidereal?.lon || 0).toFixed(2)}°</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              <div className="relative z-10 text-center space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-indigo-300 opacity-60">Diagnostic Insight</p>
                <p className="text-sm font-serif italic leading-relaxed">
                  Transit analysis shows how current planetary movements interact with your Natal Lagna.
                  The chart on the left illustrates the real-time position of planets relative to your birth signature.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Gochar Analysis Section */}
        <div className="mt-12 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-8 text-slate-800 border-b border-slate-100 pb-4">Detailed Gochar Analysis (गोचर फल)</h3>
          <div className="space-y-6">
            {Object.entries(transitPositions).map(([planet, pos]) => {
              const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
              if (!valid.includes(planet)) return null;

              const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor(pos.sidereal.lon / 30);

              const lagnaHouse = initialData?.charts?.houses?.[1] || initialData?.charts?.houses?.["1"] || {};
              let lagnaSignIndex = lagnaHouse.sign_index;
              if (lagnaSignIndex === undefined && lagnaHouse.cusp_deg !== undefined) {
                lagnaSignIndex = Math.floor(lagnaHouse.cusp_deg / 30);
              }
              if (lagnaSignIndex === undefined) {
                lagnaSignIndex = initialData?.charts?.ascendant_sign_index;
              }
              if (lagnaSignIndex === undefined) lagnaSignIndex = 0;

              const transitHouse = ((signIdx - lagnaSignIndex + 12) % 12) + 1;

              const HINDI_PLANETS = {
                "Sun": "सूर्य", "Moon": "चंद्र", "Mars": "मंगल", "Mercury": "बुध", "Jupiter": "गुरु", "Venus": "शुक्र", "Saturn": "शनि", "Rahu": "राहु", "Ketu": "केतु"
              };
              const HINDI_SIGNS = [
                "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
              ];
              const GOCHAR_TEXTS = {
                "Sun": "यह एक कठिन काल सिद्ध होगा। कड़ी मेहनत का अच्छा फल नहीं मिलेगा। व्यवसायिक या व्यापार के साथी नुकसान करेंगे और आपके लिये समस्यायें पैदा कर देंगे। घरेलु झंझटों में अपने मिजाज पर काबू रखें अन्यथा अप्रीतिकर स्थितियां झेलनी पड़ सकतीं हैं। आप भी मानसिक रूप से तनावग्रस्त और बीमार रह सकते हैं।",
                "Moon": "यह बहुत अच्छा समय है। आप सुखी और विलासपूर्ण जीवन व्यतीत करेंगे। विलास सामग्री पर भी खर्च करेंगे। मां बाप से संबंध बहुत मधुर रहेंगे। अगर नौकरी करते हैं तो पदोन्नति प्राप्त करेंगे। शत्रुओं पर विजय पायेंगे। आमदनी में काफी इजाफा होगा।",
                "Mars": "इस अवधि में आप काफी सुखी रहेंगे। नौकरी के हालात सुधरेंगे। प्रचुर लाभ होने की संभावना है। पारिवारिक वातावरण भी सुखद रहेगा। आप अपनी अड़चनें और बाधाएं दूर करने और शत्रुओं का दमन करने के लिये चेष्टारत रहेंगे। कार इत्यादि चलाते समय सावधानी बरतें।",
                "Mercury": "इस अवधि में आपकी प्रसिद्धि एवम् सम्मान में इजाफा होगा। विद्वानों के साथ रहने का मौका आयेगा। आपका व्यापार या व्यवसाय बढ़ेगा और चमकेगा। स्त्री वर्ग से आपके क्षेत्र में सहायता मिलेगी। सुखद यात्रा की भी संभावना है। लाभप्रद सौदा करेंगे और आपके भागीदार व सहयोगी आपको अपना बेहतर सहयोग देंगे। किसी प्रतिस्पर्धा में भी सफल रहना निश्चित है।",
                "Jupiter": "इस वर्ष यह अवधि आपके लिये सर्वश्रेष्ठ सिद्ध होगी। आप प्रचुर सफलता और सम्मान प्राप्त करेंगे। इस अवधि का उपयोग आप मन को एकाग्र करने समाधि और योग क्रियाओं को करने के लिए भी कर सकते हैं। धार्मिक और सामाजिक क्षेत्र के किसी मुखिया से भी आपका सम्पर्क हो सकता है। अपने काम को पूरा करने के लिये आप में प्रचुर उत्साह और विश्वास रहेगा। परिवारिक माहौल से भी सहारा मिलेगा। लम्बी यात्रा सफलदायक सिद्ध होगी। परिवार में नये सदस्य की बढोत्तरी होगी।",
                "Venus": "किसी बदनामी देने वाले काण्ड में फंसने के कारण आपकी प्रतिष्ठा पर आंच आयेगी। स्वास्थ्य के लिहाज से भी यह कोई अच्छा समय नहीं है। अचानक धन प्रात की संभावना है। लेकिन साथ ही साथ खर्चे भी बढेंगे। गुप्त और निगूढ सुखों को भोगने वाली प्रवृति पर अंकुश लगाये नहीं तो बड़ी शर्मनाक स्थिति का सामना करना पड़ सकता है। वैसे परिवारजनों का सहयोग पूरा रहेगा। यद्यपि कभी कभी मतभेद भी रह सकता है। जहां तक संभव हो यात्राएं न करें।",
                "Saturn": "आप अपने कार्यक्षेत्र में बहुत अच्छा काम करेंगे। नौकरी या व्यवसाय की परिस्थितियों में काफी सुधार आएगा। प्रभावशाली व्यक्तियों से आपके सम्पर्क बढेंगे। रोजमर्रा के जीवन में आप अत्यधिक स्फूर्तिवान महसूस करेंगे। विरोधियों की आपके सामने पड़ने की हिम्मत ही नहीं पड़ेगी। आर्थिक रूप से यह बहुत अच्छा समय सिद्ध होगा। छोटी यात्राएं उपयोगी रहेंगी। परिवार का माहौल पूर्ण संतोषप्रद रहेगा। इस अवधि के मध्य में छोटी मोटी बीमारी होने की संभावना है जिस पर आपको थोड़ा बहुत ध्यान रखने की आवश्यकता है।",
                "Rahu": "सही निर्णय लेने की आपकी क्षमता और योग्यता पर बुरा प्रभाव पड़ेगा। आप अपने आस पास भ्रम का विश्व बना लेना चाहेंगे। झूठी आशाएं आपके लक्ष्य को भ्रमित कर देंगी। सट्टेबाजी की प्रवृति पर पूरा अंकुश लगाये। मित्रों से संबंध मधुर नहीं रहेंगे। किसी मुकदमेबाजी के चक्कर में अपने आपको न फंसायें। किसी के जमानती बनने की चेष्टा न करें। अपने स्वास्थ्य का ख्याल रखें। फूड पाइजनिंग के कारण पेट के रोग उभर सकते हैं।",
                "Ketu": "अचानक परिस्थितियां आपके काफी अनुकूल होती जायेंगी। कुछ व्यापारिक सौदे आपको काफी लाभावत कर देंगे। मित्र और हितैषियों का पूरा सहयोग रहेगा। उच्च कोटि के शारीरिक या मांसल सुख आपको प्राप्त होंगे। अगर नौकरीपेशा हैं तो पदोन्नति प्राप्त करेंगे। इस अवधि में लम्बी यात्रा की भी प्रबल संभावना है। पारिवारिक जीवन संतोष प्रदान करेगा। सामाजिक क्षेत्र में आप प्रचुर प्रतिष्ठा और सम्मान के भागी होंगे।"
              };

              const pName = HINDI_PLANETS[planet] || planet;
              const sName = HINDI_SIGNS[signIdx] || "";

              return (
                <div key={planet} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="text-xl font-bold text-indigo-900 mb-3 border-b border-slate-200 pb-2">
                    {pName} {sName} राशि में आपके भाव {transitHouse} में स्थित है
                  </h4>
                  <p className="text-gray-700 leading-relaxed font-serif text-lg">
                    {GOCHAR_TEXTS[planet]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

const TransitGemstonePanel = ({ data, transitPositions }) => {
  const lagnaHouse = data.charts?.houses?.[1] || data.charts?.houses?.["1"] || {};
  let lagnaSignIndex = lagnaHouse.sign_index;
  if (lagnaSignIndex === undefined && lagnaHouse.cusp_deg !== undefined) {
    lagnaSignIndex = Math.floor(lagnaHouse.cusp_deg / 30);
  }
  if (lagnaSignIndex === undefined) {
    lagnaSignIndex = data.charts?.ascendant_sign_index;
  }

  if (lagnaSignIndex === undefined || !transitPositions) {
    return (
      <div className="flex flex-col h-full bg-[#fdfbf7]">
        <div className="w-full text-center py-1 border-b bg-[#e2e8f0] border-[#94a3b8] text-[#1e293b] font-serif font-bold text-xs uppercase italic tracking-widest">Gochar Suggestions</div>
        <div className="flex-1 flex items-center justify-center p-4 text-xs text-gray-400 italic">
          {!transitPositions ? "Fetching Transit Data..." : "Lagna data unavailable"}
        </div>
      </div>
    );
  }

  const getTransitHouse = (lord) => {
    const pos = transitPositions[lord];
    if (!pos) return null;
    const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor(pos.sidereal.lon / 30);
    return (signIdx - lagnaSignIndex + 12) % 12 + 1;
  };

  const suggestions = [
    { label: "Life Stone (1st Lord)", lord: SIGN_LORDS[lagnaSignIndex], role: "Health & Vitality" },
    { label: "Lucky Stone (5th Lord)", lord: SIGN_LORDS[(lagnaSignIndex + 4) % 12], role: "Knowledge & Luck" },
    { label: "Fortune Stone (9th Lord)", lord: SIGN_LORDS[(lagnaSignIndex + 8) % 12], role: "Fortune & Faith" },
  ].map(s => {
    const transitHouse = getTransitHouse(s.lord);
    const info = GEMSTONES[s.lord];
    let advice = "";
    let status = "neutral";

    if (transitHouse === 1 || transitHouse === 4 || transitHouse === 5 || transitHouse === 7 || transitHouse === 9 || transitHouse === 10) {
      advice = `Auspicious transit in House ${transitHouse}. Highly effective now.`;
      status = "positive";
    } else if (transitHouse === 6 || transitHouse === 8 || transitHouse === 12) {
      advice = `Critical transit in House ${transitHouse}. Strengthen lord now.`;
      status = "warning";
    } else {
      advice = `Stable transit in House ${transitHouse}. Good for consistent flow.`;
      status = "neutral";
    }

    return { ...s, ...info, transitHouse, advice, status };
  });

  return (
    <div className="flex flex-col h-full bg-[#f8fbff]">
      <div className="w-full text-center py-1 border-b bg-[#dbeafe] border-[#93c5fd] text-[#1e40af] font-serif font-bold text-xs uppercase italic tracking-widest flex items-center justify-center gap-2">
        ✨ Live Transit Ratna Guide
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-2 custom-scrollbar">
        {suggestions.map((s, idx) => (
          <div key={idx} className={`p-2 rounded border bg-white shadow-sm transition-all border-l-4 ${s.status === 'positive' ? 'border-green-400' : s.status === 'warning' ? 'border-amber-400' : 'border-blue-400'}`}>
            <div className="flex justify-between items-start mb-1">
              <span className="text-[7px] uppercase font-bold text-blue-600 bg-blue-50 px-1 rounded">{s.label}</span>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono font-black text-gray-700">{s.lord}</span>
                <span className="text-[6px] text-gray-400 italic">Transiting H{s.transitHouse}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded shadow-inner flex items-center justify-center text-md bg-gray-50 border border-gray-100">
                {s.name === 'Ruby' && '💎'}
                {s.name === 'Pearl' && '⚪'}
                {s.name === 'Red Coral' && '🏮'}
                {s.name === 'Emerald' && '💚'}
                {s.name === 'Yellow Sapphire' && '🟡'}
                {s.name === 'Diamond' && '💍'}
                {s.name === 'Blue Sapphire' && '💙'}
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black uppercase text-gray-800">{s.name}</div>
                <div className="text-[7.5px] text-gray-500 font-serif leading-none mt-0.5">{s.advice}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="text-[7.5px] text-blue-800 italic text-center p-1 bg-blue-50/50 rounded leading-tight">
          Current transits change planetary effectiveness. Check daily for optimal stone selection.
        </div>
      </div>
    </div>
  );
};



const WorksheetCell = ({ contentId, data, transitPositions, onSelectContent, onPlanetClick, onFullScreen }) => {
  const [showSelector, setShowSelector] = useState(false);
  const planetEffects = calculatePlanetEffects(data);

  const renderContent = () => {
    if (!data) return <div className="p-4 text-xs text-gray-400">No data</div>;

    if (contentId.startsWith('d') && contentId !== 'dignity' && contentId !== 'dasha') {
      const vData = (contentId === 'd1') ? data.charts : data.vargas?.[contentId];
      const title = CELL_CONTENTS.find(c => c.id === contentId)?.label || contentId.toUpperCase();
      return <ZodiacChart houses={vData?.houses} onPlanetClick={onPlanetClick} title={title} variant="legacy" planetEffects={planetEffects} />;
    }

    switch (contentId) {
      case "lagna":
        return (
          <div className="h-full flex flex-col overflow-auto custom-scrollbar">
            <div className="shrink-0">
              <ZodiacChart houses={data.charts?.houses} onPlanetClick={onPlanetClick} title="Lagna Chart" variant="legacy" planetEffects={planetEffects} />
            </div>
            <div className="px-2 pb-4">
              <HouseEffectTable data={data} planetEffects={planetEffects} />
              <ConjunctionAnalysis houses={data.charts?.houses} />
            </div>
          </div>
        );
      case "planets_table":
        return <PlanetTable data={data} onPlanetClick={onPlanetClick} />;
      case "panchang":
        return <PanchangPanel data={data} />;
      case "numerical":
        return <NumericalPanel data={data} />;
      case "shodashottari":
        return <SecondaryDashaPanel data={data} type="shodashottari" />;
      case "chaturshitisama":
        return <SecondaryDashaPanel data={data} type="chaturshitisama" />;
      case "dignity":
        return <DignityTable data={data} planetEffects={planetEffects} />;
      case "vimsopaka":
        return <VimsopakaAssessment data={data} />;
      case "vimshottari":
        return <VimshottariPanel data={data} />;
      case "shadbala":
        return <ShadbalaChart data={data.strength} title="Shad Bala" />;
      case "gemstones":
        return <GemstonePanel data={data} />;
      case "transit":
        return <TransitPanel data={data} transitPositions={transitPositions} />;
      case "transit_gemstones":
        return <TransitGemstonePanel data={data} transitPositions={transitPositions} />;
      default:
        // Handle Oracle categories in the grid
        const oracleItem = oracle_items.find(item => item.id === contentId);
        if (oracleItem) {
          return (
            <div className="h-full flex flex-col items-center justify-center p-4 bg-slate-50 text-center gap-3">
              <div className="text-4xl">{oracleItem.icon}</div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">{oracleItem.label}</h4>
              <button
                onClick={() => handleOracleClick(contentId)}
                className="px-4 py-1.5 bg-indigo-600 text-black text-[10px] font-bold rounded uppercase tracking-wider shadow-md hover:bg-indigo-700 transition-all active:scale-95"
              >
                Open Premium Report
              </button>
            </div>
          );
        }
        return <div className="flex items-center justify-center min-h-[100px] text-gray-300 italic border-dashed border-2 m-2">Empty Cell ({contentId})</div>;
    }
  };

  return (
    <div className="relative group border border-gray-400 bg-white shadow-sm overflow-hidden h-full flex flex-col p-0.5 min-h-[150px]">
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
        {contentId && contentId !== "empty" && (
          <button
            onClick={() => onFullScreen?.(contentId)}
            className="bg-gray-800/80 text-black rounded p-1 text-[10px] shadow hover:bg-black hover:text-white"
            title="Full Screen"
          >
            ⛶
          </button>
        )}
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="bg-gray-800/80 text-black rounded p-1 text-[10px] shadow hover:bg-black hover:text-white"
        >
          {showSelector ? "Cancel" : "⚙️"}
        </button>
      </div>

      {showSelector ? (
        <div className="absolute inset-0 bg-white z-20 overflow-hidden p-3 flex flex-col border-2 border-indigo-100 rounded-lg shadow-inner">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <h4 className="text-[10px] font-black text-indigo-900/40 uppercase tracking-[0.2em]">Select Content</h4>
            <span className="text-[8px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">2-LINE GRID</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            <div className="grid grid-cols-2 gap-1.5 pb-2">
              {CELL_CONTENTS.map(c => (
                <button
                  key={c.id}
                  onClick={() => { onSelectContent(c.id); setShowSelector(false); }}
                  className={`text-[9px] text-left p-2 rounded-lg border transition-all uppercase font-bold tracking-tight leading-none h-[40px] flex items-center justify-center text-center ${contentId === c.id
                    ? 'bg-indigo-600 text-black border-indigo-700 shadow-md ring-2 ring-indigo-200'
                    : 'bg-slate-50 text-black border-slate-200 hover:border-indigo-400 hover:bg-white hover:shadow-sm hover:text-indigo-600'
                    }`}
                >
                  {c.label.split(' - ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 w-full relative">
          {renderContent()}
        </div>
      )}
    </div>
  );
};


const InteractiveWorksheet = ({ data: incomingData, fullScreenInitial = null }) => {
  const [data, setData] = useState(incomingData);

  const processVedicData = (incoming) => {
    if (!incoming) return null;

    // 1. Calculate and map planetary status
    const sunPos = incoming.planet_positions?.find(p => p.planet === "Sun")?.degree;
    const COMBUSTION_LIMITS = {
      "Moon": 12, "Mars": 17, "Mercury": 14, "Jupiter": 11, "Venus": 10, "Saturn": 15
    };

    const normalizedPositions = (incoming.planet_positions || []).map(p => {
      const is_retrograde = p.is_retrograde !== undefined ? p.is_retrograde : (p.retrograde || false);
      let is_combust = p.is_combust || false;

      if (sunPos !== undefined && COMBUSTION_LIMITS[p.planet] && p.planet !== "Sun") {
        let diff = Math.abs(p.degree - sunPos);
        if (diff > 180) diff = 360 - diff;
        const limit = (p.planet === "Mercury" && is_retrograde) ? 12 :
          (p.planet === "Venus" && is_retrograde) ? 8 :
            COMBUSTION_LIMITS[p.planet];
        if (diff <= limit) is_combust = true;
      }
      return { ...p, is_retrograde, is_combust };
    });

    const posMap = normalizedPositions.reduce((acc, p) => {
      acc[p.planet] = p;
      return acc;
    }, {});

    // 2. Helper to enrich house data
    const enrichHouses = (houses) => {
      if (!houses) return houses;
      const enriched = { ...houses };
      Object.keys(enriched).forEach(h => {
        if (enriched[h].planets) {
          enriched[h].planets = enriched[h].planets.map(p => {
            const name = typeof p === 'string' ? p : (p.planet || p.name);
            const pos = posMap[name];
            return pos ? { name, is_retrograde: pos.is_retrograde, is_combust: pos.is_combust } : p;
          });
        }
      });
      return enriched;
    };

    // 3. Deep copy and enrich charts
    const processed = { ...incoming, planet_positions: normalizedPositions };
    if (processed.charts) {
      processed.charts = { ...processed.charts, houses: enrichHouses(processed.charts.houses) };
    }
    if (processed.vargas) {
      const enrichedVargas = {};
      Object.keys(processed.vargas).forEach(vKey => {
        enrichedVargas[vKey] = {
          ...processed.vargas[vKey],
          houses: enrichHouses(processed.vargas[vKey].houses)
        };
      });
      processed.vargas = enrichedVargas;
    }

    return processed;
  };

  useEffect(() => {
    if (incomingData) {
      const processed = processVedicData(incomingData);
      setData(processed);
      localStorage.setItem('worksheetData', JSON.stringify(processed));
    } else if (!data) {
      const saved = localStorage.getItem('worksheetData');
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to restore worksheet data", e);
        }
      }
    }
  }, [incomingData]);

  // Debug log to help identify missing fields in local development
  useEffect(() => {
    if (data) {
      console.log("Worksheet Data received:", {
        id: data.meta?.name,
        panchang: !!data.panchang,
        shodashottari: data.shodashottari?.length,
        chaturshitisama: data.chaturshitisama?.length,
        favourable: !!data.favourable?.numerology
      });
    }
  }, [data]);

  const [upperRightChart, setUpperRightChart] = useState("d9");
  const [lowerCells, setLowerCells] = useState(["vimshottari", "gemstones", "dignity", "shadbala"]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [transitPositions, setTransitPositions] = useState(null);

  const oracle_items = [
    { id: "ascendant", label: "Ascendant", icon: "👤", color: "from-stone-500 to-stone-700" },
    { id: "study", label: "Study", icon: "📚", color: "from-red-500 to-black-600" },
    { id: "career", label: "Career", icon: "💼", color: "from-slate-700 to-slate-900" },
    { id: "finance", label: "Finance", icon: "💰", color: "from-emerald-500 to-teal-700" },
    { id: "marriage", label: "Marriage", icon: "💍", color: "from-rose-400 to-pink-600" },
    { id: "business", label: "Business", icon: "💹", color: "from-amber-500 to-orange-700" },
    { id: "health", label: "Health", icon: "🏥", color: "from-red-500 to-red-700" },
    { id: "parents_health", label: "Parents Health", icon: "👨‍👩‍👧", color: "from-sky-500 to-blue-700" },
    { id: "spouse_health", label: "Spouse Health", icon: "💑", color: "from-fuchsia-500 to-purple-700" },
    { id: "children_health", label: "Childrens Health", icon: "👶", color: "from-lime-500 to-green-700" },
    { id: "mental_peace", label: "Mental Peace", icon: "🧘", color: "from-violet-500 to-purple-800" },
    { id: "home_peace", label: "Ghar me Sukh Shanti", icon: "🏡", color: "from-orange-400 to-red-600" },
    { id: "manglik", label: "Manglik", icon: "🔴", color: "from-red-600 to-red-800" },
    { id: "kalsarp", label: "Kalsarp Dosha", icon: "🐍", color: "from-slate-800 to-black" },
    { id: "pitra", label: "Pitra Dosha", icon: "🕯️", color: "from-amber-700 to-amber-900" },
    { id: "sadesati", label: "Sadesati", icon: "⚖️", color: "from-blue-900 to-slate-900" },
    { id: "rahu", label: "Rahu Dosha", icon: "🌑", color: "from-teal-800 to-emerald-900" },
    { id: "ketu", label: "Ketu Dosha", icon: "💥", color: "from-orange-800 to-red-900" },
    { id: "loshu", label: "Lo Shu Grid", icon: "🔢", color: "from-indigo-500 to-blue-700" },
    { id: "lalkitab", label: "Lal Kitab", icon: "📖", color: "from-orange-500 to-red-600" },
    { id: "daily_panchang", label: "Daily Panchang", icon: "🗞️", color: "from-amber-600 to-orange-800" },
    { id: "horary", label: "Horary Astrology", icon: "🕒", color: "from-blue-600 to-indigo-800" },
    { id: "chakra", label: "Sudarshan Chakra", icon: "☸️", color: "from-purple-600 to-indigo-900" },
    { id: "yantra", label: "Yantra Suggestion", icon: "🔱", color: "from-red-600 to-amber-800" },
  ];

  useEffect(() => {
    if (data) {
      localStorage.setItem('worksheetData', JSON.stringify(data));

      if (!transitPositions) {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0];
        const tz_offset = (now.getTimezoneOffset() / -60.0).toFixed(1);
        const lat = data?.basic_details?.lat || 28.6;
        const lon = data?.basic_details?.lon || 77.2;

        fetch(`/api/horoscope/positions?date=${dateStr}&time=${timeStr}&tz_offset=${tz_offset}&lat=${lat}&lon=${lon}`)
          .then(res => res.json())
          .then(json => {
            if (json.positions) setTransitPositions(json.positions);
          })
          .catch(err => console.error("Transit fetch failed", err));
      }
    }
  }, [data]);

  const handleMaximizeInNewWindow = (id) => {
    const oracleIds = [
      'ascendant', 'study', 'career', 'marriage', 'finance', 'business', 'health',
      'parents_health', 'spouse_health', 'children_health', 'mental_peace',
      'home_peace', 'manglik', 'kalsarp', 'pitra', 'sadesati', 'rahu', 'ketu', 'loshu',
      'lalkitab', 'daily_panchang', 'horary', 'chakra', 'yantra'
    ];
    if (oracleIds.includes(id)) {
      handleOracleClick(id);
      return;
    }
    window.open(`/?worksheet=true&fullScreen=${id}`, `Full_${id}_${Date.now()}`, 'width=1100,height=850,menubar=no,toolbar=no,location=no,status=no');
  };

  const handlePlanetClick = (planet, house) => {
    const pos = (data?.planet_positions || []).find(p => p.planet === planet) || {};
    setSelectedPlanet({ name: planet, house, ...pos });
  };

  const handleOracleClick = (id) => {
    const popupSettings = 'width=1100,height=850,menubar=no,toolbar=no,location=no,status=no';
    const basic = data?.basic_details || {};
    const meta = data?.meta || {};
    const params = new URLSearchParams({
      name: (meta.name || basic.name) || '',
      date: (basic.birth_date) || '',
      time: (basic.birth_time) || '',
      lat: (basic.lat) || '',
      lon: (basic.lon) || '',
      tz: (basic.tz_offset) || '0',
      lang: 'hindi'
    });
    if (id === 'lalkitab') params.set('lalkitab', 'true');
    else if (id === 'daily_panchang') params.set('panchang', 'true');
    else if (id === 'horary') params.set('horary', 'true');
    else if (id === 'chakra') params.set('chakra', 'true');
    else if (id === 'yantra') params.set('yantra', 'true');
    else params.set(id, 'true');

    localStorage.setItem('worksheetData', JSON.stringify(data));
    window.open(`/?${params.toString()}`, `Oracle_${id}_${Date.now()}`, popupSettings);
  };

  const urlCid = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('fullScreen') : null;
  const cid = fullScreenInitial || urlCid;

  if (cid) {
    const effects = calculatePlanetEffects(data);

    return (
      <div className="h-screen w-screen bg-[#fdfbf7] flex flex-col overflow-hidden">
        <style>{`
          button, button span, button div, button p, button h4 {
            color: black !important;
          }
        `}</style>

        <div className="bg-slate-900 px-6 py-3 flex justify-between items-center shrink-0 shadow-lg z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-black font-bold">✨</div>
            <div>
              <h2 className="text-white text-sm font-serif italic tracking-widest uppercase leading-none">
                {CELL_CONTENTS.find(c => c.id === cid)?.label || cid.toUpperCase()}
              </h2>
              <p className="text-[8px] text-indigo-400 font-black uppercase tracking-[0.3em] mt-0.5">Standalone Diagnostic View</p>
            </div>
          </div>
          <button
            onClick={() => window.close()}
            className="bg-white/10 hover:bg-white/20 text-black px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
          >
            Close Window
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col items-center custom-scrollbar">
          <div className="w-full max-w-7xl mx-auto">
            {(cid === 'lagna' || cid === 'd1') && (
              <div className="flex flex-col items-center gap-8 animate-in fade-in duration-700">
                <div className="w-full max-w-3xl bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl relative">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[15rem] font-serif pointer-events-none -mr-10 -mt-10">D1</div>
                  <ZodiacChart houses={data.charts?.houses} onPlanetClick={handlePlanetClick} title="Birth Chart (Lagna)" variant="legacy" planetEffects={effects} />
                </div>
                <div className="w-full">
                  <HouseEffectTable data={data} planetEffects={effects} />
                  <ConjunctionAnalysis houses={data.charts?.houses} />
                </div>
              </div>
            )}

            {cid === 'rahu' && (
              <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-700">
                <div className="bg-gradient-to-r from-teal-900 to-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl mb-10 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 font-serif text-[12rem] -bottom-10 -right-10 pointer-events-none">RAHU</div>
                  <h3 className="text-4xl font-serif italic tracking-[0.2em] uppercase mb-2">North Node Diagnostic</h3>
                  <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.4em]">Shadow Planet & Karmic Desires Analysis</p>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  {(() => {
                    const rahuInfo = (data.planet_positions || []).find(p => p.planet === 'Rahu');
                    const houseNum = rahuInfo?.house;
                    const interpretation = RAHU_HOUSE_INTERPRETATIONS[houseNum];
                    return (
                      <div className="bg-white p-10 rounded-3xl border border-teal-100 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black text-teal-800">{houseNum}</div>
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-14 h-14 bg-teal-800 rounded-2xl flex items-center justify-center text-3xl shadow-lg">🌑</div>
                          <div>
                            <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Rahu in House {houseNum}</h4>
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-widest mt-1 inline-block">Karmic Obsession</span>
                          </div>
                        </div>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-700" />
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {cid === 'ketu' && (
              <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-700">
                <div className="bg-gradient-to-r from-orange-900 to-red-950 p-10 rounded-[2.5rem] text-white shadow-2xl mb-10 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 font-serif text-[12rem] -bottom-10 -right-10 pointer-events-none">KETU</div>
                  <h3 className="text-4xl font-serif italic tracking-[0.2em] uppercase mb-2">South Node Diagnostic</h3>
                  <p className="text-orange-400 text-xs font-bold uppercase tracking-[0.4em]">The Liberator & Past Life Detachment Analysis</p>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  {(() => {
                    const ketuInfo = (data.planet_positions || []).find(p => p.planet === 'Ketu');
                    const houseNum = ketuInfo?.house;
                    const interpretation = KETU_HOUSE_INTERPRETATIONS[houseNum];
                    return (
                      <div className="bg-white p-10 rounded-3xl border border-orange-100 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black text-orange-800">{houseNum}</div>
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-14 h-14 bg-orange-800 rounded-2xl flex items-center justify-center text-3xl shadow-lg">💥</div>
                          <div>
                            <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Ketu in House {houseNum}</h4>
                            <span className="text-[10px] font-bold text-orange-900 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest mt-1 inline-block">Moksha & Spirituality</span>
                          </div>
                        </div>
                        <BulletInterpretation text={interpretation} colorClass="text-slate-700" />
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {cid === 'd3' && (
              <div className="w-full max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-blue-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Drekkana Analysis (D3)</h3>
                <div className="w-full max-w-2xl mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart houses={data.vargas?.d3?.houses} onPlanetClick={handlePlanetClick} variant="legacy" planetEffects={effects} />
                </div>
                <p className="text-sm text-blue-900 italic mb-8">{DREKKANA_INTRO}</p>
                <div className="space-y-12">
                  {Object.entries(DREKKANA_PLANET_DESCRIPTIONS).map(([planet, p_data]) => (
                    <section key={planet} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{p_data.icon}</div>
                        <h4 className="text-xl font-black uppercase">{p_data.title}</h4>
                      </div>
                      <BulletInterpretation text={p_data.description} />
                    </section>
                  ))}
                </div>
              </div>
            )}

            {cid === 'd9' && (
              <div className="w-full max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-amber-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Navamsha Analysis (D9)</h3>
                <div className="w-full max-w-2xl mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart houses={data.vargas?.d9?.houses} onPlanetClick={handlePlanetClick} variant="legacy" planetEffects={effects} />
                </div>
                <p className="text-sm text-amber-900 italic mb-8">{NAVAMSA_INTRO}</p>
                <div className="space-y-12">
                  {Object.entries(NAVAMSA_PLANET_DESCRIPTIONS).map(([planet, p_data]) => (
                    <section key={planet} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{p_data.icon}</div>
                        <h4 className="text-xl font-black uppercase">{p_data.title}</h4>
                      </div>
                      <BulletInterpretation text={p_data.description} />
                    </section>
                  ))}
                </div>
              </div>
            )}

            {cid === 'd10' && (
              <div className="w-full max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-indigo-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Dashamsha Analysis (D10)</h3>
                <div className="w-full max-w-2xl mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart houses={data.vargas?.d10?.houses} onPlanetClick={handlePlanetClick} variant="legacy" planetEffects={effects} />
                </div>
                <p className="text-sm text-indigo-900 italic mb-8">{DASHAMSHA_INTRO}</p>
                <div className="space-y-12">
                  {Object.entries(DASHAMSHA_PLANET_DESCRIPTIONS).map(([planet, p_data]) => (
                    <section key={planet} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{p_data.icon}</div>
                        <h4 className="text-xl font-black uppercase">{p_data.title}</h4>
                      </div>
                      <BulletInterpretation text={p_data.description} />
                    </section>
                  ))}
                </div>
              </div>
            )}

            {cid === 'd2' && (
              <div className="w-full max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-amber-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Hora Analysis (D2)</h3>
                <div className="w-full max-w-2xl mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart houses={data.vargas?.d2?.houses} onPlanetClick={handlePlanetClick} variant="legacy" planetEffects={effects} />
                </div>
                <p className="text-sm text-amber-900 italic mb-8">{HORA_INTRO}</p>
                <div className="space-y-12">
                  {Object.entries(HORA_PLANET_DESCRIPTIONS).map(([planet, p_data]) => (
                    <section key={planet} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{p_data.icon}</div>
                        <h4 className="text-xl font-black uppercase">{p_data.title}</h4>
                      </div>
                      <BulletInterpretation text={p_data.description} />
                    </section>
                  ))}
                </div>
              </div>
            )}

            {cid === 'd4' && (
              <div className="w-full max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-emerald-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Chaturthamsa Analysis (D4)</h3>
                <div className="w-full max-w-2xl mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart houses={data.vargas?.d4?.houses} onPlanetClick={handlePlanetClick} variant="legacy" planetEffects={effects} />
                </div>
                <p className="text-sm text-emerald-900 italic mb-8">{D4_INTRO}</p>
                <div className="space-y-12">
                  {Object.entries(D4_PLANET_DESCRIPTIONS).map(([planet, p_data]) => (
                    <section key={planet} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{p_data.icon}</div>
                        <h4 className="text-xl font-black uppercase">{p_data.title}</h4>
                      </div>
                      <BulletInterpretation text={p_data.description} />
                    </section>
                  ))}
                </div>
              </div>
            )}

            {cid === 'd7' && (
              <div className="w-full max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-rose-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Saptamsa Analysis (D7)</h3>
                <div className="w-full max-w-2xl mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart houses={data.vargas?.d7?.houses} onPlanetClick={handlePlanetClick} variant="legacy" planetEffects={effects} />
                </div>
                <p className="text-sm text-rose-900 italic mb-8">{D7_INTRO}</p>
                <div className="space-y-12">
                  {Object.entries(D7_PLANET_DESCRIPTIONS).map(([planet, p_data]) => (
                    <section key={planet} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{p_data.icon}</div>
                        <h4 className="text-xl font-black uppercase">{p_data.title}</h4>
                      </div>
                      <BulletInterpretation text={p_data.description} />
                    </section>
                  ))}
                </div>
              </div>
            )}

            {cid === 'd12' && (
              <div className="w-full max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-slate-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Dwadasamsa Analysis (D12)</h3>
                <div className="w-full max-w-2xl mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart houses={data.vargas?.d12?.houses} onPlanetClick={handlePlanetClick} variant="legacy" planetEffects={effects} />
                </div>
                <p className="text-sm text-slate-900 italic mb-8">{D12_INTRO}</p>
                <div className="space-y-12">
                  {Object.entries(D12_PLANET_DESCRIPTIONS).map(([planet, p_data]) => (
                    <section key={planet} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{p_data.icon}</div>
                        <h4 className="text-xl font-black uppercase">{p_data.title}</h4>
                      </div>
                      <BulletInterpretation text={p_data.description} />
                    </section>
                  ))}
                </div>
              </div>
            )}

            {cid === 'd16' && (
              <div className="w-full max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-indigo-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Shodasamsa Analysis (D16)</h3>
                <div className="w-full max-w-2xl mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart houses={data.vargas?.d16?.houses} onPlanetClick={handlePlanetClick} variant="legacy" planetEffects={effects} />
                </div>
                <p className="text-sm text-indigo-900 italic mb-8">{D16_INTRO}</p>
                <div className="space-y-12">
                  {Object.entries(D16_PLANET_DESCRIPTIONS).map(([planet, p_data]) => (
                    <section key={planet} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{p_data.icon}</div>
                        <h4 className="text-xl font-black uppercase">{p_data.title}</h4>
                      </div>
                      <BulletInterpretation text={p_data.description} />
                    </section>
                  ))}
                </div>
              </div>
            )}

            {cid === 'd24' && (
              <div className="w-full max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-violet-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Chaturvimshamsa Analysis (D24)</h3>
                <div className="w-full max-w-2xl mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart houses={data.vargas?.d24?.houses} onPlanetClick={handlePlanetClick} variant="legacy" planetEffects={effects} />
                </div>
                <p className="text-sm text-violet-900 italic mb-8">{D24_INTRO}</p>
                <div className="space-y-12">
                  {Object.entries(D24_PLANET_DESCRIPTIONS).map(([planet, p_data]) => (
                    <section key={planet} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{p_data.icon}</div>
                        <h4 className="text-xl font-black uppercase">{p_data.title}</h4>
                      </div>
                      <BulletInterpretation text={p_data.description} />
                    </section>
                  ))}
                </div>
              </div>
            )}

            {cid === 'd30' && (
              <div className="w-full max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-red-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Trimshamsa Analysis (D30)</h3>
                <div className="w-full max-w-2xl mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart houses={data.vargas?.d30?.houses} onPlanetClick={handlePlanetClick} variant="legacy" planetEffects={effects} />
                </div>
                <p className="text-sm text-red-900 italic mb-8">{D30_INTRO}</p>
                <div className="space-y-12">
                  {Object.entries(D30_PLANET_DESCRIPTIONS).map(([planet, p_data]) => (
                    <section key={planet} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{p_data.icon}</div>
                        <h4 className="text-xl font-black uppercase">{p_data.title}</h4>
                      </div>
                      <BulletInterpretation text={p_data.description} />
                    </section>
                  ))}
                </div>
              </div>
            )}

            {cid === 'd60' && (
              <div className="w-full max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-amber-200 shadow-xl">
                <h3 className="text-3xl font-serif italic uppercase mb-6">Shashtiamsa Analysis (D60)</h3>
                <div className="w-full max-w-2xl mx-auto mb-10 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-md">
                  <ZodiacChart houses={data.vargas?.d60?.houses} onPlanetClick={handlePlanetClick} variant="legacy" planetEffects={effects} />
                </div>
                <p className="text-sm text-amber-900 italic mb-8">{D60_INTRO}</p>
                <div className="space-y-12">
                  {Object.entries(D60_PLANET_DESCRIPTIONS).map(([planet, p_data]) => (
                    <section key={planet} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{p_data.icon}</div>
                        <h4 className="text-xl font-black uppercase">{p_data.title}</h4>
                      </div>
                      <BulletInterpretation text={p_data.description} />
                    </section>
                  ))}
                </div>
              </div>
            )}

            {cid === 'transit_compare' && (
              <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
                <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-8 rounded-3xl text-white shadow-2xl flex justify-between items-center">
                  <h3 className="text-4xl font-serif italic tracking-widest uppercase">Transit Diagnostic Matrix</h3>
                  <div className="text-right">
                    <div className="text-2xl font-black text-amber-500">{new Date().toLocaleDateString()}</div>
                    <p className="text-xs opacity-60">Today's Positions</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl">
                    <h4 className="text-xl font-black mb-6 uppercase italic">Natal Lagna Chart</h4>
                    <ZodiacChart houses={data.charts?.houses} variant="legacy" planetEffects={effects} />
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl">
                    <h4 className="text-xl font-black mb-6 uppercase italic">Current Transit</h4>
                    <TransitPanel data={data} transitPositions={transitPositions} />
                  </div>
                </div>
              </div>
            )}

            {(() => {
              if (cid === 'current_positions') return <CurrentPositionsDashboard initialData={data} />;
              if (cid === 'planets_table') return <div className="p-10"><PlanetTable data={data} /></div>;
              if (cid === 'panchang') return <div className="p-10"><PanchangPanel data={data} /></div>;
              if (cid === 'numerical') return <div className="p-10"><NumericalPanel data={data} /></div>;
              if (cid === 'shodashottari') return <div className="p-10"><SecondaryDashaPanel data={data} type="shodashottari" /></div>;
              if (cid === 'chaturshitisama') return <div className="p-10"><SecondaryDashaPanel data={data} type="chaturshitisama" /></div>;
              if (cid === 'dignity') return <div className="p-10"><DignityTable data={data} planetEffects={effects} /></div>;
              if (cid === 'vimshottari') return <div className="p-10"><VimshottariPanel data={data} /></div>;
              if (cid === 'shadbala') return <div className="p-10"><ShadbalaChart data={data.strength} /></div>;
              if (cid === 'gemstones') return <div className="p-10"><GemstonePanel data={data} /></div>;
              if (cid === 'transit_gemstones') return <div className="p-10"><TransitGemstonePanel data={data} transitPositions={transitPositions} /></div>;
              if (cid === 'transit') return <div className="p-10"><TransitPanel data={data} transitPositions={transitPositions} /></div>;
              if (cid === 'vimsopaka') return <div className="p-10 w-full max-w-4xl mx-auto"><VimsopakaAssessment data={data} /></div>;
              return null;
            })()}
          </div>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-[10px] text-gray-500 italic uppercase">Astro Consult : Independent Viewport Mode</p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-10 text-center font-serif text-slate-400 italic">Preparing Worksheet...</div>;

  const meta = data.meta || {};
  const basic = data.basic_details || {};
  const planetEffects = calculatePlanetEffects(data);

  // Profile Information Extraction
  const moonData = (data.planet_positions || []).find(p => p.planet === "Moon") || {};
  const sunData = (data.planet_positions || []).find(p => p.planet === "Sun") || {};

  let dobString = "Unknown";
  if (basic.birth_datetime) {
    dobString = basic.birth_datetime;
  } else if (basic.day) {
    dobString = `${basic.day}/${basic.month}/${basic.year} ${basic.hour || '00'}:${basic.minute || '00'}`;
  } else if (meta.date) {
    dobString = meta.date;
  }

  const profileInfo = {
    name: meta.name || basic.name || "Astro Native",
    dob: dobString,
    location: meta.location || basic.place || "Unknown",
    moonSign: moonData.sign || "Unknown",
    sunSign: sunData.sign || "Unknown",
    nakshatra: moonData.nakshatra || "Unknown"
  };

  const handleOpenMatchmaking = () => {
    window.open('/?matchmaking=true', 'DivineCompatibility', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
  };

  return (
    <div className="flex flex-col h-screen bg-[#f1f5f9] font-serif overflow-hidden">
      <style>{`
        button, button span, button div, button p, button h4 {
          color: black !important;
        }
      `}</style>

      <div className="bg-[#fffcf5] border-b border-amber-100 py-1.5 shadow-sm shrink-0 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-sm font-serif italic text-amber-900 tracking-widest">
              ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-[#e3f2fd] text-Red shadow-md z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">✨</div>
          <div>
            <h2 className="text-md font-serif italic font-black uppercase tracking-widest leading-none">Interactive Vedic Worksheet</h2>
            <p className="text-[9px] opacity-70 uppercase font-sans tracking-tighter mt-1">Astro Consult : Legacy Workstation</p>
          </div>

          <div className="hidden lg:flex ml-4 pl-4 border-l border-white/20 flex-1 min-w-0 overflow-hidden">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => handleMaximizeInNewWindow('transit_compare')}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-black px-2.5 py-1 rounded-lg text-[8.5px] font-black shadow-md transition-all flex items-center gap-1 uppercase tracking-tight"
              >
                🔄 Compare Transit
              </button>
              <button
                onClick={handleOpenMatchmaking}
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-black px-2.5 py-1 rounded-lg text-[8.5px] font-black shadow-md transition-all flex items-center gap-1 uppercase tracking-tight border border-rose-400/30"
              >
                💏 Match Making
              </button>
              {CELL_CONTENTS.filter(c => c.category !== "System" && c.id !== "transit_compare").map(c => (
                <button
                  key={c.id}
                  onClick={() => handleMaximizeInNewWindow(c.id)}
                  className="text-[8px] font-sans font-bold uppercase tracking-tight text-black/75 hover:text-black hover:bg-white/20 px-2 py-1 rounded-md border border-black/30 transition-all bg-white/5"
                >
                  {c.label.split(' - ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4 border-r border-white/20 pr-4">
            <span className="text-[10px] uppercase opacity-60">Native</span>
            <span className="text-xs font-black text-amber-400">{meta.name || basic.name || "Astro Native"}</span>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-black px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg border border-emerald-500/30">
            Export Report PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-1.5 bg-[#d1d5db] flex flex-col gap-1.5">
        <div className="flex gap-1.5 h-1/2">
          {/* User Profile Column */}
          <div className="w-[20%] bg-[#fdfbf7] rounded-xl border border-gray-300 shadow-inner flex flex-col overflow-hidden shrink-0">
            <div className="bg-indigo-900 py-1.5 px-3">
              <span className="text-[9px] font-black uppercase text-white tracking-widest">User Profile</span>
            </div>
            <div className="flex-1 p-3 flex flex-col gap-3.5 bg-gradient-to-b from-white to-indigo-50/30 overflow-y-auto custom-scrollbar">
              <div className="space-y-0.5">
                <p className="text-[7px] font-black uppercase text-slate-400 tracking-tighter">Full Name</p>
                <p className="text-[11px] font-bold text-indigo-950 truncate leading-none">{profileInfo.name}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[7px] font-black uppercase text-slate-400 tracking-tighter">Date of Birth</p>
                <p className="text-[10px] font-bold text-slate-800 leading-none">{profileInfo.dob}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[7px] font-black uppercase text-slate-400 tracking-tighter">Birth Location</p>
                <p className="text-[10px] font-bold text-slate-800 leading-none truncate">{profileInfo.location}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-0.5 group relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[7px] font-black uppercase text-slate-400 tracking-tighter">Moon Sign</p>
                      <p className="text-[10px] font-bold text-blue-700 leading-none mt-0.5">{profileInfo.moonSign}</p>
                    </div>
                    <button
                      onClick={() => window.open('/?moonSign=true', '_blank')}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 rounded px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-wider border border-blue-200 shadow-sm transition-colors"
                    >
                      Analyze
                    </button>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[7px] font-black uppercase text-slate-400 tracking-tighter">Sun Sign</p>
                  <p className="text-[10px] font-bold text-red-600 leading-none">{profileInfo.sunSign}</p>
                </div>
              </div>
              <div className="space-y-0.5 border-t border-indigo-100 pt-2">
                <p className="text-[7px] font-black uppercase text-slate-400 tracking-tighter">Birth Nakshatra</p>
                <p className="text-[11px] font-black text-emerald-700 leading-none uppercase tracking-tighter">{profileInfo.nakshatra}</p>
              </div>
              <div className="space-y-0.5 border-t border-indigo-100 pt-2 flex justify-between items-center">
                <div>
                  <p className="text-[7px] font-black uppercase text-slate-400 tracking-tighter">Sade Sati Status</p>
                  {(() => {
                    const SIGNS_LIST = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
                    const moonIdx = SIGNS_LIST.indexOf(profileInfo.moonSign);
                    const saturnPos = transitPositions?.["Saturn"];
                    if (moonIdx !== -1 && saturnPos) {
                      const saturnSignIdx = saturnPos.sidereal?.sign_index !== undefined ? saturnPos.sidereal.sign_index : Math.floor(saturnPos.sidereal.lon / 30);
                      const s12 = (moonIdx - 1 + 12) % 12;
                      const s1 = moonIdx;
                      const s2 = (moonIdx + 1) % 12;

                      let status = "Inactive";
                      let phase = "";
                      let color = "text-emerald-600";

                      if (saturnSignIdx === s12) { status = "Active"; phase = "Rising"; color = "text-amber-600"; }
                      else if (saturnSignIdx === s1) { status = "Active"; phase = "Peak"; color = "text-red-600"; }
                      else if (saturnSignIdx === s2) { status = "Active"; phase = "Setting"; color = "text-orange-600"; }

                      return (
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-black ${color} leading-none`}>{status}</span>
                          {phase && <span className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">{phase} Phase</span>}
                        </div>
                      );
                    }
                    return <p className="text-[9px] font-bold text-slate-600 leading-none mt-0.5">Calculating...</p>;
                  })()}
                </div>
                <button
                  onClick={() => window.open('/?sadesati_report=true', '_blank')}
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-wider border border-indigo-200 shadow-sm transition-colors"
                >
                  Analyze
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[#fdfbf7] rounded-xl border border-gray-300 shadow-inner overflow-hidden relative group">
            <div className="absolute top-2 left-2 z-10 px-3 py-1 bg-white/80 backdrop-blur rounded-lg border border-slate-200 shadow-sm">
              <span className="text-[10px] font-black uppercase text-indigo-900">Main Birth Chart (D1)</span>
            </div>
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button onClick={() => handleMaximizeInNewWindow('d1')} className="bg-gray-800/80 text-black rounded p-1 text-[10px] shadow hover:bg-black hover:text-white">⛶</button>
            </div>
            <div className="h-full flex flex-col pt-8 overflow-auto custom-scrollbar">
              <ZodiacChart houses={data.charts?.houses} onPlanetClick={handlePlanetClick} variant="legacy" planetEffects={planetEffects} />
              <div className="px-4 pb-4">
                <HouseEffectTable data={data} planetEffects={planetEffects} />
                <ConjunctionAnalysis houses={data.charts?.houses} />
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[#fdfbf7] rounded-xl border border-gray-300 shadow-inner overflow-hidden relative group flex flex-col">
            <div className="absolute top-2 left-2 z-20 px-3 py-1 bg-white/80 backdrop-blur rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-indigo-900">Alternative Vargas View</span>
              <select
                value={upperRightChart}
                onChange={(e) => setUpperRightChart(e.target.value)}
                className="bg-transparent text-[10px] font-bold border-none focus:ring-0 cursor-pointer text-black"
              >
                {CELL_CONTENTS.filter(c => c.id.startsWith('d') && c.id !== 'dignity').map(c => (
                  <option key={c.id} value={c.id} className="text-black">{c.label}</option>
                ))}
              </select>
            </div>
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
              <button onClick={() => handleMaximizeInNewWindow(upperRightChart)} className="bg-gray-800/80 text-black rounded p-1 text-[10px] shadow hover:bg-black hover:text-white">⛶</button>
            </div>
            <div className="flex-1 flex flex-col pt-8 overflow-auto custom-scrollbar">
              {(() => {
                const vData = (upperRightChart === 'd1') ? data.charts : data.vargas?.[upperRightChart];
                const vPos = getPlanetPositionsFromHouses(vData?.houses);
                return (
                  <>
                    <ZodiacChart houses={vData?.houses} onPlanetClick={handlePlanetClick} variant="legacy" planetEffects={planetEffects} />
                    <div className="px-4 pb-4">
                      <HouseEffectTable data={data} planetEffects={planetEffects} customPositions={vPos} />
                      <ConjunctionAnalysis houses={vData?.houses} />
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="p-2 border-t border-gray-100 bg-gray-50/50 flex justify-center">
              <button
                onClick={() => handleMaximizeInNewWindow(upperRightChart)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
              >
                <span>Full Screen View</span>
                <span className="text-xs font-bold text-black">⛶</span>
              </button>
            </div>
          </div>

          {/* Separate Planet Degrees Column */}
          <div className="w-[30%] bg-[#fdfbf7] rounded-xl border border-gray-300 shadow-inner flex flex-col overflow-hidden shrink-0">
            <div className="bg-indigo-900 py-1.5 px-3 flex justify-between items-center">
              <span className="text-[9px] font-black uppercase text-white tracking-widest">Planet Positions & Degrees</span>
              <button
                onClick={() => handleMaximizeInNewWindow('planets_table')}
                className="bg-white/20 hover:bg-white/30 text-white rounded px-2 py-0.5 text-[10px] font-bold transition-all flex items-center gap-1 shadow-sm border border-white/10"
                title="Full Screen View"
              >
                <span className="text-[8px] uppercase tracking-tighter">Full</span>
                <span className="text-xs text-white">⛶</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 bg-gradient-to-b from-white to-indigo-50/20">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-indigo-100 text-[8px] uppercase text-slate-500 font-black">
                    <th className="text-left py-1">Planet</th>
                    <th className="text-left py-1">Sign</th>
                    <th className="text-center py-1">House</th>
                    <th className="text-right py-1">Degree</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(data.planet_positions || []).map(p => (
                    <tr
                      key={p.planet}
                      className="hover:bg-white cursor-pointer transition-colors group"
                      onClick={() => handlePlanetClick?.(p.planet, p.house)}
                    >
                      <td className="py-1.5 text-[10px] font-bold" style={{ color: PLANET_COLORS[p.planet] || "#000" }}>
                        {p.planet}{p.is_retrograde ? '*' : ''}{p.is_combust ? '#' : ''}
                      </td>
                      <td className="py-1.5 text-[10px] text-slate-600 group-hover:text-slate-900">{p.sign}</td>
                      <td className="py-1.5 text-center text-[10px] font-black text-indigo-900 bg-indigo-50/30 rounded">{p.house}</td>
                      <td className="py-1.5 text-right text-[10px] font-mono text-slate-500 font-medium">
                        {Math.floor(p.degree)}°{Math.floor((p.degree % 1) * 60).toString().padStart(2, '0')}'
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-1.5 border-t border-gray-200 bg-white/80 text-[7px] text-slate-400 italic flex justify-around">
              <span>* Retrograde (Vakri)</span>
              <span># Combust (Asth)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5 h-1/2">
          {lowerCells.map((cid, idx) => (
            <WorksheetCell
              key={idx}
              contentId={cid}
              data={data}
              transitPositions={transitPositions}
              planetEffects={planetEffects}
              onSelectContent={(newCid) => {
                const newCells = [...lowerCells];
                newCells[idx] = newCid;
                setLowerCells(newCells);
              }}
              onPlanetClick={handlePlanetClick}
              onFullScreen={handleMaximizeInNewWindow}
            />
          ))}
        </div>
      </div>

      <div className="bg-[#e3f2fd] shrink-0 shadow-2xl">
        <div
          className="flex gap-3 px-3 py-2 overflow-x-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#fbbf24 #1a237e" }}
        >
          {oracle_items.map(item => (
            <button
              key={item.id}
              onClick={() => handleOracleClick(item.id)}
              className="flex flex-col items-center group transition-all shrink-0"
              title={item.label}
            >
              <span className="text-xl group-hover:scale-125 transition-transform">{item.icon}</span>
              <span className="text-[8px] font-black uppercase text-white/60 group-hover:text-amber-400 whitespace-nowrap">{item.label}</span>
            </button>
          ))}
          <p className="text-[9px] text-white/40 italic uppercase self-center pl-4 pr-2 shrink-0 border-l border-white/10 ml-2">
            Astro Consult को अपना समय देने के लिए "धन्यवाद" ।
          </p>
        </div>
      </div>

      {selectedPlanet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-[#1a237e] text-white">
              <h4 className="text-lg font-serif italic">{selectedPlanet.name} Details</h4>
              <button onClick={() => setSelectedPlanet(null)} className="text-black hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-3 font-serif">
              <div className="flex justify-between border-b pb-1"><span>House Placement:</span> <b>{selectedPlanet.house}</b></div>
              <div className="flex justify-between border-b pb-1"><span>Zodiac Sign:</span> <b>{selectedPlanet.sign}</b></div>
              <div className="flex justify-between border-b pb-1"><span>Precise Degree:</span> <b>{selectedPlanet.degree?.toFixed(4)}°</b></div>
              <div className="flex justify-between border-b pb-1"><span>Nakshatra:</span> <b>{selectedPlanet.nakshatra}</b></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveWorksheet;