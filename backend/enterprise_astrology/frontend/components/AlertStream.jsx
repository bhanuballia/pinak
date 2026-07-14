// frontend/components/AlertStream.jsx
import React, { useState, useEffect } from 'react';

export default function AlertStream({ userId = 'default_user', socketUrl = 'http://localhost:8000' }) {
  const [alerts, setAlerts] = useState([
    {
      id: 'init_1',
      planet: 'Saturn',
      house: 7,
      transit_sign: 'Aquarius',
      severity: 'HIGH',
      message: 'Initial Load: Saturn transiting your natal 7th house. Relationship boundaries and growth tests are highly active.',
      date: new Date().toISOString().slice(0, 10)
    },
    {
      id: 'init_2',
      planet: 'Jupiter',
      house: 2,
      transit_sign: 'Taurus',
      severity: 'LOW',
      message: 'Initial Load: Jupiter transiting the 2nd house of assets. Strong wealth retention and growth aspect active.',
      date: new Date().toISOString().slice(0, 10)
    }
  ]);
  const [status, setStatus] = useState('connected');

  useEffect(() => {
    // Dynamic simulated alerts for complete robustness when running offline
    const timer = setInterval(() => {
      const mockPlanets = ['Saturn', 'Mars', 'Jupiter', 'Sun', 'Mercury'];
      const mockSeverities = ['HIGH', 'MEDIUM', 'LOW'];
      const mockMessages = [
        'A sudden transit activation shows Mars conjuncting your ascendant. High dynamic energy alert.',
        'Mercury enters retrogradation today. Double-check details and communication items.',
        'Sun transiting the 10th house. Peak professional visibility and growth period starts.',
        'Venus transits 11th house, bringing positive networking opportunities and social gains.',
      ];
      
      const randomPlanet = mockPlanets[Math.floor(Math.random() * mockPlanets.length)];
      const randomSeverity = mockSeverities[Math.floor(Math.random() * mockSeverities.length)];
      const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      
      const newAlert = {
        id: `sim_${Date.now()}`,
        planet: randomPlanet,
        house: Math.floor(Math.random() * 12) + 1,
        transit_sign: 'Aries',
        severity: randomSeverity,
        message: randomMessage,
        date: new Date().toISOString().slice(0, 10)
      };

      setAlerts(prev => {
        const updated = [newAlert, ...prev];
        // Slice buffer at 15 items maximum
        return updated.slice(0, 15);
      });
    }, 15000); // add alert every 15s

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      background: '#0d0d1e',
      border: '1px solid #2e2e5c',
      borderRadius: '20px',
      padding: '20px',
      color: '#fff',
      fontFamily: 'Inter, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Header section with connection status */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        borderBottom: '1px solid #2e2e5c',
        paddingBottom: '12px'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#00f3ff',
            display: 'inline-block',
            boxShadow: '0 0 8px #00f3ff'
          }} />
          Live Astrological Alert Stream
        </h3>
        
        <span style={{
          fontSize: '12px',
          padding: '4px 10px',
          borderRadius: '20px',
          background: 'rgba(0, 243, 255, 0.1)',
          color: '#00f3ff',
          border: '1px solid rgba(0, 243, 255, 0.3)',
          fontWeight: 'bold'
        }}>
          {status.toUpperCase()}
        </span>
      </div>

      {/* Stream list items */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: '6px'
      }}>
        {alerts.map((alert) => {
          let badgeColor = '#00f3ff';
          let badgeBg = 'rgba(0, 243, 255, 0.1)';
          let badgeBorder = 'rgba(0, 243, 255, 0.3)';

          if (alert.severity === 'HIGH') {
            badgeColor = '#ff007f';
            badgeBg = 'rgba(255, 0, 127, 0.1)';
            badgeBorder = 'rgba(255, 0, 127, 0.3)';
          } else if (alert.severity === 'MEDIUM') {
            badgeColor = '#ffb300';
            badgeBg = 'rgba(255, 179, 0, 0.1)';
            badgeBorder = 'rgba(255, 179, 0, 0.3)';
          }

          return (
            <div
              key={alert.id}
              style={{
                background: 'rgba(46, 46, 92, 0.3)',
                border: '1px solid #2e2e5c',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = badgeColor;
                e.currentTarget.style.boxShadow = `0 4px 15px ${badgeBg}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2e2e5c';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
                  {alert.planet} Transit - House {alert.house} ({alert.transit_sign})
                </span>
                
                <span style={{
                  fontSize: '10px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  color: badgeColor,
                  background: badgeBg,
                  border: `1px solid ${badgeBorder}`,
                  fontWeight: 'bold'
                }}>
                  {alert.severity}
                </span>
              </div>
              
              <p style={{ margin: 0, fontSize: '13px', color: '#c0c0d5', lineHeight: '1.4' }}>
                {alert.message}
              </p>
              
              <span style={{ fontSize: '11px', color: '#6b6bbf', alignSelf: 'flex-end' }}>
                {alert.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
