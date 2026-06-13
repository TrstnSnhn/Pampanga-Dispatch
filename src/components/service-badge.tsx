import { Car, Package, Utensils } from "lucide-react";
import type { ServiceType } from "@/domain/service-type";
import { serviceTypeLabels } from "@/domain/service-type";
import { cn } from "@/lib/utils";

const serviceStyles: Record<ServiceType, string> = {
  ride: "bg-[var(--info-soft)] text-[var(--info-foreground)]",
  delivery: "bg-[var(--clay-soft)] text-[var(--clay)]",
  "food-delivery":
    "bg-[var(--success-soft)] text-[var(--success-foreground)]",
};

const serviceIcons = {
  ride: Car,
  delivery: Package,
  "food-delivery": Utensils,
};

type ServiceBadgeProps = {
  serviceType: ServiceType;
};

export function ServiceBadge({ serviceType }: ServiceBadgeProps) {
  const Icon = serviceIcons[serviceType];

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        serviceStyles[serviceType],
      )}
    >
      <Icon className="size-3.5" strokeWidth={1.8} />
      {serviceTypeLabels[serviceType]}
    </span>
  );
}
