interface Position {
  x: number;
  y: number;
  z: number;
}

interface Size {
  width: number;
  height: number;
  depth: number;
}

interface Platform {
  position: Position;
  size: Size;
}

interface CollisionResult {
  position: Position;
  velocity: Position;
  isGrounded: boolean;
}

// Simple AABB (Axis-Aligned Bounding Box) collision detection
export function checkAABBCollision(
  pos1: Position,
  size1: Size,
  pos2: Position,
  size2: Size
): boolean {
  const halfWidth1 = size1.width / 2;
  const halfHeight1 = size1.height / 2;
  const halfDepth1 = size1.depth / 2;

  const halfWidth2 = size2.width / 2;
  const halfHeight2 = size2.height / 2;
  const halfDepth2 = size2.depth / 2;

  return (
    Math.abs(pos1.x - pos2.x) < halfWidth1 + halfWidth2 &&
    Math.abs(pos1.y - pos2.y) < halfHeight1 + halfHeight2 &&
    Math.abs(pos1.z - pos2.z) < halfDepth1 + halfDepth2
  );
}

// Check collisions with platforms and resolve them
export function checkCollisions(
  playerPosition: Position,
  playerSize: Size,
  platforms: Platform[],
  velocity: Position
): CollisionResult {
  let newPosition = { ...playerPosition };
  let newVelocity = { ...velocity };
  let isGrounded = false;

  const playerHalfWidth = playerSize.width / 2;
  const playerHalfHeight = playerSize.height / 2;
  const playerHalfDepth = playerSize.depth / 2;

  // Check collision with each platform
  for (const platform of platforms) {
    const platformHalfWidth = platform.size.width / 2;
    const platformHalfHeight = platform.size.height / 2;
    const platformHalfDepth = platform.size.depth / 2;

    // Only check collision if objects are overlapping
    if (checkAABBCollision(newPosition, playerSize, platform.position, platform.size)) {
      // Calculate overlap distances for each axis (how much we need to separate)
      const overlapX = (playerHalfWidth + platformHalfWidth) - Math.abs(newPosition.x - platform.position.x);
      const overlapY = (playerHalfHeight + platformHalfHeight) - Math.abs(newPosition.y - platform.position.y);
      const overlapZ = (playerHalfDepth + platformHalfDepth) - Math.abs(newPosition.z - platform.position.z);

      // Resolve collision on the axis with the smallest overlap (shortest separation distance)
      if (overlapX < overlapY && overlapX < overlapZ) {
        // Horizontal collision (X-axis)
        if (newPosition.x < platform.position.x) {
          newPosition.x = platform.position.x - platformHalfWidth - playerHalfWidth - 0.01;
        } else {
          newPosition.x = platform.position.x + platformHalfWidth + playerHalfWidth + 0.01;
        }
        newVelocity.x = 0;
      } else if (overlapY < overlapZ) {
        // Vertical collision (Y-axis)
        if (newPosition.y < platform.position.y) {
          // Player is below platform - hitting head on bottom of platform
          newPosition.y = platform.position.y - platformHalfHeight - playerHalfHeight - 0.01;
          if (newVelocity.y > 0) {
            newVelocity.y = 0;
          }
        } else {
          // Player is above platform - landing on top
          newPosition.y = platform.position.y + platformHalfHeight + playerHalfHeight + 0.01;
          if (newVelocity.y <= 0) {
            newVelocity.y = 0;
            isGrounded = true;
          }
        }
      } else {
        // Depth collision (Z-axis) - for 2D game this is rarely used
        if (newPosition.z < platform.position.z) {
          newPosition.z = platform.position.z - platformHalfDepth - playerHalfDepth - 0.01;
        } else {
          newPosition.z = platform.position.z + platformHalfDepth + playerHalfDepth + 0.01;
        }
        newVelocity.z = 0;
      }
    }
  }

  return {
    position: newPosition,
    velocity: newVelocity,
    isGrounded
  };
}

// Check if player is standing on ground or platform
export function checkGrounded(
  playerPosition: Position,
  playerSize: Size,
  platforms: Platform[],
  tolerance: number = 0.1
): boolean {
  const playerBottom = playerPosition.y - playerSize.height / 2;

  for (const platform of platforms) {
    const platformTop = platform.position.y + platform.size.height / 2;
    const platformLeft = platform.position.x - platform.size.width / 2;
    const platformRight = platform.position.x + platform.size.width / 2;

    // Check horizontal alignment
    const playerLeft = playerPosition.x - playerSize.width / 2;
    const playerRight = playerPosition.x + playerSize.width / 2;

    const horizontalOverlap = playerRight > platformLeft && playerLeft < platformRight;
    const verticalAlignment = Math.abs(playerBottom - platformTop) < tolerance;

    if (horizontalOverlap && verticalAlignment) {
      return true;
    }
  }

  return false;
}

// Physics constants
export const PHYSICS_CONSTANTS = {
  GRAVITY: -25,
  JUMP_FORCE: 12,
  MOVE_SPEED: 8,
  FRICTION: 0.85,
  MAX_FALL_SPEED: -20,
  MAX_MOVE_SPEED: 15
};