import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

interface Reservation {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

interface TodayActivityProps {
  reservations: Reservation[];
}

export function TodayActivity({ reservations }: TodayActivityProps) {
  const today = new Date().toISOString().split("T")[0];

  // Filtrer les check-ins (réservations qui arrivent aujourd'hui)
  const checkIns = reservations.filter((r) => {
    const checkInDate = new Date(r.checkIn).toISOString().split("T")[0];
    return (
      checkInDate === today &&
      (r.status === "CONFIRMED" || r.status === "confirmed")
    );
  });

  // Filtrer les check-outs (réservations qui partent aujourd'hui)
  const checkOuts = reservations.filter((r) => {
    const checkOutDate = new Date(r.checkOut).toISOString().split("T")[0];
    return (
      checkOutDate === today &&
      (r.status === "CHECKED_IN" || r.status === "checked-in")
    );
  });

  const formatTime = (dateString: string, isCheckOut: boolean = false) => {
    // Format par défaut : 14:00 pour check-in, 11:00 pour check-out
    const date = new Date(dateString);
    const hours = date.getHours();

    // Si l'heure est 00:00, utiliser les heures par défaut
    if (hours === 0) {
      return isCheckOut ? "11:00" : "14:00";
    }

    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Activité du jour</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Check-ins */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <ArrowDownToLine className="h-4 w-4 text-green-500" />
            Check-ins prévus ({checkIns.length})
          </h4>
          <div className="space-y-2">
            {checkIns.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg">
                Aucun check-in prévu aujourd'hui
              </div>
            ) : (
              checkIns.slice(0, 3).map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-green-500/20 text-green-600">
                        {reservation.guestName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {reservation.guestName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Chambre {reservation.roomNumber}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-green-500 border-green-500/30"
                  >
                    {formatTime(reservation.checkIn)}
                  </Badge>
                </div>
              ))
            )}
            {checkIns.length > 3 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{checkIns.length - 3} autre{checkIns.length - 3 > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Check-outs */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <ArrowUpFromLine className="h-4 w-4 text-amber-500" />
            Check-outs prévus ({checkOuts.length})
          </h4>
          <div className="space-y-2">
            {checkOuts.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg">
                Aucun check-out prévu aujourd'hui
              </div>
            ) : (
              checkOuts.slice(0, 3).map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-amber-500/20 text-amber-600">
                        {reservation.guestName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {reservation.guestName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Chambre {reservation.roomNumber}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-amber-500 border-amber-500/30"
                  >
                    {formatTime(reservation.checkOut, true)}
                  </Badge>
                </div>
              ))
            )}
            {checkOuts.length > 3 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{checkOuts.length - 3} autre
                {checkOuts.length - 3 > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
