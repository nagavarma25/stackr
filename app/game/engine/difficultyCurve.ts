import { MAX_SPEED, STARTING_SPEED, SPEED_RAMP_PER_BLOCK } from '../constants';

// Logarithmic ramp: fast early growth that flattens out, so the game gets
// hard quickly but doesn't become physically un-tappable at high scores.
export function getSpeedForHeight(blockCount: number): number {
  const raw = STARTING_SPEED + SPEED_RAMP_PER_BLOCK * Math.log2(blockCount + 1) * 4;
  return Math.min(raw, MAX_SPEED);
}
