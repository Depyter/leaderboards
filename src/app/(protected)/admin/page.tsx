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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newRow.place && newRow.event && newRow.points) {
      setIsSubmitting(true);
      try {
        await addScore({
          house: houseId,
          place: newRow.place as "1st" | "2nd" | "3rd" | "4th",
          event: newRow.event,
          points: parseInt(newRow.points) || 0,
        });
        setNewRow({ place: "", event: "", points: "" });
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
                <TableHead>Place</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((action, index) => (
                <TableRow key={index}>
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
                <Input
                  value={newRow.event}
                  onChange={(e) =>
                    setNewRow({ ...newRow, event: e.target.value })
                  }
                  placeholder="Event name"
                />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
}
