import { create } from "zustand";
import { persist } from "zustand/middleware";
import { usersService, type User } from "@/services/users-services";

interface AuthStore {
  // État
  user: User | null;
  currentHotel: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    logo?: string | null; // ← ajout
  } | null;

  availableHotels: Array<{
    id: string;
    name: string;
    email?: string;
    logo?: string | null; // ← ajout
  }>;
  isLoading: boolean;
  error: string | null;

  // Actions utilisateur
  setUser: (user: User | null) => void;
  fetchCurrentUser: () => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;

  // Actions hôtel
  setCurrentHotel: (hotel: AuthStore["currentHotel"]) => void;
  clearCurrentHotel: () => void;

  // Helpers
  isOwner: () => boolean;
  isSaasAdmin: () => boolean;
  canManageMultipleHotels: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // État initial
      user: null,
      currentHotel: null,
      availableHotels: [],
      isLoading: true,
      error: null,

      // Actions utilisateur
      setUser: (user) => {
        set({ user, error: null });

        // Calculer availableHotels
        let availableHotels: Array<{
          id: string;
          name: string;
          email?: string;
        }> = [];
        if (user?.role === "OWNER" && user.ownedHotels) {
          availableHotels = user.ownedHotels;
        } else if (user?.hotel) {
          availableHotels = [user.hotel];
        }

        set({ availableHotels });

        // Si l'utilisateur est OWNER avec plusieurs hôtels, sélectionner "all" par défaut
        if (
          user?.role === "OWNER" &&
          user.ownedHotels &&
          user.ownedHotels.length > 1
        ) {
          set({
            currentHotel: {
              id: "all",
              name: "Tous les établissements",
            },
          });
        }
        // Si l'utilisateur a un seul hôtel (rôle OWNER avec ownedHotels)
        else if (user?.role === "OWNER" && user.ownedHotels?.length === 1) {
          set({ currentHotel: user.ownedHotels[0] });
        }
        // Si l'utilisateur a un hotelId assigné (autres rôles)
        else if (user?.hotel) {
          set({ currentHotel: user.hotel });
        }
      },

      fetchCurrentUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await usersService.getCurrentUser();

          // Calculer availableHotels
          let availableHotels: Array<{
            id: string;
            name: string;
            email?: string;
          }> = [];
          if (user?.role === "OWNER" && user.ownedHotels) {
            availableHotels = user.ownedHotels;
          } else if (user?.hotel) {
            availableHotels = [user.hotel];
          }

          // Définir l'hôtel courant
          let currentHotel = null;

          // Si l'utilisateur est OWNER avec plusieurs hôtels, sélectionner "all" par défaut
          if (
            user?.role === "OWNER" &&
            user.ownedHotels &&
            user.ownedHotels.length > 1
          ) {
            currentHotel = {
              id: "all",
              name: "Tous les établissements",
            };
          }
          // Si l'utilisateur a un seul hôtel (rôle OWNER)
          else if (user?.role === "OWNER" && user.ownedHotels?.length === 1) {
            currentHotel = user.ownedHotels[0];
          }
          // Si l'utilisateur a un hotelId assigné (autres rôles)
          else if (user?.hotel) {
            currentHotel = user.hotel;
          }

          set({
            user,
            availableHotels,
            currentHotel,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Erreur lors de la récupération de l'utilisateur";
          set({
            error: errorMessage,
            user: null,
            availableHotels: [],
            currentHotel: null,
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          user: null,
          currentHotel: null,
          availableHotels: [],
          error: null,
        });
      },

      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      // Actions hôtel
      setCurrentHotel: (hotel) => {
        const state = get();

        // Vérifier que l'utilisateur peut accéder à cet hôtel
        if (state.user?.role === "OWNER") {
          // Autoriser "all" pour les OWNER avec plusieurs hôtels
          if (hotel?.id === "all") {
            set({ currentHotel: hotel });
            return;
          }

          const hasAccess = state.user.ownedHotels?.some(
            (h) => h.id === hotel?.id,
          );
          if (hasAccess || !hotel) {
            set({ currentHotel: hotel });
          } else {
            console.warn("Tentative d'accès à un hôtel non autorisé");
          }
        } else if (state.user?.hotelId === hotel?.id) {
          set({ currentHotel: hotel });
        }
      },

      clearCurrentHotel: () => {
        const state = get();

        // Si l'utilisateur peut gérer plusieurs hôtels, définir "all"
        if (
          state.user?.role === "OWNER" &&
          state.user.ownedHotels &&
          state.user.ownedHotels.length > 1
        ) {
          set({
            currentHotel: {
              id: "all",
              name: "Tous les établissements",
            },
          });
        } else {
          set({ currentHotel: null });
        }
      },

      // Helpers
      isOwner: () => {
        return get().user?.role === "OWNER";
      },

      isSaasAdmin: () => {
        return get().user?.isSaasAdmin === true;
      },

      canManageMultipleHotels: () => {
        const state = get();
        return (
          state.user?.role === "OWNER" &&
          (state.user.ownedHotels?.length ?? 0) > 1
        );
      },
    }),
    {
      name: "auth-storage",
      // Ne persister que les données essentielles
      partialize: (state) => ({
        user: state.user,
        currentHotel: state.currentHotel,
      }),
      // Merger l'état persisté avec le nouvel état
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        // Recalculer availableHotels depuis user persisté
        availableHotels: (() => {
          const user = persistedState?.user;
          if (user?.role === "OWNER" && user.ownedHotels) {
            return user.ownedHotels;
          } else if (user?.hotel) {
            return [user.hotel];
          }
          return [];
        })(),
      }),
    },
  ),
);

// Hook pour faciliter l'accès aux données
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useCurrentHotel = () =>
  useAuthStore((state) => state.currentHotel);
export const useIsOwner = () => useAuthStore((state) => state.isOwner());
export const useIsSaasAdmin = () =>
  useAuthStore((state) => state.isSaasAdmin());
export const useCanManageMultipleHotels = () =>
  useAuthStore((state) => state.canManageMultipleHotels());
