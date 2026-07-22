"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  CreditCard,
  ArrowUpRight,
  Calendar,
  DollarSign,
  BedDouble,
  TrendingDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdmin } from "@/hooks/useAdmin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const PLAN_COLORS = {
  essentiel: "#3b82f6",
  multi: "#8b5cf6",
  premium: "#f59e0b",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " F";
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <Skeleton className="w-16 h-5 rounded-full" />
        </div>
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-32 h-8" />
        <Skeleton className="w-40 h-3" />
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState("month");
  const [revenueMonths, setRevenueMonths] = useState(6);

  const {
    dashboard,
    dashboardLoading,
    dashboardError,
    fetchDashboard,
    revenueAnalytics,
    revenueAnalyticsLoading,
    fetchRevenueAnalytics,
  } = useAdmin();

  useEffect(() => {
    fetchDashboard();
  }, []);
  useEffect(() => {
    fetchRevenueAnalytics(revenueMonths);
  }, [revenueMonths]);

  // Synchroniser period → revenueMonths
  useEffect(() => {
    const map: Record<string, number> = {
      week: 1,
      month: 6,
      quarter: 3,
      year: 12,
    };
    setRevenueMonths(map[period] ?? 6);
  }, [period]);

  const planData = dashboard
    ? [
        {
          name: "Essentiel",
          value: dashboard.planDistribution.essentiel,
          color: PLAN_COLORS.essentiel,
        },
        {
          name: "Multi",
          value: dashboard.planDistribution.multi,
          color: PLAN_COLORS.multi,
        },
        {
          name: "Premium",
          value: dashboard.planDistribution.premium,
          color: PLAN_COLORS.premium,
        },
      ]
    : [];

  if (dashboardError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Erreur : {dashboardError}</p>
        <Button onClick={fetchDashboard}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de la plateforme HotelSaaS
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="quarter">Ce trimestre</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats cards */}
      {dashboardLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Hôtels */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                {dashboard?.revenue.mrrGrowthPercent != null && (
                  <Badge
                    variant="outline"
                    className={
                      dashboard.revenue.mrrGrowthPercent >= 0
                        ? "text-green-600 bg-green-50 border-green-200"
                        : "text-red-600 bg-red-50 border-red-200"
                    }
                  >
                    {dashboard.revenue.mrrGrowthPercent >= 0 ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(dashboard.revenue.mrrGrowthPercent)}%
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Total Hôtels</p>
                <p className="text-2xl font-bold">
                  {dashboard?.overview.totalHotels ?? "—"}
                </p>
              </div>
              <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                <span className="text-green-600">
                  {dashboard?.overview.activeSubscriptions} actifs
                </span>
                <span>•</span>
                <span className="text-amber-600">
                  {dashboard?.overview.trialSubscriptions} en essai
                </span>
                <span>•</span>
                <span className="text-red-600">
                  {dashboard?.overview.suspendedSubscriptions} suspendus
                </span>
              </div>
            </CardContent>
          </Card>

          {/* MRR */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                {dashboard?.revenue.mrrGrowthPercent != null && (
                  <Badge
                    variant="outline"
                    className="text-green-600 bg-green-50 border-green-200"
                  >
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    {dashboard.revenue.mrrGrowthPercent}%
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  MRR (Revenu mensuel)
                </p>
                <p className="text-2xl font-bold">
                  {dashboard
                    ? formatCurrency(dashboard.revenue.monthlyRecurringRevenue)
                    : "—"}
                </p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Mois précédent :{" "}
                {dashboard
                  ? formatCurrency(dashboard.revenue.lastMonthRevenue)
                  : "—"}
              </p>
            </CardContent>
          </Card>

          {/* Réservations */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-violet-100">
                  <Calendar className="w-5 h-5 text-violet-600" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Réservations totales
                </p>
                <p className="text-2xl font-bold">
                  {dashboard?.overview.totalReservations.toLocaleString() ??
                    "—"}
                </p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {dashboard?.overview.totalStays.toLocaleString()} séjours •{" "}
                {dashboard?.overview.totalClients.toLocaleString()} clients
              </p>
            </CardContent>
          </Card>

          {/* Chambres */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-amber-100">
                  <BedDouble className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Chambres gérées</p>
                <p className="text-2xl font-bold">
                  {dashboard?.overview.totalRooms.toLocaleString() ?? "—"}
                </p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {dashboard && dashboard.overview.totalHotels > 0
                  ? `Moyenne : ${Math.round(dashboard.overview.totalRooms / dashboard.overview.totalHotels)} chambres/hôtel`
                  : ""}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* MRR chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution du MRR</CardTitle>
            <CardDescription>Revenu mensuel récurrent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {revenueAnalyticsLoading ? (
                <Skeleton className="w-full h-full rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueAnalytics ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip
                      formatter={(v: number) => [formatCurrency(v), "Revenu"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#e11d48"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plan distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution des plans</CardTitle>
            <CardDescription>Répartition par abonnement</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <Skeleton className="w-full h-[200px] rounded-lg" />
            ) : (
              <>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={planData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {planData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => [`${v} hôtels`, ""]}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {planData.map((p) => (
                    <div key={p.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {p.name} ({p.value})
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Derniers hôtels */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Derniers hôtels inscrits</CardTitle>
              <CardDescription>Les 5 dernières inscriptions</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/hotels">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="space-y-1">
                        <Skeleton className="w-32 h-4" />
                        <Skeleton className="w-20 h-3" />
                      </div>
                    </div>
                    <Skeleton className="w-16 h-6 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard?.recentHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="flex items-center justify-between"
                  >
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
                    <div className="text-right">
                      <Badge
                        className={
                          hotel.owner.subscription?.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : hotel.owner.subscription?.status === "TRIAL"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }
                      >
                        {hotel.owner.subscription?.status === "ACTIVE"
                          ? "Actif"
                          : hotel.owner.subscription?.status === "TRIAL"
                            ? "Essai"
                            : "Suspendu"}
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground capitalize">
                        {hotel.owner.subscription?.plan?.toLowerCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Derniers paiements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Derniers paiements</CardTitle>
              <CardDescription>Les 5 dernières transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/payments">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="space-y-1">
                        <Skeleton className="w-32 h-4" />
                        <Skeleton className="w-20 h-3" />
                      </div>
                    </div>
                    <Skeleton className="w-20 h-5" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard?.recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                          payment.status === "succeeded"
                            ? "bg-green-100"
                            : payment.status === "failed"
                              ? "bg-red-100"
                              : "bg-amber-100"
                        }`}
                      >
                        <CreditCard
                          className={`w-5 h-5 ${
                            payment.status === "succeeded"
                              ? "text-green-600"
                              : payment.status === "failed"
                                ? "text-red-600"
                                : "text-amber-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          {payment.subscription.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          Plan {payment.subscription.plan.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          payment.status === "succeeded"
                            ? "text-green-600"
                            : payment.status === "failed"
                              ? "text-red-600"
                              : "text-amber-600"
                        }`}
                      >
                        {payment.status === "succeeded" ? "+" : ""}
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
