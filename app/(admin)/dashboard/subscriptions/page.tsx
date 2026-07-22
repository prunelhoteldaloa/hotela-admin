"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CreditCard,
  Search,
  MoreHorizontal,
  RefreshCw,
  XCircle,
  CheckCircle,
  Clock,
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
import { useAdmin } from "@/hooks/useAdmin";
import type { SubscriptionPlan } from "@/services/admin.service";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " F";
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Actif", className: "bg-green-100 text-green-700" },
  TRIAL: { label: "Essai", className: "bg-amber-100 text-amber-700" },
  PAST_DUE: { label: "Impayé", className: "bg-red-100 text-red-700" },
  SUSPENDED: { label: "Suspendu", className: "bg-orange-100 text-orange-700" },
  CANCELLED: { label: "Annulé", className: "bg-slate-100 text-slate-700" },
};

const PLAN_STYLES: Record<SubscriptionPlan, string> = {
  PREMIUM: "border-amber-300 bg-amber-50 text-amber-700",
  MULTI: "border-violet-300 bg-violet-50 text-violet-700",
  ESSENTIEL: "border-blue-300 bg-blue-50 text-blue-700",
};

export default function AdminSubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [changePlanTarget, setChangePlanTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlan>("ESSENTIEL");

  const {
    subscriptions,
    subscriptionsLoading,
    fetchSubscriptions,
    subscriptionStats,
    subscriptionStatsLoading,
    fetchSubscriptionStats,
    hotelMutating,
    changeHotelPlan,
  } = useAdmin();

  const load = useCallback(() => {
    fetchSubscriptions({
      page,
      limit: 20,
      search: search || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      plan: planFilter !== "all" ? planFilter : undefined,
    });
  }, [page, search, statusFilter, planFilter]);

  useEffect(() => {
    load();
    fetchSubscriptionStats();
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load();
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleChangePlan = async () => {
    if (!changePlanTarget) return;
    await changeHotelPlan(changePlanTarget.id, selectedPlan, () => {
      setChangePlanTarget(null);
      load();
      fetchSubscriptionStats();
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Abonnements</h1>
        <p className="text-muted-foreground">
          Gérer les abonnements des hôtels
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <CreditCard className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MRR Total</p>
                {subscriptionStatsLoading ? (
                  <Skeleton className="w-32 h-8 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">
                    {formatCurrency(subscriptionStats?.monthlyRevenue ?? 0)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {[
          { key: "active", label: "Actifs", icon: CheckCircle, color: "green" },
          { key: "trial", label: "En essai", icon: Clock, color: "amber" },
          { key: "pastDue", label: "Impayés", icon: XCircle, color: "red" },
        ].map(({ key, label, icon: Icon, color }) => (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${color}-100`}>
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <div>
                  {subscriptionStatsLoading ? (
                    <Skeleton className="w-12 h-8" />
                  ) : (
                    <p className="text-2xl font-bold">
                      {subscriptionStats?.[
                        key as keyof typeof subscriptionStats
                      ] ?? 0}
                    </p>
                  )}
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
                placeholder="Rechercher par nom..."
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
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="TRIAL">En essai</SelectItem>
                <SelectItem value="PAST_DUE">Impayé</SelectItem>
                <SelectItem value="SUSPENDED">Suspendu</SelectItem>
                <SelectItem value="CANCELLED">Annulé</SelectItem>
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
                <TableHead>Hôtel / Propriétaire</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden md:table-cell">Période</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptionsLoading
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
                : subscriptions?.data.map((sub) => {
                    const statusEntry = STATUS_MAP[sub.status] ?? {
                      label: sub.status,
                      className: "bg-slate-100 text-slate-700",
                    };
                    return (
                      <TableRow key={sub.id}>
                        <TableCell>
                          <p className="font-medium">
                            {sub.user.ownedHotels[0]?.name ?? sub.user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {sub.user.email}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={PLAN_STYLES[sub.plan]}
                          >
                            {sub.plan.charAt(0) +
                              sub.plan.slice(1).toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">
                            {formatCurrency(sub.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            /{sub.billingCycle === "monthly" ? "mois" : "an"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusEntry.className}>
                            {statusEntry.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <p className="text-sm">
                            {new Date(sub.currentPeriodEnd).toLocaleDateString(
                              "fr-FR",
                            )}
                          </p>
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
                                onClick={() => {
                                  setChangePlanTarget({
                                    id: sub.user.ownedHotels[0]?.id ?? "",
                                    name: sub.user.name,
                                  });
                                  setSelectedPlan(sub.plan);
                                }}
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Changer de plan
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="w-4 h-4 mr-2" />
                                Annuler
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>

          {subscriptions && subscriptions.meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                {subscriptions.meta.total} abonnements • page {page}/
                {subscriptions.meta.totalPages}
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
                  disabled={page >= subscriptions.meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change plan dialog */}
      <Dialog
        open={!!changePlanTarget}
        onOpenChange={() => setChangePlanTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer de plan</DialogTitle>
            <DialogDescription>
              Modifier le plan de {changePlanTarget?.name}
            </DialogDescription>
          </DialogHeader>
          <Select
            value={selectedPlan}
            onValueChange={(v) => setSelectedPlan(v as SubscriptionPlan)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ESSENTIEL">
                Essentiel — 10 000 F/mois
              </SelectItem>
              <SelectItem value="MULTI">Multi — 20 000 F/mois</SelectItem>
              <SelectItem value="PREMIUM">Premium — 35 000 F/mois</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePlanTarget(null)}>
              Annuler
            </Button>
            <Button onClick={handleChangePlan} disabled={hotelMutating}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {hotelMutating ? "Modification..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
