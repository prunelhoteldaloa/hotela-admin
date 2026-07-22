"use client";
import { ReactNode } from "react";
import { initApiClient } from "./api-client";

// Initialiser le client API une seule fois
initApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/v1",
});

export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
