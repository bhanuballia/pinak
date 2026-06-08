with open('frontend/src/components/KundaliReportView.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the accidental backslash quote
text = text.replace('print:break-inside-avoid\\"', 'print:break-inside-avoid"')

with open('frontend/src/components/KundaliReportView.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
