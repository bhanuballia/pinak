import React from 'react';

const DynamicVargaAnalysis = ({ data, cid }) => {
  const dynamicTextEn = data?.ai_text?.varga_explanations?.[cid]?.en;
  const dynamicTextHi = data?.ai_text?.varga_explanations?.[cid]?.hi;

  if (!dynamicTextEn && !dynamicTextHi) return null;

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-2xl shadow-lg border-2 border-white/20">🤖</div>
        <div>
          <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">Dynamic AI Assessment</h4>
          <div className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest mt-1">Deity & Vargottama Analysis</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
        <div className="absolute -top-4 -right-4 opacity-10 text-8xl">✨</div>

        {dynamicTextEn && (
          <div className="mb-4">
            <h5 className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-2 border-b border-indigo-200 pb-1">English</h5>
            <p className="text-slate-800 leading-relaxed font-serif">{dynamicTextEn}</p>
          </div>
        )}

        {dynamicTextHi && dynamicTextHi !== "अनुवाद उपलब्ध नहीं है।" && (
          <div>
            <h5 className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-2 border-b border-indigo-200 pb-1">हिंदी</h5>
            <p className="text-slate-800 leading-relaxed font-serif font-medium">{dynamicTextHi}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicVargaAnalysis;
