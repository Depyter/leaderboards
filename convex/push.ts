"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { sendNotification, setVapidDetails } from "web-push";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const sendAll = action({
  args: {
    title: v.string(),
    body: v.string(),
    tag: v.union(v.literal("reminders"), v.literal("results")),
  },
  handler: async (ctx, args) => {
    setVapidDetails(
      process.env.VAPID_SUBJECT!,
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );

    let continueCursor = null;
    let isDone = false;

    const payLoad = JSON.stringify({
      title: args.title,
      body: args.body,
      icon: "/assets/starwhite.png",
      badge: "/assets/starwhite.png",
      tag: args.tag,
    });

    do {
      const subscriptions: {
        page: Doc<"pushSubscriptions">[];
        continueCursor: string | null;
        isDone: boolean;
      } = await ctx.runQuery(internal.subscriptions.getBatch, {
        paginationOpts: { numItems: 50, cursor: continueCursor },
      });

      const promises = subscriptions.page.map((sub) => {
        sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payLoad,
        ).catch((err) => {
          console.error("Error sending push to endpoint", sub.endpoint, err);
        });
      });

      await Promise.all(promises);

      continueCursor = subscriptions.continueCursor;
      isDone = subscriptions.isDone;
    } while (!isDone);
  },
});
