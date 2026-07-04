import AsyncStorage from '@react-native-async-storage/async-storage';

const BEST_SCORE_KEY = '@stackr/best_score';

export async function loadBestScore(): Promise<number> {
  const raw = await AsyncStorage.getItem(BEST_SCORE_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

export async function saveBestScoreIfHigher(score: number): Promise<number> {
  const current = await loadBestScore();
  if (score > current) {
    await AsyncStorage.setItem(BEST_SCORE_KEY, String(score));
    return score;
  }
  return current;
}
