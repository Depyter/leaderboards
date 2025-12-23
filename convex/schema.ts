import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
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
    event: v.string(),
    points: v.number(),
    createdAt: v.number(),
  }).index("by_house", ["house"]),
});
