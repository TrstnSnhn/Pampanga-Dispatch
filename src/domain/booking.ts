import type { DispatchStatus } from "@/domain/dispatch-status";
import type { Driver } from "@/domain/driver";
import type { PampangaLocation } from "@/domain/location";
import type { ServiceType } from "@/domain/service-type";

export type Booking = {
  id: string;
  customerName: string;
  serviceType: ServiceType;
  pickupLocationId: PampangaLocation["id"];
  dropOffLocationId: PampangaLocation["id"];
  status: DispatchStatus;
  driverId?: Driver["id"];
  notes?: string;
  estimatedDistanceKm: number;
  priceEstimate: number;
  createdAt: string;
  completedAt?: string;
};
