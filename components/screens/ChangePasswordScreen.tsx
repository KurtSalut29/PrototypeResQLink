"use client";
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface Props { onBack: () => void; }

export default function ChangePasswordScreen({ onBack }: Props) {
  const [current,  setCurrent]  = useState("");
  const [next,     setNext]     = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showCur,  setShowCur]  = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [showCon,  setShowCon]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [error,    setError]    = useState("");

  const rules = [
    { label: "At least 8 characters",  ok: next.length >= 8 },
    { label: "Contains a number",      ok: /\d/.test(next) },
    { label: "Passwords match",        ok: next !== "" && next === confirm },
  ];

  const handleSubmit = () => {
    if (!current) { setError("Please enter your current password."); return; }
    if (next.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (next !== confirm) { setError("Passwords do not match."); return; }
    setError("");
    setDone(true);
    setTimeout(() => onBack(), 1800);
  };

  if (done) return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "white", alignItems: "center", justifyContent: "center", gap: 12, padding: 32 }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CheckCircle2 size={32} color="#22c55e" />
      </div>
      <p style={{ fontSize: 15, fontWeight: 900, color: "#111", margin: 0 }}>Password Updated!</p>
      <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, textAlign: "center" }}>Your password has been changed successfully.</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F5F5F5" }}>
      <div style={{ background: "white", padding: "36px 16px 12px", flexShrink: 0, boxShadow: "0 1px 0 #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={15} color="#374151" />
          </button>
          <div>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#111", margin: 0 }}>Change Password</p>
            <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>Update your credentials</p>
          </div>
        </div>
      </div>

      <div className="phone-scroll" style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 10 }}>

        {[
          { label: "Current Password", value: current, set: setCurrent, show: showCur, toggle: () => setShowCur(s => !s) },
          { label: "New Password",     value: next,    set: setNext,    show: showNew, toggle: () => setShowNew(s => !s) },
          { label: "Confirm Password", value: confirm, set: setConfirm, show: showCon, toggle: () => setShowCon(s => !s) },
        ].map(({ label, value, set, show, toggle }) => (
          <div key={label} style={{ background: "white", borderRadius: 14, padding: "10px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", margin: "0 0 6px" }}>{label}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type={show ? "text" : "password"}
                value={value}
                onChange={e => set(e.target.value)}
                placeholder="••••••••"
                style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: "#111", background: "transparent" }}
              />
              <button onClick={toggle} style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}>
                {show ? <EyeOff size={15} color="#9ca3af" /> : <Eye size={15} color="#9ca3af" />}
              </button>
            </div>
          </div>
        ))}

        {/* Rules */}
        <div style={{ background: "white", borderRadius: 14, padding: "10px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: 6 }}>
          {rules.map(r => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.ok ? "#22c55e" : "#d1d5db", flexShrink: 0 }} />
              <p style={{ fontSize: 10, color: r.ok ? "#16a34a" : "#9ca3af", margin: 0, fontWeight: r.ok ? 700 : 400 }}>{r.label}</p>
            </div>
          ))}
        </div>

        {error && <p style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, margin: 0 }}>{error}</p>}

        <button onClick={handleSubmit}
          style={{ width: "100%", padding: "13px", borderRadius: 16, background: "linear-gradient(135deg,#B71C1C,#D32F2F)", color: "white", fontSize: 13, fontWeight: 900, border: "none", cursor: "pointer" }}>
          Update Password
        </button>
      </div>
    </div>
  );
}
