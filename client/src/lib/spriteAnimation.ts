import { AnimationState, SpriteSheetData } from '../data/spriteConfig';

/**
 * Determines which animation state to play based on game state
 */
export function getAnimationState(
  isGrounded: boolean,
  velocityX: number,
  velocityY: number,
  isDashing: boolean
): AnimationState {
  // Priority 1: Dash overrides everything
  if (isDashing) {
    return 'dash';
  }

  // Priority 2: Airborne states (jump/fall)
  if (!isGrounded) {
    // Ascending = jump, descending = fall
    return velocityY > 0 ? 'jump' : 'fall';
  }

  // Priority 3: Ground movement states
  // Moving horizontally = run, stationary = idle
  const isMoving = Math.abs(velocityX) > 0.5;
  return isMoving ? 'run' : 'idle';
}

/**
 * Calculates the current frame index based on elapsed time
 */
export function calculateFrameIndex(
  elapsedTime: number,
  spriteSheetData: SpriteSheetData
): number {
  const { frameCount, frameDuration } = spriteSheetData;

  // Calculate which frame we should be on
  const totalAnimationTime = frameCount * frameDuration;
  const normalizedTime = elapsedTime % totalAnimationTime;
  const frameIndex = Math.floor(normalizedTime / frameDuration);

  // Clamp to valid range
  return Math.min(frameIndex, frameCount - 1);
}

/**
 * Calculates UV offset for displaying a specific frame from a sprite sheet
 * Assumes horizontal sprite sheet (all frames in one row)
 */
export function calculateUVOffset(
  frameIndex: number,
  spriteSheetData: SpriteSheetData
): { offsetX: number; offsetY: number; repeatX: number; repeatY: number } {
  const { frameCount, framesPerRow } = spriteSheetData;

  // For single-row sprite sheets (most common)
  const repeatX = 1 / frameCount;
  const repeatY = 1;
  const offsetX = frameIndex * repeatX;
  const offsetY = 0;

  return {
    offsetX,
    offsetY,
    repeatX,
    repeatY
  };
}

/**
 * Determines facing direction based on velocity
 */
export function getFacingDirection(
  velocityX: number,
  currentDirection: 'left' | 'right'
): 'left' | 'right' {
  // Only update direction if actually moving
  if (Math.abs(velocityX) > 0.1) {
    return velocityX < 0 ? 'left' : 'right';
  }

  // Maintain current direction when stationary
  return currentDirection;
}
