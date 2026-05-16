"use client";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Shield, CheckCircle2, ChevronDown, Camera, FileText, CreditCard, IdCard, ScanLine, TriangleAlert } from "lucide-react";

interface RegisterScreenProps {
  role: "resident" | "responder" | "admin" | "superadmin";
  onBack: () => void;
  onRegister: () => void;
}

const blur = (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.blur();

// Responder data
const agencies = ["PNP", "BFP", "NAVRU", "MDRRMO", "Barangay Tanod", "Philippine Red Cross", "Other"];

const municipalities = ["Naval", "Kawayan", "Cabucgayan", "Almeria", "Biliran", "Caibiran", "Culaba", "Maripipi"];

const stations: Record<string, Record<string, string>> = {
  PNP: {
    Naval:       "Naval PNP Station",
    Kawayan:     "Kawayan PNP Station",
    Cabucgayan:  "Cabucgayan PNP Station",
    Almeria:     "Almeria PNP Station",
    Biliran:     "Biliran PNP Station",
    Caibiran:    "Caibiran PNP Station",
    Culaba:      "Culaba PNP Station",
    Maripipi:    "Maripipi PNP Station",
  },
  BFP: {
    Naval:       "Naval BFP Station",
    Kawayan:     "Kawayan BFP Station",
    Cabucgayan:  "Cabucgayan BFP Station",
    Almeria:     "Almeria BFP Station",
    Biliran:     "Biliran BFP Station",
    Caibiran:    "Caibiran BFP Station",
    Culaba:      "Culaba BFP Station",
    Maripipi:    "Maripipi BFP Station",
  },
  NAVRU: {
    Naval:       "NAVRU Naval Base",
    Kawayan:     "NAVRU Kawayan Detachment",
    Cabucgayan:  "NAVRU Cabucgayan Detachment",
    Almeria:     "NAVRU Almeria Detachment",
    Biliran:     "NAVRU Biliran Detachment",
    Caibiran:    "NAVRU Caibiran Detachment",
    Culaba:      "NAVRU Culaba Detachment",
    Maripipi:    "NAVRU Maripipi Detachment",
  },
  MDRRMO: {
    Naval:       "Naval MDRRMO Office",
    Kawayan:     "Kawayan MDRRMO Office",
    Cabucgayan:  "Cabucgayan MDRRMO Office",
    Almeria:     "Almeria MDRRMO Office",
    Biliran:     "Biliran MDRRMO Office",
    Caibiran:    "Caibiran MDRRMO Office",
    Culaba:      "Culaba MDRRMO Office",
    Maripipi:    "Maripipi MDRRMO Office",
  },
};

const getStation = (agency: string, municipality: string) =>
  stations[agency]?.[municipality] ?? `${municipality} ${agency} Unit`;

// Valid IDs accepted for Biliran residency verification
const VALID_IDS = [
  { key: "barangay_id",    label: "Barangay ID",              icon: IdCard,      note: "Issued by your local barangay" },
  { key: "voters_id",      label: "Voter's ID / COMELEC",     icon: CreditCard,  note: "Must show Biliran address" },
  { key: "philsys",        label: "PhilSys National ID",      icon: CreditCard,  note: "Philippine Identification System" },
  { key: "postal_id",      label: "Postal ID",                icon: IdCard,      note: "Must show Biliran address" },
  { key: "senior_id",      label: "Senior Citizen ID",        icon: IdCard,      note: "Issued by OSCA" },
  { key: "pwd_id",         label: "PWD ID",                   icon: IdCard,      note: "Issued by MSWD" },
  { key: "philhealth",     label: "PhilHealth ID",            icon: CreditCard,  note: "Must show Biliran address" },
  { key: "sss_gsis",       label: "SSS / GSIS ID",            icon: CreditCard,  note: "Government-issued" },
  { key: "drivers_license",label: "Driver's License",         icon: CreditCard,  note: "Must show Biliran address" },
  { key: "passport",       label: "Philippine Passport",      icon: FileText,    note: "With proof of Biliran residence" },
];

const barangays = [
  "Brgy. Padre Iñigo", "Brgy. Caraycaray", "Brgy. Libertad", "Brgy. Aside",
  "Brgy. Borac", "Brgy. Cabungaan", "Brgy. Calumpang", "Brgy. Imelda",
  "Brgy. Larrazabal", "Brgy. Mabini", "Brgy. Manlabang", "Brgy. Punta Silum",
  "Brgy. Sabang", "Brgy. San Pablo", "Brgy. Santissimo", "Brgy. Tagalag",
  "Brgy. Tingkasan", "Brgy. Uswag", "Brgy. Villa Caneja",
];

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
}

function SelectField({ label, value, options, onChange, placeholder }: SelectProps) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none flex items-center justify-between text-left"
        >
          <span className={value ? "text-gray-800" : "text-gray-400"}>{value || placeholder || `Select ${label}`}</span>
          <ChevronDown size={15} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-40 overflow-y-auto">
            {options.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 transition-colors ${value === opt ? "text-[#D32F2F] font-bold" : "text-gray-700"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegisterScreen({ role, onBack, onRegister }: RegisterScreenProps) {
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fullName, setFullName]     = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [submitted, setSubmitted]   = useState(false);

  // Responder-specific
  const [agency, setAgency]         = useState("");
  const [municipality, setMunicipality] = useState("");
  const [badgeNo, setBadgeNo]       = useState("");

  // Resident-specific
  const [barangay, setBarangay]             = useState("");
  const [idType, setIdType]                 = useState("");
  const [idCaptured, setIdCaptured]         = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [verifying, setVerifying]           = useState(false);
  const [verified, setVerified]             = useState(false);
  const [verifyStep, setVerifyStep]         = useState(0);
  const [idStep, setIdStep]                 = useState<"select" | "capture" | "selfie" | "verifying" | "done">("select");

  // Super admin-specific
  const [authCode, setAuthCode]             = useState("");
  const [authCodeValid, setAuthCodeValid]   = useState<boolean | null>(null);
  const [authCodeChecking, setAuthCodeChecking] = useState(false);
  const [appointmentUploaded, setAppointmentUploaded] = useState(false);
  const [govIdCaptured, setGovIdCaptured]   = useState(false);
  const [saVerifying, setSaVerifying]       = useState(false);
  const [saVerified, setSaVerified]         = useState(false);
  const [saVerifyStep, setSaVerifyStep]     = useState(0);
  const [saStep, setSaStep]                 = useState<"code" | "docs" | "verifying" | "done">("code");

  // Simulated valid auth codes
  const VALID_CODES = ["DILG-BIL-2024", "LGU-SA-0001", "RESQ-ADMIN-001"];

  const station = agency && municipality ? getStation(agency, municipality) : "";

  const startVerification = () => {
    setIdStep("verifying");
    setVerifying(true);
    setVerifyStep(0);
    const steps = [0, 1, 2, 3];
    steps.forEach((s) => {
      setTimeout(() => setVerifyStep(s + 1), (s + 1) * 900);
    });
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      setIdStep("done");
    }, 4200);
  };

  const checkAuthCode = () => {
    setAuthCodeChecking(true);
    setTimeout(() => {
      setAuthCodeChecking(false);
      if (VALID_CODES.includes(authCode.trim().toUpperCase())) {
        setAuthCodeValid(true);
        setSaStep("docs");
      } else {
        setAuthCodeValid(false);
      }
    }, 1500);
  };

  const startSaVerification = () => {
    setSaStep("verifying");
    setSaVerifying(true);
    setSaVerifyStep(0);
    [0, 1, 2, 3].forEach((s) => {
      setTimeout(() => setSaVerifyStep(s + 1), (s + 1) * 900);
    });
    setTimeout(() => {
      setSaVerifying(false);
      setSaVerified(true);
      setSaStep("done");
    }, 4200);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onRegister(), 1200);
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-white px-8 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h2 className="text-lg font-black text-gray-900">Account Created!</h2>
        {role === "responder" ? (
          <p className="text-xs text-gray-500 leading-relaxed">
            Your account is pending verification by your station commander. You will be notified once approved.
          </p>
        ) : role === "resident" ? (
          <p className="text-xs text-gray-500 leading-relaxed">
            Your identity has been verified. You can now use ResQLink to report emergencies in Biliran Island.
          </p>
        ) : role === "superadmin" ? (
          <p className="text-xs text-gray-500 leading-relaxed">
            Your authorization has been verified. Your Super Admin account is now active. You have full system access.
          </p>
        ) : (
          <p className="text-xs text-gray-500">Redirecting you to sign in...</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-5 pt-12 pb-6 relative flex-shrink-0"
        style={{ background: role === "responder" ? "linear-gradient(135deg, #1e3a5f, #1d4ed8)" : role === "admin" ? "linear-gradient(135deg, #78350f, #d97706)" : role === "superadmin" ? "linear-gradient(135deg, #4c1d95, #7c3aed)" : "linear-gradient(135deg, #B71C1C, #D32F2F)" }}>
        <button onClick={onBack} className="absolute top-12 left-5 text-white/80 p-1">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center pt-1">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-2">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="text-lg font-black text-white">Create Account</h1>
          <span className="text-[10px] text-white/60 tracking-widest uppercase mt-0.5">
            {role === "resident" ? "Resident Registration" : role === "admin" ? "Station Admin Registration" : role === "superadmin" ? "Super Admin Registration" : "Responder Registration"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll px-5 pt-5 pb-6 flex flex-col gap-4">

        {/* ── RESPONDER FIELDS ── */}
        {role === "responder" && (
          <>
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-blue-700 font-semibold leading-relaxed">
                Your account will be linked to your station. Select your agency and municipality first.
              </p>
            </div>

            <SelectField label="Agency / Unit" value={agency} options={agencies} onChange={v => { setAgency(v); setMunicipality(""); }} placeholder="Select your agency" />
            <SelectField label="Municipality" value={municipality} options={municipalities} onChange={setMunicipality} placeholder="Select municipality" />

            {station && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <Shield size={14} className="text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400">Your Station</p>
                  <p className="text-xs font-bold text-gray-800">{station}</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Badge / Employee ID No.</label>
              <input type="text" value={badgeNo} onChange={e => setBadgeNo(e.target.value)}
                onFocus={blur} placeholder="e.g. PNP-BIL-0042"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none" />
            </div>
          </>
        )}

        {role === "admin" && (
          <>
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-amber-700 font-semibold leading-relaxed">
                Admin accounts are tied to one station. You will manage responders and incidents for that station only.
              </p>
            </div>

            <SelectField label="Agency / Unit" value={agency} options={agencies} onChange={v => { setAgency(v); setMunicipality(""); }} placeholder="Select your agency" />
            <SelectField label="Municipality" value={municipality} options={municipalities} onChange={setMunicipality} placeholder="Select municipality" />

            {station && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <Shield size={14} className="text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400">Your Station</p>
                  <p className="text-xs font-bold text-gray-800">{station}</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Admin / Employee ID No.</label>
              <input type="text" value={badgeNo} onChange={e => setBadgeNo(e.target.value)}
                onFocus={blur} placeholder="e.g. PNP-ADMIN-001"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none" />
            </div>
          </>
        )}

        {/* ── SUPER ADMIN FIELDS ── */}
        {role === "superadmin" && (
          <div className="flex flex-col gap-4">

            {/* Warning banner */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl px-3 py-2.5 flex items-start gap-2">
              <Shield size={13} className="text-purple-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-purple-700 font-semibold leading-relaxed">
                Super Admin access requires authorization from DILG or LGU Biliran. You must provide your authorization code and official documents.
              </p>
            </div>

            {/* STEP 1 — Authorization Code */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black ${
                  saStep !== "code" ? "bg-green-500 text-white" : "bg-purple-600 text-white"
                }`}>{saStep !== "code" ? "✓" : "1"}</div>
                <p className="text-xs font-bold text-gray-800">Enter Authorization Code</p>
              </div>

              {saStep === "code" && (
                <div className="flex flex-col gap-2">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      This code is issued by <span className="font-bold text-gray-700">DILG Biliran</span> or <span className="font-bold text-gray-700">LGU Biliran</span> to authorized system administrators only.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={authCode}
                      onChange={e => { setAuthCode(e.target.value.toUpperCase()); setAuthCodeValid(null); }}
                      onFocus={blur}
                      placeholder="e.g. DILG-BIL-2024"
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none font-mono tracking-widest"
                    />
                    <button type="button" onClick={checkAuthCode}
                      disabled={authCode.trim().length < 5 || authCodeChecking}
                      className="px-4 py-3 rounded-xl text-white text-xs font-bold disabled:opacity-40 active:opacity-80"
                      style={{ background: "linear-gradient(135deg,#4c1d95,#7c3aed)" }}>
                      {authCodeChecking ? "..." : "Verify"}
                    </button>
                  </div>
                  {authCodeValid === false && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                      <TriangleAlert size={12} className="text-red-500 flex-shrink-0" />
                      <p className="text-[10px] text-red-600 font-semibold">Invalid code. Contact DILG Biliran for your authorization code.</p>
                    </div>
                  )}
                </div>
              )}

              {saStep !== "code" && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                  <CheckCircle2 size={13} className="text-green-600" />
                  <p className="text-xs font-bold text-green-700">Authorization code verified</p>
                  <span className="ml-auto text-[10px] font-mono text-green-600 bg-green-100 px-2 py-0.5 rounded-lg">{authCode}</span>
                </div>
              )}
            </div>

            {/* STEP 2 — Upload Documents */}
            {(saStep === "docs" || saStep === "verifying" || saStep === "done") && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black ${
                    appointmentUploaded && govIdCaptured ? "bg-green-500 text-white" : "bg-purple-600 text-white"
                  }`}>{appointmentUploaded && govIdCaptured ? "✓" : "2"}</div>
                  <p className="text-xs font-bold text-gray-800">Upload Official Documents</p>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Appointment letter */}
                  <button type="button" onClick={() => setAppointmentUploaded(true)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 border-2 text-left active:opacity-80 ${
                      appointmentUploaded ? "bg-green-50 border-green-200" : "border-dashed border-gray-300 bg-gray-50"
                    }`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      appointmentUploaded ? "bg-green-100" : "bg-white border border-gray-200"
                    }`}>
                      {appointmentUploaded
                        ? <CheckCircle2 size={16} className="text-green-600" />
                        : <FileText size={16} className="text-gray-400" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${ appointmentUploaded ? "text-green-700" : "text-gray-600"}`}>
                        {appointmentUploaded ? "Appointment Letter uploaded ✓" : "Upload Appointment Letter"}
                      </p>
                      <p className="text-[10px] text-gray-400">Official LGU / DILG appointment document</p>
                    </div>
                  </button>

                  {/* Government ID */}
                  <button type="button" onClick={() => setGovIdCaptured(true)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 border-2 text-left active:opacity-80 ${
                      govIdCaptured ? "bg-green-50 border-green-200" : "border-dashed border-gray-300 bg-gray-50"
                    }`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      govIdCaptured ? "bg-green-100" : "bg-white border border-gray-200"
                    }`}>
                      {govIdCaptured
                        ? <CheckCircle2 size={16} className="text-green-600" />
                        : <Camera size={16} className="text-gray-400" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${ govIdCaptured ? "text-green-700" : "text-gray-600"}`}>
                        {govIdCaptured ? "Government ID captured ✓" : "Capture Government-Issued ID"}
                      </p>
                      <p className="text-[10px] text-gray-400">Passport, PRC, or GSIS ID</p>
                    </div>
                  </button>

                  {/* Proceed button */}
                  {appointmentUploaded && govIdCaptured && saStep === "docs" && (
                    <button type="button" onClick={startSaVerification}
                      className="w-full py-3 rounded-xl text-white text-xs font-black active:opacity-80"
                      style={{ background: "linear-gradient(135deg,#4c1d95,#7c3aed)" }}>
                      Proceed to Verification
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3 — AI Verification */}
            {(saStep === "verifying" || saStep === "done") && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black ${
                    saStep === "done" ? "bg-green-500 text-white" : "bg-purple-600 text-white"
                  }`}>{saStep === "done" ? "✓" : "3"}</div>
                  <p className="text-xs font-bold text-gray-800">Authorization Verification</p>
                </div>

                {saStep === "verifying" && (
                  <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 flex flex-col gap-2">
                    {[
                      "Validating authorization code with DILG",
                      "Verifying appointment letter authenticity",
                      "Cross-checking government ID",
                      "Granting Super Admin privileges",
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {saVerifyStep > i ? (
                          <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                        ) : saVerifyStep === i ? (
                          <div className="w-3 h-3 rounded-full border-2 border-purple-400 border-t-transparent animate-spin flex-shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border-2 border-gray-200 flex-shrink-0" />
                        )}
                        <p className={`text-[10px] font-medium ${
                          saVerifyStep > i ? "text-green-600" : saVerifyStep === i ? "text-purple-600" : "text-gray-400"
                        }`}>{step}</p>
                      </div>
                    ))}
                  </div>
                )}

                {saStep === "done" && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-800">Authorized Super Admin ✓</p>
                      <p className="text-[10px] text-green-600">Full system access granted by DILG Biliran</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── RESIDENT FIELDS ── */}
        {role === "resident" && (
          <div className="flex flex-col gap-4">

            {/* Info banner */}
            <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 flex items-start gap-2">
              <Shield size={13} className="text-[#D32F2F] flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-700 font-semibold leading-relaxed">
                To verify you are a Biliran resident, please provide a valid government-issued ID showing your Biliran address.
              </p>
            </div>

            {/* STEP 1 — Select ID type */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black ${
                  idStep !== "select" ? "bg-green-500 text-white" : "bg-[#D32F2F] text-white"
                }`}>{idStep !== "select" ? "✓" : "1"}</div>
                <p className="text-xs font-bold text-gray-800">Select Valid ID Type</p>
              </div>
              {idStep === "select" && (
                <div className="flex flex-col gap-1.5">
                  {VALID_IDS.map(({ key, label, icon: Icon, note }) => (
                    <button key={key} type="button"
                      onClick={() => { setIdType(key); setIdStep("capture"); }}
                      className="w-full flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-left active:bg-red-50 active:border-red-200">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <Icon size={15} className="text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800">{label}</p>
                        <p className="text-[10px] text-gray-400">{note}</p>
                      </div>
                      <ChevronDown size={13} className="text-gray-300 -rotate-90" />
                    </button>
                  ))}
                </div>
              )}
              {idStep !== "select" && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                  <CheckCircle2 size={13} className="text-green-600" />
                  <p className="text-xs font-bold text-green-700">{VALID_IDS.find(i => i.key === idType)?.label}</p>
                  {idStep === "capture" && (
                    <button type="button" onClick={() => { setIdType(""); setIdStep("select"); }}
                      className="ml-auto text-[10px] text-gray-400 font-medium">Change</button>
                  )}
                </div>
              )}
            </div>

            {/* STEP 2 — Capture ID */}
            {(idStep === "capture" || idStep === "selfie" || idStep === "verifying" || idStep === "done") && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black ${
                    idCaptured ? "bg-green-500 text-white" : "bg-[#D32F2F] text-white"
                  }`}>{idCaptured ? "✓" : "2"}</div>
                  <p className="text-xs font-bold text-gray-800">Take Photo of Your ID</p>
                </div>
                {!idCaptured ? (
                  <button type="button" onClick={() => { setIdCaptured(true); setIdStep("selfie"); }}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 active:border-red-400 active:bg-red-50"
                    style={{ height: 100 }}>
                    <Camera size={22} className="text-gray-400" />
                    <p className="text-xs text-gray-400 font-medium">Tap to capture front of ID</p>
                    <p className="text-[10px] text-gray-300">Make sure all text is clearly visible</p>
                  </button>
                ) : (
                  <div className="w-full rounded-xl bg-green-50 border border-green-200 flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-700">ID photo captured</p>
                      <p className="text-[10px] text-green-600">Front side saved successfully</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 — Selfie */}
            {(idStep === "selfie" || idStep === "verifying" || idStep === "done") && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black ${
                    selfieCaptured ? "bg-green-500 text-white" : "bg-[#D32F2F] text-white"
                  }`}>{selfieCaptured ? "✓" : "3"}</div>
                  <p className="text-xs font-bold text-gray-800">Take a Selfie with Your ID</p>
                </div>
                {!selfieCaptured ? (
                  <button type="button" onClick={() => { setSelfieCaptured(true); }}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 active:border-red-400 active:bg-red-50"
                    style={{ height: 100 }}>
                    <Camera size={22} className="text-gray-400" />
                    <p className="text-xs text-gray-400 font-medium">Tap to take selfie holding your ID</p>
                    <p className="text-[10px] text-gray-300">Face and ID must both be visible</p>
                  </button>
                ) : (
                  <div className="w-full rounded-xl bg-green-50 border border-green-200 flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={18} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-green-700">Selfie captured</p>
                      <p className="text-[10px] text-green-600">Face match ready for verification</p>
                    </div>
                    {idStep === "selfie" && (
                      <button type="button" onClick={startVerification}
                        className="bg-[#D32F2F] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg active:opacity-80">
                        Verify
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 4 — AI Verifying */}
            {(idStep === "verifying" || idStep === "done") && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black ${
                    idStep === "done" ? "bg-green-500 text-white" : "bg-[#D32F2F] text-white"
                  }`}>{idStep === "done" ? "✓" : "4"}</div>
                  <p className="text-xs font-bold text-gray-800">AI Residency Verification</p>
                </div>

                {idStep === "verifying" && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 flex flex-col gap-2">
                    {[
                      "Scanning ID for Biliran address",
                      "Verifying ID authenticity",
                      "Matching face with ID photo",
                      "Confirming residency status",
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {verifyStep > i ? (
                          <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                        ) : verifyStep === i ? (
                          <div className="w-3 h-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin flex-shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border-2 border-gray-200 flex-shrink-0" />
                        )}
                        <p className={`text-[10px] font-medium ${
                          verifyStep > i ? "text-green-600" : verifyStep === i ? "text-indigo-600" : "text-gray-400"
                        }`}>{step}</p>
                      </div>
                    ))}
                  </div>
                )}

                {idStep === "done" && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-800">Verified Biliran Resident ✓</p>
                      <p className="text-[10px] text-green-600">Your ID has been verified successfully</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Barangay select — only show after verified */}
            {idStep === "done" && (
              <SelectField label="Barangay" value={barangay} options={barangays} onChange={setBarangay} placeholder="Select your barangay" />
            )}
          </div>
        )}

        {/* ── COMMON FIELDS ── */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full Name</label>
          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
            onFocus={blur} placeholder="Juan Dela Cruz"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none" />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            onFocus={blur} placeholder="juan@example.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none" />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
          <div className="relative">
            <input type={showPass ? "text" : "password"} value={password}
              onChange={e => setPassword(e.target.value)} onFocus={blur}
              placeholder="Min. 8 characters"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none pr-11" />
            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Confirm Password</label>
          <div className="relative">
            <input type={showConfirm ? "text" : "password"} value={confirm}
              onChange={e => setConfirm(e.target.value)} onFocus={blur}
              placeholder="Re-enter password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none pr-11" />
            <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {confirm && password && confirm !== password && (
            <p className="text-[10px] text-red-500 mt-1 ml-1">Passwords do not match</p>
          )}
        </div>

        {/* Summary card */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <Shield size={14} className="text-[#D32F2F] flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[10px] text-gray-400">Registering as</p>
            <p className="text-xs font-bold text-gray-800 capitalize">
              {role === "responder" && station ? `${agency} · ${station}` :
               role === "admin" && station ? `Admin · ${station}` : role}
            </p>
          </div>
          <button onClick={onBack} className="text-[10px] text-[#D32F2F] font-semibold">Change</button>
        </div>

        <button onClick={handleSubmit}
          disabled={role === "resident" && (!verified || !barangay)}
          className="w-full py-4 rounded-full text-white font-bold text-sm shadow-lg active:opacity-80 transition-opacity mt-1 disabled:opacity-40"
          style={{ background: role === "responder" ? "#1d4ed8" : role === "admin" ? "#d97706" : role === "superadmin" ? "#7c3aed" : "#D32F2F" }}>
          Create Account
        </button>

        <p className="text-center text-xs text-gray-500">
          Already have an account?{" "}
          <button onClick={onBack} className="text-[#D32F2F] font-semibold">Sign In</button>
        </p>
      </div>
    </div>
  );
}
