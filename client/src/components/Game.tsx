import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { Player } from './Player';
import { Platform } from './Platform';
import { usePlatformer } from '../lib/stores/usePlatformer';
import * as THREE from 'three';

export function Game() {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.OrthographicCamera>();
  const { 
    playerPosition, 
    platforms, 
    initializeGame, 
    gameState,
    resetGame 
  } = usePlatformer();

  // Initialize the game when component mounts
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Camera follows player
  useFrame(() => {
    if (cameraRef.current && playerPosition) {
      const targetX = playerPosition.x;
      const targetY = Math.max(playerPosition.y, 0); // Don't go below ground level
      
      // Smooth camera following
      cameraRef.current.position.x = THREE.MathUtils.lerp(
        cameraRef.current.position.x, 
        targetX, 
        0.05
      );
      cameraRef.current.position.y = THREE.MathUtils.lerp(
        cameraRef.current.position.y, 
        targetY + 2, 
        0.05
      );
    }
  });

  // Reset game if player falls too far
  useEffect(() => {
    if (playerPosition && playerPosition.y < -20) {
      resetGame();
    }
  }, [playerPosition, resetGame]);

  return (
    <>
      {/* Orthographic Camera for 2D perspective */}
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        zoom={50}
        position={[0, 2, 10]}
        near={0.1}
        far={1000}
      />

      {/* Player */}
      <Player />

      {/* Platforms */}
      {platforms.map((platform, index) => (
        <Platform
          key={`platform-${index}`}
          position={platform.position}
          size={platform.size}
          color={platform.color}
        />
      ))}

      {/* Ground plane */}
      <mesh position={[0, -12, 0]} receiveShadow>
        <planeGeometry args={[200, 2]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>

      {/* Background elements */}
      <mesh position={[0, 10, -5]}>
        <planeGeometry args={[200, 20]} />
        <meshBasicMaterial color="#98FB98" />
      </mesh>
    </>
  );
}
