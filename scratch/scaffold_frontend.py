import os

base_dir = r"d:\vedic-astrology-app - 2 - okFinal - Deploy\frontend\src\components\relationship"
os.makedirs(base_dir, exist_ok=True)

components = [
    "MarriageDashboard",
    "CompatibilityMeter",
    "GunaMilanPanel",
    "EmotionalCompatibility",
    "MarriageTimeline",
    "KPActivationPanel",
    "MuhuratSelector",
    "SynastryOverlay",
    "DivorceRiskPanel",
    "ChildbirthPanel",
    "RelationshipHeatmap",
    "AIInsightCard"
]

template = """import React from 'react';

const {name} = ({{ report }}) => {{
  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-4">
      <h4 className="text-xs font-black uppercase text-indigo-300 mb-2">{name}</h4>
      <p className="text-sm text-slate-400">Placeholder for {name} component.</p>
    </div>
  );
}};

export default {name};
"""

for comp in components:
    with open(os.path.join(base_dir, f"{comp}.jsx"), "w", encoding="utf-8") as f:
        f.write(template.format(name=comp))

print("Frontend components scaffolded successfully.")
