"use client";

const LAYERS = [
  { id: "input",  label: "Input",   sub: "3x32x32",    color: "#6366f1", x: 60,  rect: true },
  { id: "conv1",  label: "Conv2D",  sub: "32 filtres", color: "#818cf8", x: 190, rect: false },
  { id: "bn",     label: "BN+ReLU",sub: "",            color: "#a5b4fc", x: 310, rect: false },
  { id: "pool1",  label: "MaxPool", sub: "2x2",        color: "#06b6d4", x: 420, rect: false },
  { id: "conv2",  label: "Conv2D",  sub: "64 filtres", color: "#818cf8", x: 530, rect: false },
  { id: "pool2",  label: "MaxPool", sub: "2x2",        color: "#06b6d4", x: 640, rect: false },
  { id: "fc",     label: "Dense",   sub: "512",        color: "#f59e0b", x: 750, rect: false },
  { id: "out",    label: "Softmax", sub: "10 classes", color: "#ef4444", x: 860, rect: false },
];

export default function CNNVisualizer({ step = 0 }: { step?: number }) {
  const W = 960;
  const H = 220;
  const CY = 110;
  const activeCapped = Math.min(step, LAYERS.length);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 220 }}>
      <defs>
        <marker id="cnn-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#cbd5e1" />
        </marker>
        <marker id="cnn-arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#6366f1" />
        </marker>
      </defs>

      {/* Connections */}
      {LAYERS.slice(0, -1).map((l, i) => {
        const next = LAYERS[i + 1];
        const done = i < activeCapped - 1;
        const current = i === activeCapped - 1;
        const x1 = l.rect ? l.x + 36 : l.x + 28;
        return (
          <line key={i}
            x1={x1} y1={CY} x2={next.x - 28} y2={CY}
            stroke={current ? "#6366f1" : done ? "#a5b4fc" : "#e2e8f0"}
            strokeWidth={current ? 2.5 : 1.5}
            strokeDasharray={current ? "6 3" : "none"}
            markerEnd={current ? "url(#cnn-arrow-active)" : "url(#cnn-arrow)"}
          />
        );
      })}

      {/* Nodes */}
      {LAYERS.map((l, i) => {
        const isActive = i === activeCapped;
        const isDone   = i < activeCapped;
        const r = 28;
        const fill   = isActive || isDone ? l.color + (isDone && !isActive ? "99" : "") : "#f8fafc";
        const stroke = isActive || isDone ? l.color : "#e2e8f0";

        return (
          <g key={l.id} transform={`translate(${l.x}, ${CY})`}>
            {isActive && <circle r={r + 8} fill={l.color + "30"} />}
            {l.rect ? (
              <rect x={-36} y={-40} width={72} height={80} rx={10}
                fill={fill} stroke={stroke} strokeWidth={isActive ? 2.5 : 1.5} />
            ) : (
              <circle r={r}
                fill={fill} stroke={stroke} strokeWidth={isActive ? 2.5 : 1.5} />
            )}
            <text y={-5} textAnchor="middle" fontSize={11} fontWeight="700"
              fill={isActive || isDone ? "#fff" : "#334155"} fontFamily="Arial">
              {l.label}
            </text>
            {l.sub ? (
              <text y={9} textAnchor="middle" fontSize={9}
                fill={isActive ? "#e0e7ff" : "#94a3b8"} fontFamily="Arial">
                {l.sub}
              </text>
            ) : null}
            <text y={r + 18} textAnchor="middle" fontSize={9}
              fill={isActive ? l.color : "#cbd5e1"} fontFamily="Arial" fontWeight={isActive ? "700" : "400"}>
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* Feature map indicators at conv layers */}
      {[1, 4].map((idx) => {
        if (activeCapped <= idx) return null;
        return (
          <g key={`fm-${idx}`}
            transform={`translate(${LAYERS[idx].x + 38}, 60)`}
            opacity={activeCapped > idx + 1 ? 0.4 : 1}>
            {[0, 1, 2].map((k) => (
              <rect key={k} x={k * 6} y={k * 6} width={26} height={26}
                rx={3} fill="none" stroke={LAYERS[idx].color} strokeWidth={1}
                opacity={1 - k * 0.25} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}