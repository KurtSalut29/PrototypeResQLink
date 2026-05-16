"use client";
import { User, Phone, MapPin, Shield, ChevronRight, LogOut, Bell, Lock, HelpCircle, FileText, Accessibility, Users, Settings, Globe } from "lucide-react";
import BottomNav from "../navigation/BottomNav";
import { usePWD } from "../PWDContext";

interface ProfileScreenProps {
  role: "resident" | "responder" | "admin" | "superadmin";
  onNavigate: (screen: string) => void;
}

const menuByRole = {
  resident: [
    { icon: FileText,      label: "My Reports",       sub: "View submitted reports",       screen: "my-reports" },
    { icon: Bell,          label: "Notifications",     sub: "Manage alert preferences",     screen: "notifications" },
    { icon: MapPin,        label: "Saved Locations",   sub: "Home, work, and more",         screen: "saved-locations" },
    { icon: Lock,          label: "Change Password",   sub: "Update your credentials",      screen: "change-password" },
    { icon: Accessibility, label: "PWD Accessibility", sub: "Blind, deaf & motor support",  screen: "pwd-accessibility" },
    { icon: HelpCircle,    label: "Help & Support",    sub: "FAQs and contact info",        screen: "help-support" },
  ],
  responder: [
    { icon: Shield,        label: "My Assignments",    sub: "Active and past incidents",    screen: "" },
    { icon: Bell,          label: "Notifications",     sub: "Manage alert preferences",     screen: "notifications" },
    { icon: Phone,         label: "Emergency Contacts",sub: "Unit and dispatch numbers",    screen: "" },
    { icon: Lock,          label: "Change Password",   sub: "Update your credentials",      screen: "change-password" },
    { icon: Accessibility, label: "PWD Accessibility", sub: "Blind, deaf & motor support",  screen: "pwd-accessibility" },
    { icon: HelpCircle,    label: "Help & Support",    sub: "FAQs and contact info",        screen: "help-support" },
  ],
  admin: [
    { icon: Users,         label: "Manage Responders", sub: "Approve, verify and manage",   screen: "manage-responders" },
    { icon: Shield,        label: "Station Incidents", sub: "All incidents in station",     screen: "" },
    { icon: Bell,          label: "Notifications",     sub: "Manage alert preferences",     screen: "notifications" },
    { icon: Settings,      label: "Station Settings",  sub: "Edit station information",     screen: "" },
    { icon: Lock,          label: "Change Password",   sub: "Update your credentials",      screen: "change-password" },
    { icon: HelpCircle,    label: "Help & Support",    sub: "FAQs and contact info",        screen: "help-support" },
  ],
  superadmin: [
    { icon: Globe,         label: "System Overview",   sub: "All stations and incidents",   screen: "super-admin-dashboard" },
    { icon: Users,         label: "All Users",         sub: "Residents, responders, admins",screen: "" },
    { icon: Settings,      label: "System Settings",   sub: "Configure ResQLink system",    screen: "" },
    { icon: Bell,          label: "Notifications",     sub: "Manage alert preferences",     screen: "notifications" },
    { icon: Lock,          label: "Change Password",   sub: "Update your credentials",      screen: "change-password" },
    { icon: HelpCircle,    label: "Help & Support",    sub: "FAQs and contact info",        screen: "help-support" },
  ],
};

const profileByRole = {
  resident:   { initials: "JD", gradient: "from-red-400 to-red-700",       name: "Juan Dela Cruz",       sub: "Brgy. Padre Iñigo, Naval",  badge: null,            tag: "Resident",      tagColor: "bg-red-100 text-red-700",       stats: [{ l: "Reports", v: "5" }, { l: "Resolved", v: "4" }, { l: "Pending", v: "1" }]   },
  responder:  { initials: "RC", gradient: "from-blue-400 to-blue-700",     name: "Officer R. Cruz",      sub: "Naval PNP Station",         badge: "PNP-BIL-0042",  tag: "Responder",     tagColor: "bg-blue-100 text-blue-700",     stats: [{ l: "Responded", v: "49" }, { l: "This Month", v: "7" }, { l: "Avg. Time", v: "4m" }] },
  admin:      { initials: "SA", gradient: "from-amber-400 to-amber-600",   name: "Station Admin",        sub: "Naval PNP Station",         badge: "PNP-ADMIN-001", tag: "Station Admin", tagColor: "bg-amber-100 text-amber-700",   stats: [{ l: "Responders", v: "12" }, { l: "Pending", v: "3" }, { l: "Incidents", v: "49" }] },
  superadmin: { initials: "SU", gradient: "from-purple-500 to-indigo-600", name: "System Administrator", sub: "ResQLink · Biliran Island",  badge: "SYS-ADMIN-001", tag: "Super Admin",   tagColor: "bg-purple-100 text-purple-700", stats: [{ l: "Stations", v: "7" }, { l: "Users", v: "1.3k" }, { l: "Incidents", v: "284" }] },
};

const accentByRole: Record<string, string> = {
  resident: "text-[#D32F2F]", responder: "text-blue-600", admin: "text-amber-600", superadmin: "text-purple-600",
};

export default function ProfileScreen({ role, onNavigate }: ProfileScreenProps) {
  const { blind, deaf, motor } = usePWD();
  const pwdActive  = blind || deaf || motor;
  const p          = profileByRole[role];
  const menuItems  = menuByRole[role];
  const accent     = accentByRole[role];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#F5F5F5" }}>

      {/* Compact header */}
      <div style={{ background: "white", padding: "36px 16px 12px", flexShrink: 0, boxShadow: "0 1px 0 #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 14, flexShrink: 0 }}
            className={`bg-gradient-to-br ${p.gradient}`}>
            {p.initials}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 900, color: "#111", margin: 0 }}>{p.name}</p>
            <p style={{ fontSize: 10, color: "#9ca3af", margin: "1px 0 0" }}>{p.sub}</p>
            <span className={`${p.tagColor}`} style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 99, display: "inline-block", marginTop: 2 }}>{p.tag}</span>
          </div>
          {p.badge && <p style={{ fontSize: 9, color: "#6b7280", background: "#f3f4f6", padding: "3px 7px", borderRadius: 8, fontWeight: 700 }}>{p.badge}</p>}
          <button style={{ padding: 6, borderRadius: 10, background: "#f3f4f6" }}>
            <User size={14} color="#6b7280" />
          </button>
        </div>

        {/* Stats inline */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 10 }}>
          {p.stats.map(s => (
            <div key={s.l} style={{ background: "#f9fafb", borderRadius: 12, padding: "6px 4px", textAlign: "center" }}>
              <p className={accent} style={{ fontSize: 15, fontWeight: 900, margin: 0 }}>{s.v}</p>
              <p style={{ fontSize: 9, color: "#9ca3af", margin: 0 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="phone-scroll" style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "10px 16px 80px" }}>

        {/* Account info compact */}
        <div style={{ background: "white", borderRadius: 16, padding: "10px 14px", marginBottom: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={11} color="#9ca3af" />
              <p style={{ fontSize: 10, color: "#374151", fontWeight: 600, margin: 0 }}>+63 912 345 6789</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={11} color="#9ca3af" />
              <p style={{ fontSize: 10, color: "#374151", fontWeight: 600, margin: 0 }}>{p.sub}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 8 }}>
          {menuItems.map(({ icon: Icon, label, sub, screen }, i) => (
            <button key={label} onClick={() => { if (screen) onNavigate(screen); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "white", borderBottom: i < menuItems.length - 1 ? "1px solid #f3f4f6" : "none", cursor: "pointer" }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                background: label === "PWD Accessibility" ? "#f3e8ff" : label === "Manage Responders" ? "#fef3c7" : "#f3f4f6" }}>
                <Icon size={13} color={label === "PWD Accessibility" ? "#9333ea" : label === "Manage Responders" ? "#d97706" : "#6b7280"} />
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", margin: 0 }}>{label}</p>
                <p style={{ fontSize: 9, color: "#9ca3af", margin: 0 }}>{sub}</p>
              </div>
              {label === "PWD Accessibility" && pwdActive && (
                <span style={{ fontSize: 9, fontWeight: 700, color: "#9333ea", background: "#f3e8ff", padding: "2px 6px", borderRadius: 99 }}>ON</span>
              )}
              <ChevronRight size={13} color="#d1d5db" />
            </button>
          ))}
        </div>

        {/* Sign out */}
        <button onClick={() => onNavigate("splash")}
          style={{ width: "100%", padding: "12px", borderRadius: 16, border: "2px solid #fecaca", color: "#D32F2F", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "white" }}>
          <LogOut size={13} />
          Sign Out
        </button>
      </div>

      <BottomNav activeScreen="profile" onNavigate={onNavigate} role={role} />
    </div>
  );
}
