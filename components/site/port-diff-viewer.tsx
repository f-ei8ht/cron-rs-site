"use client"

import * as React from "react"
import { MultiFileDiff } from "@pierre/diffs/react"
import { preloadHighlighter } from "@pierre/diffs"
import type { FileDiffOptions } from "@pierre/diffs"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DiffPair } from "@/lib/github-data"

interface Props {
  pairs: DiffPair[]
}

export function PortDiffViewer({ pairs }: Props) {
  const [active, setActive] = React.useState(pairs[0]?.id ?? "")
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    preloadHighlighter({
      themes: ["pierre-dark", "pierre-light"],
      langs: ["go", "rust"],
    })
      .catch(() => {})
      .finally(() => {
        if (mounted) setReady(true)
      })
    return () => {
      mounted = false
    }
  }, [])

  const options = React.useMemo<FileDiffOptions<undefined>>(
    () => ({
      theme: { dark: "pierre-dark", light: "pierre-light" },
      themeType: "system",
      diffStyle: "split",
      diffIndicators: "bars",
      hunkSeparators: "line-info",
      overflow: "scroll",
    }),
    []
  )

  const pair = pairs.find((p) => p.id === active) ?? pairs[0]

  if (!ready || !pair) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground">
        Loading code from GitHub…
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <Tabs value={active} onValueChange={(value) => setActive(String(value))}>
        <TabsList>
          {pairs.map((p) => (
            <TabsTrigger key={p.id} value={p.id}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <p className="text-sm text-muted-foreground">{pair.note}</p>
      <div className="h-[560px] overflow-auto rounded-lg border border-border">
        <MultiFileDiff
          oldFile={pair.oldFile}
          newFile={pair.newFile}
          options={options}
          disableWorkerPool
        />
      </div>
    </div>
  )
}