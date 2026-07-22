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
import type { Room, RoomType } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface RoomFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: Room | null;
  roomTypes: RoomType[];
  onSave: (room: Partial<Room>) => void;
  isSaving?: boolean;
}

export function RoomFormDialog({
  open,
  onOpenChange,
  room,
  roomTypes,
  onSave,
  isSaving = false,
}: RoomFormDialogProps) {
  const [formData, setFormData] = useState({
    number: "",
    roomTypeId: "",
    status: "AVAILABLE" as const,
    floor: "",
  });

  useEffect(() => {
    if (room) {
      setFormData({
        number: room.number,
        roomTypeId: room.typeId,
        status: room.status,
        floor: room.floor.toString(),
      });
    } else {
      setFormData({
        number: "",
        roomTypeId: "",
        status: "AVAILABLE",
        floor: "",
      });
    }
  }, [room, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roomTypeId) {
      return;
    }

    console.log(formData);

    onSave({
      number: formData.number,
      typeId: formData.roomTypeId,
      status: formData.status,
      floor: Number.parseInt(formData.floor),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {room ? "Modifier la chambre" : "Nouvelle chambre"}
          </DialogTitle>
          <DialogDescription>
            {room
              ? "Modifiez les informations de la chambre"
              : "Ajoutez une nouvelle chambre à votre établissement"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Numéro</Label>
                <Input
                  id="number"
                  placeholder="101"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({ ...formData, number: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Étage</Label>
                <Input
                  id="floor"
                  type="number"
                  placeholder="1"
                  value={formData.floor}
                  onChange={(e) =>
                    setFormData({ ...formData, floor: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomTypeId">Type de chambre</Label>
              <Select
                value={formData.roomTypeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, roomTypeId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} - {type.price.toLocaleString()} FCFA
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: typeof formData.status) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Libre</SelectItem>
                  <SelectItem value="OCCUPIED">Occupée</SelectItem>
                  <SelectItem value="CLEANING">Ménage</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving || !formData.roomTypeId}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {room ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
