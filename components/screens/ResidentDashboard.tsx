"use client";
import { Bell, X, MapPin, TriangleAlert, ClipboardList, ChevronRight, Activity, Sparkles, Flame, Waves, HeartPulse, Car, ShieldAlert, MoreHorizontal, CheckCircle2, FileText, Camera, Mic, MicOff, ImagePlus } from "lucide-react";
import { useState, useEffect } from "react";
import BottomNav from "../navigation/BottomNav";
import StatusBadge from "../ui/StatusBadge";
import IncidentCard from "../ui/IncidentCard";
import { usePWD } from "../PWDContext";
import ReportAcceptedAlert from "../ReportAcceptedAlert";


interface ResidentDashboardProps {
  onNavigate: (screen: string) => void;
  reportAcceptedDismissed?: boolean;
  onReportAcceptedDismiss?: () => void;
}

const progressSteps = ["Reported", "Dispatched", "On Scene", "Resolved"];
// activeStep is dynamic based on reportAccepted

const incidentTypes = [
  { label: "Fire",     icon: Flame,          color: "#f97316", bg: "#fff7ed" },
  { label: "Flood",    icon: Waves,          color: "#3b82f6", bg: "#eff6ff" },
  { label: "Medical",  icon: HeartPulse,     color: "#ef4444", bg: "#fef2f2" },
  { label: "Accident", icon: Car,            color: "#ca8a04", bg: "#fefce8" },
  { label: "Crime",    icon: ShieldAlert,    color: "#9333ea", bg: "#faf5ff" },
  { label: "Other",    icon: MoreHorizontal, color: "#6b7280", bg: "#f9fafb" },
];

export default function ResidentDashboard({ onNavigate, reportAcceptedDismissed, onReportAcceptedDismiss }: ResidentDashboardProps) {
  const [alertVisible, setAlertVisible] = useState(true);
  const [sosOpen, setSosOpen]           = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sosStep, setSosStep]           = useState<"type" | "capture" | "analyzing" | "sent">("type");
  const [photoTaken, setPhotoTaken]     = useState(false);
  const [recording, setRecording]       = useState(false);
  const [voiceDesc, setVoiceDesc]       = useState("");
  const [countdown, setCountdown]       = useState(3);
  const [reportAccepted, setReportAccepted] = useState(false);
  const { blind, deaf, motor }          = usePWD();

  // Countdown after SOS sent
  useEffect(() => {
    if (sosStep !== "sent") return;
    if (countdown === 0) {
      setSosOpen(false);
      setSosStep("type");
      setSelectedType(null);
      setPhotoTaken(false);
      setVoiceDesc("");
      setCountdown(3); // reset for next use
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [sosStep, countdown]);

  // AI analyzing → sent
  useEffect(() => {
    if (sosStep !== "analyzing") return;
    const t = setTimeout(() => { setSosStep("sent"); setCountdown(3); }, 2500);
    return () => clearTimeout(t);
  }, [sosStep]);

  const handleSOS = () => {
    if (!selectedType) return;
    setSosStep("analyzing");
  };

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      setVoiceDesc("People are trapped inside the building, smoke is coming from the second floor.");
    } else {
      setRecording(true);
    }
  };

  const openSOS = () => { setSosOpen(true); setSosStep("type"); setSelectedType(null); setPhotoTaken(false); setVoiceDesc(""); setCountdown(3); };
  const closeSOS = () => { if (sosStep !== "analyzing" && sosStep !== "sent") setSosOpen(false); };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] relative">

      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-4 flex-shrink-0" style={{ boxShadow: "0 1px 0 #f0f0f0" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-black">JD</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">Good Morning,</p>
              <p className="text-sm font-black text-gray-900">Juan Dela Cruz</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("notifications")}
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-100"
            aria-label="Notifications"
          >
            <Bell size={17} className="text-gray-600" />
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#D32F2F] rounded-full text-[8px] text-white flex items-center justify-center font-black">3</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll flex flex-col gap-0 pb-24" style={{ minHeight: 0 }}>

        {/* PWD accessibility status cards */}
        {(blind || deaf || motor) && (
          <div className="mx-4 mt-3 flex flex-col gap-1.5">
            {blind && (
              <div className="flex items-center gap-2.5 bg-indigo-950 rounded-2xl px-4 py-2.5">
                <span style={{ fontSize: 13 }}>👁</span>
                <p style={{ fontSize: 10, fontWeight: 800, color: "white", margin: 0 }}>High Contrast Mode ON — Large text enabled</p>
              </div>
            )}
            {deaf && (
              <div className="flex items-center gap-2.5 bg-amber-100 border border-amber-200 rounded-2xl px-4 py-2.5">
                <span style={{ fontSize: 13 }}>🔔</span>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#78350f", margin: 0 }}>Visual Alerts ON — Sound replaced with flash &amp; vibration</p>
              </div>
            )}
            {motor && (
              <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5">
                <span style={{ fontSize: 13 }}>✋</span>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#92400e", margin: 0 }}>Motor Mode ON — Larger tap targets enabled</p>
              </div>
            )}
          </div>
        )}

        {/* Alert banner */}
        {alertVisible && (
          <div className="mx-4 mt-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <TriangleAlert size={14} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-800">Flood Warning Active</p>
                <p className="text-[10px] text-amber-600 mt-0.5">Barangay Padre Iñigo, Naval</p>
              </div>
            </div>
            <button onClick={() => setAlertVisible(false)} className="text-amber-400 p-1 ml-2">
              <X size={13} />
            </button>
          </div>
        )}

        {/* ── SOS HERO BUTTON ── */}
        <div className="mx-4 mt-4 flex flex-col items-center">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-3">
            Emergency? Tap SOS
          </p>

          {/* Big SOS circle */}
          <button
            onClick={openSOS}
            aria-label="SOS Emergency Button"
            className="relative flex items-center justify-center active:scale-95 transition-transform"
            style={{ width: motor ? 160 : 140, height: motor ? 160 : 140 }}
          >
            <span className="absolute rounded-full animate-ping" style={{ inset: 0, background: "rgba(211,47,47,0.12)" }} />
            <span className="absolute rounded-full" style={{ inset: 12, background: "rgba(211,47,47,0.10)" }} />
            <span
              className="absolute rounded-full flex flex-col items-center justify-center gap-0.5"
              style={{
                inset: 22,
                background: "linear-gradient(135deg, #B71C1C, #FF5252)",
                boxShadow: "0 8px 32px rgba(211,47,47,0.55)",
              }}
            >
              <span className="text-white font-black tracking-widest" style={{ fontSize: blind ? 26 : 20 }}>SOS</span>
              <span className="text-white/70 font-semibold tracking-wider" style={{ fontSize: blind ? 10 : 8 }}>EMERGENCY</span>
            </span>
          </button>

          <p className="font-black text-gray-900 mt-3" style={{ fontSize: blind ? 16 : 14 }}>Quick Emergency Report</p>
          <p className="text-gray-400 mt-0.5 text-center" style={{ fontSize: blind ? 12 : 10 }}>
            Faster than calling a hotline — report in under 5 seconds
          </p>
        </div>

        {/* Detailed report link */}
        <div className="mx-4 mt-3">
          <button
            onClick={() => onNavigate("incident-report")}
            className="w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-3 active:bg-gray-50 transition-colors"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <FileText size={16} className="text-[#D32F2F]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-bold text-gray-800">Detailed Report</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Add description, photo & more info</p>
            </div>
            <ChevronRight size={15} className="text-gray-300" />
          </button>
        </div>

        {/* Quick actions row */}
        <div className="mx-4 mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => onNavigate("map")}
            className="bg-white rounded-2xl px-3 py-3 flex items-center gap-2.5 active:bg-gray-50 transition-colors"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <MapPin size={15} className="text-blue-500" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-gray-800 leading-tight">Evacuation</p>
              <p className="text-[9px] text-gray-400">Centers nearby</p>
            </div>
          </button>
          <button
            onClick={() => onNavigate("ai-assistant")}
            className="rounded-2xl px-3 py-3 flex items-center gap-2.5 active:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={15} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-white leading-tight">ResQ AI</p>
              <p className="text-[9px] text-white/70">Ask anything</p>
            </div>
          </button>
        </div>

        {/* Active Incident Tracker */}
        <div className="mx-4 mt-3 bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-[#D32F2F]" />
              <p className="text-xs font-black text-gray-900">Active Incident</p>
            </div>
            <StatusBadge status={reportAccepted ? "dispatched" : "in-progress"} />
          </div>
          <div className="px-4 pt-3 pb-4">
            <p className="text-[10px] text-gray-400 mb-0.5">Report ID</p>
            <p className="text-sm font-black text-gray-900 mb-1">INC-20240501-003</p>
            <p className="text-xs text-gray-500 mb-3">Medical Emergency · Brgy. Padre Iñigo</p>
            {reportAccepted && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-3">
                <CheckCircle2 size={13} className="text-green-600 flex-shrink-0" />
                <p className="text-[10px] font-bold text-green-700">Officer R. Cruz accepted — En Route · ~4 min</p>
              </div>
            )}
            <div className="flex items-start">
              {progressSteps.map((step, i) => {
                const activeStep = reportAccepted ? 2 : 1;
                return (
                  <div key={i} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      i < activeStep ? "bg-[#D32F2F]" :
                      i === activeStep ? "bg-[#D32F2F] ring-4 ring-red-100" : "bg-gray-200"
                    }`}>
                      {i < activeStep && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3 5.5L6.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className={`text-[8px] mt-1.5 font-semibold text-center leading-tight ${
                      i <= activeStep ? "text-[#D32F2F]" : "text-gray-400"
                    }`} style={{ maxWidth: 38 }}>{step}</span>
                  </div>
                  {i < progressSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-5 mx-0.5 ${i < activeStep ? "bg-[#D32F2F]" : "bg-gray-200"}`} />
                  )}
                </div>
                );
              })}
            </div>
            <button
              onClick={() => onNavigate("incident-detail")}
              className="w-full mt-4 py-2.5 rounded-xl border border-[#D32F2F] text-[#D32F2F] text-xs font-bold active:bg-red-50 transition-colors"
            >
              View Details &amp; Live Tracking
            </button>
          </div>
        </div>

        {/* My Reports */}
        <div className="mx-4 mt-3 mb-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <ClipboardList size={14} className="text-gray-500" />
              <p className="text-xs font-black text-gray-900">My Reports</p>
            </div>
            <button onClick={() => onNavigate("my-reports")} className="text-[10px] text-[#D32F2F] font-bold">See all</button>
          </div>
          <div className="flex flex-col gap-2">
            <IncidentCard id="INC-003" type="Medical Emergency" status="in-progress" location="Brgy. Padre Iñigo" time="9:01 AM" onClick={() => onNavigate("incident-detail")} />
            <IncidentCard id="INC-002" type="Flood" status="resolved" location="Brgy. Padre Iñigo" time="Yesterday" onClick={() => onNavigate("incident-detail")} />
            <IncidentCard id="INC-001" type="Road Accident" status="resolved" location="Brgy. Padre Iñigo" time="3 days ago" onClick={() => onNavigate("incident-detail")} />
          </div>
        </div>
      </div>

      <BottomNav activeScreen="resident-dashboard" onNavigate={onNavigate} role="resident" />

      {/* Report Accepted Notification */}
      <ReportAcceptedAlert
        onViewDetail={() => { setReportAccepted(true); onNavigate("incident-detail"); }}
        dismissed={reportAcceptedDismissed}
        onDismiss={onReportAcceptedDismiss}
      />

      {/* ── QUICK SOS BOTTOM SHEET ── */}
      {sosOpen && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={closeSOS} />

          {/* Sheet */}
          <div className="relative bg-white rounded-t-3xl px-5 pt-5 pb-8 z-10">

            {/* ── STEP: SENT ── */}
            {sosStep === "sent" && (
              <div className="flex flex-col items-center py-4 gap-3">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <p className="text-base font-black text-gray-900">SOS Sent!</p>
                <p className="text-xs text-gray-500 text-center">Responders have been notified. Help is on the way.</p>
                <div className="w-full bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400">Report ID</p>
                    <p className="text-sm font-black text-gray-900">INC-20240501-004</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">Est. Arrival</p>
                    <p className="text-xs font-black text-green-600">~4 minutes</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400">Closing in {countdown}s...</p>
              </div>
            )}

            {/* ── STEP: AI ANALYZING ── */}
            {sosStep === "analyzing" && (
              <div className="flex flex-col items-center py-8 gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center relative"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  <Sparkles size={28} className="text-white" />
                  <span className="absolute inset-0 rounded-full animate-ping opacity-30"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-gray-900">ResQ AI Analyzing...</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {photoTaken && voiceDesc ? "Processing photo and voice description" :
                     photoTaken ? "Analyzing photo evidence" :
                     voiceDesc ? "Processing voice description" :
                     "Estimating severity from incident type"}
                  </p>
                </div>
                <div className="w-full bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 flex flex-col gap-2">
                  {["Detecting incident severity", "Matching nearest responders", "Preparing alert"].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin flex-shrink-0"
                        style={{ animationDelay: `${i * 0.3}s` }} />
                      <p className="text-[10px] text-indigo-600 font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP: TYPE SELECTION ── */}
            {sosStep === "type" && (
              <>
                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-base font-black text-gray-900">Quick SOS Report</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Select incident type and send instantly</p>
                  </div>
                  <button onClick={closeSOS} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                    <X size={13} className="text-gray-500" />
                  </button>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex items-center gap-2 mb-4 mt-3">
                  <CheckCircle2 size={13} className="text-green-600 flex-shrink-0" />
                  <p className="text-[10px] text-green-700 font-semibold">
                    Avg. report time: <span className="font-black">4 seconds</span> vs 3–5 min hotline wait
                  </p>
                </div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wide mb-2">What is the emergency?</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {incidentTypes.map(({ label, icon: Icon, color, bg }) => {
                    const active = selectedType === label;
                    return (
                      <button key={label} onClick={() => setSelectedType(label)}
                        className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all active:scale-95"
                        style={{ borderColor: active ? color : "#e5e7eb", background: active ? bg : "white" }}>
                        <Icon size={20} style={{ color }} />
                        <span className="text-[10px] font-bold" style={{ color: active ? color : "#6b7280" }}>{label}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => selectedType && setSosStep("capture")}
                  disabled={!selectedType}
                  className="w-full py-3.5 rounded-2xl text-white font-black text-sm transition-all active:opacity-80"
                  style={{ background: selectedType ? "linear-gradient(135deg, #B71C1C, #FF5252)" : "#d1d5db" }}>
                  Next — Capture Photo & Description
                </button>
                <p className="text-center text-[9px] text-gray-400 mt-2">Your location and profile are automatically attached</p>
              </>
            )}

            {/* ── STEP: CAPTURE ── */}
            {sosStep === "capture" && (
              <>
                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-base font-black text-gray-900">Help AI Assess the Situation</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">A photo and description are required for accurate AI analysis</p>
                  </div>
                  <button onClick={closeSOS} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                    <X size={13} className="text-gray-500" />
                  </button>
                </div>

                {/* Photo capture */}
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wide mb-2">Photo</p>
                <button
                  onClick={() => setPhotoTaken(p => !p)}
                  className="w-full rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 mb-4 transition-all active:scale-95"
                  style={{
                    height: 90,
                    borderColor: photoTaken ? "#22c55e" : "#d1d5db",
                    background: photoTaken ? "#f0fdf4" : "#f9fafb",
                  }}>
                  {photoTaken ? (
                    <>
                      <ImagePlus size={18} className="text-green-500" />
                      <span className="text-xs font-bold text-green-600">Photo captured ✓</span>
                    </>
                  ) : (
                    <>
                      <Camera size={18} className="text-gray-400" />
                      <span className="text-xs text-gray-400 font-medium">Tap to take a photo</span>
                    </>
                  )}
                </button>

                {/* Voice description */}
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wide mb-2">Voice Description</p>
                <div className="flex items-center gap-3 mb-1">
                  <button
                    onClick={toggleRecording}
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
                    style={{ background: recording ? "#ef4444" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      boxShadow: recording ? "0 0 0 6px rgba(239,68,68,0.2)" : "none" }}>
                    {recording ? <MicOff size={18} className="text-white" /> : <Mic size={18} className="text-white" />}
                  </button>
                  <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 min-h-[44px] flex items-center">
                    {recording ? (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[11px] text-red-500 font-semibold">Listening...</span>
                      </div>
                    ) : voiceDesc ? (
                      <p className="text-[11px] text-gray-700 leading-relaxed">{voiceDesc}</p>
                    ) : (
                      <p className="text-[11px] text-gray-400">Tap mic to describe the emergency</p>
                    )}
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 flex items-start gap-2 mt-3 mb-4">
                  <Sparkles size={12} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-indigo-600">
                    <span className="font-bold">ResQ AI</span> needs your photo and description to accurately determine the severity of this incident.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setSosStep("type")}
                    className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm active:bg-gray-50">
                    Back
                  </button>
                  <button
                    onClick={handleSOS}
                    disabled={!photoTaken && !voiceDesc}
                    className="flex-[2] py-3.5 rounded-2xl text-white font-black text-sm active:opacity-80 flex items-center justify-center gap-2"
                    style={{
                      background: (photoTaken || voiceDesc) ? "linear-gradient(135deg, #B71C1C, #FF5252)" : "#d1d5db",
                      boxShadow: (photoTaken || voiceDesc) ? "0 4px 20px rgba(211,47,47,0.4)" : "none",
                    }}>
                    <span>🆘</span>
                    Send SOS
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
