import re

with open('frontend/src/components/KundaliReportView.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add print:break-inside-avoid to all chart wrappers
# D-charts usually use: bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center shadow-inner print:bg-white print:border-gray-300 print:shadow-none
text = re.sub(
    r'(<div className=\"[^\"]*?bg-amber-50[^\"]*?shadow-inner[^\"]*?print:shadow-none[^\"]*?)\"', 
    r'\1 print:break-inside-avoid\"', 
    text
)

# Shadbala, Vimsopaka, Gemstone containers usually have: bg-white min-h-[300px]
text = re.sub(
    r'(<div className=\"[^\"]*?bg-white[^\"]*?min-h-\[300px\][^\"]*?)\"', 
    r'\1 print:break-inside-avoid\"', 
    text
)

# Ashtakavarga
text = re.sub(
    r'(<div className=\"[^\"]*?w-full max-w-2xl mx-auto[^\"]*?border-amber-200[^\"]*?)\"', 
    r'\1 print:break-inside-avoid\"', 
    text
)

# LineChart wrapper
text = re.sub(
    r'(<div className=\"[^\"]*?bg-white[^\"]*?p-6 rounded-xl border border-slate-200[^\"]*?)\"', 
    r'\1 print:break-inside-avoid\"', 
    text
)

# Render planetary effects container
# <div className="space-y-6"> doesn't break, but the individual effect cards shouldn't break
text = re.sub(
    r'(<div className=\"bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm print:bg-white print:border-gray-300 print:shadow-none mb-6 print:mb-3)\"',
    r'\1 print:break-inside-avoid\"',
    text
)

with open('frontend/src/components/KundaliReportView.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

