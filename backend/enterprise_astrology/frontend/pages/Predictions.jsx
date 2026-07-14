// frontend/pages/Predictions.jsx
import React from 'react';
import TimelineChart from '../components/TimelineChart';

export default function Predictions() {
  return (
    <div style={{
      background: '#04040c',
      minHeight: '100vh',
      color: '#fff',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h2 style={{ fontSize: '28px', color: '#ffb300', marginBottom: '8px' }}>AI Predictive Transits</h2>
      <p style={{ color: '#c0c0d5', fontSize: '15px', marginBottom: '32px' }}>
        Neural alignment predictors outlining events and impact scores based on active dasha structures.
      </p>
      
      <div style={{ maxWidth: '700px' }}>
        <TimelineChart />
      </div>
    </div>
  );
}
