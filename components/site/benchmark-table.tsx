import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface BenchNumbers {
  p99_tick_ms: number
  p50_tick_ms: number
  max_tick_ms: number
  tick_count: number
  rss_peak_kb: number
  cold_start_us: number
  throughput_parse_per_sec: number
  throughput_next_per_sec: number
}

interface Props {
  rust: BenchNumbers
  go: BenchNumbers
}

const fmt = (n: number) => n.toLocaleString("en-US")

export function BenchmarkTable({ rust, go }: Props) {
  const rows = [
    { metric: "p99 tick lateness", rust: `${rust.p99_tick_ms} ms`, go: `${go.p99_tick_ms} ms` },
    { metric: "p50 tick lateness", rust: `${rust.p50_tick_ms} ms`, go: `${go.p50_tick_ms} ms` },
    { metric: "max tick lateness", rust: `${rust.max_tick_ms} ms`, go: `${go.max_tick_ms} ms` },
    { metric: "peak RSS", rust: `${(rust.rss_peak_kb / 1024).toFixed(1)} MB`, go: `${(go.rss_peak_kb / 1024).toFixed(1)} MB` },
    { metric: "cold start", rust: `${rust.cold_start_us} us`, go: `${go.cold_start_us} us` },
    { metric: "parser throughput", rust: `${fmt(rust.throughput_parse_per_sec)} ops/s`, go: `${fmt(go.throughput_parse_per_sec)} ops/s` },
    { metric: "Next() throughput", rust: `${fmt(rust.throughput_next_per_sec)} ops/s`, go: `${fmt(go.throughput_next_per_sec)} ops/s` },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="text-right">Rust port</TableHead>
              <TableHead className="text-right">Go original</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.metric}>
                <TableCell className="text-muted-foreground">
                  {row.metric}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {row.rust}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-muted-foreground">
                  {row.go}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Tick lateness is how late a scheduled job fires vs its 50 ms cadence
        (delta − period). Rust&apos;s p99 sits at ~1.6 ms — the ~1 ms floor of
        tokio&apos;s timer wheel on a 50 ms schedule; Go&apos;s <code>time.Timer</code>
        has sub-millisecond granularity and lands lower (~1.1 ms). The Track E
        thesis is not that Rust beats Go&apos;s sub-ms timer — it is that Rust&apos;s
        p99 stays predictable with no GC stop-the-world pauses, which shows
        up under sustained load rather than a 25-second microbenchmark. The
        <code>soak_harness</code> bin runs that sustained-load test (4 h at 50 ms).
        Methodology lives in <code>bench/methodology.md</code>, raw data in
        <code>bench/results.json</code>.
      </p>
    </div>
  )
}