"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";

interface SimStep  { title: string; description: string }
interface SimulationPlayerProps {
  steps: SimStep[];
  color?: string;
  visualizer?: React.ReactNode;
}

export function SimulationPlayer({ steps, color = "#6366f1", visualizer }: SimulationPlayerProps) {
  const [current,  setCurrent]  = useState(0);
  const [playing,  setPlaying]  = useState(false);
  const [speed,    setSpeed]    = useState(1);

  const next = useCallback(() => {
    setCurrent((c) => {
      if (c >= steps.length - 1) { setPlaying(false); return c; }
      return c + 1;
    });
  }, [steps.length]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(next, 2000 / speed);
    return () => clearInterval(id);
  }, [playing, speed, next]);

  const reset = () => { setCurrent(0); setPlaying(false); };

  return (
    <div className="space-y-5">
      {/* Visualisation */}
      {visualizer && (
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 min-h-48 flex items-center justify-center">
          {visualizer}
        </div>
      )}

      {/* Étape courante */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 min-h-28">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: color }}
          >
            {current + 1}
          </div>
          <div>
            <p className="font-semibold text-slate-800 mb-1">{steps[current].title}</p>
            <p className="text-sm text-slate-500 leading-relaxed">{steps[current].description}</p>
          </div>
        </div>
      </div>

      {/* Progress bar — cliquable */}
      <div className="flex gap-1.5">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setPlaying(false); }}
            className="flex-1 h-1.5 rounded-full transition-all"
            style={{ backgroundColor: i <= current ? color : "#e2e8f0" }}
            aria-label={`Étape ${i + 1}`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={reset} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: color }}
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {playing ? "Pause" : "Play"}
          </button>
          <button
            onClick={next}
            disabled={current >= steps.length - 1}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-30"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Vitesse</span>
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className="px-2 py-1 rounded text-xs font-medium transition-all"
              style={{
                backgroundColor: speed === s ? color + "20" : "transparent",
                color: speed === s ? color : "#94a3b8",
              }}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* Étapes — liste */}
      <div className="space-y-1 mt-2">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setPlaying(false); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all hover:bg-slate-50"
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{
                backgroundColor: i === current ? color : i < current ? color + "30" : "#f1f5f9",
                color:           i === current ? "white"  : i < current ? color    : "#94a3b8",
              }}
            >
              {i + 1}
            </div>
            <span className={`text-xs ${i === current ? "text-slate-800 font-medium" : "text-slate-400"}`}>
              {step.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}