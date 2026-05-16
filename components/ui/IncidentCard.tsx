import { ChevronRight, AlertTriangle } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface IncidentCardProps {
  id: string;
  type: string;
  status: "critical" | "moderate" | "minor" | "resolved" | "in-progress" | "dispatched" | "en-route" | "on-scene";
  location: string;
  time: string;
  onClick?: () => void;
}

export default function IncidentCard({ id, type, status, location, time, onClick }: IncidentCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-left active:bg-gray-50 transition-colors"
    >
      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
        <AlertTriangle size={18} className="text-[#D32F2F]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-bold text-[#D32F2F] bg-red-50 px-1.5 py-0.5 rounded">{id}</span>
          <StatusBadge status={status} />
        </div>
        <p className="text-xs font-semibold text-gray-800 truncate">{type}</p>
        <p className="text-[10px] text-gray-400 truncate">{location} · {time}</p>
      </div>
      <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
    </button>
  );
}
