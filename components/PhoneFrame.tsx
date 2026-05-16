"use client";
import { ReactNode } from "react";

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    /*
      The phone scales down on small viewports using CSS clamp so it never
      overflows on a real mobile browser or a small laptop window.
      On a real phone (< 430px wide) the frame fills the screen edge-to-edge
      without the decorative chrome — users see the app content directly.
    */
    <div
      className="relative flex-shrink-0"
      style={{
        /* clamp(min, preferred, max) — scales between 280px and 340px */
        width:  "clamp(280px, 90vw, 340px)",
        height: "clamp(580px, 92vh, 720px)",
        background: "#111",
        borderRadius: "clamp(36px, 8vw, 50px)",
        padding: 10,
        boxShadow:
          "0 0 0 1px #2a2a2a, 0 0 0 2px #111, 0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
        touchAction: "auto",
      }}
    >
      {/* Volume buttons */}
      <div className="absolute -left-[3px] top-[88px]  w-[3px] h-7  bg-[#222] rounded-l-sm pointer-events-none" />
      <div className="absolute -left-[3px] top-[128px] w-[3px] h-12 bg-[#222] rounded-l-sm pointer-events-none" />
      <div className="absolute -left-[3px] top-[188px] w-[3px] h-12 bg-[#222] rounded-l-sm pointer-events-none" />
      {/* Power button */}
      <div className="absolute -right-[3px] top-[140px] w-[3px] h-16 bg-[#222] rounded-r-sm pointer-events-none" />

      {/* Screen */}
      <div
        className="relative overflow-hidden bg-white"
        style={{ borderRadius: "clamp(28px, 6vw, 42px)", height: "100%", width: "100%" }}
      >
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          style={{ width: 120, height: 30, background: "#111", borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}
        >
          <div className="flex items-center justify-center gap-2 h-full">
            <div className="w-2 h-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]" />
            <div className="w-12 h-[5px] rounded-full bg-[#1a1a1a]" />
          </div>
        </div>

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-8 z-20 flex items-center justify-between px-5 pointer-events-none">
          <span className="text-[9px] font-bold text-gray-800 mt-1">9:41</span>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex gap-[2px] items-end h-3">
              {[3, 5, 7, 9].map((h, i) => (
                <div key={i} className="w-[3px] rounded-sm" style={{ height: h, background: i < 3 ? "#1a1a1a" : "#ccc" }} />
              ))}
            </div>
            <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
              <path d="M6.5 7.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#1a1a1a"/>
              <path d="M3.8 5.2a3.8 3.8 0 0 1 5.4 0" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              <path d="M1.5 2.9a6.4 6.4 0 0 1 10 0" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            </svg>
            <div className="flex items-center gap-0.5">
              <div className="w-6 h-3 rounded-[3px] border border-gray-700 flex items-center px-[2px]">
                <div className="w-4 h-[7px] bg-green-500 rounded-[2px]" />
              </div>
              <div className="w-[2px] h-[5px] bg-gray-600 rounded-r-sm" />
            </div>
          </div>
        </div>

        {/* App content */}
        <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ touchAction: "pan-y" }}>
          {children}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-[4px] bg-gray-800 rounded-full z-20 opacity-60 pointer-events-none" />
      </div>
    </div>
  );
}
