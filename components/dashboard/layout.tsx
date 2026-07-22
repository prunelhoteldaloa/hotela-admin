"use client";

import type React from "react";
import { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { useAuthStore } from "@/stores/auth.store";
import { AddHotelButton } from "@/components/add-hotel-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import debug utils en dev
if (process.env.NODE_ENV === "development") {
  import("@/utils/store-util");
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOwner = useAuthStore((state) => state.isOwner());
  const availableHotels = useAuthStore((state) => state.availableHotels);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const user = useAuthStore((state) => state.user);

  // Debug: Afficher les changements
  useEffect(() => {
    console.log("📊 Dashboard Layout - État:", {
      isOwner,
      availableHotelsCount: availableHotels.length,
      hotels: availableHotels,
      ownedHotelsFromUser: user?.ownedHotels,
    });
  }, [isOwner, availableHotels, user?.ownedHotels]);

  // Si l'utilisateur est OWNER et n'a aucun hôtel
  const shouldShowEmptyState = isOwner && availableHotels.length === 0;

  // 🔧 DEBUG: Bouton pour forcer le rechargement
  const handleForceRefresh = async () => {
    console.log("🔄 Force refresh déclenché");
    await fetchCurrentUser();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden md:flex md:w-64">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden md:border-l">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* 🔧 DEBUG: Bouton temporaire */}
          {/* {process.env.NODE_ENV === "development" && (
            <div className="fixed bottom-4 right-4 z-50">
              <Button
                onClick={handleForceRefresh}
                size="sm"
                variant="outline"
                className="shadow-lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Force Refresh
              </Button>
            </div>
          )} */}

          {shouldShowEmptyState ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
              <Card className="w-full max-w-md border-dashed">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <Building2 className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Bienvenue !</CardTitle>
                  <CardDescription className="text-base">
                    Pour commencer à utiliser la plateforme, veuillez créer
                    votre premier établissement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <AddHotelButton />
                </CardContent>
              </Card>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
