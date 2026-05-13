import cairosvg

try:
    cairosvg.svg2png(
        url="reports/images/rasi_chart.svg",
        write_to="reports/images/test_output.png"
    )
    print("PNG conversion successful!")
except Exception as e:
    print("PNG conversion FAILED:", e)
