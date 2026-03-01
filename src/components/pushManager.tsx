"use client";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BellIcon,
  SendIcon,
  UsersIcon,
  TrophyIcon,
  CalendarIcon,
  PencilIcon,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type NotifType = "custom" | "standings" | "event-result";
type Tag = "reminders" | "results";

const EVENTS = [
  { group: null, value: "Mx Komsai", label: "Mx Komsai" },
  { group: "Sports", value: "Men's Basketball", label: "Men's Basketball" },
  { group: "Sports", value: "Women's Basketball", label: "Women's Basketball" },
  { group: "Sports", value: "Frisbee", label: "Frisbee" },
  { group: "Sports", value: "Volleyball", label: "Volleyball" },
  { group: "Sports", value: "Badminton", label: "Badminton" },
  { group: "Esports", value: "Valorant", label: "Valorant" },
  { group: "Esports", value: "Mobile Legends", label: "Mobile Legends" },
  { group: "Esports", value: "Tekken", label: "Tekken" },
  { group: "Esports", value: "Tetris", label: "Tetris" },
  { group: "Board Games", value: "Chess", label: "Chess" },
  { group: "Board Games", value: "Scrabble", label: "Scrabble" },
  { group: "Board Games", value: "Rubik's Cube", label: "Rubik's Cube" },
];

const PLACE_EMOJI: Record<string, string> = {
  "1st": "🥇",
  "2nd": "🥈",
  "3rd": "🥉",
  "4th": "4️⃣",
};

// ── Notification preview ──────────────────────────────────────────────────────

function NotificationPreview({ title, body }: { title: string; body: string }) {
  const hasContent = title.trim() || body.trim();

  return (
    <div className="rounded-lg border bg-muted/40 p-3 space-y-1">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        Preview
      </p>
      {hasContent ? (
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <BellIcon className="size-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {title || "Notification title"}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {body || "Notification body"}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">
          Fill in the fields above to see a preview.
        </p>
      )}
    </div>
  );
}

// ── Template forms ────────────────────────────────────────────────────────────

interface CustomFormProps {
  title: string;
  body: string;
  tag: Tag;
  onChange: (
    fields: Partial<{ title: string; body: string; tag: Tag }>,
  ) => void;
}

function CustomForm({ title, body, tag, onChange }: CustomFormProps) {
  return (
    <>
      <Field>
        <FieldLabel>Title</FieldLabel>
        <Input
          value={title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Reminder: Day 3 starts tomorrow!"
          maxLength={50}
        />
      </Field>
      <Field>
        <FieldLabel>Message</FieldLabel>
        <Textarea
          value={body}
          onChange={(e) => onChange({ body: e.target.value })}
          placeholder="Write your message here…"
          rows={3}
          maxLength={200}
        />
      </Field>
      <Field>
        <FieldLabel>Category</FieldLabel>
        <Select value={tag} onValueChange={(v: Tag) => onChange({ tag: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reminders">Reminders</SelectItem>
            <SelectItem value="results">Results</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </>
  );
}

interface House {
  _id: string;
  name: string;
  totalPoints: number;
  description: string;
}

interface StandingsFormProps {
  houses: House[];
  customNote: string;
  onNoteChange: (note: string) => void;
}

function StandingsForm({
  houses,
  customNote,
  onNoteChange,
}: StandingsFormProps) {
  return (
    <>
      {/* Live standings mini-table */}
      <div className="rounded-lg border divide-y text-sm">
        {houses.slice(0, 4).map((house, i) => (
          <div
            key={house._id}
            className="flex items-center justify-between px-3 py-1.5"
          >
            <span className="flex items-center gap-2">
              <span className="text-muted-foreground w-4 text-xs">
                {i + 1}.
              </span>
              <span className="font-medium">{house.name}</span>
            </span>
            <span className="font-bold tabular-nums">
              {house.totalPoints} pts
            </span>
          </div>
        ))}
      </div>

      <Field>
        <FieldLabel>Custom note (optional)</FieldLabel>
        <Input
          value={customNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="e.g. Day 2 complete!"
          maxLength={80}
        />
      </Field>
    </>
  );
}

interface EventResultFormProps {
  houses: House[];
  fields: { houseId: string; event: string; place: string; day: string };
  onChange: (
    f: Partial<{ houseId: string; event: string; place: string; day: string }>,
  ) => void;
}

function EventResultForm({ houses, fields, onChange }: EventResultFormProps) {
  const groupedEvents = useMemo(() => {
    const groups: Record<string, typeof EVENTS> = {};
    for (const e of EVENTS) {
      const key = e.group ?? "Featured";
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    }
    return groups;
  }, []);

  return (
    <>
      <Field>
        <FieldLabel>Event</FieldLabel>
        <Select
          value={fields.event}
          onValueChange={(v) => onChange({ event: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select event" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(groupedEvents).map(([group, events]) => (
              <SelectGroup key={group}>
                <SelectLabel>{group}</SelectLabel>
                {events.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel>Winning House</FieldLabel>
          <Select
            value={fields.houseId}
            onValueChange={(v) => onChange({ houseId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select house" />
            </SelectTrigger>
            <SelectContent>
              {houses.map((h) => (
                <SelectItem key={h._id} value={h._id}>
                  {h.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Place</FieldLabel>
          <Select
            value={fields.place}
            onValueChange={(v) => onChange({ place: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Place" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1st">1st</SelectItem>
              <SelectItem value="2nd">2nd</SelectItem>
              <SelectItem value="3rd">3rd</SelectItem>
              <SelectItem value="4th">4th</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel>Day</FieldLabel>
        <Select value={fields.day} onValueChange={(v) => onChange({ day: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((d) => (
              <SelectItem key={d} value={String(d)}>
                Day {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NotificationSender() {
  const sendNotification = useAction(api.push.sendAll);
  const subscriberCount = useQuery(api.subscriptions.getCount) ?? 0;
  const housesData = useQuery(api.ranking.getLeaderboard);
  const houses = useMemo(() => housesData ?? [], [housesData]);

  const [notifType, setNotifType] = useState<NotifType>("event-result");
  const [isSending, setIsSending] = useState(false);

  // Custom form state
  const [custom, setCustom] = useState({
    title: "",
    body: "",
    tag: "reminders" as Tag,
  });

  // Standings form state
  const [standingsNote, setStandingsNote] = useState("");

  // Event result form state
  const [eventResult, setEventResult] = useState({
    houseId: "",
    event: "",
    place: "",
    day: "",
  });

  // ── Compose title + body from template ─────────────────────────────────────

  const composed = useMemo<{ title: string; body: string; tag: Tag }>(() => {
    if (notifType === "custom") {
      return { title: custom.title, body: custom.body, tag: custom.tag };
    }

    if (notifType === "standings") {
      const top = houses[0];
      const title = "Current Standings";
      const standing = houses
        .slice(0, 4)
        .map((h, i) => `${i + 1}. ${h.name} (${h.totalPoints} pts)`)
        .join(" · ");
      const note = standingsNote ? ` — ${standingsNote}` : "";
      const body = top
        ? `${standing}${note}`
        : "Check the leaderboard for the latest standings!";
      return { title, body, tag: "results" };
    }

    // event-result
    const house = houses.find((h) => h._id === eventResult.houseId);
    const emoji = PLACE_EMOJI[eventResult.place] ?? "🏆";
    const title = eventResult.event
      ? `${emoji} ${eventResult.event} Results`
      : "Event Results";
    const body =
      house && eventResult.place && eventResult.event
        ? `${house.name.charAt(0).toUpperCase() + house.name.slice(1)} takes ${eventResult.place} place in ${eventResult.event}!${eventResult.day ? ` (Day ${eventResult.day})` : ""} Check the leaderboard for updated standings.`
        : "New results are in — check the leaderboard!";
    return { title, body, tag: "results" };
  }, [notifType, custom, standingsNote, eventResult, houses]);

  // ── Validation ──────────────────────────────────────────────────────────────

  const isValid = useMemo(() => {
    if (!composed.title.trim() || !composed.body.trim()) return false;
    if (notifType === "event-result") {
      return !!(eventResult.event && eventResult.houseId && eventResult.place);
    }
    return true;
  }, [composed, notifType, eventResult]);

  // ── Send ────────────────────────────────────────────────────────────────────

  const handleSend = async () => {
    if (!isValid) return;
    setIsSending(true);
    try {
      await sendNotification({
        title: composed.title,
        body: composed.body,
        tag: composed.tag,
      });
      // Reset relevant form
      if (notifType === "custom") {
        setCustom({ title: "", body: "", tag: "reminders" });
      } else if (notifType === "standings") {
        setStandingsNote("");
      } else {
        setEventResult({ houseId: "", event: "", place: "", day: "" });
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
    } finally {
      setIsSending(false);
    }
  };

  // ── Type tabs ───────────────────────────────────────────────────────────────

  const types: { value: NotifType; label: string; icon: React.ReactNode }[] = [
    {
      value: "event-result",
      label: "Event Result",
      icon: <TrophyIcon className="size-3.5" />,
    },
    {
      value: "standings",
      label: "Standings",
      icon: <CalendarIcon className="size-3.5" />,
    },
    {
      value: "custom",
      label: "Custom",
      icon: <PencilIcon className="size-3.5" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BellIcon className="size-4" />
              Send Notification
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <UsersIcon className="size-3.5" />
              {subscriberCount} subscriber{subscriberCount !== 1 ? "s" : ""}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Type selector */}
        <div className="flex rounded-md border p-0.5 gap-0.5 bg-muted/50">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => setNotifType(t.value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium transition-colors ${
                notifType === t.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Template-specific form */}
        {notifType === "custom" && (
          <CustomForm
            title={custom.title}
            body={custom.body}
            tag={custom.tag}
            onChange={(fields) => setCustom((prev) => ({ ...prev, ...fields }))}
          />
        )}

        {notifType === "standings" && (
          <StandingsForm
            houses={houses}
            customNote={standingsNote}
            onNoteChange={setStandingsNote}
          />
        )}

        {notifType === "event-result" && (
          <EventResultForm
            houses={houses}
            fields={eventResult}
            onChange={(fields) =>
              setEventResult((prev) => ({ ...prev, ...fields }))
            }
          />
        )}

        {/* Preview */}
        <NotificationPreview title={composed.title} body={composed.body} />

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={isSending || !isValid || subscriberCount === 0}
          className="w-full"
        >
          {isSending ? (
            <>
              <div className="mr-2 size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Sending to {subscriberCount} subscriber
              {subscriberCount !== 1 ? "s" : ""}…
            </>
          ) : (
            <>
              <SendIcon className="mr-2 size-3.5" />
              Send to {subscriberCount} subscriber
              {subscriberCount !== 1 ? "s" : ""}
            </>
          )}
        </Button>

        {subscriberCount === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            No subscribers yet. Notifications will be available once users
            opt-in.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
