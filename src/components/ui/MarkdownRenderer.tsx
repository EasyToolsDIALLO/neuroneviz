"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-800 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-semibold text-slate-700 mt-6 mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-semibold text-slate-700 mt-4 mb-2">{children}</h3>,
        p:  ({ children }) => <p className="text-slate-600 leading-relaxed mb-4">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-slate-800">{children}</strong>,
        ul: ({ children }) => <ul className="space-y-1.5 mb-4 ml-4">{children}</ul>,
        li: ({ children }) => (
          <li className="text-slate-600 flex items-start gap-2">
            <span className="text-indigo-500 mt-1.5 shrink-0">•</span>
            <span>{children}</span>
          </li>
        ),
        code: ({ children, className }) => {
          const isBlock = className?.includes("language-");
          return isBlock ? (
            <code className={`${className} block`}>{children}</code>
          ) : (
            <code className="bg-slate-100 text-indigo-700 rounded px-1.5 py-0.5 text-sm font-mono">
              {children}
            </code>
          );
        },
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-slate-500 my-4">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}