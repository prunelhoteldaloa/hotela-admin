"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2, Smartphone } from "lucide-react";
import { Reservation } from "@/services/reservations.service";
import { Room } from "@/services/rooms.service";

interface ReservationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation?: Reservation | null;
  rooms: Room[];
  onSave: (reservation: Partial<Reservation>) => void;
}

export function ReservationFormDialog({
  open,
  onOpenChange,
  reservation,
  rooms,
  onSave,
}: ReservationFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    roomId: "",
    checkIn: "",
    checkOut: "",
    paymentMethod: "mobile-money" as Reservation["paymentMethod"],
    paidAmount: "",
  });

  const availableRooms = rooms.filter((r) => r.status === "AVAILABLE");

  useEffect(() => {
    if (reservation) {
      setFormData({
        guestName: reservation.guestName,
        guestEmail: reservation.guestEmail,
        guestPhone: reservation.guestPhone,
        roomId: reservation.roomId,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        paymentMethod: reservation.paymentMethod,
        paidAmount: reservation.paidAmount.toString(),
      });
    } else {
      setFormData({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        roomId: "",
        checkIn: "",
        checkOut: "",
        paymentMethod: "MOBILE_MONEY",
        paidAmount: "",
      });
    }
  }, [reservation]);

  const selectedRoom = rooms.find((r) => r.id === formData.roomId);
  const nights =
    formData.checkIn && formData.checkOut
      ? Math.ceil(
          (new Date(formData.checkOut).getTime() -
            new Date(formData.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;
  const totalAmount = selectedRoom ? selectedRoom.type.price * nights : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    onSave({
      ...formData,
      roomId: selectedRoom?.id!,
      totalAmount,
      paidAmount: Number.parseInt(formData.paidAmount) || 0,
      status: reservation ? reservation.status : "CONFIRMED",
      createdAt: reservation
        ? reservation.createdAt
        : new Date().toISOString().split("T")[0],
    });

    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {reservation ? "Modifier la réservation" : "Nouvelle réservation"}
          </DialogTitle>
          <DialogDescription>
            {reservation
              ? "Modifiez les détails de la réservation"
              : "Créez une nouvelle réservation pour un client"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Guest Info */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Informations client
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guestName">Nom complet</Label>
                  <Input
                    id="guestName"
                    placeholder="Awa Koné"
                    value={formData.guestName}
                    onChange={(e) =>
                      setFormData({ ...formData, guestName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestEmail">Email</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    placeholder="client@email.com"
                    value={formData.guestEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, guestEmail: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestPhone">Téléphone</Label>
                  <Input
                    id="guestPhone"
                    type="tel"
                    placeholder="+225 07 00 00 00 00"
                    value={formData.guestPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, guestPhone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Détails du séjour
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room">Chambre</Label>
                  <Select
                    value={formData.roomId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, roomId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une chambre" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.number} - {room.type.name} (
                          {room.type.price.toLocaleString("fr-FR")} FCFA/nuit)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Date d'arrivée</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) =>
                      setFormData({ ...formData, checkIn: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOut">Date de départ</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) =>
                      setFormData({ ...formData, checkOut: e.target.value })
                    }
                    min={formData.checkIn}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Paiement
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Mode de paiement</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value: Reservation["paymentMethod"]) =>
                      setFormData({ ...formData, paymentMethod: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MOBILE-MONEY">
                        <span className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Mobile Money
                        </span>
                      </SelectItem>
                      <SelectItem value="CASH">Espèces</SelectItem>
                      <SelectItem value="CARD">Carte bancaire</SelectItem>
                      <SelectItem value="TRANSFER">Virement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paidAmount">Avance (FCFA)</Label>
                  <Input
                    id="paidAmount"
                    type="number"
                    placeholder="0"
                    value={formData.paidAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, paidAmount: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total</Label>
                  <div className="h-10 px-3 py-2 rounded-md border bg-muted/50 flex items-center font-medium">
                    {totalAmount.toLocaleString("fr-FR")} FCFA
                    {nights > 0 && (
                      <span className="text-xs text-muted-foreground ml-2">
                        ({nights} nuits)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {reservation ? "Enregistrer" : "Créer la réservation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
