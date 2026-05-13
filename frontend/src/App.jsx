import React, { useState, useEffect } from 'react';
import GenerateReport from './pages/GenerateReport';
import MatchmakingPage from './pages/matchmaking/MatchmakingPage';
import InteractiveWorksheet from './components/InteractiveWorksheet';
import IshtaDevViewer from './components/IshtaDevViewer';
import OracleViewer from './components/OracleViewer';
import HoroscopeViewer from './components/HoroscopeViewer';
import LalKitabViewer from './components/LalKitabViewer';
import DailyPanchangViewer from './components/DailyPanchangViewer';
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

function App() {
    const [isWorksheetMode, setIsWorksheetMode] = useState(false);
    const [worksheetData, setWorksheetData] = useState(null);
    const [ishtaDevMode, setIshtaDevMode] = useState(false);
    const [ishtaDevData, setIshtaDevData] = useState(null);
    const [oracleMode, setOracleMode] = useState(false);
    const [lalkitabMode, setLalkitabMode] = useState(false);
    const [panchangMode, setPanchangMode] = useState(false);
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
        } else if (params.get('panchang') === 'true') {
            setPanchangMode(true);
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

    if (panchangMode) {
        return <DailyPanchangViewer />;
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

    if (muhurtMode) {
        return <MuhurtCalculator />;
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

    if (oracleMode) {
        return <OracleViewer categoryProp={oracleCategory} />;
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

    return (
        <div className="min-h-screen bg-gray-50">
            <GenerateReport />
        </div>
    );
}

export default App;
