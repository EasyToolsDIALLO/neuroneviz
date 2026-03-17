"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const ARCHITECTURES = [
  { slug: "cnn",          shortName: "CNN",          name: "Convolutional Neural Networks", color: "#6366f1" },
  { slug: "rnn",          shortName: "RNN",          name: "Recurrent Neural Networks",     color: "#8b5cf6" },
  { slug: "lstm",         shortName: "LSTM",         name: "Long Short-Term Memory",        color: "#06b6d4" },
  { slug: "gru",          shortName: "GRU",          name: "Gated Recurrent Unit",          color: "#10b981" },
  { slug: "gnn",          shortName: "GNN",          name: "Graph Neural Networks",         color: "#f59e0b" },
  { slug: "transformers", shortName: "Transformers", name: "Transformers",                  color: "#ef4444" },
  { slug: "llm",          shortName: "LLM",          name: "Large Language Models",         color: "#ec4899" },
];

export function Sidebar({ currentSlug }: { currentSlug: string }) {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-full shrink-0">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-slate-800">NeuroViz</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Architectures">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
          Architectures
        </p>
        {ARCHITECTURES.map((arch) => {
          const isActive = arch.slug === currentSlug;
          return (
            <Link
              key={arch.slug}
              href={`/architectures/${arch.slug}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                isActive
                  ? "bg-slate-50 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              {/* Color indicator */}
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: isActive ? arch.color : "#cbd5e1" }}
              />
              <div>
                <span className={cn("block", isActive ? "text-slate-800" : "")}>
                  {arch.shortName}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight block">
                  {arch.name.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 text-center">
          Application éducative gratuite
        </p>
      </div>
    </aside>
  );
}