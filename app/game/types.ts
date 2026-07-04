export type GamePhase = 'idle' | 'playing' | 'gameover';

export interface Block {
  id: number;
  tier: number; // vertical index, 0 = base block
  x: number; // left offset in px
  width: number; // px
  isPerfect?: boolean;
}

export interface FallingOffcut {
  id: number;
  tier: number;
  x: number;
  width: number;
  direction: 'left' | 'right';
}

export interface GameState {
  phase: GamePhase;
  blocks: Block[]; // placed blocks, base included
  currentWidth: number; // width of the block in flight
  direction: 1 | -1;
  speed: number; // px/sec, ramps with height
  score: number;
  combo: number; // consecutive perfect placements
  best: number; // loaded from storage
  lastOffcut: FallingOffcut | null;
  lastWasPerfect: boolean;
}

export type GameAction =
  | { type: 'START' }
  | { type: 'TAP'; movingX: number }
  | { type: 'SET_BEST'; best: number }
  | { type: 'RESET' };
