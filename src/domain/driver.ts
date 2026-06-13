import type { PampangaLocation } from "@/domain/location";
import type { ServiceType } from "@/domain/service-type";

export type DriverStatus = "available" | "assigned" | "offline";

export type VehicleType = "Motorcycle" | "Compact car" | "Van" | "Truck";

export type Driver = {
  id: string;
  name: string;
  vehicleType: VehicleType;
  serviceTypes: ServiceType[];
  currentLocationId: PampangaLocation["id"];
  status: DriverStatus;
  activeAssignmentId?: string;
};

export const driverStatusLabels: Record<DriverStatus, string> = {
  available: "Available",
  assigned: "Assigned",
  offline: "Offline",
};
