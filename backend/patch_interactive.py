import json
import re

path = r'frontend\src\components\InteractiveWorksheet.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update fetch
old_fetch = '''const [transitPositions, setTransitPositions] = useState(null);

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
  }, []);'''

new_fetch = '''const [transitPositions, setTransitPositions] = useState(null);
  const [transitHouses, setTransitHouses] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFetching, setIsFetching] = useState(false);

  const addTime = (amount, unit) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (unit === 'day') d.setDate(d.getDate() + amount);
      if (unit === 'month') d.setMonth(d.getMonth() + amount);
      if (unit === 'year') d.setFullYear(d.getFullYear() + amount);
      if (unit === 'hour') d.setHours(d.getHours() + amount);
      return d;
    });
  };

  const resetToNow = () => setCurrentDate(new Date());

  useEffect(() => {
    const fetchTransit = () => {
      setIsFetching(true);
      const now = currentDate;
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = f'{year}-{month}-{day}';
      const timeStr = now.toTimeString().split(' ')[0];
      const tz_offset = (now.getTimezoneOffset() / -60.0).toFixed(1);
      const lat = initialData?.basic_details?.lat || 28.6;
      const lon = initialData?.basic_details?.lon || 77.2;

      fetch(`/api/kundali`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Current Transit",
          date: dateStr,
          time: timeStr,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          tz_offset: parseFloat(tz_offset)
        })
      })
        .then(res => res.json())
        .then(json => {
          if (json.planet_positions) {
            const posObj = Array.isArray(json.planet_positions)
              ? json.planet_positions.reduce((acc, p) => ({ ...acc, [p.planet || p.name]: p }), {})
              : json.planet_positions;
            setTransitPositions(posObj);
            if (json.houses) setTransitHouses(json.houses);
            else if (json.charts && json.charts.houses) setTransitHouses(json.charts.houses);
          }
        })
        .catch(err => console.error("Transit fetch failed", err))
        .finally(() => setIsFetching(false));
    };
    fetchTransit();
  }, [currentDate]);'''

new_fetch = new_fetch.replace("f'{year}-{month}-{day}'", "`${year}-${month}-${day}`")
content = content.replace(old_fetch, new_fetch)

# 2. Update Layout and Time Controls
old_layout = '''          <div className="relative z-10">
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
          </div>'''

new_layout = '''          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-2">Transit Analysis</h2>
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-indigo-400">
              <span>Planetary Movements</span>
              <span className="w-8 h-[1px] bg-indigo-800"></span>
              <span>{currentDate.toLocaleString()}</span>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex flex-wrap gap-4 items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <button onClick={resetToNow} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors shadow-lg">Live Now</button>
            <div className="w-px h-8 bg-slate-700 mx-2 hidden sm:block"></div>
            
            <div className="flex gap-2 items-center">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mr-1">Hour</span>
              <button onClick={() => addTime(-1, 'hour')} className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors">-</button>
              <button onClick={() => addTime(1, 'hour')} className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors">+</button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mr-1 ml-2">Day</span>
              <button onClick={() => addTime(-1, 'day')} className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors">-</button>
              <button onClick={() => addTime(1, 'day')} className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors">+</button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mr-1 ml-2">Month</span>
              <button onClick={() => addTime(-1, 'month')} className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors">-</button>
              <button onClick={() => addTime(1, 'month')} className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors">+</button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mr-1 ml-2">Year</span>
              <button onClick={() => addTime(-1, 'year')} className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors">-</button>
              <button onClick={() => addTime(1, 'year')} className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors">+</button>
            </div>
          </div>
        </div>

        <div className={`flex flex-col gap-12 max-w-4xl mx-auto transition-opacity duration-500 ${isFetching ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 left-6 z-20 px-4 py-1.5 bg-indigo-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Current Gochar Map</div>
            <div className="mt-8">
              {(() => {
                let formattedTransitPositions = initialData?.planet_positions;
                if (transitPositions) {
                  formattedTransitPositions = Object.entries(transitPositions).map(([k, v]) => ({
                    planet: k,
                    degree: v.sidereal?.lon || v.lon,
                    is_retrograde: v.is_retrograde || v.sidereal?.is_retrograde,
                    is_combust: v.is_combust || v.sidereal?.is_combust,
                    nakshatra: v.nakshatra || v.sidereal?.nakshatra
                  }));
                }
                return (
                  <ZodiacChart
                    planetPositions={formattedTransitPositions}
                    houses={transitHouses || initialData.charts?.houses}
                    title="Current Planet Positions"
                    variant="legacy"
                    defaultRect={true}
                    scaleText={1.5}
                    showNakshatra={true}
                  />
                );
              })()}
            </div>
          </div>'''

content = content.replace(old_layout, new_layout)

# 3. Add Gochar Analysis
old_gochar_text = '''          <h3 className="text-2xl font-black uppercase tracking-tight mb-8 text-slate-800 border-b border-slate-100 pb-4">Detailed Gochar Analysis (गोचर फल)</h3>
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
              );'''

new_gochar_text = '''          <h3 className="text-2xl font-black uppercase tracking-tight mb-8 text-slate-800 border-b border-slate-100 pb-4">Detailed Gochar Analysis (गोचर फल)</h3>
          <div className="space-y-6">
            {Object.entries(transitPositions).map(([planet, pos]) => {
              const valid = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
              if (!valid.includes(planet)) return null;

              const signIdx = pos.sidereal?.sign_index !== undefined ? pos.sidereal.sign_index : Math.floor(pos.sidereal.lon / 30);

              let moonSignIndex = 0;
              if (initialData?.planet_positions) {
                const moonPos = Array.isArray(initialData.planet_positions) 
                  ? initialData.planet_positions.find(p => p.planet === "Moon" || p.name === "Moon")
                  : Object.values(initialData.planet_positions).find(p => p.planet === "Moon" || p.name === "Moon");
                
                if (moonPos) {
                  moonSignIndex = moonPos.sidereal?.sign_index !== undefined 
                    ? moonPos.sidereal.sign_index 
                    : Math.floor((moonPos.sidereal?.lon || moonPos.lon || 0) / 30);
                }
              }

              const transitHouse = ((signIdx - moonSignIndex + 12) % 12) + 1;

              const HINDI_PLANETS = {
                "Sun": "सूर्य", "Moon": "चंद्र", "Mars": "मंगल", "Mercury": "बुध", "Jupiter": "गुरु", "Venus": "शुक्र", "Saturn": "शनि", "Rahu": "राहु", "Ketu": "केतु"
              };
              const HINDI_SIGNS = [
                "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
              ];

              const getGocharText = (pName, house) => {
                const auspicious = {
                  "Sun": [3, 6, 10, 11],
                  "Moon": [1, 3, 6, 7, 10, 11],
                  "Mars": [3, 6, 11],
                  "Mercury": [2, 4, 6, 8, 10, 11],
                  "Jupiter": [2, 5, 7, 9, 11],
                  "Venus": [1, 2, 3, 4, 5, 8, 9, 11, 12],
                  "Saturn": [3, 6, 11],
                  "Rahu": [3, 6, 10, 11],
                  "Ketu": [3, 6, 11]
                };

                const isGood = auspicious[pName]?.includes(house);
                const hindiP = HINDI_PLANETS[pName] || pName;

                if (isGood) {
                  return `आपकी जन्म चंद्र राशि से ${house}वें भाव में ${hindiP} का गोचर अत्यंत शुभ फलदायक माना जाता है। इस अवधि में आपको अपने प्रयासों में सफलता, आर्थिक लाभ, और स्वास्थ्य में सुधार देखने को मिलेगा। रुके हुए कार्य संपन्न होंगे और सामाजिक मान-सम्मान में वृद्धि होगी। सकारात्मक ऊर्जा का संचार होगा।`;
                } else {
                  return `आपकी जन्म चंद्र राशि से ${house}वें भाव में ${hindiP} का गोचर संघर्ष और कुछ चुनौतियों का संकेत देता है। इस अवधि में आपको स्वास्थ्य के प्रति सावधान रहना चाहिए, व्यर्थ के वाद-विवाद से बचना चाहिए, और आर्थिक मामलों में अत्यधिक सतर्कता बरतनी चाहिए। धैर्य और संयम से काम लें।`;
                }
              };

              const pName = HINDI_PLANETS[planet] || planet;
              const sName = HINDI_SIGNS[signIdx] || "";

              return (
                <div key={planet} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="text-xl font-bold text-indigo-900 mb-3 border-b border-slate-200 pb-2">
                    {pName} {sName} राशि में आपकी चंद्र राशि से भाव {transitHouse} में गोचर कर रहा है
                  </h4>
                  <p className="text-gray-700 leading-relaxed font-serif text-lg">
                    {getGocharText(planet, transitHouse)}
                  </p>
                </div>
              );'''

content = content.replace(old_gochar_text, new_gochar_text)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("InteractiveWorksheet patched successfully.")
