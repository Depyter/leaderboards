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
    <div className="relative">
      {/* Background image — top of page only, no repeat, horizontally centered on all viewports */}
      <div
        className="w-full md:aspect-[1240/1761] bg-no-repeat bg-cover bg-center aspect-500/1440 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/Background.png')",
          backgroundPosition: "center top",
        }}
      />
      {/* Foreground image — positioned 420px from top, above background, fixed size and centered */}
      <div className="absolute top-[250px] z-10 pointer-events-none w-full">
        <div className="relative">
          <img
            src="/assets/Foreground.png"
            alt="Foreground"
            className="w-full h-[1440px] md:h-full object-cover object-center"
          />
          {/* 4 diamond boxes in a diamond pattern — 1st top, 2nd left, 3rd right, 4th bottom */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-8/10 z-30 w-[280px] h-[260px] md:w-[440px] md:h-[440px]">
            {houses.slice(0, 4).map((house, i) => {
              const positions = [
                "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-5 md:-translate-y-13", // 1st — top
                "absolute top-1/2 left-0 -translate-y-1/2", // 2nd — left
                "absolute top-1/2 right-0 -translate-y-1/2", // 3rd — right
                "absolute bottom-0 left-1/2 -translate-x-1/2", // 4th — bottom
              ];

              const basicSize = "w-26 h-26 md:w-42 md:h-42";
              const backgroundClasses = [
                "bg-[url('/assets/1st.png')] w-28 h-28 md:w-52 md:h-52 ",
                `bg-[url('/assets/2nd.png')] ${basicSize}`,
                `bg-[url('/assets/3rd.png')] ${basicSize}`,
                `bg-[url('/assets/4th.png')] ${basicSize}`,
              ];
              return (
                <div
                  key={house._id}
                  className={`${positions[i]} ${backgroundClasses[i]} rotate-45 bg-cover bg-center bg-no-repeat flex items-center justify-center`}
                >
                  <div
                    className={`-rotate-45 flex ${
                      i === 0
                        ? "w-3/5 h-3/5 items-end justify-center"
                        : i === 1
                          ? "w-5/10 h-5/10 items-center justify-end"
                          : i === 2
                            ? "w-5/10 h-5/10 items-center justify-start"
                            : "w-5/10 h-5/10 items-start justify-center"
                    }`}
                  >
                    <img
                      src={`/assets/houses/${house.name}.svg`}
                      alt={house.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Standings image — overlapping bottom of foreground */}
        <div className="absolute top-[250px] md:top-[-100px] left-0 z-20 w-full pointer-events-none">
          <img
            src="/assets/standings.png"
            alt="Standings"
            className="w-full h-[1440px] md:h-full object-cover object-center"
          />
          <div className="absolute top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 w-60 md:w-90 lg:w-134">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-4xl lg:text-[90px] font-semibold uppercase text-white">
                  support your bias!
                </span>
                <img
                  src="/assets/komsaicup.svg"
                  alt="Komsai Cup"
                  className="w-full"
                />
                <span className="text-xl md:text-[40px] font-bold uppercase tracking-wide text-white">
                  Day 1 game day tally
                </span>
              </div>
              {houses.slice(0, 4).map((house) => (
                <div
                  key={house._id}
                  className="w-full h-12 md:h-16 lg:h-28 flex items-center justify-center text-black relative overflow-hidden bg-white"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
                    style={{ backgroundImage: "url('/assets/texture.png')" }}
                  />
                  <div className="relative z-10 flex items-center w-full px-4 md:px-6 lg:px-10 gap-3 md:gap-4 lg:gap-8">
                    <span className="text-2xl md:text-4xl lg:text-6xl font-bold text-[#A151DA] shrink-0">
                      {String(houses.indexOf(house) + 1).padStart(2, "0")}
                    </span>
                    <img
                      src={`/assets/houses/purple/${house.name}.svg`}
                      alt={house.name}
                      className="w-10 h-10 md:w-15 md:h-15 lg:w-20 lg:h-20 shrink-0 "
                    />
                    <span className="text-xl md:text-3xl lg:text-5xl font-bold uppercase tracking-wide flex-1 truncate text-[#584EBE]">
                      {house.name}
                    </span>
                    <span className="text-xl md:text-3xl lg:text-5xl font-bold shrink-0 text-[#584EBE]">
                      {house.totalPoints}
                    </span>
                    <img
                      src="/assets/star.svg"
                      alt="star"
                      className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 shrink-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
