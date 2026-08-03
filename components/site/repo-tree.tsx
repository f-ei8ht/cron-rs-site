"use client"

import * as React from "react"
import { FileTree, useFileTree } from "@pierre/trees/react"

interface Props {
  paths: readonly string[]
}

const rowNotes: Record<string, string> = {
  "DECISIONS.md": "12 divergences",
  ".port-mortem.toml": "kickoff hashes",
  "bench/results.json": "rust vs go",
  "bench/soak.rs": "4h soak harness",
  "bench/soak-results.json": "4h soak results",
  "bench/soak-results.log": "per-minute CSV",
  "bench/soak.log": "full soak stdout",
  "soak.sh": "one-command soak",
  "fuzz/log.txt": "204,425 cases",
  "src/bin/cli.rs": "tui",
  "Dockerfile": "one command",
}

export function RepoTree({ paths }: Props) {
  const { model } = useFileTree({
    paths,
    flattenEmptyDirectories: false,
    initialExpandedPaths: [
      "src",
      "src/bin",
      "tests",
      "tests/original",
      "tests/port",
      "bench",
      "bench-helper",
      "fuzz",
      "fuzz-helper",
    ],
    icons: { set: "standard", colored: false },
    renderRowDecoration: ({ item }) => {
      const text = rowNotes[item.path]
      return text == null ? null : { text }
    },
  })

  return (
    <FileTree
      model={model}
      className="h-[420px] w-full rounded-lg border border-border bg-card"
    />
  )
}