"use client";

import { useRef, useEffect } from "react";
import { useAudio } from "@/context/audio-context";

// 4 bars — phosphor violet — RAF-driven when active
export function AudioVisualizer() {
  const { isActive, getAnalyser } = useAudio();
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);

    if (!isActive) {
      barRefs.current.forEach((b) => {
        if (b) b.style.height = "3px";
      });
      return;
    }

    // Phase offsets for organic stagger when analyser data isn't available
    const phase = [0, 0.9, 1.8, 2.7];

    const tick = (t: number) => {
      const analyser = getAnalyser();

      if (analyser) {
        const freq = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freq);
        barRefs.current.forEach((b, i) => {
          if (!b) return;
          b.style.height = `${3 + (freq[i + 1] / 255) * 13}px`;
        });
      } else {
        // Math-driven fallback (two overlapping sin waves per bar)
        barRefs.current.forEach((b, i) => {
          if (!b) return;
          const h =
            5 +
            Math.sin(t / 380 + phase[i]) * 4.5 +
            Math.sin(t / 160 + phase[i] * 2.1) * 2.5;
          b.style.height = `${Math.max(2, h)}px`;
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, getAnalyser]);

  return (
    <div className="flex items-end gap-[2px] h-[14px]" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
          style={{
            width: "3px",
            height: "3px",
            borderRadius: "9999px",
            willChange: "height",
            background: isActive
              ? "rgb(139, 92, 246)"
              : "rgba(139, 92, 246, 0.22)",
            boxShadow: isActive
              ? "0 0 5px rgba(139, 92, 246, 0.85)"
              : "none",
            transition: "background 0.5s, box-shadow 0.5s",
          }}
        />
      ))}
    </div>
  );
}
