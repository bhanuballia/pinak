import React, { useState, useEffect } from 'react';
import GenerateReport from './pages/GenerateReport';
import MatchmakingPage from './pages/matchmaking/MatchmakingPage';
import InteractiveWorksheet from './components/InteractiveWorksheet';
import IshtaDevViewer from './components/IshtaDevViewer';
import ClassicLayoutViewer from './components/ClassicLayoutViewer';
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
import FinanceAnalysis from './components/FinanceAnalysis';
import MarriageAnalysis from './components/MarriageAnalysis';
import BusinessViewer from './components/BusinessViewer';
import HealthAnalysis from './components/HealthAnalysis';
import ParentsHealthViewer from './components/ParentsHealthViewer';
import SpouseHealthViewer from './components/SpouseHealthViewer';
import ChildrenHealthViewer from './components/ChildrenHealthViewer';
import AscendantAnalysis from './components/AscendantAnalysis';
import MoonSignAnalysis from './components/MoonSignAnalysis';
import SadesatiAnalysis from './components/SadesatiAnalysis';
import SBCGrid from './components/SBCGrid';
import SarvatobhadraDashboard from './pages/SarvatobhadraDashboard';
import D108Dashboard from './components/D108Dashboard';
import AyanamshaDashboard from './components/AyanamshaDashboard';
import SanghattaDashboard from './components/SanghattaDashboard';
import KarakaDashboard from './components/KarakaDashboard';
import TithiDashboard from './components/TithiDashboard';
import SolarReturnViewer from './components/SolarReturnViewer';
import DailySolarViewer from './components/DailySolarViewer';
import AnnualVarshaphalaViewer from './components/AnnualVarshaphalaViewer';
import AnimatedTransitsViewer from './components/AnimatedTransitsViewer';
import NavamshaAgesViewer from './components/NavamshaAgesViewer';
import KPChartViewer from './components/KPChartViewer';
import SunriseChartViewer from './components/SunriseChartViewer';
import KundaliReportView from './components/KundaliReportView';
import BhriguBinduAnalysis from './components/BhriguBinduAnalysis';
import AdvancedMuhurtaSearch from './components/AdvancedMuhurtaSearch';
import NotificationManager from './components/NotificationManager';
import PrashnaEngine from './components/PrashnaEngine';
import NadiViewer from './components/NadiViewer';
import MantraTracker from './components/MantraTracker';
import SynastryDashboard from './components/SynastryDashboard';

function App() {
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
    const [businessMode, setBusinessMode] = useState(false);
    const [healthMode, setHealthMode] = useState(false);
    const [parentsHealthMode, setParentsHealthMode] = useState(false);
    const [spouseHealthMode, setSpouseHealthMode] = useState(false);
    const [childrenHealthMode, setChildrenHealthMode] = useState(false);
    const [ascendantMode, setAscendantMode] = useState(false);
    const [moonSignMode, setMoonSignMode] = useState(false);
    const [sadesatiReportMode, setSadesatiReportMode] = useState(false);
    const [matchmakingMode, setMatchmakingMode] = useState(false);
    const [sbcGridMode, setSbcGridMode] = useState(false);
    const [sbcDashboardMode, setSbcDashboardMode] = useState(false);
    const [d108Mode, setD108Mode] = useState(false);
    const [ayanamshaMode, setAyanamshaMode] = useState(false);
    const [sanghattaMode, setSanghattaMode] = useState(false);
    const [karakaMode, setKarakaMode] = useState(false);
    const [tithiMode, setTithiMode] = useState(false);
    const [solarReturnMode, setSolarReturnMode] = useState(false);
    const [dailySolarMode, setDailySolarMode] = useState(false);
    const [annualVarshaphalaMode, setAnnualVarshaphalaMode] = useState(false);
    const [animatedTransitsMode, setAnimatedTransitsMode] = useState(false);
    const [navamshaAgesMode, setNavamshaAgesMode] = useState(false);
    const [kpChartMode, setKpChartMode] = useState(false);
    const [sunriseChartMode, setSunriseChartMode] = useState(false);
    const [bhriguBinduMode, setBhriguBinduMode] = useState(false);
    const [htmlReportMode, setHtmlReportMode] = useState(false);
    const [advancedMuhurtaMode, setAdvancedMuhurtaMode] = useState(false);
    const [horoscopeData, setHoroscopeData] = useState(null);
    const [fullScreenParam, setFullScreenParam] = useState(null);
    const [oracleCategory, setOracleCategory] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        // Define oracle categories that should trigger OracleViewer
        const categories = [
            'mental_peace', 'home_peace',
            'manglik', 'kalsarp', 'pitra', 'sadesati', 'rahu', 'ketu', 'loshu'
        ];

        if (params.get('worksheet') === 'true') {
            setIsWorksheetMode(true);
            const fs = params.get('fullScreen');
            if (fs) setFullScreenParam(fs);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) {
                    console.error("Failed to parse worksheet data", e);
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
        } else if (params.get('oracle')) {
            setOracleMode(true);
            setOracleCategory(params.get('oracle'));
        } else if (params.get('lalkitab') === 'true') {
            setLalkitabMode(true);
        } else if (params.get('advanced_nakshatra') === 'true') {
            setAdvancedNakshatraMode(true);
        } else if (params.get('panchang') === 'true') {
            setPanchangMode(true);
        } else if (params.get('monthly_panchang') === 'true') {
            setMonthlyPanchangMode(true);
        } else if (params.get('horary') === 'true') {
            setHoraryMode(true);
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
        } else if (params.get('ascendant') === 'true') {
            setAscendantMode(true);
        } else if (params.get('moonSign') === 'true') {
            setMoonSignMode(true);
        } else if (params.get('sadesati_report') === 'true') {
            setSadesatiReportMode(true);
        } else if (params.get('matchmaking') === 'true') {
            setMatchmakingMode(true);
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
        } else if (params.get('sanghatta') === 'true') {
            setSanghattaMode(true);
        } else if (params.get('karaka') === 'true') {
            setKarakaMode(true);
        } else if (params.get('tithi') === 'true') {
            setTithiMode(true);
            const savedData = localStorage.getItem('worksheetData');
            if (savedData) {
                try {
                    setWorksheetData(JSON.parse(savedData));
                } catch (e) { }
            }
        } else if (params.get('solar_return') === 'true') {
            setSolarReturnMode(true);
        } else if (params.get('daily_solar') === 'true') {
            setDailySolarMode(true);
        } else if (params.get('annual_varshaphala') === 'true') {
            setAnnualVarshaphalaMode(true);
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
            const savedData = localStorage.getItem('htmlReportData');
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

    if (lalkitabMode) {
        return <LalKitabViewer />;
    }

    if (advancedNakshatraMode) {
        return <AdvancedNakshatraViewer />;
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

    if (chakraMode) {
        return <Chakra />;
    }

    if (yantraMode) {
        return <Remedy />;
    }
    const isPrashnaMode = new URLSearchParams(window.location.search).get('prashna') === 'true';
    const isNadiMode = new URLSearchParams(window.location.search).get('nadi') === 'true';
    const isMantraMode = new URLSearchParams(window.location.search).get('mantra') === 'true';
    const isSynastryMode = new URLSearchParams(window.location.search).get('synastry') === 'true';

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

    if (matchmakingMode) {
        return <MatchmakingPage />;
    }

    if (ishtaDevMode) {
        return <IshtaDevViewer data={ishtaDevData} />;
    }

    if (studyMode) {
        return <StudyViewer />;
    }

    if (careerMode) {
        return <CareerViewer />;
    }

    if (financeMode) {
        return <FinanceAnalysis />;
    }

    if (marriageMode) {
        return <MarriageAnalysis />;
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

    if (sanghattaMode) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center py-10">
                <div className="w-full max-w-7xl">
                    <SanghattaDashboard />
                </div>
            </div>
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
                    <div className="flex items-center justify-center h-screen text-gray-500 italic">
                        No data found. Please generate a report first.
                    </div>
                )}
            </div>
        );
    }

    if (htmlReportMode) {
        return (
            <div className="bg-white">
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

    return (
        <div className="min-h-screen bg-gray-50">
            <NotificationManager />
            <GenerateReport />
        </div>
    );
}

export default App;
