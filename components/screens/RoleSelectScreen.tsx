"use client";
import { Users, ShieldCheck, ArrowRight, TriangleAlert, Settings, Globe } from "lucide-react";

interface RoleSelectScreenProps {
  onSelect: (role: "resident" | "responder" | "admin" | "superadmin") => void;
}

export default function RoleSelectScreen({ onSelect }: RoleSelectScreenProps) {
  return (
    <div className="flex flex-col h-full" style={{ background: "linear-gradient(160deg, #1a0000 0%, #7f0000 40%, #B71C1C 100%)" }}>
      <div className="px-6 pt-14 pb-6">
        <p className="text-red-300 text-[10px] font-bold tracking-[0.2em] uppercase mb-2">ResQLink</p>
        <h1 className="text-2xl font-black text-white leading-tight">Who are<br />you?</h1>
        <p className="text-white/50 text-xs mt-2">Select your role to continue.</p>
      </div>

      <div className="flex-1 flex flex-col justify-center px-5 gap-2.5">

        <button onClick={() => onSelect("resident")}
          className="bg-white/10 border border-white/15 rounded-2xl p-4 text-left active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-green-300" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-white">Resident</p>
              <p className="text-white/50 text-[11px] mt-0.5">Community member · Report emergencies</p>
            </div>
            <ArrowRight size={15} className="text-white/40" />
          </div>
        </button>

        <button onClick={() => onSelect("responder")}
          className="bg-white/10 border border-white/15 rounded-2xl p-4 text-left active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} className="text-blue-300" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-white">Responder</p>
              <p className="text-white/50 text-[11px] mt-0.5">PNP · BFP · NAVRU · MDRRMO · Requires ID</p>
            </div>
            <ArrowRight size={15} className="text-white/40" />
          </div>
        </button>

        <button onClick={() => onSelect("admin")}
          className="bg-white/10 border border-white/15 rounded-2xl p-4 text-left active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Settings size={20} className="text-amber-300" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-white">Station Admin</p>
              <p className="text-white/50 text-[11px] mt-0.5">Manage one station · Verify responders</p>
            </div>
            <ArrowRight size={15} className="text-white/40" />
          </div>
        </button>

        <button onClick={() => onSelect("superadmin")}
          className="border border-purple-400/30 rounded-2xl p-4 text-left active:scale-[0.98] transition-transform"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.25))" }}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/30 flex items-center justify-center flex-shrink-0">
              <Globe size={20} className="text-purple-300" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-white">Super Admin</p>
              <p className="text-white/50 text-[11px] mt-0.5">Manage all stations, users and system</p>
            </div>
            <ArrowRight size={15} className="text-white/40" />
          </div>
        </button>

        <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-400/20 rounded-xl px-3 py-2">
          <TriangleAlert size={12} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-yellow-200/70">Responder, Admin and Super Admin accounts require verification.</p>
        </div>
      </div>

      <p className="text-center text-white/25 text-[10px] pb-6 tracking-wide">
        Biliran Island Emergency Response System
      </p>
    </div>
  );
}
