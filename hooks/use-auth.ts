import { useAuthStore } from "@/stores/auth.store";

/**
 * Hook compatible avec votre code existant
 * Retourne les mêmes données que votre ancien hook
 */
export function useCurrentUser() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  return {
    user,
    isLoading,
    error,
    refetch: fetchCurrentUser,
  };
}

/**
 * Hook pour gérer l'authentification complète
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const currentHotel = useAuthStore((state) => state.currentHotel);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const logout = useAuthStore((state) => state.logout);
  const isOwner = useAuthStore((state) => state.isOwner());
  const isSaasAdmin = useAuthStore((state) => state.isSaasAdmin());
  const canManageMultiple = useAuthStore((state) =>
    state.canManageMultipleHotels()
  );

  return {
    user,
    currentHotel,
    isLoading,
    error,
    isOwner,
    isSaasAdmin,
    canManageMultiple,
    isAuthenticated: !!user,
    refetch: fetchCurrentUser,
    logout,
  };
}

/**
 * Hook pour gérer l'hôtel courant
 */
export function useCurrentHotel() {
  const currentHotel = useAuthStore((state) => state.currentHotel);
  const setCurrentHotel = useAuthStore((state) => state.setCurrentHotel);
  const clearCurrentHotel = useAuthStore((state) => state.clearCurrentHotel);
  const availableHotels = useAuthStore((state) => state.availableHotels);

  return {
    currentHotel,
    availableHotels,
    setCurrentHotel,
    clearCurrentHotel,
  };
}
