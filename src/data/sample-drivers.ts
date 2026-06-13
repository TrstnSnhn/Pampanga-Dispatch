import type { Driver } from "@/domain/driver";

export const sampleDrivers: Driver[] = [
  {
    id: "drv-001",
    name: "John Santos",
    vehicleType: "Motorcycle",
    currentLocationId: "angeles-city",
    status: "available",
  },
  {
    id: "drv-002",
    name: "Maria Dizon",
    vehicleType: "Compact car",
    currentLocationId: "san-fernando",
    status: "busy",
    activeAssignmentId: "BKG-1002",
  },
  {
    id: "drv-003",
    name: "Ramon Garcia",
    vehicleType: "Truck",
    currentLocationId: "mexico",
    status: "available",
  },
  {
    id: "drv-004",
    name: "Leah Manalo",
    vehicleType: "Motorcycle",
    currentLocationId: "guagua",
    status: "busy",
    activeAssignmentId: "BKG-1004",
  },
  {
    id: "drv-005",
    name: "Carlo Pineda",
    vehicleType: "Van",
    currentLocationId: "mabalacat-city",
    status: "available",
  },
  {
    id: "drv-006",
    name: "Nina Ocampo",
    vehicleType: "Motorcycle",
    currentLocationId: "apalit",
    status: "offline",
  },
];

export function getDriverName(driverId?: Driver["id"]) {
  if (!driverId) {
    return "Unassigned";
  }

  return sampleDrivers.find((driver) => driver.id === driverId)?.name ?? "Unknown driver";
}
