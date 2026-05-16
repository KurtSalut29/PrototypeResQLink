"use client";
import { useState } from "react";
import { Bell, Users, ShieldCheck, Settings, ClipboardList, TriangleAlert, Building2, Globe } from "lucide-react";
import BottomNav from "../navigation/BottomNav";

interface Props { onNavigate: (screen: string) => void; }
type Tab = "overview" | "stations" | "users" | "incidents";

const allStations = [
  { name: "Naval PNP Station",      agency: "PNP",    municipality: "Naval",      responders: 12, active: 1, status: "online"  },
  { name: "Naval BFP Station",      agency: "BFP",    municipality: "Naval",      responders: 8,  active: 1, status: "online"  },
  { name: "NAVRU Naval Base",       agency: "NAVRU",  municipality: "Naval",      responders: 10, active: 2, status: "online"  },
  { name: "Naval MDRRMO Office",    agency: "MDRRMO", municipality: "Naval",      responders: 7,  active: 0, status: "online"  },
  { name: "Kawayan PNP Station",    agency: "PNP",    municipality: "Kawayan",    responders: 6,  active: 0, status: "online"  },
  { name: "Kawayan BFP Station",    agency: "BFP",    municipality: "Kawayan",    responders: 4,  active: 0, status: "offline" },
  { name: "Cabucgayan PNP Station", agency: "PNP",    municipality: "Cabucgayan", responders: 5,  active: 0, status: "online"  },
  { name: "Cabucgayan BFP Station", agency: "BFP",    municipality: "Cabucgayan", responders: 3,  active: 0, status: "online"  },
  { name: "Almeria PNP Station",    agency: "PNP",    municipality: "Almeria",    responders: 4,  active: 0, status: "online"  },
  { name: "Biliran PNP Station",    agency: "PNP",    municipality: "Biliran",    responders: 5,  active: 0, status: "online"  },
];

const allUsers = [
  { name: "Juan Dela Cruz",    role: "Resident",      municipality: "Naval",      location: "Brgy. Padre Iñigo",   status: "active"  },
  { name: "Maria Santos",      role: "Resident",      municipality: "Naval",      location: "Brgy. Libertad",      status: "active"  },
  { name: "Pedro Reyes",       role: "Resident",      municipality: "Kawayan",    location: "Brgy. Kawayan",       status: "active"  },
  { name: "Ana Villanueva",    role: "Resident",      municipality: "Cabucgayan", location: "Brgy. Cabucgayan",    status: "active"  },
  { name: "Officer R. Cruz",   role: "Responder",     municipality: "Naval",      location: "Naval PNP Station",   status: "active"  },
  { name: "FF A. Mendoza",     role: "Responder",     municipality: "Naval",      location: "Naval BFP Station",   status: "active"  },
  { name: "Officer M. Santos", role: "Responder",     municipality: "Naval",      location: "Naval PNP Station",   status: "pending" },
  { name: "Officer T. Lim",    role: "Responder",     municipality: "Kawayan",    location: "Kawayan PNP Station", status: "active"  },
  { name: "Admin Naval PNP",   role: "Station Admin", municipality: "Naval",      location: "Naval PNP Station",   status: "active"  },
  { name: "Admin Naval BFP",   role: "Station Admin", municipality: "Naval",      location: "Naval BFP Station",   status: "active"  },
  { name: "Admin Kawayan PNP", role: "Station Admin", municipality: "Kawayan",    location: "Kawayan PNP Station", status: "active"  },
];

const allIncidents = [
  { id: "INC-004", type: "Fire",     municipality: "Naval",      location: "Brgy. Libertad",    station: "Naval BFP",     status: "active",   time: "10:32 AM"   },
  { id: "INC-003", type: "Medical",  municipality: "Naval",      location: "Brgy. Padre Iñigo", station: "Naval PNP",     status: "resolved", time: "9:01 AM"    },
  { id: "INC-002", type: "Flood",    municipality: "Naval",      location: "Brgy. Caraycaray",  station: "MDRRMO",        status: "resolved", time: "Yesterday"  },
  { id: "INC-001", type: "Crime",    municipality: "Naval",      location: "Naval Highway",     station: "Naval PNP",     status: "resolved", time: "2 days ago" },
  { id: "INC-005", type: "Accident", municipality: "Kawayan",    location: "Kawayan Road",      station: "Kawayan PNP",   status: "resolved", time: "3 days ago" },
  { id: "INC-006", type: "Medical",  municipality: "Cabucgayan", location: "Brgy. Cabucgayan",  station: "Cabucgayan PNP",status: "resolved", time: "4 days ago" },
];

const agencyColor: Record<string, string> = {
  PNP: "bg-blue-100 text-blue-700", BFP: "bg-orange-100 text-orange-700",
  NAVRU: "bg-indigo-100 text-indigo-700", MDRRMO: "bg-green-100 text-green-700",
};
const roleColor: Record<string, string> = {
  Resident: "bg-green-100 text-green-700",
  Responder: "bg-blue-100 text-blue-700",
  "Station Admin": "bg-amber-100 text-amber-700",
};
const incStatusStyle: Record<string, { bg: string; text: string }> = {
  active:   { bg: "bg-red-100",   text: "text-red-600"   },
  resolved: { bg: "bg-green-100", text: "text-green-700" },
};

export default function SuperAdminDashboard({ onNavigate }: Props) {
  const [tab, setTab]           = useState<Tab>("overview");
  const [placeFilter, setPlaceFilter] = useState("All");

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview",  label: "Overview"  },
    { key: "stations",  label: "Stations"  },
    { key: "users",     label: "Users"     },
    { key: "incidents", label: "Incidents" },
  ];

  const stationMunicipalities  = [...new Set(allStations.map(s => s.municipality))];
  const userMunicipalities     = [...new Set(allUsers.map(u => u.municipality))];
  const incidentMunicipalities = [...new Set(allIncidents.map(i => i.municipality))];

  const filteredStations  = placeFilter === "All" ? allStations  : allStations.filter(s => s.municipality === placeFilter);
  const filteredUsers     = placeFilter === "All" ? allUsers     : allUsers.filter(u => u.municipality === placeFilter);
  const filteredIncidents = placeFilter === "All" ? allIncidents : allIncidents.filter(i => i.municipality === placeFilter);

  const handleTabChange = (t: Tab) => { setTab(t); setPlaceFilter("All"); };

  const chipList =
    tab === "stations"  ? stationMunicipalities  :
    tab === "users"     ? userMunicipalities     :
    tab === "incidents" ? incidentMunicipalities : [];

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">

      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-3 flex-shrink-0" style={{ boxShadow: "0 1px 0 #f0f0f0" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
              <Globe size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">System Administrator</p>
              <p className="text-sm font-black text-gray-900">ResQLink Super Admin</p>
            </div>
          </div>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
            <Bell size={17} className="text-gray-600" />
            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-purple-600 rounded-full text-[8px] text-white flex items-center justify-center font-black">5</span>
          </button>
        </div>
      </div>

      {/* Main tabs */}
      <div className="bg-white px-4 pb-3 flex gap-2 flex-shrink-0" style={{ boxShadow: "0 1px 0 #f0f0f0" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => handleTabChange(t.key)}
            className="flex-1 py-1.5 rounded-xl text-[10px] font-bold transition-all"
            style={{
              background: tab === t.key ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "#f3f4f6",
              color: tab === t.key ? "white" : "#6b7280",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Municipality filter chips — sticky, outside scroll */}
      {chipList.length > 0 && (
        <div className="bg-[#F5F5F5] px-4 pt-3 pb-2 flex-shrink-0">
          <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <div className="flex gap-2" style={{ width: "max-content" }}>
              {["All", ...chipList].map(m => (
                <button key={m} onClick={() => setPlaceFilter(m)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: placeFilter === m ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "white",
                    color: placeFilter === m ? "white" : "#6b7280",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-24 pt-3" style={{ minHeight: 0 }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Total Residents",  value: "1,284", color: "text-green-600",  bg: "bg-green-50",  icon: Users         },
                { label: "Total Responders", value: "52",    color: "text-blue-600",   bg: "bg-blue-50",   icon: ShieldCheck   },
                { label: "Stations",         value: "10",    color: "text-amber-600",  bg: "bg-amber-50",  icon: Building2     },
                { label: "Active Incidents", value: "1",     color: "text-red-600",    bg: "bg-red-50",    icon: TriangleAlert },
              ].map(({ label, value, color, bg, icon: Icon }) => (
                <div key={label} className={`${bg} rounded-2xl p-4 flex items-center gap-3`}>
                  <Icon size={20} className={color} />
                  <div>
                    <p className={`text-xl font-black ${color}`}>{value}</p>
                    <p className="text-[9px] text-gray-500 font-medium leading-tight">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div className="px-4 pt-3 pb-2.5 border-b border-gray-100 flex items-center gap-2">
                <TriangleAlert size={13} className="text-amber-500" />
                <p className="text-xs font-black text-gray-900">System Alerts</p>
              </div>
              {[
                { msg: "1 responder pending approval",   sub: "Naval · Naval PNP Station",   dot: "#f59e0b" },
                { msg: "Kawayan BFP Station is offline", sub: "Kawayan · No admin assigned",  dot: "#ef4444" },
                { msg: "Active fire — Brgy. Libertad",   sub: "Naval · Naval BFP responding", dot: "#ef4444" },
              ].map((a, i, arr) => (
                <div key={i} className={`px-4 py-2.5 flex items-start gap-3 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.dot }} />
                  <div>
                    <p className="text-xs font-bold text-gray-800">{a.msg}</p>
                    <p className="text-[10px] text-gray-400">{a.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Building2,    label: "Stations",        sub: "Filter by municipality", color: "text-amber-600",  bg: "bg-amber-50",  action: "stations"  },
                { icon: Users,        label: "Users",           sub: "Filter by municipality", color: "text-green-600",  bg: "bg-green-50",  action: "users"     },
                { icon: ClipboardList,label: "Incidents",       sub: "Filter by municipality", color: "text-red-600",    bg: "bg-red-50",    action: "incidents" },
                { icon: Settings,     label: "System Settings", sub: "Configure ResQLink",     color: "text-purple-600", bg: "bg-purple-50", action: ""          },
              ].map(({ icon: Icon, label, sub, color, bg, action }) => (
                <button key={label} onClick={() => action && handleTabChange(action as Tab)}
                  className="bg-white rounded-2xl p-3 text-left active:bg-gray-50" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-2`}>
                    <Icon size={16} className={color} />
                  </div>
                  <p className="text-xs font-bold text-gray-800 leading-tight">{label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STATIONS ── */}
        {tab === "stations" && (
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div className="px-4 pt-3 pb-2.5 border-b border-gray-100">
              <p className="text-xs font-black text-gray-900">
                {placeFilter === "All" ? "All Stations" : `${placeFilter} Stations`}
                <span className="text-gray-400 font-normal ml-1">({filteredStations.length})</span>
              </p>
            </div>
            {filteredStations.map((s, i) => (
              <div key={s.name} className={`px-4 py-3 flex items-center gap-3 ${i < filteredStations.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Building2 size={14} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{s.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${agencyColor[s.agency]}`}>{s.agency}</span>
                    <span className="text-[9px] text-gray-400">{s.municipality} · {s.responders} responders</span>
                    {s.active > 0 && <span className="text-[9px] font-bold text-red-500">{s.active} active</span>}
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === "online" ? "bg-green-500" : "bg-gray-300"}`} />
              </div>
            ))}
          </div>
        )}

        {/* ── USERS ── */}
        {tab === "users" && (
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div className="px-4 pt-3 pb-2.5 border-b border-gray-100">
              <p className="text-xs font-black text-gray-900">
                {placeFilter === "All" ? "All Users" : `${placeFilter} Users`}
                <span className="text-gray-400 font-normal ml-1">({filteredUsers.length})</span>
              </p>
            </div>
            {filteredUsers.map((u, i) => (
              <div key={u.name + i} className={`px-4 py-3 flex items-center gap-3 ${i < filteredUsers.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-black text-gray-600">
                    {u.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{u.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{u.location} · {u.municipality}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${roleColor[u.role]}`}>{u.role}</span>
                  {u.status === "pending" && (
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── INCIDENTS ── */}
        {tab === "incidents" && (
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div className="px-4 pt-3 pb-2.5 border-b border-gray-100">
              <p className="text-xs font-black text-gray-900">
                {placeFilter === "All" ? "All Incidents" : `${placeFilter} Incidents`}
                <span className="text-gray-400 font-normal ml-1">({filteredIncidents.length})</span>
              </p>
            </div>
            {filteredIncidents.map((inc, i) => {
              const s = incStatusStyle[inc.status];
              return (
                <div key={inc.id} className={`px-4 py-3 flex items-center gap-3 ${i < filteredIncidents.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-bold text-gray-800">{inc.type}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${s.bg} ${s.text}`}>{inc.status}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">{inc.id} · {inc.location}</p>
                    <p className="text-[10px] text-gray-400">{inc.station} · {inc.municipality} · {inc.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <BottomNav activeScreen="super-admin-dashboard" onNavigate={onNavigate} role="superadmin" />
    </div>
  );
}
