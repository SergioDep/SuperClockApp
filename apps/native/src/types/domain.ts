import type { Id } from "@packages/backend/convex/_generated/dataModel";

export interface Project {
  _id: Id<"projects">;
  _creationTime: number;
  userId: string;
  name: string;
  startDate: number; // timestamp
  deadline: number; // timestamp
  colorHex?: string;
  icon?: string;
}

export type TaskStatus = "pending" | "active" | "paused" | "completed";

export interface Task {
  _id: Id<"tasks">;
  _creationTime: number;
  userId: string;
  projectId: Id<"projects">;
  name: string;
  totalSetTimeSeconds: number;
  remainingTimeSeconds: number;
  status: TaskStatus;
  icon?: string;
  colorHex?: string;
}
