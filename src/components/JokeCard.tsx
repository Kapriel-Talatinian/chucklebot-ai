import { Copy, Share2, Twitter } from "lucide-react";
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
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${joke.setup}\n${joke.punchline}\n\n#JokeCrafter`);
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
    <div className="glass-strong rounded-2xl p-6 md:p-8 animate-scale-in glow-sm">
      {/* Style badge */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
          {styleLabel}
        </span>
        <span className="text-xs text-muted-foreground">
          {joke.topic}
        </span>
      </div>

      {/* Joke content */}
      <div className="space-y-4 mb-6">
        <p className="text-lg md:text-xl text-foreground leading-relaxed">
          {joke.setup}
        </p>
        <p className="text-xl md:text-2xl font-semibold gradient-text leading-relaxed">
          {joke.punchline}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={copyToClipboard}
          className="gap-2 hover:bg-primary/20 hover:text-primary transition-colors"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={shareToTwitter}
          className="gap-2 hover:bg-primary/20 hover:text-primary transition-colors"
        >
          <Twitter className="h-4 w-4" />
          Tweet
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={shareToWhatsApp}
          className="gap-2 hover:bg-primary/20 hover:text-primary transition-colors"
        >
          <Share2 className="h-4 w-4" />
          WhatsApp
        </Button>

        {"share" in navigator && (
          <Button
            variant="secondary"
            size="sm"
            onClick={nativeShare}
            className="gap-2 hover:bg-primary/20 hover:text-primary transition-colors md:hidden"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
      </div>
    </div>
  );
}
