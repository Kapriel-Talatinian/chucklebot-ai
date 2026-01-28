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

export function StyleSelector({ value, onChange, disabled }: StyleSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as JokeStyle)} disabled={disabled}>
      <SelectTrigger className="w-full glass border-border/50 focus:ring-primary/50 focus:border-primary/50">
        <SelectValue placeholder="Select style" />
      </SelectTrigger>
      <SelectContent className="glass-strong border-border/50">
        {JOKE_STYLES.map((style) => (
          <SelectItem
            key={style.value}
            value={style.value}
            className="focus:bg-primary/20 cursor-pointer"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">{style.label}</span>
              <span className="text-xs text-muted-foreground">{style.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
