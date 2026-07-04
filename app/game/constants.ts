// Single source of truth for gameplay balance. Tweak here, not in components.

export const BLOCK_HEIGHT = 40; // px, vertical size of each placed block
export const STARTING_BLOCK_WIDTH = 220; // px
export const BASE_BLOCK_HEIGHT = 60; // px, the static base block at the bottom
export const STACK_BASE_BOTTOM = 140; // px, distance from screen bottom to tier 0

export const STARTING_SPEED = 160; // px/sec
export const MAX_SPEED = 520; // px/sec cap
export const SPEED_RAMP_PER_BLOCK = 6; // px/sec added per block placed (linear term)

export const PERFECT_THRESHOLD_PX = 6; // tolerance for "perfect" alignment
export const MIN_BLOCK_WIDTH_GAMEOVER = 8; // clipped width below this -> treat as a miss
export const COMBO_PERFECT_BONUS = 2; // extra score per consecutive perfect stack

export const VISIBLE_BLOCKS_BEFORE_PAN = 5; // stack height at which the camera starts panning

export const SQUASH_DURATION_MS = 60;
export const PARTICLE_COUNT = 8;
export const PARTICLE_DURATION_MS = 400;
export const SHAKE_DISTANCE_PX = 6;

export interface ColorStop {
  atScore: number;
  top: string;
  bottom: string;
}

// Dark "neon arcade" theme (per ui-ux-pro-max design system: Gaming palette +
// Gaming Bold typography). Background deepens and shifts hue as the tower grows.
export const BACKGROUND_COLOR_STOPS: ColorStop[] = [
  { atScore: 0, top: '#1E1B4B', bottom: '#0F0F23' },
  { atScore: 15, top: '#312E81', bottom: '#1E1B4B' },
  { atScore: 30, top: '#4C1D95', bottom: '#1E1B4B' },
  { atScore: 50, top: '#7C3AED', bottom: '#2E1065' },
];

export const COLORS = {
  primary: '#7C3AED', // neon violet
  secondary: '#A78BFA',
  accent: '#F43F5E', // rose action/CTA
  gold: '#FACC15', // perfect-stack / best-score highlight
  destructive: '#EF4444',
  textPrimary: '#F8FAFC',
  textSecondary: 'rgba(248, 250, 252, 0.7)',
  surface: '#1E1C35',
  border: 'rgba(255, 255, 255, 0.12)',
  movingBlock: '#E2E8F0',
};

export const BLOCK_PALETTE = [
  '#7C3AED', // violet
  '#F43F5E', // rose
  '#22D3EE', // cyan
  '#FACC15', // amber
  '#34D399', // emerald
  '#FB923C', // orange
];

export const FONTS = {
  display: 'RussoOne_400Regular', // titles, score, big numbers
  body: 'ChakraPetch_500Medium', // labels, buttons, secondary text
  bodyBold: 'ChakraPetch_700Bold',
};
