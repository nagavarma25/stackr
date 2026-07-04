import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BLOCK_HEIGHT, COLORS, STACK_BASE_BOTTOM } from '../constants';
import { FallingOffcut as FallingOffcutData } from '../types';

export function FallingOffcut({
  offcut,
  screenCenterX,
}: {
  offcut: FallingOffcutData;
  screenCenterX: number;
}) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(400, { duration: 500, easing: Easing.in(Easing.quad) });
    translateX.value = withTiming(offcut.direction === 'left' ? -60 : 60, { duration: 500 });
    opacity.value = withTiming(0, { duration: 500 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.block,
        animatedStyle,
        {
          left: screenCenterX + offcut.x,
          bottom: STACK_BASE_BOTTOM + offcut.tier * BLOCK_HEIGHT,
          width: offcut.width,
          height: BLOCK_HEIGHT,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
    backgroundColor: COLORS.accent,
    borderRadius: 8,
  },
});
