import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameState = "ready" | "playing" | "ended";

interface Platform {
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  color: string;
}

interface PlatformerState {
  gameState: GameState;
  score: number;
  playerPosition: { x: number; y: number; z: number } | null;
  playerVelocity: { x: number; y: number; z: number } | null;
  platforms: Platform[];
  isGrounded: boolean;
  
  // Actions
  initializeGame: () => void;
  updatePlayer: (position: { x: number; y: number; z: number }, velocity: { x: number; y: number; z: number }) => void;
  setGrounded: (grounded: boolean) => void;
  incrementScore: () => void;
  resetGame: () => void;
  endGame: () => void;
}

// Pre-calculated platform positions to avoid Math.random() in render
const generatePlatforms = (): Platform[] => {
  const platforms: Platform[] = [];
  
  // Starting platforms
  platforms.push(
    { position: { x: -5, y: -8, z: 0 }, size: { width: 4, height: 1, depth: 2 }, color: "#4ECDC4" },
    { position: { x: 3, y: -6, z: 0 }, size: { width: 3, height: 1, depth: 2 }, color: "#45B7D1" },
    { position: { x: -2, y: -4, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#96CEB4" },
    { position: { x: 8, y: -3, z: 0 }, size: { width: 4, height: 1, depth: 2 }, color: "#FFEAA7" },
    { position: { x: -8, y: -1, z: 0 }, size: { width: 3, height: 1, depth: 2 }, color: "#DDA0DD" },
    { position: { x: 1, y: 1, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#F39C12" },
    { position: { x: -4, y: 3, z: 0 }, size: { width: 5, height: 1, depth: 2 }, color: "#E74C3C" },
    { position: { x: 10, y: 2, z: 0 }, size: { width: 3, height: 1, depth: 2 }, color: "#3498DB" },
    { position: { x: 6, y: 5, z: 0 }, size: { width: 2, height: 1, depth: 2 }, color: "#9B59B6" },
    { position: { x: -1, y: 7, z: 0 }, size: { width: 4, height: 1, depth: 2 }, color: "#1ABC9C" }
  );

  return platforms;
};

export const usePlatformer = create<PlatformerState>()(
  subscribeWithSelector((set, get) => ({
    gameState: "ready",
    score: 0,
    playerPosition: null,
    playerVelocity: null,
    platforms: [],
    isGrounded: false,
    
    initializeGame: () => {
      const platforms = generatePlatforms();
      set({ 
        gameState: "playing",
        score: 0,
        playerPosition: { x: 0, y: -9, z: 0 },
        playerVelocity: { x: 0, y: 0, z: 0 },
        platforms,
        isGrounded: false
      });
      console.log("Game initialized");
    },
    
    updatePlayer: (position, velocity) => {
      set({ playerPosition: position, playerVelocity: velocity });
    },
    
    setGrounded: (grounded) => {
      set({ isGrounded: grounded });
    },
    
    incrementScore: () => {
      set((state) => ({ score: state.score + 10 }));
    },
    
    resetGame: () => {
      const platforms = generatePlatforms();
      set({ 
        gameState: "playing",
        score: 0,
        playerPosition: { x: 0, y: -9, z: 0 },
        playerVelocity: { x: 0, y: 0, z: 0 },
        platforms,
        isGrounded: false
      });
      console.log("Game reset");
    },
    
    endGame: () => {
      set({ gameState: "ended" });
      console.log("Game ended");
    }
  }))
);
