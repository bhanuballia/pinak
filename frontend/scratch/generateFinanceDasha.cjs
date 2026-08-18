const fs = require('fs');

const planets = {
  Sun: { role: "government contracts, authority positions, and stable status", style: "steady and prestige-focused", type: "mixed" },
  Moon: { role: "liquid cash, fluctuating income, and emotionally driven purchases", style: "fluctuating and intuitive", type: "benefic" },
  Mars: { role: "real estate, quick gains, and aggressive risk-taking", style: "bold and competitive", type: "malefic" },
  Mercury: { role: "trading, business expansion, accounting, and intellectual assets", style: "logical and communicative", type: "benefic" },
  Jupiter: { role: "wealth accumulation, banking, luck, and expansive growth", style: "abundant and optimistic", type: "benefic" },
  Venus: { role: "luxury, arts, passive income, and material comforts", style: "diplomatic and comfort-focused", type: "benefic" },
  Saturn: { role: "hard work, delayed gains, structural investments, and frugality", style: "slow, disciplined, and restrictive", type: "malefic" },
  Rahu: { role: "sudden windfalls, foreign investments, speculation, and risky illusions", style: "chaotic, ambitious, and sudden", type: "malefic" },
  Ketu: { role: "financial detachment, sudden losses, spiritual spending, and letting go", style: "detached and unpredictable", type: "malefic" }
};

const planetKeys = Object.keys(planets);
const db = {};

for (const md of planetKeys) {
  db[md] = {};
  for (const ad of planetKeys) {
    const mdInfo = planets[md];
    const adInfo = planets[ad];
    
    let resolutionText = "";
    let settlementText = "";
    
    if (mdInfo.type === "malefic" && adInfo.type === "malefic") {
        resolutionText = `With both periods ruled by challenging energies, financial growth during this time can be severely restricted or fraught with sudden unexpected expenses. Expect ${adInfo.style} developments that require immense financial discipline.`;
        settlementText = `Speculation is extremely dangerous during this phase. Avoid taking on new heavy debts. It is best to stick to conservative investments and focus on preserving existing capital rather than aggressively expanding.`;
    } else if (mdInfo.type === "benefic" && adInfo.type === "benefic") {
        resolutionText = `This is highly favorable for significant wealth accumulation. The combined influence of these positive periods acts as a "blessing phase" bringing lucrative opportunities, promotions, or successful business ventures.`;
        settlementText = `Excellent period for expanding investments and enjoying the fruits of your labor. Safe expansion, buying assets, and long-term financial planning are highly favored.`;
    } else if (mdInfo.type === "malefic" && adInfo.type === "benefic") {
        resolutionText = `If your finances have been struggling or severely restricted during the earlier parts of ${md}'s Mahadasha, the arrival of ${ad} Antardasha often acts as a relieving phase where cash flow improves and stress decreases.`;
        settlementText = `Because ${ad} promotes ${ad === 'Jupiter' || ad === 'Venus' ? 'abundance and comfort' : 'smart trading'}, this sub-period is excellent for consolidating debts and finding new, steady sources of income to counteract ${md}'s influence.`;
    } else { 
        resolutionText = `While the overarching Mahadasha promotes growth, the ${ad} Antardasha introduces sudden financial friction. You may experience ${adInfo.style} expenses or market fluctuations that momentarily disrupt your financial peace.`;
        settlementText = `Previous investments might underperform, or new hidden expenses may arise. Stay vigilant with budgeting and avoid taking financial matters lightly during this sub-period.`;
    }

    if (md === 'Jupiter' && ad === 'Saturn') {
        db[md][ad] = [
            {
                title: "To understand how this phase operates, we must examine the opposing forces of these two financial heavyweights",
                content: "The Reality Check on Spending: Jupiter expands your confidence, often leading to aggressive investments, heavy borrowing, or expansive business scaling in the earlier parts of the Mahadasha. When Saturn’s Antardasha arrives, it halts this expansion. If your financial foundations are weak, Saturn will expose them through sudden cash-flow crunches.",
                links: []
            },
            {
                title: "Severe Delays in Gains",
                content: "Saturn slows down the flow of money. Expected increments, delayed payments from clients, returns on long-term investments, or ancestral property settlements will get stuck in bureaucratic or legal delays, causing mental anxiety.",
                links: [
                    { url: "https://astroindusoot.com/article/money-blockages-in-horoscope-astrological-reasons-and-remedies", text: "[1]" }
                ]
            },
            {
                title: "Burdensome Responsibilities",
                content: "Your expenses will likely shift from luxury and personal enjoyment to heavy, unavoidable duties. This includes paying off old debts, dealing with sudden tax audits, investing in long-term infrastructure, or funding family medical/elderly care.",
                links: []
            }
        ];
    } else {
        db[md][ad] = [
            {
                title: "The Financial Roles of the Planets",
                content: `${md} represents ${mdInfo.role}, while ${ad} introduces themes of ${adInfo.role}. When they combine, your wealth journey takes on a ${adInfo.style} undertone within the broader context of ${md}'s overarching financial cycle.`,
                links: []
            },
            {
                title: "Income & Wealth Accumulation",
                content: resolutionText,
                links: []
            },
            {
                title: "Strategic Advice & Investments",
                content: settlementText,
                links: []
            }
        ];
    }
  }
}

fs.writeFileSync('d:/Astro Consult-Vedic Astrology/Vedic Astrology/frontend/src/data/financeDashaCombinations.json', JSON.stringify(db, null, 2));
console.log('Successfully generated 81 Finance Dasha Combinations.');
