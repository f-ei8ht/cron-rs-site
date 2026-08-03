"use client";

import { Skiper67 } from "@/components/v1/skiper67";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function DemoPage() {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <main className="flex min-h-[calc(100svh-100px)] flex-col items-center justify-center px-6">
        <div className="w-full max-w-3xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-medium tracking-tight">
              Demo Video
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A 5-minute live demo of the port: tests, fuzz, benchmarks, and
              the interactive sandbox.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-[#f5f4f3] dark:bg-card">
            <div className="flex aspect-video items-center justify-center">
              <Skiper67 />
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Video addition in progress — check back shortly.
          </p>
        </div>
      </main>
      <div className="mx-auto max-w-7xl px-6">
        <SiteFooter />
      </div>
    </div>
  );
}