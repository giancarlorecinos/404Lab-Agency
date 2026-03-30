"use client";

import { motion } from "framer-motion";

export function Hero() {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const triggerSequence = () => {
    // 1. Play glitch sound via Web Audio API (identical to Header)
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
    } catch(e) {}

    // 2. Dispatch Custom Event for the GlobalBackground Canvas Glitch
    window.dispatchEvent(new CustomEvent('trigger-rain-glitch'));

    // 3. Smooth scroll to contact form
    setTimeout(() => {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent text-foreground px-4 md:px-8">
      {/* Global Background Handles This */}
      
      <motion.div
        className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex gap-2 items-center">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
            System Online 01::404
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter"
        >
          Architecting the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground/30">
            Unseen.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          <span className="font-semibold text-foreground">404Lab</span> is an
          elite digital collective bridging the gap between Surreal Design,
          Autonomous AI Agents, and Cryptographic Infrastructure.
        </motion.p>

        <motion.div variants={itemVariants} className="pt-8 flex flex-col items-center gap-5">
          <motion.button
            onClick={triggerSequence}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(138, 43, 226, 0.7)" }}
            animate={{ boxShadow: ["0 0 0px rgba(138,43,226,0)", "0 0 18px rgba(138,43,226,0.4)", "0 0 0px rgba(138,43,226,0)"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="px-10 py-5 flex items-center justify-center rounded-full border border-border/50 bg-[#0A0A0B]/50 text-[#E2E2E2] font-mono text-sm uppercase tracking-[0.2em] backdrop-blur-md hover:bg-[#8A2BE2] hover:text-white hover:border-[#8A2BE2] transition-colors duration-300 outline-none"
          >
            Initiate Sequence
          </motion.button>
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/20 pointer-events-none select-none">
            Strategic Design Unit // Powered by Ixcore® Systems
          </span>
        </motion.div>
      </motion.div>

      {/* Decorative vertical lines / scaffolding structure */}
      <div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent pointer-events-none" />
      <div className="absolute right-8 lg:right-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent pointer-events-none" />
    </section>
  );
}
