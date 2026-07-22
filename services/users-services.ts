import { authClient } from "@/lib/auth";

// ─── Types ──────────────────────────────────────────────────────────────────

export type AdminUserRole =
  | "SUPER_ADMIN"
  | "COUNTRY_ADMIN"
  | "ADMIN"
  | "OWNER"
  | "MANAGER"
  | "RECEPTIONIST"
  | "CASHIER";

export interface HotelRef {
  id: string;
  name: string;
  email?: string;
  logo?: string | null;
}

/**
 * Utilisateur courant du panel admin.
 * Alimenté par la session better-auth exposée par l'API NestJS
 * (`/v1/admin-auth`). Les champs role / isSaasAdmin / countryId sont
 * des colonnes réelles du modèle User et sont donc renvoyés dans la session.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  phone?: string | null;
  role: AdminUserRole;
  isSaasAdmin?: boolean;
  countryId?: string | null;
  country?: { id: string; name: string } | null;
  hotelId?: string | null;
  hotel?: HotelRef | null;
  ownedHotels?: HotelRef[];
  createdAt?: string;
  updatedAt?: string;
}

// ─── Service ────────────────────────────────────────────────────────────────

export const usersService = {
  /**
   * Récupère l'utilisateur connecté à partir de la session admin.
   * Lève une erreur si aucune session valide n'est présente.
   */
  async getCurrentUser(): Promise<User> {
    const { data, error } = await authClient.getSession();

    if (error) {
      throw new Error(error.message || "Session invalide");
    }
    if (!data?.user) {
      throw new Error("Aucune session active");
    }

    const u = data.user as Record<string, unknown>;

    return {
      id: String(u.id),
      name: (u.name as string) ?? "",
      email: (u.email as string) ?? "",
      emailVerified: (u.emailVerified as boolean) ?? false,
      image: (u.image as string | null) ?? null,
      phone: (u.phone as string | null) ?? null,
      role: (u.role as AdminUserRole) ?? "SUPER_ADMIN",
      isSaasAdmin: (u.isSaasAdmin as boolean) ?? false,
      countryId: (u.countryId as string | null) ?? null,
      country: (u.country as { id: string; name: string } | null) ?? null,
      hotelId: (u.hotelId as string | null) ?? null,
      hotel: (u.hotel as HotelRef | null) ?? null,
      ownedHotels: (u.ownedHotels as HotelRef[]) ?? [],
      createdAt: u.createdAt ? String(u.createdAt) : undefined,
      updatedAt: u.updatedAt ? String(u.updatedAt) : undefined,
    };
  },

  /** Déconnecte l'utilisateur courant (invalide la session admin). */
  async logout(): Promise<void> {
    await authClient.signOut();
  },
};
