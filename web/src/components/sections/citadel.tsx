"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function Citadel() {
  const containerRef = useRef<HTMLElement>(null);
  const monolithRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Heavy, methodical rotation tied solely to vertical scroll depth
    gsap.to(monolithRef.current, {
      rotationY: 360,
      rotationX: 180,
      rotationZ: 45,
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5, // Slow, heavy scrub feeling
      },
    });

    // Parallax appearance for the typography
    gsap.fromTo(contentRef.current, 
      { opacity: 0, y: 150 },
      {
        opacity: 1, 
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "center center",
          scrub: 0.5,
        }
      }
    );

    // Deep background glow pulsing
    gsap.to(glowRef.current, {
      opacity: 0.8,
      scale: 1.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      duration: 4,
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[120vh] flex flex-col items-center justify-center overflow-hidden bg-transparent px-4 md:px-8"
      style={{ perspective: "1000px" }}
    >
      {/* Absolute Obsidian Monolith (3D CSS Object) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div ref={glowRef} className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen opacity-30" />
        
        <div 
          ref={monolithRef}
          className="relative w-64 h-64 md:w-96 md:h-96 transform-style-3d will-change-transform shadow-2xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Oblique Dark Box representing the Citadel */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-[#0F0F11] to-[#1A1A1C] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-3xl" style={{ transform: "translateZ(50px)" }} />
          <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl border border-white/5 rounded-3xl" style={{ transform: "rotateY(90deg) translateZ(50px)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1C] to-black border border-white/10 rounded-3xl flex items-center justify-center" style={{ transform: "rotateX(90deg) translateZ(50px)" }}>
            <span className="text-secondary/10 font-mono text-[8px] uppercase">IX.CORE</span>
          </div>
        </div>
      </div>

      {/* Foreground Typography */}
      <div 
        ref={contentRef}
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center mt-32 mix-blend-difference"
      >
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-primary" />
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-primary opacity-80">
             Protocol 03 / Web3 Immutable Layer
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-8 text-foreground">
          Cryptographic <br/>
          <span className="text-muted-foreground">Custody.</span>
        </h2>

        <p className="text-lg md:text-xl md:leading-relaxed text-muted-foreground/80 max-w-2xl mx-auto font-medium">
          Powering the <span className="text-primary tracking-widest uppercase font-mono text-sm mx-1">Ixcore</span> ecosystem. Immutable infrastructure designed explicitly for the preservation, forensics, and mobilization of sovereign digital wealth.
        </p>

        <div className="mt-16 flex gap-12 font-mono text-xs text-muted-foreground/60 uppercase tracking-widest border-t border-border/20 pt-8 w-full justify-center">
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full" /> ZK-Rollups</span>
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full" /> HSM Encrypted</span>
            <span className="flex items-center gap-2 md:flex hidden"><div className="w-1 h-1 bg-primary rounded-full" /> Forensics Ready</span>
        </div>
      </div>
    </section>
  );
}
