export const getSearchOptions = (showError) => {
  const getReportData = () => {
    const dataStr = localStorage.getItem('worksheetData');
    if (!dataStr) {
      if (showError) showError("Please generate a report first.");
      return null;
    }
    try {
      return JSON.parse(dataStr);
    } catch (e) {
      if (showError) showError("Invalid report data.");
      return null;
    }
  };

  const openVargaChart = (systemId, title) => {
    const data = getReportData();
    if (!data) return;
    const win = window.open(`/?worksheet=true&fullScreen=${systemId}`, title, 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const openChartView = (viewNum, title) => {
    const data = getReportData();
    if (!data) return;
    const win = window.open(`/?chart_view_${viewNum}=true`, title, 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const openReadingReport = (route, title) => {
    const data = getReportData();
    if (!data) return;
    const win = window.open(`/?${route}=true`, title, 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const openOracleTool = (id, title) => {
    const data = getReportData();
    if (!data) return;
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
    else if (id === 'monthly_panchang') params.set('monthly_panchang', 'true');
    else if (id === 'horary') params.set('horary', 'true');
    else if (id === 'chakra') params.set('chakra', 'true');
    else if (id === 'yantra') params.set('yantra', 'true');
    else params.set(id, 'true');

    const win = window.open(`/?${params.toString()}`, title, 'width=1100,height=850,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const openRootTool = (route, title, requireData = true) => {
    const data = requireData ? getReportData() : true;
    if (!data) return;
    const win = window.open(`/?${route}=true`, title, 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  const openParamTool = (type, title) => {
    const data = getReportData();
    if (!data) return;
    const basic = data?.basic_details || {};
    const meta = data?.meta || {};
    const params = new URLSearchParams({
      [type]: 'true',
      name: (meta.name || basic.name) || '',
      date: (basic.birth_date) || '',
      time: (basic.birth_time) || '',
      lat: (basic.lat) || '',
      lon: (basic.lon) || '',
      tz: (basic.tz_offset) || '0',
      loc: (meta.location || basic.location || '')
    });
    const win = window.open(`/?${params.toString()}`, title, 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no');
    if (win) win.focus();
  };

  return [
    // Core Dashboard Tools
    { label: "Interactive Worksheet (All Charts)", keywords: ["worksheet", "all charts", "kundali", "interactive"], action: () => openRootTool("worksheet", "InteractiveWorksheet") },
    { label: "Blank Sheet", keywords: ["blank sheet", "empty", "clear"], action: () => openRootTool("worksheet", "BlankWorksheet", false) },
    { label: "Your Kundali (Detailed Report)", keywords: ["detailed", "html", "report", "premium", "kundali"], action: () => openRootTool("detailed_report", "DetailedReport") },
    { label: "Remedies (Upay)", keywords: ["remedy", "upay", "solutions", "gemstone", "rudraksha"], action: () => openParamTool("remedy", "RemedyViewer") },
    { label: "Daily Horoscope", keywords: ["daily", "horoscope", "today"], action: () => openParamTool("daily_horoscope", "DailyHoroscope") },
    { label: "Monthly Horoscope", keywords: ["monthly", "horoscope", "month"], action: () => openParamTool("monthly_horoscope", "MonthlyHoroscope") },
    { label: "Yearly Horoscope", keywords: ["yearly", "horoscope", "year", "annual"], action: () => openParamTool("yearly_horoscope", "YearlyHoroscope") },
    { label: "Ishta Devata", keywords: ["ishta", "devata", "deity", "god", "worship"], action: () => openParamTool("ishta_dev", "IshtaDev") },
    { label: "Match Making (Kundali Milan)", keywords: ["match", "making", "milan", "marriage", "guna", "compatibility"], action: () => openParamTool("matchmaking", "MatchMaking") },
    { label: "Love Calculator", keywords: ["love", "calculator", "romance", "crush"], action: () => openRootTool("compatibility-hub", "LoveCalculator", false) },
    { label: "Weekly Relationship Horoscope", keywords: ["weekly", "relationship", "horoscope", "love"], action: () => { const win = window.open('/?compatibility-hub=true&calculator=weekly-relationship', 'WeeklyRelationship', 'width=1400,height=900,menubar=no,toolbar=no,location=no,status=no'); if (win) win.focus(); } },
    { label: "Bio Data (Marriage Profile)", keywords: ["bio", "data", "profile", "resume"], action: () => openParamTool("biodata", "BioData") },
    { label: "Muhurt Calculator (Auspicious Time)", keywords: ["muhurt", "calculator", "auspicious", "time", "shubh", "choghadiya"], action: () => openParamTool("muhurt_search", "MuhurtCalculator") },
    { label: "Numerology", keywords: ["numerology", "numbers", "ank jyotish", "lucky"], action: () => openParamTool("numerology", "Numerology") },
    { label: "Face Reading", keywords: ["face", "reading", "physiognomy", "samudrik"], action: () => openParamTool("face_reading", "FaceReading") },
    { label: "Palmistry", keywords: ["palmistry", "palm", "hands", "lines"], action: () => openParamTool("palmistry", "Palmistry") },
    { label: "Vastu Shastra", keywords: ["vastu", "shastra", "home", "direction", "house"], action: () => openParamTool("vastu", "Vastu") },
    { label: "Birth Time Rectification (BTR)", keywords: ["btr", "birth time", "rectification", "correction", "unknown"], action: () => openParamTool("btr", "BTR") },
    { label: "Brahma Muhurta", keywords: ["brahma", "muhurta", "time"], action: () => openParamTool("brahma", "BrahmaMuhurta") },
    { label: "Prashna Kundali", keywords: ["prashna", "question"], action: () => openParamTool("prashna", "PrashnaKundali") },
    { label: "Astamangala Prasna", keywords: ["astamangala", "prasna"], action: () => openParamTool("astamangala", "AstamangalaPrasna") },
    { label: "KP Astrology", keywords: ["kp", "astrology", "krishnamurthy"], action: () => openParamTool("kp", "KPAstrology") },
    { label: "Nadi Astrology", keywords: ["nadi", "astrology"], action: () => openParamTool("nadi", "NadiAstrology") },
    { label: "Mantra Tracker (Japa Mala)", keywords: ["mantra", "tracker", "chanting", "japa", "mala"], action: () => openParamTool("mantra", "MantraTracker") },
    { label: "Kurma Chakra", keywords: ["kurma", "chakra", "tortoise", "koorma"], action: () => openRootTool("kurma_chakra", "KurmaChakra", false) },
    { label: "Chaitra Chart (Yearly)", keywords: ["chaitra", "chart", "yearly", "new year"], action: () => openRootTool("chaitra_chart", "ChaitraChart", false) },
    { label: "Sanghatta Chakra", keywords: ["sanghatta", "chakra"], action: () => openRootTool("sanghatta", "Sanghatta", false) },

    // Readings Subcategory
    { label: "ADV. Nakshatra", keywords: ["adv", "nakshatra", "advanced"], action: () => openReadingReport("advanced_nakshatra", "AdvancedNakshatra") },
    { label: "Astro TM", keywords: ["astro tm", "tm"], action: () => openReadingReport("astro_tm", "AstroTM") },
    { label: "Dasha Time", keywords: ["dasha time", "timeline"], action: () => openReadingReport("dasa_timeline", "DashaTimeline") },
    { label: "Longevity Analysis", keywords: ["longevity", "analysis", "life span", "ayur"], action: () => openReadingReport("longevity", "LongevityAnalysis") },
    { label: "Ayurdaya (Life Force)", keywords: ["ayurdaya", "life force"], action: () => openReadingReport("ayurdaya", "Ayurdaya") },
    { label: "Ayur Jyotish (Medical Astrology)", keywords: ["ayur", "jyotish", "medical", "astrology", "health", "disease"], action: () => openReadingReport("medical_astrology", "MedicalAstrology") },
    { label: "Naming", keywords: ["naming", "name", "child", "baby"], action: () => openReadingReport("naming", "Naming") },
    { label: "3D Solar System", keywords: ["3d", "solar system", "planets"], action: () => openReadingReport("solarsystem3d", "SolarSystem3D") },
    { label: "AI Oracle", keywords: ["ai", "oracle", "artificial", "intelligence", "chat"], action: () => openVargaChart("ai_oracle", "AIOracle") },
    { label: "Planets Table", keywords: ["planets", "table", "positions"], action: () => openVargaChart("planets_table", "PlanetsTable") },
    { label: "Panchang", keywords: ["panchang", "tithi", "yoga", "karana"], action: () => openVargaChart("panchang", "Panchang") },
    { label: "Gemstones (Ratna)", keywords: ["gemstones", "ratna", "stone"], action: () => openVargaChart("gemstones", "Gemstones") },
    { label: "Transit Gemstones (Gochar Ratna)", keywords: ["transit", "gemstones", "gochar", "ratna"], action: () => openVargaChart("transit_gemstones", "TransitGemstones") },
    { label: "D11 Chart", keywords: ["d11", "rudramsha", "chart"], action: () => openVargaChart("d11", "D11Chart") },

    // Evaluation Subcategory
    { label: "Bala Strengths", keywords: ["bala", "strengths", "power"], action: () => openReadingReport("bala_strengths", "BalaStrengths") },
    { label: "Shadbala", keywords: ["shadbala", "strength", "six"], action: () => openVargaChart("shadbala", "Shadbala") },
    { label: "Bhavbala", keywords: ["bhavbala", "bhava", "house strength"], action: () => openVargaChart("bhavbala", "Bhavbala") },
    { label: "Vimsopaka Bala", keywords: ["vimsopaka", "bala", "strength"], action: () => openVargaChart("vimsopaka", "Vimsopaka") },
    { label: "Shodashvarga Summary", keywords: ["shodashvarga", "summary", "16 charts"], action: () => openVargaChart("shodashvarga_summary", "ShodashvargaSummary") },
    { label: "Dignity", keywords: ["dignity", "avastha", "state"], action: () => openVargaChart("dignity", "Dignity") },
    { label: "Relationships", keywords: ["relationships", "friendship", "maitri"], action: () => openVargaChart("relationships", "Relationships") },
    { label: "Navamsha Ages", keywords: ["navamsha", "ages", "timeline"], action: () => openReadingReport("navamsha_ages", "NavamshaAges") },
    { label: "Aspects Summary", keywords: ["aspects", "summary", "drishti"], action: () => openVargaChart("aspects_summary", "AspectsSummary") },
    { label: "Ashtakavarga", keywords: ["ashtakavarga", "points", "bindu"], action: () => openVargaChart("ashtakavarga", "Ashtakavarga") },
    { label: "Ashtakavarga Reduction", keywords: ["ashtakavarga", "reduction", "shodhana"], action: () => openVargaChart("ashtakavarga_reduction", "AshtakavargaReduction") },
    { label: "Krishnamurthy Chart (KP)", keywords: ["krishnamurthy", "krishanamurthy", "chart", "kp"], action: () => openVargaChart("krishnamurthy_chart", "KrishnamurthyChart") },
    { label: "Krishnamurthy Significators", keywords: ["krishnamurthy", "krishanamurthy", "significators", "kp"], action: () => openVargaChart("krishnamurthy_significators", "KrishnamurthySignificators") },

    // Graha Dasha Subcategory
    { label: "Vimshottari Dasha", keywords: ["vimshottari", "dasha", "mahadasha"], action: () => openVargaChart("vimshottari", "Vimshottari") },
    { label: "Panch Pakshi", keywords: ["panch", "pakshi", "birds", "time"], action: () => openVargaChart("panch_pakshi", "PanchPakshi") },
    { label: "Shodashottari Dasha", keywords: ["shodashottari", "dasha"], action: () => openVargaChart("shodashottari", "Shodashottari") },
    { label: "Chaturshitisama Dasha", keywords: ["chaturshitisama", "dasha"], action: () => openVargaChart("chaturshitisama", "Chaturshitisama") },
    { label: "Ashtottari Dasha", keywords: ["ashtottari", "dasha"], action: () => openVargaChart("ashtottari", "Ashtottari") },
    { label: "Dwisaptatisama Dasha", keywords: ["dwisaptatisama", "dasha"], action: () => openVargaChart("dwisaptatisama", "Dwisaptatisama") },
    { label: "Dwadashottari Dasha", keywords: ["dwadashottari", "dasha"], action: () => openVargaChart("dwadashottari", "Dwadashottari") },
    { label: "Panchottari Dasha", keywords: ["panchottari", "dasha"], action: () => openVargaChart("panchottari", "Panchottari") },
    { label: "Shatabdika Dasha", keywords: ["shatabdika", "dasha"], action: () => openVargaChart("shatabdika", "Shatabdika") },
    { label: "Shashtihayani Dasha", keywords: ["shashtihayani", "dasha"], action: () => openVargaChart("shashtihayani", "Shashtihayani") },

    // Rashi Dasha Subcategory
    { label: "Chara Dasha", keywords: ["chara", "dasha", "rashi"], action: () => openVargaChart("chara", "CharaDasha") },
    { label: "Mandooka Dasha", keywords: ["mandooka", "dasha", "frog", "rashi"], action: () => openVargaChart("mandooka", "MandookaDasha") },
    { label: "Drig Dasha", keywords: ["drig", "dasha", "aspect", "rashi"], action: () => openVargaChart("drig", "DrigDasha") },
    { label: "Sudasha", keywords: ["sudasha", "dasha", "rashi"], action: () => openVargaChart("sudasha", "Sudasha") },

    // Aayu Dasha (Longevity) Subcategory
    { label: "Shoola Dasha", keywords: ["shoola", "dasha", "longevity", "aayu"], action: () => openVargaChart("shoola", "ShoolaDasha") },
    { label: "Niryana Shoola Dasha", keywords: ["niryana", "shoola", "dasha", "longevity", "aayu"], action: () => openVargaChart("niryaana_shoola", "NiryanaShoolaDasha") },
    { label: "Sthira Dasha", keywords: ["sthira", "dasha", "longevity", "aayu", "fixed"], action: () => openVargaChart("sthira", "SthiraDasha") },

    // Varshphal Subcategory
    { label: "Annual Varshaphala", keywords: ["annual", "varshaphala", "varshphal", "yearly", "tajik"], action: () => openReadingReport("annual_varshaphala", "AnnualVarshaphala") },
    { label: "Varshaphala Details", keywords: ["varshaphala", "details", "varshphal"], action: () => openReadingReport("varshaphala_details", "VarshaphalaDetails") },
    { label: "Varshaphala Detailed Charts", keywords: ["varshaphala", "detailed", "charts", "varshphal"], action: () => openReadingReport("detailed_charts", "VarshaphalaDetailedCharts") },

    // Astro Charts Dropdown
    { label: "Lagna", keywords: ["lagna", "ascendant"], action: () => openVargaChart("lagna", "Lagna") },
    { label: "Classic View", keywords: ["classic", "view", "layout"], action: () => openReadingReport("classic_layout", "ClassicView") },
    { label: "Classic View 2", keywords: ["classic", "view", "layout", "2"], action: () => openReadingReport("classic_layout_2", "ClassicView2") },
    { label: "Classic View 3", keywords: ["classic", "view", "layout", "3"], action: () => openReadingReport("classic_layout_3", "ClassicView3") },
    { label: "Classic View 4", keywords: ["classic", "view", "layout", "4"], action: () => openReadingReport("classic_layout_4", "ClassicView4") },
    { label: "Kalachakra Diagram", keywords: ["kalachakra", "diagram", "chakra"], action: () => openReadingReport("kalachakra", "KalachakraDiagram") },
    { label: "Compare Transit", keywords: ["compare", "transit", "gochar"], action: () => openReadingReport("transit_compare", "TransitCompare") },
    { label: "Compare Transit 2", keywords: ["compare", "transit", "gochar", "2"], action: () => openReadingReport("transit_compare2", "TransitCompare2") },
    { label: "Animated Transit", keywords: ["animated", "transit", "gochar", "animation"], action: () => openReadingReport("animated_transits", "AnimatedTransit") },
    { label: "Sunrise Chart", keywords: ["sunrise", "chart", "sun"], action: () => openReadingReport("sunrise_chart", "SunriseChart") },
    { label: "Solar Return", keywords: ["solar", "return", "varshphal"], action: () => openReadingReport("solar_return", "SolarReturn") },
    { label: "Daily Solar", keywords: ["daily", "solar", "sun"], action: () => openReadingReport("daily_solar", "DailySolar") },
    { label: "KP Chart", keywords: ["kp", "chart", "krishnamurthy"], action: () => openReadingReport("kp_chart", "KPChart") },
    { label: "Today Gochar", keywords: ["today", "gochar", "transit"], action: () => openVargaChart("transit", "TodayGochar") },
    { label: "Current Planet Position", keywords: ["current", "planet", "position", "graha"], action: () => openVargaChart("current_positions", "CurrentPlanetPosition") },
    { label: "Bhinnashtavarga", keywords: ["bhinnashtavarga", "ashtakavarga", "points"], action: () => openVargaChart("bhinnastavarga", "Bhinnashtavarga") },
    { label: "Lordships", keywords: ["lordships", "lords", "houses"], action: () => openReadingReport("lordships", "Lordships") },
    { label: "Varga Sign Chart", keywords: ["varga", "sign", "chart", "rashi"], action: () => openReadingReport("varga_sign_chart", "VargaSignChart") },
    { label: "Gochar Wheel", keywords: ["gochar", "wheel", "transit", "chakra"], action: () => openReadingReport("gochara_wheel", "GocharWheel") },
    { label: "Gochar Wheel 1", keywords: ["gochar", "wheel", "1", "transit"], action: () => openReadingReport("gochara_wheel_1", "GocharWheel1") },
    { label: "Nakshatra Dasha", keywords: ["nakshatra", "dasha"], action: () => openReadingReport("nakshatra_dasha", "NakshatraDasha") },
    { label: "Rashi Dashas", keywords: ["rashi", "dashas", "rasha", "dasha"], action: () => openReadingReport("rashi_dashas", "RashiDashas") },
    { label: "Lagnas", keywords: ["lagnas", "ascendant"], action: () => openReadingReport("lagnas", "Lagnas") },
    { label: "Jaimini Karakas", keywords: ["jaimini", "karakas"], action: () => openReadingReport("jaimini_karakas", "JaiminiKarakas") },
    { label: "Advanced Jaimini", keywords: ["advanced", "jaimini"], action: () => openReadingReport("jaimini_advanced", "AdvancedJaimini") },
    { label: "Sarvatobhadra Dashboard", keywords: ["sarvatobhadra", "dashboard", "sbc", "sarvotavbhadra"], action: () => openReadingReport("sbc_dashboard", "SarvatobhadraDashboard") },
    { label: "Bhrigu Bindu", keywords: ["bhrigu", "bindu", "biindu"], action: () => openReadingReport("bhrigu_bindu", "BhriguBindu") },
    { label: "D108 Chart", keywords: ["d108", "ashtottaramsha"], action: () => openReadingReport("d108", "D108Chart") },
    { label: "Ayanamsha", keywords: ["ayanamsha", "ayanmasha"], action: () => openReadingReport("ayanamsha", "Ayanamsha") },
    { label: "Sanghatta", keywords: ["sanghatta", "sanghata"], action: () => openReadingReport("sanghatta", "Sanghatta") },
    { label: "Karakas", keywords: ["karakas", "karaka"], action: () => openReadingReport("karaka", "Karakas") },
    { label: "Tithi Pravesha", keywords: ["tithi", "pravesha", "pravesh"], action: () => openReadingReport("tithi", "TithiPravesha") },
    { label: "Kota Chakra", keywords: ["kota", "chakra"], action: () => openReadingReport("kota_chakra", "KotaChakra") },
    { label: "Sudarshan Chakra", keywords: ["sudarshan", "chakra"], action: () => openReadingReport("sudarshan_chakra", "SudarshanChakra") },

    // Oracle Tools Dropdown
    { label: "Ascendant (Oracle)", keywords: ["ascendant", "oracle"], action: () => openOracleTool("ascendant", "OracleAscendant") },
    { label: "Study (Oracle)", keywords: ["study", "oracle"], action: () => openOracleTool("study", "OracleStudy") },
    { label: "Career (Oracle)", keywords: ["career", "oracle", "job", "profession"], action: () => openOracleTool("career", "OracleCareer") },
    { label: "Finance / Wealth Activation (Oracle)", keywords: ["finance", "oracle", "wealth", "money"], action: () => openOracleTool("finance", "OracleFinance") },
    { label: "Marriage (Oracle)", keywords: ["marriage", "oracle", "wedding", "spouse"], action: () => openOracleTool("marriage", "OracleMarriage") },
    { label: "Legal Matters (Oracle)", keywords: ["legal", "matters", "oracle", "court", "law"], action: () => openOracleTool("legal_matters", "OracleLegal") },
    { label: "Business (Oracle)", keywords: ["business", "oracle"], action: () => openOracleTool("business", "OracleBusiness") },
    { label: "Business Naming (Oracle)", keywords: ["business", "naming", "oracle"], action: () => openOracleTool("business_naming", "OracleBusinessNaming") },
    { label: "Health (Oracle)", keywords: ["health", "oracle", "disease"], action: () => openOracleTool("health", "OracleHealth") },
    { label: "Parents Health (Oracle)", keywords: ["parents", "health", "oracle", "mother", "father"], action: () => openOracleTool("parents_health", "OracleParentsHealth") },
    { label: "Spouse Health (Oracle)", keywords: ["spouse", "health", "oracle"], action: () => openOracleTool("spouse_health", "OracleSpouseHealth") },
    { label: "Childrens Health (Oracle)", keywords: ["childrens", "health", "oracle", "child"], action: () => openOracleTool("children_health", "OracleChildrenHealth") },
    { label: "Mental Peace (Oracle)", keywords: ["mental", "peace", "oracle", "mind"], action: () => openOracleTool("mental_peace", "OracleMentalPeace") },
    { label: "Ghar me Sukh Shanti (Oracle)", keywords: ["ghar", "me", "sukh", "shanti", "oracle", "home", "peace"], action: () => openOracleTool("home_peace", "OracleHomePeace") },
    { label: "Manglik (Oracle)", keywords: ["manglik", "oracle", "mangal", "dosha"], action: () => openOracleTool("manglik", "OracleManglik") },
    { label: "Kalsarp Dosha (Oracle)", keywords: ["kalsarp", "dosha", "oracle"], action: () => openOracleTool("kalsarp", "OracleKalsarp") },
    { label: "Pitra Dosha (Oracle)", keywords: ["pitra", "dosha", "oracle"], action: () => openOracleTool("pitra", "OraclePitra") },
    { label: "Sadesati (Oracle)", keywords: ["sadesati", "oracle", "shani"], action: () => openOracleTool("sadesati", "OracleSadesati") },
    { label: "Rahu Dosha (Oracle)", keywords: ["rahu", "dosha", "oracle"], action: () => openOracleTool("rahu", "OracleRahu") },
    { label: "Ketu Dosha (Oracle)", keywords: ["ketu", "dosha", "oracle"], action: () => openOracleTool("ketu", "OracleKetu") },
    { label: "Lo Shu Grid (Oracle)", keywords: ["lo shu", "grid", "oracle", "numerology"], action: () => openOracleTool("loshu", "OracleLoshu") },
    { label: "Lal Kitab (Oracle)", keywords: ["lal", "kitab", "oracle"], action: () => openOracleTool("lalkitab", "OracleLalkitab") },
    { label: "Daily Panchang (Oracle)", keywords: ["daily", "panchang", "oracle"], action: () => openOracleTool("daily_panchang", "OracleDailyPanchang") },
    { label: "Monthly Calendar (Oracle)", keywords: ["monthly", "calendar", "oracle", "panchang"], action: () => openOracleTool("monthly_panchang", "OracleMonthlyPanchang") },
    { label: "Advanced Doshas & Exceptions (Oracle)", keywords: ["advanced", "doshas", "exceptions", "oracle"], action: () => openOracleTool("dosha", "OracleDosha") },
    { label: "Digbala Compass / Directions (Oracle)", keywords: ["digbala", "compass", "directions", "oracle"], action: () => openOracleTool("digbala", "OracleDigbala") },
    { label: "Horary Astrology (Oracle)", keywords: ["horary", "astrology", "oracle", "prashna"], action: () => openOracleTool("horary", "OracleHorary") },
    { label: "Sudarshan Chakra (Oracle)", keywords: ["sudarshan", "chakra", "oracle"], action: () => openOracleTool("chakra", "OracleChakra") },
    { label: "Yantra Suggestion (Oracle)", keywords: ["yantra", "suggestion", "oracle"], action: () => openOracleTool("yantra", "OracleYantra") },

    // Chart Views
    { label: "Chart View 1", keywords: ["chart view 1", "view 1", "c1"], action: () => openChartView(1, "ChartView1") },
    { label: "Chart View 2", keywords: ["chart view 2", "view 2", "c2"], action: () => openChartView(2, "ChartView2") },
    { label: "Chart View 3", keywords: ["chart view 3", "view 3", "c3"], action: () => openChartView(3, "ChartView3") },

    // Varga Charts & Misc
    { label: "Lagna / D1 Chart / Janma Kundali", keywords: ["d1", "lagna", "birth chart", "janma kundali", "rashi"], action: () => openVargaChart("d1", "D1Chart") },
    { label: "D2 - Hora Chart", keywords: ["d2", "hora", "wealth", "finance"], action: () => openVargaChart("d2", "D2Chart") },
    { label: "D3 - Drekkana Chart", keywords: ["d3", "drekkana", "siblings", "courage"], action: () => openVargaChart("d3", "D3Chart") },
    { label: "D4 - Chaturthamsha Chart", keywords: ["d4", "chaturthamsha", "property", "fortune"], action: () => openVargaChart("d4", "D4Chart") },
    { label: "D7 - Saptamsha Chart", keywords: ["d7", "saptamsha", "children", "progeny"], action: () => openVargaChart("d7", "D7Chart") },
    { label: "D9 - Navamsha Chart", keywords: ["d9", "navamsha", "marriage", "spouse", "relationships"], action: () => openVargaChart("d9", "D9Chart") },
    { label: "D10 - Dashamsha Chart", keywords: ["d10", "dashamsha", "career", "profession"], action: () => openVargaChart("d10", "D10Chart") },
    { label: "D12 - Dwadashamsha Chart", keywords: ["d12", "dwadashamsha", "parents"], action: () => openVargaChart("d12", "D12Chart") },
    { label: "D16 - Shodashamsha Chart", keywords: ["d16", "shodashamsha", "vehicles", "happiness"], action: () => openVargaChart("d16", "D16Chart") },
    { label: "D24 - Chaturvimshamsha Chart", keywords: ["d24", "chaturvimshamsha", "education", "learning"], action: () => openVargaChart("d24", "D24Chart") },
    { label: "D30 - Trimshamsha Chart", keywords: ["d30", "trimshamsha", "misfortunes", "diseases"], action: () => openVargaChart("d30", "D30Chart") },
    { label: "D60 - Shashtiamsha Chart", keywords: ["d60", "shashtiamsha", "karma", "past life"], action: () => openVargaChart("d60", "D60Chart") },
  ];
};
