"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Building2,
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/hooks/useAdmin";
import type { AdminHotel, SubscriptionPlan } from "@/services/admin.service";

const PLAN_PRICES: Record<SubscriptionPlan, string> = {
  ESSENTIEL: "10 000 F/mois",
  MULTI: "20 000 F/mois",
  PREMIUM: "35 000 F/mois",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " F";
}

function PlanBadge({ plan }: { plan: SubscriptionPlan }) {
  const styles: Record<SubscriptionPlan, string> = {
    PREMIUM: "border-amber-300 bg-amber-50 text-amber-700",
    MULTI: "border-violet-300 bg-violet-50 text-violet-700",
    ESSENTIEL: "border-blue-300 bg-blue-50 text-blue-700",
  };
  return (
    <Badge variant="outline" className={styles[plan]}>
      {plan.charAt(0) + plan.slice(1).toLowerCase()}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: "Actif", className: "bg-green-100 text-green-700" },
    TRIAL: { label: "Essai", className: "bg-amber-100 text-amber-700" },
    SUSPENDED: { label: "Suspendu", className: "bg-red-100 text-red-700" },
    PAST_DUE: { label: "Impayé", className: "bg-orange-100 text-orange-700" },
    CANCELLED: { label: "Annulé", className: "bg-slate-100 text-slate-700" },
  };
  const entry = map[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-700",
  };
  return <Badge className={entry.className}>{entry.label}</Badge>;
}

export default function AdminHotelsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState<AdminHotel | null>(null);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  const {
    hotels,
    hotelsLoading,
    fetchHotels,
    hotelDetail,
    hotelDetailLoading,
    fetchHotelDetail,
    hotelMutating,
    suspendHotel,
    reactivateHotel,
    changeHotelPlan,
  } = useAdmin();

  const load = useCallback(() => {
    fetchHotels({
      page,
      limit: 20,
      search: search || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      plan: planFilter !== "all" ? planFilter : undefined,
    });
  }, [page, search, statusFilter, planFilter]);

  useEffect(() => {
    load();
  }, [load]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load();
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleViewDetail = (hotel: AdminHotel) => {
    setSelectedHotel(hotel);
    fetchHotelDetail(hotel.id);
  };

  const handleSuspend = async () => {
    if (!selectedHotel) return;
    await suspendHotel(selectedHotel.id, suspendReason, () => {
      setShowSuspendDialog(false);
      setSuspendReason("");
      setSelectedHotel(null);
      load();
    });
  };

  const handleReactivate = async (hotel: AdminHotel) => {
    await reactivateHotel(hotel.id, () => load());
  };

  const handleChangePlan = async (
    hotel: AdminHotel,
    plan: SubscriptionPlan,
  ) => {
    await changeHotelPlan(hotel.id, plan, () => load());
  };

  const stats = {
    total: hotels?.meta.total ?? 0,
    active:
      hotels?.data.filter((h) => h.owner.subscription?.status === "ACTIVE")
        .length ?? 0,
    trial:
      hotels?.data.filter((h) => h.owner.subscription?.status === "TRIAL")
        .length ?? 0,
    suspended:
      hotels?.data.filter((h) => h.owner.subscription?.status === "SUSPENDED")
        .length ?? 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des hôtels</h1>
          <p className="text-muted-foreground">
            Gérer les comptes hôtels de la plateforme
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: "Total",
            value: hotels?.meta.total ?? "—",
            icon: Building2,
            color: "slate",
          },
          {
            label: "Actifs",
            value: stats.active,
            icon: CheckCircle,
            color: "green",
          },
          {
            label: "En essai",
            value: stats.trial,
            icon: Calendar,
            color: "amber",
          },
          {
            label: "Suspendus",
            value: stats.suspended,
            icon: Ban,
            color: "red",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${color}-100`}>
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email ou ville..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="TRIAL">En essai</SelectItem>
                <SelectItem value="SUSPENDED">Suspendu</SelectItem>
                <SelectItem value="PAST_DUE">Impayé</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={planFilter}
              onValueChange={(v) => {
                setPlanFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les plans</SelectItem>
                <SelectItem value="ESSENTIEL">Essentiel</SelectItem>
                <SelectItem value="MULTI">Multi</SelectItem>
                <SelectItem value="PREMIUM">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hôtel</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden md:table-cell">Chambres</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Inscription
                </TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotelsLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                      <TableCell />
                    </TableRow>
                  ))
                : hotels?.data.map((hotel) => (
                    <TableRow key={hotel.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
                            <Building2 className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium">{hotel.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {hotel.city.name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {hotel.owner.subscription?.plan ? (
                          <PlanBadge plan={hotel.owner.subscription.plan} />
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={hotel.owner.subscription?.status ?? "—"}
                        />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {hotel._count.rooms}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(hotel.createdAt).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewDetail(hotel)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {hotel.owner.subscription?.status ===
                            "SUSPENDED" ? (
                              <DropdownMenuItem
                                className="text-green-600"
                                onClick={() => handleReactivate(hotel)}
                                disabled={hotelMutating}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Réactiver
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-amber-600"
                                onClick={() => {
                                  setSelectedHotel(hotel);
                                  setShowSuspendDialog(true);
                                }}
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Suspendre
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled
                              className="text-xs text-muted-foreground"
                            >
                              Changer de plan
                            </DropdownMenuItem>
                            {(
                              [
                                "ESSENTIEL",
                                "MULTI",
                                "PREMIUM",
                              ] as SubscriptionPlan[]
                            )
                              .filter(
                                (p) => p !== hotel.owner.subscription?.plan,
                              )
                              .map((plan) => (
                                <DropdownMenuItem
                                  key={plan}
                                  onClick={() => handleChangePlan(hotel, plan)}
                                  disabled={hotelMutating}
                                >
                                  →{" "}
                                  {plan.charAt(0) + plan.slice(1).toLowerCase()}
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {hotels && hotels.meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                {hotels.meta.total} hôtels • page {page}/
                {hotels.meta.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= hotels.meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog
        open={!!selectedHotel && !showSuspendDialog}
        onOpenChange={() => setSelectedHotel(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedHotel && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  {hotelDetailLoading ? (
                    <Skeleton className="w-40 h-6" />
                  ) : (
                    (hotelDetail?.name ?? selectedHotel.name)
                  )}
                </DialogTitle>
                <DialogDescription>Détails du compte hôtel</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Informations</TabsTrigger>
                  <TabsTrigger value="subscription">Abonnement</TabsTrigger>
                  <TabsTrigger value="stats">Statistiques</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {selectedHotel.email}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Téléphone</Label>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {selectedHotel.phone}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Adresse</Label>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {selectedHotel.address}, {selectedHotel.city.name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">
                        Inscription
                      </Label>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(selectedHotel.createdAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Label className="text-muted-foreground">
                      Propriétaire
                    </Label>
                    <div className="mt-2 p-3 rounded-lg bg-slate-50">
                      <p className="font-medium">{selectedHotel.owner.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedHotel.owner.email}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="subscription" className="space-y-4 mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-lg border">
                      <Label className="text-muted-foreground">
                        Plan actuel
                      </Label>
                      <p className="mt-1 text-xl font-bold">
                        {selectedHotel.owner.subscription?.plan ?? "—"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedHotel.owner.subscription?.plan
                          ? PLAN_PRICES[selectedHotel.owner.subscription.plan]
                          : ""}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <Label className="text-muted-foreground">Statut</Label>
                      <div className="mt-1">
                        <StatusBadge
                          status={
                            selectedHotel.owner.subscription?.status ?? "—"
                          }
                        />
                      </div>
                      {selectedHotel.owner.subscription?.trialEndsAt && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Essai jusqu'au{" "}
                          {new Date(
                            selectedHotel.owner.subscription.trialEndsAt,
                          ).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedHotel.owner.subscription?.currentPeriodEnd && (
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">
                        Prochaine facturation
                      </Label>
                      <p>
                        {new Date(
                          selectedHotel.owner.subscription.currentPeriodEnd,
                        ).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="stats" className="space-y-4 mt-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-lg border text-center">
                      <p className="text-2xl font-bold">
                        {selectedHotel._count.rooms}
                      </p>
                      <p className="text-sm text-muted-foreground">Chambres</p>
                    </div>
                    <div className="p-4 rounded-lg border text-center">
                      <p className="text-2xl font-bold">
                        {selectedHotel._count.reservations}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Réservations
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border text-center">
                      <p className="text-2xl font-bold">
                        {selectedHotel._count.clients}
                      </p>
                      <p className="text-sm text-muted-foreground">Clients</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedHotel(null)}
                >
                  Fermer
                </Button>
                <Button>
                  <Mail className="w-4 h-4 mr-2" />
                  Contacter
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Suspend dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspendre le compte</DialogTitle>
            <DialogDescription>
              {selectedHotel?.name} n'aura plus accès à la plateforme jusqu'à
              réactivation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Raison de la suspension</Label>
            <Textarea
              placeholder="Décrivez la raison..."
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSuspendDialog(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleSuspend}
              disabled={hotelMutating || !suspendReason.trim()}
            >
              <Ban className="w-4 h-4 mr-2" />
              {hotelMutating ? "Suspension..." : "Suspendre"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
