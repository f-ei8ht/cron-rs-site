import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { DockerEntrypointNote } from "@/components/site/docker-entrypoint-note"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "robfig-cron-rs | robfig/cron, ported to Rust",
  description:
    "Track E port-mortem: 872 lines of the de facto Go cron library rewritten as 1,444 lines of idiomatic, zero-unsafe Rust. 52 of 52 original tests passing, 204,425 fuzz cases with zero unintended divergences.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          {children}
          <DockerEntrypointNote />
        </ThemeProvider>
      </body>
    </html>
  )
}
