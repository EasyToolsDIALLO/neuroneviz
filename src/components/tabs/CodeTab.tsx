"use client";

import { CodeBlock } from "@/components/ui/CodeBlock";

interface Section { title: string; explanation: string; code: string }
interface CodeTabProps {
  codeImpl: {
    framework: string; language: string;
    title: string; description: string;
    code: string; sections: Section[];
  } | null;
  color: string;
}

export function CodeTab({ codeImpl, color }: CodeTabProps) {
  if (!codeImpl) return <p className="text-slate-400">Aucun code disponible.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            {codeImpl.framework}
          </span>
          <span className="text-xs text-slate-400">{codeImpl.language}</span>
        </div>
        <h2 className="font-semibold text-slate-800 mb-1">{codeImpl.title}</h2>
        <p className="text-sm text-slate-500">{codeImpl.description}</p>
      </div>

      {/* Code complet */}
      <CodeBlock
        code={codeImpl.code}
        language={codeImpl.language}
        title={codeImpl.title}
        showColab
      />

      {/* Sections annotées */}
      {(codeImpl.sections as Section[]).length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700">Sections détaillées</h3>
          {(codeImpl.sections as Section[]).map((section, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: color }}>
                    {i + 1}
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm">{section.title}</h4>
                </div>
                <p className="text-xs text-slate-500 ml-7">{section.explanation}</p>
              </div>
              <div className="p-4">
                <CodeBlock code={section.code} language={codeImpl.language} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}