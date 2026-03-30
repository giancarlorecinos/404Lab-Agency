"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type FormStatus = "idle" | "executing" | "transmitted" | "error";

export function Terminal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleExecution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus("executing");
    setErrorMsg("");

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Transmission failed.");
      }

      setStatus("transmitted");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error.");
      setStatus("error");
    }
  };

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center bg-transparent px-4 md:px-8 py-32 border-t border-border/10">

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-16 items-center">

        {/* Left: Manifesto Copy */}
        <div className="flex-1 space-y-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-destructive rounded-full relative">
              <span className="absolute inset-0 bg-destructive rounded-full animate-ping opacity-75" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-destructive">
              Restricted Access
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-foreground"
          >
            Initiate <br />
            <span className="text-muted-foreground/50">Sequence.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-medium md:text-lg max-w-sm"
          >
            For sovereign founders and visionaries aiming beyond the current paradigm. Establish a secure channel below.
          </motion.p>
        </div>

        {/* Right: Terminal Emulator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
          className="flex-1 w-full bg-[#0A0A0B] border border-border/30 rounded-xl overflow-hidden shadow-2xl relative"
        >
          {/* Terminal Header */}
          <div className="bg-[#111113] border-b border-border/30 px-4 py-3 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-border/50 hover:bg-destructive transition-colors cursor-crosshair" />
              <div className="w-3 h-3 rounded-full bg-border/50 hover:bg-yellow-500 transition-colors cursor-crosshair" />
              <div className="w-3 h-3 rounded-full bg-border/50 hover:bg-green-500 transition-colors cursor-crosshair" />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase opacity-50">root@404lab:~</span>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 font-mono text-sm md:text-base text-primary">
            <div className="mb-6 opacity-60">
              <p>{`> 404LAB_SYSTEM_V_1.0.4`}</p>
              <p>{`> SECURE HANDSHAKE PROTOCOL INITIATED...`}</p>
              <p className="text-green-500">{`> CONNECTION STABLE.`}</p>
            </div>

            {/* ── Success State ── */}
            {status === "transmitted" ? (
              <div className="space-y-2">
                <p className="text-green-500">{`> [████████████████] 100%`}</p>
                <p className="text-green-500">{`> PAYLOAD ENCRYPTED.`}</p>
                <p className="text-green-500">{`> SIGNATURE VERIFIED.`}</p>
                <p className="text-white font-bold mt-4">{`> INQUIRY RECEIVED.`}</p>
                <p className="text-white font-bold">{`> CONNECTION ESTABLISHED.`}</p>
                <p className="text-muted-foreground/60 mt-2 text-xs">{`> STANDBY FOR RESPONSE FROM COMMAND...`}</p>
                <button
                  onClick={reset}
                  className="mt-6 text-[10px] font-mono tracking-[0.3em] uppercase text-white/30 hover:text-white/60 transition-colors"
                >
                  [ RESET TERMINAL ]
                </button>
              </div>
            ) : (
              // ── Form ──
              <form onSubmit={handleExecution} className="space-y-6">

                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="flex items-center gap-3">
                    <span className="text-destructive font-bold">~</span>
                    <span className="text-muted-foreground uppercase opacity-80 text-xs tracking-widest">Identify --name</span>
                  </label>
                  <div className="flex items-center">
                    <span className="mr-3 opacity-50">{`>`}</span>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="_"
                      className="bg-transparent border-none outline-none flex-1 text-foreground placeholder:opacity-50 placeholder:animate-pulse focus:ring-0"
                      disabled={status !== "idle"}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="flex items-center gap-3">
                    <span className="text-destructive font-bold">~</span>
                    <span className="text-muted-foreground uppercase opacity-80 text-xs tracking-widest">Identify --email</span>
                  </label>
                  <div className="flex items-center">
                    <span className="mr-3 opacity-50">{`>`}</span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="_"
                      className="bg-transparent border-none outline-none flex-1 text-foreground placeholder:opacity-50 placeholder:animate-pulse focus:ring-0"
                      disabled={status !== "idle"}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="flex items-center gap-3">
                    <span className="text-destructive font-bold">~</span>
                    <span className="text-muted-foreground uppercase opacity-80 text-xs tracking-widest">Execute --payload</span>
                  </label>
                  <div className="flex items-start">
                    <span className="mr-3 opacity-50 mt-1">{`>`}</span>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={3}
                      placeholder="Outline sequence parameters..."
                      className="bg-transparent border-none outline-none flex-1 text-foreground focus:ring-0 resize-none"
                      disabled={status !== "idle"}
                    />
                  </div>
                </div>

                {/* Status & Submit */}
                <div className="pt-4 flex items-center justify-between border-t border-border/20">
                  <span className={`text-xs uppercase tracking-widest ${
                    status === "executing" ? "text-yellow-500 animate-pulse"
                    : status === "error"   ? "text-destructive"
                    : "text-muted-foreground/50"
                  }`}>
                    {status === "idle"      && "AWAITING_INPUT"}
                    {status === "executing" && "ENCRYPTING_PAYLOAD..."}
                    {status === "error"     && (errorMsg || "TRANSMISSION_FAILED")}
                  </span>

                  <button
                    type="submit"
                    disabled={status === "executing"}
                    className="group relative px-6 py-2 bg-transparent border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-40"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Run{" "}
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        status === "idle"
                          ? "bg-destructive/50 group-hover:bg-background group-hover:animate-ping"
                          : "bg-transparent"
                      }`} />
                    </span>
                    <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
