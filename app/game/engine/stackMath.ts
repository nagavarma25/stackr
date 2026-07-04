// Pure overlap/collision math. No React or react-native imports so this stays
// trivially unit-testable and reusable if the rendering layer ever changes.

export interface HorizontalSpan {
  x: number;
  width: number;
}

export interface OverlapResult {
  overlaps: boolean;
  newX: number;
  newWidth: number;
  overhangLeft: HorizontalSpan | null;
  overhangRight: HorizontalSpan | null;
  perfect: boolean;
}

export function computeOverlap(
  moving: HorizontalSpan,
  base: HorizontalSpan,
  perfectThresholdPx: number
): OverlapResult {
  const movingRight = moving.x + moving.width;
  const baseRight = base.x + base.width;

  const overlapLeft = Math.max(moving.x, base.x);
  const overlapRight = Math.min(movingRight, baseRight);
  const overlapWidth = overlapRight - overlapLeft;

  if (overlapWidth <= 0) {
    return {
      overlaps: false,
      newX: moving.x,
      newWidth: 0,
      overhangLeft: null,
      overhangRight: null,
      perfect: false,
    };
  }

  const leftDiff = Math.abs(moving.x - base.x);
  const rightDiff = Math.abs(movingRight - baseRight);
  const perfect = leftDiff <= perfectThresholdPx && rightDiff <= perfectThresholdPx;

  const overhangLeft =
    moving.x < overlapLeft ? { x: moving.x, width: overlapLeft - moving.x } : null;
  const overhangRight =
    movingRight > overlapRight ? { x: overlapRight, width: movingRight - overlapRight } : null;

  return {
    overlaps: true,
    newX: perfect ? base.x : overlapLeft,
    newWidth: perfect ? base.width : overlapWidth,
    overhangLeft,
    overhangRight,
    perfect,
  };
}
