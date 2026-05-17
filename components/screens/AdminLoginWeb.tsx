"use client";
import { useState } from "react";
import { Shield, Eye, EyeOff, Globe, ShieldCheck, ArrowLeft, CheckCircle2, User, Lock, Mail, Phone, Building2, ChevronDown } from "lucide-react";

interface Props {
  role: "admin" | "superadmin";
  mode: "login" | "register";
  onLogin: () => void;
  onBack: () => void;           // back to role-select
  onSwitchMode: () => void;     // toggle login ↔ register
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

const CONFIG = {
  admin: {
    gradient: "linear-gradient(135deg, #7f0000 0%, #B71C1C 60%, #c62828 100%)",
    accentColor: "#D32F2F",
    accentHover: "#B71C1C",
    accentLight: "#fef2f2",
    accentBorder: "#fecaca",
    icon: ShieldCheck,
    title: "Station Admin Portal",
    subtitle: "ResQLink Emergency Response System",
    badge: "Station Administrator",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
    features: [
      "Manage station responders",
      "Monitor active incidents",
      "Approve responder registrations",
      "Access live response map",
    ],
  },
  superadmin: {
    gradient: "linear-gradient(135deg, #3b0764 0%, #6d28d9 60%, #7c3aed 100%)",
    accentColor: "#7c3aed",
    accentHover: "#6d28d9",
    accentLight: "#f5f3ff",
    accentBorder: "#ddd6fe",
    icon: Globe,
    title: "Super Admin Portal",
    subtitle: "ResQLink System Administration",
    badge: "System Administrator",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
    features: [
      "Oversee all municipalities",
      "Manage all stations & users",
      "System-wide incident monitoring",
      "Configure ResQLink settings",
    ],
  },
};

export default function AdminLoginWeb({ role, mode, onLogin, onBack, onSwitchMode }: Props) {
  const [showPass, setShowPass]         = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPass, setConfirmPass]   = useState("");
  const [fullName, setFullName]         = useState("");
  const [stationName, setStationName]   = useState("");
  const [contactNo, setContactNo]       = useState("");
  const [station, setStation]           = useState("");

  const cfg = CONFIG[role];
  const Icon = cfg.icon;
  const isLogin = mode === "login";

  // Station selection is required for admin login; superadmin has system-wide scope
  const needsStation = role === "admin" && isLogin;
  const canSubmit = !needsStation || station !== "";

  return (
    <div className="desktop-layout min-h-screen w-screen flex" style={{ background: "#f8fafc" }}>

      {/* ── LEFT PANEL — branding ── */}
      <div
        className="hidden md:flex flex-col justify-between md:w-[320px] lg:w-[420px] flex-shrink-0 p-8 lg:p-10"
        style={{ background: cfg.gradient }}
      >
        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-lg tracking-wide leading-tight">ResQLink</p>
              <p className="text-white/50 text-[10px] tracking-widest uppercase">Biliran Island</p>
            </div>
          </div>

          <h1 className="text-3xl font-black text-white leading-tight mb-3">
            {isLogin ? "Welcome back." : "Create your account."}
          </h1>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            {isLogin
              ? `Sign in to your ${cfg.badge} account to manage emergency response operations.`
              : `Register as a ${cfg.badge} to start managing emergency response operations.`}
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-3">
            {cfg.features.map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={11} className="text-white" />
                </div>
                <span className="text-white/80 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom info */}
        <div>
          <div className="h-px bg-white/10 mb-6" />
          <p className="text-white/40 text-xs">
            Biliran Island Emergency Response System · Philippines
          </p>
          <p className="text-white/25 text-[10px] mt-1">
            Fast · Safe · Reported
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="flex-1 flex items-start md:items-center justify-center p-6 md:p-8 overflow-auto min-h-screen md:min-h-0">
        <div className="w-full max-w-md py-6 md:py-0">

          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to role selection
          </button>

          {/* Role badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}>
              {cfg.badge}
            </span>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-1">
            {isLogin ? "Sign in" : "Create account"}
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            {isLogin
              ? "Enter your credentials to access the portal."
              : "Fill in your details to register for access."}
          </p>

          {/* Form */}
          <form
            onSubmit={e => { e.preventDefault(); onLogin(); }}
            className="flex flex-col gap-4"
          >
            {/* Register-only fields */}
            {!isLogin && (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 outline-none transition-colors focus:border-gray-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    {role === "admin" ? "Station Name" : "Jurisdiction"}
                  </label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={stationName}
                      onChange={e => setStationName(e.target.value)}
                      placeholder={role === "admin" ? "Naval PNP Station" : "Biliran Island"}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 outline-none transition-colors focus:border-gray-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Contact Number</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={contactNo}
                      onChange={e => setContactNo(e.target.value)}
                      placeholder="+63 9XX XXX XXXX"
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 outline-none transition-colors focus:border-gray-400 focus:bg-white"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@resqlink.gov.ph"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50 outline-none transition-colors focus:border-gray-400 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm bg-gray-50 outline-none transition-colors focus:border-gray-400 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm password (register only) */}
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Confirm Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm bg-gray-50 outline-none transition-colors focus:border-gray-400 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* Station selector — admin login only */}
            {needsStation && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Your Station</label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={station}
                    onChange={e => setStation(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-9 py-3 text-sm bg-gray-50 outline-none transition-colors focus:border-gray-400 focus:bg-white appearance-none"
                    style={{ color: station ? "#111827" : "#9ca3af" }}
                  >
                    <option value="" disabled>Select your station…</option>
                    {STATIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Forgot password (login only) */}
            {isLogin && (
              <div className="flex justify-end -mt-1">
                <button type="button" className="text-xs font-semibold hover:underline"
                  style={{ color: cfg.accentColor }}>
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-sm transition-opacity mt-2 ${canSubmit ? "hover:opacity-90" : "opacity-40 cursor-not-allowed"}`}
              style={{ background: cfg.gradient }}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Switch mode */}
          <p className="text-center text-sm text-gray-400 mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={onSwitchMode}
              className="font-bold hover:underline"
              style={{ color: cfg.accentColor }}
            >
              {isLogin ? "Register" : "Sign in"}
            </button>
          </p>

          {/* Security note */}
          <div className="mt-8 flex items-start gap-2.5 p-3.5 rounded-xl border"
            style={{ background: cfg.accentLight, borderColor: cfg.accentBorder }}>
            <Shield size={14} className="flex-shrink-0 mt-0.5" style={{ color: cfg.accentColor }} />
            <p className="text-xs leading-relaxed" style={{ color: cfg.accentColor }}>
              <span className="font-bold">Authorized personnel only.</span>{" "}
              {role === "admin"
                ? "Station Admin accounts require approval from the Super Administrator before access is granted."
                : "Super Admin accounts are provisioned by the ResQLink system team."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
