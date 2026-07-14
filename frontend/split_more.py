import re

path = r'd:\vedic-astrology-app - 2 - okFinal - Deploy\frontend\src\components\KundaliReportView.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Split Basic Details and Planetary Positions
old_basic = '''          {/* Planetary Positions */}'''
new_basic = '''          </A4Page>
          <A4Page>
          {/* Planetary Positions */}'''
content = content.replace(old_basic, new_basic)

# Split Birth Chart and Detailed Analysis
old_d1 = '''          {/* Detailed Chart Analysis */}'''
new_d1 = '''          </A4Page>
          <A4Page>
          {/* Detailed Chart Analysis */}'''
content = content.replace(old_d1, new_d1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Further split fixed content')
