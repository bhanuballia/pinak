// frontend/components/TimelineChart.jsx
import React from 'react';

export default function TimelineChart({ nodes = [] }) {
  const dummyNodes = nodes.length > 0 ? nodes : [
    { timestamp: '2026-06-01', title: 'Saturn conjunct Natal Moon', weight: 85 },
    { timestamp: '2026-06-15', title: 'Jupiter transit 5th house', weight: 95 },
    { timestamp: '2026-07-02', title: 'Mars opposition Saturn', weight: 70 }
  ];

  return (
    <div style={{
      background: '#0d0d1e',
      border: '1px solid #2e2e5c',
      borderRadius: '20px',
      padding: '24px',
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#ffb300' }}>AI Forecast Timeline Chart</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: '15px',
          top: '8px',
          bottom: '8px',
          width: '2px',
          backgroundColor: '#2e2e5c'
        }} />
        {dummyNodes.map((n, i) => (
          <div key={i} style={{ display: 'flex', gap: '16px', zIndex: 2 }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#1e1e38',
              border: `2px solid ${n.weight > 80 ? '#ff007f' : '#00f3ff'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '11px'
            }}>
              {n.weight}
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b6bbf', fontWeight: 'bold' }}>{n.timestamp}</div>
              <div style={{ fontSize: '14px', color: '#fff', fontWeight: 'bold' }}>{n.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
