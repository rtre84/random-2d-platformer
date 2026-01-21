import { LevelData } from '../types/level';

export const level2: LevelData = {
  id: 2,
  name: "Advanced Techniques",

  // Player starting position
  playerSpawn: { x: 0, y: -3, z: 0 },

  // Visual settings
  backgroundColor: "#87CEEB",

  // Level 2 includes all of Level 1 + additional challenging sections
  sections: {
    // Reuse Level 1 ground
    ground: {
      platforms: [
        { pos: [0, -5, 0], size: [20, 1, 2], color: "#8B4513", texture: "/textures/wood.jpg" }
      ]
    },

    // Higher wall jump challenges
    highWallJump: {
      platforms: [
        { pos: [-8, 12, 0], size: [2, 1, 2], color: "#DDA0DD", texture: "/textures/asphalt.png" },
        { pos: [0, 13, 0], size: [3, 1, 2], color: "#F39C12", texture: "/textures/sand.jpg" },
        { pos: [9, 15, 0], size: [2, 1, 2], color: "#E74C3C", texture: "/textures/asphalt.png" }
      ],
      enemies: [
        // Enemy on middle high platform
        { type: "patrol", pos: [0, 14, 0], patrol: [-1.5, 1.5] }
      ]
    },

    // Expert dash + double jump combination
    extremeDash: {
      platforms: [
        { pos: [20, 5, 0], size: [2, 1, 2], color: "#E17055", texture: "/textures/asphalt.png" },
        { pos: [25, 8, 0], size: [2, 1, 2], color: "#D63031", texture: "/textures/asphalt.png", tags: ["expert"] }
      ],
      enemies: [
        // Enemy on expert platform - ultimate challenge
        { type: "patrol", pos: [20, 6, 0], patrol: [19, 21] }
      ],
      triggers: [
        { type: "hint", pos: [22, 6, 0], message: "Dash + Double Jump required!" }
      ]
    },

    // Triple wall jump challenge - tallest tower
    tripleWallJump: {
      platforms: [
        { pos: [-15, 8, 0], size: [1, 10, 2], color: "#6C5CE7", texture: "/textures/asphalt.png", tags: ["wall"] },
        { pos: [-12, 8, 0], size: [1, 10, 2], color: "#A29BFE", texture: "/textures/asphalt.png", tags: ["wall"] },
        { pos: [-13.5, 17, 0], size: [2, 1, 2], color: "#FFEAA7", texture: "/textures/sand.jpg" }
      ],
      enemies: [
        // Enemy at the summit
        { type: "patrol", pos: [-13.5, 18, 0], patrol: [-14.5, -12.5] }
      ]
    },

    // Right wall jump tower reward platform
    towerReward: {
      platforms: [
        { pos: [15, 11, 0], size: [2, 1, 2], color: "#FD79A8" }
      ],
      enemies: [
        // Final enemy on tower
        { type: "patrol", pos: [15, 11, 0], patrol: [14, 16] }
      ]
    },

    // Level 2 Goal - highest point
    level2Goal: {
      platforms: [
        { pos: [0, 20, 0], size: [4, 1, 2], color: "#FFD700", texture: "/textures/sand.jpg", tags: ["goal"] }
      ],
      triggers: [
        { type: "levelComplete", pos: [0, 21, 0], size: [4, 2, 2], action: "victory" }
      ]
    }
  }
};
