"use client";

import { MathFormula } from "@/components/ui/MathFormula";
import { CodeBlock }   from "@/components/ui/CodeBlock";

interface Formula { label: string; latex: string; description: string }
interface Step    { title: string; explanation: string; code: string }

interface FromScratchTabProps {
  fromScratch: {
    description: string; formulas: Formula[];
    implementation: string; steps: Step[];
  } | null;
  color: string;
}

export function FromScratchTab({ fromScratch, color }: FromScratchTabProps) {
  if (!fromScratch) return <p className="text-slate-400">Aucune donnée disponible.</p>;

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <p className="text-sm text-slate-600">{fromScratch.description}</p>
      </div>

      {/* Formules mathématiques */}
      <div>
        <h3 className="font-semibold text-slate-700 mb-3">Formules Mathématiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(fromScratch.formulas as Formula[]).map((formula, i) => (
            <MathFormula key={i} formula={formula} color={color} />
          ))}
        </div>
      </div>

      {/* Étapes from scratch */}
      {(fromScratch.steps as Step[]).length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700">Implémentation étape par étape</h3>
          {(fromScratch.steps as Step[]).map((step, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: color }}>
                    {i + 1}
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm">{step.title}</h4>
                </div>
                <p className="text-xs text-slate-500 ml-7">{step.explanation}</p>
              </div>
              <div className="p-4">
                <CodeBlock code={step.code} language="python" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Implémentation complète */}
      <div>
        <h3 className="font-semibold text-slate-700 mb-3">Implémentation NumPy complète</h3>
        <CodeBlock
          code={fromScratch.implementation}
          language="python"
          title="from_scratch.py"
          showColab
        />
      </div>
    </div>
  );
}