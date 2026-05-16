"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface PWDState {
  blind: boolean;
  deaf: boolean;
  motor: boolean;
  toggle: (mode: "blind" | "deaf" | "motor") => void;
}

const PWDContext = createContext<PWDState>({ blind: false, deaf: false, motor: false, toggle: () => {} });

export function PWDProvider({ children }: { children: ReactNode }) {
  const [blind, setBlind] = useState(false);
  const [deaf,  setDeaf]  = useState(false);
  const [motor, setMotor] = useState(false);

  const toggle = (mode: "blind" | "deaf" | "motor") => {
    if (mode === "blind") setBlind(p => !p);
    if (mode === "deaf")  setDeaf(p => !p);
    if (mode === "motor") setMotor(p => !p);
  };

  return <PWDContext.Provider value={{ blind, deaf, motor, toggle }}>{children}</PWDContext.Provider>;
}

export const usePWD = () => useContext(PWDContext);
