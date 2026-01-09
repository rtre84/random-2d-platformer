import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGame } from '../lib/stores/useGame';
import {
  checkCollisions,
  checkEnemyAtEdge,
  PHYSICS_CONSTANTS,
  ENEMY_CONSTANTS
} from '../lib/physics';
import * as THREE from 'three';

interface SimpleEnemyProps {
  id: string;
  initialPosition: { x: number; y: number; z: number };
  initialDirection: number;
  patrolBounds: { left: number; right: number };
  size: { width: number; height: number; depth: number };
}

export function SimpleEnemy({
  id,
  initialPosition,
  initialDirection,
  patrolBounds,
  size
}: SimpleEnemyProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const directionRef = useRef(initialDirection);

  const {
    enemies,
    updateEnemy,
    platforms,
    gameState
  } = useGame();

  // Get this enemy's state from the store
  const enemy = enemies.find(e => e.id === id);

  // Main AI and physics loop
  useFrame((state, delta) => {
    if (!enemy || !enemy.isAlive || gameState !== 'playing') return;

    let newVelocity = { ...enemy.velocity };
    let newPosition = { ...enemy.position };
    let direction = directionRef.current;

    // Horizontal patrol movement
    newVelocity.x = direction * ENEMY_CONSTANTS.PATROL_SPEED;

    // Check if at patrol boundaries
    if (newPosition.x <= patrolBounds.left && direction === -1) {
      direction = 1;
      directionRef.current = 1;
    } else if (newPosition.x >= patrolBounds.right && direction === 1) {
      direction = -1;
      directionRef.current = -1;
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
      size,
      platforms,
      newVelocity
    );

    newPosition = collisionResult.position;
    newVelocity = collisionResult.velocity;
    const isGrounded = collisionResult.isGrounded;

    // Edge detection - reverse if at platform edge
    if (isGrounded) {
      const atEdge = checkEnemyAtEdge(
        newPosition,
        size,
        platforms,
        direction
      );

      if (atEdge) {
        direction = -direction;
        directionRef.current = direction;
        newVelocity.x = direction * ENEMY_CONSTANTS.PATROL_SPEED;
      }
    }

    // Update enemy state in store
    updateEnemy(id, newPosition, newVelocity, isGrounded);
  });

  // Sync mesh position with store state
  useEffect(() => {
    if (meshRef.current && enemy) {
      meshRef.current.position.set(
        enemy.position.x,
        enemy.position.y,
        enemy.position.z
      );
    }
  }, [enemy?.position]);

  if (!enemy || !enemy.isAlive) return null;

  return (
    <mesh
      ref={meshRef}
      position={[enemy.position.x, enemy.position.y, enemy.position.z]}
      castShadow
    >
      <boxGeometry args={[size.width, size.height, size.depth]} />
      <meshLambertMaterial color="#FF4444" />
    </mesh>
  );
}
