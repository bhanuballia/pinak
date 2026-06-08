// frontend/components/Heatmap.jsx
import React from 'react';

export default function Heatmap({ data = [] }) {
  return (
    <div style={{
      background: '#0d0d1e',
      border: '1px solid #2e2e5c',
      borderRadius: '20px',
      padding: '24px',
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#00f3ff' }}>Energy Activation Heatmap</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4px' }}>
        {Array.from({ length: 144 }).map((_, idx) => {
          const val = Math.random();
          let color = '#2e2e5c';
          if (val > 0.8) color = '#ff007f';
          else if (val > 0.5) color = '#00f3ff';
          else if (val > 0.3) color = '#6b6bbf';

          return (
            <div
              key={idx}
              style={{
                width: '100%',
                paddingBottom: '100%',
                backgroundColor: color,
                borderRadius: '4px',
                opacity: val * 0.8 + 0.2,
                cursor: 'pointer'
              }}
              title={`Activation score: ${(val * 100).toFixed(0)}%`}
            />
          );
        })}
      </div>
    </div>
  );
}
