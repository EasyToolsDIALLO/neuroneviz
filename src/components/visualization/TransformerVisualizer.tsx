"use client";

// Steps: 0=Input 1=Embedding 2=Q/K/V 3=Attention scores 4=Softmax 5=Weighted sum 6=FFN 7=Output
const TOKENS = ["Le", "chat", "dort"];

export function TransformerVisualizer({ step = 0 }: { step?: number }) {
  const W = 820, H = 280;
  const tokenW = 70, tokenH = 36, tokenY = 220;
  const tokenXs = [100, 220, 340];
  const headColor = "#ef4444";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 280 }}>
      <defs>
        <marker id="tf-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#ef4444" />
        </marker>
        <marker id="tf-gray" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#cbd5e1" />
        </marker>
      </defs>

      {/* Input tokens */}
      {TOKENS.map((tok, i) => {
        const x = tokenXs[i];
        return (
          <g key={i}>
            <rect x={x - tokenW / 2} y={tokenY} width={tokenW} height={tokenH} rx={8}
              fill={step >= 0 ? "#6366f1" : "#f1f5f9"}
              stroke={step >= 0 ? "#6366f1" : "#e2e8f0"} strokeWidth={2} />
            <text x={x} y={tokenY + 22} textAnchor="middle" fontSize={11}
              fill={step >= 0 ? "#fff" : "#94a3b8"} fontFamily="Arial" fontWeight="700">
              {tok}
            </text>
          </g>
        );
      })}

      {/* Embedding vectors */}
      {step >= 1 && tokenXs.map((x, i) => (
        <g key={i}>
          <line x1={x} y1={tokenY - 2} x2={x} y2={tokenY - 28}
            stroke="#6366f1" strokeWidth={1.5} markerEnd="url(#tf-arr)" />
          <rect x={x - tokenW / 2} y={tokenY - 68} width={tokenW} height={36} rx={8}
            fill={step >= 1 ? "#818cf8" : "#f1f5f9"}
            stroke={step >= 1 ? "#818cf8" : "#e2e8f0"} strokeWidth={1.5} />
          <text x={x} y={tokenY - 46} textAnchor="middle" fontSize={9}
            fill={step >= 1 ? "#fff" : "#94a3b8"} fontFamily="Arial">embed</text>
          <text x={x} y={tokenY - 55} textAnchor="middle" fontSize={8}
            fill={step >= 1 ? "#e0e7ff" : "#cbd5e1"} fontFamily="Arial">+ pos</text>
        </g>
      ))}

      {/* Q / K / V projections */}
      {step >= 2 && tokenXs.map((x, i) => {
        const qkvY = tokenY - 110;
        return (
          <g key={i}>
            <line x1={x} y1={tokenY - 70} x2={x} y2={qkvY + 26}
              stroke="#ef4444" strokeWidth={1.5} markerEnd="url(#tf-arr)" />
            {["Q", "K", "V"].map((label, j) => (
              <g key={label}>
                <rect x={x - 28 + j * 22} y={qkvY} width={18} height={22} rx={5}
                  fill={["#ef4444", "#f97316", "#f59e0b"][j]}
                  opacity={0.85} />
                <text x={x - 19 + j * 22} y={qkvY + 15} textAnchor="middle" fontSize={9}
                  fill="#fff" fontFamily="Arial" fontWeight="700">{label}</text>
              </g>
            ))}
          </g>
        );
      })}

      {/* Attention scores matrix */}
      {step >= 3 && (
        <g transform="translate(500, 80)">
          <text x={60} y={-8} textAnchor="middle" fontSize={10} fill="#ef4444" fontFamily="Arial" fontWeight="700">
            Attention Scores QKᵀ/√d
          </text>
          {[[0.8, 0.1, 0.1], [0.2, 0.6, 0.2], [0.1, 0.3, 0.6]].map((row, i) =>
            row.map((val, j) => {
              const intensity = Math.round(val * 255);
              const fill = `rgb(${255 - Math.round(val * 180)}, ${255 - Math.round(val * 220)}, 255)`;
              return (
                <g key={`${i}-${j}`}>
                  <rect x={j * 36} y={i * 30} width={34} height={28} rx={4} fill={fill} />
                  <text x={j * 36 + 17} y={i * 30 + 18} textAnchor="middle" fontSize={10}
                    fill={val > 0.4 ? "#1e3a8a" : "#64748b"} fontFamily="Arial" fontWeight="700">
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })
          )}
          {/* Row/col labels */}
          {TOKENS.map((t, i) => (
            <g key={t}>
              <text x={i * 36 + 17} y={100} textAnchor="middle" fontSize={8} fill="#64748b" fontFamily="Arial">{t}</text>
              <text x={-10} y={i * 30 + 18} textAnchor="end" fontSize={8} fill="#64748b" fontFamily="Arial">{t}</text>
            </g>
          ))}
        </g>
      )}

      {/* Softmax annotation */}
      {step >= 4 && (
        <text x={560} y={200} textAnchor="middle" fontSize={10} fill="#ef4444" fontFamily="Arial" fontWeight="700">
          Softmax → poids d'attention
        </text>
      )}

      {/* Weighted sum */}
      {step >= 5 && (
        <text x={560} y={220} textAnchor="middle" fontSize={10} fill="#f97316" fontFamily="Arial" fontWeight="700">
          Context = Σ α_ij · V_j
        </text>
      )}

      {/* FFN */}
      {step >= 6 && (
        <g transform="translate(460, 60)">
          <rect x={0} y={100} width={100} height={34} rx={10}
            fill="#7c3aed" stroke="#7c3aed" strokeWidth={2} />
          <text x={50} y={121} textAnchor="middle" fontSize={10} fill="#fff" fontFamily="Arial" fontWeight="700">
            FFN + LayerNorm
          </text>
        </g>
      )}

      {/* Output */}
      {step >= 7 && (
        <text x={560} y={255} textAnchor="middle" fontSize={11} fill="#7c3aed" fontFamily="Arial" fontWeight="700">
          Output : représentations contextualisées ✓
        </text>
      )}
    </svg>
  );
}