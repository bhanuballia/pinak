import React, { useEffect, useState } from "react";

export default function RealtimeAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Dynamically get the websocket host based on the current window location
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.hostname === "localhost" ? "localhost:8000" : window.location.host;
    const ws = new WebSocket(`${protocol}//${host}/api/sarvatobhadra/sbc-ws`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event) {
        setAlerts(prev => [...prev, data.event].slice(-5)); // Keep last 5 alerts
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {alerts.map((alert, idx) => (
        <div key={idx} className="bg-red-600 text-white px-4 py-2 rounded shadow-lg font-bold animate-pulse">
          🚨 {alert}
        </div>
      ))}
    </div>
  );
}
