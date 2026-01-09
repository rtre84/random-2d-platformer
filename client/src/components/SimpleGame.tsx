import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { SimplePlayer } from './SimplePlayer';
import { SimplePlatform } from './SimplePlatform';
import { SimpleEnemy } from './SimpleEnemy';
import { useGame } from '../lib/stores/useGame';
import * as THREE from 'three';

export function SimpleGame() {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.OrthographicCamera>(null);
  const {
    playerPosition,
    platforms,
    enemies,
    initializeGame,
    gameState,
    resetGame,
    level
  } = useGame();

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Camera follows player smoothly
  useFrame(() => {
    if (cameraRef.current && playerPosition) {
      const targetX = playerPosition.x;
      const targetY = Math.max(playerPosition.y, -3); 
      
      // Smooth camera lerping
      cameraRef.current.position.x = THREE.MathUtils.lerp(
        cameraRef.current.position.x, 
        targetX, 
        0.08
      );
      cameraRef.current.position.y = THREE.MathUtils.lerp(
        cameraRef.current.position.y, 
        targetY + 2, 
        0.08
      );
    }
  });

  // Reset if player falls too far
  useEffect(() => {
    if (playerPosition && playerPosition.y < -15) {
      resetGame();
    }
  }, [playerPosition, resetGame]);

  return (
    <>
      {/* 2D Orthographic Camera */}
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        zoom={40}
        position={[0, 2, 10]}
        near={0.1}
        far={1000}
      />

      {/* Player Character */}
      <SimplePlayer />

      {/* Game Platforms */}
      {platforms.map((platform, index) => (
        <SimplePlatform
          key={`platform-${level}-${index}`}
          position={platform.position}
          size={platform.size}
          color={platform.color}
        />
      ))}

      {/* Enemy Characters */}
      {enemies.map((enemy) => (
        enemy.isAlive && (
          <SimpleEnemy
            key={enemy.id}
            id={enemy.id}
            initialPosition={enemy.position}
            initialDirection={enemy.direction}
            patrolBounds={enemy.patrolBounds}
            size={enemy.size}
          />
        )
      ))}

      {/* Sky Background */}
      <mesh position={[0, 15, -8]} rotation={[0, 0, 0]}>
        <planeGeometry args={[100, 30]} />
        <meshBasicMaterial color="#87CEEB" />
      </mesh>

      {/* Ground/Terrain Background */}
      <mesh position={[0, -8, -7]} rotation={[0, 0, 0]}>
        <planeGeometry args={[100, 10]} />
        <meshBasicMaterial color="#90EE90" />
      </mesh>

      {/* Ambient lighting for better visibility */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
}