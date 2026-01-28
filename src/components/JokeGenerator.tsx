import { useState } from "react";
import { Sparkles, Dices, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StyleSelector } from "./StyleSelector";
import { JokeCard } from "./JokeCard";
import { HistorySidebar } from "./HistorySidebar";
import { useJokeGenerator } from "@/hooks/useJokeGenerator";
import { useJokeHistory } from "@/hooks/useJokeHistory";
import type { JokeStyle } from "@/types/joke";
import { toast } from "sonner";

export function JokeGenerator() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<JokeStyle>("dad");
  
  const { isLoading, error, currentJoke, generateJoke, setCurrentJoke } = useJokeGenerator();
  const { history, addJoke, clearHistory } = useJokeHistory();

  const handleGenerate = async () => {
    const joke = await generateJoke({ topic, style });
    if (joke) {
      addJoke(joke);
    }
  };

  const handleRegenerate = async () => {
    if (!currentJoke) return;
    const joke = await generateJoke({ topic: currentJoke.topic, style: currentJoke.style });
    if (joke) {
      addJoke(joke);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && topic.trim()) {
      handleGenerate();
    }
  };

  const handleSelectFromHistory = (joke: typeof currentJoke) => {
    if (joke) {
      setCurrentJoke(joke);
      setTopic(joke.topic);
      setStyle(joke.style);
    }
  };

  // Show error toast
  if (error) {
    toast.error(error);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      {/* History sidebar */}
      <HistorySidebar
        history={history}
        onSelectJoke={handleSelectFromHistory}
        onClearHistory={clearHistory}
      />

      {/* Main content */}
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text">
            JokeCrafter
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-powered jokes that actually land 🎯
          </p>
        </div>

        {/* Input section */}
        <div className="glass-strong rounded-2xl p-6 space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="space-y-2">
            <label htmlFor="topic" className="text-sm font-medium text-muted-foreground">
              Topic
            </label>
            <Input
              id="topic"
              placeholder="e.g., programmers, cats, Mondays..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="glass border-border/50 focus:ring-primary/50 focus:border-primary/50 text-lg h-12"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Style
            </label>
            <StyleSelector value={style} onChange={setStyle} disabled={isLoading} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              className="flex-1 h-12 text-lg font-semibold gradient-primary text-primary-foreground hover:opacity-90 transition-opacity glow-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Crafting...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate
                </>
              )}
            </Button>

            {currentJoke && (
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={isLoading}
                className="h-12 px-4 border-border/50 hover:bg-primary/20 hover:text-primary hover:border-primary/50"
                title="Regenerate with same settings"
              >
                <Dices className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Joke display */}
        {currentJoke && (
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <JokeCard joke={currentJoke} />
          </div>
        )}

        {/* Empty state */}
        {!currentJoke && !isLoading && (
          <div className="text-center py-12 text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p>Enter a topic and hit Generate to craft your joke!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground/50">
          Powered by AI • Made with Lovable
        </p>
      </div>
    </div>
  );
}
