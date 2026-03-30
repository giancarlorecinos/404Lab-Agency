"use client";

import { AudioProvider } from "@/context/audio-context";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}
