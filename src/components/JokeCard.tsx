import { motion } from "framer-motion";
import { Copy, Share2, Twitter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Joke } from "@/types/joke";
import { JOKE_STYLES } from "@/types/joke";

interface JokeCardProps {
  joke: Joke;
}

export function JokeCard({ joke }: JokeCardProps) {
  const styleLabel = JOKE_STYLES.find((s) => s.value === joke.style)?.label || joke.style;
  const fullJoke = `${joke.setup}\n\n${joke.punchline}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullJoke);
      toast.success("Copied to clipboard!", {
        icon: <Sparkles className="h-4 w-4" />,
      });
    } catch {
      toast.error("Failed to copy");
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${joke.setup}\n${joke.punchline}\n\n🎭 Made with JokeCrafter`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${joke.setup}\n${joke.punchline}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this joke!",
          text: fullJoke,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 0.4 }
      }}
      className="relative"
    >
      {/* Glow background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-2xl"
      />
      
      <div className="relative glass-strong rounded-3xl p-8 md:p-10 noise gradient-border">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-between items-start mb-6"
        >
          <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
            {styleLabel}
          </span>
          <span className="text-xs text-muted-foreground/60 font-medium">
            {joke.topic}
          </span>
        </motion.div>

        {/* Joke content */}
        <div className="space-y-6 mb-8">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-medium"
          >
            {joke.setup}
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl md:text-3xl font-bold gradient-text leading-relaxed"
          >
            {joke.punchline}
          </motion.p>
        </div>

        {/* Action buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-wrap gap-3"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={copyToClipboard}
            className="gap-2 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={shareToTwitter}
            className="gap-2 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
          >
            <Twitter className="h-4 w-4" />
            Tweet
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={shareToWhatsApp}
            className="gap-2 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
          >
            <Share2 className="h-4 w-4" />
            WhatsApp
          </Button>

          {"share" in navigator && (
            <Button
              variant="secondary"
              size="sm"
              onClick={nativeShare}
              className="gap-2 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 md:hidden"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
