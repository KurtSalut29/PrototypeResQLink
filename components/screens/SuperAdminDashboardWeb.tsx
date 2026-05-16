"use client";
import { useState } from "react";
import {
  Building2, Users, ShieldCheck, TriangleAlert, Globe,
  CheckCircle2, ChevronRight, Sparkles, TrendingUp,
  Flame, Waves, HeartPulse, Car, Settings,
} from "lucide-react";

interface Props { onNavigate: (screen: string) => void; }

const allStations = [
  { name: "Naval PNP Station",      agency: "PNP",    municipality: "Naval",      responders: 12, active: 1, status: "online"  },
  { name: "Naval BFP Station",      agency: "BFP",    municipality: "Naval",      responders: 8,  active: 1, status: "online"  },
  { name: "NAVRU Naval Base",       agency: "NAVRU",  municipality: "Naval",      responders: 10, active: 2, status: "online"  },
  { name: "Naval MDRRMO Office",    agency: "MDRRMO", municipality: "Naval",      responders: 7,  active: 0, status: "online"  },
  { name: "Kawayan PNP Station",    agency: "PNP",    municipality: "Kawayan",    responders: 6,  active: 0, status: "online"  },
  { name: "Kawayan BFP Station",    agency: "BFP",    municipality: "Kawayan",    responders: 4,  active: 0, status: "offline" },
  { name: "Cabucgayan PNP Station", agency: "PNP",    municipality: "Cabucgayan", responders: 5,  active: 0, status: "online"  },
  { name: "Almeria PNP Station",    agency: "PNP",    municipality: "Almeria",    responders: 4,  active: 0, status: "online"  },
];

const allIncidents = [
  { id: "INC-004", type: "Fire",     municipality: "Naval",      location: "Brgy. Libertad",    station: "Naval BFP",     status: "active",   time: "10:32 AM",   icon: Flame,      color: "#f97316", bg: "#fff7ed" },
  { id: "INC-003", type: "Medical",  municipality: "Naval",      location: "Brgy. Padre Iñigo", station: "Naval PNP",     status: "resolved", time: "9:01 AM",    icon: HeartPulse, color: "#ef4444", bg: "#fef2f2" },
  { id: "INC-002", type: "Flood",    municipality: "Naval",      location: "Brgy. Caraycaray",  station: "MDRRMO",        status: "resolved", time: "Yesterday",  icon: Waves,      color: "#3b82f6", bg: "#eff6ff" },
  { id: "INC-005", type: "Accident", municipality: "Kawayan",    location: "Kawayan Road",      station: "Kawayan PNP",   status: "resolved", time: "3 days ago", icon: Car,        color: "#eab308", bg: "#fefce8" },
];

const agencyColor: Record<string, { bg: string; text: string }> = {
  PNP:    { bg: "bg-blue-100",   text: "text-blue-700"   },
  BFP:    { bg: "bg-orange-100", text: "text-orange-700" },
  NAVRU:  { bg: "bg-indigo-100", text: "text-indigo-700" },
  MDRRMO: { bg: "bg-green-100",  text: "text-green-700"  },
};

const MUNICIPALITIES = ["Naval", "Kawayan", "Cabucgayan", "Almeria", "Biliran", "Caibiran", "Culaba", "Maripipi"];

export default function SuperAdminDashboardWeb({ onNavigate }: Props) {
  const [muniFilter, setMuniFilter] = useState("All");

  const filteredStations  = muniFilter === "All" ? allStations  : allStations.filter(s => s.municipality === muniFilter);
  const filteredIncidents = muniFilter === "All" ? allIncidents : allIncidents.filter(i => i.municipality === muniFilter);

  return (
    <div className="p-6 h-full overflow-auto">

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Residents",   value: "1,284", sub: "Across 8 municipalities", color: "#22c55e", bg: "#f0fdf4",  icon: Users         },
          { label: "Total Responders",  value: "52",    sub: "10 stations active",       color: "#3b82f6", bg: "#eff6ff",  icon: ShieldCheck   },
          { label: "Active Stations",   value: "9/10",  sub: "1 station offline",        color: "#f59e0b", bg: "#fffbeb",  icon: Building2     },
          { label: "Active Incidents",  value: "1",     sub: "1 critical — Naval",       color: "#ef4444", bg: "#fef2f2",  icon: TriangleAlert },
        ].map(({ label, value, sub, color, bg, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
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

      {/* Municipality filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["All", ...MUNICIPALITIES].map(m => (
          <button key={m} onClick={() => setMuniFilter(m)}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{
              background: muniFilter === m ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "white",
              color: muniFilter === m ? "white" : "#6b7280",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}>
            {m}
          </button>
        ))}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* ── LEFT: Stations + Incidents ── */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* Stations table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-gray-500" />
                <h2 className="text-sm font-black text-gray-900">
                  Stations
                  <span className="text-gray-400 font-normal ml-1.5 text-xs">({filteredStations.length})</span>
                </h2>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Station", "Agency", "Municipality", "Responders", "Active", "Status"].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStations.map((s, i) => {
                  const ac = agencyColor[s.agency] ?? { bg: "bg-gray-100", text: "text-gray-600" };
                  return (
                    <tr key={s.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-sm font-bold text-gray-800">{s.name}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ac.bg} ${ac.text}`}>{s.agency}</span>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">{s.municipality}</td>
                      <td className="px-5 py-3 text-xs font-bold text-gray-700">{s.responders}</td>
                      <td className="px-5 py-3">
                        {s.active > 0
                          ? <span className="text-xs font-bold text-red-600">{s.active} active</span>
                          : <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${s.status === "online" ? "bg-green-500" : "bg-gray-300"}`} />
                          <span className={`text-[10px] font-semibold ${s.status === "online" ? "text-green-600" : "text-gray-400"}`}>
                            {s.status === "online" ? "Online" : "Offline"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Incidents table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TriangleAlert size={16} className="text-gray-500" />
                <h2 className="text-sm font-black text-gray-900">
                  Incidents
                  <span className="text-gray-400 font-normal ml-1.5 text-xs">({filteredIncidents.length})</span>
                </h2>
              </div>
              <button onClick={() => onNavigate("incident-management")}
                className="text-xs font-bold text-purple-600 hover:underline">View all →</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["ID", "Type", "Location", "Station", "Municipality", "Time", "Status"].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map(inc => {
                  const Icon = inc.icon;
                  return (
                    <tr key={inc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onNavigate("incident-management")}>
                      <td className="px-5 py-3 text-xs font-bold text-gray-500">{inc.id}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: inc.bg }}>
                            <Icon size={11} style={{ color: inc.color }} />
                          </div>
                          <span className="text-xs font-bold text-gray-800">{inc.type}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">{inc.location}</td>
                      <td className="px-5 py-3 text-xs text-gray-500">{inc.station}</td>
                      <td className="px-5 py-3 text-xs text-gray-500">{inc.municipality}</td>
                      <td className="px-5 py-3 text-xs text-gray-400">{inc.time}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          inc.status === "active" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                        }`}>
                          {inc.status === "active" ? "Active" : "Resolved"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── RIGHT: Alerts + AI + Actions ── */}
        <div className="flex flex-col gap-4">

          {/* System Alerts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <TriangleAlert size={15} className="text-amber-500" />
              <h2 className="text-sm font-black text-gray-900">System Alerts</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { msg: "1 responder pending approval",   sub: "Naval PNP Station",    dot: "#f59e0b" },
                { msg: "Kawayan BFP Station offline",    sub: "No admin assigned",    dot: "#ef4444" },
                { msg: "Active fire — Brgy. Libertad",   sub: "Naval BFP responding", dot: "#ef4444" },
              ].map((a, i) => (
                <div key={i} className="px-5 py-3 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.dot }} />
                  <div>
                    <p className="text-xs font-bold text-gray-800">{a.msg}</p>
                    <p className="text-[10px] text-gray-400">{a.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ResQ AI */}
          <div className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-white" />
              <p className="text-sm font-black text-white">ResQ AI Insights</p>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Biliran Island system is <span className="text-white font-bold">90% operational</span>. Kawayan BFP offline. Flood risk elevated in coastal barangays this week.
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "System Uptime",    value: 90, color: "#a5f3fc" },
                { label: "Response Coverage",value: 85, color: "#86efac" },
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
                { label: "View All Incidents", screen: "incident-management", color: "#7c3aed", bg: "#f5f3ff" },
                { label: "Manage All Users",   screen: "manage-responders",   color: "#3b82f6", bg: "#eff6ff" },
                { label: "System Map",         screen: "map",                 color: "#16a34a", bg: "#f0fdf4" },
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
    </div>
  );
}
