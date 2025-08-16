import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameState = "ready" | "playing" | "paused" | "ended";

interface Platform {
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  color: string;
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
  
  // World State
  platforms: Platform[];
  
  // Actions
  setGameState: (state: GameState) => void;
  initializeGame: () => void;
  updatePlayer: (position: { x: number; y: number; z: number }, velocity: { x: number; y: number; z: number }) => void;
  setGrounded: (grounded: boolean) => void;
  addScore: (points: number) => void;
  resetGame: () => void;
  nextLevel: () => void;
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

export const useGame = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gameState: "ready",
    score: 0,
    level: 1,
    playerPosition: { x: 0, y: -3, z: 0 },
    playerVelocity: { x: 0, y: 0, z: 0 },
    isGrounded: false,
    platforms: [],
    
    // Actions
    setGameState: (gameState) => set({ gameState }),
    
    initializeGame: () => {
      const platforms = generatePlatforms(1);
      set({
        gameState: "playing",
        score: 0,
        level: 1,
        playerPosition: { x: 0, y: -3, z: 0 },
        playerVelocity: { x: 0, y: 0, z: 0 },
        isGrounded: false,
        platforms
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
      set({
        gameState: "playing",
        playerPosition: { x: 0, y: -3, z: 0 },
        playerVelocity: { x: 0, y: 0, z: 0 },
        isGrounded: false,
        platforms
      });
    },
    
    nextLevel: () => {
      const newLevel = get().level + 1;
      const platforms = generatePlatforms(newLevel);
      set({
        level: newLevel,
        playerPosition: { x: 0, y: -3, z: 0 },
        playerVelocity: { x: 0, y: 0, z: 0 },
        isGrounded: false,
        platforms
      });
    }
  }))
);