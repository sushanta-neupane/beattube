"use client";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Contents from "./components/Contents";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import LoadSpinner from "./components/LoadSpinner";

export default function Home() {
  return (
    <ThemeProvider>
      <NextUIProvider>
        <main className="mx-2 sm:mx-5">

          <Navbar />
          <Suspense fallback={<LoadSpinner label="Fetching..." />}>
          <Contents/>
          </Suspense>
        </main>
      </NextUIProvider>
    </ThemeProvider>
  );
}
