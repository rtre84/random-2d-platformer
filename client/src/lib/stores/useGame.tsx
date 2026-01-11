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
      // Starting area - basic jumps
      { position: { x: -6, y: -3, z: 0 }, size: { width: 3, height: 1, depth: 2 }, color: "#4ECDC4" },
      { position: { x: 2, y: -1, z: 0 }, size: { width: 4, height: 1, depth: 2 }, color: "#45B7D1" },
      { position: { x: -3, y: 1, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#96CEB4" },
      { position: { x: 7, y: 2, z: 0 }, size: { width: 3, height: 1, depth: 2 }, color: "#FFEAA7" },

      // Wall jump section - vertical climb on the left
      { position: { x: -9.5, y: 0, z: 0 }, size: { width: 1, height: 6, depth: 2 }, color: "#FF6B9D" }, // Left wall
      { position: { x: -7.5, y: 0, z: 0 }, size: { width: 1, height: 6, depth: 2 }, color: "#C44569" }, // Right wall
      { position: { x: -8.5, y: 5.5, z: 0 }, size: { width: 2.5, height: 1, depth: 2 }, color: "#F8B500" }, // Top platform

      // Dash gap challenge - requires dash to cross
      { position: { x: 12, y: 0, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#A8E6CF" },
      { position: { x: 18, y: 0, z: 0 }, size: { width: 2.5, height: 1, depth: 2 }, color: "#FFD3B6" }, // Dash required!

      // Double jump platforms - ascending steps
      { position: { x: -1, y: 4, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#FFAAA5" },
      { position: { x: 3, y: 6, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#FF8B94" },

      // Secret area - high platform requiring double jump + dash
      { position: { x: -4, y: 8, z: 0 }, size: { width: 3, height: 1, depth: 2 }, color: "#FFD700" }, // Gold secret!

      // Right side wall jump tower
      { position: { x: 13.5, y: 3, z: 0 }, size: { width: 1, height: 8, depth: 2 }, color: "#6C5CE7" }, // Right wall
      { position: { x: 16.5, y: 3, z: 0 }, size: { width: 1, height: 8, depth: 2 }, color: "#A29BFE" }, // Left wall
      { position: { x: 15, y: 10, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#FD79A8" }, // Top reward

      // Narrow precision platforms
      { position: { x: 8, y: 5, z: 0 }, size: { width: 1.5, height: 1, depth: 2 }, color: "#74B9FF" },
      { position: { x: 5, y: 8, z: 0 }, size: { width: 1.5, height: 1, depth: 2 }, color: "#A29BFE" },

      // Lower dash section
      { position: { x: -12, y: -2, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#55EFC4" },
      { position: { x: -17, y: -2, z: 0 }, size: { width: 2.5, height: 1, depth: 2 }, color: "#00B894" }, // Dash left needed

      // Coyote time teaching platform - walkoff then jump
      { position: { x: 10, y: -3, z: 0 }, size: { width: 4, height: 1, depth: 2 }, color: "#81ECEC" },

      // Center ascending spiral
      { position: { x: 0, y: 3, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#FAB1A0" },
      { position: { x: -2, y: 5.5, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#FF7675" },
      { position: { x: 1, y: 9, z: 0 }, size: { width: 2.5, height: 1, depth: 2 }, color: "#FD79A8" }
    );
  }

  // Level 2+ adds more challenging platforms
  if (level >= 2) {
    platforms.push(
      // Even higher wall jump challenges
      { position: { x: -8, y: 12, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#DDA0DD" },
      { position: { x: 0, y: 13, z: 0 }, size: { width: 3, height: 1, depth: 2 }, color: "#F39C12" },
      { position: { x: 9, y: 15, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#E74C3C" },

      // Expert dash + double jump combination
      { position: { x: 20, y: 5, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#E17055" },
      { position: { x: 25, y: 8, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#D63031" }, // Extreme dash!

      // Triple wall jump challenge
      { position: { x: -15, y: 8, z: 0 }, size: { width: 1, height: 10, depth: 2 }, color: "#6C5CE7" },
      { position: { x: -12, y: 8, z: 0 }, size: { width: 1, height: 10, depth: 2 }, color: "#A29BFE" },
      { position: { x: -13.5, y: 17, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#FFEAA7" }
    );
  }
  
  return platforms;
};

// Generate enemies for the level
const generateEnemies = (level: number = 1, platforms: Platform[]): Enemy[] => {
  const enemies: Enemy[] = [];

  // Level 1: Strategic enemy placement
  if (level >= 1) {
    // Enemy on starting platform at x: 2, y: -1
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

    // Enemy on left starting platform at x: -6, y: -3
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

    // Enemy on dash challenge platform (right side)
    enemies.push({
      id: 'enemy-1-3',
      position: { x: 12, y: 1, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      size: { width: 0.8, height: 0.8, depth: 0.8 },
      patrolBounds: { left: 11, right: 13 },
      direction: 1,
      isGrounded: false,
      isAlive: true
    });

    // Enemy on wall jump top platform
    enemies.push({
      id: 'enemy-1-4',
      position: { x: -8.5, y: 6.5, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      size: { width: 0.8, height: 0.8, depth: 0.8 },
      patrolBounds: { left: -9.5, right: -7.5 },
      direction: -1,
      isGrounded: false,
      isAlive: true
    });

    // Enemy on coyote time teaching platform
    enemies.push({
      id: 'enemy-1-5',
      position: { x: 10, y: -2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      size: { width: 0.8, height: 0.8, depth: 0.8 },
      patrolBounds: { left: 8, right: 12 },
      direction: 1,
      isGrounded: false,
      isAlive: true
    });

    // Enemy on center ascending platform
    enemies.push({
      id: 'enemy-1-6',
      position: { x: 0, y: 4, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      size: { width: 0.8, height: 0.8, depth: 0.8 },
      patrolBounds: { left: -1, right: 1 },
      direction: -1,
      isGrounded: false,
      isAlive: true
    });
  }

  // Level 2+: Add more challenging enemies
  if (level >= 2) {
    // Enemy on high platform
    enemies.push({
      id: 'enemy-2-1',
      position: { x: 0, y: 14, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      size: { width: 0.8, height: 0.8, depth: 0.8 },
      patrolBounds: { left: -1.5, right: 1.5 },
      direction: 1,
      isGrounded: false,
      isAlive: true
    });

    // Enemy on expert dash platform
    enemies.push({
      id: 'enemy-2-2',
      position: { x: 20, y: 6, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      size: { width: 0.8, height: 0.8, depth: 0.8 },
      patrolBounds: { left: 19, right: 21 },
      direction: -1,
      isGrounded: false,
      isAlive: true
    });

    // Enemy on triple wall jump top
    enemies.push({
      id: 'enemy-2-3',
      position: { x: -13.5, y: 18, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      size: { width: 0.8, height: 0.8, depth: 0.8 },
      patrolBounds: { left: -14.5, right: -12.5 },
      direction: 1,
      isGrounded: false,
      isAlive: true
    });

    // Enemy on right wall jump tower top
    enemies.push({
      id: 'enemy-2-4',
      position: { x: 15, y: 11, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      size: { width: 0.8, height: 0.8, depth: 0.8 },
      patrolBounds: { left: 14, right: 16 },
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
        jumpsRemaining: 2,
        dashCooldownTimer: 0,
        isDashing: false,
        dashDirection: 0,
        isWalledLeft: false,
        isWalledRight: false,
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
        jumpsRemaining: 2,
        dashCooldownTimer: 0,
        isDashing: false,
        dashDirection: 0,
        isWalledLeft: false,
        isWalledRight: false,
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
        jumpsRemaining: 2,
        dashCooldownTimer: 0,
        isDashing: false,
        dashDirection: 0,
        isWalledLeft: false,
        isWalledRight: false,
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
  }))
);