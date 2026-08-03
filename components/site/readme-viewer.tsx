"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface Props {
  markdown: string
}

export function ReadmeViewer({ markdown }: Props) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card px-6 py-5 sm:px-8 sm:py-6",
        "prose-code",
        "[&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-medium [&_h1]:tracking-tight",
        "[&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-medium [&_h2]:tracking-tight",
        "[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-medium",
        "[&_p]:my-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground",
        "[&_a]:text-primary [&_a]:underline-offset-4 [&_a]:hover:underline",
        "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:leading-relaxed [&_ul]:text-muted-foreground",
        "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_ol]:text-sm [&_ol]:leading-relaxed [&_ol]:text-muted-foreground",
        "[&_li]:marker:text-muted-foreground",
        "[&_table]:my-4 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-md [&_table]:border [&_table]:border-border [&_table]:text-sm",
        "[&_th]:border-b [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-medium",
        "[&_td]:border-b [&_td]:border-border [&_td]:px-3 [&_td]:py-2",
        "[&_tr]:last:[&_td]:border-b-0",
        "[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
        "[&_hr]:my-6 [&_hr]:border-border",
        "[&_strong]:text-foreground",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8em] [&_code]:text-foreground",
        "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/50 [&_pre]:p-4",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-xs [&_pre_code]:leading-relaxed"
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  )
}
