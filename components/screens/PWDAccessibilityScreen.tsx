"use client";
import { ArrowLeft, Eye, Volume2, Hand, CheckCircle2, Info } from "lucide-react";
import { usePWD } from "../PWDContext";

interface Props { onBack: () => void; }

const modes = [
  {
    key: "blind" as const,
    icon: Eye,
    label: "Visual Impairment",
    sub: "Blind / Low Vision",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    effects: [
      "Extra-large text throughout the app",
      "High contrast colors on all buttons",
      "Larger SOS button for easier tapping",
      "Screen reader friendly labels",
    ],
  },
  {
    key: "deaf" as const,
    icon: Volume2,
    label: "Hearing Impairment",
    sub: "Deaf / Hard of Hearing",
    color: "#0369a1",
    bg: "#f0f9ff",
    border: "#bae6fd",
    effects: [
      "Yellow visual alert bar on dashboard",
      "All alerts shown as text banners",
      "Vibration feedback on SOS actions",
      "No audio dependency anywhere",
    ],
  },
  {
    key: "motor" as const,
    icon: Hand,
    label: "Motor Impairment",
    sub: "Limited Hand Mobility",
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
    effects: [
      "Oversized SOS button (160px)",
      "Larger tap targets on all buttons",
      "Reduced multi-step interactions",
      "Sticky action buttons stay visible",
    ],
  },
];

export default function PWDAccessibilityScreen({ onBack }: Props) {
  const { blind, deaf, motor, toggle } = usePWD();
  const active = { blind, deaf, motor };
  const anyActive = blind || deaf || motor;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#F5F5F5" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "36px 16px 12px", flexShrink: 0, boxShadow: "0 1px 0 #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowLeft size={15} color="#374151" />
          </button>
          <div>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#111", margin: 0 }}>PWD Accessibility</p>
            <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>Tap a mode to enable it</p>
          </div>
        </div>
      </div>

      <div className="phone-scroll" style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "12px 16px 32px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Info */}
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 14, padding: "10px 12px", display: "flex", gap: 8 }}>
          <Info size={13} color="#3b82f6" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 10, color: "#1d4ed8", margin: 0, lineHeight: 1.5 }}>
            Enable one or more modes. Changes apply immediately across the entire app.
          </p>
        </div>

        {/* Mode cards */}
        {modes.map(({ key, icon: Icon, label, sub, color, bg, border, effects }) => {
          const isOn = active[key];
          return (
            <div key={key} style={{ background: "white", borderRadius: 16, overflow: "hidden", border: `2px solid ${isOn ? border : "transparent"}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

              {/* Toggle row */}
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, background: isOn ? bg : "white" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: isOn ? color : "#f3f4f6" }}>
                  <Icon size={18} color={isOn ? "white" : "#9ca3af"} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 900, color: "#111", margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{sub}</p>
                </div>
                {/* Toggle switch */}
                <button onClick={() => toggle(key)}
                  style={{ width: 44, height: 24, borderRadius: 99, background: isOn ? color : "#d1d5db", position: "relative", flexShrink: 0, transition: "background 0.2s" }}>
                  <span style={{
                    position: "absolute", top: 2, width: 20, height: 20, background: "white", borderRadius: "50%",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s",
                    left: isOn ? "calc(100% - 22px)" : 2,
                  }} />
                </button>
              </div>

              {/* Effects list — only show when ON */}
              {isOn && (
                <div style={{ padding: "8px 14px 12px", borderTop: "1px solid #f3f4f6" }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>Active effects</p>
                  {effects.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <CheckCircle2 size={11} color={color} style={{ flexShrink: 0 }} />
                      <p style={{ fontSize: 10, color: "#374151", margin: 0 }}>{f}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Preview hint when OFF */}
              {!isOn && (
                <div style={{ padding: "6px 14px 10px" }}>
                  <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>Tap the toggle to enable this mode</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Active summary */}
        {anyActive && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: "10px 12px", display: "flex", gap: 8 }}>
            <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 11, fontWeight: 900, color: "#15803d", margin: 0 }}>Accessibility Active</p>
              <p style={{ fontSize: 10, color: "#16a34a", margin: "2px 0 0", lineHeight: 1.4 }}>
                {[blind && "Visual Impairment", deaf && "Hearing Impairment", motor && "Motor Impairment"]
                  .filter(Boolean).join(" · ")} {(+blind + +deaf + +motor) > 1 ? "modes are" : "mode is"} enabled.
              </p>
            </div>
          </div>
        )}

        {/* Go back to see effects */}
        {anyActive && (
          <button onClick={onBack}
            style={{ width: "100%", padding: "12px", borderRadius: 14, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "white", fontSize: 12, fontWeight: 900, border: "none", cursor: "pointer" }}>
            Go back to see changes applied
          </button>
        )}

      </div>
    </div>
  );
}
