// frontend/src/components/StrengthBar.jsx

import React from "react";
import { normalize } from "../utils/scaling";

/**
 * Accessible horizontal strength bar (progress bar).
 *
 * Props:
 *   value     {number}  - Current strength value (0–10 Rupas)
 *   max       {number}  - Maximum value (default 10)
 *   color     {string}  - Fill color (hex/rgb/css var)
 *   threshold {number}  - Minimum required value; triggers red fill if unmet
 *   ariaLabel {string}  - ARIA label for screen readers
 *   animate   {boolean} - Whether to animate the fill on mount
 */
export default function StrengthBar({
    value,
    max = 10,
    color,
    threshold = 0,
    ariaLabel,
    animate = true
}) {
    const pct   = normalize(value, max);
    const isMet = value >= threshold;

    // Use red for unmet threshold, green for met, fall back to prop color
    const fillColor = color ?? (isMet ? "#22c55e" : "#ef4444");

    return (
        <div
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={ariaLabel}
            style={{
                width: "100%",
                height: "10px",
                borderRadius: "999px",
                background: "#e5e7eb",
                overflow: "hidden",
                position: "relative"
            }}
        >
            <div
                style={{
                    height: "100%",
                    width: `${pct}%`,
                    borderRadius: "999px",
                    background: fillColor,
                    transition: animate
                        ? "width 0.7s cubic-bezier(0.4, 0, 0.2, 1)"
                        : "none",
                    boxShadow: isMet
                        ? `0 0 6px 1px ${fillColor}55`
                        : "none"
                }}
            />
        </div>
    );
}
