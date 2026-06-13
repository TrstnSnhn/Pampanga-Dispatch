import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  eyebrow?: string;
  meta?: string;
  actions?: ReactNode;
};

export function PageHeader({
  title,
  description,
  eyebrow = "Operations console",
  meta,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
          <span className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1">
            {eyebrow}
          </span>
          {meta ? <span>{meta}</span> : null}
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-[var(--foreground)] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-[68ch] text-sm leading-6 text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
