import "server-only"
import { cacheLife, cacheTag } from "next/cache"

export interface DiffPair {
  id: string
  label: string
  note: string
  oldFile: { name: string; contents: string }
  newFile: { name: string; contents: string }
}

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

interface BenchResults {
  rust: BenchNumbers
  go: BenchNumbers
}

export interface SoakResults {
  duration_s: number
  period_ms: number
  entries: number
  tick_count: number
  lateness_p50_ms: number
  lateness_p99_ms: number
  lateness_max_ms: number
  rss_min_kb: number
  rss_max_kb: number
  rss_end_kb: number
  samples_logged: number
}

const PORT_REPO = "f-ei8ht/robfig-cron-rs"
const PORT_REF = "master"
const GO_REPO = "robfig/cron"
const GO_REF = "v3.0.1"

const RAW = (repo: string, ref: string, path: string) =>
  `https://raw.githubusercontent.com/${repo}/${ref}/${path}`

const pairMeta = [
  {
    id: "parser",
    label: "parser",
    note: "Expression parser. Where the issue #543 step-range fix landed.",
    goPath: "parser.go",
    rsPath: "src/parser.rs",
  },
  {
    id: "cron",
    label: "cron",
    note: "The scheduler core. Goroutines and channels became tokio tasks and mpsc.",
    goPath: "cron.go",
    rsPath: "src/cron.rs",
  },
  {
    id: "spec",
    label: "spec",
    note: "Schedule computation. DST gaps and overlaps handled via chrono-tz.",
    goPath: "spec.go",
    rsPath: "src/spec.rs",
  },
  {
    id: "constantdelay",
    label: "constant delay",
    note: "The smallest module. Every(5m) semantics preserved.",
    goPath: "constantdelay.go",
    rsPath: "src/constant_delay.rs",
  },
]

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`fetch ${url}: ${res.status}`)
  return res.text()
}

export async function loadDiffPairs(): Promise<DiffPair[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("github")

  const entries = await Promise.all(
    pairMeta.map(async (p) => {
      const [goContents, rsContents] = await Promise.all([
        fetchText(RAW(GO_REPO, GO_REF, p.goPath)),
        fetchText(RAW(PORT_REPO, PORT_REF, p.rsPath)),
      ])
      return {
        id: p.id,
        label: p.label,
        note: p.note,
        oldFile: { name: p.goPath, contents: goContents },
        newFile: { name: p.rsPath.split("/").pop() as string, contents: rsContents },
      } satisfies DiffPair
    })
  )
  return entries
}

export async function loadRepoPaths(): Promise<string[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("github")

  try {
    const res = await fetch(
      `https://api.github.com/repos/${PORT_REPO}/git/trees/${PORT_REF}?recursive=1`,
      { cache: "no-store" }
    )
    if (!res.ok) throw new Error(`trees ${res.status}`)
    const json = (await res.json()) as {
      tree: { path: string; type: string }[]
    }
    const paths = json.tree
      .filter((e) => e.type === "blob")
      .map((e) => e.path)
      .sort((a, b) => a.localeCompare(b))
    return paths
  } catch {
    return FALLBACK_PATHS
  }
}

export async function loadBenchResults(): Promise<BenchResults> {
  "use cache"
  cacheLife("hours")
  cacheTag("github")

  try {
    const txt = await fetchText(RAW(PORT_REPO, PORT_REF, "bench/results.json"))
    return JSON.parse(txt) as BenchResults
  } catch {
    return FALLBACK_BENCH
  }
}

export async function loadReadme(): Promise<string> {
  "use cache"
  cacheLife("hours")
  cacheTag("github")

  try {
    return await fetchText(RAW(PORT_REPO, PORT_REF, "README.md"))
  } catch {
    return FALLBACK_README
  }
}

export async function loadSoakResults(): Promise<SoakResults | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("github")

  try {
    const txt = await fetchText(
      RAW(PORT_REPO, PORT_REF, "bench/soak-results.json")
    )
    return JSON.parse(txt) as SoakResults
  } catch {
    return FALLBACK_SOAK
  }
}

const FALLBACK_README = `# robfig-cron-rs

> **[Live project site -> cron-rs-site.vercel.app](https://cron-rs-site.vercel.app/)**
> Side-by-side Go<->Rust diffs, benchmarks, the 4-hour soak results, and the
> bug writeups, rendered in the browser.

A faithful Rust port of robfig/cron (v3), the de facto Go cron library.

This is a **Track E** port-mortem exercise: Go -> Rust, motivated by the
GC-pause-vs-tail-latency problem statement. The cron scheduler's core loop
(sleep -> wake -> run job) is directly vulnerable to GC-induced jitter,
making it an ideal candidate for measuring the latency improvements a
no-GC runtime delivers.

- 872 lines of Go ported to 1,444 lines of idiomatic, zero-unsafe Rust
- 52/52 original tests passing (vendored and hash-pinned)
- 204,425 differential fuzz cases with zero unintended divergences
- Interactive TUI dashboard, Dockerfile included
- Soak test: 64.5M ticks over 4h, p99 lateness 2.27 ms flat (no GC spikes)

## Quickstart (judges' path)

\`\`\`sh
docker build -t robfig-cron-rs .
docker run --rm -it robfig-cron-rs             # interactive TUI dashboard
\`\`\`

That lands you in cron-rs-cli, a single-screen dashboard:

- \`t\` runs the 52 integration tests live and shows the summary
- \`i\` focuses the sandbox; \`Tab\` toggles between expr and from; \`Enter\` computes Next()
- \`f\` runs a 10-second mini fuzz in-process
- \`l\` shows the 60s fuzz log summary (cases, divergences) + the docker command for the full log
- \`b\` runs the four-metric benchmark and shows a compact Rust-vs-Go summary
- \`q\` quits

Other entry points from the same image:

\`\`\`sh
docker run --rm robfig-cron-rs cargo test --test port       # 52 integration tests
docker run --rm robfig-cron-rs ./bench_harness              # benchmarks (Rust + Go side-by-side)
docker run --rm robfig-cron-rs ./fuzz_harness 60           # 60s differential fuzz
docker run --rm robfig-cron-rs ./soak_harness --duration 14400 --period-ms 50  # 4h soak
\`\`\`

## Build (from source, no Docker)

If you have Rust 1.88+ and Go 1.22+ installed:

\`\`\`sh
# Build all binaries (TUI + bench + soak + fuzz)
cargo build --release --features "cli,bench"

# Interactive TUI dashboard
cargo run --release --features cli --bin cron-rs-cli

# Run the 52 integration tests
cargo test --test port

# Benchmarks (Rust vs Go side-by-side)
( cd bench-helper && go build -o bench-helper . )
cargo run --release --features bench --bin bench_harness

# 60s differential fuzz
( cd fuzz-helper && go build -o go-fuzz-helper . )
git clone --depth=1 --branch=v3.0.1 https://github.com/robfig/cron ../cron
cargo run --release --features fuzz --bin fuzz_harness -- 60

# 4-hour soak
./soak.sh
# or:
cargo run --release --features bench --bin soak_harness -- --duration 14400 --period-ms 50
\`\`\`

## Viewing logs and results

With Docker:

\`\`\`sh
docker run --rm robfig-cron-rs cat fuzz/log.txt           # 60s fuzz log (204k cases)
docker run --rm robfig-cron-rs cat bench/results.json      # benchmark results
docker run --rm robfig-cron-rs cat bench/soak-results.json  # 4h soak summary
docker run --rm robfig-cron-rs cat bench/soak-results.log   # soak per-minute CSV
\`\`\`

Without Docker, the files are in the repo after running the harnesses:

\`\`\`sh
cat fuzz/log.txt              # 60s fuzz log
cat bench/results.json        # benchmark results
cat bench/soak-results.json   # 4h soak summary
head bench/soak-results.log   # soak per-minute CSV
tail bench/soak-results.log   # last few minutes of the soak
\`\`\`

## Benchmarks

Four metrics on a shared workload, run by the same harness against both
binaries:

- **tick lateness** p50 ~1.25 ms / p99 ~1.7 ms (Rust, tokio timer
  wheel floor) vs ~0.55 / ~1.1 ms (Go, sub-ms timer)
- **parse throughput** ~2.5M ops/s (Rust now meets or exceeds Go after
  dropping per-parse HashMap rebuilds and Vec<String> churn)
- **Next() throughput** ~520k ops/s (chrono DateTime<Tz> arithmetic is
  heavier than Go time.Time; risky spec.rs rewrite left for a follow-up)
- **peak RSS** ~4.5 MB, **cold start** ~9 us

See bench/methodology.md and bench/results.json.

## Soak test (Track E sustained-load proof)

The 25-second microbenchmark cannot show the Track E thesis (Rust's p99
stays predictable under sustained load, no GC stop-the-world pauses).
The soak harness can:

\`\`\`sh
./soak.sh
# or directly:
cargo run --release --features bench --bin soak_harness -- --duration 14400 --period-ms 50
\`\`\`

Last 4h run: 64.5M ticks across 461 progressively-added jobs, p99
lateness **2.27 ms** -- flat over the entire run, no GC spikes. RSS
climbed to ~500 MB; that is the harness's 64M-sample buffer (8 B each),
not a cron leak. A bounded-ring-buffer follow-up would flatten this.
See bench/soak-results.json and bench/soak-results.log.

See the live README on GitHub for the full writeup.
`

const FALLBACK_BENCH: BenchResults = {
  rust: {
    p99_tick_ms: 1.684,
    p50_tick_ms: 1.257,
    max_tick_ms: 1.891,
    tick_count: 500,
    rss_peak_kb: 4536,
    cold_start_us: 9,
    throughput_parse_per_sec: 2489035,
    throughput_next_per_sec: 521215,
  },
  go: {
    p99_tick_ms: 1.106,
    p50_tick_ms: 0.555,
    max_tick_ms: 1.234,
    tick_count: 500,
    rss_peak_kb: 3388,
    cold_start_us: 12,
    throughput_parse_per_sec: 709853,
    throughput_next_per_sec: 796575,
  },
}

const FALLBACK_SOAK: SoakResults | null = {
  duration_s: 14400,
  period_ms: 50,
  entries: 461,
  tick_count: 64586583,
  lateness_p50_ms: 1.268,
  lateness_p99_ms: 2.267,
  lateness_max_ms: 4666.981,
  rss_min_kb: 4340,
  rss_max_kb: 510844,
  rss_end_kb: 510844,
  samples_logged: 238,
}

const FALLBACK_PATHS: string[] = [
  ".port-mortem.toml",
  "Cargo.lock",
  "Cargo.toml",
  "DECISIONS.md",
  "Dockerfile",
  ".dockerignore",
  "README.md",
  "bench-helper/go.mod",
  "bench-helper/main.go",
  "bench/bench.rs",
  "bench/methodology.md",
  "bench/results.json",
  "bench/soak.rs",
  "bench/soak-results.json",
  "bench/soak-results.log",
  "bench/soak.log",
  "soak.sh",
  "fuzz-helper/go.mod",
  "fuzz-helper/main.go",
  "fuzz/harness.rs",
  "fuzz/log.txt",
  "rustfmt.toml",
  "src/bin/cli.rs",
  "src/chain.rs",
  "src/constant_delay.rs",
  "src/cron.rs",
  "src/lib.rs",
  "src/logger.rs",
  "src/option.rs",
  "src/parser.rs",
  "src/spec.rs",
  "tests/original/chain_test.go",
  "tests/original/constantdelay_test.go",
  "tests/original/cron_test.go",
  "tests/original/option_test.go",
  "tests/original/parser_test.go",
  "tests/original/spec_test.go",
  "tests/port/chain_tests.rs",
  "tests/port/constant_delay_tests.rs",
  "tests/port/cron_tests.rs",
  "tests/port/main.rs",
  "tests/port/option_tests.rs",
  "tests/port/parser_tests.rs",
  "tests/port/spec_tests.rs",
]