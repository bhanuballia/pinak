# core/astrology/divisional/base/varga_result.py

def build_varga_result(sign_index, sign_name, division_part, degree_inside):
    """
    Standardized result structure for all divisional charts.
    Includes Issue 2: Degree reconstruction (varga_longitude).
    """
    return {
        "sign_index": sign_index,
        "sign_name": sign_name,
        "division_part": division_part,
        "degree": round(degree_inside, 4),
        "varga_longitude": round(
            (sign_index * 30.0) + degree_inside,
            4
        )
    }
