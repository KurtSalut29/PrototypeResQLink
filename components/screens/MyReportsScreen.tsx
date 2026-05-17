"use client";
import { ArrowLeft, Flame, Waves, HeartPulse, Car, ShieldAlert, ChevronRight } from "lucide-react";
import BottomNav from "../navigation/BottomNav";

interface Props {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

const reports = [
  { id: "INC-20240501-003", type: "Medical Emergency", icon: HeartPulse, color: "#ef4444", bg: "#fef2f2", status: "In Progress", statusColor: "bg-orange-100 text-orange-700", location: "Brgy. Padre Iñigo, Naval", date: "May 1, 2024 · 9:01 AM" },
  { id: "INC-20240420-002", type: "Flood",             icon: Waves,       color: "#3b82f6", bg: "#eff6ff", status: "Resolved",    statusColor: "bg-green-100 text-green-700",  location: "Brgy. Padre Iñigo, Naval", date: "Apr 20, 2024 · 3:45 PM" },
  { id: "INC-20240410-001", type: "Road Accident",     icon: Car,         color: "#ca8a04", bg: "#fefce8", status: "Resolved",    statusColor: "bg-green-100 text-green-700",  location: "Brgy. Padre Iñigo, Naval", date: "Apr 10, 2024 · 11:20 AM" },
  { id: "INC-20240330-004", type: "Fire",              icon: Flame,       color: "#f97316", bg: "#fff7ed", status: "Resolved",    statusColor: "bg-green-100 text-green-700",  location: "Brgy. Larrazabal, Naval",  date: "Mar 30, 2024 · 7:15 PM" },
  { id: "INC-20240315-005", type: "Crime",             icon: ShieldAlert, color: "#9333ea", bg: "#faf5ff", status: "Resolved",    statusColor: "bg-green-100 text-green-700",  location: "Brgy. Poblacion, Naval",   date: "Mar 15, 2024 · 2:00 PM" },
];

export default function MyReportsScreen({ onBack, onNavigate }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F5F5F5" }}>
      {/* Header */}
      <div style={{ background: "white", padding: "36px 16px 12px", flexShrink: 0, boxShadow: "0 1px 0 #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={15} color="#374151" />
          </button>
          <div>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#111", margin: 0 }}>My Reports</p>
            <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{reports.length} submitted reports</p>
          </div>
        </div>
      </div>

      {/* Report list */}
      <div className="phone-scroll" style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "12px 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              onClick={() => onNavigate?.("incident-detail")}
              style={{
                background: "white",
                borderRadius: 16,
                padding: "12px 14px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
              }}
            >
              {/* Icon */}
              <div style={{ width: 36, height: 36, borderRadius: 10, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} color={r.color} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: "#111", margin: 0 }}>{r.type}</p>
                  <span className={r.statusColor} style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99 }}>{r.status}</span>
                </div>
                <p style={{ fontSize: 10, color: "#6b7280", margin: 0 }}>{r.id}</p>
                <p style={{ fontSize: 10, color: "#9ca3af", margin: "2px 0 0" }}>{r.location}</p>
                <p style={{ fontSize: 9, color: "#d1d5db", margin: "2px 0 0" }}>{r.date}</p>
              </div>

              {/* Chevron */}
              <div style={{ display: "flex", alignItems: "center", alignSelf: "center", flexShrink: 0 }}>
                <ChevronRight size={14} color="#d1d5db" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom nav */}
      {onNavigate && (
        <BottomNav activeScreen="my-reports" onNavigate={onNavigate} role="resident" />
      )}
    </div>
  );
}
