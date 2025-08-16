import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { Game } from "./components/Game";
import { GameUI } from "./components/GameUI";
import { SoundManager } from "./components/SoundManager";
import "@fontsource/inter";

// Define control keys for the platformer game
export enum Controls {
  left = 'left',
  right = 'right', 
  jump = 'jump',
  restart = 'restart'
}

const controls = [
  { name: Controls.left, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.right, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.jump, keys: ["KeyW", "ArrowUp", "Space"] },
  { name: Controls.restart, keys: ["KeyR"] },
];

// Main App component
function App() {
  const [showCanvas, setShowCanvas] = useState(false);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  if (!showCanvas) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#111111',
        color: '#ffffff'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KeyboardControls map={controls}>
        <Canvas
          shadows
          camera={{
            position: [0, 0, 10],
            fov: 75,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "default"
          }}
        >
          <color attach="background" args={["#87CEEB"]} />
          
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          <Suspense fallback={null}>
            <Game />
          </Suspense>
        </Canvas>
        
        <GameUI />
        <SoundManager />
      </KeyboardControls>
    </div>
  );
}

export default App;
