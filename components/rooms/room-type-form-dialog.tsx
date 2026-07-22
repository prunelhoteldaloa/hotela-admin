"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X, ImageIcon } from "lucide-react";
import { RoomType } from "@/lib/types";

interface RoomTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomType?: RoomType | null;
  onSave: (roomType: Partial<RoomType>) => void;
  isSaving?: boolean;
}

export function RoomTypeFormDialog({
  open,
  onOpenChange,
  roomType,
  onSave,
  isSaving = false,
}: RoomTypeFormDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    capacity: "",
    equipments: "",
  });

  useEffect(() => {
    if (roomType) {
      setFormData({
        name: roomType.name,
        description: roomType.description,
        basePrice: roomType.price.toString(),
        capacity: roomType.capacity.toString(),
        equipments: roomType?.equipments?.join(", "),
      });
      setImagePreview(roomType.image || null);
    } else {
      setFormData({
        name: "",
        description: "",
        basePrice: "",
        capacity: "",
        equipments: "",
      });
      setImagePreview(null);
    }
  }, [roomType, open]);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image valide");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (img.width < 800 || img.height < 600) {
          alert(
            `Dimensions recommandées : 800x600px minimum. Votre image : ${img.width}x${img.height}px`
          );
        }
        setImagePreview(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const equipmentsArray = formData.equipments
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    onSave({
      name: formData.name,
      description: formData.description,
      price: Number.parseInt(formData.basePrice),
      capacity: Number.parseInt(formData.capacity),
      image: imagePreview || undefined,
      equipments: equipmentsArray,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {roomType
              ? "Modifier le type de chambre"
              : "Nouveau type de chambre"}
          </DialogTitle>
          <DialogDescription>
            {roomType
              ? "Modifiez les informations du type de chambre"
              : "Ajoutez un nouveau type de chambre à votre établissement"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Image de la chambre</Label>
              <div
                className={`relative border-2 border-dashed rounded-lg transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="relative aspect-video">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center py-8 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="p-3 bg-muted rounded-full mb-3">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Glissez une image ici ou cliquez pour parcourir
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG jusqu'à 5MB (800x600px recommandé)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Nom */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom du type</Label>
              <Input
                id="name"
                placeholder="Suite Royale"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Une suite luxueuse avec vue panoramique..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            {/* Prix et Capacité */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Prix de base (FCFA)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  placeholder="50000"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité (personnes)</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="2"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Équipements */}
            <div className="space-y-2">
              <Label htmlFor="equipments">
                Équipements (séparés par des virgules)
              </Label>
              <Input
                id="equipments"
                placeholder="WiFi, Climatisation, Minibar, TV"
                value={formData.equipments}
                onChange={(e) =>
                  setFormData({ ...formData, equipments: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Ex: WiFi, Climatisation, Minibar, TV, Coffre-fort
              </p>
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
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {roomType ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
