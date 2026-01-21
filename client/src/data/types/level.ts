// Type definitions for level data structure

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface CameraLimits {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface LevelData {
  id: number;
  name: string;
  playerSpawn: Vector3;
  cameraLimits?: CameraLimits;
  backgroundColor?: string;
  sections: Record<string, LevelSection>;
}

export interface LevelSection {
  platforms?: PlatformData[];
  enemies?: EnemyData[];
  triggers?: TriggerData[];
  collectibles?: CollectibleData[];
}

export interface PlatformData {
  pos: [number, number, number]; // [x, y, z] - Shorter syntax
  size: [number, number, number]; // [width, height, depth]
  color: string;
  texture?: string; // Optional texture path (e.g., "/textures/grass.png")
  tags?: string[]; // ["wall", "hazard", "goal", "moving"]
  properties?: Record<string, any>; // Custom properties for extensibility
}

export interface EnemyData {
  type: "patrol" | "flying" | "stationary";
  pos: [number, number, number]; // [x, y, z]
  patrol?: [number, number]; // [left, right] patrol bounds
  properties?: Record<string, any>;
}

export interface TriggerData {
  type: "levelComplete" | "checkpoint" | "hint" | "cutscene";
  pos: [number, number, number];
  size?: [number, number, number];
  message?: string;
  action?: string;
}

export interface CollectibleData {
  type: "coin" | "powerup" | "health";
  pos: [number, number, number];
  value?: number;
}

// Parsed level output (what the game engine uses)
export interface ParsedLevel {
  platforms: Platform[];
  enemies: Enemy[];
  triggers: Trigger[];
  playerSpawn: Vector3;
  backgroundColor?: string;
}

export interface Platform {
  id: string;
  position: Vector3;
  size: { width: number; height: number; depth: number };
  color: string;
  texture?: string;
  tags: string[];
  properties?: Record<string, any>;
}

export interface Enemy {
  id: string;
  type: string;
  position: Vector3;
  velocity: Vector3;
  size: { width: number; height: number; depth: number };
  patrolBounds: { left: number; right: number };
  direction: 1 | -1;
  isGrounded: boolean;
  isAlive: boolean;
}

export interface Trigger {
  id: string;
  type: string;
  position: Vector3;
  size: { width: number; height: number; depth: number };
  message?: string;
  action?: string;
}
