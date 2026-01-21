import { LevelData, ParsedLevel, Platform, Enemy, Trigger } from '../data/types/level';

/**
 * Parses level data from the declarative format into the format the game engine uses
 * @param levelData - The level data to parse
 * @returns Parsed level with platforms, enemies, and triggers
 */
export function parseLevelData(levelData: LevelData): ParsedLevel {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const triggers: Trigger[] = [];

  // Parse all sections in the level
  Object.entries(levelData.sections).forEach(([sectionName, section]) => {
    // Parse platforms
    if (section.platforms) {
      section.platforms.forEach((pData, idx) => {
        platforms.push({
          id: `${sectionName}-platform-${idx}`,
          position: {
            x: pData.pos[0],
            y: pData.pos[1],
            z: pData.pos[2]
          },
          size: {
            width: pData.size[0],
            height: pData.size[1],
            depth: pData.size[2]
          },
          color: pData.color,
          texture: pData.texture,
          tags: pData.tags || [],
          properties: pData.properties
        });
      });
    }

    // Parse enemies
    if (section.enemies) {
      section.enemies.forEach((eData, idx) => {
        const [x, y, z] = eData.pos;

        enemies.push({
          id: `${sectionName}-enemy-${idx}`,
          type: eData.type,
          position: { x, y, z },
          velocity: { x: 0, y: 0, z: 0 },
          size: { width: 0.8, height: 0.8, depth: 0.8 },
          patrolBounds: eData.patrol
            ? { left: eData.patrol[0], right: eData.patrol[1] }
            : { left: x - 1, right: x + 1 }, // Default patrol range
          direction: 1,
          isGrounded: false,
          isAlive: true
        });
      });
    }

    // Parse triggers
    if (section.triggers) {
      section.triggers.forEach((tData, idx) => {
        triggers.push({
          id: `${sectionName}-trigger-${idx}`,
          type: tData.type,
          position: {
            x: tData.pos[0],
            y: tData.pos[1],
            z: tData.pos[2]
          },
          size: tData.size
            ? {
                width: tData.size[0],
                height: tData.size[1],
                depth: tData.size[2]
              }
            : { width: 1, height: 1, depth: 1 }, // Default trigger size
          message: tData.message,
          action: tData.action
        });
      });
    }
  });

  return {
    platforms,
    enemies,
    triggers,
    playerSpawn: levelData.playerSpawn,
    backgroundColor: levelData.backgroundColor
  };
}

/**
 * Get level data by level number
 * @param levelNum - The level number (1-based)
 * @returns The level data, or null if not found
 */
export function getLevelData(levelNum: number): LevelData | null {
  try {
    // Dynamic import would go here, but for simplicity we'll use static imports
    // in the game store. This function exists for future extensibility.
    return null;
  } catch (error) {
    console.error(`Failed to load level ${levelNum}:`, error);
    return null;
  }
}

/**
 * Validates that level data has all required fields
 * @param levelData - The level data to validate
 * @returns True if valid, false otherwise
 */
export function validateLevelData(levelData: LevelData): boolean {
  if (!levelData.id || !levelData.name || !levelData.playerSpawn) {
    console.error('Level data missing required fields');
    return false;
  }

  if (!levelData.sections || Object.keys(levelData.sections).length === 0) {
    console.error('Level data has no sections');
    return false;
  }

  return true;
}
