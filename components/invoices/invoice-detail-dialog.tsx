"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Printer } from "lucide-react";
// import type { Invoice } from "@/lib/types"
import { cn } from "@/lib/utils";
import { InvoiceStatus, Invoice } from "@/services/invoices.service";

interface InvoiceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

const statusConfig: Record<InvoiceStatus, { label: string; color: string }> = {
  PENDING: {
    label: "En attente",
    color: "bg-amber-500/20 text-amber-500 border-amber-500/30",
  },
  PAID: {
    label: "Payée",
    color: "bg-green-500/20 text-green-500 border-green-500/30",
  },
  PARTIAL: {
    label: "Partielle",
    color: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  },
  OVERDUE: {
    label: "En retard",
    color: "bg-red-500/20 text-red-500 border-red-500/30",
  },
};

export function InvoiceDetailDialog({
  open,
  onOpenChange,
  invoice,
}: InvoiceDetailDialogProps) {
  if (!invoice) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Facture {invoice?.id}</DialogTitle>
            <Badge
              variant="outline"
              className={cn(statusConfig[invoice?.status]?.color)}
            >
              {statusConfig[invoice?.status]?.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-medium">{invoice?.guestName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date d'émission</p>
              <p className="font-medium">{formatDate(invoice?.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">N° Réservation</p>
              <p className="font-medium">{invoice?.reservationId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date d'échéance</p>
              <p className="font-medium">{formatDate(invoice?.dueDate)}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-3 bg-muted/50 text-sm font-medium">
              <div className="col-span-2">Description</div>
              <div className="text-right">Qté</div>
              <div className="text-right">Montant</div>
            </div>
            {invoice?.items.map((item, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 p-3 border-t">
                <div className="col-span-2">
                  <p className="font-medium">{item?.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {item?.unitPrice.toLocaleString("fr-FR")} FCFA/unité
                  </p>
                </div>
                <div className="text-right">{item?.quantity}</div>
                <div className="text-right font-medium">
                  {item?.total.toLocaleString("fr-FR")} FCFA
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total HT</span>
                <span>{invoice?.paidAmount.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">TVA (18%)</span>
                <span>{invoice?.taxAmount.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total TTC</span>
                <span>{invoice?.total.toLocaleString("fr-FR")} FCFA</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
