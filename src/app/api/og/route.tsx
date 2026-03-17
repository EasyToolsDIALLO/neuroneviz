import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { ARCH_GRADIENTS } from "@/lib/utils";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "NeuroViz";
  const path  = searchParams.get("path")  ?? "/";

  const [from, to] = ARCH_GRADIENTS[path.replace("/architectures/", "")] ?? ["#6366f1", "#8b5cf6"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          background: `linear-gradient(135deg, ${from}, ${to})`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36,
          }}>
            🧠
          </div>
          <span style={{ fontSize: 36, fontWeight: 700, color: "white" }}>NeuroViz</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: title.length > 30 ? 52 : 68,
          fontWeight: 800, color: "white",
          textAlign: "center", lineHeight: 1.1,
          margin: "0 0 24px",
          textShadow: "0 2px 20px rgba(0,0,0,0.3)",
        }}>
          {title}
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: 28, color: "rgba(255,255,255,0.85)", fontWeight: 500, margin: 0 }}>
          Visualisations · Simulations · Code · Formules
        </p>

        {/* Footer */}
        <div style={{
          position: "absolute", bottom: 40, left: 60, right: 60,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 20 }}>neuroviz.app</span>
          <span style={{
            background: "rgba(255,255,255,0.2)", color: "white",
            padding: "8px 20px", borderRadius: 999, fontSize: 20, fontWeight: 600,
          }}>
            Gratuit
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}