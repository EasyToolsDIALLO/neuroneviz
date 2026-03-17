"use client";

// Steps: 0=Input 1=Update gate 2=Reset gate 3=Candidate h~ 4=New hidden 5=Output
export function GRUVisualizer({ step = 0 }: { step?: number }) {
  const W = 740, H = 260;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 260 }}>
      <defs>
        <marker id="gru-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#10b981" />
        </marker>
        <marker id="gru-gray" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#cbd5e1" />
        </marker>
      </defs>

      {/* Input box */}
      <rect x={20} y={105} width={60} height={36} rx={10}
        fill={step >= 0 ? "#10b981" : "#f1f5f9"}
        stroke={step >= 0 ? "#10b981" : "#e2e8f0"} strokeWidth={2} />
      <text x={50} y={128} textAnchor="middle" fontSize={10}
        fill={step >= 0 ? "#fff" : "#94a3b8"} fontFamily="Arial" fontWeight="700">x_t, h</text>

      {/* Gate definitions */}
      {[
        { label: "Update\nGate", symbol: "z", x: 220, y: 100, color: "#8b5cf6", s: 1 },
        { label: "Reset\nGate",  symbol: "r", x: 220, y: 185, color: "#f59e0b", s: 2 },
        { label: "Candidate\nh̃", symbol: "h̃", x: 430, y: 185, color: "#06b6d4", s: 3 },
        { label: "New\nHidden",  symbol: "h'", x: 570, y: 130, color: "#10b981", s: 4 },
      ].map(({ label, symbol, x, y, color, s }) => {
        const active = step === s;
        const done   = step > s;
        const fill   = active ? color : done ? color + "99" : "#f8fafc";
        const stroke = active ? color : done ? color + "55" : "#e2e8f0";
        return (
          <g key={symbol}>
            {active && <circle cx={x} cy={y} r={30} fill={color + "25"} />}
            <circle cx={x} cy={y} r={22} fill={fill} stroke={stroke} strokeWidth={active ? 2.5 : 1.5} />
            <text x={x} y={y + 5} textAnchor="middle" fontSize={13}
              fill={active || done ? "#fff" : "#334155"} fontFamily="Arial" fontWeight="700">
              {symbol}
            </text>
            {label.split("\n").map((ln, li) => (
              <text key={li} x={x} y={y - 30 + li * 13} textAnchor="middle" fontSize={9}
                fill={active ? color : "#94a3b8"} fontFamily="Arial" fontWeight={active ? "700" : "400"}>
                {ln}
              </text>
            ))}
          </g>
        );
      })}

      {/* Lines: input → update gate */}
      <line x1={80} y1={120} x2={198} y2={105}
        stroke={step >= 1 ? "#8b5cf6" : "#e2e8f0"} strokeWidth={step >= 1 ? 2 : 1.5}
        markerEnd={step >= 1 ? "url(#gru-arr)" : "url(#gru-gray)"} />
      {/* input → reset gate */}
      <line x1={80} y1={130} x2={198} y2={180}
        stroke={step >= 2 ? "#f59e0b" : "#e2e8f0"} strokeWidth={step >= 2 ? 2 : 1.5}
        markerEnd={step >= 2 ? "url(#gru-arr)" : "url(#gru-gray)"} />
      {/* reset → candidate */}
      <line x1={242} y1={185} x2={408} y2={185}
        stroke={step >= 3 ? "#06b6d4" : "#e2e8f0"} strokeWidth={step >= 3 ? 2 : 1.5}
        markerEnd={step >= 3 ? "url(#gru-arr)" : "url(#gru-gray)"} />
      {/* update + candidate → new hidden */}
      <path d={`M 242 100 Q 430 70 548 130`}
        fill="none" stroke={step >= 4 ? "#10b981" : "#e2e8f0"} strokeWidth={step >= 4 ? 2 : 1.5}
        markerEnd={step >= 4 ? "url(#gru-arr)" : "url(#gru-gray)"} />
      <path d={`M 452 185 Q 520 185 548 140`}
        fill="none" stroke={step >= 4 ? "#10b981" : "#e2e8f0"} strokeWidth={step >= 4 ? 2 : 1.5}
        markerEnd={step >= 4 ? "url(#gru-arr)" : "url(#gru-gray)"} />

      {/* Output */}
      {step >= 5 && (
        <>
          <line x1={592} y1={130} x2={680} y2={130}
            stroke="#10b981" strokeWidth={2} markerEnd="url(#gru-arr)" />
          <rect x={680} y={112} width={50} height={36} rx={10} fill="#10b981" />
          <text x={705} y={134} textAnchor="middle" fontSize={11} fill="#fff" fontFamily="Arial" fontWeight="700">
            h_t
          </text>
        </>
      )}

      {/* Interpolation formula */}
      {step >= 4 && (
        <text x={W / 2} y={H - 15} textAnchor="middle" fontSize={10} fill="#10b981" fontFamily="Arial" fontWeight="700">
          h_t = (1−z)·h_{"{t-1}"} + z·h̃
        </text>
      )}
    </svg>
  );
}