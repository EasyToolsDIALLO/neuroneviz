"use client";

const TOKENS_IN = ["The", "cat", "sat", "on"];
const NUM_LAYERS = 4;

const PROBS: [string, number][] = [
  ["mat",   0.62],
  ["floor", 0.18],
  ["roof",  0.09],
  ["bed",   0.07],
  ["wall",  0.04],
];

export default function LLMVisualizer({ step = 0 }: { step?: number }) {
  const W = 860;
  const H = 270;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 270 }}>
      <defs>
        <marker id="llm-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#ec4899" />
        </marker>
        <linearGradient id="llm-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#ec4899" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Input tokens */}
      {TOKENS_IN.map((tok, i) => {
        const x = 30 + i * 72;
        return (
          <g key={`tok-${i}`}>
            <rect x={x} y={215} width={62} height={32} rx={8}
              fill={step >= 0 ? "#ec4899" : "#f1f5f9"}
              stroke={step >= 0 ? "#ec4899" : "#e2e8f0"} strokeWidth={2} />
            <text x={x + 31} y={235} textAnchor="middle" fontSize={11}
              fill={step >= 0 ? "#fff" : "#94a3b8"} fontFamily="Arial" fontWeight="700">
              {tok}
            </text>
          </g>
        );
      })}

      {/* Embeddings */}
      {step >= 1 && TOKENS_IN.map((_, i) => {
        const x = 30 + i * 72;
        return (
          <g key={`emb-${i}`}>
            <line x1={x + 31} y1={213} x2={x + 31} y2={196}
              stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#llm-arr)" />
            <rect x={x} y={170} width={62} height={22} rx={6}
              fill="#8b5cf6cc" stroke="#8b5cf6" strokeWidth={1.5} />
            <text x={x + 31} y={185} textAnchor="middle" fontSize={9}
              fill="#fff" fontFamily="Arial">
              embed+pos
            </text>
          </g>
        );
      })}

      {/* Transformer layers */}
      {Array.from({ length: NUM_LAYERS }).map((_, li) => {
        const layerActive = step >= 2 + li;
        const isCurrent   = step === 2 + li;
        const layerY      = 130 - li * 28;
        const layerW      = 62 * 4 + 3 * 8;
        const layerX      = 30;
        return (
          <g key={`layer-${li}`}>
            <rect x={layerX} y={layerY} width={layerW} height={22} rx={6}
              fill={isCurrent ? "url(#llm-grad)" : layerActive ? "#8b5cf630" : "#f1f5f9"}
              stroke={isCurrent ? "#ec4899" : layerActive ? "#8b5cf6" : "#e2e8f0"}
              strokeWidth={isCurrent ? 2 : 1} />
            <text x={layerX + layerW / 2} y={layerY + 15}
              textAnchor="middle" fontSize={9}
              fill={isCurrent ? "#fff" : layerActive ? "#8b5cf6" : "#94a3b8"}
              fontFamily="Arial" fontWeight={isCurrent ? "700" : "400"}>
              {`Transformer Block ${li + 1} — Self-Attention + FFN`}
            </text>
          </g>
        );
      })}

      {/* Arrow embeddings to layers */}
      {step >= 2 && (
        <line x1={61} y1={168} x2={61} y2={153}
          stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#llm-arr)" />
      )}

      {/* LM Head */}
      {step >= 6 && (
        <g>
          <rect x={320} y={15} width={180} height={32} rx={10}
            fill="#f59e0b" stroke="#f59e0b" strokeWidth={2} />
          <text x={410} y={35} textAnchor="middle" fontSize={10}
            fill="#fff" fontFamily="Arial" fontWeight="700">
            Linear + Softmax (vocab 50k)
          </text>
        </g>
      )}

      {/* Output probabilities */}
      {step >= 7 && (
        <g transform="translate(530, 70)">
          <text x={0} y={-10} fontSize={10} fill="#ec4899" fontFamily="Arial" fontWeight="700">
            Prochain token — distribution
          </text>
          {PROBS.map(([word, prob], i) => (
            <g key={word}>
              <rect x={0} y={i * 26} width={prob * 220} height={20} rx={4}
                fill={i === 0 ? "#ec4899" : "#e2e8f0"} />
              <text x={prob * 220 + 6} y={i * 26 + 14} fontSize={10}
                fill={i === 0 ? "#ec4899" : "#94a3b8"} fontFamily="Arial"
                fontWeight={i === 0 ? "700" : "400"}>
                {word} — {Math.round(prob * 100)}%
              </text>
            </g>
          ))}
        </g>
      )}

      {/* Predicted token */}
      {step >= 7 && (
        <g>
          <rect x={340} y={215} width={62} height={32} rx={8}
            fill="#ec4899" stroke="#ec4899" strokeWidth={2} strokeDasharray="4 2" />
          <text x={371} y={235} textAnchor="middle" fontSize={11}
            fill="#fff" fontFamily="Arial" fontWeight="700">
            mat
          </text>
        </g>
      )}

      {/* Step label */}
      <text x={230} y={H - 5} textAnchor="middle" fontSize={10}
        fill="#94a3b8" fontFamily="Arial">
        {step === 0 && "Tokens d'entree : sequence de texte"}
        {step === 1 && "Token Embeddings + Positional Encoding"}
        {step >= 2 && step <= 5 && `Transformer Block ${step - 1}/${NUM_LAYERS} — Self-Attention + Residual`}
        {step === 6 && "LM Head — projection vers le vocabulaire"}
        {step >= 7 && "Sampling : temperature + top-p — token predit : mat"}
      </text>
    </svg>
  );
}