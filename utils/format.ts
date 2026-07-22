import { UserRole } from "@/lib/types";

export const formatRole = (role: UserRole) => {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "OWNER":
      return "Propriétaire";
    case "MANAGER":
      return "Manager";
    case "RECEPTIONIST":
      return "Receptionniste";
    default:
      return "Utilisateur";
  }
};
