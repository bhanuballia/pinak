# nakshatra_advanced/heatmaps/energy_renderer.py

def render_energy_flow(matrix):
    """
    Stub rendering a visual/text summary of the flow matrix.
    """
    return f"Energy Flow Index: {matrix.sum() if hasattr(matrix, 'sum') else 0.0}"
