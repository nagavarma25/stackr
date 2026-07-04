import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { BLOCK_HEIGHT, COLORS, STACK_BASE_BOTTOM } from '../constants';

export function MovingBlock({
  x,
  width,
  tier,
  screenCenterX,
}: {
  x: SharedValue<number>;
  width: number;
  tier: number;
  screenCenterX: number;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    left: screenCenterX + x.value,
  }));

  return (
    <Animated.View
      style={[
        styles.block,
        animatedStyle,
        {
          bottom: STACK_BASE_BOTTOM + tier * BLOCK_HEIGHT,
          width,
          height: BLOCK_HEIGHT,
          backgroundColor: COLORS.movingBlock,
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
        shadowColor: COLORS.movingBlock,
        shadowOpacity: 0.6,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 6,
      },
      android: { elevation: 6 },
      default: {},
    }),
  },
});
