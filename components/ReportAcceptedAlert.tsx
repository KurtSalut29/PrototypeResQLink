"use client";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ShieldCheck, X, MapPin } from "lucide-react";

interface Props {
  onViewDetail: () => void;
  dismissed?: boolean;
  onDismiss?: () => void;
}

function playAcceptSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523, 659, 784]; // C, E, G — pleasant chord
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.5);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.5);
    });
  } catch { /* blocked */ }
}

export default function ReportAcceptedAlert({ onViewDetail, dismissed: dismissedProp = false, onDismiss }: Props) {
  const [visible,   setVisible]   = useState(false);
  const played = useRef(false);

  const dismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  useEffect(() => {
    if (dismissedProp) return;
    const t = setTimeout(() => {
      setVisible(true);
      if (!played.current) {
        played.current = true;
        playAcceptSound();
      }
    }, 5000);
    return () => clearTimeout(t);
  }, [dismissedProp]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "flex-end",
      }}>
        {/* Sheet */}
        <div style={{
          width: "100%",
          background: "white",
          borderRadius: "24px 24px 0 0",
          padding: "20px 20px 36px",
          animation: "slideup 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          {/* Handle */}
          <div style={{ width: 36, height: 4, background: "#e5e7eb", borderRadius: 99, margin: "0 auto 16px" }} />

          {/* Close */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
            <button onClick={dismiss}
              style={{ width: 28, height: 28, borderRadius: "50%", background: "#f3f4f6", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={13} color="#6b7280" />
            </button>
          </div>

          {/* Icon */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <CheckCircle2 size={32} color="#22c55e" />
              <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "3px solid #bbf7d0", animation: "ripple 1.5s ease-out infinite" }} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 900, color: "#111", margin: 0 }}>Report Accepted!</p>
            <p style={{ fontSize: 11, color: "#6b7280", margin: 0, textAlign: "center", lineHeight: 1.5 }}>
              A responder has accepted your report and is on the way to your location.
            </p>
          </div>

          {/* Info card */}
          <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 16, padding: "14px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ShieldCheck size={18} color="#16a34a" />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 900, color: "#15803d", margin: 0 }}>Officer R. Cruz</p>
                <p style={{ fontSize: 10, color: "#16a34a", margin: 0 }}>Naval PNP Station · En Route</p>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>Est. Arrival</p>
                <p style={{ fontSize: 13, fontWeight: 900, color: "#15803d", margin: 0 }}>~4 min</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 10, borderTop: "1px solid #bbf7d0" }}>
              <MapPin size={11} color="#16a34a" />
              <p style={{ fontSize: 10, color: "#15803d", fontWeight: 600, margin: 0 }}>Barangay Padre Iñigo, Naval</p>
            </div>
          </div>

          {/* Report ID */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9fafb", borderRadius: 12, padding: "10px 14px", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>Report ID</p>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#111", margin: 0 }}>INC-20240501-003</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>Status</p>
              <p style={{ fontSize: 11, fontWeight: 800, color: "#f97316", margin: 0 }}>Dispatched</p>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={dismiss}
              style={{ flex: 1, padding: "12px", borderRadius: 14, border: "2px solid #e5e7eb", background: "white", fontSize: 12, fontWeight: 700, color: "#6b7280", cursor: "pointer" }}>
              Close
            </button>
            <button
              onClick={() => { dismiss(); onViewDetail(); }}
              style={{ flex: 2, padding: "12px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#15803d,#22c55e)", fontSize: 12, fontWeight: 900, color: "white", cursor: "pointer" }}>
              Track Live
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideup { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes ripple  { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(1.6)} }
      `}</style>
    </>
  );
}
