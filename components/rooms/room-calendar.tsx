"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { Room } from "@/services/rooms.service";
import { Reservation } from "@/services/reservations.service";

interface RoomCalendarProps {
  rooms: Room[];
  reservations?: Reservation[];
}

export function RoomCalendar({ rooms, reservations = [] }: RoomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fonction pour normaliser une date en enlevant l'heure
  const normalizeDate = (date: Date | string) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  // Fonction pour comparer deux dates sans l'heure
  const isSameDate = (date1: Date, date2: Date | string) => {
    const d1 = normalizeDate(date1);
    const d2 = normalizeDate(date2);
    return d1.getTime() === d2.getTime();
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = [];
    const date = new Date(year, month, 1);

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const days = getDaysInMonth();

  // Récupérer toutes les réservations (depuis props ou depuis les chambres)
  const getAllReservations = (): Reservation[] => {
    const result: Reservation[] = [];

    // D'abord, essayer depuis les props
    if (reservations && reservations.length > 0) {
      reservations.forEach((r) => {
        if (r && r.checkIn && r.checkOut && r.roomId) {
          result.push(r);
        }
      });
    }

    // Ensuite, récupérer depuis les chambres
    rooms.forEach((room) => {
      if (room.reservations) {
        if (Array.isArray(room.reservations)) {
          room.reservations.forEach((r) => {
            if (r && r.checkIn && r.checkOut && r.roomId) {
              result.push(r);
            }
          });
        } else if (
          typeof room.reservations === "object" &&
          room.reservations.checkIn
        ) {
          // C'est un objet unique de réservation
          const r = room.reservations as any;
          if (r.checkIn && r.checkOut) {
            result.push({ ...r, roomId: r.roomId || room.id });
          }
        }
      }
    });

    return result;
  };

  const allReservations = getAllReservations();

  // Debug : afficher les réservations trouvées
  console.log("RoomCalendar - Reservations found:", allReservations.length);
  console.log("RoomCalendar - First reservation:", allReservations[0]);
  console.log(
    "RoomCalendar - Rooms structure:",
    rooms.map((r) => ({
      id: r.id,
      number: r.number,
      hasReservations: !!r.reservations,
      reservationsType: r.reservations
        ? Array.isArray(r.reservations)
          ? "array"
          : typeof r.reservations
        : "none",
      reservationsData: r.reservations,
    }))
  );

  const getReservationForRoomAndDate = (roomId: string, date: Date) => {
    const normalizedDate = normalizeDate(date);

    return allReservations.find((r) => {
      // Vérifier que la réservation a toutes les propriétés nécessaires
      if (!r || !r.checkIn || !r.checkOut || !r.roomId) {
        return false;
      }

      try {
        const checkIn = normalizeDate(r.checkIn);
        const checkOut = normalizeDate(r.checkOut);

        // La date doit être >= checkIn et < checkOut
        return (
          r.roomId === roomId &&
          normalizedDate >= checkIn &&
          normalizedDate < checkOut
        );
      } catch (error) {
        console.error("Error processing reservation:", r, error);
        return false;
      }
    });
  };

  const isCheckInDate = (reservation: Reservation, date: Date) => {
    return isSameDate(date, reservation.checkIn);
  };

  const getReservationDaysFromDate = (
    reservation: Reservation,
    startDate: Date
  ) => {
    const checkOut = normalizeDate(reservation.checkOut);
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const effectiveEnd = checkOut < endOfMonth ? checkOut : endOfMonth;
    const normalizedStart = normalizeDate(startDate);

    const diffTime = effectiveEnd.getTime() - normalizedStart.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(1, days); // Au minimum 1 jour
  };

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const cellWidth = 40;

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Planning des chambres</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
              )
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium min-w-[150px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
              )
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table
          className="border-collapse"
          style={{ minWidth: 100 + days.length * cellWidth }}
        >
          <thead>
            <tr className="border-b border-border">
              <th
                className="p-2 font-medium text-sm text-muted-foreground text-left sticky left-0 bg-background z-10"
                style={{ width: 100, minWidth: 100 }}
              >
                Chambre
              </th>
              {days.map((day, i) => (
                <th
                  key={i}
                  className={cn(
                    "p-1 text-center text-xs border-l border-border font-normal",
                    day.getDay() === 0 || day.getDay() === 6
                      ? "bg-muted/30"
                      : "bg-background"
                  )}
                  style={{ width: cellWidth, minWidth: cellWidth }}
                >
                  <div className="font-medium">{day.getDate()}</div>
                  <div className="text-muted-foreground">
                    {
                      ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][
                        day.getDay()
                      ]
                    }
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr
                key={room.id}
                className="border-b border-border hover:bg-muted/20"
              >
                <td
                  className="p-2 font-medium text-sm sticky left-0 bg-background z-10"
                  style={{ width: 100, minWidth: 100 }}
                >
                  {room.number}
                </td>
                {days.map((day, i) => {
                  const reservation = getReservationForRoomAndDate(
                    room.id,
                    day
                  );
                  const isCheckIn =
                    reservation && isCheckInDate(reservation, day);

                  return (
                    <td
                      key={i}
                      className={cn(
                        "border-l border-border relative",
                        day.getDay() === 0 || day.getDay() === 6
                          ? "bg-muted/30"
                          : ""
                      )}
                      style={{
                        width: cellWidth,
                        minWidth: cellWidth,
                        height: 40,
                      }}
                    >
                      {reservation && isCheckIn && (
                        <div
                          className="absolute top-1 bottom-1 left-0 bg-accent/40 rounded text-xs px-1 truncate flex items-center border border-accent/60"
                          style={{
                            width:
                              getReservationDaysFromDate(reservation, day) *
                                cellWidth -
                              2,
                            zIndex: 5,
                          }}
                        >
                          <span className="truncate font-medium">
                            {reservation.guestName}
                          </span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Debug info */}
        {allReservations.length === 0 && (
          <div className="mt-4 p-4 bg-muted/50 rounded text-sm text-muted-foreground">
            Aucune réservation trouvée. Ajoutez des réservations pour les voir
            apparaître dans le planning.
          </div>
        )}

        {/* Légende */}
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent/40 rounded border border-accent/60"></div>
            <span>Réservé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted/30 rounded border border-border"></div>
            <span>Week-end</span>
          </div>
          {allReservations.length > 0 && (
            <div className="ml-auto">
              {allReservations.length} réservation(s) au total
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
