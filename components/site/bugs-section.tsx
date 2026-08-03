import { Badge } from "@/components/ui/badge"

const bugs = [
  {
    id: "#543",
    status: "Fixed in the port",
    title: "ParseStandard never validated the step range",
    body: "Go silently accepts */90 * * * * on a 0-59 minute field and mis-schedules it as hourly. The port inherited the bug by control-flow mirroring, then fixed it: get_range now rejects any step above the field maximum. 30,663 of the 204,425 fuzz cases are intentional rejections traced to this fix.",
    href: "https://github.com/robfig/cron/issues/543",
  },
  {
    id: "#568",
    status: "Immune by construction",
    title: "Timer fires with a stale time after Windows Fast Startup",
    body: "Go trusts the instant delivered on timer.C, which can be hours stale after a snapshot restore. The Rust run loop sleeps with tokio and re-reads the wall clock on every wake, so there is no timer value to trust. The stale-timestamp half of the bug cannot exist in this design.",
    href: "https://github.com/robfig/cron/issues/568",
  },
]

export function BugsSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {bugs.map((bug) => (
        <article
          key={bug.id}
          className="flex flex-col gap-3 rounded-lg border border-border p-6"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm font-medium">{bug.id}</span>
            <Badge variant="secondary">{bug.status}</Badge>
          </div>
          <h3 className="text-base font-medium tracking-tight">{bug.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {bug.body}
          </p>
          <a
            href={bug.href}
            target="_blank"
            rel="noreferrer"
            className="mt-auto font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            github.com/robfig/cron/issues/{bug.id.slice(1)}
          </a>
        </article>
      ))}
    </div>
  )
}
