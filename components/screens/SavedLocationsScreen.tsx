"use client";
import { ArrowLeft, Home, Briefcase, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props { onBack: () => void; }

const DEFAULT_LOCATIONS = [
  { id: "home", icon: Home,     label: "Home",   address: "Brgy. Padre Iñigo, Naval, Biliran",  color: "#ef4444", bg: "#fef2f2",  deletable: false },
  { id: "work", icon: Briefcase,label: "Work",   address: "Naval, Biliran Island",               color: "#3b82f6", bg: "#eff6ff",  deletable: false },
  { id: "1",    icon: MapPin,   label: "School", address: "Naval Central School, Poblacion",     color: "#8b5cf6", bg: "#f5f3ff",  deletable: true  },
];

export default function SavedLocationsScreen({ onBack }: Props) {
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F5F5F5" }}>
      <div style={{ background: "white", padding: "36px 16px 12px", flexShrink: 0, boxShadow: "0 1px 0 #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={15} color="#374151" />
          </button>
          <div>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#111", margin: 0 }}>Saved Locations</p>
            <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>Used for faster incident reporting</p>
          </div>
        </div>
      </div>

      <div className="phone-scroll" style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "12px 16px 32px", display: "flex", flexDirection: "column", gap: 8 }}>

        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {locations.map(({ id, icon: Icon, label, address, color, bg, deletable }, i) => (
            <div key={id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: i < locations.length - 1 ? "1px solid #f3f4f6" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} color={color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: "#111", margin: 0 }}>{label}</p>
                <p style={{ fontSize: 10, color: "#9ca3af", margin: "1px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{address}</p>
              </div>
              {deletable && (
                <button onClick={() => setLocations(l => l.filter(x => x.id !== id))}
                  style={{ width: 28, height: 28, borderRadius: 8, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  <Trash2 size={13} color="#ef4444" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button style={{ width: "100%", padding: "13px", borderRadius: 16, border: "2px dashed #d1d5db", background: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
          <Plus size={15} color="#9ca3af" />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af" }}>Add New Location</span>
        </button>

        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 14, padding: "10px 12px" }}>
          <p style={{ fontSize: 10, color: "#1d4ed8", margin: 0, lineHeight: 1.5 }}>
            Saved locations are automatically attached to your incident reports for faster response.
          </p>
        </div>
      </div>
    </div>
  );
}
