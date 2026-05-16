"use client";
import { useState } from "react";
import {
  ShieldCheck, Bell, ClipboardList, ChevronRight, CheckCircle2,
  Clock, XCircle, TriangleAlert, Users, Settings, Sparkles,
  Flame, Waves, HeartPulse, Car, ShieldAlert, TrendingUp,
} from "lucide-react";
import IncomingReportAlert from "../IncomingReportAlert";

interface Props {
  onNavigate: (screen: string) => void;
  incomingAlertDismissed?: boolean;
  onIncomingAlertDismiss?: () => void;
}

const initialPending = [
  { name: "Officer M. Santos",  badge: "PNP-BIL-0051", station: "Naval PNP Station", agency: "PNP" },
  { name: "Officer L. Reyes",   badge: "PNP-BIL-0052", station: "Naval PNP Station", agency: "PNP" },
  { name: "FF J. Villanueva",   badge: "BFP-BIL-0023", station: "Naval BFP Station", agency: "BFP" },
];

const recentIncidents = [
  { id: "INC-004", type: "Fire",    status: "active",   location: "Brgy. Libertad",    time: "10:32 AM", icon: Flame,     color: "#f97316", bg: "#fff7ed" },
  { id: "INC-003", type: "Medical", status: "resolved", location: "Brgy. Padre Iñigo", time: "9:01 AM",  icon: HeartPulse,color: "#ef4444", bg: "#fef2f2" },
  { id: "INC-002", type: "Flood",   status: "resolved", location: "Brgy. Caraycaray",  time: "Yesterday",icon: Waves,     color: "#3b82f6", bg: "#eff6ff" },
  { id: "INC-001", type: "Accident",status: "resolved", location: "Naval Highway",     time: "2 days ago",icon: Car,      color: "#eab308", bg: "#fefce8" },
];

const responders = [
  { name: "Officer R. Cruz",  badge: "PNP-BIL-0042", status: "on-duty",  incident: "INC-003" },
  { name: "FF A. Mendoza",    badge: "BFP-BIL-0018", status: "on-duty",  incident: "INC-004" },
  { name: "SN K. Bautista",   badge: "NAVRU-0009",   status: "standby",  incident: null      },
  { name: "Officer T. Garcia",badge: "PNP-BIL-0039", status: "off-duty", incident: null      },
];

export default function AdminDashboardWeb({ onNavigate, incomingAlertDismissed, onIncomingAlertDismiss }: Props) {
  const [pendingList, setPendingList] = useState(initialPending);

  const approve = (badge: string) => setPendingList(l => l.filter(r => r.badge !== badge));
  const reject  = (badge: string) => setPendingList(l => l.filter(r => r.badge !== badge));

  return (
    <div className="p-6 h-full overflow-auto">

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Responders", value: "12", sub: "+2 this month",  color: "#3b82f6", bg: "#eff6ff",  icon: Users         },
          { label: "Active Incidents", value: "1",  sub: "1 critical",     color: "#ef4444", bg: "#fef2f2",  icon: TriangleAlert },
          { label: "Pending Approvals",value: String(pendingList.length), sub: "Awaiting review", color: "#f59e0b", bg: "#fffbeb", icon: Clock },
          { label: "Resolved Today",   value: "3",  sub: "Avg. 6 min resp",color: "#22c55e", bg: "#f0fdf4",  icon: CheckCircle2  },
        ].map(({ label, value, sub, color, bg, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: bg }}>
              <Icon size={22} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* ── LEFT: Incidents + AI ── */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* Recent Incidents */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList size={16} className="text-gray-500" />
                <h2 className="text-sm font-black text-gray-900">Recent Incidents</h2>
              </div>
              <button onClick={() => onNavigate("incident-management")}
                className="text-xs font-bold text-[#D32F2F] hover:underline">
                View all →
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["ID", "Type", "Location", "Time", "Status", ""].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentIncidents.map((inc, i) => {
                  const Icon = inc.icon;
                  return (
                    <tr key={inc.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onNavigate("incident-management")}>
                      <td className="px-5 py-3 text-xs font-bold text-gray-500">{inc.id}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: inc.bg }}>
                            <Icon size={13} style={{ color: inc.color }} />
                          </div>
                          <span className="text-xs font-bold text-gray-800">{inc.type}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">{inc.location}</td>
                      <td className="px-5 py-3 text-xs text-gray-400">{inc.time}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          inc.status === "active"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {inc.status === "active" ? "Active" : "Resolved"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <ChevronRight size={14} className="text-gray-300" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Responder Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <h2 className="text-sm font-black text-gray-900">Responder Status</h2>
              </div>
              <button onClick={() => onNavigate("manage-responders")}
                className="text-xs font-bold text-[#D32F2F] hover:underline">
                Manage →
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {responders.map(r => (
                <div key={r.badge} className="px-5 py-3 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={14} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{r.name}</p>
                    <p className="text-[11px] text-gray-400">{r.badge}</p>
                  </div>
                  {r.incident && (
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg">
                      {r.incident}
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    r.status === "on-duty"  ? "bg-green-100 text-green-700" :
                    r.status === "standby"  ? "bg-blue-100 text-blue-600"   :
                                              "bg-gray-100 text-gray-500"
                  }`}>
                    {r.status === "on-duty" ? "On Duty" : r.status === "standby" ? "Standby" : "Off Duty"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Pending approvals + AI + Quick actions ── */}
        <div className="flex flex-col gap-4">

          {/* Pending Approvals */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TriangleAlert size={15} className="text-amber-500" />
                <h2 className="text-sm font-black text-gray-900">Pending Approvals</h2>
              </div>
              {pendingList.length > 0 && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  {pendingList.length} waiting
                </span>
              )}
            </div>
            {pendingList.length === 0 ? (
              <div className="px-5 py-8 flex flex-col items-center gap-2">
                <CheckCircle2 size={24} className="text-green-400" />
                <p className="text-sm font-semibold text-gray-400">All approvals processed</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pendingList.map(r => (
                  <div key={r.badge} className="px-5 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={13} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{r.name}</p>
                      <p className="text-[10px] text-gray-400">{r.badge}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => approve(r.badge)}
                        className="w-7 h-7 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
                        aria-label={`Approve ${r.name}`}>
                        <CheckCircle2 size={13} className="text-green-600" />
                      </button>
                      <button onClick={() => reject(r.badge)}
                        className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                        aria-label={`Reject ${r.name}`}>
                        <XCircle size={13} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ResQ AI Summary */}
          <div className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-white" />
              <p className="text-sm font-black text-white">ResQ AI Summary</p>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed">
              1 critical fire incident active. 3 responders deployed. Avg. response time today is <span className="text-white font-bold">6 min</span> — within target.
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Response Rate", value: 98, color: "#a5f3fc" },
                { label: "Resolved Today", value: 75, color: "#86efac" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-indigo-300">{label}</span>
                    <span className="text-[10px] font-bold text-white">{value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-black text-gray-900 mb-3">Quick Actions</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "View Incident Queue",  screen: "incident-management", color: "#D32F2F", bg: "#fef2f2" },
                { label: "Manage Responders",    screen: "manage-responders",   color: "#3b82f6", bg: "#eff6ff" },
                { label: "Open Live Map",        screen: "map",                 color: "#16a34a", bg: "#f0fdf4" },
              ].map(({ label, screen, color, bg }) => (
                <button key={label} onClick={() => onNavigate(screen)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-left"
                  style={{ background: bg }}>
                  <span className="text-xs font-bold" style={{ color }}>{label}</span>
                  <ChevronRight size={13} className="ml-auto" style={{ color }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Incoming alert — positioned relative to the web layout */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="pointer-events-auto">
          <IncomingReportAlert
            role="admin"
            onView={() => onNavigate("incident-management")}
            dismissed={incomingAlertDismissed}
            onDismiss={onIncomingAlertDismiss}
          />
        </div>
      </div>
    </div>
  );
}
