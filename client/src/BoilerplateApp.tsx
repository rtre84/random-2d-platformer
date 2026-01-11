import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { KeyboardControls } from "@react-three/drei";
import { SimpleGame } from "./components/SimpleGame";
import { SimpleGameUI } from "./components/SimpleGameUI";
import { SoundManager } from "./components/SoundManager";
import "@fontsource/inter";

// Control keys for the 2D platformer
export enum Controls {
  left = 'left',
  right = 'right',
  jump = 'jump',
  restart = 'restart',
  dash = 'dash'
}

// Keyboard mapping for game controls
const controlMap = [
  { name: Controls.left, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.right, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.jump, keys: ["KeyW", "ArrowUp", "Space"] },
  { name: Controls.restart, keys: ["KeyR"] },
  { name: Controls.dash, keys: ["ShiftLeft", "ShiftRight"] },
];

/**
 * 2D Platformer Game Boilerplate
 * 
 * Features:
 * - React Three Fiber for 3D rendering in 2D perspective
 * - WASD/Arrow key controls for movement and jumping
 * - Physics-based collision detection
 * - Platform jumping mechanics
 * - Score and level tracking
 * - Sound management
 * - Responsive UI overlay
 */
function BoilerplateApp() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      backgroundColor: '#111'
    }}>
      <KeyboardControls map={controlMap}>
        {/* 3D Canvas with 2D orthographic perspective */}
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
            powerPreference: "high-performance"
          }}
        >
          {/* Sky blue background */}
          <color attach="background" args={["#87CEEB"]} />
          
          {/* Basic lighting setup */}
          <ambientLight intensity={0.7} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* Game Scene with loading fallback */}
          <Suspense fallback={null}>
            <SimpleGame />
          </Suspense>
        </Canvas>
        
        {/* UI Overlay */}
        <SimpleGameUI />
        
        {/* Audio Management */}
        <SoundManager />
      </KeyboardControls>
    </div>
  );
}

export default BoilerplateApp;