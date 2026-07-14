import re

path = r'd:\vedic-astrology-app - 2 - okFinal - Deploy\frontend\src\components\KundaliReportView.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Wrap the Cover Page
cover_start = '{/* Cover Page */}'
cover_end = '<p className="text-sm text-slate-600 mt-auto">Generated using Vedic Astrology Engine</p>\n        </div>'
new_cover_start = '{/* Cover Page */}\n        <A4Page>'
new_cover_end = '<p className="text-sm text-slate-600 mt-auto">Generated using Vedic Astrology Engine</p>\n        </div>\n        </A4Page>'
content = content.replace(cover_start, new_cover_start)
content = content.replace(cover_end, new_cover_end)

# 2. Modify Classic Cover Page
classic_cover_start = '{/* Classic Cover Page (Page 2) */}\n        {renderClassicCoverPage()}'
classic_cover_end = '{/* Classic Cover Page (Page 2) */}\n        <A4Page>\n        {renderClassicCoverPage()}\n        </A4Page>'
content = content.replace(classic_cover_start, classic_cover_end)

# 3. Modify the big chunk (let's just wrap the rest of the fixed elements in one A4Page)
fixed_content_start = '<div className="relative z-10">'
new_fixed_content_start = '<A4Page>\n        <div className="relative z-10 w-full">'
content = content.replace(fixed_content_start, new_fixed_content_start)

# The end of the fixed elements is right before Auspicious Factors
fixed_content_end = '{activeSections.auspicious_factors && (<>'
new_fixed_content_end = '</div>\n        </A4Page>\n\n        {activeSections.auspicious_factors && (<>'
content = content.replace(fixed_content_end, new_fixed_content_end)

# 4. Now, wrap EVERY activeSections block!
# We can do this with regex:
# Pattern: \{activeSections\.([a-zA-Z0-9_]+) && \(\<>\n
# Replacement: {activeSections.\1 && (<A4Page>\n
content = re.sub(r'\{activeSections\.([a-zA-Z0-9_]+) && \(\<>\n', r'{activeSections.\1 && (<A4Page>\n', content)

# And replace </>)} with </A4Page>)}
# We'll just replace all </>)} with </A4Page>)} since they only appear there.
content = content.replace('</>)}', '</A4Page>)}')

# We also need to add the pdf-generating CSS globally
css_addition = '''
      <style>{
        body {
          background-color: white !important;
        }
        .report-global-style :not(.section-heading):not(.section-heading *):not(button):not(button *):not(svg):not(svg *):not(select):not(option) {
          color: black !important;
        }
        .pdf-generating .a4-page {
          margin: 0 !important;
          box-shadow: none !important;
          border: none !important;
        }
      }</style>
'''
content = content.replace('<style>{\n        body {\n          background-color: white !important;\n        }\n        .report-global-style :not(.section-heading):not(.section-heading *):not(button):not(button *):not(svg):not(svg *):not(select):not(option) {\n          color: black !important;\n        }\n      }</style>', css_addition)


with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Wrapped blocks in A4Page')
