"use client";
import { useState } from "react";
import {
  LayoutDashboard, ClipboardList, Users, Map, Bell, Settings,
  LogOut, ChevronRight, Menu, X, ShieldCheck, TriangleAlert,
  CheckCircle2, Clock, Flame, Waves, HeartPulse, Car, Sparkles,
} from "lucide-react";

interface AdminWebLayoutProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { id: "admin-dashboard",      icon: LayoutDashboard, label: "Dashboard",        badge: null },
  { id: "incident-management",  icon: ClipboardList,   label: "Incidents",        badge: 1    },
  { id: "manage-responders",    icon: Users,           label: "Responders",       badge: 3    },
  { id: "map",                  icon: Map,             label: "Live Map",         badge: null },
  { id: "notifications",        icon: Bell,            label: "Notifications",    badge: 3    },
  { id: "profile",              icon: Settings,        label: "Settings",         badge: null },
];

const RECENT_INCIDENTS = [
  { id: "INC-004", type: "Fire",    location: "Brgy. Libertad",    time: "10:32 AM", status: "active",   icon: Flame,     color: "#f97316" },
  { id: "INC-003", type: "Medical", location: "Brgy. Padre Iñigo", time: "9:01 AM",  status: "resolved", icon: HeartPulse,color: "#ef4444" },
  { id: "INC-002", type: "Flood",   location: "Brgy. Caraycaray",  time: "Yesterday",status: "resolved", icon: Waves,     color: "#3b82f6" },
];

export default function AdminWebLayout({ activeScreen, onNavigate, onLogout, children }: AdminWebLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="desktop-layout flex h-screen w-screen overflow-hidden bg-gray-50">

      {/* ── SIDEBAR ── */}
      <aside
        className="flex-shrink-0 flex flex-col transition-all duration-200"
        style={{
          width: sidebarOpen ? 240 : 64,
          background: "linear-gradient(180deg, #7f0000 0%, #B71C1C 60%, #c62828 100%)",
          boxShadow: "2px 0 16px rgba(0,0,0,0.18)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-white font-black text-sm tracking-wide leading-tight">ResQLink</p>
              <p className="text-white/50 text-[9px] tracking-widest uppercase">Station Admin</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="ml-auto text-white/60 hover:text-white transition-colors flex-shrink-0"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Station badge */}
        {sidebarOpen && (
          <div className="mx-3 mt-3 mb-1 bg-white/10 rounded-xl px-3 py-2.5 flex-shrink-0">
            <p className="text-white/50 text-[9px] uppercase tracking-widest">Station</p>
            <p className="text-white font-black text-xs mt-0.5">Naval PNP Station</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <p className="text-green-300 text-[9px] font-semibold">Online · 12 responders</p>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, icon: Icon, label, badge }) => {
            const isActive = activeScreen === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group"
                style={{
                  background: isActive ? "rgba(255,255,255,0.18)" : "transparent",
                }}
                title={!sidebarOpen ? label : undefined}
              >
                <div className="relative flex-shrink-0">
                  <Icon size={18} className={isActive ? "text-white" : "text-white/60 group-hover:text-white/90"} />
                  {badge && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 rounded-full text-[8px] text-white flex items-center justify-center font-black">
                      {badge}
                    </span>
                  )}
                </div>
                {sidebarOpen && (
                  <span className={`text-sm font-semibold flex-1 ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                    {label}
                  </span>
                )}
                {sidebarOpen && isActive && <ChevronRight size={14} className="text-white/60 flex-shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-4 flex-shrink-0 border-t border-white/10 pt-3">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title={!sidebarOpen ? "Log out" : undefined}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-semibold">Log out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div>
            <h1 className="text-base font-black text-gray-900">
              {NAV_ITEMS.find(n => n.id === activeScreen)?.label ?? "Dashboard"}
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">Naval PNP Station · Biliran Island</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live alert pill */}
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-bold text-red-600">1 Active Incident</span>
            </div>

            {/* Notifications */}
            <button
              onClick={() => onNavigate("notifications")}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Bell size={17} className="text-gray-600" />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-amber-500 rounded-full text-[8px] text-white flex items-center justify-center font-black">3</span>
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-white text-xs font-black">SA</span>
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold text-gray-800 leading-tight">Station Admin</p>
                <p className="text-[10px] text-gray-400">Naval PNP</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
