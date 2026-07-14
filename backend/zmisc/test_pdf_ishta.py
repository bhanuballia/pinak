import sys; sys.path.insert(0, '.')
import os
from reports.report_data import assemble_report_data
from reports.pdf_generator import render_detailed_pdf

def test_full_pdf_generation():
    name = "Test User"
    date = "1990-05-15"
    time_str = "12:30:00"
    tz_offset = 5.5
    lat = 28.6139
    lon = 77.2090
    
    print(f"Assembling report data for {name}...")
    report_data = assemble_report_data(name, date, time_str, tz_offset, lat, lon)
    
    output_pdf = "test_ishta_report.pdf"
    if os.path.exists(output_pdf):
        os.remove(output_pdf)
        
    print(f"Rendering PDF to {output_pdf}...")
    try:
        render_detailed_pdf(report_data, output_pdf)
        print(f"Success! PDF generated at {output_pdf}")
        print(f"PDF size: {os.path.getsize(output_pdf)} bytes")
    except Exception as e:
        print(f"Error generating PDF: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_full_pdf_generation()
