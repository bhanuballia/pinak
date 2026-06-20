import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';

// A constant to scale AU (Astronomical Units) to 3D scene units.
// 1 AU is Earth's distance to the Sun. We'll make 1 AU = 15 units.
const AU_SCALE = 15;

// ---------------------------------------------------------
// Planet Component
// ---------------------------------------------------------
const Planet = ({ color, size, name, baseLon, radiusAU, speedDegPerDay, daysOffset, isRetrograde, isCombust }) => {
  const meshRef = useRef();
  
  // Convert AU to our scene scale
  const orbitRadius = radiusAU * AU_SCALE;

  // useFrame runs every frame. We update the position based on the timeline slider.
  useFrame(() => {
    if (meshRef.current) {
      // Calculate current longitude: base + (speed * daysOffset)
      const currentLon = baseLon + (speedDegPerDay * daysOffset);
      
      // Convert degrees to radians
      // In astrology, 0 degrees (Aries) is usually placed on the East (Right/X-axis).
      // We will rotate counter-clockwise for positive values.
      const rad = (currentLon * Math.PI) / 180;

      meshRef.current.position.x = Math.cos(rad) * orbitRadius;
      // In Three.js, Y is UP. We map the 2D plane to X and Z.
      // Using negative sin makes it orbit counter-clockwise when viewed from above (Y axis).
      meshRef.current.position.z = -Math.sin(rad) * orbitRadius;
    }
  });

  const labelParts = [name];
  if (isRetrograde) labelParts.push("(Vakri)");
  if (isCombust) labelParts.push("(Asth)");
  const labelText = labelParts.join(" ");

  return (
    <group>
      {/* The 3D Sphere for the Planet */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.4} 
          metalness={0.3} 
          emissive={color} 
          emissiveIntensity={0.1}
        />
        
        {/* Render Rings for Saturn */}
        {name === "Saturn" && (
          <mesh rotation={[Math.PI / 2.2, 0, 0]}>
            <ringGeometry args={[size * 1.5, size * 2.2, 64]} />
            <meshStandardMaterial color="#c2a77a" side={2} transparent opacity={0.8} />
          </mesh>
        )}

        {/* Text Label floating above the planet */}
        <Text
          position={[0, size + 1.8, 0]}
          fontSize={1.8}
          color={isCombust ? "#ff8844" : (isRetrograde ? "#ff5555" : "white")}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#000000"
          fontWeight="bold"
        >
          {labelText}
        </Text>
      </mesh>

      {/* The Orbital Path (A faint ring) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.03, orbitRadius + 0.03, 128]} />
        <meshBasicMaterial color={color} side={2} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------
// Earth Component with Line of Sight (To explain Combustion)
// ---------------------------------------------------------
const EarthDemo = ({ baseLon, radiusAU, speedDegPerDay, daysOffset }) => {
  const earthRef = useRef();
  const orbitRadius = radiusAU * AU_SCALE;

  useFrame(() => {
    if (earthRef.current) {
      const currentLon = baseLon + (speedDegPerDay * daysOffset);
      const rad = (currentLon * Math.PI) / 180;
      
      earthRef.current.position.x = Math.cos(rad) * orbitRadius;
      earthRef.current.position.z = -Math.sin(rad) * orbitRadius;
    }
  });

  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#4488ff" roughness={0.5} metalness={0.2} emissive="#002255" emissiveIntensity={0.2} />
        <Text 
          position={[0, 2.5, 0]} 
          fontSize={1.8} 
          color="white"
          outlineWidth={0.1}
          outlineColor="#000000"
          fontWeight="bold"
        >
          Earth
        </Text>
      </mesh>
      
      {/* Orbital Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.03, orbitRadius + 0.03, 128]} />
        <meshBasicMaterial color="#4488ff" side={2} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};


// ---------------------------------------------------------
// Main Canvas Component
// ---------------------------------------------------------
const SolarSystem3D = ({ date = "1990-10-01", time = "12:00:00" }) => {
  const [planetData, setPlanetData] = useState(null);
  const [daysOffset, setDaysOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch real ephemeris data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/astronomy/heliocentric", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, time, tz_offset: 5.5 })
        });
        const data = await response.json();
        setPlanetData(data.planets);
      } catch (err) {
        console.error("Failed to fetch astronomy data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [date, time]);

  return (
    <div className="relative w-full h-[700px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
      
      {/* Main 3D Canvas */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/80 text-white">
            Loading Real Ephemeris Data...
          </div>
        )}
        <Canvas camera={{ position: [0, 60, 80], fov: 45 }}>
          <OrbitControls makeDefault />
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 0, 0]} intensity={1000} color="#ffddaa" distance={200} />

          {/* The Sun Mesh */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[3.5, 64, 64]} />
            <meshBasicMaterial color="#ffaa00" />
            {/* Sun Glow */}
            <mesh>
              <sphereGeometry args={[4.2, 32, 32]} />
              <meshBasicMaterial color="#ffcc44" transparent opacity={0.4} />
            </mesh>
            <mesh>
              <sphereGeometry args={[5.0, 32, 32]} />
              <meshBasicMaterial color="#ffaa00" transparent opacity={0.2} />
            </mesh>
            <Text 
              position={[0, 6, 0]} 
              fontSize={2.5} 
              color="#ffeeaa"
              outlineWidth={0.1}
              outlineColor="#000000"
              fontWeight="bold"
            >
              Sun
            </Text>
          </mesh>

          {/* Render Planets conditionally when data is loaded */}
          {planetData && (
            <>
              <Planet name="Mercury" color="#a8a8a8" size={0.6} 
                baseLon={planetData.Mercury.lon} radiusAU={planetData.Mercury.radius} 
                speedDegPerDay={planetData.Mercury.speed} daysOffset={daysOffset} 
                isRetrograde={planetData.Mercury.isRetrograde} isCombust={planetData.Mercury.isCombust} />
                
              <Planet name="Venus" color="#ffd7a0" size={0.9} 
                baseLon={planetData.Venus.lon} radiusAU={planetData.Venus.radius} 
                speedDegPerDay={planetData.Venus.speed} daysOffset={daysOffset} 
                isRetrograde={planetData.Venus.isRetrograde} isCombust={planetData.Venus.isCombust} />
                
              <EarthDemo 
                baseLon={planetData.Earth.lon} radiusAU={planetData.Earth.radius} 
                speedDegPerDay={planetData.Earth.speed} daysOffset={daysOffset} />

              <Planet name="Mars" color="#ff5a36" size={0.8} 
                baseLon={planetData.Mars.lon} radiusAU={planetData.Mars.radius} 
                speedDegPerDay={planetData.Mars.speed} daysOffset={daysOffset} 
                isRetrograde={planetData.Mars.isRetrograde} isCombust={planetData.Mars.isCombust} />
                
              <Planet name="Jupiter" color="#e8b97d" size={1.8} 
                baseLon={planetData.Jupiter.lon} radiusAU={planetData.Jupiter.radius} 
                speedDegPerDay={planetData.Jupiter.speed} daysOffset={daysOffset} 
                isRetrograde={planetData.Jupiter.isRetrograde} isCombust={planetData.Jupiter.isCombust} />

              <Planet name="Saturn" color="#e3d6a8" size={1.6} 
                baseLon={planetData.Saturn.lon} radiusAU={planetData.Saturn.radius} 
                speedDegPerDay={planetData.Saturn.speed} daysOffset={daysOffset} 
                isRetrograde={planetData.Saturn.isRetrograde} isCombust={planetData.Saturn.isCombust} />
            </>
          )}

          <gridHelper args={[200, 200, '#222222', '#111111']} position={[0, -0.5, 0]} />
        </Canvas>

        {/* Info Overlay */}
        <div className="absolute top-4 left-4 text-slate-200 text-sm bg-black/60 p-4 rounded-lg pointer-events-none backdrop-blur-sm border border-slate-700">
          <h3 className="font-bold text-lg text-white mb-1">3D Astronomical View</h3>
          <p className="text-amber-400 font-semibold mb-2">Powered by Swiss Ephemeris</p>
          <ul className="space-y-1">
            <li>🖱️ <strong>Left Click + Drag</strong> to rotate camera</li>
            <li>📜 <strong>Scroll</strong> to zoom in/out</li>
          </ul>
        </div>
      </div>

      {/* Timeline Controls (Transit Slider) */}
      <div className="h-24 bg-slate-800 border-t border-slate-600 p-4 flex flex-col justify-center text-white">
        <div className="flex justify-between mb-2 px-2">
          <span className="text-sm font-medium">10 Years Ago</span>
          <span className="text-sm font-bold text-amber-400">
            {daysOffset === 0 ? "Birth Date" : 
              daysOffset > 0 ? `+${daysOffset} Days` : `${daysOffset} Days`}
          </span>
          <span className="text-sm font-medium">10 Years Future</span>
        </div>
        <input 
          type="range" 
          min="-3650" 
          max="3650" 
          value={daysOffset} 
          onChange={(e) => setDaysOffset(parseInt(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="text-center mt-2 text-xs text-slate-400">
          Drag the slider to animate planetary orbits over time (Transit simulation)
        </div>
      </div>
    </div>
  );
};

export default SolarSystem3D;
