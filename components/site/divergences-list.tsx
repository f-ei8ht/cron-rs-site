const divergences = [
  ["Goroutines and channels", "tokio tasks, mpsc, tokio::select!"],
  ["Shared runtime", "a dedicated OS thread per running Cron"],
  ["Interface values", "Arc<dyn Job> and Arc<dyn Schedule>"],
  ["Chain wrapping", "an ArcJob adapter bridging Arc to Box<dyn Job>"],
  ["sync.WaitGroup", "AtomicUsize paired with tokio::sync::Notify"],
  ["Stop() returns context.Context", "Stop() returns oneshot::Receiver<()>"],
  ["defer cron.Stop()", "Drop stops the worker thread"],
  ["Entries via snapshot channel", "entries() via a oneshot command reply"],
  ["time.Location", "chrono and chrono-tz, DST gaps and overlaps"],
  ["defer recover()", "std::panic::catch_unwind"],
  ["time.Duration rounding", "Every() semantics kept, whole-second snaps"],
  ["Untyped int bitmasks", "a Copy ParseOption struct over u16"],
]

export function DivergencesList() {
  return (
    <ol className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {divergences.map(([from, to], index) => (
        <li key={from} className="flex items-baseline gap-3 text-sm">
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-muted-foreground">{from}</span>
          <span className="text-muted-foreground">-&gt;</span>
          <span>{to}</span>
        </li>
      ))}
    </ol>
  )
}
