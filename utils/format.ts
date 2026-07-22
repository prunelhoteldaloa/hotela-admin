import { UserRole } from "@/lib/types";

export const formatRole = (role?: UserRole | string | null) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin";
    case "COUNTRY_ADMIN":
      return "Admin Pays";
    case "ADMIN":
      return "Admin";
    case "OWNER":
      return "Propriétaire";
    case "MANAGER":
      return "Manager";
    case "RECEPTIONIST":
      return "Réceptionniste";
    case "CASHIER":
      return "Caissier";
    default:
      return "Utilisateur";
  }
};

/** Initiales à partir d'un nom complet, ex: "Marie Touré" → "MT". */
export const getInitials = (name?: string | null) => {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
