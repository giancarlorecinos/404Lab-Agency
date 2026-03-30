"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AudioVisualizer } from "@/components/audio/audio-visualizer";

export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const scrollToContact = () => {
    setMenuOpen(false);
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Ignore audio context failures
    }
    window.dispatchEvent(new CustomEvent("trigger-rain-glitch"));
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
      document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  if (!isMounted) {
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

          {/* Identity */}
          <Link href="/" className="flex items-center gap-2 group outline-none" onClick={() => setMenuOpen(false)}>
            <div className="w-6 h-6 rounded-sm bg-[#E2E2E2] group-hover:bg-[#8A2BE2] transition-colors duration-300 grid place-items-center overflow-hidden relative">
              <div className="w-2/3 h-2/3 bg-[#0A0A0B] transform rotate-45 scale-75 group-hover:scale-100 transition-transform duration-500" />
            </div>
            <span className="font-sans font-black tracking-tight text-xl text-[#E2E2E2]">
              404Lab<span className="text-[#8A2BE2]">.</span>
            </span>
          </Link>

          {/* Right Side */}
          <nav className="flex items-center gap-4">
            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-8">
              {links.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
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

            {/* Desktop CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            >
              <motion.button
                onClick={scrollToContact}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(138, 43, 226, 0.6)" }}
                animate={{ boxShadow: ["0 0 0px rgba(138,43,226,0)", "0 0 12px rgba(138,43,226,0.35)", "0 0 0px rgba(138,43,226,0)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="hidden md:flex items-center justify-center px-6 py-2.5 rounded-sm bg-[#0A0A0B] border border-[#E2E2E2]/20 text-[#E2E2E2] font-mono text-xs uppercase tracking-[0.2em] hover:bg-[#8A2BE2] hover:text-white hover:border-[#8A2BE2] transition-colors duration-300 outline-none"
              >
                INITIATE PROTOCOL
              </motion.button>
            </motion.div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden relative flex items-center justify-center w-11 h-11 outline-none"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {/* Top bar */}
              <motion.span
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 4 : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute block w-6 h-[2px] bg-[#E2E2E2] origin-center"
                style={{ top: "calc(50% - 4px)" }}
              />
              {/* Bottom bar — shorter at rest, full width when crossing */}
              <motion.span
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -4 : 0, width: menuOpen ? 24 : 16 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute block h-[2px] bg-[#E2E2E2] origin-center"
                style={{ top: "calc(50% + 4px)" }}
              />
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[999] flex flex-col pt-20 bg-[#0A0A0B]/96 backdrop-blur-2xl md:hidden"
          >
            {/* Violet divider under header */}
            <div className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-[#8A2BE2]/35 to-transparent" />

            {/* Nav links */}
            <nav className="flex flex-col px-8 pt-10 flex-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center justify-between w-full py-5 border-b border-[#E2E2E2]/8 outline-none"
                  >
                    <span className="font-mono text-2xl font-black tracking-tight text-[#E2E2E2]/80 group-hover:text-[#E2E2E2] transition-colors duration-200">
                      {link.name}
                      {link.name === "Experience" && (
                        <span className="ml-1.5 text-[#8A2BE2]">*</span>
                      )}
                    </span>
                    <motion.span
                      className="text-[#8A2BE2] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
              ))}

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.4 }}
                className="mt-10"
              >
                <motion.button
                  onClick={scrollToContact}
                  animate={{ boxShadow: ["0 0 0px rgba(138,43,226,0)", "0 0 20px rgba(138,43,226,0.5)", "0 0 0px rgba(138,43,226,0)"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full min-h-[52px] bg-[#8A2BE2] text-white font-mono text-sm uppercase tracking-[0.25em] rounded-sm transition-transform"
                >
                  INITIATE PROTOCOL
                </motion.button>
              </motion.div>
            </nav>

            {/* Footer label */}
            <div className="px-8 pb-10">
              <p className="font-mono text-[10px] tracking-[0.4em] text-[#E2E2E2]/18 uppercase">
                404Lab.Agency // Digital Sovereignty
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
