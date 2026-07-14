// frontend/services/astrologyApi.js

const BASE_URL = '/api/astrology';

export const astrologyApi = {
  async fetchPlanetaryPositions(date, time, tzOffset) {
    const response = await fetch(`${BASE_URL}/positions?date=${date}&time=${time}&tz_offset=${tzOffset}`);
    if (!response.ok) throw new Error('Failed to fetch positions');
    return response.json();
  },

  async fetchAyanamsa(jd) {
    const response = await fetch(`${BASE_URL}/ayanamsa?jd=${jd}`);
    if (!response.ok) throw new Error('Failed to fetch ayanamsa offset');
    return response.json();
  }
};
