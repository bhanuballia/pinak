def build_event_heatmap(marriage, career, karma):

    heatmap = {
        "marriage_peak": marriage["score"],
        "career_peak": career["career_index"],
        "karma_events": len(karma)
    }

    return heatmap
