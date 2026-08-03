import Link from "next/link"
import { ArrowUpRight, Play } from "lucide-react"
import { ThemeToggle } from "@/components/site/theme-toggle"

export const PORT_REPO_URL = "https://github.com/f-ei8ht/robfig-cron-rs"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight"
        >
          robfig-cron-rs
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Play className="size-4" />
            <span className="hidden sm:inline">Demo</span>
          </Link>
          <a
            href={PORT_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowUpRight className="size-4" />
            <span className="hidden sm:inline">f-ei8ht/robfig-cron-rs</span>
            <span className="sm:hidden">GitHub</span>
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
