import React, { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BLOCK_HEIGHT, BLOCK_PALETTE, COLORS, STACK_BASE_BOTTOM, SQUASH_DURATION_MS } from '../constants';

function getBlockColor(tier: number) {
  return BLOCK_PALETTE[tier % BLOCK_PALETTE.length];
}

export function Block({
  x,
  width,
  tier,
  screenCenterX,
  isPerfect,
  animateDrop,
}: {
  x: number;
  width: number;
  tier: number;
  screenCenterX: number;
  isPerfect?: boolean;
  animateDrop?: boolean;
}) {
  const scaleY = useSharedValue(animateDrop ? 0.75 : 1);
  const scaleX = useSharedValue(animateDrop ? 1.08 : 1);

  useEffect(() => {
    if (!animateDrop) return;
    scaleY.value = withSequence(
      withTiming(0.75, { duration: SQUASH_DURATION_MS }),
      withSpring(1)
    );
    scaleX.value = withSequence(
      withTiming(1.08, { duration: SQUASH_DURATION_MS }),
      withSpring(1)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animateDrop]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }, { scaleX: scaleX.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.block,
        animatedStyle,
        isPerfect && styles.perfectGlow,
        {
          left: screenCenterX + x,
          bottom: STACK_BASE_BOTTOM + tier * BLOCK_HEIGHT,
          width,
          height: BLOCK_HEIGHT,
          backgroundColor: getBlockColor(tier),
          borderWidth: isPerfect ? 2 : 0,
          borderColor: COLORS.gold,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  perfectGlow: {
    ...Platform.select({
      ios: {
        shadowColor: COLORS.gold,
        shadowOpacity: 0.8,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 8,
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
});
