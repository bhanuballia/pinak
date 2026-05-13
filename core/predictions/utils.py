# core/predictions/utils.py

def get_dasha_lord_for_year(year, dasha):

    for period in dasha.get("list", []):
        if "/" in period["start_date"]:
            start = int(period["start_date"].split("/")[-1])
            end = int(period["end_date"].split("/")[-1])
        else:
            start = int(period["start_date"][:4])
            end = int(period["end_date"][:4])

        if start <= year <= end:
            return period["lord"]

    return dasha.get("current", {}).get("lord")
