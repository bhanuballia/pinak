from core.destiny_matrix.destiny_context import build_destiny_context
from core.destiny_matrix.matrix_rules import build_year_matrix
from core.destiny_matrix.peak_detector import detect_peaks


def run_destiny_matrix(report_data, start=2025, end=2035):

    ctx = build_destiny_context(report_data)

    matrix = []

    for year in range(start, end + 1):
        matrix.append(build_year_matrix(year, ctx))

    peaks = detect_peaks(report_data.get("timeline", []))

    return {
        "matrix": matrix,
        "peaks": peaks
    }
