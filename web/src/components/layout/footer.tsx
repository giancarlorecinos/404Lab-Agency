"use client";

const PARTNERS = [
  "CRELOSA POC",
  "BALAM RESERVE",
  "PURPLE VERSE",
];

// Duplicate for seamless infinite loop
const TRACK = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#0A0A0B]/80 backdrop-blur-md">
      {/* Integrated Partners Marquee */}
      <div className="border-b border-white/5 py-6 overflow-hidden">
        <p className="text-center font-mono text-[9px] tracking-[0.5em] text-white/20 uppercase mb-5">
          Integrated Partners
        </p>
        <div className="relative overflow-hidden">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#0A0A0B] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#0A0A0B] to-transparent pointer-events-none" />

          <div
            className="flex gap-16 w-max"
            style={{ animation: "marquee-scroll 28s linear infinite" }}
          >
            {TRACK.map((partner, i) => (
              <div key={i} className="flex items-center gap-16 flex-shrink-0">
                <span
                  className="font-mono text-[11px] tracking-[0.4em] uppercase text-white/20 hover:text-white/70 hover:drop-shadow-[0_0_8px_rgba(138,43,226,0.8)] transition-all duration-300 cursor-default whitespace-nowrap"
                >
                  {partner}
                </span>
                <span className="text-white/10 text-xs select-none">◆</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/20">
          Strategic Design Unit // Powered by Ixcore® Systems
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/15">
          © {new Date().getFullYear()} 404Lab.Agency // All Secrets Reserved.
        </span>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}
