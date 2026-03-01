"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { BellIcon, BellOffIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ── Helpers ───────────────────────────────────────────────────────────────────

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

type Status = "checking" | "idle" | "subscribed" | "denied";
type ResyncStatus = "idle" | "resyncing" | "failed";

// ── Shared subscription hook ──────────────────────────────────────────────────

function useNotificationSubscription() {
  const saveSubscription = useMutation(api.subscriptions.save);
  const removeSubscription = useMutation(api.subscriptions.removeByEndpoint);

  const [loading, setLoading] = useState(false);
  const [resyncStatus, setResyncStatus] = useState<ResyncStatus>("idle");

  // undefined = still checking | null = no sub | string = has sub
  const [browserEndpoint, setBrowserEndpoint] = useState<
    string | null | undefined
  >(undefined);

  // Step 1: Register SW and probe the browser's PushManager
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setBrowserEndpoint(null);
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setBrowserEndpoint(sub ? sub.endpoint : null))
      .catch(() => setBrowserEndpoint(null));
  }, []);

  // Step 2: Query Convex only when we have a browser endpoint
  const convexSub = useQuery(
    api.subscriptions.getByEndpoint,
    browserEndpoint ? { endpoint: browserEndpoint } : "skip",
  );

  // Step 3: Derive status
  const status = useMemo<Status>(() => {
    if (browserEndpoint === undefined) return "checking";

    if (browserEndpoint === null) {
      if (!("Notification" in window) || Notification.permission === "denied") {
        return "denied";
      }
      return "idle";
    }

    if (convexSub === undefined) return "checking";
    if (convexSub !== null) return "subscribed";

    if (resyncStatus === "resyncing") return "checking";
    return "idle";
  }, [browserEndpoint, convexSub, resyncStatus]);

  // Step 4: Auto-resync if browser has sub but Convex doesn't
  useEffect(() => {
    if (browserEndpoint === null || browserEndpoint === undefined) return;
    if (convexSub !== null && convexSub !== undefined) return;
    if (convexSub === undefined) return; // still loading
    if (resyncStatus !== "idle") return;

    setResyncStatus("resyncing");
    navigator.serviceWorker.ready
      .then(async (reg) => {
        const sub = await reg.pushManager.getSubscription();
        if (!sub) {
          setResyncStatus("failed");
          return;
        }
        const subJson = sub.toJSON();
        if (subJson.endpoint && subJson.keys) {
          await saveSubscription({
            endpoint: subJson.endpoint,
            keys: { p256dh: subJson.keys.p256dh!, auth: subJson.keys.auth! },
          });
          setResyncStatus("idle");
        } else {
          setResyncStatus("failed");
        }
      })
      .catch(() => setResyncStatus("failed"));
  }, [browserEndpoint, convexSub, resyncStatus, saveSubscription]);

  const subscribe = async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });

      const subJson = subscription.toJSON();
      if (subJson.endpoint && subJson.keys) {
        await saveSubscription({
          endpoint: subJson.endpoint,
          keys: { p256dh: subJson.keys.p256dh!, auth: subJson.keys.auth! },
        });
        setBrowserEndpoint(subJson.endpoint);
        localStorage.removeItem("notification-prompt-dismissed");
      }
    } catch (error) {
      console.error("Failed to subscribe:", error);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!browserEndpoint) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await removeSubscription({ endpoint: browserEndpoint });
        setBrowserEndpoint(null);
      }
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
    }
  };

  return { status, loading, subscribe, unsubscribe };
}

// ── Shared dialog content ─────────────────────────────────────────────────────

interface NotificationDialogContentProps {
  mode: "prompt" | "settings";
  status: Status;
  loading: boolean;
  onSubscribe: () => Promise<void>;
  onUnsubscribe: () => Promise<void>;
  onDismiss: () => void;
  onClose: () => void;
}

function NotificationDialogContent({
  mode,
  status,
  loading,
  onSubscribe,
  onUnsubscribe,
  onDismiss,
  onClose,
}: NotificationDialogContentProps) {
  const isSubscribed = status === "subscribed";

  return (
    <DialogContent
      showCloseButton={false}
      className="overflow-hidden border-0 p-0 shadow-2xl sm:max-w-sm"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-top"
        style={{ backgroundImage: "url('/assets/loading.webp')" }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 -z-10 bg-black/55" />

      <div className="flex flex-col gap-5 p-6 text-white">
        <DialogHeader className="gap-3">
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="text-base font-semibold text-white">
              {mode === "prompt" ? "Stay in the loop" : "Notifications"}
            </DialogTitle>
            <DialogDescription className="text-white/75">
              {mode === "settings" && isSubscribed
                ? "ngano nimo i-off ang notifs?"
                : "enable notifs to feel like naa kay ka chat :>"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {mode === "settings" && isSubscribed ? (
            <Button
              onClick={onUnsubscribe}
              className="w-full bg-red-500 text-white hover:bg-red-600"
              size="lg"
            >
              <BellOffIcon className="mr-1.5 size-3.5" />
              Turn off notifications
            </Button>
          ) : (
            <Button
              onClick={onSubscribe}
              disabled={loading || isSubscribed}
              className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-60"
              size="lg"
            >
              {loading ? (
                <>
                  <span className="mr-2 inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  Enabling…
                </>
              ) : isSubscribed ? (
                <>
                  <BellIcon className="mr-1.5 size-3.5" />
                  Notifications enabled
                </>
              ) : (
                <>
                  <BellIcon className="mr-1.5 size-3.5" />
                  {mode === "prompt"
                    ? "Allow notifications"
                    : "Turn on notifications"}
                </>
              )}
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={mode === "prompt" ? onDismiss : onClose}
            className="w-full text-white/70 hover:bg-white/10 hover:text-white"
            size="lg"
          >
            {mode === "prompt" ? (
              <>
                <BellOffIcon className="mr-1.5 size-3.5" />
                Not now
              </>
            ) : (
              "Close"
            )}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
}

// ── NotificationPrompt — auto-popup for new users ────────────────────────────

export default function NotificationPrompt() {
  const { status, loading, subscribe, unsubscribe } =
    useNotificationSubscription();
  const [open, setOpen] = useState(false);

  // Auto-show after 800ms when idle and not dismissed
  useEffect(() => {
    if (status !== "idle") return;
    const dismissed = localStorage.getItem("notification-prompt-dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setOpen(true), 1000);
    return () => clearTimeout(timer);
  }, [status]);

  const handleDismiss = () => {
    localStorage.setItem("notification-prompt-dismissed", "true");
    setOpen(false);
  };

  const handleSubscribe = async () => {
    await subscribe();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <NotificationDialogContent
        mode="prompt"
        status={status}
        loading={loading}
        onSubscribe={handleSubscribe}
        onUnsubscribe={unsubscribe}
        onDismiss={handleDismiss}
        onClose={() => setOpen(false)}
      />
    </Dialog>
  );
}

// ── NotificationSettings — inline text trigger styled like View Breakdown ─────

export function NotificationSettings() {
  const { status, loading, subscribe, unsubscribe } =
    useNotificationSubscription();
  const [open, setOpen] = useState(false);

  const isSubscribed = status === "subscribed";

  const handleSubscribe = async () => {
    await subscribe();
    setOpen(false);
  };

  const label = isSubscribed ? "Notifications On" : "Notifications Off";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <motion.div
        className="relative cursor-pointer"
        initial="rest"
        whileHover="hover"
        animate="rest"
        onClick={() => setOpen(true)}
      >
        <span className="font-dinnext text-lg md:text-xl font-bold uppercase text-white/70 hover:text-white transition-colors">
          {label}
        </span>
        <motion.span
          className="absolute left-0 bottom-0 h-[3px] md:h-[5px] bg-white/70 block"
          variants={{ rest: { width: "0%" }, hover: { width: "100%" } }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </motion.div>

      <NotificationDialogContent
        mode="settings"
        status={status}
        loading={loading}
        onSubscribe={handleSubscribe}
        onUnsubscribe={unsubscribe}
        onDismiss={() => setOpen(false)}
        onClose={() => setOpen(false)}
      />
    </Dialog>
  );
}
