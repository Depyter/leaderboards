import { paginationOptsValidator } from "convex/server";
import { internalQuery, mutation } from "./_generated/server";
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
    await ctx.db.insert("pushSubscriptions", {
      endpoint: args.endpoint,
      keys: args.keys,
    });
  },
});

export const getBatch = internalQuery({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    const subscriptions = await ctx.db
      .query("pushSubscriptions")
      .paginate(args.paginationOpts);
    return subscriptions;
  },
});
