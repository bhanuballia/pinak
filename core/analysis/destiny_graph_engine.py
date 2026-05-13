

from __future__ import annotations
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default


"""
ASTROCONSULT DESTINY GRAPH ENGINE ULTRA

Builds timeline curves using:
 - yearly predictions
 - probability matrix
 - dosha penalties
 - strength modifiers
"""

import os
import math


# ----------------------------------------------------------
# MAIN GRAPH BUILDER
# ----------------------------------------------------------
def build_destiny_graph(
    yearly_predictions,
    probability_matrix,
    strength,
    life_events=None,
    karma_sim=None,
    out_png="reports/images/destiny_graph.png",
):
    """
    Creates a multi-line destiny timeline graph.

    Output:
        destiny_graph.png
    """

    try:
        import matplotlib.pyplot as plt
    except ImportError:
        print("[DESTINY GRAPH] matplotlib missing")
        return None

    os.makedirs(os.path.dirname(out_png), exist_ok=True)

    years = []
    career_curve = []
    wealth_curve = []
    relationship_curve = []

    base_career = probability_matrix.get("career_growth", 60)
    base_wealth = probability_matrix.get("wealth_index", 60)
    base_marriage = probability_matrix.get("marriage_probability", 60)

    avg_strength = _get_strength(strength, "average", 60)

    for item in yearly_predictions:
        year = item.get("year")
        years.append(year)

        # --- Career curve ---
        career_score = base_career + _wave(year, avg_strength, amp=12)
        career_curve.append(_clamp(career_score))

        # --- Wealth curve ---
        wealth_score = base_wealth + _wave(year, avg_strength, amp=10)
        wealth_curve.append(_clamp(wealth_score))

        # --- Relationship curve ---
        rel_score = base_marriage + _wave(year, avg_strength, amp=8)
        relationship_curve.append(_clamp(rel_score))

    # --------------------------------------------------
    # DRAW GRAPH
    # --------------------------------------------------
    plt.figure(figsize=(10, 5))

    plt.plot(years, career_curve, label="Career Destiny")
    plt.plot(years, wealth_curve, label="Wealth Flow")
    plt.plot(years, relationship_curve, label="Relationship Harmony")

    # Draw Karma Simulation Paths
    if karma_sim:
        if "with_remedies" in karma_sim:
            k_years = [x["year"] for x in karma_sim["with_remedies"]]
            k_scores = [x["score"] for x in karma_sim["with_remedies"]]
            plt.plot(k_years, k_scores, linestyle="--", color="cyan", label="Remedy Path")

        if "high_effort_path" in karma_sim:
            e_years = [x["year"] for x in karma_sim["high_effort_path"]]
            e_scores = [x["score"] for x in karma_sim["high_effort_path"]]
            plt.plot(e_years, e_scores, linestyle=":", color="orange", label="High Effort Path")

    # Draw event markers
    if life_events:
        for ev in life_events:
            y = 85
            color = "purple"
            if ev["type"] == "career_peak":
                y = 90
                color = "green"
            elif ev["type"] == "wealth_peak":
                y = 80
                color = "gold"
            elif ev["type"] == "relationship_window":
                y = 70
                color = "pink"
            elif ev["type"] == "risk_period":
                y = 40
                color = "red"
            else:
                y = 60
                color = "purple"

            plt.scatter(ev["year"], y, color=color, zorder=5)
            plt.text(ev["year"], y + 2, ev["label"], fontsize=8, ha='center')

    plt.title("AstroConsult Destiny Graph (Timeline Engine)")
    plt.xlabel("Year")
    plt.ylabel("Probability Index")
    plt.ylim(0, 100)
    plt.legend()
    plt.grid(True)

    plt.savefig(out_png, dpi=150, bbox_inches="tight")
    plt.close()

    print("[DESTINY GRAPH] Generated:", out_png)

    return out_png


# ----------------------------------------------------------
# WAVE FUNCTION (COSMIC TIMELINE CURVE)
# ----------------------------------------------------------
def _wave(year, strength, amp=10):
    """
    Creates smooth sinusoidal variation.
    """
    return math.sin(year * 0.35) * amp + (strength - 60) * 0.2


def _clamp(val):
    return max(0, min(100, int(val)))
