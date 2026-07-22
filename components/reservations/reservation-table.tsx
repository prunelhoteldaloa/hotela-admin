"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  LogIn,
  LogOut,
  Receipt,
  Eye,
} from "lucide-react";
// import type {  } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Reservation } from "@/services/reservations.service";

interface ReservationTableProps {
  reservations: Reservation[];
  onEdit: (reservation: Reservation) => void;
  onDelete: (reservation: Reservation) => void;
  onCheckIn: (reservation: Reservation) => void;
  onCheckOut: (reservation: Reservation) => void;
  onInvoice: (reservation: Reservation) => void;
  onView: (reservation: Reservation) => void;
}

const statusConfig = {
  PENDING: {
    label: "En attente",
    color: "bg-gray-500/20 text-gray-500 border-gray-500/30",
  },
  CONFIRMED: {
    label: "Confirmée",
    color: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  },
  CHECKED_IN: {
    label: "En cours",
    color: "bg-green-500/20 text-green-500 border-green-500/30",
  },
  CHECKED_OUT: {
    label: "Terminée",
    color:
      "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30",
  },
  CANCELLED: {
    label: "Annulée",
    color: "bg-red-500/20 text-red-500 border-red-500/30",
  },
};

const paymentMethodLabels = {
  MOBILE_MONEY: "Mobile Money",
  CASH: "Espèces",
  CARD: "Carte",
  TRANSFER: "Virement",
};

export function ReservationTable({
  reservations,
  onEdit,
  onDelete,
  onCheckIn,
  onCheckOut,
  onInvoice,
  onView,
}: ReservationTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Client</TableHead>
            <TableHead>Chambre</TableHead>
            <TableHead>Arrivée</TableHead>
            <TableHead>Départ</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Paiement</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id} className="hover:bg-muted/30">
              <TableCell>
                <div>
                  <p className="font-medium">{reservation.guestName}</p>
                  <p className="text-xs text-muted-foreground">
                    {reservation.guestPhone}
                  </p>
                </div>
              </TableCell>
              <TableCell className="font-bold">
                {reservation.room?.number}
              </TableCell>
              <TableCell>{formatDate(reservation.checkIn)}</TableCell>
              <TableCell>{formatDate(reservation.checkOut)}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(statusConfig[reservation?.status]?.color)}
                >
                  {statusConfig[reservation?.status]?.label}

                  {/* {reservation?.status === ''} */}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {reservation.totalAmount.toLocaleString("fr-FR")} FCFA
                  </p>
                  {reservation.paidAmount < reservation.totalAmount && (
                    <p className="text-xs text-amber-500">
                      Reste:{" "}
                      {(
                        reservation.totalAmount - reservation.paidAmount
                      ).toLocaleString("fr-FR")}{" "}
                      FCFA
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {paymentMethodLabels[reservation?.paymentMethod]}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* {reservation.status === "confirmed" && ( */}
                    <DropdownMenuItem onClick={() => onView(reservation)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir details
                    </DropdownMenuItem>
                    {/* )} */}
                    {reservation.status === "confirmed" && (
                      <DropdownMenuItem onClick={() => onCheckIn(reservation)}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Check-in
                      </DropdownMenuItem>
                    )}
                    {reservation.status === "checked-in" && (
                      <DropdownMenuItem onClick={() => onCheckOut(reservation)}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Check-out
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onInvoice(reservation)}>
                      <Receipt className="mr-2 h-4 w-4" />
                      Facture
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(reservation)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(reservation)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Annuler
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
