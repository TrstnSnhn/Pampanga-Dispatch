"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/bookings", label: "Bookings" },
  { href: "/drivers", label: "Drivers" },
  { href: "/dispatch", label: "Dispatch" },
  { href: "/map", label: "Map" },
  { href: "/settings", label: "Settings" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="flex gap-1 overflow-x-auto md:grid">
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--nav-hover)] hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
              isActive &&
                "bg-[var(--nav-active)] text-[var(--foreground)] shadow-[inset_0_0_0_1px_var(--border)]",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
