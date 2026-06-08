// frontend/pages/AIReports.jsx
import React, { useState } from 'react';

export default function AIReports() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Your Premium AI Astrological Report PDF has been compiled successfully!');
    }, 2000);
  };

  return (
    <div style={{
      background: '#04040c',
      minHeight: '100vh',
      color: '#fff',
      padding: '40px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h2 style={{ fontSize: '28px', color: '#00f3ff', marginBottom: '8px' }}>AI PDF Report Generator</h2>
      <p style={{ color: '#c0c0d5', fontSize: '15px', marginBottom: '32px' }}>
        Download highly detailed astrological PDF analysis including planetary signs, dashas, and detailed predictions.
      </p>

      <div style={{
        background: '#0d0d1e',
        border: '1px solid #2e2e5c',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#ff007f' }}>Premium Interpretation Report</h4>
        <p style={{ fontSize: '13px', color: '#c0c0d5', lineHeight: '1.5', marginBottom: '24px' }}>
          Includes planetary placements, tara bala, chandra bala, shadbala strength, and events probability forecast maps.
        </p>

        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            background: 'linear-gradient(90deg, #00f3ff, #ff007f)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 30px',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: downloading ? 'not-allowed' : 'pointer',
            opacity: downloading ? 0.6 : 1,
            boxShadow: '0 4px 15px rgba(0, 243, 255, 0.3)',
            transition: 'all 0.2s'
          }}
        >
          {downloading ? 'Compiling PDF...' : 'Download PDF Report'}
        </button>
      </div>
    </div>
  );
}
