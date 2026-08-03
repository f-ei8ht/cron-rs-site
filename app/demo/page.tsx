"use client";

import { Skiper67 } from "@/components/v1/skiper67";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function DemoPage() {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <main className="flex min-h-[calc(100svh-100px)] items-center justify-center">
        <div className="h-[85vh] w-full">
          <Skiper67 />
        </div>
      </main>
      <div className="mx-auto max-w-7xl px-6">
        <SiteFooter />
      </div>
    </div>
  );
}