"use client";
import { ArrowLeft, ChevronDown, ChevronUp, Phone, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";

interface Props { onBack: () => void; }

const FAQS = [
  { q: "How do I report an emergency?",         a: "Tap the red SOS button on your dashboard, select the incident type, add a photo or voice description, then tap Send SOS. Responders will be notified immediately." },
  { q: "How long does it take for help to arrive?", a: "Average response time in Naval is 4–8 minutes. You can track the responder's status live on the incident detail screen." },
  { q: "Can I cancel a report after submitting?", a: "Contact the responding station directly using the hotline below. Once a responder is dispatched, cancellation must be done by phone." },
  { q: "What is PWD Accessibility mode?",        a: "PWD mode adapts the app for users with visual, hearing, or motor impairments. Enable it from Profile > PWD Accessibility." },
  { q: "Is my location shared automatically?",   a: "Yes. Your GPS location is attached to every report to help responders find you faster. You can update it in Saved Locations." },
];

const CONTACTS = [
  { icon: Phone,         label: "Naval MDRRMO Hotline", value: "(053) 500-9119",          color: "#ef4444", bg: "#fef2f2" },
  { icon: Phone,         label: "Naval PNP Station",    value: "(053) 500-9110",          color: "#3b82f6", bg: "#eff6ff" },
  { icon: Phone,         label: "Naval BFP Station",    value: "(053) 500-9113",          color: "#f97316", bg: "#fff7ed" },
  { icon: Mail,          label: "Email Support",        value: "support@resqlink.gov.ph", color: "#8b5cf6", bg: "#f5f3ff" },
  { icon: MessageCircle, label: "In-App Chat",          value: "Available 24/7",          color: "#22c55e", bg: "#f0fdf4" },
];

export default function HelpSupportScreen({ onBack }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F5F5F5" }}>
      <div style={{ background: "white", padding: "36px 16px 12px", flexShrink: 0, boxShadow: "0 1px 0 #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={15} color="#374151" />
          </button>
          <div>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#111", margin: 0 }}>Help &amp; Support</p>
            <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>FAQs and contact information</p>
          </div>
        </div>
      </div>

      <div className="phone-scroll" style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "12px 16px 32px", display: "flex", flexDirection: "column", gap: 10 }}>

        <p style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Frequently Asked Questions</p>
        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? "1px solid #f3f4f6" : "none" }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#111", margin: 0, flex: 1 }}>{f.q}</p>
                {open === i ? <ChevronUp size={14} color="#9ca3af" /> : <ChevronDown size={14} color="#9ca3af" />}
              </button>
              {open === i && (
                <div style={{ padding: "0 14px 12px" }}>
                  <p style={{ fontSize: 11, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Contact Us</p>
        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          {CONTACTS.map(({ icon: Icon, label, value, color, bg }, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderBottom: i < CONTACTS.length - 1 ? "1px solid #f3f4f6" : "none" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={15} color={color} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#111", margin: 0 }}>{label}</p>
                <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
