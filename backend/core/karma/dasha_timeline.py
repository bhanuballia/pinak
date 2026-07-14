def build_yearly_dasha_map(dasha):

    mapping = {}

    for period in dasha.get("list", []):
        lord = period["lord"]
        start = int(period["start_date"].split("/")[-1]) if "/" in period["start_date"] else int(period["start_date"][:4])
        end   = int(period["end_date"].split("/")[-1]) if "/" in period["end_date"] else int(period["end_date"][:4])

        for y in range(start, end + 1):
            mapping[y] = lord

    return mapping
