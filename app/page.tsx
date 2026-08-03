import { Hero } from "@/components/site/hero"
import { StatGrid } from "@/components/site/stat-grid"
import { Section } from "@/components/site/section"
import { RepoTree } from "@/components/site/repo-tree"
import { PortDiffViewer } from "@/components/site/port-diff-viewer"
import { BenchmarkTable } from "@/components/site/benchmark-table"
import { SoakSection } from "@/components/site/soak-section"
import { BugsSection } from "@/components/site/bugs-section"
import { DivergencesList } from "@/components/site/divergences-list"
import { ReadmeViewer } from "@/components/site/readme-viewer"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import {
  loadBenchResults,
  loadDiffPairs,
  loadReadme,
  loadRepoPaths,
  loadSoakResults,
} from "@/lib/github-data"

export default async function Page() {
  const [pairs, repoPaths, bench, readme, soak] = await Promise.all([
    loadDiffPairs(),
    loadRepoPaths(),
    loadBenchResults(),
    loadReadme(),
    loadSoakResults(),
  ])

  return (
    <div className="min-h-svh">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6">
        <Hero />
        <StatGrid />

        <Section
          id="readme"
          label="Setup"
          title="Read the README."
          description="Build steps, the judge path, usage as a library, and the migration table from Go."
        >
          <ReadmeViewer markdown={readme} />
        </Section>

        <Section
          id="layout"
          label="Layout"
          title="The repository, at a glance."
          description="The port in src/, the original Go tests vendored and hash-pinned in tests/original/, their Rust mirrors in tests/port/, plus the fuzz harness, benchmark suite, and a one-command Dockerfile."
        >
          <RepoTree paths={repoPaths} />
        </Section>

        <Section
          id="port"
          label="The port"
          title="Go in, Rust out."
          description="Four modules side by side: the parser where the issue #543 fix landed, the scheduler core, the DST-aware schedule computation, and the smallest module of the port. Scroll the pane to read the code."
        >
          <PortDiffViewer pairs={pairs} />
        </Section>

        <Section
          id="numbers"
          label="Numbers"
          title="Benchmarks, side by side."
          description="Four metrics on a shared workload, run by the same harness against both binaries."
        >
          <BenchmarkTable rust={bench.rust} go={bench.go} />
        </Section>

        <Section
          id="soak"
          label="Soak"
          title="Four hours, 64 million ticks."
          description="The sustained-load test the microbenchmark cannot be. p99 lateness holds flat — no GC stop-the-world spikes — while load grows from 1 to 461 concurrent jobs."
        >
          <SoakSection soak={soak} />
        </Section>

        <Section
          id="bugs"
          label="Bugs"
          title="Two upstream issues, one fix."
          description="Cross-checking the port against the upstream issue tracker surfaced one latent bug we fixed and one the design cannot have."
        >
          <BugsSection />
        </Section>

        <Section
          id="divergences"
          label="Divergences"
          title="Twelve architectural decisions."
          description="Every Go idiom had to become a Rust one. The full rationale for each lives in DECISIONS.md."
        >
          <DivergencesList />
        </Section>
      </main>
      <div className="mx-auto max-w-7xl px-6">
        <SiteFooter />
      </div>
    </div>
  )
}