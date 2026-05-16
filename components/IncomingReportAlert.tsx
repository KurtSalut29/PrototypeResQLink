"use client";
import { useEffect, useRef, useState } from "react";
import { Flame, Waves, HeartPulse, Car, ShieldAlert, MoreHorizontal, X, Volume2 } from "lucide-react";

interface Props {
  onView: () => void;   // navigate to incident queue
  role: "responder" | "admin";
  dismissed?: boolean;
  onDismiss?: () => void;
}

const INCOMING = {
  id:       "INC-20240501-008",
  type:     "Structure Fire",
  location: "Brgy. Larrazabal, Naval",
  reporter: "Maria Santos",
  time:     "Just now",
  severity: "Critical",
  severityColor: "#ef4444",
  severityBg:    "#fef2f2",
  aiScore:  97,
  icon:     Flame,
  iconColor: "#f97316",
  iconBg:    "#fff7ed",
};

// ── Web Audio alarm (loops until stopped) ───────────────────────────────────
let alarmCtx: AudioContext | null = null;
let alarmInterval: ReturnType<typeof setInterval> | null = null;

function startAlarm() {
  try {
    alarmCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    let beat = 0;
    const playBeat = () => {
      if (!alarmCtx) return;
      const freqs = [1200, 900, 1200, 900, 1400, 900];
      freqs.forEach((freq, i) => {
        const osc  = alarmCtx!.createOscillator();
        const gain = alarmCtx!.createGain();
        osc.connect(gain);
        gain.connect(alarmCtx!.destination);
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, alarmCtx!.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.6, alarmCtx!.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, alarmCtx!.currentTime + i * 0.12 + 0.1);
        osc.start(alarmCtx!.currentTime + i * 0.12);
        osc.stop(alarmCtx!.currentTime + i * 0.12 + 0.11);
      });
      beat++;
    };
    playBeat();
    alarmInterval = setInterval(playBeat, 800);
  } catch { /* browser blocked audio */ }
}

function stopAlarm() {
  if (alarmInterval) { clearInterval(alarmInterval); alarmInterval = null; }
  if (alarmCtx) { alarmCtx.close(); alarmCtx = null; }
}

export default function IncomingReportAlert({ onView, role, dismissed: dismissedProp = false, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);
  const [flash,   setFlash]   = useState(false);
  const played = useRef(false);

  const isDismissed = dismissedProp;

  const dismiss = () => {
    stopAlarm();
    setFlash(false);
    setVisible(false);
    onDismiss?.();
  };

  useEffect(() => {
    if (isDismissed) return;
    const t = setTimeout(() => {
      setVisible(true);
      setFlash(true);
      if (!played.current) {
        played.current = true;
        startAlarm();
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [isDismissed]);

  // stop alarm + flash on unmount
  useEffect(() => {
    return () => stopAlarm();
  }, []);

  if (!visible) return null;

  const Icon = INCOMING.icon;

  return (
    <>
      {/* Screen flash overlay */}
      {flash && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 998,
          background: "rgba(239,68,68,0.3)",
          animation: "alertflash 0.4s ease-in-out infinite",
          pointerEvents: "none",
        }} />
      )}

      {/* Backdrop */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "flex-end",
      }}>
        {/* Modal */}
        <div style={{
          width: "100%",
          background: "white",
          borderRadius: "24px 24px 0 0",
          padding: "20px 20px 36px",
          animation: "slideup 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          {/* Handle */}
          <div style={{ width: 36, height: 4, background: "#e5e7eb", borderRadius: 99, margin: "0 auto 16px" }} />

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Pulsing red dot */}
              <div style={{ position: "relative", width: 12, height: 12, flexShrink: 0 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#ef4444", animation: "ping 1s ease-in-out infinite" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#ef4444" }} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 900, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
                Incoming Report
              </p>
            </div>
            <button onClick={dismiss}
              style={{ width: 28, height: 28, borderRadius: "50%", background: "#f3f4f6", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={13} color="#6b7280" />
            </button>
          </div>

          {/* Incident card */}
          <div style={{ background: "#fef2f2", border: "2px solid #fecaca", borderRadius: 16, padding: "14px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: INCOMING.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={20} color={INCOMING.iconColor} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <p style={{ fontSize: 14, fontWeight: 900, color: "#111", margin: 0 }}>{INCOMING.type}</p>
                  <span style={{ fontSize: 9, fontWeight: 800, color: INCOMING.severityColor, background: INCOMING.severityBg, padding: "2px 7px", borderRadius: 99 }}>
                    {INCOMING.severity}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{INCOMING.location}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: "#6b7280", background: "white", padding: "3px 8px", borderRadius: 8, fontWeight: 600 }}>{INCOMING.id}</span>
              <span style={{ fontSize: 10, color: "#6b7280", background: "white", padding: "3px 8px", borderRadius: 8, fontWeight: 600 }}>By {INCOMING.reporter}</span>
              <span style={{ fontSize: 10, color: "#6b7280", background: "white", padding: "3px 8px", borderRadius: 8, fontWeight: 600 }}>{INCOMING.time}</span>
            </div>

            {/* AI score bar */}
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <Volume2 size={11} color="#6366f1" />
              <div style={{ flex: 1, height: 4, background: "#fecaca", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${INCOMING.aiScore}%`, background: "#ef4444", borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 900, color: "#ef4444" }}>AI {INCOMING.aiScore}%</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={dismiss}
              style={{ flex: 1, padding: "12px", borderRadius: 14, border: "2px solid #e5e7eb", background: "white", fontSize: 12, fontWeight: 700, color: "#6b7280", cursor: "pointer" }}>
              Dismiss
            </button>
            <button
              onClick={() => { dismiss(); onView(); }}
              style={{ flex: 2, padding: "12px", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#B71C1C,#ef4444)", fontSize: 12, fontWeight: 900, color: "white", cursor: "pointer" }}>
              View &amp; Respond
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes alertflash { 0%,100%{opacity:0} 50%{opacity:1} }
        @keyframes slideup { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes ping { 0%{transform:scale(1);opacity:1} 75%,100%{transform:scale(2.2);opacity:0} }
      `}</style>
    </>
  );
}