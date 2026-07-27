import React, { useState } from "react";
import { Sparkles, Calendar, User, ArrowLeft, RefreshCw, Star, Compass, Flame, ShieldAlert, Award, AlertCircle, ToggleLeft, CheckCircle, Heart, Coins, Baby, Briefcase, Landmark } from "lucide-react";

// Chaldean Numerology Letter Values
const CHALDEAN_MAP = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3,
  'H': 5, 'I': 1, 'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5,
  'O': 7, 'P': 8, 'Q': 1, 'R': 2, 'S': 3, 'T': 4, 'U': 6,
  'V': 6, 'W': 6, 'X': 5, 'Y': 1, 'Z': 7
};

const COMPOUND_LUCKY_DETAILS = {
  10: { title: "Wheel of Fortune", desc: "Brings success, honor, and rises in fortune." },
  15: { title: "Spiritual Power", desc: "Brings magnetic personality, charisma, and luck." },
  19: { title: "The Prince of Heaven", desc: "Extremely lucky. Brings health, victory, and high honors." },
  23: { title: "Royal Star of the Bull", desc: "Extremely lucky. Overcomes obstacles, excellent for business/career." },
  24: { title: "Venus Harmony", desc: "Brings support from friends, love, and artistic talents." },
  27: { title: "The Scepter", desc: "Auspicious. Represents power, influence, and leadership." },
  32: { title: "Universal Messenger", desc: "Very lucky. Popularity, success in public relations and business." },
  33: { title: "Master Nurturer", desc: "Master number. Creative brilliance and financial success." },
  37: { title: "Fortunate Union", desc: "Indicates success in partnerships, love, and commercial ventures." },
  41: { title: "Intellectual Leader", desc: "Great for writing, public speaking, and digital business." },
  42: { title: "Venus Luxury", desc: "Brings comforts, professional advancement, and luxury." },
  45: { title: "Charming Crown", desc: "A symbol of success, popularity, and high achievements." },
  46: { title: "The Crown of Life", desc: "Brings fame, leadership, and great success." },
  50: { title: "Mercury Intelligence", desc: "Brings adaptability, luck in travel, and sharp business mind." },
  51: { title: "Royal Commander", desc: "Brings unexpected success, authority, and power." }
};

const FRIENDLY_NUMBERS = {
  1: [1, 2, 3, 5, 9],
  2: [1, 2, 3, 7],
  3: [1, 3, 5, 7, 9],
  4: [1, 3, 5, 6, 7],
  5: [1, 3, 5, 6],
  6: [3, 5, 6, 9],
  7: [1, 2, 3, 5, 7],
  8: [3, 5, 6],
  9: [1, 3, 5, 9]
};

const PLANET_NAMES = {
  1: "Sun",
  2: "Moon",
  3: "Jupiter",
  4: "Rahu",
  5: "Mercury",
  6: "Venus",
  7: "Ketu",
  8: "Saturn",
  9: "Mars"
};

const VASTU_DIRECTIONS = {
  4: { zone: "Southeast (SE)", element: "Wood", aspect: "Wealth & Cash Flow", issue: "Wealth leaks, financial instability, bad investment luck", remedy: "Place a healthy green plant or a green aventurine tree in this corner." },
  9: { zone: "South (S)", element: "Fire", aspect: "Fame, Name & Recognition", issue: "Lack of fame/recognition, low energy levels, lack of confidence", remedy: "Place a red bulb, light a red candle daily, or keep a copper emblem." },
  2: { zone: "Southwest (SW)", element: "Earth", aspect: "Relationships & Marriage", issue: "Marriage instability, frequent misunderstandings, relationship stress", remedy: "Place rose quartz crystal lovebirds or a family photo in a golden frame." },
  3: { zone: "East (E)", element: "Wood", aspect: "Health, Ancestors & Family", issue: "Strained family relations, weak health, lack of growth", remedy: "Hang a green aventurine crystal hanging or place wooden artifacts here." },
  5: { zone: "Center (Brahmasthan)", element: "Earth", aspect: "Stability, Focus & Balance", issue: "Instability, confusion, lack of focus in daily life", remedy: "Keep this area clean and free of heavy clutter. Place a yellow crystal tree here." },
  7: { zone: "West (W)", element: "Metal", aspect: "Wisdom, Skills & Children", issue: "Delays in learning, difficulty in concentration, creativity blocks", remedy: "Hang a 6-rod or 7-rod metal windchime or keep a metal globe here." },
  8: { zone: "Northeast (NE)", element: "Earth", aspect: "Knowledge & Savings", issue: "High expenses, money leaks, lack of clarity", remedy: "Keep a rock salt lamp or a bowl of sea salt in this corner." },
  1: { zone: "North (N)", element: "Water", aspect: "Career Opportunities", issue: "Career stagnation, lack of job options or promotion blocks", remedy: "Keep a small water fountain or a painting of a peaceful water body." },
  6: { zone: "Northwest (NW)", element: "Metal", aspect: "Helpful Friends & Support", issue: "Lack of support, loneliness, bad luck with networking", remedy: "Hang a silver key or keep a metal windchime in the northwest corner." }
};

function reduceToSingleDigit(number) {
  let temp = number;
  while (temp > 9) {
    temp = temp.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return temp;
}

function getChaldeanSum(name) {
  let total = 0;
  const uppercase = name.toUpperCase();
  for (let i = 0; i < uppercase.length; i++) {
    const char = uppercase[i];
    if (CHALDEAN_MAP[char]) {
      total += CHALDEAN_MAP[char];
    }
  }
  return total;
}

function generateSpellingCorrections(fullName, mulank, bhagyank) {
  const cleanName = fullName.trim();
  const parts = cleanName.split(/\s+/);
  if (parts.length === 0) return [];

  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");

  const suggestions = new Map();

  // Helper to add suggestion
  const addSuggestion = (fName, lName, method) => {
    const full = lName ? `${fName} ${lName}` : fName;
    if (full.toUpperCase() === cleanName.toUpperCase()) return;

    // Calculate Chaldean
    let total = 0;
    const upperFull = full.toUpperCase();
    for (let char of upperFull) {
      if (CHALDEAN_MAP[char]) {
        total += CHALDEAN_MAP[char];
      }
    }
    const single = reduceToSingleDigit(total);

    // Check compatibility
    const isMulankFriendly = FRIENDLY_NUMBERS[mulank]?.includes(single);
    const isBhagyankFriendly = FRIENDLY_NUMBERS[bhagyank]?.includes(single);

    if (isMulankFriendly && isBhagyankFriendly) {
      const score = COMPOUND_LUCKY_DETAILS[total] ? 95 : 85;
      suggestions.set(full, {
        name: full,
        compound: total,
        single: single,
        score: score,
        method: method,
        friendlyWith: "Both Psychic & Destiny"
      });
    } else if (isMulankFriendly) {
      const score = COMPOUND_LUCKY_DETAILS[total] ? 80 : 70;
      suggestions.set(full, {
        name: full,
        compound: total,
        single: single,
        score: score,
        method: method,
        friendlyWith: "Psychic Number"
      });
    }
  };

  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const consonants = ['S', 'R', 'L', 'N', 'M', 'T', 'G', 'D', 'H'];

  // Method 1: Append suffix vowel/consonant
  addSuggestion(firstName + 'a', lastName, "Append 'a' to first name");
  addSuggestion(firstName + 'i', lastName, "Append 'i' to first name");
  addSuggestion(firstName + 'e', lastName, "Append 'e' to first name");
  addSuggestion(firstName + 'h', lastName, "Append 'h' to first name");

  // Method 2: Double vowels inside the first name
  for (let i = 0; i < firstName.length; i++) {
    const char = firstName[i].toUpperCase();
    if (vowels.includes(char)) {
      const mod = firstName.slice(0, i + 1) + char.toLowerCase() + firstName.slice(i + 1);
      addSuggestion(mod, lastName, `Double vowel '${char.toLowerCase()}'`);
    }
  }

  // Method 3: Double key consonants
  for (let i = 0; i < firstName.length; i++) {
    const char = firstName[i].toUpperCase();
    if (consonants.includes(char)) {
      const mod = firstName.slice(0, i + 1) + char.toLowerCase() + firstName.slice(i + 1);
      addSuggestion(mod, lastName, `Double consonant '${char.toLowerCase()}'`);
    }
  }

  // Method 4: Modify last name (if exists)
  if (lastName) {
    addSuggestion(firstName, lastName + 'a', "Append 'a' to last name");
    addSuggestion(firstName, lastName + 'h', "Append 'h' to last name");

    const lastParts = lastName.split(/\s+/);
    const lastPart = lastParts[0];
    const restLast = lastParts.slice(1).join(" ");

    for (let i = 0; i < lastPart.length; i++) {
      const char = lastPart[i].toUpperCase();
      if (vowels.includes(char) || consonants.includes(char)) {
        const modPart = lastPart.slice(0, i + 1) + char.toLowerCase() + lastPart.slice(i + 1);
        const newLastName = restLast ? `${modPart} ${restLast}` : modPart;
        addSuggestion(firstName, newLastName, `Modify last name spelling`);
      }
    }
  }

  return Array.from(suggestions.values())
    .sort((a, b) => b.score - a.score || a.compound - b.compound)
    .slice(0, 10);
}

export default function NumerologyDashboard() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [nameSystem, setNameSystem] = useState("Chaldean"); // "Chaldean" | "Pythagorean"
  const [activeTab, setActiveTab] = useState("report");
  const [hoveredPlane, setHoveredPlane] = useState(null); // 'mental' | 'emotional' | 'practical' | 'thought' | 'will' | 'action' | 'golden' | 'silver' | null
  const [selectedForecastMonth, setSelectedForecastMonth] = useState(new Date().getMonth() + 1); // 1 to 12

  const isCellHighlighted = (num) => {
    if (!hoveredPlane) return false;
    const planeName = hoveredPlane.toLowerCase();
    if (planeName.includes('mental')) return [4, 9, 2].includes(num);
    if (planeName.includes('emotional') || planeName.includes('heart')) return [3, 5, 7].includes(num);
    if (planeName.includes('practical')) return [8, 1, 6].includes(num);
    if (planeName.includes('thought')) return [4, 3, 8].includes(num);
    if (planeName.includes('will')) return [9, 5, 1].includes(num);
    if (planeName.includes('action')) return [2, 7, 6].includes(num);
    if (planeName.includes('golden') || planeName.includes('success')) return [4, 5, 6].includes(num);
    if (planeName.includes('silver') || planeName.includes('willpower') || planeName.includes('determination')) return [2, 5, 8].includes(num);
    return false;
  };

  const getMonthForecast = (num) => {
    const data = {
      1: {
        title: "New Beginnings & Fresh Start",
        focus: "Personal independence, fresh ventures, and leadership.",
        advice: "A month to start new projects, change direction, and trust your gut. Stand out and be proactive!"
      },
      2: {
        title: "Partnership, Harmony & Patience",
        focus: "Cooperation, diplomatic talks, and emotional connections.",
        advice: "Focus on relationships and teamwork. It is a time for patience and listening rather than forcing decisions."
      },
      3: {
        title: "Creative Expression & Expansion",
        focus: "Social life, artistic expression, and communication.",
        advice: "Excellent period for writing, presenting, and socializing. Express yourself freely and stay optimistic."
      },
      4: {
        title: "Structure, Discipline & Security",
        focus: "Hard work, system setups, and financial grounding.",
        advice: "Focus on details, health, and grounding your plans. A month to put down roots and work diligently."
      },
      5: {
        title: "Change, Freedom & Adaptability",
        focus: "Travel, exploration, shifting gears, and adventure.",
        advice: "Be open to unexpected options. Network, travel, and let go of stagnant structures. Embrace change!"
      },
      6: {
        title: "Family, Domestic Harmony & Healing",
        focus: "Home life, community service, and relationship repair.",
        advice: "Nurture your loved ones, beautify your home, and take responsibility. Excellent month for healing family bonds."
      },
      7: {
        title: "Introspection, Analysis & Spirituality",
        focus: "Self-reflection, studies, meditation, and quiet time.",
        advice: "Spend time alone in nature. Analyze your path, read spiritual or academic works, and rest your mind."
      },
      8: {
        title: "Material Success & Abundance",
        focus: "Financial control, business deals, and power.",
        advice: "A power month. Claim your authority, make smart business/career decisions, and focus on abundance."
      },
      9: {
        title: "Completion, Humanitarianism & Release",
        focus: "Ending outdated cycles, forgiving others, and charity.",
        advice: "Clean out clutter (physical and emotional). Forgive past issues, donate to charity, and prepare for the next cycle."
      }
    };
    return data[num] || data[1];
  };

  const getDayForecast = (num) => {
    const data = {
      1: {
        tagline: "Action & Leadership",
        advice: "Start a new habit, pitch a new concept, or take independent control of your tasks. Avoid self-doubt."
      },
      2: {
        tagline: "Collaboration & Harmony",
        advice: "Perfect day for romantic dates, quiet dinners, mediation, or signing joint agreements. Stay calm."
      },
      3: {
        tagline: "Creativity & Socializing",
        advice: "Speak up, share ideas, write creative content, or call friends. Enjoy life and stay lighthearted today."
      },
      4: {
        tagline: "Hard Work & Details",
        advice: "Organize files, clean your room, review budgets, or set clear guidelines. Focus on solid tasks."
      },
      5: {
        tagline: "Adventure & Adaptability",
        advice: "Try a new route, meet new contacts, embrace spontaneous plan changes, or travel. Be flexible today."
      },
      6: {
        tagline: "Nurturing & Relationships",
        advice: "Help a family member, cook a healthy meal, resolve domestic disputes, or focus on home decor. Show love."
      },
      7: {
        tagline: "Research & Meditation",
        advice: "Read a book, meditate, study difficult concepts, or spend quiet hours in introspection. Avoid noise."
      },
      8: {
        tagline: "Power & Wealth",
        advice: "Make investments, demand what you deserve, negotiate contracts, or work on high-value business deals."
      },
      9: {
        tagline: "Release & Compassion",
        advice: "Donate unwanted goods, finish pending chores, forgive someone, and avoid starting brand-new projects."
      }
    };
    return data[num] || data[1];
  };

  // Marriage Compatibility states
  const [partnerAName, setPartnerAName] = useState("");
  const [partnerADob, setPartnerADob] = useState("");
  const [partnerBName, setPartnerBName] = useState("");
  const [partnerBDob, setPartnerBDob] = useState("");
  const [compatResult, setCompatResult] = useState(null);
  const [compatLoading, setCompatLoading] = useState(false);
  const [compatError, setCompatError] = useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get("name");
    const urlDob = params.get("date");
    if (urlName) setName(urlName);
    if (urlDob) {
      setDob(urlDob);
      if (urlName) {
        // Auto trigger calculation if both parameters exist
        (async () => {
          setLoading(true);
          try {
            const response = await fetch("/api/numerology/detailed-report", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
              },
              body: JSON.stringify({ name: urlName, dob: urlDob }),
            });
            if (response.ok) {
              const data = await response.json();
              setResult(data);
            }
          } catch (e) {
            console.error("Auto calculation failed:", e);
          } finally {
            setLoading(false);
          }
        })();
      }
    }
  }, []);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!name || !dob) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/numerology/detailed-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({ name, dob }),
      });
      if (!response.ok) {
        throw new Error("Failed to compute detailed numerology report");
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err?.message || "An error occurred while calculating.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    window.close();
  };

  const resetForm = () => {
    setResult(null);
    setName("");
    setDob("");
  };

  // Loshu Grid indices mapper
  const getGridVal = (num) => {
    const count = result?.loshuGrid?.[num] || 0;
    if (count === 0) return "-";
    return String(num).repeat(count);
  };

  const getLoshuGridForDOB = (dobStr) => {
    const grid = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    if (!dobStr) return { grid, mulank: 0, bhagyank: 0 };

    const parts = dobStr.split('-');
    let digitsStr = "";
    let mulank = 0;
    let bhagyank = 0;

    if (parts.length === 3) {
      let year = parts[0];
      const month = parts[1];
      const day = parts[2];

      if (year.length === 4) {
        year = year.slice(2);
      }
      digitsStr = year + month + day;

      const dayVal = parseInt(day, 10);
      mulank = reduceToSingleDigit(dayVal);

      const allDigits = dobStr.replace(/\D/g, '').split('').map(Number);
      const sum = allDigits.reduce((acc, d) => acc + d, 0);
      bhagyank = reduceToSingleDigit(sum);
    }

    for (let char of digitsStr) {
      const val = parseInt(char, 10);
      if (grid[val] !== undefined) {
        grid[val] += 1;
      }
    }

    if (mulank && grid[mulank] !== undefined) {
      grid[mulank] += 1;
    }
    if (bhagyank && grid[bhagyank] !== undefined) {
      grid[bhagyank] += 1;
    }

    return { grid, mulank, bhagyank };
  };

  const renderMarriageCompatibilityPanel = () => {
    const handleCalculateCompatibility = (e) => {
      e.preventDefault();
      if (!partnerAName || !partnerADob || !partnerBName || !partnerBDob) {
        setCompatError("Please fill in details for both partners");
        return;
      }
      setCompatLoading(true);
      setCompatError(null);

      try {
        const dataA = getLoshuGridForDOB(partnerADob);
        const dataB = getLoshuGridForDOB(partnerBDob);

        const p1 = dataA.mulank;
        const p2 = dataB.mulank;
        const d1 = dataA.bhagyank;
        const d2 = dataB.bhagyank;

        const isMulankFriendly = FRIENDLY_NUMBERS[p1]?.includes(p2);
        const isBhagyankFriendly = FRIENDLY_NUMBERS[d1]?.includes(d2);

        let planetaryScore = 50;
        let planetaryMsg = "";
        if (isMulankFriendly && isBhagyankFriendly) {
          planetaryScore = 95;
          planetaryMsg = "Highly harmonious birth connections! Your ruling planetary forces are friendly, creating mutual respect and support.";
        } else if (isMulankFriendly || isBhagyankFriendly) {
          planetaryScore = 75;
          planetaryMsg = "Good birth connection. One of your core numbers is in planetary harmony, helping you connect well at either a mental or destiny level.";
        } else {
          planetaryScore = 45;
          planetaryMsg = "Neutral to challenging birth alignment. Your planetary energies are different, which may require active compromise and understanding.";
        }

        let totalMissingA = 0;
        let filledByB = 0;
        let totalMissingB = 0;
        let filledByA = 0;

        for (let i = 1; i <= 9; i++) {
          if (dataA.grid[i] === 0) {
            totalMissingA++;
            if (dataB.grid[i] > 0) filledByB++;
          }
          if (dataB.grid[i] === 0) {
            totalMissingB++;
            if (dataA.grid[i] > 0) filledByA++;
          }
        }

        const totalMissingSlots = totalMissingA + totalMissingB;
        const totalGapsFilled = filledByB + filledByA;
        const complementaryScore = totalMissingSlots > 0
          ? Math.round((totalGapsFilled / totalMissingSlots) * 100)
          : 100;

        let pillarPoints = 0;
        const has2A = dataA.grid[2] > 0;
        const has2B = dataB.grid[2] > 0;
        const has5A = dataA.grid[5] > 0;
        const has5B = dataB.grid[5] > 0;
        const has6A = dataA.grid[6] > 0;
        const has6B = dataB.grid[6] > 0;

        if (has2A && has2B) pillarPoints += 30;
        else if (has2A || has2B) pillarPoints += 15;

        if (has5A && has5B) pillarPoints += 15;
        else if (has5A || has5B) pillarPoints += 8;

        if (has6A && has6B) pillarPoints += 15;
        else if (has6A || has6B) pillarPoints += 8;

        const hasCombinedPillars = (has2A || has2B) && (has5A || has5B) && (has6A || has6B);
        if (hasCombinedPillars) pillarPoints += 40;

        const relationshipScore = Math.min(Math.round((pillarPoints / 100) * 100), 100);
        const overallScore = Math.round((planetaryScore * 0.3) + (complementaryScore * 0.4) + (relationshipScore * 0.3));

        const remediesList = [];
        if (!has2A && !has2B) {
          remediesList.push({
            title: "Strengthen Love Vibration (Missing 2)",
            desc: "Both partners lack the number 2. Place a pair of rose quartz love birds or a crystal tree in the Southwest corner of your bedroom to foster deep emotional bonding and understanding."
          });
        }
        if (!has5A && !has5B) {
          remediesList.push({
            title: "Establish Relationship Stability (Missing 5)",
            desc: "Both partners lack the stabilizing number 5. Keep a green aventurine pyramid or crystal tree in the center of your home to balance communication and maintain relationship harmony."
          });
        }
        if (!has6A && !has6B) {
          remediesList.push({
            title: "Enhance Romance and Family Support (Missing 6)",
            desc: "Both partners lack the number 6. Wear silver ornaments, keep Northwestern areas clean, or place golden metallic curtains to invite warmth, family support, and romantic vibes."
          });
        }
        if (planetaryScore < 60) {
          remediesList.push({
            title: "Planetary Harmony Remedy",
            desc: "Chant the Gayatri Mantra or Sri Suktam together on Fridays to nullify clashes between your birth path planets and bring spiritual synergy."
          });
        }

        setCompatResult({
          partnerA: {
            name: partnerAName,
            dob: partnerADob,
            grid: dataA.grid,
            mulank: dataA.mulank,
            bhagyank: dataA.bhagyank
          },
          partnerB: {
            name: partnerBName,
            dob: partnerBDob,
            grid: dataB.grid,
            mulank: dataB.mulank,
            bhagyank: dataB.bhagyank
          },
          planetaryScore,
          planetaryMsg,
          complementaryScore,
          relationshipScore,
          overallScore,
          filledByA,
          filledByB,
          totalMissingA,
          totalMissingB,
          remediesList
        });
      } catch (err) {
        console.error(err);
        setCompatError("An error occurred during compatibility calculation.");
      } finally {
        setCompatLoading(false);
      }
    };

    const handleResetCompat = () => {
      setCompatResult(null);
      setPartnerAName("");
      setPartnerADob("");
      setPartnerBName("");
      setPartnerBDob("");
      setCompatError(null);
    };

    const renderLoshuCell = (num, grid, name, otherGrid) => {
      const count = grid[num] || 0;
      const isMissing = count === 0;
      const isFilledByOther = isMissing && otherGrid[num] > 0;

      return (
        <div
          key={num}
          className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center relative border transition-all ${isMissing
            ? isFilledByOther
              ? "bg-green-50 border-green-300 text-green-800 ring-2 ring-green-200/50"
              : "bg-slate-50 border-slate-200 text-slate-300"
            : "bg-rose-50 border-rose-200 text-rose-900 font-bold shadow-sm"
            }`}
        >
          <span className="absolute top-1.5 right-2 text-[9px] font-bold text-slate-400">{num}</span>
          <span className="text-xl font-black">
            {isMissing
              ? isFilledByOther ? "+" : "-"
              : String(num).repeat(count)}
          </span>
          {isFilledByOther && (
            <span className="text-[8px] font-bold text-green-600 tracking-tighter uppercase mt-0.5">Balanced</span>
          )}
        </div>
      );
    };

    if (compatResult) {
      const { overallScore, partnerA, partnerB } = compatResult;

      let ratingClass = "bg-orange-100 text-orange-800";
      let ratingText = "Needs Understanding";
      if (overallScore >= 80) {
        ratingClass = "bg-green-100 text-green-800";
        ratingText = "Excellent Alignment";
      } else if (overallScore >= 60) {
        ratingClass = "bg-yellow-100 text-yellow-800";
        ratingText = "Good Harmony";
      }

      return (
        <div className="space-y-6">
          <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="relative flex items-center justify-center w-36 h-36 shrink-0 bg-rose-50 rounded-full border border-rose-150 animate-fadeIn">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Match Score</p>
                <p className="text-4xl font-black text-rose-600">{overallScore}%</p>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${ratingClass}`}>
                  {ratingText}
                </span>
              </div>
            </div>

            <div className="space-y-3 flex-1 text-center md:text-left">
              <h3 className="text-2xl font-black text-rose-955">
                {partnerA.name} & {partnerB.name} Compatibility
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your combined Lo Shu Magic Squares indicate an overall vibration compatibility of <strong>{overallScore}%</strong>. This report outlines how you balance each other's elemental missing voids and align spiritually through planetary frequencies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-extrabold text-rose-955 text-base">{partnerA.name}'s Grid</h4>
                <span className="text-xs font-bold text-slate-500">Psychic: {partnerA.mulank} | Destiny: {partnerA.bhagyank}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {renderLoshuCell(4, partnerA.grid, partnerA.name, partnerB.grid)}
                {renderLoshuCell(9, partnerA.grid, partnerA.name, partnerB.grid)}
                {renderLoshuCell(2, partnerA.grid, partnerA.name, partnerB.grid)}
                {renderLoshuCell(3, partnerA.grid, partnerA.name, partnerB.grid)}
                {renderLoshuCell(5, partnerA.grid, partnerA.name, partnerB.grid)}
                {renderLoshuCell(7, partnerA.grid, partnerA.name, partnerB.grid)}
                {renderLoshuCell(8, partnerA.grid, partnerA.name, partnerB.grid)}
                {renderLoshuCell(1, partnerA.grid, partnerA.name, partnerB.grid)}
                {renderLoshuCell(6, partnerA.grid, partnerA.name, partnerB.grid)}
              </div>
            </div>

            <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-extrabold text-rose-955 text-base">{partnerB.name}'s Grid</h4>
                <span className="text-xs font-bold text-slate-500">Psychic: {partnerB.mulank} | Destiny: {partnerB.bhagyank}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {renderLoshuCell(4, partnerB.grid, partnerB.name, partnerA.grid)}
                {renderLoshuCell(9, partnerB.grid, partnerB.name, partnerA.grid)}
                {renderLoshuCell(2, partnerB.grid, partnerB.name, partnerA.grid)}
                {renderLoshuCell(3, partnerB.grid, partnerB.name, partnerA.grid)}
                {renderLoshuCell(5, partnerB.grid, partnerB.name, partnerA.grid)}
                {renderLoshuCell(7, partnerB.grid, partnerB.name, partnerA.grid)}
                {renderLoshuCell(8, partnerB.grid, partnerB.name, partnerA.grid)}
                {renderLoshuCell(1, partnerB.grid, partnerB.name, partnerA.grid)}
                {renderLoshuCell(6, partnerB.grid, partnerB.name, partnerA.grid)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-rose-100 rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm uppercase tracking-wider">
                <Star className="w-4 h-4 text-rose-600" /> Planetary Birth Match
              </div>
              <p className="text-2xl font-black text-rose-700">{compatResult.planetaryScore}%</p>
              <p className="text-xs text-slate-600 leading-relaxed">{compatResult.planetaryMsg}</p>
            </div>

            <div className="bg-white border border-rose-100 rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm uppercase tracking-wider">
                <Compass className="w-4 h-4 text-rose-600" /> Complementary Balance
              </div>
              <p className="text-2xl font-black text-rose-700">{compatResult.complementaryScore}%</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {partnerA.name} fills <strong>{compatResult.filledByA}</strong> of {partnerB.name}'s missing slots, and {partnerB.name} fills <strong>{compatResult.filledByB}</strong> of {partnerA.name}'s missing slots.
              </p>
            </div>

            <div className="bg-white border border-rose-100 rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm uppercase tracking-wider">
                <Heart className="w-4 h-4 text-rose-600" /> Relationship Pillars
              </div>
              <p className="text-2xl font-black text-rose-700">{compatResult.relationshipScore}%</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Measures presence of <strong>2</strong> (harmony), <strong>5</strong> (stability), and <strong>6</strong> (support). Strong pillar numbers keep the relationship steady under challenges.
              </p>
            </div>
          </div>

          <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-extrabold text-rose-955 text-lg border-b border-rose-100 pb-2">
              🌸 Marriage Compatibility Remedies
            </h4>
            {compatResult.remediesList.length === 0 ? (
              <p className="text-sm text-green-700 font-medium flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Your joint numerology profiles are naturally balanced! No remedies are needed.
              </p>
            ) : (
              <div className="space-y-4">
                {compatResult.remediesList.map((rem, idx) => (
                  <div key={idx} className="bg-rose-50/20 border border-rose-100/50 p-4 rounded-2xl">
                    <h5 className="font-extrabold text-rose-950 text-sm mb-1">{rem.title}</h5>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{rem.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleResetCompat}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-rose-600/20 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Match Another Couple</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto bg-white border border-rose-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-rose-200/50 animate-fadeIn">
        <h3 className="text-xl font-bold text-rose-955 text-center mb-6">
          Enter Details for Both Partners
        </h3>

        {compatError && (
          <div className="bg-rose-100 border border-rose-350 text-rose-850 p-3 rounded-xl mb-4 text-xs font-bold flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {compatError}
          </div>
        )}

        <form onSubmit={handleCalculateCompatibility} className="space-y-6">
          <div className="space-y-3.5 border-b border-rose-100 pb-4">
            <h4 className="font-bold text-rose-900 text-sm uppercase tracking-wide">Partner A</h4>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              <input
                type="text"
                required
                value={partnerAName}
                onChange={(e) => setPartnerAName(e.target.value)}
                placeholder="Partner A Name"
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-medium text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Date of Birth
              </label>
              <input
                type="date"
                required
                value={partnerADob}
                onChange={(e) => setPartnerADob(e.target.value)}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="space-y-3.5 pb-4">
            <h4 className="font-bold text-rose-900 text-sm uppercase tracking-wide">Partner B</h4>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              <input
                type="text"
                required
                value={partnerBName}
                onChange={(e) => setPartnerBName(e.target.value)}
                placeholder="Partner B Name"
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-medium text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Date of Birth
              </label>
              <input
                type="date"
                required
                value={partnerBDob}
                onChange={(e) => setPartnerBDob(e.target.value)}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={compatLoading}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-rose-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 text-sm flex items-center justify-center gap-1.5"
          >
            {compatLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing Match...</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 animate-pulse" />
                <span>Check Marriage Compatibility</span>
              </>
            )}
          </button>
        </form>
      </div>
    );
  };

  const renderNameCorrectionPanel = () => {
    const currentChaldeanCompound = getChaldeanSum(result.name);
    const currentChaldeanReduced = result.namank;
    const psychic = result.mulank;
    const destiny = result.bhagyank;

    const friendlyList = FRIENDLY_NUMBERS[psychic] || [];
    const isCompatible = friendlyList.includes(currentChaldeanReduced);
    const avoids = Object.keys(PLANET_NAMES)
      .map(Number)
      .filter(num => !friendlyList.includes(num) && num !== psychic);

    const corrections = generateSpellingCorrections(result.name, psychic, destiny);

    const handleApplyCorrection = async (correctedName) => {
      setName(correctedName);
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/numerology/detailed-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: JSON.stringify({ name: correctedName, dob }),
        });
        if (!response.ok) {
          throw new Error("Failed to compute detailed report for corrected spelling");
        }
        const data = await response.json();
        setResult(data);
        setActiveTab("report");
      } catch (err) {
        console.error(err);
        setError(err?.message || "An error occurred while calculating.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6">
        {/* Compatibility Overview Card */}
        <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xl font-black text-rose-950 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-600" /> Current Name Spelling Compatibility
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Name Analysed</p>
                <p className="text-xl font-bold text-rose-950">{result.name}</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-rose-50/30 p-3 rounded-xl border border-rose-100/20 text-center">
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase">Psychic (Mulank)</p>
                  <p className="text-2xl font-black text-rose-600">{psychic}</p>
                  <p className="text-[10px] font-medium text-slate-400">{PLANET_NAMES[psychic]}</p>
                </div>
                <div className="bg-rose-50/30 p-3 rounded-xl border border-rose-100/20 text-center">
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase">Destiny (Bhagyank)</p>
                  <p className="text-2xl font-black text-rose-600">{destiny}</p>
                  <p className="text-[10px] font-medium text-slate-400">{PLANET_NAMES[destiny]}</p>
                </div>
                <div className="bg-rose-50/30 p-3 rounded-xl border border-rose-100/20 text-center">
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase">Name (Chaldean)</p>
                  <p className="text-2xl font-black text-rose-600">{currentChaldeanReduced}</p>
                  <p className="text-[10px] font-medium text-slate-400">Total: {currentChaldeanCompound}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              {isCompatible ? (
                <div className="bg-green-50 border border-green-200 text-green-950 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-green-800 font-extrabold text-base">
                    <CheckCircle className="w-5 h-5 shrink-0" /> Auspicious Alignment!
                  </div>
                  <p className="text-xs md:text-sm leading-relaxed">
                    Your name spelling reduces to <strong>{currentChaldeanReduced}</strong>, which is highly compatible with your Psychic/Birth number <strong>{psychic}</strong>. This alignment brings smooth progress, positive vibrations, and luck.
                  </p>
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-200 text-orange-950 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-orange-800 font-extrabold text-base">
                    <AlertCircle className="w-5 h-5 shrink-0" /> Spelling Conflict Detected
                  </div>
                  <p className="text-xs md:text-sm leading-relaxed">
                    Your name reduces to <strong>{currentChaldeanReduced}</strong>, which is not in harmony with your Psychic number <strong>{psychic}</strong>. This clash can cause unexpected delays, professional hurdles, or miscommunications.
                  </p>
                  <p className="text-xs font-bold text-orange-900">
                    💡 We suggest minor spelling corrections below to tune it to a friendly frequency.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lucky Numbers Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
            <h4 className="font-extrabold text-rose-950 text-base mb-3">Friendly Target Numbers</h4>
            <p className="text-xs text-slate-500 mb-4">Aim to adjust your name spelling so that the Chaldean sum reduces to one of these single digits:</p>
            <div className="flex flex-wrap gap-2">
              {friendlyList.map(num => (
                <span key={num} className="inline-flex flex-col items-center justify-center w-14 h-14 bg-green-50 border border-green-200 rounded-xl">
                  <span className="text-lg font-black text-green-700">{num}</span>
                  <span className="text-[8px] font-bold text-slate-400">{PLANET_NAMES[num]}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
            <h4 className="font-extrabold text-rose-950 text-base mb-3">Numbers to Avoid</h4>
            <p className="text-xs text-slate-500 mb-4">Try to avoid name spelling totals that reduce to these conflicting digits:</p>
            <div className="flex flex-wrap gap-2">
              {avoids.map(num => (
                <span key={num} className="inline-flex flex-col items-center justify-center w-14 h-14 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-lg font-black text-rose-700/60 line-through">{num}</span>
                  <span className="text-[8px] font-bold text-slate-400">{PLANET_NAMES[num]}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Spelling Suggestions list */}
        <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
          <div className="border-b border-rose-100 pb-3 mb-4 flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-black text-rose-950">Lucky Spelling Correction Suggestions</h3>
              <p className="text-xs text-slate-500">Minor spell changes that create maximum compatibility with your charts</p>
            </div>
            <span className="bg-rose-100 text-rose-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Chaldean Method
            </span>
          </div>

          {corrections.length === 0 ? (
            <div className="text-center py-8 bg-rose-50/10 rounded-2xl border border-dashed border-rose-200/50">
              <Sparkles className="w-8 h-8 text-rose-350 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">Your current name is already fully optimized!</p>
              <p className="text-xs text-slate-400">No spelling modifications are needed for this birth profile.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-rose-100 text-rose-900 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-2">Proposed Spelling</th>
                    <th className="py-3 px-2">Correction Method</th>
                    <th className="py-3 px-2 text-center">Chaldean Sum</th>
                    <th className="py-3 px-2 text-center">Reduced Number</th>
                    <th className="py-3 px-2">Spelling Vibration</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50/50 font-medium">
                  {corrections.map((item, idx) => {
                    const compoundDetail = COMPOUND_LUCKY_DETAILS[item.compound];
                    return (
                      <tr key={idx} className="hover:bg-rose-50/20 transition-all">
                        <td className="py-4 px-2">
                          <span className="font-extrabold text-slate-900 text-base">{item.name}</span>
                        </td>
                        <td className="py-4 px-2 text-slate-600 text-xs">{item.method}</td>
                        <td className="py-4 px-2 text-center text-rose-700 font-black">{item.compound}</td>
                        <td className="py-4 px-2 text-center">
                          <span className="inline-flex flex-col items-center justify-center bg-rose-50 px-2 py-0.5 rounded font-black text-rose-600">
                            {item.single}
                            <span className="text-[8px] text-slate-400 uppercase tracking-tighter">{PLANET_NAMES[item.single]}</span>
                          </span>
                        </td>
                        <td className="py-4 px-2 max-w-xs">
                          {compoundDetail ? (
                            <div>
                              <span className="font-bold text-green-700 block text-xs">🌟 {compoundDetail.title}</span>
                              <span className="text-[11px] text-slate-500 leading-snug block">{compoundDetail.desc}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">Harmonious compound vibration. Good for personality and career.</span>
                          )}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button
                            onClick={() => handleApplyCorrection(item.name)}
                            className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow shadow-rose-200"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Try Spelling</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVastuOverlayPanel = () => {
    return (
      <div className="bg-white border border-rose-100 rounded-5xl p-6 shadow-sm space-y-6 animate-fadeIn">
        <h3 className="text-lg font-black text-rose-955 border-b border-rose-100 pb-3 flex items-center gap-2">
          <Compass className="w-5 h-5 text-rose-600 animate-spin-slow" />
          Vastu & Feng Shui Directions Overlay
        </h3>

        {/* Vastu Wheel & Diagnostics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Vastu Compass Wheel Layout */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center bg-rose-50/20 border border-rose-100/50 p-4 rounded-3xl">
            <span className="text-xs font-extrabold text-rose-900 uppercase tracking-widest mb-3">Vastu Compass Alignment</span>
            <div className="relative w-80 h-80 rounded-full border-4 border-rose-200 bg-white flex items-center justify-center shadow-md">

              {/* Inner center Brahmasthan (5) */}
              <div className={`absolute w-24 h-24 rounded-full flex flex-col items-center justify-center shadow z-10 transition-all ${result.loshuGrid[5] > 0 ? "bg-green-500 text-white border-2 border-green-600" : "bg-orange-100 text-orange-800 border-2 border-orange-300 border-dashed"
                }`}>
                <span className="text-[10px] font-black leading-none">Center</span>
                <span className="text-[9px] font-extrabold">(5)</span>
              </div>

              {/* Outer Direction Cells */}
              {[
                { dir: "N", num: 1, angle: 0 },
                { dir: "NE", num: 8, angle: 45 },
                { dir: "E", num: 3, angle: 90 },
                { dir: "SE", num: 4, angle: 135 },
                { dir: "S", num: 9, angle: 180 },
                { dir: "SW", num: 2, angle: 225 },
                { dir: "W", num: 7, angle: 270 },
                { dir: "NW", num: 6, angle: 315 }
              ].map((item) => {
                const isPresent = result.loshuGrid[item.num] > 0;
                // Math to position directions in a circle
                const rad = (item.angle - 90) * (Math.PI / 180);
                const x = Math.cos(rad) * 115; // radius
                const y = Math.sin(rad) * 115;
                return (
                  <div
                    key={item.dir}
                    className={`absolute w-14 h-14 rounded-full flex flex-col items-center justify-center text-center text-xs font-extrabold transition-all shadow-sm ${isPresent
                      ? "bg-emerald-500 text-white border border-emerald-600 font-black"
                      : "bg-orange-50 text-orange-700 border border-orange-200 border-dashed"
                      }`}
                    style={{
                      transform: `translate(${x}px, ${y}px)`
                    }}
                  >
                    <span className="font-black leading-none">{item.dir}</span>
                    <span className="text-[9px]">({item.num})</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-4 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Harmonious
              </span>
              <span className="flex items-center gap-1 text-orange-600">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-300"></span> Defect/Missing
              </span>
            </div>
          </div>

          {/* Directional Analysis & Remedies */}
          <div className="lg:col-span-2 space-y-4 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-rose-100 pr-1">

            {/* Heading */}
            <div className="bg-rose-50/30 p-3.5 rounded-2xl border border-rose-100/50">
              <h4 className="text-xs font-extrabold text-rose-955 uppercase tracking-wider mb-1">Directional Diagnostics</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Numerology maps home directions to birth date vibrations. Missing numbers point to weak Vastu directions in your living space. Follow the remedies below to balance your home layout.
              </p>
            </div>

            {/* List of missing direction defects and remedies */}
            {(() => {
              const missingList = Object.entries(VASTU_DIRECTIONS)
                .filter(([num]) => result.loshuGrid[parseInt(num)] === 0)
                .map(([num, data]) => ({ num: parseInt(num), ...data }));

              if (missingList.length === 0) {
                return (
                  <div className="p-4 bg-green-50 border border-green-100 text-green-950 text-xs font-medium rounded-2xl flex items-center gap-2 animate-fadeIn">
                    <CheckCircle className="w-4 h-4 text-green-700" />
                    <span>Perfect Vastu Alignment! All 9 compass direction elements are active in your grid profile. Keep your home clutter-free to preserve this flow.</span>
                  </div>
                );
              }

              return missingList.map((item) => (
                <div key={item.num} className="p-4 border border-rose-100/70 rounded-2xl bg-white shadow-sm flex items-start gap-3 animate-fadeIn">
                  <div className="p-2.5 bg-orange-50 text-orange-700 rounded-xl font-black text-xs shrink-0">
                    {item.num}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-slate-800 text-sm">{item.zone} Zone</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">
                        {item.element} Element
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      <strong>Impact:</strong> {item.aspect} — {item.issue}
                    </p>
                    <p className="text-xs text-slate-700 font-semibold bg-rose-50/30 p-2 rounded-xl border border-rose-100/20 leading-relaxed">
                      <strong>Vastu Remedy:</strong> {item.remedy}
                    </p>
                  </div>
                </div>
              ));
            })()}

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-rose-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-rose-600 text-white p-2.5 rounded-2xl shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-rose-950 tracking-tight">
                Vedic & Chaldean Numerology
              </h1>
              <p className="text-xs md:text-sm text-rose-700 font-medium">
                Deep numerical analytics of your name, personality, destiny, and remedies
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center space-x-1.5 px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-xl font-bold transition-all text-sm border border-rose-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Close Dashboard</span>
          </button>
        </div>

        {error && (
          <div className="bg-rose-100 border border-rose-300 text-rose-800 p-4 rounded-xl flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {!result ? (
          <div className="max-w-md mx-auto bg-white border border-rose-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-rose-200/50 mt-10">
            <h2 className="text-xl font-bold text-rose-950 text-center mb-6">
              Enter Birth Details
            </h2>
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-rose-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Calculate Numerology Profile"}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex border-b border-rose-200">
              <button
                onClick={() => setActiveTab("report")}
                className={`py-3 px-6 font-extrabold text-sm md:text-base border-b-2 transition-all flex items-center gap-2 ${activeTab === "report"
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-slate-500 hover:text-rose-600"
                  }`}
              >
                <Award className="w-5 h-5" />
                <span>Detailed Report</span>
              </button>
              <button
                onClick={() => setActiveTab("correction")}
                className={`py-3 px-6 font-extrabold text-sm md:text-base border-b-2 transition-all flex items-center gap-2 ${activeTab === "correction"
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-slate-500 hover:text-rose-600"
                  }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>Name Correction</span>
              </button>
              <button
                onClick={() => setActiveTab("compatibility")}
                className={`py-3 px-6 font-extrabold text-sm md:text-base border-b-2 transition-all flex items-center gap-2 ${activeTab === "compatibility"
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-slate-500 hover:text-rose-600"
                  }`}
              >
                <Heart className="w-5 h-5" />
                <span>Marriage Compatibility</span>
              </button>
              <button
                onClick={() => setActiveTab("vastu")}
                className={`py-3 px-6 font-extrabold text-sm md:text-base border-b-2 transition-all flex items-center gap-2 ${activeTab === "vastu"
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-slate-500 hover:text-rose-600"
                  }`}
              >
                <Compass className="w-5 h-5" />
                <span>Vastu & Directions</span>
              </button>
            </div>

            {activeTab === "report" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Core Numbers, Profile Analysis, and Loshu Grid Visual */}
                <div className="space-y-6 lg:col-span-2">

                  {/* Core Numbers Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Mulank (Ruling) */}
                    <div className="bg-white border border-rose-100 p-5 rounded-2xl shadow-sm text-center flex flex-col justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-full mb-3">
                          <Star className="w-3 h-3" /> Mulank (Ruling)
                        </span>
                        <p className="text-slate-500 text-xs font-medium mb-1">Birth Date Day Vibration</p>
                      </div>
                      <div className="my-3">
                        <span className="text-5xl font-black text-rose-600">{result.mulank}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-700 bg-rose-50/50 py-1.5 rounded-lg">
                        Planet: {result.mulankDetails.planet}
                      </div>
                    </div>

                    {/* Bhagyank (Destiny) */}
                    <div className="bg-white border border-rose-100 p-5 rounded-2xl shadow-sm text-center flex flex-col justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-full mb-3">
                          <Compass className="w-3 h-3" /> Bhagyank (Destiny)
                        </span>
                        <p className="text-slate-500 text-xs font-medium mb-1">Full Date of Birth Sum</p>
                      </div>
                      <div className="my-3">
                        <span className="text-5xl font-black text-rose-600">{result.bhagyank}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-700 bg-rose-50/50 py-1.5 rounded-lg">
                        Planet: {result.bhagyankDetails.planet}
                      </div>
                    </div>

                    {/* Namank (Name Vibration with Chaldean vs Pythagorean Toggle) */}
                    <div className="bg-white border border-rose-100 p-5 rounded-2xl shadow-sm text-center flex flex-col justify-between relative overflow-hidden">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-full mb-2">
                          <User className="w-3 h-3" /> Namank ({nameSystem})
                        </span>
                        <div className="flex justify-center mb-1">
                          <button
                            onClick={() => setNameSystem(nameSystem === "Chaldean" ? "Pythagorean" : "Chaldean")}
                            className="inline-flex items-center gap-1 text-[9px] bg-rose-100 hover:bg-rose-200 text-rose-950 font-bold px-2 py-0.5 rounded-full transition-all border border-rose-200"
                          >
                            Toggle System
                          </button>
                        </div>
                      </div>
                      <div className="my-2">
                        <span className="text-5xl font-black text-rose-600">
                          {nameSystem === "Chaldean" ? result.namank : result.pythagoreanNamank}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-700 bg-rose-50/50 py-1.5 rounded-lg">
                        Planet: {nameSystem === "Chaldean" ? result.namankDetails.planet : "Calculated"}
                      </div>
                    </div>

                  </div>

                  {/* Chaldean vs Pythagorean Comparison Card */}
                  <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-base font-black text-rose-950 mb-3 flex items-center gap-2">
                      <ToggleLeft className="w-5 h-5 text-rose-600" /> Name Number System Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className={`p-4 rounded-2xl border transition-all ${nameSystem === "Chaldean" ? "bg-rose-50 border-rose-200" : "bg-white border-slate-100"}`}>
                        <h4 className="font-extrabold text-rose-955 text-sm mb-1">Chaldean / Cheiro System</h4>
                        <p className="text-slate-600 mb-2 leading-relaxed">Originating in ancient Babylon, it assigns values based on sounds and vibration rather than alphabetical order.</p>
                        <span className="text-sm font-black text-rose-700">Namank Score: {result.namank}</span>
                      </div>
                      <div className={`p-4 rounded-2xl border transition-all ${nameSystem === "Pythagorean" ? "bg-rose-50 border-rose-200" : "bg-white border-slate-100"}`}>
                        <h4 className="font-extrabold text-rose-950 text-sm mb-1">Pythagorean System</h4>
                        <p className="text-slate-600 mb-2 leading-relaxed">Developed by the Greek philosopher Pythagoras, it maps letters sequentially from 1 to 9 based on the alphabet.</p>
                        <span className="text-sm font-black text-rose-700">Namank Score: {result.pythagoreanNamank}</span>
                      </div>
                    </div>
                  </div>

                  {/* In-depth Core Profile Panels */}
                  <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-rose-955 border-b border-rose-100 pb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-rose-600" /> Numerological Profile Analysis
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-extrabold text-rose-955 mb-1">
                          Mulank {result.mulank} - Core Personality
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed bg-rose-50/20 p-3.5 rounded-xl border border-rose-100/50">
                          {result.mulankDetails.traits}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-extrabold text-rose-955 mb-1">
                          Bhagyank {result.bhagyank} - Destiny & Careers
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed bg-rose-50/20 p-3.5 rounded-xl border border-rose-100/50">
                          <strong>Best Fields:</strong> {result.bhagyankDetails.careers}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-extrabold text-rose-955 mb-1">
                          Personal Year Forecast ({result.currentYear})
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed bg-rose-50/20 p-3.5 rounded-xl border border-rose-100/50">
                          Your Personal Year vibration is <strong className="text-rose-700">{result.personalYear}</strong>.
                          This year is ruled by <strong>{result.personalYearDetails.planet}</strong>, indicating a phase of:{" "}
                          {result.personalYearDetails.traits}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Loshu Grid Visual Card - Displayed below Numerological Profile Analysis */}
                  <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm flex flex-col items-stretch w-full">
                    <h3 className="text-lg font-black text-rose-955 mb-1 text-center w-full">Loshu Grid</h3>
                    <p className="text-[11px] text-slate-900 font-semibold uppercase tracking-wider mb-5 text-center w-full">3x3 Saturnine Magic Square</p>

                    <div className="grid grid-cols-3 gap-4 w-full">

                      {/* Row 1 */}
                      {/* Cell 4 */}
                      <div className={`p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-amber-400 transition-all duration-300 ${isCellHighlighted(4) ? 'ring-4 ring-rose-500 border-rose-500 scale-[1.04] bg-rose-50/50 shadow-lg z-10' : ''}`}>
                        <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">4</div>
                        <div className="my-3">
                          {result.loshuGrid[4] > 0 ? (
                            <span className="text-3xl font-black text-amber-600">{getGridVal(4)}</span>
                          ) : (
                            <span className="text-2xl font-bold text-slate-300 line-through">4</span>
                          )}
                        </div>
                        <div className="space-y-2 text-[16px]">
                          <p className="font-semibold text-slate-700 leading-tight">Discipline, Stability, Hard Work, Practicality, Organization, Structure</p>
                          <div className="text-[16px] bg-amber-50/70 border border-amber-100 py-1.5 rounded space-y-0.5 font-bold text-amber-900 w-full">
                            <p>Element: Wood</p>
                            <p>Planet: Rahu</p>
                            <p>Merit: Stability</p>
                            <p>Direction: Southeast</p>
                          </div>
                        </div>
                      </div>

                      {/* Cell 9 */}
                      <div className={`p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-orange-400 transition-all duration-300 ${isCellHighlighted(9) ? 'ring-4 ring-rose-500 border-rose-500 scale-[1.04] bg-rose-50/50 shadow-lg z-10' : ''}`}>
                        <div className="absolute top-2 right-2 bg-orange-100 text-orange-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">9</div>
                        <div className="my-3">
                          {result.loshuGrid[9] > 0 ? (
                            <span className="text-3xl font-black text-orange-600">{getGridVal(9)}</span>
                          ) : (
                            <span className="text-2xl font-bold text-slate-300 line-through">9</span>
                          )}
                        </div>
                        <div className="space-y-2 text-[16px]">
                          <p className="font-semibold text-slate-700 leading-tight">Compassion, Empathy, Idealism, Generosity, Sacrifice, Vision, Humanitarianism</p>
                          <div className="text-[16px] bg-orange-50/70 border border-orange-100 py-1.5 rounded space-y-0.5 font-bold text-orange-900 w-full">
                            <p>Element: Fire</p>
                            <p>Planet: Mars</p>
                            <p>Merit: Compassion</p>
                            <p>Direction: South</p>
                          </div>
                        </div>
                      </div>

                      {/* Cell 2 */}
                      <div className={`p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-indigo-400 transition-all duration-300 ${isCellHighlighted(2) ? 'ring-4 ring-rose-500 border-rose-500 scale-[1.04] bg-rose-50/50 shadow-lg z-10' : ''}`}>
                        <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">2</div>
                        <div className="my-3">
                          {result.loshuGrid[2] > 0 ? (
                            <span className="text-3xl font-black text-indigo-600">{getGridVal(2)}</span>
                          ) : (
                            <span className="text-2xl font-bold text-slate-300 line-through">2</span>
                          )}
                        </div>
                        <div className="space-y-2 text-[16px]">
                          <p className="font-semibold text-slate-700 leading-tight">Cooperation, Sensitivity, Harmony, Balance, Partnership, Diplomacy, Receptivity</p>
                          <div className="text-[16px] bg-indigo-50/70 border border-indigo-100 py-1.5 rounded space-y-0.5 font-bold text-indigo-900 w-full">
                            <p>Element: Earth</p>
                            <p>Planet: Moon</p>
                            <p>Merit: Supportiveness</p>
                            <p>Direction: Southwest</p>
                          </div>
                        </div>
                      </div>

                      {/* Row 2 */}
                      {/* Cell 3 */}
                      <div className={`p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-emerald-400 transition-all duration-300 ${isCellHighlighted(3) ? 'ring-4 ring-rose-500 border-rose-500 scale-[1.04] bg-rose-50/50 shadow-lg z-10' : ''}`}>
                        <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">3</div>
                        <div className="my-3">
                          {result.loshuGrid[3] > 0 ? (
                            <span className="text-3xl font-black text-emerald-600">{getGridVal(3)}</span>
                          ) : (
                            <span className="text-2xl font-bold text-slate-300 line-through">3</span>
                          )}
                        </div>
                        <div className="space-y-2 text-[16px]">
                          <p className="font-semibold text-slate-700 leading-tight">Expression, Creativity, Joy, Charisma, Communication, Art, Optimism</p>
                          <div className="text-[16px] bg-emerald-50/70 border border-emerald-100 py-1.5 rounded space-y-0.5 font-bold text-emerald-900 w-full">
                            <p>Element: Wood</p>
                            <p>Planet: Jupiter</p>
                            <p>Merit: Creativity</p>
                            <p>Direction: East</p>
                          </div>
                        </div>
                      </div>

                      {/* Cell 5 */}
                      <div className={`p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-indigo-500 transition-all duration-300 ${isCellHighlighted(5) ? 'ring-4 ring-rose-500 border-rose-500 scale-[1.04] bg-rose-50/50 shadow-lg z-10' : ''}`}>
                        <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">5</div>
                        <div className="my-3">
                          {result.loshuGrid[5] > 0 ? (
                            <span className="text-3xl font-black text-indigo-700">{getGridVal(5)}</span>
                          ) : (
                            <span className="text-2xl font-bold text-slate-300 line-through">5</span>
                          )}
                        </div>
                        <div className="space-y-2 text-[16px]">
                          <p className="font-semibold text-slate-700 leading-tight">Freedom, Adaptability, Change, Adventure, Versatility, Movement, Exploration</p>
                          <div className="text-[16px] bg-indigo-50/70 border border-indigo-100 py-1.5 rounded space-y-0.5 font-bold text-indigo-955 w-full">
                            <p>Element: Earth</p>
                            <p>Planet: Mercury</p>
                            <p>Merit: Balance</p>
                            <p>Direction: Center</p>
                          </div>
                        </div>
                      </div>

                      {/* Cell 7 */}
                      <div className={`p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-teal-400 transition-all duration-300 ${isCellHighlighted(7) ? 'ring-4 ring-rose-500 border-rose-500 scale-[1.04] bg-rose-50/50 shadow-lg z-10' : ''}`}>
                        <div className="absolute top-2 right-2 bg-teal-100 text-teal-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">7</div>
                        <div className="my-3">
                          {result.loshuGrid[7] > 0 ? (
                            <span className="text-3xl font-black text-teal-600">{getGridVal(7)}</span>
                          ) : (
                            <span className="text-2xl font-bold text-slate-300 line-through">7</span>
                          )}
                        </div>
                        <div className="space-y-2 text-[16px]">
                          <p className="font-semibold text-slate-700 leading-tight">Spirituality, Wisdom, Research, Inner Growth, Solitude, Introspection, Knowledge</p>
                          <div className="text-[16px] bg-teal-50/70 border border-teal-100 py-1.5 rounded space-y-0.5 font-bold text-teal-900 w-full">
                            <p>Element: Metal</p>
                            <p>Planet: Ketu</p>
                            <p>Merit: Wisdom</p>
                            <p>Direction: West</p>
                          </div>
                        </div>
                      </div>

                      {/* Row 3 */}
                      {/* Cell 8 */}
                      <div className={`p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-purple-400 transition-all duration-300 ${isCellHighlighted(8) ? 'ring-4 ring-rose-500 border-rose-500 scale-[1.04] bg-rose-50/50 shadow-lg z-10' : ''}`}>
                        <div className="absolute top-2 right-2 bg-purple-100 text-purple-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">8</div>
                        <div className="my-3">
                          {result.loshuGrid[8] > 0 ? (
                            <span className="text-3xl font-black text-purple-600">{getGridVal(8)}</span>
                          ) : (
                            <span className="text-2xl font-bold text-slate-300 line-through">8</span>
                          )}
                        </div>
                        <div className="space-y-2 text-[16px]">
                          <p className="font-semibold text-slate-700 leading-tight">Power, Ambition, Authority, Status, Success, Control, Leadership</p>
                          <div className="text-[16px] bg-purple-50/70 border border-purple-100 py-1.5 rounded space-y-0.5 font-bold text-purple-900 w-full">
                            <p>Element: Earth</p>
                            <p>Planet: Saturn</p>
                            <p>Merit: Success</p>
                            <p>Direction: Northeast</p>
                          </div>
                        </div>
                      </div>

                      {/* Cell 1 */}
                      <div className={`p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-blue-400 transition-all duration-300 ${isCellHighlighted(1) ? 'ring-4 ring-rose-500 border-rose-500 scale-[1.04] bg-rose-50/50 shadow-lg z-10' : ''}`}>
                        <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">1</div>
                        <div className="my-3">
                          {result.loshuGrid[1] > 0 ? (
                            <span className="text-3xl font-black text-blue-600">{getGridVal(1)}</span>
                          ) : (
                            <span className="text-2xl font-bold text-slate-300 line-through">1</span>
                          )}
                        </div>
                        <div className="space-y-2 text-[16px]">
                          <p className="font-semibold text-slate-700 leading-tight">Leadership, Individualism, Confidence, Creativity, Determination, Originality, Willpower</p>
                          <div className="text-[16px] bg-blue-50/70 border border-blue-100 py-1.5 rounded space-y-0.5 font-bold text-blue-900 w-full">
                            <p>Element: Water</p>
                            <p>Planet: Sun</p>
                            <p>Merit: Individualism</p>
                            <p>Direction: North</p>
                          </div>
                        </div>
                      </div>

                      {/* Cell 6 */}
                      <div className={`p-4 rounded-3xl flex flex-col items-center justify-between text-center relative text-slate-900 bg-white shadow-md border-2 border-rose-350 transition-all duration-300 ${isCellHighlighted(6) ? 'ring-4 ring-rose-500 border-rose-500 scale-[1.04] bg-rose-50/50 shadow-lg z-10' : ''}`}>
                        <div className="absolute top-2 right-2 bg-rose-100 text-rose-800 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">6</div>
                        <div className="my-3">
                          {result.loshuGrid[6] > 0 ? (
                            <span className="text-3xl font-black text-rose-600">{getGridVal(6)}</span>
                          ) : (
                            <span className="text-2xl font-bold text-slate-300 line-through">6</span>
                          )}
                        </div>
                        <div className="space-y-2 text-[16px]">
                          <p className="font-semibold text-slate-700 leading-tight">Responsibility, Love, Service, Family, Compassion, Support, Harmony</p>
                          <div className="text-[16px] bg-rose-50/70 border border-rose-100 py-1.5 rounded space-y-0.5 font-bold text-rose-900 w-full">
                            <p>Element: Metal</p>
                            <p>Planet: Venus</p>
                            <p>Merit: Service</p>
                            <p>Direction: Northwest</p>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="mt-6 text-xs text-slate-500 space-y-2 leading-relaxed text-center">
                      <p>
                        <strong>Loshu Grid</strong> indicates which elements and planes are fully active. Repeating numbers boost the respective element, while absent numbers suggest fields for remedy focus.
                      </p>
                    </div>
                  </div>

                  {/* Loshu Planes Analysis */}
                  <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-black text-rose-955 border-b border-rose-100 pb-3 mb-4 flex items-center gap-2">
                      <Compass className="w-5 h-5 text-rose-600" /> Loshu Grid Planes Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.loshuPlanes.map((plane, idx) => (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoveredPlane(plane.name)}
                          onMouseLeave={() => setHoveredPlane(null)}
                          className="p-4 rounded-2xl border border-rose-100/50 bg-rose-50/10 flex flex-col justify-between transition-all hover:bg-rose-50/40 hover:border-rose-300 hover:shadow-md cursor-pointer"
                        >
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-extrabold text-rose-955 text-base">{plane.name}</h4>
                              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${plane.status === "Strong" ? "bg-green-100 text-green-800" :
                                plane.status === "Moderate" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-orange-100 text-orange-800"
                                }`}>
                                {plane.status}
                              </span>
                            </div>
                            <p className="text-xs md:text-sm text-slate-500 mb-2">{plane.description}</p>
                          </div>
                          {plane.status === "Missing/Weak" && (
                            <div className="mt-2 text-xs md:text-sm bg-orange-50 text-orange-950 p-2.5 rounded-xl border border-orange-100 flex items-start gap-1">
                              <AlertCircle className="w-3.5 h-3.5 mt-0.5 text-orange-700 shrink-0" />
                              <div>
                                <span className="font-bold">Missing Remedy:</span> {plane.remedy}
                              </div>
                            </div>
                          )}
                          {plane.status !== "Missing/Weak" && (
                            <div className="mt-2 text-xs md:text-sm bg-green-50 text-green-950 p-2.5 rounded-xl border border-green-100 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-green-700 shrink-0" />
                              <span className="font-semibold">Plane elements are well balanced!</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progressive predictions & Temporal Cycles Forecast */}
                  <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-rose-955 border-b border-rose-100 pb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-rose-600" /> Progressive Predictions & Cycle Forecasts
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                      {/* Personal Year Card */}
                      <div className="bg-gradient-to-br from-rose-50 to-amber-50/30 p-5 rounded-2xl border border-rose-100 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 bg-rose-100/50 px-2.5 py-1 rounded-full">
                            Current Year Vibration
                          </span>
                          <h4 className="text-base font-black text-rose-955 mt-2">
                            Personal Year {result.personalYear}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Overall vibration theme of the entire year:
                          </p>
                          <p className="text-xs font-semibold text-slate-700 mt-2 bg-white/70 p-2.5 rounded-xl border border-rose-100/30">
                            {result.personalYearDetails?.traits || "Year of development and progress."}
                          </p>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-4 border-t border-rose-100/50 pt-2 font-medium">
                          Ruling Planet: {result.personalYearDetails?.planet || "Sun"}
                        </div>
                      </div>

                      {/* Daily Forecast Gauge */}
                      {(() => {
                        const today = new Date();
                        const currentMonthNum = today.getMonth() + 1;
                        const currentDayNum = today.getDate();
                        const pMonth = reduceToSingleDigit(result.personalYear + currentMonthNum);
                        const pDay = reduceToSingleDigit(pMonth + currentDayNum);
                        const dayData = getDayForecast(pDay);
                        return (
                          <div className="bg-white border border-rose-100 p-5 rounded-2xl shadow-sm text-center flex flex-col justify-between md:col-span-2 relative overflow-hidden">
                            <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-800 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase">
                              Today's Energy
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4 my-2">
                              {/* Circular progress ring representing the daily number */}
                              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center bg-rose-50 rounded-full border-4 border-rose-400 shadow-inner">
                                <span className="text-4xl font-black text-rose-600">{pDay}</span>
                              </div>
                              <div className="text-left">
                                <h5 className="font-extrabold text-slate-800 text-sm">{dayData.tagline}</h5>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                  {dayData.advice}
                                </p>
                              </div>
                            </div>
                            <div className="text-[10px] text-slate-400 text-left border-t border-slate-100 pt-2 font-semibold">
                              Current Date: {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                          </div>
                        );
                      })()}

                    </div>

                    {/* Personal Month Timeline */}
                    <div className="border-t border-rose-100 pt-4">
                      <h4 className="text-sm font-extrabold text-rose-955 mb-3">
                        Monthly Forecast Timeline ({result.currentYear})
                      </h4>

                      {/* Months slider */}
                      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-rose-200">
                        {Array.from({ length: 12 }, (_, i) => {
                          const mIndex = i + 1;
                          const pMonth = reduceToSingleDigit(result.personalYear + mIndex);
                          const mName = new Date(2026, i).toLocaleString('en-US', { month: 'short' });
                          const isActive = selectedForecastMonth === mIndex;
                          return (
                            <button
                              key={mIndex}
                              onClick={() => setSelectedForecastMonth(mIndex)}
                              className={`px-4 py-2.5 rounded-xl border text-center transition-all shrink-0 min-w-[70px] ${isActive
                                ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                                : 'bg-rose-50/30 text-rose-950 border-rose-100/50 hover:bg-rose-50'
                                }`}
                            >
                              <span className="text-xs font-bold block leading-none">{mName}</span>
                              <span className={`text-[10px] font-black block mt-1 ${isActive ? 'text-amber-200' : 'text-rose-600'}`}>
                                Vib: {pMonth}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Active Month Details Display */}
                      {(() => {
                        const mData = getMonthForecast(reduceToSingleDigit(result.personalYear + selectedForecastMonth));
                        const monthFull = new Date(2026, selectedForecastMonth - 1).toLocaleString('en-US', { month: 'long' });
                        return (
                          <div className="bg-rose-50/20 border border-rose-100/70 rounded-2xl p-4 mt-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                                {monthFull} Vibration
                              </span>
                              <span className="text-xs font-extrabold bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full">
                                Personal Month {reduceToSingleDigit(result.personalYear + selectedForecastMonth)}
                              </span>
                            </div>
                            <h5 className="font-extrabold text-rose-955 text-sm mb-1">{mData.title}</h5>
                            <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                              <strong>Primary Focus:</strong> {mData.focus}
                            </p>
                            <p className="text-xs text-slate-650 leading-relaxed bg-white/50 p-3 rounded-xl border border-rose-100/20 font-medium">
                              <strong>Actionable Advice:</strong> {mData.advice}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  {/* Lo Shu Grid Life Domain Analytics */}
                  <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-rose-955 border-b border-rose-100 pb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-rose-600" /> Lo Shu Life Domain Analytics
                    </h3>

                    {result.domainAnalytics ? (
                      <div className="space-y-6">

                        {/* Marriage & Money Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          {/* Marriage Card */}
                          <div className="p-5 rounded-2xl border border-rose-100 bg-rose-50/5 flex flex-col justify-between space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2.5">
                                <div className="p-2 bg-pink-100 text-pink-700 rounded-xl">
                                  <Heart className="w-5 h-5" />
                                </div>
                                <h4 className="font-extrabold text-rose-955 text-base md:text-lg">Marriage & Relationship</h4>
                              </div>
                              <span className={`text-xs md:text-sm font-black px-3 py-1 rounded-full uppercase tracking-wider ${result.domainAnalytics.marriage.score >= 80 ? "bg-green-100 text-green-800" :
                                result.domainAnalytics.marriage.score >= 60 ? "bg-yellow-100 text-yellow-800" :
                                  "bg-orange-100 text-orange-800"
                                }`}>
                                {result.domainAnalytics.marriage.score}%
                              </span>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Status: {result.domainAnalytics.marriage.status}</p>
                              <p className="text-sm text-slate-600 leading-relaxed">{result.domainAnalytics.marriage.analysis}</p>
                            </div>
                            <div className="bg-pink-50/50 text-slate-800 p-3 rounded-xl border border-pink-100 text-sm">
                              <span className="font-bold text-pink-900 block mb-0.5">🌸 Relationship Remedies:</span>
                              {result.domainAnalytics.marriage.remedies}
                            </div>
                          </div>

                          {/* Money Card */}
                          <div className="p-5 rounded-2xl border border-rose-100 bg-rose-50/5 flex flex-col justify-between space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2.5">
                                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                                  <Coins className="w-5 h-5" />
                                </div>
                                <h4 className="font-extrabold text-rose-955 text-base md:text-lg">Wealth & Assets</h4>
                              </div>
                              <span className={`text-xs md:text-sm font-black px-3 py-1 rounded-full uppercase tracking-wider ${result.domainAnalytics.money.score >= 80 ? "bg-green-100 text-green-800" :
                                result.domainAnalytics.money.score >= 50 ? "bg-yellow-100 text-yellow-800" :
                                  "bg-orange-100 text-orange-800"
                                }`}>
                                {result.domainAnalytics.money.score}%
                              </span>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Status: {result.domainAnalytics.money.status}</p>
                              <p className="text-sm text-slate-600 leading-relaxed">{result.domainAnalytics.money.analysis}</p>
                            </div>
                            <div className="bg-emerald-50/50 text-slate-800 p-3 rounded-xl border border-emerald-100 text-sm">
                              <span className="font-bold text-emerald-900 block mb-0.5">💰 Wealth Remedies:</span>
                              {result.domainAnalytics.money.remedies}
                            </div>
                          </div>

                        </div>

                        {/* Child Birth, Career & Gov Job Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                          {/* Child Birth Card */}
                          <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/5 flex flex-col justify-between space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                                  <Baby className="w-4 h-4" />
                                </div>
                                <h4 className="font-extrabold text-rose-955 text-sm md:text-base">Child Birth</h4>
                              </div>
                              <span className="text-xs font-black text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full">{result.domainAnalytics.child_birth.score}%</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">{result.domainAnalytics.child_birth.analysis}</p>
                            <div className="bg-blue-50/50 text-slate-700 p-2.5 rounded-xl border border-blue-100 text-xs md:text-sm leading-snug">
                              <span className="font-bold text-blue-900 block mb-0.5">🍼 Progeny Remedy:</span>
                              {result.domainAnalytics.child_birth.remedies}
                            </div>
                          </div>

                          {/* Career Card */}
                          <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/5 flex flex-col justify-between space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                                  <Briefcase className="w-4 h-4" />
                                </div>
                                <h4 className="font-extrabold text-rose-955 text-sm md:text-base">Career & Success</h4>
                              </div>
                              <span className="text-xs font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">{result.domainAnalytics.career.score}%</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">{result.domainAnalytics.career.analysis}</p>
                            <div className="bg-amber-50/50 text-slate-700 p-2.5 rounded-xl border border-amber-100 text-xs md:text-sm leading-snug">
                              <span className="font-bold text-amber-900 block mb-0.5">💼 Career Remedy:</span>
                              {result.domainAnalytics.career.remedies}
                            </div>
                          </div>

                          {/* Gov Job Card */}
                          <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/5 flex flex-col justify-between space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                                  <Landmark className="w-4 h-4" />
                                </div>
                                <h4 className="font-extrabold text-rose-955 text-sm md:text-base">Government Job</h4>
                              </div>
                              <span className="text-xs font-black text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full">{result.domainAnalytics.government_job.score}%</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">{result.domainAnalytics.government_job.analysis}</p>
                            <div className="bg-purple-50/50 text-slate-700 p-2.5 rounded-xl border border-purple-100 text-xs md:text-sm leading-snug">
                              <span className="font-bold text-purple-900 block mb-0.5">🏛️ Exam Remedy:</span>
                              {result.domainAnalytics.government_job.remedies}
                            </div>
                          </div>

                        </div>

                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">Loading domain analytics details...</p>
                    )}
                  </div>

                  {/* Remedies & Lucky Factors */}
                  <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-black text-rose-955 border-b border-rose-100 pb-3 mb-4 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-rose-600" /> Vedic Remedies & Auspicious Energies
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-3">
                        <div>
                          <span className="font-bold text-rose-900">Lucky Colors: </span>
                          <span className="text-slate-600">{result.mulankDetails.colors.join(", ")}</span>
                        </div>
                        <div>
                          <span className="font-bold text-rose-900">Lucky Directions: </span>
                          <span className="text-slate-600">{result.mulankDetails.lucky_directions.join(", ")}</span>
                        </div>
                        <div>
                          <span className="font-bold text-rose-900">Auspicious Gemstone: </span>
                          <span className="text-slate-600">{result.mulankDetails.gemstone}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="font-bold text-rose-900">Friendly Numbers: </span>
                          <span className="text-slate-600">{result.mulankDetails.friendly_numbers.join(", ")}</span>
                        </div>
                        <div>
                          <span className="font-bold text-rose-900">Numbers to Avoid: </span>
                          <span className="text-slate-600">{result.mulankDetails.enemy_numbers.join(", ")}</span>
                        </div>
                        <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                          <span className="block font-bold text-rose-950 text-xs mb-1 uppercase tracking-wider">Auspicious Beej Mantra:</span>
                          <span className="font-semibold text-rose-800 text-xs italic">"{result.mulankDetails.mantra}"</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Lucky Matrix */}
                <div className="space-y-6">

                  {/* Lucky Match Matrix */}
                  <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-lg font-black text-rose-955 text-center w-full">Lucky Match Matrix</h3>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider text-center">Best Calendar Dates of the Month</p>
                    <div className="space-y-3.5 text-xs">
                      <div className="p-3 bg-green-50/60 border border-green-100 rounded-2xl">
                        <span className="block font-extrabold text-green-800 mb-1">🌟 Super Lucky Dates</span>
                        <span className="text-slate-700 font-bold">{result.luckyDates.super_lucky.join(", ")}</span>
                      </div>
                      <div className="p-3 bg-yellow-50/60 border border-yellow-100 rounded-2xl">
                        <span className="block font-extrabold text-yellow-800 mb-1">⚖️ Neutral Dates</span>
                        <span className="text-slate-700 font-bold">{result.luckyDates.neutral.join(", ")}</span>
                      </div>
                      <div className="p-3 bg-orange-50/60 border border-orange-100 rounded-2xl">
                        <span className="block font-extrabold text-orange-800 mb-1">⚠️ Dates to Avoid</span>
                        <span className="text-slate-700 font-bold">{result.luckyDates.avoid.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button to test another */}
                  <button
                    onClick={resetForm}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-rose-600/20"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Analyze Another Profile</span>
                  </button>

                </div>

              </div>
            )}
            {activeTab === "correction" && renderNameCorrectionPanel()}
            {activeTab === "compatibility" && renderMarriageCompatibilityPanel()}
            {activeTab === "vastu" && renderVastuOverlayPanel()}
          </div>
        )}

      </div>
    </div>
  );
}
