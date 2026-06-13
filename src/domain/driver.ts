import type { PampangaLocation } from "@/domain/location";

export type DriverStatus = "available" | "busy" | "offline";

export type VehicleType = "Motorcycle" | "Compact car" | "Van" | "Truck";

export type Driver = {
  id: string;
  name: string;
  vehicleType: VehicleType;
  currentLocationId: PampangaLocation["id"];
  status: DriverStatus;
  activeAssignmentId?: string;
};

export const driverStatusLabels: Record<DriverStatus, string> = {
  available: "Available",
  busy: "Busy",
  offline: "Offline",
};
