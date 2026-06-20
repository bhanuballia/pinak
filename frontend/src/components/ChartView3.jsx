import React from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import ZodiacChart from "./ZodiacChart";

export default function ChartView3({ data }) {
    if (!data) return null;

    const birthDataString = `${data.meta?.name || "Native"}   |   DOB: ${data.meta?.date || data.meta?.dob || ""}   |   TOB: ${data.meta?.time || data.meta?.tob || ""}   |   LOC: ${data.meta?.location || data.meta?.loc || ""}`;

    const getHouses = (chart) => {
        if (chart === 'd1') return data.charts?.houses || data.charts?.D1?.houses;
        return data.vargas?.[chart]?.houses || data.charts?.[chart.toUpperCase()]?.houses;
    };

    const chartsToRender = [
        { id: 'd1', title: 'Birth Chart' },
        { id: 'd9', title: 'D9 Navamsha' },
        { id: 'd10', title: 'D10 Dashamsha' },
        { id: 'd60', title: 'D60 Shashtiamsha' },
        { id: 'd27', title: 'D27 Nakshatramsha' },
        { id: 'd7', title: 'D7 Saptamsha' },
        { id: 'd45', title: 'D45 Akshavedamsha' },
        { id: 'd3', title: 'D3 Dreshkana' },
        { id: 'd24', title: 'D24 Chaturvimshamsha' },
    ];


    const handleExportPDF = async () => {
        const element = document.getElementById('pdf-classic-content');
        if (!element) return;
        try {
            const canvas = await html2canvas(element, { scale: 1.5, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4'); // landscape
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('ChartView3.pdf');
        } catch (error) {
            console.error("PDF Export failed:", error);
            alert("Failed to export PDF.");
        }
    };

    return (
        <div id="pdf-classic-content" className="min-h-screen w-full bg-[#fff0d6] font-serif p-2 flex flex-col overflow-y-auto text-slate-800">
            <button onClick={handleExportPDF} className="absolute top-2 right-2 z-[100] bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[12px] font-black uppercase shadow-lg border border-emerald-500/30 transition-all cursor-pointer">Export PDF</button>
            {/* Header */}
            <div className="flex justify-between items-end border-b-2 border-indigo-900/80 pb-1 mb-2 px-2 text-[11px] font-black uppercase tracking-wider text-indigo-950 shrink-0">
                <span>{birthDataString}</span>
                <span>Astro Consult - Chart View 3</span>
            </div>

            <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-2 pb-2 min-h-[900px]">
                {chartsToRender.map((chart) => (
                    <div key={chart.id} className="bg-[#fbf9f1] border-2 border-indigo-900/30 rounded-lg relative p-1 flex flex-col shadow-sm overflow-hidden h-full">
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 flex items-center justify-center p-0">
                                <ZodiacChart houses={getHouses(chart.id)} variant="legacy" defaultRect={true} scaleText={1.8} title={chart.title} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
