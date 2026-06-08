import React, { useState, useEffect } from "react";
import axios from "axios";

export default function KarmaDashboard() {
  const [data, setData] = useState({ career: 0, marriage: 0, spirituality: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get("/api/jaimini/dashboard", {
          baseURL: window.location.hostname === 'localhost' ? 'http://127.0.0.1:8000' : ''
        });
        setData(response.data);
      } catch (err) {
        console.error("Error fetching Karma Dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-4 border rounded bg-white shadow-sm text-center">Loading Karma Dashboard...</div>;
  }

  return (
    <div className="bg-[#fdfbf7] border border-[#005c99] rounded-sm shadow-sm overflow-hidden mb-4 font-serif">
      <div className="border-b border-[#005c99] px-2 py-1 text-[15px] text-[#00008b] font-medium bg-white rounded-t-[10px] mx-[2px] mt-[2px] border-[1px] flex items-center justify-between">
        <span>Karma Dashboard (Jaimini Pro)</span>
      </div>
      <div className="p-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-[#ffffea] border border-[#005c99] rounded shadow-sm">
          <div className="text-xl font-bold text-[#00008b]">{data.career}%</div>
          <div className="text-sm text-gray-700">Career Activation</div>
        </div>

        <div className="p-4 bg-[#ffffea] border border-[#005c99] rounded shadow-sm">
          <div className="text-xl font-bold text-[#00008b]">{data.marriage}%</div>
          <div className="text-sm text-gray-700">Marriage Activation</div>
        </div>

        <div className="p-4 bg-[#ffffea] border border-[#005c99] rounded shadow-sm">
          <div className="text-xl font-bold text-[#00008b]">{data.spirituality}%</div>
          <div className="text-sm text-gray-700">Spirituality Activation</div>
        </div>
      </div>
    </div>
  );
}
