import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pushSubscriptions: defineTable({
    endpoint: v.string(),
    keys: v.object({
      p256dh: v.string(),
      auth: v.string(),
    }),
  }),

  house: defineTable({
    name: v.string(),
    description: v.string(),
    totalPoints: v.number(),
  }),

  action: defineTable({
    house: v.id("house"),
    user: v.string(), // from better auth
    place: v.union(
      v.literal("1st"),
      v.literal("2nd"),
      v.literal("3rd"),
      v.literal("4th"),
    ),
    day: v.union(
      v.literal(1),
      v.literal(2),
      v.literal(3),
      v.literal(4),
      v.literal(5),
    ),
    event: v.string(),
    points: v.number(),
    createdAt: v.number(),
  }).index("by_house", ["house"]),
});
