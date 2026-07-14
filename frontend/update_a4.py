import re

path = r'd:\vedic-astrology-app - 2 - okFinal - Deploy\frontend\src\components\KundaliReportView.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# We want to replace the main container:
# <div ref={reportRef} className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10 print:shadow-none print:break-inside-avoid print:p-0">
# with:
# <div ref={reportRef} className="mx-auto print:p-0 flex flex-col items-center gap-8 pb-10">
# And we need to add the A4Page component definition at the top.

# Then we need to wrap the Cover Page, Classic Cover Page, and all the activeSections blocks.

# Let's just create an A4Page component right after imports.
a4_comp = '''
const A4Page = ({ children }) => (
  <div className="a4-page w-[210mm] min-h-[297mm] bg-white mx-auto shadow-2xl border border-gray-200 relative overflow-hidden print:shadow-none print:border-none print:m-0 print:w-auto print:min-h-0 print:p-0 page-break-after" style={{ padding: '1in', boxSizing: 'border-box' }}>
    {children}
  </div>
);
'''

if 'const A4Page' not in content:
    content = content.replace('import { createReport } from \'../services/api\';', 'import { createReport } from \'../services/api\';\n' + a4_comp)

# Replace the outer container classes
old_container = '<div ref={reportRef} className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10 print:shadow-none print:break-inside-avoid print:p-0">'
new_container = '<div ref={reportRef} className={mx-auto flex flex-col items-center gap-8  print:p-0}>'
content = content.replace(old_container, new_container)

# Change global background
content = content.replace('<div className="report-global-style min-h-screen bg-white py-8 print:bg-white print:py-0">', '<div className="report-global-style min-h-screen bg-slate-200 py-8 print:bg-white print:py-0">')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated container structure')
