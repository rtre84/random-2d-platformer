import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useGame } from '../lib/stores/useGame';
import { checkCollisions, checkEnemyPlayerCollision, PHYSICS_CONSTANTS, ENEMY_CONSTANTS } from '../lib/physics';
import { Controls } from '../BoilerplateApp';
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
    addScore,
    enemies,
    removeEnemy,
    damagePlayer,
    invincible,
    invincibilityTimer,
    decrementInvincibilityTimer
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
    
    // Update grounded state based on collision results
    setGrounded(collisionResult.isGrounded);

    // Ground collision check (safety net)
    if (newPosition.y <= -4.5) {
      newPosition.y = -4.5;
      newVelocity.y = 0;
      setGrounded(true);
    }

    // Check collisions with all enemies
    for (const enemy of enemies) {
      if (!enemy.isAlive) continue;

      const collision = checkEnemyPlayerCollision(
        newPosition,
        PLAYER_SIZE,
        newVelocity,
        enemy.position,
        enemy.size
      );

      if (collision.type === 'stomp') {
        // Kill enemy and bounce player
        removeEnemy(enemy.id);
        newVelocity.y = ENEMY_CONSTANTS.STOMP_BOUNCE;
        addScore(100); // Award points for killing enemy
        console.log('Enemy stomped!');
      } else if (collision.type === 'hit' && !invincible) {
        // Damage player and apply knockback
        damagePlayer(1);
        newVelocity.x = collision.knockbackDirection! * ENEMY_CONSTANTS.KNOCKBACK_FORCE;
        newVelocity.y = ENEMY_CONSTANTS.KNOCKBACK_UP_FORCE;
        console.log('Player hit by enemy!');
      }
    }

    // Update player state BEFORE updating mesh
    updatePlayer(newPosition, newVelocity);
  });

  // Handle invincibility timer
  useEffect(() => {
    if (invincibilityTimer > 0) {
      const timer = setInterval(() => {
        decrementInvincibilityTimer();
      }, 100);

      return () => clearInterval(timer);
    }
  }, [invincibilityTimer, decrementInvincibilityTimer]);

  // Update mesh position when playerPosition changes
  useEffect(() => {
    if (meshRef.current && playerPosition) {
      meshRef.current.position.set(
        playerPosition.x,
        playerPosition.y,
        playerPosition.z
      );
    }
  }, [playerPosition]);

  return (
    <mesh
      ref={meshRef}
      position={[playerPosition.x, playerPosition.y, playerPosition.z]}
      castShadow
    >
      <boxGeometry args={[PLAYER_SIZE.width, PLAYER_SIZE.height, PLAYER_SIZE.depth]} />
      <meshLambertMaterial
        color={invincible ? "#FFD700" : "#FF6B6B"}
        opacity={invincible ? 0.7 : 1.0}
        transparent={invincible}
      />
    </mesh>
  );
}