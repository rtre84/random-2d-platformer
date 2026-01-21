import { LevelData } from '../types/level';

export const level1: LevelData = {
  id: 1,
  name: "Basic Training",

  // Player starting position
  playerSpawn: { x: 0, y: -3, z: 0 },

  // Visual settings
  backgroundColor: "#87CEEB",

  // Level sections organized by gameplay purpose
  sections: {
    // Ground platform - main floor
    ground: {
      platforms: [
        { pos: [0, -5, 0], size: [20, 1, 2], color: "#8B4513", texture: "/textures/wood.jpg" }
      ]
    },

    // Starting area - basic jumps to learn controls
    starter: {
      platforms: [
        { pos: [-6, -3, 0], size: [3, 1, 2], color: "#4ECDC4", texture: "/textures/grass.png" },
        { pos: [2, -1, 0], size: [4, 1, 2], color: "#45B7D1", texture: "/textures/grass.png" },
        { pos: [-3, 1, 0], size: [2, 1, 2], color: "#96CEB4", texture: "/textures/grass.png" },
        { pos: [7, 2, 0], size: [3, 1, 2], color: "#FFEAA7", texture: "/textures/sand.jpg" }
      ],
      enemies: [
        // Enemy patrolling the starting platform
        { type: "patrol", pos: [2, 0, 0], patrol: [0.5, 5.5] },
        // Enemy on left platform
        { type: "patrol", pos: [-6, -2, 0], patrol: [-7.5, -4.5] }
      ]
    },

    // Wall jump tutorial - two vertical walls with platform on top
    wallJumpTutorial: {
      platforms: [
        { pos: [-9.5, 0, 0], size: [1, 6, 2], color: "#FF6B9D", texture: "/textures/asphalt.png", tags: ["wall"] },
        { pos: [-7.5, 0, 0], size: [1, 6, 2], color: "#C44569", texture: "/textures/asphalt.png", tags: ["wall"] },
        { pos: [-8.5, 5.5, 0], size: [2.5, 1, 2], color: "#F8B500", texture: "/textures/sand.jpg" }
      ],
      enemies: [
        // Enemy on top platform - reward for mastering wall jump
        { type: "patrol", pos: [-8.5, 6.5, 0], patrol: [-9.5, -7.5] }
      ]
    },

    // Dash gap challenge - requires dash to cross
    dashGap: {
      platforms: [
        { pos: [12, 0, 0], size: [2, 1, 2], color: "#A8E6CF", texture: "/textures/grass.png" },
        { pos: [18, 0, 0], size: [2.5, 1, 2], color: "#FFD3B6", texture: "/textures/sand.jpg" }
      ],
      enemies: [
        // Enemy on first platform - forces player to dash
        { type: "patrol", pos: [12, 1, 0], patrol: [11, 13] }
      ],
      triggers: [
        // Hint trigger at the gap
        { type: "hint", pos: [15, 1, 0], message: "Press Shift to dash across!" }
      ]
    },

    // Double jump platforms - ascending steps
    doubleJumpArea: {
      platforms: [
        { pos: [-1, 4, 0], size: [2, 1, 2], color: "#FFAAA5" },
        { pos: [3, 6, 0], size: [2, 1, 2], color: "#FF8B94" }
      ]
    },

    // Secret area - high platform requiring double jump + dash
    secretArea: {
      platforms: [
        { pos: [-4, 8, 0], size: [3, 1, 2], color: "#FFD700", texture: "/textures/sand.jpg", tags: ["secret", "goal"] }
      ],
      triggers: [
        // Goal trigger - touching this completes the level
        { type: "levelComplete", pos: [-4, 9, 0], size: [3, 2, 2], action: "nextLevel" }
      ]
    },

    // Right side wall jump tower - advanced wall jumping
    wallJumpTower: {
      platforms: [
        { pos: [13.5, 3, 0], size: [1, 8, 2], color: "#6C5CE7", texture: "/textures/asphalt.png", tags: ["wall"] },
        { pos: [16.5, 3, 0], size: [1, 8, 2], color: "#A29BFE", texture: "/textures/asphalt.png", tags: ["wall"] },
        { pos: [15, 10, 0], size: [2, 1, 2], color: "#FD79A8", texture: "/textures/wood.jpg" }
      ]
    },

    // Narrow precision platforms - tests movement control
    precisionPlatforms: {
      platforms: [
        { pos: [8, 5, 0], size: [1.5, 1, 2], color: "#74B9FF" },
        { pos: [5, 8, 0], size: [1.5, 1, 2], color: "#A29BFE" }
      ]
    },

    // Lower dash section - dash to the left
    lowerDashSection: {
      platforms: [
        { pos: [-12, -2, 0], size: [2, 1, 2], color: "#55EFC4" },
        { pos: [-17, -2, 0], size: [2.5, 1, 2], color: "#00B894" }
      ]
    },

    // Coyote time teaching platform - wide platform for walking off
    coyoteTimePlatform: {
      platforms: [
        { pos: [10, -3, 0], size: [4, 1, 2], color: "#81ECEC" }
      ],
      enemies: [
        // Enemy to make coyote time useful
        { type: "patrol", pos: [10, -2, 0], patrol: [8, 12] }
      ]
    },

    // Center ascending spiral - combines all movement mechanics
    centerSpiral: {
      platforms: [
        { pos: [0, 3, 0], size: [2, 1, 2], color: "#FAB1A0" },
        { pos: [-2, 5.5, 0], size: [2, 1, 2], color: "#FF7675" },
        { pos: [1, 9, 0], size: [2.5, 1, 2], color: "#FD79A8" }
      ],
      enemies: [
        // Enemy on middle platform
        { type: "patrol", pos: [0, 4, 0], patrol: [-1, 1] }
      ]
    }
  }
};
