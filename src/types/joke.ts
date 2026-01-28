export type JokeStyle = "dad" | "sarcastic" | "absurd" | "dark" | "oneliner";

export interface Joke {
  id: string;
  topic: string;
  style: JokeStyle;
  setup: string;
  punchline: string;
  createdAt: number;
}

export interface JokeHistoryItem extends Joke {
  preview: string;
}

export const JOKE_STYLES: { value: JokeStyle; label: string; description: string }[] = [
  { value: "dad", label: "Dad Joke", description: "Wholesome puns and groaners" },
  { value: "sarcastic", label: "Sarcastic", description: "Dry wit and irony" },
  { value: "absurd", label: "Absurd", description: "Surreal and unexpected" },
  { value: "dark", label: "Dark", description: "Edgy but tasteful" },
  { value: "oneliner", label: "One-liner", description: "Quick zingers" },
];
