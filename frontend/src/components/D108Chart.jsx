// frontend/src/components/D108Chart.jsx

import React from "react";

export default function D108Chart({
  planets
}) {
  return (
    <div
      className="
        grid
        grid-cols-3
        gap-4
      "
    >
      {planets.map((p, idx) => (
        <div
          key={idx}
          className="
            border
            rounded-lg
            p-4
            bg-yellow-50
          "
        >
          <div className="font-bold">
            {p.name}
          </div>
          <div>
            Strength:
            {p.strength}
          </div>
          <div>
            Sign:
            {p.sign}
          </div>
        </div>
      ))}
    </div>
  );
}
