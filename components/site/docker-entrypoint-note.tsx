"use client"

import * as React from "react"
import { Terminal } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const STORAGE_KEY = "docker-entrypoint-popup-dismissed"

export function DockerEntrypointNote() {
  const [showDialog, setShowDialog] = React.useState(false)

  React.useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY)
    if (dismissed) return

    const timer = setTimeout(() => setShowDialog(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  function handleDismiss() {
    setShowDialog(false)
    sessionStorage.setItem(STORAGE_KEY, "1")
  }

  return (
    <Dialog open={showDialog} onOpenChange={handleDismiss}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Terminal className="size-5" />
            Docker --entrypoint
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            The default entrypoint lands in the TUI. Override it to run any
            binary inside the container.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md border border-border bg-muted px-4 py-4">
          <code className="text-sm">
            docker run --rm --entrypoint &lt;cmd&gt; robfig-cron-rs
          </code>
        </div>
        <p className="text-[0.75rem] text-muted-foreground">
          No Rust or Go toolchain needed. One image, everything prebuilt.
        </p>
      </DialogContent>
    </Dialog>
  )
}
