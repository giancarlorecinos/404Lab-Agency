"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const projects = [
  {
    id: "purple-verse",
    title: "Purple Verse",
    subtitle: "High-Fidelity Digital Ecosystem",
    color: "from-purple-600 to-fuchsia-600",
    glowRgb: "168, 85, 247",
    glowIntensity: "0.35",
    tags: ["0x01", "SENTIENT AI", "VOLUMETRIC RENDERING"],
    desc: "A high-fidelity digital ecosystem and surrealist reality experiment. Exploring the boundaries of perception through immersive web architecture.",
    featured: true,
  },
  {
    id: "galaxy-game",
    title: "Galaxy Game",
    subtitle: "Interstellar Scale Web3",
    color: "from-blue-600 to-indigo-900",
    glowRgb: "99, 102, 241",
    glowIntensity: "0.25",
    tags: ["0x02", "PROCEDURAL GEN", "ON-CHAIN DYNAMICS"],
    desc: "A sprawling cosmic frontier. Mapping and staking star systems in a procedurally generated deep-space economy.",
    featured: false,
  },
  {
    id: "project-zero",
    title: "Project Zero",
    subtitle: "Unannounced Architecture",
    color: "from-zinc-800 to-black",
    glowRgb: "161, 161, 170",
    glowIntensity: "0.15",
    tags: ["0xFF", "CLASSIFIED", "TBD"],
    desc: "An experimental rendering pipeline. Heavy computation dedicated to physical simulations and cyber-forensic analysis.",
    featured: false,
  },
  {
    id: "ixcore",
    title: "Ixcore Innovation",
    subtitle: "The Sovereign Nexus",
    color: "from-violet-900 via-purple-900 to-indigo-950",
    glowRgb: "109, 40, 217",
    glowIntensity: "0.65",
    tags: ["0x04", "NEURAL FRAMEWORK", "DIGITAL SOVEREIGNTY"],
    desc: "The Sovereign Nexus. Engineering high-availability digital fortresses and autonomous neural frameworks. We build the invisible layers that sustain modern digital sovereignty.",
    featured: true,
  },
];

function CoreIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 group-hover:opacity-100 transition-opacity duration-300">
      {/* Outer hexagon */}
      <polygon
        points="20,2 35,10.5 35,29.5 20,38 5,29.5 5,10.5"
        stroke="rgba(167,139,250,0.6)"
        strokeWidth="1"
        fill="none"
      />
      {/* Inner hexagon */}
      <polygon
        points="20,9 29,14 29,26 20,31 11,26 11,14"
        stroke="rgba(167,139,250,0.4)"
        strokeWidth="0.75"
        fill="rgba(109,40,217,0.15)"
      />
      {/* Core center dot */}
      <circle cx="20" cy="20" r="3" fill="rgba(167,139,250,0.9)" className="animate-pulse" />
      {/* Circuit lines */}
      <line x1="20" y1="9"  x2="20" y2="14" stroke="rgba(167,139,250,0.5)" strokeWidth="0.75" />
      <line x1="20" y1="26" x2="20" y2="31" stroke="rgba(167,139,250,0.5)" strokeWidth="0.75" />
      <line x1="29" y1="14" x2="29" y2="10.5" stroke="rgba(167,139,250,0.5)" strokeWidth="0.75" />
      <line x1="11" y1="14" x2="5"  y2="10.5" stroke="rgba(167,139,250,0.5)" strokeWidth="0.75" />
    </svg>
  );
}

export function Simulation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gridRef.current?.querySelectorAll(".sim-card");
    if (!cards) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      id="phase-2"
      ref={sectionRef}
      className="relative py-24 md:py-36 bg-transparent overflow-hidden"
    >
      {/* Section header */}
      <div className="px-4 md:px-[10vw] mb-14 pointer-events-none">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-foreground mb-4 leading-none mix-blend-difference">
          Simulating <br />
          <span className="text-muted-foreground/50">Realities.</span>
        </h2>
        <p className="max-w-xl text-muted-foreground font-medium text-sm md:text-base leading-relaxed hidden md:block">
          From the surrealist architecture of Purple Verse to the sovereign infrastructure of Ixcore. We don&apos;t just build products — we engineer localized realities.
        </p>
      </div>

      {/* Bento Grid */}
      <div
        ref={gridRef}
        className="px-4 md:px-[10vw] grid grid-cols-1 md:grid-cols-3 auto-rows-[380px] gap-5"
      >
        {projects.map((project, i) => {
          const isIxcore = project.id === "ixcore";
          const colSpan = project.featured ? "md:col-span-2" : "md:col-span-1";

          return (
            <div
              key={project.id}
              className={`sim-card group relative rounded-2xl overflow-hidden cursor-crosshair transform-gpu ${colSpan}`}
              style={{
                boxShadow: `0 0 0 1px rgba(255,255,255,0.06)`,
              }}
            >
              {/* Base gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 transition-opacity duration-700 group-hover:opacity-40`}
              />

              {/* Glass layer */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xl border border-white/8 group-hover:bg-black/40 transition-all duration-500" />

              {/* Ixcore: deep violet core-glow pulse */}
              {isIxcore && (
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(ellipse at 60% 50%, rgba(${project.glowRgb}, 0.25) 0%, transparent 70%)`,
                    }}
                  />
                  {/* Industrial scan-line overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(167,139,250,0.8) 2px, rgba(167,139,250,0.8) 3px)`,
                    }}
                  />
                </div>
              )}

              {/* Chromatic aberration bloom */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-screen"
                style={{
                  boxShadow: `inset 0 0 ${isIxcore ? "120px" : "80px"} rgba(${project.glowRgb}, ${project.glowIntensity})`,
                }}
              />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-8 md:p-10 z-10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">
                <div className="flex justify-between items-start">
                  <div>
                    {/* Index tag */}
                    <span className="font-mono text-[10px] tracking-[0.25em] text-white/30 uppercase mb-3 block">
                      {project.tags[0]}
                    </span>
                    <h3
                      className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 transition-all duration-300"
                      style={{
                        filter: "drop-shadow(0 0 0px transparent)",
                      }}
                    >
                      <span className="group-hover:drop-shadow-[2px_0_0_rgba(255,0,80,0.7)] transition-all duration-300 inline-block">
                        {project.title}
                      </span>
                    </h3>
                    <span className="font-mono text-xs tracking-widest text-white/45 uppercase group-hover:drop-shadow-[-2px_0_0_rgba(0,255,255,0.7)] transition-all duration-300">
                      {project.subtitle}
                    </span>
                  </div>

                  {/* Core icon for Ixcore, tag pills for others */}
                  <div className="flex flex-col items-end gap-3">
                    {isIxcore ? (
                      <CoreIcon />
                    ) : (
                      <div className="hidden md:flex flex-wrap gap-2 justify-end">
                        {project.tags.slice(1).map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono tracking-widest text-white/60"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-end gap-6">
                  <p
                    className={`text-white/55 leading-relaxed font-medium transition-colors duration-500 group-hover:text-white/75 ${
                      project.featured ? "max-w-lg text-base md:text-lg" : "max-w-xs text-sm md:text-base"
                    }`}
                  >
                    {project.desc}
                  </p>

                  {/* Ixcore: tag pills at bottom */}
                  {isIxcore && (
                    <div className="hidden md:flex flex-col gap-1.5 items-end flex-shrink-0">
                      {project.tags.slice(1).map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 bg-violet-950/60 border border-violet-500/20 rounded-full text-[10px] font-mono tracking-widest text-violet-300/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Arrow CTA */}
                  <div
                    className={`flex-shrink-0 w-14 h-14 rounded-full border flex items-center justify-center backdrop-blur-md transition-all duration-500 ${
                      isIxcore
                        ? "border-violet-500/30 bg-violet-950/40 group-hover:bg-violet-400 group-hover:border-violet-400 group-hover:text-black group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(109,40,217,0.8)]"
                        : "border-white/20 bg-white/5 group-hover:bg-white group-hover:text-black group-hover:scale-105"
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom chromatic border */}
              <div
                className={`absolute inset-x-0 bottom-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out bg-gradient-to-r from-transparent to-transparent ${
                  isIxcore ? "via-violet-400/80" : "via-white/50"
                }`}
              />

              {/* Ixcore: left edge power-line accent */}
              {isIxcore && (
                <div className="absolute inset-y-0 left-0 w-px scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-out origin-top bg-gradient-to-b from-violet-400/80 via-violet-600/40 to-transparent" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
