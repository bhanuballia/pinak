// frontend/components/MuhuratPanel.jsx
import React from 'react';

export default function MuhuratPanel({ title = 'Marriage Muhurat Panel', status = 'Guarded', score = 65 }) {
  return (
    <div style={{
      background: '#0d0d1e',
      border: '1px solid #2e2e5c',
      borderRadius: '20px',
      padding: '24px',
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#ff007f' }}>{title}</h3>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        backgroundColor: 'rgba(255, 0, 127, 0.05)',
        border: '1px solid rgba(255, 0, 127, 0.2)',
        borderRadius: '12px'
      }}>
        <div>
          <div style={{ fontSize: '13px', color: '#c0c0d5' }}>Status</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{status}</div>
        </div>
        <div>
          <div style={{ fontSize: '13px', color: '#c0c0d5' }}>Score</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00f3ff' }}>{score}%</div>
        </div>
      </div>
    </div>
  );
}
