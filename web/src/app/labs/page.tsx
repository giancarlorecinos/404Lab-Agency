"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types & Data ──────────────────────────────────────────────────────────────

type TagStatus = "live" | "active" | "core" | "staging";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagStatus: TagStatus;
  year: string;
  index: string;
  description: string;
  stack: string[];
  href: string;
  gridClass: string;
}

const PROJECTS: Project[] = [
  {
    id: "crelosa-poc",
    title: "Crelosa POC",
    subtitle: "Push-Over-Cellular Communication",
    tag: "LIVE_DEPLOYMENT",
    tagStatus: "live",
    year: "2024",
    index: "001",
    description:
      "Next-generation Push-Over-Cellular (PoC) communication systems. Bridging traditional radio reliability with global cellular infrastructure for mission-critical operations.",
    stack: ["VoIP", "LTE", "PoC", "GPS", "WebSocket"],
    href: "#",
    gridClass: "md:col-span-2",
  },
  {
    id: "ixcore",
    title: "Ixcore Innovation",
    subtitle: "Core Technology",
    tag: "CORE_SYSTEM",
    tagStatus: "core",
    year: "2024",
    index: "002",
    description:
      "Foundational infrastructure layer powering the 404Lab ecosystem. High-availability framework with cryptographic integrity and autonomous resilience.",
    stack: ["Rust", "PostgreSQL", "Redis", "K8s", "gRPC"],
    href: "#",
    gridClass: "md:col-span-1",
  },
  {
    id: "balam-reserve",
    title: "Balam Reserve",
    subtitle: "Luxury Coffee Brand",
    tag: "LIVE",
    tagStatus: "live",
    year: "2024",
    index: "003",
    description:
      "Premium artisanal coffee brand identity and digital commerce platform. Elevated sensory experience designed for a discerning high-end market.",
    stack: ["Next.js", "Shopify", "Tailwind", "Framer"],
    href: "#",
    gridClass: "md:col-span-1",
  },
  {
    id: "purple-verse",
    title: "Purple Verse",
    subtitle: "Surrealist Digital Reality",
    tag: "ACTIVE",
    tagStatus: "active",
    year: "2024",
    index: "004",
    description:
      "Immersive surrealist digital reality. Generative art, spatial WebGL environments, and procedural interaction design at the edge of the perceivable.",
    stack: ["Three.js", "WebGL", "GSAP", "React", "GLSL"],
    href: "#",
    gridClass: "md:col-span-2",
  },
];

const TAG_CONFIG: Record<TagStatus, { dot: string; text: string; border: string; pulse: boolean }> = {
  live:    { dot: "bg-emerald-400",  text: "text-emerald-400",  border: "border-emerald-500/25", pulse: true  },
  active:  { dot: "bg-violet-400",   text: "text-violet-400",   border: "border-violet-500/30",  pulse: true  },
  core:    { dot: "bg-violet-400",   text: "text-violet-400",   border: "border-violet-500/30",  pulse: false },
  staging: { dot: "bg-amber-400/60", text: "text-amber-400/60", border: "border-amber-500/20",   pulse: false },
};

// ─── Scanning-frame visuals (unique per project) ───────────────────────────────

function CrelosaVisual() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 500 220"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Horizontal grid lines */}
      {[44, 88, 132, 176].map((y, i) => (
        <motion.line key={i}
          x1="0" y1={y} x2="500" y2={y}
          stroke="rgba(139,92,246,0.09)" strokeWidth="1"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}
      {/* Sine waves representing radio signals */}
      {[0, 1, 2, 3].map((k) => (
        <motion.path key={k}
          d={`M0,${110 + k * 16} C62,${70 + k * 16} 125,${150 + k * 16} 187,${110 + k * 16} S312,${70 + k * 16} 374,${110 + k * 16} S499,${150 + k * 16} 500,${110 + k * 16}`}
          fill="none"
          stroke="rgba(139,92,246,0.45)"
          strokeWidth={1.2 - k * 0.2}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 2 + k * 0.35, repeat: Infinity, delay: k * 0.4 }}
        />
      ))}
      {/* Concentric radio pulse rings from source point */}
      {[40, 70, 100].map((r, i) => (
        <motion.circle key={i}
          cx={80} cy={110} r={0}
          fill="none" stroke="rgba(139,92,246,0.35)" strokeWidth="1"
          animate={{ r: [0, r], opacity: [0.8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.65, ease: "easeOut" }}
        />
      ))}
      {/* Source dot */}
      <motion.circle cx={80} cy={110} r={4}
        fill="rgba(139,92,246,0.6)"
        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
    </svg>
  );
}

function IxcoreVisual() {
  const nodes = [
    { cx: 250, cy: 110 },
    { cx: 170, cy: 65  }, { cx: 330, cy: 65  },
    { cx: 120, cy: 140 }, { cx: 250, cy: 155 }, { cx: 380, cy: 140 },
    { cx: 170, cy: 178 }, { cx: 330, cy: 178 },
  ];
  const edges = [[0,1],[0,2],[0,3],[0,4],[0,5],[1,3],[2,5],[3,6],[5,7],[4,6],[4,7],[1,2]];
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 500 220"
      preserveAspectRatio="xMidYMid slice"
    >
      {edges.map(([a, b], i) => (
        <motion.line key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="rgba(139,92,246,0.28)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 2.5 + i * 0.18, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <motion.circle
            cx={n.cx} cy={n.cy} r={i === 0 ? 12 : 6}
            fill="rgba(109,40,217,0.25)"
            stroke="rgba(139,92,246,0.55)"
            strokeWidth="1"
            animate={{ scale: [1, i === 0 ? 1.3 : 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2 + i * 0.25, repeat: Infinity, delay: i * 0.18 }}
          />
          {i === 0 && (
            <motion.circle cx={n.cx} cy={n.cy} r={4}
              fill="rgba(167,139,250,0.9)"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}

function BalamVisual() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 500 220"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Topographic contours */}
      {[55, 40, 25, 12].map((rx, i) => (
        <motion.ellipse key={i}
          cx={250} cy={130} rx={rx * 2.2} ry={rx * 1.3}
          fill="none"
          stroke="rgba(217,119,6,0.18)"
          strokeWidth="0.8"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
      {/* Bean outline */}
      <motion.ellipse cx={250} cy={130} rx={90} ry={55}
        fill="none" stroke="rgba(217,119,6,0.35)" strokeWidth="1.5"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.ellipse cx={250} cy={130} rx={44} ry={55}
        fill="none" stroke="rgba(217,119,6,0.18)" strokeWidth="1"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
      />
      {/* Steam */}
      {[210, 250, 290].map((x, i) => (
        <motion.path key={i}
          d={`M${x},72 Q${x - 14},52 ${x},32 Q${x + 14},12 ${x},−8`}
          fill="none"
          stroke="rgba(217,119,6,0.25)"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ opacity: [0, 0.7, 0], y: [0, -8] }}
          transition={{ duration: 2.2 + i * 0.4, repeat: Infinity, delay: i * 0.55, ease: "easeIn" }}
        />
      ))}
    </svg>
  );
}

function PurpleVerseVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Outer ambient glow */}
      <div
        className="absolute w-56 h-56 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(217,70,239,0.07) 0%, transparent 70%)" }}
      />
      <div className="relative w-44 h-44">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(217,70,239,0.2)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity }}
        />
        {/* Mid ring */}
        <motion.div
          className="absolute inset-5 rounded-full"
          style={{ border: "1px dashed rgba(168,85,247,0.25)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 14, ease: "linear", repeat: Infinity }}
        />
        {/* Inner */}
        <motion.div
          className="absolute inset-12 rounded-full"
          style={{ background: "radial-gradient(circle at 35% 35%, rgba(217,70,239,0.3), rgba(109,40,217,0.08))", border: "1px solid rgba(217,70,239,0.18)" }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Center dot */}
        <div
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-fuchsia-400 -translate-x-1/2 -translate-y-1/2"
          style={{ boxShadow: "0 0 14px rgba(217,70,239,0.9)" }}
        />
        {/* Orbital dots */}
        {[0, 72, 144, 216, 288].map((deg) => (
          <motion.div key={deg}
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-fuchsia-500/55"
            style={{
              transform: `rotate(${deg}deg) translateX(62px) translate(-50%,-50%)`,
              boxShadow: "0 0 6px rgba(217,70,239,0.6)",
            }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: (deg / 360) * 2 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Scanning Frame ────────────────────────────────────────────────────────────

function ScanningFrame({ project }: { project: Project }) {
  return (
    <div className="relative h-52 overflow-hidden bg-[#060608]">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.07) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Per-project visual */}
      {project.id === "crelosa-poc"    && <CrelosaVisual />}
      {project.id === "ixcore"         && <IxcoreVisual />}
      {project.id === "balam-reserve"  && <BalamVisual />}
      {project.id === "purple-verse"   && <PurpleVerseVisual />}

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.4) 25%, rgba(167,139,250,0.9) 50%, rgba(139,92,246,0.4) 75%, transparent 100%)",
          boxShadow: "0 0 8px rgba(139,92,246,0.5), 0 0 2px rgba(167,139,250,0.8)",
        }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "linear", repeatDelay: 0.7 }}
      />

      {/* Corner brackets */}
      <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t border-l border-violet-500/40" />
      <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t border-r border-violet-500/40" />
      <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b border-l border-violet-500/40" />
      <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b border-r border-violet-500/40" />

      {/* Scanning label */}
      <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5">
        <motion.div
          className="w-1 h-1 rounded-full bg-violet-400"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        <span className="font-mono text-[7px] tracking-[0.55em] text-violet-400/45 uppercase">Scanning</span>
      </div>

      {/* Frame index */}
      <div className="absolute top-2.5 right-8 font-mono text-[7px] tracking-[0.4em] text-white/12 uppercase select-none">
        FRAME_{project.index}
      </div>

      {/* Bottom separator */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />
    </div>
  );
}

// ─── Project Card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: (p: Project) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const tag = TAG_CONFIG[project.tagStatus];

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      animate-border
      className={`relative flex flex-col cursor-pointer bg-[#080809] ${project.gridClass}`}
      style={{
        border: "1px solid",
        borderColor: hovered ? "rgba(139,92,246,0.32)" : "rgba(255,255,255,0.07)",
        boxShadow: hovered
          ? "0 0 40px rgba(139,92,246,0.07), 0 0 1px rgba(139,92,246,0.2)"
          : "none",
        transition: "border-color 0.35s ease, box-shadow 0.35s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(project)}
    >
      {/* Top accent bar — animates in on hover */}
      <motion.div
        className="absolute top-0 left-0 h-[1.5px] z-10 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.7) 30%, rgba(167,139,250,0.9) 50%, rgba(139,92,246,0.7) 70%, transparent)",
        }}
        animate={{ width: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Scanning frame */}
      <ScanningFrame project={project} />

      {/* Info section */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-sans font-black text-white text-lg tracking-tight leading-tight">
              {project.title}
            </h3>
            <p className="font-mono text-[8px] tracking-[0.45em] text-white/28 uppercase mt-0.5 truncate">
              {project.subtitle}
            </p>
          </div>

          {/* Status tag */}
          <div
            className={`flex-shrink-0 flex items-center gap-1.5 px-2 py-1 border ${tag.border}`}
            style={{ background: "rgba(255,255,255,0.015)" }}
          >
            <motion.div
              className={`w-1 h-1 rounded-full ${tag.dot}`}
              animate={tag.pulse ? { opacity: [1, 0.25, 1] } : { opacity: 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className={`font-mono text-[7.5px] tracking-[0.3em] uppercase ${tag.text}`}>
              {project.tag}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/38 text-[11px] leading-[1.7] font-sans flex-1">
          {project.description}
        </p>

        {/* Stack badges */}
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[8px] tracking-[0.22em] text-white/32 uppercase px-2 py-0.5"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.018)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <span className="font-mono text-[7.5px] tracking-[0.4em] text-white/18 uppercase">
            {project.year}&nbsp;//&nbsp;{project.index}
          </span>
          <motion.div
            className="flex items-center gap-1.5"
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 6 }}
            transition={{ duration: 0.22 }}
          >
            <span className="font-mono text-[8px] tracking-[0.3em] text-violet-400/70 uppercase">
              View System
            </span>
            <span className="text-violet-400/70 text-xs">→</span>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Loading Overlay ───────────────────────────────────────────────────────────

const LOG_LINES = [
  "> Establishing secure tunnel...",
  "> Verifying cryptographic signature...",
  "> Authenticating session...",
  "> Loading system data...",
];

function LoadingOverlay({
  project,
  onComplete,
}: {
  project: Project;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    LOG_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), 350 + i * 380));
    });

    timers.push(setTimeout(() => setDone(true), 350 + LOG_LINES.length * 380));
    timers.push(setTimeout(onComplete, 350 + LOG_LINES.length * 380 + 500));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const progress =
    done ? 100 : Math.round((step / LOG_LINES.length) * 88);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#040406] flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
    >
      {/* Grid bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(4,4,6,0.85) 100%)" }}
      />

      <div className="relative z-10 w-full max-w-[340px] px-6">
        {/* System label */}
        <motion.p
          className="font-mono text-[8px] tracking-[0.55em] text-violet-400/55 uppercase mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          404Lab // Accessing System
        </motion.p>

        {/* Project title */}
        <motion.h2
          className="font-black text-[2rem] text-white tracking-tight leading-tight mb-0.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {project.title}
        </motion.h2>
        <motion.p
          className="font-mono text-[8px] tracking-[0.45em] text-white/22 uppercase mb-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {project.subtitle}
        </motion.p>

        {/* Terminal log */}
        <div className="space-y-1.5 mb-7 min-h-[80px]">
          <AnimatePresence initial={false}>
            {LOG_LINES.slice(0, step).map((line, i) => (
              <motion.p
                key={i}
                className="font-mono text-[9.5px] text-white/28 leading-relaxed"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18 }}
              >
                {line}
                {i === step - 1 && !done && (
                  <motion.span
                    className="text-violet-400/60"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.65, repeat: Infinity }}
                  >
                    _
                  </motion.span>
                )}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="relative mb-2">
          <div
            className="w-full h-px"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <motion.div
              className="h-full"
              style={{
                background: "rgba(139,92,246,1)",
                boxShadow: "0 0 8px rgba(139,92,246,0.9)",
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-mono text-[7px] tracking-[0.4em] text-white/18 uppercase">
            Loading Data
          </span>
          <span className="font-mono text-[7px] tracking-[0.3em] text-violet-400/50">
            {progress}%
          </span>
        </div>

        {/* Access granted */}
        <AnimatePresence>
          {done && (
            <motion.div
              className="mt-5 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)" }} />
              <span className="font-mono text-[8px] tracking-[0.5em] text-emerald-400/75 uppercase">
                Access Granted
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LabsPage() {
  const [selected, setSelected] = useState<Project | null>(null);

  const handleComplete = useCallback(() => {
    const href = selected?.href;
    setSelected(null);
    if (href && href !== "#") window.location.href = href;
  }, [selected]);

  return (
    <>
      <AnimatePresence>
        {selected && (
          <LoadingOverlay project={selected} onComplete={handleComplete} />
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-transparent text-foreground pt-20">
        {/* ── Page header ──────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 md:px-[8vw] pt-16 pb-14">
          <motion.span
            className="font-mono text-[8.5px] tracking-[0.6em] text-violet-400/50 uppercase block mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            // Labs // System v2.0
          </motion.span>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <motion.h1
                className="text-5xl md:text-[4.5rem] lg:text-7xl font-black tracking-tighter text-white leading-[0.9]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                Experimental
              </motion.h1>
              <motion.h1
                className="text-5xl md:text-[4.5rem] lg:text-7xl font-black tracking-tighter leading-[0.9]"
                style={{
                  background: "linear-gradient(130deg, #a78bfa 0%, #7c3aed 55%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                Lab Systems.
              </motion.h1>
            </div>

            <motion.div
              className="flex flex-col items-start md:items-end gap-2 pb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="font-mono text-[8.5px] tracking-[0.4em] text-white/28 uppercase">
                  4 Active Deployments
                </span>
              </div>
              <span className="font-mono text-[7.5px] tracking-[0.4em] text-white/14 uppercase">
                404Lab Production Environment
              </span>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            className="mt-10 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(139,92,246,0.25) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
            }}
            initial={{ scaleX: 0, originX: "left" }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </section>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 md:px-[8vw] pb-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
            {PROJECTS.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onSelect={setSelected}
              />
            ))}
          </div>

          {/* Footer meta */}
          <motion.div
            className="mt-10 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="font-mono text-[7.5px] tracking-[0.45em] text-white/14 uppercase">
              Strategic Design Unit // Powered by Ixcore® Systems
            </span>
            <span className="font-mono text-[7.5px] tracking-[0.4em] text-white/14 uppercase">
              {new Date().getFullYear()} // 404Lab.Agency
            </span>
          </motion.div>
        </section>
      </main>
    </>
  );
}
