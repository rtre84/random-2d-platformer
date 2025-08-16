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

// AABB (Axis-Aligned Bounding Box) collision detection
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

// Check collisions with all platforms
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

  for (const platform of platforms) {
    const platformHalfWidth = platform.size.width / 2;
    const platformHalfHeight = platform.size.height / 2;
    const platformHalfDepth = platform.size.depth / 2;

    // Check if player is colliding with platform
    if (checkAABBCollision(newPosition, playerSize, platform.position, platform.size)) {
      // Calculate overlap on each axis
      const overlapX = Math.abs(newPosition.x - platform.position.x) - (playerHalfWidth + platformHalfWidth);
      const overlapY = Math.abs(newPosition.y - platform.position.y) - (playerHalfHeight + platformHalfHeight);
      const overlapZ = Math.abs(newPosition.z - platform.position.z) - (playerHalfDepth + platformHalfDepth);

      // Find the axis with minimum overlap (that's our collision normal)
      if (overlapY > overlapX && overlapY > overlapZ) {
        // Horizontal collision (left/right)
        if (newPosition.x < platform.position.x) {
          newPosition.x = platform.position.x - platformHalfWidth - playerHalfWidth;
        } else {
          newPosition.x = platform.position.x + platformHalfWidth + playerHalfWidth;
        }
        newVelocity.x = 0;
      } else if (overlapX > overlapZ) {
        // Vertical collision (top/bottom)
        if (newPosition.y < platform.position.y) {
          // Player is below platform
          newPosition.y = platform.position.y - platformHalfHeight - playerHalfHeight;
          if (newVelocity.y > 0) {
            newVelocity.y = 0;
          }
        } else {
          // Player is above platform (landing on top)
          newPosition.y = platform.position.y + platformHalfHeight + playerHalfHeight;
          if (newVelocity.y < 0) {
            newVelocity.y = 0;
            isGrounded = true;
          }
        }
      } else {
        // Z-axis collision (depth)
        if (newPosition.z < platform.position.z) {
          newPosition.z = platform.position.z - platformHalfDepth - playerHalfDepth;
        } else {
          newPosition.z = platform.position.z + platformHalfDepth + playerHalfDepth;
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

// Helper function to check if player is on top of any platform
export function checkGrounded(
  playerPosition: Position,
  playerSize: Size,
  platforms: Platform[]
): boolean {
  const playerBottom = playerPosition.y - playerSize.height / 2;
  const tolerance = 0.1;

  for (const platform of platforms) {
    const platformTop = platform.position.y + platform.size.height / 2;
    const platformLeft = platform.position.x - platform.size.width / 2;
    const platformRight = platform.position.x + platform.size.width / 2;

    // Check if player is horizontally aligned with platform
    const playerLeft = playerPosition.x - playerSize.width / 2;
    const playerRight = playerPosition.x + playerSize.width / 2;

    const horizontalOverlap = playerRight > platformLeft && playerLeft < platformRight;
    const verticallyOnTop = Math.abs(playerBottom - platformTop) < tolerance;

    if (horizontalOverlap && verticallyOnTop) {
      return true;
    }
  }

  return false;
}
