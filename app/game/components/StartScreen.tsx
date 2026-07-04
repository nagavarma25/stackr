import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, FONTS } from '../constants';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function StartScreen({ best }: { best: number }) {
  const reducedMotion = useReducedMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) return;
    pulse.value = withRepeat(
      withSequence(withTiming(0.5, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1,
      true
    );
  }, [reducedMotion, pulse]);

  const ctaStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.container]}
      pointerEvents="none"
      accessibilityRole="button"
      accessibilityLabel="Tap anywhere to start the game"
    >
      <Text style={styles.title}>STACKR</Text>
      <Animated.Text style={[styles.cta, ctaStyle]}>TAP TO START</Animated.Text>
      {best > 0 && <Text style={styles.best}>BEST: {best}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 52,
    fontFamily: FONTS.display,
    color: COLORS.textPrimary,
    letterSpacing: 2,
    marginBottom: 28,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  cta: {
    fontSize: 18,
    fontFamily: FONTS.bodyBold,
    color: COLORS.accent,
    letterSpacing: 3,
  },
  best: {
    marginTop: 14,
    fontSize: 15,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
});
