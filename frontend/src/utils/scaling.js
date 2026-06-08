// frontend/src/utils/scaling.js

/**
 * Normalize a value to a 0–100 percentage for display purposes.
 *
 * @param {number} value  - Raw value to normalize
 * @param {number} max    - Maximum possible value (default 10)
 * @returns {number}      - Clamped percentage 0–100
 */
export function normalize(

    value,
    max = 10

) {

    if (!max || max === 0) return 0;

    return Math.min(

        (value / max) * 100,

        100
    );
}

/**
 * Map a 0–10 Rupa score to a bar width percentage string.
 *
 * @param {number} score - Rupa score (0–10)
 * @returns {string}     - e.g. "73.50%"
 */
export function rupaToPercent(score) {
    return `${normalize(score, 10).toFixed(2)}%`;
}
