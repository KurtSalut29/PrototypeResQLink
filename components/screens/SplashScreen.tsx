"use client";
import { Shield } from "lucide-react";

export default function SplashScreen({ onNext }: { onNext: () => void }) {
  return (
    <div
      className="flex flex-col h-full relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1a0000 0%, #7f0000 40%, #B71C1C 70%, #D32F2F 100%)" }}
    >
      {/* Decorative — never block clicks */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 bg-white pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-10 bg-white pointer-events-none" />
      <div className="absolute top-1/3 -left-10 w-40 h-40 rounded-full opacity-5 bg-white pointer-events-none" />

      {/* Top badge */}
      <div className="relative z-10 flex justify-center pt-12 pb-2">
        <span className="text-[10px] font-bold tracking-widest text-red-200 uppercase bg-white/10 px-3 py-1 rounded-full">
          Biliran Island, Philippines
        </span>
      </div>

      {/* Logo + text */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-white/15 flex items-center justify-center mb-5 shadow-2xl border border-white/20">
          <Shield size={40} className="text-white" fill="rgba(255,255,255,0.3)" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-1">ResQLink</h1>
        <p className="text-red-200 font-semibold text-sm tracking-widest mb-6">FAST · SAFE · REPORTED</p>
        <p className="text-white/70 text-xs leading-relaxed max-w-[240px]">
          Report emergencies anywhere in Biliran Island with real-time response tracking.
        </p>
      </div>

      {/* CTA */}
      <div className="relative z-10 px-6 pb-10 flex flex-col items-center gap-3">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-full bg-white text-[#D32F2F] font-bold text-sm shadow-xl active:scale-95 transition-transform"
        >
          Get Started
        </button>
        <p className="text-white/50 text-[10px] text-center">
          Track, respond, and coordinate with ease.
        </p>
      </div>
    </div>
  );
}
