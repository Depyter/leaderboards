import type { Metadata } from "next";
import { Geist_Mono, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tungstenCompressed = localFont({
  src: [
    {
      path: "./fonts/Tungsten-Font/WOFF2/TungstenCompressed-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/Tungsten-Font/WOFF2/TungstenCompressed-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Tungsten-Font/WOFF2/TungstenCompressed-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Tungsten-Font/WOFF2/TungstenCompressed-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Tungsten-Font/WOFF2/TungstenCompressed-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-tungsten-compressed",
});

const dinnext = localFont({
  src: [
    {
      path: "./fonts/DINNEXT/DINNextW1G-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/DINNEXT/DINNextW1G-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/DINNEXT/DINNextW1G-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-dinnext",
});

export const metadata: Metadata = {
  title: "KomsaiCup",
  description: "Leaderboard for KomsaiCup!",
  icons: {
    icon: "/assets/starwhite.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${tungstenCompressed.variable} ${dinnext.variable}`}
    >
      <body
        className={`${tungstenCompressed.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
