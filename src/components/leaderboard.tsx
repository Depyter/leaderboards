"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
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
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown } from "lucide-react";

export function Leaderboard() {
  const houses = useQuery(api.ranking.getLeaderboard);

  if (!houses) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading rankings...</p>
        </div>
      </div>
    );
  }

  const firstPlace = houses[0];
  const secondPlace = houses[1];
  const thirdPlace = houses[2];
  const remaining = houses.slice(3);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-12 h-12 text-yellow-500 animate-pulse" />
          <h1 className="text-6xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            House Rankings
          </h1>
          <Trophy className="w-12 h-12 text-yellow-500 animate-pulse" />
        </div>
        <p className="text-xl text-muted-foreground">
          Current standings for Komsai Week
        </p>
      </div>

      {/* Podium - Top 3 */}
      <div className="flex items-end justify-center gap-6 mb-16 flex-wrap md:flex-nowrap">
        {/* 2nd Place - Left */}
        {secondPlace && (
          <Card
            className="w-full md:w-64 border-4 border-gray-400 shadow-xl hover:shadow-2xl transition-all animate-in zoom-in"
            style={{ animationDelay: "100ms" }}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <Medal className="w-16 h-16 text-gray-400" />
                  <Badge className="absolute -top-2 -right-2 bg-gray-400 hover:bg-gray-500 text-white">
                    2nd
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-2xl">{secondPlace.name}</CardTitle>
              <CardDescription className="text-sm">
                {secondPlace.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-6 pb-6">
              <div className="text-5xl font-bold text-gray-500 mb-2">
                {secondPlace.totalPoints}
              </div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                points
              </p>
            </CardContent>
          </Card>
        )}

        {/* 1st Place - Center (Bigger) */}
        {firstPlace && (
          <Card
            className="w-full md:w-80 border-4 border-yellow-500 shadow-2xl hover:shadow-3xl transition-all animate-in zoom-in"
            style={{ animationDelay: "0ms" }}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <Crown className="w-20 h-20 text-yellow-500 animate-pulse" />
                  <Badge className="absolute -top-2 -right-2 bg-yellow-500 hover:bg-yellow-600 text-white">
                    1st
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">
                {firstPlace.name}
              </CardTitle>
              <CardDescription className="text-base">
                {firstPlace.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-8 pb-8">
              <div className="text-7xl font-bold bg-linear-to-br from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-3">
                {firstPlace.totalPoints}
              </div>
              <p className="text-base text-muted-foreground uppercase tracking-wide font-semibold">
                points
              </p>
            </CardContent>
          </Card>
        )}

        {/* 3rd Place - Right */}
        {thirdPlace && (
          <Card
            className="w-full md:w-64 border-4 border-amber-700 shadow-xl hover:shadow-2xl transition-all animate-in zoom-in"
            style={{ animationDelay: "200ms" }}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <Award className="w-16 h-16 text-amber-700" />
                  <Badge className="absolute -top-2 -right-2 bg-amber-700 hover:bg-amber-800 text-white">
                    3rd
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-2xl">{thirdPlace.name}</CardTitle>
              <CardDescription className="text-sm">
                {thirdPlace.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-6 pb-6">
              <div className="text-5xl font-bold text-amber-700 mb-2">
                {thirdPlace.totalPoints}
              </div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                points
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 4th Place and Below - Table */}
      {remaining.length > 0 && (
        <div className="border-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24 text-center">Rank</TableHead>
                <TableHead>House Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {remaining.map((house, index) => (
                <TableRow
                  key={house._id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-semibold">
                      {index + 4}th
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-lg">
                    {house.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {house.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-primary">
                        {house.totalPoints}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase">
                        points
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty State */}
      {houses.length === 0 && (
        <Card className="border-2">
          <CardContent className="text-center py-12">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Houses Yet</h3>
            <p className="text-muted-foreground">
              The competition hasn&apos;t started yet. Check back soon!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
