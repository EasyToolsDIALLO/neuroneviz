"use client";

// Steps: 0=Input 1=Forget 2=Input gate 3=Candidate 4=Cell state 5=Output gate 6=Hidden 7=Predict
export function LSTMVisualizer({ step = 0 }: { step?: number }) {
  const W = 820, H = 280;

  // Gate positions
  const gates = [
    { id: "f",  label: "Forget\nGate",  symbol: "×", x: 200, y: 130, color: "#ef4444", step: 1 },
    { id: "i",  label: "Input\nGate",   symbol: "σ", x: 340, y: 130, color: "#8b5cf6", step: 2 },
    { id: "g",  label: "Candidate",     symbol: "g", x: 340, y: 210, color: "#06b6d4", step: 3 },
    { id: "c",  label: "Cell\nState",   symbol: "C", x: 480, y: 80,  color: "#10b981", step: 4 },
    { id: "o",  label: "Output\nGate",  symbol: "σ", x: 620, y: 130, color: "#f59e0b", step: 5 },
    { id: "h",  label: "Hidden\nState", symbol: "h", x: 740, y: 130, color: "#6366f1", step: 6 },
  ];

  const isActive = (s: number) => step >= s;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 280 }}>
      <defs>
        <marker id="lstm-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#06b6d4" />
        </marker>
        <marker id="lstm-arr2" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#94a3b8" />
        </marker>
      </defs>

      {/* Cell state highway (top) */}
      <line x1={60} y1={80} x2={W - 20} y2={80}
        stroke={isActive(4) ? "#10b981" : "#e2e8f0"} strokeWidth={isActive(4) ? 3 : 2}
        strokeDasharray={isActive(4) ? "none" : "6 3"} />
      <text x={30} y={84} fontSize={10} fill={isActive(4) ? "#10b981" : "#94a3b8"} fontFamily="Arial" fontWeight="700">C</text>
      <text x={W - 15} y={84} fontSize={10} fill={isActive(4) ? "#10b981" : "#94a3b8"} fontFamily="Arial" fontWeight="700">C'</text>

      {/* Input x_t + h_{t-1} */}
      <rect x={20} y={115} width={50} height={30} rx={8}
        fill={isActive(0) ? "#6366f1" : "#f1f5f9"} stroke={isActive(0) ? "#6366f1" : "#e2e8f0"} />
      <text x={45} y={134} textAnchor="middle" fontSize={10}
        fill={isActive(0) ? "#fff" : "#94a3b8"} fontFamily="Arial" fontWeight="700">x,h</text>

      {/* Connections from input to gates */}
      {[200, 340, 620].map((gx, i) => (
        <line key={i} x1={70} y1={130} x2={gx - 22} y2={130}
          stroke={isActive(i + 1) ? "#6366f1" : "#e2e8f0"} strokeWidth={isActive(i + 1) ? 1.5 : 1}
          markerEnd={isActive(i + 1) ? "url(#lstm-arr)" : "url(#lstm-arr2)"} />
      ))}
      {/* To candidate */}
      <path d={`M 70 140 Q 200 210 318 210`}
        fill="none" stroke={isActive(3) ? "#06b6d4" : "#e2e8f0"} strokeWidth={isActive(3) ? 1.5 : 1}
        markerEnd={isActive(3) ? "url(#lstm-arr)" : "url(#lstm-arr2)"} />

      {/* Gates */}
      {gates.slice(0, 3).map((g) => {
        const active = step === g.step;
        const done = step > g.step;
        const fill = active ? g.color : done ? g.color + "99" : "#f8fafc";
        const stroke = active ? g.color : done ? g.color + "60" : "#e2e8f0";
        return (
          <g key={g.id}>
            {active && <circle cx={g.x} cy={g.y} r={30} fill={g.color + "25"} />}
            <circle cx={g.x} cy={g.y} r={22}
              fill={fill} stroke={stroke} strokeWidth={active ? 2.5 : 1.5} />
            <text x={g.x} y={g.y + 5} textAnchor="middle" fontSize={14}
              fill={active || done ? "#fff" : "#334155"} fontFamily="Arial" fontWeight="700">
              {g.symbol}
            </text>
            {/* Gate label above */}
            {g.label.split("\n").map((ln, li) => (
              <text key={li} x={g.x} y={g.y - 28 + li * 12} textAnchor="middle" fontSize={9}
                fill={active ? g.color : "#94a3b8"} fontFamily="Arial" fontWeight={active ? "700" : "400"}>
                {ln}
              </text>
            ))}
          </g>
        );
      })}

      {/* Forget × Cell state */}
      {isActive(1) && (
        <line x1={200} y1={108} x2={200} y2={88}
          stroke="#ef4444" strokeWidth={2} markerEnd="url(#lstm-arr)" />
      )}
      {/* Input × Candidate → Cell */}
      {isActive(3) && (
        <path d="M 340 108 Q 340 80 458 80"
          fill="none" stroke="#06b6d4" strokeWidth={1.5} markerEnd="url(#lstm-arr)" />
      )}

      {/* Cell state C box */}
      {gates.filter(g => g.id === "c").map(g => {
        const active = step === g.step;
        const done = step > g.step;
        const fill = active ? g.color : done ? g.color + "99" : "#f8fafc";
        return (
          <g key="cell-box">
            {active && <rect x={g.x - 28} y={g.y - 28} width={56} height={56} rx={14} fill={g.color + "25"} />}
            <rect x={g.x - 20} y={g.y - 20} width={40} height={40} rx={10}
              fill={fill} stroke={active ? g.color : done ? g.color + "70" : "#e2e8f0"} strokeWidth={active ? 2.5 : 1.5} />
            <text x={g.x} y={g.y + 5} textAnchor="middle" fontSize={14}
              fill={active || done ? "#fff" : "#334155"} fontFamily="Arial" fontWeight="800">
              C
            </text>
            <text x={g.x} y={g.y - 28} textAnchor="middle" fontSize={9}
              fill={active ? g.color : "#94a3b8"} fontFamily="Arial">Cell State</text>
          </g>
        );
      })}

      {/* C → Output gate connection */}
      {isActive(5) && (
        <path d={`M 500 80 Q 560 80 620 108`}
          fill="none" stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#lstm-arr)" />
      )}

      {/* Output gate & hidden state */}
      {gates.filter(g => g.id === "o" || g.id === "h").map(g => {
        const active = step === g.step;
        const done = step > g.step;
        const fill = active ? g.color : done ? g.color + "99" : "#f8fafc";
        return (
          <g key={g.id}>
            {active && <circle cx={g.x} cy={g.y} r={30} fill={g.color + "25"} />}
            <circle cx={g.x} cy={g.y} r={22}
              fill={fill} stroke={active ? g.color : done ? g.color + "60" : "#e2e8f0"} strokeWidth={active ? 2.5 : 1.5} />
            <text x={g.x} y={g.y + 5} textAnchor="middle" fontSize={14}
              fill={active || done ? "#fff" : "#334155"} fontFamily="Arial" fontWeight="700">
              {g.symbol}
            </text>
            {g.label.split("\n").map((ln, li) => (
              <text key={li} x={g.x} y={g.y - 30 + li * 12} textAnchor="middle" fontSize={9}
                fill={active ? g.color : "#94a3b8"} fontFamily="Arial" fontWeight={active ? "700" : "400"}>
                {ln}
              </text>
            ))}
          </g>
        );
      })}

      {/* Output gate → hidden state */}
      {isActive(6) && (
        <line x1={642} y1={130} x2={718} y2={130}
          stroke="#6366f1" strokeWidth={2} markerEnd="url(#lstm-arr)" />
      )}

      {/* Output label */}
      {step >= 7 && (
        <g>
          <rect x={W - 70} y={115} width={60} height={30} rx={8} fill="#6366f1" />
          <text x={W - 40} y={134} textAnchor="middle" fontSize={10} fill="#fff" fontFamily="Arial" fontWeight="700">
            ŷ_t
          </text>
        </g>
      )}
    </svg>
  );
}