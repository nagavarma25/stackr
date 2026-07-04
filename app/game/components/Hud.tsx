import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants';

export function Hud({ score }: { score: number }) {
  const insets = useSafeAreaInsets();

  return (
    <Text
      style={[styles.score, { top: insets.top + 24 }]}
      accessibilityLabel={`Score: ${Math.floor(score)}`}
      accessibilityLiveRegion="polite"
    >
      {Math.floor(score)}
    </Text>
  );
}

const styles = StyleSheet.create({
  score: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 48,
    fontFamily: FONTS.display,
    color: COLORS.textPrimary,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
