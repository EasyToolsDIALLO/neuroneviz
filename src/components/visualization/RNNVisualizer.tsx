"use client";

const H_STATES = ["h0", "h1", "h2", "h3"];
const CELL_X   = [140, 300, 460, 620];
const R        = 32;

export default function RNNVisualizer({ step = 0 }: { step?: number }) {
  const W       = 800;
  const H       = 240;
  const CY      = 120;
  const inputY  = 200;
  const outputY = 40;

  const activeCell = Math.min(step - 1, 3);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 240 }}>
      <defs>
        <marker id="rnn-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#8b5cf6" />
        </marker>
        <marker id="rnn-gray" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#cbd5e1" />
        </marker>
        <marker id="rnn-pink" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#ef4444" />
        </marker>
      </defs>

      {/* Recurrent arrows between cells */}
      {CELL_X.slice(0, -1).map((x, i) => {
        const active = i < activeCell;
        return (
          <g key={`rec-${i}`}>
            <line x1={x + R} y1={CY} x2={CELL_X[i + 1] - R} y2={CY}
              stroke={active ? "#8b5cf6" : "#e2e8f0"}
              strokeWidth={active ? 2.5 : 1.5}
              markerEnd={active ? "url(#rnn-arr)" : "url(#rnn-gray)"} />
            <text x={(x + CELL_X[i + 1]) / 2} y={CY - 10}
              textAnchor="middle" fontSize={9}
              fill={active ? "#8b5cf6" : "#cbd5e1"} fontFamily="Arial">
              {H_STATES[i]}
            </text>
          </g>
        );
      })}

      {/* Input arrows x_t */}
      {CELL_X.map((x, i) => {
        const active = step >= i + 1;
        return (
          <g key={`in-${i}`}>
            <line x1={x} y1={inputY - 8} x2={x} y2={CY + R + 2}
              stroke={active ? "#8b5cf6" : "#e2e8f0"}
              strokeWidth={active ? 2 : 1.5}
              markerEnd={active ? "url(#rnn-arr)" : "url(#rnn-gray)"} />
            <rect x={x - 18} y={inputY} width={36} height={24} rx={6}
              fill={active ? "#8b5cf6" : "#f1f5f9"}
              stroke={active ? "#8b5cf6" : "#e2e8f0"} />
            <text x={x} y={inputY + 16} textAnchor="middle" fontSize={10}
              fill={active ? "#fff" : "#94a3b8"} fontFamily="Arial" fontWeight="700">
              {`x${i + 1}`}
            </text>
          </g>
        );
      })}

      {/* Output arrows y_t */}
      {CELL_X.map((x, i) => {
        const active = step >= 5;
        return (
          <g key={`out-${i}`}>
            <line x1={x} y1={CY - R - 2} x2={x} y2={outputY + 14}
              stroke={active ? "#ec4899" : "#e2e8f0"}
              strokeWidth={active ? 2 : 1.5}
              strokeDasharray={active ? "4 2" : "none"}
              markerEnd={active ? "url(#rnn-arr)" : "url(#rnn-gray)"} />
            <rect x={x - 18} y={outputY - 14} width={36} height={24} rx={6}
              fill={active ? "#ec4899" : "#f1f5f9"}
              stroke={active ? "#ec4899" : "#e2e8f0"} />
            <text x={x} y={outputY + 1} textAnchor="middle" fontSize={10}
              fill={active ? "#fff" : "#94a3b8"} fontFamily="Arial" fontWeight="700">
              {`y${i + 1}`}
            </text>
          </g>
        );
      })}

      {/* RNN cells */}
      {CELL_X.map((x, i) => {
        const isActive = i === activeCell && step >= 1 && step <= 4;
        const isDone   = i < activeCell;
        const fill   = isActive ? "#8b5cf6" : isDone ? "#8b5cf699" : "#f8fafc";
        const stroke = isActive ? "#8b5cf6" : isDone ? "#8b5cf660" : "#e2e8f0";
        return (
          <g key={`cell-${i}`}>
            {isActive && <circle cx={x} cy={CY} r={R + 8} fill="#8b5cf620" />}
            <circle cx={x} cy={CY} r={R}
              fill={fill} stroke={stroke} strokeWidth={isActive ? 2.5 : 1.5} />
            <text x={x} y={CY - 4} textAnchor="middle" fontSize={13}
              fill={isActive || isDone ? "#fff" : "#334155"} fontFamily="Arial" fontWeight="700">
              RNN
            </text>
            <text x={x} y={CY + 11} textAnchor="middle" fontSize={9}
              fill={isActive ? "#e0e7ff" : "#94a3b8"} fontFamily="Arial">
              {`t=${i + 1}`}
            </text>
          </g>
        );
      })}

      {/* BPTT arrow */}
      {step >= 6 && (
        <g>
          <path
            d={`M ${CELL_X[3] - 10},${CY + R + 5} Q ${(CELL_X[0] + CELL_X[3]) / 2},${H - 10} ${CELL_X[0] + 10},${CY + R + 5}`}
            fill="none" stroke="#ef4444" strokeWidth={2}
            strokeDasharray="6 3" markerEnd="url(#rnn-pink)" />
          <text x={(CELL_X[0] + CELL_X[3]) / 2} y={H - 6}
            textAnchor="middle" fontSize={10}
            fill="#ef4444" fontFamily="Arial" fontWeight="700">
            Backpropagation Through Time (BPTT)
          </text>
        </g>
      )}
    </svg>
  );
}