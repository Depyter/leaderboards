"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const EVENTS = {
  Sports: [
    "Men's Basketball",
    "Women's Basketball",
    "Frisbee",
    "Volleyball",
    "Badminton",
  ],
  Esports: ["Valorant", "Mobile Legends", "Tekken", "Tetris"],
  "Board Games": ["Chess", "Scrabble", "Rubiks Cube"],
};

function Row({
  label,
  isHeader = false,
  isCategoryLabel = false,
  isTotal = false,
  houses,
  getValue,
  delay = 0,
}: {
  label: string;
  isHeader?: boolean;
  isCategoryLabel?: boolean;
  isTotal?: boolean;
  houses: { _id: string; name: string }[];
  getValue?: (houseId: string) => number | React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      className="font-dinnext w-full flex items-center text-black relative overflow-hidden bg-white"
      initial={{ opacity: 0, x: isHeader ? 0 : -24, y: isHeader ? -12 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
    >
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" />
      <div className="relative z-10 flex items-center w-full">
        {/* Label column */}
        <div
          className={`flex items-center shrink-0 px-4 md:px-6 lg:px-8 h-12 md:h-16 lg:h-20 ${
            isCategoryLabel ? "w-full" : "w-[45%] md:w-[40%]"
          }`}
        >
          {isHeader ? (
            <span className="text-base md:text-xl lg:text-2xl font-bold uppercase tracking-wider text-[#A151DA]">
              {label}
            </span>
          ) : isCategoryLabel ? (
            <span className="text-sm md:text-base lg:text-lg font-bold uppercase tracking-widest text-[#A151DA]/60">
              {label}
            </span>
          ) : isTotal ? (
            <span className="text-base md:text-xl lg:text-2xl font-bold uppercase tracking-wide text-[#584EBE]">
              {label}
            </span>
          ) : (
            <span className="text-xs md:text-base lg:text-lg font-bold uppercase tracking-wide text-[#584EBE]">
              {label}
            </span>
          )}
        </div>

        {/* House columns */}
        {!isCategoryLabel &&
          houses.map((house) => (
            <div
              key={house._id}
              className="flex items-center justify-center flex-1 h-12 md:h-16 lg:h-20"
            >
              {isHeader ? (
                <img
                  src={`/assets/houses/purple/${house.name}.svg`}
                  alt={house.name}
                  className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain"
                />
              ) : (
                <span
                  className={`font-bold text-[#584EBE] ${
                    isTotal
                      ? "text-base md:text-xl lg:text-2xl"
                      : "text-sm md:text-base lg:text-xl"
                  }`}
                >
                  {getValue ? getValue(house._id) : 0}
                </span>
              )}
            </div>
          ))}
      </div>
    </motion.div>
  );
}

export default function BreakdownPage() {
  const houses = useQuery(api.ranking.getLeaderboard);
  const actions = useQuery(api.ranking.getAllActions);
  const [currentDay, setCurrentDay] = useState(1);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setBgLoaded(true);
    img.src = "/assets/tables.webp";
  }, []);

  const isReady = houses !== undefined && actions !== undefined && bgLoaded;

  const prevDay = () => setCurrentDay((d) => Math.max(1, d - 1));
  const nextDay = () => setCurrentDay((d) => Math.min(5, d + 1));

  // Compute breakdown only when data is ready
  const dayActions = isReady ? actions.filter((a) => a.day === currentDay) : [];

  const breakdown: Record<string, Record<string, number>> = {};
  for (const action of dayActions) {
    if (!breakdown[action.event]) breakdown[action.event] = {};
    breakdown[action.event][action.house] =
      (breakdown[action.event][action.house] || 0) + action.points;
  }

  const activeEvents = new Set(Object.keys(breakdown));
  const filteredEvents = isReady
    ? (Object.fromEntries(
        Object.entries(EVENTS)
          .map(([category, events]) => [
            category,
            events.filter((e) => activeEvents.has(e)),
          ])
          .filter(([, events]) => (events as string[]).length > 0),
      ) as Record<string, string[]>)
    : {};

  const totals: Record<string, number> = {};
  if (isReady) {
    houses.forEach((house) => {
      totals[house._id] = Object.keys(breakdown).reduce(
        (sum, event) => sum + (breakdown[event]?.[house._id] || 0),
        0,
      );
    });
  }

  let rowIndex = 0;

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/assets/tables.webp)" }}
    >
      <AnimatePresence>
        {/* Loading overlay */}
        {!isReady && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          >
            <img
              src="/assets/loading.webp"
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d0520]/80 to-transparent" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <motion.img
                src="/assets/komsai.webp"
                alt="Komsai Cup"
                className="w-72 md:w-[480px]"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Main content */}
        {isReady && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="min-h-screen flex flex-col items-center justify-center py-8 px-4"
          >
            <img
              src="/assets/komsai.webp"
              alt="Komsai"
              className="w-100 mb-2"
            />

            {/* Day navigation */}
            <div className="flex items-center gap-6 mb-6">
              <button
                onClick={prevDay}
                disabled={currentDay === 1}
                className="text-white disabled:opacity-30 hover:scale-110 transition-transform"
              >
                <ChevronLeft
                  className="w-8 h-8 md:w-10 md:h-10"
                  strokeWidth={3}
                />
              </button>
              <span className="text-white font-tungsten text-4xl md:text-6xl font-bold tracking-widest uppercase">
                Day {currentDay}
              </span>
              <button
                onClick={nextDay}
                disabled={currentDay === 5}
                className="text-white disabled:opacity-30 hover:scale-110 transition-transform"
              >
                <ChevronRight
                  className="w-8 h-8 md:w-10 md:h-10"
                  strokeWidth={3}
                />
              </button>
            </div>

            {/* Table */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDay}
                className="w-full max-w-3xl flex flex-col gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header row */}
                <Row label="Event" isHeader houses={houses} delay={0} />

                {/* Category groups */}
                {Object.keys(filteredEvents).length === 0 ? (
                  <div className="font-dinnext text-white/70 text-center py-8 text-lg font-bold uppercase tracking-widest">
                    No events recorded for Day {currentDay}
                  </div>
                ) : (
                  Object.entries(filteredEvents).map(
                    ([category, categoryEvents]) => {
                      const categoryIndex = rowIndex;
                      rowIndex += categoryEvents.length + 1;
                      return (
                        <div key={category} className="flex flex-col gap-1">
                          {/* Category label */}
                          <Row
                            label={category}
                            isCategoryLabel
                            houses={houses}
                            delay={categoryIndex * 0.05}
                          />
                          {categoryEvents.map((event, i) => (
                            <Row
                              key={event}
                              label={event}
                              houses={houses}
                              getValue={(houseId) =>
                                breakdown[event]?.[houseId] || 0
                              }
                              delay={(categoryIndex + i + 1) * 0.05}
                            />
                          ))}
                        </div>
                      );
                    },
                  )
                )}

                {/* Total row */}
                <div className="mt-2">
                  <Row
                    label="Total"
                    isTotal
                    houses={houses}
                    getValue={(houseId) => totals[houseId]}
                    delay={(rowIndex + 1) * 0.05}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
