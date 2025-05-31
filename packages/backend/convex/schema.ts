import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
  }),
  projects: defineTable({
    userId: v.string(),
    name: v.string(),
    startDate: v.number(), // timestamp
    deadline: v.number(), // timestamp
    colorHex: v.optional(v.string()),
    icon: v.optional(v.string()),
  }).index("by_user", ["userId"]),
  tasks: defineTable({
    userId: v.string(),
    projectId: v.id("projects"),
    name: v.string(),
    totalSetTimeSeconds: v.number(),
    remainingTimeSeconds: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("completed"),
    ),
    icon: v.optional(v.string()),
    colorHex: v.optional(v.string()),
  })
    .index("by_user_project", ["userId", "projectId"])
    .index("by_status", ["userId", "status"]),
});
