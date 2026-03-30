"use client";

import { useRef, useState, useEffect } from "react";
import { motion, type TargetAndTransition } from "framer-motion";
import { NeuralCursor } from "@/components/canvas/neural-cursor";

// ─── Shared animation variants ────────────────────────────────────────────────

const blurUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  visible: (i: number): TargetAndTransition => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.13,
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const LAYERS = [
  { id: "visual-sovereignty",  label: "Visual Sovereignty",   index: "01" },
  { id: "neural-integration",  label: "Neural Integration",   index: "02" },
  { id: "cryptographic-trust", label: "Cryptographic Trust",  index: "03" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function NeuralNetworkSVG() {
  const nodes = [
    { x: 60,  y: 200 },
    { x: 160, y: 90  },
    { x: 160, y: 310 },
    { x: 290, y: 40  },
    { x: 290, y: 195 },
    { x: 290, y: 355 },
    { x: 400, y: 140 },
    { x: 400, y: 280 },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,6],[4,6],[4,7],[5,7]];

  return (
    <svg
      width="460" height="400" viewBox="0 0 460 400"
      className="w-full max-w-[420px] opacity-80"
    >
      {/* Edges */}
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="rgba(99,102,241,0.35)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}
        />
      ))}
      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <motion.circle
            cx={n.x} cy={n.y} r={i === 0 ? 14 : 8}
            fill="rgba(99,102,241,0.15)"
            stroke="rgba(99,102,241,0.6)"
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: 0.3 + i * 0.07, duration: 0.5, type: "spring", stiffness: 160 }}
          />
          <motion.circle
            cx={n.x} cy={n.y} r={i === 0 ? 5 : 3}
            fill="rgba(129,140,248,0.9)"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: 0.5 + i * 0.07, duration: 0.4 }}
          />
        </g>
      ))}
      {/* Animated pulse on input node */}
      <motion.circle
        cx={nodes[0].x} cy={nodes[0].y} r={20}
        fill="none"
        stroke="rgba(99,102,241,0.3)"
        strokeWidth="1"
        animate={{ r: [14, 26, 14], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
      />
    </svg>
  );
}

function HexGridBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" className="opacity-[0.035]">
        <defs>
          <pattern id="hex-pat" x="0" y="0" width="70" height="60.6" patternUnits="userSpaceOnUse">
            <polygon
              points="35,1 68,18.3 68,52.3 35,69.6 2,52.3 2,18.3"
              fill="none"
              stroke="rgb(139,92,246)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-pat)" />
      </svg>
    </div>
  );
}

function IxcoreVisual() {
  return (
    <div className="relative flex items-center justify-center w-72 h-72">
      {/* Pulse ring */}
      <motion.div
        className="absolute w-60 h-60 rounded-full border border-violet-500/15"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      />

      <svg width="220" height="220" viewBox="0 0 220 220" className="relative z-10">
        {/* Outer hex */}
        <motion.path
          d="M110,12 L192,57 L192,163 L110,208 L28,163 L28,57 Z"
          fill="none"
          stroke="rgba(139,92,246,0.45)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
        {/* Inner hex */}
        <motion.path
          d="M110,38 L166,70 L166,150 L110,182 L54,150 L54,70 Z"
          fill="rgba(109,40,217,0.12)"
          stroke="rgba(139,92,246,0.25)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
        {/* Circuit spokes */}
        {[
          [110, 12, 110, 38],
          [110, 182, 110, 208],
          [192, 57, 166, 70],
          [28, 57, 54, 70],
          [192, 163, 166, 150],
          [28, 163, 54, 150],
        ].map(([x1, y1, x2, y2], i) => (
          <motion.line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(167,139,250,0.5)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ delay: 0.8 + i * 0.06, duration: 0.4 }}
          />
        ))}
        {/* Core ring */}
        <motion.circle
          cx="110" cy="110" r="24"
          fill="rgba(109,40,217,0.2)"
          stroke="rgba(139,92,246,0.6)"
          strokeWidth="1.5"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ delay: 1, type: "spring", stiffness: 120 }}
        />
        {/* Core dot */}
        <motion.circle
          cx="110" cy="110" r="7"
          fill="rgba(167,139,250,1)"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        />
        {/* Pulse on core */}
        <motion.circle
          cx="110" cy="110" r="7"
          fill="none"
          stroke="rgba(167,139,250,0.6)"
          strokeWidth="1"
          animate={{ r: [7, 22, 7], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      </svg>

      <span className="absolute bottom-0 font-mono text-[9px] tracking-[0.5em] text-violet-300/40 uppercase">
        Ixcore® Systems
      </span>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ExperiencePage() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = sectionRefs.current.findIndex((el) => el === e.target);
            if (i !== -1) setActive(i);
          }
        });
      },
      { root: container, threshold: 0.55 }
    );

    sectionRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) =>
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <NeuralCursor />

      {/* ── Snap-scroll container ─────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="fixed inset-0 top-20 overflow-y-scroll cursor-none"
        style={{ scrollSnapType: "y mandatory", scrollBehavior: "smooth" }}
      >

        {/* ════════════════════════════════════════════════════════════
            LAYER 01 — Visual Sovereignty
        ════════════════════════════════════════════════════════════ */}
        <section
          ref={(el) => { sectionRefs.current[0] = el; }}
          className="relative h-screen flex items-center overflow-hidden"
          style={{ scrollSnapAlign: "start" }}
        >
          {/* Atmospheric fuchsia tint */}
          <div className="absolute inset-0 pointer-events-none">
            <div style={{ background: "radial-gradient(ellipse at 25% 50%, rgba(217,70,239,0.09) 0%, transparent 60%)" }} className="absolute inset-0" />
            <div style={{ background: "radial-gradient(ellipse at 80% 25%, rgba(168,85,247,0.06) 0%, transparent 55%)" }} className="absolute inset-0" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-[8vw] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Text block */}
            <div className="space-y-7">
              <motion.span
                custom={0} variants={blurUp}
                initial="hidden" whileInView="visible"
                viewport={{ once: false, amount: 0.5, root: containerRef }}
                className="font-mono text-[9px] tracking-[0.55em] text-fuchsia-400/55 uppercase block"
              >
                Layer 01 // Visual Sovereignty
              </motion.span>

              <div className="space-y-2">
                <motion.h1
                  custom={1} variants={blurUp}
                  initial="hidden" whileInView="visible"
                  viewport={{ once: false, amount: 0.5, root: containerRef }}
                  className="text-5xl md:text-[5.5rem] font-black tracking-tighter text-white leading-[0.9]"
                >
                  We Don&apos;t Design
                </motion.h1>
                <motion.h1
                  custom={2} variants={blurUp}
                  initial="hidden" whileInView="visible"
                  viewport={{ once: false, amount: 0.5, root: containerRef }}
                  className="text-5xl md:text-[5.5rem] font-black tracking-tighter leading-[0.9]"
                  style={{
                    background: "linear-gradient(135deg, #e879f9 0%, #a855f7 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Interfaces.
                </motion.h1>
                <motion.h2
                  custom={3} variants={blurUp}
                  initial="hidden" whileInView="visible"
                  viewport={{ once: false, amount: 0.5, root: containerRef }}
                  className="text-4xl md:text-6xl font-black tracking-tighter text-white/25 leading-[0.9]"
                >
                  We Design Worlds.
                </motion.h2>
              </div>

              <motion.p
                custom={4} variants={blurUp}
                initial="hidden" whileInView="visible"
                viewport={{ once: false, amount: 0.5, root: containerRef }}
                className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed"
              >
                Every pixel is deliberate. Every interaction is choreographed. We treat digital surfaces as canvases for surrealist experiences that dissolve the boundary between software and sensation.
              </motion.p>

              <motion.div
                custom={5} variants={blurUp}
                initial="hidden" whileInView="visible"
                viewport={{ once: false, amount: 0.5, root: containerRef }}
                className="flex gap-10 pt-2"
              >
                {[
                  { val: "12+",  label: "Bespoke Interfaces" },
                  { val: "∞",    label: "Dimensional Depth" },
                  { val: "100%", label: "Custom-Crafted" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl font-black text-fuchsia-400" style={{ textShadow: "0 0 20px rgba(217,70,239,0.5)" }}>
                      {s.val}
                    </p>
                    <p className="font-mono text-[9px] tracking-[0.3em] text-white/35 uppercase mt-1">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Surrealist orb */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75, rotate: -8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.4, root: containerRef }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-80 h-80">
                {/* Outer ring */}
                <div
                  className="absolute inset-0 rounded-full border border-fuchsia-500/20"
                  style={{ boxShadow: "0 0 80px rgba(217,70,239,0.12), inset 0 0 60px rgba(217,70,239,0.06)" }}
                />
                {/* Rotating mid ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, ease: "linear", repeat: Infinity }}
                  className="absolute inset-8 rounded-full border border-violet-500/20"
                />
                {/* Counter-rotating inner ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 16, ease: "linear", repeat: Infinity }}
                  className="absolute inset-16 rounded-full"
                  style={{
                    border: "1px dashed rgba(168,85,247,0.25)",
                  }}
                />
                {/* Core sphere */}
                <div
                  className="absolute inset-24 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, rgba(217,70,239,0.35), rgba(109,40,217,0.12) 60%, transparent)",
                    boxShadow: "0 0 50px rgba(217,70,239,0.25)",
                    border: "1px solid rgba(217,70,239,0.2)",
                    backdropFilter: "blur(4px)",
                  }}
                />
                {/* Center pulse */}
                <div
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-fuchsia-400 -translate-x-1/2 -translate-y-1/2"
                  style={{ boxShadow: "0 0 24px rgba(217,70,239,1)" }}
                />
                {/* Orbital particles */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <motion.div
                    key={deg}
                    className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-fuchsia-500/70"
                    style={{
                      transform: `rotate(${deg}deg) translateX(118px) translate(-50%, -50%)`,
                      boxShadow: "0 0 8px rgba(217,70,239,0.7)",
                    }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2 + deg / 90, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Ghost index */}
          <p className="absolute top-6 right-8 font-mono font-black text-[100px] leading-none text-white/[0.03] pointer-events-none select-none">01</p>
          {/* Scroll hint */}
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <div className="w-px h-8 bg-gradient-to-b from-fuchsia-400/40 to-transparent" />
            <span className="font-mono text-[8px] tracking-[0.5em] text-white/20 uppercase">Scroll</span>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            LAYER 02 — Neural Integration
        ════════════════════════════════════════════════════════════ */}
        <section
          ref={(el) => { sectionRefs.current[1] = el; }}
          className="relative h-screen flex items-center overflow-hidden"
          style={{ scrollSnapAlign: "start" }}
        >
          {/* Blue tint */}
          <div className="absolute inset-0 pointer-events-none">
            <div style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(59,130,246,0.08) 0%, transparent 60%)" }} className="absolute inset-0" />
            <div style={{ background: "radial-gradient(ellipse at 15% 70%, rgba(99,102,241,0.06) 0%, transparent 55%)" }} className="absolute inset-0" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-[8vw] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Neural SVG — left on desktop */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.4, root: containerRef }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex items-center justify-center"
            >
              <NeuralNetworkSVG />
            </motion.div>

            {/* Text block — right */}
            <div className="space-y-7">
              <motion.span
                custom={0} variants={blurUp}
                initial="hidden" whileInView="visible"
                viewport={{ once: false, amount: 0.5, root: containerRef }}
                className="font-mono text-[9px] tracking-[0.55em] text-blue-400/55 uppercase block"
              >
                Layer 02 // Neural Integration
              </motion.span>

              <div className="space-y-2">
                <motion.h2
                  custom={1} variants={blurUp}
                  initial="hidden" whileInView="visible"
                  viewport={{ once: false, amount: 0.5, root: containerRef }}
                  className="text-5xl md:text-[5.5rem] font-black tracking-tighter text-white leading-[0.9]"
                >
                  Autonomous
                </motion.h2>
                <motion.h2
                  custom={2} variants={blurUp}
                  initial="hidden" whileInView="visible"
                  viewport={{ once: false, amount: 0.5, root: containerRef }}
                  className="text-5xl md:text-[5.5rem] font-black tracking-tighter leading-[0.9]"
                  style={{
                    background: "linear-gradient(135deg, #60a5fa 0%, #818cf8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Systems.
                </motion.h2>
                <motion.h3
                  custom={3} variants={blurUp}
                  initial="hidden" whileInView="visible"
                  viewport={{ once: false, amount: 0.5, root: containerRef }}
                  className="text-4xl md:text-5xl font-black tracking-tighter text-white/25 leading-[0.9]"
                >
                  Infinite Cognition.
                </motion.h3>
              </div>

              <motion.p
                custom={4} variants={blurUp}
                initial="hidden" whileInView="visible"
                viewport={{ once: false, amount: 0.5, root: containerRef }}
                className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed"
              >
                We build AI agents that think, adapt, and operate at machine speed. From autonomous workflows to real-time generative interfaces — intelligence woven into the product layer itself.
              </motion.p>

              <motion.div
                custom={5} variants={blurUp}
                initial="hidden" whileInView="visible"
                viewport={{ once: false, amount: 0.5, root: containerRef }}
                className="grid grid-cols-2 gap-x-8 gap-y-3 pt-2 max-w-sm"
              >
                {[
                  "Real-Time AI Agents",
                  "Procedural Architecture",
                  "Generative Interfaces",
                  "Adaptive Systems",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2">
                    <div
                      className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0"
                      style={{ boxShadow: "0 0 6px rgba(96,165,250,0.9)" }}
                    />
                    <span className="font-mono text-[10px] text-white/45 uppercase tracking-wider">{feat}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          <p className="absolute top-6 right-8 font-mono font-black text-[100px] leading-none text-white/[0.03] pointer-events-none select-none">02</p>
        </section>

        {/* ════════════════════════════════════════════════════════════
            LAYER 03 — Cryptographic Trust
        ════════════════════════════════════════════════════════════ */}
        <section
          ref={(el) => { sectionRefs.current[2] = el; }}
          className="relative h-screen flex items-center overflow-hidden"
          style={{ scrollSnapAlign: "start" }}
        >
          {/* Hex grid background */}
          <HexGridBg />

          {/* Violet tint */}
          <div className="absolute inset-0 pointer-events-none">
            <div style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(109,40,217,0.13) 0%, transparent 65%)" }} className="absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/25 to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-[8vw] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Text block */}
            <div className="space-y-7">
              <motion.span
                custom={0} variants={blurUp}
                initial="hidden" whileInView="visible"
                viewport={{ once: false, amount: 0.5, root: containerRef }}
                className="font-mono text-[9px] tracking-[0.55em] text-violet-400/55 uppercase block"
              >
                Layer 03 // Cryptographic Trust
              </motion.span>

              <div className="space-y-2">
                <motion.h2
                  custom={1} variants={blurUp}
                  initial="hidden" whileInView="visible"
                  viewport={{ once: false, amount: 0.5, root: containerRef }}
                  className="text-5xl md:text-[5.5rem] font-black tracking-tighter text-white leading-[0.9]"
                >
                  The Sovereign
                </motion.h2>
                <motion.h2
                  custom={2} variants={blurUp}
                  initial="hidden" whileInView="visible"
                  viewport={{ once: false, amount: 0.5, root: containerRef }}
                  className="text-5xl md:text-[5.5rem] font-black tracking-tighter leading-[0.9]"
                  style={{
                    background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Nexus.
                </motion.h2>
              </div>

              {/* Ixcore badge */}
              <motion.div
                custom={3} variants={blurUp}
                initial="hidden" whileInView="visible"
                viewport={{ once: false, amount: 0.5, root: containerRef }}
                className="inline-flex items-center gap-3 px-4 py-2 border border-violet-500/25 bg-violet-950/30"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <div
                  className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"
                  style={{ boxShadow: "0 0 8px rgba(167,139,250,0.9)" }}
                />
                <span className="font-mono text-[10px] tracking-[0.35em] text-white/50 uppercase">Powered by</span>
                <span className="font-mono text-xs tracking-[0.3em] text-violet-300 font-bold">IXCORE® SYSTEMS</span>
              </motion.div>

              <motion.p
                custom={4} variants={blurUp}
                initial="hidden" whileInView="visible"
                viewport={{ once: false, amount: 0.5, root: containerRef }}
                className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed"
              >
                Security is the foundation, not a feature. Every project is built on Ixcore&apos;s high-availability framework — cryptographic integrity, autonomous resilience, and digital sovereignty by default.
              </motion.p>

              {/* Trust metrics */}
              <motion.div
                custom={5} variants={blurUp}
                initial="hidden" whileInView="visible"
                viewport={{ once: false, amount: 0.5, root: containerRef }}
                className="flex flex-col gap-0 pt-1 max-w-sm"
              >
                {[
                  { label: "Cryptographic Integrity", val: "AES-256 // End-to-End" },
                  { label: "High Availability",        val: "99.99% Uptime SLA" },
                  { label: "Autonomous Resilience",    val: "Self-Healing Architecture" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center py-3 border-b border-violet-500/10"
                  >
                    <span className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">{row.label}</span>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-violet-300/65">{row.val}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Ixcore visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.4, root: containerRef }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex items-center justify-center"
            >
              <IxcoreVisual />
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5, root: containerRef }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <a
              href="/#phase-2"
              className="group relative px-9 py-3 font-mono text-sm tracking-[0.35em] uppercase text-violet-300 border border-violet-500/30 transition-all duration-300 hover:border-violet-400/70 hover:text-violet-200"
              style={{ backdropFilter: "blur(4px)" }}
            >
              <span className="relative z-10">Initiate Contact</span>
              <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/8 transition-colors duration-300" />
            </a>
            <span className="font-mono text-[8px] tracking-[0.5em] text-white/15 uppercase">
              Strategic Design Unit // 404Lab.Agency
            </span>
          </motion.div>

          <p className="absolute top-6 right-8 font-mono font-black text-[100px] leading-none text-white/[0.03] pointer-events-none select-none">03</p>
        </section>
      </div>

      {/* ── Right-side layer nav dots ─────────────────────────────────── */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {LAYERS.map((layer, i) => (
          <button
            key={layer.id}
            onClick={() => goTo(i)}
            className="group flex items-center gap-3 cursor-pointer outline-none"
            aria-label={`Go to ${layer.label}`}
          >
            {/* Label — appears on hover or when active */}
            <span
              className="font-mono text-[8px] tracking-[0.3em] uppercase transition-all duration-300 hidden md:block"
              style={{
                color: active === i ? "rgba(167,139,250,0.8)" : "rgba(255,255,255,0.2)",
                opacity: active === i ? 1 : 0,
              }}
            >
              {layer.label}
            </span>
            {/* Dot */}
            <div
              className="rounded-full transition-all duration-300"
              style={{
                width:      active === i ? 8 : 5,
                height:     active === i ? 8 : 5,
                background: active === i ? "rgb(167,139,250)" : "rgba(255,255,255,0.2)",
                boxShadow:  active === i ? "0 0 10px rgba(167,139,250,0.9)" : "none",
              }}
            />
          </button>
        ))}
      </nav>

      {/* ── Layer label in top-left ───────────────────────────────────── */}
      <div className="fixed top-24 left-6 z-40 pointer-events-none">
        <motion.span
          key={active}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-[9px] tracking-[0.45em] text-white/20 uppercase"
        >
          {LAYERS[active].index} // {LAYERS[active].label}
        </motion.span>
      </div>
    </>
  );
}
