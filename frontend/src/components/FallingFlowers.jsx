import React, { useEffect, useState } from "react";

const FallingFlowers = () => {
  const [flowers, setFlowers] = useState([]);

  useEffect(() => {
    // Generate an array of flowers with random properties
    const flowerArray = Array.from({ length: 30 }).map((_, i) => {
      // Decide if the flower should be on the left or right side
      const isLeftSide = Math.random() > 0.5;
      // Randomize position within the chosen side (0-15vw for left, 85-100vw for right)
      const left = isLeftSide ? Math.random() * 15 : 85 + Math.random() * 15; 
      
      const size = Math.random() * 20 + 15; // 15px to 35px
      const animationDuration = Math.random() * 5 + 5; // 5s to 10s
      const animationDelay = Math.random() * 5; // 0s to 5s
      
      // Randomly pick between different flower emojis
      const flowerTypes = ["🌸", "🌼", "🌺", "🌹", "🏵️"];
      const type = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];

      return {
        id: i,
        left,
        size,
        animationDuration,
        animationDelay,
        type,
      };
    });

    setFlowers(flowerArray);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {flowers.map((flower) => (
        <div
          key={flower.id}
          className="absolute animate-fall"
          style={{
            left: `${flower.left}vw`,
            fontSize: `${flower.size}px`,
            top: `-50px`, // Start slightly above the screen
            animationDuration: `${flower.animationDuration}s`,
            animationDelay: `${flower.animationDelay}s`,
            opacity: 0.8,
            textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
          }}
        >
          {flower.type}
        </div>
      ))}
    </div>
  );
};

export default FallingFlowers;
