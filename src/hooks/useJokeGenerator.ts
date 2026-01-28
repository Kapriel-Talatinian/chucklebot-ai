import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Joke, JokeStyle } from "@/types/joke";

interface GenerateJokeParams {
  topic: string;
  style: JokeStyle;
}

export function useJokeGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentJoke, setCurrentJoke] = useState<Joke | null>(null);

  const generateJoke = useCallback(async ({ topic, style }: GenerateJokeParams): Promise<Joke | null> => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-joke", {
        body: { topic: topic.trim(), style },
      });

      if (fnError) {
        console.error("Edge function error:", fnError);
        throw new Error(fnError.message || "Failed to generate joke");
      }

      if (!data?.setup || !data?.punchline) {
        throw new Error("Invalid response from joke generator");
      }

      const joke: Joke = {
        id: crypto.randomUUID(),
        topic: topic.trim(),
        style,
        setup: data.setup,
        punchline: data.punchline,
        createdAt: Date.now(),
      };

      setCurrentJoke(joke);
      return joke;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate joke";
      setError(message);
      console.error("Joke generation error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    currentJoke,
    generateJoke,
    clearError,
    setCurrentJoke,
  };
}
