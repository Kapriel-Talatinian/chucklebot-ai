import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, X, Clock } from "lucide-react";
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

function HistoryItem({ joke, onSelect, index }: { joke: Joke; onSelect: () => void; index: number }) {
  const styleLabel = JOKE_STYLES.find((s) => s.value === joke.style)?.label || joke.style;
  const preview = joke.setup.length > 40 ? joke.setup.slice(0, 40) + "..." : joke.setup;

  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-colors group"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold uppercase tracking-wider">
          {styleLabel}
        </span>
        <span className="text-[10px] text-muted-foreground/50">{joke.topic}</span>
      </div>
      <p className="text-sm text-foreground/70 line-clamp-2 group-hover:text-foreground/90 transition-colors">
        {preview}
      </p>
    </motion.button>
  );
}

function HistoryContent({
  history,
  onSelectJoke,
  onClearHistory,
}: HistorySidebarProps) {
  if (history.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-muted-foreground"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Clock className="h-16 w-16 mb-4 opacity-20" />
        </motion.div>
        <p className="text-sm font-medium">No jokes yet</p>
        <p className="text-xs text-muted-foreground/50">Generate your first masterpiece!</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-2 pb-4">
          <AnimatePresence mode="popLayout">
            {history.map((joke, index) => (
              <HistoryItem
                key={joke.id}
                joke={joke}
                onSelect={() => onSelectJoke(joke)}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-4 border-t border-white/5"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          className="w-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 gap-2 transition-all"
        >
          <Trash2 className="h-4 w-4" />
          Clear History
        </Button>
      </motion.div>
    </div>
  );
}

export function HistorySidebar(props: HistorySidebarProps) {
  const isMobile = useIsMobile();

  const triggerButton = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 right-4 z-50 glass border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 rounded-xl"
      >
        <History className="h-5 w-5" />
      </Button>
    </motion.div>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent className="glass-strong max-h-[85vh] border-t-white/10">
          <DrawerHeader className="flex items-center justify-between pb-2">
            <DrawerTitle className="gradient-text text-lg font-bold">History</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-xl">
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
      <SheetContent className="glass-strong border-l-white/5 w-80 p-6">
        <SheetHeader className="pb-4">
          <SheetTitle className="gradient-text text-xl font-bold">History</SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100%-4rem)]">
          <HistoryContent {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
