// Sprite sheet configuration for player animations
// Based on Pixel Adventure asset pack (32x32 frames)

export type AnimationState = 'idle' | 'run' | 'jump' | 'fall' | 'dash';

export interface SpriteSheetData {
  frameCount: number;
  framesPerRow: number;
  frameWidth: number;
  frameHeight: number;
  frameDuration: number; // seconds per frame
}

export const SPRITE_SHEETS: Record<AnimationState, SpriteSheetData> = {
  idle: {
    frameCount: 11,      // Pixel Adventure Idle has 11 frames
    framesPerRow: 11,
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 0.1   // 10 FPS
  },
  run: {
    frameCount: 12,      // Pixel Adventure Run has 12 frames
    framesPerRow: 12,
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 0.08  // 12.5 FPS - faster for running
  },
  jump: {
    frameCount: 1,       // Pixel Adventure Jump is single frame
    framesPerRow: 1,
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 0.1
  },
  fall: {
    frameCount: 1,       // Pixel Adventure Fall is single frame
    framesPerRow: 1,
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 0.1
  },
  dash: {
    frameCount: 12,      // Reuse run animation but faster
    framesPerRow: 12,
    frameWidth: 32,
    frameHeight: 32,
    frameDuration: 0.04  // 25 FPS - very fast for dash
  }
};
