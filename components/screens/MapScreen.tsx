"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ChevronUp, ChevronDown, MapPin, Layers, X } from "lucide-react";
import BottomNav from "../navigation/BottomNav";
import { INCIDENT_TYPE_CONFIG, type IncidentType } from "../RealMap";

// Dynamic import — Leaflet requires browser APIs, cannot run on server
const RealMap = dynamic(() => import("../RealMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-green-50">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-[#D32F2F] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

const evacuationCenters = [
  { name: "Naval Central School",        barangay: "Brgy. Poblacion, Naval",   distance: "0.4 km", status: "Open", capacity: "320 / 500" },
  { name: "Biliran National High School", barangay: "Brgy. Larrazabal, Naval",  distance: "1.2 km", status: "Open", capacity: "180 / 400" },
  { name: "Padre Iñigo Covered Court",   barangay: "Brgy. Padre Iñigo, Naval", distance: "2.1 km", status: "Full", capacity: "200 / 200" },
];

const responderIncidents = [
  { id: "INC-004", type: "Fire",              eta: "3 min",   status: "En Route" },
  { id: "INC-003", type: "Medical Emergency", eta: "Arrived", status: "On Scene" },
  { id: "INC-005", type: "Road Accident",     eta: "8 min",   status: "En Route" },
];

const HEAT_FILTERS: Array<IncidentType | "All"> = ["All", "Fire", "Flood", "Medical", "Accident", "Crime"];

interface MapScreenProps {
  role: "resident" | "responder" | "admin" | "superadmin";
  onNavigate: (screen: string) => void;
}

export default function MapScreen({ role, onNavigate }: MapScreenProps) {
  const [sheetOpen,     setSheetOpen]     = useState(false);
  const [heatmapActive, setHeatmapActive] = useState(false);  // incidents shown by default
  const [heatFilter,    setHeatFilter]    = useState<IncidentType | "All">("All");

  // All roles can toggle the heatmap
  const canSeeHeatmap = true;

  const mapRole = role === "resident" ? "resident" : role === "responder" ? "responder" : "admin";

  return (
    <div className="flex flex-col h-full relative overflow-hidden">

      {/* ── FULL SCREEN REAL MAP ── */}
      <div className="absolute inset-0 z-0">
        <RealMap
          role={mapRole}
          onNavigate={onNavigate}
          heatmapActive={heatmapActive}
          heatFilter={heatFilter}
        />
      </div>

      {/* ── TOP: Location label ── */}
      <div className="absolute top-0 left-0 right-0 z-20 px-3 pt-10 pointer-events-none">
        <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5 shadow-lg"
          style={{ background: "rgba(15,23,42,0.82)", backdropFilter: "blur(6px)" }}>
          <MapPin size={13} className="text-[#D32F2F] flex-shrink-0" />
          <span className="flex-1 text-xs font-semibold" style={{ color: "#e2e8f0" }}>Naval, Biliran Island</span>
          <span className="text-[10px] font-medium" style={{ color: "#64748b" }}>Live</span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>

      {/* ── HEATMAP TOGGLE (all roles) ── */}
      {canSeeHeatmap && (
        <div className="absolute top-0 right-3 z-20 pt-10">
          <button
            onClick={() => setHeatmapActive(v => !v)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl shadow-lg transition-all active:scale-95"
            style={{
              background: heatmapActive
                ? "linear-gradient(135deg,#7c3aed,#6366f1)"
                : "rgba(15,23,42,0.82)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Layers size={13} style={{ color: heatmapActive ? "white" : "#94a3b8" }} />
            <span className="text-[10px] font-black"
              style={{ color: heatmapActive ? "white" : "#e2e8f0" }}>
              {heatmapActive ? "Heat ON" : "Heatmap"}
            </span>
          </button>
        </div>
      )}

      {/* ── HEATMAP FILTER CHIPS (shown when heatmap is active) ── */}
      {heatmapActive && (
        <div className="absolute z-20 left-0 right-0 px-3" style={{ top: "calc(2.5rem + 52px)" }}>
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {HEAT_FILTERS.map(f => {
              const isActive = heatFilter === f;
              const cfg = f !== "All" ? INCIDENT_TYPE_CONFIG[f] : null;
              return (
                <button
                  key={f}
                  onClick={() => setHeatFilter(f)}
                  className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all active:scale-95"
                  style={{
                    background: isActive
                      ? (cfg ? cfg.color : "#6366f1")
                      : "rgba(15,23,42,0.80)",
                    backdropFilter: "blur(6px)",
                    color: isActive ? "white" : "#cbd5e1",
                  }}
                >
                  {cfg && <span style={{ fontSize: 11 }}>{cfg.emoji}</span>}
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LEGEND ── */}
      <div
        className="absolute left-3 z-20"
        style={{ bottom: "calc(3.5rem + 70px)" }}
      >
        <div className="rounded-xl px-2.5 py-2 shadow-lg flex flex-col gap-1.5"
          style={{ background: "rgba(15,23,42,0.82)", backdropFilter: "blur(6px)" }}>
          {heatmapActive ? (
            <>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-wide mb-0.5">Risk Zones</p>
              {(["Fire", "Flood", "Medical", "Accident", "Crime"] as IncidentType[]).map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: INCIDENT_TYPE_CONFIG[t].color, opacity: 0.85 }} />
                  <span className="text-[9px] font-medium" style={{ color: "#cbd5e1" }}>
                    {INCIDENT_TYPE_CONFIG[t].emoji} {t}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D32F2F]" />
                <span className="text-[9px] font-medium" style={{ color: "#cbd5e1" }}>
                  {role === "resident" ? "My Report" : "Incident"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[9px] font-medium" style={{ color: "#cbd5e1" }}>PNP Station</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-[9px] font-medium" style={{ color: "#cbd5e1" }}>
                  {role === "responder" ? "BFP / Evacuation" : "Evacuation"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span className="text-[9px] font-medium" style={{ color: "#cbd5e1" }}>You</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── HEATMAP INFO BANNER (shown when active) ── */}
      {heatmapActive && (
        <div
          className="absolute z-20"
          style={{ bottom: "calc(3.5rem + 70px)", right: "52px" }}
        >
          <div className="bg-indigo-600/90 rounded-xl px-2.5 py-2 shadow-lg max-w-[130px]">
            <p className="text-[9px] font-black text-white leading-tight">
              ResQ AI Risk Map
            </p>
            <p className="text-[8px] text-indigo-200 mt-0.5 leading-tight">
              Based on 38 resident reports
            </p>
            <p className="text-[8px] text-indigo-200 leading-tight">
              Tap a zone for details
            </p>
          </div>
        </div>
      )}

      {/* ── BOTTOM SHEET ── */}
      <div className="absolute left-0 right-0 z-20 px-3" style={{ bottom: "3.5rem" }}>
        <button
          onClick={() => setSheetOpen(!sheetOpen)}
          className="w-full rounded-2xl px-4 py-3 flex items-center justify-between shadow-lg active:opacity-80"
          style={{ background: "rgba(15,23,42,0.88)", backdropFilter: "blur(8px)" }}
        >
          <div>
            <p className="text-xs font-black" style={{ color: "#f1f5f9" }}>
              {role === "resident" ? "Evacuation Centers" : "Incidents & Response Units"}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "#64748b" }}>
              {role === "resident"
                ? "Tap pins on map for details"
                : "Tap pins to see ETA & distance"}
            </p>
          </div>
          {sheetOpen
            ? <ChevronDown size={16} style={{ color: "#64748b" }} />
            : <ChevronUp size={16} style={{ color: "#64748b" }} />}
        </button>

        {sheetOpen && (
          <div className="rounded-2xl mt-1 shadow-xl max-h-52 overflow-y-auto phone-scroll"
            style={{ background: "rgba(15,23,42,0.92)", backdropFilter: "blur(8px)" }}>

            {/* Responder: active incidents with ETA */}
            {role === "responder" && (
              <div className="px-4 pt-3 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[10px] font-black uppercase tracking-wide mb-2" style={{ color: "#475569" }}>Active Incidents</p>
                {responderIncidents.map(inc => (
                  <button
                    key={inc.id}
                    onClick={() => onNavigate("incident-management")}
                    className="w-full flex items-center gap-3 py-2.5 text-left"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${inc.status === "On Scene" ? "bg-green-400" : "bg-red-500"}`} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: "#e2e8f0" }}>{inc.type}</p>
                      <p className="text-[10px]" style={{ color: "#64748b" }}>{inc.id}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-bold ${inc.status === "On Scene" ? "text-green-400" : "text-orange-400"}`}>
                        {inc.eta}
                      </p>
                      <p className="text-[9px]" style={{ color: "#64748b" }}>{inc.status}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Resident: only their report */}
            {role === "resident" && (
              <div className="px-4 pt-3 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[10px] font-black uppercase tracking-wide mb-2" style={{ color: "#475569" }}>My Active Report</p>
                <button
                  onClick={() => onNavigate("incident-detail")}
                  className="w-full flex items-center gap-3 py-2.5 text-left"
                >
                  <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold" style={{ color: "#e2e8f0" }}>Medical Emergency</p>
                    <p className="text-[10px]" style={{ color: "#64748b" }}>INC-003 · Brgy. Padre Iñigo</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-green-400">On Scene</p>
                    <p className="text-[9px]" style={{ color: "#64748b" }}>Responders arrived</p>
                  </div>
                </button>
              </div>
            )}

            {/* Evacuation centers */}
            <div className="px-4 pt-3 pb-3">
              <p className="text-[10px] font-black uppercase tracking-wide mb-2" style={{ color: "#475569" }}>Evacuation Centers</p>
              {evacuationCenters.map(center => (
                <div key={center.name} className="flex items-center gap-3 py-2"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(22,163,74,0.2)" }}>
                    <span className="text-green-400 text-[9px] font-black">E</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "#e2e8f0" }}>{center.name}</p>
                    <p className="text-[10px]" style={{ color: "#64748b" }}>{center.distance} · {center.capacity}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    center.status === "Open"
                      ? "bg-green-900/60 text-green-400"
                      : "bg-red-900/60 text-red-400"
                  }`}>{center.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30"
        style={{ background: "rgba(15,23,42,0.92)", backdropFilter: "blur(8px)" }}>
        <BottomNav activeScreen="map" onNavigate={onNavigate} role={role} />
      </div>
    </div>
  );
}
