import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function DemoPage() {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <main className="flex min-h-[calc(100svh-100px)] flex-col items-center justify-center px-6">
        <div className="w-full max-w-3xl">
          <div className="overflow-hidden rounded-lg border border-border">
            <video
              className="w-full"
              src="/demo/demo.mp4"
              controls
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <a
              href="https://youtu.be/tW3ivQR0WmE"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Watch on YouTube
            </a>
          </p>
        </div>
      </main>
      <div className="mx-auto max-w-7xl px-6">
        <SiteFooter />
      </div>
    </div>
  );
}