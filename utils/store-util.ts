import { useAuthStore } from "@/stores/auth.store";

/**
 * Diagnostiquer l'état du store et du localStorage
 */
export function diagnoseAuthStore() {
  console.group("🔍 Diagnostic du Store Auth");

  // État actuel du store
  const state = useAuthStore.getState();
  console.log("📦 État du store:", {
    user: state.user,
    availableHotels: state.availableHotels,
    currentHotel: state.currentHotel,
  });

  // Vérifier localStorage
  const stored = localStorage.getItem("auth-storage");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      console.log("💾 LocalStorage:", parsed);

      // Comparer
      const userFromStorage = parsed.state?.user;
      const userFromStore = state.user;

      console.log("🔄 Comparaison user:", {
        inStorage: userFromStorage?.ownedHotels,
        inStore: userFromStore?.ownedHotels,
        match:
          JSON.stringify(userFromStorage?.ownedHotels) ===
          JSON.stringify(userFromStore?.ownedHotels),
      });

      console.log("🔄 Comparaison availableHotels:", {
        inStorage: parsed.state?.availableHotels,
        inStore: state.availableHotels,
        match:
          JSON.stringify(parsed.state?.availableHotels) ===
          JSON.stringify(state.availableHotels),
      });
    } catch (e) {
      console.error("❌ Erreur de parsing localStorage:", e);
    }
  } else {
    console.log("💾 Pas de données en localStorage");
  }

  console.groupEnd();
}

/**
 * Nettoyer le localStorage et recharger
 */
export async function resetAuthStore() {
  console.log("🧹 Nettoyage du store...");

  // Supprimer de localStorage
  localStorage.removeItem("auth-storage");

  // Recharger l'utilisateur
  const { fetchCurrentUser } = useAuthStore.getState();
  await fetchCurrentUser();

  console.log("✅ Store réinitialisé");
  diagnoseAuthStore();
}

// Exposer dans window pour debug en console
if (typeof window !== "undefined") {
  (window as any).diagnoseAuthStore = diagnoseAuthStore;
  (window as any).resetAuthStore = resetAuthStore;
}

console.log("💡 Debug disponibles dans la console:");
console.log("- window.diagnoseAuthStore() : Diagnostiquer l'état");
console.log("- window.resetAuthStore() : Nettoyer et recharger");
