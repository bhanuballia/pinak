// frontend/src/components/D108ActivationChart.jsx

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function D108ActivationChart({
  data
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height={400}
    >
      <BarChart data={data}>
        <XAxis dataKey="planet" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="strength" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
