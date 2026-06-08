// frontend/src/components/KarmaHeatmap.jsx

import React from "react";
import { HeatMapGrid } from "react-grid-heatmap";

export default function KarmaHeatmap({
  data
}) {
  return (
    <HeatMapGrid
      data={data}
      cellHeight="40px"
      xLabels={[
        "1","2","3","4",
        "5","6","7","8",
        "9","10","11","12"
      ]}
      yLabels={[
        "Ar","Ta","Ge","Cn",
        "Le","Vi","Li","Sc",
        "Sg","Cp","Aq","Pi"
      ]}
    />
  );
}
