import re

path = r'd:\vedic-astrology-app - 2 - okFinal - Deploy\frontend\src\components\KundaliReportView.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace the opening <A4Page> of the big block:
#         <A4Page>
#         <div className="relative z-10 w-full">
# 
#           {/* Basic Details */}

old_chunk_start = '''        <A4Page>
        <div className="relative z-10 w-full">

          {/* Basic Details */}'''

new_chunk_start = '''        <div className="relative z-10 w-full">

          <A4Page>
          {/* Basic Details */}'''
content = content.replace(old_chunk_start, new_chunk_start)

# Now inject </A4Page><A4Page> between sections.
# Sections:
# 1. Planetary Positions -> group with Basic Details or separate? Let's keep them together.
# 2. Birth Chart
content = content.replace('          {/* D1 Chart */}', '          </A4Page>\n          <A4Page>\n          {/* D1 Chart */}')

# 3. Chart Analysis & Life Predictions
content = content.replace('          {/* Chart Analysis & Predictions */}', '          </A4Page>\n          <A4Page>\n          {/* Chart Analysis & Predictions */}')

# 4. Strengths
content = content.replace('          {/* Strengths */}', '          </A4Page>\n          <A4Page>\n          {/* Strengths */}')

# 5. Vimshottari Dasha Life Timeline
content = content.replace('          {/* Vimshottari Dasha Life Timeline */}', '          </A4Page>\n          <A4Page>\n          {/* Vimshottari Dasha Life Timeline */}')

# The end of the block:
#           </div>
#         </A4Page>
#         {activeSections.auspicious_factors && (<A4Page>
old_chunk_end = '''          </div>
        </A4Page>'''

new_chunk_end = '''          </A4Page>
        </div>'''
content = content.replace(old_chunk_end, new_chunk_end)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Split fixed content into separate A4 Pages.')
