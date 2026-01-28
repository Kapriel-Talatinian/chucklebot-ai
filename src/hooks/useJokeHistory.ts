import { useState, useEffect, useCallback } from "react";
import type { Joke } from "@/types/joke";

const STORAGE_KEY = "jokecrafter-history";
const MAX_HISTORY = 50;

export function useJokeHistory() {
  const [history, setHistory] = useState<Joke[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load joke history:", error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save joke history:", error);
    }
  }, [history]);

  const addJoke = useCallback((joke: Joke) => {
    setHistory((prev) => {
      const newHistory = [joke, ...prev.filter((j) => j.id !== joke.id)];
      return newHistory.slice(0, MAX_HISTORY);
    });
  }, []);

  const removeJoke = useCallback((id: string) => {
    setHistory((prev) => prev.filter((joke) => joke.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addJoke,
    removeJoke,
    clearHistory,
  };
}
