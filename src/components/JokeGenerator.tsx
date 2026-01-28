import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Dices, Loader2, Zap, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StyleSelector } from "./StyleSelector";
import { JokeCard } from "./JokeCard";
import { HistorySidebar } from "./HistorySidebar";
import { useJokeGenerator } from "@/hooks/useJokeGenerator";
import { useJokeHistory } from "@/hooks/useJokeHistory";
import type { JokeStyle } from "@/types/joke";
import { toast } from "sonner";

const floatingIcons = [
  { icon: "😂", delay: 0 },
  { icon: "🤣", delay: 1 },
  { icon: "💀", delay: 2 },
  { icon: "🔥", delay: 0.5 },
  { icon: "⚡", delay: 1.5 },
];

export function JokeGenerator() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<JokeStyle>("dark");
  const [showEmoji, setShowEmoji] = useState(false);
  
  const { isLoading, error, currentJoke, generateJoke, setCurrentJoke, clearError } = useJokeGenerator();
  const { history, addJoke, clearHistory } = useJokeHistory();

  const handleGenerate = async () => {
    clearError();
    setShowEmoji(true);
    setTimeout(() => setShowEmoji(false), 1000);
    
    const joke = await generateJoke({ topic, style });
    if (joke) {
      addJoke(joke);
    }
  };

  const handleRegenerate = async () => {
    if (!currentJoke) return;
    clearError();
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

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50 
            }}
            animate={{ 
              y: -100,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            }}
            transition={{ 
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: item.delay * 3,
              ease: "linear"
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      {/* Emoji burst on generate */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 3, y: -100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl pointer-events-none z-50"
          >
            🎭
          </motion.div>
        )}
      </AnimatePresence>

      {/* History sidebar */}
      <HistorySidebar
        history={history}
        onSelectJoke={handleSelectFromHistory}
        onClearHistory={clearHistory}
      />

      {/* Main content */}
      <div className="w-full max-w-2xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-black gradient-text tracking-tight">
              JokeCrafter
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg md:text-xl flex items-center justify-center gap-2"
          >
            <Flame className="h-5 w-5 text-accent" />
            <span>DEGEN MODE</span>
            <span className="text-muted-foreground/50">•</span>
            <span>Unbridled AI Comedy</span>
            <Flame className="h-5 w-5 text-accent" />
          </motion.p>
        </motion.div>

        {/* Input section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-xl opacity-50" />
          
          <div className="relative glass-strong rounded-3xl p-6 md:p-8 space-y-5 noise gradient-border">
            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm font-semibold text-muted-foreground/70 uppercase tracking-wider">
                Topic
              </label>
              <Input
                id="topic"
                placeholder="Enter anything... go wild 🔥"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="glass border-white/10 focus:ring-primary/30 focus:border-primary/30 text-lg h-14 rounded-xl transition-all duration-300 placeholder:text-muted-foreground/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground/70 uppercase tracking-wider">
                Style
              </label>
              <StyleSelector value={style} onChange={setStyle} disabled={isLoading} />
            </div>

            <div className="flex gap-3 pt-2">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !topic.trim()}
                  className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 text-white shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Loader2 className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <Zap className="h-5 w-5 mr-2" />
                  )}
                  {isLoading ? "Crafting..." : "Generate"}
                </Button>
              </motion.div>

              <AnimatePresence>
                {currentJoke && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, width: 0 }}
                    animate={{ opacity: 1, scale: 1, width: "auto" }}
                    exit={{ opacity: 0, scale: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div whileHover={{ scale: 1.05, rotate: 15 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        onClick={handleRegenerate}
                        disabled={isLoading}
                        className="h-14 w-14 p-0 border-white/10 hover:bg-white/10 hover:border-primary/30 rounded-xl transition-all duration-300"
                        title="Regenerate"
                      >
                        <Dices className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Joke display */}
        <AnimatePresence mode="wait">
          {currentJoke && (
            <motion.div
              key={currentJoke.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <JokeCard joke={currentJoke} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        <AnimatePresence>
          {!currentJoke && !isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16 text-muted-foreground"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-20 w-20 mx-auto mb-6 opacity-20" />
              </motion.div>
              <p className="text-lg font-medium">Enter a topic and unleash chaos</p>
              <p className="text-sm text-muted-foreground/50 mt-1">No limits. No filter. Pure comedy.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 left-0 right-0 text-center"
      >
        <p className="text-xs text-muted-foreground/30 font-medium">
          ⚡ Powered by DEGEN AI • Made with Lovable
        </p>
      </motion.div>
    </div>
  );
}
