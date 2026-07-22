"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueData {
  name: string;
  revenue: number;
}

interface RevenueChartProps {
  data?: RevenueData[];
  primaryColor?: string;
}

export function RevenueChart({
  data = [],
  primaryColor = "#c9a227",
}: RevenueChartProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Revenus de la semaine</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Aucune donnée disponible
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={primaryColor}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={primaryColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tick={{ fill: "#fff" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "#fff" }}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [
                    `${value.toLocaleString("fr-FR")} FCFA`,
                    "Revenus",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={primaryColor}
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
