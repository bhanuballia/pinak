// frontend/pages/MarriageMuhurat.jsx
import React from 'react';
import MuhuratPanel from '../components/MuhuratPanel';

export default function MarriageMuhurat() {
  return (
    <div style={{
      background: '#04040c',
      minHeight: '100vh',
      color: '#fff',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h2 style={{ fontSize: '28px', color: '#ff007f', marginBottom: '8px' }}>Marriage Muhurat Selection Panel</h2>
      <p style={{ color: '#c0c0d5', fontSize: '15px', marginBottom: '32px' }}>
        Check auspicious compatibility timings based on combined Nakshatra Tara Bala rules.
      </p>
      
      <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <MuhuratPanel title="Bride & Groom Auspicious Sync Score" score={88} status="Excellent Compatibility" />
      </div>
    </div>
  );
}
