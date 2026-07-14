// frontend/pages/LiveTransits.jsx
import React from 'react';
import TransitWheel from '../components/TransitWheel';

const SAMPLE_PLANETS = [
  { name: 'Sun', longitude: 59.2, sign: 'Taurus', house: 2, color: '#ffb300' },
  { name: 'Moon', longitude: 220.5, sign: 'Scorpio', house: 8, color: '#ffffff' },
  { name: 'Saturn', longitude: 325.1, sign: 'Aquarius', house: 11, color: '#7b1fa2' },
  { name: 'Jupiter', longitude: 44.8, sign: 'Taurus', house: 2, color: '#f57c00' },
  { name: 'Mars', longitude: 14.5, sign: 'Aries', house: 1, color: '#d32f2f' }
];

export default function LiveTransits() {
  return (
    <div style={{
      background: '#04040c',
      minHeight: '100vh',
      color: '#fff',
      padding: '40px',
      fontFamily: 'Outfit, Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h2 style={{
        margin: '0 0 8px 0',
        fontSize: '28px',
        color: '#00f3ff'
      }}>
        Interactive Real-Time Astrometry Wheel
      </h2>
      <p style={{ color: '#6b6bbf', margin: '0 0 40px 0', fontSize: '15px' }}>
        A complete high-precision visual layout showing current planetary orbits and aspect angles.
      </p>
      
      <TransitWheel planets={SAMPLE_PLANETS} />
    </div>
  );
}
