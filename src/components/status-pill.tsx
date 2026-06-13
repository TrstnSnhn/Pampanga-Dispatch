import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

const toneClasses: Record<StatusTone, string> = {
  neutral:
    "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]",
  info: "border-[oklch(0.78_0.04_232)] bg-[var(--info-soft)] text-[var(--info-foreground)]",
  success:
    "border-[oklch(0.78_0.055_151)] bg-[var(--success-soft)] text-[var(--success-foreground)]",
  warning:
    "border-[oklch(0.8_0.065_82)] bg-[var(--warning-soft)] text-[var(--warning-foreground)]",
  danger:
    "border-[oklch(0.79_0.055_28)] bg-[var(--danger-soft)] text-[var(--danger-foreground)]",
};

const dotClasses: Record<StatusTone, string> = {
  neutral: "bg-[var(--muted-foreground)]",
  info: "bg-[var(--map-blue)]",
  success: "bg-[var(--success-foreground)]",
  warning: "bg-[var(--warning-foreground)]",
  danger: "bg-[var(--danger-foreground)]",
};

type StatusPillProps = {
  children: ReactNode;
  tone?: StatusTone;
  dot?: boolean;
};

export function StatusPill({
  children,
  tone = "neutral",
  dot = false,
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
      )}
    >
      {dot ? (
        <span className={cn("size-1.5 rounded-full", dotClasses[tone])} />
      ) : null}
      {children}
    </span>
  );
}
