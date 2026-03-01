import { paginationOptsValidator } from "convex/server";
import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: {
    endpoint: v.string(),
    keys: v.object({
      p256dh: v.string(),
      auth: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pushSubscriptions")
      .filter((q) => q.eq(q.field("endpoint"), args.endpoint))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("pushSubscriptions", {
      endpoint: args.endpoint,
      keys: args.keys,
    });
  },
});

export const getByEndpoint = query({
  args: {
    endpoint: v.string(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("pushSubscriptions")
      .filter((q) => q.eq(q.field("endpoint"), args.endpoint))
      .first();

    return subscription ?? null;
  },
});

export const getBatch = internalQuery({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized, please sign in.");
    const subscriptions = await ctx.db
      .query("pushSubscriptions")
      .paginate(args.paginationOpts);
    return subscriptions;
  },
});

export const getCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized, please sign in.");
    const count = await ctx.db.query("pushSubscriptions").collect();
    return count.length;
  },
});

export const removeByEndpoint = mutation({
  args: {
    endpoint: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pushSubscriptions")
      .filter((q) => q.eq(q.field("endpoint"), args.endpoint))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
