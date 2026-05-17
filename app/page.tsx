"use client";
import { useState } from "react";
import PhoneFrame from "@/components/PhoneFrame";
import AdminWebLayout from "@/components/AdminWebLayout";
import SuperAdminWebLayout from "@/components/SuperAdminWebLayout";
import SplashScreen from "@/components/screens/SplashScreen";
import RoleSelectScreen from "@/components/screens/RoleSelectScreen";
import LoginScreen from "@/components/screens/LoginScreen";
import ResidentDashboard from "@/components/screens/ResidentDashboard";
import IncidentReportForm from "@/components/screens/IncidentReportForm";
import IncidentDetail from "@/components/screens/IncidentDetail";
import ResponderDashboard from "@/components/screens/ResponderDashboard";
import IncidentManagement from "@/components/screens/IncidentManagement";
import MapScreen from "@/components/screens/MapScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import RegisterScreen from "@/components/screens/RegisterScreen";
import AIAssistantScreen from "@/components/screens/AIAssistantScreen";
import PWDAccessibilityScreen from "@/components/screens/PWDAccessibilityScreen";
import AdminDashboardWeb from "@/components/screens/AdminDashboardWeb";
import SuperAdminDashboardWeb from "@/components/screens/SuperAdminDashboardWeb";
import AdminLoginWeb from "@/components/screens/AdminLoginWeb";
import ManageRespondersScreen from "@/components/screens/ManageRespondersScreen";
import MyReportsScreen from "@/components/screens/MyReportsScreen";
import NotificationsScreen from "@/components/screens/NotificationsScreen";
import SavedLocationsScreen from "@/components/screens/SavedLocationsScreen";
import ChangePasswordScreen from "@/components/screens/ChangePasswordScreen";
import HelpSupportScreen from "@/components/screens/HelpSupportScreen";
import { PWDProvider } from "@/components/PWDContext";
import PWDVoiceCommand from "@/components/PWDVoiceCommand";
import { usePWD } from "@/components/PWDContext";

type Screen =
  | "splash" | "role-select" | "login" | "register"
  | "resident-dashboard" | "incident-report" | "incident-detail"
  | "responder-dashboard" | "incident-management" | "admin-dashboard"
  | "map" | "profile" | "ai-assistant" | "pwd-accessibility" | "manage-responders" | "super-admin-dashboard"
  | "my-reports" | "notifications" | "saved-locations" | "change-password" | "help-support";

function AppShell() {
  const { blind } = usePWD();
  const [screen, setScreen] = useState<Screen>("splash");
  const [role, setRole] = useState<"resident" | "responder" | "admin" | "superadmin">("resident");
  const [history, setHistory] = useState<Screen[]>([]);

  // Alert dismissed state lives here so it persists across screen navigation
  const [incomingAlertDismissed, setIncomingAlertDismissed] = useState(false);
  const [reportAcceptedDismissed, setReportAcceptedDismissed] = useState(false);

  const navigate = (next: Screen) => {
    setHistory(h => [...h, screen]);
    setScreen(next);
  };

  const goBack = () => {
    const prev = history[history.length - 1];
    if (prev) {
      setHistory(h => h.slice(0, -1));
      setScreen(prev);
    }
  };

  const handleRoleSelect = (r: "resident" | "responder" | "admin" | "superadmin") => {
    setRole(r);
    navigate("login");
  };

  const handleLogin = () => {
    if (role === "resident") navigate("resident-dashboard");
    else if (role === "admin") navigate("admin-dashboard");
    else if (role === "superadmin") navigate("super-admin-dashboard");
    else navigate("responder-dashboard");
  };

  const handleNavigation = (s: string) => {
    const valid: Screen[] = [
      "splash", "role-select", "login", "register",
      "resident-dashboard", "incident-report", "incident-detail",
      "responder-dashboard", "incident-management",
      "map", "profile", "ai-assistant", "pwd-accessibility", "admin-dashboard", "manage-responders", "super-admin-dashboard",
      "my-reports", "notifications", "saved-locations", "change-password", "help-support",
    ];
    if (valid.includes(s as Screen)) navigate(s as Screen);
  };

  // ── Desktop screens (admin / superadmin — ALL screens including login) ──────
  const isDesktop = role === "admin" || role === "superadmin";

  const renderDesktopScreen = () => {
    // Login / register — full-page desktop form, no sidebar
    if (screen === "login" || screen === "register") {
      return (
        <AdminLoginWeb
          role={role as "admin" | "superadmin"}
          mode={screen === "register" ? "register" : "login"}
          onLogin={handleLogin}
          onBack={() => { setRole("resident"); navigate("role-select"); }}
          onSwitchMode={() => navigate(screen === "login" ? "register" : "login")}
        />
      );
    }

    // All other admin screens — wrapped in the sidebar layout
    const content = (() => {
      switch (screen) {
        case "admin-dashboard":
          return <AdminDashboardWeb onNavigate={handleNavigation} incomingAlertDismissed={incomingAlertDismissed} onIncomingAlertDismiss={() => setIncomingAlertDismissed(true)} />;
        case "super-admin-dashboard":
          return <SuperAdminDashboardWeb onNavigate={handleNavigation} />;
        case "incident-management":
          return (
            <div className="h-full overflow-auto p-6">
              <IncidentManagement onBack={goBack} onNavigate={handleNavigation} role={role === "admin" ? "admin" : "responder"} />
            </div>
          );
        case "manage-responders":
          return (
            <div className="h-full overflow-auto p-6">
              <ManageRespondersScreen onBack={goBack} />
            </div>
          );
        case "map":
          return <MapScreen role={role} onNavigate={handleNavigation} />;
        case "profile":
          return (
            <div className="h-full overflow-auto p-6">
              <ProfileScreen role={role} onNavigate={handleNavigation} />
            </div>
          );
        case "notifications":
          return (
            <div className="h-full overflow-auto p-6">
              <NotificationsScreen onBack={goBack} />
            </div>
          );
        default:
          return role === "admin"
            ? <AdminDashboardWeb onNavigate={handleNavigation} incomingAlertDismissed={incomingAlertDismissed} onIncomingAlertDismiss={() => setIncomingAlertDismissed(true)} />
            : <SuperAdminDashboardWeb onNavigate={handleNavigation} />;
      }
    })();

    if (role === "admin") {
      return (
        <AdminWebLayout
          activeScreen={screen}
          onNavigate={handleNavigation}
          onLogout={() => { setRole("resident"); setScreen("role-select"); setHistory([]); }}
        >
          {content}
        </AdminWebLayout>
      );
    }
    return (
      <SuperAdminWebLayout
        activeScreen={screen}
        onNavigate={handleNavigation}
        onLogout={() => { setRole("resident"); setScreen("role-select"); setHistory([]); }}
      >
        {content}
      </SuperAdminWebLayout>
    );
  };

  const renderScreen = () => {
    switch (screen) {
      case "splash":              return <SplashScreen onNext={() => navigate("role-select")} />;
      case "role-select":         return <RoleSelectScreen onSelect={handleRoleSelect} />;
      case "login":               return <LoginScreen role={role} onLogin={handleLogin} onBack={goBack} onRegister={() => navigate("register")} />;
      case "register":            return <RegisterScreen role={role} onBack={goBack} onRegister={handleLogin} />;
      case "resident-dashboard":  return <ResidentDashboard onNavigate={handleNavigation} reportAcceptedDismissed={reportAcceptedDismissed} onReportAcceptedDismiss={() => setReportAcceptedDismissed(true)} />;
      case "incident-report":     return <IncidentReportForm onBack={goBack} onSubmit={() => navigate("resident-dashboard")} />;
      case "incident-detail":     return <IncidentDetail onBack={goBack} />;
      case "responder-dashboard": return <ResponderDashboard onNavigate={handleNavigation} incomingAlertDismissed={incomingAlertDismissed} onIncomingAlertDismiss={() => setIncomingAlertDismissed(true)} />;
      case "incident-management": return <IncidentManagement onBack={goBack} onNavigate={handleNavigation} role={role === "admin" ? "admin" : "responder"} />;
      case "map":                 return <MapScreen role={role} onNavigate={handleNavigation} />;
      case "profile":             return <ProfileScreen role={role} onNavigate={handleNavigation} />;
      case "ai-assistant":        return <AIAssistantScreen onBack={goBack} />;
      case "pwd-accessibility":   return <PWDAccessibilityScreen onBack={goBack} />;
      case "my-reports":          return <MyReportsScreen onBack={goBack} onNavigate={handleNavigation} />;
      case "notifications":       return <NotificationsScreen onBack={goBack} />;
      case "saved-locations":     return <SavedLocationsScreen onBack={goBack} />;
      case "change-password":     return <ChangePasswordScreen onBack={goBack} />;
      case "help-support":        return <HelpSupportScreen onBack={goBack} />;
    }
  };

  const residentScreens: Screen[] = [
    "resident-dashboard", "incident-report", "incident-detail", "map", "profile", "ai-assistant", "pwd-accessibility", "my-reports",
  ];
  const isResident = residentScreens.includes(screen);

  // ── Desktop layout (admin / superadmin — all screens) ────────────────────
  if (isDesktop) {
    return renderDesktopScreen();
  }

  // ── Mobile layout (residents, responders, splash, role-select) ────────────
  return (
    <>
      {/* Fixed full-screen background */}
      <div
        className="fixed inset-0 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7f0000 0%, #B71C1C 50%, #c62828 100%)" }}
      >
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
          <span className="font-black text-white leading-none tracking-tighter"
            style={{ fontSize: "clamp(72px, 16vw, 200px)", opacity: 0.05, whiteSpace: "nowrap" }}>
            RESQLINK
          </span>
        </div>

        {/* Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-red-400 opacity-10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-red-950 opacity-20 blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 md:px-14 pt-6 pb-4 z-10 pointer-events-none">
          <div>
            <p className="text-white font-black text-sm tracking-[0.2em] uppercase">ResQLink</p>
            <p className="text-white/40 text-[9px] tracking-widest uppercase mt-0.5">Emergency App</p>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-[11px] font-bold tracking-[0.15em] uppercase">Biliran Island</p>
            <p className="text-white/40 text-[9px] tracking-widest">Philippines</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-[11px] font-bold tracking-[0.15em] uppercase">Emergency</p>
            <p className="text-white/40 text-[9px] tracking-widest uppercase">Response</p>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-0 left-0 right-0 text-center pb-4 z-10 pointer-events-none">
          <p className="text-white/25 text-[9px] tracking-[0.25em] uppercase font-bold">
            Fast · Safe · Reported — Biliran Island Emergency Response System
          </p>
        </div>

        {/* Side labels */}
        <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 z-10 pointer-events-none">
          <div className="w-px h-16 bg-white/20" />
          <p className="text-white/30 text-[9px] tracking-[0.3em] uppercase font-bold" style={{ writingMode: "vertical-rl" }}>
            Fast · Safe · Reported
          </p>
          <div className="w-px h-16 bg-white/20" />
        </div>
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 z-10 pointer-events-none">
          <div className="w-px h-16 bg-white/20" />
          <p className="text-white/30 text-[9px] tracking-[0.3em] uppercase font-bold" style={{ writingMode: "vertical-rl" }}>
            Naval · Biliran · Philippines
          </p>
          <div className="w-px h-16 bg-white/20" />
        </div>

        {/* Phone — absolutely centered, scales with viewport */}
        <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
          <PhoneFrame>
            {renderScreen()}
            {/* Global PWD voice assistant — follows user across all screens */}
            {blind && isResident && (
              <PWDVoiceCommand
                onNavigate={handleNavigation}
                onGoHome={() => handleNavigation("resident-dashboard")}
                onGoBack={goBack}
              />
            )}
          </PhoneFrame>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <PWDProvider>
      <AppShell />
    </PWDProvider>
  );
}
