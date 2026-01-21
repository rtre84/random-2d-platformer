import { describe, it, expect } from 'vitest';
import {
  getAnimationState,
  calculateFrameIndex,
  calculateUVOffset,
  getFacingDirection
} from '../spriteAnimation';
import { SPRITE_SHEETS } from '../../data/spriteConfig';

describe('Sprite Animation System', () => {
  describe('getAnimationState', () => {
    it('should return "dash" when isDashing is true (highest priority)', () => {
      const result = getAnimationState(
        true,  // isGrounded
        10,    // velocityX
        5,     // velocityY
        true   // isDashing
      );
      expect(result).toBe('dash');
    });

    it('should return "jump" when airborne and ascending', () => {
      const result = getAnimationState(
        false, // isGrounded (airborne)
        5,     // velocityX
        5,     // velocityY (positive = ascending)
        false  // isDashing
      );
      expect(result).toBe('jump');
    });

    it('should return "fall" when airborne and descending', () => {
      const result = getAnimationState(
        false, // isGrounded (airborne)
        5,     // velocityX
        -5,    // velocityY (negative = descending)
        false  // isDashing
      );
      expect(result).toBe('fall');
    });

    it('should return "run" when grounded and moving', () => {
      const result = getAnimationState(
        true,  // isGrounded
        5,     // velocityX (above 0.5 threshold)
        0,     // velocityY
        false  // isDashing
      );
      expect(result).toBe('run');
    });

    it('should return "idle" when grounded and stationary', () => {
      const result = getAnimationState(
        true,  // isGrounded
        0.2,   // velocityX (below 0.5 threshold)
        0,     // velocityY
        false  // isDashing
      );
      expect(result).toBe('idle');
    });

    it('should use velocity threshold of 0.5 for run/idle', () => {
      const justBelow = getAnimationState(true, 0.49, 0, false);
      const justAbove = getAnimationState(true, 0.51, 0, false);

      expect(justBelow).toBe('idle');
      expect(justAbove).toBe('run');
    });

    it('should return "idle" for negative velocity below threshold', () => {
      const result = getAnimationState(
        true,
        -0.3,  // Small negative velocity
        0,
        false
      );
      expect(result).toBe('idle');
    });

    it('should return "run" for negative velocity above threshold', () => {
      const result = getAnimationState(
        true,
        -5,    // Large negative velocity (moving left)
        0,
        false
      );
      expect(result).toBe('run');
    });

    it('should prioritize dash over all other states', () => {
      const result = getAnimationState(
        false, // airborne
        10,    // high velocity
        10,    // ascending
        true   // dashing
      );
      expect(result).toBe('dash');
    });

    it('should handle zero velocity correctly', () => {
      const result = getAnimationState(
        true,
        0,
        0,
        false
      );
      expect(result).toBe('idle');
    });
  });

  describe('calculateFrameIndex', () => {
    const spriteData = {
      frameCount: 8,
      framesPerRow: 8,
      frameWidth: 32,
      frameHeight: 32,
      frameDuration: 0.1 // 10 FPS
    };

    it('should return frame 0 at time 0', () => {
      const result = calculateFrameIndex(0, spriteData);
      expect(result).toBe(0);
    });

    it('should advance frame based on elapsed time', () => {
      const result = calculateFrameIndex(0.15, spriteData); // 1.5 frames in
      expect(result).toBe(1); // Should be on frame 1
    });

    it('should loop animation correctly', () => {
      // Total animation time = 8 frames * 0.1s = 0.8s
      const result = calculateFrameIndex(0.85, spriteData); // Just past one loop
      expect(result).toBe(0); // Should be back at frame 0
    });

    it('should handle exact frame boundaries', () => {
      const frame2 = calculateFrameIndex(0.2, spriteData); // Exactly 2 frames
      const frame5 = calculateFrameIndex(0.5, spriteData); // Exactly 5 frames

      expect(frame2).toBe(2);
      expect(frame5).toBe(5);
    });

    it('should clamp to last frame', () => {
      const result = calculateFrameIndex(0.75, spriteData); // 7.5 frames in
      expect(result).toBe(7); // Last frame (0-indexed)
      expect(result).toBeLessThan(spriteData.frameCount);
    });

    it('should handle very small time increments', () => {
      const result = calculateFrameIndex(0.01, spriteData);
      expect(result).toBe(0);
    });

    it('should handle multiple loops', () => {
      // Total animation time = 8 frames * 0.1s = 0.8s per loop
      // Test with time > 1 loop to ensure proper looping
      const result = calculateFrameIndex(2.0, spriteData);
      // Should loop correctly and return a valid frame index
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(spriteData.frameCount);
    });
  });

  describe('calculateUVOffset', () => {
    const spriteData = {
      frameCount: 8,
      framesPerRow: 8,
      frameWidth: 32,
      frameHeight: 32,
      frameDuration: 0.1
    };

    it('should calculate correct offset for first frame', () => {
      const result = calculateUVOffset(0, spriteData);

      expect(result.offsetX).toBe(0);
      expect(result.offsetY).toBe(0);
      expect(result.repeatX).toBe(1 / 8); // 0.125
      expect(result.repeatY).toBe(1);
    });

    it('should calculate correct offset for middle frame', () => {
      const result = calculateUVOffset(4, spriteData);

      expect(result.offsetX).toBe(0.5); // 4 / 8
      expect(result.offsetY).toBe(0);
      expect(result.repeatX).toBe(1 / 8);
      expect(result.repeatY).toBe(1);
    });

    it('should calculate correct offset for last frame', () => {
      const result = calculateUVOffset(7, spriteData);

      expect(result.offsetX).toBe(7 / 8); // 0.875
      expect(result.offsetY).toBe(0);
      expect(result.repeatX).toBe(1 / 8);
      expect(result.repeatY).toBe(1);
    });

    it('should have consistent repeatX across all frames', () => {
      const frame0 = calculateUVOffset(0, spriteData);
      const frame3 = calculateUVOffset(3, spriteData);
      const frame7 = calculateUVOffset(7, spriteData);

      expect(frame0.repeatX).toBe(frame3.repeatX);
      expect(frame3.repeatX).toBe(frame7.repeatX);
    });

    it('should have repeatY always be 1 for single-row sprite sheets', () => {
      for (let i = 0; i < spriteData.frameCount; i++) {
        const result = calculateUVOffset(i, spriteData);
        expect(result.repeatY).toBe(1);
      }
    });
  });

  describe('getFacingDirection', () => {
    it('should change to "right" when moving right', () => {
      const result = getFacingDirection(
        5,      // velocityX (positive)
        'left'  // currentDirection
      );
      expect(result).toBe('right');
    });

    it('should change to "left" when moving left', () => {
      const result = getFacingDirection(
        -5,     // velocityX (negative)
        'right' // currentDirection
      );
      expect(result).toBe('left');
    });

    it('should maintain current direction when stationary', () => {
      const stayingLeft = getFacingDirection(
        0.05,  // Very small velocity
        'left'
      );
      const stayingRight = getFacingDirection(
        0.05,
        'right'
      );

      expect(stayingLeft).toBe('left');
      expect(stayingRight).toBe('right');
    });

    it('should use threshold of 0.1', () => {
      const justBelow = getFacingDirection(0.09, 'left');
      const justAbove = getFacingDirection(0.11, 'left');

      expect(justBelow).toBe('left');  // Maintains direction
      expect(justAbove).toBe('right'); // Changes direction
    });

    it('should handle negative velocity threshold', () => {
      const justBelow = getFacingDirection(-0.09, 'right');
      const justAbove = getFacingDirection(-0.11, 'right');

      expect(justBelow).toBe('right'); // Maintains direction
      expect(justAbove).toBe('left');  // Changes direction
    });

    it('should handle exact zero velocity', () => {
      const leftResult = getFacingDirection(0, 'left');
      const rightResult = getFacingDirection(0, 'right');

      expect(leftResult).toBe('left');
      expect(rightResult).toBe('right');
    });
  });

  describe('Sprite Configuration', () => {
    it('should have configuration for all animation states', () => {
      expect(SPRITE_SHEETS.idle).toBeDefined();
      expect(SPRITE_SHEETS.run).toBeDefined();
      expect(SPRITE_SHEETS.jump).toBeDefined();
      expect(SPRITE_SHEETS.fall).toBeDefined();
      expect(SPRITE_SHEETS.dash).toBeDefined();
    });

    it('should have valid frame counts', () => {
      Object.values(SPRITE_SHEETS).forEach(sheet => {
        expect(sheet.frameCount).toBeGreaterThan(0);
        expect(sheet.framesPerRow).toBeGreaterThan(0);
        expect(sheet.frameCount).toBeGreaterThanOrEqual(sheet.framesPerRow);
      });
    });

    it('should have positive frame durations', () => {
      Object.values(SPRITE_SHEETS).forEach(sheet => {
        expect(sheet.frameDuration).toBeGreaterThan(0);
      });
    });

    it('should have dash animation faster than run', () => {
      expect(SPRITE_SHEETS.dash.frameDuration).toBeLessThan(
        SPRITE_SHEETS.run.frameDuration
      );
    });

    it('should have consistent frame dimensions', () => {
      Object.values(SPRITE_SHEETS).forEach(sheet => {
        expect(sheet.frameWidth).toBe(32);
        expect(sheet.frameHeight).toBe(32);
      });
    });
  });
});
