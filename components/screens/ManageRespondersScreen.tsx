"use client";
import { useState } from "react";
import { ArrowLeft, ShieldCheck, CheckCircle2, XCircle, Clock, Search, Filter } from "lucide-react";

interface Props { onBack: () => void; }

type Status = "pending" | "approved" | "rejected";

interface Responder {
  id: number;
  name: string;
  badge: string;
  agency: string;
  station: string;
  joined: string;
  status: Status;
}

const initialResponders: Responder[] = [
  { id: 1, name: "Officer M. Santos",   badge: "PNP-BIL-0051", agency: "PNP",    station: "Naval PNP Station",  joined: "May 1, 2024",  status: "pending"  },
  { id: 2, name: "Officer L. Reyes",    badge: "PNP-BIL-0052", agency: "PNP",    station: "Naval PNP Station",  joined: "May 1, 2024",  status: "pending"  },
  { id: 3, name: "FF J. Villanueva",    badge: "BFP-BIL-0023", agency: "BFP",    station: "Naval BFP Station",  joined: "Apr 28, 2024", status: "pending"  },
  { id: 4, name: "Officer R. Cruz",     badge: "PNP-BIL-0042", agency: "PNP",    station: "Naval PNP Station",  joined: "Jan 10, 2024", status: "approved" },
  { id: 5, name: "FF A. Mendoza",       badge: "BFP-BIL-0018", agency: "BFP",    station: "Naval BFP Station",  joined: "Feb 3, 2024",  status: "approved" },
  { id: 6, name: "SN K. Bautista",      badge: "NAVRU-0009",   agency: "NAVRU",  station: "NAVRU Naval Base",   joined: "Mar 15, 2024", status: "approved" },
  { id: 7, name: "Officer T. Garcia",   badge: "PNP-BIL-0039", agency: "PNP",    station: "Naval PNP Station",  joined: "Dec 5, 2023",  status: "rejected" },
];

const statusConfig: Record<Status, { label: string; bg: string; text: string; icon: typeof CheckCircle2 }> = {
  pending:  { label: "Pending",  bg: "bg-amber-100", text: "text-amber-700", icon: Clock        },
  approved: { label: "Approved", bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
  rejected: { label: "Rejected", bg: "bg-red-100",   text: "text-red-600",   icon: XCircle      },
};

const filters: { key: "all" | Status; label: string }[] = [
  { key: "all",      label: "All"      },
  { key: "pending",  label: "Pending"  },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function ManageRespondersScreen({ onBack }: Props) {
  const [responders, setResponders] = useState<Responder[]>(initialResponders);
  const [filter, setFilter]         = useState<"all" | Status>("all");
  const [selected, setSelected]     = useState<Responder | null>(null);

  const updateStatus = (id: number, status: Status) => {
    setResponders(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const visible = responders.filter(r => filter === "all" || r.status === filter);
  const pendingCount = responders.filter(r => r.status === "pending").length;

  // Detail view
  if (selected) {
    const cfg = statusConfig[selected.status];
    const StatusIcon = cfg.icon;
    return (
      <div className="flex flex-col h-full bg-[#F5F5F5]">
        <div className="bg-white px-4 pt-10 pb-4 flex-shrink-0" style={{ boxShadow: "0 1px 0 #f0f0f0" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:bg-gray-200">
              <ArrowLeft size={15} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-base font-black text-gray-900">Responder Profile</h1>
              <p className="text-[10px] text-gray-400">Verification details</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto phone-scroll px-4 py-4 flex flex-col gap-4">

          {/* Avatar + name */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-lg">
                {selected.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-gray-900">{selected.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{selected.station}</p>
              <span className={`inline-flex items-center gap-1 mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                <StatusIcon size={9} />
                {cfg.label}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            {[
              { label: "Badge / ID No.", value: selected.badge   },
              { label: "Agency",         value: selected.agency  },
              { label: "Station",        value: selected.station },
              { label: "Date Registered",value: selected.joined  },
            ].map(({ label, value }, i, arr) => (
              <div key={label} className={`px-4 py-3 flex items-center justify-between ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                <p className="text-[10px] text-gray-400">{label}</p>
                <p className="text-xs font-bold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* ID validity note */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
            <p className="text-[10px] font-bold text-blue-700 mb-1">ID Validity Check</p>
            <p className="text-[10px] text-blue-600 leading-relaxed">
              Verify that the badge number matches the official roster of {selected.agency} {selected.station} before approving.
            </p>
          </div>

          {/* Action buttons */}
          {selected.status === "pending" && (
            <div className="flex gap-3">
              <button
                onClick={() => updateStatus(selected.id, "rejected")}
                className="flex-1 py-3.5 rounded-2xl border-2 border-red-200 text-red-600 font-black text-sm flex items-center justify-center gap-2 active:bg-red-50"
              >
                <XCircle size={16} />
                Reject
              </button>
              <button
                onClick={() => updateStatus(selected.id, "approved")}
                className="flex-[2] py-3.5 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 active:opacity-80"
                style={{ background: "linear-gradient(135deg, #15803d, #16a34a)" }}
              >
                <CheckCircle2 size={16} />
                Approve
              </button>
            </div>
          )}

          {selected.status === "approved" && (
            <button
              onClick={() => updateStatus(selected.id, "rejected")}
              className="w-full py-3.5 rounded-2xl border-2 border-red-200 text-red-600 font-black text-sm flex items-center justify-center gap-2 active:bg-red-50"
            >
              <XCircle size={16} />
              Revoke Access
            </button>
          )}

          {selected.status === "rejected" && (
            <button
              onClick={() => updateStatus(selected.id, "approved")}
              className="w-full py-3.5 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 active:opacity-80"
              style={{ background: "linear-gradient(135deg, #15803d, #16a34a)" }}
            >
              <CheckCircle2 size={16} />
              Approve
            </button>
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">
      <div className="bg-white px-4 pt-10 pb-4 flex-shrink-0" style={{ boxShadow: "0 1px 0 #f0f0f0" }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:bg-gray-200">
            <ArrowLeft size={15} className="text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-black text-gray-900">Manage Responders</h1>
            <p className="text-[10px] text-gray-400">Naval PNP Station</p>
          </div>
          {pendingCount > 0 && (
            <span className="text-[9px] font-black text-white bg-amber-500 px-2 py-1 rounded-full">{pendingCount} pending</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll px-4 py-4 flex flex-col gap-3">

        {/* Filter tabs */}
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex-1 py-2 rounded-xl text-[10px] font-bold transition-all"
              style={{
                background: filter === f.key ? "#d97706" : "white",
                color: filter === f.key ? "white" : "#6b7280",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {f.label}
              {f.key === "pending" && pendingCount > 0 && (
                <span className={`ml-1 ${filter === "pending" ? "text-white/80" : "text-amber-500"}`}>({pendingCount})</span>
              )}
            </button>
          ))}
        </div>

        {/* Responder list */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {visible.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-gray-400">No responders in this category.</p>
            </div>
          )}
          {visible.map((r, i) => {
            const cfg = statusConfig[r.status];
            const StatusIcon = cfg.icon;
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left active:bg-gray-50 transition-colors ${i < visible.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={15} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{r.name}</p>
                  <p className="text-[10px] text-gray-400">{r.badge} · {r.agency}</p>
                </div>
                <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.text}`}>
                  <StatusIcon size={9} />
                  {cfg.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bulk approve pending */}
        {filter === "pending" && pendingCount > 0 && (
          <button
            onClick={() => setResponders(prev => prev.map(r => r.status === "pending" ? { ...r, status: "approved" } : r))}
            className="w-full py-3.5 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 active:opacity-80"
            style={{ background: "linear-gradient(135deg, #15803d, #16a34a)" }}
          >
            <CheckCircle2 size={16} />
            Approve All Pending ({pendingCount})
          </button>
        )}

        <div className="h-2" />
      </div>
    </div>
  );
}
