import { describe, it, expect } from 'vitest';
import {
  checkAABBCollision,
  checkCollisions,
  checkGrounded,
  checkEnemyPlayerCollision,
  checkEnemyAtEdge,
  PHYSICS_CONSTANTS,
  ENEMY_CONSTANTS
} from '../physics';

describe('Physics System', () => {
  describe('checkAABBCollision', () => {
    it('should return false when boxes do not overlap', () => {
      const result = checkAABBCollision(
        { x: 0, y: 0, z: 0 },
        { width: 1, height: 1, depth: 1 },
        { x: 5, y: 5, z: 0 },
        { width: 1, height: 1, depth: 1 }
      );
      expect(result).toBe(false);
    });

    it('should return true when boxes overlap perfectly', () => {
      const result = checkAABBCollision(
        { x: 0, y: 0, z: 0 },
        { width: 2, height: 2, depth: 2 },
        { x: 0, y: 0, z: 0 },
        { width: 2, height: 2, depth: 2 }
      );
      expect(result).toBe(true);
    });

    it('should return true when boxes partially overlap on X axis', () => {
      const result = checkAABBCollision(
        { x: 0, y: 0, z: 0 },
        { width: 2, height: 2, depth: 2 },
        { x: 1.5, y: 0, z: 0 },
        { width: 2, height: 2, depth: 2 }
      );
      expect(result).toBe(true);
    });

    it('should return true when boxes partially overlap on Y axis', () => {
      const result = checkAABBCollision(
        { x: 0, y: 0, z: 0 },
        { width: 2, height: 2, depth: 2 },
        { x: 0, y: 1.5, z: 0 },
        { width: 2, height: 2, depth: 2 }
      );
      expect(result).toBe(true);
    });

    it('should return false when boxes are touching but not overlapping', () => {
      const result = checkAABBCollision(
        { x: 0, y: 0, z: 0 },
        { width: 2, height: 2, depth: 2 },
        { x: 2, y: 0, z: 0 },
        { width: 2, height: 2, depth: 2 }
      );
      expect(result).toBe(false);
    });

    it('should return true for small overlap', () => {
      const result = checkAABBCollision(
        { x: 0, y: 0, z: 0 },
        { width: 1, height: 1, depth: 1 },
        { x: 0.9, y: 0, z: 0 },
        { width: 1, height: 1, depth: 1 }
      );
      expect(result).toBe(true);
    });
  });

  describe('checkCollisions', () => {
    const playerSize = { width: 1, height: 1.5, depth: 1 };

    it('should detect grounded state when player is on platform', () => {
      const platforms = [
        {
          position: { x: 0, y: -5, z: 0 },
          size: { width: 10, height: 1, depth: 2 }
        }
      ];

      const result = checkCollisions(
        { x: 0, y: -4, z: 0 }, // Player standing on platform
        playerSize,
        platforms,
        { x: 0, y: -1, z: 0 }
      );

      expect(result.isGrounded).toBe(true);
      expect(result.velocity.y).toBe(0);
    });

    it('should not be grounded when player is in air', () => {
      const platforms = [
        {
          position: { x: 0, y: -5, z: 0 },
          size: { width: 10, height: 1, depth: 2 }
        }
      ];

      const result = checkCollisions(
        { x: 0, y: 0, z: 0 }, // Player in air
        playerSize,
        platforms,
        { x: 0, y: 5, z: 0 }
      );

      expect(result.isGrounded).toBe(false);
    });

    it('should resolve collision from below (hitting ceiling)', () => {
      const platforms = [
        {
          position: { x: 0, y: 2, z: 0 },
          size: { width: 10, height: 1, depth: 2 }
        }
      ];

      const result = checkCollisions(
        { x: 0, y: 1, z: 0 }, // Player hitting ceiling
        playerSize,
        platforms,
        { x: 0, y: 5, z: 0 } // Moving up
      );

      expect(result.velocity.y).toBe(0); // Velocity stopped
      expect(result.position.y).toBeLessThan(1); // Pushed down
    });

    it('should detect wall collision on right side', () => {
      const platforms = [
        {
          position: { x: 3, y: 0, z: 0 },
          size: { width: 2, height: 10, depth: 2 }
        }
      ];

      const result = checkCollisions(
        { x: 2.5, y: 0, z: 0 }, // Player near wall
        playerSize,
        platforms,
        { x: 5, y: 0, z: 0 } // Moving right
      );

      expect(result.isWalledRight).toBe(true);
      expect(result.velocity.x).toBe(0);
    });

    it('should detect wall collision on left side', () => {
      const platforms = [
        {
          position: { x: -3, y: 0, z: 0 },
          size: { width: 2, height: 10, depth: 2 }
        }
      ];

      const result = checkCollisions(
        { x: -2.5, y: 0, z: 0 }, // Player near wall
        playerSize,
        platforms,
        { x: -5, y: 0, z: 0 } // Moving left
      );

      expect(result.isWalledLeft).toBe(true);
      expect(result.velocity.x).toBe(0);
    });

    it('should handle no collision scenario', () => {
      const platforms = [
        {
          position: { x: 10, y: 10, z: 0 },
          size: { width: 2, height: 2, depth: 2 }
        }
      ];

      const playerPos = { x: 0, y: 0, z: 0 };
      const result = checkCollisions(
        playerPos,
        playerSize,
        platforms,
        { x: 1, y: 1, z: 0 }
      );

      expect(result.position).toEqual(playerPos);
      expect(result.isGrounded).toBe(false);
      expect(result.isWalledLeft).toBe(false);
      expect(result.isWalledRight).toBe(false);
    });

    it('should resolve collision on smallest overlap axis', () => {
      const platforms = [
        {
          position: { x: 0, y: 0, z: 0 },
          size: { width: 5, height: 1, depth: 2 }
        }
      ];

      // Player slightly overlapping from top
      const result = checkCollisions(
        { x: 0, y: 0.6, z: 0 },
        playerSize,
        platforms,
        { x: 0, y: -1, z: 0 }
      );

      // Should resolve on Y axis (smallest overlap) and set grounded
      expect(result.isGrounded).toBe(true);
      expect(result.position.y).toBeGreaterThan(0.6);
    });
  });

  describe('checkGrounded', () => {
    const playerSize = { width: 1, height: 1.5, depth: 1 };

    it('should return true when player is exactly on platform', () => {
      const platforms = [
        {
          position: { x: 0, y: -5, z: 0 },
          size: { width: 10, height: 1, depth: 2 }
        }
      ];

      // Platform top is at -5 + 0.5 = -4.5
      // Player bottom should be at -4.5 for exact contact
      // Player bottom = playerY - 0.75, so playerY = -4.5 + 0.75 = -3.75
      const result = checkGrounded(
        { x: 0, y: -3.75, z: 0 },
        playerSize,
        platforms
      );

      expect(result).toBe(true);
    });

    it('should return true when player is within tolerance above platform', () => {
      const platforms = [
        {
          position: { x: 0, y: -5, z: 0 },
          size: { width: 10, height: 1, depth: 2 }
        }
      ];

      const result = checkGrounded(
        { x: 0, y: -3.7, z: 0 }, // Slightly above (within 0.1 tolerance)
        playerSize,
        platforms,
        0.1
      );

      expect(result).toBe(true);
    });

    it('should return false when player is too far above platform', () => {
      const platforms = [
        {
          position: { x: 0, y: -5, z: 0 },
          size: { width: 10, height: 1, depth: 2 }
        }
      ];

      const result = checkGrounded(
        { x: 0, y: -3, z: 0 }, // Too far above
        playerSize,
        platforms,
        0.1
      );

      expect(result).toBe(false);
    });

    it('should return false when player is not horizontally aligned', () => {
      const platforms = [
        {
          position: { x: 0, y: -5, z: 0 },
          size: { width: 2, height: 1, depth: 2 }
        }
      ];

      const result = checkGrounded(
        { x: 10, y: -3.75, z: 0 }, // Correct height but wrong X position
        playerSize,
        platforms
      );

      expect(result).toBe(false);
    });

    it('should return true when player overlaps edge of platform', () => {
      const platforms = [
        {
          position: { x: 0, y: -5, z: 0 },
          size: { width: 4, height: 1, depth: 2 }
        }
      ];

      const result = checkGrounded(
        { x: 1.9, y: -3.75, z: 0 }, // Player edge just overlapping platform edge
        playerSize,
        platforms
      );

      expect(result).toBe(true);
    });
  });

  describe('checkEnemyPlayerCollision', () => {
    const playerSize = { width: 1, height: 1.5, depth: 1 };
    const enemySize = { width: 0.8, height: 0.8, depth: 0.8 };

    it('should return "none" when player and enemy do not overlap', () => {
      const result = checkEnemyPlayerCollision(
        { x: 0, y: 0, z: 0 },
        playerSize,
        { x: 0, y: 0, z: 0 },
        { x: 10, y: 10, z: 0 },
        enemySize
      );

      expect(result.type).toBe('none');
    });

    it('should return "stomp" when player lands on enemy from above', () => {
      const enemyPosition = { x: 0, y: 0, z: 0 };
      const playerPosition = { x: 0, y: 1, z: 0 }; // Above enemy

      const result = checkEnemyPlayerCollision(
        playerPosition,
        playerSize,
        { x: 0, y: -5, z: 0 }, // Falling down fast
        enemyPosition,
        enemySize
      );

      expect(result.type).toBe('stomp');
    });

    it('should return "hit" when player collides from side', () => {
      const enemyPosition = { x: 0, y: 0, z: 0 };
      const playerPosition = { x: -0.5, y: 0, z: 0 }; // Same height, overlapping

      const result = checkEnemyPlayerCollision(
        playerPosition,
        playerSize,
        { x: 2, y: 0, z: 0 }, // Moving right (not falling)
        enemyPosition,
        enemySize
      );

      expect(result.type).toBe('hit');
      expect(result.knockbackDirection).toBe(-1); // Player to the left of enemy
    });

    it('should return "hit" with correct knockback direction (player on right)', () => {
      const enemyPosition = { x: 0, y: 0, z: 0 };
      const playerPosition = { x: 0.5, y: 0, z: 0 }; // To the right

      const result = checkEnemyPlayerCollision(
        playerPosition,
        playerSize,
        { x: -2, y: 0, z: 0 }, // Moving left
        enemyPosition,
        enemySize
      );

      expect(result.type).toBe('hit');
      expect(result.knockbackDirection).toBe(1); // Player to the right of enemy
    });

    it('should not register stomp if not falling fast enough', () => {
      const enemyPosition = { x: 0, y: 0, z: 0 };
      const playerPosition = { x: 0, y: 1, z: 0 };

      const result = checkEnemyPlayerCollision(
        playerPosition,
        playerSize,
        { x: 0, y: -1, z: 0 }, // Falling slowly (threshold is -2)
        enemyPosition,
        enemySize
      );

      expect(result.type).toBe('hit'); // Should be hit, not stomp
    });

    it('should verify stomp velocity threshold', () => {
      expect(ENEMY_CONSTANTS.STOMP_VELOCITY_THRESHOLD).toBe(-2);
    });
  });

  describe('checkEnemyAtEdge', () => {
    const enemySize = { width: 0.8, height: 0.8, depth: 0.8 };

    it('should return true when no platform ahead (at edge)', () => {
      const platforms = [
        {
          position: { x: 0, y: -5, z: 0 },
          size: { width: 4, height: 1, depth: 2 }
        }
      ];

      const result = checkEnemyAtEdge(
        { x: 1.8, y: -4.1, z: 0 }, // Near right edge
        enemySize,
        platforms,
        1 // Moving right
      );

      expect(result).toBe(true);
    });

    it('should return false when platform exists ahead', () => {
      const platforms = [
        {
          position: { x: 0, y: -5, z: 0 },
          size: { width: 10, height: 1, depth: 2 }
        }
      ];

      const result = checkEnemyAtEdge(
        { x: 0, y: -4.1, z: 0 }, // In middle of platform
        enemySize,
        platforms,
        1 // Moving right
      );

      expect(result).toBe(false); // Still platform ahead
    });

    it('should check in direction of movement (left)', () => {
      const platforms = [
        {
          position: { x: 0, y: -5, z: 0 },
          size: { width: 4, height: 1, depth: 2 }
        }
      ];

      const result = checkEnemyAtEdge(
        { x: -1.8, y: -4.1, z: 0 }, // Near left edge
        enemySize,
        platforms,
        -1 // Moving left
      );

      expect(result).toBe(true);
    });

    it('should handle multiple platforms', () => {
      const platforms = [
        {
          position: { x: 0, y: -5, z: 0 },
          size: { width: 4, height: 1, depth: 2 }
        },
        {
          position: { x: 6, y: -5, z: 0 },
          size: { width: 4, height: 1, depth: 2 }
        }
      ];

      // Enemy at edge of first platform, but second platform ahead
      const result = checkEnemyAtEdge(
        { x: 1.9, y: -4.1, z: 0 },
        enemySize,
        platforms,
        1 // Moving right
      );

      // Should detect gap between platforms
      expect(result).toBe(true);
    });
  });

  describe('Physics Constants', () => {
    it('should have correct gravity constant', () => {
      expect(PHYSICS_CONSTANTS.GRAVITY).toBe(-25);
    });

    it('should have correct jump force', () => {
      expect(PHYSICS_CONSTANTS.JUMP_FORCE).toBe(12);
    });

    it('should have correct move speed', () => {
      expect(PHYSICS_CONSTANTS.MOVE_SPEED).toBe(8);
    });

    it('should have friction less than 1', () => {
      expect(PHYSICS_CONSTANTS.FRICTION).toBeLessThan(1);
      expect(PHYSICS_CONSTANTS.FRICTION).toBeGreaterThan(0);
    });

    it('should have negative max fall speed', () => {
      expect(PHYSICS_CONSTANTS.MAX_FALL_SPEED).toBeLessThan(0);
    });
  });
});
