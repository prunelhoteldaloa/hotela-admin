import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, Users, TrendingUp, AlertCircle } from "lucide-react";
import type { DashboardStats } from "@/lib/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Taux d'occupation",
      value: `${stats.occupancyRate}%`,
      description: `${stats.occupiedRooms}/${stats.totalRooms} chambres`,
      icon: BedDouble,
      trend: "+5% vs hier",
      trendUp: true,
    },
    {
      title: "Check-ins du jour",
      value: stats.todayCheckIns.toString(),
      description: `${stats.todayCheckOuts} check-outs prévus`,
      icon: Users,
      trend: "3 confirmés",
      trendUp: true,
    },
    {
      title: "Revenus du mois",
      value: `${(stats.monthlyRevenue / 1000).toLocaleString("fr-FR")}K`,
      description: "FCFA",
      icon: TrendingUp,
      trend: "+12% vs mois dernier",
      trendUp: true,
    },
    {
      title: "Factures en attente",
      value: stats.pendingInvoices.toString(),
      description: "À traiter",
      icon: AlertCircle,
      trend: "Action requise",
      trendUp: false,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Card key={i} className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
            {/* <p
              className={`text-xs mt-1 ${
                card.trendUp ? "text-green-500" : "text-amber-500"
              }`}
            >
              {card.trend}
            </p> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
