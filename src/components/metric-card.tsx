import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MetricTone = "green" | "amber" | "clay" | "blue";

const toneClasses: Record<MetricTone, string> = {
  green: "bg-[var(--success-soft)] text-[var(--success-foreground)]",
  amber: "bg-[var(--warning-soft)] text-[var(--warning-foreground)]",
  clay: "bg-[var(--clay-soft)] text-[var(--clay)]",
  blue: "bg-[var(--info-soft)] text-[var(--info-foreground)]",
};

type MetricCardProps = {
  label: string;
  value: string | number;
  note: string;
  icon: LucideIcon;
  tone?: MetricTone;
};

export function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  tone = "green",
}: MetricCardProps) {
  return (
    <article className="pd-card-flat rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--muted-foreground)]">
          {label}
        </p>
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-xl",
            toneClasses[tone],
          )}
        >
          <Icon className="size-4" strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
        {value}
      </p>
      <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
        {note}
      </p>
    </article>
  );
}
