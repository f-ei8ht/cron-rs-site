const stats = [
  { value: "1,444", unit: "lines of Rust", note: "from 872 lines of Go" },
  { value: "52/52", unit: "tests passing", note: "originals unmodified" },
  { value: "204,425", unit: "fuzz cases", note: "zero unintended divergences" },
  { value: "0", unit: "unsafe blocks", note: "clippy and fmt clean" },
]

export function StatGrid() {
  return (
    <section className="border-t border-border">
      <dl className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.unit}
            className="flex flex-col gap-1 bg-background px-6 py-8"
          >
            <dt className="order-2 text-sm text-muted-foreground">
              {stat.unit}
            </dt>
            <dd className="order-1 font-mono text-3xl font-medium tracking-tight">
              {stat.value}
            </dd>
            <dd className="order-3 text-xs text-muted-foreground">
              {stat.note}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
