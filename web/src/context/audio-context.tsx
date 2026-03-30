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
  toggleAudio: () => void; // NOT async — AudioContext must be created synchronously
  triggerPing: () => void;
  getAnalyser: () => AnalyserNode | null;
};

const AudioCtx = createContext<AudioCtxValue>({
  isActive: false,
  isPending: false,
  toggleAudio: () => {},
  triggerPing: () => {},
  getAnalyser: () => null,
});

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const engineRef = useRef<AudioEngine | null>(null);

  // toggleAudio is intentionally NOT async.
  //
  // Browsers require new AudioContext() to be called synchronously inside a
  // direct user-gesture handler. Marking the function async (or calling it
  // from an async function) puts the execution into a microtask queue which
  // Chrome/Safari treat as outside the gesture — causing a silent block.
  //
  // We create the engine (and therefore the AudioContext) synchronously here,
  // then let engine.start() run asynchronously via .then()/.catch().
  const toggleAudio = useCallback(() => {
    if (isPending) return;

    if (isActive) {
      engineRef.current?.stop();
      engineRef.current = null;
      setIsActive(false);
      return;
    }

    setIsPending(true);

    let engine: AudioEngine;
    try {
      // new AudioEngine() calls new AudioContext() — must stay synchronous.
      engine = new AudioEngine();
      engineRef.current = engine;
    } catch (err) {
      console.error("[AudioEngine] AudioContext creation blocked:", err);
      setIsPending(false);
      return;
    }

    engine
      .start()
      .then(() => {
        setIsActive(true);
        setIsPending(false);
      })
      .catch((err) => {
        console.error("[AudioEngine] start() failed:", err);
        engineRef.current = null;
        setIsPending(false);
      });
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
