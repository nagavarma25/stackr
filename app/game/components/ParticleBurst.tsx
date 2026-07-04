import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, PARTICLE_COUNT, PARTICLE_DURATION_MS } from '../constants';

function Particle({ angle, originX, originY }: { angle: number; originX: number; originY: number }) {
  const progress = useSharedValue(0);
  const distance = 50;

  useEffect(() => {
    progress.value = withTiming(1, { duration: PARTICLE_DURATION_MS });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.cos(angle) * distance * progress.value },
      { translateY: Math.sin(angle) * distance * progress.value },
    ],
    opacity: 1 - progress.value,
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        animatedStyle,
        { left: originX, bottom: originY },
      ]}
    />
  );
}

export function ParticleBurst({ originX, originY }: { originX: number; originY: number }) {
  const angles = useMemo(
    () => Array.from({ length: PARTICLE_COUNT }, (_, i) => (i / PARTICLE_COUNT) * Math.PI * 2),
    []
  );

  return (
    <>
      {angles.map((angle, i) => (
        <Particle key={i} angle={angle} originX={originX} originY={originY} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
  },
});
