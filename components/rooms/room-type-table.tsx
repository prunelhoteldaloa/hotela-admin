"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
// import type { RoomType } from "@/lib/types";
import Image from "next/image";
import { RoomType } from "@/services/rooms.service";

interface RoomTypeTableProps {
  roomTypes: RoomType[];
  onEdit: (roomType: RoomType) => void;
  onDelete: (roomType: RoomType) => void;
}

export function RoomTypeTable({
  roomTypes,
  onEdit,
  onDelete,
}: RoomTypeTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Prix de base</TableHead>
            <TableHead>Capacité</TableHead>
            <TableHead>Équipements</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roomTypes.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground"
              >
                Aucun type de chambre trouvé.
              </TableCell>
            </TableRow>
          ) : (
            roomTypes.map((roomType) => (
              <TableRow key={roomType.id}>
                <TableCell>
                  {roomType.image ? (
                    <div className="relative h-12 w-16 overflow-hidden rounded">
                      <Image
                        src={roomType.image || "/placeholder.svg"}
                        alt={roomType.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-16 items-center justify-center rounded bg-muted">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{roomType.name}</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                  {roomType.description}
                </TableCell>
                <TableCell>{roomType.price.toLocaleString()} FCFA</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {roomType.capacity}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {roomType?.equipments
                      ?.slice(0, 3)
                      .map((equipment, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                        >
                          {equipment}
                        </span>
                      ))}
                    {roomType?.equipments?.length > 3 && (
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        +{roomType.equipments.length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(roomType)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(roomType)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
