// frontend/src/components/RealtimeActivation.jsx

import React, { useEffect, useState } from "react";

export default function RealtimeActivation() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Basic mock or real websocket connection
    const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host}/ws`);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);
        setMessages(prev => [...prev, data.event].slice(-5));
      } catch(e) {}
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="bg-indigo-900 text-emerald-400 p-4 rounded-xl font-mono text-xs shadow-inner">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-bold uppercase tracking-widest text-white">Live Karmic Activation Stream</span>
      </div>
      <div className="space-y-1">
          {messages.length === 0 ? (
              <span className="opacity-50">Listening for destiny activations...</span>
          ) : (
              messages.map((msg, i) => (
                  <div key={i}>&gt; {msg}</div>
              ))
          )}
      </div>
    </div>
  );
}
