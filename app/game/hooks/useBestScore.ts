import { useCallback, useEffect, useState } from 'react';
import { loadBestScore, saveBestScoreIfHigher } from '../storage/scoreStorage';

export function useBestScore() {
  const [best, setBest] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadBestScore().then((value) => {
      setBest(value);
      setLoaded(true);
    });
  }, []);

  const submitScore = useCallback(async (score: number) => {
    const newBest = await saveBestScoreIfHigher(score);
    setBest(newBest);
    return newBest;
  }, []);

  return { best, loaded, submitScore };
}
