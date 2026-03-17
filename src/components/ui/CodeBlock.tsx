"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import { generateColabUrl } from "@/lib/utils";

hljs.registerLanguage("python",     python);
hljs.registerLanguage("typescript", typescript);

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showColab?: boolean;
}

export function CodeBlock({ code, language = "python", title, showColab = false }: CodeBlockProps) {
  const ref = useRef<HTMLElement>(null);
  const [copied,  setCopied]  = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only mark as mounted after first client render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Run hljs only on the client, after mount
  useEffect(() => {
    if (!mounted) return;
    if (ref.current) {
      delete ref.current.dataset.highlighted;
      hljs.highlightElement(ref.current);
    }
  }, [code, mounted]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-[#1a1b2e]">
      {/* Title bar — traffic lights */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#16172a] border-b border-[#2a2b3e]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          {title && <span className="ml-2 text-xs text-slate-400 font-mono">{title}</span>}
        </div>
        <div className="flex items-center gap-2">
          {showColab && (
            <a
              href={generateColabUrl(code, title ?? "NeuroViz")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-orange-400 transition-colors px-2 py-1 rounded hover:bg-white/5"
            >
              <ExternalLink className="w-3 h-3" />
              Colab
            </a>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>
      </div>

      {/* Code — suppressHydrationWarning prevents mismatch from hljs DOM mutations */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed m-0">
        <code
          ref={ref}
          className={`language-${language} hljs`}
          suppressHydrationWarning
        >
          {code}
        </code>
      </pre>
    </div>
  );
}