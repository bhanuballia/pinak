import React, { useState, useEffect } from 'react';
import { requestForToken, onMessageListener } from '../firebase';

export default function NotificationManager() {
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Listen for foreground messages
    const listenForMessages = async () => {
      try {
        const payload = await onMessageListener();
        if (payload) {
          setNotification({
            title: payload.notification.title,
            body: payload.notification.body
          });
          setShowToast(true);
          // Hide toast after 5 seconds
          setTimeout(() => setShowToast(false), 5000);
        }
      } catch (err) {
        console.error("Failed to set up message listener:", err);
      }
    };

    // Check if we already have permission
    if (Notification.permission === 'granted') {
      setIsSubscribed(true);
      listenForMessages();
    }
  }, []);

  const handleSubscribe = async () => {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await requestForToken();
        if (token) {
          setIsSubscribed(true);

          // Get current profile from localStorage
          const storedData = localStorage.getItem('worksheetData');
          if (storedData) {
            try {
              const worksheetData = JSON.parse(storedData);
              // Send to backend
              const response = await fetch('http://localhost:8000/api/profiles/subscribe', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  fcm_token: token,
                  name: worksheetData.name,
                  date: worksheetData.date,
                  time: worksheetData.time
                })
              });

              if (response.ok) {
                alert("Successfully subscribed to tailored astrological alerts!");
              } else {
                alert("Token generated, but please ensure your profile is saved to the DB first!");
              }
            } catch (e) {
              console.error("Error sending token to backend:", e);
              alert("Token generated, but failed to link to your profile.");
            }
          } else {
            alert("FCM Token logged. (No active profile found in localStorage to link).");
          }

          // Wait for foreground messages
          try {
            onMessageListener().then((payload) => {
              setNotification({
                title: payload.notification.title,
                body: payload.notification.body
              });
              setShowToast(true);
              setTimeout(() => setShowToast(false), 5000);
            });
          } catch (e) { }
        }
      } else {
        alert("Permission denied. We cannot send you astrological alerts.");
      }
    } else if (Notification.permission === 'granted') {
      const token = await requestForToken();
      if (token) {
        alert("You are already subscribed. FCM Token logged to console.");
      }
    } else {
      alert("Notifications are blocked by your browser settings.");
    }
  };

  return (
    <>
      <div className="print:hidden">
        <button
          onClick={handleSubscribe}
          style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: isSubscribed ? '#10b981' : '#6366f1',
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          fontWeight: 'bold',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>{isSubscribed ? '✨ Alerts Active' : '🔔 Enable Transit Alerts'}</span>
      </button>
      </div>

      {/* Foreground Notification Toast */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#1e293b',
          color: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          borderLeft: '4px solid #38bdf8',
          zIndex: 9999,
          maxWidth: '300px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#f8fafc' }}>{notification.title}</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1' }}>{notification.body}</p>
        </div>
      )}
    </>
  );
}
