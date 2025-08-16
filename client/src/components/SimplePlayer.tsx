import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useGame } from '../lib/stores/useGame';
import { checkCollisions, PHYSICS_CONSTANTS } from '../lib/physics';
import { Controls } from '../App';
import * as THREE from 'three';

const PLAYER_SIZE = { width: 1, height: 1, depth: 1 };

export function SimplePlayer() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { 
    playerPosition, 
    playerVelocity, 
    updatePlayer, 
    platforms,
    isGrounded,
    setGrounded,
    resetGame,
    gameState,
    addScore
  } = useGame();

  const [subscribe, get] = useKeyboardControls<Controls>();

  // Handle restart key
  useEffect(() => {
    return subscribe(
      (state) => state.restart,
      (pressed) => {
        if (pressed) {
          console.log('Restarting game...');
          resetGame();
        }
      }
    );
  }, [subscribe, resetGame]);

  // Main game loop - handles player movement and physics
  useFrame((state, delta) => {
    if (!playerPosition || !playerVelocity || gameState !== 'playing') return;

    const controls = get();
    let newVelocity = { ...playerVelocity };
    let newPosition = { ...playerPosition };

    // Horizontal movement with keyboard
    if (controls.left) {
      newVelocity.x = Math.max(newVelocity.x - PHYSICS_CONSTANTS.MOVE_SPEED * delta * 8, -PHYSICS_CONSTANTS.MAX_MOVE_SPEED);
      console.log('Moving left');
    } else if (controls.right) {
      newVelocity.x = Math.min(newVelocity.x + PHYSICS_CONSTANTS.MOVE_SPEED * delta * 8, PHYSICS_CONSTANTS.MAX_MOVE_SPEED);
      console.log('Moving right');
    } else {
      // Apply friction when not moving
      newVelocity.x *= PHYSICS_CONSTANTS.FRICTION;
    }

    // Jumping - only when grounded
    if (controls.jump && isGrounded) {
      newVelocity.y = PHYSICS_CONSTANTS.JUMP_FORCE;
      setGrounded(false);
      addScore(1); // Small score for jumping
      console.log('Jump!');
    }

    // Apply gravity
    newVelocity.y += PHYSICS_CONSTANTS.GRAVITY * delta;
    
    // Limit fall speed
    if (newVelocity.y < PHYSICS_CONSTANTS.MAX_FALL_SPEED) {
      newVelocity.y = PHYSICS_CONSTANTS.MAX_FALL_SPEED;
    }

    // Update position based on velocity
    newPosition.x += newVelocity.x * delta;
    newPosition.y += newVelocity.y * delta;

    // Check collisions with platforms
    const collisionResult = checkCollisions(
      newPosition,
      PLAYER_SIZE,
      platforms,
      newVelocity
    );

    // Update from collision results
    newPosition = collisionResult.position;
    newVelocity = collisionResult.velocity;
    
    // Set grounded state from collision
    if (collisionResult.isGrounded) {
      setGrounded(true);
    }

    // Ground collision check (safety net)
    if (newPosition.y <= -4.5) {
      newPosition.y = -4.5;
      newVelocity.y = 0;
      setGrounded(true);
    }

    // Update player state
    updatePlayer(newPosition, newVelocity);

    // Update mesh position for rendering
    if (meshRef.current) {
      meshRef.current.position.set(
        newPosition.x, 
        newPosition.y, 
        newPosition.z
      );
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={[playerPosition.x, playerPosition.y, playerPosition.z]}
      castShadow
    >
      <boxGeometry args={[PLAYER_SIZE.width, PLAYER_SIZE.height, PLAYER_SIZE.depth]} />
      <meshLambertMaterial color="#FF6B6B" />
    </mesh>
  );
}