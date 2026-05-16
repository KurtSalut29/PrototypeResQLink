"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Sparkles, Delete } from "lucide-react";

interface Message {
  id: number;
  from: "user" | "ai";
  text: string;
  time: string;
}

const suggestions = [
  "What should I do during a flood?",
  "How do I report a fire?",
  "Nearest evacuation center?",
  "Status of my report?",
];

const aiResponses: Record<string, string> = {
  "What should I do during a flood?":
    "During a flood in Biliran Island:\n\n1. Move immediately to higher ground.\n2. Avoid walking through floodwaters.\n3. Go to Naval Central School (open, 0.4 km).\n4. Call NDRRMC hotline: 911.\n5. Use ResQLink to report your location.\n\nStay safe and keep your phone charged.",
  "How do I report a fire?":
    "To report a fire:\n\n1. Tap the red Report button on the home screen.\n2. Select 'Fire' as the incident type.\n3. Add description and confirm location.\n4. Submit — BFP Biliran is notified instantly.\n\nBFP direct line: (053) 500-9119\n\nEvacuate first if you are in danger.",
  "Nearest evacuation center?":
    "Based on your location (Brgy. Padre Iñigo):\n\n📍 Naval Central School\n   0.4 km · Open · 320/500 capacity\n\n📍 Biliran National High School\n   1.2 km · Open · 180/400 capacity\n\nTap Map in the bottom nav for directions.",
  "Status of my report?":
    "Your latest report INC-20240501-003:\n\nType: Medical Emergency\nStatus: In Progress\nStage: On Scene\n\nPNP Naval — En Route\nBFP Biliran — On Scene\n\nTap 'View Details & Live Tracking' on the home screen for real-time updates.",
};

const defaultResponse =
  "I'm ResQ AI, your emergency assistant for Biliran Island.\n\nI can help with:\n• Emergency procedures\n• How to report incidents\n• Evacuation center locations\n• Report status updates\n• Emergency contact numbers\n\nHow can I assist you?";

const ROWS = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m"],
];

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AIAssistantScreen({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([{
    id: 0, from: "ai",
    text: "Hi Juan! I'm ResQ AI, your emergency support assistant.\n\nI can guide you through emergencies, help you report incidents, and answer safety questions for Biliran Island.\n\nHow can I help you today?",
    time: getTime(),
  }]);
  const [input, setInput]       = useState("");
  const [typing, setTyping]     = useState(false);
  const [kbOpen, setKbOpen]     = useState(false);
  const [caps, setCaps]         = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), from: "user", text: text.trim(), time: getTime() }]);
    setInput("");
    setKbOpen(false);
    setTyping(true);
    setTimeout(() => {
      const reply = aiResponses[text.trim()] ?? defaultResponse;
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: "ai", text: reply, time: getTime() }]);
    }, 1200);
  };

  const pressKey = (k: string) => {
    if (k === "SPACE") { setInput(p => p + " "); return; }
    if (k === "DEL")   { setInput(p => p.slice(0, -1)); return; }
    if (k === "SEND")  { sendMessage(input); return; }
    setInput(p => p + (caps ? k.toUpperCase() : k));
  };

  return (
    <div className="flex flex-col bg-[#F5F5F5]" style={{ height: "100%", overflow: "hidden", position: "relative" }}>

      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 flex-shrink-0" style={{ boxShadow: "0 1px 0 #f0f0f0" }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
            <ArrowLeft size={15} className="text-gray-700" />
          </button>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900">ResQ AI</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <p className="text-[10px] text-green-600 font-semibold">Online · Emergency Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto phone-scroll px-4 py-3 flex flex-col gap-3" style={{ minHeight: 0 }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {msg.from === "ai" ? (
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                <Sparkles size={12} className="text-white" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-400 to-red-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[9px] font-black">JD</span>
              </div>
            )}
            <div className={`max-w-[78%] flex flex-col gap-1 ${msg.from === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-3 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                msg.from === "user"
                  ? "bg-[#D32F2F] text-white rounded-tr-sm"
                  : "bg-white text-gray-800 rounded-tl-sm shadow-sm"
              }`}>
                {msg.text}
              </div>
              <span className="text-[9px] text-gray-400 px-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-2 items-end">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <Sparkles size={12} className="text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
              {[0,1,2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"
                  style={{ animation: `aiDot 1s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && !typing && !kbOpen && (
        <div className="px-4 pb-2 flex flex-col gap-1.5 flex-shrink-0">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Suggested</p>
          {suggestions.map(s => (
            <button key={s} onClick={() => sendMessage(s)}
              className="text-left text-[11px] text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 font-medium active:bg-indigo-100 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar — tapping opens custom keyboard, no real focus */}
      <div className="bg-white px-3 py-2.5 flex items-center gap-2 flex-shrink-0" style={{ boxShadow: "0 -1px 0 #f0f0f0" }}>
        <div
          onClick={() => setKbOpen(true)}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center cursor-text"
        >
          {input ? (
            <span className="text-xs text-gray-800 truncate">{input}</span>
          ) : (
            <span className="text-xs text-gray-400">Ask ResQ AI anything...</span>
          )}
          {kbOpen && <span className="w-0.5 h-4 bg-indigo-500 ml-0.5 animate-pulse" />}
        </div>
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity"
          style={{ background: input.trim() ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#e5e7eb" }}
        >
          <Send size={14} className={input.trim() ? "text-white" : "text-gray-400"} />
        </button>
      </div>

      {/* Custom on-screen keyboard — absolutely positioned so it overlays content, never pushes layout */}
      {kbOpen && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-200 px-1 pt-2 pb-3 z-50" style={{ boxShadow: "0 -2px 8px rgba(0,0,0,0.15)" }}>
          {ROWS.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-1 mb-1">
              {ri === 2 && (
                <button onClick={() => setCaps(c => !c)}
                  className={`px-2 py-2 rounded-lg text-[11px] font-bold min-w-[32px] ${caps ? "bg-indigo-500 text-white" : "bg-white text-gray-700 shadow-sm"}`}>
                  ⇧
                </button>
              )}
              {row.map(k => (
                <button key={k} onClick={() => pressKey(k)}
                  className="bg-white rounded-lg shadow-sm text-[12px] font-medium text-gray-800 active:bg-gray-300 transition-colors"
                  style={{ minWidth: 28, height: 36, padding: "0 4px" }}>
                  {caps ? k.toUpperCase() : k}
                </button>
              ))}
              {ri === 2 && (
                <button onClick={() => pressKey("DEL")}
                  className="bg-white rounded-lg shadow-sm px-2 py-2 active:bg-gray-300 transition-colors">
                  <Delete size={14} className="text-gray-700" />
                </button>
              )}
            </div>
          ))}
          {/* Bottom row */}
          <div className="flex justify-center gap-1">
            <button onClick={() => setKbOpen(false)}
              className="bg-gray-300 rounded-lg text-[11px] font-bold text-gray-600 px-3 active:bg-gray-400"
              style={{ height: 36 }}>
              Done
            </button>
            <button onClick={() => pressKey("SPACE")}
              className="bg-white rounded-lg shadow-sm text-[11px] text-gray-500 active:bg-gray-300 flex-1"
              style={{ height: 36 }}>
              space
            </button>
            <button onClick={() => pressKey("SEND")}
              className="rounded-lg text-[11px] font-bold text-white px-3 active:opacity-80"
              style={{ height: 36, background: input.trim() ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#d1d5db" }}>
              Send
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes aiDot {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
