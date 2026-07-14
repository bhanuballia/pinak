from .probability_model import calculate_probabilities
from .timeline_simulator import simulate_timelines
from .event_forecaster import forecast_events
from .narrative_ai import generate_quantum_narrative
from .heatmap_engine import build_heatmap

# New Quantum Timeline Components
from .age_window_calculator import calculate_age_windows
from .transit_activation import apply_transit_activation
from .destiny_graph import build_destiny_graph


def run_quantum_engine(chart, dasha, strength, dosha, timeline):

    probabilities = calculate_probabilities(chart, strength, dosha)

    future_paths = simulate_timelines(timeline, probabilities)

    events = forecast_events(chart, dasha, probabilities)

    heatmap = build_heatmap(events)

    narrative = generate_quantum_narrative(
        probabilities,
        future_paths,
        events
    )

    return {
        "probabilities": probabilities,
        "future_paths": future_paths,
        "events": events,
        "heatmap": heatmap,
        "narrative": narrative
    }


def build_quantum_timeline(chart, dasha, dosha, strength):

    # Step 1 — Base age windows from Dasha
    windows = calculate_age_windows(dasha, strength)

    # Step 2 — Transit amplification
    windows = apply_transit_activation(windows, chart)

    # Step 3 — Destiny graph scoring
    destiny_graph = build_destiny_graph(windows, dosha, strength)

    return {
        "windows": windows,
        "destiny_graph": destiny_graph
    }
