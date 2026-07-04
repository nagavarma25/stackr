import { computeOverlap } from '../app/game/engine/stackMath';

const PERFECT_THRESHOLD = 6;

describe('computeOverlap', () => {
  it('returns a perfect match when the moving block exactly covers the base', () => {
    const base = { x: 0, width: 100 };
    const moving = { x: 0, width: 100 };
    const result = computeOverlap(moving, base, PERFECT_THRESHOLD);

    expect(result.overlaps).toBe(true);
    expect(result.perfect).toBe(true);
    expect(result.newX).toBe(0);
    expect(result.newWidth).toBe(100);
    expect(result.overhangLeft).toBeNull();
    expect(result.overhangRight).toBeNull();
  });

  it('treats near-exact alignment within the perfect threshold as perfect', () => {
    const base = { x: 0, width: 100 };
    const moving = { x: 3, width: 100 };
    const result = computeOverlap(moving, base, PERFECT_THRESHOLD);

    expect(result.perfect).toBe(true);
    expect(result.newWidth).toBe(100);
  });

  it('clips a left overhang when the moving block is shifted right', () => {
    const base = { x: 0, width: 100 };
    const moving = { x: 30, width: 100 };
    const result = computeOverlap(moving, base, PERFECT_THRESHOLD);

    expect(result.overlaps).toBe(true);
    expect(result.perfect).toBe(false);
    expect(result.newX).toBe(30);
    expect(result.newWidth).toBe(70);
    expect(result.overhangLeft).toBeNull();
    expect(result.overhangRight).toEqual({ x: 100, width: 30 });
  });

  it('clips a right overhang when the moving block is shifted left', () => {
    const base = { x: 0, width: 100 };
    const moving = { x: -30, width: 100 };
    const result = computeOverlap(moving, base, PERFECT_THRESHOLD);

    expect(result.overlaps).toBe(true);
    expect(result.perfect).toBe(false);
    expect(result.newX).toBe(0);
    expect(result.newWidth).toBe(70);
    expect(result.overhangLeft).toEqual({ x: -30, width: 30 });
    expect(result.overhangRight).toBeNull();
  });

  it('reports a miss when there is no overlap at all', () => {
    const base = { x: 0, width: 100 };
    const moving = { x: 150, width: 50 };
    const result = computeOverlap(moving, base, PERFECT_THRESHOLD);

    expect(result.overlaps).toBe(false);
    expect(result.newWidth).toBe(0);
    expect(result.overhangLeft).toBeNull();
    expect(result.overhangRight).toBeNull();
  });

  it('reports a miss at the exact boundary where overlap width is zero', () => {
    const base = { x: 0, width: 100 };
    const moving = { x: 100, width: 50 };
    const result = computeOverlap(moving, base, PERFECT_THRESHOLD);

    expect(result.overlaps).toBe(false);
  });
});
