import type { Metadata } from "next";

export const BASE_URL   = process.env.NEXT_PUBLIC_APP_URL ?? "https://neuroviz.app";
export const SITE_NAME  = "NeuroViz";
export const SITE_DESC  =
  "Apprenez CNN, RNN, LSTM, GRU, GNN, Transformers et LLM avec des visualisations interactives, simulations et code PyTorch.";

export function buildMetadata({
  title, description, path, keywords = [], type = "website", noIndex = false,
}: {
  title: string; description: string; path: string;
  keywords?: string[]; type?: "website" | "article"; noIndex?: boolean;
}): Metadata {
  const url     = `${BASE_URL}${path}`;
  const ogImage = `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&path=${encodeURIComponent(path)}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: { default: `${title} | ${SITE_NAME}`, template: `%s | ${SITE_NAME}` },
    description,
    keywords,
    authors: [{ name: SITE_NAME }],
    alternates: { canonical: url },
    openGraph: {
      type, url, title, description, siteName: SITE_NAME, locale: "fr_FR",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image", title, description,
      images: [ogImage], creator: "@neuroviz_app",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  };
}

// Metadata SEO par architecture
export const ARCH_SEO: Record<string, { title: string; description: string; keywords: string[] }> = {
  cnn: {
    title: "CNN — Convolutional Neural Network : Fonctionnement, Code PyTorch, Formules",
    description: "Comprendre les CNN : convolution 2D, pooling, ReLU, BatchNorm. Code PyTorch CIFAR-10 + implémentation NumPy from scratch + simulation interactive.",
    keywords: ["convolutional neural network CNN", "CNN pytorch tutoriel", "convolution 2D explication", "réseau convolutif from scratch"],
  },
  rnn: {
    title: "RNN — Recurrent Neural Network : Séquences, BPTT, Vanishing Gradient",
    description: "Maîtrisez les RNN : état caché, BPTT, vanishing gradient. Code PyTorch bidirectionnel + simulation séquentielle.",
    keywords: ["recurrent neural network RNN", "vanishing gradient solution", "backpropagation through time", "RNN pytorch"],
  },
  lstm: {
    title: "LSTM — Long Short-Term Memory : Forget Gate, Cell State, Gradient Highway",
    description: "Comprendre le LSTM : 4 portes, cell state, solution au vanishing gradient. Code PyTorch + NumPy from scratch.",
    keywords: ["LSTM long short term memory", "LSTM portes forget input output", "cell state gradient", "LSTM vs GRU"],
  },
  gru: {
    title: "GRU — Gated Recurrent Unit : Update Gate, Architecture Simplifiée",
    description: "GRU expliqué : update gate, reset gate. Plus rapide que LSTM. Code PyTorch + NumPy from scratch.",
    keywords: ["GRU gated recurrent unit", "GRU update reset gate", "GRU vs LSTM", "GRU pytorch"],
  },
  gnn: {
    title: "GNN — Graph Neural Network : Message Passing, GCN, GraphSAGE",
    description: "Comprendre les GNN : message passing, GCN normalisé, GraphSAGE. Molécules, réseaux sociaux, knowledge graphs.",
    keywords: ["graph neural network GNN", "GCN message passing", "GraphSAGE node classification", "GNN pytorch geometric"],
  },
  transformers: {
    title: "Transformer — Self-Attention, Multi-Head Attention | Attention is All You Need",
    description: "Architecture Transformer : self-attention, multi-head attention, positional encoding. Code PyTorch complet + NumPy from scratch.",
    keywords: ["transformer architecture", "self-attention mechanism", "multi-head attention pytorch", "attention is all you need"],
  },
  llm: {
    title: "LLM — Large Language Models : GPT, LLaMA, Fine-tuning LoRA",
    description: "LLM expliqués : architecture GPT, RoPE, SwiGLU, RMSNorm. Fine-tuning QLoRA. Code HuggingFace complet.",
    keywords: ["large language model LLM", "GPT architecture", "fine-tuning LoRA QLoRA", "LLaMA Mistral fine-tuning"],
  },
};