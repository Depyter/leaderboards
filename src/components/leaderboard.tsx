"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";

export function Leaderboard() {
  const houses = useQuery(api.ranking.getLeaderboard);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setBgLoaded(true);
    img.src = "/assets/background.webp";
  }, []);
  const isReady = houses !== undefined && bgLoaded;

  return (
    // Outer shell gives the page its full height so the bg image has somewhere to live
    <div className="relative w-full h-[1850px] md:h-[2550px] lg:h-[3550px] font-tungsten overflow-hidden">
      {/* ── Background — always in the DOM so it starts painting immediately ── */}
      <img
        src="/assets/background.webp"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
      />

      <AnimatePresence>
        {/* ── Loading overlay — sits on top at z-50, fades away when ready ── */}
        {!isReady && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          >
            {/* Loading background */}
            <img
              src="/assets/loading.webp"
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
            />
            {/* Dark purple gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d0520]/80 to-transparent" />

            {/* Centered logo */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              <motion.img
                src="/assets/komsai.webp"
                alt="Komsai Cup"
                className="w-72 md:w-[480px]"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        )}

        {/* ── Main content — fades in once bg is painted and data is ready ── */}
        {isReady && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Top header for widescreen */}
            <div className="hidden lg:flex absolute top-[6%] md:left-32 md:right-32 xl:left-56 xl:right-56 justify-between items-center z-50">
              <span className="text-white font-tungsten md:text-6xl lg:text-7xl xl:text-8xl font-bold">
                ONE TEAM. ONE GOAL.
              </span>
              <span className="text-white font-tungsten md:text-6xl lg:text-7xl xl:text-8xl font-bold">
                OUR TIME IS NOW.
              </span>
            </div>

            {/* 4 diamond boxes in a diamond pattern */}
            <div className="absolute top-[28.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none w-[280px] h-[260px] md:w-[330px] lg:w-[440px] md:h-[330px] lg:h-[440px]">
              {houses.slice(0, 4).map((house, i) => {
                const positions = [
                  "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-5 md:-translate-y-9 lg:-translate-y-13",
                  "absolute top-1/2 left-0 -translate-y-1/2",
                  "absolute top-1/2 right-0 -translate-y-1/2",
                  "absolute bottom-0 left-1/2 -translate-x-1/2",
                ];

                const basicSize = "w-26 h-26  lg:w-42 md:h-30 md:w-30 lg:h-42";
                const backgroundClasses = [
                  "bg-[url('/assets/1st.png')] w-28 h-28 md:h-37 md:w-37 lg:w-52 md:h-37 md:w-37 lg:h-52",
                  `bg-[url('/assets/2nd.png')] ${basicSize}`,
                  `bg-[url('/assets/3rd.png')] ${basicSize}`,
                  `bg-[url('/assets/4th.png')] ${basicSize}`,
                ];

                const initials = [
                  { opacity: 0, scale: 0.6, y: "-100%" },
                  { opacity: 0, scale: 0.6, x: "-100%" },
                  { opacity: 0, scale: 0.6, x: "100%" },
                  { opacity: 0, scale: 0.6, y: "100%" },
                ];

                const tiltAngles = [10, -10, 10, -10];

                return (
                  <motion.div
                    key={house._id}
                    className={`${positions[i]} ${backgroundClasses[i]} bg-cover bg-center bg-no-repeat flex items-center justify-center cursor-pointer`}
                    style={{ rotate: 45 }}
                    initial={initials[i]}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    whileHover={{ rotate: 45 + tiltAngles[i], scale: 1.08 }}
                    transition={{
                      type: "tween",
                      ease: "easeOut",
                      duration: 0.3,
                      delay: 0.3 + i * 0.15,
                    }}
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
                  </motion.div>
                );
              })}
            </div>

            {/* Standings content */}
            <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 w-60 md:w-90 lg:w-134 pointer-events-none">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 items-center">
                  <span className="text-center font-dinnext text-2xl lg:text-6xl font-bold uppercase tracking-tighter text-white max-w-[11ch]">
                    support your bias!
                  </span>
                  <img
                    src="/assets/komsaicup.svg"
                    alt="Komsai Cup"
                    className="w-full"
                  />
                  <span className="font-dinnext text-xl md:text-[40px] font-bold uppercase text-white">
                    Day 1 game day tally
                  </span>
                </div>

                {houses.slice(0, 4).map((house, i) => (
                  <motion.div
                    key={house._id}
                    className="font-dinnext w-full h-12 md:h-16 lg:h-22 flex items-center justify-center text-black relative overflow-hidden bg-white"
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: i * 0.1,
                    }}
                    viewport={{ once: true }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
                      style={{ backgroundImage: "url('/assets/texture.png')" }}
                    />
                    <div className="relative z-10 flex items-center w-full px-4 md:px-6 lg:px-10 gap-3 lg:gap-5">
                      <span className="text-lg md:text-2xl lg:text-3xl font-bold text-[#A151DA] shrink-0">
                        {String(houses.indexOf(house) + 1).padStart(2, "0")}
                      </span>
                      <img
                        src={`/assets/houses/purple/${house.name}.svg`}
                        alt={house.name}
                        className="w-10 h-10 md:w-15 md:h-15 lg:w-20 lg:h-20 shrink-0"
                      />
                      <span className="text-xs md:text-lg lg:text-xl font-bold uppercase tracking-wide flex-1 truncate text-[#584EBE]">
                        {house.name}
                      </span>
                      <span className="text-xs md:text-lg lg:text-2xl font-bold shrink-0 text-[#584EBE]">
                        {house.totalPoints}
                      </span>
                      <img
                        src="/assets/star.svg"
                        alt="star"
                        className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 shrink-0"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer — footer.webp is the CSS background; content stacks on mobile */}
            <div
              className="absolute bottom-0 left-0 right-0 z-30 flex flex-col bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/assets/footer.webp')" }}
            >
              {/* Marquee strip */}
              <div className="overflow-hidden py-1 flex mt-3">
                <motion.div
                  className="flex shrink-0 gap-6 pr-6 items-center text-white font-bold text-xl md:text-2xl tracking-widest uppercase whitespace-nowrap"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {Array.from({ length: 18 }).map((_, i) => (
                    <span key={i} className="flex items-center gap-3">
                      Komsai Cup 2026
                      <img
                        src="/assets/starwhite.svg"
                        alt=""
                        className="w-5 h-5 md:w-7 md:h-7 inline-block"
                      />
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Logo row */}
              <div className="flex items-center gap-3 pt-4 pl-4 md:pl-20">
                <img
                  src="/assets/upcsg.png"
                  alt="UPCSG"
                  className="h-10 md:h-14 w-auto object-contain"
                />
                <div className="w-[3px] self-stretch bg-white" />
                <img
                  src="/assets/30years.png"
                  alt="30 Years"
                  className="h-10 md:h-14 w-auto object-contain"
                />
                <div className="flex flex-col justify-center items-center text-white font-dinnext leading-none tracking-wide w-max">
                  <span
                    className="block w-full text-4xl md:text-6xl font-bold font-tungsten uppercase"
                    style={{
                      textAlign: "justify",
                      textAlignLast: "justify",
                    }}
                  >
                    Always B3Y0ND The Code:
                  </span>
                  <span className="font-dinnext tracking-tighter block w-full text-[7px] md:text-xs font-bold uppercase -mt-2 md:-mt-3">
                    Celebrating 30++ Years of Transcending Excellence
                  </span>
                </div>
              </div>

              {/* Credits row — side-by-side always */}
              <div className="flex flex-row items-start justify-between gap-4 py-4 md:py-6  mb-4">
                {/* Left credits */}
                <div className="flex flex-col gap-2 pl-4 md:pl-20 flex-1">
                  {/* Credits text */}
                  <div className="text-white font-dinnext text-xs md:text-lg lg:text-xl  ">
                    <p className="font-bold">
                      Development by:{" "}
                      <span className="font-medium">
                        {" "}
                        <a href="https://harleyvan.com">Harley Acabal</a>
                      </span>
                    </p>
                    <p className="font-bold">
                      Web Design by:{" "}
                      <span className="font-medium">
                        {" "}
                        Matt Jason Abellanosa
                      </span>
                    </p>
                    <p className="font-bold">
                      Komsai Cup Houses Art Assets by:{" "}
                      <span className="font-medium"> Venice Caringal</span>
                    </p>
                  </div>
                </div>

                {/* Right credits */}
                <div className="text-white font-dinnext text-xs md:text-lg lg:text-xl  text-right pr-4 md:pr-20 flex-1">
                  <p className="font-bold">
                    Official Mascots Illustrations by:
                  </p>
                  <p className="font-medium">Christine Jyle Lyka Revalde</p>
                  <p className="font-medium">Alynnah Rhein Cahutay</p>
                  <p className="font-medium">Sam Joash Recodo</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
