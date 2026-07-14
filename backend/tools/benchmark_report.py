import os
import sys
import time

# Add root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from reports.pdf_generator import render_detailed_pdf
from reports.report_data import assemble_report_data
from astronomy.ephemeris import initialize_ephemeris

def benchmark_report():
    print("Starting 120-page benchmark...")
    
    # Initialize ephemeris
    initialize_ephemeris()
    
    # Test data
    name = "Benchmark User"
    date = "1990-01-01"
    time_str = "12:00"
    lat = 28.6139  # Delhi
    lon = 77.2090
    tz = 5.5
    
    print("Assembling data (this may take a moment due to 50 Oracle questions)...")
    start_time = time.time()
    data = assemble_report_data(
        name=name,
        date=date,
        time=time_str,
        tz_offset=tz,
        lat=lat,
        lon=lon,
        location_name="Delhi, India"
    )
    data_time = time.time() - start_time
    print(f"Data assembly complete in {data_time:.2f} seconds.")
    
    output_path = "reports/benchmark_report_p2.pdf"
    print(f"Rendering PDF to {output_path}...")
    
    start_time = time.time()
    render_detailed_pdf(data, output_path)
    render_time = time.time() - start_time
    print(f"PDF rendering complete in {render_time:.2f} seconds.")
    
    if os.path.exists(output_path):
        size = os.path.getsize(output_path) / (1024 * 1024)
        print(f"Report generated successfully! Size: {size:.2f} MB")
        print(f"Path: {os.path.abspath(output_path)}")
        
        # Try to count pages if PyPDF2 is available, otherwise user will check manually
        try:
            from PyPDF2 import PdfReader
            reader = PdfReader(output_path)
            if reader.is_encrypted:
                reader.decrypt("bhanu123")
            print(f"FINAL PAGE COUNT: {len(reader.pages)}")
        except ImportError:
            print("PyPDF2 not found. Please check the page count manually in the generated PDF.")
        except Exception as e:
            print(f"Error reading PDF: {e}")

    else:
        print("Error: PDF was not generated.")

if __name__ == "__main__":
    benchmark_report()
