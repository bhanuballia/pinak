// frontend/src/components/AccessibleTooltip.jsx

import React, { useState, useId } from "react";

/**
 * AccessibleTooltip — wraps children and shows a tooltip on hover/focus.
 *
 * Props:
 *   text     {string}      - Tooltip text content
 *   children {ReactNode}   - Trigger element(s)
 *   position {string}      - "top" | "bottom" | "left" | "right" (default "top")
 */
export default function AccessibleTooltip({
    text,
    children,
    position = "top"
}) {
    const [visible, setVisible] = useState(false);
    const tooltipId = useId();

    const positionStyles = {
        top: {
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)"
        },
        bottom: {
            top: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)"
        },
        left: {
            right: "calc(100% + 6px)",
            top: "50%",
            transform: "translateY(-50%)"
        },
        right: {
            left: "calc(100% + 6px)",
            top: "50%",
            transform: "translateY(-50%)"
        }
    };

    return (
        <div
            style={{ position: "relative", display: "inline-flex" }}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
        >
            {/* Trigger */}
            <div
                aria-describedby={tooltipId}
                tabIndex={0}
                style={{ outline: "none" }}
            >
                {children}
            </div>

            {/* Tooltip bubble */}
            {visible && (
                <div
                    id={tooltipId}
                    role="tooltip"
                    style={{
                        position: "absolute",
                        zIndex: 9999,
                        background: "rgba(15, 23, 42, 0.93)",
                        color: "#f8fafc",
                        fontSize: "11px",
                        lineHeight: 1.4,
                        padding: "5px 10px",
                        borderRadius: "7px",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                        animation: "fadeInTooltip 0.15s ease",
                        ...positionStyles[position]
                    }}
                >
                    {text}
                </div>
            )}

            <style>{`
                @keyframes fadeInTooltip {
                    from { opacity: 0; transform: translateX(-50%) translateY(4px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>
        </div>
    );
}
