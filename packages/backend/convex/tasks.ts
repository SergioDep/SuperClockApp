import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./utils";

// Create a new task for a project
export const createTask = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    totalSetTimeSeconds: v.number(),
    icon: v.optional(v.string()),
    colorHex: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify the project exists and belongs to the user
    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) {
      throw new Error("Project not found or user not authorized");
    }

    const taskId = await ctx.db.insert("tasks", {
      userId: userId,
      projectId: args.projectId,
      name: args.name,
      totalSetTimeSeconds: args.totalSetTimeSeconds,
      remainingTimeSeconds: args.totalSetTimeSeconds, // Initially, remaining time is total time
      status: "pending", // Default status
      icon: args.icon,
      colorHex: args.colorHex,
    });
    return taskId;
  },
});

// Get tasks for a specific project
export const getTasksByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      return []; // Or throw an error
    }

    // Optional: Verify the project exists and belongs to the user before fetching tasks
    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) {
      // console.warn("Attempted to fetch tasks for an unauthorized or non-existent project");
      return []; // Or throw an error
    }

    return ctx.db
      .query("tasks")
      .withIndex("by_user_project", (q) =>
        q.eq("userId", userId).eq("projectId", args.projectId),
      )
      .collect();
  },
});

// Update a task (e.g., name, total time, status, remaining time)
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    name: v.optional(v.string()),
    totalSetTimeSeconds: v.optional(v.number()),
    remainingTimeSeconds: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("active"),
        v.literal("paused"),
        v.literal("completed"),
      ),
    ),
    icon: v.optional(v.string()),
    colorHex: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { taskId, ...rest } = args;

    const existingTask = await ctx.db.get(taskId);
    if (!existingTask || existingTask.userId !== userId) {
      throw new Error("Task not found or user not authorized");
    }

    // If totalSetTimeSeconds is updated and remainingTimeSeconds is not,
    // and status is pending, reset remainingTimeSeconds.
    // Adjust logic as per your exact requirements for this scenario.
    const updates = { ...rest };
    if (
      rest.totalSetTimeSeconds !== undefined &&
      rest.remainingTimeSeconds === undefined &&
      existingTask.status === "pending"
    ) {
      updates.remainingTimeSeconds = rest.totalSetTimeSeconds;
    }

    await ctx.db.patch(taskId, updates);
  },
});

// Delete a task
export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const existingTask = await ctx.db.get(args.taskId);
    if (!existingTask || existingTask.userId !== userId) {
      throw new Error("Task not found or user not authorized");
    }

    await ctx.db.delete(args.taskId);
  },
});

// Special mutation to start a task (sets it to active, pauses others)
export const startTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const taskToStart = await ctx.db.get(args.taskId);
    if (!taskToStart || taskToStart.userId !== userId) {
      throw new Error("Task not found or user not authorized");
    }

    if (taskToStart.status === "completed") {
      throw new Error("Cannot start a completed task.");
    }

    // Find any other active tasks for this user and pause them
    const activeTasks = await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) =>
        q.eq("userId", userId).eq("status", "active"),
      )
      .filter((q) => q.neq(q.field("_id"), args.taskId)) // Don't pause the task we're trying to start
      .collect();

    for (const task of activeTasks) {
      await ctx.db.patch(task._id, { status: "paused" });
    }

    // Set the selected task to active
    await ctx.db.patch(args.taskId, { status: "active" });
  },
});

// Special mutation to pause a task
export const pauseTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const taskToPause = await ctx.db.get(args.taskId);
    if (!taskToPause || taskToPause.userId !== userId) {
      throw new Error("Task not found or user not authorized");
    }

    if (taskToPause.status === "active") {
      await ctx.db.patch(args.taskId, { status: "paused" });
    }
  },
});

// Special mutation to complete a task
export const completeTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const taskToComplete = await ctx.db.get(args.taskId);
    if (!taskToComplete || taskToComplete.userId !== userId) {
      throw new Error("Task not found or user not authorized");
    }

    await ctx.db.patch(args.taskId, {
      status: "completed",
      remainingTimeSeconds: 0,
    });
  },
});
