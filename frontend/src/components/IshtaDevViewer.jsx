import React from 'react';

const DEITY_IMAGES = {
  "Lord Rama / Shiva": "/deities/rama.png",
  "Krishna / Gauri (Divine Mother)": "/deities/krishna.png",
  "Hanuman / Subramanya": "/deities/hanuman.png",
  "Vishnu": "/deities/vishnu.png",
  "Vamana / Dakshinamurthy": "/deities/vamana.png",
  "Parashurama / Lakshmi": "/deities/lakshmi.png",
  "Kurma / Shiva": "/deities/shiv.jpg",
  "Durga / Ganesh": "/deities/durga.jpg",
  "Ganesha": "/deities/ganesh.jpg",
};

const DEITY_MANTRAS = {
  "Lord Rama / Shiva": "ॐ रां रामाय नमः | ॐ नमः शिवाय",
  "Krishna / Gauri (Divine Mother)": "ॐ नमो भगवते वासुदेवाय | ॐ ह्रीं श्रीं क्लीं भुवनेश्वर्यै नमः",
  "Hanuman / Subramanya": "ॐ हं हनुमते नमः | ॐ श्री शरवणभवाय नमः",
  "Vishnu": "ॐ नमो नारायणाय",
  "Vamana / Dakshinamurthy": "ॐ नमो भगवते दक्षिणामूर्तये",
  "Parashurama / Lakshmi": "ॐ श्रीं महालक्ष्म्यै नमः",
  "Kurma / Shiva": "ॐ नमः शिवाय",
  "Durga / Ganesh": "ॐ दुं दुर्गायै नमः | ॐ गं गणपतये नमः",
  "Ganesha": "ॐ गं गणपतये नमः",
};

const PLANET_MANTRAS = {
  "Sun": "ॐ घृणि सूर्याय नमः",
  "Moon": "ॐ सों सोमाय नमः",
  "Mars": "ॐ अं अंगारकाय नमः",
  "Mercury": "ॐ बुं बुधाय नमः",
  "Jupiter": "ॐ बृं बृहस्पतये नमः",
  "Venus": "ॐ शुं शुक्राय नमः",
  "Saturn": "ॐ शं शनैश्चराय नमः",
  "Rahu": "ॐ रां राहवे नमः",
  "Ketu": "ॐ कें केतवे नमः",
};

const PLANET_IMAGES = {
  "Sun": "/deities/sun.jpg",
  "Moon": "/deities/moon.jpg",
  "Mars": "/deities/mars.jpg",
  "Mercury": "/deities/mercury.jpg",
  "Jupiter": "/deities/jupiter.jpg",
  "Venus": "/deities/venus.jpg",
  "Saturn": "/deities/saturn.jpg",
  "Rahu": "/deities/rahu.jpg",
  "Ketu": "/deities/ketu.jpg",
};

const FASTING_GUIDE = {
  "Sun": {
    "day": "रविवार (Ravivaar)",
    "benefit": "आत्म-शक्ति, सफलता और नेतृत्व",
    "method": "नमक और तेल का त्याग करें। दूध, गेहूं और फलों का सेवन करें। सूर्योदय से सूर्यास्त तक उपवास रखें।"
  },
  "Moon": {
    "day": "सोमवार (Somvaar)",
    "benefit": "मानसिक शांति और भावनात्मक संतुलन",
    "method": "केवल सफेद खाद्य पदार्थ (दूध, दही, चावल) का सेवन करें। खट्टी चीजों से परहेज करें। मानसिक शांति के लिए सर्वोत्तम।"
  },
  "Mars": {
    "day": "मंगलवार (Mangalvaar)",
    "benefit": "साहस, शक्ति और विजय",
    "method": "केवल बिना नमक वाली वस्तुओं का सेवन करें, अधिमानतः गेहूं और गुड़। भूमि या कानूनी विवादों को सुलझाने के लिए उत्कृष्ट।"
  },
  "Mercury": {
    "day": "बुधवार (Budhvaar)",
    "benefit": "बुद्धि और व्यावसायिक समृद्धि",
    "method": "हरे खाद्य पदार्थ (मूँग दाल) का सेवन करें। भगवान विष्णु को समर्पित।"
  },
  "Jupiter": {
    "day": "गुरुवार (Guruvaar)",
    "benefit": "ज्ञान, धन और विवाह",
    "method": "पीले रंग के खाद्य पदार्थ (चना दाल, बेसन) का सेवन करें। नमक और बाल/कपड़े धोने से बचें।"
  },
  "Venus": {
    "day": "शुक्रवार (Shukravaar)",
    "benefit": "विलासिता, कला और वैवाहिक सद्भाव",
    "method": "सूर्यास्त के समय केवल एक समय का भोजन। खट्टे भोजन से बचें। लक्ष्मी माता की पूजा करें।"
  },
  "Saturn": {
    "day": "शनिवार (Shanivaar)",
    "benefit": "अनुशासन और नकारात्मकता से सुरक्षा",
    "method": "काला नमक और काले तिल का प्रयोग करें। सरसों के तेल का दान करें। लोहे की वस्तुओं से बचें।"
  },
  "Rahu": {
    "day": "शनिवार या सोमवार",
    "benefit": "स्पष्टता और नवाचार",
    "method": "व्रत रखें और मां दुर्गा की पूजा करें। मसालेदार भोजन और तंबाकू से बचें।"
  },
  "Ketu": {
    "day": "मंगलवार या गुरुवार",
    "benefit": "आध्यात्मिक अंतर्दृष्टि और मुक्ति",
    "method": "भगवान गणेश की पूजा करें। साधारण सात्विक आहार। काले कुत्तों या पक्षियों को भोजन कराएं।"
  }
};

const PURANA_GUIDE = {
  "Sun": {
    "name": "शिव पुराण और अग्नि पुराण (Shiva Purana & Agni Purana)",
    "description": "यह आपकी आत्मा के तेज और नेतृत्व क्षमता को विकसित करने के लिए सर्वोत्तम है।",
    "mantra": "ॐ नमः शिवाय"
  },
  "Moon": {
    "name": "शिव पुराण और श्रीमद्भागवत पुराण (Shiva Purana & Shrimad Bhagavatam)",
    "description": "मानसिक शांति, भक्ति और भावनात्मक स्थिरता के लिए इसका पठन कल्याणकारी है।",
    "mantra": "ॐ नमो भगवते वासुदेवाय"
  },
  "Mars": {
    "name": "शिव पुराण और स्कंद पुराण (Shiva Purana & Skanda Purana)",
    "description": "साहस, भूमि सुख और शत्रुओं पर विजय प्राप्त करने के लिए इसे सुनें।",
    "mantra": "ॐ स्कंदाय नमः"
  },
  "Mercury": {
    "name": "विष्णु पुराण और नारद पुराण (Vishnu Purana & Narada Purana)",
    "description": "बुद्धि, संचार कला और व्यावसायिक सफलता के लिए इसका पठन उत्तम है।",
    "mantra": "ॐ नमो नारायणाय"
  },
  "Jupiter": {
    "name": "विष्णु पुराण और श्रीमद्भागवत महापुराण (Vishnu Purana & Shrimad Bhagavatam)",
    "description": "ज्ञान, संतान सुख और आध्यात्मिक उन्नति के लिए यह सर्वश्रेष्ठ मार्ग है।",
    "mantra": "ॐ नमो भगवते वासुदेवाय"
  },
  "Venus": {
    "name": "देवी पुराण और पद्म पुराण (Devi Purana & Padma Purana)",
    "description": "कला, सौंदर्य, प्रेम और विलासिता पूर्ण जीवन के लिए मां दुर्गा की महिमा का गुणगान करें।",
    "mantra": "ॐ दुं दुर्गायै नमः"
  },
  "Saturn": {
    "name": "शिव पुराण और वायु पुराण (Shiva Purana & Vayu Purana)",
    "description": "अनुशासन, धैर्य और जीवन की बाधाओं को दूर करने के लिए भगवान शिव की शरण लें।",
    "mantra": "ॐ नमः शिवाय"
  },
  "Rahu": {
    "name": "भविष्य पुराण (Bhavishya Purana)",
    "description": "भविष्य की अंतर्दृष्टि और भ्रमों से मुक्ति पाने के लिए इसका पठन करें।",
    "mantra": "ॐ रां राहवे नमः"
  },
  "Ketu": {
    "name": "मत्स्य पुराण (Matsya Purana)",
    "description": "मोक्ष, आध्यात्मिक ज्ञान और गहरे रहस्यों को समझने के लिए पवित्र मत्स्य पुराण पढ़ें।",
    "mantra": "ॐ गणाधिपतये नमः"
  }
};

const PILGRIMAGE_GUIDE = {
  1: {
    "temple": "चामुंडा देवी मंदिर (Chamunda Devi Temple, Himachal Pradesh)",
    "planet": "सूर्य (Surya)",
    "why": "यह मंदिर ऊर्जा, साहस और आंतरिक शक्ति को बढ़ाने वाला है। सूर्य प्रधान व्यक्तियों के लिए यह आत्मविश्वास और नेतृत्व क्षमता को पुनर्स्थापित करता है।",
    "remedy": "नियमित रूप से आदित्य हृदयम का पाठ करें और तांबे के पात्र से सूर्य को जल अर्पित करें।"
  },
  2: {
    "temple": "रामेश्वरम मंदिर (Rameshwaram Temple, Tamil Nadu)",
    "planet": "चंद्रमा (Chandra)",
    "why": "रामेश्वरम में शुद्धिकरण और मानसिक शांति की अपार शक्ति है। यह चंद्रमा से प्रभावित व्यक्तियों के अशांत मन को स्थिरता और अंतर्ज्ञान प्रदान करता है।",
    "remedy": "सोमवार का व्रत रखें और शिवजी का दूध से रुद्राभिषेक करें।"
  },
  3: {
    "temple": "सोमनाथ मंदिर (Somnath Temple, Gujarat)",
    "planet": "बृहस्पति (Guru)",
    "why": "बृहस्पति ज्ञान और समृद्धि के कारक हैं। सोमनाथ तीर्थ में दर्शन से सौभाग्य, स्पष्टता और आध्यात्मिक उन्नति का मार्ग प्रशस्त होता है।",
    "remedy": "हल्दी या चने की दाल का दान करें और नियमित रूप से गुरु मंत्र का जाप करें।"
  },
  4: {
    "temple": "तिरुपति बालाजी मंदिर (Tirupati Balaji Temple, Andhra Pradesh)",
    "planet": "राहु (Rahu)",
    "why": "बालाजी की दिव्य ऊर्जा राहु के अनिश्चित प्रभावों को संतुलित करने में सक्षम है। यह भौतिक सफलता और कर्मों की शुद्धि के लिए सर्वोत्तम है।",
    "remedy": "राहु शांति पूजा करवाएं और समय-समय पर अन्नदान (भोजन दान) करें।"
  },
  5: {
    "temple": "सिद्धिविनायक मंदिर (Siddhivinayak Temple, Maharashtra)",
    "planet": "बुध (Budha)",
    "why": "बुध बुद्धि और संचार का प्रतीक है। सिद्धिविनायक में विघ्नहर्ता गणेश के दर्शन से करियर की बाधाएं दूर होती हैं और बौद्धिक क्षमता बढ़ती है।",
    "remedy": "गणेश अथर्वशीर्ष का पाठ करें और बुधवार को दूर्वा (घास) अर्पित करें।"
  },
  6: {
    "temple": "कामाख्या मंदिर (Kamakhya Temple, Assam)",
    "planet": "शुक्र (Shukra)",
    "why": "शुक्र रचनात्मकता और प्रेम का कारक है। कामाख्या शक्तिपीठ जीवन में सुख, वैभव और कलात्मक प्रतिभा को जागृत करने के लिए अत्यंत प्रभावशाली है।",
    "remedy": "सफेद फूलों से देवी की पूजा करें और जरूरतमंद महिलाओं की सहायता करें।"
  },
  7: {
    "temple": "महाकालेश्वर मंदिर (Mahakaleshwar Temple, Ujjain)",
    "planet": "केतु (Ketu)",
    "why": "महाकाल की गहरी ऊर्जा केतु प्रधान व्यक्तियों की रहस्यमय और अंतर्मुखी प्रकृति से मेल खाती है। यह मोक्ष और मानसिक शांति के लिए सर्वोत्तम है।",
    "remedy": "महामृत्युंजय मंत्र का जाप करें और भस्म आरती में सम्मिलित होने का प्रयास करें।"
  },
  8: {
    "temple": "भीमाशंकर ज्योतिर्लिंग (Bhimashankar Jyotirlinga, Maharashtra)",
    "planet": "शनि (Shani)",
    "why": "भीमाशंकर कर्म दोषों के बोझ को कम करने और जीवन की चुनौतियों का सामना करने के लिए धैर्य और अनुशासन प्रदान करता है।",
    "remedy": "शनिवार को सरसों के तेल का दीपक जलाएं और गरीबां की सेवा करें।"
  },
  9: {
    "temple": "काशी विश्वनाथ मंदिर (Kashi Vishwanath Temple, Varanasi)",
    "planet": "मंगल (Mangal)",
    "why": "काशी की उग्र और परिवर्तनकारी ऊर्जा मंगल के तेज और साहस के अनुकूल है। यह क्रोध पर नियंत्रण और आध्यात्मिक शक्ति प्रदान करती है।",
    "remedy": "मंगल दोष निवारण पूजा करवाएं और नियमित हनुमान चालीसा का पाठ करें।"
  }
};

export default function IshtaDevViewer({ data }) {
  if (!data || !data.ishta_devata) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white italic">Information not available</div>;
  }

  // Handle nested data from localStorage (combined ishta_devata and numerology)
  const ishtaObj = data && typeof data.ishta_devata === 'object' ? data.ishta_devata : data;
  const { ishta_devata, description, ruling_planet } = ishtaObj;
  const numerology = data.numerology || ishtaObj.numerology;

  // Fallback map: Planet to Birth Number (to ensure the guide shows even if numerology object is missing)
  const planetToNum = {
    "Sun": 1, "Moon": 2, "Jupiter": 3, "Rahu": 4, "Mercury": 5, "Venus": 6, "Ketu": 7, "Saturn": 8, "Mars": 9
  };
  const displayNum = (numerology && numerology.psychic_number) || planetToNum[ruling_planet];

  const imageSrc = DEITY_IMAGES[ishta_devata] || DEITY_IMAGES["Lord Rama / Shiva"];

  const psychicPurana = numerology ? {
    1: "अग्नि पुराण (Agni Purana)",
    2: "शिव पुराण (Shiva Purana)",
    3: "विष्णु पुराण (Vishnu Purana)",
    4: "भविष्य पुराण (Bhavishya Purana)",
    5: "नारद पुराण (Narada Purana)",
    6: "देवी पुराण (Devi Purana)",
    7: "मत्स्य पुराण (Matsya Purana)",
    8: "वायु पुराण (Vayu Purana)",
    9: "स्कंद पुराण (Skanda Purana)"
  }[numerology.psychic_number] : null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-12 px-4 bg-gradient-to-b from-indigo-950 via-slate-900 to-black text-white overflow-x-hidden">
      <div className="max-w-3xl w-full bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 md:p-12 border border-white/10 text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>

        <h1 className="text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 mb-8 drop-shadow-xl animate-pulse">
          Divine Connection
        </h1>

        <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
          <div className="relative w-full md:w-1/2 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-white/20 group bg-slate-800">
            <img
              src={imageSrc}
              alt={ishta_devata}
              className="object-cover w-full h-full transform transition-transform duration-2000 group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1544921586-7782b13ed7c8?auto=format&fit=crop&q=80&w=800";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-6 left-0 right-0 p-4">
              <span className="text-amber-400 text-sm uppercase tracking-widest block mb-2 font-semibold">Your Soul's Guide</span>
              <h2 className="text-4xl font-serif text-white font-bold drop-shadow-lg">{ishta_devata}</h2>
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-6 text-left">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl">
              <h3 className="text-amber-300 font-serif text-xl border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
                <span>✨</span> The Astrological Key
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed font-light italic opacity-90">
                {description}
              </p>
            </div>

            {ruling_planet && (
              <div className="bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/20 shadow-xl">
                <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-400 shadow-lg flex-shrink-0 bg-slate-800">
                    <img
                      src={PLANET_IMAGES[ruling_planet] || PLANET_IMAGES["Sun"]}
                      alt={ruling_planet}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Surya_Dev.png/800px-Surya_Dev.png";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-indigo-300 font-serif text-xl mb-0">
                      Ruling Planet: {ruling_planet}
                    </h3>
                    <span className="text-xs text-indigo-400 font-bold tracking-widest uppercase">Graha Devata</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Planetary Mantra</span>
                    <p className="text-xl font-serif text-indigo-100">{PLANET_MANTRAS[ruling_planet] || "ॐ नमः शिवाय"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Soul Mantra</span>
                    <p className="text-xl font-serif text-amber-200">{DEITY_MANTRAS[ishta_devata] || "ॐ श्री गणेशाय नमः"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Daily Ritual Section */}
        <div className="mt-12 p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl border border-white/5 text-left shadow-2xl">
          <h3 className="text-2xl font-serif font-bold text-amber-300 mb-6 flex items-center gap-3">
            <span className="text-3xl">🪔</span> Daily Ishta Devata Sadhana
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { n: 1, t: "Purification", d: "Begin at sunrise after bathing. Sit on a clean mat (Aasan) facing East or North." },
              { n: 2, t: "Lamp & Incense", d: "Light a Ghee lamp and incense sticks. Offer fragrant flowers to the deity." },
              { n: 3, t: "Invocation", d: "Close your eyes and visualize your Ishta Devata smiling at the center of your heart." },
              { n: 4, t: "Mental Japa", d: "Chant the Soul Mantra 108 times, feeling each syllable resonate through your body." },
              { n: 5, t: "Meditation", d: "Remain in silence for 5-10 minutes, absorbing the divine peace and guidance." },
              { n: 6, t: "Conclusion", d: "Bow down and offer gratitude for the protection and wisdom received." }
            ].map(step => (
              <div key={step.n} className="flex gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold group-hover:bg-amber-500 group-hover:text-black transition-all">
                  {step.n}
                </div>
                <div>
                  <h4 className="text-amber-100 font-bold mb-1">{step.t}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fasting (Vrat) Guide Section */}
        {ruling_planet && FASTING_GUIDE[ruling_planet] && (
          <div className="mt-12 p-8 bg-indigo-900/40 rounded-3xl border border-indigo-400/20 text-left shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-700">
              <img src={PLANET_IMAGES[ruling_planet]} alt="" className="w-32 h-32 rounded-full" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-indigo-300 mb-6 flex items-center gap-3">
              <span>🌾</span> ब्रह्मांडीय व्रत (उपवास) मार्गदर्शिका
            </h3>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 bg-white/5 p-6 rounded-2xl border border-white/5 text-center">
                <span className="text-xs text-indigo-400 uppercase tracking-widest block mb-2 font-bold">अनुशंसित दिन</span>
                <p className="text-2xl font-bold text-white mb-2">{FASTING_GUIDE[ruling_planet].day}</p>
                <div className="h-1 w-12 bg-indigo-500 mx-auto rounded-full"></div>
              </div>

              <div className="md:w-2/3 space-y-4">
                <div>
                  <h4 className="text-indigo-200 font-bold mb-1 italic">आध्यात्मिक लाभ:</h4>
                  <p className="text-slate-300 leading-relaxed font-light">{FASTING_GUIDE[ruling_planet].benefit}</p>
                </div>
                <div>
                  <h4 className="text-indigo-200 font-bold mb-1 italic">पूजन विधि और आहार:</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{FASTING_GUIDE[ruling_planet].method}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-black/40 rounded-xl border border-white/5">
              <p className="text-xs text-slate-500 leading-relaxed italic">
                <b>सामान्य निर्देश:</b> हिंदू धर्म में उपवास केवल भोजन का त्याग नहीं है, बल्कि यह आत्म-अनुशासन और आत्म-शुद्धि का मार्ग है। किसी भी नया आहार नियम शुरू करने से पहले स्वास्थ्य विशेषज्ञ से सलाह अवश्य लें।
              </p>
            </div>
          </div>
        )}

        {/* Recommended Purana Section */}
        {ruling_planet && PURANA_GUIDE[ruling_planet] && (
          <div className="mt-12 p-8 bg-amber-900/20 rounded-3xl border border-amber-500/20 text-left shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <span className="text-8xl font-serif text-amber-500 uppercase rotate-12">ॐ</span>
            </div>

            <h3 className="text-2xl font-serif font-bold text-amber-200 mb-6 flex items-center gap-3">
              <span>📚</span> पवित्र पुराण (श्रवण और पठन) मार्गदर्शिका
            </h3>

            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <span className="text-xs text-amber-400 uppercase tracking-widest block mb-2 font-bold italic">आपके इष्ट देव और ग्रह के अनुसार अनुशंसित:</span>
                <p className="text-2xl font-serif text-amber-100 mb-3">{PURANA_GUIDE[ruling_planet].name}</p>
                <p className="text-slate-300 leading-relaxed font-light">{PURANA_GUIDE[ruling_planet].description}</p>
              </div>

              {numerology && psychicPurana && psychicPurana !== PURANA_GUIDE[ruling_planet].name && (
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 border-dashed">
                  <span className="text-xs text-slate-400 uppercase tracking-widest block mb-1">अंक ज्योतिष (Psychic No. {numerology.psychic_number}) के अनुसार विकल्प:</span>
                  <p className="text-lg font-serif text-slate-200">{psychicPurana}</p>
                </div>
              )}

              <div className="flex items-center gap-4 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <div className="p-3 bg-amber-500/20 rounded-full text-amber-300">
                  🕉️
                </div>
                <div>
                  <p className="text-xs text-amber-400 uppercase font-bold">पठन के समय इस मंत्र का मानसिक जाप करें</p>
                  <p className="text-xl font-serif text-white">{PURANA_GUIDE[ruling_planet].mantra}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-slate-500 italic">
              * पुराणों का पठन या श्रवण पूर्ण श्रद्धा और शुद्धि के साथ करना अत्यंत फलदायी माना गया है।
            </div>
          </div>
        )}

        {/* Pilgrimage Guide Section */}
        {displayNum && PILGRIMAGE_GUIDE[displayNum] && (
          <div className="mt-12 p-8 bg-teal-900/20 rounded-3xl border border-teal-500/20 text-left shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <span className="text-8xl font-serif text-teal-500 uppercase -rotate-12">⛰️</span>
            </div>

            <h3 className="text-2xl font-serif font-bold text-teal-200 mb-6 flex items-center gap-3">
              <span>🚩</span> प्राचीन तीर्थ यात्रा (Pilgrimage Guide)
            </h3>

            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <span className="text-xs text-teal-400 uppercase tracking-widest block mb-2 font-bold italic">
                  {numerology && numerology.psychic_number
                    ? `जन्म तारीख (${numerology.psychic_number}) के अनुसार अनुशंसित तीर्थ:`
                    : `रूलिंग प्लानेट (${ruling_planet}) के अनुसार अनुशंसित तीर्थ:`
                  }
                </span>
                <p className="text-2xl font-serif text-teal-500 border-b border-teal-500/20 pb-2 mb-3 leading-tight">{PILGRIMAGE_GUIDE[displayNum].temple}</p>

                <div className="flex gap-4 items-center mb-4">
                  <div className="bg-teal-500/20 px-3 py-1 rounded-full text-xs text-teal-300 border border-teal-500/30">
                    रूलिंग प्लानेट: {PILGRIMAGE_GUIDE[displayNum].planet}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-teal-200 text-sm font-bold italic">यह तीर्थ आपके लिए क्यों महत्वपूर्ण है?</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{PILGRIMAGE_GUIDE[displayNum].why}</p>
                  </div>
                  <div>
                    <h4 className="text-teal-200 text-sm font-bold italic">अनुशंसित उपाय (Remedies):</h4>
                    <p className="text-slate-400 text-sm italic">{PILGRIMAGE_GUIDE[displayNum].remedy}</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-slate-500 leading-relaxed">
                  <b>विशेष निर्देश:</b> हिंदू धर्म में तीर्थ यात्रा का मुख्य उद्देश्य मन की शांति और ईश्वर के प्रति पूर्ण समर्पण है। यात्रा के दौरान सात्विक आचरण का पालन करें।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Kuldevi Section - The NEW Addition */}
        <div className="mt-12 group">
          <div className="p-1 origin-center transition-all bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-[2rem] shadow-[0_0_30px_rgba(239,68,68,0.3)] group-hover:shadow-[0_0_50px_rgba(239,68,68,0.5)]">
            <div className="bg-slate-950 rounded-[1.8rem] p-8 md:p-12 text-left relative overflow-hidden">
              {/* Decorative traditional motifs can be added as SVG backgrounds if needed */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full"></div>

              <h2 className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-6 drop-shadow-md">
                अपनी कुलदेवी की महिमा और पूजा विधि
              </h2>

              <div className="bg-red-950/20 border-l-4 border-red-500 p-6 mb-8 rounded-r-xl">
                <p className="text-xl text-red-100 italic font-serif leading-relaxed">
                  "अपने इष्ट देव के साथ अपनी कुलदेवी की पूजा भी करें"
                </p>
                <p className="mt-4 text-slate-300">
                  कुलदेवी की पूजा में श्रद्धा सबसे महत्वपूर्ण है। प्रतिदिन या विशेष दिनों (नवरात्रि, अमावस्या) पर घर के मंदिर में शुद्धता से स्नान कर लाल आसन पर बैठें। माता को लाल पुष्प, रोली, चंदन, और दीपक (घी/तेल) अर्पित करें। भोग में घर का बना सात्विक भोजन, फल या बताशे चढ़ाएं और कपूर से आरती करें।
                </p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-orange-300 flex items-center gap-2">
                      🚩 पूजा की विस्तृत जानकारी
                    </h3>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex gap-2"><b>समय:</b> <span>नवरात्रि, पूर्णिमा, अमावस्या, या शुक्ल पक्ष के शुक्रवार।</span></li>
                      <li className="flex gap-2"><b>सामग्री:</b> <span>लाल वस्त्र, रोली, कुमकुम, अक्षत, नारियल, और नैवेद्य।</span></li>
                    </ul>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-sm text-slate-400 mb-2 font-bold uppercase tracking-widest">विशेष मंत्र</p>
                    <p className="text-2xl font-serif text-orange-200">"ॐ ह्रीं ह्रीं [कुलदेवी का नाम] रूपिणि स्वाहा"</p>
                    <p className="mt-2 text-xs text-slate-500 italic">* [कुलदेवी का नाम] के स्थान पर अपनी कुलदेवी का नाम लें।</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-orange-300 border-b border-red-500/20 pb-2">📜 विधिवत पूजन प्रक्रिया</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { t: "शुद्धिकरण", d: "स्नान करके स्वच्छ वस्त्र धारण करें।" },
                      { t: "गणेश पूजन", d: "सर्वप्रथम विघ्नहर्ता श्री गणेश का आह्वान करें।" },
                      { t: "स्थापना", d: "प्रतिमा या सुपारी को माता स्वरूप मानकर स्थापित करें।" },
                      { t: "ध्यान", d: "कुलदेवी का भावपूर्ण ध्यान और आवाहन करें।" },
                      { t: "दीप प्रज्वलन", d: "घी या तेल का अखंड दीपक जलाएं।" },
                      { t: "पूजन", d: "रोली, चंदन और लाल पुष्प समर्पित करें।" },
                      { t: "भोग", d: "नारियल, फल या हलवा-चना अर्पित करें।" },
                      { t: "आरती", d: "कपूर से आरती कर सुख-समृद्धि की कामना करें।" }
                    ].map((p, i) => (
                      <div key={i} className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 hover:bg-red-500/10 transition-colors">
                        <h4 className="text-red-400 font-bold mb-1">{p.t}</h4>
                        <p className="text-xs text-slate-400">{p.d}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-500/5 p-6 rounded-2xl border border-orange-500/10">
                  <h3 className="text-lg font-bold text-orange-200 mb-4 italic">💡 महत्वपूर्ण बातें (Family Traditions)</h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-400 text-sm">
                    <li>कुलदेवी की पूजा हमेशा पारिवारिक परंपरा अनुसार करें; बुजुर्गों से सही विधि जरूर पूछें।</li>
                    <li>नियमित रूप से सुबह-शाम घर के मंदिर में कुलदेवी के नाम का दीपक जरूर जलाएं।</li>
                    <li>हर माह की अमावस्या पर विशेष पूजा या दान करना अत्यंत शुभ और फलदायी होता है।</li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 text-center">
                <a
                  href="/contact-astrologer"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-full shadow-[0_10px_30px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_40px_rgba(220,38,38,0.6)] transform hover:-translate-y-1 transition-all duration-300"
                >
                  कुलदेवी की पूजा से संबंधित अधिक जानकारी के लिए हमारे ज्योतिषी से संपर्क करें
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-slate-500 text-sm italic">
          May the divine grace of your Ishta Devata and Kuldevi bless your journey with light and abundance.
        </div>
      </div>
    </div>
  );
}
