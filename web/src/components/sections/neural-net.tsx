"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const nodes = [
  { id: 1, cx: 20, cy: 30, r: 4 },
  { id: 2, cx: 80, cy: 20, r: 6 },
  { id: 3, cx: 50, cy: 60, r: 8 },
  { id: 4, cx: 10, cy: 80, r: 5 },
  { id: 5, cx: 90, cy: 70, r: 4 },
  { id: 6, cx: 60, cy: 90, r: 6 },
];

const connections = [
  { source: 1, target: 3 },
  { source: 2, target: 3 },
  { source: 3, target: 4 },
  { source: 3, target: 5 },
  { source: 4, target: 6 },
  { source: 5, target: 6 },
  { source: 1, target: 4 },
  { source: 2, target: 5 },
];

export function NeuralNet() {
  const containerRef = useRef<HTMLDivElement>(null);

  const lineVariants: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.4,
      transition: { duration: 2, ease: "easeInOut", delay: 0.2 },
    },
  };

  const nodeVariants: any = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, delay: 1.5 },
    },
  };

  return (
    <section id="phase-2" className="relative min-h-screen py-24 flex items-center justify-center overflow-hidden bg-transparent border-t border-border/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Interactive Neural Graph */}
        <div 
          ref={containerRef}
          className="relative aspect-square w-full max-w-md mx-auto lg:mx-0 bg-background/50 rounded-full border border-border/20 shadow-[0_0_100px_-20px_rgba(139,92,246,0.15)] overflow-hidden flex items-center justify-center group"
        >
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </radialGradient>
            </defs>
            
            {/* Draw Connections */}
            {connections.map((conn, i) => {
              const sourceNode = nodes.find(n => n.id === conn.source)!;
              const targetNode = nodes.find(n => n.id === conn.target)!;
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={sourceNode.cx}
                  y1={sourceNode.cy}
                  x2={targetNode.cx}
                  y2={targetNode.cy}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border group-hover:text-primary/50 transition-colors duration-1000"
                  variants={lineVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                />
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => (
              <motion.g
                key={`node-${node.id}`}
                variants={nodeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="cursor-crosshair"
                whileHover={{ scale: 1.5 }}
              >
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.r}
                  className="fill-background stroke-primary stroke-[0.5]"
                />
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.r * 2}
                  fill="url(#nodeGlow)"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.r / 3}
                  className="fill-primary"
                />
              </motion.g>
            ))}
          </svg>

          {/* Foreground UI Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 border-t border-border/30 pt-2">
            <span>Graph Auth::Validated</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Processing
            </span>
          </div>
        </div>

        {/* Right: Copywriting Block */}
        <motion.div 
          className="flex flex-col space-y-8"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2">
             <span className="px-3 py-1 text-xs font-mono border border-primary/30 rounded-full text-primary tracking-widest uppercase bg-primary/5">
                Phase 02
             </span>
             <span className="text-sm font-mono text-muted-foreground tracking-wider uppercase">
                / Artificial Sub-Systems
             </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1]">
            Cognitive <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/40">
              Architecture.
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
            Deploying autonomous entities that reason, execute, and evolve. Beyond simple automation—we engineer synthetic intelligence scaled for <span className="text-foreground font-medium">enterprise precision.</span>
          </p>
          
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-border/40">
            <div>
               <h4 className="font-mono text-xs uppercase tracking-widest text-primary mb-2">Agent Logic</h4>
               <p className="text-sm text-muted-foreground">Self-healing data pipelines with LLM-orchestrated decision trees.</p>
            </div>
            <div>
               <h4 className="font-mono text-xs uppercase tracking-widest text-primary mb-2">Neural Graph</h4>
               <p className="text-sm text-muted-foreground">Multi-agent communication protocols simulating human consensus.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
