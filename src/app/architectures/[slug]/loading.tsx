export default function Loading() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      <main className="flex-1 overflow-y-auto">
        {/* Header skeleton */}
        <div className="bg-white border-b border-slate-100 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-48 rounded bg-slate-200 animate-pulse" />
              <div className="h-4 w-72 rounded bg-slate-100 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="px-8 py-6 space-y-6">
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 w-28 rounded-lg bg-slate-200 animate-pulse" />
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-8 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 rounded bg-slate-100 animate-pulse" style={{ width: `${85 - i * 5}%` }} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}