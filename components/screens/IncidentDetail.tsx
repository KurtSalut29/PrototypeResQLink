"use client";
import { ArrowLeft, MapPin, Star, Activity, Siren, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import StatusBadge from "../ui/StatusBadge";
import StatusTimeline from "../ui/StatusTimeline";

const timelineSteps = [
  { label: "Submitted",  time: "9:01 AM", state: "done"    as const },
  { label: "Received",   time: "9:03 AM", state: "done"    as const },
  { label: "Accepted",   time: "9:05 AM", state: "done"    as const },
  { label: "Dispatched", time: "9:07 AM", state: "active"  as const },
  { label: "On Scene",   time: "Pending", state: "pending" as const },
  { label: "Resolved",   time: "Pending", state: "pending" as const },
];

const respondingUnits = [
  { name: "PNP — Naval Station", unit: "Police", status: "en-route" as const },
  { name: "BFP — Biliran",       unit: "Fire & Rescue", status: "on-scene" as const },
];

export default function IncidentDetail({ onBack }: { onBack: () => void }) {
  const [rating, setRating] = useState(0);
  // In a real app this would come from the incident data; for the prototype we
  // treat the incident as still in-progress so the rating is locked.
  const isResolved = false;

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">

      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 flex-shrink-0" style={{ boxShadow: "0 1px 0 #f0f0f0" }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:bg-gray-200">
            <ArrowLeft size={15} className="text-gray-700" />
          </button>
          <h1 className="text-base font-black text-gray-900">Incident Detail</h1>
        </div>
        {/* Summary strip */}
        <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-medium">Report ID</p>
            <p className="text-sm font-black text-gray-900">INC-20240501-003</p>
          </div>
          <StatusBadge status="in-progress" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll px-4 py-3 flex flex-col gap-3 pb-8" style={{ minHeight: 0 }}>

        {/* Accepted banner */}
        <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={16} className="text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-green-800">Report Accepted</p>
            <p className="text-[10px] text-green-600">Officer R. Cruz · Naval PNP · En Route · ~4 min</p>
          </div>
        </div>

        {/* Incident info card */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {/* Color banner */}
          <div className="h-2 bg-gradient-to-r from-red-600 to-orange-500" />
          <div className="px-4 py-3">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">Incident Type</p>
                <div className="flex items-center gap-1.5">
                  <Activity size={12} className="text-[#D32F2F]" />
                  <p className="text-xs font-bold text-gray-900">Medical Emergency</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">Severity</p>
                <span className="text-xs font-bold text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded-lg">Critical</span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">Date Reported</p>
                <div className="flex items-center gap-1.5">
                  <Clock size={11} className="text-gray-400" />
                  <p className="text-xs font-semibold text-gray-700">May 1, 2024 · 9:01 AM</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">Reported By</p>
                <p className="text-xs font-semibold text-gray-700">Juan Dela Cruz</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <MapPin size={12} className="text-gray-400 flex-shrink-0" />
              <p className="text-xs text-gray-600">Barangay Padre Iñigo, Naval, Biliran</p>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl px-4 py-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <p className="text-xs font-black text-gray-900 mb-4">Response Timeline</p>
          <StatusTimeline steps={timelineSteps} />
        </div>

        {/* Responding Units */}
        <div className="bg-white rounded-2xl px-4 py-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <p className="text-xs font-black text-gray-900 mb-3">Responding Units</p>
          <div className="flex flex-col gap-2">
            {respondingUnits.map(unit => (
              <div key={unit.name} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Siren size={15} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900">{unit.name}</p>
                  <p className="text-[10px] text-gray-400">{unit.unit}</p>
                </div>
                <StatusBadge status={unit.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Photo */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="h-28 bg-gradient-to-br from-orange-300 to-red-500 flex items-center justify-center relative">
            <Activity size={28} className="text-white/40" />
            <div className="absolute bottom-2 left-2 bg-black/30 rounded-lg px-2 py-0.5">
              <p className="text-[9px] text-white font-semibold">Photo Evidence</p>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-2xl px-4 py-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div className="flex items-start justify-between mb-1">
            <p className="text-xs font-black text-gray-900">Rate the Response</p>
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-green-500" />
                <span className="text-[10px] text-green-600 font-semibold">Rated</span>
              </div>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mb-3">
            {!isResolved
              ? "Available after incident is resolved"
              : rating === 0
              ? "How was the response?"
              : "Thank you for your feedback!"}
          </p>
          <div className={`flex gap-2 ${!isResolved ? "opacity-40 pointer-events-none" : ""}`}>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => isResolved && setRating(n)} disabled={!isResolved} aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}>
                <Star
                  size={24}
                  className={n <= rating ? "text-yellow-400" : "text-gray-200"}
                  fill={n <= rating ? "#facc15" : "none"}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="h-2" />
      </div>
    </div>
  );
}
