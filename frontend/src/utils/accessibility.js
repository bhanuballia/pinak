// frontend/src/utils/accessibility.js

/**
 * Generate an ARIA label string for a planet strength entry.
 *
 * @param {string} name       - Planet name (e.g. "Jupiter")
 * @param {number} score      - Normalized strength score (0–10)
 * @param {number} threshold  - Minimum required score for this planet
 * @returns {string}
 */
export function ariaPlanetLabel(

    name,
    score,
    threshold

) {

    const status = score >= threshold
        ? "above minimum threshold"
        : "below minimum threshold";

    return (

        `${name} has ` +

        `strength score ${score}. ` +

        `Required threshold ` +

        `${threshold}. ` +

        `Status: ${status}.`
    );
}

/**
 * Generate a short ARIA description for a strength bar.
 *
 * @param {number} value  - Current value (0–10)
 * @param {number} max    - Maximum value (default 10)
 * @returns {string}
 */
export function ariaBarLabel(value, max = 10) {
    const pct = Math.round((value / max) * 100);
    return `${pct} percent strength`;
}
