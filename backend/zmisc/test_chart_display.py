"""
Test script to generate a PDF and verify Lagna Chart and Rashi Chart display
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from reports.pdf_generator import generate_report_from_birth

# Test data
test_data = {
    "date_str": "1990-01-15",
    "time_str": "14:30:00",
    "tz_offset": 5.5,
    "lat": 28.6139,
    "lon": 77.2090,
    "name": "Test User",
    "gender": "Male",
    "location_name": "New Delhi, India",
    "output_path": "test_chart_output.pdf",
    "theme": "gold",
    "style": "minimal",
    "language": "bilingual"
}

print("=" * 60)
print("GENERATING TEST PDF TO VERIFY CHART DISPLAY")
print("=" * 60)

try:
    report_data = generate_report_from_birth(**test_data)
    print("\n" + "=" * 60)
    print("PDF GENERATED SUCCESSFULLY!")
    print("=" * 60)
    print(f"Output file: {test_data['output_path']}")
    print("\nChart images generated:")
    chart_images = report_data.get("chart_images", {})
    for key, path in chart_images.items():
        exists = os.path.exists(path) if path else False
        print(f"  - {key}: {path} (exists: {exists})")
    
    print("\n" + "=" * 60)
    print("PLEASE CHECK THE PDF FILE:")
    print("=" * 60)
    print("1. Open: test_chart_output.pdf")
    print("2. Verify Lagna Chart displays:")
    print("   - Black and white diagram")
    print("   - Square-shaped chart with diamond inside")
    print("   - 12 houses labeled 1-12")
    print("   - Sign names in each house")
    print("   - Planet abbreviations (Su, Mo, Ma, etc.)")
    print("3. Verify Rashi Chart (D1) displays the same structure")
    print("=" * 60)
    
except Exception as e:
    print(f"\nERROR: {e}")
    import traceback
    traceback.print_exc()
