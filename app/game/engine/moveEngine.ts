import { useEffect } from 'react';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
  SharedValue,
} from 'react-native-reanimated';

// Drives the swinging block's horizontal position on the UI thread so it
// stays smooth regardless of JS-thread load. Restarts (from the left edge)
// whenever speed or amplitude change, i.e. after every successful drop.
export function useMovingBlockX(speed: number, amplitude: number, active: boolean): SharedValue<number> {
  const x = useSharedValue(-amplitude);

  useEffect(() => {
    if (!active || amplitude <= 0) {
      cancelAnimation(x);
      return;
    }
    const durationMs = (amplitude * 2 * 1000) / speed;
    x.value = -amplitude;
    x.value = withRepeat(withTiming(amplitude, { duration: durationMs, easing: Easing.linear }), -1, true);

    return () => cancelAnimation(x);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, amplitude, active]);

  return x;
}
