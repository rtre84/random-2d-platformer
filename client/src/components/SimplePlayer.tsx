import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useGame } from '../lib/stores/useGame';
import { checkCollisions, checkEnemyPlayerCollision, PHYSICS_CONSTANTS, ENEMY_CONSTANTS, ADVANCED_MOVEMENT_CONSTANTS } from '../lib/physics';
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
    decrementInvincibilityTimer,
    // Advanced movement state
    jumpsRemaining,
    consumeJump,
    resetJumps,
    dashCooldownTimer,
    isDashing,
    setDashState,
    setDashCooldown,
    decrementDashCooldown,
    isWalledLeft,
    isWalledRight,
    setWallContact
  } = useGame();

  const [subscribe, get] = useKeyboardControls<Controls>();

  // Frame-accurate timing refs
  const coyoteTimeRef = useRef(0);
  const jumpBufferRef = useRef(0);
  const jumpHoldTimeRef = useRef(0);
  const isJumpHeldRef = useRef(false);
  const dashTimerRef = useRef(0);
  const wasGroundedLastFrameRef = useRef(false);

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

  // Handle jump key press/release for variable jump height and buffering
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if it's a jump key
      if (['KeyW', 'ArrowUp', 'Space'].includes(e.code)) {
        isJumpHeldRef.current = true;

        // Set jump buffer when jump pressed
        jumpBufferRef.current = ADVANCED_MOVEMENT_CONSTANTS.JUMP_BUFFER_TIME;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['KeyW', 'ArrowUp', 'Space'].includes(e.code)) {
        isJumpHeldRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main game loop - handles player movement and physics
  useFrame((state, delta) => {
    if (!playerPosition || !playerVelocity || gameState !== 'playing') return;

    const controls = get();
    let newVelocity = { ...playerVelocity };
    let newPosition = { ...playerPosition };

    // ===== PHASE 1: UPDATE TIMERS =====

    // Update coyote time
    if (!isGrounded && wasGroundedLastFrameRef.current) {
      // Just left ground, start coyote time
      coyoteTimeRef.current = ADVANCED_MOVEMENT_CONSTANTS.COYOTE_TIME;
    } else if (!isGrounded) {
      // In air, decrement coyote time
      coyoteTimeRef.current = Math.max(0, coyoteTimeRef.current - delta);
    } else {
      // Grounded, no coyote time needed
      coyoteTimeRef.current = 0;
    }

    // Update jump buffer
    jumpBufferRef.current = Math.max(0, jumpBufferRef.current - delta);

    // Update dash cooldown
    decrementDashCooldown(delta);

    // Update dash timer if dashing
    if (isDashing) {
      dashTimerRef.current -= delta;
      if (dashTimerRef.current <= 0) {
        setDashState(false);
      }
    }

    // ===== PHASE 2: HANDLE DASH INPUT =====

    if (controls.dash && dashCooldownTimer <= 0 && !isDashing) {
      // Determine dash direction
      let dashDir = 0;
      if (controls.left) dashDir = -1;
      else if (controls.right) dashDir = 1;
      else {
        // Dash in facing direction if no input
        dashDir = newVelocity.x >= 0 ? 1 : -1;
      }

      // Initiate dash
      setDashState(true, dashDir);
      setDashCooldown(ADVANCED_MOVEMENT_CONSTANTS.DASH_COOLDOWN);
      dashTimerRef.current = ADVANCED_MOVEMENT_CONSTANTS.DASH_DURATION;

      // Override velocity with dash
      newVelocity.x = dashDir * ADVANCED_MOVEMENT_CONSTANTS.DASH_SPEED;
      newVelocity.y = 0; // Cancel vertical momentum during dash

      addScore(5); // Small bonus for dashing
    }

    // ===== PHASE 3: HORIZONTAL MOVEMENT =====

    if (!isDashing) {
      // Only allow manual movement when not dashing
      if (controls.left) {
        newVelocity.x = Math.max(
          newVelocity.x - PHYSICS_CONSTANTS.MOVE_SPEED * delta * 8,
          -PHYSICS_CONSTANTS.MAX_MOVE_SPEED
        );
      } else if (controls.right) {
        newVelocity.x = Math.min(
          newVelocity.x + PHYSICS_CONSTANTS.MOVE_SPEED * delta * 8,
          PHYSICS_CONSTANTS.MAX_MOVE_SPEED
        );
      } else {
        // Apply friction
        newVelocity.x *= PHYSICS_CONSTANTS.FRICTION;
      }
    }

    // ===== PHASE 4: JUMPING LOGIC =====

    // Determine if we can jump (coyote time OR grounded)
    const canCoyoteJump = coyoteTimeRef.current > 0 && jumpsRemaining === ADVANCED_MOVEMENT_CONSTANTS.MAX_JUMPS;
    const hasJumpBuffer = jumpBufferRef.current > 0;

    // Wall jump logic
    if ((isWalledLeft || isWalledRight) && !isGrounded && hasJumpBuffer) {
      // Wall jump!
      const wallJumpDir = isWalledLeft ? 1 : -1; // Jump away from wall

      newVelocity.x = wallJumpDir * ADVANCED_MOVEMENT_CONSTANTS.WALL_JUMP_FORCE_X;
      newVelocity.y = ADVANCED_MOVEMENT_CONSTANTS.WALL_JUMP_FORCE_Y;

      // Reset jumps (wall jump grants full air control)
      resetJumps();
      consumeJump(); // But consume one

      jumpBufferRef.current = 0; // Consume buffer
      jumpHoldTimeRef.current = 0; // Reset hold time

      addScore(10); // Wall jump bonus
    }
    // Normal jump (grounded or coyote time)
    else if ((isGrounded || canCoyoteJump) && hasJumpBuffer) {
      if (consumeJump()) {
        newVelocity.y = PHYSICS_CONSTANTS.JUMP_FORCE;
        setGrounded(false);
        coyoteTimeRef.current = 0; // Consume coyote time
        jumpBufferRef.current = 0; // Consume buffer
        jumpHoldTimeRef.current = 0; // Start tracking hold time
        addScore(1);
      }
    }
    // Double jump (in air, not just left ground)
    else if (!isGrounded && !canCoyoteJump && hasJumpBuffer && jumpsRemaining > 0) {
      if (consumeJump()) {
        newVelocity.y = ADVANCED_MOVEMENT_CONSTANTS.DOUBLE_JUMP_FORCE;
        jumpBufferRef.current = 0;
        jumpHoldTimeRef.current = 0;
        addScore(5);
      }
    }

    // ===== PHASE 5: VARIABLE JUMP HEIGHT =====

    if (isJumpHeldRef.current && newVelocity.y > 0 && jumpHoldTimeRef.current < ADVANCED_MOVEMENT_CONSTANTS.JUMP_HOLD_TIME) {
      // Still holding, still ascending, within hold time
      jumpHoldTimeRef.current += delta;
      // No modification needed - natural jump arc
    } else if (!isJumpHeldRef.current && newVelocity.y > 0) {
      // Released jump while ascending - cut jump short
      newVelocity.y *= Math.max(0, 1 - ADVANCED_MOVEMENT_CONSTANTS.JUMP_FORCE_DECAY_RATE * delta);
    }

    // ===== PHASE 6: GRAVITY & FALL SPEED =====

    // Apply gravity (unless dashing)
    if (!isDashing) {
      newVelocity.y += PHYSICS_CONSTANTS.GRAVITY * delta;
    }

    // Limit fall speed (or apply wall slide)
    if ((isWalledLeft || isWalledRight) && !isGrounded && newVelocity.y < 0) {
      // Wall slide - slower fall
      newVelocity.y = Math.max(
        newVelocity.y,
        ADVANCED_MOVEMENT_CONSTANTS.WALL_SLIDE_SPEED
      );
    } else {
      // Normal fall speed limit
      if (newVelocity.y < PHYSICS_CONSTANTS.MAX_FALL_SPEED) {
        newVelocity.y = PHYSICS_CONSTANTS.MAX_FALL_SPEED;
      }
    }

    // ===== PHASE 7: POSITION UPDATE =====

    newPosition.x += newVelocity.x * delta;
    newPosition.y += newVelocity.y * delta;

    // ===== PHASE 8: COLLISION DETECTION =====

    const collisionResult = checkCollisions(
      newPosition,
      PLAYER_SIZE,
      platforms,
      newVelocity
    );

    newPosition = collisionResult.position;
    newVelocity = collisionResult.velocity;

    // Update grounded state
    const nowGrounded = collisionResult.isGrounded;
    setGrounded(nowGrounded);

    // Update wall contact state
    setWallContact(collisionResult.isWalledLeft, collisionResult.isWalledRight);

    // Landing detection - reset jumps
    if (nowGrounded && !wasGroundedLastFrameRef.current) {
      resetJumps();
    }

    // Store grounded state for next frame
    wasGroundedLastFrameRef.current = nowGrounded;

    // ===== PHASE 9: GROUND SAFETY NET =====

    if (newPosition.y <= -4.5) {
      newPosition.y = -4.5;
      newVelocity.y = 0;
      setGrounded(true);
      resetJumps();
    }

    // ===== PHASE 10: ENEMY COLLISIONS =====

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
      } else if (collision.type === 'hit' && !invincible) {
        // Damage player and apply knockback
        damagePlayer(1);
        newVelocity.x = collision.knockbackDirection! * ENEMY_CONSTANTS.KNOCKBACK_FORCE;
        newVelocity.y = ENEMY_CONSTANTS.KNOCKBACK_UP_FORCE;
      }
    }

    // ===== PHASE 11: FINAL STATE UPDATE =====

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
        color={
          isDashing ? "#00FFFF" :      // Cyan during dash
          invincible ? "#FFD700" :      // Gold when invincible
          "#FF6B6B"                     // Normal red
        }
        opacity={invincible ? 0.7 : 1.0}
        transparent={invincible}
      />
    </mesh>
  );
}