// frontend/src/utils/colors.js

export const CARD_COLORS = {

    Sun: {
        background: "#fef2f2",
        text: "#991b1b"
    },

    Moon: {
        background: "#f8fafc",
        text: "#334155"
    },

    Mars: {
        background: "#fef2f2",
        text: "#7f1d1d"
    },

    Mercury: {
        background: "#ecfdf5",
        text: "#065f46"
    },

    Jupiter: {
        background: "#fffbeb",
        text: "#92400e"
    },

    Venus: {
        background: "#fdf2f8",
        text: "#9d174d"
    },

    Saturn: {
        background: "#eef2ff",
        text: "#312e81"
    },

    Rahu: {
        background: "#f0fdfa",
        text: "#134e4a"
    },

    Ketu: {
        background: "#fff7ed",
        text: "#7c2d12"
    }
};

/**
 * Returns the card color config for a given planet,
 * falling back to a neutral grey if not found.
 */
export function getCardColor(planet) {
    return CARD_COLORS[planet] ?? {
        background: "#f9fafb",
        text: "#374151"
    };
}
