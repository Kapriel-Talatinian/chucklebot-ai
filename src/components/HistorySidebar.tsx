import { History, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Joke } from "@/types/joke";
import { JOKE_STYLES } from "@/types/joke";

interface HistorySidebarProps {
  history: Joke[];
  onSelectJoke: (joke: Joke) => void;
  onClearHistory: () => void;
}

function HistoryItem({ joke, onSelect }: { joke: Joke; onSelect: () => void }) {
  const styleLabel = JOKE_STYLES.find((s) => s.value === joke.style)?.label || joke.style;
  const preview = joke.setup.length > 50 ? joke.setup.slice(0, 50) + "..." : joke.setup;

  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
          {styleLabel}
        </span>
        <span className="text-xs text-muted-foreground">{joke.topic}</span>
      </div>
      <p className="text-sm text-foreground/80 line-clamp-2">{preview}</p>
    </button>
  );
}

function HistoryContent({
  history,
  onSelectJoke,
  onClearHistory,
}: HistorySidebarProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <History className="h-12 w-12 mb-3 opacity-50" />
        <p className="text-sm">No jokes yet</p>
        <p className="text-xs">Generate your first joke!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-2 pb-4">
          {history.map((joke) => (
            <HistoryItem
              key={joke.id}
              joke={joke}
              onSelect={() => onSelectJoke(joke)}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear History
        </Button>
      </div>
    </div>
  );
}

export function HistorySidebar(props: HistorySidebarProps) {
  const isMobile = useIsMobile();

  const triggerButton = (
    <Button
      variant="outline"
      size="icon"
      className="fixed top-4 right-4 z-50 glass border-border/50 hover:bg-primary/20 hover:text-primary hover:border-primary/50"
    >
      <History className="h-5 w-5" />
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent className="glass-strong max-h-[85vh]">
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle className="gradient-text">History</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <HistoryContent {...props} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{triggerButton}</SheetTrigger>
      <SheetContent className="glass-strong border-l-border/50 w-80">
        <SheetHeader>
          <SheetTitle className="gradient-text">History</SheetTitle>
        </SheetHeader>
        <div className="mt-6 h-[calc(100%-4rem)]">
          <HistoryContent {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
