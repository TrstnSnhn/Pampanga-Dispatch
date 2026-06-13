export type DispatchStatus =
  | "pending"
  | "assigned"
  | "in-progress"
  | "completed"
  | "cancelled";

export const dispatchStatusLabels: Record<DispatchStatus, string> = {
  pending: "Pending",
  assigned: "Assigned",
  "in-progress": "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};
