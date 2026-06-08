// frontend/src/components/PlanetCard.jsx

import React from "react";
import { PLANETS } from "../constants/planets";
import { getCardColor } from "../utils/colors";
import { ariaPlanetLabel } from "../utils/accessibility";
import { get_threshold } from "../utils/thresholds";
import StrengthBar from "./StrengthBar";

/**
 * PlanetCard — displays a single planet's Shadbala strength summary.
 *
 * Props:
 *   planet  {object} - { name, score, threshold, breakdown }
 *     name      {string}  - Planet name key (e.g. "Jupiter")
 *     score     {number}  - Normalized Rupa score (0–10)
 *     threshold {number}  - Minimum required score
 *     breakdown {object}  - { sthana, dig, kala, cheshta, naisargika, drik }
 */
function PlanetCard({ planet }) {

    const { name, score, threshold = 5.0, breakdown = {} } = planet;

    const meta      = PLANETS[name] ?? { icon: "⭐", hindi: name, color: "#6366f1" };
    const cardColor = getCardColor(name);
    const isMet     = score >= threshold;
    const ariaLabel = ariaPlanetLabel(name, score, threshold);

    const statusColor = isMet ? "#16a34a" : "#dc2626";
    const statusText  = isMet ? "✓ Sufficient" : "✗ Weak";

    return (
        <div
            aria-label={ariaLabel}
            style={{
                background: cardColor.background,
                border: `1.5px solid ${isMet ? "#bbf7d0" : "#fecaca"}`,
                borderRadius: "14px",
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                cursor: "default"
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.10)";
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px", lineHeight: 1 }}>{meta.icon}</span>
                    <div>
                        <div style={{
                            fontWeight: 700,
                            fontSize: "14px",
                            color: cardColor.text
                        }}>
                            {name}
                        </div>
                        <div style={{
                            fontSize: "11px",
                            color: cardColor.text,
                            opacity: 0.7
                        }}>
                            {meta.hindi}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: "right" }}>
                    <div style={{
                        fontWeight: 800,
                        fontSize: "18px",
                        color: statusColor
                    }}>
                        {score.toFixed(2)}
                    </div>
                    <div style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: statusColor
                    }}>
                        {statusText}
                    </div>
                </div>
            </div>

            {/* Strength bar */}
            <StrengthBar
                value={score}
                max={10}
                color={meta.color}
                threshold={threshold}
                ariaLabel={`${name} strength bar`}
            />

            {/* Min threshold note */}
            <div style={{
                fontSize: "10px",
                color: cardColor.text,
                opacity: 0.6,
                display: "flex",
                justifyContent: "space-between"
            }}>
                <span>Min: {threshold} Rupas</span>
                <span>Score: {score.toFixed(2)} / 10</span>
            </div>

            {/* Breakdown (collapsed tooltip-style) */}
            {Object.keys(breakdown).length > 0 && (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "4px",
                    marginTop: "2px"
                }}>
                    {Object.entries(breakdown).map(([key, val]) => (
                        <div key={key} style={{
                            background: "rgba(0,0,0,0.04)",
                            borderRadius: "6px",
                            padding: "3px 6px",
                            textAlign: "center"
                        }}>
                            <div style={{ fontSize: "9px", opacity: 0.6, textTransform: "capitalize" }}>
                                {key}
                            </div>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: cardColor.text }}>
                                {typeof val === "number" ? val.toFixed(1) : val}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default React.memo(PlanetCard);
