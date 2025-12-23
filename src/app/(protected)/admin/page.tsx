"use client";

import { useState } from "react";
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

type Row = {
  place: string;
  person: string;
  event: string;
  points: number;
};

type NewRow = {
  place: string;
  person: string;
  event: string;
  points: string;
};

interface CardTableProps {
  title: string;
  description: string;
  data: Row[];
  setData: React.Dispatch<React.SetStateAction<Row[]>>;
  newRow: NewRow;
  setNewRow: React.Dispatch<React.SetStateAction<NewRow>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  total: number;
}

function CardTable({
  title,
  description,
  data,
  newRow,
  setNewRow,
  handleSubmit,
  open,
  setOpen,
  total,
}: CardTableProps) {
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
                <TableHead>Person</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.place}</TableCell>
                  <TableCell>{row.person}</TableCell>
                  <TableCell>{row.event}</TableCell>
                  <TableCell>{row.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                <FieldLabel>Person</FieldLabel>
                <Input
                  value={newRow.person}
                  onChange={(e) =>
                    setNewRow({ ...newRow, person: e.target.value })
                  }
                  placeholder="Person name"
                />
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
              <Button type="submit">Add Row</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const [card1Data, setCard1Data] = useState<Row[]>([
    { place: "1st", person: "John Doe", event: "Meeting", points: 10 },
    { place: "2nd", person: "Jane Smith", event: "Workshop", points: 15 },
    { place: "3rd", person: "Bob Johnson", event: "Conference", points: 20 },
  ]);
  const [card2Data, setCard2Data] = useState<Row[]>([
    { place: "1st", person: "Alice Brown", event: "Seminar", points: 12 },
    { place: "2nd", person: "Charlie Wilson", event: "Training", points: 18 },
    { place: "3rd", person: "Diana Lee", event: "Webinar", points: 25 },
  ]);
  const [card3Data, setCard3Data] = useState<Row[]>([
    { place: "1st", person: "Eve Garcia", event: "Panel", points: 14 },
    { place: "2nd", person: "Frank Miller", event: "Networking", points: 16 },
    { place: "3rd", person: "Grace Taylor", event: "Expo", points: 22 },
  ]);
  const [card4Data, setCard4Data] = useState<Row[]>([
    { place: "1st", person: "Helen Davis", event: "Summit", points: 19 },
    { place: "2nd", person: "Ian Clark", event: "Retreat", points: 21 },
    { place: "3rd", person: "Julia Adams", event: "Hackathon", points: 17 },
  ]);

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);

  const [newRow1, setNewRow1] = useState<NewRow>({
    place: "",
    person: "",
    event: "",
    points: "",
  });
  const [newRow2, setNewRow2] = useState<NewRow>({
    place: "",
    person: "",
    event: "",
    points: "",
  });
  const [newRow3, setNewRow3] = useState<NewRow>({
    place: "",
    person: "",
    event: "",
    points: "",
  });
  const [newRow4, setNewRow4] = useState<NewRow>({
    place: "",
    person: "",
    event: "",
    points: "",
  });

  const total1 = card1Data.reduce((sum, row) => sum + row.points, 0);
  const total2 = card2Data.reduce((sum, row) => sum + row.points, 0);
  const total3 = card3Data.reduce((sum, row) => sum + row.points, 0);
  const total4 = card4Data.reduce((sum, row) => sum + row.points, 0);

  const handleSubmit1 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newRow1.place && newRow1.person && newRow1.event && newRow1.points) {
      setCard1Data([
        ...card1Data,
        { ...newRow1, points: parseInt(newRow1.points) || 0 },
      ]);
      setNewRow1({ place: "", person: "", event: "", points: "" });
      setOpen1(false);
    }
  };

  const handleSubmit2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newRow2.place && newRow2.person && newRow2.event && newRow2.points) {
      setCard2Data([
        ...card2Data,
        { ...newRow2, points: parseInt(newRow2.points) || 0 },
      ]);
      setNewRow2({ place: "", person: "", event: "", points: "" });
      setOpen2(false);
    }
  };

  const handleSubmit3 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newRow3.place && newRow3.person && newRow3.event && newRow3.points) {
      setCard3Data([
        ...card3Data,
        { ...newRow3, points: parseInt(newRow3.points) || 0 },
      ]);
      setNewRow3({ place: "", person: "", event: "", points: "" });
      setOpen3(false);
    }
  };

  const handleSubmit4 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newRow4.place && newRow4.person && newRow4.event && newRow4.points) {
      setCard4Data([
        ...card4Data,
        { ...newRow4, points: parseInt(newRow4.points) || 0 },
      ]);
      setNewRow4({ place: "", person: "", event: "", points: "" });
      setOpen4(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardTable
          title="Card 1"
          description="Description for Card 1"
          data={card1Data}
          setData={setCard1Data}
          newRow={newRow1}
          setNewRow={setNewRow1}
          handleSubmit={handleSubmit1}
          open={open1}
          setOpen={setOpen1}
          total={total1}
        />
        <CardTable
          title="Card 2"
          description="Description for Card 2"
          data={card2Data}
          setData={setCard2Data}
          newRow={newRow2}
          setNewRow={setNewRow2}
          handleSubmit={handleSubmit2}
          open={open2}
          setOpen={setOpen2}
          total={total2}
        />
        <CardTable
          title="Card 3"
          description="Description for Card 3"
          data={card3Data}
          setData={setCard3Data}
          newRow={newRow3}
          setNewRow={setNewRow3}
          handleSubmit={handleSubmit3}
          open={open3}
          setOpen={setOpen3}
          total={total3}
        />
        <CardTable
          title="Card 4"
          description="Description for Card 4"
          data={card4Data}
          setData={setCard4Data}
          newRow={newRow4}
          setNewRow={setNewRow4}
          handleSubmit={handleSubmit4}
          open={open4}
          setOpen={setOpen4}
          total={total4}
        />
      </div>
    </div>
  );
}
