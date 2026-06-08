// frontend/services/predictionApi.js

const BASE_URL = '/api/prediction';

export const predictionApi = {
  async calculateProbability(dashaScore, transitScore, divisionalSupport) {
    const response = await fetch(`${BASE_URL}/calculate-probability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dasha_score: dashaScore, transit_score: transitScore, divisional_support: divisionalSupport })
    });
    if (!response.ok) throw new Error('Probability score failed');
    return response.json();
  },

  async forecastTimeline(natalChart, transits) {
    const response = await fetch(`${BASE_URL}/forecast-timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ natal_chart: natalChart, transits: transits })
    });
    if (!response.ok) throw new Error('Timeline forecast failed');
    return response.json();
  }
};
