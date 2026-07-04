import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BACKGROUND_COLOR_STOPS } from '../constants';

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

function lerpColor(fromHex: string, toHex: string, t: number) {
  const from = hexToRgb(fromHex);
  const to = hexToRgb(toHex);
  return rgbToHex(lerp(from.r, to.r, t), lerp(from.g, to.g, t), lerp(from.b, to.b, t));
}

function getGradientColors(score: number): [string, string] {
  const stops = BACKGROUND_COLOR_STOPS;
  let lower = stops[0];
  let upper = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (score >= stops[i].atScore && score <= stops[i + 1].atScore) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
    if (score > stops[stops.length - 1].atScore) {
      lower = stops[stops.length - 1];
      upper = stops[stops.length - 1];
    }
  }

  const range = upper.atScore - lower.atScore;
  const t = range > 0 ? Math.min(1, Math.max(0, (score - lower.atScore) / range)) : 1;

  return [lerpColor(lower.top, upper.top, t), lerpColor(lower.bottom, upper.bottom, t)];
}

export function Background({ score }: { score: number }) {
  const colors = useMemo(() => getGradientColors(score), [score]);

  return <LinearGradient colors={colors} style={StyleSheet.absoluteFill} />;
}
