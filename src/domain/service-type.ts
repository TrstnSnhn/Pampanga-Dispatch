export type ServiceType = "ride" | "delivery" | "food-delivery";

export const serviceTypeLabels: Record<ServiceType, string> = {
  ride: "Ride",
  delivery: "Parcel delivery",
  "food-delivery": "Food delivery",
};
