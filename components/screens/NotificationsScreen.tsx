"use client";
import { ArrowLeft, TriangleAlert, Megaphone, ShieldCheck, Bell } from "lucide-react";
import { useState } from "react";

interface Props { onBack: () => void; }

const PREFS = [
  { key: "emergency",    icon: TriangleAlert, label: "Emergency Alerts",    sub: "Active incidents near your location",  color: "#ef4444", bg: "#fef2f2" },
  { key: "broadcast",    icon: Megaphone,     label: "Broadcast Alerts",    sub: "Flood, fire and weather warnings",      color: "#f59e0b", bg: "#fffbeb" },
  { key: "responder",    icon: ShieldCheck,   label: "Responder Updates",   sub: "Status updates on your reports",        color: "#3b82f6", bg: "#eff6ff" },
  { key: "general",      icon: Bell,          label: "General Notifications",sub: "App updates and announcements",         color: "#8b5cf6", bg: "#f5f3ff" },
];

const RECENT = [
  { title: "Flood Warning Active",          sub: "Barangay Padre Iñigo, Naval",          time: "2 min ago",   dot: "#f59e0b" },
  { title: "Responder dispatched",          sub: "INC-20240501-003 · Medical Emergency", time: "10 min ago",  dot: "#3b82f6" },
  { title: "Your report has been resolved", sub: "INC-20240420-002 · Flood",             time: "Apr 20",      dot: "#22c55e" },
];

export default function NotificationsScreen({ onBack }: Props) {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ emergency: true, broadcast: true, responder: true, general: false });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F5F5F5" }}>
      <div style={{ background: "white", padding: "36px 16px 12px", flexShrink: 0, boxShadow: "0 1px 0 #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={15} color="#374151" />
          </button>
          <div>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#111", margin: 0 }}>Notifications</p>
            <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>Manage your alert preferences</p>
          </div>
        </div>
      </div>

      <div className="phone-scroll" style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "12px 16px 32px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Preferences */}
        <p style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Alert Preferences</p>
        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {PREFS.map(({ key, icon: Icon, label, sub, color, bg }, i) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: i < PREFS.length - 1 ? "1px solid #f3f4f6" : "none" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={15} color={color} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#111", margin: 0 }}>{label}</p>
                <p style={{ fontSize: 9, color: "#9ca3af", margin: 0 }}>{sub}</p>
              </div>
              <button onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
                style={{ width: 40, height: 22, borderRadius: 99, background: prefs[key] ? color : "#d1d5db", position: "relative", border: "none", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
                <span style={{ position: "absolute", top: 2, width: 18, height: 18, background: "white", borderRadius: "50%", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s", left: prefs[key] ? "calc(100% - 20px)" : 2 }} />
              </button>
            </div>
          ))}
        </div>

        {/* Recent */}
        <p style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Recent</p>
        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {RECENT.map((n, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 14px", borderBottom: i < RECENT.length - 1 ? "1px solid #f3f4f6" : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.dot, flexShrink: 0, marginTop: 3 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#111", margin: 0 }}>{n.title}</p>
                <p style={{ fontSize: 10, color: "#9ca3af", margin: "1px 0 0" }}>{n.sub}</p>
              </div>
              <p style={{ fontSize: 9, color: "#d1d5db", margin: 0, flexShrink: 0 }}>{n.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
