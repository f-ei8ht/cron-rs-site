import { cn } from "@/lib/utils"

interface SectionProps {
  id?: string
  label: string
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Section({
  id,
  label,
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section id={id} className={cn("border-t border-border py-16", className)}>
      <div className="mb-8 flex flex-col gap-2">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {label}
        </span>
        <h2 className="text-2xl font-medium tracking-tight">{title}</h2>
        {description == null ? null : (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}
