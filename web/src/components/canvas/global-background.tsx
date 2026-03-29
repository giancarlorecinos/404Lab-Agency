"use client";

import { useEffect, useRef, useState } from "react";

const CHAR_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

export function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set high-DPI scaling
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    const fontSize = 14;
    const columns = Math.floor(width / fontSize);

    // Track Y positions of drops
    const drops: number[] = new Array(columns).fill(1);
    
    // Assign varying speeds to different columns
    const speeds: number[] = new Array(columns).fill(0).map(() => Math.random() * 0.5 + 0.5);

    // Event listener for external glitch triggers
    let isGlitched = false;
    const handleGlitch = () => {
      isGlitched = true;
      setTimeout(() => {
        isGlitched = false;
      }, 200);
    };
    window.addEventListener('trigger-rain-glitch', handleGlitch as EventListener);

    const draw = () => {
      // Semi-transparent black to create trailing motion blur
      ctx.fillStyle = isGlitched ? "rgba(10, 10, 11, 0.5)" : "rgba(10, 10, 11, 0.1)"; // Increase motion blur trail clear during glitch
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`; // Fallback before Geist/Inter, Mono preferable

      for (let i = 0; i < drops.length; i++) {
        const text = CHAR_SET.charAt(Math.floor(Math.random() * CHAR_SET.length));
        
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Base text is Static Silver
        ctx.fillStyle = "#E2E2E2";

        // Give leading characters the Phosphor Violet glow, mass ignite if glitched
        if (isGlitched || Math.random() > 0.95) {
          ctx.fillStyle = "#8A2BE2";
          ctx.shadowBlur = isGlitched ? 20 : 10;
          ctx.shadowColor = "#8A2BE2";
        } else {
          ctx.shadowBlur = 0;
          // Subtly reduce opacity of following rain to make it look layered
          ctx.fillStyle = "rgba(226, 226, 226, 0.45)"; 
        }

        ctx.fillText(text, x, y);

        // Reset drop occasionally when it passes bottom screen
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
          speeds[i] = Math.random() * 0.5 + 0.5; // randomize speed on reset
        }

        // Increment drop Y by its unique speed factor, accelerate if glitched
        drops[i] += speeds[i] * (isGlitched ? 5 : 1);
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      window.removeEventListener('trigger-rain-glitch', handleGlitch as EventListener);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{ backgroundColor: "#0A0A0B" }} 
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0A0A0B", // Deep Abyss base layer
      }}
    />
  );
}
