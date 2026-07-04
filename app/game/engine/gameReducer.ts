import { GameAction, GameState, FallingOffcut } from '../types';
import { COMBO_PERFECT_BONUS, MIN_BLOCK_WIDTH_GAMEOVER, PERFECT_THRESHOLD_PX, STARTING_BLOCK_WIDTH, STARTING_SPEED } from '../constants';
import { computeOverlap } from './stackMath';
import { getSpeedForHeight } from './difficultyCurve';

// Coordinate frame: x=0 is the horizontal center of the play area. Block.x is
// the left edge of the block relative to that center, so rendering just adds
// half the screen width.

export function createInitialState(best: number): GameState {
  return {
    phase: 'idle',
    blocks: [
      { id: 0, tier: 0, x: -STARTING_BLOCK_WIDTH / 2, width: STARTING_BLOCK_WIDTH },
    ],
    currentWidth: STARTING_BLOCK_WIDTH,
    direction: 1,
    speed: STARTING_SPEED,
    score: 0,
    combo: 0,
    best,
    lastOffcut: null,
    lastWasPerfect: false,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START': {
      return {
        ...createInitialState(state.best),
        phase: 'playing',
      };
    }

    case 'SET_BEST': {
      return { ...state, best: action.best };
    }

    case 'RESET': {
      return createInitialState(state.best);
    }

    case 'TAP': {
      if (state.phase !== 'playing') return state;

      const base = state.blocks[state.blocks.length - 1];
      const moving = { x: action.movingX, width: state.currentWidth };

      const result = computeOverlap(moving, base, PERFECT_THRESHOLD_PX);

      if (!result.overlaps || result.newWidth < MIN_BLOCK_WIDTH_GAMEOVER) {
        const offcut: FallingOffcut | null = result.overlaps
          ? {
              id: base.tier + 1,
              tier: base.tier + 1,
              x: result.newX,
              width: result.newWidth,
              direction: result.newX < base.x ? 'left' : 'right',
            }
          : null;
        return {
          ...state,
          phase: 'gameover',
          lastOffcut: offcut,
          lastWasPerfect: false,
        };
      }

      const newTier = base.tier + 1;
      const newBlock = {
        id: newTier,
        tier: newTier,
        x: result.newX,
        width: result.newWidth,
        isPerfect: result.perfect,
      };

      const combo = result.perfect ? state.combo + 1 : 0;
      const scoreGain = 1 + (result.perfect ? COMBO_PERFECT_BONUS * combo : 0);

      const offcutSide = result.overhangLeft ?? result.overhangRight;
      const lastOffcut: FallingOffcut | null = offcutSide
        ? {
            id: newTier,
            tier: newTier,
            x: offcutSide.x,
            width: offcutSide.width,
            direction: result.overhangLeft ? 'left' : 'right',
          }
        : null;

      return {
        ...state,
        blocks: [...state.blocks, newBlock],
        currentWidth: result.newWidth,
        direction: state.direction === 1 ? -1 : 1,
        speed: getSpeedForHeight(newTier),
        score: state.score + scoreGain,
        combo,
        lastOffcut,
        lastWasPerfect: result.perfect,
      };
    }

    default:
      return state;
  }
}
