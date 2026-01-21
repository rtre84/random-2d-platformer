import { describe, it, expect } from 'vitest';
import { parseLevelData, validateLevelData } from '../levelParser';
import type { LevelData } from '../../data/types/level';

describe('Level Parser', () => {
  describe('parseLevelData', () => {
    it('should parse platforms with correct position transformation', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          testSection: {
            platforms: [
              { pos: [5, 10, 0], size: [2, 1, 2], color: "#FF0000" }
            ]
          }
        }
      };

      const result = parseLevelData(mockLevel);

      expect(result.platforms).toHaveLength(1);
      expect(result.platforms[0].position).toEqual({ x: 5, y: 10, z: 0 });
      expect(result.platforms[0].size).toEqual({ width: 2, height: 1, depth: 2 });
      expect(result.platforms[0].color).toBe("#FF0000");
    });

    it('should generate unique IDs for platforms', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          section1: {
            platforms: [
              { pos: [0, 0, 0], size: [1, 1, 1], color: "#FF0000" },
              { pos: [5, 5, 0], size: [1, 1, 1], color: "#00FF00" }
            ]
          },
          section2: {
            platforms: [
              { pos: [10, 10, 0], size: [1, 1, 1], color: "#0000FF" }
            ]
          }
        }
      };

      const result = parseLevelData(mockLevel);

      expect(result.platforms).toHaveLength(3);
      expect(result.platforms[0].id).toBe("section1-platform-0");
      expect(result.platforms[1].id).toBe("section1-platform-1");
      expect(result.platforms[2].id).toBe("section2-platform-0");

      // All IDs should be unique
      const ids = result.platforms.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should parse enemies with default patrol bounds', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          testSection: {
            enemies: [
              { type: "patrol", pos: [5, 5, 0] }
            ]
          }
        }
      };

      const result = parseLevelData(mockLevel);

      expect(result.enemies).toHaveLength(1);
      expect(result.enemies[0].position).toEqual({ x: 5, y: 5, z: 0 });
      expect(result.enemies[0].type).toBe("patrol");
      expect(result.enemies[0].patrolBounds).toEqual({ left: 4, right: 6 }); // Default ±1
      expect(result.enemies[0].isAlive).toBe(true);
    });

    it('should parse enemies with custom patrol bounds', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          testSection: {
            enemies: [
              { type: "patrol", pos: [10, 0, 0], patrol: [5, 15] }
            ]
          }
        }
      };

      const result = parseLevelData(mockLevel);

      expect(result.enemies[0].patrolBounds).toEqual({ left: 5, right: 15 });
    });

    it('should generate unique IDs for enemies', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          section1: {
            enemies: [
              { type: "patrol", pos: [0, 0, 0] },
              { type: "flying", pos: [5, 5, 0] }
            ]
          }
        }
      };

      const result = parseLevelData(mockLevel);

      expect(result.enemies).toHaveLength(2);
      expect(result.enemies[0].id).toBe("section1-enemy-0");
      expect(result.enemies[1].id).toBe("section1-enemy-1");
    });

    it('should parse triggers with default sizes', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          testSection: {
            triggers: [
              { type: "levelComplete", pos: [0, 5, 0], action: "nextLevel" }
            ]
          }
        }
      };

      const result = parseLevelData(mockLevel);

      expect(result.triggers).toHaveLength(1);
      expect(result.triggers[0].type).toBe("levelComplete");
      expect(result.triggers[0].position).toEqual({ x: 0, y: 5, z: 0 });
      expect(result.triggers[0].size).toEqual({ width: 1, height: 1, depth: 1 });
      expect(result.triggers[0].action).toBe("nextLevel");
    });

    it('should parse triggers with custom sizes', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          testSection: {
            triggers: [
              { type: "checkpoint", pos: [0, 0, 0], size: [5, 10, 2], message: "Checkpoint!" }
            ]
          }
        }
      };

      const result = parseLevelData(mockLevel);

      expect(result.triggers[0].size).toEqual({ width: 5, height: 10, depth: 2 });
      expect(result.triggers[0].message).toBe("Checkpoint!");
    });

    it('should handle empty sections', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          emptySection: {}
        }
      };

      const result = parseLevelData(mockLevel);

      expect(result.platforms).toHaveLength(0);
      expect(result.enemies).toHaveLength(0);
      expect(result.triggers).toHaveLength(0);
      expect(result.playerSpawn).toEqual({ x: 0, y: -3, z: 0 });
    });

    it('should pass through platform tags', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          testSection: {
            platforms: [
              { pos: [0, 0, 0], size: [1, 1, 1], color: "#FF0000", tags: ["wall", "hazard"] }
            ]
          }
        }
      };

      const result = parseLevelData(mockLevel);

      expect(result.platforms[0].tags).toEqual(["wall", "hazard"]);
    });

    it('should handle platforms without tags', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          testSection: {
            platforms: [
              { pos: [0, 0, 0], size: [1, 1, 1], color: "#FF0000" }
            ]
          }
        }
      };

      const result = parseLevelData(mockLevel);

      expect(result.platforms[0].tags).toEqual([]);
    });

    it('should pass through platform properties', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          testSection: {
            platforms: [
              {
                pos: [0, 0, 0],
                size: [1, 1, 1],
                color: "#FF0000",
                properties: { bouncy: true, damage: 10 }
              }
            ]
          }
        }
      };

      const result = parseLevelData(mockLevel);

      expect(result.platforms[0].properties).toEqual({ bouncy: true, damage: 10 });
    });

    it('should pass through background color', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        backgroundColor: "#87CEEB",
        sections: {}
      };

      const result = parseLevelData(mockLevel);

      expect(result.backgroundColor).toBe("#87CEEB");
    });

    it('should parse multiple sections with mixed content', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          ground: {
            platforms: [
              { pos: [0, -5, 0], size: [20, 1, 2], color: "#8B4513" }
            ]
          },
          enemies: {
            enemies: [
              { type: "patrol", pos: [5, 0, 0], patrol: [0, 10] },
              { type: "flying", pos: [10, 5, 0] }
            ]
          },
          goals: {
            triggers: [
              { type: "levelComplete", pos: [15, 10, 0], action: "victory" }
            ]
          }
        }
      };

      const result = parseLevelData(mockLevel);

      expect(result.platforms).toHaveLength(1);
      expect(result.enemies).toHaveLength(2);
      expect(result.triggers).toHaveLength(1);
    });

    it('should set default enemy size', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          testSection: {
            enemies: [{ type: "patrol", pos: [0, 0, 0] }]
          }
        }
      };

      const result = parseLevelData(mockLevel);

      expect(result.enemies[0].size).toEqual({ width: 0.8, height: 0.8, depth: 0.8 });
    });

    it('should initialize enemy velocity to zero', () => {
      const mockLevel: LevelData = {
        id: 1,
        name: "Test Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          testSection: {
            enemies: [{ type: "patrol", pos: [0, 0, 0] }]
          }
        }
      };

      const result = parseLevelData(mockLevel);

      expect(result.enemies[0].velocity).toEqual({ x: 0, y: 0, z: 0 });
      expect(result.enemies[0].direction).toBe(1);
      expect(result.enemies[0].isGrounded).toBe(false);
    });
  });

  describe('validateLevelData', () => {
    it('should return true for valid level data', () => {
      const validLevel: LevelData = {
        id: 1,
        name: "Valid Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {
          ground: {
            platforms: [{ pos: [0, 0, 0], size: [1, 1, 1], color: "#FF0000" }]
          }
        }
      };

      expect(validateLevelData(validLevel)).toBe(true);
    });

    it('should return false when id is missing', () => {
      const invalidLevel = {
        name: "No ID Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: { ground: {} }
      } as LevelData;

      expect(validateLevelData(invalidLevel)).toBe(false);
    });

    it('should return false when name is missing', () => {
      const invalidLevel = {
        id: 1,
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: { ground: {} }
      } as LevelData;

      expect(validateLevelData(invalidLevel)).toBe(false);
    });

    it('should return false when playerSpawn is missing', () => {
      const invalidLevel = {
        id: 1,
        name: "No Spawn Level",
        sections: { ground: {} }
      } as LevelData;

      expect(validateLevelData(invalidLevel)).toBe(false);
    });

    it('should return false when sections is missing', () => {
      const invalidLevel = {
        id: 1,
        name: "No Sections Level",
        playerSpawn: { x: 0, y: -3, z: 0 }
      } as LevelData;

      expect(validateLevelData(invalidLevel)).toBe(false);
    });

    it('should return false when sections is empty object', () => {
      const invalidLevel: LevelData = {
        id: 1,
        name: "Empty Sections Level",
        playerSpawn: { x: 0, y: -3, z: 0 },
        sections: {}
      };

      expect(validateLevelData(invalidLevel)).toBe(false);
    });

    it('should return true for level with minimal valid sections', () => {
      const validLevel: LevelData = {
        id: 2,
        name: "Minimal Level",
        playerSpawn: { x: 5, y: 10, z: 0 },
        sections: {
          start: {} // Empty section is OK as long as sections object exists
        }
      };

      expect(validateLevelData(validLevel)).toBe(true);
    });

    it('should accept valid level with all optional fields', () => {
      const fullLevel: LevelData = {
        id: 3,
        name: "Full Level",
        playerSpawn: { x: 0, y: 0, z: 0 },
        backgroundColor: "#000000",
        cameraLimits: { minX: -10, maxX: 10, minY: -10, maxY: 10 },
        sections: {
          main: {
            platforms: [{ pos: [0, 0, 0], size: [1, 1, 1], color: "#FFFFFF" }],
            enemies: [{ type: "patrol", pos: [0, 0, 0] }],
            triggers: [{ type: "checkpoint", pos: [0, 0, 0] }],
            collectibles: [{ type: "coin", pos: [0, 0, 0] }]
          }
        }
      };

      expect(validateLevelData(fullLevel)).toBe(true);
    });
  });
});
