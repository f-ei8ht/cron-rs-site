import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUpRight, Code } from "lucide-react"
import { PORT_REPO_URL } from "@/components/site/site-header"

export function Hero() {
  return (
    <section className="py-24">
      <div className="flex max-w-4xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Track E</Badge>
          <Badge variant="outline">Go to Rust</Badge>
          <Badge variant="outline">72 hours</Badge>
          <Badge variant="outline">MIT</Badge>
        </div>
        <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
          robfig/cron, ported to Rust.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          872 lines of the de facto Go cron library rewritten as 1,444 lines
          of idiomatic, zero-unsafe Rust. The original test suite, vendored
          and hash-pinned, passes unmodified: 52 of 52. A 60-second
          differential fuzz over 204,425 random cases found zero unintended
          divergences.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href={PORT_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Code className="size-4" />
            View the port
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}