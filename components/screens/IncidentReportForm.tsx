"use client";
import { useState } from "react";
import { ArrowLeft, MapPin, Camera, Mic, Flame, Waves, HeartPulse, Car, ShieldAlert, MoreHorizontal, CheckCircle2, Sparkles } from "lucide-react";

const incidentTypes = [
  { label: "Fire",     icon: Flame,          color: "text-orange-500", bg: "bg-orange-50",  activeBg: "bg-orange-500" },
  { label: "Flood",    icon: Waves,          color: "text-blue-500",   bg: "bg-blue-50",    activeBg: "bg-blue-500"   },
  { label: "Medical",  icon: HeartPulse,     color: "text-red-500",    bg: "bg-red-50",     activeBg: "bg-red-500"    },
  { label: "Accident", icon: Car,            color: "text-yellow-600", bg: "bg-yellow-50",  activeBg: "bg-yellow-500" },
  { label: "Crime",    icon: ShieldAlert,    color: "text-purple-500", bg: "bg-purple-50",  activeBg: "bg-purple-500" },
  { label: "Other",    icon: MoreHorizontal, color: "text-gray-500",   bg: "bg-gray-100",   activeBg: "bg-gray-500"   },
];

interface IncidentReportFormProps {
  onBack: () => void;
  onSubmit: () => void;
}

export default function IncidentReportForm({ onBack, onSubmit }: IncidentReportFormProps) {
  const [selectedType, setSelectedType] = useState("Medical");
  const [injured, setInjured]           = useState(true);
  const [submitted, setSubmitted]       = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onSubmit(), 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-white px-8 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h2 className="text-lg font-black text-gray-900">Report Submitted!</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Your incident has been reported. Responders have been notified and are on their way.
        </p>
        <div className="bg-gray-50 rounded-2xl px-4 py-3 w-full text-left">
          <p className="text-[10px] text-gray-400 mb-0.5">Report ID</p>
          <p className="text-sm font-black text-gray-900">INC-20240501-004</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">

      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 flex-shrink-0" style={{ boxShadow: "0 1px 0 #f0f0f0" }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:bg-gray-200">
            <ArrowLeft size={15} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-base font-black text-gray-900">Report Incident</h1>
            <p className="text-[10px] text-gray-400">Fill in the details below</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll px-4 py-4 flex flex-col gap-4 pb-8" style={{ minHeight: 0 }}>

        {/* Step 1 — Incident Type */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-[#D32F2F] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[9px] font-black">1</span>
            </div>
            <p className="text-xs font-black text-gray-900">What type of incident?</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {incidentTypes.map(({ label, icon: Icon, color, bg, activeBg }) => {
              const active = selectedType === label;
              return (
                <button key={label} onClick={() => setSelectedType(label)}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-2xl border-2 transition-all ${
                    active ? "border-transparent text-white " + activeBg : "border-gray-200 bg-white " + color
                  }`}>
                  <Icon size={20} className={active ? "text-white" : color} />
                  <span className={`text-[10px] font-bold ${active ? "text-white" : "text-gray-600"}`}>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2 — Additional details (renumbered, severity removed) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-[#D32F2F] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[9px] font-black">2</span>
            </div>
            <p className="text-xs font-black text-gray-900">Additional details</p>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            {/* Injured */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
              <div>
                <p className="text-xs font-semibold text-gray-800">Anyone injured?</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Requires immediate medical attention</p>
              </div>
              <div className="flex gap-1.5">
                {[true, false].map(val => (
                  <button key={String(val)} onClick={() => setInjured(val)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                      injured === val ? "bg-[#D32F2F] text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                    {val ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
            {/* Description */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-[10px] font-semibold text-gray-500 mb-2">Description (optional)</p>
              <div className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                <textarea
                  placeholder="Briefly describe what happened..."
                  rows={2}
                  className="phone-input flex-1 bg-transparent text-xs text-gray-700 outline-none resize-none"
                />
                <button className="text-gray-400 mt-0.5 flex-shrink-0">
                  <Mic size={14} />
                </button>
              </div>
            </div>
            {/* Photo */}
            <div className="px-4 py-3">
              <p className="text-[10px] font-semibold text-gray-500 mb-2">Photo evidence (optional)</p>
              <button className="w-full border border-dashed border-gray-300 rounded-xl py-3 flex items-center justify-center gap-2 active:bg-gray-50">
                <Camera size={15} className="text-gray-400" />
                <span className="text-xs text-gray-400 font-medium">Tap to add photo</span>
              </button>
            </div>
            {/* AI severity notice */}
            <div className="mx-3 mb-3 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5 flex items-start gap-2">
              <Sparkles size={13} className="text-indigo-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-indigo-600 leading-relaxed">
                <span className="font-bold">ResQ AI</span> will automatically assess severity using the incident type, injury status, and location — photo and description are optional but improve accuracy.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 — Location */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-[#D32F2F] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[9px] font-black">3</span>
            </div>
            <p className="text-xs font-black text-gray-900">Location</p>
          </div>
          <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <MapPin size={17} className="text-[#D32F2F]" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-900">Barangay Padre Iñigo</p>
              <p className="text-[10px] text-gray-400">Naval, Biliran Island</p>
            </div>
            <button className="text-[10px] font-bold text-[#D32F2F] bg-red-50 px-2.5 py-1 rounded-lg">
              Change
            </button>
          </div>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit}
          className="w-full py-4 rounded-2xl text-white font-black text-sm shadow-lg active:opacity-80 transition-opacity"
          style={{ background: "linear-gradient(135deg, #B71C1C, #D32F2F)" }}>
          Submit Report
        </button>

        <div className="h-2" />
      </div>
    </div>
  );
}
