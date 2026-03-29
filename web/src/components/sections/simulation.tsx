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
    title: "Purple Waifuverse",
    subtitle: "Dimensional Glitch-Pop",
    color: "from-purple-600 to-fuchsia-600",
    tags: ["0x01", "SENTIENT AI", "VOLUMETRIC RENDERING"],
    desc: "A surreal, hyper-aesthetic pocket simulation merging autonomous agents with high-fidelity anime subcultures.",
  },
  {
    title: "Galaxy Game",
    subtitle: "Interstellar Scale Web3",
    color: "from-blue-600 to-indigo-900",
    tags: ["0x02", "PROCEDURAL GEN", "ON-CHAIN DYNAMICS"],
    desc: "A sprawling cosmic frontier. Mapping and staking star systems in a procedurally generated deep-space economy.",
  },
  {
    title: "Project Zero",
    subtitle: "Unannounced Architecture",
    color: "from-zinc-800 to-black",
    tags: ["0xFF", "CLASSIFIED", "TBD"],
    desc: "An experimental rendering pipeline. Heavy computation dedicated to physical simulations and cyber-forensic analysis.",
  },
];

export function Simulation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const scrollWidth = scrollContainerRef.current?.scrollWidth || 0;
    const windowWidth = window.innerWidth;
    
    // We scroll the container to the left by the amount it overflows the window
    gsap.to(scrollContainerRef.current, {
      x: - (scrollWidth - windowWidth),
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top", // When top of section hits top of viewport
        end: () => `+=${scrollWidth}`, // Scroll distance equals total width
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-transparent flex flex-col justify-between">
      {/* Heavy typographic entry point text static on the top left */}
      <div className="absolute top-12 md:top-24 left-4 md:left-[10vw] z-20 pointer-events-none mix-blend-difference max-w-[80vw]">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-foreground mb-4 leading-none">
          Simulating <br/>
          <span className="text-muted-foreground/50">Realities.</span>
        </h2>
        <p className="max-w-xl text-muted-foreground font-medium text-sm md:text-base leading-relaxed mix-blend-normal hidden md:block">
          From the glitch-pop dimensions of the Purple Waifuverse to expansive interstellar frontiers. We don't just build games; we engineer localized universes.
        </p>
      </div>

      {/* The horizontal track */}
      <div 
        ref={scrollContainerRef}
        className="flex h-full items-end pb-12 md:pb-24 px-4 md:px-[10vw] gap-8 md:gap-24 w-max"
      >
        {projects.map((project, i) => (
          <div 
            key={i}
            className="group relative w-[80vw] md:w-[60vw] max-w-[800px] h-[50vh] min-h-[400px] rounded-2xl overflow-hidden cursor-crosshair transform-gpu perspective-1000"
          >
            {/* Base gradient background representing the game */}
            <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 transition-opacity duration-700 group-hover:opacity-40`} />
            
            {/* Noise/Glitch layer */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl border border-white/10 group-hover:bg-black/40 transition-all duration-500" />
            
            {/* Glitch Aberration Efffect - Uses CSS drop shadows to simulate chromatic shifts on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-screen shadow-[inset_0_0_100px_rgba(255,0,255,0.2)]" />

            <div className="relative h-full flex flex-col justify-between p-8 md:p-12 z-10 transition-transform duration-700 group-hover:-translate-y-2 group-hover:translate-x-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 group-hover:drop-shadow-[2px_0_0_rgba(255,0,0,0.8)] transition-all duration-300">
                    {project.title}
                  </h3>
                  <span className="font-mono text-sm tracking-widest text-white/50 uppercase group-hover:drop-shadow-[-2px_0_0_rgba(0,255,255,0.8)] transition-all duration-300">
                    {project.subtitle}
                  </span>
                </div>
                <div className="hidden md:flex gap-2">
                  {project.tags.map(t => (
                    <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono tracking-widest text-white/70">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-end">
                <p className="max-w-sm text-white/60 text-lg leading-relaxed font-medium">
                  {project.desc}
                </p>
                
                {/* Arrow CTA */}
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover:bg-white group-hover:text-black transition-colors duration-500 backdrop-blur-md">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Chromatic Hover Border */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
          </div>
        ))}

        {/* Padding equivalent element for smooth exit scroll */}
        <div className="w-[10vw] flex-shrink-0 opacity-0" />
      </div>
    </section>
  );
}
