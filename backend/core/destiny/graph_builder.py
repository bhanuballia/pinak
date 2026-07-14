from .scoring_models import domain_multiplier

def build_destiny_graph(karma_timeline):

    graphs = {
        "career": [],
        "finance": [],
        "relationship": [],
        "health": [],
        "spiritual": []
    }

    for year_data in karma_timeline:

        year = year_data["year"]
        base = year_data["score"]

        for domain in graphs.keys():
            graphs[domain].append({
                "year": year,
                "value": round(base * domain_multiplier(domain),2)
            })

    return graphs
