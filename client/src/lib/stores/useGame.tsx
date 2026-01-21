import { create } from "zustand";
import { subscribeWithSelector, devtools } from "zustand/middleware";
import { level1 } from '../../data/levels/level-1';
import { level2 } from '../../data/levels/level-2';
import { parseLevelData } from '../levelParser';
import type { LevelData } from '../../data/types/level';

export type GameState = "ready" | "playing" | "paused" | "ended";

// Array of all available levels
const LEVELS: LevelData[] = [level1, level2];

interface Platform {
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  color: string;
  texture?: string;
}

interface Enemy {
  id: string;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  patrolBounds: { left: number; right: number };
  direction: 1 | -1;
  isGrounded: boolean;
  isAlive: boolean;
}

interface GameStore {
  // Game State
  gameState: GameState;
  score: number;
  level: number;

  // Player State
  playerPosition: { x: number; y: number; z: number };
  playerVelocity: { x: number; y: number; z: number };
  isGrounded: boolean;
  playerHealth: number;
  maxHealth: number;
  invincible: boolean;
  invincibilityTimer: number;

  // Advanced Movement State
  jumpsRemaining: number;
  dashCooldownTimer: number;
  isDashing: boolean;
  dashDirection: number;
  isWalledLeft: boolean;
  isWalledRight: boolean;

  // World State
  platforms: Platform[];
  enemies: Enemy[];

  // Actions
  setGameState: (state: GameState) => void;
  initializeGame: () => void;
  updatePlayer: (position: { x: number; y: number; z: number }, velocity: { x: number; y: number; z: number }) => void;
  setGrounded: (grounded: boolean) => void;
  addScore: (points: number) => void;
  resetGame: () => void;
  nextLevel: () => void;
  updateEnemy: (id: string, position: { x: number; y: number; z: number }, velocity: { x: number; y: number; z: number }, isGrounded: boolean) => void;
  removeEnemy: (id: string) => void;
  damagePlayer: (damage: number) => void;
  setInvincible: (invincible: boolean) => void;
  decrementInvincibilityTimer: () => void;
  // Advanced Movement Actions
  setJumpsRemaining: (jumps: number) => void;
  consumeJump: () => boolean;
  resetJumps: () => void;
  setDashState: (isDashing: boolean, direction?: number) => void;
  setDashCooldown: (time: number) => void;
  decrementDashCooldown: (delta: number) => void;
  setWallContact: (left: boolean, right: boolean) => void;
}

// Load level data using the new level system
const loadLevel = (levelNum: number) => {
  const levelData = LEVELS[levelNum - 1];

  if (!levelData) {
    console.error(`Level ${levelNum} not found, loading level 1`);
    return parseLevelData(LEVELS[0]);
  }

  return parseLevelData(levelData);
};

export const useGame = create<GameStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
    // Initial state
    gameState: "ready",
    score: 0,
    level: 1,
    playerPosition: { x: 0, y: -3, z: 0 },
    playerVelocity: { x: 0, y: 0, z: 0 },
    isGrounded: false,
    playerHealth: 3,
    maxHealth: 3,
    invincible: false,
    invincibilityTimer: 0,
    // Advanced Movement State
    jumpsRemaining: 2,
    dashCooldownTimer: 0,
    isDashing: false,
    dashDirection: 0,
    isWalledLeft: false,
    isWalledRight: false,
    platforms: [],
    enemies: [],
    
    // Actions
    setGameState: (gameState) => set({ gameState }),
    
    initializeGame: () => {
      const levelData = loadLevel(1);
      set({
        gameState: "playing",
        score: 0,
        level: 1,
        playerPosition: { x: 0, y: -3, z: 0 },
        playerVelocity: { x: 0, y: 0, z: 0 },
        isGrounded: false,
        playerHealth: 3,
        invincible: false,
        invincibilityTimer: 0,
        jumpsRemaining: 2,
        dashCooldownTimer: 0,
        isDashing: false,
        dashDirection: 0,
        isWalledLeft: false,
        isWalledRight: false,
        platforms: levelData.platforms,
        enemies: levelData.enemies
      });
    },
    
    updatePlayer: (position, velocity) => {
      set({ playerPosition: position, playerVelocity: velocity });
    },
    
    setGrounded: (grounded) => {
      set({ isGrounded: grounded });
    },
    
    addScore: (points) => {
      set(state => ({ score: state.score + points }));
    },
    
    resetGame: () => {
      const { level } = get();
      const levelData = loadLevel(level);
      set({
        gameState: "playing",
        playerPosition: { x: 0, y: -3, z: 0 },
        playerVelocity: { x: 0, y: 0, z: 0 },
        isGrounded: false,
        playerHealth: 3,
        invincible: false,
        invincibilityTimer: 0,
        jumpsRemaining: 2,
        dashCooldownTimer: 0,
        isDashing: false,
        dashDirection: 0,
        isWalledLeft: false,
        isWalledRight: false,
        platforms: levelData.platforms,
        enemies: levelData.enemies
      });
    },

    nextLevel: () => {
      const newLevel = get().level + 1;
      const levelData = loadLevel(newLevel);
      set({
        level: newLevel,
        playerPosition: { x: 0, y: -3, z: 0 },
        playerVelocity: { x: 0, y: 0, z: 0 },
        isGrounded: false,
        playerHealth: 3,
        invincible: false,
        invincibilityTimer: 0,
        jumpsRemaining: 2,
        dashCooldownTimer: 0,
        isDashing: false,
        dashDirection: 0,
        isWalledLeft: false,
        isWalledRight: false,
        platforms: levelData.platforms,
        enemies: levelData.enemies
      });
    },

    updateEnemy: (id, position, velocity, isGrounded) => {
      set(state => ({
        enemies: state.enemies.map(enemy =>
          enemy.id === id
            ? { ...enemy, position, velocity, isGrounded }
            : enemy
        )
      }));
    },

    removeEnemy: (id) => {
      set(state => ({
        enemies: state.enemies.filter(enemy => enemy.id !== id)
      }));
    },

    damagePlayer: (damage) => {
      const { playerHealth, invincible } = get();
      if (invincible) return;

      const newHealth = Math.max(0, playerHealth - damage);
      set({
        playerHealth: newHealth,
        invincible: true,
        invincibilityTimer: 1.5
      });

      if (newHealth <= 0) {
        set({ gameState: "ended" });
      }
    },

    setInvincible: (invincible) => {
      set({ invincible, invincibilityTimer: invincible ? 1.5 : 0 });
    },

    decrementInvincibilityTimer: () => {
      const { invincibilityTimer } = get();
      const newTimer = Math.max(0, invincibilityTimer - 0.1);
      set({ invincibilityTimer: newTimer });
      if (newTimer <= 0) {
        set({ invincible: false });
      }
    },

    // Advanced Movement Actions
    setJumpsRemaining: (jumps) => set({ jumpsRemaining: jumps }),

    consumeJump: () => {
      const { jumpsRemaining } = get();
      if (jumpsRemaining > 0) {
        set({ jumpsRemaining: jumpsRemaining - 1 });
        return true;
      }
      return false;
    },

    resetJumps: () => {
      set({ jumpsRemaining: 2 });
    },

    setDashState: (isDashing, direction = 0) => {
      set({ isDashing, dashDirection: direction });
    },

    setDashCooldown: (time) => {
      set({ dashCooldownTimer: time });
    },

    decrementDashCooldown: (delta) => {
      const { dashCooldownTimer } = get();
      set({ dashCooldownTimer: Math.max(0, dashCooldownTimer - delta) });
    },

    setWallContact: (left, right) => {
      set({ isWalledLeft: left, isWalledRight: right });
    }
  })),
    { name: 'GameStore' }
  )
);