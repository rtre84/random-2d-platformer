import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { usePlatformer } from '../lib/stores/usePlatformer';
import { checkCollisions } from '../lib/physics';
import { Controls } from '../App';
import * as THREE from 'three';

export function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { 
    playerPosition, 
    playerVelocity, 
    updatePlayer, 
    platforms,
    isGrounded,
    setGrounded,
    resetGame
  } = usePlatformer();

  const [subscribe, get] = useKeyboardControls<Controls>();

  // Subscribe to restart key
  useEffect(() => {
    return subscribe(
      (state) => state.restart,
      (pressed) => {
        if (pressed) {
          console.log('Restart key pressed');
          resetGame();
        }
      }
    );
  }, [subscribe, resetGame]);

  useFrame((state, delta) => {
    if (!playerPosition || !playerVelocity) return;

    const controls = get();
    let newVelocity = { ...playerVelocity };
    let newPosition = { ...playerPosition };

    // Horizontal movement
    const moveSpeed = 8;
    if (controls.left) {
      newVelocity.x = -moveSpeed;
      console.log('Moving left');
    } else if (controls.right) {
      newVelocity.x = moveSpeed;
      console.log('Moving right');
    } else {
      newVelocity.x *= 0.8; // Friction
    }

    // Jumping
    if (controls.jump && isGrounded) {
      newVelocity.y = 15;
      setGrounded(false);
      console.log('Jumping');
    }

    // Apply gravity
    const gravity = -30;
    newVelocity.y += gravity * delta;

    // Update position based on velocity
    newPosition.x += newVelocity.x * delta;
    newPosition.y += newVelocity.y * delta;

    // Check collisions with platforms
    const playerSize = { width: 1, height: 1, depth: 1 };
    const collisionResult = checkCollisions(
      newPosition,
      playerSize,
      platforms,
      newVelocity
    );

    newPosition = collisionResult.position;
    newVelocity = collisionResult.velocity;

    // Ground collision
    if (newPosition.y <= -10.5) {
      newPosition.y = -10.5;
      newVelocity.y = 0;
      setGrounded(true);
    }

    // Update player state
    updatePlayer(newPosition, newVelocity);

    // Update mesh position
    if (meshRef.current) {
      meshRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={[playerPosition?.x || 0, playerPosition?.y || 0, playerPosition?.z || 0]}
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial color="#FF6B6B" />
    </mesh>
  );
}
