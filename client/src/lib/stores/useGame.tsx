import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameState = "ready" | "playing" | "paused" | "ended";

interface Platform {
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  color: string;
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
}

// Generate platforms for the level
const generatePlatforms = (level: number = 1): Platform[] => {
  const platforms: Platform[] = [];
  
  // Ground platform
  platforms.push({
    position: { x: 0, y: -5, z: 0 },
    size: { width: 20, height: 1, depth: 2 },
    color: "#8B4513"
  });
  
  // Level 1 platforms
  if (level >= 1) {
    platforms.push(
      { position: { x: -6, y: -3, z: 0 }, size: { width: 3, height: 1, depth: 2 }, color: "#4ECDC4" },
      { position: { x: 2, y: -1, z: 0 }, size: { width: 4, height: 1, depth: 2 }, color: "#45B7D1" },
      { position: { x: -3, y: 1, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#96CEB4" },
      { position: { x: 7, y: 2, z: 0 }, size: { width: 3, height: 1, depth: 2 }, color: "#FFEAA7" }
    );
  }
  
  // Level 2+ adds more challenging platforms
  if (level >= 2) {
    platforms.push(
      { position: { x: -8, y: 4, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#DDA0DD" },
      { position: { x: 0, y: 6, z: 0 }, size: { width: 3, height: 1, depth: 2 }, color: "#F39C12" },
      { position: { x: 9, y: 8, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#E74C3C" }
    );
  }
  
  return platforms;
};

// Generate enemies for the level
const generateEnemies = (level: number = 1, platforms: Platform[]): Enemy[] => {
  const enemies: Enemy[] = [];

  // Level 1: 2 patrol enemies on specific platforms
  if (level >= 1) {
    // Enemy on platform at x: 2, y: -1 (patrol this platform)
    enemies.push({
      id: 'enemy-1-1',
      position: { x: 2, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      size: { width: 0.8, height: 0.8, depth: 0.8 },
      patrolBounds: { left: 0.5, right: 5.5 },
      direction: 1,
      isGrounded: false,
      isAlive: true
    });

    // Enemy on platform at x: -6, y: -3
    enemies.push({
      id: 'enemy-1-2',
      position: { x: -6, y: -2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      size: { width: 0.8, height: 0.8, depth: 0.8 },
      patrolBounds: { left: -7.5, right: -4.5 },
      direction: -1,
      isGrounded: false,
      isAlive: true
    });
  }

  // Level 2+: Add more challenging enemies
  if (level >= 2) {
    enemies.push({
      id: 'enemy-2-1',
      position: { x: 0, y: 7, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      size: { width: 0.8, height: 0.8, depth: 0.8 },
      patrolBounds: { left: -1.5, right: 1.5 },
      direction: 1,
      isGrounded: false,
      isAlive: true
    });

    enemies.push({
      id: 'enemy-2-2',
      position: { x: 7, y: 3, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      size: { width: 0.8, height: 0.8, depth: 0.8 },
      patrolBounds: { left: 5.5, right: 8.5 },
      direction: -1,
      isGrounded: false,
      isAlive: true
    });
  }

  return enemies;
};

export const useGame = create<GameStore>()(
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
    platforms: [],
    enemies: [],
    
    // Actions
    setGameState: (gameState) => set({ gameState }),
    
    initializeGame: () => {
      const platforms = generatePlatforms(1);
      const enemies = generateEnemies(1, platforms);
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
        platforms,
        enemies
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
      const platforms = generatePlatforms(level);
      const enemies = generateEnemies(level, platforms);
      set({
        gameState: "playing",
        playerPosition: { x: 0, y: -3, z: 0 },
        playerVelocity: { x: 0, y: 0, z: 0 },
        isGrounded: false,
        playerHealth: 3,
        invincible: false,
        invincibilityTimer: 0,
        platforms,
        enemies
      });
    },

    nextLevel: () => {
      const newLevel = get().level + 1;
      const platforms = generatePlatforms(newLevel);
      const enemies = generateEnemies(newLevel, platforms);
      set({
        level: newLevel,
        playerPosition: { x: 0, y: -3, z: 0 },
        playerVelocity: { x: 0, y: 0, z: 0 },
        isGrounded: false,
        playerHealth: 3,
        invincible: false,
        invincibilityTimer: 0,
        platforms,
        enemies
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
    }
  }))
);