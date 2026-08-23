import React, { useState, useEffect } from 'react';
import { fetchReportData } from './services/api';
import GenerateReport from './pages/GenerateReport';
import MatchmakingPage from './pages/matchmaking/MatchmakingPage';
import CompatibilityHub from './pages/compatibility/CompatibilityHub';
import BiodataGenerator from './pages/biodata/BiodataGenerator';
import InteractiveWorksheet from './components/InteractiveWorksheet';
import IshtaDevViewer from './components/IshtaDevViewer';
import ClassicLayoutViewer from './components/ClassicLayoutViewer';
import { useWindowNavigation } from './hooks/useWindowNavigation';
import ClassicLayoutViewer2 from './components/ClassicLayoutViewer2';
import ClassicLayoutViewer3 from './components/ClassicLayoutViewer3';
import ClassicLayoutViewer4 from './components/ClassicLayoutViewer4';
import ChartView1 from './components/ChartView1';
import ChartView2 from './components/ChartView2';
import ChartView3 from './components/ChartView3';
import LordshipView from './components/LordshipView';
import VargaSignChart from './components/VargaSignChart';
import BalaStrengths from './components/BalaStrengths';
import BhavbalaView from './components/BhavbalaView';
import GocharaWheelView from './components/GocharaWheelView';
import GocharaWheel1View from './components/GocharaWheel1View';
import NakshatraDashaView from './components/NakshatraDashaView';
import RashiDashasView from './components/RashiDashasView';
import LagnasView from './components/LagnasView';
import OracleViewer from './components/OracleViewer';
import HoroscopeViewer from './components/HoroscopeViewer';
import JaiminiKarakasViewer from './components/JaiminiKarakasViewer';
import LalKitabViewer from './components/LalKitabViewer';
import DailyPanchangViewer from './components/DailyPanchangViewer';
import MonthlyPanchangViewer from './components/MonthlyPanchangViewer';
import AdvancedNakshatraViewer from './components/AdvancedNakshatraViewer';
import Prashna from './components/Prashna';
import Chakra from './components/Chakra';
import Remedy from './components/Remedy';
import MuhurtCalculator from './components/MuhurtCalculator';
import StudyViewer from './components/StudyViewer';
import CareerViewer from './components/CareerViewer';
import FinanceViewer from './components/FinanceViewer';
import FinanceAnalysis from './components/FinanceAnalysis';
import MarriageAnalysis from './components/MarriageAnalysis';
import MarriageViewer from './components/MarriageViewer';
import BusinessViewer from './components/BusinessViewer';
import HealthAnalysis from './components/HealthAnalysis';
import ParentsHealthViewer from './components/ParentsHealthViewer';
import SpouseHealthViewer from './components/SpouseHealthViewer';
import ChildrenHealthViewer from './components/ChildrenHealthViewer';
import MentalPeaceViewer from './components/MentalPeaceViewer';
import HomePeaceViewer from './components/HomePeaceViewer';
import AscendantAnalysis from './components/AscendantAnalysis';
import MoonSignAnalysis from './components/MoonSignAnalysis';
import SadesatiAnalysis from './components/SadesatiAnalysis';
import SolarSystem3D from './components/SolarSystem3D';
import SBCGrid from './components/SBCGrid';
import SarvatobhadraDashboard from './pages/SarvatobhadraDashboard';
import D108Dashboard from './components/D108Dashboard';
import AyanamshaDashboard from './components/AyanamshaDashboard';
import SanghattaDashboard from './components/SanghattaDashboard';
import KotaChakraViewer from './components/KotaChakraViewer';
import KurmaChakraViewer from './components/KurmaChakraViewer';
import SudarshanChakraViewer from './components/SudarshanChakraViewer';
import ChaitraChartViewer from './components/ChaitraChartViewer';
import MedicalAstrologyDashboard from './components/MedicalAstrologyDashboard';
import DoshaDashboard from './components/DoshaDashboard';
import DigbalaCompass from './components/DigbalaCompass';
import KarakaDashboard from './components/KarakaDashboard';
import TithiDashboard from './components/TithiDashboard';
import SolarReturnViewer from './components/SolarReturnViewer';
import DailySolarViewer from './components/DailySolarViewer';
import AnnualVarshaphalaViewer from './components/AnnualVarshaphalaViewer';
import VarshaphalaDetailsViewer from './components/VarshaphalaDetailsViewer';
import HarshaBalaViewer from './components/HarshaBalaViewer';
import TajikaYogasViewer from './components/TajikaYogasViewer';
import TripatakiChakraViewer from './components/TripatakiChakraViewer';
import KalachakraViewer from './components/KalachakraViewer';
import AshtakavargaViewer from './components/AshtakavargaViewer';

import VimshottariLifeTable from './components/VimshottariLifeTable';
import LongevityViewer from './components/LongevityViewer';
import ZodiacPDFchart from './components/ZodiacPDFchart';
import VarshaphalaDetailedCharts from './components/VarshaphalaDetailedCharts';
import AnimatedTransitsViewer from './components/AnimatedTransitsViewer';
import NavamshaAgesViewer from './components/NavamshaAgesViewer';
import KPChartViewer from './components/KPChartViewer';
import AstrologicalTimeMachine from './components/AstrologicalTimeMachine';
import VimshottariGridTimeline from './components/VimshottariGridTimeline';
import ZodiacChart from './components/ZodiacChart';
import SunriseChartViewer from './components/SunriseChartViewer';
import KundaliReportView from './components/KundaliReportView';
import BhriguBinduAnalysis from './components/BhriguBinduAnalysis';
import AdvancedMuhurtaSearch from './components/AdvancedMuhurtaSearch';
import NotificationManager from './components/NotificationManager';
import PrashnaEngine from './components/PrashnaEngine';
import KPEngine from './components/KPEngine';
import NadiViewer from './components/NadiViewer';
import MantraTracker from './components/MantraTracker';
import SynastryDashboard from './components/SynastryDashboard';
import BrahmaMuhurtViewer from './components/BrahmaMuhurtViewer';
import NamingCalculator from './components/NamingCalculator';
import DasaTimeline from './components/DasaTimeline';
import DeepHoroscopeViewer from './components/DeepHoroscopeViewer.jsx';
import AshtamangalaPrasna from './components/AshtamangalaPrasna';
import BTRWizard from './components/BTRWizard';
import AdvancedJaiminiDashboard from './components/AdvancedJaiminiDashboard';
import AyurdayaViewer from './components/AyurdayaViewer';
import VastuAnalyzer from './pages/VastuAnalyzer';
import NumerologyDashboard from './pages/NumerologyDashboard';
import PredictionNumerology from './pages/predictionNumerology';
import DailyNumerology from './pages/dailyNumerology';
import RemedyNumerology from './pages/remedyNumerology';
import MedicalNumerology from './pages/medicalNumerology';
import PersonalityNumerology from './pages/personalityNumerology';
import MarriageNumerology from './pages/marriageNumerology';
import CarrierNumerology from './pages/carrierNumerology';
import FaceReader from './pages/FaceReader.jsx';
import VimshottariExplanation from './components/VimshottariExplanation';
import DashaDashboard from './pages/DashaDashboard';
import LegalMattersViewer from './components/LegalMattersViewer.jsx';


function App() {
    useWindowNavigation();
    const [vimshottariRefMode, setVimshottariRefMode] = useState(false);
    const [dashaAnalysisMode, setDashaAnalysisMode] = useState(false);
    const [yearlyDashaMode, setYearlyDashaMode] = useState(false);
    const [dashaGridMode, setDashaGridMode] = useState(false);
    const [isWorksheetMode, setIsWorksheetMode] = useState(false);
    const [advancedNakshatraMode, setAdvancedNakshatraMode] = useState(false);
    const [classicLayoutMode, setClassicLayoutMode] = useState(false);
    const [classicLayout2Mode, setClassicLayout2Mode] = useState(false);
    const [classicLayout3Mode, setClassicLayout3Mode] = useState(false);
    const [classicLayout4Mode, setClassicLayout4Mode] = useState(false);
    const [chartView1Mode, setChartView1Mode] = useState(false);
    const [chartView2Mode, setChartView2Mode] = useState(false);
    const [chartView3Mode, setChartView3Mode] = useState(false);
    const [lordshipsMode, setLordshipsMode] = useState(false);
    const [vargaSignChartMode, setVargaSignChartMode] = useState(false);
    const [balaStrengthsMode, setBalaStrengthsMode] = useState(false);
    const [bhavbalaMode, setBhavbalaMode] = useState(false);
    const [gocharaWheelMode, setGocharaWheelMode] = useState(false);
    const [gocharaWheel1Mode, setGocharaWheel1Mode] = useState(false);
    const [nakshatraDashaMode, setNakshatraDashaMode] = useState(false);
    const [rashiDashasMode, setRashiDashasMode] = useState(false);
    const [lagnasMode, setLagnasMode] = useState(false);
    const [jaiminiKarakasMode, setJaiminiKarakasMode] = useState(false);
    const [worksheetData, setWorksheetData] = useState(null);
    const [ishtaDevMode, setIshtaDevMode] = useState(false);
    const [ishtaDevData, setIshtaDevData] = useState(null);
    const [oracleMode, setOracleMode] = useState(false);
    const [lalkitabMode, setLalkitabMode] = useState(false);
    const [panchangMode, setPanchangMode] = useState(false);
    const [monthlyPanchangMode, setMonthlyPanchangMode] = useState(false);
    const [horaryMode, setHoraryMode] = useState(false);
    const [chakraMode, setChakraMode] = useState(false);
    const [yantraMode, setYantraMode] = useState(false);
    const [muhurtMode, setMuhurtMode] = useState(false);
    const [horoscopeMode, setHoroscopeMode] = useState(false);
    const [studyMode, setStudyMode] = useState(false);
    const [careerMode, setCareerMode] = useState(false);
    const [financeMode, setFinanceMode] = useState(false);
    const [marriageMode, setMarriageMode] = useState(false);
    const [legalMattersMode, setLegalMattersMode] = useState(false);
    const [businessMode, setBusinessMode] = useState(false);
    const [healthMode, setHealthMode] = useState(false);
    const [parentsHealthMode, setParentsHealthMode] = useState(false);
    const [spouseHealthMode, setSpouseHealthMode] = useState(false);
    const [childrenHealthMode, setChildrenHealthMode] = useState(false);
    const [mentalPeaceMode, setMentalPeaceMode] = useState(false);
    const [homePeaceMode, setHomePeaceMode] = useState(false);
    const [ascendantMode, setAscendantMode] = useState(false);
    const [moonSignMode, setMoonSignMode] = useState(false);
    const [sadesatiReportMode, setSadesatiReportMode] = useState(false);
    const [matchmakingMode, setMatchmakingMode] = useState(false);
    const [compatibilityHubMode, setCompatibilityHubMode] = useState(false);
    const [biodataMode, setBiodataMode] = useState(false);
    const [sbcGridMode, setSbcGridMode] = useState(false);
    const [sbcDashboardMode, setSbcDashboardMode] = useState(false);
    const [d108Mode, setD108Mode] = useState(false);
    const [ayanamshaMode, setAyanamshaMode] = useState(false);
    const [kotaChakraMode, setKotaChakraMode] = useState(false);
    const [kurmaChakraMode, setKurmaChakraMode] = useState(false);
    const [sudarshanChakraMode, setSudarshanChakraMode] = useState(false);
    const [chaitraChartMode, setChaitraChartMode] = useState(false);
    const [medicalAstrologyMode, setMedicalAstrologyMode] = useState(false);
    const [doshaMode, setDoshaMode] = useState(false);
    const [digbalaMode, setDigbalaMode] = useState(false);
    const [sanghattaMode, setSanghattaMode] = useState(false);
    const [karakaMode, setKarakaMode] = useState(false);
    const [tithiMode, setTithiMode] = useState(false);
    const [solarReturnMode, setSolarReturnMode] = useState(false);
    const [dailySolarMode, setDailySolarMode] = useState(false);
    const [annualVarshaphalaMode, setAnnualVarshaphalaMode] = useState(false);
    const [harshaBalaMode, setHarshaBalaMode] = useState(false);
    const [tajikaYogasMode, setTajikaYogasMode] = useState(false);
    const [tripatakiChakraMode, setTripatakiChakraMode] = useState(false);
    const [kalachakraMode, setKalachakraMode] = useState(false);
    const [longevityMode, setLongevityMode] = useState(false);
    const [animatedTransitsMode, setAnimatedTransitsMode] = useState(false);
    const [navamshaAgesMode, setNavamshaAgesMode] = useState(false);
    const [kpChartMode, setKpChartMode] = useState(false);
    const [sunriseChartMode, setSunriseChartMode] = useState(false);
    const [bhriguBinduMode, setBhriguBinduMode] = useState(false);
    const [htmlReportMode, setHtmlReportMode] = useState(false);
    const [isBlankSheetMode, setIsBlankSheetMode] = useState(false);
    const [advancedMuhurtaMode, setAdvancedMuhurtaMode] = useState(false);
    const [varshaphalaDetailsMode, setVarshaphalaDetailsMode] = useState(false);
    const [detailedChartsMode, setDetailedChartsMode] = useState(false);
    const [horoscopeData, setHoroscopeData] = useState(null);
    const [fullScreenParam, setFullScreenParam] = useState(null);
    const [oracleCategory, setOracleCategory] = useState(null);
    const [namingMode, setNamingMode] = useState(false);
    const [dasaTimelineMode, setDasaTimelineMode] = useState(false);
    const [solarSystem3DMode, setSolarSystem3DMode] = useState(false);
    const [astroTmMode, setAstroTmMode] = useState(false);
    const [deepHoroscopeMode, setDeepHoroscopeMode] = useState(false);
    const [deepHoroscopeType, setDeepHoroscopeType] = useState(null);
    const [ashtamangalaMode, setAshtamangalaMode] = useState(false);
    const [btrMode, setBtrMode] = useState(false);
    const [advancedJaiminiMode, setAdvancedJaiminiMode] = useState(false);
    const [ayurdayaMode, setAyurdayaMode] = useState(false);
    const [vastuMode, setVastuMode] = useState(false);
    const [numerologyMode, setNumerologyMode] = useState(false);
    const [predictionNumerologyMode, setPredictionNumerologyMode] = useState(false);
    const [dailyNumerologyMode, setDailyNumerologyMode] = useState(false);
    const [remedyNumerologyMode, setRemedyNumerologyMode] = useState(false);
    const [medicalNumerologyMode, setMedicalNumerologyMode] = useState(false);
    const [personalityNumerologyMode, setPersonalityNumerologyMode] = useState(false);
    const [marriageNumerologyMode, setMarriageNumerologyMode] = useState(false);
    const [carrierNumerologyMode, setCarrierNumerologyMode] = useState(false);
    const [remedyMode, setRemedyMode] = useState(false);
    const [faceReadingMode, setFaceReadingMode] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        // Define oracle categories that should trigger OracleViewer
        const categories = [
            'mental_peace', 'home_peace',
            'manglik', 'kalsarp', 'pitra', 'sadesati', 'rahu', 'ketu', 'loshu', 'business_naming'
        ];

        if (params.get('vimshottari_ref') === 'true') {
            setVimshottariRefMode(true);
        } else if (params.get('dasha_analysis') === 'true') {
            setDashaAnalysisMode(true);
        } else if (params.get('yearly_dasha') === 'true') {
            setYearlyDashaMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('dasha_timeline') === 'true') {
            setDashaGridMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('worksheet') === 'true') {
            setIsWorksheetMode(true);
            const fs = params.get('fullScreen');
            if (fs) setFullScreenParam(fs);

            const urlDate = params.get("date");
            const urlTime = params.get("time");
            const urlLat = params.get("lat");
            const urlLon = params.get("lon");
            const urlName = params.get("name") || "";
            const urlTz = params.get("tz_offset");
            const urlLocName = params.get("location_name") || "Birth Place";
            const urlGender = params.get("gender") || "Male";

            if (urlDate && urlTime && urlLat && urlLon) {
                const tzVal = urlTz ? parseFloat(urlTz) : 5.5;
                const payload = {
                    name: urlName,
                    date: urlDate,
                    time: urlTime,
                    tz_offset: tzVal,
                    lat: parseFloat(urlLat),
                    lon: parseFloat(urlLon),
                    style: "minimal",
                    language: "english",
                    gender: urlGender,
                    location_name: urlLocName,
                };

                (async () => {
                    try {
                        const detailedData = await fetchReportData(payload);
                        localStorage.setItem('worksheetData', JSON.stringify(detailedData));
                        setWorksheetData(detailedData);
                    } catch (e) {
                        console.error("Failed to dynamically fetch/save report data:", e);
                    }
                })();
            } else {
                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    try {
                        setWorksheetData(JSON.parse(savedData));
                    } catch (e) {
                        console.error("Failed to parse worksheet data", e);
                    }
                }
            }
        } else if (params.get('transit_compare') === 'true') {
            setIsWorksheetMode(true);
            setFullScreenParam('transit_compare');
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('transit_compare2') === 'true') {
            setIsWorksheetMode(true);
            setFullScreenParam('transit_compare2');
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('classic_layout') === 'true') {
            setClassicLayoutMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('classic_layout_2') === 'true') {
            setClassicLayout2Mode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('classic_layout_3') === 'true') {
            setClassicLayout3Mode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('classic_layout_4') === 'true') {
            setClassicLayout4Mode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('chart_view_1') === 'true') {
            setChartView1Mode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('chart_view_2') === 'true') {
            setChartView2Mode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('chart_view_3') === 'true') {
            setChartView3Mode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('lordships') === 'true') {
            setLordshipsMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('varga_sign_chart') === 'true') {
            setVargaSignChartMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('bala_strengths') === 'true') {
            setBalaStrengthsMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('bhavbala') === 'true') {
            setBhavbalaMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('gochara_wheel') === 'true') {
            setGocharaWheelMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('gochara_wheel_1') === 'true') {
            setGocharaWheel1Mode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('nakshatra_dasha') === 'true') {
            setNakshatraDashaMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('rashi_dashas') === 'true') {
            setRashiDashasMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('lagnas') === 'true') {
            setLagnasMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('jaimini_karakas') === 'true') {
            setJaiminiKarakasMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('ishtaDev') === 'true') {
            setIshtaDevMode(true);
            const savedData = localStorage.getItem('ishtaDevData');
            if (savedData) {
                try {
                    setIshtaDevData(JSON.parse(savedData));
                } catch (e) {
                    console.error("Failed to parse ishta dev data", e);
                }
            }
        } else if (params.get('horoscope') === 'true') {
            setHoroscopeMode(true);
            const savedData = localStorage.getItem('horoscopeData');
            if (savedData) {
                try {
                    setHoroscopeData(JSON.parse(savedData));
                } catch (e) {
                    console.error("Failed to parse horoscope data", e);
                }
            }
        } else if (params.get('deep_horoscope')) {
            setDeepHoroscopeMode(true);
            setDeepHoroscopeType(params.get('deep_horoscope'));

            const urlDate = params.get("date");
            const urlTime = params.get("time");
            const urlLat = params.get("lat");
            const urlLon = params.get("lon");
            const urlName = params.get("name") || "";
            const urlTz = params.get("tz_offset");
            const urlLocName = params.get("location_name") || "Birth Place";
            const urlGender = params.get("gender") || "Male";

            if (urlDate && urlTime && urlLat && urlLon) {
                const tzVal = urlTz ? parseFloat(urlTz) : 5.5;
                const payload = {
                    name: urlName,
                    date: urlDate,
                    time: urlTime,
                    tz_offset: tzVal,
                    lat: parseFloat(urlLat),
                    lon: parseFloat(urlLon),
                    style: "minimal",
                    language: "english",
                    gender: urlGender,
                    location_name: urlLocName,
                };

                (async () => {
                    try {
                        const detailedData = await fetchReportData(payload);
                        localStorage.setItem('deepHoroscopeData', JSON.stringify(detailedData));
                        setWorksheetData(detailedData);
                    } catch (e) {
                        console.error("Failed to dynamically fetch/save deep horoscope data:", e);
                    }
                })();
            } else {
                const savedData = localStorage.getItem('deepHoroscopeData');
                if (savedData) {
                    try {
                        setWorksheetData(JSON.parse(savedData));
                    } catch (e) { }
                }
            }
        } else if (params.get('oracle')) {
            setOracleMode(true);
            setOracleCategory(params.get('oracle'));
        } else if (params.get('lalkitab') === 'true') {
            setLalkitabMode(true);
        } else if (params.get('advanced_nakshatra') === 'true') {
            setAdvancedNakshatraMode(true);
        } else if (params.get('naming') === 'true') {
            setNamingMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('panchang') === 'true') {
            setPanchangMode(true);
        } else if (params.get('monthly_panchang') === 'true') {
            setMonthlyPanchangMode(true);
        } else if (params.get('horary') === 'true') {
            setHoraryMode(true);
        } else if (params.get('btr') === 'true') {
            setBtrMode(true);
        } else if (params.get('jaimini_advanced') === 'true') {
            setAdvancedJaiminiMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('ayurdaya') === 'true') {
            setAyurdayaMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('ashtamangala') === 'true') {
            setAshtamangalaMode(true);
        } else if (params.get('chakra') === 'true') {
            setChakraMode(true);
        } else if (params.get('yantra') === 'true') {
            setYantraMode(true);
        } else if (params.get('muhurt') === 'true') {
            setMuhurtMode(true);
        } else if (params.get('study') === 'true') {
            setStudyMode(true);
        } else if (params.get('career') === 'true') {
            setCareerMode(true);
        } else if (params.get('finance') === 'true') {
            setFinanceMode(true);
        } else if (params.get('marriage') === 'true') {
            setMarriageMode(true);
        } else if (params.get('legal_matters') === 'true') {
            setLegalMattersMode(true);
        } else if (params.get('business') === 'true') {
            setBusinessMode(true);
        } else if (params.get('health') === 'true') {
            setHealthMode(true);
        } else if (params.get('parents_health') === 'true') {
            setParentsHealthMode(true);
        } else if (params.get('spouse_health') === 'true') {
            setSpouseHealthMode(true);
        } else if (params.get('children_health') === 'true') {
            setChildrenHealthMode(true);
        } else if (params.get('mental_peace') === 'true') {
            setMentalPeaceMode(true);
        } else if (params.get('home_peace') === 'true') {
            setHomePeaceMode(true);
        } else if (params.get('ascendant') === 'true') {
            setAscendantMode(true);
        } else if (params.get('moonSign') === 'true') {
            setMoonSignMode(true);
        } else if (params.get('sadesati_report') === 'true') {
            setSadesatiReportMode(true);
        } else if (params.get('matchmaking') === 'true') {
            setMatchmakingMode(true);
        } else if (params.get('compatibility-hub') === 'true') {
            setCompatibilityHubMode(true);
        } else if (params.get('biodata') === 'true') {
            setBiodataMode(true);
        } else if (params.get('sbc') === 'true') {
            setSbcGridMode(true);
        } else if (params.get('sbc_dashboard') === 'true') {
            setSbcDashboardMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('d108') === 'true') {
            setD108Mode(true);
        } else if (params.get('ayanamsha') === 'true') {
            setAyanamshaMode(true);
        } else if (params.get('kota_chakra') === 'true') {
            setKotaChakraMode(true);
        } else if (params.get('kurma_chakra') === 'true') {
            setKurmaChakraMode(true);
        } else if (params.get('sudarshan_chakra') === 'true') {
            setSudarshanChakraMode(true);
        } else if (params.get('chaitra_chart') === 'true') {
            setChaitraChartMode(true);
        } else if (params.get('medical_astrology') === 'true') {
            setMedicalAstrologyMode(true);
        } else if (params.get('dosha') === 'true') {
            setDoshaMode(true);
        } else if (params.get('digbala') === 'true') {
            setDigbalaMode(true);
        } else if (params.get('sanghatta') === 'true') {
            setSanghattaMode(true);
        } else if (params.get('karaka') === 'true') {
            setKarakaMode(true);
        } else if (params.get('tithi') === 'true') {
            setTithiMode(true);
            const urlDate = params.get("date");
            const urlTime = params.get("time");
            const urlLat = params.get("lat");
            const urlLon = params.get("lon");
            const urlName = params.get("name") || "";
            const urlTz = params.get("tz_offset");
            const urlLocName = params.get("location_name") || "Birth Place";
            const urlGender = params.get("gender") || "Male";

            if (urlDate && urlTime && urlLat && urlLon) {
                const tzVal = urlTz ? parseFloat(urlTz) : 5.5;
                const payload = {
                    name: urlName,
                    date: urlDate,
                    time: urlTime,
                    tz_offset: tzVal,
                    lat: parseFloat(urlLat),
                    lon: parseFloat(urlLon),
                    style: "minimal",
                    language: "english",
                    gender: urlGender,
                    location_name: urlLocName,
                };

                (async () => {
                    try {
                        const detailedData = await fetchReportData(payload);
                        setWorksheetData(detailedData);
                        localStorage.setItem('worksheetData', JSON.stringify(detailedData));
                    } catch (e) {
                        console.error("Failed to dynamically fetch tithi pravesha birth data:", e);
                    }
                })();
            } else {
                const savedData = localStorage.getItem('worksheetData');
                if (savedData) {
                    try {
                        setWorksheetData(JSON.parse(savedData));
                    } catch (e) { }
                }
            }
        } else if (params.get('vastu') === 'true') {
            setVastuMode(true);
        } else if (params.get('face_reading') === 'true') {
            setFaceReadingMode(true);
        } else if (params.get('numerology') === 'true') {
            setNumerologyMode(true);
        } else if (params.get('prediction_numerology') === 'true') {
            setPredictionNumerologyMode(true);
        } else if (params.get('daily_numerology') === 'true') {
            setDailyNumerologyMode(true);
        } else if (params.get('remedy_numerology') === 'true') {
            setRemedyNumerologyMode(true);
        } else if (params.get('medical_numerology') === 'true') {
            setMedicalNumerologyMode(true);
        } else if (params.get('personality_numerology') === 'true') {
            setPersonalityNumerologyMode(true);
        } else if (params.get('marriage_numerology') === 'true') {
            setMarriageNumerologyMode(true);
        } else if (params.get('carrier_numerology') === 'true') {
            setCarrierNumerologyMode(true);
        } else if (params.get('remedy') === 'true') {
            setRemedyMode(true);
        } else if (params.get('solar_return') === 'true') {
            setSolarReturnMode(true);
        } else if (params.get('daily_solar') === 'true') {
            setDailySolarMode(true);
        } else if (params.get('harsha_bala') === 'true') {
            setHarshaBalaMode(true);
        } else if (params.get('tajika_yogas') === 'true') {
            setTajikaYogasMode(true);
        } else if (params.get('tripataki_chakra') === 'true') {
            setTripatakiChakraMode(true);
        } else if (params.get('kalachakra') === 'true') {
            setKalachakraMode(true);
        } else if (params.get('longevity') === 'true') {
            setLongevityMode(true);
        } else if (params.get('annual_varshaphala') === 'true') {
            setAnnualVarshaphalaMode(true);
        } else if (params.get('varshaphala_details') === 'true') {
            setVarshaphalaDetailsMode(true);
        } else if (params.get('detailed_charts') === 'true') {
            setDetailedChartsMode(true);
        } else if (params.get('animated_transits') === 'true') {
            setAnimatedTransitsMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('navamsha_ages') === 'true') {
            setNavamshaAgesMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('kp_chart') === 'true') {
            setKpChartMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('sunrise_chart') === 'true') {
            setSunriseChartMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('bhrigu_bindu') === 'true') {
            setBhriguBinduMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('html_report') === 'true') {
            setHtmlReportMode(true);
            const urlDate = params.get("date");
            const urlTime = params.get("time");
            const urlLat = params.get("lat");
            const urlLon = params.get("lon");
            const urlName = params.get("name") || "";
            const urlTz = params.get("tz_offset");
            const urlLocName = params.get("location_name") || "Birth Place";
            const urlGender = params.get("gender") || "Male";

            if (urlDate && urlTime && urlLat && urlLon) {
                const tzVal = urlTz ? parseFloat(urlTz) : 5.5;
                const payload = {
                    name: urlName,
                    date: urlDate,
                    time: urlTime,
                    tz_offset: tzVal,
                    lat: parseFloat(urlLat),
                    lon: parseFloat(urlLon),
                    style: "minimal",
                    language: "english",
                    gender: urlGender,
                    location_name: urlLocName,
                };

                (async () => {
                    try {
                        const detailedData = await fetchReportData(payload);
                        localStorage.setItem('htmlReportData', JSON.stringify(detailedData));
                        setWorksheetData(detailedData);
                    } catch (e) {
                        console.error("Failed to dynamically fetch html report data:", e);
                    }
                })();
            } else {
                const savedData = localStorage.getItem('htmlReportData');
                if (savedData) {
                    try {
                        setWorksheetData(JSON.parse(savedData));
                    } catch (e) { }
                }
            }
        } else if (params.get('blank_sheet') === 'true') {
            setIsBlankSheetMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('advanced_muhurt') === 'true') {
            setAdvancedMuhurtaMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('nadi') === 'true' || params.get('synastry') === 'true') {
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('dasa_timeline') === 'true') {
            setDasaTimelineMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('solarsystem3d') === 'true') {
            setSolarSystem3DMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('astro_tm') === 'true') {
            setAstroTmMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else {
            // Check for individual oracle category flags
            const activeCategory = categories.find(c => params.get(c) === 'true');
            if (activeCategory) {
                setOracleMode(true);
                setOracleCategory(activeCategory);
            }
        }
    }, []);

    if (horoscopeMode) {
        return <HoroscopeViewer data={horoscopeData} />;
    }

    if (deepHoroscopeMode) {
        return <DeepHoroscopeViewer data={worksheetData} type={deepHoroscopeType} />;
    }

    if (lalkitabMode) {
        return <LalKitabViewer />;
    }

    if (advancedNakshatraMode) {
        return <AdvancedNakshatraViewer />;
    }

    if (namingMode) {
        return <NamingCalculator data={worksheetData} />;
    }

    if (astroTmMode) {
        return <AstrologicalTimeMachine data={worksheetData} />;
    }

    if (panchangMode) {
        return <DailyPanchangViewer />;
    }

    if (monthlyPanchangMode) {
        return <MonthlyPanchangViewer />;
    }

    if (horaryMode) {
        return <Prashna />;
    }

    if (ashtamangalaMode) {
        return <AshtamangalaPrasna />;
    }

    if (btrMode) {
        return <BTRWizard />;
    }

    if (advancedJaiminiMode) {
        return <AdvancedJaiminiDashboard data={worksheetData} />;
    }

    if (ayurdayaMode) {
        return <AyurdayaViewer data={worksheetData} />;
    }

    if (chakraMode) {
        return <Chakra />;
    }

    if (yantraMode) {
        return <Remedy />;
    }
    const isPrashnaMode = new URLSearchParams(window.location.search).get('prashna') === 'true';
    const isKPAstrologyMode = new URLSearchParams(window.location.search).get('kp_astrology') === 'true';
    const isNadiMode = new URLSearchParams(window.location.search).get('nadi') === 'true';
    const isMantraMode = new URLSearchParams(window.location.search).get('mantra') === 'true';
    const isSynastryMode = new URLSearchParams(window.location.search).get('synastry') === 'true';
    const isBrahmaMuhurtMode = new URLSearchParams(window.location.search).get('brahma_muhurt') === 'true';

    if (isBrahmaMuhurtMode) {
        return <BrahmaMuhurtViewer />;
    }

    if (isSynastryMode) {
        return <SynastryDashboard p1Data={worksheetData} />;
    }

    if (isMantraMode) {
        return <MantraTracker />;
    }

    if (muhurtMode) {
        return <MuhurtCalculator />;
    }

    if (advancedMuhurtaMode && worksheetData) {
        return <AdvancedMuhurtaSearch data={worksheetData} />;
    }

    if (isNadiMode) {
        if (!worksheetData) {
            return (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
                    <div className="text-amber-500 animate-pulse">Loading Chart Data...</div>
                </div>
            );
        }
        return <NadiViewer data={worksheetData} />;
    }

    if (isPrashnaMode) {
        return <PrashnaEngine />;
    }

    if (isKPAstrologyMode) {
        return <KPEngine />;
    }

    if (matchmakingMode) {
        return <MatchmakingPage />;
    }

    if (compatibilityHubMode) {
        return <CompatibilityHub />;
    }

    if (ishtaDevMode) {
        return <IshtaDevViewer data={ishtaDevData} />;
    }

    if (studyMode) {
        return <StudyViewer worksheetData={worksheetData} />;
    }

    if (careerMode) {
        return <CareerViewer />;
    }

    if (financeMode) {
        return <FinanceViewer />;
    }

    if (marriageMode) {
        return <MarriageViewer />;
    }

    if (legalMattersMode) {
        return <LegalMattersViewer />;
    }

    if (businessMode) {
        return <BusinessViewer />;
    }

    if (healthMode) {
        return <HealthAnalysis />;
    }

    if (parentsHealthMode) {
        return <ParentsHealthViewer />;
    }

    if (spouseHealthMode) {
        return <SpouseHealthViewer />;
    }

    if (childrenHealthMode) {
        return <ChildrenHealthViewer />;
    }

    if (mentalPeaceMode) {
        return <MentalPeaceViewer />;
    }

    if (homePeaceMode) {
        return <HomePeaceViewer />;
    }

    if (ascendantMode) {
        return <AscendantAnalysis />;
    }

    if (moonSignMode) {
        return <MoonSignAnalysis />;
    }

    if (sadesatiReportMode) {
        return <SadesatiAnalysis />;
    }

    if (matchmakingMode) {
        return <MatchmakingPage />;
    }
    if (biodataMode) {
        return <BiodataGenerator />;
    }

    if (sbcGridMode) {
        return <SBCGrid />;
    }

    if (sbcDashboardMode) {
        return <SarvatobhadraDashboard data={worksheetData} grid={[]} activations={[]} />;
    }

    if (oracleMode) {
        return <OracleViewer categoryProp={oracleCategory} />;
    }

    if (classicLayoutMode) {
        return <ClassicLayoutViewer data={worksheetData} />;
    }

    if (classicLayout2Mode) {
        return <ClassicLayoutViewer2 data={worksheetData} />;
    }

    if (classicLayout3Mode) {
        return <ClassicLayoutViewer3 data={worksheetData} />;
    }

    if (classicLayout4Mode) {
        return <ClassicLayoutViewer4 data={worksheetData} />;
    }

    if (chartView1Mode) {
        return <ChartView1 data={worksheetData} />;
    }

    if (chartView2Mode) {
        return <ChartView2 data={worksheetData} />;
    }

    if (chartView3Mode) {
        return <ChartView3 data={worksheetData} />;
    }

    if (lordshipsMode) {
        return <LordshipView data={worksheetData} />;
    }

    if (vargaSignChartMode) {
        return <VargaSignChart data={worksheetData} />;
    }

    if (balaStrengthsMode) {
        return <BalaStrengths data={worksheetData} />;
    }

    if (bhavbalaMode) {
        return <BhavbalaView data={worksheetData} />;
    }

    if (gocharaWheelMode) {
        return <GocharaWheelView data={worksheetData} />;
    }

    if (gocharaWheel1Mode) {
        return <GocharaWheel1View data={worksheetData} />;
    }

    if (nakshatraDashaMode) {
        return <NakshatraDashaView data={worksheetData} />;
    }

    if (rashiDashasMode) {
        return <RashiDashasView data={worksheetData} />;
    }

    if (lagnasMode) {
        return <LagnasView data={worksheetData} />;
    }

    if (jaiminiKarakasMode) {
        return <JaiminiKarakasViewer data={worksheetData} />;
    }

    if (d108Mode) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center py-10">
                <div className="w-full max-w-7xl">
                    <D108Dashboard />
                </div>
            </div>
        );
    }

    if (ayanamshaMode) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center py-10">
                <div className="w-full max-w-7xl">
                    <AyanamshaDashboard />
                </div>
            </div>
        );
    }

    if (kotaChakraMode) {
        return (
            <div className="p-4 bg-slate-900 min-h-screen">
                <KotaChakraViewer />
            </div>
        );
    }

    if (vimshottariRefMode) {
        return (
            <div className="min-h-screen bg-slate-50 p-6 md:p-12">
                <div className="max-w-6xl mx-auto animate-fade-in">
                    <VimshottariExplanation />
                </div>
            </div>
        );
    }

    if (dashaAnalysisMode) {
        return (
            <DashaDashboard data={null} />
        );
    }

    if (yearlyDashaMode) {
        return (
            <div className="p-4 bg-slate-50 min-h-screen">
                <VimshottariLifeTable data={worksheetData} />
            </div>
        );
    }

    if (dashaGridMode) {
        return (
            <div className="p-4 bg-slate-50 min-h-screen">
                <VimshottariGridTimeline data={worksheetData} />
            </div>
        );
    }

    if (kurmaChakraMode) {
        return (
            <KurmaChakraViewer />
        );
    }

    if (sudarshanChakraMode) {
        return (
            <SudarshanChakraViewer />
        );
    }

    if (chaitraChartMode) {
        return (
            <ChaitraChartViewer />
        );
    }

    if (medicalAstrologyMode) {
        return (
            <MedicalAstrologyDashboard />
        );
    }

    if (doshaMode) {
        return (
            <DoshaDashboard />
        );
    }

    if (digbalaMode) {
        return (
            <DigbalaCompass />
        );
    }

    if (sanghattaMode) {
        return (
            <div className="h-screen w-full bg-slate-900 overflow-hidden">
                <SanghattaDashboard />
            </div>
        );
    }

    if (vastuMode) {
        return (
            <VastuAnalyzer />
        );
    }

    if (faceReadingMode) {
        return (
            <FaceReader />
        );
    }

    if (numerologyMode) {
        return (
            <NumerologyDashboard />
        );
    }

    if (predictionNumerologyMode) {
        return (
            <PredictionNumerology />
        );
    }

    if (dailyNumerologyMode) {
        return (
            <DailyNumerology />
        );
    }

    if (remedyNumerologyMode) {
        return (
            <RemedyNumerology />
        );
    }

    if (medicalNumerologyMode) {
        return (
            <MedicalNumerology />
        );
    }

    if (personalityNumerologyMode) {
        return (
            <PersonalityNumerology />
        );
    }

    if (marriageNumerologyMode) {
        return (
            <MarriageNumerology />
        );
    }

    if (carrierNumerologyMode) {
        return (
            <CarrierNumerology />
        );
    }

    if (remedyMode) {
        return (
            <Remedy />
        );
    }

    if (karakaMode) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center py-10">
                <div className="w-full max-w-7xl">
                    <KarakaDashboard />
                </div>
            </div>
        );
    }

    if (tithiMode) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center py-10">
                <div className="w-full max-w-7xl">
                    <TithiDashboard data={worksheetData} />
                </div>
            </div>
        );
    }

    if (solarReturnMode) {
        return <SolarReturnViewer />;
    }

    if (dailySolarMode) {
        return <DailySolarViewer />;
    }

    if (annualVarshaphalaMode) {
        return <AnnualVarshaphalaViewer />;
    }

    if (harshaBalaMode) {
        return <HarshaBalaViewer />;
    }

    if (tajikaYogasMode) {
        return <TajikaYogasViewer />;
    }

    if (tripatakiChakraMode) {
        return <TripatakiChakraViewer />;
    }

    if (kalachakraMode) {
        return <KalachakraViewer />;
    }

    if (longevityMode) {
        return <LongevityViewer />;
    }

    if (varshaphalaDetailsMode) {
        return <VarshaphalaDetailsViewer />;
    }

    if (detailedChartsMode) {
        return <VarshaphalaDetailedCharts />;
    }

    if (animatedTransitsMode) {
        return <AnimatedTransitsViewer formData={worksheetData} />;
    }

    if (navamshaAgesMode) {
        return <NavamshaAgesViewer formData={worksheetData} />;
    }

    if (kpChartMode) {
        return (
            <div className="h-screen w-full bg-white">
                <KPChartViewer formData={worksheetData} />
            </div>
        );
    }

    if (sunriseChartMode) {
        return <SunriseChartViewer formData={worksheetData} />;
    }

    if (bhriguBinduMode) {
        return <BhriguBinduAnalysis data={worksheetData} />;
    }

    if (isWorksheetMode) {
        return (
            <div className="min-h-screen bg-[#f1f5f9]">
                {worksheetData ? (
                    <InteractiveWorksheet data={worksheetData} fullScreenInitial={fullScreenParam} />
                ) : (
                    <div className="flex h-screen items-center justify-center bg-slate-900 text-white animate-pulse font-serif text-xl tracking-widest">
                        Loading celestial geometry...
                    </div>
                )}
            </div>
        );
    }

    if (isBlankSheetMode) {
        return (
            <div className="min-h-screen bg-[#f1f5f9]">
                {worksheetData ? (
                    <InteractiveWorksheet data={worksheetData} isBlankSheet={true} />
                ) : (
                    <div className="flex h-screen items-center justify-center bg-slate-900 text-white animate-pulse font-serif text-xl tracking-widest">
                        Loading celestial geometry...
                    </div>
                )}
            </div>
        );
    }

    if (htmlReportMode) {
        return (
            <div className="bg-rose-50 min-h-screen">
                <NotificationManager />
                {worksheetData ? (
                    <KundaliReportView data={worksheetData} />
                ) : (
                    <div className="flex items-center justify-center h-screen text-gray-500 italic">
                        No data found. Please generate a report first.
                    </div>
                )}
            </div>
        );
    }

    if (dasaTimelineMode) {
        return (
            <div className="min-h-screen bg-white p-4 md:p-8">
                <DasaTimeline data={worksheetData} />
            </div>
        );
    }

    if (solarSystem3DMode) {
        let date = "1990-10-01";
        let time = "12:00:00";
        if (worksheetData) {
            const basic = worksheetData.basic_details || {};
            if (basic.day && basic.month && basic.year) {
                date = `${basic.year}-${String(basic.month).padStart(2, '0')}-${String(basic.day).padStart(2, '0')}`;
                time = `${basic.hour || 12}:${basic.minute || 0}:00`;
            } else if (worksheetData.meta?.date) {
                date = worksheetData.meta.date;
            }
        }
        return (
            <div className="min-h-screen bg-slate-900 p-4 md:p-8">
                <SolarSystem3D date={date} time={time} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NotificationManager />
            <GenerateReport />
        </div>
    );
}

export default App;
