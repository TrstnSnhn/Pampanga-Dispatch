import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

const toneClasses: Record<StatusTone, string> = {
  neutral: "bg-[var(--muted)] text-[var(--muted-foreground)]",
  info: "bg-[var(--info-soft)] text-[var(--info-foreground)]",
  success: "bg-[var(--success-soft)] text-[var(--success-foreground)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning-foreground)]",
  danger: "bg-[var(--danger-soft)] text-[var(--danger-foreground)]",
};

type StatusPillProps = {
  children: ReactNode;
  tone?: StatusTone;
};

export function StatusPill({ children, tone = "neutral" }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-md px-2 py-1 text-xs font-medium",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
