"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Volume2, X } from "lucide-react";

interface Props {
  onNavigate: (screen: string) => void;
  onGoHome: () => void;
  onGoBack: () => void;
}

type Phase  = "ask_intent" | "ask_type" | "ask_injured" | "ask_confirm" | "done";
type Status = "speaking" | "listening" | "processing";

function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang  = "en-US";
  u.rate  = 0.9;
  u.pitch = 1.05;
  u.onend = () => onEnd?.();
  window.speechSynthesis.speak(u);
}

function isStop(t: string)     { return /\bstop\b|\bclose\b|\bexit\b/i.test(t); }
function isHome(t: string)     { return /\bhome\b|go home|dashboard|main/i.test(t); }
function isBack(t: string)     { return /\bback\b|go back|previous/i.test(t); }
function matchIntent(t: string) {
  if (/report|incident|emergency|sos|\bhelp\b/i.test(t))       return "report";
  if (/\bmap\b|evacuation|safe|center/i.test(t))               return "map";
  if (/\bai\b|resq ai|\bask\b|assistant|question/i.test(t))    return "ai";
  if (/profile|settings|account/i.test(t))                     return "profile";
  return null;
}
function matchType(t: string) {
  if (/fire|sunog/i.test(t))                                   return "Fire";
  if (/flood|baha/i.test(t))                                   return "Flood";
  if (/medical|injured|hurt|sakit/i.test(t))                   return "Medical";
  if (/accident|car|vehicle|crash/i.test(t))                   return "Accident";
  if (/crime|robbery|theft|assault|hold.?up/i.test(t))         return "Crime";
  if (/other/i.test(t))                                        return "Other";
  return null;
}
function matchYesNo(t: string): boolean | null {
  if (/\byes\b|yeah|yep|\boo\b|meron|injured|hurt/i.test(t))  return true;
  if (/\bno\b|nope|wala|none|hindi/i.test(t))                  return false;
  return null;
}
function matchConfirm(t: string): boolean | null {
  if (/\byes\b|confirm|correct|send|submit|tama|\boo\b/i.test(t)) return true;
  if (/\bno\b|cancel|wrong|mali|hindi/i.test(t))                  return false;
  return null;
}

export default function PWDVoiceCommand({ onNavigate, onGoHome, onGoBack }: Props) {
  const [status, setStatus] = useState<Status>("speaking");
  const [msg,    setMsg]    = useState("Starting...");
  const [heard,  setHeard]  = useState("");

  const phaseRef      = useRef<Phase>("ask_intent");
  const speakingRef   = useRef(false);
  const draftRef      = useRef<{ type: string | null; injured: boolean | null }>({ type: null, injured: null });
  const handlersRef   = useRef({ onNavigate, onGoHome, onGoBack });
  const handleSaidRef = useRef<(text: string) => void>(() => {});

  useEffect(() => { handlersRef.current = { onNavigate, onGoHome, onGoBack }; });

  function say(text: string, then?: () => void) {
    speakingRef.current = true;
    setStatus("speaking");
    setMsg(text);
    speak(text, () => {
      speakingRef.current = false;
      setStatus("listening");
      then?.();
    });
  }

  // reassigned every render — never stale
  handleSaidRef.current = (text: string) => {
    if (speakingRef.current) return;

    setHeard(text);
    setStatus("processing");

    const phase = phaseRef.current;
    const draft = draftRef.current;

    // global navigation commands work on any screen at any time
    if (isStop(text)) {
      say("Okay, closing voice assistant. Goodbye Juan.");
      return;
    }
    if (isHome(text)) {
      say("Going to home.", () => handlersRef.current.onGoHome());
      return;
    }
    if (isBack(text)) {
      say("Going back.", () => handlersRef.current.onGoBack());
      return;
    }

    if (phase === "ask_intent") {
      const intent = matchIntent(text);
      if (intent === "report") {
        phaseRef.current = "ask_type";
        say("What type of incident? Say Fire, Flood, Medical, Accident, Crime, or Other.");
      } else if (intent === "map") {
        say("Opening the evacuation map.", () => handlersRef.current.onNavigate("map"));
      } else if (intent === "ai") {
        say("Opening ResQ AI.", () => handlersRef.current.onNavigate("ai-assistant"));
      } else if (intent === "profile") {
        say("Opening your profile.", () => handlersRef.current.onNavigate("profile"));
      } else {
        say("Sorry, I did not understand. You can say: report an incident, open map, ResQ AI, go home, or go back.");
      }
      return;
    }

    if (phase === "ask_type") {
      const type = matchType(text);
      if (type) {
        draftRef.current = { ...draft, type };
        phaseRef.current = "ask_injured";
        say(`Got it, ${type}. Is anyone injured? Say yes or no.`);
      } else {
        say("Please say: Fire, Flood, Medical, Accident, Crime, or Other.");
      }
      return;
    }

    if (phase === "ask_injured") {
      const ans = matchYesNo(text);
      if (ans !== null) {
        draftRef.current = { ...draft, injured: ans };
        phaseRef.current = "ask_confirm";
        const inj = ans ? "with injuries" : "with no injuries";
        say(`I will report a ${draftRef.current.type} incident ${inj} at Barangay Padre Inigo, Naval. Say yes to submit or no to cancel.`);
      } else {
        say("Please say yes or no.");
      }
      return;
    }

    if (phase === "ask_confirm") {
      const ans = matchConfirm(text);
      if (ans === true) {
        phaseRef.current = "done";
        say(`${draftRef.current.type} report submitted. Responders are on their way. Stay safe, Juan.`,
          () => handlersRef.current.onNavigate("resident-dashboard"));
      } else if (ans === false) {
        draftRef.current = { type: null, injured: null };
        phaseRef.current = "ask_intent";
        say("Report cancelled. What would you like to do? Say: report an incident, open map, go home, or go back.");
      } else {
        say("Please say yes to submit or no to cancel.");
      }
      return;
    }

    // after done, reset and listen again
    if (phase === "done") {
      phaseRef.current = "ask_intent";
      draftRef.current = { type: null, injured: null };
      say("What else can I help you with? Say: report an incident, open map, go home, or go back.");
    }
  };

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setMsg("Speech recognition not supported."); return; }

    const r = new SR() as unknown as {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: ((e: any) => void) | null;
      onerror: ((e: any) => void) | null;
      onend: (() => void) | null;
      start: () => void;
      abort: () => void;
    };
    r.lang           = "en-US";
    r.continuous     = true;
    r.interimResults = false;

    r.onresult = (e: any) => {
      const result = e.results[e.results.length - 1];
      if (!result.isFinal) return;
      handleSaidRef.current(result[0].transcript.trim());
    };

    r.onerror = (e: any) => {
      if (e.error === "no-speech") return;
      setTimeout(() => { try { r.start(); } catch { /* already running */ } }, 500);
    };

    r.onend = () => {
      setTimeout(() => { try { r.start(); } catch { /* already running */ } }, 300);
    };

    // greet then start listening
    say("Hi Juan! I am ResQ, your voice assistant. I will stay with you on every screen. Say: report an incident, open map, ResQ AI, go home, or go back.", () => {
      try { r.start(); } catch { /* */ }
    });

    return () => {
      window.speechSynthesis.cancel();
      r.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const color =
    status === "listening"  ? "#ef4444" :
    status === "speaking"   ? "#7c3aed" : "#f59e0b";

  return (
    <div style={{
      position: "absolute", bottom: 88, left: 16, right: 16, zIndex: 50,
      background: "white", borderRadius: 20, padding: "14px 16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%", background: color, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 0 8px ${color}28`,
        transition: "background 0.3s, box-shadow 0.3s",
      }}>
        {status === "speaking" ? <Volume2 size={20} color="white" /> : <Mic size={20} color="white" />}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 900, color: "#111", margin: 0 }}>ResQ Voice Assistant</p>
        <p style={{ fontSize: 10, color, fontWeight: 700, margin: "2px 0 0",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {status === "listening" ? "Listening..." : status === "processing" ? "Processing..." : msg}
        </p>
        {heard !== "" && (
          <p style={{ fontSize: 10, color: "#9ca3af", margin: "2px 0 0", fontStyle: "italic",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            You said: &quot;{heard}&quot;
          </p>
        )}
      </div>

      <div style={{
        width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0,
        animation: "vcpulse 1.2s ease-in-out infinite",
      }} />

      <button onClick={() => window.speechSynthesis.cancel()} style={{
        width: 28, height: 28, borderRadius: "50%", background: "#f3f4f6", border: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0,
      }}>
        <X size={13} color="#6b7280" />
      </button>

      <style>{`@keyframes vcpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.35;transform:scale(1.6)}}`}</style>
    </div>
  );
}
