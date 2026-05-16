"use client";
import { useState } from "react";
import { ArrowLeft, Sparkles, Flame, Waves, HeartPulse, Car, ShieldAlert, CheckCircle2, Bell, MapPin, Navigation, PhoneCall, Activity, ChevronRight } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import BottomNav from "../navigation/BottomNav";

interface Props { onBack: () => void; onNavigate?: (screen: string) => void; role?: "responder" | "admin"; }

const INCIDENTS = [
  {
    id: "INC-20240501-004", type: "Structure Fire",    icon: Flame,       iconColor: "#f97316", iconBg: "#fff7ed",
    location: "Brgy. Larrazabal, Naval", time: "Just now",    status: "critical" as const,
    severity: 1, severityLabel: "Critical", severityColor: "#ef4444", severityBg: "#fef2f2",
    aiScore: 97, aiReason: "Active fire with multiple trapped occupants. High spread risk due to wind conditions.",
    responders: 3, injured: true,  reporter: "Maria Santos",
    description: "Structure fire reported at a 2-storey residential building. Smoke visible from 3rd floor. Occupants may still be inside.",
  },
  {
    id: "INC-20240501-003", type: "Medical Emergency", icon: HeartPulse,  iconColor: "#ef4444", iconBg: "#fef2f2",
    location: "Brgy. Padre Iñigo, Naval", time: "4 min ago",  status: "moderate" as const,
    severity: 2, severityLabel: "High",     severityColor: "#f97316", severityBg: "#fff7ed",
    aiScore: 82, aiReason: "Unresponsive patient, possible cardiac arrest. Bystanders performing CPR. Time-critical.",
    responders: 1, injured: true,  reporter: "Juan Dela Cruz",
    description: "Patient is unresponsive, possible cardiac arrest. Bystanders performing CPR. Immediate medical response required.",
  },
  {
    id: "INC-20240501-006", type: "Flood",             icon: Waves,       iconColor: "#3b82f6", iconBg: "#eff6ff",
    location: "Brgy. Sabang, Naval",      time: "9 min ago",  status: "moderate" as const,
    severity: 3, severityLabel: "Moderate", severityColor: "#f59e0b", severityBg: "#fffbeb",
    aiScore: 65, aiReason: "Rising water level reported. 2 families need evacuation. No injuries yet.",
    responders: 0, injured: false, reporter: "Pedro Reyes",
    description: "Flood water rising rapidly near the riverbank. Two families stranded on second floor. No injuries reported yet.",
  },
  {
    id: "INC-20240501-005", type: "Road Accident",     icon: Car,         iconColor: "#ca8a04", iconBg: "#fefce8",
    location: "Naval Highway, Naval",     time: "12 min ago", status: "minor" as const,
    severity: 4, severityLabel: "Low",    severityColor: "#22c55e", severityBg: "#f0fdf4",
    aiScore: 38, aiReason: "Minor collision, no injuries reported. Road partially blocked. Low urgency.",
    responders: 1, injured: false, reporter: "Ana Gomez",
    description: "Two vehicles involved in a minor collision. No injuries. Road partially blocked, traffic building up.",
  },
  {
    id: "INC-20240501-007", type: "Crime Report",      icon: ShieldAlert, iconColor: "#9333ea", iconBg: "#faf5ff",
    location: "Brgy. Poblacion, Naval",   time: "18 min ago", status: "minor" as const,
    severity: 5, severityLabel: "Low",    severityColor: "#22c55e", severityBg: "#f0fdf4",
    aiScore: 29, aiReason: "Theft reported, suspect fled. No violence or injuries. Standard response.",
    responders: 0, injured: false, reporter: "Lito Cruz",
    description: "Theft of motorcycle reported. Suspect fled on foot heading north. No violence involved.",
  },
];

type IncidentStatus = "pending" | "accepted" | "en-route" | "on-scene" | "resolved";

function SeverityBar({ score }: { score: number }) {
  const color = score >= 80 ? "#ef4444" : score >= 60 ? "#f97316" : score >= 40 ? "#f59e0b" : "#22c55e";
  return (
    <div style={{ height: 4, background: "#f3f4f6", borderRadius: 99, overflow: "hidden", flex: 1 }}>
      <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 99, transition: "width 0.6s" }} />
    </div>
  );
}

function Toast({ name }: { name: string }) {
  return (
    <div style={{
      position: "absolute", bottom: 90, left: "50%", transform: "translateX(-50%)",
      background: "#111", borderRadius: 14, padding: "10px 16px",
      display: "flex", alignItems: "center", gap: 8, zIndex: 999,
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)", whiteSpace: "nowrap",
    }}>
      <Bell size={13} color="#22c55e" />
      <p style={{ fontSize: 11, color: "white", fontWeight: 700, margin: 0 }}>
        {name} has been notified — help is on the way
      </p>
    </div>
  );
}

export default function IncidentManagement({ onBack, onNavigate, role = "responder" }: Props) {
  const [statuses, setStatuses] = useState<Record<string, IncidentStatus>>(
    Object.fromEntries(INCIDENTS.map(i => [i.id, "pending"]))
  );
  const [toast,        setToast]        = useState<string | null>(null);
  const [activeDetail, setActiveDetail] = useState<string | null>(null);
  const [supportSent,  setSupportSent]  = useState<Record<string, boolean>>({});

  function accept(id: string, reporter: string) {
    setStatuses(s => ({ ...s, [id]: "accepted" }));
    setToast(reporter);
    setTimeout(() => setToast(null), 3000);
  }

  function updateStatus(id: string, s: IncidentStatus) {
    setStatuses(prev => ({ ...prev, [id]: s }));
  }

  // ── Detail view ────────────────────────────────────────────────────────────
  const detail = activeDetail ? INCIDENTS.find(i => i.id === activeDetail) : null;
  if (detail) {
    const st = statuses[detail.id];
    const steps: IncidentStatus[] = ["accepted", "en-route", "on-scene", "resolved"];
    const stepLabels = ["Accepted", "En Route", "On Scene", "Resolved"];

    return (
      <div className="flex flex-col h-full bg-[#F5F5F5]">
        {/* Header */}
        <div className="bg-white px-4 pt-10 pb-3 flex items-center gap-3 shadow-sm flex-shrink-0">
          <button onClick={() => setActiveDetail(null)} className="p-1.5 rounded-xl bg-gray-100">
            <ArrowLeft size={16} className="text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-black text-gray-900">{detail.type}</h1>
            <p className="text-[10px] text-gray-400">{detail.id}</p>
          </div>
          <StatusBadge status={detail.status} />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto phone-scroll px-4 py-4 flex flex-col gap-3 pb-24" style={{ minHeight: 0 }}>

          {/* Info */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">AI Severity Score</p>
                <div className="flex items-center gap-2">
                  <SeverityBar score={detail.aiScore} />
                  <span className="text-xs font-black" style={{ color: detail.severityColor }}>{detail.aiScore}%</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ color: detail.severityColor, background: detail.severityBg }}>{detail.severityLabel}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400">Reported By</p>
                <p className="text-xs font-semibold text-gray-800">{detail.reporter}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
              <MapPin size={12} className="text-gray-400" />
              <p className="text-xs text-gray-600">{detail.location}</p>
            </div>
            <div className="mt-2 h-24 rounded-xl bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center border border-gray-200">
              <div className="flex flex-col items-center gap-1">
                <MapPin size={20} className="text-[#D32F2F]" />
                <span className="text-[9px] text-gray-500 font-medium">{detail.location}</span>
              </div>
            </div>
          </div>

          {/* AI analysis */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3 flex items-start gap-2">
            <Sparkles size={12} className="text-indigo-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-indigo-700 leading-relaxed">
              <span className="font-bold">ResQ AI Analysis: </span>{detail.aiReason}
            </p>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-800 mb-2">Description</p>
            <p className="text-xs text-gray-600 leading-relaxed">{detail.description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {detail.injured && (
              <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-[10px] font-bold">⚠ Injuries Reported</span>
            )}
            {detail.responders > 0
              ? <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-medium">{detail.responders} responder(s) responding</span>
              : <span className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl text-[10px] font-bold">No responder assigned yet</span>
            }
            <span className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-xl text-[10px] font-medium">{detail.time}</span>
          </div>

          {/* Photo */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="h-28 bg-gradient-to-br from-orange-300 to-red-500 flex items-center justify-center">
              <Activity size={28} className="text-white/50" />
            </div>
            <div className="px-3 py-2">
              <p className="text-[10px] text-gray-400">Photo submitted with report</p>
            </div>
          </div>

          {/* Accept or notification banner */}
          {st === "pending" ? (
            <button
              onClick={() => accept(detail.id, detail.reporter)}
              className="w-full py-3.5 rounded-2xl text-white text-sm font-black flex items-center justify-center gap-2 active:opacity-80"
              style={{ background: `linear-gradient(135deg, ${detail.severityColor}, ${detail.iconColor})` }}>
              <CheckCircle2 size={16} />
              Accept & Notify Resident
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
              <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
              <p className="text-xs font-bold text-green-700">{detail.reporter} has been notified — help is on the way</p>
            </div>
          )}

          {/* Status stepper */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-800 mb-3">Update Response Status</p>
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              {steps.map((s, i) => (
                <button key={s} onClick={() => updateStatus(detail.id, s)}
                  className={`flex-1 py-2.5 text-[9px] font-bold transition-all ${st === s ? "bg-[#D32F2F] text-white" : "bg-white text-gray-500"}`}>
                  {stepLabels[i]}
                </button>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <button
            onClick={() => onNavigate ? onNavigate("map") : onBack()}
            className="w-full py-3 rounded-2xl border-2 border-[#D32F2F] text-[#D32F2F] text-xs font-bold flex items-center justify-center gap-2 active:bg-red-50">
            <Navigation size={14} />
            Navigate to Incident
          </button>

          {/* Field notes */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-800 mb-2">Field Notes</p>
            <textarea
              placeholder="Add observations, actions taken..."
              rows={3}
              className="phone-input w-full text-xs text-gray-700 bg-gray-50 rounded-xl p-3 outline-none resize-none border border-gray-200 focus:border-[#D32F2F] transition-colors"
            />
          </div>

          {/* Request support */}
          {supportSent[detail.id] ? (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
              <CheckCircle2 size={14} className="text-orange-500 flex-shrink-0" />
              <p className="text-xs font-bold text-orange-700">Additional support has been requested — backup is on the way</p>
            </div>
          ) : (
            <button
              onClick={() => setSupportSent(s => ({ ...s, [detail.id]: true }))}
              className="w-full py-3 rounded-2xl border-2 border-orange-400 text-orange-500 text-xs font-bold flex items-center justify-center gap-2 active:bg-orange-50">
              <PhoneCall size={14} />
              Request Additional Support
            </button>
          )}

          {/* Resolve */}
          <button
            onClick={() => { updateStatus(detail.id, "resolved"); setActiveDetail(null); }}
            className="w-full py-4 rounded-2xl bg-[#D32F2F] text-white font-bold text-sm shadow-lg active:opacity-80">
            Mark as Resolved
          </button>

        </div>

        {toast && <Toast name={toast} />}
      </div>
    );
  }

  // ── Queue list ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">
      <div className="bg-white px-4 pt-10 pb-3 flex items-center gap-3 shadow-sm flex-shrink-0">
        <button onClick={onBack} className="p-1.5 rounded-xl bg-gray-100">
          <ArrowLeft size={16} className="text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-black text-gray-900">Incident Queue</h1>
          <p className="text-[10px] text-gray-400">Tap an incident to view full details</p>
        </div>
        <div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1.5 rounded-xl">
          <Sparkles size={11} className="text-indigo-500" />
          <span className="text-[10px] font-bold text-indigo-600">AI Ranked</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll px-4 py-3 flex flex-col gap-2 pb-24" style={{ minHeight: 0 }}>
        {INCIDENTS.map((inc) => {
          const st = statuses[inc.id];
          const isAccepted = st !== "pending";
          const Icon = inc.icon;

          return (
            <button
              key={inc.id}
              onClick={() => setActiveDetail(inc.id)}
              className="w-full bg-white rounded-2xl px-3 py-3 flex items-center gap-3 text-left shadow-sm active:bg-gray-50"
            >
              {/* Rank */}
              <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: inc.severityBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: inc.severityColor }}>#{inc.severity}</span>
              </div>

              {/* Icon */}
              <div style={{ width: 36, height: 36, borderRadius: 10, background: inc.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} color={inc.iconColor} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-xs font-bold text-gray-800 truncate">{inc.type}</p>
                  <span style={{ fontSize: 9, fontWeight: 700, color: inc.severityColor, background: inc.severityBg, padding: "1px 6px", borderRadius: 99, flexShrink: 0 }}>
                    {inc.severityLabel}
                  </span>
                  {isAccepted && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", padding: "1px 6px", borderRadius: 99, flexShrink: 0 }}>
                      {st === "resolved" ? "Resolved" : "Accepted"}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 truncate">{inc.location} · {inc.time}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Sparkles size={9} className="text-indigo-400 flex-shrink-0" />
                  <SeverityBar score={inc.aiScore} />
                  <span style={{ fontSize: 9, fontWeight: 800, color: inc.severityColor }}>{inc.aiScore}%</span>
                </div>
              </div>

              <ChevronRight size={14} color="#d1d5db" className="flex-shrink-0" />
            </button>
          );
        })}
        <div className="h-4" />
      </div>

      <BottomNav
        activeScreen="incident-management"
        onNavigate={onNavigate ?? onBack}
        role={role}
      />

      {toast && <Toast name={toast} />}
    </div>
  );
}
