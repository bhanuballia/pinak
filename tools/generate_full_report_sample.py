# tools/generate_full_report_sample.py
from reports.pdf_generator import generate_report_from_birth
# Ballia example
out = generate_report_from_birth("1987-04-02", "13:40", 5.5, 25.758503, 84.148911, style="premium", output_path="ballia_premium_demo.pdf", name="Sample Person")
print("Wrote:", out)

