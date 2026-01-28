import { motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOKE_STYLES, type JokeStyle } from "@/types/joke";

interface StyleSelectorProps {
  value: JokeStyle;
  onChange: (value: JokeStyle) => void;
  disabled?: boolean;
}

const styleEmojis: Record<JokeStyle, string> = {
  dad: "👨",
  sarcastic: "😏",
  absurd: "🤪",
  dark: "💀",
  oneliner: "⚡",
};

export function StyleSelector({ value, onChange, disabled }: StyleSelectorProps) {
  const selectedStyle = JOKE_STYLES.find(s => s.value === value);

  return (
    <Select value={value} onValueChange={(v) => onChange(v as JokeStyle)} disabled={disabled}>
      <SelectTrigger className="w-full glass border-white/10 focus:ring-primary/30 focus:border-primary/30 h-14 rounded-xl text-base transition-all duration-300 hover:border-white/20">
        <SelectValue>
          <div className="flex items-center gap-3">
            <span className="text-xl">{styleEmojis[value]}</span>
            <div className="text-left">
              <div className="font-semibold">{selectedStyle?.label}</div>
              <div className="text-xs text-muted-foreground/60">{selectedStyle?.description}</div>
            </div>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="glass-strong border-white/10 rounded-xl p-1 overflow-hidden">
        {JOKE_STYLES.map((style, index) => (
          <motion.div
            key={style.value}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <SelectItem
              value={style.value}
              className="rounded-lg focus:bg-white/10 cursor-pointer py-3 px-3 transition-colors data-[state=checked]:bg-primary/20"
            >
              <div className="flex items-center gap-3 w-full">
                <span className="text-xl">{styleEmojis[style.value]}</span>
                <div className="flex-1">
                  <div className="font-semibold">{style.label}</div>
                  <div className="text-xs text-muted-foreground/60">{style.description}</div>
                </div>
                {value === style.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </SelectItem>
          </motion.div>
        ))}
      </SelectContent>
    </Select>
  );
}
