import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const houses = await ctx.db.query("house").collect();
    // Sort by points descending
    return houses.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
  },
});

export const getPaginatedActionsByHouse = query({
  args: {
    houseId: v.id("house"),
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
      id: v.optional(v.number()),
      endCursor: v.optional(v.union(v.string(), v.null())),
      maximumRowsRead: v.optional(v.number()),
      maximumBytesRead: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("action")
      .withIndex("by_house", (q) => q.eq("house", args.houseId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const addScore = mutation({
  args: {
    house: v.id("house"),
    place: v.union(
      v.literal("1st"),
      v.literal("2nd"),
      v.literal("3rd"),
      v.literal("4th"),
    ),
    event: v.string(),
    points: v.number(),
  },
  handler: async (ctx, args) => {
    const betterAuthUser = await authComponent.getAuthUser(ctx);

    await ctx.db.insert("action", {
      house: args.house,
      user: betterAuthUser.name,
      place: args.place,
      event: args.event,
      points: args.points,
      createdAt: Date.now(),
    });

    const house = await ctx.db.get(args.house);

    await ctx.db.patch("house", args.house, {
      totalPoints: house!.totalPoints + args.points,
    });
  },
});
