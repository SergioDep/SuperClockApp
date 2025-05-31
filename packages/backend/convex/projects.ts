import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./utils";

// Create a new project
export const createProject = mutation({
  args: {
    name: v.string(),
    startDate: v.number(), // timestamp
    deadline: v.number(), // timestamp
    colorHex: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const projectId = await ctx.db.insert("projects", {
      userId: userId,
      name: args.name,
      startDate: args.startDate,
      deadline: args.deadline,
      colorHex: args.colorHex,
      icon: args.icon,
    });
    return projectId;
  },
});

// Get a single project by its ID
export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) {
      return null; // Or throw an error if preferred
    }
    return project;
  },
});

// Get all projects for the authenticated user
export const getProjectsByUser = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      return []; // Or throw an error
    }
    return ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Update an existing project
export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    startDate: v.optional(v.number()),
    deadline: v.optional(v.number()),
    colorHex: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { projectId, ...rest } = args;

    const existingProject = await ctx.db.get(projectId);
    if (!existingProject || existingProject.userId !== userId) {
      throw new Error("Project not found or user not authorized");
    }

    await ctx.db.patch(projectId, rest);
  },
});

// Delete a project (and its associated tasks - to be handled carefully)
export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const existingProject = await ctx.db.get(args.projectId);
    if (!existingProject || existingProject.userId !== userId) {
      throw new Error("Project not found or user not authorized");
    }

    // First, delete all tasks associated with this project
    const tasksToDelete = await ctx.db
      .query("tasks")
      .withIndex("by_user_project", (q) =>
        q.eq("userId", userId).eq("projectId", args.projectId),
      )
      .collect();

    for (const task of tasksToDelete) {
      await ctx.db.delete(task._id);
    }

    // Then, delete the project itself
    await ctx.db.delete(args.projectId);
  },
});
