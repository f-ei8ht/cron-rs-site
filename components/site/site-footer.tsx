import { PORT_REPO_URL } from "@/components/site/site-header"

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10">
      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Track E port-mortem. MIT license, same as the original robfig/cron.
        </p>
        <p className="font-mono text-xs">
          <a
            href={PORT_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            github.com/f-ei8ht/robfig-cron-rs
          </a>
          {" "}· rendered with @pierre/trees and @pierre/diffs
        </p>
      </div>
    </footer>
  )
}