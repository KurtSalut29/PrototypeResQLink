"use client";
import { useState } from "react";
import {
  LayoutDashboard, Building2, Users, ClipboardList, Map,
  Bell, Settings, LogOut, ChevronRight, Menu, X, Globe,
} from "lucide-react";

interface SuperAdminWebLayoutProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { id: "super-admin-dashboard", icon: LayoutDashboard, label: "Overview",      badge: null },
  { id: "incident-management",   icon: ClipboardList,   label: "All Incidents", badge: 1    },
  { id: "manage-responders",     icon: Users,           label: "All Users",     badge: null },
  { id: "map",                   icon: Map,             label: "System Map",    badge: null },
  { id: "notifications",         icon: Bell,            label: "Notifications", badge: 5    },
  { id: "profile",               icon: Settings,        label: "Settings",      badge: null },
];

const MUNICIPALITIES = ["Naval", "Kawayan", "Cabucgayan", "Almeria", "Biliran", "Caibiran", "Culaba", "Maripipi"];
const SIDEBAR_BG = "linear-gradient(180deg, #3b0764 0%, #6d28d9 60%, #7c3aed 100%)";

export default function SuperAdminWebLayout({ activeScreen, onNavigate, onLogout, children }: SuperAdminWebLayoutProps) {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full" style={{ background: SIDEBAR_BG }}>
      {/* Logo row */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Globe size={16} className="text-white" />
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0 flex-1">
            <p className="text-white font-black text-sm tracking-wide leading-tight">ResQLink</p>
            <p className="text-white/50 text-[9px] tracking-widest uppercase">Super Admin</p>
          </div>
        )}
        <button
          onClick={() => mobile ? setMobileOpen(false) : setCollapsed(v => !v)}
          className="text-white/60 hover:text-white transition-colors flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          {mobile ? <X size={18} /> : collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Jurisdiction badge */}
      {(!collapsed || mobile) && (
        <div className="mx-3 mt-3 mb-1 bg-white/10 rounded-xl px-3 py-2.5 flex-shrink-0">
          <p className="text-white/50 text-[9px] uppercase tracking-widest">Jurisdiction</p>
          <p className="text-white font-black text-xs mt-0.5">Biliran Island</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <p className="text-green-300 text-[9px] font-semibold">
              {MUNICIPALITIES.length} municipalities · 10 stations
            </p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, icon: Icon, label, badge }) => {
          const isActive = activeScreen === id;
          return (
            <button
              key={id}
              onClick={() => { onNavigate(id); setMobileOpen(false); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group w-full"
              style={{ background: isActive ? "rgba(255,255,255,0.18)" : "transparent" }}
              title={collapsed && !mobile ? label : undefined}
            >
              <div className="relative flex-shrink-0">
                <Icon size={18} className={isActive ? "text-white" : "text-white/60 group-hover:text-white/90"} />
                {badge && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-pink-400 rounded-full text-[8px] text-white flex items-center justify-center font-black">
                    {badge}
                  </span>
                )}
              </div>
              {(!collapsed || mobile) && (
                <span className={`text-sm font-semibold flex-1 ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                  {label}
                </span>
              )}
              {(!collapsed || mobile) && isActive && <ChevronRight size={14} className="text-white/60 flex-shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-4 flex-shrink-0 border-t border-white/10 pt-3">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
          title={collapsed && !mobile ? "Log out" : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {(!collapsed || mobile) && <span className="text-sm font-semibold">Log out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="desktop-layout flex h-screen w-screen overflow-hidden bg-gray-50">

      {/* ── MOBILE OVERLAY SIDEBAR ── */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-64 z-50 lg:hidden shadow-2xl">
            <SidebarContent mobile />
          </div>
        </>
      )}

      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 transition-all duration-200"
        style={{
          width: collapsed ? 64 : 240,
          background: SIDEBAR_BG,
          boxShadow: "2px 0 16px rgba(0,0,0,0.18)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header
          className="flex-shrink-0 bg-white border-b border-gray-200 flex items-center justify-between"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "10px 16px" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu size={18} className="text-gray-600" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm font-black text-gray-900 truncate">
                {NAV_ITEMS.find(n => n.id === activeScreen)?.label ?? "Overview"}
              </h1>
              <p className="text-[10px] text-gray-400 hidden sm:block">ResQLink System · Biliran Island</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-[11px] font-bold text-purple-700 whitespace-nowrap">System Online</span>
            </div>

            <button
              onClick={() => onNavigate("notifications")}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Bell size={17} className="text-gray-600" />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-purple-600 rounded-full text-[8px] text-white flex items-center justify-center font-black">5</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                <Globe size={14} className="text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold text-gray-800 leading-tight">Super Admin</p>
                <p className="text-[10px] text-gray-400">Biliran Island</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
