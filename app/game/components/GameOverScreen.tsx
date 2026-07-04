import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../constants';

export function GameOverScreen({
  score,
  best,
  isNewBest,
  onRestart,
}: {
  score: number;
  best: number;
  isNewBest: boolean;
  onRestart: () => void;
}) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Text style={styles.gameOver}>GAME OVER</Text>
      <Text style={styles.score}>{Math.floor(score)}</Text>
      {isNewBest ? (
        <Text style={styles.newBest}>NEW BEST!</Text>
      ) : (
        <Text style={styles.best}>BEST: {best}</Text>
      )}
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={onRestart}
        accessibilityRole="button"
        accessibilityLabel="Restart game"
        hitSlop={8}
      >
        <Text style={styles.buttonText}>RESTART</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOver: {
    fontSize: 26,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textPrimary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  score: {
    fontSize: 64,
    fontFamily: FONTS.display,
    color: COLORS.textPrimary,
  },
  best: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  newBest: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: FONTS.bodyBold,
    color: COLORS.gold,
    letterSpacing: 1,
  },
  button: {
    marginTop: 32,
    minHeight: 48,
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 44,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.accent,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
      },
      android: { elevation: 6 },
      default: {},
    }),
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  buttonText: {
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
    color: COLORS.textPrimary,
    letterSpacing: 1,
    textAlign: 'center',
  },
});
