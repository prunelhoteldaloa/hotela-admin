"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BedDouble,
  Users,
  Building2,
  Banknote,
  Edit,
  Calendar,
  Wrench,
  Sparkles,
  CheckCircle,
  Clock,
  Wifi,
  Tv,
  AirVent,
  Coffee,
  Bath,
  Car,
  Loader2,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useRoom } from "@/hooks/use-rooms";
import { roomsService } from "@/services/rooms.service";
import { toast } from "sonner";
import { useState } from "react";

const statusConfig = {
  AVAILABLE: {
    label: "Disponible",
    variant: "default" as const,
    color: "bg-green-500",
  },
  OCCUPIED: {
    label: "Occupée",
    variant: "secondary" as const,
    color: "bg-blue-500",
  },
  CLEANING: {
    label: "Ménage",
    variant: "secondary" as const,
    color: "bg-amber-500",
  },
  MAINTENANCE: {
    label: "Maintenance",
    variant: "destructive" as const,
    color: "bg-red-500",
  },
};

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  tv: Tv,
  climatisation: AirVent,
  "machine à café": Coffee,
  "salle de bain": Bath,
  parking: Car,
};

const getAmenityIcon = (amenity: string) => {
  const key = amenity.toLowerCase();
  for (const [iconKey, Icon] of Object.entries(amenityIcons)) {
    if (key.includes(iconKey)) return Icon;
  }
  return Coffee; // Icône par défaut
};

export default function RoomDetailPage({ id }: { id: string }) {
  const currentHotel = useAuthStore((state) => state.currentHotel);
  const [isUpdating, setIsUpdating] = useState(false);

  const { room, isLoading, error, refetch } = useRoom(
    currentHotel?.id || null,
    id
  );

  const handleStatusChange = async (newStatus: keyof typeof statusConfig) => {
    if (!currentHotel || !room || room?.status === newStatus) return;

    setIsUpdating(true);
    try {
      await roomsService.update(currentHotel.id, room?.id, {
        status: newStatus,
      });
      toast.success("Statut mis à jour avec succès");
      refetch();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const status = statusConfig[room?.status];
  const roomType = room?.type;
  const stats = room?.statistics;

  const currentReservation = stats?.currentReservation;
  const upcomingReservations = stats?.upcomingReservations || [];
  const pastReservations = stats?.pastReservations || [];

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex  gap-4">
          <div className="flex flex-col">
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-bold">Chambre {room?.number}</h1>
              <div className="space-x-4">
                <Badge variant={status?.variant}>{status?.label}</Badge>
                {roomType && (
                  <Badge variant="outline" className="capitalize">
                    {roomType.name}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-muted-foreground">
              {roomType?.description || "Chambre confortable"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange("CLEANING")}
            disabled={isUpdating || room?.status === "CLEANING"}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Ménage
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange("MAINTENANCE")}
            disabled={isUpdating || room?.status === "MAINTENANCE"}
          >
            <Wrench className="mr-2 h-4 w-4" />
            Maintenance
          </Button>
          <Link href={`/dashboard/rooms/${room?.id}/edit`}>
            <Button size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Image */}
          <Card className="border-border/50 overflow-hidden p-0">
            {roomType?.image ? (
              <div className="aspect-video relative">
                <img
                  src={roomType.image}
                  alt={`Chambre ${room?.number}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <BedDouble className="h-24 w-24 text-primary/30" />
              </div>
            )}
          </Card>

          {/* Room Stats */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{room?.floor}</p>
                  <p className="text-sm text-muted-foreground">Étage</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {roomType?.capacity || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">Personnes</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Banknote className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {roomType?.price
                      ? (roomType.price / 1000).toFixed(0) + "K"
                      : "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">FCFA/nuit</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${status?.color}/20`}>
                  <div className={`h-5 w-5 rounded-full ${status?.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold">{status?.label}</p>
                  <p className="text-sm text-muted-foreground">Statut</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Équipements */}
          {roomType?.equipmets && roomType.equipmets.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Équipements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {roomType.equipmets.map((amenity, i) => {
                    const IconComponent = getAmenityIcon(amenity);
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <IconComponent className="h-5 w-5 text-primary" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Réservations */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Réservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="current">
                <TabsList>
                  <TabsTrigger value="current">En cours</TabsTrigger>
                  <TabsTrigger value="upcoming">
                    À venir ({upcomingReservations.length})
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    Historique ({pastReservations.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="pt-4">
                  {currentReservation ? (
                    <div className="p-4 rounded-lg border border-border/50 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {currentReservation.guestName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {currentReservation.guestEmail}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {currentReservation.guestPhone}
                          </div>
                        </div>
                        <Badge>En cours</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Check-in
                          </p>
                          <p className="font-medium">
                            {formatDate(currentReservation.checkIn)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Check-out
                          </p>
                          <p className="font-medium">
                            {formatDate(currentReservation.checkOut)}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between pt-3 border-t">
                        <span className="text-sm text-muted-foreground">
                          Montant total
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(currentReservation.totalAmount)}
                        </span>
                      </div>
                      <Link
                        href={`/dashboard/reservations/${currentReservation.id}`}
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          Voir détails
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Aucune réservation en cours</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="upcoming" className="pt-4">
                  {upcomingReservations.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingReservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="p-4 rounded-lg border border-border/50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium">
                              {reservation.guestName}
                            </span>
                            <Badge variant="outline">
                              {reservation.status === "CONFIRMED"
                                ? "Confirmée"
                                : "Pending"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Arrivée</p>
                              <p>{formatDate(reservation.checkIn)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Départ</p>
                              <p>{formatDate(reservation.checkOut)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Aucune réservation à venir</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="pt-4">
                  {pastReservations.length > 0 ? (
                    <div className="space-y-3">
                      {pastReservations.map((reservation: any) => (
                        <div
                          key={reservation.id}
                          className="p-4 rounded-lg border border-border/50 opacity-75"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium">
                              {reservation.guestName}
                            </span>
                            <Badge variant="secondary">Terminée</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Arrivée</p>
                              <p>{formatDate(reservation.checkIn)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Départ</p>
                              <p>{formatDate(reservation.checkOut)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Aucun historique disponible</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Status Change */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Changer le statut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(statusConfig).map(([key, config]) => (
                <Button
                  key={key}
                  variant={room?.status === key ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() =>
                    handleStatusChange(key as keyof typeof statusConfig)
                  }
                  disabled={isUpdating || room?.status === key}
                >
                  {isUpdating && room?.status !== key && (
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  )}
                  <div
                    className={`h-3 w-3 rounded-full ${config.color} mr-2`}
                  />
                  {config.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Revenue Stats */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Revenus ce mois
                </span>
                <span className="font-semibold">
                  {formatCurrency(stats?.monthlyRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Taux d'occupation
                </span>
                <span className="font-semibold">
                  {stats?.occupancyRate || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Réservations totales
                </span>
                <span className="font-semibold">
                  {stats?.totalReservations || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Log */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Derniers entretiens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats?.lastCleaning ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium">Dernier ménage</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(stats.lastCleaning.date)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Par {stats.lastCleaning.by}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Aucun historique d'entretien disponible
                </div>
              )}

              {stats?.maintenanceLogs && stats.maintenanceLogs.length > 0 && (
                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Wrench className="h-4 w-4 text-destructive" />
                    <span className="font-medium">Maintenances récentes</span>
                  </div>
                  {stats.maintenanceLogs.slice(0, 3).map((log, i) => (
                    <div key={i} className="text-xs text-muted-foreground">
                      {formatDate(log.date)} - {log.by}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
