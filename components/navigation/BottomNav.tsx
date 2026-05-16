"use client";
import { Home, FileText, Map, User, Settings, Globe } from "lucide-react";

interface BottomNavProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  role: "resident" | "responder" | "admin" | "superadmin";
}

export default function BottomNav({ activeScreen, onNavigate, role }: BottomNavProps) {
  const tabs =
    role === "resident" ? [
      { id: "resident-dashboard",    icon: Home,      label: "Home",      badge: null },
      { id: "incident-report",       icon: FileText,  label: "Reports",   badge: null },
      { id: "map",                   icon: Map,       label: "Map",       badge: null },
      { id: "profile",               icon: User,      label: "Profile",   badge: null },
    ] : role === "admin" ? [
      { id: "admin-dashboard",       icon: Home,      label: "Home",      badge: null },
      { id: "incident-management",   icon: FileText,  label: "Incidents", badge: 1    },
      { id: "manage-responders",     icon: Settings,  label: "Responders",badge: null },
      { id: "map",                   icon: Map,       label: "Map",       badge: null },
      { id: "profile",               icon: User,      label: "Profile",   badge: null },
    ] : role === "superadmin" ? [
      { id: "super-admin-dashboard", icon: Globe,     label: "Home",      badge: null },
      { id: "map",                   icon: Map,       label: "Map",       badge: null },
      { id: "profile",               icon: User,      label: "Profile",   badge: null },
    ] : [
      { id: "responder-dashboard",   icon: Home,      label: "Home",      badge: null },
      { id: "incident-management",   icon: FileText,  label: "Incidents", badge: 5    },
      { id: "map",                   icon: Map,       label: "Map",       badge: null },
      { id: "profile",               icon: User,      label: "Profile",   badge: null },
    ];

  return (
    <div className="flex items-center justify-around bg-white border-t border-gray-100 px-2 py-2 flex-shrink-0">
      {tabs.map(({ id, icon: Icon, label, badge }) => {
        const isActive = activeScreen === id;
        return (
          <button key={id} onClick={() => onNavigate(id)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 active:opacity-70 transition-opacity relative">
            <div className="relative">
              <Icon size={20} className={isActive ? "text-[#D32F2F]" : "text-gray-400"} />
              {badge && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#D32F2F] rounded-full text-[8px] text-white flex items-center justify-center font-black">{badge}</span>
              )}
            </div>
            <span className={`text-[9px] font-semibold ${isActive ? "text-[#D32F2F]" : "text-gray-400"}`}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
