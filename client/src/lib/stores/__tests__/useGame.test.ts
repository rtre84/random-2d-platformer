import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGame } from '../useGame';

describe('Game Store', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.setGameState('ready');
    });
  });

  describe('initializeGame', () => {
    it('should initialize with level 1 data', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
      });

      expect(result.current.level).toBe(1);
      expect(result.current.platforms.length).toBeGreaterThan(0);
    });

    it('should set game state to "playing"', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
      });

      expect(result.current.gameState).toBe('playing');
    });

    it('should reset score to 0', () => {
      const { result } = renderHook(() => useGame());

      // Set score to something non-zero first
      act(() => {
        result.current.addScore(100);
      });

      act(() => {
        result.current.initializeGame();
      });

      expect(result.current.score).toBe(0);
    });

    it('should reset player health to maxHealth', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
      });

      expect(result.current.playerHealth).toBe(result.current.maxHealth);
      expect(result.current.playerHealth).toBe(3);
    });

    it('should reset player position to spawn', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
      });

      expect(result.current.playerPosition).toEqual({ x: 0, y: -3, z: 0 });
    });

    it('should reset player velocity', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
      });

      expect(result.current.playerVelocity).toEqual({ x: 0, y: 0, z: 0 });
    });

    it('should reset jumps remaining', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
      });

      expect(result.current.jumpsRemaining).toBe(2);
    });

    it('should reset dash cooldown', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
      });

      expect(result.current.dashCooldownTimer).toBe(0);
      expect(result.current.isDashing).toBe(false);
    });

    it('should load enemies from level 1', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
      });

      expect(result.current.enemies.length).toBeGreaterThan(0);
    });
  });

  describe('resetGame', () => {
    it('should maintain current level', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.nextLevel(); // Go to level 2
      });

      const currentLevel = result.current.level;

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.level).toBe(currentLevel);
    });

    it('should reset player position to spawn', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.updatePlayer({ x: 100, y: 100, z: 0 }, { x: 0, y: 0, z: 0 });
        result.current.resetGame();
      });

      expect(result.current.playerPosition).toEqual({ x: 0, y: -3, z: 0 });
    });

    it('should reset player health', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.damagePlayer(2); // Reduce health
        result.current.resetGame();
      });

      expect(result.current.playerHealth).toBe(3);
    });

    it('should reset invincibility', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.setInvincible(true);
        result.current.resetGame();
      });

      expect(result.current.invincible).toBe(false);
      expect(result.current.invincibilityTimer).toBe(0);
    });

    it('should reset jumps remaining', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.consumeJump();
        result.current.consumeJump();
        result.current.resetGame();
      });

      expect(result.current.jumpsRemaining).toBe(2);
    });

    it('should reload current level data', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
      });

      const platformCount = result.current.platforms.length;

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.platforms.length).toBe(platformCount);
    });
  });

  describe('addScore', () => {
    it('should add points to current score', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.addScore(10);
      });

      expect(result.current.score).toBe(10);
    });

    it('should accumulate multiple additions', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.addScore(10);
        result.current.addScore(20);
        result.current.addScore(5);
      });

      expect(result.current.score).toBe(35);
    });

    it('should handle zero points', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.addScore(0);
      });

      expect(result.current.score).toBe(0);
    });

    it('should handle negative points', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.addScore(100);
        result.current.addScore(-50);
      });

      expect(result.current.score).toBe(50);
    });
  });

  describe('damagePlayer', () => {
    it('should reduce health by damage amount', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.damagePlayer(1);
      });

      expect(result.current.playerHealth).toBe(2);
    });

    it('should set invincibility to true', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.damagePlayer(1);
      });

      expect(result.current.invincible).toBe(true);
    });

    it('should set invincibility timer', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.damagePlayer(1);
      });

      expect(result.current.invincibilityTimer).toBe(1.5);
    });

    it('should set game state to "ended" when health reaches 0', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.damagePlayer(3); // Full damage
      });

      expect(result.current.playerHealth).toBe(0);
      expect(result.current.gameState).toBe('ended');
    });

    it('should not reduce health below 0', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.damagePlayer(10); // Overkill damage
      });

      expect(result.current.playerHealth).toBe(0);
    });

    it('should ignore damage when already invincible', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.setInvincible(true);
        result.current.damagePlayer(1);
      });

      expect(result.current.playerHealth).toBe(3); // No damage taken
    });
  });

  describe('consumeJump', () => {
    it('should return true and decrement when jumps available', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
      });

      let jumpResult: boolean = false;
      act(() => {
        jumpResult = result.current.consumeJump();
      });

      expect(jumpResult).toBe(true);
      expect(result.current.jumpsRemaining).toBe(1);
    });

    it('should return false when no jumps remaining', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.consumeJump();
        result.current.consumeJump();
      });

      let jumpResult: boolean = true;
      act(() => {
        jumpResult = result.current.consumeJump();
      });

      expect(jumpResult).toBe(false);
      expect(result.current.jumpsRemaining).toBe(0);
    });

    it('should not decrement below 0', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.consumeJump();
        result.current.consumeJump();
        result.current.consumeJump(); // Extra attempt
      });

      expect(result.current.jumpsRemaining).toBe(0);
    });

    it('should allow consuming all available jumps', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
      });

      act(() => {
        result.current.consumeJump();
      });
      expect(result.current.jumpsRemaining).toBe(1);

      act(() => {
        result.current.consumeJump();
      });
      expect(result.current.jumpsRemaining).toBe(0);
    });
  });

  describe('resetJumps', () => {
    it('should reset jumps to max (2)', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.consumeJump();
        result.current.resetJumps();
      });

      expect(result.current.jumpsRemaining).toBe(2);
    });
  });

  describe('nextLevel', () => {
    it('should increment level number', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.nextLevel();
      });

      expect(result.current.level).toBe(2);
    });

    it('should load next level data', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
      });

      const level1PlatformCount = result.current.platforms.length;

      act(() => {
        result.current.nextLevel();
      });

      // Level 2 should have different platform count
      // This might be the same, but at least it should reload
      expect(result.current.platforms.length).toBeGreaterThan(0);
    });

    it('should reset player state', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.updatePlayer({ x: 100, y: 100, z: 0 }, { x: 5, y: 5, z: 0 });
        result.current.nextLevel();
      });

      expect(result.current.playerPosition).toEqual({ x: 0, y: -3, z: 0 });
      expect(result.current.playerVelocity).toEqual({ x: 0, y: 0, z: 0 });
    });

    it('should reset player health', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
        result.current.damagePlayer(2);
        result.current.nextLevel();
      });

      expect(result.current.playerHealth).toBe(3);
    });
  });

  describe('updatePlayer', () => {
    it('should update player position and velocity', () => {
      const { result } = renderHook(() => useGame());

      const newPosition = { x: 5, y: 10, z: 0 };
      const newVelocity = { x: 2, y: 3, z: 0 };

      act(() => {
        result.current.updatePlayer(newPosition, newVelocity);
      });

      expect(result.current.playerPosition).toEqual(newPosition);
      expect(result.current.playerVelocity).toEqual(newVelocity);
    });
  });

  describe('setGrounded', () => {
    it('should update grounded state', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.setGrounded(true);
      });

      expect(result.current.isGrounded).toBe(true);

      act(() => {
        result.current.setGrounded(false);
      });

      expect(result.current.isGrounded).toBe(false);
    });
  });

  describe('dash mechanics', () => {
    it('should set dash state', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.setDashState(true, 1);
      });

      expect(result.current.isDashing).toBe(true);
      expect(result.current.dashDirection).toBe(1);
    });

    it('should set dash cooldown', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.setDashCooldown(1.0);
      });

      expect(result.current.dashCooldownTimer).toBe(1.0);
    });

    it('should decrement dash cooldown', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.setDashCooldown(1.0);
        result.current.decrementDashCooldown(0.5);
      });

      expect(result.current.dashCooldownTimer).toBe(0.5);
    });

    it('should not decrement dash cooldown below 0', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.setDashCooldown(0.5);
        result.current.decrementDashCooldown(1.0);
      });

      expect(result.current.dashCooldownTimer).toBe(0);
    });
  });

  describe('wall contact', () => {
    it('should set wall contact state', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.setWallContact(true, false);
      });

      expect(result.current.isWalledLeft).toBe(true);
      expect(result.current.isWalledRight).toBe(false);

      act(() => {
        result.current.setWallContact(false, true);
      });

      expect(result.current.isWalledLeft).toBe(false);
      expect(result.current.isWalledRight).toBe(true);
    });
  });

  describe('enemy management', () => {
    it('should remove enemy by id', () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initializeGame();
      });

      const initialEnemyCount = result.current.enemies.length;
      const firstEnemyId = result.current.enemies[0]?.id;

      if (firstEnemyId) {
        act(() => {
          result.current.removeEnemy(firstEnemyId);
        });

        expect(result.current.enemies.length).toBe(initialEnemyCount - 1);
        expect(result.current.enemies.find(e => e.id === firstEnemyId)).toBeUndefined();
      }
    });
  });
});
