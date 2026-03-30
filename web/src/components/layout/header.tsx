"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { AudioVisualizer } from "@/components/audio/audio-visualizer";

export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) setScrolled(true);
    else setScrolled(false);
  });

  const scrollToPhase2 = () => {
    // 1. Play glitch sound via Web Audio API
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch(e) {
      // Gracefully ignore if audio context fails
    }

    // 2. Dispatch Custom Event for the GlobalBackground Canvas Glitch
    window.dispatchEvent(new CustomEvent('trigger-rain-glitch'));

    // 3. Trigger visual flash on screen
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
      // 4. Smooth scroll programmatic approach
      document.getElementById('phase-2')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  if (!isMounted) {
    // Exact static placeholder matching what the server renders natively
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent border-transparent">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-[#E2E2E2] grid place-items-center overflow-hidden relative">
               <div className="w-2/3 h-2/3 bg-[#0A0A0B] transform rotate-45 scale-75" />
            </div>
            <span className="font-sans font-black tracking-tight text-xl text-[#E2E2E2]">
              404Lab<span className="text-[#8A2BE2]">.</span>
            </span>
          </div>
        </div>
      </header>
    );
  }

  const links = [
    { name: "Home", href: "/" },
    { name: "Labs", href: "/labs" },
    { name: "Experience", href: "/experience" },
  ];

  return (
    <>
      {/* Glitch Flash Layer */}
      {isFlashing && (
        <div className="fixed inset-0 z-[100] bg-[#8A2BE2] mix-blend-screen opacity-75 pointer-events-none" />
      )}

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled 
            ? "bg-[#0A0A0B]/70 backdrop-blur-xl border-b border-[#E2E2E2]/10" 
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Left Side: Identity */}
          <Link href="/" className="flex items-center gap-2 group outline-none">
            <div className="w-6 h-6 rounded-sm bg-[#E2E2E2] group-hover:bg-[#8A2BE2] transition-colors duration-300 grid place-items-center overflow-hidden relative">
               {/* Simple geometric logo representation */}
               <div className="w-2/3 h-2/3 bg-[#0A0A0B] transform rotate-45 scale-75 group-hover:scale-100 transition-transform duration-500" />
            </div>
            <span className="font-sans font-black tracking-tight text-xl text-[#E2E2E2]">
              404Lab<span className="text-[#8A2BE2]">.</span>
            </span>
          </Link>

          {/* Right Side: Navigation & CTA */}
          <nav className="flex items-center gap-8">
            <ul className="hidden md:flex items-center gap-8">
              {links.map((link, i) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    className="relative text-sm text-[#E2E2E2]/70 hover:text-[#E2E2E2] font-mono tracking-widest uppercase transition-colors group outline-none"
                  >
                    <span className="flex items-center gap-1.5">
                      {link.name}
                      {link.name === "Experience" && <AudioVisualizer />}
                    </span>
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#8A2BE2] scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300" />
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            >
              <motion.button 
                onClick={scrollToPhase2}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(138, 43, 226, 0.6)" }}
                className="hidden md:flex items-center justify-center px-6 py-2.5 rounded-sm bg-[#0A0A0B] border border-[#E2E2E2]/20 text-[#E2E2E2] font-mono text-xs uppercase tracking-[0.2em] hover:bg-[#8A2BE2] hover:text-white hover:border-[#8A2BE2] transition-colors duration-300 outline-none"
              >
                INITIATE PROTOCOL
              </motion.button>
            </motion.div>

            {/* Mobile Menu Icon */}
            <button className="md:hidden flex flex-col items-end gap-1.5 p-2 outline-none group">
              <span className="block w-6 h-[2px] bg-[#E2E2E2] group-hover:bg-[#8A2BE2] transition-colors" />
              <span className="block w-4 h-[2px] bg-[#E2E2E2] group-hover:bg-[#8A2BE2] transition-colors" />
            </button>
          </nav>
        </div>
      </motion.header>
    </>
  );
}
