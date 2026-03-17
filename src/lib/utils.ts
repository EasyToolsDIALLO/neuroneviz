import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Génère une URL Google Colab avec le code pré-chargé en base64 */
export function generateColabUrl(code: string, title: string): string {
  const notebook = {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      kernelspec: { display_name: "Python 3", language: "python", name: "python3" },
      language_info: { name: "python" },
    },
    cells: [
      {
        cell_type: "markdown",
        metadata: {},
        source: [`# ${title}\n`, `> Généré par [NeuroViz](https://neuroviz.app)`],
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: ["# Installation des dépendances\n", "!pip install torch torchvision -q\n"],
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: code.split("\n").map((l, i, a) => (i < a.length - 1 ? l + "\n" : l)),
      },
    ],
  };

  // btoa works in both browser and edge runtime (unlike Buffer)
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(notebook))));
  return `https://colab.research.google.com/notebook#create=true&base64=${encoded}`;
}
/** Formate un nombre de paramètres en notation humaine */
export function formatParams(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

export const ARCH_COLORS: Record<string, string> = {
  cnn:          "#6366f1",
  rnn:          "#8b5cf6",
  lstm:         "#06b6d4",
  gru:          "#10b981",
  gnn:          "#f59e0b",
  transformers: "#ef4444",
  llm:          "#ec4899",
};

export const ARCH_GRADIENTS: Record<string, [string, string]> = {
  cnn:          ["#6366f1", "#8b5cf6"],
  rnn:          ["#8b5cf6", "#ec4899"],
  lstm:         ["#06b6d4", "#6366f1"],
  gru:          ["#10b981", "#06b6d4"],
  gnn:          ["#f59e0b", "#ef4444"],
  transformers: ["#ef4444", "#f97316"],
  llm:          ["#ec4899", "#8b5cf6"],
};