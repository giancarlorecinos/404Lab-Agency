"use client";

import { useEffect, useRef } from "react";

const TRAIL = 12;

export function NeuralCursor() {
  const mainRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const trail = useRef(Array.from({ length: TRAIL }, () => ({ x: -200, y: -200 })));
  const raf = useRef<number | undefined>(undefined);
  const clicking = useRef(false);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onDown = () => { clicking.current = true; };
    const onUp = () => { clicking.current = false; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const animate = () => {
      const { x, y } = mouse.current;

      // Main dot snaps instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      }

      // Ring lags behind (lerp)
      ring.current.x += (x - ring.current.x) * 0.12;
      ring.current.y += (y - ring.current.y) * 0.12;
      if (ringRef.current) {
        const scale = clicking.current ? 0.7 : 1;
        ringRef.current.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px) scale(${scale})`;
      }

      // Trail cascade
      const t = trail.current;
      for (let i = TRAIL - 1; i > 0; i--) {
        t[i].x += (t[i - 1].x - t[i].x) * 0.35;
        t[i].y += (t[i - 1].y - t[i].y) * 0.35;
      }
      t[0].x += (x - t[0].x) * 0.5;
      t[0].y += (y - t[0].y) * 0.5;

      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const size = Math.max(1.5, 5 - i * 0.3);
        el.style.transform = `translate(${t[i].x - size / 2}px, ${t[i].y - size / 2}px)`;
        el.style.opacity = String(((TRAIL - i) / TRAIL) * 0.45);
      });

      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div ref={mainRef} className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden>
      {/* Violet trail particles */}
      {Array.from({ length: TRAIL }).map((_, i) => {
        const size = Math.max(1.5, 5 - i * 0.3);
        return (
          <div
            key={i}
            ref={(el) => { trailRefs.current[i] = el; }}
            className="absolute rounded-full will-change-transform"
            style={{
              width: size,
              height: size,
              background: `rgba(139, 92, 246, 1)`,
              boxShadow: `0 0 ${size * 2}px rgba(139, 92, 246, 0.6)`,
              top: 0,
              left: 0,
            }}
          />
        );
      })}

      {/* Outer ring — lags behind */}
      <div
        ref={ringRef}
        className="absolute w-8 h-8 rounded-full will-change-transform transition-transform duration-75"
        style={{
          top: 0,
          left: 0,
          border: "1px solid rgba(139, 92, 246, 0.5)",
          boxShadow: "0 0 10px rgba(139, 92, 246, 0.2)",
        }}
      />

      {/* Inner dot — instant */}
      <div
        ref={dotRef}
        className="absolute w-2 h-2 rounded-full will-change-transform"
        style={{
          top: 0,
          left: 0,
          background: "rgba(167, 139, 250, 1)",
          boxShadow: "0 0 6px rgba(167, 139, 250, 1)",
        }}
      />
    </div>
  );
}
