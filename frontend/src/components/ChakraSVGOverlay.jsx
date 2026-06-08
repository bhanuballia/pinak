import React from "react";

export default function ChakraSVGOverlay({ vedhas = [] }) {
  // Assuming a 650x650 grid, 9x9 cells
  // Each cell is 650/9 = 72.22px wide and high
  const CELL_SIZE = 650 / 9;
  
  // Helper to get center of a cell (row, col)
  const getCenter = (row, col) => ({
    x: col * CELL_SIZE + (CELL_SIZE / 2),
    y: row * CELL_SIZE + (CELL_SIZE / 2)
  });

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 650 650">
      {vedhas.map((vedhaObj, i) => {
        const { origin_row, origin_col, paths, planet } = vedhaObj;
        const origin = getCenter(origin_row, origin_col);

        // Define colors based on generic benefic/malefic for now
        const isMalefic = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(planet);
        const strokeColor = isMalefic ? "rgba(220, 38, 38, 0.7)" : "rgba(5, 150, 105, 0.7)"; // Red vs Green
        
        return paths.map((pathObj, j) => {
          // Draw a line from origin to the last cell in the path
          if (!pathObj.cells || pathObj.cells.length === 0) return null;
          
          const lastCell = pathObj.cells[pathObj.cells.length - 1];
          const dest = getCenter(lastCell[0], lastCell[1]);
          
          return (
            <line
              key={`${i}-${j}`}
              x1={origin.x}
              y1={origin.y}
              x2={dest.x}
              y2={dest.y}
              stroke={strokeColor}
              strokeWidth="2"
              strokeDasharray={pathObj.direction === "sammukha" ? "none" : "5,5"}
            />
          );
        });
      })}
    </svg>
  );
}
