import { useCallback, useEffect, useReducer, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { createInitialState, gameReducer } from '../engine/gameReducer';
import { useBestScore } from './useBestScore';

export function useGameLoop() {
  const { best, loaded, submitScore } = useBestScore();
  const [state, dispatch] = useReducer(gameReducer, 0, createInitialState);
  const prevBlockCount = useRef(state.blocks.length);
  const prevPhase = useRef(state.phase);
  const bestAtRunStart = useRef(best);

  useEffect(() => {
    if (loaded) dispatch({ type: 'SET_BEST', best });
  }, [loaded, best]);

  // Fires once per successful drop (blocks array grows by one).
  useEffect(() => {
    if (state.blocks.length > prevBlockCount.current) {
      if (state.lastWasPerfect) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
    prevBlockCount.current = state.blocks.length;
  }, [state.blocks.length, state.lastWasPerfect]);

  // Fires once on the playing -> gameover transition.
  useEffect(() => {
    if (prevPhase.current !== 'gameover' && state.phase === 'gameover') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      submitScore(state.score);
    }
    prevPhase.current = state.phase;
  }, [state.phase, state.score, submitScore]);

  const start = useCallback(() => {
    bestAtRunStart.current = best;
    dispatch({ type: 'START' });
  }, [best]);
  const tap = useCallback((movingX: number) => dispatch({ type: 'TAP', movingX }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const isNewBest = state.phase === 'gameover' && state.score > bestAtRunStart.current;

  return { state, best, isNewBest, start, tap, reset };
}
