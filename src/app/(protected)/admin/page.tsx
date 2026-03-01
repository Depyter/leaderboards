"use client";

import { useState } from "react";
import { useQuery, usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NotificationSender from "@/components/pushManager";

interface CardTableProps {
  houseId: Id<"house">;
  title: string;
  description: string;
  total: number;
  addScore: ReturnType<typeof useMutation<typeof api.ranking.addScore>>;
}

function CardTable({
  houseId,
  title,
  description,
  total,
  addScore,
}: CardTableProps) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.ranking.getPaginatedActionsByHouse,
    { houseId },
    { initialNumItems: 5 },
  );

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newRow, setNewRow] = useState({
    place: "",
    event: "",
    points: "",
    day: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newRow.place && newRow.event && newRow.points && newRow.day) {
      setIsSubmitting(true);
      try {
        await addScore({
          house: houseId,
          place: newRow.place as "1st" | "2nd" | "3rd" | "4th",
          day: parseInt(newRow.day) as 1 | 2 | 3 | 4 | 5,
          event: newRow.event,
          points: parseInt(newRow.points) || 0,
        });
        setNewRow({ place: "", event: "", points: "", day: "" });
        setOpen(false);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card className="flex-1">
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="text-right">
          <span className="font-bold text-5xl">{total}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p>Content for {title}</p>
        <div className="max-h-50 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Place</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((action, index) => (
                <TableRow key={index}>
                  <TableCell>{action.day}</TableCell>
                  <TableCell>{action.place}</TableCell>
                  <TableCell>{action.user}</TableCell>
                  <TableCell>{action.event}</TableCell>
                  <TableCell>{action.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {status === "CanLoadMore" && (
            <Button onClick={() => loadMore(10)} className="mt-2">
              Load More
            </Button>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4">Add Row</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Row to {title}</DialogTitle>
              <DialogDescription>
                Enter details for the new row.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field>
                <FieldLabel>Day</FieldLabel>
                <Select
                  value={newRow.day}
                  onValueChange={(value) =>
                    setNewRow({ ...newRow, day: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Place</FieldLabel>
                <Select
                  value={newRow.place}
                  onValueChange={(value) =>
                    setNewRow({ ...newRow, place: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select place" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st</SelectItem>
                    <SelectItem value="2nd">2nd</SelectItem>
                    <SelectItem value="3rd">3rd</SelectItem>
                    <SelectItem value="4th">4th</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Event</FieldLabel>
                <Select
                  value={newRow.event}
                  onValueChange={(value) =>
                    setNewRow({ ...newRow, event: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Mx Komsai">Mx Komsai</SelectItem>
                      <SelectLabel>Sports</SelectLabel>
                      <SelectItem value="Men's Basketball">
                        Men&apos;s Basketball
                      </SelectItem>
                      <SelectItem value="Women's Basketball">
                        Women&apos;s Basketball
                      </SelectItem>
                      <SelectItem value="Frisbee">Frisbee</SelectItem>
                      <SelectItem value="Volleyball">Volleyball</SelectItem>
                      <SelectItem value="Badminton">Badminton</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Esports</SelectLabel>
                      <SelectItem value="Valorant">Valorant</SelectItem>
                      <SelectItem value="Mobile Legends">
                        Mobile Legends
                      </SelectItem>
                      <SelectItem value="Tekken">Tekken</SelectItem>
                      <SelectItem value="Tetris">Tetris</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Board Games</SelectLabel>
                      <SelectItem value="Chess">Chess</SelectItem>
                      <SelectItem value="Scrabble">Scrabble</SelectItem>
                      <SelectItem value="Rubiks Cube">Rubiks Cube</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Points</FieldLabel>
                <Input
                  type="number"
                  value={newRow.points}
                  onChange={(e) =>
                    setNewRow({ ...newRow, points: e.target.value })
                  }
                  placeholder="Points"
                />
              </Field>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Row"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const houses = useQuery(api.ranking.getLeaderboard);
  const addScore = useMutation(api.ranking.addScore);

  if (!houses) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {houses.map((house) => (
          <CardTable
            key={house._id}
            houseId={house._id}
            title={house.name}
            description={house.description}
            total={house.totalPoints || 0}
            addScore={addScore}
          />
        ))}
      </div>

      <div className="w-full md:max-w-md">
        <NotificationSender />
      </div>
    </div>
  );
}
