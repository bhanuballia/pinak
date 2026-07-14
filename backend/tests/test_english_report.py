from reports.pdf_generator import generate_report_from_birth
import os

def test_english_only_report():
    output_path = "tests/test_english_report.pdf"
    if os.path.exists(output_path):
        os.remove(output_path)
        
    print("Generating English-only report...")
    try:
        generate_report_from_birth(
            date_str="1990-01-01",
            time_str="12:00:00",
            tz_offset=5.5,
            lat=28.6139,
            lon=77.2090,
            language="english",
            output_path=output_path,
            name="Test User"
        )
        print(f"Success! Report generated at {output_path}")
        
        # Check file size
        size = os.path.getsize(output_path)
        print(f"PDF Size: {size} bytes")
        
    except Exception as e:
        print(f"Failed to generate report: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_english_only_report()
