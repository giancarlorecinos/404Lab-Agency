"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AudioEngine } from "@/lib/audio-engine";

type AudioCtxValue = {
  isActive: boolean;
  isPending: boolean;
  toggleAudio: () => Promise<void>;
  triggerPing: () => void;
  getAnalyser: () => AnalyserNode | null;
};

const AudioCtx = createContext<AudioCtxValue>({
  isActive: false,
  isPending: false,
  toggleAudio: async () => {},
  triggerPing: () => {},
  getAnalyser: () => null,
});

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const engineRef = useRef<AudioEngine | null>(null);

  const toggleAudio = useCallback(async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      if (isActive) {
        engineRef.current?.stop();
        engineRef.current = null;
        setIsActive(false);
      } else {
        engineRef.current = new AudioEngine();
        await engineRef.current.start();
        setIsActive(true);
      }
    } catch (_) {
      // AudioContext blocked or unavailable — fail silently
    } finally {
      setIsPending(false);
    }
  }, [isActive, isPending]);

  const triggerPing = useCallback(() => {
    if (isActive) engineRef.current?.ping();
  }, [isActive]);

  const getAnalyser = useCallback(
    () => engineRef.current?.analyser ?? null,
    [],
  );

  return (
    <AudioCtx.Provider
      value={{ isActive, isPending, toggleAudio, triggerPing, getAnalyser }}
    >
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  return useContext(AudioCtx);
}
