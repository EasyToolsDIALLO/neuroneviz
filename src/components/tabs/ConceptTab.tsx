"use client";

import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { CheckCircle, XCircle, Zap } from "lucide-react";
import { ArchViz } from "../visualization/ArchViz"; 

interface Layer   { name: string; role: string; formula: string }
interface UseCase { label: string; example: string }
interface ConceptTabProps {
  concept: {
    introduction: string; keyPoints: string[]; layers: Layer[];
    advantages: string[]; disadvantages: string[]; useCases: UseCase[];
  } | null;
  color: string;
  slug: string;
}

export function ConceptTab({ concept, color, slug }: ConceptTabProps) {
  if (!concept) return <p className="text-slate-400">Aucune donnée disponible.</p>;

  return (
    <div className="space-y-6">
      {/* ── Architecture diagram (static — final state) ────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Architecture</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
        <div className="min-h-[200px] flex items-center justify-center">
          {/* Pass last step index so diagram shows full/complete state */}
          <ArchViz slug={slug} step={99} />
        </div>
      </div>
      {/* Introduction */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Introduction</h2>
        <MarkdownRenderer content={concept.introduction} />
      </div>

      {/* Key points */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Points clés</h2>
        <ul className="space-y-2">
          {(concept.keyPoints as string[]).map((point, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5"
                style={{ backgroundColor: color }}>
                {i + 1}
              </div>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Layers */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Architecture des couches</h2>
        <div className="space-y-3">
          {(concept.layers as Layer[]).map((layer, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
              <div className="w-20 shrink-0">
                <span className="text-xs font-bold text-slate-700 font-mono bg-white border border-slate-200 rounded px-1.5 py-0.5">
                  {layer.name}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 mb-1">{layer.role}</p>
                <code className="text-[11px] text-indigo-600 font-mono break-all">{layer.formula}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advantages + Disadvantages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-emerald-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-emerald-700 text-sm">Avantages</h3>
          </div>
          <ul className="space-y-2">
            {(concept.advantages as string[]).map((a, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>{a}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl border border-red-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4 text-red-400" />
            <h3 className="font-semibold text-red-600 text-sm">Inconvénients</h3>
          </div>
          <ul className="space-y-2">
            {(concept.disadvantages as string[]).map((d, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>{d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4" style={{ color }} />
          <h2 className="font-semibold text-slate-800">Cas d'usage</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(concept.useCases as UseCase[]).map((uc, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-semibold text-slate-700 mb-1">{uc.label}</p>
              <p className="text-xs text-slate-500">{uc.example}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}