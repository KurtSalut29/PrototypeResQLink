"use client";
import { useState } from "react";
import { Shield, Eye, EyeOff, ArrowLeft, Building2, ChevronDown } from "lucide-react";

interface LoginScreenProps {
  role: "resident" | "responder" | "admin" | "superadmin";
  onLogin: () => void;
  onBack: () => void;
  onRegister: () => void;
}

const STATIONS = [
  "Naval PNP Station",
  "Biliran PNP Station",
  "Caibiran PNP Station",
  "Almeria PNP Station",
  "Kawayan PNP Station",
  "Culaba PNP Station",
  "Cabucgayan PNP Station",
  "Naval BFP Station",
  "Biliran BFP Station",
  "Naval MDRRMO",
];

export default function LoginScreen({ role, onLogin, onBack, onRegister }: LoginScreenProps) {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [station, setStation]   = useState("");

  const needsStation = role === "responder" || role === "admin";
  const canSubmit = !needsStation || station !== "";

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-8 relative flex-shrink-0"
        style={{ background: role === "responder" ? "linear-gradient(135deg, #1e3a5f, #1d4ed8)" : role === "admin" ? "linear-gradient(135deg, #78350f, #d97706)" : role === "superadmin" ? "linear-gradient(135deg, #4c1d95, #7c3aed)" : "linear-gradient(135deg, #B71C1C, #D32F2F)" }}
      >
        <button onClick={onBack} className="absolute top-12 left-5 text-white/80 p-1">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center pt-2">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-black text-white">ResQLink</h1>
          <span className="text-[10px] text-white/60 tracking-widest uppercase mt-0.5">
            {role === "resident" ? "Resident Portal" : role === "admin" ? "Station Admin Portal" : role === "superadmin" ? "Super Admin Portal" : "Responder Portal"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll px-6 pt-7 pb-6 flex flex-col">
        <h2 className="text-2xl font-black text-gray-900 mb-1">Welcome back</h2>
        <p className="text-xs text-gray-500 mb-6">Sign in to your account</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="juan@example.com"
              className="phone-input w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none focus:border-[#D32F2F] transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="phone-input w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none focus:border-[#D32F2F] transition-colors pr-11"
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="text-xs text-[#D32F2F] font-semibold">Forgot password?</button>
          </div>

          {/* Station selector — only for responder and admin */}
          {needsStation && (
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block flex items-center gap-1">
                <Building2 size={12} className="text-gray-500" />
                {role === "admin" ? "Your Station" : "Assigned Station"}
              </label>
              <div className="relative">
                <select
                  value={station}
                  onChange={e => setStation(e.target.value)}
                  className="phone-input w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none focus:border-[#D32F2F] transition-colors appearance-none pr-9"
                  style={{ color: station ? "#111827" : "#9ca3af" }}
                >
                  <option value="" disabled>Select your station…</option>
                  {STATIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => { if (canSubmit) onLogin(); }}
          disabled={!canSubmit}
          className={`w-full mt-6 py-4 rounded-full text-white font-bold text-sm shadow-lg transition-opacity ${canSubmit ? "bg-[#D32F2F] active:opacity-80" : "bg-gray-300 cursor-not-allowed"}`}
        >
          Sign In
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Don&apos;t have an account?{" "}
          <button onClick={onRegister} className="text-[#D32F2F] font-semibold">Register</button>
        </p>
      </div>
    </div>
  );
}
