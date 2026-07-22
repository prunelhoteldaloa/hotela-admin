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
import { MoreHorizontal, Eye, Download, CreditCard } from "lucide-react";
import type { Invoice } from "@/services/invoices.service";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface InvoiceTableProps {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
  onPayment: (invoice: Invoice) => void;
}

const statusConfig = {
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

export function InvoiceTable({
  invoices,
  onView,
  onDownload,
  onPayment,
}: InvoiceTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 p-8 text-center">
        <p className="text-muted-foreground">Aucune facture trouvée</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>N° Facture</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            {/* <TableHead>Échéance</TableHead> */}
            <TableHead>Montant HT</TableHead>
            <TableHead>TVA ({(invoices[0]?.taxRate || 0.18) * 100}%)</TableHead>
            <TableHead>Total TTC</TableHead>
            <TableHead>Payé</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow
              key={invoice.id}
              className="hover:bg-muted/30 cursor-pointer"
              onClick={() => onView(invoice)}
            >
              <TableCell className="font-mono font-bold">
                {invoice.invoiceNumber}
              </TableCell>
              <TableCell>{invoice.guestName}</TableCell>
              <TableCell>{formatDate(invoice.createdAt)}</TableCell>
              {/* <TableCell>{formatDate(invoice.dueDate)}</TableCell> */}
              <TableCell>
                {invoice.subtotal.toLocaleString("fr-FR")} FCFA
              </TableCell>
              <TableCell>
                {invoice.taxAmount.toLocaleString("fr-FR")} FCFA
              </TableCell>
              <TableCell className="font-bold">
                {invoice.total.toLocaleString("fr-FR")} FCFA
              </TableCell>
              <TableCell>
                {invoice.paidAmount.toLocaleString("fr-FR")} FCFA
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(statusConfig[invoice.status].color)}
                >
                  {statusConfig[invoice.status].label}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/invoices/${invoice.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(invoice);
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger PDF
                    </DropdownMenuItem>
                    {invoice.status !== "PAID" && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onPayment(invoice);
                        }}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Enregistrer paiement
                      </DropdownMenuItem>
                    )}
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
