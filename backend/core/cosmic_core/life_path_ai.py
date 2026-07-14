def build_life_path(soul, astral, quantum):

    path = {}

    if soul["soul_index"] > 0.65:
        path["direction"] = "Guiding Others"

    elif astral.get("career_matrix",{}).get("career_index",0) > 0.6:
        path["direction"] = "Material Achievement"

    else:
        path["direction"] = "Self Discovery"

    path["growth_cycles"] = quantum.get("life_cycles",[])

    return path
