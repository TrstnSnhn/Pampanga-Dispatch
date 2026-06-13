"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  LayoutDashboard,
  Map,
  RadioTower,
  Settings,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bookings", label: "Bookings", icon: ClipboardList },
  { href: "/drivers", label: "Drivers", icon: Truck },
  { href: "/dispatch", label: "Dispatch", icon: RadioTower },
  { href: "/map", label: "Map", icon: Map },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="flex gap-1 overflow-x-auto pb-1 md:grid md:gap-1.5 md:overflow-visible md:pb-0"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "pd-pressable inline-flex min-w-fit items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--sidebar-muted)] hover:bg-[var(--nav-hover)] hover:text-[var(--accent-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] md:w-full",
              isActive &&
                "bg-[var(--nav-active)] text-[var(--accent-foreground)] shadow-[inset_0_0_0_1px_oklch(1_0_0/0.11)]",
            )}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.8} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
