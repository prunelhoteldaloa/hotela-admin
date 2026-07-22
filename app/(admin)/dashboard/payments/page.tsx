"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
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
import { useAdmin } from "@/hooks/useAdmin";
import { planLabel } from "@/lib/plans";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " F";
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  succeeded: { label: "Réussi", className: "bg-green-100 text-green-700" },
  pending: { label: "En attente", className: "bg-amber-100 text-amber-700" },
  failed: { label: "Échoué", className: "bg-red-100 text-red-700" },
  refunded: { label: "Remboursé", className: "bg-slate-100 text-slate-700" },
};

function statusEntry(status: string) {
  return (
    STATUS_MAP[status?.toLowerCase()] ?? {
      label: status,
      className: "bg-slate-100 text-slate-700",
    }
  );
}

function paymentMethodLabel(method: string) {
  const map: Record<string, string> = {
    "mobile-money": "Mobile Money",
    mobile_money: "Mobile Money",
    card: "Carte",
    transfer: "Virement",
    bank_transfer: "Virement",
  };
  return map[method?.toLowerCase()] ?? method ?? "—";
}

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { payments, paymentsLoading, paymentsError, fetchPayments } =
    useAdmin();

  const load = useCallback(() => {
    fetchPayments({
      page,
      limit: 20,
      search: search || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    });
  }, [page, search, statusFilter]);

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

  const rows = payments?.data ?? [];

  // Statistiques calculées sur la page courante
  const totalSucceeded = rows
    .filter((p) => p.status?.toLowerCase() === "succeeded")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalFailed = rows
    .filter((p) => p.status?.toLowerCase() === "failed")
    .reduce((sum, p) => sum + p.amount, 0);
  const stats = {
    succeeded: rows.filter((p) => p.status?.toLowerCase() === "succeeded")
      .length,
    pending: rows.filter((p) => p.status?.toLowerCase() === "pending").length,
    failed: rows.filter((p) => p.status?.toLowerCase() === "failed").length,
    refunded: rows.filter((p) => p.status?.toLowerCase() === "refunded").length,
  };

  if (paymentsError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Erreur : {paymentsError}</p>
        <Button onClick={load}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Paiements</h1>
          <p className="text-muted-foreground">
            Historique des transactions de la plateforme
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                {paymentsLoading ? (
                  <Skeleton className="w-24 h-8" />
                ) : (
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalSucceeded)}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Réussis ({stats.succeeded})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                {paymentsLoading ? (
                  <Skeleton className="w-12 h-8" />
                ) : (
                  <p className="text-2xl font-bold">{stats.pending}</p>
                )}
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                {paymentsLoading ? (
                  <Skeleton className="w-24 h-8" />
                ) : (
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalFailed)}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Échoués ({stats.failed})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100">
                <RotateCcw className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                {paymentsLoading ? (
                  <Skeleton className="w-12 h-8" />
                ) : (
                  <p className="text-2xl font-bold">{stats.refunded}</p>
                )}
                <p className="text-sm text-muted-foreground">Remboursés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou description..."
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
                <SelectItem value="succeeded">Réussi</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
                <SelectItem value="refunded">Remboursé</SelectItem>
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
                <TableHead>Client</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentsLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-10"
                  >
                    Aucun paiement trouvé
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((payment) => {
                  const entry = statusEntry(payment.status);
                  const isSucceeded =
                    payment.status?.toLowerCase() === "succeeded";
                  const isFailed = payment.status?.toLowerCase() === "failed";
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <p className="font-medium">
                          {payment.subscription.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {payment.subscription.plan
                            ? `Plan ${planLabel(payment.subscription.plan)}`
                            : payment.subscription.user.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">
                          {payment.description ?? "—"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p
                          className={`font-medium ${
                            isSucceeded
                              ? "text-green-600"
                              : isFailed
                                ? "text-red-600"
                                : ""
                          }`}
                        >
                          {formatCurrency(payment.amount)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {paymentMethodLabel(payment.paymentMethod)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={entry.className}>{entry.label}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-sm">
                          {new Date(payment.createdAt).toLocaleDateString(
                            "fr-FR",
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleTimeString(
                            "fr-FR",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {payments && payments.meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                {payments.meta.total} paiements • page {page}/
                {payments.meta.totalPages}
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
                  disabled={page >= payments.meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
