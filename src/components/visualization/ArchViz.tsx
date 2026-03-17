"use client";

import { GNNVisualizer,CNNVisualizer,
    LLMVisualizer,LSTMVisualizer, GRUVisualizer,
    RNNVisualizer, TransformerVisualizer
 } from "./index";

interface ArchVizProps {
  slug: string;
  step?: number;
}

export function ArchViz({ slug, step = 0 }: ArchVizProps) {
  switch (slug) {
    case "cnn":          return <CNNVisualizer step={step} />;
    case "rnn":          return <RNNVisualizer step={step} />;
    case "lstm":         return <LSTMVisualizer step={step} />;
    case "gru":          return <GRUVisualizer step={step} />;
    case "gnn":          return <GNNVisualizer step={step} />;
    case "transformers": return <TransformerVisualizer step={step} />;
    case "llm":          return <LLMVisualizer step={step} />;
    default:             return null;
  }
}