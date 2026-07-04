import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { BLOCK_HEIGHT, SHAKE_DISTANCE_PX, STACK_BASE_BOTTOM, VISIBLE_BLOCKS_BEFORE_PAN } from './constants';
import { FallingOffcut as FallingOffcutData } from './types';
import { useGameLoop } from './hooks/useGameLoop';
import { useMovingBlockX } from './engine/moveEngine';
import { Background } from './components/Background';
import { Block } from './components/Block';
import { MovingBlock } from './components/MovingBlock';
import { FallingOffcut } from './components/FallingOffcut';
import { ParticleBurst } from './components/ParticleBurst';
import { Hud } from './components/Hud';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';

export function GameScreen() {
  const { width } = useWindowDimensions();
  const screenCenterX = width / 2;

  const { state, best, isNewBest, start, tap, reset } = useGameLoop();

  const amplitude = Math.max(0, (width - state.currentWidth) / 2);
  const movingX = useMovingBlockX(state.speed, amplitude, state.phase === 'playing');

  const panY = useSharedValue(0);
  const shakeX = useSharedValue(0);

  useEffect(() => {
    const extraTiers = Math.max(0, state.blocks.length - 1 - VISIBLE_BLOCKS_BEFORE_PAN);
    panY.value = withTiming(extraTiers * BLOCK_HEIGHT, { duration: 250 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.blocks.length]);

  useEffect(() => {
    if (state.phase === 'gameover') {
      shakeX.value = withSequence(
        withTiming(-SHAKE_DISTANCE_PX, { duration: 40 }),
        withTiming(SHAKE_DISTANCE_PX, { duration: 40 }),
        withTiming(-SHAKE_DISTANCE_PX / 2, { duration: 40 }),
        withTiming(0, { duration: 40 })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  const [visibleOffcut, setVisibleOffcut] = useState<FallingOffcutData | null>(null);
  useEffect(() => {
    if (state.lastOffcut) {
      setVisibleOffcut(state.lastOffcut);
      const t = setTimeout(() => setVisibleOffcut(null), 500);
      return () => clearTimeout(t);
    }
  }, [state.lastOffcut]);

  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);
  const prevBlockCountForBurst = useRef(state.blocks.length);
  useEffect(() => {
    if (state.blocks.length > prevBlockCountForBurst.current && state.lastWasPerfect) {
      const topBlock = state.blocks[state.blocks.length - 1];
      setBurst({
        x: screenCenterX + topBlock.x + topBlock.width / 2,
        y: STACK_BASE_BOTTOM + topBlock.tier * BLOCK_HEIGHT + BLOCK_HEIGHT / 2,
      });
      const t = setTimeout(() => setBurst(null), 400);
      prevBlockCountForBurst.current = state.blocks.length;
      return () => clearTimeout(t);
    }
    prevBlockCountForBurst.current = state.blocks.length;
  }, [state.blocks.length, state.lastWasPerfect, screenCenterX, state.blocks]);

  const handleTap = (movingXValue: number) => {
    if (state.phase === 'idle') {
      start();
    } else if (state.phase === 'playing') {
      tap(movingXValue);
    }
  };

  const tapGesture = Gesture.Tap()
    .enabled(state.phase !== 'gameover')
    .onEnd(() => {
      runOnJS(handleTap)(movingX.value);
    });

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }, { translateY: panY.value }],
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <View
        style={styles.container}
        accessibilityRole={state.phase === 'playing' ? 'button' : undefined}
        accessibilityLabel={state.phase === 'playing' ? 'Tap to drop the block' : undefined}
      >
        <Background score={state.score} />

        <Animated.View style={[StyleSheet.absoluteFill, shakeStyle]}>
          {state.blocks.map((block, i) => (
            <Block
              key={block.id}
              x={block.x}
              width={block.width}
              tier={block.tier}
              screenCenterX={screenCenterX}
              isPerfect={block.isPerfect}
              animateDrop={i === state.blocks.length - 1 && i > 0}
            />
          ))}

          {state.phase === 'playing' && (
            <MovingBlock
              x={movingX}
              width={state.currentWidth}
              tier={state.blocks[state.blocks.length - 1].tier + 1}
              screenCenterX={screenCenterX}
            />
          )}

          {visibleOffcut && <FallingOffcut offcut={visibleOffcut} screenCenterX={screenCenterX} />}
          {burst && <ParticleBurst originX={burst.x} originY={burst.y} />}
        </Animated.View>

        {state.phase === 'playing' && <Hud score={state.score} />}
        {state.phase === 'idle' && <StartScreen best={best} />}
        {state.phase === 'gameover' && (
          <GameOverScreen score={state.score} best={best} isNewBest={isNewBest} onRestart={reset} />
        )}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
