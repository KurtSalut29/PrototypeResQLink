"use client";
import { useState } from "react";
import { Bell, Sparkles, CheckCircle2, Clock, TrendingUp, ClipboardList } from "lucide-react";
import BottomNav from "../navigation/BottomNav";
import IncomingReportAlert from "../IncomingReportAlert";

interface Props {
  onNavigate: (screen: string) => void;
  incomingAlertDismissed?: boolean;
  onIncomingAlertDismiss?: () => void;
}

const RECENT_RESOLVED = [
  { id: "INC-20240430-002", type: "Flood Rescue",      time: "Yesterday",  duration: "38 min" },
  { id: "INC-20240429-001", type: "Road Accident",     time: "2 days ago", duration: "22 min" },
  { id: "INC-20240428-003", type: "Medical Emergency", time: "3 days ago", duration: "15 min" },
];

export default function ResponderDashboard({ onNavigate, incomingAlertDismissed, onIncomingAlertDismiss }: Props) {
  const [onDuty, setOnDuty] = useState(true);

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] relative">

      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">RC</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Good Morning,</p>
              <p className="text-sm font-bold text-gray-900">Cruz — Naval PNP</p>
            </div>
          </div>
          <button className="relative p-2">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#D32F2F] rounded-full text-[8px] text-white flex items-center justify-center font-bold">5</span>
          </button>
        </div>

        {/* On-duty toggle */}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
          <div>
            <p className="text-xs font-bold text-gray-800">On-Duty Status</p>
            <p className={`text-[10px] font-semibold mt-0.5 ${onDuty ? "text-green-600" : "text-gray-400"}`}>
              {onDuty ? "● Active — Ready to respond" : "○ Off duty"}
            </p>
          </div>
          <button onClick={() => setOnDuty(!onDuty)}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${onDuty ? "bg-green-500" : "bg-gray-300"}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${onDuty ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll px-4 py-3 flex flex-col gap-3 pb-24" style={{ minHeight: 0 }}>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Active",    value: "5",  color: "text-[#D32F2F]",  icon: ClipboardList },
            { label: "Today",     value: "7",  color: "text-orange-500", icon: Clock         },
            { label: "Resolved",  value: "42", color: "text-green-600",  icon: CheckCircle2  },
            { label: "Avg. Time", value: "6m", color: "text-blue-600",   icon: TrendingUp    },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl p-2.5 text-center shadow-sm">
              <Icon size={13} className={`${color} mx-auto mb-1`} />
              <p className={`text-base font-black ${color}`}>{value}</p>
              <p className="text-[8px] text-gray-400 font-medium leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Go to incidents CTA */}
        <button onClick={() => onNavigate("incident-management")}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border-l-4 border-[#D32F2F] text-left active:bg-gray-50">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Pending Response</p>
            <span className="text-[9px] bg-[#D32F2F] text-white px-2 py-0.5 rounded-full font-bold">5 NEW</span>
          </div>
          <p className="text-sm font-black text-gray-900">5 Incidents Awaiting</p>
          <p className="text-[10px] text-gray-500 mt-0.5 mb-3">AI has ranked them by severity. Tap to review and accept.</p>
          <div className="flex items-center gap-2 bg-indigo-50 rounded-xl px-3 py-2">
            <Sparkles size={12} className="text-indigo-500 flex-shrink-0" />
            <p className="text-[10px] text-indigo-700 font-semibold">ResQ AI severity analysis ready</p>
          </div>
        </button>

        {/* Performance */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-black text-gray-900 mb-3">This Week</p>
          <div className="flex flex-col gap-2.5">
            {[
              { label: "Response Rate",   value: "98%",   bar: 98,  color: "#22c55e" },
              { label: "Avg. Response",   value: "6 min", bar: 70,  color: "#3b82f6" },
              { label: "Resolved Today",  value: "7",     bar: 58,  color: "#f97316" },
            ].map(({ label, value, bar, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-gray-500 font-medium">{label}</p>
                  <p className="text-[10px] font-black" style={{ color }}>{value}</p>
                </div>
                <div style={{ height: 4, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${bar}%`, background: color, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently resolved */}
        <div>
          <p className="text-xs font-black text-gray-900 mb-2">Recently Resolved</p>
          <div className="flex flex-col gap-2">
            {RECENT_RESOLVED.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={15} className="text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{r.type}</p>
                  <p className="text-[10px] text-gray-400">{r.id} · {r.time}</p>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg flex-shrink-0">{r.duration}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>

      <BottomNav activeScreen="responder-dashboard" onNavigate={onNavigate} role="responder" />
      <IncomingReportAlert role="responder" onView={() => onNavigate("incident-management")} dismissed={incomingAlertDismissed} onDismiss={onIncomingAlertDismiss} />
    </div>
  );
}
