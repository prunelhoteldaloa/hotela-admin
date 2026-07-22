import { Card, CardContent } from "@/components/ui/card"
import { CalendarCheck, CalendarClock, CalendarX, Wallet } from "lucide-react"
import type { Reservation } from "@/lib/types"

interface ReservationStatsProps {
  reservations: Reservation[]
}

export function ReservationStats({ reservations }: ReservationStatsProps) {
  const confirmed = reservations.filter((r) => r.status === "confirmed").length
  const checkedIn = reservations.filter((r) => r.status === "checked-in").length
  const pending = reservations.filter((r) => r.status === "pending").length
  const totalPending = reservations
    .filter((r) => r.paidAmount < r.totalAmount)
    .reduce((acc, r) => acc + (r.totalAmount - r.paidAmount), 0)

  const stats = [
    { label: "Confirmées", value: confirmed, icon: CalendarCheck, color: "text-blue-500" },
    { label: "En cours", value: checkedIn, icon: CalendarClock, color: "text-green-500" },
    { label: "En attente", value: pending, icon: CalendarX, color: "text-amber-500" },
    {
      label: "Paiements en attente",
      value: `${(totalPending / 1000).toFixed(0)}K`,
      icon: Wallet,
      color: "text-accent",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
