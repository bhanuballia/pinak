// frontend/src/utils/thresholds.js

/**
 * Minimum required Shadbala Rupa values per planet.
 * Based on classical texts (B.V. Raman / Phaladeepika).
 */
export const PLANET_THRESHOLDS = {
    Sun:     5.0,
    Moon:    6.0,
    Mars:    5.0,
    Mercury: 7.0,
    Jupiter: 6.5,
    Venus:   5.5,
    Saturn:  5.0,
    Rahu:    5.0,
    Ketu:    5.0,
};

/**
 * Get minimum required Rupa threshold for a planet.
 * @param {string} planet
 * @returns {number}
 */
export function get_threshold(planet) {
    return PLANET_THRESHOLDS[planet] ?? 5.0;
}
