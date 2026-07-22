"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { fetchCurrentUser, user } = useAuthStore();

  useEffect(() => {
    // Charger l'utilisateur au montage du composant
    // Seulement si on n'a pas déjà un utilisateur en cache
    if (!user) {
      fetchCurrentUser().catch((error) => {
        console.error("Erreur lors du chargement de l'utilisateur:", error);
      });
    }
  }, []);

  return <>{children}</>;
}

// Hook pour forcer le rechargement de l'utilisateur (après login par exemple)
export function useRefreshAuth() {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  return fetchCurrentUser;
}
