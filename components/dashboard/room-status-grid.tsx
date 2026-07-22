"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Room } from "@/lib/types"

interface RoomStatusGridProps {
  rooms: Room[]
}

const statusConfig = {
  available: { label: "Libre", color: "bg-green-500/20 text-green-500 border-green-500/30" },
  occupied: { label: "Occupée", color: "bg-blue-500/20 text-blue-500 border-blue-500/30" },
  cleaning: { label: "Ménage", color: "bg-amber-500/20 text-amber-500 border-amber-500/30" },
  maintenance: { label: "Maintenance", color: "bg-red-500/20 text-red-500 border-red-500/30" },
}

const typeLabels = {
  standard: "Standard",
  deluxe: "Deluxe",
  suite: "Suite",
  penthouse: "Penthouse",
}

export function RoomStatusGrid({ rooms }: RoomStatusGridProps) {
  const groupedByFloor = rooms.reduce(
    (acc, room) => {
      if (!acc[room.floor]) acc[room.floor] = []
      acc[room.floor].push(room)
      return acc
    },
    {} as Record<number, Room[]>,
  )

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>État des chambres</span>
          <div className="flex gap-2">
            {Object.entries(statusConfig).map(([key, config]) => (
              <Badge key={key} variant="outline" className={cn("text-xs", config.color)}>
                {config.label}
              </Badge>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedByFloor).map(([floor, floorRooms]) => (
            <div key={floor}>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Étage {floor}</h4>
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2">
                {floorRooms.map((room) => (
                  <div
                    key={room.id}
                    className={cn(
                      "relative p-3 rounded-lg border cursor-pointer transition-all hover:scale-105",
                      statusConfig[room.status].color,
                    )}
                  >
                    <div className="font-bold text-lg">{room.number}</div>
                    <div className="text-xs opacity-80">{typeLabels[room.type]}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
