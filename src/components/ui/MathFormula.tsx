"use client";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathFormulaProps {
  formula: { label: string; latex: string; description: string };
  color?: string;
}

export function MathFormula({ formula, color = "#6366f1" }: MathFormulaProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {formula.label}
        </span>
      </div>
      <div className="bg-slate-50 rounded-lg p-4 mb-3 overflow-x-auto">
        <BlockMath math={formula.latex} />
      </div>
      <p className="text-xs text-slate-500">{formula.description}</p>
    </div>
  );
}

export function InlineFormula({ latex }: { latex: string }) {
  return <InlineMath math={latex} />;
}