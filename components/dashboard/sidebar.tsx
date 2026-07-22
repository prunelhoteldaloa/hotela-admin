"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Receipt,
  BarChart3,
  Building2,
  Users,
  Settings,
  Globe,
  LogOut,
  ChevronDown,
  Key,
  UserPlus2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { authClient } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth.store";
import { UserRole } from "@/lib/types";

// Type pour les rôles

// Configuration de la navigation avec permissions
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["OWNER", "MANAGER", "RECEPTIONIST"] as UserRole[],
  },
  {
    name: "Chambres",
    href: "/dashboard/rooms",
    icon: BedDouble,
    roles: ["OWNER", "MANAGER", "RECEPTIONIST"] as UserRole[],
  },
  {
    name: "Réservations",
    href: "/dashboard/reservations",
    icon: CalendarDays,
    roles: ["OWNER", "MANAGER", "RECEPTIONIST"] as UserRole[],
  },
  {
    name: "Facturation",
    href: "/dashboard/invoices",
    icon: Receipt,
    roles: ["OWNER", "MANAGER"] as UserRole[],
  },
  {
    name: "Rapports",
    href: "/dashboard/reports",
    icon: BarChart3,
    roles: ["OWNER", "MANAGER"] as UserRole[],
  },
  {
    name: "Clients",
    href: "/dashboard/clients",
    icon: UserPlus2,
    roles: ["OWNER", "MANAGER", "RECEPTIONIST"] as UserRole[],
  },
  {
    name: "Multi-Hôtels",
    href: "/dashboard/hotels",
    icon: Building2,
    roles: ["OWNER"] as UserRole[],
  },
  {
    name: "Utilisateurs",
    href: "/dashboard/users",
    icon: Users,
    roles: ["OWNER", "MANAGER"] as UserRole[],
  },
  {
    name: "Abonnement",
    href: "/dashboard/billing",
    icon: Users,
    roles: ["OWNER"] as UserRole[],
  },
  {
    name: "Clés API",
    href: "/dashboard/api-keys",
    icon: Key,
    roles: ["OWNER"] as UserRole[],
  },
  {
    name: "Site Web",
    href: "/dashboard/website",
    icon: Globe,
    roles: ["OWNER"] as UserRole[],
  },
  {
    name: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["OWNER", "MANAGER"] as UserRole[],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Récupération des données depuis le store Zustand
  const user = useAuthStore((state) => state.user);
  const currentHotel = useAuthStore((state) => state.currentHotel);
  const availableHotels = useAuthStore((state) => state.availableHotels);
  const setCurrentHotel = useAuthStore((state) => state.setCurrentHotel);
  const clearCurrentHotel = useAuthStore((state) => state.clearCurrentHotel);
  const logout = useAuthStore((state) => state.logout);
  const isOwner = useAuthStore((state) => state.isOwner());
  const canManageMultiple = useAuthStore((state) =>
    state.canManageMultipleHotels()
  );

  const handleLogout = async () => {
    await authClient.signOut();
    logout(); // Clear le store Zustand
    router.push("/");
  };

  // Filtrer la navigation selon le rôle de l'utilisateur
  const filteredNavigation = navigation.filter((item) => {
    if (!user?.role) return false;
    return item.roles.includes(user.role as UserRole);
  });

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-sidebar-border px-4">
        <Logo size="sm" />
      </div>

      {/* Hotel Selector */}
      <div className="border-b border-sidebar-border p-3">
        {isOwner && canManageMultiple ? (
          // OWNER avec plusieurs hôtels - peut choisir
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between bg-sidebar-accent h-11 text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
              >
                <div className="flex items-center gap-2 truncate">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {currentHotel?.name ?? "Tous les établissements"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {availableHotels.map((hotel) => (
                <DropdownMenuItem
                  key={hotel.id}
                  onClick={() => setCurrentHotel(hotel)}
                  className={cn(currentHotel?.id === hotel.id && "bg-accent")}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  {hotel.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => clearCurrentHotel()}
                className={cn(
                  !currentHotel && "bg-accent text-accent-foreground"
                )}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Tous les établissements
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : availableHotels.length > 0 ? (
          // Utilisateur avec un seul hôtel ou hôtel assigné - affichage simple
          <Button
            disabled
            variant="ghost"
            className="w-full justify-start h-11"
          >
            <Building2 className="mr-2 h-4 w-4" />
            <span className="truncate">{availableHotels[0].name}</span>
          </Button>
        ) : (
          // Pas d'hôtel (état vide)
          <Button
            disabled
            variant="ghost"
            className="w-full justify-start h-11"
          >
            <Building2 className="mr-2 h-4 w-4" />
            Aucun établissement
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 h-11 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Vous êtes sur le point de vous déconnecter de votre compte.
                Souhaitez-vous continuer ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Me déconnecter
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
