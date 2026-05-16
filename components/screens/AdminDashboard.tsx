"use client";
import { useState } from "react";
import { Settings, Users, ShieldCheck, Bell, ClipboardList, ChevronRight, CheckCircle2, Clock, XCircle, TriangleAlert } from "lucide-react";
import BottomNav from "../navigation/BottomNav";
import IncomingReportAlert from "../IncomingReportAlert";

interface AdminDashboardProps {
  onNavigate: (screen: string) => void;
  incomingAlertDismissed?: boolean;
  onIncomingAlertDismiss?: () => void;
}

const pendingResponders = [
  { name: "Officer M. Santos",  badge: "PNP-BIL-0051", station: "Naval PNP Station" },
  { name: "Officer L. Reyes",   badge: "PNP-BIL-0052", station: "Naval PNP Station" },
  { name: "FF J. Villanueva",   badge: "BFP-BIL-0023", station: "Naval BFP Station" },
];

const recentIncidents = [
  { id: "INC-004", type: "Fire",            status: "active",   location: "Brgy. Libertad",    time: "10:32 AM" },
  { id: "INC-003", type: "Medical",         status: "resolved", location: "Brgy. Padre Iñigo", time: "9:01 AM"  },
  { id: "INC-002", type: "Flood",           status: "resolved", location: "Brgy. Caraycaray",  time: "Yesterday"},
];

const statusStyle: Record<string, { bg: string; text: string; label: string }> = {
  active:   { bg: "bg-red-100",   text: "text-red-600",   label: "Active"   },
  resolved: { bg: "bg-green-100", text: "text-green-600", label: "Resolved" },
};

export default function AdminDashboard({ onNavigate, incomingAlertDismissed, onIncomingAlertDismiss }: AdminDashboardProps) {
  const [pendingList, setPendingList] = useState(pendingResponders);

  const approveResponder = (badge: string) => {
    setPendingList(list => list.filter(r => r.badge !== badge));
  };

  const rejectResponder = (badge: string) => {
    setPendingList(list => list.filter(r => r.badge !== badge));
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5] relative">

      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-4 flex-shrink-0" style={{ boxShadow: "0 1px 0 #f0f0f0" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-black">SA</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">Station Admin</p>
              <p className="text-sm font-black text-gray-900">Naval PNP Station</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("notifications")}
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-100"
            aria-label="Notifications"
          >
            <Bell size={17} className="text-gray-600" />
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-amber-500 rounded-full text-[8px] text-white flex items-center justify-center font-black">3</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll px-4 py-4 flex flex-col gap-4 pb-24" style={{ minHeight: 0 }}>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Responders", value: "12", color: "text-blue-600",  bg: "bg-blue-50"  },
            { label: "Active",     value: "1",  color: "text-red-600",   bg: "bg-red-50"   },
            { label: "Pending",    value: "3",  color: "text-amber-600", bg: "bg-amber-50" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-3 text-center`}>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[9px] text-gray-500 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pending Responder Approvals */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TriangleAlert size={14} className="text-amber-500" />
              <p className="text-xs font-black text-gray-900">Pending Approvals</p>
            </div>
            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{pendingList.length} waiting</span>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 180 }}>
          {pendingList.length === 0 ? (
            <div className="px-4 py-6 flex flex-col items-center gap-1.5">
              <CheckCircle2 size={20} className="text-green-500" />
              <p className="text-xs font-semibold text-gray-500">All approvals processed</p>
            </div>
          ) : pendingList.map((r, i) => (
            <div key={r.badge} className={`px-4 py-3 flex items-center gap-3 ${i < pendingList.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={14} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">{r.name}</p>
                <p className="text-[10px] text-gray-400">{r.badge} · {r.station}</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => approveResponder(r.badge)}
                  className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center active:bg-green-200 transition-colors"
                  aria-label={`Approve ${r.name}`}
                >
                  <CheckCircle2 size={14} className="text-green-600" />
                </button>
                <button
                  onClick={() => rejectResponder(r.badge)}
                  className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center active:bg-red-200 transition-colors"
                  aria-label={`Reject ${r.name}`}
                >
                  <XCircle size={14} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Users,         label: "Manage Responders", sub: "View all station staff",    color: "text-blue-600",  bg: "bg-blue-50",  screen: "manage-responders"   },
            { icon: ClipboardList, label: "All Incidents",     sub: "Station incident history",  color: "text-red-600",   bg: "bg-red-50",   screen: "incident-management" },
            { icon: ShieldCheck,   label: "Assign Responder",  sub: "Dispatch to incident",      color: "text-green-600", bg: "bg-green-50", screen: "incident-management" },
            { icon: Settings,      label: "Station Settings",  sub: "Edit station info",         color: "text-gray-600",  bg: "bg-gray-100", screen: ""                    },
          ].map(({ icon: Icon, label, sub, color, bg, screen }) => (
            <button key={label} onClick={() => screen && onNavigate(screen)} className="bg-white rounded-2xl p-3 text-left active:bg-gray-50 transition-colors" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-2`}>
                <Icon size={16} className={color} />
              </div>
              <p className="text-xs font-bold text-gray-800 leading-tight">{label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
            </button>
          ))}
        </div>

        {/* Recent Incidents */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList size={14} className="text-gray-500" />
              <p className="text-xs font-black text-gray-900">Recent Incidents</p>
            </div>
            <button className="text-[10px] text-[#D32F2F] font-bold" onClick={() => onNavigate("incident-management")}>See all</button>
          </div>
          {recentIncidents.map((inc, i) => {
            const s = statusStyle[inc.status];
            return (
              <button key={inc.id} onClick={() => onNavigate("incident-management")}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left active:bg-gray-50 ${i < recentIncidents.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-bold text-gray-800">{inc.type}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>
                  </div>
                  <p className="text-[10px] text-gray-400">{inc.id} · {inc.location}</p>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock size={10} />
                  <span className="text-[10px]">{inc.time}</span>
                </div>
                <ChevronRight size={13} className="text-gray-300" />
              </button>
            );
          })}
        </div>

        <div className="h-2" />
      </div>

      <BottomNav activeScreen="admin-dashboard" onNavigate={onNavigate} role="admin" />
      <IncomingReportAlert role="admin" onView={() => onNavigate("incident-management")} dismissed={incomingAlertDismissed} onDismiss={onIncomingAlertDismiss} />
    </div>
  );
}
