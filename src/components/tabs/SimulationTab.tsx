"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { ArchViz } from "../visualization/ArchViz";

interface SimStep  { title: string; description: string }
interface SimulationTabProps {
  simulation: { description: string; defaultInput: object; steps: SimStep[] } | null;
  color: string;
  slug: string;
}

export function SimulationTab({ simulation, color, slug }: SimulationTabProps) {
  if (!simulation) return <p className="text-slate-400">Aucune simulation disponible.</p>;
  return <SimPlayer steps={simulation.steps} color={color} slug={slug} description={simulation.description} />;
}

function SimPlayer({ steps, color, slug, description }: {
  steps: SimStep[]; color: string; slug: string; description: string;
}) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed,   setSpeed]   = useState(1);
  const [loop,    setLoop]    = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => {
      if (c >= steps.length - 1) { if (loop) return 0; setPlaying(false); return c; }
      return c + 1;
    });
  }, [steps.length, loop]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(next, 1800 / speed);
    return () => clearInterval(id);
  }, [playing, speed, next]);

  const reset = () => { setCurrent(0); setPlaying(false); };
  const pct   = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Visualizer */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Visualisation</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
            Étape {current + 1}/{steps.length}
          </span>
        </div>
        <div className="min-h-[220px] flex items-center justify-center">
          <ArchViz slug={slug} step={current} />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <p className="text-sm text-slate-500 mb-4">{description}</p>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <button onClick={() => setPlaying((p) => !p)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all active:scale-95"
            style={{ background: color }}>
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? "Pause" : "Play"}
          </button>
          <button onClick={next} disabled={current >= steps.length - 1}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-all">
            <SkipForward size={16} />
          </button>
          <button onClick={reset}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">
            <RotateCcw size={16} />
          </button>

          <label className="flex items-center gap-1.5 ml-1 cursor-pointer select-none">
            <div onClick={() => setLoop(l => !l)}
              className="relative w-9 h-5 rounded-full transition-colors cursor-pointer"
              style={{ background: loop ? color : "#e2e8f0" }}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${loop ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
            <span className="text-xs text-slate-500">Continu</span>
          </label>

          <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
            <span>Vitesse</span>
            {[0.5, 1, 2].map((s) => (
              <button key={s} onClick={() => setSpeed(s)}
                className="px-2 py-1 rounded-lg border transition-all text-xs font-medium"
                style={speed === s
                  ? { background: color, color: "#fff", borderColor: color }
                  : { borderColor: "#e2e8f0", color: "#64748b" }}>
                {s}×
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-5 relative h-2 bg-slate-100 rounded-full cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setCurrent(Math.round((e.clientX - rect.left) / rect.width * (steps.length - 1)));
          }}>
          <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: color }} />
          {steps.map((_, i) => (
            <div key={i}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white transition-all"
              style={{ left: `calc(${(i / (steps.length - 1)) * 100}% - 4px)`,
                background: i <= current ? color : "#cbd5e1" }} />
          ))}
        </div>

        {/* Current step card */}
        <div className="rounded-xl p-4 border" style={{ borderColor: color + "33", background: color + "08" }}>
          <p className="text-sm font-bold mb-1" style={{ color }}>
            Étape {current + 1} — {steps[current]?.title}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">{steps[current]?.description}</p>
        </div>

        {/* Step chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {steps.map((s, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              style={i === current
                ? { background: color, color: "#fff", borderColor: color }
                : i < current
                  ? { background: color + "15", color, borderColor: color + "30" }
                  : { background: "#f8fafc", color: "#94a3b8", borderColor: "#e2e8f0" }}>
              {i + 1}. {s.title.length > 16 ? s.title.slice(0, 16) + "…" : s.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}