export type DispatchStatus =
  | "pending"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "completed"
  | "cancelled";

export const dispatchStatusLabels: Record<DispatchStatus, string> = {
  pending: "Pending",
  assigned: "Assigned",
  picked_up: "Picked up",
  in_transit: "In transit",
  completed: "Completed",
  cancelled: "Cancelled",
};

const nextStatuses: Record<DispatchStatus, DispatchStatus[]> = {
  pending: ["assigned", "cancelled"],
  assigned: ["picked_up", "cancelled"],
  picked_up: ["in_transit"],
  in_transit: ["completed"],
  completed: [],
  cancelled: [],
};

export function getNextBookingStatuses(status: DispatchStatus) {
  return nextStatuses[status];
}

export function canTransitionBookingStatus(
  currentStatus: DispatchStatus,
  nextStatus: DispatchStatus,
) {
  return nextStatuses[currentStatus].includes(nextStatus);
}
