"use client";

// Steps: 0=Graph 1=Features 2=Message 3=Aggregate 4=Update 5=Pool 6=Classify
const NODES = [
  { id: 0, x: 160, y: 100, label: "A" },
  { id: 1, x: 300, y: 60,  label: "B" },
  { id: 2, x: 380, y: 160, label: "C" },
  { id: 3, x: 240, y: 200, label: "D" },
  { id: 4, x: 100, y: 200, label: "E" },
];
const EDGES = [[0,1],[1,2],[2,3],[3,0],[0,4],[3,4]];

export function GNNVisualizer({ step = 0 }: { step?: number }) {
  const W = 760, H = 270;
  const nodeR = 24;

  // Active node during message passing
  const targetNode = step === 2 ? 2 : step === 3 ? 0 : step === 4 ? 3 : -1;
  const nodeColor = (i: number) => {
    if (step === 0) return ["#f8fafc", "#e2e8f0", "#94a3b8"] as const;
    if (step >= 5 && i === 0) return ["#10b981", "#10b981", "#fff"] as const;
    if (i === targetNode) return ["#f59e0b", "#f59e0b", "#fff"] as const;
    if (step >= 2) return ["#8b5cf6cc", "#8b5cf6", "#fff"] as const;
    if (step >= 1) return ["#8b5cf655", "#8b5cf6", "#fff"] as const;
    return ["#f8fafc", "#e2e8f0", "#94a3b8"] as const;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 270 }}>
      <defs>
        <marker id="gnn-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#f59e0b" />
        </marker>
      </defs>

      {/* Edges */}
      {EDGES.map(([a, b], i) => {
        const na = NODES[a], nb = NODES[b];
        const isMsgEdge = step === 2 && (b === 2 || a === 2);
        const isActive = step >= 2 && (isMsgEdge);
        return (
          <g key={i}>
            <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={isMsgEdge ? "#f59e0b" : step >= 1 ? "#8b5cf655" : "#e2e8f0"}
              strokeWidth={isMsgEdge ? 2.5 : 1.5}
              strokeDasharray={isMsgEdge ? "5 3" : "none"}
              markerEnd={isMsgEdge ? "url(#gnn-arr)" : "none"} />
            {/* Message bubble on edge during step 2 */}
            {isMsgEdge && step === 2 && (
              <circle cx={(na.x + nb.x) / 2} cy={(na.y + nb.y) / 2} r={8}
                fill="#f59e0b" opacity={0.9} />
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {NODES.map((n, i) => {
        const [fill, stroke, textFill] = nodeColor(i);
        const isTarget = i === targetNode;
        return (
          <g key={n.id}>
            {isTarget && <circle cx={n.x} cy={n.y} r={nodeR + 10} fill="#f59e0b20" />}
            <circle cx={n.x} cy={n.y} r={nodeR}
              fill={fill} stroke={stroke} strokeWidth={isTarget ? 2.5 : 1.5} />
            <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={13}
              fill={textFill} fontFamily="Arial" fontWeight="700">
              {n.label}
            </text>
            {/* Feature vector indicator */}
            {step >= 1 && (
              <rect x={n.x + nodeR - 4} y={n.y - nodeR} width={8} height={16}
                rx={2} fill="#8b5cf6" opacity={0.6} />
            )}
          </g>
        );
      })}

      {/* Stage labels */}
      {step === 0 && <text x={250} y={255} textAnchor="middle" fontSize={11} fill="#8b5cf6" fontFamily="Arial">Graphe initial — 5 noeuds, 6 arêtes</text>}
      {step === 1 && <text x={250} y={255} textAnchor="middle" fontSize={11} fill="#8b5cf6" fontFamily="Arial" fontWeight="700">Initialisation des features vectoriels h_v</text>}
      {step === 2 && <text x={250} y={255} textAnchor="middle" fontSize={11} fill="#f59e0b" fontFamily="Arial" fontWeight="700">Message passing : m_v = Σ W·h_u  (voisins)</text>}
      {step === 3 && <text x={250} y={255} textAnchor="middle" fontSize={11} fill="#f59e0b" fontFamily="Arial" fontWeight="700">Agrégation des messages reçus</text>}
      {step === 4 && <text x={250} y={255} textAnchor="middle" fontSize={11} fill="#8b5cf6" fontFamily="Arial" fontWeight="700">Mise à jour : h_v = σ(W·[h_v | m_v])</text>}
      {step === 5 && <text x={250} y={255} textAnchor="middle" fontSize={11} fill="#10b981" fontFamily="Arial" fontWeight="700">Global pooling : h_G = Σ h_v</text>}
      {step >= 6 && <text x={250} y={255} textAnchor="middle" fontSize={11} fill="#10b981" fontFamily="Arial" fontWeight="700">Classification : ŷ = softmax(W·h_G)</text>}

      {/* Pooling + classifier visualization */}
      {step >= 5 && (
        <g transform="translate(520, 80)">
          <rect x={0} y={0} width={80} height={50} rx={12}
            fill={step >= 5 ? "#10b981" : "#f1f5f9"}
            stroke={step >= 5 ? "#10b981" : "#e2e8f0"} strokeWidth={2} />
          <text x={40} y={20} textAnchor="middle" fontSize={10} fill="#fff" fontFamily="Arial" fontWeight="700">Global</text>
          <text x={40} y={36} textAnchor="middle" fontSize={10} fill="#fff" fontFamily="Arial" fontWeight="700">Pool h_G</text>

          {step >= 6 && (
            <>
              <line x1={80} y1={25} x2={110} y2={25}
                stroke="#10b981" strokeWidth={2} markerEnd="url(#gnn-arr)" />
              <rect x={110} y={0} width={70} height={50} rx={12}
                fill="#6366f1" stroke="#6366f1" strokeWidth={2} />
              <text x={145} y={20} textAnchor="middle" fontSize={10} fill="#fff" fontFamily="Arial" fontWeight="700">Classify</text>
              <text x={145} y={36} textAnchor="middle" fontSize={10} fill="#e0e7ff" fontFamily="Arial">Softmax</text>
            </>
          )}
        </g>
      )}
    </svg>
  );
}