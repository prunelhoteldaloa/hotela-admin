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
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import type { Room, RoomStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface RoomTableProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
  onView: (room: Room) => void;
}

const statusConfig: Record<RoomStatus, { label: string; color: string }> = {
  AVAILABLE: {
    label: "Libre",
    color: "bg-green-500/20 text-green-500 border-green-500/30",
  },
  OCCUPIED: {
    label: "Occupée",
    color: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  },
  CLEANING: {
    label: "Ménage",
    color: "bg-amber-500/20 text-amber-500 border-amber-500/30",
  },
  MAINTENANCE: {
    label: "Maintenance",
    color: "bg-red-500/20 text-red-500 border-red-500/30",
  },
};

const typeLabels = {
  standard: "Standard",
  deluxe: "Deluxe",
  suite: "Suite",
  penthouse: "Penthouse",
};

export function RoomTable({ rooms, onEdit, onDelete, onView }: RoomTableProps) {
  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Chambre</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Capacité</TableHead>
            <TableHead>Prix/Nuit</TableHead>
            <TableHead>Étage</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow
              key={room.id}
              className="cursor-pointer hover:bg-muted/30"
              // onClick={() => onView(room)}
            >
              <TableCell className="font-bold">{room.number}</TableCell>
              <TableCell>{room.type.name}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(statusConfig[room.status].color)}
                >
                  {statusConfig[room.status].label}
                </Badge>
              </TableCell>
              <TableCell>{room.type.capacity} pers.</TableCell>
              <TableCell>
                {room?.type?.price.toLocaleString("fr-FR")} FCFA
              </TableCell>
              <TableCell>Étage {room.floor}</TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/rooms/${room.id}`}
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                  })}
                >
                  Voir details
                </Link>
                {/* <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      asChild
                      // onClick={(e) => {
                      //   e.stopPropagation()
                      //   onView(room)
                      // }}
                    >
                      <Link href={`/dashboard/rooms/${room.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                    // onClick={(e) => {
                    //   e.stopPropagation();
                    //   onEdit(room);
                    // }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(room);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
