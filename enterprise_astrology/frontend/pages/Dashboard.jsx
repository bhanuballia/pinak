// frontend/pages/Dashboard.jsx
import React from 'react';
import Heatmap from '../components/Heatmap';
import TimelineChart from '../components/TimelineChart';
import MuhuratPanel from '../components/MuhuratPanel';
import AlertStream from '../components/AlertStream';

export default function Dashboard() {
  return (
    <div style={{
      background: '#04040c',
      minHeight: '100vh',
      color: '#fff',
      padding: '40px',
      fontFamily: 'Outfit, Inter, sans-serif'
    }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{
          margin: 0,
          background: 'linear-gradient(90deg, #00f3ff, #ff007f)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '36px',
          fontWeight: 'bold'
        }}>
          Enterprise Astrology Intelligence Platform
        </h1>
        <p style={{ color: '#6b6bbf', margin: '8px 0 0 0', fontSize: '16px' }}>
          Classical astrometry and advanced predictive AI engine dashboard.
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <MuhuratPanel title="Active Dasha Muhurat Strength" score={82} status="Highly Auspicious" />
          <AlertStream />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <Heatmap />
          <TimelineChart />
        </div>
      </div>
    </div>
  );
}
